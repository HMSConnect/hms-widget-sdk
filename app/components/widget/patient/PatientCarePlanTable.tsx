import React from 'react'

import {
  tableWithFilterReducer,
  tableWithFilterState,
} from '@app/reducers/tableWithFilter.reducer'
import { IHeaderCellProps } from '@components/base/EnhancedTableHead'
import ErrorSection from '@components/base/ErrorSection'
import { FormModalContent, useModal } from '@components/base/Modal'
import TabGroup from '@components/base/TabGroup'
import TableBase from '@components/base/TableBase'
import TableFilterPanel from '@components/base/TableFilterPanel'
import ToolbarWithFilter from '@components/base/ToolbarWithFilter'
import useInfinitScroll from '@components/hooks/useInfinitScroll'
import { noneOption, selectOptions } from '@config'
import {
  ICarePlanListFilterQuery,
  mergeWithCarePlanInitialFilterQuery,
} from '@data-managers/CarePlanDataManager'
import {
  Checkbox,
  FormControlLabel,
  makeStyles,
  Theme,
} from '@material-ui/core'
import CarePlanService from '@services/CarePlanService'
import { HMSService } from '@services/HMSServiceFactory'
import { countFilterActive, sendMessage, validQueryParams } from '@utils'
import * as _ from 'lodash'

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  tableWrapper: {
    ['& .MuiTableCell-stickyHeader']: {
      top: 60,
    },
    flex: 1,
  },
  toolbar: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
}))

const PatientCarePlanTable: React.FunctionComponent<{
  patientId: any
  isInitialize?: boolean
  resourceList?: any[]
  max?: number
  initialFilter?: ICarePlanListFilterQuery
  name?: string
}> = ({
  resourceList,
  patientId,
  max = 20,
  isInitialize,
  initialFilter: customInitialFilter = {
    category: '',
    patientId,
    periodStart_lt: undefined,
    status: '',
  },
  name = 'patientCarePlanTable',
}) => {
  const initialFilter = React.useMemo(() => {
    return mergeWithCarePlanInitialFilterQuery(customInitialFilter, {
      patientId,
    })
  }, [customInitialFilter])
  const [{ filter, submitedFilter, isGroup, tab }, dispatch] = React.useReducer(
    tableWithFilterReducer,
    tableWithFilterState,
  )

  React.useEffect(() => {
    dispatch({ type: 'INIT_FILTER', payload: initialFilter })
  }, [])

  const fetchData = async (
    newFilter: ICarePlanListFilterQuery,
    max: number,
  ) => {
    const carePlanService = HMSService.getService(
      'care_plan',
    ) as CarePlanService
    const validParams = validQueryParams(['patientId'], newFilter)
    if (!_.isEmpty(validParams)) {
      return Promise.reject(new Error(_.join(validParams, ', ')))
    }
    const newLazyLoad = {
      filter: newFilter,
      max,
    }
    const entryData = await carePlanService.list(newLazyLoad)
    if (_.get(entryData, 'error')) {
      return Promise.reject(new Error(entryData.error))
    }
    return Promise.resolve(_.get(entryData, 'data'))
  }

  const classes = useStyles()
  const fetchMoreAsync = async (lastEntry: any) => {
    const newFilter: ICarePlanListFilterQuery = {
      ...filter,
      patientId,
      periodStart_lt: _.get(lastEntry, 'periodStart'),
    }
    try {
      const entryData = await fetchData(newFilter, max)
      sendMessage({
        message: 'handleLoadMore',
        name,
        params: {
          filter: newFilter,
          max,
        },
      })
      return Promise.resolve(entryData)
    } catch (e) {
      sendMessage({
        error: e,
        message: 'handleLoadMore',
        name,
      })
      return Promise.reject(e)
    }
  }

  const myscroll = React.useRef<HTMLDivElement | null>(null)
  const {
    data,
    error,
    isLoading,
    setResult,
    setIsMore,
    setIsFetch,
    isMore,
  } = useInfinitScroll(null, fetchMoreAsync, resourceList)

  React.useEffect(() => {
    if (isInitialize) {
      setIsFetch(true)
    }
  }, [isInitialize])

  const handleGroupByType = async (isGroup: boolean) => {
    setIsMore(true)
    if (isGroup) {
      handleInitialGroup(patientId)
    } else {
      handleUnGroup(filter)
    }
  }

  const handleUnGroup = async (filter: ICarePlanListFilterQuery) => {
    const newFilter = {
      ...filter,
      date_lt: undefined,
      vaccineCode: undefined,
    }
    try {
      const newData = await fetchData(newFilter, max)
      if (newData.length < max) {
        setIsMore(false)
      }
      setResult({ data: newData, error: null })
      sendMessage({
        message: 'handleGroupByType',
        name,
        params: {
          isGroup,
          result: newData,
        },
      })
    } catch (error) {
      setResult({ data: [], error })
      sendMessage({
        message: 'handleGroupByType',
        name,
        params: {
          error,
          filter: newFilter,
          isGroup,
        },
      })
    } finally {
      dispatch({
        type: 'UN_GROUP_BY',
      })
    }
  }

  const handleInitialGroup = async (patientId: string) => {
    try {
      const carePlanService = HMSService.getService(
        'care_plan',
      ) as CarePlanService
      const menuTabList = await carePlanService.categoryList({
        filter: { patientId },
      })
      dispatch({
        payload: {
          selectedTab: menuTabList.data[0].type,
          tabList: menuTabList.data,
        },
        type: 'GROUP_BY',
      })
      handleTabChange(menuTabList.data[0].type)
      sendMessage({
        message: 'handleGroupByType',
        name,
        params: {
          isGroup,
        },
      })
    } catch (error) {
      setResult({ data: [], error })
      sendMessage({
        message: 'handleGroupByType',
        name,
        params: {
          error,
          isGroup,
        },
      })
    }
  }

  const handleTabChange = async (selectedTab: string) => {
    const newFilter = {
      ...filter,
      category: selectedTab,
      patientId,
      periodStart_lt: undefined,
    }
    dispatch({
      payload: { filter: newFilter, selectedTab },
      type: 'CHANGE_TAB',
    })
    setIsMore(true)
    try {
      const newData = await fetchData(newFilter, max)
      if (newData.length < max) {
        setIsMore(false)
      }
      setResult({ data: newData, error: null })
      sendMessage({
        message: `handleTabChange:`,
        name,
        params: {
          filter: newFilter,
          result: newData,
          tabTitle: selectedTab,
        },
      })
    } catch (error) {
      setResult({ data: [], error })
      sendMessage({
        message: `handleTabChange:`,
        name,
        params: {
          error,
          filter: newFilter,
          tabTitle: selectedTab,
        },
      })
    }
  }

  const submitSearch = async (filter: any) => {
    dispatch({ type: 'SUBMIT_SEARCH', payload: filter })
    setIsMore(true)

    const newFilter: ICarePlanListFilterQuery = {
      ...filter,
      periodStart_lt: initialFilter.periodStart_lt,
    }
    try {
      const entryData = await fetchData(newFilter, max)
      return Promise.resolve(entryData)
    } catch (e) {
      sendMessage({
        error: e,
        message: 'handleSearchSubmit',
        name,
      })
      return Promise.reject(e)
    }
  }

  const handleParameterChange = (type: string, value: any) => {
    dispatch({ type: 'FILTER_ON_CHANGE', payload: { [type]: value } })
  }

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const newData = await submitSearch(filter)
      setResult({ data: newData, error: null })
      sendMessage({
        message: 'handleSearchSubmit',
        name,
        params: filter,
      })
    } catch (error) {
      setResult({ data: [], error })
      sendMessage({
        message: 'handleSearchSubmit',
        name,
        params: filter,
      })
    } finally {
      closeModal()
    }
  }

  const handleSearchReset = async () => {
    const newFilter: ICarePlanListFilterQuery = initialFilter
    if (isGroup) {
      newFilter.category = tab.selectedTab
    }
    try {
      const newData = await submitSearch(newFilter)
      setResult({ data: newData, error: null })
      sendMessage({
        message: 'handleSearchReset',
        name,
        params: filter,
      })
    } catch (error) {
      setResult({ data: [], error })
      sendMessage({
        message: 'handleSearchReset',
        name,
        params: filter,
      })
    } finally {
      closeModal()
    }
  }

  const { showModal, renderModal, closeModal } = useModal(TableFilterPanel, {
    CustomModal: FormModalContent,
    modalTitle: 'Care Plan Filter',
    name: `${name}Modal`,
    optionCustomModal: {
      onReset: handleSearchReset,
      onSubmit: handleSearchSubmit,
    },
    params: {
      filter,
      filterOptions: [
        {
          choices: _.concat(
            [noneOption],
            selectOptions.patient.carePlanStatusOption,
          ),
          label: 'Status',
          name: 'status',
          type: 'options',
        },
      ],
      onParameterChange: handleParameterChange,
      onSearchSubmit: handleSearchSubmit,
    },
  })

  if (error) {
    return <ErrorSection error={error} />
  }
  return (
    <>
      <div className={classes.toolbar}>
        <ToolbarWithFilter
          title={'Care Plan'}
          onClickIcon={showModal}
          filterActive={countFilterActive(submitedFilter, initialFilter, [
            'periodStart_lt',
            'patientId',
            'category',
          ])}
          option={{
            additionButton: (
              <FormControlLabel
                value='start'
                control={
                  <Checkbox
                    onChange={(event, isGroup) => {
                      handleGroupByType(isGroup)
                    }}
                    data-testid='check-by-type-input'
                    value={isGroup}
                    inputProps={{
                      'aria-label': 'primary checkbox',
                    }}
                  />
                }
                label='Group By Category'
                labelPlacement='start'
              />
            ),
          }}
        >
          {renderModal}
        </ToolbarWithFilter>
        {isGroup && (
          <TabGroup tabList={tab.tabList} onTabChange={handleTabChange} />
        )}
      </div>
      <div
        ref={myscroll}
        className={classes.tableWrapper}
        data-testid='scroll-container'
      >
        <TableBase
          id='carePlan'
          entryList={data}
          isLoading={isLoading}
          isMore={isMore}
          data-testid='table-base'
          size='small'
          tableCells={[
            {
              bodyCell: {
                align: 'left',
                id: 'activity',
                render: (carePlan: any) => {
                  return (
                    <ul>
                      {_.map(carePlan.activity, (activity: any, index) => (
                        <li key={`list${index}`}>
                          {_.get(activity, 'detail.code.text') || 'Unknow'} (
                          {_.get(activity, 'detail.status') || 'Unknkow'})
                        </li>
                      ))}
                    </ul>
                  )
                },
              },
              headCell: {
                align: 'left',
                disablePadding: false,
                disableSort: true,
                id: 'activity',
                label: 'Activity',
              },
            },
            {
              bodyCell: {
                align: 'left',
                id: 'category',
              },
              headCell: {
                align: 'left',
                disablePadding: false,
                disableSort: true,
                id: 'category',
                label: 'Category',
                styles: {
                  width: '15em',
                },
              },
            },
            {
              bodyCell: {
                align: 'center',
                id: 'status',
              },
              headCell: {
                align: 'center',
                disablePadding: false,
                disableSort: true,
                id: 'status',
                label: 'Status',
                styles: {
                  width: '5em',
                },
              },
            },
            {
              bodyCell: {
                align: 'center',
                id: 'periodStartText',
              },
              headCell: {
                align: 'center',
                disablePadding: false,
                disableSort: true,
                id: 'periodStartText',
                label: 'Period Start',
                styles: {
                  width: '15em',
                },
              },
            },
          ]}
        />
      </div>
    </>
  )
}

export default PatientCarePlanTable

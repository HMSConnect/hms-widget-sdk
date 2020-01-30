import React from 'react'

import { IHeaderCellProps } from '@components/base/EnhancedTableHead'
import { FormModalContent, useModal } from '@components/base/Modal'
import TabGroup, { ITabList } from '@components/base/TabGroup'
import TableBase from '@components/base/TableBase'
import TableFilterPanel from '@components/base/TableFilterPanel'
import ToolbarWithFilter from '@components/base/ToolbarWithFilter'
import useInfinitScroll from '@components/hooks/useInfinitScroll'
import {
  IObservationListFilterQuery,
  mergeWithObservationInitialFilterQuery,
} from '@data-managers/ObservationDataManager'
import {
  Checkbox,
  FormControlLabel,
  makeStyles,
  Theme,
} from '@material-ui/core'
import { HMSService } from '@services/HMSServiceFactory'
import ObservationService from '@services/ObservationService'
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

export interface IBodyCellProp {
  align: 'right' | 'left' | 'center'
  id: string
  styles?: any
}

export interface ITableCellProp {
  headCell: IHeaderCellProps
  bodyCell: IBodyCellProp
}

const PatientObservationTable: React.FunctionComponent<{
  patientId: any
  isInitialize?: boolean
  resourceList?: any[]
  max?: number
  initialFilter?: IObservationListFilterQuery
  name?: string
}> = ({
  resourceList,
  patientId,
  max = 20,
  isInitialize,
  initialFilter: customInitialFilter = {},
  name = 'patientObservationTable',
}) => {
  const initialFilter = React.useMemo(() => {
    return mergeWithObservationInitialFilterQuery(customInitialFilter, {
      patientId,
    })
  }, [customInitialFilter])
  const [filter, setFilter] = React.useState<IObservationListFilterQuery>(
    initialFilter,
  )
  const [submitedFilter, setSubmitedFilter] = React.useState<
    IObservationListFilterQuery
  >(initialFilter)

  const fetchMoreAsync = async (lastEntry: any) => {
    const observationService = HMSService.getService(
      'observation',
    ) as ObservationService
    const newFilter: IObservationListFilterQuery = {
      ...filter,
      issued_lt: _.get(lastEntry, 'issuedDate'),
      patientId,
    }
    // setFilter(newFilter)
    const validParams = validQueryParams(
      { patientId: true },
      { filter: newFilter },
    )
    if (!_.isEmpty(validParams)) {
      return Promise.reject(new Error(_.join(validParams, ', ')))
    }
    const newLazyLoad = {
      filter: newFilter,
      max,
    }
    const entryData = await observationService.list(newLazyLoad)
    if (_.get(entryData, 'error')) {
      sendMessage({
        error: _.get(entryData, 'error'),
        message: 'handleLoadMore',
        name,
      })
      return Promise.reject(new Error(entryData.error))
    }

    sendMessage({
      message: 'handleLoadMore',
      name,
      params: newLazyLoad,
    })

    return Promise.resolve(_.get(entryData, 'data'))
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

  const [isGroup, setIsGroup] = React.useState<boolean | undefined>(false)
  const [tabList, setTabList] = React.useState<ITabList[]>([])

  const handleGroupByCategory = async (isGroup: boolean) => {
    const observationService = HMSService.getService(
      'observation',
    ) as ObservationService
    if (isGroup) {
      const menuTabList = await observationService.categoryList({
        filter: { patientId },
      })
      setTabList(menuTabList.data)
      handleTabChange(menuTabList.data[0].category)
      sendMessage({
        message: 'handleGroupByType',
        name,
        params: {
          isGroup,
        },
      })
    } else {
      const newFilter = {
        ...filter,
        categoryCode: undefined,
        issued_lt: undefined,
      }
      const newResult = await observationService.list({
        filter: newFilter,
        max,
      })
      setResult(newResult)
      sendMessage({
        message: 'handleGroupByType',
        name,
        params: {
          isGroup,
          result: newResult,
        },
      })
    }
    setIsMore(true)
    setIsGroup(isGroup)
  }

  const handleTabChange = async (selectedTab: string) => {
    const newFilter = {
      ...filter,
      categoryCode: selectedTab,
      issued_lt: undefined,
      patientId,
    }
    setFilter(newFilter)
    setSubmitedFilter(newFilter)
    const observationService = HMSService.getService(
      'observation',
    ) as ObservationService
    const newResult = await observationService.list({ filter: newFilter, max })
    setResult(newResult)
    setIsMore(true)
    sendMessage({
      message: `handleTabChange:`,
      params: {
        filter: newFilter,
        result: newResult,
        tabTitle: selectedTab,
      },
    })
  }
  const fetchData = async (filter: any) => {
    setFilter(filter)
    setIsMore(true)
    const observationService = HMSService.getService(
      'observation',
    ) as ObservationService
    const newLazyLoad = {
      filter: {
        ...filter,
        issued_lt: initialFilter.issued_lt,
      },
      max,
    }
    const entryData = await observationService.list(newLazyLoad)
    if (_.get(entryData, 'error')) {
      sendMessage({
        error: _.get(entryData, 'error'),
        message: 'handleSearchSubmit',
        name,
      })
      return Promise.reject(new Error(entryData.error))
    }

    return Promise.resolve(entryData)
  }

  const handleParameterChange = (type: string, value: any) => {
    setFilter((prevFilter: any) => ({
      ...prevFilter,
      [type]: value,
    }))
  }

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitedFilter(filter)
    const newData = await fetchData(filter)
    setResult(newData)
    sendMessage({
      message: 'handleSearchSubmit',
      name,
      params: filter,
    })
    closeModal()
  }

  const handleSearchReset = async () => {
    setSubmitedFilter(initialFilter)
    const newData = await fetchData(initialFilter)
    setResult(newData)
    sendMessage({
      message: 'handleSearchReset',
      name,
      params: filter,
    })
    closeModal()
  }

  const { showModal, renderModal, closeModal } = useModal(TableFilterPanel, {
    CustomModal: FormModalContent,
    modalTitle: 'Observation Filter',
    name: `${name}Modal`,
    optionCustomModal: {
      onReset: handleSearchReset,
      onSubmit: handleSearchSubmit,
    },
    params: {
      filter,
      filterOptions: [],
      onParameterChange: handleParameterChange,
      onSearchSubmit: handleSearchSubmit,
    },
  })

  const classes = useStyles()
  if (error) {
    return <>Error: {error}</>
  }

  return (
    <>
      <div className={classes.toolbar}>
        <ToolbarWithFilter
          title={'Observation'}
          onClickIcon={showModal}
          filterActive={countFilterActive(submitedFilter, initialFilter, [
            'issued_lt',
            'patientId',
            'categoryCode',
          ])}
          option={{
            additionButton: (
              <FormControlLabel
                value='start'
                control={
                  <Checkbox
                    onChange={(event, isGroup) => {
                      handleGroupByCategory(isGroup)
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
          <TabGroup tabList={tabList} onTabChange={handleTabChange} />
        )}
      </div>
      <div
        ref={myscroll}
        className={classes.tableWrapper}
        data-testid='scroll-container'
      >
        <TableBase
          id='immunization'
          entryList={data}
          isLoading={isLoading}
          isMore={isMore}
          data-testid='table-base'
          tableCells={[
            {
              bodyCell: {
                align: 'left',
                id: 'categoryText',
              },
              headCell: {
                align: 'left',
                disablePadding: false,
                disableSort: true,
                id: 'categoryText',
                label: 'Category',
                styles: {
                  width: '15em',
                },
              },
            },
            {
              bodyCell: {
                align: 'left',
                id: 'codeText',
              },
              headCell: {
                align: 'left',
                disablePadding: false,
                disableSort: true,
                id: 'codeText',
                label: 'Name',
              },
            },
            {
              bodyCell: {
                align: 'center',
                id: 'value',
              },
              headCell: {
                align: 'center',
                disablePadding: false,
                disableSort: true,
                id: 'value',
                label: 'Value',
                styles: {
                  width: '10em',
                },
              },
            },
            {
              bodyCell: {
                align: 'center',
                id: 'issued',
              },
              headCell: {
                align: 'center',
                disablePadding: false,
                disableSort: true,
                id: 'issued',
                label: 'Date',
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

export default PatientObservationTable

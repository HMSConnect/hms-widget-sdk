import React from 'react'

import { IHeaderCellProps } from '@components/base/EnhancedTableHead'
import { FormModalContent, useModal } from '@components/base/Modal'
import TableBase from '@components/base/TableBase'
import TableFilterPanel from '@components/base/TableFilterPanel'
import ToolbarWithFilter from '@components/base/ToolbarWithFilter'
import useInfinitScroll from '@components/hooks/useInfinitScroll'
import { noneOption, selectOptions } from '@config'
import {
  IConditionListFilterQuery,
  mergeWithConditionInitialFilterQuery,
} from '@data-managers/ConditionDataManager'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import ConditionService from '@services/ConditionService'
import { HMSService } from '@services/HMSServiceFactory'
import { countFilterActive, sendMessage } from '@utils'
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

const PatientConditionTable: React.FunctionComponent<{
  patientId: any
  isInitialize?: boolean
  resourceList?: any[]
  max?: number
  initialFilter?: IConditionListFilterQuery
}> = ({
  resourceList,
  patientId,
  max = 20,
  isInitialize,
  initialFilter: customInitialFilter = {},
}) => {
  const initialFilter = React.useMemo(() => {
    return mergeWithConditionInitialFilterQuery(customInitialFilter, {
      patientId,
    })
  }, [customInitialFilter])
  // console.log('initialFilter :', initialFilter);
  const [filter, setFilter] = React.useState<IConditionListFilterQuery>(
    initialFilter,
  )
  const [submitedFilter, setSubmitedFilter] = React.useState<
    IConditionListFilterQuery
  >(initialFilter)

  const fetchMoreAsync = async (lastEntry: any) => {
    const conditionService = HMSService.getService(
      'condition',
    ) as ConditionService
    const newFilter: IConditionListFilterQuery = {
      ...filter,
      onsetDateTime_lt: _.get(lastEntry, 'onsetDateTime'),
      patientId,
    }
    // setFilter(newFilter)
    const newLazyLoad = {
      filter: newFilter,
      max,
    }
    const entryData = await conditionService.list(newLazyLoad)
    if (_.get(entryData, 'error')) {
      sendMessage({
        error: _.get(entryData, 'error'),
      })
      return Promise.reject(new Error(entryData.error))
    }

    sendMessage({
      message: 'handleLoadMore',
      params: newLazyLoad,
    })

    return Promise.resolve(_.get(entryData, 'data'))
  }

  const myscroll = React.useRef<HTMLDivElement | null>(null)

  const {
    data,
    error,
    isLoading,
    setIsFetch,
    setIsMore,
    setResult,
    isMore,
  } = useInfinitScroll(null, fetchMoreAsync, resourceList)

  React.useEffect(() => {
    if (isInitialize) {
      setIsFetch(true)
    }
  }, [isInitialize])

  const classes = useStyles()

  const fetchData = async (filter: any) => {
    setFilter(filter)
    setIsMore(true)
    const conditionService = HMSService.getService(
      'condition',
    ) as ConditionService
    const newLazyLoad = {
      filter: {
        ...filter,
        onsetDateTime_lt:
          filter.onsetDateTime_lt || initialFilter.onsetDateTime_lt,
      },
      max,
    }
    const entryData = await conditionService.list(newLazyLoad)
    if (_.get(entryData, 'error')) {
      sendMessage({
        error: _.get(entryData, 'error'),
      })
      return Promise.reject(new Error(entryData.error))
    }
    setResult(entryData)
    closeModal()
  }

  const handleParameterChange = (type: string, value: any) => {
    setFilter((prevFilter: any) => ({
      ...prevFilter,
      [type]: value,
    }))
  }

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    fetchData(filter)
    setSubmitedFilter(filter)
    sendMessage({
      message: 'handleSearchSubmit',
      params: { filter, max },
    })
  }

  const handleSearchReset = () => {
    fetchData(initialFilter)
    setSubmitedFilter(initialFilter)
    sendMessage({
      message: 'handleSearchReset',
      params: { filter: initialFilter, max },
    })
  }

  const { showModal, renderModal, closeModal } = useModal(TableFilterPanel, {
    CustomModal: FormModalContent,
    modalTitle: 'Condition Filter',
    optionCustomModal: {
      onReset: handleSearchReset,
      onSubmit: handleSearchSubmit,
    },
    params: {
      filter,
      filterOptions: [
        {
          label: 'Name',
          name: 'codeText',
          type: 'text',
        },
        {
          choices: _.concat(
            [noneOption],
            selectOptions.patient.conditionClinicalStatusOption,
          ),
          label: 'Clinical Status',
          name: 'clinicalStatus',
          type: 'options',
        },
        {
          choices: _.concat(
            [noneOption],
            selectOptions.patient.conditionVerificationStatusOption,
          ),
          label: 'Verification Status',
          name: 'verificationStatus',
          type: 'options',
        },
      ],
      onParameterChange: handleParameterChange,
      onSearchSubmit: handleSearchSubmit,
    },
  })

  if (error) {
    return <>Error: {error}</>
  }

  return (
    <>
      <div className={classes.toolbar}>
        <ToolbarWithFilter
          title={'Condition'}
          onClickIcon={showModal}
          filterActive={countFilterActive(submitedFilter, initialFilter, [
            'onsetDateTime_lt',
            'patientId',
          ])}
        >
          {renderModal}
        </ToolbarWithFilter>
      </div>

      <div
        ref={myscroll}
        className={classes.tableWrapper}
        data-testid='scroll-container'
      >
        <TableBase
          id='condition'
          entryList={data}
          isLoading={isLoading}
          isMore={isMore}
          data-testid='table-base'
          tableCells={[
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
                label: 'Condition',
              },
            },
            {
              bodyCell: {
                align: 'center',
                id: 'clinicalStatus',
              },
              headCell: {
                align: 'center',
                disablePadding: false,
                disableSort: true,
                id: 'clinicalStatus',
                label: 'ClinicalStatus',
                styles: {
                  width: '5em',
                },
              },
            },
            {
              bodyCell: {
                align: 'center',
                id: 'verificationStatus',
              },
              headCell: {
                align: 'center',
                disablePadding: false,
                disableSort: true,
                id: 'verificationStatus',
                label: 'VerificationStatus',
                styles: {
                  width: '5em',
                },
              },
            },
            {
              bodyCell: {
                align: 'center',
                id: 'onset',
              },
              headCell: {
                align: 'center',
                disablePadding: true,
                disableSort: true,
                id: 'onset',
                label: 'Onset Date',
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

export default PatientConditionTable

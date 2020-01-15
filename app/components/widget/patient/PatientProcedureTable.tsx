import React from 'react'

import { IHeaderCellProps } from '@components/base/EnhancedTableHead'
import { FormModalContent, useModal } from '@components/base/Modal'
import TableBase from '@components/base/TableBase'
import TableFilterPanel from '@components/base/TableFilterPanel'
import ToolbarWithFilter from '@components/base/ToolbarWithFilter'
import useInfinitScroll from '@components/hooks/useInfinitScroll'
import { IProcedureListFilterQuery } from '@data-managers/ProcedureDataManager'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { HMSService } from '@services/HMSServiceFactory'
import ProcedureService from '@services/ProcedureService'
import { sendMessage } from '@utils'
import * as _ from 'lodash'

const useStyles = makeStyles((theme: Theme) => ({
  tableWrapper: {
    maxHeight: '55vh',
    overflow: 'auto',
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

const PatientProcedureTable: React.FunctionComponent<{
  patientId: any
  isInitialize?: boolean
  resourceList?: any[]
  max?: number
  initialFilter?: IProcedureListFilterQuery
}> = ({
  resourceList,
  patientId,
  isInitialize,
  max,
  initialFilter = {
    code: '',
    patientId,
    periodStart_lt: undefined,
  },
}) => {
  const [filter, setFilter] = React.useState<IProcedureListFilterQuery>(
    initialFilter,
  )
  const [submitedFilter, setSubmitedFilter] = React.useState<
    IProcedureListFilterQuery
  >(initialFilter)
  const fetchMoreAsync = async (lastEntry: any) => {
    const procedureService = HMSService.getService(
      'procedure',
    ) as ProcedureService

    const newFilter: IProcedureListFilterQuery = {
      ...filter,
      patientId,
      periodStart_lt: _.get(lastEntry, 'performedPeriodStart'),
    }
    setFilter(newFilter)
    const newLazyLoad = {
      filter: newFilter,
      max: max || 10,
    }
    const entryData = await procedureService.list(newLazyLoad)
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
    setResult,
    setIsMore,
  } = useInfinitScroll(myscroll.current, fetchMoreAsync, resourceList)
  React.useEffect(() => {
    if (isInitialize) {
      setIsFetch(true)
    }
  }, [isInitialize])

  const handleProcedureSelect = (
    event: React.MouseEvent,
    selectedEncounter: any,
  ) => {
    // TODO handle select procedure
  }

  const fetchData = async (filter: any) => {
    setFilter(filter)
    setIsMore(true)
    const procedureService = HMSService.getService(
      'procedure',
    ) as ProcedureService
    const newLazyLoad = {
      filter,
      max: max || 10,
    }
    const entryData = await procedureService.list(newLazyLoad)
    if (_.get(entryData, 'error')) {
      sendMessage({
        error: _.get(entryData, 'error'),
      })
      return Promise.reject(new Error(entryData.error))
    }

    sendMessage({
      message: 'handleLoadMore',
      params: filter,
    })
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
  }

  const handleSearchReset = () => {
    fetchData(initialFilter)
    setSubmitedFilter(initialFilter)
  }

  const { showModal, renderModal, closeModal } = useModal(TableFilterPanel, {
    CustomModal: FormModalContent,
    modalTitle: 'Procedure Filter',
    optionCustomModal: {
      onReset: handleSearchReset,
      onSubmit: handleSearchSubmit,
    },
    params: {
      filter,
      filterOptions: [{ type: 'text', name: 'code', label: 'Code' }],
      onParameterChange: handleParameterChange,
      onSearchSubmit: handleSearchSubmit,
    },
  })

  const countFilterActive = (
    filter: any,
    initialFilter: any,
    excludeFilter?: any[],
  ) => {
    let filterWithoutExcludeFilter = initialFilter
    if (_.isEmpty(excludeFilter)) {
      filterWithoutExcludeFilter = _.omit(
        filterWithoutExcludeFilter,
        excludeFilter,
      )
    }

    let count = 0
    _.forEach(filter, (value, key) => {
      if (value !== filterWithoutExcludeFilter[key]) {
        count++
      }
    })

    return count
  }

  const classes = useStyles()
  if (error) {
    return <>Error: {error}</>
  }

  return (
    <>
      <ToolbarWithFilter
        title={'Procedure'}
        onClickIcon={showModal}
        filterActive={countFilterActive(submitedFilter, initialFilter, [
          'patientId',
          'periodStart_lt',
        ])}
      >
        {renderModal}
      </ToolbarWithFilter>
      <div
        ref={myscroll}
        className={classes.tableWrapper}
        data-testid='scroll-container'
      >
        <TableBase
          id='procedure'
          entryList={data}
          isLoading={isLoading}
          data-testid='table-base'
          tableCells={[
            {
              bodyCell: {
                align: 'left',
                id: 'sctCode',
              },
              headCell: {
                align: 'center',
                disablePadding: true,
                disableSort: true,
                id: 'sctCode',
                label: 'Sct Code',
                styles: {
                  width: '5em',
                },
              },
            },
            {
              bodyCell: {
                align: 'left',
                id: 'display',
              },
              headCell: {
                align: 'left',
                disablePadding: false,
                disableSort: true,
                id: 'display',
                label: 'Detail',
              },
            },
            {
              bodyCell: {
                align: 'center',
                id: 'performedPeriodStartText',
              },
              headCell: {
                align: 'center',
                disablePadding: true,
                disableSort: true,
                id: 'performedPeriodStartText',
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

export default PatientProcedureTable

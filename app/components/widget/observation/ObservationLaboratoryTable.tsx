import React from 'react'

import { IHeaderCellProps } from '@components/base/EnhancedTableHead'
import ErrorSection from '@components/base/ErrorSection'
import { FormModalContent, useModal } from '@components/base/Modal'
import TableBase from '@components/base/TableBase'
import TableFilterPanel from '@components/base/TableFilterPanel'
import ToolbarWithFilter from '@components/base/ToolbarWithFilter'
import useInfinitScroll from '@components/hooks/useInfinitScroll'
import {
  IObservationListFilterQuery,
  mergeWithObservationInitialFilterQuery,
} from '@data-managers/ObservationDataManager'
import { Icon, makeStyles, Theme, Typography } from '@material-ui/core'
import { HMSService } from '@services/HMSServiceFactory'
import ObservationService from '@services/ObservationService'
import { countFilterActive, sendMessage, validQueryParams } from '@utils'
import * as _ from 'lodash'

const useStyles = makeStyles((theme: Theme) => ({
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

const ObservationLaboratoryTable: React.FunctionComponent<{
  patientId: any
  encounterId?: any
  isInitialize?: boolean
  resourceList?: any[]
  max?: number
  initialFilter?: IObservationListFilterQuery
  name?: string
}> = ({
  resourceList,
  patientId,
  encounterId,
  isInitialize,
  max = 20,
  initialFilter: customInitialFilter = {
    categoryCode: 'laboratory',
    encounterId,
    issued_lt: undefined,
    patientId,
  },
  name = 'observationLaboratoryTable',
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
      issued_lt: _.get(lastEntry, 'performedPeriodStart'),
      patientId,
    }
    // setFilter(newFilter)
    const validParams = validQueryParams(
      ['patientId'],
      newFilter,
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
    setIsFetch,
    setResult,
    setIsMore,
    isMore,
  } = useInfinitScroll(myscroll.current, fetchMoreAsync, resourceList, { max })
  React.useEffect(() => {
    if (isInitialize) {
      setIsFetch(true)
    }
  }, [isInitialize])

  const fetchData = async (filter: any) => {
    setFilter(filter)
    setIsMore(true)
    const observationService = HMSService.getService(
      'observation',
    ) as ObservationService
    const newLazyLoad = {
      filter: {
        ...filter,
        issued_lt: filter.issued_lt || initialFilter.issued_lt,
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

    sendMessage({
      message: 'handleSearchSubmit',
      name,
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
    name: `${name}Modal`,
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

  const classes = useStyles()
  if (error) {
    return <ErrorSection error={error} />
  }

  return (
    <>
      <div className={classes.toolbar}>
        <ToolbarWithFilter
          title={'Laboratory Results'}
          onClickIcon={showModal}
          filterActive={countFilterActive(submitedFilter, initialFilter, [
            'patientId',
            'periodStart_lt',
          ])}
          option={{
            isHideIcon: true,
            style: {
              backgroundColor: '#4db6ac',
              color: '#e1f5fe',
            },
          }}
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
          id='laboratory results'
          entryList={data}
          isLoading={isLoading}
          isMore={isMore}
          data-testid='table-base'
          size='small'
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
                label: 'Name',
              },
            },
            {
              bodyCell: {
                align: 'left',
                id: 'value',
                render: (laboratory: any) => {
                  if (laboratory.referenceRange) {
                    const nomalRange = _.find(laboratory.referenceRange, {
                      type: 'normal',
                    })
                    if (!nomalRange) {
                      return <>{laboratory.value} </>
                    }
                    if (nomalRange.low && laboratory.value < nomalRange.low) {
                      return (
                        <Typography
                          variant='body1'
                          style={{ color: '#f44336' }}
                        >
                          {laboratory.value}{' '}
                          <Icon
                            className='fas fa-chevron-circle-down'
                            style={{ zoom: '0.7' }}
                          />
                        </Typography>
                      )
                    } else if (
                      nomalRange.high &&
                      laboratory.value > nomalRange.high
                    ) {
                      return (
                        <Typography
                          variant='body1'
                          style={{ color: '#f44336' }}
                        >
                          {laboratory.value}{' '}
                          <Icon
                            className='fas fa-chevron-circle-up'
                            style={{ zoom: '0.7' }}
                          />
                        </Typography>
                      )
                    } else {
                      return (
                        <Typography
                          variant='body1'
                          style={{ color: '#66bb6a' }}
                        >
                          {laboratory.value}{' '}
                        </Typography>
                      )
                    }
                  }
                  return (
                    <>
                      {laboratory.value}{' '}
                      {/* <Icon
                        className='fas fa-chevron-circle-up'
                        style={{ zoom: '0.7' }}
                      /> */}
                    </>
                  )
                },
              },
              headCell: {
                align: 'left',
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
                align: 'left',
                id: 'unit',
              },
              headCell: {
                align: 'left',
                disablePadding: false,
                disableSort: true,
                id: 'unit',
                label: 'Unit',
                styles: {
                  width: '5em',
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
                disablePadding: true,
                disableSort: true,
                id: 'issued',
                label: 'Time',
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

export default ObservationLaboratoryTable

import * as React from 'react'

import ToolbarWithFilter from '@components/base/ToolbarWithFilter'
import useInfinitScroll from '@components/hooks/useInfinitScroll'
import {
  IMedicationRequestFilterQuery,
  mergeWithMedicationRequestInitialFilterQuery,
} from '@data-managers/MedicationRequestDataManager'
import {
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  Typography,
} from '@material-ui/core'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import { makeStyles } from '@material-ui/styles'
import { HMSService } from '@services/HMSServiceFactory'
import MedicationRequestService from '@services/MedicationRequestService'
import { sendMessage } from '@utils'
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

const PatientMedicationList: React.FunctionComponent<{
  patientId: any
  isInitialize?: boolean
  resourceList?: any[]
  max?: number
  initialFilter?: IMedicationRequestFilterQuery
}> = ({
  resourceList,
  patientId,
  max = 10,
  isInitialize,
  initialFilter: customInitialFilter = {
    authoredOn_lt: undefined,
    medicationCodeableConcept: '',
    patientId,
    status: '',
  },
}) => {
  const initialFilter = React.useMemo(() => {
    return mergeWithMedicationRequestInitialFilterQuery(customInitialFilter, {
      patientId,
    })
  }, [customInitialFilter])
  const [filter, setFilter] = React.useState<IMedicationRequestFilterQuery>(
    initialFilter,
  )

  const fetchMoreAsync = async (lastEntry: any) => {
    const medicationRequestService = HMSService.getService(
      'medication_request',
    ) as MedicationRequestService
    const newFilter: IMedicationRequestFilterQuery = {
      ...filter,
      authoredOn_lt: _.get(lastEntry, 'authoredOn'),
      patientId,
    }
    // setFilter(newFilter)
    const newLazyLoad = {
      filter: newFilter,
      max,
    }
    const entryData = await medicationRequestService.list(newLazyLoad)
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
  const { data, error, isLoading, setIsFetch } = useInfinitScroll(
    myscroll.current,
    fetchMoreAsync,
    resourceList,
  )

  React.useEffect(() => {
    if (isInitialize) {
      setIsFetch(true)
    }
  }, [isInitialize])

  if (error) {
    return <>Error: {error}</>
  }
  if (isLoading) {
    return (
      <div
        style={{
          alignContent: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </div>
    )
  }
  return <PatientMedicationRequestView data={data} />
}

export default PatientMedicationList

export const PatientMedicationRequestView: React.FunctionComponent<{
  data: any
}> = ({ data }) => {
  const classes = useStyles()
  return (
    <>
      <div className={classes.toolbar}>
        <ToolbarWithFilter
          title={'Medcation Request'}
          option={{
            isHideIcon: true,
          }}
        ></ToolbarWithFilter>
      </div>

      <List component='nav' aria-labelledby='nested-list-subheader'>
        {_.isEmpty(data) ? (
          <div style={{ padding: '1em', textAlign: 'center' }}>
            <Typography variant='body1'>No Medcation found</Typography>
          </div>
        ) : (
          _.map(data, (medication: any, index: number) => (
            <ListItem key={`medication${index}`}>
              <ListItemIcon>
                <FiberManualRecordIcon />
              </ListItemIcon>
              <ListItemText
                primary={`${_.get(medication, 'medicationCodeableConcept')}`}
              />
            </ListItem>
          ))
        )}
      </List>
    </>
  )
}

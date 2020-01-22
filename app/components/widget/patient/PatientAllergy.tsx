import * as React from 'react'

import ToolbarWithFilter from '@components/base/ToolbarWithFilter'
import useInfinitScroll from '@components/hooks/useInfinitScroll'
import {
  IAllergyIntoleranceListFilterQuery,
  mergeWithAllergyIntoleranceInitialFilterQuery,
} from '@data-managers/AllergyIntoleranceDataManager'
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
import AllergyIntoleranceService from '@services/AllergyIntoleranceService'
import { HMSService } from '@services/HMSServiceFactory'
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

const PatientAllergyList: React.FunctionComponent<{
  patientId: any
  isInitialize?: boolean
  resourceList?: any[]
  max?: number
  initialFilter?: IAllergyIntoleranceListFilterQuery
}> = ({
  resourceList,
  patientId,
  max = 20,
  isInitialize,
  initialFilter: customInitialFilter = {
    assertedDate_lt: undefined,
    category: undefined,
    codeText: undefined,
    criticality: '',
    patientId,
    type: '',
  },
}) => {
  const initialFilter = React.useMemo(() => {
    return mergeWithAllergyIntoleranceInitialFilterQuery(customInitialFilter, {
      patientId,
    })
  }, [customInitialFilter])
  const [filter, setFilter] = React.useState<
    IAllergyIntoleranceListFilterQuery
  >(initialFilter)

  const fetchMoreAsync = async (lastEntry: any) => {
    const allergyIntoleranceService = HMSService.getService(
      'allergy_intolerance',
    ) as AllergyIntoleranceService
    const newFilter: IAllergyIntoleranceListFilterQuery = {
      ...filter,
      assertedDate_lt: _.get(lastEntry, 'assertedDate'),
      patientId,
    }
    // setFilter(newFilter)
    const newLazyLoad = {
      filter: newFilter,
      max,
    }
    const entryData = await allergyIntoleranceService.list(newLazyLoad)
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
  return <PatientAllergyView data={data} />
}

export default PatientAllergyList

export const PatientAllergyView: React.FunctionComponent<{
  data: any
}> = ({ data }) => {
  const classes = useStyles()
  const renderCriticalIcon = (allergy: any) => {
    switch (allergy.criticality) {
      case 'low':
        return (
          <ListItemIcon style={{ color: '#ff9800' }}>
            <FiberManualRecordIcon />
          </ListItemIcon>
        )
      case 'high':
        return (
          <ListItemIcon style={{ color: '#e57373' }}>
            <FiberManualRecordIcon />
          </ListItemIcon>
        )
      case 'unable-to-assess':
        return (
          <ListItemIcon style={{ color: 'grey' }}>
            <FiberManualRecordIcon />
          </ListItemIcon>
        )
      default:
        return (
          <ListItemIcon>
            <FiberManualRecordIcon />
          </ListItemIcon>
        )
    }
  }
  return (
    <>
      <div className={classes.toolbar}>
        <ToolbarWithFilter
          title={'Allergies'}
          option={{
            isHideIcon: true,
          }}
        ></ToolbarWithFilter>
      </div>
      <List component='nav' aria-labelledby='nested-list-subheader'>
        {_.isEmpty(data) ? (
          <div style={{ padding: '1em', textAlign: 'center' }}>
            <Typography variant='body1'>No allergy found</Typography>
          </div>
        ) : (
          _.map(data, (allergy: any, index: number) => (
            <ListItem key={`allergy${index}`}>
              {renderCriticalIcon(allergy)}
              <ListItemText primary={`${_.get(allergy, 'codeText')}`} />
            </ListItem>
          ))
        )}
      </List>
    </>
  )
}

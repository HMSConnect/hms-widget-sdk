import React from 'react'

import CardLayout from '@components/base/CardLayout'
import ErrorSection from '@components/base/ErrorSection'
import LoadingSection from '@components/base/LoadingSection'
import useObservationList from '@components/hooks/useObservationList'
import { OBSERVATION_CODE } from '@config/observation'
import { IObservationListFilterQuery } from '@data-managers/ObservationDataManager'
import {
  Grid,
  Icon,
  lighten,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import clsx from 'clsx'
import get from 'lodash/get'
import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme: Theme) => ({
  bodyCard: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  clickable: {
    cursor: 'pointer',
  },
  contentText: {
    fontWeight: 'normal',
  },
  footerContainer: { height: 36, color: 'grey' },
  hover: {
    '&:hover': {
      backgroundColor: '#ddd4',
    },
    textDecoration: 'none',
  },
  infoIcon: {
    color: '#1976d2',
    zoom: 0.7,
  },
  selectedCard: {
    backgroundColor: '#ddd4',
    border: '2px solid #00b0ff',
    borderRadius: 4,
  },
  unitText: {
    fontWeight: 'normal',
  },
}))

export const ObservationTabacoSmokingStatusCardWithConnector: React.FunctionComponent = () => {
  const state = useSelector((state: any) => state.patientSummaryCards)
  return (
    <ObservationTabacoSmokingStatusCard
      key={`ObservationTabacoSmokingStatusCard${get(state, 'encounterId')}`}
      patientId={state.patientId}
      encounterId={state.encounterId}
    />
  )
}

const ObservationTabacoSmokingStatusCard: React.FunctionComponent<any> = ({
  patientId,
  encounterId,
}) => {
  const params: IObservationListFilterQuery = {
    code: OBSERVATION_CODE.TABACO_SMOKING_STATUS.code,
    encounterId,
    patientId,
  }
  const { isLoading, data: observationList, error } = useObservationList(
    {
      filter: params || {},
      max: 1,
    },
    ['patientId'],
  )

  if (error) {
    return <ErrorSection error={error} />
  }

  if (isLoading) {
    return <LoadingSection />
  }
  return (
    <ObservationTabacoSmokingStatusCardView observation={observationList[0]} />
  )
}

export default ObservationTabacoSmokingStatusCard

const ObservationTabacoSmokingStatusCardView: React.FunctionComponent<any> = ({
  observation,
}) => {
  const classes = useStyles()
  return (
    <CardLayout
      header='Tabaco Smoking Status'
      Icon={
        <Icon style={{ color: '#558b2f' }} className={clsx('fas fa-smoking')} />
      }
      option={{
        isHideIcon: true,
        style: {
          backgroundColor: lighten('#558b2f', 0.85),
          color: '#558b2f',
        },
      }}
    >
      <Grid
        container
        justify='center'
        alignItems='center'
        style={{ height: '100%' }}
      >
        <Grid xs={12} item container direction='column'>
          <Typography
            component='div'
            variant='body1'
            style={{
              paddingLeft: 16,
              paddingRight: 16,
            }}
            className={clsx(classes.bodyCard)}
          >
            <div>
              <Typography
                component='span'
                variant='h6'
                className={classes.contentText}
                style={{
                  color: get(observation, 'value') ? undefined : 'gray',
                  paddingRight: 8,
                }}
              >
                {get(observation, 'value') || 'N/A'}
              </Typography>{' '}
              {/* <Typography
                component='span'
                variant='h4'
                className={classes.unitText}
              >
                {get(observation, 'unit') || ''}
              </Typography> */}
            </div>
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        justify='center'
        alignContent='center'
        className={classes.footerContainer}
      >
        <Typography variant='body2'>
          {get(observation, 'issued') || ''}
        </Typography>
      </Grid>
    </CardLayout>
  )
}
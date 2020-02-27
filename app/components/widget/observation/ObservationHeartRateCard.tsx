import * as React from 'react'

import { cardClick } from '@app/actions/patientsummaryCards.action'
import CardLayout from '@components/base/CardLayout'
import ErrorSection from '@components/base/ErrorSection'
import LoadingSection from '@components/base/LoadingSection'
import useObservationList from '@components/hooks/useObservationList'
import { OBSERVATION_CODE } from '@config/observation'
import { IObservationListFilterQuery } from '@data-managers/ObservationDataManager'
import { Grid, Icon, makeStyles, Theme, Typography } from '@material-ui/core'
import { lighten } from '@material-ui/core/styles'
import { sendMessage } from '@utils'
import clsx from 'clsx'
import _ from 'lodash'
import get from 'lodash/get'
import { useDispatch, useSelector } from 'react-redux'

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

export const ObservationHeartRateCardWithConnector: React.FunctionComponent = () => {
  const state = useSelector((state: any) => state.patientSummaryCards)
  const dispatch = useDispatch()
  const handleCardClick = (cardName: string) => {
    dispatch(cardClick(cardName))
    sendMessage({
      message: 'handleCardClick',
      name,
      params: {
        cardName,
      },
    })
  }

  return (
    <ObservationHeartRateCard
      key={`ObservationHeartRateCard${_.get(state, 'encounterId')}`}
      patientId={state.patientId}
      encounterId={state.encounterId}
      onClick={handleCardClick}
      selectedCard={_.get(state, 'selectedCard')}
    />
  )
}

const ObservationHeartRateCard: React.FunctionComponent<{
  patientId: string
  encounterId?: string
  max?: number
  onClick?: any
  selectedCard?: any
}> = ({ patientId, encounterId, max = 20, onClick, selectedCard }) => {
  const params = {
    code: OBSERVATION_CODE.HEART_RATE.code,
    encounterId,
    patientId,
  } as IObservationListFilterQuery
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
    <ObservationHeartRateCardView
      observation={observationList[0]}
      onClick={onClick}
      selectedCard={selectedCard}
    />
  )
}

export default ObservationHeartRateCard

export const ObservationHeartRateCardView: React.FunctionComponent<{
  observation: any
  onClick?: any
  selectedCard?: any
}> = ({ observation, onClick, selectedCard }) => {
  const classes = useStyles()
  return (
    <CardLayout
      header='Heart Rate'
      Icon={
        <Icon
          style={{ color: '#c62828', paddingRight: 5 }}
          className={clsx('fas fa-heartbeat')}
        />
      }
      option={{
        isHideIcon: true,
        style: {
          backgroundColor: lighten('#c2185b', 0.85),
          color: '#c2185b',
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
            className={clsx(
              classes.bodyCard,
              classes.clickable,
              classes.hover,
              selectedCard === OBSERVATION_CODE.HEART_RATE.value
                ? classes.selectedCard
                : null,
            )}
            onClick={() =>
              onClick ? onClick(OBSERVATION_CODE.HEART_RATE.value) : null
            }
          >
            <Typography
              variant='h3'
              className={classes.contentText}
              style={{
                color: get(observation, 'value') ? undefined : 'gray',
                paddingRight: 8,
              }}
            >
              {get(observation, 'value') || 'N/A'}
            </Typography>
            <Typography
              component='span'
              variant='h4'
              className={classes.unitText}
            >
              {get(observation, 'unit') || ''}
            </Typography>
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        justify='center'
        alignContent='center'
        className={classes.footerContainer}
      >
        <Typography variant='body2'>{get(observation, 'issued')}</Typography>
      </Grid>
    </CardLayout>
  )
}

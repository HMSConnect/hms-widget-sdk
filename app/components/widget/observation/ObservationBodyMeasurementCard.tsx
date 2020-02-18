import * as React from 'react'

import ErrorSection from '@components/base/ErrorSection'
import LoadingSection from '@components/base/LoadingSection'
import useObservationList from '@components/hooks/useObservationList'
import { OBSERVATION_CODE } from '@config/observation'
import { IObservationListFilterQuery } from '@data-managers/ObservationDataManager'
import {
  Divider,
  Grid,
  Icon,
  makeStyles,
  Paper,
  Theme,
  Tooltip,
  Typography,
  Fab,
} from '@material-ui/core'
import clsx from 'clsx'
import * as _ from 'lodash'
import CardLayout from '@components/base/CardLayout'
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme: Theme) => ({
  bodyCard: {
    alignItems: 'flex-end',
    display: 'flex',
    justifyContent: 'space-between',
  },
  contentText: {
    fontWeight: 450
  },
  unitText: {
    fontWeight: 450
  },
  footerContainer: { height: 36, color: 'grey' },
}))

const ObservationBodyMeasurementCard: React.FunctionComponent<{
  query: any
  onClick?: any
}> = ({ query, onClick }) => {
  let params: IObservationListFilterQuery = {}

  params = {
    codes: `${OBSERVATION_CODE.BODY_HEIGHT.code},${OBSERVATION_CODE.BODY_WEIGHT.code},${OBSERVATION_CODE.BODY_MASS_INDEX.code}`,
    encounterId: _.get(query, 'encounterId'),
    patientId: _.get(query, 'patientId'),
  }

  const { isLoading, data: observationList, error } = useObservationList(
    {
      _lasted: true,
      filter: params || {},
    },
    ['patientId'],
  )
  if (error) {
    return <ErrorSection error={error} />
  }

  if (isLoading) {
    return <LoadingSection />
  }
  return <ObservationBodyMeasurementCardView observations={observationList} onClick={onClick} />
}

export default ObservationBodyMeasurementCard

const ObservationBodyMeasurementCardView: React.FunctionComponent<{
  observations: any
  onClick?: any
}> = ({ observations, onClick }) => {
  const classes = useStyles()
  return (

    <CardLayout header='Body Measurement' Icon={<Icon
      className={'fas fa-male'}
    />}>
      <Grid
        container
        justify='center'
        alignItems='center'
        style={{ height: '100%' }}
      >
        <Grid
          xs={12}
          item
          container
          direction='column'
          style={{
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <Tooltip
            title={
              <Typography variant='body1'>
                {_.find(observations, {
                  code: OBSERVATION_CODE.BODY_HEIGHT.code,
                })
                  ? _.find(observations, {
                    code: OBSERVATION_CODE.BODY_HEIGHT.code,
                  }).issued
                  : 'N/A'}
              </Typography>
            }
            placement='top-end'
            enterDelay={250}
            aria-label='add'
          >
            <Typography
              component='div'
              variant='body1'
              className={classes.bodyCard}
              onClick={() => onClick ? onClick('BODY_HEIGHT') : null}
            >
              <Typography
                variant='body2'
              >
                Height{' '}
                {/* <Fab size="small" color="primary" aria-label="add">
                  <InfoIcon style={{ zoom: 1 }} />
                </Fab> */}

              </Typography>
              <div>
                <Typography
                  component='span'
                  variant='h5'
                  className={classes.contentText}
                >
                  {' '}
                  {_.find(observations, {
                    code: OBSERVATION_CODE.BODY_HEIGHT.code,
                  })
                    ? Number(
                      _.find(observations, {
                        code: OBSERVATION_CODE.BODY_HEIGHT.code,
                      }).value,
                    ).toFixed(2)
                    : 'N/A'}
                </Typography>{' '}
                <Typography component='span'
                  variant='body1'
                  className={classes.unitText}>
                  {_.find(observations, {
                    code: OBSERVATION_CODE.BODY_HEIGHT.code,
                  })
                    ? _.find(observations, {
                      code: OBSERVATION_CODE.BODY_HEIGHT.code,
                    }).unit
                    : ''}
                </Typography>
              </div>
            </Typography>
          </Tooltip>

          <Divider />
          <Tooltip
            title={
              <Typography variant='body1'>
                {_.find(observations, {
                  code: OBSERVATION_CODE.BODY_WEIGHT.code,
                })
                  ? _.find(observations, {
                    code: OBSERVATION_CODE.BODY_WEIGHT.code,
                  }).issued
                  : 'N/A'}
              </Typography>
            }
            placement='top-end'
            enterDelay={250}
            aria-label='add'
          >
            <Typography
              component='div'
              variant='body1'
              className={classes.bodyCard}
              onClick={() => onClick ? onClick('BODY_WEIGHT') : null}
            >
              <Typography
                variant='body2'
              >
                Weight{' '}
              </Typography>
              <div>
                <Typography
                  component='span'
                  variant='h5'
                  className={classes.contentText}
                >
                  {' '}
                  {_.find(observations, {
                    code: OBSERVATION_CODE.BODY_WEIGHT.code,
                  })
                    ? Number(
                      _.find(observations, {
                        code: OBSERVATION_CODE.BODY_WEIGHT.code,
                      }).value,
                    ).toFixed(2)
                    : 'N/A'}{' '}
                </Typography>
                <Typography component='span'
                  variant='body1'
                  className={classes.unitText}>
                  {_.find(observations, {
                    code: OBSERVATION_CODE.BODY_WEIGHT.code,
                  })
                    ? _.find(observations, {
                      code: OBSERVATION_CODE.BODY_WEIGHT.code,
                    }).unit
                    : ''}
                </Typography>
              </div>
            </Typography>
          </Tooltip>

          <Divider />
          <Tooltip
            title={
              <Typography variant='body1'>
                {_.find(observations, {
                  code: OBSERVATION_CODE.BODY_MASS_INDEX.code,
                })
                  ? _.find(observations, {
                    code: OBSERVATION_CODE.BODY_MASS_INDEX.code,
                  }).issued
                  : 'N/A'}
              </Typography>
            }
            placement='top-end'
            enterDelay={250}
            aria-label='add'
          >
            <Typography
              component='div'
              variant='body1'
              className={classes.bodyCard}
              onClick={() => onClick ? onClick('BODY_MASS_INDEX') : null}
            >
              <Typography
                variant='body2'
              >
                BMI{' '}
              </Typography>
              <div>
                <Typography
                  component='span'
                  variant='h5'
                  className={classes.contentText}
                >
                  {' '}
                  {_.find(observations, {
                    code: OBSERVATION_CODE.BODY_MASS_INDEX.code,
                  })
                    ? Number(
                      _.find(observations, {
                        code: OBSERVATION_CODE.BODY_MASS_INDEX.code,
                      }).value,
                    ).toFixed(2)
                    : 'N/A'}{' '}
                </Typography>
                <Typography component='span'
                  variant='body1'
                  className={classes.unitText}>
                  {_.find(observations, {
                    code: OBSERVATION_CODE.BODY_MASS_INDEX.code,
                  })
                    ? _.find(observations, {
                      code: OBSERVATION_CODE.BODY_MASS_INDEX.code,
                    }).unit
                    : ''}
                </Typography>
              </div>
            </Typography>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid
        container
        justify='center'
        alignContent='center'
        className={classes.footerContainer}
      >
        <Typography variant='body2' >
          {observations
            ? _.get(_.maxBy(observations, 'issuedDate'), 'issued')
            : ''}
        </Typography>
      </Grid>
    </CardLayout >
  )
}

import * as React from 'react'

import ErrorSection from '@components/base/ErrorSection'
import usePatient from '@components/hooks/usePatient'
import {
  Avatar,
  Chip,
  CircularProgress,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import * as _ from 'lodash'
import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme: Theme) => ({
  bigAvatar: {
    height: theme.spacing(10),
    margin: 10,
    width: theme.spacing(10),
  },
  contentText: {
    color: '#37474f',
    fontWeight: 'normal',
  },
  headerTitle: {
    color: 'grey',
  },
  nameTitle: {
    color: '#808080',
  },
  root: {
    height: '100%',
    padding: theme.spacing(2),
  },
  topicTitle: {
    color: 'grey',
  },
}))

const PatientDemographic: React.FunctionComponent<{
  patientId: string
  name?: string
}> = ({ patientId, name = 'PatientDemographic' }) => {
  const { isLoading: isPatientLoading, data: patient, error } = usePatient(
    patientId,
  )
  if (error) {
    return <ErrorSection error={error} />
  }

  if (isPatientLoading) {
    return <CircularProgress />
  }

  return <PatientDemographicView patient={patient} />
}

export const PatientDemographicWithConnector: React.FunctionComponent = () => {
  const state = useSelector((state: any) => state.patientDemographic)
  return <PatientDemographic patientId={state.patientId} />
}

export const PatientDemographicView: React.FunctionComponent<{
  patient: any
}> = ({ patient: info }) => {
  const classes = useStyles()
  return (
    <Grid container className={classes.root} spacing={1}>
      <Grid item sm={12} md={12} lg={12}>
        {/* <div className={classes.root}> */}
        <Grid
          container
          style={{
            alignContent: 'center',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <Grid container alignItems='center'>
            <Grid item sm={12} md={12} lg={2}>
              <Grid container alignItems='center'>
                <Avatar
                  alt='Image'
                  src='../../../../../static/images/mock-person-profile.png'
                  className={classes.bigAvatar}
                />
              </Grid>
            </Grid>
            <Grid item sm={12} md={12} lg={9} style={{ paddingLeft: '1em' }}>
              <Grid container>
                <Typography variant='h4' className={classes.nameTitle}>
                  {_.isArray(_.get(info, 'name.prefix'))
                    ? _.join(_.get(info, 'name.prefix'), ' ')
                    : _.get(info, 'name.prefix')}{' '}
                  {_.isArray(_.get(info, 'name.given'))
                    ? _.join(_.get(info, 'name.given'), ' ')
                    : _.get(info, 'name.given')}{' '}
                  {_.isArray(_.get(info, 'name.family'))
                    ? _.join(_.get(info, 'name.family'), ' ')
                    : _.get(info, 'name.family')}
                </Typography>
              </Grid>
              <Grid container>
                {/* <Paper elevation={0}> */}
                {_.map(info.communication, (com: string, index: any) => {
                  return (
                    <Chip
                      key={`lan-${index}`}
                      label={com}
                      style={{ margin: '4px' }}
                      size='small'
                    />
                  )
                })}
                {/* </Paper> */}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Grid
                  container
                  direction='row'
                  justify='space-between'
                  alignContent='space-between'
                >
                  <Grid item xs={12}>
                    <Typography
                      variant='body1'
                      className={classes.topicTitle}
                      component='span'
                    >
                      Age :{' '}
                    </Typography>
                    <Typography
                      component='span'
                      variant='body1'
                      className={classes.contentText}
                    >
                      {_.get(info, 'age') || 'Unknow'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography component='div' variant='body1'>
                      <Typography
                        variant='body1'
                        className={classes.topicTitle}
                        component='span'
                      >
                        Gender :{' '}
                      </Typography>
                      <Typography
                        component='span'
                        variant='body1'
                        className={classes.contentText}
                      >
                        {_.startCase(_.get(info, 'gender')) || 'Unknow'}
                      </Typography>
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant='body1'
                      className={classes.topicTitle}
                      component='span'
                    >
                      DOB :{' '}
                    </Typography>
                    <Typography
                      component='span'
                      variant='body1'
                      className={classes.contentText}
                    >
                      {_.get(info, 'birthDate')}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      variant='body1'
                      className={classes.topicTitle}
                      component='span'
                    >
                      Phone :{' '}
                    </Typography>
                    <Typography
                      component='span'
                      variant='body1'
                      className={classes.contentText}
                    >
                      {_.get(info, 'telecom')
                        ? _.isArray(_.get(info, 'telecom'))
                          ? _.join(
                              _.map(_.get(info, 'telecom'), (tel: any) =>
                                _.get(tel, 'value'),
                              ),
                              ' ',
                            )
                          : _.get(info, 'telecom')
                        : 'Unknow'}
                    </Typography>
                  </Grid>
                  {info.email && (
                    <Grid item xs={12}>
                      <Typography
                        variant='body1'
                        className={classes.topicTitle}
                        component='span'
                      >
                        Email :{' '}
                      </Typography>
                      <Typography
                        component='span'
                        variant='body1'
                        className={classes.contentText}
                      >
                        {_.get(info, 'email') || 'Unknow'}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      variant='body1'
                      className={classes.topicTitle}
                      component='span'
                    >
                      Address :{' '}
                    </Typography>
                    <Typography
                      component='span'
                      variant='body1'
                      className={classes.contentText}
                    >
                      {_.get(info, 'address')
                        ? `${
                            _.isArray(_.get(info, 'address[0].line'))
                              ? _.join(_.get(info, 'address[0].line'), ' ')
                              : _.get(info, 'address[0].line')
                          } ${_.get(info, 'address[0].postalCode')} ${_.get(
                            info,
                            'address[0].city',
                          )} ${_.get(info, 'address[0].country')}`
                        : 'Unknow'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* </div> */}
      </Grid>
      {/* <Grid style={{ height: '100%' }} item xs={12} sm={12} md={6} lg={2}>
        <Grid
          container
          direction='column'
          style={{
            alignContent: 'center',
            borderLeftColor: 'lightgray',
            borderLeftStyle: 'solid',
            borderLeftWidth: 1,
            height: '100%',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Typography
            variant='body1'
            component='div'
            style={{ textAlign: 'center' }}
          >
            <Typography variant='h6' className={classes.nameTitle}>
              {_.get(info, 'practitioner') || 'Mr. Test'}
            </Typography>
          </Typography>

          <Typography component='div' style={{ textAlign: 'center' }}>
            <Avatar className={classes.bigAvatar}>
              <Typography
                variant='h4'
                component='span'
                style={{ color: 'white' }}
              >
                PH
              </Typography>
            </Avatar>
          </Typography>
        </Grid>
      </Grid>
      <Grid style={{ height: '100%' }} item xs={12} sm={12} md={6} lg={4}>
        <div
          style={{
            borderLeftColor: 'lightgray',
            borderLeftStyle: 'solid',
            borderLeftWidth: 1,
            height: '100%',
            maxHeight: '100%',
            overflow: 'auto',
            padding: '0 1em',
          }}
        >
          <PatientAllergyList
            patientId={_.get(info, 'identifier.id.value')}
            isInitialize={true}
            name={`${name}AllergyIntoleranceList`}
          />
        </div>
      </Grid> */}
    </Grid>
  )
}

export default PatientDemographic

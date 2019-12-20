import React from 'react'

import { CssBaseline, makeStyles, Theme, Typography } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import HomeIcon from '@material-ui/icons/Home'

import BreadcrumbsBase from '../../../components/base/BreadcrumbsBase'
import BootstrapWrapper from '../../../components/init/BootstrapWrapper'
import PatientInfoDetail from '../../../components/widget/patient/PatientInfoDetail'
import { IStatelessPage } from '../../patient-search'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh',
    paddingTop: '30px'
  }
}))

const PatientInfoView: IStatelessPage<{
  query: any
}> = ({ query }) => {
  const classes = useStyles()
  return (
    <BootstrapWrapper
      dependencies={[
        'patient',
        'encounter',
        'diagnostic_report',
        'observation'
      ]}
    >
      <>
        <CssBaseline />
        <Container maxWidth='lg'>
          <Typography component='div' className={classes.root}>
            <PatientInfoDetail query={query} />
          </Typography>
        </Container>
      </>
    </BootstrapWrapper>
  )
}

PatientInfoView.getInitialProps = async ({ req, res, query }) => {
  return {
    query
  }
}

export default PatientInfoView
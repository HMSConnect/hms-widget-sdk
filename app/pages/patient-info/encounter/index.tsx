import * as React from 'react'

import BreadcrumbsBase from '@components/base/BreadcrumbsBase'
import BootstrapWrapper from '@components/init/BootstrapWrapper'
import PatientDemographic from '@components/widget/patient/PatientDemographic'
import { CssBaseline, makeStyles, Theme, Typography } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import { IStatelessPage } from '@pages/patient-search'
import * as _ from 'lodash'
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // height: '100vh',
    // paddingTop: '30px',
  },
}))

const EncounterPage: IStatelessPage<{
  query: any
}> = ({ query }) => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <CssBaseline />

      <BootstrapWrapper
        dependencies={[
          'allergy_intolerance',
          'condition',
          'diagnostic_report',
          'encounter',
          'observation',
          'patient',
          'immunization',
          'procedure',
          'medication_request',
          'imaging_study',
          'claim',
          'care_plan',
          'organization',
        ]}
      >
        <>
          {/* <Container maxWidth='lg'> */}
          <Typography component='div' className={classes.root}>
            <BreadcrumbsBase
              currentPath='Patient Info'
              parentPath={[
                {
                  icon: <HomeIcon />,
                  label: 'Home',
                  url: '/',
                },
                {
                  label: 'Patient Search',
                },
              ]}
            ></BreadcrumbsBase>
            <PatientDemographic query={query} name={_.get(query, 'name')} />
            {/* <PatientInfoDetail query={query} /> */}
          </Typography>
          {/* </Container> */}
        </>
      </BootstrapWrapper>
    </React.Fragment>
  )
}

EncounterPage.getInitialProps = async ({ req, res, query }) => {
  return {
    query,
  }
}

export default EncounterPage

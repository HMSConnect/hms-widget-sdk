import { withAuthSync } from '@components/base/Auth'
import BootstrapWrapper from '@components/init/BootstrapWrapper'
import { PatientPractitionerWithConnector } from '@components/widget/patient/PatientPractitioner'
import environment from '@environment'
import { CssBaseline, makeStyles, Theme } from '@material-ui/core'
import { IStatelessPage } from '@pages/patient-search'
import { parse } from '@utils'
import get from 'lodash/get'
import * as React from 'react'

// import PatientPhysician from '@components/widget/patient/PatientPhysician'

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}))

const PatientPractitionerCardWidget: IStatelessPage<{
  query: any
}> = ({ query }) => {
  const classes = useStyles()
  return (
    <BootstrapWrapper
      dependencies={['patient', 'encounter', 'practitioner']}
      mode={environment.mode}
    >
      <>
        <CssBaseline />
        <div style={{ height: '100vh' }}>
          <PatientPractitionerWithConnector
            encounterId={get(query, 'encounterId')}
            maxDisplay={get(query, 'maxDisplay')}
          />
        </div>
      </>
    </BootstrapWrapper>
  )
}

PatientPractitionerCardWidget.getInitialProps = async ({ req, res, query }) => {
  return {
    query: parse(query),
  }
}

export default withAuthSync(PatientPractitionerCardWidget)

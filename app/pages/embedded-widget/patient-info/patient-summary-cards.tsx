import { withAuthSync } from '@components/base/Auth'
import BootstrapWrapper from '@components/init/BootstrapWrapper'
import { PatientSummaryCardsWithConnector } from '@components/widget/patient/PatientSummaryCards'
import environment from '@environment'
import { CssBaseline, makeStyles, Theme } from '@material-ui/core'
import { IStatelessPage } from '@pages/patient-search'
import { parse } from '@utils'
import get from 'lodash/get'
import * as React from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}))

const PatientDemographicSummaryWidget: IStatelessPage<{
  query: any
}> = ({ query }) => {
  return (
    <BootstrapWrapper
      dependencies={['patient', 'observation']}
      mode={environment.mode}
    >
      <>
        <CssBaseline />
        <PatientSummaryCardsWithConnector
          patientId={get(query, 'patientId')}
          encounterId={get(query, 'encounterId')}
          name={get(query, 'name')}
          isSelectable={get(query, 'isSelectable')}
        />
      </>
    </BootstrapWrapper>
  )
}

PatientDemographicSummaryWidget.getInitialProps = async ({
  req,
  res,
  query,
}) => {
  return {
    query: parse(query),
  }
}

export default withAuthSync(PatientDemographicSummaryWidget)

import * as React from 'react'

import BootstrapWrapper from '@components/init/BootstrapWrapper'
import PatientDemograhicSummary from '@components/widget/patient/PatientDemograhicSummary'
import { CssBaseline, makeStyles, Theme } from '@material-ui/core'
import { IStatelessPage } from '@pages/patient-search'
import { parse } from '@utils'

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}))

const PatientDemographicSummaryWidget: IStatelessPage<{
  query: any
}> = ({ query }) => {
  return (
    <BootstrapWrapper dependencies={['patient', 'observation']}>
      <>
        <CssBaseline />
        <PatientDemograhicSummary query={query} />
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

export default PatientDemographicSummaryWidget
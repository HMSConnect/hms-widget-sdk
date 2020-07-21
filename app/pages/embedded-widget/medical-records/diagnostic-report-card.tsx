import { withAuthSync } from '@components/base/Auth'
import BootstrapWrapper from '@components/init/BootstrapWrapper'
import DiagnosticReportCard, {
  DiagnosticReportCardWithoutModal,
} from '@components/widget/medical-records/DiagnosticReportCard'
import environment from '@environment'
import { CssBaseline, makeStyles, Theme } from '@material-ui/core'
import { IStatelessPage } from '@pages/patient-search'
import { parse } from '@utils'
import * as React from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}))

const DianosticReportWidget: IStatelessPage<{
  query: any
}> = ({ query }) => {
  const classes = useStyles()

  return (
    <BootstrapWrapper
      dependencies={['diagnostic_report', 'patient', 'encounter']}
      mode={environment.mode}
    >
      <>
        <CssBaseline />
        {query.isIncludeModal ? (
          <DiagnosticReportCard />
        ) : (
          <DiagnosticReportCardWithoutModal />
        )}
      </>
    </BootstrapWrapper>
  )
}

DianosticReportWidget.getInitialProps = async ({ req, res, query }) => {
  return {
    query: parse(query),
  }
}

export default withAuthSync(DianosticReportWidget)

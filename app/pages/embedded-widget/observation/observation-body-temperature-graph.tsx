import { withAuthSync } from '@components/base/Auth'
import BootstrapWrapper from '@components/init/BootstrapWrapper'
import { ObservationBodyTemperatureGraphWithConnector } from '@components/widget/observation/ObservationBodyTemperatureGraph'
import environment from '@environment'
import { CssBaseline, makeStyles, Theme } from '@material-ui/core'
import { IStatelessPage } from '@pages/patient-search'
import { parse } from '@utils'
import { get } from 'lodash'
import * as React from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}))

const ObservationBodyTemperatureGraphWidget: IStatelessPage<{
  query: any
}> = ({ query }) => {
  const classes = useStyles()
  return (
    <BootstrapWrapper
      dependencies={['patient', 'observation']}
      mode={environment.mode}
    >
      <>
        <CssBaseline />
        <ObservationBodyTemperatureGraphWithConnector
          patientId={get(query, 'patientId')}
          optionStyle={get(query, 'optionStyle')}
          max={get(query, 'max')}
        />
      </>
    </BootstrapWrapper>
  )
}

ObservationBodyTemperatureGraphWidget.getInitialProps = async ({
  req,
  res,
  query,
}) => {
  return {
    query: parse(query),
  }
}

export default withAuthSync(ObservationBodyTemperatureGraphWidget)

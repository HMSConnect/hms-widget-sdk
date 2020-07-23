import { withAuthSync } from '@components/base/Auth'
import BootstrapWrapper from '@components/init/BootstrapWrapper'
import ObservationLaboratoryCard from '@components/widget/medical-records/ObservationLaboratoryCard'
import environment from '@environment'
import { CssBaseline, makeStyles, Theme } from '@material-ui/core'
import { IStatelessPage } from '@pages/patient-search'
import { parse } from '@utils'
import * as React from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh',
    paddingTop: '30px',
  },
}))

const ObservationLaboratoryCardWidget: IStatelessPage<{
  query: any
}> = ({ query }) => {
  const classes = useStyles()

  return (
    <BootstrapWrapper dependencies={['observation']} mode={environment.mode}>
      <>
        <CssBaseline />
        <ObservationLaboratoryCard />
      </>
    </BootstrapWrapper>
  )
}

ObservationLaboratoryCardWidget.getInitialProps = async ({
  req,
  res,
  query,
}) => {
  return {
    query: parse(query),
  }
}

export default withAuthSync(ObservationLaboratoryCardWidget)

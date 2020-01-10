import * as React from 'react'

import BootstrapWrapper from '@components/init/BootstrapWrapper'
import ObservationLaboratoryCard from '@components/widget/medical-records/ObservationLaboratoryCard'
import {
  Container,
  CssBaseline,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import { IStatelessPage } from '@pages/patient-search'
import { parse } from '@utils'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh',
    paddingTop: '30px',
  },
}))

const ObservationLaboratoryCardPage: IStatelessPage<{
  query: any
}> = ({ query }) => {
  const classes = useStyles()

  return (
    <BootstrapWrapper dependencies={['observation']}>
      <>
        <CssBaseline />
        <Container maxWidth='lg'>
          <Typography component='div' className={classes.root}>
            <ObservationLaboratoryCard />
          </Typography>
        </Container>
      </>
    </BootstrapWrapper>
  )
}

ObservationLaboratoryCardPage.getInitialProps = async ({ req, res, query }) => {
  return {
    query: parse(query),
  }
}

export default ObservationLaboratoryCardPage
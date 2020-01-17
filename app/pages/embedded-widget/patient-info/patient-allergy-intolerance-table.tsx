import * as React from 'react'

import BootstrapWrapper from '@components/init/BootstrapWrapper'
import PatientAllergyIntoleranceTable from '@components/widget/patient/PatientAllergyIntoleranceTable'
import { CssBaseline, makeStyles, Theme } from '@material-ui/core'
import { IStatelessPage } from '@pages/patient-search'
import { parse } from '@utils'
import { get } from 'lodash'

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}))

const PatientAllergyIntoleranceTableView: IStatelessPage<{
  query: any
}> = ({ query }) => {
  const classes = useStyles()
  return (
    <BootstrapWrapper dependencies={['patient', 'allergy_intolerance']}>
      <>
        <CssBaseline />
        <PatientAllergyIntoleranceTable
          patientId={get(query, 'patientId')}
          max={get(query, 'max')}
          isInitialize={get(query, 'isInitialize') || true}
          initialFilter={get(query, 'initialFilter')}
        />
      </>
    </BootstrapWrapper>
  )
}

PatientAllergyIntoleranceTableView.getInitialProps = async ({
  req,
  res,
  query,
}) => {
  return {
    query: parse(query),
  }
}

export default PatientAllergyIntoleranceTableView
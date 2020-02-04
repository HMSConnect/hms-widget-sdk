import * as React from 'react'

import AdaptiveCard from '@components/base/AdaptiveCard'
import ErrorSection from '@components/base/ErrorSection'
import LoadingSection from '@components/base/LoadingSection'
import useObservationList from '@components/hooks/useObservationList'
import observationTemplate from '@components/templates/adaptive-card/observation.template.json'
import { IObservationListFilterQuery } from '@data-managers/ObservationDataManager'
import { Paper } from '@material-ui/core'
import { parse } from '@utils'
import * as _ from 'lodash'
import { useRouter } from 'next/router'
import { stringify } from 'qs'

export const ObservationLaboratoryCard: React.FunctionComponent<any> = () => {
  const { query: routerQuery } = useRouter()
  const query = {
    ...parse(stringify(routerQuery)),
    categoryCode: 'laboratory',
  }
  const params = {
    categoryCode: query.categoryCode,
    encounterId: query.encounterId,
    patientId: query.patientId,
  } as IObservationListFilterQuery

  const { isLoading, data: observationList, error } = useObservationList(
    {
      filter: params || {},
      max: _.get(query, 'max') || 20,
    },
    ['encounterId'],
  )
  if (error) {
    return <ErrorSection error={error} />
  }

  if (isLoading) {
    return <LoadingSection />
  }

  return (
    <>
      <ObservationLaboratoryCardView
        observationList={observationList}
        isShowAction={false}
        title={`Observation - laboratory`}
      />
    </>
  )
}

export const ObservationLaboratoryCardView: React.FunctionComponent<any> = ({
  templatePayload,
  observationList,
  isShowAction = true,
  onClick,
  title = 'Observation',
}) => {
  const data = {
    results: _.map(observationList, observation => {
      return {
        display: _.get(observation, 'codeText'),
        issued: _.get(observation, 'issued'),
        value: `${_.get(observation, 'value')} ${_.get(observation, 'unit')}`,
      }
    }),
    title,
  }
  return (
    <Paper style={{ height: '100%', overflowY: 'auto' }}>
      <AdaptiveCard
        data={{
          ...data,
          isShowAction,
        }}
        templatePayload={templatePayload}
        onExecuteAction={onClick}
      />
    </Paper>
  )
}

ObservationLaboratoryCardView.defaultProps = {
  templatePayload: observationTemplate,
}

export default ObservationLaboratoryCard

import * as React from 'react'

import ErrorSection from '@components/base/ErrorSection'
import GraphBase from '@components/base/GraphBase'
import LoadingSection from '@components/base/LoadingSection'
import ToolbarWithFilter from '@components/base/ToolbarWithFilter'
import useObservationList from '@components/hooks/useObservationList'
import { OBSERVATION_CODE } from '@config/observation'
import { IObservationListFilterQuery } from '@data-managers/ObservationDataManager'
import { ArgumentScale, ValueScale } from '@devexpress/dx-react-chart'
import {
  Divider,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import { lighten } from '@material-ui/core/styles'
import { scaleTime } from 'd3-scale'
import get from 'lodash/get'
import maxBy from 'lodash/maxBy'
import { IOptionsStyleGraphOption } from './ObservationBloodPressureGraph'

const useStyles = makeStyles((theme: Theme) => ({
  summaryContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
}))

const ObservationBodyTemperatureGraph: React.FunctionComponent<{
  patientId: string
  max?: number
  optionStyle?: IOptionsStyleGraphOption
}> = ({ patientId, max = 20, optionStyle }) => {
  const params = {
    code: OBSERVATION_CODE.BODY_TEMPERATURE.code,
    // encounterId: get(query, 'encounterId'),
    patientId,
  } as IObservationListFilterQuery
  const { isLoading, data: observationList, error } = useObservationList(
    {
      filter: params || {},
      max: max || 20,
    },
    ['patientId'],
  )
  if (error) {
    return <ErrorSection error={error} />
  }

  if (isLoading) {
    return <LoadingSection />
  }
  return (
    <>
      <ObservationBodyTemperatureGraphView
        observationList={observationList}
        optionStyle={optionStyle}
      />
    </>
  )
}

export default ObservationBodyTemperatureGraph

export const ObservationBodyTemperatureGraphView: React.FunctionComponent<{
  observationList: any
  optionStyle?: IOptionsStyleGraphOption
}> = ({ observationList, optionStyle }) => {
  const lastData: any = maxBy(observationList, 'issuedDate')

  const classes = useStyles()
  return (
    <>
      <ToolbarWithFilter
        title={'Body Temperature'}
        option={{
          isHideIcon: true,
          style: {
            backgroundColor: lighten('#afb42b', 0.85),
            color: '#afb42b',
            height: '5%',
          },
        }}
      ></ToolbarWithFilter>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '95%',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'block' }}>
          <GraphBase
            data={observationList}
            argumentField='issuedDate'
            optionStyle={{
              color: '#afb42b',
              ...optionStyle,
              height:
                optionStyle && optionStyle.height && optionStyle.height - 200,
            }}
            options={{
              ArgumentScale: <ArgumentScale factory={scaleTime as any} />,
              ValueScale: <ValueScale modifyDomain={() => [10, 200]} />,
              type: 'area',
            }}
          />
          <Divider />
        </div>
        <div className={classes.summaryContainer}>
          {lastData ? (
            <>
              {' '}
              <Typography variant='body1' style={{}}>
                {lastData.issued}
              </Typography>
              <Typography
                variant='body1'
                style={{ fontSize: '1.5rem', color: '#afb42b' }}
              >
                {lastData.value}
                {lastData.unit}
              </Typography>
            </>
          ) : (
            <Typography variant='h6' style={{}}>
              N/A
            </Typography>
          )}
        </div>
      </div>
      {/* </Paper> */}
    </>
  )
}
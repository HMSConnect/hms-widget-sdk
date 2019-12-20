import React from 'react'

import * as _ from 'lodash'
import widgetDependencies from '../../config/widget_dependencies.json'
import BootstrapHelper from '../../init/BootstrapHelper'

type DependencyType =
  | 'patient'
  | 'encounter'
  | 'diagnostic_report'
  | 'observation'

const BootstrapWrapper: React.FunctionComponent<{
  dependencies: DependencyType[]
  children: React.ReactElement
}> = ({ dependencies, children }) => {
  const [isLoading, setIsLoading] = React.useState(true)
  React.useEffect(() => {
    for (const depName of dependencies) {
      const dependency = _.get(widgetDependencies, depName) || {}
      BootstrapHelper.registerServices(dependency.services || [])
      BootstrapHelper.registerValidators(dependency.validators || [])
    }

    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div>loading dependencies...</div>
  }
  return <>{children}</>
}

export default BootstrapWrapper
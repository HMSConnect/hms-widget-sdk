import widgetDependencies from '@config/widget_dependencies.json'
import BootstrapHelper from '@init/BootstrapHelper'
import * as _ from 'lodash'
import * as React from 'react'

type DependencyType =
  | 'patient'
  | 'encounter'
  | 'diagnostic_report'
  | 'observation'
  | 'allergy_intolerance'
  | 'condition'
  | 'immunization'
  | 'procedure'
  | 'medication_request'

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

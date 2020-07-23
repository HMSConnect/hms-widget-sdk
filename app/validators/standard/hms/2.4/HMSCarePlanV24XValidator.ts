import IValidator from '@validators/IValidator'
import { snakeCase } from 'lodash'
class HMSCarePlanV24XValidator implements IValidator {
  isValid(schema: any): boolean {
    return (
      schema.standard === 'HMS' &&
      schema.version.startsWith('2.4') &&
      snakeCase(schema.resourceType) === 'care_plan'
    )
  }

  parse(carePlan: any): any {
    return {
      ...carePlan,
      activity: carePlan.activityDetailTextTreatment,
      category: null,
      periodStartText: carePlan.periodStartPlanOfTreatment,
      status: carePlan.statusPlanOfTreatment,
    }
  }
}

export default HMSCarePlanV24XValidator

import IValidator from '../../IValidator'
import validatorManager from '../../ValidatorManager'

class SFHIRCarePlanV1Validator implements IValidator {
  isValid(schema: any): boolean {
    return (
      schema.standard === 'SFHIR' &&
      schema.version === 1 &&
      schema.resourceType === 'care_plan'
    )
  }

  parse(carePlan: any): any {
    return carePlan
  }
}

validatorManager.register(
  'SFHIR_CARE_PLAN_V1',
  new SFHIRCarePlanV1Validator(),
  1
)

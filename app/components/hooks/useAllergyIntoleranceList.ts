import { IAllergyIntoleranceListQuery } from '@data-managers/AllergyIntoleranceDataManager'
import AllergyIntoleranceService from '@services/AllergyIntoleranceService'
import { HMSService } from '@services/HMSServiceFactory'
import { IServiceResult } from '@utils/types'
import * as _ from 'lodash'
import usePromise from './utils/usePromise'

const useAllergyIntoleranceList = (
  options: IAllergyIntoleranceListQuery,
): IServiceResult => {
  return usePromise(() => {
    const alleryIntoleranceService = HMSService.getService(
      'allergy_intolerance',
    ) as AllergyIntoleranceService
    return alleryIntoleranceService.list(options)
  }, _.values(options.filter))
}

export default useAllergyIntoleranceList
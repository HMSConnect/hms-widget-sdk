import IAdapter from '@adapters/IAdapter'
import DataManager from '@data-managers/DataManager'
import EncounterDataManager from '@data-managers/EncounterDataManager'
import AbstractService from './AbstractService'
import ValidatorManager from '@validators/ValidatorManager'
import { HMSService } from './HMSServiceFactory'
import PractitionerService from './PractitionerService'
import * as _ from 'lodash'

class EncounterService extends AbstractService {
  createDataManager(resource: string, adapter: IAdapter): DataManager {
    return new EncounterDataManager(resource, adapter)
  }

  async list(params: any): Promise<any> {
    const encounterEntryParams = _.cloneDeep(params)
    console.info(`[service] loading resource list`, params)
    const result = await this.dataManager.list(params)
    const validator = ValidatorManager.compile(result.schema)
    if (validator) {
      const res = { ...result }
      const data = []
      for (const item of result.data) {
        const encounterRelate = validator.parse(item)
        await this.mappingEnounterRelate(encounterRelate, encounterEntryParams)
        data.push(encounterRelate)
      }
      res.data = data
      return res
    } else {
      throw Error('not support this schema.')
    }
  }

  async typeList(params?: any): Promise<any> {
    const dataManager = this.dataManager as EncounterDataManager
    const result = await dataManager.typeList(params || {})
    return {
      ...result,
      data: result.data,
    }
  }

  async resourceList(id: string): Promise<any> {
    // console.info(`[service] loading resource list`, id)
    const dataManager = this.dataManager as EncounterDataManager
    const result = await dataManager.resourceList(id)
    return {
      ...result,
      data: result.data,
    }
  }
  private async mappingEnounterRelate(data: any, params: any) {
    const employeeId = _.get(_.last(data.participant), 'employeeId')
    if (params.withPractitioner) {
      const practitionerService = HMSService.getService(
        'practitioner',
      ) as AbstractService
      const participant = await practitionerService.list({
        employeeId,
      })
      const displayParticipants: any = []
      _.map(participant.data, (participantItem) => {
        displayParticipants.push({
          name: [{ given: [participantItem.displayName] }],
        })
      })
      data.participant = displayParticipants
    }
    if (params.withDiagnosis) {
      const diagnosisService = HMSService.getService(
        'diagnosis',
      ) as AbstractService
      const diagnosis = await diagnosisService.list({
        en: data.id,
      })
      const displayDiagnosis: any = []
      _.map(diagnosis.data, (diagnosisItem) => {
        displayDiagnosis.push({
          codeText: _.get(_.last(diagnosisItem.code), 'display'),
        })
      })
      data.diagnosis = displayDiagnosis
    }
    return data
  }
}

export default EncounterService

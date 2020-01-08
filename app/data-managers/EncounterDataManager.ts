import DataManager from './DataManager'

class EncounterDataManager extends DataManager {
  // customize operation if needed
  typeList(query: any): Promise<any> {
    return this.adaptor.doRequest(`${this.resource}/type`, query)
  }

  resourceList(id: string): Promise<any> {
    return this.adaptor.doRequest(`${this.resource}/${id}/resource-list`, {})
  }
}

export default EncounterDataManager

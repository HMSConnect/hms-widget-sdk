import * as _ from 'lodash'
import IAdapter from '../adapters/IAdapter'
import IService from './IService'

class HMSServiceFactory {
  registry: Map<string, any> = new Map()
  instances: Map<string, IService> = new Map()
  defaultAdatper: IAdapter | null = null
  register(name: string, clazz: any) {
    this.registry.set(name, clazz)
  }
  getService(resource: string, adapter?: IAdapter): IService | undefined {
    let instance = this.instances.get(resource)
    if (!instance) {
      const serviceCreator = this.registry.get(resource)
      if (serviceCreator) {
        instance = new serviceCreator(_.kebabCase(resource), adapter || this.defaultAdatper)
      } else {
        throw new Error(`service ${resource} not register`)
      }
    }
    return instance
  }

  setDefaultAdapter(adapter: IAdapter) {
    this.defaultAdatper = adapter
  }
}

export const HMSService = new HMSServiceFactory()

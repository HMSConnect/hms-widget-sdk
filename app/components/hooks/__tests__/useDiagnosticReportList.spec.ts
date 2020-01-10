import { renderHook } from '@testing-library/react-hooks'
import DiagnosticReportService from '../../../services/DiagnosticReportService'
import { HMSService } from '../../../services/HMSServiceFactory'
import DiagnosticReportServiceMock from '../__mocks__/DiagnosticReportServiceMock'
import useDiagnosticReportList from '../useDiagnosticReportList'

describe('useDiagnosticReportList', () => {
  beforeAll(() => {
    jest.spyOn(HMSService, 'getService').mockImplementation(() => {
      return DiagnosticReportServiceMock as DiagnosticReportService
    })
  })

  it('initial useDiagnosticReportList', async () => {
    const options = {
      max: 10,
      offset: 0,
      page: 1
    }
    const { result, waitForNextUpdate } = renderHook(() =>
      useDiagnosticReportList(options)
    )
    expect(result.error).toBeUndefined()

    expect(result.current.isLoading).toBeTruthy()
    await waitForNextUpdate()
    expect(result.current.isLoading).toBeFalsy()

    expect(result.current.data).toStrictEqual([
      {
        codeText: 'Code Text1',
        issued: '2019-01-01'
      },
      {
        codeText: 'Code Text2',
        issued: '2019-01-01'
      }
    ])
    expect(result.current.totalCount).toStrictEqual(2)
  })

  it('error useDiagnosticReportList', async () => {
    jest.spyOn(DiagnosticReportServiceMock, 'list').mockImplementation(() => {
      return Promise.reject(Error('error!!!'))
    })
    const options = {
      max: 10,
      offset: 0,
      page: 1
    }
    const { result, waitForNextUpdate } = renderHook(() =>
      useDiagnosticReportList(options)
    )
    expect(result.error).toBeUndefined()

    expect(result.current.isLoading).toBeTruthy()
    await waitForNextUpdate()
    expect(result.current.isLoading).toBeFalsy()

    expect(result.current.error).toBe('error!!!')
  })
})
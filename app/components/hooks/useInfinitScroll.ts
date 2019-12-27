import { useEffect, useState } from 'react'

import * as _ from 'lodash'
import { IQueryResult } from './usePatientList'

export interface ILazyLoadOption {
  max: number
  filter?: any
}

const useInfinitScroll = (
  refElement: HTMLDivElement | null,
  fetchMoreAsync: (lastEntry: any) => Promise<any>,
  defaultList?: any[]
): any => {
  const [result, setResult] = useState<IQueryResult>({
    data: [],
    error: null
  })
  const [isLoading, setLoading] = useState<boolean>(true)
  const [isMore, setIsMore] = useState<boolean>(true)

  const [isFetch, setIsFetch] = useState<boolean>(false)

  useEffect(() => {
    if (!refElement) {
      window.addEventListener('scroll', handleWindowScroll)
      return () => window.removeEventListener('scroll', handleWindowScroll)
    } else {
      const myscrollRef = (refElement as any) as HTMLDivElement
      myscrollRef.addEventListener('scroll', () =>
        handleElementScroll(myscrollRef)
      )

      return () =>
        myscrollRef.removeEventListener('scroll', () => {
          console.info('remove infinite scorll event')
        })
    }
  }, [refElement])

  useEffect(() => {
    ;(async () => {
      if (isFetch && isMore) {
        try {
          setLoading(true)
          const lastEntry = _.last(result.data)
          const entryData: any = await fetchMoreAsync(lastEntry)
          if (!_.isEmpty(entryData)) {
            setResult((prevData: any) => ({
              ...prevData,
              data: _.concat(prevData.data, entryData),
              error: null
            }))
          } else {
            setIsMore(false)
          }
        } catch (error) {
          setResult((prevResult: IQueryResult) => ({
            ...prevResult,
            error: error.message ? error.message : error
          }))
        } finally {
          setLoading(false)
          setIsFetch(false)
        }
      }
    })()
  }, [isFetch])

  function handleElementScroll(myscrollRef: HTMLDivElement) {
    if (
      myscrollRef.scrollTop + myscrollRef.clientHeight >=
      myscrollRef.scrollHeight
    ) {
      setIsFetch(true)
    }
  }

  function handleWindowScroll() {
    if (
      window.innerHeight +
        (window.pageYOffset || document.documentElement.scrollTop) +
        200 <
        document.documentElement.offsetHeight ||
      isFetch
    ) {
      return
    }
    setIsFetch(true)
  }

  useEffect(() => {
    if (defaultList) {
      setResult((prevData: any) => ({
        ...prevData,
        data: defaultList
      }))
    }
    setLoading(false)
  }, [defaultList])

  return {
    isLoading,
    ...result,
    setResult,
    isMore,
    setIsFetch,
    setIsMore,
    isFetch
  }
}

export default useInfinitScroll

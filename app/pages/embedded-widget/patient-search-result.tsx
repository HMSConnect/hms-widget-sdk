import React, { useEffect, useState } from 'react'

import { IPageOptionResult } from '@components/base/Pagination'
import { IPaginationOption, ISortType } from '@components/hooks/usePatientList'
import BootstrapWrapper from '@components/init/BootstrapWrapper'
import { IPatientFilterValue } from '@components/templates/patient/PatientFilterBar'
import PatientSearchResultWithPaginate, {
  defaultPagination,
} from '@components/widget/patient/PatientSearchResultWithPaginate'
import { CssBaseline, makeStyles, Theme } from '@material-ui/core'
import { IStatelessPage } from '@pages/patient-search'
import RouterManager from '@routes/RouteManager'
import { parse, sendMessage } from '@utils'
import * as _ from 'lodash'
import routes from '../../routes'

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}))

const PatientSearchResultWidget: IStatelessPage<{
  query: any
}> = ({ query }) => {
  const classes = useStyles()

  const [pagination, setPagination] = useState<IPaginationOption>(query)

  useEffect(() => {
    setPagination(query)
  }, [query])

  const handleRequestSort = (sortObject: ISortType) => {
    const newPagination = {
      ...pagination,
      filter: pagination.filter,
      sort: sortObject,
    }

    const path = RouterManager.getPath('patient-search-result', {
      matchBy: 'url',
      params: newPagination,
    })

    sendMessage({
      action: 'REPLACE_ROUTE',
      message: 'handleRequestSort',
      name: _.get(query, 'name') || 'patientSearchResult',
      params: newPagination,
      path,
    })

    routes.Router.replaceRoute(path)
  }

  const handlePageChange = (pageOptionResult: IPageOptionResult) => {
    const newPagination = {
      ...pageOptionResult,
      filter: pagination.filter,
      sort: pagination.sort,
    }

    const path = RouterManager.getPath('patient-search-result', {
      matchBy: 'url',
      params: newPagination,
    })

    sendMessage({
      action: 'REPLACE_ROUTE',
      message: 'handlePageChange',
      name: _.get(query, 'name') || 'patientSearchResult',
      params: newPagination,
      path,
    })

    routes.Router.replaceRoute(path)
  }

  const handlePatientSelect = (patient: any) => {
    const params = {
      patientId: _.get(patient, 'identifier.id.value'),
    }
    const path = RouterManager.getPath(
      `patient-info/${_.get(patient, 'identifier.id.value')}`,
      {
        matchBy: 'url',
      },
    )

    sendMessage({
      action: 'PUSH_ROUTE',
      message: 'handlePatientSelect',
      name: _.get(query, 'name') || 'patientSearchResult',
      params,
      path,
    })

    routes.Router.pushRoute(path)
  }

  return (
    <BootstrapWrapper dependencies={['patient']}>
      <>
        <CssBaseline />
        <PatientSearchResultWithPaginate
          paginationOption={pagination}
          onRequestSort={handleRequestSort}
          onPageChange={handlePageChange}
          onPatientSelect={handlePatientSelect}
        />
      </>
    </BootstrapWrapper>
  )
}

PatientSearchResultWidget.getInitialProps = async ({ query }) => {
  return {
    query: initialPagination(query),
  }
}

export function initialPagination(query: any) {
  const initialFilter: IPatientFilterValue = {
    gender: 'all',
    searchText: '',
  }

  const initialSort: ISortType = {
    order: 'asc',
    orderBy: 'id',
  }

  query = parse(query)
  return {
    filter: _.isEmpty(query.filter) ? initialFilter : query.filter,
    max: query.max ? Number(query.max) : defaultPagination.max,
    offset: query.offset ? Number(query.offset) : defaultPagination.offset,
    page: query.page ? Number(query.page) : defaultPagination.page,
    sort: _.isEmpty(query.sort) ? initialSort : query.sort,
  }
}

export default PatientSearchResultWidget

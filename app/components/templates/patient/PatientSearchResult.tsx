import React, { MouseEvent, useEffect } from 'react'

import { Table, TableBody, TableRow, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import * as _ from 'lodash'

import EnhancedTableHead from '../../base/EnhancedTableHead'
import { ISortType } from '../../hooks/usePatientList'
import PatientItem from './PatientItem'

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  tableRow: {
    cursor: 'pointer'
  },
  tableWrapper: {
    maxHeight: '70vh',
    overflow: 'auto'
  }
}))
const PatientSearchResult: React.FunctionComponent<{
  highlightText: string
  patientList: any[]
  sort: ISortType
  onPatientSelect: (patient: any) => void
  onRequestSort: (sortObject: ISortType) => void
}> = ({ highlightText, patientList, sort, onPatientSelect, onRequestSort }) => {
  const classes = useStyles()
  const [order, setOrder] = React.useState<'asc' | 'desc'>(
    _.get(sort, 'order') || 'asc'
  )
  const [orderBy, setOrderBy] = React.useState(_.get(sort, 'orderBy') || '')

  useEffect(() => {
    setOrder(_.get(sort, 'order') || 'asc')
    setOrderBy(_.get(sort, 'orderBy') || '')
  }, [sort])

  const handleRequestSort = (
    property: any
  ) => {
    const isDesc = orderBy === property && order === 'desc'
    setOrder(isDesc ? 'asc' : 'desc')
    setOrderBy(property)

    onRequestSort({
      order: isDesc ? 'asc' : 'desc',
      orderBy: property + ''
    })
  }

  const handlePatientSelect = (event: MouseEvent, patient: any) => {
    onPatientSelect(patient)
  }
  return (
    <>
      <div className={classes.tableWrapper}>
        <Table stickyHeader>
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={[
              {
                align: 'left',
                disablePadding: false,
                disableSort: true,
                id: 'image',
                label: '',
                styles: {
                  width: '5em'
                }
              },
              {
                align: 'center',
                disablePadding: true,
                id: 'name.given',
                label: 'Name'
              },
              {
                align: 'center',
                disablePadding: false,
                id: 'gender',
                label: 'Gender',
                styles: {
                  width: '5em'
                }
              },
              {
                align: 'center',
                disablePadding: false,
                id: 'birthDate',
                label: 'DOB',
                styles: {
                  width: '8em'
                }
              },
              {
                align: 'center',
                disablePadding: true,
                id: 'id',
                label: 'ID',
                styles: {
                  width: '25em'
                }
              },
              {
                align: 'center',
                disablePadding: true,
                id: 'identifier.mr',
                label: 'MRN',
                styles: {
                  width: '25em'
                }
              }
            ]}
          />
          <TableBody>
            {_.map(patientList, (patient: any, index: number) => (
              <TableRow
                key={index}
                hover
                onClick={(event: MouseEvent) =>
                  handlePatientSelect(event, patient)
                }
                className={classes.tableRow}
              >
                <PatientItem
                  key={index}
                  patient={patient}
                  highlightText={highlightText}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default PatientSearchResult
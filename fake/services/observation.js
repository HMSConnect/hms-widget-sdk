const moment = require('moment')
const utilService = require('./utils')

exports.createSelector = (filter = {}) => {
  const selector = {}
  const andSelector = []

  if (filter.patientId) {
    andSelector.push({ 'subject.reference': `Patient/${filter.patientId}` })
  }

  if (filter.encounterId) {
    andSelector.push({ 'context.reference': `Encounter/${filter.encounterId}` })
  }

  if (filter.categoryCode) {
    andSelector.push({ 'category.coding.code': filter.categoryCode })
  }

  if (filter.code) {
    const regExp = new RegExp(`.*${filter.code}.*`, 'i')
    andSelector.push({ 'code.coding.code': regExp })
  }

  if (filter.codes) {
    const codes = filter.codes.trim().split(',')
    const orSelector = []
    for (const code of codes) {
      const regExp = new RegExp(`.*${code}.*`, 'i')
      orSelector.push({ 'code.coding.code': regExp })
    }
    andSelector.push({ $or: orSelector })
  }

  if (filter.issued_lt) {
    //minimongo can't upsert date, so I filter by ISOString date.
    andSelector.push({
      '__mock_meta.issued': {
        $lt: filter.issued_lt
      }
    })
  }

  if (andSelector.length > 0) {
    selector['$and'] = andSelector
  }
  return selector
}

exports.createOptions = (query, options = {}) => {
  options = { ...utilService.createOptions(query), ...options }
  const { orderBy, order } = query.sort || {}

  if (query._lasted) {
    options.limit = 1
  } else {
    options.limit = query.max ? Number(query.max) : 10
  }

  if (query._lasted === 'true' && query.filter.codes) {
    options.limit = null
  }

  options.sort = [[orderBy || `__mock_meta.issued`, order || 'desc']]
  return options
}

exports.processingPredata = data => {
  const __mock_meta = {}

  if (data.issued) {
    const issued = moment(data.issued).toDate()
    __mock_meta.issued = issued
  }

  return {
    ...data,
    __mock_meta
  }
}

exports.parseToCategories = (observations = []) => {
  const groupObservationsByCategory = {}
  for (const observation of observations) {
    const category = observation.category[0].coding[0].display

    if (!groupObservationsByCategory[category]) {
      groupObservationsByCategory[category] = {
        type: category,
        totalCount: 0
      }
    }
    groupObservationsByCategory[category].totalCount += 1
  }
  return Object.values(groupObservationsByCategory)
}

exports.parseToCodes = (observations = []) => {
  const groupObservationsByCode = {}
  for (const observation of observations) {
    const coding = observation.code.coding[0]

    if (!groupObservationsByCode[coding.code]) {
      groupObservationsByCode[coding.code] = {
        code: coding.code,
        display: coding.display,
        totalCount: 0
      }
    }
    groupObservationsByCode[coding.code].totalCount += 1
  }
  return Object.values(groupObservationsByCode)
}

exports.mappingLastIssueByCodes = (observations = [], codeFields) => {
  const codes = codeFields.trim().split(',')
  const results = []
  for (const code of codes) {
    const resultCodes = observations.filter(item => {
      return item.code.coding && item.code.coding[0].code === code
    })

    const resultSortByLastIssued = resultCodes.sort((a, b) =>
      moment(a.issued).diff(moment(b.issued))
    )

    if (resultSortByLastIssued.length > 0) {
      results.push(resultSortByLastIssued[0])
    }
  }
  return results
}

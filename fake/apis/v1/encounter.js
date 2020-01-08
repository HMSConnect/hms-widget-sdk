const router = require('express').Router()

const config = require('../../config')
const mockStorage = require('../../storage')
const utilsService = require('../../services/utils')
const encounterService = require('../../services/encounter')
const carePlanService = require('../../services/care_plan')
const db = mockStorage.getDB()

router.get('/', (req, res) => {
  try {
    if (db['encounter']) {
      const selector = req.query.filter
        ? encounterService.createSelector(req.query.filter)
        : {}
      const options = req.query
        ? encounterService.createOptions(
            req.query,
            utilsService.createOptions(req.query)
          )
        : {}

      db['encounter'].find(selector, options).fetch(
        results => {
          res.json({
            error: null,
            schema: { ...config.defaultSchema, resourceType: 'encounter' },
            data: results
          })
        },
        error => {
          throw error
        }
      )
    } else {
      throw new Error("The domain resource doesn't exist")
    }
  } catch (error) {
    console.error(error)
    res.json({ error: error.message, data: null })
  }
})

router.get('/type', (req, res) => {
  try {
    if (db['encounter']) {
      const selector = req.query.filter
        ? encounterService.createSelector(req.query.filter)
        : {}
      const options = req.query ? encounterService.createOptions(req.query) : {}
      // force limit for find all type
      db['encounter'].find(selector, { ...options, limit: null }).fetch(
        results => {
          res.json({
            error: null,
            schema: { ...config.defaultSchema, resourceType: 'encounter' },
            data: encounterService.parseToTypes(results)
          })
        },
        error => {
          throw error
        }
      )
    } else {
      throw new Error("The domain resource doesn't exist")
    }
  } catch (error) {
    console.error(error)
    res.json({ error: error.message, data: null })
  }
})

// router.get('/resource-list', async (req, res) => {
//   const domainResources = mockStorage
//     .getDomainNameResourceList()
//     .filter(domainResouce => domainResouce !== 'encounter')

//   const encounters = await new Promise((resolve, reject) => {
//     return db['encounter'].find({}).fetch(data => {
//       resolve(data)
//     }, reject)
//   })

//   const encounterIds = [...new Set(encounters.map(it => it.id))].splice(0, 10)

//   const result = {}
//   for (const encounterId of encounterIds) {
//     result[encounterId] = {}
//     for (const domainResouce of domainResources) {
//       const entry = await new Promise((resolve, reject) => {
//         db[domainResouce].findOne(
//           {
//             'context.reference': `Encounter/${encounterId}`
//           },
//           {},
//           resolve
//         )
//       })

//       result[encounterId][domainResouce] = entry ? 1 : 0
//     }

//     result[encounterId].sum = Object.values(result[encounterId]).reduce(
//       (prev, curr) => prev + curr,
//       0
//     )
//   }

//   let maxEncounter = { sum: 0 }

//   for (const key in result) {
//     const encounter = result[key]
//     if (encounter.sum > maxEncounter.sum) {
//       maxEncounter = encounter
//       maxEncounter.id = key
//     }
//   }

//   // id| allergy_intolerance |
//   // 65787ab8-63e4-4927-9a6c-66c51a10c97c

//   res.json({
//     maxEncounter
//   })
// })

// router.get('/:id/resource-list', async (req, res) => {
//   try {
//     const domainResources = mockStorage
//       .getDomainNameResourceList()
//       .filter(domainResouce => domainResouce !== 'encounter')

//     const results = []
//     for (const domainResouce of domainResources) {
//       const entries = await new Promise((resolve, reject) => {
//         let options = {}
//         if (domainResouce === 'care_plan') {
//           options = carePlanService.createOptions(req.query)
//         } else {
//           options = utilsService.createOptions(req.query)
//         }

//         db[domainResouce]
//           .find(
//             { 'context.reference': `Encounter/${req.params.id}` },
//             { ...options, limit: null } //force limit, use createPaginate slice data instead of
//           )
//           .fetch(resolve, reject)
//       })

//       results.push({
//         schema: {
//           ...config.defaultSchema,
//           resourceType: domainResouce,
//           standard: 'SFHIRX'
//         },
//         resourceType: domainResouce,
//         ...utilsService.createPaginate(entries, req.query)
//       })
//     }

//     res.json({
//       error: null,
//       schema: { ...config.defaultSchema, resourceType: 'encounter' },
//       data: results
//     })
//   } catch (error) {
//     console.error(error)
//     res.json({ error: error.message, data: null })
//   }
// })

module.exports = router

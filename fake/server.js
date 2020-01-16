const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const app = express()
const mockStorage = require('./storage')
const config = require('./config')

const port = process.env.FAKE_PORT || 3002
let db

let initService = function() {
  // Prepare data from ".ndjson" files
  mockStorage.setupStorage()

  // Get instance of storage
  db = mockStorage.getDB()
  // Upsert data to the storage
  mockStorage.loadMockSmartFHIRData(function(key, data) {
    // console.log(`${key}:`, data)

    let fObj = key.split('.')
    let domainNameRes = fObj.length > 1 ? fObj[0] : null

    if (domainNameRes) {
      // console.log(`Upsert domain resource name "${domainNameRes}"...`)
      db[domainNameRes].upsert(
        mockStorage.processingPredata(domainNameRes, data),
        function() {
          // console.log(`Upsert to ${domainNameRes} :`, data)
        }
      )
    }
  })
}

// -----------------------------------------------
// Setup middleware
app.use(cors())

// -----------------------------------------------
// Initial service
initService()

// -----------------------------------------------
// Serv endpoint
// use router

//register router
app.use(
  '/smart-fhir/allergy-intolerance',
  require('./apis/v1/allergy_intolerance')
)
app.use('/smart-fhir/care-plan', require('./apis/v1/care_plan'))
app.use('/smart-fhir/claim', require('./apis/v1/claim'))
app.use('/smart-fhir/condition', require('./apis/v1/condition'))
app.use('/smart-fhir/diagnostic-report', require('./apis/v1/diagnostic_report'))
app.use('/smart-fhir/encounter', require('./apis/v1/encounter'))
app.use('/smart-fhir/immunization', require('./apis/v1/immunization'))
app.use('/smart-fhir/imaging-study', require('./apis/v1/imaging_study'))
app.use('/smart-fhir/observation', require('./apis/v1/observation'))
app.use('/smart-fhir/patient', require('./apis/v1/patient'))
app.use('/smart-fhir/procedure', require('./apis/v1/procedure'))
app.use(
  '/smart-fhir/medication-request',
  require('./apis/v1/medication_request')
)

// HMS
app.get('/hms-connect/:domain_resource', (req, res) => {
  try {
    let fPath = path.join(
      __dirname,
      `/mock/standards/hms_connect/${req.params.domain_resource}.json`
    )
    if (fs.existsSync(fPath)) {
      res.sendFile(fPath)
    }
  } catch (err) {
    console.error(err)
    res.json({ error: err, data: null })
  }
})

// SmartFHIR
app.get('/smart-fhir/:domain_resource/:id', (req, res) => {
  try {
    // Access the storage here
    if (db[req.params.domain_resource]) {
      db[req.params.domain_resource].findOne(
        { id: req.params.id },
        {},
        function(data) {
          // console.log(`${req.params.domain_resource}: ` + data);
          res.json({
            error: null,
            data: data,
            schema: {
              ...config.defaultSchema,
              resourceType: req.params.domain_resource
            }
          })
        }
      )
    } else {
      res.json({ error: "The domain resource doesn't exist", data: null })
    }
  } catch (err) {
    console.error(err)
    res.json({ error: err, data: null })
  }
})

// -----------------------------------------------
// Listening client
app.listen(port, function() {
  console.log(`Providing fake patient data via port ${port}!`)
})

exports.mockStorage = db

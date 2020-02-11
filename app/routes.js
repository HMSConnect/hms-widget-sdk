const nextRoutes = require('next-routes')

module.exports = nextRoutes()
  //////////////////////////////// demo-app /////////////////////////////////
  .add('index', '/')
  .add('patient-search')
  // .add(
  //   'patient-info/encounter',
  //   '/patient-info/:patientId/encounter/:encounterId',
  // )
  .add(
    'patient-info/patient-encounter-medical-record',
    '/patient-info/patient-medical-records',
    'patient-info/patient-encounter-medical-record',
  )
  .add(
    'patient-demographic',
    '/patient-demographic',
    'patient-info/encounter/index',
  )
  .add(
    'patient-info/patient-info-with-table',
    '/patient-info-with-table',
    'patient-info/patient-info-with-table',
  )
  .add(
    'prepare/patient-demographic',
    '/prepare/patient-demographic',
    'prepare/patient-demographic',
  ) //////////////////////////////// embedded-widget /////////////////////////////////
  .add('embedded-widget')
  .add(
    'embedded-widget/patient-search-bar',
    '/embedded-widget/patient-search-bar',
  )
  .add(
    'embedded-widget/patient-search-result',
    '/embedded-widget/patient-search-result',
  )
  .add('embedded-widget/patient-search')
  // .add(
  //   'embedded-widget/patient-info/encounter',
  //   '/embedded-widget/patient-info/:patientId/encounter/:encounterId',
  // )
  .add(
    'embedded-widget/patient-demographic',
    '/embedded-widget/patient-demographic',
    'embedded-widget/patient-info/patient-demographic',
  )
  .add(
    'embedded-widget/patient-encounter-medical-record',
    '/embedded-widget/patient-info/patient-medical-records',
    'embedded-widget/patient-info/encounter/patient-encounter-medical-record',
  )
  .add(
    'embedded-widget/patient-info/demographic-summary',
    '/embedded-widget/patient-info/demographic-summary',
    'embedded-widget/patient-info/patient-demographic-summary',
  )
  .add(
    'embedded-widget/patient-info/encounter-timeline',
    '/embedded-widget/patient-info/encounter-timeline',
    'embedded-widget/patient-info/patient-encounter-timeline',
  )

  .add(
    'embedded-widget/patient-info-with-table',
    '/embedded-widget/patient-info-with-table',
    'embedded-widget/patient-info/patient-info-with-table',
  )

  .add(
    'embedded-widget/patient-info/patient-info-panel',
    '/embedded-widget/patient-info/patient-info-panel',
    'embedded-widget/patient-info/patient-info-panel',
  )
  .add(
    'embedded-widget/medical-records',
    '/embedded-widget/medical-records',
    'embedded-widget/medical-records',
  )
  .add(
    ////////////////// Associated Patient Table Start /////////////////////////
    'embedded-widget/patient-info/allergy-intolerance-table',
    '/embedded-widget/patient-info/allergy-intolerance-table',
    'embedded-widget/patient-info/patient-allergy-intolerance-table',
  )
  .add(
    'embedded-widget/observation/laboratory-table',
    '/embedded-widget/observation/laboratory-table',
    'embedded-widget/observation/observation-laboratory-table',
  )
  .add(
    'embedded-widget/patient-info/condition-table',
    '/embedded-widget/patient-info/condition-table',
    'embedded-widget/patient-info/patient-condition-table',
  )
  .add(
    'embedded-widget/patient-info/immunization-table',
    '/embedded-widget/patient-info/immunization-table',
    'embedded-widget/patient-info/patient-immunization-table',
  )
  .add(
    'embedded-widget/patient-info/medication-request-table',
    '/embedded-widget/patient-info/medication-request-table',
    'embedded-widget/patient-info/patient-medication-request-table',
  )
  .add(
    'embedded-widget/patient-info/procedure-table',
    '/embedded-widget/patient-info/procedure-table',
    'embedded-widget/patient-info/patient-procedure-table',
  )
  .add(
    'embedded-widget/patient-info/care-plan-table',
    '/embedded-widget/patient-info/care-plan-table',
    'embedded-widget/patient-info/patient-care-plan-table',
  )
  .add(
    'embedded-widget/patient-info/claim-table',
    '/embedded-widget/patient-info/claim-table',
    'embedded-widget/patient-info/patient-claim-table',
  )
  .add(
    'embedded-widget/patient-info/imaging-study-table',
    '/embedded-widget/patient-info/imaging-study-table',
    'embedded-widget/patient-info/patient-imaging-study-table',
  ) ////////////////// Associated Patient Table End /////////////////////////
  .add(
    ////////////////// Adaptive Card Start /////////////////////////
    'embedded-widget/medical-records/diagnostic-report-card',
    '/embedded-widget/medical-records/diagnostic-report-card',
    'embedded-widget/medical-records/diagnostic-report-card',
  )
  .add(
    'embedded-widget/observation/laboratory-card',
    '/embedded-widget/observation/laboratory-card',
    'embedded-widget/observation/observation-laboratory-card',
  )
  .add(
    'embedded-widget/observation/vital-sign-card',
    '/embedded-widget/observation/vital-sign-card',
    'embedded-widget/observation/observation-vital-sign-card',
  )
  .add(
    'embedded-widget/observation/blood-pressure-card',
    '/embedded-widget/observation/blood-pressure-card',
    'embedded-widget/observation/observation-blood-pressure-card',
  )
  .add(
    'embedded-widget/observation/temperature-card',
    '/embedded-widget/observation/temperature-card',
    'embedded-widget/observation/observation-temperature-card',
  )
  .add(
    'embedded-widget/observation/encounter/body-measurement-card',
    '/embedded-widget/observation/body-measurement-card',
    'embedded-widget/observation/observation-body-measurement-card',
  )
  .add(
    'embedded-widget/observation/heartbeat-card',
    '/embedded-widget/observation/heartbeat-card',
    'embedded-widget/observation/observation-heartbeat-card',
  )
  .add(
    'embedded-widget/patient-info/patient-allergy-list-card',
    '/embedded-widget/patient-info/patient-allergy-list-card',
    'embedded-widget/patient-info/patient-allergy-list-card',
  )
  .add(
    'embedded-widget/patient-info/patient-medication-request-list-card',
    '/embedded-widget/patient-info/patient-medication-request-list-card',
    'embedded-widget/patient-info/patient-medication-request-list-card',
  )
  .add(
    'embedded-widget/medical-records/allergy-intolerance-card',
    '/embedded-widget/medical-records/allergy-intolerance-card',
    'embedded-widget/medical-records/allergy-intolerance-card',
  ) ////////////////// Adaptive Card End /////////////////////////
  .add(
    ////////////////// Observation Graph Start /////////////////////////
    'embedded-widget/observation/blood-pressure-graph',
    '/embedded-widget/observation/blood-pressure-graph',
    'embedded-widget/observation/observation-blood-pressure-graph',
  )
  .add(
    'embedded-widget/observation/body-height-graph',
    '/embedded-widget/observation/body-height-graph',
    'embedded-widget/observation/observation-body-height-graph',
  )
  .add(
    'embedded-widget/observation/body-weight-graph',
    '/embedded-widget/observation/body-weight-graph',
    'embedded-widget/observation/observation-body-weight-graph',
  ) ////////////////// Observation Graph End /////////////////////////

  .add(
    'embedded-widget/prepare/patient-demographic',
    '/embedded-widget/prepare/patient-demographic',
    'embedded-widget/prepare/patient-demographic',
  )

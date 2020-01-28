const nextRoutes = require('next-routes')

module.exports = nextRoutes()
  .add('index', '/')
  .add('patient-info', '/patient-info/:patientId')
  .add('patient-search')
  .add(
    'patient-info/encounter',
    '/patient-info/:patientId/encounter/:encounterId',
  )
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
  .add(
    'embedded-widget/patient-info/encounter',
    '/embedded-widget/patient-info/:patientId/encounter/:encounterId',
  )
  .add(
    'embedded-widget/patient-info/patient-demograhpic',
    '/embedded-widget/patient-info/:patientId/encounter/:encounterId/patient-demograhpic',
    'embedded-widget/patient-info/patient-demograhpic',
  )
  .add(
    'embedded-widget/patient-info/encounter/demographic',
    '/embedded-widget/patient-info/:patientId/encounter/:encounterId/demographic-summary',
    'embedded-widget/patient-info/patient-demographic-summary',
  )
  .add(
    'embedded-widget/patient-info/encounter-timeline',
    '/embedded-widget/patient-info/encounter-timeline/:patientId',
    'embedded-widget/patient-info/patient-encounter-timeline',
  )
  .add(
    'embedded-widget/patient-info',
    '/embedded-widget/patient-info/:patientId',
  )
  .add(
    'embedded-widget/patient-info/patient-info-panel',
    '/embedded-widget/patient-info/patient-info-panel/:patientId',
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
    '/embedded-widget/patient-info/allergy-intolerance-table/:patientId',
    'embedded-widget/patient-info/patient-allergy-intolerance-table',
  )
  .add(
    'embedded-widget/observation/encounter/observaion-laboratory-table',
    '/embedded-widget/observation/:patientId/encounter/:encounterId/observation-laboratory-table',
    'embedded-widget/observation/observation-laboratory-table',
  )
  .add(
    'embedded-widget/patient-info/condition-table',
    '/embedded-widget/patient-info/condition-table/:patientId',
    'embedded-widget/patient-info/patient-condition-table',
  )
  .add(
    'embedded-widget/patient-info/immunization-table',
    '/embedded-widget/patient-info/immunization-table/:patientId',
    'embedded-widget/patient-info/patient-immunization-table',
  )
  .add(
    'embedded-widget/patient-info/medication-request-table',
    '/embedded-widget/patient-info/medication-request-table/:patientId',
    'embedded-widget/patient-info/patient-medication-request-table',
  )
  .add(
    'embedded-widget/patient-info/procedure-table',
    '/embedded-widget/patient-info/procedure-table/:patientId',
    'embedded-widget/patient-info/patient-procedure-table',
  )
  .add(
    'embedded-widget/patient-info/care-plan-table',
    '/embedded-widget/patient-info/care-plan-table/:patientId',
    'embedded-widget/patient-info/patient-care-plan-table',
  )
  .add(
    'embedded-widget/patient-info/claim-table',
    '/embedded-widget/patient-info/claim-table/:patientId',
    'embedded-widget/patient-info/patient-claim-table',
  )
  .add(
    'embedded-widget/patient-info/imaging-study-table',
    '/embedded-widget/patient-info/imaging-study-table/:patientId',
    'embedded-widget/patient-info/patient-imaging-study-table',
  ) ////////////////// Associated Patient Table End /////////////////////////
  .add(
    ////////////////// Adaptive Card Start /////////////////////////
    'embedded-widget/medical-records/diagnostic-report-card',
    '/embedded-widget/medical-records/diagnostic-report-card',
    'embedded-widget/medical-records/diagnostic-report-card',
  )
  .add(
    'embedded-widget/medical-records/observation-laboratory-card',
    '/embedded-widget/medical-records/observation-laboratory-card',
    'embedded-widget/medical-records/observation-laboratory-card',
  )
  .add(
    'embedded-widget/medical-records/observation-vital-sign-card',
    '/embedded-widget/medical-records/observation-vital-sign-card',
    'embedded-widget/medical-records/observation-vital-sign-card',
  )
  .add(
    'embedded-widget/observation/encounter/blood-pressure-card',
    '/embedded-widget/observation/:patientId/encounter/:encounterId/blood-pressure-card',
    'embedded-widget/observation/observation-blood-pressure-card',
  )
  .add(
    'embedded-widget/observation/encounter/temperature-card',
    '/embedded-widget/observation/:patientId/encounter/:encounterId/temperature-card',
    'embedded-widget/observation/observation-temperature-card',
  )
  .add(
    'embedded-widget/observation/encounter/-body-measurement-card',
    '/embedded-widget/observation/:patientId/encounter/:encounterId/body-measurement-card',
    'embedded-widget/observation/observation-body-measurement-card',
  )
  .add(
    'embedded-widget/observation/encounter/heartbeat-card',
    '/embedded-widget/observation/:patientId/encounter/:encounterId/heartbeat-card',
    'embedded-widget/observation/observation-heartbeat-card',
  )
  .add(
    'embedded-widget/patient-info/encounter/patient-allergy-list-card',
    '/embedded-widget/patient-info/:patientId/encounter/:encounterId/patient-allergy-list-card',
    'embedded-widget/patient-info/patient-allergy-list-card',
  )
  .add(
    'embedded-widget/patient-info/encounter/patient-medication-request-list-card',
    '/embedded-widget/patient-info/:patientId/encounter/:encounterId/patient-medication-request-list-card',
    'embedded-widget/patient-info/patient-medication-request-list-card',
  )
  .add(
    'embedded-widget/medical-records/allergy-intolerance-card',
    '/embedded-widget/medical-records/allergy-intolerance-card',
    'embedded-widget/medical-records/allergy-intolerance-card',
  ) ////////////////// Adaptive Card End /////////////////////////
  .add(
    ////////////////// Observation Graph Start /////////////////////////
    'embedded-widget/observation/encounter/observaion-blood-pressure-graph',
    '/embedded-widget/observation/:patientId/encounter/:encounterId/observation-blood-pressure-graph',
    'embedded-widget/observation/observation-blood-pressure-graph',
  )
  .add(
    'embedded-widget/observation/encounter/observaion-body-height-graph',
    '/embedded-widget/observation/:patientId/encounter/:encounterId/observation-body-height-graph',
    'embedded-widget/observation/observation-body-height-graph',
  )
  .add(
    'embedded-widget/observation/encounter/observaion-body-weight-graph',
    '/embedded-widget/observation/:patientId/encounter/:encounterId/observation-body-weight-graph',
    'embedded-widget/observation/observation-body-weight-graph',
  ) ////////////////// Observation Graph End /////////////////////////

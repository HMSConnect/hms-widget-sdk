type PatientLabSummaryCardType = 'SET_STRUCTURE_PATIENT_LAB_SUMMARY_CARD'

interface IPatientLabSummaryCardAction {
  type: PatientLabSummaryCardType
  payload: any
}

const initialState: any = {
  structure: {},
}
const patientLabSummaryCard = (
  state = initialState,
  action: IPatientLabSummaryCardAction,
) => {
  switch (action.type) {
    case 'SET_STRUCTURE_PATIENT_LAB_SUMMARY_CARD':
      return {
        ...state,
        structure: {
          ...state.structure,
          ...action.payload,
        },
      }
    default:
      return state
  }
}

export default patientLabSummaryCard
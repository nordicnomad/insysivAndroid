Inventory, Cases
export const PatientsSchema = {
  name: 'patients',
  primaryKey: 'patientId',
  properties: {
    patientId: 'string',
    patientName: 'string',
    patientNumber: 'string',
  }
}

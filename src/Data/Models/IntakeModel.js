export const IntakeSchema = {
  name: 'intake',
  primaryKey: 'intakeId',
  properties: {
    intakeId: 'string',
    organizationId: 'string',
    intakeStartTime: 'date',
    totalCount: 'int',
    scannedProducts: {type: 'list', objectType: 'Product'},
  }
}

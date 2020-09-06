export const CaseSchema = {
  name: 'Case',
  primaryKey: 'caseId',
  properties: {
    caseId: 'string',
    organizationId: 'string',
    intakeStartTime: 'date',
    totalCount: 'int',
    scannedTags: {type: 'list', objectType: 'scannedTag'},
  }
}

export const ScannedTagSchema = {
  name: 'scannedTag',
  primaryKey: 'tagId',
  properties: {
    tagId: 'string',
    count: 'int',
    scannedDate: 'date',
    productName: 'string',
    barcode: 'string',
    tagcode: 'string',
    model: 'string',
    lotSerial: 'string',
    expiration: 'date',
  }
};

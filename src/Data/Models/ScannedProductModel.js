import Utils from '../DBUtils'

class ScannedProductModel  {
  constructor() {

  }
  name: 'scannedProduct',
  primaryKey: 'productId',
  properties: {
    productId: 'string',
    count: 'int',
    scannedDate: 'date',
    productName: 'string',
    barcode: 'string',
    model: 'string',
    lotSerial: 'string',
    expiration: 'date',
  }
};

module.exports = ScannedProductModel

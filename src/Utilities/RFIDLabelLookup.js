
var Realm = require('realm');
//instatiate database variables
let products ;
let rfidLabels ;

export function RFIDlabelSearch(rfidLabel) {
  let passedLabel = rfidLabel
  let matchedLabel = {
    licenseNumber: "",
    productModelNumber: "",
    lotSerialNumber: "",
    expirationDate: "",
    tagid: "",
  }
  let matchedRfidProduct = {
    licenseNumber: "",
    productModelNumber: "",
    orderThruVendor: "",
    productDescription: "",
    autoReplace: "",
    discontinued: "",
    productCategory: "",
    hospitalItemNumber: "",
    unitOfMeasure: "",
    unitOfMeasureQuantity: "",
    reorderValue: "",
    quantityOnHand: "",
    quantityOrdered: "",
    lastRequistionNumber: "",
    orderStatus: "",
    active: "",
    accepted: "",
    consignment: "",
    minimumValue: "",
    maximumValue: "",
    nonOrdered: "",
    productNote: "",
  }

  //Define database schemas
  rfidLabels = new Realm({
    schema: [{name: 'RFID_Labels',
    properties: {
      productTransactionNumber: "int?",
      licenseNumber: "string",
      productModelNumber: "string",
      lotSerialNumber: "string?",
      expirationDate: "string?",
      tagid: "string?",
      caseProductSequence: "int?",
      bcPrimary: "string?",
      bcSecondary: "string?",
    }}]
  });
  products = new Realm({
    schema: [{name: 'Products_Lookup',
    properties:
    {
        licenseNumber: "string",
        productModelNumber: "string",
        orderThruVendor: "string",
        productDescription: "string",
        autoReplace: "string",
        discontinued: "string",
        productCategory: "string",
        hospitalItemNumber: "string?",
        unitOfMeasure: "string",
        unitOfMeasureQuantity: "int",
        reorderValue: "int",
        quantityOnHand: "int",
        quantityOrdered: "int",
        lastRequistionNumber: "int?",
        orderStatus: "string",
        active: "string",
        accepted: "string",
        consignment: "string",
        minimumValue: "int",
        maximumValue: "int",
        nonOrdered: "string",
        productNote: "string?",

    }}]
  });

  //initialize database objects
  let rfidTable = fridLabels.objects('RFID_Labels')

  //check for rfid label barcode match
  if(passedLabel != null && passedLabel != undefined) {
    let buildLabelFilterString = 'tagid CONTAINS "' + passedLabel + '"'
    let filteredLabelMatches = rfidTable.filtered(buildLabelFilterString)

    filteredLabelMatches.forEach((label, i) => {
      matchedLabel = {
        licenseNumber: label.licenseNumber,
        productModelNumber: label.productModelNumber,
        lotSerialNumber: label.lotSerialNumber,
        expirationDate: label.expirationDate,
        tagid: label.tagid,
      }
    })
  }

  if(matchedLabel.productModelNumber === '' || matchedLabel.productModelNumber === null || matchedLabel.productModelNumber === undefined) {
    matchedRfidProduct = {
      licenseNumber: "Error / No Match",
      productModelNumber: "0000",
      lotSerialNumber: "0000",
      expirationDate: "NA",
      tagid: "0000",
      orderThruVendor: '',
      productDescription: 'Unknown Product',
      autoReplace: '',
      discontinued: '',
      productCategory: '',
      hospitalItemNumber: '',
      unitOfMeasure: '',
      unitOfMeasureQuantity: '',
      reorderValue: '',
      quantityOnHand: '',
      quantityOrdered: '',
      lastRequistionNumber: '',
      orderStatus: '',
      active: '',
      accepted: '',
      consignment: '',
      minimumValue: '',
      maximumValue: '',
      nonOrdered: '',
      productNote: '',
    }
  }
  else {
    let buildProductFilterString = 'productModelNumber CONTAINS "' + matchedLabel.productModelNumber + '"'
    let filteredProductMatches = productTable.filtered(buildProductFilterString)

    filteredProductMatches.forEach((product, i) => {
      matchedRfidProduct = {
        licenseNumber: product.licenseNumber,
        lotSerialNumber: matchedLabel.lotSerialNumber,
        expirationDate: matchedLabel.expirationDate,
        tagid: matchedLabel.tagid,
        productModelNumber: product.productModelNumber,
        orderThruVendor: product.orderThruVendor,
        productDescription: product.productDescription,
        autoReplace: product.autoReplace,
        discontinued: product.discontinued,
        productCategory: product.productCategory,
        hospitalItemNumber: product.hospitalItemNumber,
        unitOfMeasure: product.unitOfMeasure,
        unitOfMeasureQuantity: product.unitOfMeasureQuantity,
        reorderValue: product.reorderValue,
        quantityOnHand: product.quantityOnHand,
        quantityOrdered: product.quantityOrdered,
        lastRequistionNumber: product.lastRequistionNumber,
        orderStatus: product.orderStatus,
        active: product.active,
        accepted: product.accepted,
        consignment: product.consignment,
        minimumValue: product.minimumValue,
        maximumValue: product.maximumValue,
        nonOrdered: product.nonOrdered,
        productNote: product.productNote,
      }
    })
  }
  //return
  return(matchedRfidProduct)
}

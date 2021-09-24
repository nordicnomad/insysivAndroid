import { BarcodeSearch } from '../Utilities/BarcodeLookup'

var Realm = require('realm');
//instatiate database variables
let products ;
let rfidLabels ;

export function RFIDlabelSearch(rfidLabel, lastReturnObject, lastCompleteFlag) {
  console.log("RFID LOOKUP LAST RETURN OBJECT")
  console.log(lastReturnObject)
  let passedLabel = rfidLabel
  let matchedLabel = {
    licenseNumber: "",
    productModelNumber: "",
    lotSerialNumber: "",
    expirationDate: "",
    tagid: "",
  }
  let matchedRfidProduct = {
    scannedLabel: rfidLabel,
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
    passThroughCompletenessFlag: lastCompleteFlag,
    invalidScanSegment: false,
  }

  //Define database schemas
  rfidLabels = new Realm({
    schema: [{name: 'RFID_Labels',
    properties: {
      licenseNumber: "string?",
      productModelNumber: "string",
      lotSerialNumber: "string?",
      expirationDate: "string?",
      tagid: "string?",
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
  let rfidTable = rfidLabels.objects('RFID_Labels')

  //check for rfid label barcode match
  if(passedLabel != null && passedLabel != undefined && passedLabel.substring(0,3) === "000") {
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

    if(matchedLabel.productModelNumber != null && matchedLabel.productModelNumber != undefined && matchedLabel.productModelNumber != '') {
      let buildProductFilterString = 'productModelNumber CONTAINS "' + matchedLabel.productModelNumber + '"'
      let productObjects = products.objects("Products_Lookup")
      let filteredProductMatches = productObjects.filtered(buildProductFilterString)

      filteredProductMatches.forEach((product, i) => {
        matchedRfidProduct = {
          scannedLabel: rfidLabel,
          licenseNumber: product.licenseNumber,
          lotSerialNumber: matchedLabel.lotSerialNumber,
          expirationDate: matchedLabel.expirationDate,
          tagid: matchedLabel.tagid,
          productModelNumber: product.productModelNumber,
          orderThruVendor: product.orderThruVendor,
          productDescription: product.productDescription,
          scannedRfid: true,
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
          passThroughCompletenessFlag: true,
          invalidScanSegment: false,
          isUnknown: false,
        }
      })
    }
    else {
      matchedRfidProduct = {
        scannedLabel: rfidLabel,
        licenseNumber: "No Match",
        productModelNumber: "0000",
        lotSerialNumber: "0000",
        expirationDate: "01-01-2300",
        tagid: "0000",
        orderThruVendor: '',
        productDescription: 'Unknown Label',
        scannedRfid: true,
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
        passThroughCompletenessFlag: true,
        invalidScanSegment: false,
        isUnknown: true,
      }
    }

  }

  if(passedLabel.substring(0,3) !== "000") {
    let barcodeSecondaryLookup = BarcodeSearch(rfidLabel, lastReturnObject, lastCompleteFlag)

    if(barcodeSecondaryLookup != null && barcodeSecondaryLookup != undefined) {
      console.log('BARCODE SECONDARY LOOKUP')
      console.log(barcodeSecondaryLookup)
      let lotSerial = ''
      if(barcodeSecondaryLookup.batchOrLotNumber === null || barcodeSecondaryLookup.batchOrLotNumber === '' || barcodeSecondaryLookup.batchOrLotNumber === undefined) {
        lotSerial = barcodeSecondaryLookup.serialNumber
      }
      else if(barcodeSecondaryLookup.serialNumber === null || barcodeSecondaryLookup.serialNumber === '' || barcodeSecondaryLookup.serialNumber === undefined) {
        lotSerial = barcodeSecondaryLookup.batchOrLotNumber
      }
      else {
        lotSerial = barcodeSecondaryLookup.batchOrLotNumber + "/" + barcodeSecondaryLookup.serialNumber
      }
      matchedRfidProduct = {
        scannedLabel: rfidLabel,
        licenseNumber: barcodeSecondaryLookup.licenseNumber,
        productModelNumber: barcodeSecondaryLookup.productModelNumber,
        lotSerialNumber: lotSerial,
        expirationDate: barcodeSecondaryLookup.expirationDate,
        tagid: barcodeSecondaryLookup.barcode,
        orderThruVendor: barcodeSecondaryLookup.orderThruVendor,
        productDescription: barcodeSecondaryLookup.productDescription,
        scannedRfid: false,
        autoReplace: barcodeSecondaryLookup.autoReplace,
        discontinued: barcodeSecondaryLookup.discontinued,
        productCategory: barcodeSecondaryLookup.productCategory,
        hospitalItemNumber: barcodeSecondaryLookup.hospitalItemNumber,
        unitOfMeasure: barcodeSecondaryLookup.unitOfMeasure,
        unitOfMeasureQuantity: barcodeSecondaryLookup.unitOfMeasureQuantity,
        reorderValue: barcodeSecondaryLookup.reorderValue,
        quantityOnHand: barcodeSecondaryLookup.quantityOnHand,
        quantityOrdered: barcodeSecondaryLookup.quantityOrdered,
        lastRequistionNumber: barcodeSecondaryLookup.lastRequistionNumber,
        orderStatus: barcodeSecondaryLookup.orderStatus,
        active: barcodeSecondaryLookup.active,
        accepted: barcodeSecondaryLookup.accepted,
        consignment: barcodeSecondaryLookup.consignment,
        minimumValue: barcodeSecondaryLookup.minimumValue,
        maximumValue: barcodeSecondaryLookup.maximumValue,
        nonOrdered: barcodeSecondaryLookup.nonOrdered,
        productNote: barcodeSecondaryLookup.productNote,
        passThroughCompletenessFlag: barcodeSecondaryLookup.passThroughCompletenessFlag,
        invalidScanSegment: barcodeSecondaryLookup.invalidScanSegment,
        isUnknown: false,
      }
    }
    else {
      matchedRfidProduct = {
        scannedLabel: rfidLabel,
        licenseNumber: "Error / No Match",
        productModelNumber: "0000",
        lotSerialNumber: "0000",
        expirationDate: "01-01-2300",
        tagid: "0000",
        orderThruVendor: '',
        productDescription: 'Unknown Product',
        scannedRfid: false,
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
        passThroughCompletenessFlag: true,
        invalidScanSegment: false,
        isUnknown: true,
      }
    }
  }
  //return
  return(matchedRfidProduct)
}

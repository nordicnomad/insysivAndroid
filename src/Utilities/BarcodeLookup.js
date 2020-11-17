import { DecodeUCC } from '../Utilities/DecodeUCC'
import { DecodeHIBC } from '../Utilities/DecodeHIBC'

var Realm = require('realm');
//instatiate database variables
let products ;
let productBarCodes ;

export function BarcodeSearch(barcode, lastReturnObject, lastCompleteFlag) {
  //Initialize global and UI variables
  let passedBarcode = barcode
  let matchedProduct = {}
  let noDBmatchFlag = true

  // ucc state tree for multiple concatenated Application Identifier types in one barcode.
  let uccDecodeReturnObject = {
    // ucc (00) 18 digits - numeric
    serialContainerCode: '',
    // ucc (01) 14 digits - numeric
    containerCodeVendorLicense: '',
    containerCodeModelNumber: '',
    // ucc (02) 14 digits - numeric
    numberOfContainers: '',
    // ucc (10) 1-20 alphanumeric
    batchOrLotNumber: '',
    // ucc (17) 6 digit YYMMDD
    expirationDate: '',
    // ucc (20) 2 digits
    productVariant: '',
    // ucc (21) 1-20 alphanumeric
    serialNumber: '',
    // ucc (22) 1-29 alphanumeric
    hibcc: '',
    // ucc (23) 1-19 alphanumeric
    lotNumber: '',
    // ucc (30) number of requisit length
    quantityEach: '',
    // ucc (240) 1-30 alphanumeric
    secondaryProductAttributes: '',
    // ucc (250) 1-30 alphanumeric
    secondarySerialNumber: '',
    // ucc (37) 1-8 digits
    quantityOfUnitsContained: '',
  }

  // hibc state tree for multiple concatenated barcode types
  let hibcDecodeReturnObject = {
    hibcVendorLicense: '',
    hibcModelNumber: '',
    hibcSerialNumber: '',
    hibcExpirationDate: '',
    hibcLotNumber: '',
    hibcQuantity: '',
    hibcManufactureDate: '',
  }

  //Database schemas
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
  productBarCodes = new Realm({
    schema: [{name: 'Product_Bar_Codes',
    properties: {
      productBarCode1: "string",
      licenseNumber: "string",
      productModelNumber: "string",
      encoding: "int?"
    }}]
  });
  //initialize database objects
  let productTable = products.objects('Products_Lookup')
  let barcodeTable = productBarCodes.objects('Product_Bar_Codes')

  //check for encoding identifier
  if(passedBarcode.substring(0,1) === '+' || passedBarcode.substring(0,1) === '$') {
    let hibcAIcharLocations = []
    let hibcAppIdentifiers = []
    let hibcAppStrings = []

    //Seperate barcode elements

    //loop ahead to close position adding contents to AppIdentifier Variable

    //Search DB tables for vendor and model match
    productTable.forEach((product, i) => {
      console.log("Search Product Model Number")
      console.log(product.productModelNumber)
      if(product.productModelNumber === productModelNumber) {
        console.log("MATCHED PRODUCT VENDOR LICENSE")
        matchedProduct = product
        noDBmatchFlag = false
      }
    });


    //Decode HIBC passedBarcode strings


    //Return usable product object to save to working product scan DB.
    matchedProduct = {
      barcode: passedBarcode,
      trayState: false,
      isUnknown: false,
      name: "HIBCC Barcode Product",
      model: productModelNumber,
      lotSerial: productVendorLicense,
      expiration: "????",
      count: 1,
      scannedTime: "Now",
      waste: false,
      scanned: false,
    }
  }
  else if(passedBarcode.substring(0,1) === '(') {
    let uccAIparenLocations = []
    let uccAppIdentifiers = []
    let uccAppStrings = []

    //Seperate barcode elements
    for(i=0; (passedBarcode.length - 1); i++) {
      if(passedBarcode.charAt[i] === '(' || passedBarcode.charAt[i] === ')') {
        uccAIparenLocations.push(
          {
            char: passedBarcode.charAt[i],
            pos: i,
          }
        )
      }
    }
    uccAIparenLocations.forEach((location, i) => {
      let startPosition = 0
      let endPosition = 0
      let buildAppIdentifier = ''
      let buildBarcodeString = ''
      if(location.char === '(') {
        startPosition = location.pos
        //Might need to add a check on array length to ensure all open parens
        //have a corresponding close.
        endPosition = uccAIparenLocations[i+1].pos

        //loop ahead to close position adding contents to AppIdentifier Variable
        for(p=startPosition; endPosition; p++) {
          buildAppIdentifier = buildAppIdentifier + passedBarcode[p]
        }
        uccAppIdentifiers.push(buildAppIdentifier)
      }
      else if(location.char === ')') {
        evalPosition = location.pos + 1
        endOfString = false

        // Starting with the character after the close add characters to build string
        // until end of string or new opening character are encountered.
        while(endOfString === false) {
          if(passedBarcode.charAt[evalPosition] != '(' && evalPosition < passedBarcode.length) {
            buildBarcodeString.push(passedBarcode.charAt[evalPosition])
          }
          evalPosition = evalPosition + 1
        }
        uccAppStrings.push(buildBarcodeString)
      }
    })

    //Decode UCC passedBarcode string
    uccAppIdentifiers.forEach((identifier, i) => {
      uccDecodeReturnObject = DecodeUCC(identifier, uccAppStrings[i], uccDecodeReturnObject)
    })


    //Search DB tables for vendor and model match
    if(uccDecodeReturnObject.productModelNumber != '') {
      let searchCount = 0
      productTable.forEach((product, i) => {
        console.log('UCC SEARCHCOUNT')
        console.log(searchCount)
        if(product.productModelNumber === uccDecodeReturnObject.productModelNumber) {
          console.log("MATCHED PRODUCT VENDOR LICENSE")
          matchedProduct = {
            licenseNumber: product.licenseNumber,
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
          noDBmatchFlag = false
        }
        searchCount = searchCount + 1
      });
    }

    //Return usable product object to save to working product scan DB.
    //Consolidate information from decoded barcode with matched DB values.
    matchedProduct = {
      barcode: passedBarcode,
      name: "UCC Barcode Product",
      model: productModelNumber,
      lotSerial: productVendorLicense,
      expiration: "????",

      trayState: false,
      isUnknown: false,
      count: 1,
      scannedTime: "Now",
      waste: false,
      scanned: false,
    }
  }

  if(noDBmatchFlag === true) {
    //Run lookup of local barcode table with passedBarcode string
    matchedProduct = {
      barcode: passedBarcode,
      trayState: false,
      isUnknown: true,
      name: "Unknown Product",
      model: productModelNumber,
      lotSerial: productVendorLicense,
      expiration: "????",
      count: 1,
      scannedTime: "Now",
      waste: false,
      scanned: false,
    }
  }

  console.log("MATCHEDPRODUCT OBJECT")
  console.log(matchedProduct)
  return (matchedProduct)
}

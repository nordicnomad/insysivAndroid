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
  let decodeReturnObject = {
    // ucc (00) 18 digits - numeric
    serialContainerCode: '',
    // ucc (01) 14 digits - numeric
    productModelNumber: '',
    productVendorLicense: '',
    // ucc (02) 14 digits - numeric
    numberOfContainers: '',
    // ucc (10) 1-20 alphanumeric
    batchOrLotNumber: '',
    // ucc (17) 6 digit YYMMDD
    expirationDate: '',
    hibcExpirationDate: '',
    // ucc (20) 2 digits
    productVariant: '',
    // ucc (21) 1-20 alphanumeric
    serialNumber: '',
    hibcSerialNumber: '',
    // ucc (22) 1-29 alphanumeric
    hibcc: '',
    // ucc (23) 1-19 alphanumeric
    lotNumber: '',
    hibcLotNumber: '',
    // ucc (30) number of requisit length
    quantityEach: '',
    // ucc (240) 1-30 alphanumeric
    secondaryProductAttributes: '',
    hibcSecondaryExpiration: '',
    hibcSecondaryManufacture: '',
    // ucc (250) 1-30 alphanumeric
    secondarySerialNumber: '',
    hibcSecondarySerial: '',
    // ucc (37) 1-8 digits
    quantityOfUnitsContained: '',
    //hibc return properties
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
    let lastCharacter = ''
    let lastInitialPosition = 0

    //Seperate barcode elements starting positions
    for(i=0; (passedBarcode.length - 1); i++) {
      if(passedBarcode.charAt[i] === "+" && lastCharacter != "$") {
        hibcAIcharLocations.push({
          char: passedBarcode.charAt[i],
          pos: i
        })
        lastInitialPosition = i
      }
      else if(passedBarcode.charAt[i] === "$" && lastCharacter != "$" && (lastInitialPosition + 3) < i) {
        hibcAIcharLocations.push({
          char: passedBarcode.charAt[i],
          pos: i
        })
        lastInitialPosition = i
      }
      else if (passedBarcode.charAt[i] === "/") {
        hibcAIcharLocations.push({
          char: passedBarcode.charAt[i],
          pos: i
        })
        lastInitialPosition = i
      }
      lastCharacter = passedBarcode.charAt[i]
    }

    //Add first four characters from initial locations to app identifier array
    hibcAIcharLocations.forEach((location, i) => {
      let buildHibcIdentifierString = ''

      for(s = location.pos; s < (location.pos + 3); s++) {
        buildHibcIdentifierString = buildHibcIdentifierString + passedBarcode.charAt[s]
      }
      hibcAppIdentifiers.push(buildHibcIdentifierString)
    });

    //Add entire string elements between initial locations to app strings array
    hibcAIcharLocations.forEach((location, i) => {
      let evalHibcPosition = location.pos
      let buildHibcBarcodeString = ''
      if((i+1) < hibcAIcharLocations.length) {
        let currentHibcPosition = evalHibcPosition
        while(hibcAIcharLocations[i+1].pos > evalHibcPosition) {
          buildHibcBarcodeString = buildHibcBarcodeString + passedBarcode.charAt[currentHibcPosition]
          currentHibcPosition = currentHibcPosition + 1
        }
      }
      else {
        let currentHibcPosition = evalHibcPosition
        while(passedBarcode.length > (currentHibcPosition + 1)) {
          buildHibcBarcodeString = buildHibcBarcodeString + passedBarcode.charAt[currentHibcPosition]
          currentHibcPosition = currentHibcPosition + 1
        }
      }
      hibcAppStrings.push(buildHibcBarcodeString)
    });

    //Decode HIBC string elements and populate return object
    hibcAppIdentifiers.forEach((identifier, i) => {
      decodeReturnObject = DecodeHIBC(identifier, hibcAppStrings[i], decodeReturnObject)
    })
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
          if(evalPosition >= passedBarcode.length) {
            endOfString = true
          }
        }
        uccAppStrings.push(buildBarcodeString)
      }
    })

    //Decode UCC passedBarcode string
    uccAppIdentifiers.forEach((identifier, i) => {
      decodeReturnObject = DecodeUCC(identifier, uccAppStrings[i], decodeReturnObject)
    })

  }

  //Search DB tables for vendor and model match
  if(decodeReturnObject.productModelNumber != '') {
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

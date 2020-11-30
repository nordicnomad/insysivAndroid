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
  console.log("BARDCODE PASSED TO BARCODE LOOKUP")
  console.log(barcode)
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
    for(i=0; i < (passedBarcode.length - 1); i++) {
      if(passedBarcode.charAt(i) === "+" && lastCharacter != "$") {
        hibcAIcharLocations.push({
          char: passedBarcode.charAt(i),
          pos: i
        })
        lastInitialPosition = i
      }
      else if(passedBarcode.charAt(i) === "$" && lastCharacter != "$" && (lastInitialPosition + 3) < i) {
        hibcAIcharLocations.push({
          char: passedBarcode.charAt(i),
          pos: i
        })
        lastInitialPosition = i
      }
      else if (passedBarcode.charAt(i) === "/") {
        hibcAIcharLocations.push({
          char: passedBarcode.charAt(i),
          pos: i
        })
        lastInitialPosition = i
      }
      lastCharacter = passedBarcode.charAt(i)
    }

    //Add first four characters from initial locations to app identifier array
    hibcAIcharLocations.forEach((location, i) => {
      let buildHibcIdentifierString = ''

      for(s = location.pos; s < (location.pos + 3); s++) {
        buildHibcIdentifierString = buildHibcIdentifierString + passedBarcode.charAt(s)
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
          buildHibcBarcodeString = buildHibcBarcodeString + passedBarcode.charAt(currentHibcPosition)
          currentHibcPosition = currentHibcPosition + 1
        }
      }
      else {
        let currentHibcPosition = evalHibcPosition
        while(passedBarcode.length > (currentHibcPosition + 1)) {
          buildHibcBarcodeString = buildHibcBarcodeString + passedBarcode.charAt(currentHibcPosition)
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
    console.log("UCC BARCODE DETECTED")
    let uccAIparenLocations = []
    let uccAppIdentifiers = []
    let uccAppStrings = []

    //Seperate barcode elements
    for(i=0; i < (passedBarcode.length - 1); i++) {
      console.log(passedBarcode.charAt(i))
      if(passedBarcode.charAt(i) === '(' || passedBarcode.charAt(i) === ')') {
        uccAIparenLocations.push(
          {
            char: passedBarcode.charAt(i),
            pos: i,
          }
        )
      }
    }
    console.log("UCC API PAREN LOCATIONS")
    console.log(uccAIparenLocations)
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
        for(p=startPosition; p < endPosition + 1; p++) {
          console.log(passedBarcode[p])
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
          if(passedBarcode.charAt(evalPosition) != '(' && evalPosition < passedBarcode.length) {
            buildBarcodeString = buildBarcodeString + passedBarcode.charAt(evalPosition)
          }
          evalPosition = evalPosition + 1
          if(evalPosition >= passedBarcode.length) {
            endOfString = true
          }
        }
        uccAppStrings.push(buildBarcodeString)
      }
    })
    console.log("UCC APP IDENTIFIERS")
    console.log(uccAppIdentifiers)
    console.log("UCC APP STRINGS")
    console.log(uccAppStrings)
    //Decode UCC passedBarcode string
    uccAppIdentifiers.forEach((identifier, i) => {
      decodeReturnObject = DecodeUCC(identifier, uccAppStrings[i], decodeReturnObject)
    })
    console.log("DECODED RETURN OBJECT")
    console.log(decodeReturnObject)
  }

  //Search DB tables for vendor and model match
  if(decodeReturnObject.productModelNumber != '') {
    let searchCount = 0
    productTable.forEach((product, i) => {
      console.log('PRODUCT SEARCHCOUNT')
      console.log(searchCount)
      if(product.productModelNumber === decodeReturnObject.productModelNumber) {
        console.log("MATCHED PRODUCT VENDOR LICENSE")
        matchedProduct = {
          barcode: passedBarcode,
          trayState: false,
          isUnknown: false,
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
          scannedTime: new Date("YYMMDD"),
          count: 1,
          waste: false,
          scanned: true,
        }
        noDBmatchFlag = false
      }
      searchCount = searchCount + 1
    });
  }

  if(noDBmatchFlag === true && decodeReturnObject.productModelNumber != '') {
    //Run lookup of local barcode table with passedBarcode string
    matchedProduct = {
      barcode: passedBarcode,
      trayState: false,
      isUnknown: true,
      name: "Unknown Product",
      model: "number",
      lotSerial: "number",
      expiration: "????",
      count: 1,
      scannedTime: "Now",
      waste: false,
      scanned: false,
    }
  }

  //Return usable product object to save to working product scan DB.
  //Consolidate information from decoded barcode with matched DB values.

  let combinedProductReturn = {...matchedProduct, ...decodeReturnObject}

  console.log("MATCHEDPRODUCT OBJECT")
  console.log(matchedProduct)
  console.log(decodeReturnObject)
  console.log(combinedProductReturn)
  return (combinedProductReturn)
}

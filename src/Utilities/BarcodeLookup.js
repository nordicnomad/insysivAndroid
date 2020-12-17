import { DecodeUCC } from '../Utilities/DecodeUCC'
import { DecodeHIBC } from '../Utilities/DecodeHIBC'

var Realm = require('realm');
//instatiate database variables
let products ;
let productBarCodes ;

export function BarcodeSearch(barcode, lastReturnObject, lastCompleteFlag) {
  //Initialize global and UI variables
  let passedBarcode = barcode
  let primaryCode = ''
  let matchedProduct = {}
  let noDBmatchFlag = true
  console.log("BARDCODE PASSED TO BARCODE LOOKUP")
  console.log(barcode)
  // ucc state tree for multiple concatenated Application Identifier types in one barcode.
  let decodeReturnObject = {
    // ucc (00) 18 digits - numeric
    serialContainerCode: '',
    // ucc (01) 14 digits - numeric
    manufacturerModelNumber: '',
    vendorLicenseNumber: '',
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
    //Check and return in next call if complete barcode flag
    passThroughCompletenessFlag: false,
  }

  if(lastReturnObject != null && lastCompleteFlag === false) {
    decodeReturnObject = lastReturnObject
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
      console.log("SEPERATEBARCODE LOOPING")
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

    console.log("HIBCAPICHARLOCATIONS AFTER BUILD")
    console.log(hibcAIcharLocations)

    //Add first four characters from initial locations to app identifier array
    hibcAIcharLocations.forEach((location, i) => {
      let buildHibcIdentifierString = ''

      for(s = location.pos; s < (location.pos + 5); s++) {
        console.log("BUILDHIBCIDS LOOPING")
        buildHibcIdentifierString = buildHibcIdentifierString + passedBarcode.charAt(s)
      }
      hibcAppIdentifiers.push(buildHibcIdentifierString)
    });

    console.log("HIBC AI APP IDENTIFIERS AFTER BUILD")
    console.log(hibcAppIdentifiers)

    //Add entire string elements between initial locations to app strings array
    hibcAIcharLocations.forEach((location, i) => {
      let evalHibcPosition = location.pos
      let buildHibcBarcodeString = ''
      if((i+1) < hibcAIcharLocations.length) {
        let currentHibcPosition = evalHibcPosition
        let continueEval = true
        while(continueEval === true) {
          buildHibcBarcodeString = buildHibcBarcodeString + passedBarcode.charAt(currentHibcPosition)
          currentHibcPosition = currentHibcPosition + 1
          if(passedBarcode.length < currentHibcPosition) {
            continueEval = false
          }
          else if(hibcAIcharLocations[i+1].pos < currentHibcPosition) {
            continueEval = false
          }
          console.log("AICHARLOC LOOPING")
          console.log(hibcAIcharLocations[i+1])
          console.log(buildHibcBarcodeString)
        }
      }
      else {
        let currentHibcPosition = evalHibcPosition
        while(passedBarcode.length > (currentHibcPosition + 1)) {
          console.log("CHIBCPOS LOOPING")
          buildHibcBarcodeString = buildHibcBarcodeString + passedBarcode.charAt(currentHibcPosition)
          currentHibcPosition = currentHibcPosition + 1
        }
      }
      hibcAppStrings.push(buildHibcBarcodeString)
    });

    console.log("HIBCAPPSTRINGS AFTER BUILD")
    console.log(hibcAppStrings)

    hibcAppIdentifiers.forEach((aiCode, i) => {
      if(aiCode.charAt(0) === "+" && aiCode.charAt(2) != "$") {
        primaryCode = hibcAppStrings[i]
      }
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
          buildAppIdentifier = buildAppIdentifier + passedBarcode[p]
        }
        uccAppIdentifiers.push(buildAppIdentifier)
      }
      else if(location.char === ')') {
        evalPosition = location.pos + 1
        console.log("EVALPOSITION VARIABLE")
        console.log(evalPosition)
        endOfString = false

        // Starting with the character after the close add characters to build string
        // until end of string or new opening character are encountered.
        while(endOfString === false) {
          if(passedBarcode.charAt(evalPosition) != '(' && evalPosition < passedBarcode.length) {
            buildBarcodeString = buildBarcodeString + passedBarcode.charAt(evalPosition)
          }
          else {
            endOfString = true
          }
          evalPosition = evalPosition + 1
          if(evalPosition >= passedBarcode.length) {
            endOfString = true
          }
        }
        uccAppStrings.push(buildBarcodeString)
      }
    })
    uccAppIdentifiers.forEach((aiCode, i) => {
      if(aiCode === "(01)") {
        primaryCode = uccAppStrings[i]
      }
    });

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

  //Search barcode table for manufacturer number match and product table for product number match
  if(primaryCode != '') {
    let buildBarcodeFilterString = 'productBarCode1 CONTAINS "' + decodeReturnObject.manufacturerModelNumber + '"'
    let filteredBarcodeMatches = barcodeTable.filtered(buildBarcodeFilterString)
    let productModelNumber = ""
    filteredBarcodeMatches.forEach((barcode, i) => {
      if(productModelNumber === "") {
        productModelNumber = barcode.productModelNumber
      }
    })
    if(productModelNumber != '') {
      let buildProductFilterString = 'productModelNumber CONTAINS "' + productModelNumber + '"'
      let filteredProductMatches = productTable.filtered(buildProductFilterString)

      console.log("FILTERED PRODUCT MATCHES")
      console.log(filteredProductMatches)
      filteredProductMatches.forEach((product, i) => {
        if(product.productModelNumber === productModelNumber) {
          console.log("MATCHED MODEL NUMBER")
          matchedProduct = {
            barcode: passedBarcode,
            trayState: false,
            isUnknown: false,
            licenseNumber: product.licenseNumber,
            productModelNumber: productModelNumber,
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
      });
    }

  }

  if(noDBmatchFlag === true && decodeReturnObject.productModelNumber != '') {

    //if no match set unknown product
    matchedProduct = {
      barcode: passedBarcode,
      trayState: false,
      isUnknown: true,
      productDescription: "Unknown Product",
      count: 1,
      scannedTime: "Now",
      waste: false,
      scanned: false,
    }
  }

  //Return usable product object to save to working product scan DB.
  //Consolidate information from decoded barcode with matched DB values.

  let combinedProductReturn = {...matchedProduct, ...decodeReturnObject}

  if(combinedProductReturn.manufacturerModelNumber != '') {
    if(combinedProductReturn.expirationDate != '' || combinedProductReturn.batchOrLotNumber != '' || combinedProductReturn.serialNumber != '') {
      combinedProductReturn.passThroughCompletenessFlag = true
    }
    else {
      combinedProductReturn.passThroughCompletenessFlag = false
    }
  }
  else {
    //scanned secondary barcode first, and is not valid
    return(null)
  }


  console.log("MATCHEDPRODUCT OBJECT")
  console.log(matchedProduct)
  console.log("DECODE RETURN OBJECT")
  console.log(decodeReturnObject)
  console.log("COMBINED PRODUCT RETURN OBJECT")
  console.log(combinedProductReturn)
  return (combinedProductReturn)
}

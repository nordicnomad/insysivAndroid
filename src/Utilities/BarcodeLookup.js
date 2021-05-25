import { DecodeUCC } from '../Utilities/DecodeUCC'
import { DecodeHIBC } from '../Utilities/DecodeHIBC'
import { AppIdentificationUCC } from '../Utilities/AppIdentificationUCC'

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

  // ucc state tree for multiple concatenated Application Identifier types in one barcode.
  let decodeReturnObject = {
    barcode: passedBarcode,
    // ucc (00) 18 digits - numeric
    serialContainerCode: '',
    // ucc (01) 14 digits - numeric
    manufacturerModelNumber: '',
    vendorLicenseNumber: '',
    barcodeMatchSegment: '',
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
    invalidScanSegment: false,
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
  if(passedBarcode.substring(0,1) === '+' || passedBarcode.substring(0,1) === '$' || passedBarcode.substring(0,1) === '/') {
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
    console.log("HIBCAICHARLOCATIONS OBJECTS")
    console.log(hibcAIcharLocations)

    //Add first four characters from initial locations to app identifier array
    hibcAIcharLocations.forEach((location, i) => {
      let buildHibcIdentifierString = ''

      for(s = location.pos; s < (location.pos + 5); s++) {
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
        let continueEval = true
        while(continueEval === true) {
          buildHibcBarcodeString = buildHibcBarcodeString + passedBarcode.charAt(currentHibcPosition)
          currentHibcPosition = currentHibcPosition + 1
          if(passedBarcode.length < currentHibcPosition) {
            continueEval = false
          }
          else if(hibcAIcharLocations[i+1].pos < currentHibcPosition + 1) {
            continueEval = false
          }
        }
      }
      else {
        let currentHibcPosition = evalHibcPosition
        while(passedBarcode.length > (currentHibcPosition)) {
          buildHibcBarcodeString = buildHibcBarcodeString + passedBarcode.charAt(currentHibcPosition)
          currentHibcPosition = currentHibcPosition + 1
        }
      }
      hibcAppStrings.push(buildHibcBarcodeString)
    });
    console.log("HIBCAPPSTRINGS ARRAY")
    console.log(hibcAppStrings)

    hibcAppIdentifiers.forEach((aiCode, i) => {
      if(aiCode.charAt(0) === "+" && aiCode.charAt(2) != "$") {
        primaryCode = hibcAppIdentifiers[i]
      }
    });
    if(primaryCode === '') {
      //set decode return object to last scan if current segment isn't a primary segment
      //and last segment was an incomplete segment
      if(lastReturnObject != null && lastCompleteFlag === false) {
        decodeReturnObject = lastReturnObject
      }
    }

    //Decode HIBC string elements and populate return object
    console.log("HIBC APP IDENTIFIERS")
    console.log(hibcAppIdentifiers)
    hibcAppIdentifiers.forEach((identifier, i) => {
      decodeReturnObject = DecodeHIBC(identifier, hibcAppStrings[i], decodeReturnObject)
    })
  }

  else if(passedBarcode.substring(0,1) >= '0' && passedBarcode.substring(0,1) <= '9') {
    console.log("UCC NUM BARCODE STRING IN LOOKUP")
    console.log(passedBarcode)
    let uccNumAppIdentificationPrecursors = []
    let uccNumAppIdentifierObjects = []
    let uccNumAppIdentifiers = []
    let uccNumAppStrings = []

    const alphaNumMatch = /^[0-9a-zA-Z-]+$/;
    let currentUCCNumEvalPosition = 0
    let nextUCCNumEvalEndTarget = 3
    let workingAIString = ''
    let workingPayloadString = ''
    let isEvaluatingForFNC = false
    let isCountingDataPayload = false
    let endOfString = passedBarcode.length - 1
    let foundAIString = {
      identifier: '',
      identifierLength: 0,
      segmentMinLength: 0,
      segmentMaxLength: 0,
      totalMaxLength: 0,
      totalMinLength: 0,
      isVariableLength: false,
    }
    // First Identify all app identifier positions and build an array of app identifiers
    while(currentUCCNumEvalPosition <= endOfString) {
      if(isCountingDataPayload === false) {
        //if it's in target range add to working string
        if(currentUCCNumEvalPosition <= nextUCCNumEvalEndTarget) {
          workingAIString = workingAIString + passedBarcode.charAt(currentUCCNumEvalPosition)
        }

        //If AI precursor working string is full evaluate, search for AI match and determine position payload max length
        if(workingAIString.length === 4) {
          foundAIString = AppIdentificationUCC(workingAIString)
          uccNumAppIdentifierObjects.push(foundAIString)
          if(foundAIString != null && foundAIString != undefined && foundAIString.identifier != '') {
            currentUCCNumEvalPosition = currentUCCNumEvalPosition - (4 - foundAIString.identifierLength)

            if (foundAIString.isVariableLength === false) {
              nextUCCNumEvalEndTarget = currentUCCNumEvalPosition + foundAIString.segmentMaxLength
              isEvaluatingForFNC = false
              isCountingDataPayload = true
            }
            else {
              nextUCCNumEvalEndTarget = currentUCCNumEvalPosition + foundAIString.segmentMaxLength
              isEvaluatingForFNC = true
              isCountingDataPayload = true
            }
          }
          else {
            //Error in AI lookup, abort lookup at instance of error but keep all good data before
            currentUCCNumEvalPosition = endOfString
          }

          workingAIString = ''
        }
      }
      else {
        //if FNC detected set new eval start and target
        if(isEvaluatingForFNC === true) {
          if(currentUCCNumEvalPosition >= nextUCCNumEvalEndTarget) {
            workingPayloadString = workingPayloadString + passedBarcode.charAt(currentUCCNumEvalPosition)
            //if segment max length reached, set new eval start and target
            nextUCCNumEvalEndTarget = currentUCCNumEvalPosition + 4
            isEvaluatingForFNC = false
            isCountingDataPayload = false
            uccNumAppStrings.push(workingPayloadString)
            workingPayloadString = ''
          }
          else if(alphaNumMatch.test(passedBarcode.charAt(currentUCCNumEvalPosition)) === false) {
            nextUCCNumEvalEndTarget = currentUCCNumEvalPosition + 4
            isEvaluatingForFNC = false
            isCountingDataPayload = false
            uccNumAppStrings.push(workingPayloadString)
            workingPayloadString = ''
          }
          else {
            workingPayloadString = workingPayloadString + passedBarcode.charAt(currentUCCNumEvalPosition)

            if((currentUCCNumEvalPosition) >= endOfString) {
              uccNumAppStrings.push(workingPayloadString)
            }
          }
          console.log("FNC AREA WORKING STRING")
          console.log(workingPayloadString)
        }
        else {
          workingPayloadString = workingPayloadString + passedBarcode.charAt(currentUCCNumEvalPosition)

          if(currentUCCNumEvalPosition >= nextUCCNumEvalEndTarget) {
            //if segment max length reached set new eval start and target
            nextUCCNumEvalEndTarget = currentUCCNumEvalPosition + 4
            isEvaluatingForFNC = false
            isCountingDataPayload = false
            uccNumAppStrings.push(workingPayloadString)
            workingPayloadString = ''
          }
        }
      }

      currentUCCNumEvalPosition = currentUCCNumEvalPosition + 1
    }

    // Use app identifiers to build an array of ucc app strings
    uccNumAppIdentifierObjects.forEach((idObject, i) => {
        console.log(idObject)
        if(idObject.identifier != null && idObject.identifier != undefined && idObject.identifier != '') {
          console.log('APP IDENTIFIER FROM ID OBJECTS')
          console.log(idObject.identifier)
          uccNumAppIdentifiers.push('(' + idObject.identifier + ')')
        }
        else {
          console.log('APP IDENTIFIER ERROR')
          console.log(idObject)
        }
        if(idObject.identifier === "01") {
          primaryCode = uccNumAppIdentifiers[i]
        }
        //secondary productModelNumber location
        else if(idObject.identifier === "240") {
          if(primaryCode === '') {
            primaryCode = uccNumAppIdentifiers[i]
          }
        }
    })

    if(primaryCode === '') {
      //set decode return object to last scan if current segment isn't a primary segment
      //and last segment was an incomplete segment
      if(lastReturnObject != null && lastCompleteFlag === false) {
        decodeReturnObject = lastReturnObject
      }
    }

    //loop App identifier array and push identifier to decode UCC passedBarcode strings
    uccNumAppIdentifiers.forEach((identifier, i) => {
      decodeReturnObject = DecodeUCC(identifier, uccNumAppStrings[i], decodeReturnObject)
    })
    //code 240 can sometimes contain manufacturerModelNumber
    if(primaryCode === "(240)") {
      decodeReturnObject.productModelNumber = decodeReturnObject.secondaryProductAttributes
    }
  }

  else if(passedBarcode.substring(0,1) === '(') {
    let uccAIparenLocations = []
    let uccAppIdentifiers = []
    let uccAppStrings = []

    //Seperate barcode elements
    for(i=0; i < (passedBarcode.length - 1); i++) {
      if(passedBarcode.charAt(i) === '(' || passedBarcode.charAt(i) === ')') {
        uccAIparenLocations.push(
          {
            char: passedBarcode.charAt(i),
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
        for(p=startPosition; p < endPosition + 1; p++) {
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
        primaryCode = uccAppIdentifiers[i]
      }
      else if(aiCode === "(240)") {
        if(primaryCode === '') {
          primaryCode = uccAppIdentifiers[i]
        }
      }
    });
    if(primaryCode === '') {
      //set decode return object to last scan if current segment isn't a primary segment
      //and last segment was an incomplete segment
      if(lastReturnObject != null && lastCompleteFlag === false) {
        decodeReturnObject = lastReturnObject
      }
    }

    //Decode UCC passedBarcode string
    uccAppIdentifiers.forEach((identifier, i) => {
      decodeReturnObject = DecodeUCC(identifier, uccAppStrings[i], decodeReturnObject)
    })
    if(primaryCode === "(240)") {
      decodeReturnObject.productModelNumber = decodeReturnObject.secondaryProductAttributes
    }
  }

  //Search barcode table for manufacturer number match and product table for product number match
  if(primaryCode != '') {
    console.log("PRIMARY CODE")
    console.log(primaryCode)
    let productModelNumber = ""
    if(primaryCode === '240' || primaryCode === '(240)') {
      //supporting medtronic product model number search
      console.log("SECONDARY MEDTRONIC PMN")
      console.log(decodeReturnObject.productModelNumber)
      productModelNumber = decodeReturnObject.productModelNumber
    }
    else {
      //normal manufacturer model number search
      console.log("BARCODE MATCH SEGMENT")
      console.log(decodeReturnObject.barcodeMatchSegment)
      let buildBarcodeFilterString = 'productBarCode1 CONTAINS "' + decodeReturnObject.barcodeMatchSegment + '"'
      let filteredBarcodeMatches = barcodeTable.filtered(buildBarcodeFilterString)
      filteredBarcodeMatches.forEach((barcode, i) => {
        if(productModelNumber === "") {
          productModelNumber = barcode.productModelNumber
        }
      })
    }

    if(productModelNumber != '') {
      let buildProductFilterString = 'productModelNumber CONTAINS "' + productModelNumber + '"'
      let filteredProductMatches = productTable.filtered(buildProductFilterString)

      filteredProductMatches.forEach((product, i) => {
        if(product.productModelNumber === productModelNumber) {
          matchedProduct = {
            barcode: passedBarcode,
            trayState: false,
            isUnknown: false,
            productModelNumber: productModelNumber,
            productDescription: product.productDescription,
            autoReplace: product.autoReplace,
            discontinued: product.discontinued,
            orderStatus: product.orderStatus,
            active: product.active,
            accepted: product.accepted,
            consignment: product.consignment,
            productNote: product.productNote,
            scannedTime: new Date().toISOString(),
            count: 1,
            waste: false,
            scanned: true,
          }
          //numbers need to be strings for realm db
          if(product.licenseNumber != null) {matchedProduct.licenseNumber = product.licenseNumber.toString()} else {matchedProduct.licenseNumber = ''}
          if(product.orderThruVendor != null) {matchedProduct.orderThruVendor = product.orderThruVendor.toString()} else {matchedProduct.orderThruVendor = ''}
          if(product.productCategory != null) {matchedProduct.productCategory = product.productCategory.toString()} else {matchedProduct.productCategory = ''}
          if(product.hospitalItemNumber != null) {matchedProduct.hospitalItemNumber = product.hospitalItemNumber.toString()} else {matchedProduct.hospitalItemNumber = ''}
          if(product.unitOfMeasure != null) {matchedProduct.unitOfMeasure = product.unitOfMeasure.toString()} else {matchedProduct.unitOfMeasure = ''}
          if(product.unitOfMeasureQuantity != null) {matchedProduct.unitOfMeasureQuantity = product.unitOfMeasureQuantity.toString()} else {matchedProduct.unitOfMeasureQuantity = ''}
          if(product.reorderValue != null) {matchedProduct.reorderValue = product.reorderValue.toString()} else {matchedProduct.reorderValue = ''}
          if(product.quantityOnHand != null) {matchedProduct.quantityOnHand = product.quantityOnHand.toString()} else {matchedProduct.quantityOnHand = ''}
          if(product.quantityOrdered != null) {matchedProduct.quantityOrdered = product.quantityOrdered.toString()} else {matchedProduct.quantityOrdered = ''}
          if(product.lastRequistionNumber != null) {matchedProduct.lastRequistionNumber = product.lastRequistionNumber.toString()} else {matchedProduct.lastRequistionNumber = ''}
          if(product.minimumValue != null) {matchedProduct.minimumValue = product.minimumValue.toString()} else {matchedProduct.minimumValue = ''}
          if(product.maximumValue != null) {matchedProduct.maximumValue = product.maximumValue.toString()} else {matchedProduct.maximumValue = ''}
          if(product.nonOrdered != null) {matchedProduct.nonOrdered = product.nonOrdered.toString()} else {matchedProduct.nonOrdered = ''}
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
      scannedTime: new Date().toISOString(),
      waste: false,
      scanned: false,
      autoReplace: '',
      discontinued: '',
      orderStatus: '',
      active: '',
      accepted: '',
      consignment: '',
      productNote: '',
      orderThruVendor: '',
      productCategory: '',
      hospitalItemNumber: '',
      unitOfMeasure: '',
      unitOfMeasureQuantity: '',
      reorderValue: '',
      quantityOnHand: '',
      quantityOrdered: '',
      lastRequistionNumber: '',
      minimumValue: '',
      maximumValue: '',
      nonOrdered: '',
    }
  }

  //Return usable product object to save to working product scan DB.
  //Consolidate information from decoded barcode with matched DB values.

  let combinedProductReturn = {...matchedProduct, ...decodeReturnObject}
  console.log("LASTCOMPELTE FLAG")
  console.log(lastCompleteFlag)
  if(lastCompleteFlag === true) {
    if(primaryCode != '') {
      if(combinedProductReturn.expirationDate != '' && (combinedProductReturn.batchOrLotNumber != '' || combinedProductReturn.serialNumber != '')) {
        //normal full barcode scan
        combinedProductReturn.passThroughCompletenessFlag = true
      }
      else {
        //valid first segment scan
        combinedProductReturn.passThroughCompletenessFlag = false
      }
    }
    else {
      //scanned secondary barcode first, and is not valid
      combinedProductReturn.invalidScanSegment = true
      combinedProductReturn.passThroughCompletenessFlag = false
    }
  }
  else {
    //last scan was incomplete
    if(primaryCode != '') {
      //scanned a new first segment on an incomplete first segment
      if(combinedProductReturn.expirationDate != '' && (combinedProductReturn.batchOrLotNumber != '' || combinedProductReturn.serialNumber != '')) {
        //new normal full barcode scan
        combinedProductReturn.barcode = passedBarcode
        combinedProductReturn.passThroughCompletenessFlag = true
      }
      else {
        //can't pass multiple incomplete non-primary segments
        combinedProductReturn.invalidScanSegment = true
        combinedProductReturn.passThroughCompletenessFlag = false
      }
    }
    else {
      if(combinedProductReturn.expirationDate != '' && (combinedProductReturn.batchOrLotNumber != '' || combinedProductReturn.serialNumber != '')) {
        //normal second segment barcode scan
        combinedProductReturn.barcode = combinedProductReturn.barcodeMatchSegment + passedBarcode
        combinedProductReturn.passThroughCompletenessFlag = true
      }
      else {
        //can't pass multiple incomplete non-primary segments
        combinedProductReturn.invalidScanSegment = true
        combinedProductReturn.passThroughCompletenessFlag = false
      }
    }
  }

  return (combinedProductReturn)
}

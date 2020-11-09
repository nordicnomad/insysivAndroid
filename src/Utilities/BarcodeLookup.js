var Realm = require('realm');

export function BarcodeSearch(barcode, viewFlag) {
  //Initialize global and UI variables
  let passedBarcode = barcode
  let defaultScanObject = {}
  let products ;
  let productBarCodes ;
  let productModelNumber = ''
  let productVendorLicense = ''
  let matchedProduct = {}
  let noDBmatchFlag = true

  //Ucc app identifiers
  // ucc (00) 18 digits - numeric
  let serialContainerCode = ''
  // ucc (01) 14 digits - numeric
  let containerCode = ''
  // ucc (02) 14 digits - numeric
  let numberOfContainers = ''
  // ucc (10) 1-20 alphanumeric
  let batchOrLotNumber = ''
  // ucc (17) 6 digit YYMMDD
  let expirationDate = ''
  // ucc (20) 2 digits
  let productVariant = ''
  // ucc (21) 1-20 alphanumeric
  let serialNumber = ''
  // ucc (22) 1-29 alphanumeric
  let hibcc = ''
  // ucc (23) 1-19 alphanumeric 
  let lotNumber = ''
  // ucc (30) number of requisit length
  let quantityEach = ''
  // ucc (240) 1-30 alphanumeric
  let secondaryProductAttributes = ''
  // ucc (250) 1-30 alphanumeric
  let secondarySerialNumber = ''
  // ucc (37) 1-8 digits
  let quantityOfUnitsContained = ''

  //Hibcc app identifiers
  //


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

  let productTable = products.objects('Products_Lookup')
  let barcodeTable = productBarCodes.objects('Product_Bar_Codes')

  console.log("PRODUCT TABLE LENGTH")
  console.log(productTable.length)

  if(passedBarcode.substring(0,1) === '+') {
    //HIBCC Encoding
    //Seperate barcode elements
    //Manufacturer License 4 characters starting at position 1
    productVendorLicense = passedBarcode.substring(1, 5)
    //Product Number 5 characters starting at position 5
    productModelNumber = passedBarcode.substring(5, 10)

    //test output
    console.log("MATCHED HIBCC VENDOR LICENSE NUMBER")
    console.log(productVendorLicense)
    console.log("MATCHED HIBCC MODEL NUMBER")
    console.log(productModelNumber)

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

    if(passedBarcode.includes('(10)')) {

    }


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
  else if(passedBarcode.substring(0,4) === '(01)') {
    //UCC Encoding
    //Seperate barcode elements
    //Manufacturer License, 7 characters starting at position 5
    productVendorLicense = passedBarcode.substring(4, 11)
    //Product Number, 5 characters starting at position 12
    productModelNumber = passedBarcode.substring(12, 17)

    //test output
    console.log("MATCHED UCC VENDOR LICENSE NUMBER")
    console.log(productVendorLicense)
    console.log("MATCHED UCC MODEL NUMBER")
    console.log(productModelNumber)

    //Search DB tables for vendor and model match
    let searchCount = 0
    productTable.forEach((product, i) => {
      console.log('UCC SEARCHCOUNT')
      console.log(searchCount)
      if(product.productModelNumber === productModelNumber) {
        console.log("MATCHED PRODUCT VENDOR LICENSE")
        matchedProduct = product
        noDBmatchFlag = false
      }
      searchCount = searchCount + 1
    });

    //Return usable product object to save to working product scan DB.
    matchedProduct = {
      barcode: passedBarcode,
      trayState: false,
      isUnknown: false,
      name: "UCC Barcode Product",
      model: productModelNumber,
      lotSerial: productVendorLicense,
      expiration: "????",
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

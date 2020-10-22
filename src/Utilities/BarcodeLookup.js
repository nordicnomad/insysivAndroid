var Realm = require('realm');

export function BarcodeSearch(barcode, viewFlag) {
  //Initialize global variables
  let passedBarcode = barcode
  let defaultScanObject = {}
  let products ;
  let productBarCodes ;
  let productModelNumber = ''
  let productVendorLicense = ''
  let matchedProduct = {}
  let noDBmatchFlag = false

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

  if(passedBarcode.subString(0,1) === '+' && passedBarcode.length === 12) {
    //HIBCC Encoding
    //Seperate barcode elements
    //Manufacturer License 4 characters starting at position 1
    productVendorLicense = passedBarcode.subString(1, 4)
    //Product Number 4 characters starting at position 5
    productModelNumber = passedBarcode.subString(5, 4)

    //test output
    console.log("MATCHED HIBCC VENDOR LICENSE NUMBER")
    console.log(productVendorLicense)
    console.log("MATCHED HIBCC MODEL NUMBER")
    console.log(productModelNumber)

    //Search DB tables for vendor and model match

    productTable.forEach((product, i) => {
      if(product.licenseNumber === productVendorLicense) {
        console.log("MATCHED PRODUCT VENDOR LICENSE")
        matchedProduct = product
        noDBmatchFlag = false
      }
    });


    //Return usable product object to save to working product scan DB.
    defaultScanObject = {
      barcode: passedBarcode,
      trayState: false,
      isUnknown: true,
      name: "HIBCC Barcode Product",
      model: productModelNumber,
      lotSerial: productVendorLicense,
      expiration: "????",
      count: 1,
      scannedTime: "Now",
    }
  }
  else if(passedBarcode.subString(0,1) === '(' && passedBarcode.length === 18) {
    //UCC Encoding
    //Seperate barcode elements
    //Manufacturer License, 7 characters starting at position 5
    productVendorLicense = passedBarcode.subString(5, 7)
    //Product Number, 5 characters starting at position 12
    productModelNumber = passedBarcode.subString(12, 5)

    //Search DB tables for vendor and model match

    //test output
    console.log("MATCHED UCC VENDOR LICENSE NUMBER")
    console.log(productVendorLicense)
    console.log("MATCHED UCC MODEL NUMBER")
    console.log(productModelNumber)

    //Search DB tables for vendor and model match

    productTable.forEach((product, i) => {
      if(product.licenseNumber === productVendorLicense) {
        console.log("MATCHED PRODUCT VENDOR LICENSE")
        matchedProduct = product
        noDBmatchFlag = false
      }
    });

    //Return usable product object to save to working product scan DB.
    defaultScanObject = {
      barcode: passedBarcode,
      trayState: false,
      isUnknown: true,
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

  if(noDBmatchFlag === true) {
    //Run lookup of local barcode table with passedBarcode string
  }

  defaultScanObject.barcode = passedBarcode
  return (defaultScanObject)
}

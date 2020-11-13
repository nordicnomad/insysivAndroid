//HIBCC Encoding
export function DecodeHIBC(identifier, passedBarcode, hibcDecodeReturnObject) {
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





}

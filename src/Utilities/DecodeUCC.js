//UCC Encoding
export function DecodeUCC(identifier, passedBarcode, uccDecodeReturnObject) {


  let returnObject = {}
  // ucc (00) 18 digits - numeric
  let serialContainerCode = ''
  // ucc (01) 14 digits - numeric
  let containerCodeModelNumber = ''
  let containerCodeVendorLicense = ''
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


  //test output
  console.log("MATCHED UCC VENDOR LICENSE NUMBER")
  console.log(productVendorLicense)
  console.log("MATCHED UCC MODEL NUMBER")
  console.log(productModelNumber)





  if(passedBarcode.includes('(10)')) {
    //Manufacturer License, 7 characters starting at position 5
    productVendorLicense = passedBarcode.substring(4, 11)
    //Product Number, 5 characters starting at position 12
    productModelNumber = passedBarcode.substring(12, 17)

    uccDecodeReturnObject.
  }




  return(returnObject)
}

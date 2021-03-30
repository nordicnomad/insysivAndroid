//UCC Encoding
export function DecodeUCC(appIdentifier, passedBarcodeString, uccDecodeReturnObject) {

  let identifier = appIdentifier
  let passedBarcode = passedBarcodeString
  let returnObject = uccDecodeReturnObject
  // ucc (00) 18 digits - numeric
  let serialContainerCode = ''
  // ucc (01) 14 digits - numeric
  let containerCodeModelNumber = ''
  let containerCodeVendorLicense = ''
  let barcodeMatchSegment = ''
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

  if(identifier === '(00)') {
    // ucc (00) 18 digits - numeric
    serialContainerCode = passedBarcode

    returnObject.serialContainerCode = serialContainerCode
  }
  else if(identifier === '(01)') {
    //Manufacturer License, 7 characters starting at position 1
    containerCodeVendorLicense = passedBarcode.substring(1, 7)
    //Product Number, 5 characters starting at position 8
    containerCodeModelNumber = passedBarcode.substring(8, 13)
    barcodeMatchSegment = passedBarcode

    console.log("01 passedbarcode")
    console.log(passedBarcode)
    console.log(containerCodeVendorLicense)
    console.log(containerCodeModelNumber)

    returnObject.manufacturerModelNumber = containerCodeModelNumber
    returnObject.productVendorLicense = containerCodeVendorLicense
    returnObject.barcodeMatchSegment = barcodeMatchSegment
  }
  else if(identifier === '(02)') {
    // ucc (02) 14 digits - numeric
    numberOfContainers = passedBarcode

    returnObject.numberOfContainers = numberOfContainers
  }
  else if(identifier === '(10)') {
    // ucc (10) 1-20 alphanumeric
    batchOrLotNumber = passedBarcode

    returnObject.batchOrLotNumber = batchOrLotNumber
  }
  else if(identifier === '(17)') {
    // ucc (17) 6 digit YYMMDD
    expirationDate = passedBarcode

    returnObject.expirationDate = expirationDate
  }
  else if(identifier === '(20)') {
    // ucc (20) 2 digits
    productVariant = passedBarcode

    returnObject.productVariant = productVariant
  }
  else if(identifier === '(21)') {
    // ucc (21) 1-20 alphanumeric
    serialNumber = passedBarcode

    returnObject.serialNumber = serialNumber
  }
  else if(identifier === '(22)') {
    // ucc (22) 1-29 alphanumeric
    hibcc = passedBarcode

    returnObject.hibcc = hibcc
  }
  else if(identifier === '(23)') {
    // ucc (23) 1-19 alphanumeric
    lotNumber = passedBarcode

    returnObject.lotNumber = lotNumber
  }
  else if(identifier === '(30)') {
    // ucc (30) number of requisit length
    quantityEach = passedBarcode

    returnObject.quantityEach = quantityEach
  }
  else if(identifier === '(240)') {
    // ucc (240) 1-30 alphanumeric
    secondaryProductAttributes =  passedBarcode

    returnObject.secondaryProductAttributes = secondaryProductAttributes
  }
  else if(identifier === '(250)') {
    // ucc (250) 1-30 alphanumeric
    secondarySerialNumber = passedBarcode

    returnObject.secondarySerialNumber = secondarySerialNumber
  }
  else if(identifier === '(37)') {
    // ucc (37) 1-8 digits
    quantityOfUnitsContained = passedBarcode

    returnObject.quantityOfUnitsContained = quantityOfUnitsContained
  }
  else {
    // Error or skip, unsupported UCC encoding
    console.log("UCC ENCODING DETECTED OUTSIDE SUPPORTED BOUNDS")
    // Maybe pass some notifcation forward that the string was skipped eventually.
  }

  return(returnObject)
}

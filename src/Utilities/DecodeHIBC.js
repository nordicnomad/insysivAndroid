//HIBCC Encoding
export function DecodeHIBC(appIdentifier, passedBarcodeString, hibcDecodeReturnObject) {

  let identifier = appIdentifier
  let passedBarcode = passedBarcodeString
  let returnObject = hibcDecodeReturnObject

  //Hibcc app identifiers
  //Data delimiters will need to determine decoding format of passedBarcode
  //Multiple redundant formats
  let productVendorLicense = ''
  let productModelNumber = ''
  let hibcSerialNumber = ''
  let hibcExpirationDate = ''
  let hibcLotNumber = ''
  let hibcQuantity = ''
  let hibcManufactureDate = ''

  if(identifier === '+') {
    //Vendor and Model Number 11 characters + 1 identifier alphanumeric
    //Manufacturer License 4 characters starting at position 1
    productVendorLicense = passedBarcode.substring(1, 5)
    //Product Number 5 characters starting at position 5
    productModelNumber = passedBarcode.substring(5, 10)

    returnObject.hibcVendorLicense = productVendorLicense

    returnObject.hibcModelNumber = productModelNumber
  }
  else if(identifier === '$') {
    //Lot Number Only 18 characters + 1 idenfitier alphanumeric
    hibcLotNumber = passedBarcode

    returnObject.hibcLotNumber = hibcLotNumber
  }
  else if(identifier === '$$7') {
    //Lot Number Only (Alternate Option) 18 characters + 3 idenfitier alphanumeric
    hibcLotNumber = passedBarcode

    returnObject.hibcLotNumber = hibcLotNumber
  }
  else if(identifier === '$$') {
    //Expiration Date (MMYY) followed by Lot Number

    //	4 characters MMYY + 2 idenfitier numeric
    hibcExpirationDate = passedBarcode
    // 18 characters alphanumeric lot number
    hibcLotNumber = passedBarcode

    returnObject.hibcExpirationDate = hibcExpirationDate
    returnObject.hibcLotNumber = hibcLotNumber
  }
  else if(identifier === '$$2') {
    //Expiration Date (MMDDYY) followed by Lot Number

    // 6 characters MMDDYY + 3 identifier numeric
    hibcExpirationDate = passedBarcode
    // Lot Number 18 characters Alphanumeric
    hibcLotNumber = passedBarcode

    returnObject.hibcExpirationDate = hibcExpirationDate
    returnObject.hibcLotNumber = hibcLotNumber
  }
  else if(identifier === '$$3') {
    //Expiration Date (YYMMDD) followed by Lot Number

    // Exp. Date: Numeric 6 characters + 3 identifier
    hibcExpirationDate = passedBarcode
    // Lot #: Alphanumeric 18 characters
    hibcLotNumber = passedBarcode

    returnObject.hibcExpirationDate = hibcExpirationDate
    returnObject.hibcLotNumber = hibcLotNumber
  }
  else if(identifier === '$$4') {
    //Expiration Date (YYMMDDHH) followed by Lot Number

    // Exp. Date: Numeric 8 characters + 3 identifier
    hibcExpirationDate = passedBarcode
    // Lot #: Alphanumeric 18 characters
    hibcLotNumber = passedBarcode

    returnObject.hibcExpirationDate = hibcExpirationDate
    returnObject.hibcLotNumber = hibcLotNumber
  }
  else if(identifier === '$$5') {
    //Expiration Date (YYJJJ) followed by Lot Number

    // Exp. Date: numeric Julian Date format 5 characters + 3
    hibcExpirationDate = passedBarcode

    //Lot #: Alphanumeric 18 characters
    hibcLotNumber = passedBarcode

    returnObject.hibcExpirationDate = hibcExpirationDate
    returnObject.hibcLotNumber = hibcLotNumber
  }
  else if(identifier === '$$6') {
    //Expiration Date (YYJJJHH) followed by Lot Number

    // Exp. Date: numeric Julian Date format with hour 7 characters + 3 identifier
    hibcExpirationDate = passedBarcode
    // Lot #: Alphanumeric 18 characters
    hibcLotNumber = passedBarcode

    returnObject.hibcExpirationDate = hibcExpirationDate
    returnObject.hibcLotNumber = hibcLotNumber
  }
  else if(identifier === '$+') {
    //Serial Number only

    // Alphanumeric 18 characters + 2
    hibcSerialNumber = passedBarcode

    returnObject.hibcSerialNumber = hibcSerialNumber
  }
  else if(identifier === '$$+7') {
    //Serial Number only (Alternate Option)

    //Alphanumeric 18 characters + 4 identifier
    hibcSerialNumber = passedBarcode

    returnObject.hibcSerialNumber = hibcSerialNumber
  }
  else if(identifier === '$$+') {
    //Expiration Date (MMYY) followed by Serial Number

    // Exp. Date: Numeric 4 characters + 3 identifier
    hibcExpirationDate = passedBarcode
    // Serial #: Alphanumeric 18 characters
    hibcSerialNumber = passedBarcode

    returnObject.hibcExpirationDate = hibcExpirationDate
    returnObject.hibcSerialNumber = hibcSerialNumber
  }
  else if(identifier === '$$+2') {
    //Expiration Date (MMDDYY) followed by Serial Number

    // Exp. Date: Numeric 6 characters + 4 identifier
    hibcExpirationDate = passedBarcode
    // Serial #: Alphanumeric 18 characters
    hibcSerialNumber = passedBarcode

    returnObject.hibcExpirationDate = hibcExpirationDate
    returnObject.hibcSerialNumber = hibcSerialNumber
  }
  else if(identifier === '$$+3') {
    //Expiration Date (YYMMDD) followed by Serial Number

    //Exp. Date: Numeric 6 characters + 4 identifier
    hibcExpirationDate = passedBarcode
    //Serial #: Alphanumeric 18 characters
    hibcSerialNumber = passedBarcode

    returnObject.hibcExpirationDate = hibcExpirationDate
    returnObject.hibcSerialNumber = hibcSerialNumber
  }
  else if(identifier === '$$+4') {
    //Expiration Date (YYMMDDHH) followed by Serial Number

    //Exp. Date: Numeric 8 characters + 4 identifiers
    hibcExpirationDate = passedBarcode
    //Serial #: Alphanumeric 18 characters
    hibcSerialNumber = passedBarcode

    returnObject.hibcExpirationDate =
    returnObject.hibcSerialNumber = hibcSerialNumber
  }
  else if(identifier === '$$+5') {
    //Expiration Date (YYJJJ) followed by Serial Number

    //Exp. Date: numeric Julian Date format 5 characters plus 4 identifier
    hibcExpirationDate = passedBarcode
    //Serial #: Alphanumeric 18 characters
    hibcSerialNumber = passedBarcode

    returnObject.hibcExpirationDate = hibcExpirationDate
    returnObject.hibcSerialNumber = hibcSerialNumber
  }
  else if(identifier === '$$+6') {
    //Expiration Date followed by Serial Number

    // Exp. Date: Numeric Julian Date format with hour 7 characters plus 4 identifier
    hibcExpirationDate = passedBarcode
    // Serial #: 18 characters Alphanumeric
    hibcSerialNumber = passedBarcode

    returnObject.hibcExpirationDate = hibcExpirationDate
    returnObject.hibcSerialNumber = hibcSerialNumber
  }
  else {
    // Error or skip, unsupported UCC encoding
    console.log("HIBC ENCODING DETECTED OUTSIDE SUPPORTED BOUNDS")
    // Maybe pass some notifcation forward that the string was skipped eventually.
  }

  return(returnObject)
}

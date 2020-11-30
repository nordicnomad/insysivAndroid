//HIBCC Encoding
import moment from "moment"

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
  let hibcManufactureDate = ''
  let hibcSecondarySerial = ''
  let hibcSecondaryExpiration = ''
  let hibcSecondaryManufacture = ''

  if(identifier.substring(0,1) === '+') {
    //Vendor and Model Number 11 characters + 1 identifier alphanumeric
    //Manufacturer License 4 characters starting at position 1
    productVendorLicense = passedBarcode.substring(1, 5)
    //Product Number 5 characters starting at position 5
    productModelNumber = passedBarcode.substring(5, 10)

    returnObject.productVendorLicense = productVendorLicense

    returnObject.productModelNumber = productModelNumber
  }
  else if(identifier.substring(0,3) === "$$+") {
    if(identifier === '$$+7') {
      //Serial Number only (Alternate Option)

      //Alphanumeric 18 characters + 4 identifier
      hibcSerialNumber = passedBarcode.substring(4)

      returnObject.serialNumber = hibcSerialNumber
    }
  }
  else if(identifier.substring(0,2) === "$+") {
    if(identifier.substring(0,2) === '$+') {
      //Serial Number only

      // Alphanumeric 18 characters + 2
      hibcSerialNumber = passedBarcode.substring(2)

      returnObject.serialNumber = hibcSerialNumber
    }
    else if(identifier === '$$+2') {
      //Expiration Date (MMDDYY) followed by Serial Number

      // Exp. Date: Numeric 6 characters + 4 identifier
      hibcExpirationDate = passedBarcode.substring(4, 10)
      // Serial #: Alphanumeric 18 characters
      hibcSerialNumber = passedBarcode.substring(10)

      returnObject.expirationDate = hibcExpirationDate.substring(4, 6) + hibcExpirationDate.substring(0, 2) + hibcExpirationDate.substring(2, 4)
      returnObject.serialNumber = hibcSerialNumber
    }
    else if(identifier === '$$+3') {
      //Expiration Date (YYMMDD) followed by Serial Number

      //Exp. Date: Numeric 6 characters + 4 identifier
      hibcExpirationDate = passedBarcode.substring(4, 10)
      //Serial #: Alphanumeric 18 characters
      hibcSerialNumber = passedBarcode.substring(10)

      returnObject.expirationDate = hibcExpirationDate
      returnObject.serialNumber = hibcSerialNumber
    }
    else if(identifier === '$$+4') {
      //Expiration Date (YYMMDDHH) followed by Serial Number

      //Exp. Date: Numeric 8 characters + 4 identifiers
      hibcExpirationDate = passedBarcode.substring(4, 12)
      //Serial #: Alphanumeric 18 characters
      hibcSerialNumber = passedBarcode.substring(12)

      returnObject.expirationDate = hibcExpirationDate.substring(0,6)
      returnObject.serialNumber = hibcSerialNumber
    }
    else if(identifier === '$$+5') {
      //Expiration Date (YYJJJ) followed by Serial Number

      //Exp. Date: numeric Julian Date format 5 characters plus 4 identifier
      hibcExpirationDate = passedBarcode.substring(4, 9)
      //Serial #: Alphanumeric 18 characters
      hibcSerialNumber = passedBarcode.substring(9)

      returnObject.expirationDate = moment(hibcExpirationDate, "YYDDDD").format("YYMM[01]")
      returnObject.serialNumber = hibcSerialNumber
    }
    else if(identifier === '$$+6') {
      //Expiration Date followed by Serial Number

      // Exp. Date: Numeric Julian Date format with hour 7 characters plus 4 identifier
      hibcExpirationDate = passedBarcode.substring(4, 11)
      // Serial #: 18 characters Alphanumeric
      hibcSerialNumber = passedBarcode.substring(11)

      returnObject.expirationDate = moment(hibcExpirationDate, "YYDDDDHH").format("YYMMDD")
      returnObject.serialNumber = hibcSerialNumber
    }
    else if(identifier.substring(0,3) === '$$+') {
      //Expiration Date (MMYY) followed by Serial Number

      // Exp. Date: Numeric 4 characters + 3 identifier
      hibcExpirationDate = passedBarcode.substring(3, 7)
      // Serial #: Alphanumeric 18 characters
      hibcSerialNumber = passedBarcode.substring(7)

      returnObject.expirationDate = hibcExpirationDate.substring(2,4) + hibcExpirationDate.substring(0,2) + "01"
      returnObject.serialNumber = hibcSerialNumber
    }
  }
  else if(identifier.substring(0,2) === "$$") {
    if(identifier.substring(0,3) === '$$7') {
      //Lot Number Only (Alternate Option) 18 characters + 3 idenfitier alphanumeric
      hibcLotNumber = passedBarcode.substring(3)

      returnObject.batchOrLotNumber = hibcLotNumber
    }
    else if(identifier.substring(0,3) === '$$2') {
      //Expiration Date (MMDDYY) followed by Lot Number

      // 6 characters MMDDYY + 3 identifier numeric
      hibcExpirationDate = passedBarcode.substring(3, 9)
      // Lot Number 18 characters Alphanumeric
      hibcLotNumber = passedBarcode.substring(9)

      returnObject.expirationDate = hibcExpirationDate.substring(4, 6) + hibcExpirationDate.substring(0, 2) + hibcExpirationDate.substring(2, 4)
      returnObject.batchOrLotNumber = hibcLotNumber
    }
    else if(identifier.substring(0,3) === '$$3') {
      //Expiration Date (YYMMDD) followed by Lot Number

      // Exp. Date: Numeric 6 characters + 3 identifier
      hibcExpirationDate = passedBarcode.substring(3, 9)
      // Lot #: Alphanumeric 18 characters
      hibcLotNumber = passedBarcode.substring(9)

      returnObject.expirationDate = hibcExpirationDate
      returnObject.batchOrLotNumber = hibcLotNumber
    }
    else if(identifier.substring(0,3) === '$$4') {
      //Expiration Date (YYMMDDHH) followed by Lot Number

      // Exp. Date: Numeric 8 characters + 3 identifier
      hibcExpirationDate = passedBarcode.substring(3, 11)
      // Lot #: Alphanumeric 18 characters
      hibcLotNumber = passedBarcode.substring(11)

      returnObject.expirationDate = hibcExpirationDate.substring(0,6)
      returnObject.batchOrLotNumber = hibcLotNumber
    }
    else if(identifier.substring(0,3) === '$$5') {
      //Expiration Date (YYJJJ) followed by Lot Number

      // Exp. Date: numeric Julian Date format 5 characters + 3
      hibcExpirationDate = passedBarcode.substring(3, 8)

      //Lot #: Alphanumeric 18 characters
      hibcLotNumber = passedBarcode.substring(8)

      returnObject.expirationDate = moment(hibcExpirationDate, "YYDDDD").format("YYMMDD")
      returnObject.batchOrLotNumber = hibcLotNumber
    }
    else if(identifier.substring(0,3) === '$$6') {
      //Expiration Date (YYJJJHH) followed by Lot Number

      // Exp. Date: numeric Julian Date format with hour 7 characters + 3 identifier
      hibcExpirationDate = passedBarcode.substring(3, 10)
      // Lot #: Alphanumeric 18 characters
      hibcLotNumber = passedBarcode.substring(10)

      returnObject.expirationDate = moment(hibcExpirationDate, "YYDDDDHH").format("YYMMDD")
      returnObject.batchOrLotNumber = hibcLotNumber
    }
    else if(identifier.substring(0,2) === '$$') {
      //Expiration Date (MMYY) followed by Lot Number

      //	4 characters MMYY + 2 idenfitier numeric
      hibcExpirationDate = passedBarcode.substring(2,6)
      // 18 characters alphanumeric lot number
      hibcLotNumber = passedBarcode.substring(6)

      returnObject.expirationDate = hibcExpirationDate.substring(2,4) + hibcExpirationDate.substring(0,2) + "01"
      returnObject.batchOrLotNumber = hibcLotNumber
    }
  }
  else if(identifier.substring(0,1) === '$') {
    if(identifier.substring(0,1) === '$') {
      //Lot Number Only 18 characters + 1 idenfitier alphanumeric
      hibcLotNumber = passedBarcode.substring(1)

      returnObject.batchOrLotNumber = hibcLotNumber
    }
  }
  else if(identifier.substring(0,1) === '/') {
    if(identifier.substring(0,2) === '/S') {
      //Supplemental Serial Number, where lot number also required and included in main secondary data string
      //alphanumeric 18 characters plus 2 identifier
      hibcSecondarySerial = passedBarcode.substring(2)

      returnObject.hibcSecondarySerial = hibcSecondarySerial
    }
    else if(identifier === '/16D') {
      //Manufacturing Date (YYYYMMDD) (supplemental to secondary barcode)
      //numeric 8 characters plus 4 identifier
      hibcSecondaryManufacture = passedBarcode.substring(4)

      returnObject.hibcSecondaryManufacture = hibcSecondaryManufacture.substring(2)
    }
    else if(identifier === '/14D') {
      //Expiration Date (YYYYMMDD) (supplemental to secondary barcode)
      //numeric 8 characters plus 4 identifier
      hibcSecondaryExpiration = passedBarcode.substring(4)

      returnObject.hibcSecondaryExpiration = hibcSecondaryExpiration.substring(2)
    }
  }

  else {
    // Error or skip, unsupported UCC encoding
    console.log("HIBC ENCODING DETECTED OUTSIDE SUPPORTED BOUNDS")
    // Maybe pass some notifcation forward that the string was skipped eventually.
  }

  return(returnObject)
}

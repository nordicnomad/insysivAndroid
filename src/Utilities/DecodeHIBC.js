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
  let manufacturerModelNumber = ''
  let barcodeMatchSegment = ''
  let hibcSerialNumber = ''
  let hibcQuantity = ''
  let hibcExpirationDate = ''
  let hibcLotNumber = ''
  let hibcManufactureDate = ''
  let hibcSecondarySerial = ''
  let hibcSecondaryExpiration = ''
  let hibcSecondaryManufacture = ''

  if(identifier.substring(0,1) === '+' && identifier.substring(1,2) != "$" && identifier.substring(1,2) != "/") {
    //Vendor and Model Number 11 characters + 1 identifier alphanumeric
    //Manufacturer License 4 characters starting at position 1
    productVendorLicense = passedBarcode.substring(1, 5)
    //Product Number 5 characters starting at position 5
    manufacturerModelNumber = passedBarcode.substring(5, 10)

    barcodeMatchSegment = passedBarcode

    returnObject.productVendorLicense = productVendorLicense

    returnObject.manufacturerModelNumber = manufacturerModelNumber

    returnObject.barcodeMatchSegment = barcodeMatchSegment
  }
  else if(identifier.substring(0,4) === "/$$+") {
    barcodeMatchSegment = hibcDecodeReturnObject.barcodeMatchSegment
    if(identifier === '/$$+7') {
      //Serial Number only (Alternate Option)

      //Alphanumeric 18 characters + 4 identifier
      hibcSerialNumber = passedBarcode.substring(5)

      returnObject.serialNumber = hibcSerialNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier === '/$$+2') {
      //Expiration Date (MMDDYY) followed by Serial Number

      // Exp. Date: Numeric 6 characters + 4 identifier
      hibcExpirationDate = passedBarcode.substring(5, 11)
      // Serial #: Alphanumeric 18 characters
      hibcSerialNumber = passedBarcode.substring(11)

      returnObject.expirationDate = hibcExpirationDate.substring(4, 6) + hibcExpirationDate.substring(0, 2) + hibcExpirationDate.substring(2, 4)
      returnObject.serialNumber = hibcSerialNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier === '/$$+3') {
      //Expiration Date (YYMMDD) followed by Serial Number

      //Exp. Date: Numeric 6 characters + 4 identifier
      hibcExpirationDate = passedBarcode.substring(5, 11)
      //Serial #: Alphanumeric 18 characters
      hibcSerialNumber = passedBarcode.substring(11)

      returnObject.expirationDate = hibcExpirationDate
      returnObject.serialNumber = hibcSerialNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier === '/$$+4') {
      //Expiration Date (YYMMDDHH) followed by Serial Number

      //Exp. Date: Numeric 8 characters + 4 identifiers
      hibcExpirationDate = passedBarcode.substring(5, 13)
      //Serial #: Alphanumeric 18 characters
      hibcSerialNumber = passedBarcode.substring(13)

      returnObject.expirationDate = hibcExpirationDate.substring(0,6)
      returnObject.serialNumber = hibcSerialNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier === '/$$+5') {
      //Expiration Date (YYJJJ) followed by Serial Number

      //Exp. Date: numeric Julian Date format 5 characters plus 4 identifier
      hibcExpirationDate = passedBarcode.substring(5, 10)
      //Serial #: Alphanumeric 18 characters
      hibcSerialNumber = passedBarcode.substring(10)

      returnObject.expirationDate = moment(hibcExpirationDate, "YYDDDD").format("YYMM[01]")
      returnObject.serialNumber = hibcSerialNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier === '/$$+6') {
      //Expiration Date followed by Serial Number

      // Exp. Date: Numeric Julian Date format with hour 7 characters plus 4 identifier
      hibcExpirationDate = passedBarcode.substring(5, 12)
      // Serial #: 18 characters Alphanumeric
      hibcSerialNumber = passedBarcode.substring(12)

      returnObject.expirationDate = moment(hibcExpirationDate, "YYDDDDHH").format("YYMMDD")
      returnObject.serialNumber = hibcSerialNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,4) === '/$$+') {
      //Expiration Date (MMYY) followed by Serial Number

      // Exp. Date: Numeric 4 characters + 3 identifier
      hibcExpirationDate = passedBarcode.substring(3, 7)
      // Serial #: Alphanumeric 18 characters
      hibcSerialNumber = passedBarcode.substring(7)

      returnObject.expirationDate = hibcExpirationDate.substring(2,4) + hibcExpirationDate.substring(0,2) + "01"
      returnObject.serialNumber = hibcSerialNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
  }
  else if(identifier.substring(0,3) === "/$+") {
    barcodeMatchSegment = hibcDecodeReturnObject.barcodeMatchSegment
    if(identifier.substring(0,3) === '/$+') {
      //Serial Number only

      // Alphanumeric 18 characters + 2
      hibcSerialNumber = passedBarcode.substring(3)

      returnObject.serialNumber = hibcSerialNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
  }
  else if(identifier.substring(0,3) === "/$$") {
    barcodeMatchSegment = hibcDecodeReturnObject.barcodeMatchSegment
    if(identifier.substring(0,4) === '/$$7') {
      //Lot Number Only (Alternate Option) 18 characters + 3 idenfitier alphanumeric
      hibcLotNumber = passedBarcode.substring(4)

      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,4) === '/$$2') {
      //Expiration Date (MMDDYY) followed by Lot Number

      // 6 characters MMDDYY + 3 identifier numeric
      hibcExpirationDate = passedBarcode.substring(4, 10)
      // Lot Number 18 characters Alphanumeric
      hibcLotNumber = passedBarcode.substring(10)

      returnObject.expirationDate = hibcExpirationDate.substring(4, 6) + hibcExpirationDate.substring(0, 2) + hibcExpirationDate.substring(2, 4)
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,4) === '/$$3') {
      //Expiration Date (YYMMDD) followed by Lot Number

      // Exp. Date: Numeric 6 characters + 3 identifier
      hibcExpirationDate = passedBarcode.substring(4, 10)
      // Lot #: Alphanumeric 18 characters
      hibcLotNumber = passedBarcode.substring(10)

      returnObject.expirationDate = hibcExpirationDate
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,4) === '/$$4') {
      //Expiration Date (YYMMDDHH) followed by Lot Number

      // Exp. Date: Numeric 8 characters + 3 identifier
      hibcExpirationDate = passedBarcode.substring(4, 12)
      // Lot #: Alphanumeric 18 characters
      hibcLotNumber = passedBarcode.substring(12)

      returnObject.expirationDate = hibcExpirationDate.substring(0,6)
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,4) === '/$$5') {
      //Expiration Date (YYJJJ) followed by Lot Number

      // Exp. Date: numeric Julian Date format 5 characters + 3
      hibcExpirationDate = passedBarcode.substring(4, 9)

      //Lot #: Alphanumeric 18 characters
      hibcLotNumber = passedBarcode.substring(9)

      returnObject.expirationDate = moment(hibcExpirationDate, "YYDDDD").format("YYMMDD")
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,4) === '/$$6') {
      //Expiration Date (YYJJJHH) followed by Lot Number

      // Exp. Date: numeric Julian Date format with hour 7 characters + 3 identifier
      hibcExpirationDate = passedBarcode.substring(4, 11)
      // Lot #: Alphanumeric 18 characters
      hibcLotNumber = passedBarcode.substring(11)

      returnObject.expirationDate = moment(hibcExpirationDate, "YYDDDDHH").format("YYMMDD")
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,4) === '/$$8') {
      //Qty QQ Exp Date MMYY and Lot Number

      hibcQuantity = passedBarcode.substring(4, 6)

      hibcExpirationDate = passedBarcode.substring(6, 10)

      hibcLotNumber = passedBarcode.substring(10)

      returnObject.quantityEach = hibcQuantity
      returnObject.expirationDate = hibcExpirationDate.substring(2,4) + hibcExpirationDate.substring(0,2) + "01"
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,5) === '/$$82') {
      //Qty QQ Exp Date MMDDYY and Lot Number

      hibcQuantity = passedBarcode.substring(5, 7)

      hibcExpirationDate = passedBarcode.substring(7, 13)

      hibcLotNumber = passedBarcode.substring(13)

      returnObject.quantityEach = hibcQuantity
      returnObject.expirationDate = hibcExpirationDate.substring(4, 6) + hibcExpirationDate.substring(0, 2) + hibcExpirationDate.substring(2, 4)
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,5) === '/$$83') {
      //Qty QQ Exp Date YYMMDD and Lot Number

      hibcQuantity = passedBarcode.substring(5, 7)

      hibcExpirationDate = passedBarcode.substring(7, 13)

      hibcLotNumber = passedBarcode.substring(13)

      returnObject.quantityEach = hibcQuantity
      returnObject.expirationDate = hibcExpirationDate
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,5) === '/$$84') {
      //Qty QQ Exp Date YYMMDDHH and Lot Number

      hibcQuantity = passedBarcode.substring(5, 7)

      hibcExpirationDate = passedBarcode.substring(7, 15)

      hibcLotNumber = passedBarcode.substring(15)

      returnObject.quantityEach = hibcQuantity
      returnObject.expirationDate = hibcExpirationDate.substring(0,6)
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,5) === '/$$85') {
      //Qty QQ Exp Date YYJJJ and Lot Number

      hibcQuantity = passedBarcode.substring(5, 7)

      hibcExpirationDate = passedBarcode.substring(7, 12)

      hibcLotNumber = passedBarcode.substring(12)

      returnObject.quantityEach = hibcQuantity
      returnObject.expirationDate = oment(hibcExpirationDate, "YYDDDD").format("YYMMDD")
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,5) === '/$$86') {
      //Qty QQ Exp Date YYJJJHH and Lot Number

      hibcQuantity = passedBarcode.substring(5, 7)

      hibcExpirationDate = passedBarcode.substring(7, 14)

      hibcLotNumber = passedBarcode.substring(14)

      returnObject.quantityEach = hibcQuantity
      returnObject.expirationDate = moment(hibcExpirationDate, "YYDDDDHH").format("YYMMDD")
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,5) === '/$$87') {
      //Qty QQ and Lot Number

      hibcQuantity = passedBarcode.substring(5, 7)

      hibcLotNumber = passedBarcode.substring(7)

      returnObject.quantityEach = hibcQuantity
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,4) === '/$$9') {
      //Qty QQQQQ Exp Date MMYY and Lot Number

      hibcQuantity = passedBarcode.substring(4, 9)

      hibcExpirationDate = passedBarcode.substring(9, 13)

      hibcLotNumber = passedBarcode.substring(13)

      returnObject.quantityEach = hibcQuantity
      returnObject.expirationDate = hibcExpirationDate.substring(2,4) + hibcExpirationDate.substring(0,2) + "01"
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,5) === '/$$92') {
      //Qty QQQQQ Exp Date MMDDYY and Lot Number

      hibcQuantity = passedBarcode.substring(5, 10)

      hibcExpirationDate = passedBarcode.substring(10, 16)

      hibcLotNumber = passedBarcode.substring(16)

      returnObject.quantityEach = hibcQuantity
      returnObject.expirationDate = hibcExpirationDate.substring(4, 6) + hibcExpirationDate.substring(0, 2) + hibcExpirationDate.substring(2, 4)
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,5) === '/$$93') {
      //Qty QQQQQ Exp Date YYMMDD and Lot Number

      hibcQuantity = passedBarcode.substring(5, 10)

      hibcExpirationDate = passedBarcode.substring(10, 16)

      hibcLotNumber = passedBarcode.substring(16)

      returnObject.quantityEach = hibcQuantity
      returnObject.expirationDate = hibcExpirationDate
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,5) === '/$$94') {
      //Qty QQQQQ Exp Date YYMMDDHH and Lot Number

      hibcQuantity = passedBarcode.substring(5, 10)

      hibcExpirationDate = passedBarcode.substring(10, 18)

      hibcLotNumber = passedBarcode.substring(18)

      returnObject.quantityEach = hibcQuantity
      returnObject.expirationDate = hibcExpirationDate.substring(0,6)
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,5) === '/$$95') {
      //Qty QQQQQ Exp Date YYJJJ and Lot Number

      hibcQuantity = passedBarcode.substring(5, 10)

      hibcExpirationDate = passedBarcode.substring(10, 15)

      hibcLotNumber = passedBarcode.substring(15)

      returnObject.quantityEach = hibcQuantity
      returnObject.expirationDate = moment(hibcExpirationDate, "YYDDDD").format("YYMMDD")
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,5) === '/$$96') {
      //Qty QQQQQ Exp Date YYJJJHH and Lot Number

      hibcQuantity = passedBarcode.substring(5, 10)

      hibcExpirationDate = passedBarcode.substring(10, 17)

      hibcLotNumber = passedBarcode.substring(17)

      returnObject.quantityEach = hibcQuantity
      returnObject.expirationDate = moment(hibcExpirationDate, "YYDDDDHH").format("YYMMDD")
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,5) === '/$$97') {
      //Qty QQQQQ and Lot Number

      hibcQuantity = passedBarcode.substring(5, 10)

      hibcLotNumber = passedBarcode.substring(10)

      returnObject.quantityEach = hibcQuantity
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,3) === '/$$') {
      //Expiration Date (MMYY) followed by Lot Number

      //	4 characters MMYY + 2 idenfitier numeric
      hibcExpirationDate = passedBarcode.substring(3,7)
      // 18 characters alphanumeric lot number
      hibcLotNumber = passedBarcode.substring(7)

      returnObject.expirationDate = hibcExpirationDate.substring(2,4) + hibcExpirationDate.substring(0,2) + "01"
      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
  }
  else if(identifier.substring(0,2) === '/$') {
    barcodeMatchSegment = hibcDecodeReturnObject.barcodeMatchSegment
    if(identifier.substring(0,2) === '/$') {
      //Lot Number Only 18 characters + 1 idenfitier alphanumeric
      hibcLotNumber = passedBarcode.substring(2)

      returnObject.batchOrLotNumber = hibcLotNumber
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
  }
  else if(identifier.substring(0,1) === '/') {
    barcodeMatchSegment = hibcDecodeReturnObject.barcodeMatchSegment
    if(identifier.substring(0,2) === '/S') {
      //Supplemental Serial Number, where lot number also required and included in main secondary data string
      //alphanumeric 18 characters plus 2 identifier
      hibcSecondarySerial = passedBarcode.substring(2)

      returnObject.serialNumber = hibcSecondarySerial
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,4) === '/16D') {
      //Manufacturing Date (YYYYMMDD) (supplemental to secondary barcode)
      //numeric 8 characters plus 4 identifier
      hibcSecondaryManufacture = passedBarcode.substring(4)

      returnObject.hibcSecondaryManufacture = hibcSecondaryManufacture.substring(2)
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
    else if(identifier.substring(0,4) === '/14D') {
      //Expiration Date (YYYYMMDD) (supplemental to secondary barcode)
      //numeric 8 characters plus 4 identifier
      hibcSecondaryExpiration = passedBarcode.substring(4)

      returnObject.expirationDate = hibcSecondaryExpiration.substring(2)
      returnObject.barcodeMatchSegment = barcodeMatchSegment
    }
  }
  else {
    barcodeMatchSegment = hibcDecodeReturnObject.barcodeMatchSegment
    returnObject.barcodeMatchSegment = barcodeMatchSegment
    // Error or skip, unsupported UCC encoding
    console.log("HIBC ENCODING DETECTED OUTSIDE SUPPORTED BOUNDS")
    // Maybe pass some notifcation forward that the string was skipped eventually.
  }

  return(returnObject)
}

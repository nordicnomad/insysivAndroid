//UCC Encoding
export function DecodeUCC(identifier, passedBarcode, uccDecodeReturnObject) {


  let returnObject = {}
  //Manufacturer License, 7 characters starting at position 5
  productVendorLicense = passedBarcode.substring(4, 11)
  //Product Number, 5 characters starting at position 12
  productModelNumber = passedBarcode.substring(12, 17)

  //test output
  console.log("MATCHED UCC VENDOR LICENSE NUMBER")
  console.log(productVendorLicense)
  console.log("MATCHED UCC MODEL NUMBER")
  console.log(productModelNumber)





  if(passedBarcode.includes('(10)')) {

  }




  return(returnObject)
}

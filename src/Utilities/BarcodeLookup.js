export function BarcodeSearch(barcode, viewFlag) {
  let passedBarcode = barcode
  let defaultScanObject = {}

  if(viewFlag === 0) {
    //HIBCC Encoding
    defaultScanObject = {
      barcode: "",
      trayState: false,
      isUnknown: true,
      name: "Unknown Product",
      model: "9188493038",
      lotSerial: "0209485",
      expiration: "08/08/2020",
      count: 1,
      scannedTime: "2-20-2020 9:45 PM",
    }
  }
  else if(viewFlag === 1) {
    //UCC Encoding
    defaultScanObject = {
      barcode: "",
      trayState: false,
      name: "55mm Laser Gun",
      lotSerial: "990283409",
      model: "G4FR4",
      scannedTime: "2-20-2020 9:45 PM",
      manufacturer: "medtronic",
      expiration: "08/08/2020",
      waste: false,
      scanned: false,
    }
  }
  defaultScanObject.barcode = passedBarcode
  return (defaultScanObject)
}

import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert, BackHandler } from 'react-native'
import ZebraScanner from 'react-native-zebra-scanner'
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.jpg'
import CaseProductItem from '../Components/CaseProductItem'
import TestLabelBarcodes from '../dummyData/rfidBarcodesOffline.json'
import { RFIDlabelSearch } from '../Utilities/RFIDLabelLookup'

import SoundPlayer from 'react-native-sound-player'
import moment from "moment"

var Realm = require('realm');
let activeUser ;
let physiciansList ;
let locationsList ;
let proceduresList ;
let rfidLabels ;
let activeScanableCase ;
let workingCaseSpace ;
let scanListener = {}

import styles from '../Styles/ContainerStyles.js'

export default class CasesScan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scannedBarcode: '',
      scannerConnected: false,
      testCount: 0,
      scanCount: 0,
      errorLogMessage: '',
      caseNumber: '',
      patientNumber: '',
      doctorName: '',
      procedureDescription: '',
      siteName: '',
      lastCompleteFlag: true,
      showSaveInvalid: false,
      lastScannedObject: {},
      productSummaryFlash: [],
      isSynching: false,
      isUpdating: false,
      showSummary: false,
    }

    activeUser = new Realm({
      schema: [{name: 'Active_User',
        properties: {
          userId:"string",
          userName: "string",
          userToken: "string",
          tokenExpiration: "string?",
          syncAddress: "string?",
          organizationName: "string?",
          //Additional Organization Level Configuration Options go Here.
      }}]
    });
    products = new Realm({
      schema: [{name: 'Products_Lookup',
      properties:{
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
    rfidLabels = new Realm({
      schema: [{name: 'RFID_Labels',
      properties: {
        licenseNumber: "string?",
        productModelNumber: "string",
        lotSerialNumber: "string?",
        expirationDate: "string?",
        tagid: "string?",
      }}]
    });
    physiciansList = new Realm({
      schema: [{name: 'Physicians_List',
      properties: {
        physicianId: "string",
        firstName: "string",
        middleInitial: "string?",
        lastName: "string",
        active: "string",
      }}]
    });
    locationsList = new Realm({
      schema: [{name: 'Locations_List',
      properties: {
        siteId: "int",
        siteDescription: "string",
        active: "string",
      }}]
    });
    proceduresList = new Realm({
      schema: [{name: 'Procedures_List',
      properties: {
        procedureCode: "string",
        procedureDescription: "string",
        active: "string",
      }}]
    });
    activeScanableCase = new Realm({
      schema: [{name: 'Active_Scanable_Case',
      properties: {
        chead_pk_case_number: "string",
        chead_pk_site_id: "int",
        chead_patient_id: "string",

        cproc_pk_procedure_code: "string",
        cproc_physician_id: "string",
        cproc_billing_code: "string?",
        cproc_sync_site_name: "string?",

        chead_datetime_in: "string?",
        chead_datetime_out: "string?",
        chead_user_one: "string?",
        chead_user_two: "string?",
        chead_user_three: "string?",
        chead_user_four: "string?",
      }}]
    });
    workingCaseSpace = new Realm({
      schema: [{name: 'Working_Case_Space',
      properties: {
        barcode: "string",
        barcodeMatchSegment: "string?",
        description: "string",
        scannedRfid: "bool?",
        cprod_pk_product_sequence: "int?",
        cprod_line_number: "int?",
        cprod_billing_code: "string?",
        cprod_change_timestamp: "string?",
        cprod_change_userid: "string?",
        cprod_expiration_date: "string?",
        cprod_license_number: "string?",
        cprod_product_model_number: "string",
        cprod_lot_serial_number: "string",
        cprod_no_charge_reason: "string?",
        cprod_no_charge_type: "string?",
        cprod_remote_id: "string?",
        cprod_requisition_number: "int?",
      }}]
    });
    this.ScanBarcode = this.ScanBarcode.bind(this)
    scanListener = (scannedCode) => {
      this.ScanBarcode(scannedCode)
    }
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => this.doubleBackButton());
    try {
      ZebraScanner.removeScanListener(scanListener)
    }
    catch {
      console.log("REMOVE SCAN LISTENER FAILED")
    }

  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress',  () => this.doubleBackButton());
    this.checkForScanner()
    let activeCaseDetail = activeScanableCase.objects("Active_Scanable_Case")
    let physiciansDisplayObject = [{
      firstName: "",
      lastName: "",
    }]
    let proceduresDisplayObject = [{
      procedureDescription: "",
    }]
    let sitesDisplayObject = [{
      siteDescription: "",
    }]
    let displayCaseDetail = activeCaseDetail[0]

    if(displayCaseDetail.cproc_physician_id != null && displayCaseDetail.cproc_physician_id != undefined) {
      console.log("DEBUGING THIS BULLSHIT AGAIN")
      let buildPhysiciansString = 'physicianId CONTAINS "' + displayCaseDetail.cproc_physician_id + '"'
      console.log(buildPhysiciansString)
      let physiciansObjects = physiciansList.objects("Physicians_List")
      console.log(physiciansObjects.length)
      physiciansDisplayObject = physiciansObjects.filtered(buildPhysiciansString)
      physiciansDisplayObject.forEach((item, i) => {
        console.log(item)
      });

    }

    if(displayCaseDetail.cproc_pk_procedure_code != null && displayCaseDetail.cproc_pk_procedure_code != undefined) {
      let buildProcedureString = 'procedureCode CONTAINS "' + displayCaseDetail.cproc_pk_procedure_code + '"'
      let proceduresObjects = proceduresList.objects("Procedures_List")
      proceduresDisplayObject = proceduresObjects.filtered(buildProcedureString)
    }

    console.log("SITE ID")
    console.log(displayCaseDetail.chead_pk_site_id)
    if(displayCaseDetail.chead_pk_site_id != null && displayCaseDetail.chead_pk_site_id != undefined) {
      let buildLocationString = 'siteId = ' + displayCaseDetail.chead_pk_site_id + ''
      let sitesObjects = locationsList.objects("Locations_List")
      sitesDisplayObject = sitesObjects.filtered(buildLocationString)
    }

    console.log("CASE DISPLAY OBJECTS")
    console.log(displayCaseDetail.chead_patient_id)
    console.log(physiciansDisplayObject[0])
    console.log(physiciansDisplayObject[0].firstName)
    console.log(physiciansDisplayObject[0].lastName)
    console.log(proceduresDisplayObject[0].procedureDescription)
    console.log(sitesDisplayObject[0].siteDescription)
    this.setState({
      caseNumber: displayCaseDetail.chead_pk_case_number,
      patientNumber: displayCaseDetail.chead_patient_id,
      doctorName: physiciansDisplayObject[0].firstName + ' ' + physiciansDisplayObject[0].lastName,
      procedureDescription: proceduresDisplayObject[0].procedureDescription,
      siteName: sitesDisplayObject[0].siteDescription,
    })
  }
  doubleBackButton = () => {
    this.props.navigation.navigate('CasesSetup')
  }
  async checkForScanner () {
    let scannerStatus = await ZebraScanner.isAvailable();
    if(scannerStatus) {
      try {
        ZebraScanner.addScanListener(scanListener)
      }
      catch {
        this.setState({
          errorLogMessage: "ADD SCAN LISTENER FAILED"
        })
      }
      this.setState({
        scannerConnected: true
      })
    }
    else {
      this.setState({
        scannerConnected: false
      })
    }
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: (
        <View style={{width: 150, height: 31} }>
          <Image
            style={{width: 150,height: 31,}}
            source={HeaderLogo}
          />
        </View>
      ),
      headerLeft:(
        <View></View>
      ),
      headerRight: (
        <View style={{flexDirection:'row'}}>
          <View style={{flex: 1,paddingRight:10,}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Home', {
                  userInformation: navigation.getParam('userInformation')
                })
              }>
              <Icon name="home" size={30} color="#102541" />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1,paddingRight:10,}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AccountInfo')
              }>
              <Icon name="user-circle-o" size={26} color="#102541" />
            </TouchableOpacity>
          </View>
        </View>
      ),
    }
  };
  FetchProductTable = () => {
    //Product Calls
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/subscriptions')
    //test server call
    console.log("FETCHRPRODUCTTABLE CALLED FROM ACCOUNT INFORMATION PAGE")
    return fetch('http://45.42.176.50:5100/api/Products')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("PRODUCT RESPONSE")
      console.log(responseJson)
      productResponse = responseJson;
      this.saveProductTable(productResponse)
    })
    .then(this.props.navigation.navigate('Home'))
    .catch((error) => {
      console.error(error);
      this.setState({
        isFetchingProducts: false,
        showSyncFooter: true,
        syncProgressMessage: 'Syncing Failed: ' + error
      })
    });
  }

  saveProductTable = (responseproducts) => {
    let savedProducts = products.objects('Products_Lookup')
    let newProducts = responseproducts

    console.log("SAVE PRODUCT TABLE CALLED")

    if(savedProducts != undefined && savedProducts != null && savedProducts.length > 0) {
      products.write(() => {
        products.deleteAll()
        newProducts.forEach(function(product, i) {
          try {
            products.create('Products_Lookup', {
              licenseNumber: product.licenseNumber,
              productModelNumber: product.productModelNumber,
              orderThruVendor: product.orderThruVendor,
              productDescription: product.productDescription,
              autoReplace: product.autoReplace,
              discontinued: product.discontinued,
              productCategory: product.productCategory,
              hospitalItemNumber: product.hospitalItemNumber,
              unitOfMeasure: product.unitOfMeasure,
              unitOfMeasureQuantity: product.unitOfMeasureQuantity,
              reorderValue: product.reorderValue,
              quantityOnHand: product.quantityOnHand,
              quantityOrdered: product.quantityOrdered,
              lastRequistionNumber: product.lastRequistionNumber,
              orderStatus: product.orderStatus,
              active: product.active,
              accepted: product.accepted,
              consignment: product.consignment,
              minimumValue: product.minimumValue,
              maximumValue: product.maximumValue,
              nonOrdered: product.nonOrdered,
              productNote: product.productNote,
            })
          }
          catch (e) {
            this.setState({
              syncProgressMessage: "Error on product item creation " + i
            })
            console.log(e);
          }
        })
      })
    }
    else {
      products.write(() => {
        newProducts.forEach(function(product, i) {
          try {
            products.create('Products_Lookup', {
              licenseNumber: product.licenseNumber,
              productModelNumber: product.productModelNumber,
              orderThruVendor: product.orderThruVendor,
              productDescription: product.productDescription,
              autoReplace: product.autoReplace,
              discontinued: product.discontinued,
              productCategory: product.productCategory,
              hospitalItemNumber: product.hospitalItemNumber,
              unitOfMeasure: product.unitOfMeasure,
              unitOfMeasureQuantity: product.unitOfMeasureQuantity,
              reorderValue: product.reorderValue,
              quantityOnHand: product.quantityOnHand,
              quantityOrdered: product.quantityOrdered,
              lastRequistionNumber: product.lastRequistionNumber,
              orderStatus: product.orderStatus,
              active: product.active,
              accepted: product.accepted,
              consignment: product.consignment,
              minimumValue: product.minimumValue,
              maximumValue: product.maximumValue,
              nonOrdered: product.nonOrdered,
              productNote: product.productNote,
            })
          }
          catch (e) {
            this.setState({
              syncProgressMessage: "Error on product item creation " + i
            })
            console.log(e);
          }
        })
      })
    }
  }
  saveBarCodeTable = (responsebarcodes) => {
    let savedBarcodes = productBarCodes.objects('Product_Bar_Codes')
    let newBarcodes = responsebarcodes

    this.setState({
      isFetchingBarcodes: true,
      syncProgressMessage: "Saving Barcodes",
    })

    if(savedBarcodes != undefined && savedBarcodes != null && savedBarcodes.length > 0) {
      productBarCodes.write(() => {
        productBarCodes.deleteAll()
        newBarcodes.forEach(function(barcode, i) {
          try {
            productBarCodes.create('Product_Bar_Codes', {
              productBarCode1: barcode.productBarCode1,
              licenseNumber: barcode.licenseNumber,
              productModelNumber: barcode.productModelNumber,
              encoding: barcode.encoding,
            })

          }
          catch (e) {
            this.setState({
              syncProgressMessage: "Error on barcode item creation " + i
            })
            console.log(e);
          }
        })
      })
    }
    else {
      productBarCodes.write(() => {
        newBarcodes.forEach(function(barcode, i) {
          try {
            productBarCodes.create('Product_Bar_Codes', {
              productBarCode1: barcode.productBarCode1,
              licenseNumber: barcode.licenseNumber,
              productModelNumber: barcode.productModelNumber,
              encoding: barcode.encoding,
            })
          }
          catch (e) {
            this.setState({
              syncProgressMessage: "Error on barcode item creation " + i
            })
            console.log(e);
          }
        })
      })
    }
  }
  saveRfidTable = (responserfids) => {
    let savedRfidLabels = rfidLabels.objects('RFID_Labels')
    let newRfidLabels = responserfids
    console.log('SAVE RFID TABLE CALLED')
    this.setState({
      isFetchingLabels: true,
      syncProgressMessage: "Saving Labels",
    })

    if(savedRfidLabels != undefined && savedRfidLabels != null && savedRfidLabels.length > 0) {
      rfidLabels.write(() => {
        rfidLabels.deleteAll()
        newRfidLabels.forEach(function(label, i) {
          if(label.productModelNumber != null && label.productModelNumber != undefined) {
            try {
              rfidLabels.create('RFID_Labels', {
                licenseNumber: label.licenseNumber,
                productModelNumber: label.productModelNumber,
                lotSerialNumber: label.lotSerialNumber,
                expirationDate: label.expirationDate,
                tagid: label.tagid,
              })
            }
            catch (e) {
              this.setState({
                syncProgressMessage:"Error on rfid label creation " + i
              })
              console.log(e);
            }
          }
          else {
            console.log("NULL MODEL NUMBER SKIPPED")
          }
        })
      })
    }
    else {
      rfidLabels.write(() => {
        newRfidLabels.forEach(function(label, i) {
          try {
            rfidLabels.create('RFID_Labels', {
              licenseNumber: label.licenseNumber,
              productModelNumber: label.productModelNumber,
              lotSerialNumber: label.lotSerialNumber,
              expirationDate: label.expirationDate,
              tagid: label.tagid,
            })
          }
          catch (e) {
            console.log("Error on rfid label creation");
            console.log(e);
          }
        })
      })
    }
  }

  FetchRFIDTable = () => {
    //RFID Call
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/subscriptions')
    //test server call
    console.log("FETCHRFIDTABLE CALLED FROM ACCOUNT INFORMATION PAGE")
    return fetch('http://45.42.176.50:5100/api/RfidLabels/View')
    .then((rfidresponse) => rfidresponse.json())
    .then((rfidresponseJson) => {
      console.log("RFID RESPONSE RECEIVED")
      rfidLabelResponse = rfidresponseJson;
      this.saveRfidTable(rfidLabelResponse)

      this.setState({
        syncProgressMessage: 'RFID Labels Synced',
        isFetchingLabels: false,
        showSyncFooter: false,
      })
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        isFetchingLabels: false,
        showSyncFooter: true,
        syncProgressMessage: 'Syncing Failed: ' + error
      })
    });
  }

  renderCaseProducts() {
    let caseInformation = activeScanableCase.objects("Active_Scanable_Case")
    let caseProducts = workingCaseSpace.objects("Working_Case_Space")
    let caseProductsOutput = []

    if(caseProducts != undefined && caseProducts != null) {
      let sortedCaseProducts = caseProducts.sorted("cprod_change_timestamp", true)
      sortedCaseProducts.forEach(function(product, index){
        caseProductsOutput.push(
          <CaseProductItem
            key={"CPI"+index}
            barcode={product.barcode}
            name={product.description}
            lotSerial={product.cprod_lot_serial_number}
            model={product.cprod_product_model_number}
            scannedTime={product.cprod_change_timestamp}
            expired={product.cprod_expiration_date}
            manufacturer={product.manufacturer}
            waste={false}
            timeIn={caseInformation[0].chead_datetime_in}
            timeOut={caseInformation[0].chead_datetime_out}
            scanned={product.scannedRfid}
            wasteFunction={() => this.wasteScannedItem(product.description)}
            removeFunction={() => this.removeScannedItem(product.barcode)} />
        )
      }.bind(this))
    }
    if(caseProductsOutput.length <= 0) {
      caseProductsOutput.push(
        <Text key={"CPI"+0} style={styles.noDataText}>No Items Scanned</Text>
      )
    }
    return(caseProductsOutput)
  }
  GetScannerStatus(status) {
    let scannerStatus = status

    if(scannerStatus === true) {
      return(
        <Text style={styles.scannerConnected}>Scanner Ready</Text>
      )
    }
    else {
      return(
        <Text style={styles.scannerDisconnected}>Scanner Unavailable</Text>
      )
    }
  }
  SaveInvalidScan = (lastLookup) => {
    workingCaseSpace.write(() => {
      try {
        workingCaseSpace.create('Working_Case_Space', {
          barcode: lastLookup.scannedLabel,
          description: lastLookup.productDescription,
          scannedRfid: lastLookup.scannedRfid,
          cprod_pk_product_sequence: 0,
          cprod_line_number: 0,
          cprod_billing_code: "Default",
          cprod_change_timestamp: new Date().toISOString(),
          cprod_change_userid: "Scanner",
          cprod_expiration_date: lastLookup.expirationDate,
          cprod_license_number: lastLookup.licenseNumber,
          cprod_product_model_number: lastLookup.productModelNumber,
          cprod_lot_serial_number: lastLookup.lotSerialNumber,
          cprod_no_charge_reason: "Default Value",
          cprod_no_charge_type: "3",
          cprod_remote_id: "Scanner1",
          cprod_requisition_number: 0
        })
        this.setState({
          pageErrorMessage: "",
          showSaveInvalid: false,
        })
      }
      catch (e) {
        console.log("Error on working case space invalid item creation");
        console.log(e);
        this.setState({
          pageErrorMessage: "Item Save Error",
          showSaveInvalid: false,
        })
      }
    });

  }
  RenderSaveInvalidSection(showSaveInvalid) {
    if(showSaveInvalid === true) {
      return(
        <View>
          <View style={styles.menuRow}>
            <View style={styles.majorColumn}>
              <Text style={styles.invalidSaveLabel}>Save this Scan Segment as an Unknown Product:</Text>
            </View>
            <View style={styles.majorColumn}>
              <TouchableOpacity style={styles.miniSubmitButton} onPress={() => this.SaveInvalidScan(this.state.lastScannedObject)}>
                <Text style={styles.miniSubmitButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }
    else {
      return(<View></View>)
    }
  }
  ScanBarcode = (newBarcode) => {
    if(newBarcode.substring(0,1) === "{") {
      console.log('INVALID SCAN FORMAT')
      try {
          SoundPlayer.playSoundFile('invalidscan', 'wav')
      } catch (e) {
          console.log(`cannot play the sound file`, e)
      }
      this.setState({
        pageErrorMessage: "Unsupported Barcode Format",
        showSaveInvalid: false,
        lastCompleteFlag: true,
      })
    }
    else {
      let scannedBarcode = newBarcode
      this.setState({
        showSaveInvalid: false,
      })
      //Instantiate Variables
      if(scannedBarcode != undefined && scannedBarcode != null) {
        let scannedItemsList = workingCaseSpace.objects("Working_Case_Space")

        //Behaves differently than intake scan since like items aren't grouped.
        //Each unique RFID tag is a line item and all RFID tags are unique.
        let barcodeLookup = RFIDlabelSearch(scannedBarcode, this.state.lastScannedObject, this.state.lastCompleteFlag)
        if(barcodeLookup === null || barcodeLookup === undefined) {
          this.setState({
            pageErrorMessage: "BAD LOOKUP"
          })
        }
        else {
          if(barcodeLookup.passThroughCompletenessFlag === true) {
            this.setState({
              lastCompleteFlag: true,
              lastScannedObject: barcodeLookup,
            })
          }
          else {
            this.setState({
              lastCompleteFlag: false,
              lastScannedObject: barcodeLookup,
            })
          }
          this.setState({
            pageErrorMessage: ""
          })
        }
        console.log("SCANNED RFID")
        console.log(barcodeLookup.scannedRfid)
        if(barcodeLookup.scannedRfid === false) {
          //item was secondary barcode
          console.log("SCANNED RFID FALSE EXPIRATION FORMAT")
          console.log(barcodeLookup.expirationDate)
          if(barcodeLookup.passThroughCompletenessFlag === true) {
            workingCaseSpace.write(() => {
              try {
                workingCaseSpace.create('Working_Case_Space', {
                  barcode: barcodeLookup.scannedLabel,
                  description: barcodeLookup.productDescription,
                  scannedRfid: barcodeLookup.scannedRfid,
                  cprod_pk_product_sequence: 0,
                  cprod_line_number: 0,
                  cprod_billing_code: "Default",
                  cprod_change_timestamp: new Date().toISOString(),
                  cprod_change_userid: "Scanner",
                  cprod_expiration_date: barcodeLookup.expirationDate,
                  cprod_license_number: barcodeLookup.licenseNumber,
                  cprod_product_model_number: barcodeLookup.productModelNumber,
                  cprod_lot_serial_number: barcodeLookup.lotSerialNumber,
                  cprod_no_charge_reason: "Default Value",
                  cprod_no_charge_type: "1",
                  cprod_remote_id: "Scanner",
                  cprod_requisition_number: 0
                })
              }
              catch (e) {
                this.setState({
                  pageErrorMessage: "Scan Save Error: " + e
                })
                console.log("Error on Working Case Space Create")
                console.log(e)
              }
            })
            if(barcodeLookup.isUnknown === true) {
              try {
                  SoundPlayer.playSoundFile('unknownproduct', 'wav')
              } catch (e) {
                  console.log(`cannot play the sound file`, e)
              }
            }
            else {
              try {
                  SoundPlayer.playSoundFile('scansuccess', 'wav')
              } catch (e) {
                  console.log(`cannot play the sound file`, e)
              }
            }
            this.setState({
              scanCount: (this.state.scanCount + 1)
            })
          }
          else {
            if(barcodeLookup.invalidScanSegment) {
              //set completeness flag here to drop return object and skip working space save
              try {
                  SoundPlayer.playSoundFile('invalidscan', 'wav')
              } catch (e) {
                  console.log(`cannot play the sound file`, e)
              }
              this.setState({
                pageErrorMessage: "Invalid Scan Segment Order",
                showSaveInvalid: true,
                lastCompleteFlag: true,
              })
            }
            else {
              try {
                  SoundPlayer.playSoundFile('continuescan', 'wav')
              } catch (e) {
                  console.log(`cannot play the sound file`, e)
              }
              this.setState({
                pageErrorMessage: "Scan Next Barcode Segment",
                lastCompleteFlag: false,
              })
            }
          }
        }
        else {
          //Item was RFID labeled product
          //If item is not expired, save to working DB.
          let currentTimeStamp = new Date().toISOString()
          let compareDate = moment(barcodeLookup.expirationDate, "MM-DD-YYYY").toISOString()
          console.log("RFID SCANNED TRUE EXPIRATION DATE")
          console.log(barcodeLookup.expirationDate)
          console.log(compareDate)
          console.log("CURRENT DATE")
          console.log(currentTimeStamp)
          console.log("IS EXPIRED CHECK")
          console.log(moment(currentTimeStamp).isBefore(compareDate))

          if(moment(currentTimeStamp).isBefore(compareDate)) {
            //Item is not expired
            if(barcodeLookup.passThroughCompletenessFlag === true) {
              workingCaseSpace.write(() => {
                try {
                  workingCaseSpace.create('Working_Case_Space', {
                    barcode: barcodeLookup.scannedLabel,
                    description: barcodeLookup.productDescription,
                    scannedRfid: barcodeLookup.scannedRfid,
                    cprod_pk_product_sequence: 0,
                    cprod_line_number: 0,
                    cprod_billing_code: "Default",
                    cprod_change_timestamp: new Date().toISOString(),
                    cprod_change_userid: "Scanner",
                    cprod_expiration_date: barcodeLookup.expirationDate,
                    cprod_license_number: barcodeLookup.licenseNumber,
                    cprod_product_model_number: barcodeLookup.productModelNumber,
                    cprod_lot_serial_number: barcodeLookup.lotSerialNumber,
                    cprod_no_charge_reason: "Default Value",
                    cprod_no_charge_type: "1",
                    cprod_remote_id: "Scanner",
                    cprod_requisition_number: 0
                  })
                }
                catch (e) {
                  this.setState({
                    pageErrorMessage: "Scan Save Error: " + e
                  })
                  console.log("Error on Working Case Space Create")
                  console.log(e)
                }
              })
              console.log("PRODUCT MODEL NUMBER")
              console.log(barcodeLookup.productModelNumber)
              if(barcodeLookup.isUnknown === true) {
                try {
                    SoundPlayer.playSoundFile('unknownproduct', 'wav')
                } catch (e) {
                    console.log(`cannot play the sound file`, e)
                }
              }
              else {
                try {
                    SoundPlayer.playSoundFile('scansuccess', 'wav')
                } catch (e) {
                    console.log(`cannot play the sound file`, e)
                }
              }
            }
            else {
              if(barcodeLookup.invalidScanSegment) {
                //set completeness flag here to drop return object and skip working space save
                try {
                    SoundPlayer.playSoundFile('invalidscan', 'wav')
                } catch (e) {
                    console.log(`cannot play the sound file`, e)
                }
                this.setState({
                  pageErrorMessage: "Invalid Scan Segment Order",
                  lastCompleteFlag: true,
                })
              }
            }

            this.setState({
              scanCount: (this.state.scanCount + 1)
            })
          }
          //If is expired do not save, display message, and make horrible noise.
          else {
            try {
                SoundPlayer.playSoundFile('expiredproduct', 'wav')
            } catch (e) {
                console.log(`cannot play the sound file`, e)
            }
            this.setState({
              pageErrorMessage: "This Product is Past Expiration Date: " + barcodeLookup.expirationDate
            })
            console.log(this.state.pageErrorMessage)
          }
        }
      }
    }
  }

  wasteScannedItem = (productName) => {
    //need to have some kind of a call to flag the item as wasted in
    //our system and the EMR system used by the hospital.
    alert("Connect to a call to the back end and from there EMR marking the item as waste for item: " + productName)
  }

  removeScannedItem = (barcode) => {
    let buildRemoveString = 'barcode CONTAINS "' + barcode + '"'
    let scannedItems = workingCaseSpace.objects("Working_Case_Space")
    let matchScanRemove = scannedItems.filtered(buildRemoveString)

    workingCaseSpace.write(() => {
      workingCaseSpace.delete(matchScanRemove)
    })
    this.setState({
      errorLogMessage: 'Product Number ' + matchScanRemove.productModelNumber + ' Removed.'
    })
  }

  generateScanTest = (count) => {
    let testStrings = TestLabelBarcodes
    this.setState({
      testCount: (count + 1)
    })

    return(this.ScanBarcode(testStrings[count].barcode))
  }

  clearCaseData() {
    let scannableCases = activeScanableCase.objects("Active_Scanable_Case")
    let scannedCaseProducts = workingCaseSpace.objects("Working_Case_Space")

    activeScanableCase.write(() => {
      activeScanableCase.deleteAll()
    })
    workingCaseSpace.write(() => {
      workingCaseSpace.deleteAll()
    })
    this.setState({
      pageErrorMessage: "Case Cleared",
      showSaveInvalid: false,
    })
    this.props.navigation.navigate('Home')
  }

  recordCleanup(failedCalls) {
    let failedSyncs = failedCalls
    let scannableCases = activeScanableCase.objects("Active_Scanable_Case")
    let scannableCase = scannableCases[0]
    let scannedCaseProducts = workingCaseSpace.objects("Working_Case_Space")

    if(failedSyncs.length === 0) {
      //Reset state as needed
      this.setState({
        showSummary: true,
        pageErrorMessage: "Last Sync Completed Successfully"
      })
    }
    else {
      scannedCaseProducts.forEach((caseItem, index) => {
        let matchFlag = false

        failedSyncs.forEach((failedCaseBarcode, i) => {
          if(caseItem.barcode === failedCaseBarcode) {
            matchFlag = true
          }
        })
        if(matchFlag === false) {
          let buildDeleteCaseScan = 'barcode CONTAINS "' + caseItem.barcode + '"'
          let filteredCaseItem = workingCaseSpace.filtered(buildDeleteCaseScan)
          workingCaseSpace.write(() => {
            workingCaseSpace.delete(filteredCaseItem)
          })
        }
      })
      this.setState({
        pageErrorMessage: "Some Items Could Not Sync to Server"
      })
    }
  }

  synchronizeCaseData = () => {
    //Instantiate Scanned Products and Case Detail
    let userObject = activeUser.objects("Active_User")
    let scannableCases = activeScanableCase.objects("Active_Scanable_Case")
    let scannableCase = scannableCases[0]
    let scannedCaseProducts = workingCaseSpace.objects("Working_Case_Space")
    let failedSyncs = []
    let expectedSyncs = scannedCaseProducts.length
    let completedSyncs = 0

    this.setState({
      productSummaryFlash: scannedCaseProducts
    })

    //Loop products and individually post to product and case data to sproc
    scannedCaseProducts.forEach((caseProduct, i) => {
      console.log("SYNC SCANNABLECASE")
      console.log(scannableCase)
      console.log("SYNC CASEPRODUCT")
      console.log(caseProduct)
      try {
        //AddCaseProductSproc old name
        fetch('http://45.42.176.50:5100/api/InsertCaseProduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            //add case product data format
            chead_pk_site_id: scannableCase.chead_pk_site_id.toString(),
            chead_pk_case_number: scannableCase.chead_pk_case_number,
            chead_patient_id: scannableCase.chead_patient_id,

            cproc_pk_procedure_code: scannableCase.cproc_pk_procedure_code,
            cproc_physician_id: scannableCase.cproc_physician_id,
            cproc_billing_code: scannableCase.cproc_billing_code,
            cproc_sync_site_name: this.state.siteName,

            chead_datetime_in: scannableCase.chead_datetime_in,
            chead_datetime_out: scannableCase.chead_datetime_out,
            chead_user_one: userObject[0].userId,
            chead_user_two: scannableCase.chead_user_two,
            chead_user_three: scannableCase.chead_user_three,
            chead_user_four: scannableCase.chead_user_four,

            cprod_pk_product_sequence: caseProduct.cprod_pk_product_sequence,
            cprod_line_number: caseProduct.cprod_line_number,
            cprod_billing_code: caseProduct.cprod_billing_code,
            cprod_change_timestamp: caseProduct.cprod_change_timestamp,
            cprod_change_userid: caseProduct.cprod_change_userid,
            cprod_expiration_date: moment(caseProduct.cprod_expiration_date, "YYMMDD").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
            cprod_license_number: caseProduct.cprod_license_number,
            cprod_product_model_number: caseProduct.cprod_product_model_number,
            cprod_lot_serial_number: caseProduct.cprod_lot_serial_number,
            cprod_no_charge_reason: caseProduct.cprod_no_charge_reason,
            cprod_no_charge_type: caseProduct.cprod_no_charge_type,
            cprod_remote_id: caseProduct.cprod_remote_id,
            cprod_requisition_number: caseProduct.cprod_requisition_number
          })
        })
        .then((syncresponse) =>  {
            console.log(syncresponse)
            let syncresponseJson = syncresponse.json()
            if (syncresponse.status >= 200 && syncresponse.status < 300) {
              console.log("SYNC CASE RESPONSE OBJECT")
              console.log(syncresponse)
              this.setState({
                errorLogMessage: 'SYNC Post Request Succeeded:' + i
              })
            } else {
              failedSyncs.push(caseProduct.barcode)
              console.log("SYNC CASE RESPONSE ERROR")
              console.log(syncresponseJson)
              console.log(syncresponseJson.status)
              return syncresponseJson.then(error => {throw error;});
              this.setState({
                errorLogMessage: 'SYNC Post Request Failed: ' + i
              })
            }
            completedSyncs = completedSyncs + 1;
            if(completedSyncs === expectedSyncs) {
              this.recordCleanup(failedSyncs)
            }
        })
        .catch((error) => {
          console.log("SYNC POST REQUEST FAILED")
          console.log(error);
          this.setState({
            errorLogMessage: 'SYNC Post Request Failed: ' + i
          })
          failedSyncs.push(caseProduct.barcode)
          completedSyncs = completedSyncs + 1;
          if(completedSyncs === expectedSyncs) {
            this.recordCleanup(failedSyncs)
          }
        });
      }
      catch (e) {
        console.log("SYNC POST REQUEST FAILED CATCH")
        console.log(e)
        this.setState({
          errorLogMessage: 'SYNC Post Request Failed'
        })
        failedSyncs.push(caseProduct.barcode)
        completedSyncs = completedSyncs + 1;
        if(completedSyncs === expectedSyncs) {
          this.recordCleanup(failedSyncs)
        }
      }
    });
  }

  renderCaseProductsSummary(products) {
    let caseProducts = products
    let caseProductsOutput = []

    products.forEach((product, i) => {
      caseProductsOutput.push(
        <View key={"sp" + i}>
          <Text style={styles.bodyTextLabel}>{product.description}</Text>
          <Text style={styles.bodyText}>{product.barcode}</Text>
        </View>
      )
    });

    return(caseProductsOutput)
  }

  renderCaseSummary() {
    let caseProducts = this.state.productSummaryFlash
    console.log("CASE PRODUCTS IN SUMMARY")
    console.log(caseProducts)
    return(
      <View>
        <View>
          <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Case Number: </Text>{this.state.caseNumber}</Text>
          <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Patient Id: </Text>{this.state.patientNumber}</Text>
          <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Doctor: </Text>{this.state.doctorName}</Text>
          <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Location: </Text>{this.state.siteName}</Text>
          <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Procedure: </Text>{this.state.procedureDescription}</Text>
        </View>
        {this.renderCaseProductsSummary(caseProducts)}

      </View>
    )
  }

  startNewCase() {
    let scannableCases = activeScanableCase.objects("Active_Scanable_Case")
    let scannedCaseProducts = workingCaseSpace.objects("Working_Case_Space")
    //reset or delete working case space and active scannable case
    activeScanableCase.write(() => {
      activeScanableCase.deleteAll()
    })
    workingCaseSpace.write(() => {
      workingCaseSpace.deleteAll()
    })

    this.setState({
      //clean out everything here.
      scannedBarcode: '',
      scannerConnected: false,
      testCount: 0,
      scanCount: 0,
      errorLogMessage: '',
      caseNumber: '',
      patientNumber: '',
      doctorName: '',
      procedureDescription: '',
      siteName: '',
      lastCompleteFlag: true,
      showSaveInvalid: false,
      lastScannedObject: {},
      productSummaryFlash: [],
      isSynching: false,
      isUpdating: true,
    })

    //make product update call and barcode update call. maybe also rfid update call.
    //redirect to case setup page when finished.
    console.log("START NEW CASE CALLED")

    this.FetchProductTable()
  }

  render() {
    let isLoggedIn = activeUser.objects('Active_User')
    if(isLoggedIn.length === 0) {
      return(this.props.navigation.navigate('Login'))
    }
    else {
      let activeCaseDetail = activeScanableCase.objects("Active_Scanable_Case")
      let physiciansDisplayObject = {
        firstName: "",
        lastName: "",
      }
      let proceduresDisplayObject = {
        procedureDescription: "",
      }
      let sitesDisplayObject = {
        siteDescription: "",
      }

      if(this.state.showSummary === false) {
        return (
          <View style={{flex: 1}}>
            <ScrollView style={styles.scrollContainer}>
              <View style={styles.container}>
                <View style={styles.titleRow}>
                  <View style={styles.majorColumn}>
                    <Text style={styles.titleText}>Case Information</Text>
                  </View>
                  <View style={styles.majorColumn}>
                    <TouchableOpacity onPress={() => this.clearCaseData()} style={styles.miniSubmitButton}>
                      <Text style={styles.miniSubmitButtonText}>Clear Case</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.sectionContainer}>
                  <View style={styles.shadedBackgroundWrapper}>
                    <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Case Number: </Text>{this.state.caseNumber}</Text>
                    <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Patient Id: </Text>{this.state.patientNumber}</Text>
                    <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Doctor: </Text>{this.state.doctorName}</Text>
                    <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Location: </Text>{this.state.siteName}</Text>
                    <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Procedure: </Text>{this.state.procedureDescription}</Text>
                  </View>
                </View>
                <View style={styles.errorTextContainer}><Text style={styles.errorText}>{this.state.pageErrorMessage}</Text></View>
                {this.RenderSaveInvalidSection(this.state.showSaveInvalid)}
                <View style={styles.sectionContainer}>
                  <View style={styles.menuRow}>
                    <View style={styles.majorColumn}>
                      {this.GetScannerStatus(this.state.scannerConnected)}
                    </View>
                    <View style={styles.majorColumn}>
                      <Text>Test Scan Function: </Text>
                      <TouchableOpacity onPress={() => this.generateScanTest(this.state.testCount)} style={styles.miniSubmitButton}>
                        <Text style={styles.miniSubmitButtonText}>Scan Test</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {this.renderCaseProducts()}
                </View>
              </View>
            </ScrollView>
            <View style={styles.footerContainer}>
              <View style={styles.leftColumn}>
                <Text style={styles.bodyTextLabel}>Complete</Text>
                <Text style={styles.bodyTextLabel}>Case Scanning</Text>
              </View>
              <View style={styles.rightColumn}>
                <TouchableOpacity style={styles.submitButton} onPress={() => this.synchronizeCaseData()}>
                  <Text style={styles.submitButtonText}>Synchronize</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }
      else {
        return(
          <View style={{flex: 1}}>
            <ScrollView style={styles.scrollContainer}>
              <View style={styles.container}>
                <View style={styles.titleRow}>
                  <Text style={styles.titleText}>Case Information</Text>
                </View>
                <View style={styles.errorTextContainer}><Text style={styles.errorText}>{this.state.pageErrorMessage}</Text></View>
                <View style={styles.sectionContainer}>
                  <View key={"noData"}>
                    <Text style={styles.noDataText}>
                      Synchronization Complete
                    </Text>
                    <View>
                      {this.renderCaseSummary()}
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={() => this.startNewCase()}>
                      <Text style={styles.submitButtonText}>Start New Case</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        )
      }
    }
  }
}

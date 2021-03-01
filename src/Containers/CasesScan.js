import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import ZebraScanner from 'react-native-zebra-scanner'
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.jpg'
import CaseProductItem from '../Components/CaseProductItem'
import TestLabelBarcodes from '../dummyData/rfidBarcodesOffline.json'
import { RFIDlabelSearch } from '../Utilities/RFIDLabelLookup'
import Tone from "react-native-tone-android";

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

    rfidLabels = new Realm({
      schema: [{name: 'RFID_Labels',
      properties: {
        productTransactionNumber: "int?",
        licenseNumber: "string",
        productModelNumber: "string",
        lotSerialNumber: "string?",
        expirationDate: "string?",
        tagid: "string?",
        caseProductSequence: "int?",
        bcPrimary: "string?",
        bcSecondary: "string?",
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
        siteId: "string",
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
        chead_pk_site_id: "string",
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
    try {
      ZebraScanner.removeScanListener(scanListener)
    }
    catch {
      console.log("REMOVE SCAN LISTENER FAILED")
    }

  }
  componentDidMount() {
    this.checkForScanner()
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
    let displayCaseDetail = activeCaseDetail[0]

    if(displayCaseDetail.cproc_physician_id != null && displayCaseDetail.cproc_physician_id != undefined) {
      let buildPhysiciansString = 'physicianId CONTAINS "' + displayCaseDetail.cproc_physician_id + '"'
      let physiciansObjects = physiciansList.objects("Physicians_List")
      physiciansDisplayObject = physiciansObjects.filtered(buildPhysiciansString)
    }

    if(displayCaseDetail.cproc_pk_procedure_code != null && displayCaseDetail.cproc_pk_procedure_code != undefined) {
      let buildProcedureString = 'procedureCode CONTAINS "' + displayCaseDetail.cproc_pk_procedure_code + '"'
      let proceduresObjects = proceduresList.objects("Procedures_List")
      proceduresDisplayObject = proceduresObjects.filtered(buildProcedureString)
    }

    if(displayCaseDetail.chead_pk_site_id != null && displayCaseDetail.chead_pk_site_id != undefined) {
      let buildLocationString = 'siteId CONTAINS "' + displayCaseDetail.chead_pk_site_id + '"'
      let sitesObjects = locationsList.objects("Locations_List")
      sitesDisplayObject = sitesObjects.filtered(buildLocationString)
    }

    this.setState({
      caseNumber: displayCaseDetail.chead_pk_case_number,
      patientNumber: displayCaseDetail.chead_patient_id,
      doctorName: physiciansDisplayObject[0].firstName + ' ' + physiciansDisplayObject[0].lastName,
      procedureDescription: proceduresDisplayObject[0].procedureDescription,
      siteName: sitesDisplayObject[0].siteDescription,
    })
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
  ScanBarcode = (newBarcode) => {
    let scannedBarcode = newBarcode
    this.setState({
      pageErrorMessage: "Barcode Scanned: " + scannedBarcode
    })
    //Instantiate Variables
    if(scannedBarcode != undefined && scannedBarcode != null) {
      let scannedItemsList = workingCaseSpace.objects("Working_Case_Space")

      //Behaves differently than intake scan since like items aren't grouped.
      //Each unique RFID tag is a line item and all RFID tags are unique.
      let barcodeLookup = RFIDlabelSearch(scannedBarcode)
      if(barcodeLookup === null || barcodeLookup === undefined) {
        this.setState({
          pageErrorMessage: "BAD LOOKUP"
        })
      }
      else {
        this.setState({
          pageErrorMessage: barcodeLookup.productDesc
        })
      }
      //If item is not expired, save to working DB.
      let currentTimeStamp = new Date().toISOString()
      let currentDate = moment(currentTimeStamp).format("YYMMDD")
      if(parseFloat(barcodeLookup.expirationDate) > parseFloat(currentDate)) {
        workingCaseSpace.write(() => {
          try {
            workingCaseSpace.create('Working_Case_Space', {
              barcode: scannedBarcode,
              description: barcodeLookup.productDescription,
              scannedRfid: barcodeLookup.scannedRfid,
              cprod_pk_product_sequence: null,
              cprod_line_number: null,
              cprod_billing_code: null,
              cprod_change_timestamp: new Date().toISOString(),
              cprod_change_userid: "Scanner",
              cprod_expiration_date: barcodeLookup.expirationDate,
              cprod_license_number: barcodeLookup.licenseNumber,
              cprod_product_model_number: barcodeLookup.productModelNumber,
              cprod_lot_serial_number: barcodeLookup.lotSerialNumber,
              cprod_no_charge_reason: null,
              cprod_no_charge_type: null,
              cprod_remote_id: null,
              cprod_requisition_number: null
            })
          }
          catch (e) {
            this.setState({
              pageErrorMessage: "Error on Working Case Space Create"
            })
            console.log("Error on Working Case Space Create")
            console.log(e)
          }
        })
        this.setState({
          scanCount: (this.state.scanCount + 1)
        })
      }
      //If is expired do not save, display message, and make horrible noise through tone generator.
      else {
        this.setState({
          pageErrorMessage: "This product is past Expiration Date"
        })
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
      pageErrorMessage: "Case Cleared"
    })
    this.props.navigation.navigate('Home')
  }

  recordCleanup(failedCalls) {
    let failedSyncs = failedCalls
    let scannableCases = activeScanableCase.objects("Active_Scanable_Case")
    let scannableCase = scannableCases[0]
    let scannedCaseProducts = workingCaseSpace.objects("Working_Case_Space")

    if(failedSyncs.length === 0) {
      //If successfully synced all products delete working DB's and
      //redirect to home page. ? setup page?
      activeScanableCase.write(() => {
        activeScanableCase.deleteAll()
      })
      workingCaseSpace.write(() => {
        workingCaseSpace.deleteAll()
      })
      //Reset state as needed
      this.setState({
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

    //Loop products and individually post to product and case data to sproc
    scannedCaseProducts.forEach((caseProduct, i) => {
      try {
        fetch('http://25.78.82.76:5100/api/AddCaseProductSproc', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            //add case product data format
            chead_pk_site_id: scannableCase.chead_pk_site_id,
            chead_pk_case_number: scannableCase.chead_pk_case_number,
            chead_patient_id: scannableCase.chead_patient_id,

            cproc_pk_procedure_code: scannableCase.cproc_pk_procedure_code,
            cproc_physician_id: scannableCase.cproc_physician_id,
            cproc_billing_code: scannableCase.cproc_billing_code,
            cproc_sync_site_name: scannableCase.cproc_sync_site_name,

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
            cprod_expiration_date: caseProduct.cprod_expiration_date,
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
            let syncresponseJson = syncresponse.json()
            if (syncresponse.status >= 200 && syncresponse.status < 300) {
              console.log("SYNC CASE RESPONSE OBJECT")
              console.log(syncresponseJson)
              this.setState({
                errorLogMessage: 'SYNC Post Request Succeeded:' + i
              })
            } else {
              failedSyncs.push(caseProduct.barcode)
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

      if(activeCaseDetail != null && activeCaseDetail != undefined && activeCaseDetail.length > 0) {
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
                <View><Text style={styles.errorText}>{this.state.pageErrorMessage}</Text></View>
                <View style={styles.sectionContainer}>
                  <View style={styles.shadedBackgroundWrapper}>
                    {/*<Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Case Number: </Text>{this.state.caseNumber}</Text>*/}
                    <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Patient Id: </Text>{this.state.patientNumber}</Text>
                    <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Doctor: </Text>{this.state.doctorName}</Text>
                    <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Location: </Text>{this.state.siteName}</Text>
                    <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Procedure: </Text>{this.state.procedureDescription}</Text>
                  </View>
                </View>
                <View style={styles.sectionContainer}>
                  <Text>Test Scan Function: </Text>
                  <TouchableOpacity onPress={() => this.generateScanTest(this.state.testCount)} style={styles.miniSubmitButton}><Text style={styles.miniSubmitButtonText}>Scan Test</Text></TouchableOpacity>
                </View>
                <View style={styles.sectionContainer}>
                  <View style={styles.menuRow}>
                    <View style={styles.majorColumn}>
                      {this.GetScannerStatus(this.state.scannerConnected)}
                    </View>
                    <View style={styles.majorColumn}>
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
                <View><Text style={styles.errorText}>{this.state.pageErrorMessage}</Text></View>
                <View style={styles.sectionContainer}>
                  <View key={"noData"}>
                    <Text style={styles.noDataText}>
                      Synchronization Complete
                    </Text>
                    <TouchableOpacity style={styles.submitButton} onPress={() => this.props.navigation.navigate('CasesSetup')}>
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

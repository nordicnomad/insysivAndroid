import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import ZebraScanner from 'react-native-zebra-scanner'
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import CaseProductItem from '../Components/CaseProductItem'
import TestLabels from '../dummyData/rfidLabelsOffline'
import { RFIDLabelLookup } from '../Utilities/RFIDLabelLookup'

var Realm = require('realm');
let activeUser ;
let physiciansList ;
let locationsList ;
let proceduresList ;
let rfidLabels ;
let activeScanableCase ;
let workingCaseSpace ;

import styles from '../Styles/ContainerStyles.js'

export default class CasesScan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scannedBarcode: '',
      scannerConnected: false,
      testCount: 0,
      caseInformation: {
        number: '',
        name: '',
        doctor: {},
        location: {},
        procedure: {},
        products: []
      }
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
        chead_pk_case_number: "int",
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
        cprod_requisition_number: "int?"
      }}]
    });

  }
  componentDidMount() {

    this.checkForScanner()
  }
  async checkForScanner () {
    let scannerStatus = await ZebraScanner.isAvailable();

    console.log("SCANNER IS AVAILABLE")
    console.log(scannerStatus)
    if(scannerStatus) {
      ZebraScanner.addScanListener(this.ScanBarcode)
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
      caseProducts.forEach(function(product, index){
        caseProductsOutput.push(
          <CaseProductItem
            key={"CPI"+index}
            barcode={product.barcode}
            name={product.description}
            lotSerial={product.cprod_lot_serial_number}
            model={product.cprod_product_model_number}
            scannedTime={product.cprod_change_timestamp}
            manufacturer={product.manufacturer}
            waste={false}
            scanned={true}
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
    //Instantiate Variables
    if(scannedBarcode != undefined && scannedBarcode != null) {
      let scannedItemsList = workingCaseSpace.objects("Working_Case_Space")

      //Behaves differently than intake scan since like items aren't grouped.
      //Each unique RFID tag is a line item and all RFID tags are unique.
      let barcodeLookup = RFIDLabelLookup(scannedBarcode)
      workingCaseSpace.write(() => {
        try {
          workingCaseSpace.create('Working_Case_Space', {
            barcode: scannedBarcode,
            description: barcodeLookup.productDescription,
            cprod_pk_product_sequence: null,
            cprod_line_number: null,
            cprod_billing_code: null,
            cprod_change_timestamp: "NOW",
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
          console.log("Error on Working Case Space Create")
          console.log(e)
        }
      })
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
  }

  generateScanTest = (count) => {
    let testStrings = TestLabels

    this.setState({
      testCount: (count + 1)
    })

    return(this.ScanBarcode(testStrings[count].barcode.toString()))
  }

  synchronizeCaseData = () => {
    //Instantiate Scanned Products and Case Detail

    //Loop products and individually post to product and case data to sproc

    //Completeness check 

    //If successfully synced all products delete working DB's and
    //redirect to home page. ? setup page?
    activeScanableCase.write(() => {
      activeScanableCase.deleteAll()
    })
    workingCaseSpace.write(() => {
      workingCaseSpace.deleteAll()
    })
    //Reset state as needed

    this.props.navigation.navigate("Home")
  }

  render() {
    let isLoggedIn = activeUser.objects('Active_User')
    if(isLoggedIn.length === 0) {
      return(this.props.navigation.navigate('Login'))
    }
    else {
      let activeCaseDetail = activeScanableCase.objects("Active_Scanable_Case")
      let displayCaseDetail = activeCaseDetail[0]
      let buildPhysiciansString = 'physicianId CONTAINS "' + displayCaseDetail.cproc_physician_id + '"'
      let physiciansObjects = physiciansList.objects("Physicians_List")
      let physiciansDisplayObject = physiciansList.filtered(buildPhysiciansString)
      let buildProcedureString = 'procedureCode CONTAINS "' + displayCaseDetail.cproc_pk_procedure_code + '"'
      let proceduresObjects = proceduresList.objects("Procedures_List")
      let proceduresDisplayObject = proceduresObjects.filtered(buildProcedureString)
      let buildLocationString = 'siteId CONTAINS "' + displayCaseDetail.chead_pk_site_id + '"'
      let sitesObjects = locationsList.objects("Locations_List")
      let sitesDisplayObject = locationsList.filtered(buildLocationString)

      return (
        <View style={{flex: 1}}>
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
              <View style={styles.titleRow}>
                <Text style={styles.titleText}>Case Information</Text>
              </View>
              <View style={styles.sectionContainer}>
                <View style={styles.shadedBackgroundWrapper}>
                  <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Case Number: </Text>{displayCaseDetail.chead_pk_case_number}</Text>
                  <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Patient Id: </Text>{displayCaseDetail.chead_patient_id}</Text>
                  <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Doctor: </Text>{physiciansDisplayObject.firstName + " " + physiciansDisplayObject.lastName}</Text>
                  <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Location: </Text>{sitesDisplayObject.siteDescription}</Text>
                  <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Procedure: </Text>{proceduresDisplayObject.procedureDescription}</Text>
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
  }
}

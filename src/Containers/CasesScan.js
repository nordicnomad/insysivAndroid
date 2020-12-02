import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import ZebraScanner from 'react-native-zebra-scanner'
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import CaseProductItem from '../Components/CaseProductItem'
import { BarcodeSearch } from '../Utilities/BarcodeLookup'

var Realm = require('realm');
let rfidLabels ;
let lastRfidFetch ;

import styles from '../Styles/ContainerStyles.js'

export default class CasesScan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scannedBarcode: '',
      scannerConnected: false,
      caseInformation: {
        number: '',
        name: '',
        doctor: {},
        location: {},
        procedure: {},
        products: []
      }
    }
    rfidLabels = new Realm({
      schema: [{name: 'RFID_Labels',
      properties: {
        productTransactionNumber: "int",
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
    lastRfidFetch = new Realm({
      schema: [{name: 'Rfid_Last_Fetch',
      properties:
      {
          year: "int",
          month: "int",
          day: "int"
      }}]
    });
  }
  componentDidMount() {
    let caseInformation = this.props.navigation.getParam('caseInformation')
    this.setState({
      caseInformation: caseInformation
    })
    console.log("DATA ENTERING FROM SETUP")
    console.log(caseInformation)
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
    let caseInformation = this.state.caseInformation
    let caseProducts = this.state.caseInformation.products
    let caseProductsOutput = []
    if(caseProducts != undefined && caseProducts != null) {
      caseProducts.forEach(function(product, index){
        caseProductsOutput.push(
          <CaseProductItem
            key={"CPI"+index}
            barcode={product.barcode}
            name={product.name}
            lotSerial={product.lotSerial}
            model={product.model}
            scannedTime={product.scannedTime}
            manufacturer={product.manufacturer}
            waste={product.waste}
            scanned={product.scanned}
            wasteFunction={() => this.wasteScannedItem(product.name)}
            removeFunction={() => this.removeScannedItem(index)} />
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
    //Instantiate Variables
    if(newBarcode != undefined && newBarcode != null) {
      let scannedItemsList = this.state.caseInformation.products
      let scannedBarcode = newBarcode


      //If not a known product create and unknown product scanned item object
      let barcodeLookup = BarcodeSearch(scannedBarcode, 1)
      scannedItemsList.push(barcodeLookup)
      //Update LocalState with new information
      this.setState({
        caseInformation: {
          number: this.state.caseInformation.number,
          name: this.state.caseInformation.name,
          doctor: this.state.caseInformation.doctor,
          location: this.state.caseInformation.location,
          procedure: this.state.caseInformation.procedure,
          products:scannedItemsList,
        },
        scannedBarcode: scannedBarcode,
      })
    }

  }

  wasteScannedItem = (productName) => {
    //need to have some kind of a call to flag the item as wasted in
    //our system and the EMR system used by the hospital.
    alert("Connect to a call to the back end and from there EMR marking the item as waste for item: " + productName)
  }
  removeScannedItem = (stateIndex) => {
    let scannedItems = this.state.caseInformation.products
    let newTotalCount = 0
    scannedItems.splice(stateIndex, 1)
    console.log("CASE INFORMATION AFTER REMOVAL")
    console.log(this.state.caseInformation)
    this.setState({
      caseInformation: {
        number: this.state.caseInformation.number,
        name: this.state.caseInformation.name,
        doctor: this.state.caseInformation.doctor,
        location: this.state.caseInformation.location,
        procedure: this.state.caseInformation.procedure,
        products: scannedItems
      }
    })
  }

  synchronizeCaseData = () => {
    //Synchronize changes with a post method.
    alert("Add Post Method so Data is Synched to Backend.")
    this.props.navigation.navigate("Home")
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Case Information</Text>
            </View>
            <View style={styles.sectionContainer}>
              <View style={styles.shadedBackgroundWrapper}>
                {/*<Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Case Number: </Text>{this.state.caseInformation.number}</Text>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Patient Name: </Text>{this.state.caseInformation.name}</Text>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Doctor: </Text> {this.state.caseInformation.doctor.firstName + " " + this.state.caseInformation.lastName}</Text>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Location: </Text>{this.state.caseInformation.location.siteDescription}</Text>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Procedure: </Text>{this.state.caseInformation.procedure.procedureDescription}</Text>*/}
              </View>
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

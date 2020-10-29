import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import UserData from '../dummyData/login.json'

var Realm = require('realm');
let products ;
let productBarCodes ;
let rfidLabels ;
let lastProductFetch ;
let lastBarcodeFetch ;
let lastRfidFetch ;

import styles from '../Styles/ContainerStyles.js'

export default class AccountInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedValue: 0,
      gates: [],
      account: {},
      user: {},
    }
    products = new Realm({
      schema: [{name: 'Products_Lookup',
      properties:
      {
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
    lastProductFetch = new Realm({
      schema: [{name: 'Products_Last_Fetch',
      properties:
      {
          year: "int",
          month: "int",
          day: "int"
      }}]
    });
    lastBarcodeFetch = new Realm({
      schema: [{name: 'Barcode_Last_Fetch',
      properties:
      {
          year: "int",
          month: "int",
          day: "int"
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
    this.getUserData()
    this.getAccountData()
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
                navigation.navigate('Login')
              }>
              <Icon name="sign-out" size={30} color="#102541" />
            </TouchableOpacity>
          </View>
        </View>
      ),
    }
  };
  getUserData() {
    this.setState({
      user: UserData
    })
  }
  getAccountData() {
    let accountResponse = {}
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/info')
    //test server call
    return fetch('https://insysivtestapi.herokuapp.com/insysiv/api/v1.0/info')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      accountResponse = responseJson.account;
      this.setState({
        account: accountResponse,
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  getCurrentDate = () => {
    let dateobject = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    }
    return(dateobject)
  }

  saveCurrentDate = () => {
    let fetchedTimestamps = lastProductFetch.objects('Products_Last_Fetch')
    let timestamp = fetchedTimestamps[0]
    let currentDate = this.getCurrentDate()

    if(timestamp != null && timestamp != undefined && timestamp.length > 0) {
      try {
        lastProductFetch.write(() => {
          timestamp.year = currentDate.year
          timestamp.month = currentDate.month
          timestamp.day = currentDate.day
        });
      }
      catch (e) {
        console.log("Error on timestamp update");
      }
    }
    else {
      try {
        lastProductFetch.write(() => {
          lastProductFetch.create('Products_Last_Fetch', {
            year: currentDate.year,
            month: currentDate.month,
            day: currentDate.day
          })
        })
      }
      catch (e) {
        console.log("Error on timestamp creation");
      }
    }
  }

  FetchBarcodeTable = () => {
    let barcodeResponse = []

    //Barcode Calls
    //test server call
    console.log("FETCHBARCODETABLE CALLED FROM ACCOUNT INFORMATION PAGE")
    return fetch('http://25.78.82.76:5100/api/ProductBarCodes')
    .then((pbcresponse) => pbcresponse.json())
    .then((pbcresponseJson) => {
      console.log("BARCODE RESPONSE")
      console.log(pbcresponseJson)
      barcodeResponse = pbcresponseJson;
      this.saveBarCodeTable(barcodeResponse)
      this.setState({
        barcodes: barcodeResponse,
        syncProgressMessage: 'Barcodes Synced',
        isFetchingProducts: true,
        showSyncFooter: true,
      })
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        isFetchingProducts: false,
        showSyncFooter: true,
        syncProgressMessage: 'Syncing Failed'
      })
    });

  }

  FetchProductTable = () => {
    //Product Calls
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/subscriptions')
    //test server call
    console.log("FETCHRPRODUCTTABLE CALLED FROM ACCOUNT INFORMATION PAGE")
    return fetch('http://25.78.82.76:5100/api/Products')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("PRODUCT RESPONSE")
      console.log(responseJson)
      productResponse = responseJson;
      this.saveProductTable(productResponse)

      this.setState({
        products: productResponse,
        lastFetchProductsObject: this.getCurrentDate(),
        syncProgressMessage: 'Products Synced',
        isFetchingProducts: true,
        showSyncFooter: true,
      })
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        isFetchingProducts: false,
        showSyncFooter: true,
        syncProgressMessage: 'Syncing Failed'
      })
    });
  }

  saveProductTable = (responseproducts) => {
    let savedProducts = products.objects('Products_Lookup')
    let newProducts = responseproducts
    let saveCount = 0

    if(savedProducts != undefined && savedProducts != null && savedProducts.length > 0) {
      products.write(() => {
        products.deleteAll()
        newProducts.forEach(function(product, i) {
          try {
            saveCount = saveCount + 1
            console.log(saveCount)
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
            console.log("Error on product table creation");
            console.log(e);
          }
        })
      })
      products.compact()
    }
    else {
      products.write(() => {
        newProducts.forEach(function(product, i) {
          try {
            saveCount = saveCount + 1
            console.log(saveCount)
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
            console.log("Error on product table creation");
            console.log(e);
          }
        })
      })
      products.compact()
    }
  }

  saveBarCodeTable = (responsebarcodes) => {
    let savedBarcodes = productBarCodes.objects('Product_Bar_Codes')
    let newBarcodes = responsebarcodes
    let saveCount = 0

    if(savedBarcodes != undefined && savedBarcodes != null && savedBarcodes.length > 0) {
      productBarCodes.write(() => {
        productBarCodes.deleteAll()
        newBarcodes.forEach(function(barcode, i) {
          try {
            saveCount = saveCount + 1
            console.log(saveCount)
            productBarCodes.create('Product_Bar_Codes', {
              productBarCode1: barcode.productBarCode1,
              licenseNumber: barcode.licenseNumber,
              productModelNumber: barcode.productModelNumber,
              encoding: barcode.encoding,
            })

          }
          catch (e) {
            console.log("Error on barcode table creation");
            console.log(e);
          }
        })
      })
      productBarCodes.compact()
    }
    else {
      productBarCodes.write(() => {
        newBarcodes.forEach(function(barcode, i) {
          try {
            saveCount = saveCount + 1
            console.log(saveCount)
            productBarCodes.create('Product_Bar_Codes', {
              productBarCode1: barcode.productBarCode1,
              licenseNumber: barcode.licenseNumber,
              productModelNumber: barcode.productModelNumber,
              encoding: barcode.encoding,
            })
          }
          catch (e) {
            console.log("Error on barcode table creation");
            console.log(e);
          }
        })
      })
      productBarCodes.compact()
    }
  }

  saveRfidTable = (responserfids) => {
    let savedRfidLabels = rfidLabels.objects('RFID_Labels')
    let newRfidLabels = responserfids
    let saveCount = 0

    if(savedRfidLabels != undefined && savedRfidLabels != null && savedRfidLabels.length > 0) {
      rfidLabels.write(() => {
        rfidLabels.deleteAll()
        newRfidLabels.forEach(function(label, i) {
          try {
            saveCount = saveCount + 1
            console.log(saveCount)
            rfidLabels.create('RFID_Labels', {
              productTransactionNumber: label.productTransactionNumber,
              licenseNumber: label.licenseNumber,
              productModelNumber: label.productModelNumber,
              lotSerialNumber: label.lotSerialNumber,
              expirationDate: label.expirationDate,
              tagid: label.tagid,
              caseProductSequence: label.caseProductSequence,
              bcPrimary: label.bcPrimary,
              bcSecondary: label.bcSecondary,
            })
          }
          catch (e) {
            console.log("Error on rfid label creation");
            console.log(e);
          }
        })
      })
      rfidLabels.compact()
    }
    else {
      rfidLabels.write(() => {
        newRfidLabels.forEach(function(label, i) {
          try {
            saveCount = saveCount + 1
            console.log(saveCount)

            rfidLabels.create('RFID_Labels', {
              productTransactionNumber: label.productTransactionNumber,
              licenseNumber: label.licenseNumber,
              productModelNumber: label.productModelNumber,
              lotSerialNumber: label.lotSerialNumber,
              expirationDate: label.expirationDate,
              tagid: label.tagid,
              caseProductSequence: label.caseProductSequence,
              bcPrimary: label.bcPrimary,
              bcSecondary: label.bcSecondary,
            })
          }
          catch (e) {
            console.log("Error on rfid label creation");
            console.log(e);
          }
        })
      })
      rfidLabels.compact()
    }
  }

  FetchRFIDTable = () => {
    //RFID Call
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/subscriptions')
    //test server call
    console.log("FETCHRFIDTABLE CALLED FROM ACCOUNT INFORMATION PAGE")
    return fetch('http://25.78.82.76:5100/api/rfidLabels')
    .then((rfidresponse) => rfidresponse.json())
    .then((rfidresponseJson) => {
      console.log("RFID RESPONSE")
      console.log(rfidresponseJson)
      rfidLabelResponse = rfidresponseJson;
      this.saveRfidTable(rfidLabelResponse)

      this.setState({
        rfidLabels: rfidLabelResponse,
        syncProgressMessage: 'RFID Labels Synced',
        isFetchingProducts: false,
        showSyncFooter: false,
      })
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        isFetchingProducts: false,
        showSyncFooter: true,
        syncProgressMessage: 'Syncing Failed'
      })
    });
  }

  SynchronizeProductTable = () => {
    let productResponse = []
    console.log("SYNCHRONIZE PRODUCT TABLE CALLED")
    this.setState({
      isFetchingProducts: true,
      syncProgressMessage: 'Syncing BarCodes'
    })
    this.FetchProductTable()
    //Save timestamp
    this.saveCurrentDate()
  }

  SynchronizeBarcodeTable = () => {
    let productResponse = []
    console.log("SYNCHRONIZE BARCODE TABLE CALLED")
    this.setState({
      isFetchingProducts: true,
      syncProgressMessage: 'Syncing BarCodes'
    })
    this.FetchBarcodeTable()
  }

  SynchronizeRFIDTable = () => {
    let productResponse = []
    console.log("SYNCHRONIZE RFID TABLE CALLED")
    this.setState({
      isFetchingProducts: true,
      syncProgressMessage: 'Syncing BarCodes'
    })
    this.FetchRFIDTable()
  }

  renderSyncButton(fetchState) {
    let syncFetchState = fetchState

    if(syncFetchState === false) {
      return(
        <TouchableOpacity style={styles.submitButton} onPress={() => this.SynchoronizeAllTables()}>
          <Text style={styles.submitButtonText}>Sync Products</Text>
        </TouchableOpacity>
      )
    }
    else {
      return(
        <View style={styles.submitLoading}>
          <Text style={styles.submitButtonText}>
            <Image
              style={{width: 25,height: 25,}}
              source={ButtonLoader}
            />
              Loading...
          </Text>
        </View>
      )
    }
  }

  render() {
    if(this.state.account.organization === null || this.state.account.organization === undefined) {
      return(
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Account Information</Text>
            </View>
          </View>
        </ScrollView>
      )
    }
    else {
      let outputProducts = products.objects('Products_Lookup');
      let printProducts = outputProducts.length;
      let outputBarcodes = productBarCodes.objects('Product_Bar_Codes');
      let printBarcodes = outputBarcodes.length;
      let outputLabels = rfidLabels.objects('RFID_Labels');
      let printRFIDLabels = outputLabels.length;
      return (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Account Information</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.bodyTextHeading}>Application Data</Text>
              <View style={styles.tabControlRow}>
                <View style={styles.leftColumn}>
                  <Text>Product Table</Text>
                  <Text>{printProducts}</Text>
                </View>
                <View style={styles.rightColumn}>
                  <TouchableOpacity style={styles.miniSubmitButton} onPress={() => this.SynchronizeProductTable()}><Text style={styles.miniSubmitButtonText}>Sync</Text></TouchableOpacity>
                </View>
              </View>
              <View style={styles.tabControlRow}>
                <View style={styles.leftColumn}>
                  <Text>Barcodes</Text>
                  <Text>{printBarcodes}</Text>
                </View>
                <View style={styles.rightColumn}>
                  <TouchableOpacity style={styles.miniSubmitButton} onPress={() => this.SynchronizeBarcodeTable()}><Text style={styles.miniSubmitButtonText}>Sync</Text></TouchableOpacity>
                </View>
              </View>
              <View style={styles.tabControlRow}>
                <View style={styles.leftColumn}>
                  <Text>RFID Tags</Text>
                  <Text>{printRFIDLabels}</Text>
                </View>
                <View style={styles.rightColumn}>
                  <TouchableOpacity style={styles.miniSubmitButton} onPress={() => this.SynchronizeRFIDTable()}><Text style={styles.miniSubmitButtonText}>Sync</Text></TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.bodyTextHeading}>System Information</Text>
              <Text style={styles.bodyText}>
                <Text style={styles.bodyTextLabel}>System Version: </Text>
                {this.state.account.organization.systemVersion}
              </Text>
              <Text style={styles.bodyText}>
                <Text style={styles.bodyTextLabel}>Host Account: </Text>
                {this.state.account.organization.name}
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.bodyTextHeading}>Customer Service</Text>
              <Text style={styles.bodyText}>
                <Text style={styles.bodyTextLabel}>Phone: </Text>
                {this.state.account.organization.customerServicePhone}
              </Text>
              <Text style={styles.bodyText}>
                <Text style={styles.bodyTextLabel}>Email: </Text>
                {this.state.account.organization.customerServiceEmail}
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.bodyText}>
                <Text style={styles.bodyTextLabel}>Current User: </Text>
                {this.state.user.username}
              </Text>
              <View style={styles.accountCenterWrapper}>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.loginButton}
                    activeOpacity={0.6}
                    onPress={() =>
                    this.props.navigation.navigate('Login')
                  }>
                    <Text style={styles.loginButtonText}>Log Out</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </View>
        </ScrollView>
      );
    }
  }
}

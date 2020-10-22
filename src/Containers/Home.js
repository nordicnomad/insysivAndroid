import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import ButtonLoader from '../Images/buttonLoader.gif'
//import SubscriptionData from '../dummyData/subscriptions.json'

var Realm = require('realm');
let products ;
let productBarCodes ;
let rfidLabels ;
let lastProductFetch ;

import styles from '../Styles/ContainerStyles.js'


export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subscriptions: [
        {
          id: 2,
          label: "Cases",
          icon: "user-md",
          isActive: true,
          route: "CasesSetup",
        },
        {
          id: 3,
          label: "Tagging",
          icon: "barcode",
          isActive: true,
          route: "IntakeScan",
        },
      ],
      userInformation: {
        id: "",
        username: "",
        email: "",
        isActive: false,
        organization: {
          id: "",
          name: "",
          street: "",
          city: "",
          state: "",
          postal: ""
        }
      },
      showSyncFooter: true,
      isFetchingProducts: false,
      lastFetchProducts: "No Products",
      lastFetchProductsObject: {
        year: null,
        month: null,
        day: null,
      }
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
  componentDidMount() {
    let userInformation = this.props.navigation.getParam('userInformation')
    this.setState({
      userInformation: userInformation
    })
    this.checkLastSyncDate()
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
  checkLastSyncDate = () => {
    let fetchedTimestamps = lastProductFetch.objects('Products_Last_Fetch')
    let lastTimeStamp = fetchedTimestamps[0]
    let currentDate = this.getCurrentDate()

    if(lastTimeStamp != null && lastTimeStamp != undefined) {
      this.setState({
        lastFetchProductsObject: {
          year: lastTimeStamp.year,
          month: lastTimeStamp.month,
          day: lastTimeStamp.day
        }
      })
      if(currentDate.year === lastTimeStamp.year) {
        if(currentDate.month === lastTimeStamp.month) {
          if(currentDate.day > (lastTimeStamp.day + 3)) {
            this.setState({
              showSyncFooter: true
            })
          }
          else {
            this.setState({
              showSyncFooter: true
            })
          }
        }
        else {
          this.setState({
            showSyncFooter: true
          })
        }
      }
      else {
        this.setState({
          showSyncFooter: true
        })
      }
    }
  }
  saveProductTable = (responseproducts) => {
    let savedProducts = products.objects('Products_Lookup')
    let newProducts = responseproducts

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

    if(savedRfidLabels != undefined && savedRfidLabels != null && savedRfidLabels.length > 0) {
      rfidLabels.write(() => {
        rfidLabels.deleteAll()
        newRfidLabels.forEach(function(label, i) {
          try {
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
  renderDateStamp(dateObject) {
    let yearMonthDay = dateObject
    if(yearMonthDay.year != null) {
      let dateOutput = yearMonthDay.month + '/' + yearMonthDay.day + '/' + yearMonthDay.year
      return(dateOutput)
    }
    else {
      return("No Product Data")
    }
  }
  getSubscriptionData() {
    let subscriptionResponse = {}
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/subscriptions')
    //test server call
    return fetch('https://insysivtestapi.herokuapp.com/insysiv/api/v1.0/subscriptions')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      subscriptionResponse = responseJson.subscriptions;
      this.setState({
        subscriptions: subscriptionResponse,
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }
  renderSubscriptions() {
    let userSubscriptions = this.state.subscriptions
    let outputSubscriptions = []

    if(userSubscriptions != undefined) {
      userSubscriptions.forEach(function(subscription, index) {
        if(subscription.isActive === true) {
          outputSubscriptions.push(
            <View key={"sa"+subscription.id} style={styles.menuItem}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() =>
                  this.props.navigation.navigate(subscription.route, {
                    userInformation: this.state.userInformation
                  })
                }>
                <View style={styles.menuButtonContents}>
                  <Icon style={styles.menuButtonIcon} name={subscription.icon} size={45} color="#333" />
                  <Text style={styles.menuButtonText}>{subscription.label}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        }
        else {
          outputSubscriptions.push(
            <View key={"cs"+subscription.id} style={styles.menuItem}>
              <TouchableOpacity
                style={styles.menuButtonDisabled}
                onPress={() => alert('Subscription not currently activated. If you believe this to be in error, please contact support.')}>
                <View style={styles.menuButtonContents}>
                  <Icon style={styles.menuButtonIconDisabled} name={subscription.icon} size={45} color="#aaa" />
                  <Text style={styles.menuButtonTextDisabled}>{subscription.label}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        }

      }.bind(this))
    }
    return outputSubscriptions
  }

  FetchBarcodeTable = () => {
    let barcodeResponse = []

    //Barcode Calls
    //test server call
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

  FetchRFIDTable = () => {
    //RFID Call
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/subscriptions')
    //test server call
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

  SynchoronizeAllTables = () => {

    let productResponse = []
    this.setState({
      isFetchingProducts: true,
      syncProgressMessage: 'Syncing BarCodes'
    })
    this.FetchProductTable()
    //this.FetchBarcodeTable()
    //this.FetchRFIDTable()
    //Save timestamp
    this.saveCurrentDate()
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
    let outputProducts = products.objects('Products_Lookup');
    let printProducts = outputProducts.length;
    let outputBarcodes = productBarCodes.objects('Product_Bar_Codes');
    let printBarcodes = outputBarcodes.length;
    let outputLabels = rfidLabels.objects('RFID_Labels');
    let printRFIDLabels = outputLabels.length;
    return(
      <View style={this.state.showSyncFooter ? styles.containerContainsFooter : styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>{this.state.userInformation.organization.name}</Text>
            </View>
            <Text>Show saved products count</Text>
            <Text>{printProducts}</Text>
            <Text>Show saved barcodes count</Text>
            <Text>{printBarcodes}</Text>
            <Text>Show saved RFIDLabel count</Text>
            <Text>{printRFIDLabels}</Text>
            <View style={styles.menuRow}>
              {this.renderSubscriptions()}
            </View>
          </View>
        </ScrollView>
        <View style={this.state.showSyncFooter ? styles.footerContainer : styles.hideFooterContainer}>
          <View style={styles.leftColumn}>
            <Text style={styles.bodyTextLabel}>Sync Product Table</Text>
            <Text style={styles.syncTimeLabel}>Last Sync: {this.renderDateStamp(this.state.lastFetchProductsObject)}</Text>
          </View>
          <View style={styles.rightColumn}>
            {this.renderSyncButton(this.state.isFetchingProducts)}
          </View>
        </View>
      </View>
    );
  }
}

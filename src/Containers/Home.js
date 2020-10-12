import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import ButtonLoader from '../Images/buttonLoader.gif'
import SubscriptionData from '../dummyData/subscriptions.json'

var Realm = require('realm');
let realm ;

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
          billingCode: "string",
          orderThruVendor: "string",
          productDescription: "string",
          registerableDevice: "string",
          lotRequired: "string",
          postBill: "string",
          autoReplace: "string",
          discontinued: "string",
          productCategory: "string",
          hospitalItemNumber: "string",
          unitOfMeasure: "string",
          unitOfMeasureQuantity: "int",
          reorderValue: "int",
          quantityOnHand: "int",
          quantityOrdered: "int",
          lastRequistionNumber: "int",
          lastLineNumber: "int",
          orderStatus: "string",
          orderReviewFlag: "string",
          orderReviewReason: "string",
          active: "string",
          accepted: "string",
          createTimestamp: "string",
          createUserid: "string",
          changeTimestamp: "string",
          changeUserid: "string",
          consignment: "string",
          minimumValue: "int",
          maximumValue: "int",
          nonOrdered: "string",
          productNote: "string",
          actualCostRequired: "string",
          originalVendor: "string"
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
  getCurrentDate = () => {
    let dateobject = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    }
    return(dateobject)
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
  componentDidMount() {
    let userInformation = this.props.navigation.getParam('userInformation')
    this.setState({
      userInformation: userInformation
    })
    //this.getSubscriptionData()
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

  SynchoronizeProductTable = () => {
    let productResponse = {}
    this.setState({
      isFetchingProducts: true
    })
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/subscriptions')
    //test server call
    return fetch('http://25.78.82.76:5100/api/Products')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("PRODUCT RESPONSE")
      console.log(responseJson)
      productResponse = responseJson;
      this.setState({
        products: productResponse,
        lastFetchProductsObject: this.getCurrentDate(),
        isFetchingProducts: false,
        showSyncFooter: false
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  renderSyncButton(fetchState) {
    let syncFetchState = fetchState

    if(syncFetchState === false) {
      return(
        <TouchableOpacity style={styles.submitButton} onPress={() => this.SynchoronizeProductTable(this.state.isFetchingProducts)}>
          <Text style={styles.submitButtonText}>Sync Products</Text>
        </TouchableOpacity>
      )
    }
    else {
      return(
        <View style={styles.submitButton}>
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

    return (
      <View style={this.state.showSyncFooter ? styles.containerContainsFooter : styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>{this.state.userInformation.organization.name}</Text>
            </View>
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

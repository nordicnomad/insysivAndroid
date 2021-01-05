import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import ButtonLoader from '../Images/buttonLoader.gif'
//import SubscriptionData from '../dummyData/subscriptions.json'

var Realm = require('realm');
let activeUser ;
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

  render() {
    let isLoggedIn = activeUser.objects('Active_User')
    if(isLoggedIn.length === 0) {
      return(this.props.navigation.navigate('Login'))
    }
    else {
      return(
        <View style={this.state.showSyncFooter ? styles.containerContainsFooter : styles.container}>
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
              <View style={styles.titleRow}>
                <Text style={styles.titleText}>Organization</Text>
              </View>
              <View style={styles.menuRow}>
                {this.renderSubscriptions()}
              </View>
            </View>
          </ScrollView>
          {/*<View style={this.state.showSyncFooter ? styles.footerContainer : styles.hideFooterContainer}>
            <View style={styles.leftColumn}>
              <Text style={styles.bodyTextLabel}>Sync Product Table</Text>
              <Text style={styles.syncTimeLabel}>Last Sync: {this.renderDateStamp(this.state.lastFetchProductsObject)}</Text>
            </View>
            <View style={styles.rightColumn}>
              <TouchableOpacity style={styles.submitButton} onPress={() => this.props.navigation.navigate("AccountInfo", {
                userInformation: this.state.userInformation
              })}>
                <Text style={styles.submitButtonText}>Sync Products</Text>
              </TouchableOpacity>
            </View>
          </View>*/}
        </View>
      );
    }
  }
}

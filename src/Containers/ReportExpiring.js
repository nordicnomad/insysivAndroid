import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.jpg'
import ExpiringAlertItem from '../Components/ExpiringAlertItem'

import styles from '../Styles/ContainerStyles.js'

export default class ReportExpiring extends Component {
  constructor(props) {
    super(props)
    this.state = {
      forwardValue: 30,
      expiringItems: {
        expiring: [],
      },
    }
  }
  componentDidMount() {
    this.getExpiringItemsData(this.state.forwardValue);
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
  getExpiringItemsData(forwardValue) {
    //Will eventually need to be converted to a post method
    //that sends a date range, or just an integer of 0, 30, or 90
    //with 0 being the page load default, and returns an object with
    //an array of the expiring and expired items as an array of the expiring property.
    //default sorting by date of expiration.
    let expiringItemsResponse = {}
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/expiringItems')
    //test server call
    return fetch('https://insysivtestapi.herokuapp.com/insysiv/api/v1.0/expiringItems')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      expiringItemsResponse = responseJson.expiringItems;
      this.setState({
        expiringItems: expiringItemsResponse,
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  setFilterDuration = (buttonValue) => {
    let forwardValue = this.state.forwardValue
    if(buttonValue != forwardValue) {
      this.setState({
        forwardValue: buttonValue
      })
      this.getExpiringItemsData(buttonValue);
    }
  }
  renderExpiringAlerts() {
    let expiringItems = this.state.expiringItems.expiring
    let expiringOutput = []

    expiringItems.forEach(function(item, index) {
      expiringOutput.push(
        <ExpiringAlertItem
          key={"Exp" + index}
          name={item.name}
          manufacturer={item.manufacturer}
          onOrder={item.onOrder}
          onHand={item.onHand}
          model={item.model}
          lotSerial={item.lotSerial}
          expirationDate={item.expirationDate}
          locateFunction={() => this.locateExpiredItem(item.name)}
          />
      )
    }.bind(this))
    if(expiringOutput.length <= 0) {
      expiringOutput.push(
        <Text key={"EXP"+0} style={styles.noDataText}>No Expired Items to Display</Text>
      )
    }
    return(expiringOutput)
  }
  locateExpiredItem(expiredName) {
    //Will need to utilize the zebra RN-RFID API to connect to the
    //sled and use it to geiger counter the rfid tag in the storeroom
    //finding where the item is actually located so it can be removed
    //and not used on a patient after it has expired.
    alert("Connect to RFID Sled and scan for this Expired Item: " + expiredName)
  }

  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>Expiring Items</Text>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <TouchableOpacity style={this.state.forwardValue === 0 ? styles.submitButton : styles.submitButtonAlt} onPress={() => this.setFilterDuration(0)}>
                  <Text style={this.state.forwardValue === 0 ? styles.submitButtonText : styles.submitButtonTextAlt}>Expired</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.equalColumn}>
                <TouchableOpacity style={this.state.forwardValue === 30 ? styles.submitButton : styles.submitButtonAlt} onPress={() => this.setFilterDuration(30)}>
                  <Text style={this.state.forwardValue === 30 ? styles.submitButtonText : styles.submitButtonTextAlt}>In 30 Days</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.equalColumn}>
                <TouchableOpacity style={this.state.forwardValue === 90 ? styles.submitButton : styles.submitButtonAlt} onPress={() => this.setFilterDuration(90)}>
                  <Text style={this.state.forwardValue === 90 ? styles.submitButtonText : styles.submitButtonTextAlt}>In 90 Days</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.straightRow}>
              <Text style={styles.bodyTextLabel}>Expired</Text>
            </View>
            <View style={styles.productList}>
              {this.renderExpiringAlerts()}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.jpg'
import LowStockAlertItem from '../Components/LowStockAlertItem'

import styles from '../Styles/ContainerStyles.js'

export default class ReportsHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedValue: 0,
      gates: [],
      lowStockAlerts: []
    }
  }
  componentDidMount() {
    this.getLowStockData()
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
  getLowStockData() {
    let lowStockAlertsResponse = {}
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/lowStockAlerts')
    //test server call
    return fetch('https://insysivtestapi.herokuapp.com/insysiv/api/v1.0/lowStockAlerts')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      lowStockAlertsResponse = responseJson.lowStockAlerts;
      this.setState({
        lowStockAlerts: lowStockAlertsResponse.lowStockAlerts,
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  renderLowStockList() {
    let alertList = this.state.lowStockAlerts
    let alertOutput = []
    alertList.forEach(function(alert, index){
      alertOutput.push(
        <LowStockAlertItem
          key={"lsa"+index}
          name={alert.name}
          onHand={alert.onHand}
          onOrder={alert.onOrder}
          manufacturer={alert.manufacturer}
          model={alert.model}
          lotSerial={alert.lotSerial}  />
      )
    });
    if(alertOutput.length <= 0) {
      alertOutput.push(
        <Text key={"lsa" + 0} style={styles.noDataText}>No Current Low Stock Alerts</Text>
      )
    }
    return alertOutput
  }

  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>Low Stock</Text>
          </View>
          <View style={styles.sectionContainer}>
          <View style={styles.straightRow}>
            <Text style={styles.bodyTextLabel}>Alerts</Text>
          </View>
            <View style={styles.productList}>
              {this.renderLowStockList()}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

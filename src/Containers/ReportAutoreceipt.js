import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import GateData from '../dummyData/gates.json'

import styles from '../Styles/ContainerStyles.js'

export default class ReportAutoreceipt extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedValue: 0,
      gates: []
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
  getAutoReceiptData() {
    let autoReceiptResponse = {}
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/autoReceipt')
    //test server call
    return fetch('https://insysivtestapi.herokuapp.com/insysiv/api/v1.0/autoReceipt')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      autoReceiptResponse = responseJson.autoReceipt;
      this.setState({
        autoReceipt: autoReceiptResponse,
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>Auto Receipt</Text>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.rangeWrapper}>
              <View style={styles.straightRow}>
                <Text style={styles.bodyTextLabel}>Report Date Range</Text>
              </View>
              <View style={styles.majorMinorRow}>
                <View style={styles.majorColumn}>
                  <TextInput style={styles.formInput} placeholder="date" />
                </View>
                <View style={styles.minorColumn}>
                  <Text style={styles.bodyTextHeading}>to</Text>
                </View>
                <View style={styles.majorColumn}>
                  <TextInput style={styles.formInput} placeholder="date" />
                </View>
              </View>
            </View>
            <View style={styles.majorMinorRow}>
              <View style={styles.equalColumn}></View>
              <View style={styles.equalColumn}>
                <TouchableOpacity style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Generate Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            {/* Expanded List Item */}
            <View style={styles.straightRow}>
              <Text style={styles.bodyTextLabel}>Received but not tagged</Text>
            </View>
            <View style={styles.productListItem}>
              <View>
                <Text style={styles.activeProductListHeading}>Long Description Name</Text>
              </View>
              <View style={styles.productListTray}>
                <View style={styles.straightRow}>
                  <View style={styles.equalColumn}>
                    <Text style={styles.trayText}><Text style={styles.trayLabel}>Model: </Text>1234567</Text>
                    <Text style={styles.trayText}><Text style={styles.trayLabel}>Lot/Serial: </Text>AFD</Text>
                    <Text style={styles.trayText}><Text style={styles.trayLabel}>HEMM: </Text>891011</Text>
                  </View>
                  <View style={styles.equalColumn}>
                    <Text style={styles.trayText}><Text style={styles.trayLabel}>On Hand: </Text>45</Text>
                    <Text style={styles.trayText}><Text style={styles.trayLabel}>On Order: </Text>0</Text>
                    <Text style={styles.trayText}><Text style={styles.trayLabel}>Arrival Date: </Text>3/2/2020</Text>
                  </View>
                </View>
              </View>
            </View>
            {/* Closed List Items */}
            <View style={styles.productListItem}>
              <View>
                <Text style={styles.productListHeading}>Balloon 3mm x 20mm</Text>
              </View>
              <View style={styles.inactiveListTray}></View>
            </View>
            <View style={styles.productListItem}>
              <View>
                <Text style={styles.productListHeading}>Balloon 3mm x 20mm</Text>
              </View>
              <View style={styles.inactiveListTray}></View>
            </View>
            <View style={styles.productListItem}>
              <View>
                <Text style={styles.productListHeading}>Balloon 3mm x 20mm</Text>
              </View>
              <View style={styles.inactiveListTray}></View>
            </View>
            <View style={styles.productListItem}>
              <View>
                <Text style={styles.productListHeading}>Balloon 3mm x 20mm</Text>
              </View>
              <View style={styles.inactiveListTray}></View>
            </View>
            <View style={styles.productListItem}>
              <View>
                <Text style={styles.productListHeading}>Balloon 3mm x 20mm</Text>
              </View>
              <View style={styles.inactiveListTray}></View>
            </View>
            <View style={styles.productListItem}>
              <View>
                <Text style={styles.productListHeading}>Balloon 3mm x 20mm</Text>
              </View>
              <View style={styles.inactiveListTray}></View>
            </View>
            <View style={styles.productListItem}>
              <View>
                <Text style={styles.productListHeading}>Balloon 3mm x 20mm</Text>
              </View>
              <View style={styles.inactiveListTray}></View>
            </View>
            <View style={styles.productListItem}>
              <View>
                <Text style={styles.productListHeading}>Balloon 3mm x 20mm</Text>
              </View>
              <View style={styles.inactiveListTray}></View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

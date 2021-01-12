import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.jpg'
import AutoReceiptListItem from '../Components/AutoReceiptListItem'

import styles from '../Styles/ContainerStyles.js'

export default class ReportAutoreceipt extends Component {
  constructor(props) {
    super(props)
    this.state = {
      autoReceipt: {
        receipts: []
      },
      startHasFocus: false,
      endHasFocus: false,
      startDateValue: "",
      endDateValue: "",
    }
  }
  componentDidMount() {
    this.getAutoReceiptData()
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
  onStartFocusChange() {
    this.setState({startHasFocus: !this.state.startHasFocus})
  }
  onEndFocusChange() {
    this.setState({endHasFocus: !this.state.endHasFocus})
  }
  renderAutoReceipts() {
    let autoReceiptOutput = []
    let autoReceipts = this.state.autoReceipt.receipts

    autoReceipts.forEach(function(receipt, index) {
        autoReceiptOutput.push(
          <AutoReceiptListItem
            key={"ARL" + index}
            name={receipt.name}
            manufacturer={receipt.manufacturer}
            model={receipt.model}
            onOrder={receipt.onOrder}
            onHand={receipt.onHand}
            hemmNumber={receipt.hemmNumber}
            arrivalDate={receipt.arrivalDate}
           />
        )
    });
    if(autoReceiptOutput.length === 0) {
      autoReceiptOutput.push(
        <Text key={"0"} style={styles.noDataText}>No Delivery Receipts that have not been tagged for this period.</Text>
      )
    }
    return autoReceiptOutput
  }
  generateAutoReceiptReport = (startDate, endDate) => {
    if(startDate != '' && endDate != '') {
      alert("This button will make a post call to the end point to retrieve receipts starting: " + startDate + " and Ending: " + endDate)
    }
    else {
      alert("Please complete Start and End Date fields to generate a new report.")
    }
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
                  <TextInput
                  style={this.state.startHasFocus ? styles.formInputFocus : styles.formInput}
                  onFocus={() => this.onStartFocusChange()}
                  onBlur={() => this.onStartFocusChange()}
                  value={this.state.startDateValue}
                  onChangeText={value => this.setState({startDateValue: value})}
                  placeholder="dd/mm/yyyy" />
                </View>
                <View style={styles.minorColumn}>
                  <Text style={styles.seperatorHeading}>to</Text>
                </View>
                <View style={styles.majorColumn}>
                  <TextInput
                  style={this.state.endHasFocus ? styles.formInputFocus : styles.formInput}
                  onFocus={() => this.onEndFocusChange()}
                  onBlur={() => this.onEndFocusChange()}
                  value={this.state.endDateValue}
                  onChangeText={value => this.setState({endDateValue: value})}
                  placeholder="dd/mm/yyyy" />
                </View>
              </View>
            </View>
            <View style={styles.majorMinorRow}>
              <View style={styles.equalColumn}></View>
              <View style={styles.equalColumn}>
                <TouchableOpacity style={styles.submitButton} onPress={() => this.generateAutoReceiptReport(this.state.startDateValue, this.state.endDateValue)}>
                  <Text style={styles.submitButtonText}>Generate Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.straightRow}>
              <Text style={styles.bodyTextLabel}>Received but not tagged</Text>
            </View>
            {this.renderAutoReceipts()}
          </View>
        </View>
      </ScrollView>
    );
  }
}

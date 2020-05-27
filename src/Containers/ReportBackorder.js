import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import GateData from '../dummyData/gates.json'

import styles from '../Styles/ContainerStyles.js'

export default class ReportBackorder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedValue: 0,
      gates: [],
      searchString: "",
      filterString: "",
      searchHasFocus: false,
      backOrder: {
        messages: [],
        organizationId: "",
        explanationText: "",
        inqueryEmail: "",
        currentDate: "",
      }
    }
    this.onSearchChange = this.onSearchChange.bind(this)
  }
  componentDidMount() {
    this.getBackOrderData()
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
  getBackOrderData() {
    let backOrderResponse = {}
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/backOrder')
    //test server call
    return fetch('https://insysivtestapi.herokuapp.com/insysiv/api/v1.0/backOrder')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      backOrderResponse = responseJson.backOrder;
      this.setState({
        backOrder: backOrderResponse,
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }
  onSearchFocusChange() {
    this.setState({searchHasFocus: !this.state.searchHasFocus})
  }
  onSearchChange(event) {
    this.setState({searchString: event.target.value});
    console.log(event.target.value)
  }
  updateFilteredMessages(search) {
    console.log("FILTER BUTTON ACTIVATED")
    console.log(search)
    this.setState({filterString: search})
  }
  renderBackOrders(filter) {
    let backOrderOutput = []
    let backOrders = this.state.backOrder.messages
    let filterString = filter

    if(filterString === "" || filterString === undefined || filterString === null) {
      backOrders.forEach(function(message, index) {
        backOrderOutput.push(
          <View key={"BOM" + message.messageId} style={styles.productListItem}>
            <View style={styles.majorMinorRow}>
              <View style={styles.majorColumn}>
                <Text style={styles.activeProductListHeading}>If Description</Text>
              </View>
              <View style={styles.mediumColumn}>
                <Text style={styles.productListHeadingRight}>4/30/2020</Text>
              </View>
            </View>
            <View style={styles.productListTray}>
              <Text style={styles.trayText}>ALL MESSAGES</Text>
            </View>
          </View>
        )
      }.bind(this))
    }
    else {
      let filteredMessages = backOrders
      filteredMessages.forEach(function(message, index) {
        if(message.backorderText.includes(filterString)) {
          backOrderOutput.push(
            <View key={"FBOM" + message.messageId} style={styles.productListItem}>
              <View style={styles.majorMinorRow}>
                <View style={styles.majorColumn}>
                  <Text style={styles.activeProductListHeading}>Else Description</Text>
                </View>
                <View style={styles.mediumColumn}>
                  <Text style={styles.productListHeadingRight}>4/30/2020</Text>
                </View>
              </View>
              <View style={styles.productListTray}>
                <Text style={styles.trayText}>Matched Message</Text>
              </View>
            </View>
          )
        }
      }.bind(this))
      console.log(filteredMessages)
    }
    return backOrderOutput
  }

  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>Back Order Report</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.bodyText}>{this.state.backOrder.explanationText} For questions & possible substitutions contact: </Text>
            <Text style={styles.emailText}>{this.state.backOrder.inqueryEmail}</Text>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.searchWrapper}>
              <View style={styles.straightRow}>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>{this.state.backOrder.currentDate}</Text> Current Back Orders</Text>
              </View>
              <View style={styles.majorMinorRow}>
                <View style={styles.majorColumn}>
                  <TextInput
                    style={this.state.searchHasFocus ? styles.formInputFocus : styles.formInput}
                    onFocus={() => this.onSearchFocusChange()}
                    onBlur={() => this.onSearchFocusChange()}
                    onChange={this.onSearchChange}
                    placeholder="Search" />
                </View>
                <View style={styles.mediumColumn}>
                  <TouchableOpacity style={styles.miniSubmitButton}>
                    <Text style={styles.miniSubmitButtonText} onPress={() => this.updateFilteredMessages(this.state.searchString)}>Search</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View>
              {this.renderBackOrders(this.state.filterString)}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

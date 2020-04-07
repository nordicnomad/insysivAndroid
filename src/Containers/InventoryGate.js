import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, Picker, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import GateData from '../dummyData/gates.json'

import styles from '../Styles/ContainerStyles.js'

export default class InventoryGate extends Component {
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
  getGateData() {
    let gatesResponse = []
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/gates')
    //test server call
    return fetch('https://insysivtestapi.herokuapp.com/insysiv/api/v1.0/gates')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      gatesResponse = responseJson.gates;
      this.setState({
        gates: gatesResponse,
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }
  componentDidMount() {
    let userIdentifier = this.props.navigation.getParam('userInformation')

    this.getGateData()
  }
  changeSelection = (value, index) => {
    if(value != 0) {
      this.setState(
        {
          "selectedValue": value
        }
      );
    }
  }
  renderContinue() {
    if(this.state.selectedValue != 0) {
      return(
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() =>
            this.props.navigation.navigate('Scan', {
              selectedGate: this.state.selectedValue,
              userInformation: this.props.navigation.getParam('userInformation')
            })
          }>
          <Text style={styles.submitButtonText}>Continue</Text>
        </TouchableOpacity>
      )
    }
    else {
      return(
        <TouchableOpacity
          style={styles.disableButton}>
          <Text style={styles.submitButtonText}>Continue</Text>
        </TouchableOpacity>
      )
    }
  }
  renderCurrentGate() {
    if(this.state.selectedValue != 0){
      return(
        <Text style={styles.selectedGateText}>
          Current Gate: <Text style={styles.selectedGateTextText}>{this.state.selectedValue}</Text>
        </Text>
      )
    }
  }
  renderGateOptions() {
    let gateOptions = this.state.gates
    let gateOptionOutput = []

    if(gateOptions != undefined) {
      gateOptions.forEach(function(gate, index) {
          gateOptionOutput.push(
            <Picker.Item key={gate.gate} label={gate.gateName} value={gate.gate} />
          )
      })
    }

    return gateOptionOutput
  }
  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>Gate Selection</Text>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.gateSelectionRow}>
              <View style={styles.gateSelectionColumn}>
                <Text style={styles.gateSelectionLabel}>Choose Gate</Text>
              </View>
              <View style={styles.gateSelectionColumn}>
                <View style={styles.gateSelectionPickerWrapper}>
                  <Picker
                    onValueChange={this.changeSelection}
                    selectedValue={this.state.selectedValue}
                    style={styles.gateSelectionPicker}>
                    <Picker.Item label='Select an option...' value='0' />
                    {this.renderGateOptions()}
                  </Picker>
                </View>
                <View style={styles.gateSelectionSection}>
                  {this.renderContinue()}
                </View>
              </View>
            </View>
          </View>
          <View style={styles.gateRow}>
            {this.renderCurrentGate()}
          </View>
        </View>
      </ScrollView>
    );
  }
}

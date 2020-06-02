import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, Picker, TouchableOpacity, Image, ScrollView, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import GateData from '../dummyData/gates.json'

import styles from '../Styles/ContainerStyles.js'

export default class Inventory extends Component {
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
  getInventoryData() {
    let inventoryResponse = {}
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/inventory')
    //test server call
    return fetch('https://insysivtestapi.herokuapp.com/insysiv/api/v1.0/inventory')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      inventoryResponse = responseJson.inventory;
      this.setState({
        inventory: inventoryResponse,
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
            <Text style={styles.titleText}>Inventory</Text>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.majorMinorRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.selectedGateText}>Current Gate: </Text>
              </View >
              <View style={styles.equalColumn}>
                <View style={styles.formPickerWrapper}>
                  <Picker style={styles.formPicker}>
                    <Picker.Item label="Select Location" value="0" />
                    <Picker.Item label="CV Lab Core" value="1" />
                    <Picker.Item label="EP Lab Storage" value="2" />
                    <Picker.Item label="Radiology Lab Storage" value="3" />
                  </Picker>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.tabControlRow}>
            <View style={styles.tabControlColumn}>
              <TouchableOpacity style={styles.tabControlButtonActive}>
                <Text style={styles.tabControlButtonTextActive}>All Tags</Text>
              </TouchableOpacity>
            </View>
           <View style={styles.tabControlColumn}>
             <TouchableOpacity style={styles.tabControlButton}>
               <Text style={styles.tabControlButtonText}>Matched</Text>
             </TouchableOpacity>
           </View>
           <View style={styles.tabControlColumn}>
             <TouchableOpacity style={styles.tabControlButton}>
               <Text style={styles.tabControlButtonText}>Missing</Text>
             </TouchableOpacity>
           </View>
           <View style={styles.tabControlColumn}>
             <TouchableOpacity style={styles.tabControlButton}>
               <Text style={styles.tabControlButtonText}>Unexpected</Text>
             </TouchableOpacity>
           </View>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.tagItem}>
              <View style={styles.tagRow}>
                <Text style={styles.tagMissingTitle}>0000000474474</Text>
                <Text style={styles.tagGateText}>CV Lab</Text>
                <Text style={styles.tagGateText}>0/1</Text>
              </View>
              <View style={styles.tagRow}>
                <Text style={styles.tagDescription}>Name of Item</Text>
              </View>
            </View>
            <View style={styles.tagItem}>
              <View style={styles.tagRow}>
                <Text style={styles.tagMatchedTitle}>0000000476674</Text>
                <Text style={styles.tagGateText}>CV Lab</Text>
                <Text style={styles.tagGateText}>1/1</Text>
              </View>
              <View style={styles.tagRow}>
                <Text style={styles.tagDescription}>Name of Item</Text>
              </View>
            </View>
            <View style={styles.tagItem}>
              <View style={styles.tagRow}>
                <Text style={styles.tagUnexpectedTitle}>0000000478879</Text>
                <Text style={styles.tagGateText}>CV Lab</Text>
                <Text style={styles.tagGateText}>1/0</Text>
              </View>
              <View style={styles.tagRow}>
                <Text style={styles.tagDescription}>Name of Item</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

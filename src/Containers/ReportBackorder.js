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

  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>Back Order Report</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.bodyText}>The following items are on back order and likely won't be received until after the specified date. For questions & possible substitutions contact: </Text>
            <Text style={styles.emailText}>supply@hospital.com</Text>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.searchWrapper}>
              <View style={styles.straightRow}>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>3/10/2020</Text> Current Back Orders</Text>
              </View>
              <View style={styles.majorMinorRow}>
                <View style={styles.majorColumn}>
                  <TextInput style={styles.formInput} placeholder="Search" />
                </View>
                <View style={styles.mediumColumn}>
                  <TouchableOpacity style={styles.miniSubmitButton}>
                    <Text style={styles.miniSubmitButtonText}>Search</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.productListItem}>
              <View style={styles.majorMinorRow}>
                <View style={styles.majorColumn}>
                  <Text style={styles.activeProductListHeading}>Item Description</Text>
                </View>
                <View style={styles.mediumColumn}>
                  <Text style={styles.productListHeadingRight}>4/30/2020</Text>
                </View>
              </View>
              <View style={styles.productListTray}>
                <Text style={styles.trayText}>Earthquake in Puerto Rico has disrupted supplies of this item until April. Some are available from vendor in emergencies, otherwise sub with this other item.</Text>
              </View>
            </View>
            <View style={styles.productListItem}>
              <View style={styles.majorMinorRow}>
                <View style={styles.majorColumn}>
                  <Text style={styles.productListHeading}>Another Back Order</Text>
                </View>
                <View style={styles.mediumColumn}>
                  <Text style={styles.productListHeadingRight}>8/30/2020</Text>
                </View>
              </View>
              <View style={styles.productListTray}>
                <Text style={styles.trayText}>Terrorists have hijacked a cargo vessal carrying this item in the mid atlantic. If the ship goes faster than 55 miles per hour it will explode, so our order will take a while to arrive.</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

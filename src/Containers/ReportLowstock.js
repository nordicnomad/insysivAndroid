import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import GateData from '../dummyData/gates.json'

import styles from '../Styles/ContainerStyles.js'

export default class ReportsHome extends Component {
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
              {/* Open Tray List Item */}
              <View style={styles.productListItem}>
                <View style={styles.majorMinorRow}>
                  <View style={styles.equalColumn}>
                    <Text style={styles.activeProductListHeading}>Description Item</Text>
                  </View>
                  <View style={styles.equalColumn}>
                    <Text style={styles.productListHeadingRight}>0</Text>
                  </View>
                </View>
                <View style={styles.productListTray}>
                  <View style={styles.straightRow}>
                    <Text style={styles.bodyTextLabel}>Low Stock Item Information</Text>
                  </View>
                  <View style={styles.majorMinorRow}>
                    <View style={styles.equalColumn}>
                      <Text style={styles.trayText}><Text style={styles.trayLabel}>Model: </Text>LA6518Q</Text>
                      <Text style={styles.trayText}><Text style={styles.trayLabel}>Lot / Serial: </Text>123445</Text>
                      <Text style={styles.trayText}><Text style={styles.trayLabel}>Quantity on Hand: </Text> 0</Text>
                    </View>
                    <View style={styles.equalColumn}>
                      <Text style={styles.trayText}><Text style={styles.trayLabel}>Quantity on Order: </Text>500</Text>
                      <Text style={styles.trayText}><Text style={styles.trayLabel}>Manufacturer: </Text>Medtronic</Text>
                    </View>
                  </View>
                </View>
              </View>
              {/* Closed Tray List Items */}
              <View style={styles.productListItem}>
                <View style={styles.straightRow}>
                  <View style={styles.majorColumn}>
                    <Text style={styles.productListHeading}>Another Low Item</Text>
                  </View>
                  <View style={styles.minorColumn}>
                    <Text style={styles.productListHeadingRight}>19</Text>
                  </View>
                </View>
                <View style={styles.inactiveListTray}></View>
              </View>
              <View style={styles.productListItem}>
                <View style={styles.straightRow}>
                  <View style={styles.majorColumn}>
                    <Text style={styles.productListHeading}>Another Low Item</Text>
                  </View>
                  <View style={styles.minorColumn}>
                    <Text style={styles.productListHeadingRight}>1</Text>
                  </View>
                </View>
                <View style={styles.inactiveListTray}></View>
              </View>
              <View style={styles.productListItem}>
                <View style={styles.straightRow}>
                  <View style={styles.majorColumn}>
                    <Text style={styles.productListHeading}>Another Low Item</Text>
                  </View>
                  <View style={styles.minorColumn}>
                    <Text style={styles.productListHeadingRight}>3</Text>
                  </View>
                </View>
                <View style={styles.inactiveListTray}></View>
              </View>
              <View style={styles.productListItem}>
                <View style={styles.straightRow}>
                  <View style={styles.majorColumn}>
                    <Text style={styles.productListHeading}>Another Low Item</Text>
                  </View>
                  <View style={styles.minorColumn}>
                    <Text style={styles.productListHeadingRight}>0</Text>
                  </View>
                </View>
                <View style={styles.inactiveListTray}></View>
              </View>
              <View style={styles.productListItem}>
                <View style={styles.straightRow}>
                  <View style={styles.majorColumn}>
                    <Text style={styles.productListHeading}>Another Low Item</Text>
                  </View>
                  <View style={styles.minorColumn}>
                    <Text style={styles.productListHeadingRight}>2</Text>
                  </View>
                </View>
                <View style={styles.inactiveListTray}></View>
              </View>
              <View style={styles.productListItem}>
                <View style={styles.straightRow}>
                  <View style={styles.majorColumn}>
                    <Text style={styles.productListHeading}>Another Low Item</Text>
                  </View>
                  <View style={styles.minorColumn}>
                    <Text style={styles.productListHeadingRight}>1</Text>
                  </View>
                </View>
                <View style={styles.inactiveListTray}></View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

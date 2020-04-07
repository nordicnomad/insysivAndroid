import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import GateData from '../dummyData/gates.json'

import styles from '../Styles/ContainerStyles.js'

export default class CasesScan extends Component {
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
      <View style={{flex: 1}}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Case Information</Text>
            </View>
            <View style={styles.sectionContainer}>
              <View style={styles.shadedBackgroundWrapper}>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Case Number: </Text>123456</Text>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Patient Name: </Text>Billy Patient</Text>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Doctor: </Text> Dr. Mann MD</Text>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Location: </Text>CV Lab 1</Text>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Procedure: </Text>Heart Procedure</Text>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <View style={styles.productListItem}>
                <View style={styles.majorMinorRow}>
                  <View style={styles.majorColumn}>
                    <Text style={styles.productListHeading}>Product Name</Text>
                  </View>
                  <View style={styles.minorColumn}>
                    <Icon style={styles.productStatusIcon} name={"check-circle-o"} size={24} color="#333" />
                  </View>
                </View>
                <View style={styles.activeListTray}>
                  <View style={styles.trayItemWrapper}>
                    <Text style={styles.trayText}>
                      <Text style={styles.trayLabel}>Lot / Serial: </Text>
                      990283409
                    </Text>
                    <Text style={styles.trayText}>
                      <Text style={styles.trayLabel}>Model Number: </Text>
                      G4FR4
                    </Text>
                    <Text style={styles.trayText}>
                      <Text style={styles.trayLabel}>Time Scanned: </Text>
                      2/20/2020 9:45 PM
                    </Text>
                  </View>
                  <View style={styles.straightRow}>
                    <View style={styles.equalColumn}>
                      <TouchableOpacity style={styles.miniSubmitButton}>
                        <Text style={styles.miniSubmitButtonText}>Waste</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.equalColumn}>
                      <TouchableOpacity style={styles.miniSubmitButton}>
                        <Text style={styles.miniSubmitButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.productListItem}>
                <View style={styles.majorMinorRow}>
                  <View style={styles.majorColumn}>
                    <Text style={styles.productListHeading}>Product Name</Text>
                  </View>
                  <View style={styles.minorColumn}>
                    <Icon style={styles.productStatusIconInactive} name={"barcode"} size={24} color="#333" />
                  </View>
                </View>
                <View style={styles.inactiveListTray}></View>
              </View>
              <View style={styles.productListItem}>
                <View style={styles.majorMinorRow}>
                  <View style={styles.majorColumn}>
                    <Text style={styles.productListHeading}>Product Name</Text>
                  </View>
                  <View style={styles.minorColumn}>
                    <Icon style={styles.productStatusIcon} name={"check-circle-o"} size={24} color="#333" />
                  </View>
                </View>
                <View style={styles.inactiveListTray}></View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <View style={styles.leftColumn}>
            <Text style={styles.bodyTextLabel}>Complete</Text>
            <Text style={styles.bodyTextLabel}>Case Scanning</Text>
          </View>
          <View style={styles.rightColumn}>
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Synchronize</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

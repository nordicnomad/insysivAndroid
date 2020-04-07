import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import GateData from '../dummyData/gates.json'

import styles from '../Styles/ContainerStyles.js'

export default class IntakeScan extends Component {
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
              <Text style={styles.titleText}>Intake Scan</Text>
            </View>
            <View style={styles.sectionContainer}>
              <View style={styles.menuRow}>
                <View style={styles.minorColumn}>
                  <Text>Ready -</Text>
                </View>
                <View style={styles.mediumColumn}>
                  <TouchableOpacity style={styles.miniSubmitButton}>
                    <Text style={styles.miniSubmitButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.majorColumn}>
                  <Text style={styles.countText}>
                    Total Count
                    <Text style={styles.countTextNumber}> 16</Text>
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <View style={styles.productListItem}>
                <View style={styles.majorMinorRow}>
                  <View style={styles.majorColumn}><Text style={styles.productListHeading}>Unknown Product</Text></View>
                  <View style={styles.minorColumn}>
                    <Text style={styles.countTextNumberUnkown}>4</Text>
                  </View>
                </View>
                <View style={styles.activeListTray}>
                  <View style={styles.straightRow}>
                    <View style={styles.equalColumn}>
                      <Text style={styles.trayLabel}>Model Number</Text>
                      <Text style={styles.trayLabel}>Lot / Serial Number</Text>
                    </View>
                    <View style={styles.equalColumn}>
                      <Text style={styles.trayText}>GR9393930</Text>

                      <Text style={styles.trayText}>LR101</Text>
                      <View style={styles.miniSubmitWrapper}>
                        <TouchableOpacity style={styles.miniSubmitButton}>
                          <Text style={styles.miniSubmitButtonText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.productListItem}>
                <View style={styles.majorMinorRow}>
                  <View style={styles.majorColumn}><Text style={styles.productListHeading}>Matched Product Name</Text></View>
                  <View style={styles.minorColumn}>
                    <Text style={styles.countTextNumber}>1</Text>
                  </View>
                </View>
                <View style={styles.inactiveListTray}></View>
              </View>
              <View style={styles.productListItem}>
                <View style={styles.majorMinorRow}>
                  <View style={styles.majorColumn}><Text style={styles.productListHeading}>Matched Product Name</Text></View>
                  <View style={styles.minorColumn}>
                    <Text style={styles.countTextNumber}>1</Text>
                  </View>
                </View>
                <View style={styles.inactiveListTray}></View>
              </View>
              <View style={styles.productListItem}>
                <View style={styles.majorMinorRow}>
                  <View style={styles.majorColumn}><Text style={styles.productListHeading}>Matched Product Name</Text></View>
                  <View style={styles.minorColumn}>
                    <Text style={styles.countTextNumber}>100</Text>
                  </View>
                </View>
                <View style={styles.inactiveListTray}></View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <View style={styles.leftColumn}>
            <Text style={styles.bodyTextLabel}>Synchronize</Text>
            <Text style={styles.bodyTextLabel}>to Desktop</Text>
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

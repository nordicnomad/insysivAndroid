import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, Picker, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import GateData from '../dummyData/gates.json'

import styles from '../Styles/ContainerStyles.js'

export default class ReportReconcile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedValue: 0,
      gates: [],
      reportDate: "03/13/2020",

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
  getTrashUnreconciledData() {
    let trashUnreconciledResponse = {}
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/trashUnreconciled')
    //test server call
    return fetch('https://insysivtestapi.herokuapp.com/insysiv/api/v1.0/trashUnreconciled')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      trashUnreconciledResponse = responseJson.trashUnreconciled;
      this.setState({
        trashUnreconciled: trashUnreconciledResponse,
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
            <Text style={styles.titleText}>Trash Reconciliation</Text>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.majorMinorRow}>
              <View style={styles.minorColumn}>
                <Icon name="angle-left" size={26} color="#102541" />
              </View>
              <View styles={styles.majorColumn}>
                <Text style={styles.bodyTextHeading}>3/13/2020</Text>
              </View>
              <View style={styles.minorColumn}>
                <Icon name="angle-right" size={26} color="#102541" />
              </View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.bodyTextLabel}><Text style={styles.bodyTextHeading}>5</Text> Items</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.bodyTextLabelRight}>Appearance</Text>
              </View>
            </View>

            {/* Truncated Materials List Item */}
            <View style={styles.productListItem}>
              <View style={styles.straightRow}>
                <View style={styles.majorColumn}>
                  <Text style={styles.productListHeading}>Item Description</Text>
                </View>
                <View style={styles.mediumColumn}>
                  <Text style={styles.productListHeadingRight}>3/13/2020</Text>
                </View>
              </View>
              <View style={styles.productListTray}>
                <View style={styles.majorMinorRow}>
                  <View style={styles.mediumColumn}>
                    <Text style={styles.bodyTextLabel}>Assign to: </Text>
                  </View>
                  <View style={styles.majorColumn}>
                    <View style={styles.formPickerWrapper}>
                      <Picker style={styles.formPicker}>
                        <Picker.Item label='Select an option...' value='0' />
                        <Picker.Item label='Alvarez - 12121156' value='1' />
                        <Picker.Item label='Boop - 21212267' value='2' />
                      </Picker>
                    </View>
                  </View>
                </View>
                <View style={styles.straightRow}>
                  <View style={styles.equalColumn}>
                    <TouchableOpacity style={styles.miniSubmitButton}>
                      <Text style={styles.miniSubmitButtonText}>View Case</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.equalColumn}>
                    <TouchableOpacity style={styles.miniSubmitButton}>
                      <Text style={styles.miniSubmitButtonText}>Escalate</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.equalColumn}>
                    <TouchableOpacity style={styles.miniSubmitButton}>
                      <Text style={styles.miniSubmitButtonText}>Assign</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Expanded Materials List Item */}
            <View style={styles.productListItem}>
              <View style={styles.straightRow}>
                <View style={styles.majorColumn}>
                  <Text style={styles.activeProductListHeading}>Item Description</Text>
                </View>
                <View style={styles.mediumColumn}>
                  <Text style={styles.productListHeadingRight}>3/13/2020</Text>
                </View>
              </View>
              <View style={styles.productListTray}>
                <View style={styles.majorMinorRow}>
                  <View style={styles.mediumColumn}>
                    <Text style={styles.bodyTextLabel}>Assign to: </Text>
                  </View>
                  <View style={styles.majorColumn}>
                    <View style={styles.formPickerWrapper}>
                      <Picker style={styles.formPicker}>
                        <Picker.Item label='Select an option...' value='0' />
                        <Picker.Item label='Alvarez - 12121156' value='1' />
                        <Picker.Item label='Boop - 21212267' value='2' />
                      </Picker>
                    </View>
                  </View>
                </View>
                <View>
                  <View style={styles.straightRow}>
                    <View style={styles.majorColumn}>
                      <Text style={styles.bodyTextLabel}>Materials</Text>
                    </View>
                    <View style={styles.minorColumn}>
                      <Text style={styles.bodyTextLabel}>Qty</Text>
                    </View>
                    <View style={styles.minorColumn}>
                      <Text style={styles.bodyTextLabel}>Scan</Text>
                    </View>
                  </View>
                  <View style={styles.straightRow}>
                    <View style={styles.majorColumn}>
                      <Text style={styles.bodyText}>Another Item</Text>
                    </View>
                    <View style={styles.minorColumn}>
                      <Text style={styles.bodyText}>2</Text>
                    </View>
                    <View style={styles.minorColumn}>
                      <Text style={styles.bodyText}>Y</Text>
                    </View>
                  </View>
                  <View style={styles.straightRow}>
                    <View style={styles.majorColumn}>
                      <Text style={styles.bodyText}>This Item</Text>
                    </View>
                    <View style={styles.minorColumn}>
                      <Text style={styles.bodyText}>1</Text>
                    </View>
                    <View style={styles.minorColumn}>
                      <Text style={styles.bodyText}>N</Text>
                    </View>
                  </View>
                  <View style={styles.straightRow}>
                    <View style={styles.majorColumn}>
                      <Text style={styles.bodyText}>Another Item</Text>
                    </View>
                    <View style={styles.minorColumn}>
                      <Text style={styles.bodyText}>1</Text>
                    </View>
                    <View style={styles.minorColumn}>
                      <Text style={styles.bodyText}>Y</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.straightRow}>
                  <View style={styles.minorColumn}>
                    <TouchableOpacity style={styles.miniSubmitButton}>
                      <Text style={styles.miniSubmitButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.equalColumn}>
                    <TouchableOpacity style={styles.miniSubmitButton}>
                      <Text style={styles.miniSubmitButtonText}>Escalate</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.equalColumn}>
                    <TouchableOpacity style={styles.miniSubmitButton}>
                      <Text style={styles.miniSubmitButtonText}>Assign</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.productListItem}>
              <View style={styles.straightRow}>
                <View style={styles.majorColumn}>
                  <Text style={styles.productListHeading}>Item Description</Text>
                </View>
                <View style={styles.mediumColumn}>
                  <Text style={styles.productListHeadingRight}>3/13/2020</Text>
                </View>
              </View>
              <View style={styles.inactiveListTray}>
              </View>
            </View>
            <View style={styles.productListItem}>
              <View style={styles.straightRow}>
                <View style={styles.majorColumn}>
                  <Text style={styles.productListHeading}>Item Description</Text>
                </View>
                <View style={styles.mediumColumn}>
                  <Text style={styles.productListHeadingRight}>3/13/2020</Text>
                </View>
              </View>
              <View style={styles.inactiveListTray}>
              </View>
            </View>
            <View style={styles.productListItem}>
              <View style={styles.straightRow}>
                <View style={styles.majorColumn}>
                  <Text style={styles.productListHeading}>Item Description</Text>
                </View>
                <View style={styles.mediumColumn}>
                  <Text style={styles.productListHeadingRight}>3/13/2020</Text>
                </View>
              </View>
              <View style={styles.inactiveListTray}>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

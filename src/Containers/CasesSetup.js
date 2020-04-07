import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, TextInput, View, Button, Picker, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import GateData from '../dummyData/gates.json'

import styles from '../Styles/ContainerStyles.js'

export default class CasesSetup extends Component {
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
            <Text style={styles.titleText}>Cases Setup</Text>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.shadedBackgroundWrapper}>
              <View style={styles.formTitleWrapper}>
                <Text style={styles.bodyTextHeading}>Select an Active Case</Text>
              </View>
              <View style={styles.majorMinorRow}>
                <View style={styles.majorColumn}>
                  <View style={styles.formPickerWrapper}>
                    <Picker style={styles.formPicker}>
                      <Picker.Item label='Select an option...' value='0' />
                      <Picker.Item label='Alvarez, Alan - 12121156' value='1' />
                      <Picker.Item label='Boop, Beatrice - 21212267' value='2' />
                    </Picker>
                  </View>
                </View>
                <View style={styles.minorColumn}>
                  <TouchableOpacity
                    style={styles.miniSubmitButton}
                    onPress={() => this.props.navigation.navigate("CasesScan")}>
                    <Text style={styles.miniSubmitButtonText}>GO</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.majorMinorRow}>
                <View style={styles.minorColumn}>
                  <Text style={styles.bodyTextHeading}>Or</Text>
                </View>
                <View style={styles.majorColumn}>
                  <TouchableOpacity style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Start a New Case</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.shadedBackgroundWrapper}>
              <View style={styles.formTitleWrapper}>
                <Text style={styles.bodyTextHeading}>New Case Setup</Text>
              </View>
              <View style={styles.formItemWrapper}>
                <TextInput style={styles.formInput} />
                <Text style={styles.inputTextLabel}>Case Number</Text>
              </View>
              <View style={styles.formItemWrapper}>
                <TextInput style={styles.formInput} />
                <Text style={styles.inputTextLabel}>Patient Name</Text>
              </View>
              <View style={styles.formItemWrapper}>
                <View style={styles.formPickerWrapper}>
                  <Picker style={styles.formPicker}>
                    <Picker.Item label='Select a doctor...' value='0' />
                    <Picker.Item label='Dr. Mann MD' value='1' />
                    <Picker.Item label='Dr. OtherPerson MD' value='2' />
                  </Picker>
                </View>
                <Text style={styles.inputTextLabel}>Doctor</Text>
              </View>
              <View style={styles.formItemWrapper}>
                <View style={styles.formPickerWrapper}>
                  <Picker style={styles.formPicker}>
                    <Picker.Item label='Select a location...' value='0' />
                    <Picker.Item label='CV Lab Number 1' value='1' />
                    <Picker.Item label='CV Lab Number 2' value='2' />
                  </Picker>
                </View>
                <Text style={styles.inputTextLabel}>Location</Text>
              </View>
              <View style={styles.formItemWrapper}>
                <View style={styles.formPickerWrapper}>
                  <Picker style={styles.formPicker}>
                    <Picker.Item label='Select a procedure...' value='0' />
                    <Picker.Item label='Heart Procedure' value='1' />
                    <Picker.Item label='Laser Procedure' value='2' />
                  </Picker>
                </View>
                <Text style={styles.inputTextLabel}>Procedure</Text>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => this.props.navigation.navigate("CasesScan")}>
                  <Text style={styles.submitButtonText}>Start Case</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

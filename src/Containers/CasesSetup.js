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
      showNewTray: false,
      activeCaseValue: 0,
      cases:{cases:[],Doctors:[],Locations:[],Procedures:[]},
      caseNumberHasFocus: false,
      patientNameHasFocus: false,
      newCaseNumber: '',
      newPatientName: '',
      newDoctorValue: 0,
      newLocationValue: 0,
      newProcedureValue: 0,
    }
  }
  componentDidMount() {
    this.getCasesData();
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
  getCasesData() {
    let casesResponse = {}
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/cases')
    //test server call
    return fetch('https://insysivtestapi.herokuapp.com/insysiv/api/v1.0/cases')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      casesResponse = responseJson.cases;
      this.setState({
        cases: casesResponse,
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }
  onCaseNumberFocusChange() {
    this.setState({caseNumberHasFocus: !this.state.caseNumberHasFocus})
  }
  onPatientNameFocusChange() {
    this.setState({patientNameHasFocus: !this.state.patientNameHasFocus})
  }
  onDoctorChange = (pickerValue) => {
    this.setState({newDoctorValue: pickerValue})
  }
  onLocationChange = (pickerValue) => {
    this.setState({newLocationValue: pickerValue})
  }
  onProcedureChange = (pickerValue) => {
    this.setState({newProcedureValue: pickerValue})
  }
  onCaseChange = (pickerValue) => {
    this.setState({activeCaseValue: pickerValue})
  }
  toggleCreateTray = (trayState) => {
    if(trayState === true) {
      this.setState({
        showNewTray: false,
      })
    }
    else {
      this.setState({
        showNewTray: true,
      })
    }
  }
  renderExistingCases() {
    let existingCases = this.state.cases.cases
    let existingOutput = []
    existingOutput.push(
      <Picker.Item key={"exC" + 0} label='Select an existing case...' value='0' />
    )
    existingCases.forEach(function(existing, index) {
      existingOutput.push(
        <Picker.Item key={"exC"+index} label={existing.name + " - " + existing.number} value={index+1} />
      )
    })
    return(existingOutput)
  }
  renderDoctorChoices() {
    let doctors = this.state.cases.Doctors
    let doctorsOutput = []
    doctorsOutput.push(
      <Picker.Item key={"Doc" + 0} label='Select a Doctor...' value='0' />
    )
    doctors.forEach(function(doctor, index) {
      doctorsOutput.push(
        <Picker.Item key={"Doc"+index} label={doctor} value={index+1} />
      )
    })
    return(doctorsOutput)
  }
  renderLocationChoices() {
    let locations = this.state.cases.Locations
    let locationsOutput = []
    locationsOutput.push(
      <Picker.Item key={"Loc" + 0} label='Select a Location...' value='0' />
    )
    locations.forEach(function(location, index) {
      locationsOutput.push(
        <Picker.Item key={"Loc"+index} label={location} value={index+1} />
      )
    })
    return(locationsOutput)
  }
  renderProcedureChoices() {
    let procedures = this.state.cases.Procedures
    let proceduresOutput = []
    proceduresOutput.push(
      <Picker.Item key={"Pro" + 0} label='Select a Procedure...' value='0' />
    )
    procedures.forEach(function(procedure, index) {
      proceduresOutput.push(
        <Picker.Item key={"Pro"+index} label={procedure} value={index+1} />
      )
    })
    return(proceduresOutput)
  }
  selectActiveCase = () => {
    let selectedValue = this.state.activeCaseValue
    if(selectedValue > 0) {
      let allCases = this.state.cases.cases
      let activeSelected = allCases[selectedValue - 1]
      console.log("SELECTED ACTIVE CASE")
      console.log(selectedValue-1)
      console.log(allCases)
      console.log(activeSelected)
      this.props.navigation.navigate('CasesScan', {
        caseInformation: activeSelected
      })
    }
    else {
      alert("Please Select an Active Case to Continue.")
    }
  }
  createNewCase = (caseNumber, patientName, doctor, location, procedure) => {
    //Here we'll need a post method to the python API that creates a New
    //Case object in the database for an associated patient.

    let userResponse = {
      caseNumber: '',
      patientName: '',
      doctor: '',
      location: '',
      procedure: ''
    }
    if(doctor != '0' && location != '0' && procedure != '0') {
      userResponse={
        caseNumber: caseNumber,
        patientName: patientName,
        doctor: doctor,
        location: location,
        procedure: procedure
      }
      alert("This button creates a new record in the database for:" + patientName)

      this.props.navigation.navigate('CasesScan', {
        caseInformation: userResponse
      })
    }
    else {
      alert("All fields are required to continue.")
    }

  }

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
                    <Picker
                      style={styles.formPicker}
                      selectedValue={this.state.activeCaseValue}
                      onValueChange={this.onCaseChange}
                      >
                      {this.renderExistingCases()}
                    </Picker>
                  </View>
                </View>
                <View style={styles.minorColumn}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => this.selectActiveCase()}>
                    <Text style={styles.submitButtonText}>GO</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.majorMinorRow}>
                <View style={styles.minorColumn}>
                  <Text style={styles.seperatorHeading}>Or</Text>
                </View>
                <View style={styles.majorColumn}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => this.toggleCreateTray(this.state.showNewTray)}>
                    <Text style={styles.submitButtonText}>Start a New Case</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={this.state.showNewTray === true ? styles.sectionContainer : styles.inactiveListTray}>
            <View style={styles.shadedBackgroundWrapper}>
              <View style={styles.formTitleWrapper}>
                <Text style={styles.bodyTextHeading}>New Case Setup</Text>
              </View>
              <View style={styles.formItemWrapper}>
                <Text style={styles.inputTextLabel}>Case Number</Text>
                <TextInput
                  style={this.state.caseNumberHasFocus === true ? styles.formInputFocus : styles.formInput}
                  onFocus={() => this.onCaseNumberFocusChange()}
                  onBlur={() => this.onCaseNumberFocusChange()}
                  onChangeText={value => this.setState({newCaseNumber: value})}
                  />
              </View>
              <View style={styles.formItemWrapper}>
                <Text style={styles.inputTextLabel}>Patient Name</Text>
                <TextInput
                  style={this.state.patientNameHasFocus === true ? styles.formInputFocus : styles.formInput}
                  onFocus={() => this.onPatientNameFocusChange()}
                  onBlur={() => this.onPatientNameFocusChange()}
                  onChangeText={value => this.setState({newPatientName: value})}
                  />
              </View>
              <View style={styles.formItemWrapper}>
                <Text style={styles.inputTextLabel}>Doctor</Text>
                <View style={styles.formPickerWrapper}>
                  <Picker
                    style={styles.formPicker}
                    selectedValue={this.state.newDoctorValue}
                    onValueChange={this.onDoctorChange}
                    >
                    {this.renderDoctorChoices()}
                  </Picker>
                </View>
              </View>
              <View style={styles.formItemWrapper}>
                <Text style={styles.inputTextLabel}>Location</Text>
                <View style={styles.formPickerWrapper}>
                  <Picker
                    style={styles.formPicker}
                    selectedValue={this.state.newLocationValue}
                    onValueChange={this.onLocationChange}
                    >
                    {this.renderLocationChoices()}
                  </Picker>
                </View>
              </View>
              <View style={styles.formItemWrapper}>
                <Text style={styles.inputTextLabel}>Procedure</Text>
                <View style={styles.formPickerWrapper}>
                  <Picker
                    style={styles.formPicker}
                    selectedValue={this.state.newProcedureValue}
                    onValueChange={this.onProcedureChange}
                    >
                    {this.renderProcedureChoices()}
                  </Picker>
                </View>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => this.createNewCase(this.state.newCaseNumber, this.state.newPatientName, this.state.newDoctorValue, this.state.newPatientName, this.state.newProcedureValue)}>
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

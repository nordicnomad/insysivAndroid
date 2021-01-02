import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, TextInput, View, Button, Picker, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import GateData from '../dummyData/gates.json'

var Realm = require('realm');
let activeUser ;
let activeCases ;
let physiciansList ;
let locationsList ;
let proceduresList ;
let lastCaseDataFetch ;

import styles from '../Styles/ContainerStyles.js'

export default class CasesSetup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showNewTray: false,
      activeCaseValue: 0,
      cases:[],
      doctors:[],
      locations:[],
      procedures:[],
      caseNumberHasFocus: false,
      patientNameHasFocus: false,
      newCaseNumber: '',
      newPatientName: '',
      newDoctorValue: 0,
      newLocationValue: 0,
      newProcedureValue: 0,
      newDoctorLabel: "",
      newLocationLabel: "",
      newProcedureLabel: "",
      newProductsValue: [],
    }
    activeUser = new Realm({
      schema: [{name: 'Active_User',
        properties: {
          userId:"string",
          userName: "string",
          userToken: "string",
          tokenExpiration: "string?",
          syncAddress: "string?",
          //Additional Organization Level Configuration Options go Here.
      }}]
    });
    physiciansList = new Realm({
      schema: [{name: 'Physicians_List',
      properties: {
        physicianId: "string",
        firstName: "string",
        middleInitial: "string?",
        lastName: "string",
        active: "string",
      }}]
    });
    locationsList = new Realm({
      schema: [{name: 'Locations_List',
      properties: {
        siteId: "int",
        siteDescription: "string",
        active: "string",
      }}]
    });
    proceduresList = new Realm({
      schema: [{name: 'Procedures_List',
      properties: {
        procedureCode: "string",
        procedureDescription: "string",
        active: "string",
      }}]
    });
    activeCases = new Realm({
      schema: [{name: 'Active_Cases',
      properties: {
        siteId: "string?",
        caseNumber: "int",
        dateIn: "string?",
        timeIn: "string?",
        dateOut: "string?",
        timeOut: "string?",
        patientId: "string",
        syncSiteName: "string?",
        billingVerified: "int?"
      }}]
    });
    lastCaseDataFetch = new Realm({
      schema: [{name: 'Case_Data_Last_Fetch',
      properties:
      {
          year: "int",
          month: "int",
          day: "int"
      }}]
    });
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
  getCurrentDate = () => {
    let dateobject = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    }
    return(dateobject)
  }
  checkLastCaseFetch() {
    let lastCaseDate = lastCaseDataFetch.objects('Case_Data_Last_Fetch')
    let currentDate = this.getCurrentDate()

    if(lastCaseDate != null && lastCaseDate != undefined && lastCaseDate.length > 0) {
      if(currentDate.year === lastCaseDate[0].year) {
        if(currentDate.month === lastCaseDate[0].month) {
          if(currentDate.day > lastCaseDate[0].day) {
            return true
          }
          else {
            return false
          }
        }
        else {
          return false
        }
      }
      else {
        return false
      }
    }
    else {
      return false
    }
  }

  getCasesData() {
    let recentFetch = this.checkLastCaseFetch()

    if(recentFetch === true) {
      let doctorData = physiciansList.objects('Physicians_List')
      let procedureData = proceduresList.objects('Procedures_List')
      let locationData = locationsList.objects('Locations_List')

      this.setState({
        cases:{
          cases:[],
          Doctors: doctorData,
          Locations: locationData,
          Procedures: procedureData
        },
      })
    }
    else {
      this.FetchDoctorTable()
      this.FetchProcedureTable()
      this.FetchLocationTable()
    }
  }
  onCaseNumberFocusChange() {
    this.setState({caseNumberHasFocus: !this.state.caseNumberHasFocus})
  }
  onPatientNameFocusChange() {
    this.setState({patientNameHasFocus: !this.state.patientNameHasFocus})
  }
  onDoctorChange = (pickerValue) => {
    this.setState({newDoctorValue: pickerValue, newDoctorLabel: this.state.doctors[pickerValue-1]})
  }
  onLocationChange = (pickerValue) => {
    this.setState({newLocationValue: pickerValue, newLocationLabel:this.state.locations[pickerValue-1]})
  }
  onProcedureChange = (pickerValue) => {
    this.setState({newProcedureValue: pickerValue, newProcedureLabel: this.state.procedures[pickerValue-1]})
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
    let existingCases = this.state.cases
    let existingOutput = []
    existingOutput.push(
      <Picker.Item key={"exC" + 0} label='Select an existing case...' value='0' />
    )
    if(existingCases != null && existingCases != undefined) {
      existingCases.forEach(function(existing, index) {
        existingOutput.push(
          <Picker.Item key={"exC"+index} label={existing.name + " - " + existing.number} value={index+1} />
        )
      })
    }
    return(existingOutput)
  }
  savePhysiciansTable = (responsephysicians) => {
    let savedPhysicians = physiciansList.objects('Physicians_List')
    let newPhysicians = responsephysicians

    if(savedPhysicians != undefined && savedPhysicians != null && savedPhysicians.length > 0) {
      physiciansList.write(() => {
        physiciansList.deleteAll()
        newPhysicians.forEach(function(physician, i) {
          try {
            physiciansList.create('Physicians_List', {
              physicianId: physician.physicianId,
              firstName: physician.firstName,
              middleInitial: physician.middleInitial,
              lastName: physician.lastName,
              active: physician.active,
            })
          }
          catch (e) {
            console.log("Error on physician table creation");
            console.log(e);
          }
        })
      })
      physiciansList.compact()
    }
  }
  FetchDoctorTable = () => {
    let physiciansResponse = []

    //Doctor Calls
    //test server call
    console.log("FETCHDOCTORTABLE CALLED FROM CASESSETUP PAGE")
    return fetch('http://25.78.82.76:5100/api/Physicians')
    .then((docresponse) => docresponse.json())
    .then((docresponseJson) => {
      console.log("PHYSICIANS RESPONSE")
      console.log(docresponseJson)
      physiciansResponse = docresponseJson;
      this.savePhysiciansTable(physiciansResponse)
      this.setState({
        doctors:physiciansResponse,
        fetchProgressMessage: 'Physicians Synced',
      })
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        syncProgressMessage: 'Physicians Fetch Failed'
      })
    });
  }
  saveProcedureTable = (responseprocedures) => {
    let savedProcedures = proceduresList.objects('Procedures_List')
    let newProcedures = responseprocedures
    let saveCount = 0

    if(savedProcedures != undefined && savedProcedures != null && savedProcedures.length > 0) {
      proceduresList.write(() => {
        proceduresList.deleteAll()
        newProcedures.forEach(function(procedure, i) {
          try {
            proceduresList.create('Procedures_List', {
              procedureCode: procedure.procedureCode,
              procedureDescription: procedure.procedureDescription,
              active: procedure.active,
            })
          }
          catch (e) {
            console.log("Error on procedure table creation");
            console.log(e);
          }
        })
      })
      proceduresList.compact()
    }
  }
  FetchProcedureTable = () => {
    let barcodeResponse = []

    //Procedure Calls
    //test server call
    console.log("FETCHPROCEDURETABLE CALLED FROM CASESSETUP PAGE")
    return fetch('http://25.78.82.76:5100/api/ProcedureTables')
    .then((proresponse) => proresponse.json())
    .then((proresponseJson) => {
      console.log("PROCEDURE RESPONSE")
      console.log(proresponseJson)
      procedureResponse = proresponseJson;
      this.saveProcedureTable(procedureResponse)
      this.setState({
        procedures:procedureResponse,
        syncProgressMessage: 'Procedures Synced',
      })
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        syncProgressMessage: 'Procedure Fetch Failed'
      })
    });
  }
  saveLocationsTable = (responselocations) => {
    let savedLocations = locationsList.objects('Locations_List')
    let newLocations = responselocations
    let saveCount = 0

    if(savedLocations != undefined && savedLocations != null && savedLocations.length > 0) {
      locationsList.write(() => {
        locationsList.deleteAll()
        newLocations.forEach(function(location, i) {
          try {
            locationsList.create('Locations_List', {
              siteId: location.siteId,
              siteDescription: location.siteDescription,
              active: location.active,
            })
          }
          catch (e) {
            console.log("Error on location table creation");
            console.log(e);
          }
        })
      })
      locationsList.compact()
    }
    if(newLocations.length === 0 || savedLocations === undefined || savedLocations === null) {
      console.log("NEWLOCATIONS LENGTH ZERO, ADDING DEFAULT LOCATION")
      locationsList.write(() => {
        try {
          locationsList.create('Locations_List', {
            siteId: '00001',
            siteDescription: "Waiting Room",
            active: "Y",
          })
        }
        catch (e) {
          console.log("Error on location table creation");
          console.log(e);
        }
      })
    }
  }
  FetchLocationTable = () => {
    let barcodeResponse = []

    //Location Calls
    //test server call
    console.log("FETCHLOCATIONTABLE CALLED FROM CASESSETUP PAGE")
    return fetch('http://25.78.82.76:5100/api/HospitalSites')
    .then((siteresponse) => siteresponse.json())
    .then((siteresponseJson) => {
      console.log("HOSPITAL SITES RESPONSE")
      console.log(siteresponseJson)
      sitesResponse = siteresponseJson;
      this.saveLocationsTable(sitesResponse)
      this.setState({
        locations:sitesResponse,
        syncProgressMessage: 'Sites Synced',
      })
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        syncProgressMessage: 'Sites Fetch Failed'
      })
    });
  }
  renderDoctorChoices() {
    let doctors = this.state.doctors
    let doctorsOutput = []
    doctorsOutput.push(
      <Picker.Item key={"Doc" + 0} label='Select a Doctor...' value='0' />
    )
    if(doctors != null && doctors != undefined) {
      doctors.forEach(function(doctor, index) {
        if(doctor.active === "Y") {
          doctorsOutput.push(
            <Picker.Item key={doctor.physicianId} label={doctor.physicianId + " - - " + doctor.firstName + " " + doctor.lastName} value={index+1} />
          )
        }
      })
    }
    return(doctorsOutput)
  }
  renderLocationChoices() {
    let locations = this.state.locations
    let locationsOutput = []
    locationsOutput.push(
      <Picker.Item key={"Loc" + 0} label='Select a Location...' value='0' />
    )
    locationsOutput.push(
      <Picker.Item key={"PlaceHolder" + 1} label='Waiting Room' value='1' />
    )
    if(locations != null && locations != undefined) {
      locations.forEach(function(location, index) {
        if(location.active === "Y") {
          locationsOutput.push(
            <Picker.Item key={location.siteId} label={location.siteDescription} value={index+1} />
          )
        }
      })
    }
    return(locationsOutput)
  }
  renderProcedureChoices() {
    let procedures = this.state.procedures
    let proceduresOutput = []
    proceduresOutput.push(
      <Picker.Item key={"Pro" + 0} label='Select a Procedure...' value='0' />
    )
    if(procedures != null && procedures != undefined) {
      procedures.forEach(function(procedure, index) {
        if(procedure.active === "Y") {
          proceduresOutput.push(
            <Picker.Item key={procedure.procedureCode} label={procedure.procedureDescription} value={index+1} />
          )
        }
      })
    }
    return(proceduresOutput)
  }
  selectActiveCase = () => {
    let selectedValue = this.state.activeCaseValue
    if(selectedValue > 0) {
      let allCases = this.state.cases
      let activeSelected = allCases[selectedValue - 1]
      this.props.navigation.navigate('CasesScan', {
        caseInformation: activeSelected
      })
    }
    else {
      alert("Please Select an Active Case to Continue.")
    }
  }
  createNewCase = (caseNumber, patientName, doctor, location, procedure, products) => {
    //Here we'll need a post method to the python API that creates a New
    //Case object in the database for an associated patient.

    let userResponse = {
      number: '',
      name: '',
      doctor: '',
      location: '',
      procedure: '',
      products: [],
    }
    if(this.state.newDoctorValue != '0' && this.state.newLocationValue != '0' && this.state.newProcedureValue != '0') {
      userResponse={
        number: caseNumber,
        name: patientName,
        doctor: doctor,
        location: location,
        procedure: procedure,
        products: products,
      }
      console.log("USERRESPONSE BEFORE NAVIGATION")
      console.log(userResponse)
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
    let isLoggedIn = activeUser.objects('Active_User')
    if(isLoggedIn.length === 0) {
      return(this.props.navigation.navigate('Login'))
    }
    else {
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
                    onPress={() => this.createNewCase(this.state.newCaseNumber, this.state.newPatientName, this.state.newDoctorLabel, this.state.newLocationLabel, this.state.newProcedureLabel, this.state.newProductsValue)}>
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
}

import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, TextInput, View, Button, Picker, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.jpg'
import DummyDocs from '../dummyData/physiciansOffline.json'
import DummySites from '../dummyData/sitesOffline.json'
import DummyProcedures from '../dummyData/proceduresOffline.json'

var Realm = require('realm');
let activeUser ;
let physiciansList ;
let locationsList ;
let proceduresList ;
let activeScanableCase ;

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
      patientIdHasFocus: false,
      newCaseNumber: '00000',
      newPatientId: '',
      newDoctorValue: 0,
      newDoctorLabel: "",
      newDoctorId: '',
      newLocationValue: 0,
      newLocationLabel: "",
      newLocationId: '',
      newProcedureValue: 0,
      newProcedureLabel: "",
      newProcedureId: '',
      showForm: false,
    }
    activeUser = new Realm({
      schema: [{name: 'Active_User',
        properties: {
          userId:"string",
          userName: "string",
          userToken: "string",
          tokenExpiration: "string?",
          syncAddress: "string?",
          organizationName: "string?",
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
        siteId: "string",
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
    activeScanableCase = new Realm({
      schema: [{name: 'Active_Scanable_Case',
      properties: {
        chead_pk_case_number: "string",
        chead_pk_site_id: "string",
        chead_patient_id: "string",
        cproc_pk_procedure_code: "string",
        cproc_physician_id: "string",
        cproc_billing_code: "string?",
        cproc_sync_site_name: "string?",

        chead_datetime_in: "string?",
        chead_datetime_out: "string?",
        chead_user_one: "string?",
        chead_user_two: "string?",
        chead_user_three: "string?",
        chead_user_four: "string?",
      }}]
    });
  }
  componentDidMount() {
    let spaceCheck = activeScanableCase.objects('Active_Scanable_Case')
    if(spaceCheck === null || spaceCheck === undefined || spaceCheck.length === 0) {
      this.setState({
        showForm: true,
      })
      this.getCasesData();
    }
    else {
      this.props.navigation.navigate('CasesScan')
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
  getCurrentDate = () => {
    let dateobject = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    }
    return(dateobject)
  }

  getCasesData() {
    let doctorData = physiciansList.objects('Physicians_List')
    let procedureData = proceduresList.objects('Procedures_List')
    let locationData = locationsList.objects('Locations_List')

    if(doctorData === null || doctorData === undefined || doctorData.length === 0) {
      this.FetchDoctorTable()
    }
    if(procedureData === null || procedureData === undefined || procedureData.length === 0) {
      this.FetchProcedureTable()
    }
    if(locationData === null || locationData === undefined || locationData.length === 0) {
      this.FetchLocationTable()
    }

    this.setState({
      doctors: doctorData,
      locations: locationData,
      procedures: procedureData,
    })
  }
  onCaseNumberFocusChange() {
    this.setState({caseNumberHasFocus: !this.state.caseNumberHasFocus})
  }
  onPatientIdFocusChange() {
    this.setState({patientIdHasFocus: !this.state.patientIdHasFocus})
  }
  onDoctorChange = (pickerValue) => {
    this.setState({
      newDoctorValue: pickerValue,
      newDoctorLabel: this.state.doctors[pickerValue-1],
      newDoctorId: this.state.doctors[pickerValue-1].physicianId,
    })
  }
  onLocationChange = (pickerValue) => {
    this.setState({
      newLocationValue: pickerValue,
      newLocationLabel: this.state.locations[pickerValue-1],
      newLocationId: this.state.locations[pickerValue-1].siteId,
    })
  }
  onProcedureChange = (pickerValue) => {
    this.setState({
      newProcedureValue: pickerValue,
      newProcedureLabel: this.state.procedures[pickerValue-1],
      newProcedureId: this.state.procedures[pickerValue-1].procedureCode,
    })
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
    }
  }
  LoadDummyDocTable = () => {
    let docResponse = DummyDocs

    this.savePhysiciansTable(docResponse)
  }
  async FetchDoctorTable() {
    let physiciansResponse = []

    //Doctor Calls
    //test server call
    console.log("FETCHDOCTORTABLE CALLED FROM CASESSETUP PAGE")
    try {
      return fetch('http://45.42.176.50:5100/api/Physicians')
      .then((docresponse) => docresponse.json())
      .then((docresponseJson) => {
        console.log("PHYSICIANS RESPONSE")
        console.log(docresponseJson)
        physiciansResponse = docresponseJson;
        this.savePhysiciansTable(physiciansResponse)
        this.setState({
          doctors:physiciansResponse,
          syncProgressMessage: 'Physicians Synced',
        })
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          syncProgressMessage: 'Physicians Fetch Failed'
        })
      });
    }
    catch (e) {
      console.log("PHYSICIANS FETCH FAILED")
      console.log(e)
      this.setState({
          syncProgressMessage: 'Physicians Fetch Failed'
      })
      this.LoadDummyDocTable()
    }
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
    }
  }
  LoadDummyProcedureTable = () => {
    let procedureResponse = DummyProcedures

    this.saveProcedureTable(procedureResponse)
  }
  async FetchProcedureTable() {
    let barcodeResponse = []

    //Procedure Calls
    //test server call
    console.log("FETCHPROCEDURETABLE CALLED FROM CASESSETUP PAGE")
    try {
      return fetch('http://45.42.176.50:5100/api/ProcedureTables')
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
    catch (e) {
      console.log('PROCEDURES FETCH FAILED')
      console.log(e)
      this.setState({
        syncProgressMessage: 'Procedure Fetch Failed'
      })
      this.LoadDummyProcedureTable()
    }
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
    }
  }
  LoadDummySiteTable = () => {
    let siteResponse = DummySites

    this.saveLocationsTable(siteResponse)
  }
  async FetchLocationTable() {
    let barcodeResponse = []

    //Location Calls
    //test server call
    console.log("FETCHLOCATIONTABLE CALLED FROM CASESSETUP PAGE")
    try{
      return fetch('http://45.42.176.50:5100/api/HospitalSites')
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
    catch (e) {
      console.log("SITES FETCH FAILED")
      console.log(e)
      this.setState({
        syncProgressMessage: 'Sites Fetch Failed'
      })
      this.LoadDummySiteTable()
    }
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
  createNewCase = (caseNumber, patientId, doctorId, locationId, procedureId) => {

    //Save case as a working case space object in Realm
    activeScanableCase.write(() => {
      try{
        activeScanableCase.create('Active_Scanable_Case', {
          chead_pk_case_number: caseNumber,
          chead_pk_site_id: locationId,
          chead_patient_id: patientId,
          cproc_pk_procedure_code: procedureId,
          cproc_physician_id: doctorId,
          cproc_billing_code: null,
          cproc_sync_site_name: null,

          chead_datetime_in: null,
          chead_datetime_out: null,
          chead_user_one: null,
          chead_user_two: null,
          chead_user_three: null,
          chead_user_four: null,
        })
      }
      catch (e) {
        console.log("Error on working space creation");
        console.log(e);
      }
    })

    //Redirect to scan page. That page will pick up the only item in the working space DB.
    this.props.navigation.navigate('CasesScan')

  }

  render() {
    let isLoggedIn = activeUser.objects('Active_User')
    if(isLoggedIn.length === 0) {
      //If not logged in redirect to login.
      return(this.props.navigation.navigate('Login'))
    }
    else {
      if(this.state.showForm === true) {
        return (
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
              <View style={styles.titleRow}>
                <Text style={styles.titleText}>Cases Setup</Text>
              </View>
              {/*<View style={styles.sectionContainer}>
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
              </View>*/}
              <View style={styles.sectionContainer}>
                <View style={styles.shadedBackgroundWrapper}>
                  {/*<View style={styles.formItemWrapper}>
                    <Text style={styles.inputTextLabel}>Case Number</Text>
                    <TextInput
                      style={this.state.caseNumberHasFocus === true ? styles.formInputFocus : styles.formInput}
                      onFocus={() => this.onCaseNumberFocusChange()}
                      onBlur={() => this.onCaseNumberFocusChange()}
                      onChangeText={value => this.setState({newCaseNumber: value})}
                      />
                  </View>*/}
                  <View style={styles.formItemWrapper}>
                    <Text style={styles.inputTextLabel}>Patient Id</Text>
                    <TextInput
                      style={this.state.patientIdHasFocus === true ? styles.formInputFocus : styles.formInput}
                      onFocus={() => this.onPatientIdFocusChange()}
                      onBlur={() => this.onPatientIdFocusChange()}
                      onChangeText={value => this.setState({newPatientId: value})}
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
                      onPress={() => this.createNewCase(this.state.newCaseNumber, this.state.newPatientId, this.state.newDoctorId, this.state.newLocationId, this.state.newProcedureId)}>
                      <Text style={styles.submitButtonText}>Start Case</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        );
      }
      else {
        return(
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.titleRow}>
                <Text style={styles.noDataText}>Loading...</Text>
              </View>
            </View>
          </ScrollView>
        )
      }
    }
  }
}

import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import LoginLogo from '../Images/insysivLogo.jpg'
import UserData from '../dummyData/login.json'
import OfflineBanner from '../Components/OfflineBanner'
import { NavigationContext } from 'react-navigation';

var Realm = require('realm');
let activeUser ;
let usersList ;

import styles from '../Styles/ContainerStyles.js'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      emailHasFocus: false,
      passHasFocus: false,
      username: '',
      password: '',
      networkConnected: false,
      loginError: ''
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

    usersList = new Realm({
      schema: [{name: 'Users_List',
      properties: {
        userId: "string",
        userPassword: "string",
        userName: "string",
        scannerCaseAuth: "string",
        scannerLinkAuth: "string",
        scannerInquiryAuth: "string",
        scannerUtilityAuth: "string",
        scannerInventoryAuth: "string",
        scannerCheckInAuth: "string",
      }}]
    });
  }

  componentDidMount() {
    let usersLoaded = usersList.objects('Users_List')
    let activeUsers = activeUser.objects('Active_User')
    if(activeUsers.length === 0 || activeUsers === null || activeUsers === undefined) {
      this.fetchUsersTable()
    }
    else {
      this.props.navigation.navigate('Home')
    }
  }

  static navigationOptions = {
    header: null,
  };

  onEmailFocusChange() {
    this.setState({emailHasFocus: !this.state.emailHasFocus})
  }
  onPassFocusChange() {
    this.setState({passHasFocus: !this.state.passHasFocus})
  }

  fetchUsersTable = () => {
    let usersResponse = []

    //Barcode Calls
    //test server call
    console.log("FETCHBARCODETABLE CALLED FROM ACCOUNT INFORMATION PAGE")
    return fetch('http://25.78.82.76:5100/api/UserTables')
    .then((userTableResponse) => userTableResponse.json())
    .then((userTableResponseJson) => {
      console.log("USERS RESPONSE")
      console.log(userTableResponseJson)
      usersResponse = userTableResponseJson;
      this.saveUserTable(usersResponse)
      this.setState({
        loginError: 'Users Synced',
      })
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        loginError: 'Users Load Failure'
      })
    });
  }

  saveUserTable = (userResponse) => {
    let savedUsers = usersList.objects('Users_List')
    let newUsers = userResponse

    if(savedUsers != undefined && savedUsers != null && savedUsers.length > 0) {
      usersList.write(() => {
        usersList.deleteAll()
        newUsers.forEach(function(user, i) {
          try {
            usersList.create('Users_List', {
              userId: user.userId,
              userPassword: user.userPassword,
              userName: user.userName,
              scannerCaseAuth: user.scannerCaseAuth,
              scannerLinkAuth: user.scannerLinkAuth,
              scannerInquiryAuth: user.scannerInquiryAuth,
              scannerUtilityAuth: user.scannerUtilityAuth,
              scannerInventoryAuth: user.scannerInventoryAuth,
              scannerCheckInAuth: user.scannerCheckInAuth,
            })
          }
          catch (e) {
            console.log("Error on user creation");
            console.log(e);
          }
        })
      })
      usersList.compact()
    }
    else {
      usersList.write(() => {
        newUsers.forEach(function(user, i) {
          try {
            usersList.create('Users_List', {
              userId: user.userId,
              userPassword: user.userPassword,
              userName: user.userName,
              scannerCaseAuth: user.scannerCaseAuth,
              scannerLinkAuth: user.scannerLinkAuth,
              scannerInquiryAuth: user.scannerInquiryAuth,
              scannerUtilityAuth: user.scannerUtilityAuth,
              scannerInventoryAuth: user.scannerInventoryAuth,
              scannerCheckInAuth: user.scannerCheckInAuth,
            })
          }
          catch (e) {
            console.log("Error on user creation");
            console.log(e);
          }
        })
      })
      usersList.compact()
    }
  }

  activeUserCall = () => {
    let userTokenResponse = ''
    //make API call to JWT Service
    //test server call
    console.log("ACTIVEUSERCALL CALLED FROM LOGIN PAGE")
    return fetch('http://25.78.82.76:5000/connect/token')
    .then((tokenresponse) => tokenresponse.json())
    .then((tokenresponseJson) => {
      console.log("TOKEN RESPONSE")
      console.log(tokenresponseJson)
      userTokenResponse = tokenresponseJson;
    })
    .catch((error) => {
      userTokenResponse = null
      console.error(error);
      this.setState({
        isFetchingToken: false,
        loginError: 'Authentication Connection Failed'
      })
    });
    return(userTokenResponse)
  }
  makeLoginRequest = () => {
    // Change to look up on the user table.
    console.log("USERNAME IN FUNCTION")
    console.log(this.state.username)
    console.log("PASSWORD IN FUNCTION")
    console.log(this.state.password)
    let lookupUsername = this.state.username
    let lookupPassword = this.state.password
    let usersTable = usersList.objects('Users_List')
    let matchUsernameBuild = 'userId CONTAINS "' + lookupUsername + '"'
    let matchedUser = usersTable.filtered(matchUsernameBuild)
    let userToken = ''

    console.log("MATCHED USER")
    console.log(matchedUser[0])
    // if credentials match make token request
    if(matchedUser != null && matchedUser != undefined && matchedUser.length > 0) {
      if(matchedUser[0].userPassword === lookupPassword) {
        // save token to active user database and navigate to home page.
        userToken = this.activeUserCall(matchedUser[0])
        if(userToken.error != null && userToken.error != undefined && userToken.error != '') {
          console.log("Token Request Failed")
          this.setState({
            loginError: "Faile Token Request"
          })
        }
        else if(userToken.token != '' && userToken.token != null && userToken.token != undefined) {
          try {
            activeUser.write(() => {
              activeUser.create('Active_User', {
                userId: matchedUser[0].userId,
                userName: matchedUser[0].userName,
                userToken: userToken.token,
                tokenExpiration:"FIGURE OUT TIMING",
                syncAddress:"Get From CONFIG Logic",
                organizationName: "Hospital Name",
                //Any other config variables for organization
              })
            })
            this.props.navigation.navigate('Home')
          }
          catch (e) {
            console.log("Error on active user creation");
            this.setState({
              loginError: "Login Active User Error: " + e
            })
          }
        }
        else {
          //REMOVE AFTER TESTING OR CHANGE RESPONSE TO SHOW INVALID TOKEN REQUEST
          this.setState({
            loginError: "Token Request Failed"
          })
          try {
            activeUser.write(() => {
              activeUser.create('Active_User', {
                userId: matchedUser[0].userId,
                userName: matchedUser[0].userName,
                userToken: "0000",
                tokenExpiration:"FIGURE OUT TIMING",
                syncAddress:"TOKEN REQUEST FAILED",
                //Any other config variables for organization
              })
            })
            this.props.navigation.navigate('Home')
          }
          catch (e) {
            console.log("Error on active user creation");
            this.setState({
              loginError: "Login Active User Error: " + e
            })
          }

        }
      }
    }
    else {
      console.log("No LOGIN Match")
      this.setState({
        loginError: "Credentials Invalid"
      })
    }
  }
  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <OfflineBanner showBanner={this.state.networkConnected} />
        <View style={styles.loginContainer}>
          <View style={styles.loginLogoRow}>
            <Image
              style={styles.loginLogo}
              source={LoginLogo}
            />
          </View>
          <View style={styles.loginRow}>
            <Text style={styles.loginLabel}>User Id</Text>
            <TextInput value={this.state.username}
              onFocus={() => this.onEmailFocusChange()}
              onBlur={() => this.onEmailFocusChange()}
              onChangeText={value => this.setState({username: value})}
              autoCorrect={false}
              style={this.state.emailHasFocus ? styles.textInputFocus : styles.textInput}
              />
          </View>
          <View style={styles.loginRow}>
            <Text style={styles.loginLabel}>Password</Text>
            <TextInput value={this.state.password}
            onFocus={() => this.onPassFocusChange()}
            onBlur={() => this.onPassFocusChange()}
            onChangeText={value => this.setState({password: value})}
            autoCompleteType="password"
            secureTextEntry={true}
            autoCorrect={false}
            style={this.state.passHasFocus ? styles.textInputFocus : styles.textInput}
            />
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.6}
              onPress={() => this.makeLoginRequest()}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
          <View><Text style={styles.errorText}>{this.state.loginError}</Text></View>
        </View>
      </ScrollView>
    );

  }
}

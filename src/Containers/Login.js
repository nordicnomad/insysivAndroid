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
    this.onUserChange = this.onUserChange.bind(this)
    this.onPassChange = this.onPassChange.bind(this)


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

  static navigationOptions = {
    header: null,
  };

  onEmailFocusChange() {
    this.setState({emailHasFocus: !this.state.emailHasFocus})
  }
  onPassFocusChange() {
    this.setState({passHasFocus: !this.state.passHasFocus})
  }
  onUserChange(event) {
    this.setState({username: event.target.value});
  }
  onPassChange(event) {
    this.setState({password: event.target.value});
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

      this.setState({
        isFetchingToken: false,
        loginError: 'Authentication Connection Failed'
      })
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
  makeLoginRequest(username, password) {
    // Change to look up on the user table.
    let lookupUsername = username
    let lookupPassword = password
    let usersTable = usersList.objects('Users_List')
    let matchUsernameBuild = 'userName CONTAINS "' + lookupUsername + '"'
    let matchedUser = usersList.filtered(matchUsernameBuild)
    let userToken = ''

    // if credentials match make token request
    if(matchedUser[0].userPassword === password) {
      // save token to active user database and navigate to home page.
      userToken = this.activeUserCall(matchedUser[0])
      if(userToken != '' || userToken != null) {
        try {
          activeUser.write(() => {
            activeUser.create('Active_User', {
              userId: matchedUser.userId,
              userName: matchedUser.userName,
              userToken: userToken,
              tokenExpiration:"FIGURE OUT TIMING",
              syncAddress:"Get From CONFIG Logic",
              //Any other config variables for organization
            })
          })
          navigation.navigate('Home')
        }
        catch (e) {
          console.log("Error on active user creation");
          this.setState({
            loginError: "Login Error: " + e
          })
        }
      }
    }
  }
  render() {
    let isLoggedIn = activeUser.objects('Active_Users')
    if(isLoggedIn.length > 0) {
      navigation.navigate('Home')
    }
    else {
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
              <Text style={styles.loginLabel}>Username</Text>
              <TextInput value={this.state.username}
                onFocus={() => this.onEmailFocusChange()}
                onBlur={() => this.onEmailFocusChange()}
                onChange={this.onUserChange}
                autoCorrect={false}
                style={this.state.emailHasFocus ? styles.textInputFocus : styles.textInput}
                />
            </View>
            <View style={styles.loginRow}>
              <Text style={styles.loginLabel}>Password</Text>
              <TextInput value={this.state.password}
              onFocus={() => this.onPassFocusChange()}
              onBlur={() => this.onPassFocusChange()}
              onChange={this.onPassChange}
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
                onPress={() => this.makeLoginRequest(this.state.username, this.state.password)}>
                <Text style={styles.loginButtonText}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      );
    }
  }
}

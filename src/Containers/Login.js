import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import LoginLogo from '../Images/insysivLogo.jpg'
import UserData from '../dummyData/login.json'

import styles from '../Styles/ContainerStyles.js'


export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      emailHasFocus: false,
      passHasFocus: false,
      username: '',
      password: '',
    }
    this.onUserChange = this.onUserChange.bind(this)
    this.onPassChange = this.onPassChange.bind(this)
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
  makeLoginRequest() {
    let userResponse = {}
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/login')
    //test server call
    return fetch('https://insysivtestapi.herokuapp.com/insysiv/api/v1.0/login')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      userResponse = responseJson.user;
      this.props.navigation.navigate('Home', {
        userInformation: userResponse
      })
    })
    .catch((error) => {
      console.log(error)
      console.error(error);
    });
  }
  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
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
              onPress={() => this.makeLoginRequest()}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

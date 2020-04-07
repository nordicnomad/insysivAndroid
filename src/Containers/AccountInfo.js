import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import GateData from '../dummyData/gates.json'

import styles from '../Styles/ContainerStyles.js'

export default class AccountInfo extends Component {
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
                navigation.navigate('Login')
              }>
              <Icon name="sign-out" size={30} color="#102541" />
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
            <Text style={styles.titleText}>Account Information</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.bodyText}>
              <Text style={styles.bodyTextLabel}>Current User: </Text>
              TroyJNorris
            </Text>
            <View style={styles.accountCenterWrapper}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.loginButton}
                  activeOpacity={0.6}
                  onPress={() =>
                  this.props.navigation.navigate('Login')
                }>
                  <Text style={styles.loginButtonText}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.bodyTextHeading}>System Information</Text>
            <Text style={styles.bodyText}>
              <Text style={styles.bodyTextLabel}>System Version: </Text>
              1.10
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.bodyTextLabel}>Host Account: </Text>
              St Luke's Health System
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.bodyTextHeading}>Customer Service</Text>
            <Text style={styles.bodyText}>
              <Text style={styles.bodyTextLabel}>Phone: </Text>
              888-888-8888
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.bodyTextLabel}>Email: </Text>
              Troy.Norris@insysiv.com
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import SubscriptionData from '../dummyData/subscriptions.json'

import styles from '../Styles/ContainerStyles.js'


export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subscriptions: [],
      userInformation: {
        id: "",
        username: "",
        email: "",
        isActive: false,
        organization: {
          id: "",
          name: "",
          street: "",
          city: "",
          state: "",
          postal: ""
        }
      }
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
  getSubscriptionData() {
    let subscriptionResponse = {}
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/subscriptions')
    //test server call
    return fetch('https://insysivtestapi.herokuapp.com/insysiv/api/v1.0/subscriptions')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      subscriptionResponse = responseJson.subscriptions;
      this.setState({
        subscriptions: subscriptionResponse,
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }
  componentDidMount() {
    let userInformation = this.props.navigation.getParam('userInformation')
    this.setState({
      userInformation: userInformation
    })
    this.getSubscriptionData()
  }
  renderSubscriptions() {
    let userSubscriptions = this.state.subscriptions.subscriptions
    let outputSubscriptions = []
    if(userSubscriptions != undefined) {
      userSubscriptions.forEach(function(subscription, index) {
        if(subscription.isActive === true) {
          outputSubscriptions.push(
            <View key={"sa"+subscription.id} style={styles.menuItem}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() =>
                  this.props.navigation.navigate(subscription.route, {
                    userInformation: this.state.userInformation
                  })
                }>
                <View style={styles.menuButtonContents}>
                  <Icon style={styles.menuButtonIcon} name={subscription.icon} size={45} color="#333" />
                  <Text style={styles.menuButtonText}>{subscription.label}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        }
        else {
          outputSubscriptions.push(
            <View key={"cs"+subscription.id} style={styles.menuItem}>
              <TouchableOpacity
                style={styles.menuButtonDisabled}
                onPress={() => alert('Subscription not currently activated. If you believe this to be in error, please contact support.')}>
                <View style={styles.menuButtonContents}>
                  <Icon style={styles.menuButtonIconDisabled} name={subscription.icon} size={45} color="#aaa" />
                  <Text style={styles.menuButtonTextDisabled}>{subscription.label}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        }

      }.bind(this))
    }


    return outputSubscriptions
  }
  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>{this.state.userInformation.organization.name}</Text>
          </View>
          <View style={styles.menuRow}>
            {this.renderSubscriptions()}
          </View>
        </View>
      </ScrollView>
    );
  }
}

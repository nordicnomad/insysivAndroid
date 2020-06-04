import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, Picker, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import ReportReconcileItem from '../Components/ReportReconcileItem'

import styles from '../Styles/ContainerStyles.js'

export default class ReportReconcile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedValue: 0,
      gates: [],
      reportDate: "03/13/2020",
      trashUnreconciled: {
        dateOfReconcile: "",
        trashUnassignedItems: []
      }
    }
  }
  componentDidMount() {
    this.getTrashUnreconciledData()
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
  escalateItem = (itemName, index) => {
    alert("Flag "+itemName +" for evaluation by someone with higher access.")
  }
  assignItem = (itemName) => {
    alert("Assign "+itemName +" to case number.")
  }
  renderReconcileItems() {
    let reconcileOutput = []
    let reconcileItems = this.state.trashUnreconciled.trashUnassignedItems

    reconcileItems.forEach(function(item, index) {
      reconcileOutput.push(
        <ReportReconcileItem
          key={"TUI"+index}
          manufacturer={item.manufacturer}
          model={item.model}
          selectedCaseId={item.selectedCaseId}
          dateUnassigned={item.dateUnassigned}
          cases={item.cases}
          name={item.name}
          escalateFunction={() => this.escalateItem(item.name, index)}
          assignFunction={() => this.assignItem(item.name)}
          />
      )
    }.bind(this))
    return(reconcileOutput)
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
                <Icon style={styles.dateSelectIcons} name="angle-left" size={26} color="#102541" />
              </View>
              <View styles={styles.majorColumn}>
                <Text style={styles.bodyTextHeading}>{this.state.trashUnreconciled.dateOfReconcile}</Text>
              </View>
              <View style={styles.minorColumn}>
                <Icon style={styles.dateSelectIcons} name="angle-right" size={26} color="#102541" />
              </View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.bodyTextLabel}><Text style={styles.bodyTextHeading}>{this.state.trashUnreconciled.trashUnassignedItems.length}</Text> Items</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.bodyTextLabelRight}>Appearance</Text>
              </View>
            </View>
            {this.renderReconcileItems()}

          </View>
        </View>
      </ScrollView>
    );
  }
}

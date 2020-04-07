import React, {Fragment, Component} from 'react';
import RFIDScanner, { RFIDScannerEvent } from 'react-native-zebra-rfid';
import {
  AppRegistry,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  Image,
  TouchableOpacity
} from 'react-native';
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import Icon from 'react-native-vector-icons/FontAwesome'
import TagData from '../dummyData/expectedTags.json'

import styles from '../Styles/ContainerStyles.js'


export default class InventoryScan extends Component{
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

  constructor(props){
    super(props);
    this.state = {
      displayStatus: 0,
      expectedTags: [],
      expectedTagIds: [],
      identifiedTags: [],
      selectedGate: '',
      scanTestCount: 0,
    }

    // Init and connect
    console.log("WHAT THIS RFID SCANNER ACTUALLY IS INITIALLY")
    console.log(RFIDScanner)
    // Register callback
    RFIDScanner.init();
    RFIDScanner.on(RFIDScannerEvent.TAGS, this.onRfidResult);

  }

  componentDidMount() {
    let gateName = this.props.navigation.getParam('selectedGate')

    this.getExpectedTags(gateName)

    this.setState({
      selectedGate: gateName,
    })
  }

  getExpectedTags(gate) {
    let arrayofGateTags = []
    let outputExpectedTags = []
    let outputExpectedTagIds = []
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/tags')
    //test server call
    return fetch('https://insysivtestapi.herokuapp.com/insysiv/api/v1.0/tags')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      arrayofGateTags = responseJson.tags;
      if(arrayofGateTags != undefined && arrayofGateTags != null) {
        outputExpectedTags = arrayofGateTags[gate]
      }
      outputExpectedTags.forEach(function(exTag, index) {
        outputExpectedTagIds.push(exTag.tagId)
      })
      this.setState({
        expectedTags: outputExpectedTags,
        expectedTagIds: outputExpectedTagIds
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  updateTabControl = (tab) => {
    this.setState({
      displayStatus: tab
    })
  }

  testScan = (scan) => {
    //Test callback of scanner
    let testTags = ['000000000004C578', '000000000004BC73', '0000000000049B97', '000000000004DD5C', '000000000004A802', '000000000004DD9C', '000000000004DF99']
    let outputTestTag = []
    outputTestTag.push(testTags[scan])
    this.onRfidResult(outputTestTag)
    this.setState({
      scanTestCount: scan+1
    })
  }

  onRfidResult = (tags) => {
    console.log('RFID RESULT HAS RUN')
    console.log(tags)
    //receives scanned tags
    let expectedTags = this.state.expectedTags
    let existingTags = this.state.identifiedTags
    let expectedIds = this.state.expectedTagIds
    let newScannedTags = []
    let unexpectedIds = []
    //adds non-duplicates to search array
    tags.forEach(function(tag) {
      if(!existingTags.includes(tag)) {
        existingTags.push(tag)
        newScannedTags.push(tag)
      }
      if(!expectedIds.includes(tag)) {
        unexpectedIds.push(tag)
      }
    })
    //saves search array to state
    this.setState({
      identifiedTags: existingTags
    })
    //checks expected tags for match
    expectedTags.forEach(function(tag, index) {
      //if match update to matched status
      if(tag.status != "matched") {
        if(newScannedTags.includes(tag.tagId)) {
          tag.status = "matched"
        }
      }
    })
    unexpectedIds.forEach(function(unexTag, index) {
      expectedTags.push(
        {
        "tagId": unexTag,
        "status": "unexpected",
        }
      )
    })

    //save temporary expected array updates
    this.setState({
      expectedTags: expectedTags
    })
  }

  renderIdentifiedTags() {
    let expectedTags = this.state.expectedTags
    let tagsOutput = []

    if(expectedTags != undefined && expectedTags.length > 0) {
      expectedTags.forEach(function(tag, index) {
        if(tag.status === 'matched') {
          if(this.state.displayStatus === 0 || this.state.displayStatus === 1) {
            tagsOutput.push(
              <View key={'to' + index} style={styles.tagItem}>
                <View style={styles.tagRow}>
                  <Text style={styles.tagMatchedTitle}>{tag.tagId}</Text>
                  <Text style={styles.tagGateText}>Gate {tag.gate}</Text>
                </View>
                <View style={styles.tagRow}>
                  <Text style={styles.tagDescription}>{tag.tagName}</Text>
                </View>
              </View>
            )
          }
        }
        else if (tag.status === 'missing') {
          if(this.state.displayStatus === 0 || this.state.displayStatus === 2) {
            tagsOutput.push(
              <View key={'to' + index} style={styles.tagItem}>
                <View style={styles.tagRow}>
                  <Text style={styles.tagMissingTitle}>{tag.tagId}</Text>
                  <Text style={styles.tagGateText}>Gate {tag.gate}</Text>
                </View>
                <View style={styles.tagRow}>
                  <Text style={styles.tagDescription}>{tag.tagName}</Text>
                </View>
              </View>
            )
          }
        }
        else {
          if(this.state.displayStatus === 0 || this.state.displayStatus === 3) {
            tagsOutput.push(
              <View key={'to' + index} style={styles.tagItem}>
                <View style={styles.tagRow}>
                  <Text style={styles.tagUnexpectedTitle}>{tag.tagId}</Text>
                  <Text style={styles.tagGateText}>{tag.gate}</Text>
                </View>
                <View style={styles.tagRow}>
                  <Text style={styles.tagDescription}>Unknown Item</Text>
                </View>
              </View>
            )
          }
        }
      }.bind(this))
    }

    if(tagsOutput.length < 1) {
      tagsOutput.push(
        <View key={'to' + 0}>
          <Text>There is no data in this search</Text>
        </View>
      )
    }

    return(tagsOutput)
  }

  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
       <View style={styles.container}>
         <View style={styles.titleRow}>
           <Text style={styles.titleText}>Tag Scanning</Text>
         </View>
         <View style={styles.gateRow}>
          <Text style={styles.selectedGateText}>Current Gate: <Text style={styles.selectedGateTextText}>{this.state.selectedGate}</Text></Text>
         </View>
         {/*<View style={styles.gateRow}>
          <TouchableOpacity onPress={() => this.testScan(this.state.scanTestCount)}>
            <Text>Test Scan</Text>
          </TouchableOpacity>
         </View>*/}
         <View style={styles.tabControlRow}>
           <View style={styles.tabControlColumn}>
             <TouchableOpacity style={this.state.displayStatus === 0 ? styles.tabControlButtonActive : styles.tabControlButton} onPress={() => this.updateTabControl(0)}>
               <Text style={this.state.displayStatus === 0 ? styles.tabControlButtonTextActive : styles.tabControlButtonText}>All Tags</Text>
             </TouchableOpacity>
           </View>
          <View style={styles.tabControlColumn}>
            <TouchableOpacity style={this.state.displayStatus === 1 ? styles.tabControlButtonActive : styles.tabControlButton} onPress={() => this.updateTabControl(1)}>
              <Text style={this.state.displayStatus === 1 ? styles.tabControlButtonTextActive : styles.tabControlButtonText}>Matched</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tabControlColumn}>
            <TouchableOpacity style={this.state.displayStatus === 2 ? styles.tabControlButtonActive : styles.tabControlButton} onPress={() => this.updateTabControl(2)}>
              <Text style={this.state.displayStatus === 2 ? styles.tabControlButtonTextActive : styles.tabControlButtonText}>Missing</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tabControlColumn}>
            <TouchableOpacity style={this.state.displayStatus === 3 ? styles.tabControlButtonActive : styles.tabControlButton} onPress={() => this.updateTabControl(3)}>
              <Text style={this.state.displayStatus === 3 ? styles.tabControlButtonTextActive : styles.tabControlButtonText}>Unexpected</Text>
            </TouchableOpacity>
          </View>
         </View>
         <View style={styles.sectionContainer}>
           {this.renderIdentifiedTags()}
         </View>
       </View>
     </ScrollView>
   );
 }
}

AppRegistry.registerComponent('InventoryScan', () => InventoryScan);

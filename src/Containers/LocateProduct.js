import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.jpg'

import SoundPlayer from 'react-native-sound-player'
import RFIDScanner, { RFIDScannerEvent } from 'react-native-zebra-rfid';

import styles from '../Styles/ContainerStyles.js'

let onRfidResult = {}
//_onFinishedPlayingSubscription = null

export default class LocateProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lookupRFID: "",
      matchRFID: "",
      scannedTags: [],
      totalCount: 0,
      scanResultsObjectArray: [],
      systemMessage: '',
    }
    RFIDScanner.init();
    RFIDScanner.on(RFIDScannerEvent.TAGS, this.CompareScanToTarget);
  }
  //componentDidMount() {
  //  _onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
  //    this.setState({
  //      loopCount: (this.state.loopCount - 1),
  //    })
  //    this.checkLoopActivity(success);
  //  })
  //}
  componentWillUnmount() {
  //  _onFinishedPlayingSubscription.remove();
    RFIDScanner.removeon(RFIDScannerEvent.TAGS, this.CompareScanToTarget);
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

  CompareScanToTarget = (tags) => {
    let hitCount = tags.length
    let totalCount = this.state.totalCount
    let matchCount = 0
    let foundBool = false
    let scanResults = this.state.scanResultsObjectArray
    let greyCount = 0
    let blueCount = 0
    let scannedTags = this.state.scannedTags
    let systemMessage = ''

    scannedTags.push(tags)

    tags.forEach((tag, i) => {
      if(tag === this.state.matchRFID) {
        foundBool = true
        matchCount = matchCount + 1
      }
    });

    switch(true) {
      case (hitCount > 8):
        greyCount = 5
        break;
      case (hitCount > 6):
        greyCount = 4
        break;
      case (hitCount > 4):
        greyCount = 3
        break;
      case (hitCount > 2):
        greyCount = 2
        break;
      case (hitCount > 0):
        greyCount = 1
        break;
    }

    switch(true) {
      case (matchCount >= 5):
        blueCount = 5
        break;
      case (matchCount >= 4):
        blueCount = 4
        break;
      case (matchCount >= 3):
        blueCount = 3
        break;
      case (matchCount >= 2):
        blueCount = 2
        break;
      case (matchCount >= 1):
        blueCount = 1
        break;
      default:
        blueCount = 0
    }

    scanResults.push(
      {
        count: hitCount,
        blue: blueCount,
        grey: greyCount,
      }
    )

    if(foundBool === true) {
      SoundPlayer.playSoundFile('locatedproductping', 'mp3')
      systemMessage = "RFID Tag Detected!"
      this.setState({
        totalCount: matchCount + totalCount,
        loopCount: hitCount,
        scanResultsObjectArray: scanResults,
        scannedTags: scannedTags,
        systemMessage: systemMessage,
      })
    }
    else {
      this.setState({
        totalCount: matchCount + totalCount,
        loopCount: hitCount,
        scanResultsObjectArray: scanResults,
        scannedTags: scannedTags
      })
    }
  }

  checkLoopActivity = (success) => {
    //This function might go away now that sound isn't looping.
    let playLoopCount = this.state.loopCount
    if(success === true) {
      if(playLoopCount >= 1) {
        try {
          SoundPlayer.playSoundFile('productlocated', 'wav')
          this.setState({
            loopCount: (playLoopCount - 1),
            systemMessage: "Match Found",
          })
        } catch (e) {
            this.setState({
              systemMessage: "Sound File Did Not Play.",
            })
            console.log(`cannot play the sound file`, e)
        }
      }
    }
  }

  setRFIDNumber = (fieldInput) => {
    console.log("SETRFIDNUMBER CALLED")
    let formValue = fieldInput
    let idLength = formValue.length
    let concatRemainder = 16 - idLength
    let concatValue = ''
    let concatError = false
    let outputMatchRFID = ''
    let systemMessageOutput = ''

    switch(concatRemainder) {
      case 0:
        concatValue = ''
        concatError = false
        break;
      case 1:
        concatValue = '0'
        concatError = false
        break;
      case 2:
        concatValue = '00'
        concatError = false
        break;
      case 3:
        concatValue = '000'
        concatError = false
        break;
      case 4:
        concatValue = '0000'
        concatError = false
        break;
      case 5:
        concatValue = '00000'
        concatError = false
        break;
      case 6:
        concatValue = '000000'
        concatError = false
        break;
      case 7:
        concatValue = '0000000'
        concatError = false
        break;
      case 8:
        concatValue = '00000000'
        concatError = false
        break;
      case 9:
        concatValue = '000000000'
        concatError = false
        break;
      case 10:
        concatValue = '0000000000'
        concatError = false
        break;
      case 11:
        concatValue = '00000000000'
        concatError = false
        break;
      case 12:
        concatValue = '000000000000'
        concatError = false
        break;
      case 13:
        concatValue = '0000000000000'
        concatError = false
        break;
      case 14:
        concatValue = '00000000000000'
        concatError = false
        break;
      case 15:
        concatValue = '000000000000000'
        concatError = false
        break;
      case 16:
        concatValue = '0000000000000000'
        concatError = false
        break;
      default:
        concatValue = ''
        concatError = true
        break;
    }
    if(concatError === false) {
      outputMatchRFID = concatValue + formValue
      systemMessageOutput = "ID set successfully"
    }
    else {
      outputMatchRFID = null
      systemMessageOutput = "ID set Error"
    }
    this.setState({
      matchRFID: outputMatchRFID,
      systemMessage: systemMessageOutput
    })
  }

  resetRFIDLocator = () => {
    this.setState({
      lookupRFID: "",
      scanResultsObjectArray: [],
      matchRFID: "",
      totalCount: 0,
      systemMessage: '',
    })
  }

  resetRFIDCount = () => {
    this.setState({
      scanResultsObjectArray: [],
      totalCount: 0,
      systemMessage: 'Count Reset',
    })
  }

  renderScanBars(bluesAmount, greysAmount, columnNumber) {
    let blues = bluesAmount
    let greys = greysAmount
    let scanBarOutput = []

    for(i = 0; i < 5; i++) {
      if(blues >= i + 1) {
        scanBarOutput.unshift(
          <View key={"sb" + columnNumber + i} style={styles.locationReadoutMatchBar}></View>
        )
      }
      else if(greys >= i + 1) {
        scanBarOutput.unshift(
          <View key={"sb" + columnNumber + i} style={styles.locationReadoutNoMatchBar}></View>
        )
      }
      else {
        scanBarOutput.unshift(
          <View key={"sb" + columnNumber + i} style={styles.locationReadoutNoDataBar}></View>
        )
      }
    }

    return(scanBarOutput)
  }

  renderSearchColumns() {
    let scanResultsArray = this.state.scanResultsObjectArray
    let scanResultsOutput = []
    if(scanResultsArray.length < 1) {
      scanResultsOutput.push(
        <View key={"scnd"} style={styles.noScanWrapper}>
          <Text style={styles.noScanText}>Pull and Release Trigger</Text>
          <Text style={styles.noScanText}>on Sled to Scan for Tag.</Text>
        </View>
      )
    }
    else {
      scanResultsArray.forEach((scan, i) => {
        scanResultsOutput.unshift(
          <View key={"sc" + i} style={styles.locationReadoutColumn}>
            {this.renderScanBars(scan.blue, scan.grey, i)}
          </View>
        )
      });
    }

    return(scanResultsOutput)
  }

  renderScanObjects(scanObjectArray) {
    let arrayToRender = scanObjectArray
    let outputRender = []

    arrayToRender.forEach((objects, i) => {
      outputRender.push(
        <View>
          <Text>- - - - - - - -</Text>
          <Text>{objects.count}</Text>
          <Text>{objects.grey}</Text>
          <Text>{objects.blue}</Text>
        </View>
      )
    });

    return(outputRender)
  }

  renderTagsTest(testTags) {
    let tagsToRender = testTags
    let outputElements = []
    outputElements.push(<Text>{'['}</Text>)
    tagsToRender.forEach((tagarray, i) => {
      outputElements.push(<Text>{'['}</Text>)
      tagarray.forEach((tag, i) => {
        outputElements.push(<Text>{tag + ','}</Text>)
      });
      outputElements.push(<Text>{']'}</Text>)
    });
    outputElements.push(<Text>{']'}</Text>)

    return(outputElements)
  }

  renderLocatorView(rfidstring) {
    let rfidValue = rfidstring

    if(rfidValue != '') {
      return(
        <View style={styles.sectionContainer}>
          <View style={styles.locationContainer}>
            <View style={styles.pingMessagesContainer}>
              <TouchableOpacity onPress={() => this.resetRFIDLocator()}>
                <Text style={styles.locationBodyTextLabel}>Searching for Tag ID: <Text style={styles.locationIDLabel}>{this.state.matchRFID}</Text></Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal={true} style={styles.locationReadoutContainer}>
              <View style={styles.locationReadoutRow}>
                {this.renderSearchColumns()}
              </View>
            </ScrollView>
          </View>
          <View style={styles.locationContainer}>
            <Text style={styles.bodyMessageText}>{this.state.systemMessage}</Text>
          </View>
          <View style={styles.locationContainer}>

            <View style={styles.pingIndicationContainer}>
              <TouchableOpacity onPress={() => this.resetRFIDCount()}>
                <View style={(this.state.totalCount > 0) ? styles.pingIndicationWrapperActive : styles.pingIndicationWrapper}>
                  <Text style={styles.pingIndicationCount}>{this.state.totalCount}</Text>
                  <Text style={styles.pingIndicationLabel}>RFID Match Pings</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }
    else {
      return(
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>Locate Product</Text>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.shadedBackgroundWrapper}>
              <Text style={styles.bodyTextLabel}>Set Search RFID ID Number</Text>
              <View style={styles.majorMinorRow}>
                <View style={styles.majorColumn}>
                  <TextInput style={styles.formInput} onChangeText={value => this.setState({lookupRFID: value})} autoCapitalize="characters" />
                </View>

                <View style={styles.mediumColumn}>
                  <TouchableOpacity style={styles.submitButton} onPress={() => this.setRFIDNumber(this.state.lookupRFID)}>
                    <Text style={styles.submitButtonText}>Set</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text>Set Insysiv RFID ID to search for above value, while this device is connected to the RFID wand. </Text>
                <Text>Pull and release the wand trigger and move around the room. RFID signals matching the set ID will beep to help you locate the desired item.</Text>
              </View>
            </View>
          </View>
        </View>
      )
    }
  }

  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        {this.renderLocatorView(this.state.matchRFID)}
      </ScrollView>
    );
  }
}

import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.jpg'

import SoundPlayer from 'react-native-sound-player'
import RFIDScanner, { RFIDScannerEvent } from 'react-native-zebra-rfid';

import styles from '../Styles/ContainerStyles.js'

let onRfidResult = {}
_onFinishedPlayingSubscription = null

export default class LocateProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lookupRFID: "",
      scannedTags: [],
      matchRFID: "",
      currentMatchCount: 0,
      loopCount: 0,
      idIsSet: false,
      wasSetError: false,
      wasScannerError: false,
      systemMessage: '',
    }
    RFIDScanner.init();
    RFIDScanner.on(RFIDScannerEvent.TAGS, this.CompareScanToTarget);
  }
  componentDidMount() {
    _onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
      this.setState({
        loopCount: (this.state.loopCount - 1),
      })
      this.checkLoopActivity(success);
    })
  }
  componentWillUnmount() {
    _onFinishedPlayingSubscription.remove();
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
    let hitCount = this.state.loopCount
    let matchCount = this.state.currentMatchCount
    let foundBool = false


    tags.forEach((tag, i) => {
      if(tag === this.state.matchRFID) {
        foundBool = true
      }
    });
    if(foundBool === true) {
      hitCount = hitCount + 1
      matchCount = matchCount + 1
      SoundPlayer.playSoundFile('locatedproductping', 'mp3')
      this.setState({
        currentMatchCount: matchCount,
        loopCount: hitCount
      })
    }
  }

  checkLoopActivity = (success) => {
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
      scannedTags: [],
      matchRFID: "",
      currentMatchCount: 0,
      idIsSet: false,
      wasSetError: false,
      wasScannerError: false,
      systemMessage: '',
    })
  }

  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
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
          <View style={styles.sectionContainer}>
            <Text style={styles.bodyTextLabel}>{this.state.systemMessage}</Text>
            <Text style={styles.bodyTextLabel}>RFID Match Pings: {this.state.currentMatchCount}</Text>
            <Text style={styles.bodyTextLabel}>{this.state.matchRFID}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

import React, {Component} from 'react';
import { StyleSheet, Text, View, NetInfo, TouchableOpacity, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

import styles from '../Styles/ComponentStyles.js'

export default class OfflineBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  CheckConnectivity = () => {
    // For Android devices
    console.log("CHECK CONNECTION BUTTON PRESSED")
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        Alert.alert("You are online!");
        console.log("HAS CONNECTION")
      } else {
        Alert.alert("You are offline!");
        console.log("NO CONNECTION")
      }
    });

  };

  render() {
    if(this.props.showBanner === false) {
      return(
        <View style={styles.bannerBackgroundContainer}>
          <View style={styles.bannerRow}>
            <View style={styles.bannerIconColumn}>
              <TouchableOpacity onClick={this.CheckConnectivity}>
                <Icon key={"wifi"} style={styles.connectionStatusIcon} name={"wifi"} size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.bannerTextColumn}>
              <Text style={styles.noConnectionText}>
                Device not connected to a wireless network.
              </Text>
              <Text style={styles.noConnectionText}>
                Some functionality may be limited.
              </Text>
            </View>
          </View>
        </View>
      )
    }
    else {
      return(
        <View></View>
      )
    }
  }

}

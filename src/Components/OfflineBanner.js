import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

import styles from '../Styles/ComponentStyles.js'

export default class OfflineBanner extends Component {

  render() {
    if(this.props.showBanner === false) {
      return(
        <View style={styles.bannerBackgroundContainer}>
          <View style={styles.bannerRow}>
            <View style={styles.bannerIconColumn}>
              <Icon key={"wifi"} style={styles.connectionStatusIcon} name={"wifi"} size={24} color="#fff" />
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

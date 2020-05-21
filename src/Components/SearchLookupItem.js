import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

import styles from '../Styles/ContainerStyles.js'

export default class SearchLookupItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trayState: false
    }
  }

  ToggleDetailTray() {
    let indexTrayState = this.state.trayState
    if(indexTrayState === false) {
      this.setState({
        trayState: true
      })
    }
    else {
      this.setState({
        trayState: false
      })
    }
  }

  RenderTrayItemContent() {
    if(this.props.unknownFlag) {
      return(
        <View style={styles.productListItem}>
          <TouchableOpacity onPress={() => this.ToggleDetailTray()}>
            <Text style={styles.activeProductListHeading}>Search Result Name</Text>
          </TouchableOpacity>
          <View style={this.state.trayState === true ? styles.activeListTray : styles.inactiveListTray}>
            <View style={styles.straightRow}>
              <Text style={styles.bodyTextLabel}>Product Detail</Text>
            </View>
            <View style={styles.majorMinorRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Model: </Text>
                <Text style={styles.trayLabel}>Lot / Serial: </Text>
                <Text style={styles.trayLabel}>Quantity on Hand: </Text>
                <Text style={styles.trayLabel}>Quantity on Order: </Text>
                <Text style={styles.trayLabel}>Manufacturer: </Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>LA6518Q</Text>
                <Text style={styles.trayText}>123445</Text>
                <Text style={styles.trayText}>0</Text>
                <Text style={styles.trayText}>500</Text>
                <Text style={styles.trayText}>Medtronic</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <View style={styles.miniSubmitWrapper}>
                  <TouchableOpacity style={styles.miniSubmitButton}>
                    <Text style={styles.miniSubmitButtonText}>Locate</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.equalColumn}>
                <View style={styles.miniSubmitWrapper}>
                  <TouchableOpacity style={styles.miniSubmitButton}>
                    <Text style={styles.miniSubmitButtonText}>FDA Lookup</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      )
    }
    else {
      return(
        <View style={styles.productListItem}>
          <View style={styles.majorMinorRow}>
            <View style={styles.majorColumn}>
              <TouchableOpacity onPress={() => this.ToggleDetailTray()}>
                <Text style={styles.productListHeading}>{this.props.itemName}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.minorColumn}>

              <TouchableOpacity onPress={() => this.props.adjustmentFunction()}>
                <Text style={styles.countTextNumber}>
                  {this.props.itemCount}
                </Text>
              </TouchableOpacity>

            </View>
          </View>
          <View style={this.state.trayState === true ? styles.activeListTray : styles.inactiveListTray}>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Model Number</Text>
                <Text style={styles.trayLabel}>Lot / Serial Number</Text>
                <Text style={styles.trayLabel}>Expiration Date</Text>
              </View>
              <View style={styles.equalColumn}>
              <Text style={styles.trayText}>{this.props.itemModel}</Text>
              <Text style={styles.trayText}>{this.props.itemSerial}</Text>
              <Text style={styles.trayText}>{this.props.itemExpiration}</Text>
                <View style={styles.miniSubmitWrapper}>
                  <TouchableOpacity style={styles.miniSubmitButton} onPress={this.props.removeFunction}>
                    <Text style={styles.miniSubmitButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      )
    }
  }

  render() {
    return (<View>{this.RenderTrayItemContent()}</View>);
  }
}

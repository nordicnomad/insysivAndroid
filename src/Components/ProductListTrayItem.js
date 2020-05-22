import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

import styles from '../Styles/ContainerStyles.js'

export default class ProductListTrayItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scanCount: 0,
      scannerStatus: 1,
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
          <View style={styles.majorMinorRow}>
            <View style={styles.majorColumn}>
              <TouchableOpacity onPress={() => this.ToggleDetailTray()}>
                <Text style={this.state.trayState === true ? styles.activeProductListHeading : styles.productListHeading}>Unknown Product</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.minorColumn}>
              <TouchableOpacity onPress={this.props.adjustmentFunction}>
                <Text style={styles.countTextNumberUnkown}>{this.props.itemCount}</Text>
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
    else {
      return(
        <View style={styles.productListItem}>
          <View style={styles.majorMinorRow}>
            <View style={styles.majorColumn}>
              <TouchableOpacity onPress={() => this.ToggleDetailTray()}>
                <Text style={this.state.trayState === true ? styles.activeProductListHeading : styles.productListHeading}>{this.props.itemName}</Text>
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

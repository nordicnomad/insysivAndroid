import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

import styles from '../Styles/ContainerStyles.js'

export default class CaseProductItem extends Component {
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
  renderStatusIcon(productFlag) {
    let iconStatus = productFlag
    let rfidIcon = "check-circle-o"
    let barcodeIcon = "barcode"
    let iconOutput = []
    if(iconStatus === true) {
      iconOutput.push(
          <Icon style={styles.productStatusIcon} name={rfidIcon} size={24} color="#333" />
      )
    }
    else {
      iconOutput.push(
          <Icon style={styles.productStatusIconInactive} name={barcodeIcon} size={24} color="#333" />
      )
    }
    return(iconOutput)
  }

  RenderTrayItemContent() {
    return(
      <View style={styles.productListItem}>
        <View style={styles.majorMinorRow}>
          <View style={styles.majorColumn}>
            <Text style={styles.productListHeading}>Product Name</Text>
          </View>
          <View style={styles.minorColumn}>
            {this.renderStatusIcon()}
          </View>
        </View>
        <View style={styles.activeListTray}>
          <View style={styles.trayItemWrapper}>
            <Text style={styles.trayText}>
              <Text style={styles.trayLabel}>Lot / Serial: </Text>
              990283409
            </Text>
            <Text style={styles.trayText}>
              <Text style={styles.trayLabel}>Model Number: </Text>
              G4FR4
            </Text>
            <Text style={styles.trayText}>
              <Text style={styles.trayLabel}>Time Scanned: </Text>
              2/20/2020 9:45 PM
            </Text>
          </View>
          <View style={styles.straightRow}>
            <View style={styles.equalColumn}>
              <TouchableOpacity style={styles.miniSubmitButton}>
                <Text style={styles.miniSubmitButtonText}>Waste</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.equalColumn}>
              <TouchableOpacity style={styles.miniSubmitButton}>
                <Text style={styles.miniSubmitButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

    )
  }

  render() {
    return (<View>{this.RenderTrayItemContent()}</View>);
  }
}

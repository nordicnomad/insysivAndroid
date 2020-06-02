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
          <Icon key={"iconRFID"} style={styles.productStatusIcon} name={rfidIcon} size={24} color="#333" />
      )
    }
    else {
      iconOutput.push(
          <Icon key={"iconBar"} style={styles.productStatusIconInactive} name={barcodeIcon} size={24} color="#333" />
      )
    }
    return(iconOutput)
  }

  RenderTrayItemContent() {
    return(
      <View style={styles.productListItem}>
        <View style={styles.majorMinorRow}>
          <View style={styles.majorColumn}>
            <TouchableOpacity onPress={() => this.ToggleDetailTray()}>
              <Text style={this.state.trayState === true ? styles.activeProductListHeading : styles.productListHeading}>{this.props.name}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.minorColumn}>
            {this.renderStatusIcon(this.props.scanned)}
          </View>
        </View>
        <View style={this.state.trayState ? styles.productListTray : styles.inactiveListTray}>
          <View style={styles.trayItemWrapper}>
            <Text style={styles.trayText}>
              <Text style={styles.trayLabel}>Lot / Serial: </Text>
              {this.props.lotSerial}
            </Text>
            <Text style={styles.trayText}>
              <Text style={styles.trayLabel}>Model Number: </Text>
              {this.props.model}
            </Text>
            <Text style={styles.trayText}>
              <Text style={styles.trayLabel}>Time Scanned: </Text>
              {this.props.scannedTime}
            </Text>
          </View>
          <View style={styles.straightRow}>
            <View style={styles.equalColumn}>
              <TouchableOpacity style={styles.miniSubmitButton} onPress={this.props.wasteFunction}>
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

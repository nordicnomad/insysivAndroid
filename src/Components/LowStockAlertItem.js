import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

import styles from '../Styles/ContainerStyles.js'

export default class LowStockAlertItem extends Component {
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
    return(
      <View style={styles.productListItem}>
        <View style={styles.majorMinorRow}>
          <View style={styles.majorColumn}>
            <TouchableOpacity onPress={() => this.ToggleDetailTray()}>
              <Text style={this.state.trayState === true ? styles.activeProductListHeading : styles.productListHeading}>{this.props.name}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.minorColumn}>
            <Text style={styles.countTextNumber}>
              {this.props.onHand}
            </Text>
          </View>
        </View>
        <View style={this.state.trayState === true ? styles.activeListTray : styles.inactiveListTray}>
          <View style={styles.straightRow}>
            <View style={styles.equalColumn}>
              <Text style={styles.trayLabel}>Model: </Text>
              <Text style={styles.trayLabel}>Lot / Serial: </Text>
              <Text style={styles.trayLabel}>Quantity on Hand: </Text>
              <Text style={styles.trayLabel}>Quantity on Order: </Text>
              <Text style={styles.trayLabel}>Manufacturer: </Text>
            </View>
            <View style={styles.equalColumn}>
              <Text style={styles.trayText}>{this.props.model}</Text>
              <Text style={styles.trayText}>{this.props.lotSerial}</Text>
              <Text style={styles.trayText}>{this.props.onHand}</Text>
              <Text style={styles.trayText}>{this.props.onOrder}</Text>
              <Text style={styles.trayText}>{this.props.manufacturer}</Text>
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

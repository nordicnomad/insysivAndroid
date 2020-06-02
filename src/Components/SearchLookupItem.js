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
          <View style={styles.majorMinorRow}>
            <View style={styles.majorColumn}>
              <TouchableOpacity onPress={() => this.ToggleDetailTray()}>
                <Text style={this.state.trayState ? styles.activeProductListHeading : styles.productListHeading}>{this.props.name}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={this.state.trayState === true ? styles.productListTray : styles.inactiveListTray}>
            <Text style={styles.bodyTextLabel}>Product Detail</Text>
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
                <Text style={styles.trayText}>{this.props.lotSerials[0].lotSerial}</Text>
                <Text style={styles.trayText}>{this.props.onHand}</Text>
                <Text style={styles.trayText}>{this.props.onOrder}</Text>
                <Text style={styles.trayText}>{this.props.manufacturer}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <View style={styles.miniSubmitWrapper}>
                  <TouchableOpacity style={styles.miniSubmitButton} onPress={this.props.locateFunction}>
                    <Text style={styles.miniSubmitButtonText}>Locate</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.equalColumn}>
                <View style={styles.miniSubmitWrapper}>
                  <TouchableOpacity style={styles.miniSubmitButton} onPress={this.props.lookupFunction}>
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
                <Text style={this.state.trayState ? styles.activeProductListHeading : styles.productListHeading}>{this.props.name}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={this.state.trayState === true ? styles.productListTray : styles.inactiveListTray}>
            <Text style={styles.bodyTextLabel}>Product Detail</Text>
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
                <Text style={styles.trayText}>{this.props.lotSerials[0].lotSerial}</Text>
                <Text style={styles.trayText}>{this.props.onHand}</Text>
                <Text style={styles.trayText}>{this.props.onOrder}</Text>
                <Text style={styles.trayText}>{this.props.manufacturer}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <View style={styles.miniSubmitWrapper}>
                  <TouchableOpacity style={styles.miniSubmitButton} onPress={this.props.locateFunction}>
                    {/*Connect to RFID Scanner for location*/}
                    <Text style={styles.miniSubmitButtonText}>Locate</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.equalColumn}>
                <View style={styles.miniSubmitWrapper}>
                  <TouchableOpacity style={styles.miniSubmitButton} onPress={this.props.lookupFunction}>
                    {/*Connect to an API to do the lookup and navigation*/}
                    <Text style={styles.miniSubmitButtonText}>FDA Lookup</Text>
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

import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

import styles from '../Styles/ContainerStyles.js'

export default class BackOrderItem extends Component {
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
      <View key={"BOM" + this.props.messageId} style={styles.productListItem}>
        <View style={styles.majorMinorRow}>
          <View style={styles.majorColumn}>
            <TouchableOpacity onPress={() => this.ToggleDetailTray()}>
              <Text style={this.state.trayState === true ? styles.activeProductListHeading : styles.productListHeading}>{this.props.messageName}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mediumColumn}>
            <Text style={styles.productListHeadingRight}>{this.props.backorderDate}</Text>
          </View>
        </View>
        <View style={this.state.trayState === true ? styles.productListTray : styles.inactiveListTray}>
          <Text style={styles.trayText}>{this.props.backorderText}</Text>
        </View>
      </View>
      
    )
  }

  render() {
    return (<View>{this.RenderTrayItemContent()}</View>);
  }
}

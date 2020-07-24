import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

import styles from '../Styles/ComponentStyles.js'

export default class AdjustQuantityModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputHasFocus: false
    }
  }

  render() {
    return (
      <View style={this.props.modalState ? this.styles.modalBackgroundContainer : this.styles.hideModal}>
        <View style={styles.modalInnerContainer}>
          <Text style={styles.modalTitleText}>{this.props.modalTitle}</Text>
          <View>
            <TextInput style={this.state.inputHasFocus ? this.styles.textInputFocus : this.styles.textInput} />
            <Text>Item quantity</Text>
            <View>
              <View></View>
              <View>
                <TouchableOpacity>Set Quantity</TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

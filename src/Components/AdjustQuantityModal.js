import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

import styles from '../Styles/ComponentStyles.js'

export default class AdjustQuantityModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputHasFocus: false,
      itemCount: null,
    }
  }

  render() {
    if(this.props.modalState === true) {
      console.log("MODAL OBJECT")
      console.log(this.props.modalObject)
      return (
        <View style={styles.modalBackgroundContainer}>
          <View style={styles.modalInnerContainer}>
            <View style={styles.modalTitleWrapper}>
              <Text style={styles.modalTitleText}>{this.props.modalObject.name}</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={this.props.closeModalFunction}><Text style={styles.modalCloseButtonText}>X</Text></TouchableOpacity>
            </View>
            <View>
              <TextInput style={this.state.inputHasFocus ? styles.textInputFocus : styles.textInput} keyboardType={"numeric"} value={this.state.itemCount} />
              <Text style={styles.modalInputLabel}>Item quantity</Text>
              <View style={styles.buttonRow}>
                <View style={styles.buttonColumn}></View>
                <View style={styles.buttonColumn}>
                  <TouchableOpacity style={styles.modalButton}><Text style={styles.modalButtonText}>Set Quantity</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }
    else {
      return(<View></View>)
    }
  }
}

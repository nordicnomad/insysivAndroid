import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

import styles from '../Styles/ContainerStyles.js'

export default class ReportReconcileItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trayState: false,
      showDetail: false,
      selectedCaseValue: 0,
      selectedCaseLabel: "Select an option..."
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
  toggleShowDetail() {
    let indexDetailState = this.state.showDetail
    if(indexDetailState === false) {
      this.setState({
        showDetail: true
      })
    }
    else {
      this.setState({
        showDetail: false
      })
    }
  }
  onCaseChange = (pickerValue) => {
    if(pickerValue > 0) {
      this.setState({selectedCaseValue: pickerValue, selectedCaseLabel: this.props.cases[pickerValue-1].caseName})
    }
    else {
      this.setState({selectedCaseValue: 0, selectedCaseLabel: "Select an option..."})
    }

  }
  RenderCasesOptions(cases) {
    let casesArray = cases
    let optionsOutput = []
    optionsOutput.push(
      <Picker.Item key={"case"+0} label='Select an option...' value='0' />
    )
    casesArray.forEach(function(caseItem, index) {
      optionsOutput.push(

        <Picker.Item key={"case"+index} label={caseItem.caseName + ' - ' + caseItem.caseNumber} value={index+1} />
      )
    })

    return(optionsOutput)
  }
  RenderMaterialsList(caseValue) {
    let materialsOutput = []

    if((caseValue - 1) > -1) {
      let materialsList = this.props.cases[caseValue - 1].materials
      materialsList.forEach(function(material, index) {
        materialsOutput.push(
          <View key={"MI"+index} style={styles.straightRow}>
            <View style={styles.majorColumn}>
              <Text style={styles.bodyText}>{material.materialName}</Text>
            </View>
            <View style={styles.minorColumn}>
              <Text style={styles.bodyText}>{material.materialQuantity}</Text>
            </View>
            <View style={styles.minorColumn}>
              <Text style={styles.bodyText}>{material.materialScanned}</Text>
            </View>
          </View>
        )
      })
    }

    if(materialsOutput.length <= 0) {
      materialsOutput.push(
        <Text key={"MI" + 0} style={styles.noDataText}>No Materials Listed for This Case</Text>
      )
    }
    return(materialsOutput)
  }
  renderInteractionButtons() {
    if(this.state.selectedCaseValue > 0) {
      return(
        <View>
          <View style={this.state.showDetail ? styles.productListTray : styles.inactiveListTray}>
            <View style={styles.straightRow}>
              <View style={styles.majorColumn}>
                <Text style={styles.bodyTextLabel}>Materials</Text>
              </View>
              <View style={styles.minorColumn}>
                <Text style={styles.bodyTextLabel}>Qty</Text>
              </View>
              <View style={styles.minorColumn}>
                <Text style={styles.bodyTextLabel}>Scan</Text>
              </View>
            </View>
            <View style={styles.trayListWrapper}>
              {this.RenderMaterialsList(this.state.selectedCaseValue)}
            </View>
          </View>
          <View style={styles.straightRow}>
            {this.renderViewDetailButton()}
            <View style={styles.equalColumn}>
              <TouchableOpacity style={styles.miniSubmitButton} onPress={this.props.escalateFunction}>
                <Text style={styles.miniSubmitButtonText}>Escalate</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.equalColumn}>
              <TouchableOpacity style={styles.miniSubmitButton} onPress={this.props.assignFunction}>
                <Text style={styles.miniSubmitButtonText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }
  }
  renderViewDetailButton = () => {
    if(this.state.showDetail === true) {
      return(
        <View style={styles.minorColumn}>
          <TouchableOpacity style={styles.miniSubmitButton} onPress={() => this.toggleShowDetail()}>
            <Text style={styles.miniSubmitButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else {
      return(
        <View style={styles.equalColumn}>
          <TouchableOpacity style={styles.miniSubmitButton} onPress={() => this.toggleShowDetail()}>
            <Text style={styles.miniSubmitButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  RenderTrayItemContent() {
      return(
        <View style={styles.productListItem}>
          <View style={styles.straightRow}>
            <View style={styles.majorColumn}>
              <TouchableOpacity onPress={() => this.ToggleDetailTray()}>
                <Text style={this.state.trayState ? styles.activeProductListHeading : styles.productListHeading}>{this.props.name}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mediumColumn}>
              <Text style={styles.productListHeadingRight}>{this.props.dateUnassigned}</Text>
            </View>
          </View>
          <View style={this.state.trayState ? styles.productListTray : styles.inactiveListTray}>
            <View style={styles.majorMinorRow}>
              <View style={styles.mediumColumn}>
                <Text style={styles.bodyTextLabel}>Assign to: </Text>
              </View>
              <View style={styles.majorColumn}>
                <View style={styles.formPickerWrapper}>
                  <Picker
                    selectedValue={this.state.selectedCaseValue}
                    onValueChange={this.onCaseChange}
                    style={styles.formPicker}>
                    {this.RenderCasesOptions(this.props.cases)}
                  </Picker>
                </View>
              </View>
            </View>
            {this.renderInteractionButtons()}
          </View>
        </View>
      )
  }

  render() {
    return (<View>{this.RenderTrayItemContent()}</View>);
  }
}

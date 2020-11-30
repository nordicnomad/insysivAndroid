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
    let renderAllObject = JSON.stringify(this.props.fullObject)
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
                <Text style={styles.trayLabel}>Barcode</Text>
                <Text style={styles.trayLabel}>Model Number</Text>
                <Text style={styles.trayLabel}>Lot / Serial</Text>
                <Text style={styles.trayLabel}>Expiration Date</Text>
                <Text style={styles.trayLabel}>License Number</Text>
                <Text style={styles.trayLabel}>Vendor</Text>
                <Text style={styles.trayLabel}>Auto Replace</Text>
                <Text style={styles.trayLabel}>Discontinued</Text>
                <Text style={styles.trayLabel}>Product Category</Text>
                <Text style={styles.trayLabel}>Hospital Number</Text>
                <Text style={styles.trayLabel}>Unit Of Measure</Text>
                <Text style={styles.trayLabel}>Unit Of Measure Quantity</Text>
                <Text style={styles.trayLabel}>Reorder Value</Text>
                <Text style={styles.trayLabel}>Quantity On Hand</Text>
                <Text style={styles.trayLabel}>Quantity Ordered</Text>
                <Text style={styles.trayLabel}>Last Requisition</Text>
                <Text style={styles.trayLabel}>Order Status</Text>
                <Text style={styles.trayLabel}>Active</Text>
                <Text style={styles.trayLabel}>Accepted</Text>
                <Text style={styles.trayLabel}>Consignment</Text>
                <Text style={styles.trayLabel}>Minimum Value</Text>
                <Text style={styles.trayLabel}>Maximum Value</Text>
                <Text style={styles.trayLabel}>Non Ordered</Text>
                <Text style={styles.trayLabel}>Product Note</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.itemBarcode}</Text>
                <Text style={styles.trayText}>{this.props.itemModel}</Text>
                <Text style={styles.trayText}>{this.props.itemSerial}</Text>
                <Text style={styles.trayText}>{this.props.itemExpiration}</Text>
                <Text style={styles.trayText}>{this.props.licenseNumber}</Text>
                <Text style={styles.trayText}>{this.props.orderThruVendor}</Text>
                <Text style={styles.trayText}>{this.props.autoReplace}</Text>
                <Text style={styles.trayText}>{this.props.discontinued}</Text>
                <Text style={styles.trayText}>{this.props.productCategory}</Text>
                <Text style={styles.trayText}>{this.props.hospitalItemNumber}</Text>
                <Text style={styles.trayText}>{this.props.unitOfMeasure}</Text>
                <Text style={styles.trayText}>{this.props.unitOfMeasureQuantity}</Text>
                <Text style={styles.trayText}>{this.props.reorderValue}</Text>
                <Text style={styles.trayText}>{this.props.quantityOnHand}</Text>
                <Text style={styles.trayText}>{this.props.quantityOrdered}</Text>
                <Text style={styles.trayText}>{this.props.lastRequistionNumber}</Text>
                <Text style={styles.trayText}>{this.props.orderStatus}</Text>
                <Text style={styles.trayText}>{this.props.active}</Text>
                <Text style={styles.trayText}>{this.props.accepted}</Text>
                <Text style={styles.trayText}>{this.props.consignment}</Text>
                <Text style={styles.trayText}>{this.props.minimumValue}</Text>
                <Text style={styles.trayText}>{this.props.maximumValue}</Text>
                <Text style={styles.trayText}>{this.props.nonOrdered}</Text>
                <Text style={styles.trayText}>{this.props.productNote}</Text>
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
                <Text style={styles.trayLabel}>Barcode</Text>
                <Text style={styles.trayLabel}>Model Number</Text>
                <Text style={styles.trayLabel}>Lot / Serial</Text>
                <Text style={styles.trayLabel}>Expiration Date</Text>
                <Text style={styles.trayLabel}>License Number</Text>
                <Text style={styles.trayLabel}>Vendor</Text>
                <Text style={styles.trayLabel}>Auto Replace</Text>
                <Text style={styles.trayLabel}>Discontinued</Text>
                <Text style={styles.trayLabel}>Product Category</Text>
                <Text style={styles.trayLabel}>Hospital Number</Text>
                <Text style={styles.trayLabel}>Unit Of Measure</Text>
                <Text style={styles.trayLabel}>Unit Of Measure Quantity</Text>
                <Text style={styles.trayLabel}>Reorder Value</Text>
                <Text style={styles.trayLabel}>Quantity On Hand</Text>
                <Text style={styles.trayLabel}>Quantity Ordered</Text>
                <Text style={styles.trayLabel}>Last Requisition</Text>
                <Text style={styles.trayLabel}>Order Status</Text>
                <Text style={styles.trayLabel}>Active</Text>
                <Text style={styles.trayLabel}>Accepted</Text>
                <Text style={styles.trayLabel}>Consignment</Text>
                <Text style={styles.trayLabel}>Minimum Value</Text>
                <Text style={styles.trayLabel}>Maximum Value</Text>
                <Text style={styles.trayLabel}>Non Ordered</Text>
                <Text style={styles.trayLabel}>Product Note</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.itemBarcode}</Text>
                <Text style={styles.trayText}>{this.props.itemModel}</Text>
                <Text style={styles.trayText}>{this.props.itemSerial}</Text>
                <Text style={styles.trayText}>{this.props.itemExpiration}</Text>
                <Text style={styles.trayText}>{this.props.licenseNumber}</Text>
                <Text style={styles.trayText}>{this.props.orderThruVendor}</Text>
                <Text style={styles.trayText}>{this.props.autoReplace}</Text>
                <Text style={styles.trayText}>{this.props.discontinued}</Text>
                <Text style={styles.trayText}>{this.props.productCategory}</Text>
                <Text style={styles.trayText}>{this.props.hospitalItemNumber}</Text>
                <Text style={styles.trayText}>{this.props.unitOfMeasure}</Text>
                <Text style={styles.trayText}>{this.props.unitOfMeasureQuantity}</Text>
                <Text style={styles.trayText}>{this.props.reorderValue}</Text>
                <Text style={styles.trayText}>{this.props.quantityOnHand}</Text>
                <Text style={styles.trayText}>{this.props.quantityOrdered}</Text>
                <Text style={styles.trayText}>{this.props.lastRequistionNumber}</Text>
                <Text style={styles.trayText}>{this.props.orderStatus}</Text>
                <Text style={styles.trayText}>{this.props.active}</Text>
                <Text style={styles.trayText}>{this.props.accepted}</Text>
                <Text style={styles.trayText}>{this.props.consignment}</Text>
                <Text style={styles.trayText}>{this.props.minimumValue}</Text>
                <Text style={styles.trayText}>{this.props.maximumValue}</Text>
                <Text style={styles.trayText}>{this.props.nonOrdered}</Text>
                <Text style={styles.trayText}>{this.props.productNote}</Text>
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

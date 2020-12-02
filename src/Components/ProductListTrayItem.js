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
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.itemBarcode}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Model Number</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.itemModel}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Lot / Serial</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.itemBatchLot} {this.props.lotNumber} {this.props.serialNumber}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Expiration Date</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.itemExpiration}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>License Number</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.itemLicenseNumber}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Vendor</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.orderThruVendor}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Auto Replace</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.autoReplace}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Discontinued</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.discontinued}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Product Category</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.productCategory}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Hospital Number</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.hospitalItemNumber}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Unit Of Measure</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.unitOfMeasure}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Unit Of Measure Quantity</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.unitOfMeasureQuantity}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Reorder Value</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.reorderValue}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Quantity On Hand</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.quantityOnHand}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Quantity Ordered</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.quantityOrdered}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Last Requisition</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.lastRequistionNumber}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Order Status</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.orderStatus}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Active</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.active}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Accepted</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.accepted}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Consignment</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.consignment}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Minimum Value</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.minimumValue}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Maximum Value</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.maximumValue}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Non Ordered</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.nonOrdered}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Product Note</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.productNote}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
              </View>
              <View style={styles.equalColumn}>
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
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.itemBarcode}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Model Number</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.itemModel}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Lot / Serial</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.itemBatchLot} {this.props.lotNumber} {this.props.serialNumber}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Expiration Date</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.itemExpiration}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>License Number</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.itemLicenseNumber}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Vendor</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.orderThruVendor}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Auto Replace</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.autoReplace}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Discontinued</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.discontinued}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Product Category</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.productCategory}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Hospital Number</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.hospitalItemNumber}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Unit Of Measure</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.unitOfMeasure}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Unit Of Measure Quantity</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.unitOfMeasureQuantity}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Reorder Value</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.reorderValue}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Quantity On Hand</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.quantityOnHand}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Quantity Ordered</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.quantityOrdered}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Last Requisition</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.lastRequistionNumber}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Order Status</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.orderStatus}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Active</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.active}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Accepted</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.accepted}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Consignment</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.consignment}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Minimum Value</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.minimumValue}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Maximum Value</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.maximumValue}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Non Ordered</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.nonOrdered}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
                <Text style={styles.trayLabel}>Product Note</Text>
              </View>
              <View style={styles.equalColumn}>
                <Text style={styles.trayText}>{this.props.productNote}</Text>
              </View>
            </View>
            <View style={styles.straightRow}>
              <View style={styles.equalColumn}>
              </View>
              <View style={styles.equalColumn}>
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

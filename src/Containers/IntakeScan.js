import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert, TextInput } from 'react-native'
import ZebraScanner from 'react-native-zebra-scanner'
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import ProductListTrayItem from '../Components/ProductListTrayItem'
import { BarcodeSearch } from '../Utilities/BarcodeLookup'

var Realm = require('realm');
let workingScanSpace ;

import styles from '../Styles/ContainerStyles.js'

export default class IntakeScan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scanCount: 0,
      testCount: 0,
      modalState: false,
      scannedBarcode: '',
      modalProduct: {
        count: 0,
        name: '',
      },
      modalProductIndex: -1,
      modalInputHasFocus: false,
      modalItemCount: 0,
      modalErrorMessage: '',
      scannedItems: [],
      scannerConnected: false,
      lastCompleteFlag: false,
      lastScannedObject: {}
    }

  }
  componentDidMount() {
    this.checkForScanner()
  }
  async checkForScanner() {
    let scannerStatus = await ZebraScanner.isAvailable();

    if(scannerStatus) {
      ZebraScanner.addScanListener(this.ScanBarcode)
      this.setState({
        scannerConnected: true
      })
    }
    else {
      this.setState({
        scannerConnected: false
      })
    }
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: (
        <View style={{width: 150, height: 31} }>
          <Image
            style={{width: 150,height: 31,}}
            source={HeaderLogo}
          />
        </View>
      ),
      headerRight: (
        <View style={{flexDirection:'row'}}>
          <View style={{flex: 1,paddingRight:10,}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Home', {
                  userInformation: navigation.getParam('userInformation')
                })
              }>
              <Icon name="home" size={30} color="#102541" />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1,paddingRight:10,}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AccountInfo')
              }>
              <Icon name="user-circle-o" size={26} color="#102541" />
            </TouchableOpacity>
          </View>
        </View>
      ),
    }
  };
  ScanBarcode = (newBarcode) => {
    //Instantiate Variables
    let lastCompleteFlag = this.state.lastCompleteFlag

    if(newBarcode != undefined && newBarcode != null) {
      let scannedItemsList = this.state.scannedItems
      let scannedBarcode = newBarcode
      let scanMatched = false
      let totalCount = 1

      //Check scanned items for existing barcode increase count of identical scans
      scannedItemsList.forEach(function(item, i) {
        totalCount = totalCount + parseFloat(item.count)

        if(item.barcode === scannedBarcode) {
          scanMatched = true
          scannedItemsList[i].count = scannedItemsList[i].count + 1
        }
      }.bind(this));

      //If not a known product create an unknown product scanned item object
      if(scanMatched === false) {
        let barcodeLookup = BarcodeSearch(scannedBarcode, this.state.lastScannedObject, this.state.lastCompleteFlag)
        if(barcodeLookup.productModelNumber != '') {
          lastCompleteFlag = true
        }
        else {
          lastCompleteFlag = false
        }
        scannedItemsList.push(barcodeLookup)
      }
      //Update LocalState with new information
      this.setState({
        scannedItems: scannedItemsList,
        scannedBarcode: scannedBarcode,
        scanCount: totalCount,
        lastScannedObject: barcodeLookup,
      })
    }
  }

  generateScanTest = (count) => {
    let testStrings = ['(01)00184360867004', '+SPEC6303040N', '$$0000349582']

    this.setState({
      testCount: (count + 1)
    })

    return(this.ScanBarcode(testStrings[count].toString()))
  }

  RemoveScannedItem(index) {
    let scannedItems = this.state.scannedItems
    let newTotalCount = 0
    scannedItems.splice(index, 1)
    scannedItems.forEach(function(countScan, index) {
      newTotalCount = newTotalCount + parseFloat(countScan.count)
    })
    this.setState({
      scannedItems: scannedItems,
      scanCount: newTotalCount,
    })
  }
  AdjustScannedQuantity = (index, newQuantity) => {
    let updateCount = newQuantity
    if(updateCount >= 0 && updateCount != null && updateCount != undefined && updateCount != '') {
      let updatedScannedItems = this.state.scannedItems
      updatedScannedItems[index].count = updateCount

      this.setState({
        scannedItems: updatedScannedItems,
      })
      this.CloseAdjustmentModal()

      let scannedItems = this.state.scannedItems
      let newTotalCount = 0
      scannedItems.forEach(function(product, index) {
        newTotalCount = newTotalCount + parseFloat(product.count)
      })
      this.setState({
        scanCount: newTotalCount,
      })
    }
    else if(updateCount === null || updateCount === undefined || updateCount === '') {
      this.setState({
        modalErrorMessage: "Please Enter a Valid Number"
      })
    }
    else if(updateCount < 1) {
      this.setState({
        modalErrorMessage: "Please Enter a Positive Number"
      })
    }
  }
  OpenAdjustmentModal = (index) => {
    let productLocation = index

    let modalProductBuild = this.state.scannedItems[index]
    modalProductBuild.index = index

    this.setState({
      modalState: true,
      modalProduct: this.state.scannedItems[index],
      modalItemCount: this.state.scannedItems[index].count
    })
  }
  CloseAdjustmentModal = () => {
    this.setState({
      modalState: false,
      modalProduct: null,
      modalErrorMessage: null,
      modalItemCount: 0,
    })
  }
  SynchoronizeIntakeToDesktop = () => {
    this.setState({
      scanCount: 0,
      scannedItems: []
    })
  }
  GetScannerStatus(status) {
    let scannerStatus = status

    if(scannerStatus === true) {
      return(
        <Text style={styles.scannerConnected}>Scanner Ready</Text>
      )
    }
    else {
      return(
        <Text style={styles.scannerDisconnected}>Scanner Unavailable</Text>
      )
    }
  }
  onQuantityFocusChange = () => {
    this.setState({modalInputHasFocus: !this.state.modalInputHasFocus})
  }
  RenderModalValidation() {
    if(this.state.modalErrorMessage != null && this.state.modalErrorMessage != undefined && this.state.modalErrorMessage != '') {
      let errorMessage = this.state.modalErrorMessage;
      return(errorMessage)
    }
    else {
      return(null)
    }
  }
  RenderModal() {
    if(this.state.modalState === true) {
      return (
        <View style={styles.modalBackgroundContainer}>
          <View style={styles.modalInnerContainer}>
            <View style={styles.modalTitleWrapper}>
              <Text style={styles.modalTitleText}>{this.state.modalProduct.name}</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => this.CloseAdjustmentModal()}>
                <Text style={styles.modalCloseButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TextInput
                onChangeText={value => this.setState({modalItemCount: value})}
                onFocus={() => this.onQuantityFocusChange()}
                onBlur={() => this.onQuantityFocusChange()}
                style={this.state.modalInputHasFocus ? styles.modalTextInputFocus : styles.modalTextInput}
                keyboardType={'numeric'}
                value={String(this.state.modalItemCount)} />
              <Text style={styles.modalInputLabel}>Item quantity</Text>
              <View><Text style={styles.modalErrorText}>{this.RenderModalValidation()}</Text></View>
              <View style={styles.modalButtonRow}>
                <View style={styles.modalButtonColumn}></View>
                <View style={styles.modalButtonColumn}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => this.AdjustScannedQuantity(this.state.modalProduct.index, this.state.modalItemCount)}>
                    <Text style={styles.modalButtonText}>Set Quantity</Text>
                  </TouchableOpacity>
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
  RenderScannedProducts(scanitems) {
    let scannedItems = scanitems
    let scanOutput = []

    if(scannedItems.length === 0) {
      scanOutput.push(
        <View key={"noData"}>
          <Text style={styles.noDataText}>No Scanned Items to Display.</Text>
          <Text style={styles.noDataText}>Scan Item Barcodes to Begin.</Text>
        </View>
      )
    }
    else {
      scannedItems.forEach(function(item, index){
        scanOutput.push(
          <ProductListTrayItem
            key={index}
            unknownFlag={item.isUnknown}
            itemBarcode={item.barcode}
            itemName={item.name}
            itemCount={item.count}
            itemModel={item.model}
            itemSerial={item.lotSerial}
            itemExpiration={item.expiration}
            statePosition={index}
            removeFunction={() => this.RemoveScannedItem(index)}
            adjustmentFunction={() => this.OpenAdjustmentModal(index)}
            />)
      }.bind(this))
    }
    return(scanOutput)
  }

  render() {
    return (
      <View style={styles.containerContainsFooter}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Intake Scan</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text>Test Scan Function: </Text>
              <TouchableOpacity onPress={() => this.generateScanTest(this.state.testCount)} style={styles.miniSubmitButton}><Text style={styles.miniSubmitButtonText}>Scan Test</Text></TouchableOpacity>
            </View>
            <View style={styles.sectionContainer}>
              <View style={styles.menuRow}>
                <View style={styles.majorColumn}>
                  {this.GetScannerStatus(this.state.scannerConnected)}
                </View>
                <View style={styles.majorColumn}>
                  <Text style={styles.countText}>
                    Total Count
                    <Text style={styles.countTextNumber}> {this.state.scanCount}</Text>
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              {this.RenderScannedProducts(this.state.scannedItems)}
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <View style={styles.leftColumn}>
            <Text style={styles.bodyTextLabel}>Synchronize</Text>
            <Text style={styles.bodyTextLabel}>to Desktop</Text>
          </View>
          <View style={styles.rightColumn}>
            <TouchableOpacity style={styles.submitButton} onPress={() => this.SynchoronizeIntakeToDesktop()}>
              <Text style={styles.submitButtonText}>Synchronize</Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.RenderModal()}
      </View>
    );
  }
}

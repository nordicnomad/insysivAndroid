import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import ZebraScanner from 'react-native-zebra-scanner'
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import ProductListTrayItem from '../Components/ProductListTrayItem'

import styles from '../Styles/ContainerStyles.js'

export default class IntakeScan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scanCount: 0,
      scannedItems: [
        {
          trayState: false,
          isUnknown: true,
          name: "Unknown Product",
          model: "9188493038",
          lotSerial: "0209485",
          expiration: "08/08/2020",
          count: 1
        },
      ],
      scannerConnected: false,
    }
  }
  componentDidMount() {
    this.checkForScanner()
  }
  async checkForScanner() {
    let scannerStatus = await ZebraScanner.isAvailable();

    console.log("SCANNER IS AVAILABLE")
    console.log(scannerStatus)
    if(scannerStatus) {
      ZebraScanner.addScanListener(this.ScanBarcode())
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
  ScanBarcode() {
    let existingScans = this.state.scannedItems
    let existingCount = this.state.scanCount

    // call to scanner to get barcode (populate object's serial, model, and expiration)
    let newScanData = [
      {
        trayState: false,
        isUnknown: true,
        name: "Unknown Product",
        model: "9188493038",
        lotSerial: "0209485",
        expiration: "08/08/2020",
        count: 1
      },
      {
        trayState: false,
        isUnknown: false,
        name: "Existing Product",
        model: "9188493000",
        lotSerial: "0209467",
        expiration: "08/08/2020",
        count: 1
      }
    ]
    let addState = 0
    let matchState = false
    let existingTotalCount = 0
    existingScans.forEach(function(exScan, index) {
      existingTotalCount = existingTotalCount + exScan.count
    })

    if(existingTotalCount % 2 === 0) {
      addState = 1
    }
    else {
      addState = 0
    }
    let newScan = newScanData[addState]
    if(existingScans.length === 0) {
      existingScans.push(newScan)
    }
    else {
      existingScans.forEach(function(scan, index) {
          if(newScan.lotSerial === scan.lotSerial) {
            matchState = true
            existingScans[index].count = existingScans[index].count + 1
          }
      })
      if(matchState === false) {
        existingScans.push(newScan)
      }
    }

    let finalTotalCount = 0
    existingScans.forEach(function(countScan, index) {
      finalTotalCount = finalTotalCount + countScan.count
    })

    // api call to lookup service, return name

    // add object to the top of the scanned items array or increase item count and move to top.

    this.setState({
      scanCount: existingCount,
      scannedItems: existingScans,
      scanCount: finalTotalCount
    })
  }

  RemoveScannedItem(index) {
    let scannedItems = this.state.scannedItems
    let newTotalCount = 0
    scannedItems.splice(index, 1)
    scannedItems.forEach(function(countScan, index) {
      newTotalCount = newTotalCount + countScan.count
    })
    this.setState({
      scannedItems: scannedItems,
      scanCount: newTotalCount,
    })
  }
  AdjustScannedQuantity = (index, newQuantity) => {
    console.log("CALLED ADJUSTMENT FUNCTION")
    let updateCount = newQuantity
    let updatedScannedItems = this.state.scannedItems
    updatedScannedItems[index].count = updateCount
    this.setState({
      scannedItems: updatedScannedItems
    })
  }
  OpenAdjustmentModal = (index) => {
    let productLocation = index

    this.setState({
      modalState: true,
      modalProduct: index, 
    })
  }
  CloseAdjustmentModal = () => {
    this.setState({
      modalState: false
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
      <View style={{flex: 1}}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Intake Scan</Text>
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
      </View>
    );
  }
}

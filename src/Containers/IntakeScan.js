import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert, TextInput, DeviceEventEmitter } from 'react-native'
import ZebraScanner from 'react-native-zebra-scanner'
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.jpg'
import ProductListTrayItem from '../Components/ProductListTrayItem'
import { BarcodeSearch } from '../Utilities/BarcodeLookup'
import TestBarcodes from '../dummyData/testBarcodes.json'

import SoundPlayer from 'react-native-sound-player'

var Realm = require('realm');
let activeUser ;
let vendorsList ;
let workingScanSpace ;
let scanListener = {}

import styles from '../Styles/ContainerStyles.js'

export default class IntakeScan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scanCount: 0,
      testCount: 0,
      modalState: false,
      scannedBarcode: '',
      modalProduct: '',
      modalInputHasFocus: false,
      modalItemCount: 0,
      modalErrorMessage: '',
      scannedItems: [],
      scannerConnected: false,
      lastCompleteFlag: true,
      lastScannedObject: {},
      pageErrorMessage: '',
      showSaveInvalid: false,
    }

    activeUser = new Realm({
      schema: [{name: 'Active_User',
        properties: {
          userId:"string",
          userName: "string",
          userToken: "string",
          tokenExpiration: "string?",
          syncAddress: "string?",
          organizationName: "string?",
          //Additional Organization Level Configuration Options go Here.
      }}]
    });
    vendorsList = new Realm ({
      schema: [{name: 'Vendors_List',
      properties: {
        licenseNumber: "string",
        vendorName: "string",
        active: "string?",
        accepted: "string?"
      }}]
    })

    workingScanSpace = new Realm({
      schema: [{name: 'Working_Scan_Space',
        properties:
        {
          barcode: 'string',
          barcodeMatch: 'string?',
          serialContainerCode: 'string?',
          manufacturerModelNumber: 'string?',
          vendorLicenseNumber: 'string?',
          numberOfContainers: 'string?',
          batchOrLotNumber: 'string?',
          expirationDate: 'string?',
          productVariant: 'string?',
          serialNumber: 'string?',
          hibcc: 'string?',
          lotNumber: 'string?',
          quantityEach: 'string?',
          secondaryProductAttributes: 'string?',
          hibcSecondaryExpiration: 'string?',
          hibcSecondaryManufacture: 'string?',
          secondarySerialNumber: 'string?',
          hibcSecondarySerial: 'string?',
          quantityOfUnitsContained: 'string?',
          hibcManufactureDate: 'string?',
          passThroughCompletenessFlag: 'bool?',
          trayState: 'bool?',
          isUnknown: 'bool?',
          licenseNumber: 'string?',
          productModelNumber: 'string?',
          orderThruVendor: 'string?',
          productDescription: 'string?',
          autoReplace: 'string?',
          discontinued: 'string?',
          productCategory: 'string?',
          hospitalItemNumber: 'string?',
          unitOfMeasure: 'string?',
          unitOfMeasureQuantity: 'string?',
          reorderValue: 'string?',
          quantityOnHand: 'string?',
          quantityOrdered: 'string?',
          lastRequistionNumber: 'string?',
          orderStatus: 'string?',
          active: 'string?',
          accepted: 'string?',
          consignment: 'string?',
          minimumValue: 'string?',
          maximumValue: 'string?',
          nonOrdered: 'string?',
          productNote: 'string?',
          scannedTime: 'string?',
          count: 'int?',
          waste: 'bool?',
          scanned: 'bool?',

      }}]
    })
    this.ScanBarcode = this.ScanBarcode.bind(this)
    scanListener = (scannedCode) => {
      this.ScanBarcode(scannedCode)
    }
  }
  componentWillUnmount() {
    ZebraScanner.removeScanListener(scanListener)
  }
  componentDidMount() {
    this.checkForScanner()

    let newTotalCount = 0;
    let scannedItems = workingScanSpace.objects('Working_Scan_Space')

    scannedItems.forEach(function(countScan, index) {
      newTotalCount = newTotalCount + parseFloat(countScan.count)
    })

    this.setState({
      scannedItems: scannedItems,
      scanCount: newTotalCount,
    })
  }
  async checkForScanner() {
    let scannerStatus = await ZebraScanner.isAvailable();

    try {
      ZebraScanner.addScanListener(scanListener)
    }
    catch {
      this.setState({
        pageErrorMessage: "ADD SCAN LISTENER FAILED"
      })
    }
    if(scannerStatus) {
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
  SaveInvalidScan = (lastLookup) => {
    workingScanSpace.write(() => {
      try {
        workingScanSpace.create('Working_Scan_Space', {
          barcode: lastLookup.barcode,
          serialContainerCode: lastLookup.serialContainerCode,
          manufacturerModelNumber: lastLookup.manufacturerModelNumber,
          vendorLicenseNumber: lastLookup.vendorLicenseNumber,
          numberOfContainers: lastLookup.numberOfContainers,
          batchOrLotNumber: lastLookup.batchOrLotNumber,
          expirationDate: lastLookup.expirationDate,
          productVariant: lastLookup.productVariant,
          serialNumber: lastLookup.serialNumber,
          hibcc: lastLookup.hibcc,
          lotNumber: lastLookup.lotNumber,
          quantityEach: lastLookup.quantityEach,
          secondaryProductAttributes: lastLookup.secondaryProductAttributes,
          hibcSecondaryExpiration: lastLookup.hibcSecondaryExpiration,
          hibcSecondaryManufacture: lastLookup.hibcSecondaryManufacture,
          secondarySerialNumber: lastLookup.secondarySerialNumber,
          hibcSecondarySerial: lastLookup.hibcSecondarySerial,
          quantityOfUnitsContained: lastLookup.quantityOfUnitsContained,
          hibcManufactureDate: lastLookup.hibcManufactureDate,
          passThroughCompletenessFlag: lastLookup.passThroughCompletenessFlag,
          trayState: lastLookup.trayState,
          isUnknown: lastLookup.isUnknown,
          licenseNumber: lastLookup.licenseNumber,
          productModelNumber: lastLookup.productModelNumber,
          orderThruVendor: lastLookup.orderThruVendor,
          productDescription: "Unknown Product",
          autoReplace: lastLookup.autoReplace,
          discontinued: lastLookup.discontinued,
          productCategory: lastLookup.productCategory,
          hospitalItemNumber: lastLookup.hospitalItemNumber,
          unitOfMeasure: lastLookup.unitOfMeasure,
          unitOfMeasureQuantity: lastLookup.unitOfMeasureQuantity,
          reorderValue: lastLookup.reorderValue,
          quantityOnHand: lastLookup.quantityOnHand,
          quantityOrdered: lastLookup.quantityOrdered,
          lastRequistionNumber: lastLookup.lastRequistionNumber,
          orderStatus: lastLookup.orderStatus,
          active: lastLookup.active,
          accepted: lastLookup.accepted,
          consignment: lastLookup.consignment,
          minimumValue: lastLookup.minimumValue,
          maximumValue: lastLookup.maximumValue,
          nonOrdered: lastLookup.nonOrdered,
          productNote: lastLookup.productNote,
          scannedTime: lastLookup.scannedTime,
          count: lastLookup.count,
          waste: lastLookup.waste,
          scanned: lastLookup.scanned,
        })
        this.setState({
          pageErrorMessage: "",
          showSaveInvalid: false,
        })
      }
      catch (e) {
        console.log("Error on working scan space invalid item creation");
        console.log(e);
        this.setState({
          pageErrorMessage: "Item Save Error",
          showSaveInvalid: false,
        })
      }
    });

  }
  RenderSaveInvalidSection(showSaveInvalid) {
    if(showSaveInvalid === true) {
      return(
        <View>
          <View style={styles.menuRow}>
            <View style={styles.majorColumn}>
              <Text style={styles.invalidSaveLabel}>Save this Scan Segment as an Unknown Product:</Text>
            </View>
            <View style={styles.majorColumn}>
              <TouchableOpacity style={styles.miniSubmitButton} onPress={() => this.SaveInvalidScan(this.state.lastScannedObject)}>
                <Text style={styles.miniSubmitButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }
    else {
      return(<View></View>)
    }
  }
  ScanBarcode = (newBarcode) => {
    if(newBarcode.substring(0,1) === "{") {
      console.log('INVALID SCAN FORMAT')
      try {
          SoundPlayer.playSoundFile('invalidscan', 'wav')
      } catch (e) {
          console.log(`cannot play the sound file`, e)
      }
      this.setState({
        pageErrorMessage: "Unsupported Barcode Format",
        showSaveInvalid: false,
        lastCompleteFlag: true,
      })
    }
    else {
      this.setState({
        showSaveInvalid: false,
      })
      //Instantiate Variables
      let lastCompleteFlag = this.state.lastCompleteFlag

      if(newBarcode != undefined && newBarcode != null) {
        let scannedItemsList = workingScanSpace.objects('Working_Scan_Space')
        let scannedBarcode = newBarcode
        let scanMatched = false
        let totalCount = 1
        let barcodeLookup = {}

        //Check scanned items for existing barcode increase count of identical scans
        if(lastCompleteFlag === true) {
          workingScanSpace.write(() => {
            scannedItemsList.forEach(function(item, i) {
              totalCount = totalCount + parseFloat(item.count)

              if(item.barcode === scannedBarcode) {
                scanMatched = true
                scannedItemsList[i].count = scannedItemsList[i].count + 1
                if(scannedItemsList[i].productModelNumber === '') {
                  try {
                      SoundPlayer.playSoundFile('unknownproduct', 'wav')
                  } catch (e) {
                      console.log(`cannot play the sound file`, e)
                  }
                }
                else {
                  try {
                      SoundPlayer.playSoundFile('scansuccess', 'wav')
                  } catch (e) {
                      console.log(`cannot play the sound file`, e)
                  }
                }
              }
            }.bind(this));
          })
        }


        //If not a known product create an unknown product scanned item object
        if(scanMatched === false) {
          barcodeLookup = BarcodeSearch(scannedBarcode, this.state.lastScannedObject, this.state.lastCompleteFlag)
          console.log("BARCODE SEARCH FUNCTION RETURN")
          console.log(barcodeLookup)
          if(barcodeLookup != null) {
            if(barcodeLookup.passThroughCompletenessFlag === true) {
              this.setState({
                lastCompleteFlag: true,
                lastScannedObject: barcodeLookup,
              })
            }
            else {
              this.setState({
                lastCompleteFlag: false,
                lastScannedObject: barcodeLookup,
              })
            }
          }
          //Save new scanned product to working scan space
          if(barcodeLookup.passThroughCompletenessFlag === true) {
            workingScanSpace.write(() => {
              try {
                workingScanSpace.create('Working_Scan_Space', {
                  barcode: barcodeLookup.barcode,
                  serialContainerCode: barcodeLookup.serialContainerCode,
                  manufacturerModelNumber: barcodeLookup.manufacturerModelNumber,
                  vendorLicenseNumber: barcodeLookup.vendorLicenseNumber,
                  numberOfContainers: barcodeLookup.numberOfContainers,
                  batchOrLotNumber: barcodeLookup.batchOrLotNumber,
                  expirationDate: barcodeLookup.expirationDate,
                  productVariant: barcodeLookup.productVariant,
                  serialNumber: barcodeLookup.serialNumber,
                  hibcc: barcodeLookup.hibcc,
                  lotNumber: barcodeLookup.lotNumber,
                  quantityEach: barcodeLookup.quantityEach,
                  secondaryProductAttributes: barcodeLookup.secondaryProductAttributes,
                  hibcSecondaryExpiration: barcodeLookup.hibcSecondaryExpiration,
                  hibcSecondaryManufacture: barcodeLookup.hibcSecondaryManufacture,
                  secondarySerialNumber: barcodeLookup.secondarySerialNumber,
                  hibcSecondarySerial: barcodeLookup.hibcSecondarySerial,
                  quantityOfUnitsContained: barcodeLookup.quantityOfUnitsContained,
                  hibcManufactureDate: barcodeLookup.hibcManufactureDate,
                  passThroughCompletenessFlag: barcodeLookup.passThroughCompletenessFlag,
                  trayState: barcodeLookup.trayState,
                  isUnknown: barcodeLookup.isUnknown,
                  licenseNumber: barcodeLookup.licenseNumber,
                  productModelNumber: barcodeLookup.productModelNumber,
                  orderThruVendor: barcodeLookup.orderThruVendor,
                  productDescription: barcodeLookup.productDescription,
                  autoReplace: barcodeLookup.autoReplace,
                  discontinued: barcodeLookup.discontinued,
                  productCategory: barcodeLookup.productCategory,
                  hospitalItemNumber: barcodeLookup.hospitalItemNumber,
                  unitOfMeasure: barcodeLookup.unitOfMeasure,
                  unitOfMeasureQuantity: barcodeLookup.unitOfMeasureQuantity,
                  reorderValue: barcodeLookup.reorderValue,
                  quantityOnHand: barcodeLookup.quantityOnHand,
                  quantityOrdered: barcodeLookup.quantityOrdered,
                  lastRequistionNumber: barcodeLookup.lastRequistionNumber,
                  orderStatus: barcodeLookup.orderStatus,
                  active: barcodeLookup.active,
                  accepted: barcodeLookup.accepted,
                  consignment: barcodeLookup.consignment,
                  minimumValue: barcodeLookup.minimumValue,
                  maximumValue: barcodeLookup.maximumValue,
                  nonOrdered: barcodeLookup.nonOrdered,
                  productNote: barcodeLookup.productNote,
                  scannedTime: barcodeLookup.scannedTime,
                  count: barcodeLookup.count,
                  waste: barcodeLookup.waste,
                  scanned: barcodeLookup.scanned,
                })
              }
              catch (e) {
                console.log("Error on working scan space creation");
                console.log(e);
              }
            })
            if(barcodeLookup.isUnknown === true) {
              try {
                  SoundPlayer.playSoundFile('unknownproduct', 'wav')
              } catch (e) {
                  console.log(`cannot play the sound file`, e)
              }
            }
            else {
              try {
                  SoundPlayer.playSoundFile('scansuccess', 'wav')
              } catch (e) {
                  console.log(`cannot play the sound file`, e)
              }
            }
            this.setState({
              pageErrorMessage: ""
            })
          }
          else {
            if(barcodeLookup.invalidScanSegment) {
              //set completeness flag here to drop return object and skip working space save
              try {
                  SoundPlayer.playSoundFile('invalidscan', 'wav')
              } catch (e) {
                  console.log(`cannot play the sound file`, e)
              }
              this.setState({
                pageErrorMessage: "Invalid Scan Segment Order",
                showSaveInvalid: true,
                lastCompleteFlag: true,
              })
            }
            else {
              try {
                  SoundPlayer.playSoundFile('continuescan', 'wav')
              } catch (e) {
                  console.log(`cannot play the sound file`, e)
              }
              this.setState({
                pageErrorMessage: "Scan Next Barcode Segment",
                lastCompleteFlag: false,
              })
            }
          }
        }

        //update count with what's actually stored in db after lookup operations
        let newTotalCount = 0
        scannedItemsList.forEach(function(countScan, index) {
          newTotalCount = newTotalCount + parseFloat(countScan.count)
        })

        //Update LocalState with new information
        this.setState({
          scannedItems: scannedItemsList,
          scannedBarcode: scannedBarcode,
          scanCount: newTotalCount,
        })
      }
    }
  }

  generateScanTest = (count) => {
    let testStrings = TestBarcodes

    this.setState({
      testCount: (count + 1)
    })

    return(this.ScanBarcode(testStrings[count].barcode.toString()))
  }

  RemoveScannedItem(itemBarcode) {
    let newTotalCount = 0
    let scanSpaceItems = workingScanSpace.objects("Working_Scan_Space")
    let removeBuildString = 'barcode CONTAINS "' + itemBarcode + '"'
    let filteredRemoveMatch = scanSpaceItems.filtered(removeBuildString)

    workingScanSpace.write(() => {
      workingScanSpace.delete(filteredRemoveMatch)
    })

    let scannedItems = workingScanSpace.objects('Working_Scan_Space')

    scannedItems.forEach(function(countScan, index) {
      newTotalCount = newTotalCount + parseFloat(countScan.count)
    })

    this.setState({
      scannedItems: scannedItems,
      scanCount: newTotalCount,
    })
  }
  AdjustScannedQuantity = (itemBarcode, newQuantity) => {
    let productLocationString = 'barcode CONTAINS "' + itemBarcode + '"'
    let modalProducts = workingScanSpace.objects('Working_Scan_Space')
    let modalProductBuild = modalProducts.filtered(productLocationString)

    let updateCount = parseFloat(newQuantity)
    if(updateCount >= 0 && updateCount != null && updateCount != undefined && updateCount != '') {
      let updatedScannedItem = modalProductBuild[0]
      workingScanSpace.write(() => {
        updatedScannedItem.count = updateCount
      })

      this.setState({
        scannedItems: updatedScannedItem,
      })
      this.CloseAdjustmentModal()

      let newTotalCount = 0
      modalProducts.forEach(function(product, index) {
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
  OpenAdjustmentModal = (itemBarcode) => {
    this.setState({
      modalState: true,
      modalProduct: itemBarcode,
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
  recordCleanup(failedCalls) {
    let failedSyncs = failedCalls
    let scannedProducts = workingScanSpace.objects("Working_Scan_Space")
    //Completeness check
    if(failedSyncs.length === 0) {
      //Reset State and DB if all transmit successfully
      workingScanSpace.write(() => {
        workingScanSpace.deleteAll()
      })
      this.setState({
        scanCount: 0,
        scannedItems: [],
        pageErrorMessage: "Last Sync Successful"
      })
      //Redirect to home page if necessary
      //otherwise state should update in place
      this.props.navigation.navigate("Home")
    }
    else {
      let newCount = 0
      scannedProducts.forEach((productItem, index) => {
        let matchFlag = false
        //Check if item barcode is in failed barcode list
        failedSyncs.forEach((failedBarcode, i) => {
          if(productItem.barcode === failedBarcode) {
            matchedFlag = true
          }
        })
        if(matchedFlag === false) {
          //if not failed find in DB and delete entry
          let buildDeleteScan = 'barcode CONTAINS "' + productItem.barcode + '"'
          let filteredProductItems = workingScanSpace.filtered(buildDeleteScan)
          workingScanSpace.write(() => {
            workingScanSpace.delete(filteredProductItems)
          })
        }
      });
      //Reset Scanned Item Count and update state
      let countableProducts = workingScanSpace.objects("Working_Scan_Space")
      countableProducts.forEach(function(remainingProduct, i) {
        newCount = newCount + remainingProduct.count
      })
      this.setState({
        scanCount: newCount,
        pageErrorMessage: "Some Items Could Not Sync to Server"
      })
    }
  }
  resetScanList = () => {
    workingScanSpace.write(() => {
      workingScanSpace.deleteAll()
    })
    this.setState({
      scanCount: 0,
      scannedItems: [],
      pageErrorMessage: "Scan List Cleared",
      showSaveInvalid: false,
    })
  }
  SynchronizeIntakeToDesktop = () => {
    //Instantiate Scanned Products
    let userObject = activeUser.objects("Active_User")
    let scannedProducts = workingScanSpace.objects("Working_Scan_Space")
    let failedSyncs = []
    let expectedSyncs = scannedProducts.length
    let completedSyncs = 0

    //Loop products and individually post to server
    scannedProducts.forEach((product, index) => {
      let lotSerial = ''
      if(product.lotNumber === null || product.lotNumber === '') {
        lotSerial = product.serialNumber
      }
      else if(product.serialNumber === null || product.serialNumber === '') {
        lotSerial = product.lotNumber
      }
      else {
        lotSerial = product.lotNumber + '/' + product.serialNumber
      }
      console.log("SYNC PRODUCT: " + index)
      console.log(product.productModelNumber)
      try {
        fetch('http://25.78.82.76:5100/api/CheckinProducts', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            //api endpoint model
            pkChkin: 0,
            licenseNumber: product.vendorLicenseNumber,
            productModelNumber: product.productModelNumber,
            productBarCode: product.barcode,
            encoding: 0,
            transactionPrice: 0,
            lotSerialNumber: lotSerial,
            createTimestamp: new Date().toISOString(),
            createUserid: userObject[0].userId,
            qty: product.count,
            expirationDate: product.expirationDate
          })
        })
        .then((syncresponse) => {
          let syncresponseJson = syncresponse.json()
          if(syncresponse.status >= 200 && syncresponse.status < 300) {
            console.log("SYNC CASE RESPONSE OBJECT")
            console.log(syncresponseJson)
            this.setState({
              pageErrorMessage: "SYNC Post Request Succeeded: " + index,
            })
          } else {
            failedSyncs.push(product.barcode);
            return syncresponseJson.then(error => {throw error;});
            this.setState({
              pageErrorMessage: "SYNC Post Request Failed: " + index,
            })
          }
          completedSyncs = completedSyncs + 1
          if(completedSyncs === expectedSyncs) {
            this.recordCleanup(failedSyncs)
          }
        })
        .catch((error) => {
          console.log("SYNC POST REQUEST FAILED")
          console.log(error);
          this.setState({
            pageErrorMessage: 'SYNC Post Request Failed: ' + index
          })
          failedSyncs.push(product.barcode)
          completedSyncs = completedSyncs + 1
          if(completedSyncs === expectedSyncs) {
            this.recordCleanup(failedSyncs)
          }
        });
      }
      catch (e) {
        console.log("SYNC POST REQUEST FAILED CATCH")
        console.log(e)
        this.setState({
          pageErrorMessage: 'SYNC Post Request Failed'
        })
        failedSyncs.push(product.barcode)
        completedSyncs = completedSyncs + 1
        if(completedSyncs === expectedSyncs) {
          this.recordCleanup(failedSyncs)
        }
      }
    });
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
    let productLocationString = 'barcode CONTAINS "' + this.state.modalProduct + '"'
    let modalProducts = workingScanSpace.objects('Working_Scan_Space')
    let modalProductBuild = modalProducts.filtered(productLocationString)
    if(this.state.modalState === true) {
      return (
        <View style={styles.modalBackgroundContainer}>
          <View style={styles.modalInnerContainer}>
            <View style={styles.modalTitleWrapper}>
              <Text style={styles.modalTitleText}>{modalProductBuild[0].name}</Text>
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
              <View><Text style={styles.errorText}>{this.RenderModalValidation()}</Text></View>
              <View style={styles.modalButtonRow}>
                <View style={styles.modalButtonColumn}></View>
                <View style={styles.modalButtonColumn}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => this.AdjustScannedQuantity(modalProductBuild[0].barcode, this.state.modalItemCount)}>
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
      let vendorLookup = vendorsList.objects("Vendors_List")
      let vendorBuildString = ""

      let vendorFiltration = []
      let vendorName = ''

      scannedItems.forEach(function(item, index){
        vendorBuildString = 'licenseNumber CONTAINS "' + item.orderThruVendor + '"'
        vendorFiltration = vendorLookup.filtered(vendorBuildString)

        if(vendorFiltration != '' && vendorFiltration != undefined && vendorFiltration != null) {
          vendorName = vendorFiltration[0].vendorName
        }
        scanOutput.push(
          <ProductListTrayItem
            key={index}
            unknownFlag={item.isUnknown}
            itemBarcode={item.barcode}
            itemName={item.productDescription}
            itemCount={item.count}
            itemModel={item.productModelNumber}
            itemManModel={item.manufacturerModelNumber}
            itemSerial={item.serialNumber}
            itemLot={item.lotNumber}
            itemBatchLot = {item.batchOrLotNumber}
            itemExpiration={item.expirationDate}
            itemLicenseNumber={item.productVendorLicense}
            itemOrderVendor={vendorName}
            itemAutoReplace={item.autoReplace}
            itemDiscontinued={item.discontinued}
            itemProductCategory={item.productCategory}
            itemHospitalNumber={item.hospitalItemNumber}
            itemUnitOfMeasure={item.unitOfMeasure}
            itemUnitOfMeasureQuantity={item.unitOfMeasureQuantity}
            itemReorderValue={item.reorderValue}
            itemQuantityOnHand={item.quantityOnHand}
            itemQuantityOrdered={item.quantityOrdered}
            itemLastRequisitionNumber={item.lastRequistionNumber}
            itemOrderStatus={item.orderStatus}
            itemActive={item.active}
            itemAccepted={item.accepted}
            itemConsignment={item.consignment}
            itemMinimumValue={item.minimumValue}
            itemMaximumValue={item.maximumValue}
            itemNonOrdered={item.nonOrdered}
            itemProductNote={item.productNote}
            statePosition={index}
            fullObject={item}
            removeFunction={() => this.RemoveScannedItem(item.barcode)}
            adjustmentFunction={() => this.OpenAdjustmentModal(item.barcode)}
            />)
      }.bind(this))
    }
    return(scanOutput)
  }

  render() {
    let isLoggedIn = activeUser.objects('Active_User')
    if(isLoggedIn.length === 0) {
      return(this.props.navigation.navigate('Login'))
    }
    else {
      let scannedItems = workingScanSpace.objects('Working_Scan_Space').sorted("scannedTime", true)
      return (
        <View style={styles.containerContainsFooter}>
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
              <View style={styles.titleRow}>
                <View style={styles.majorColumn}>
                  <Text style={styles.titleText}>Intake Scan</Text>
                </View>
                <View style={styles.majorColumn}>
                  <TouchableOpacity onPress={() => this.resetScanList()} style={styles.miniSubmitButton}><Text style={styles.miniSubmitButtonText}>Clear List</Text></TouchableOpacity>
                </View>
              </View>
              <View style={styles.errorTextContainer}><Text style={styles.errorText}>{this.state.pageErrorMessage}</Text></View>
              {this.RenderSaveInvalidSection(this.state.showSaveInvalid)}
              <View style={styles.sectionContainer}>
                <Text>Test Scan Function: </Text>
                <View style={styles.menuRow}>
                  <View style={styles.majorColumn}>
                    <TouchableOpacity onPress={() => this.generateScanTest(this.state.testCount)} style={styles.miniSubmitButton}><Text style={styles.miniSubmitButtonText}>Scan Test</Text></TouchableOpacity>
                  </View>
                </View>
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
                {this.RenderScannedProducts(scannedItems)}
              </View>
            </View>
          </ScrollView>
          <View style={styles.footerContainer}>
            <View style={styles.leftColumn}>
              <Text style={styles.bodyTextLabel}>Synchronize</Text>
              <Text style={styles.bodyTextLabel}>to Desktop</Text>
            </View>
            <View style={styles.rightColumn}>
              <TouchableOpacity style={styles.submitButton} onPress={() => this.SynchronizeIntakeToDesktop()}>
                <Text style={styles.submitButtonText}>Synchronize</Text>
              </TouchableOpacity>
            </View>
          </View>
          {this.RenderModal()}
        </View>
      );
    }
  }
}

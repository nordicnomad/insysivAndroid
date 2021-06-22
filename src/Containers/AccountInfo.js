import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.jpg'
import UserData from '../dummyData/login.json'
import DummyProducts from '../dummyData/productsOffline.json'
import DummyBarcodes from '../dummyData/productBarcodesOffline.json'
import DummyLabels from '../dummyData/rfidLabelsOffline.json'
import DummyDocs from '../dummyData/physiciansOffline.json'
import DummySites from '../dummyData/sitesOffline.json'
import DummyUsers from '../dummyData/userTablesOffline.json'
import DummyProcedures from '../dummyData/proceduresOffline.json'
import DummyVendors from '../dummyData/vendorsOffline.json'

var Realm = require('realm');
let activeUser ;
let products ;
let productBarCodes ;
let rfidLabels ;
let physiciansList ;
let locationsList ;
let proceduresList ;
let usersList ;
let vendorsList ;
let activeScanableCase ;
let workingCaseSpace ;
let workingScanSpace ;

import styles from '../Styles/ContainerStyles.js'

export default class AccountInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedValue: 0,
      gates: [],
      warningModalState: false,
      account: {
        organization: {
          name: 'Replace with something in user object',
          systemVersion: 'V0.1',
          customerServicePhone: '888-888-8888',
          customerServiceEmail: 'troy.norris@insysiv.com'
        }
      },
      user: {},
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

    products = new Realm({
      schema: [{name: 'Products_Lookup',
      properties:
      {
          licenseNumber: "string",
          productModelNumber: "string",
          orderThruVendor: "string",
          productDescription: "string",
          autoReplace: "string",
          discontinued: "string",
          productCategory: "string",
          hospitalItemNumber: "string?",
          unitOfMeasure: "string",
          unitOfMeasureQuantity: "int",
          reorderValue: "int",
          quantityOnHand: "int",
          quantityOrdered: "int",
          lastRequistionNumber: "int?",
          orderStatus: "string",
          active: "string",
          accepted: "string",
          consignment: "string",
          minimumValue: "int",
          maximumValue: "int",
          nonOrdered: "string",
          productNote: "string?",

      }}]
    });
    productBarCodes = new Realm({
      schema: [{name: 'Product_Bar_Codes',
      properties: {
        productBarCode1: "string",
        licenseNumber: "string",
        productModelNumber: "string",
        encoding: "int?"
      }}]
    });
    rfidLabels = new Realm({
      schema: [{name: 'RFID_Labels',
      properties: {
        licenseNumber: "string?",
        productModelNumber: "string",
        lotSerialNumber: "string?",
        expirationDate: "string?",
        tagid: "string?",
      }}]
    });
    physiciansList = new Realm({
      schema: [{name: 'Physicians_List',
      properties: {
        physicianId: "string",
        firstName: "string",
        middleInitial: "string?",
        lastName: "string",
        active: "string",
      }}]
    });
    locationsList = new Realm({
      schema: [{name: 'Locations_List',
      properties: {
        siteId: "string",
        siteDescription: "string",
        active: "string",
      }}]
    });
    proceduresList = new Realm({
      schema: [{name: 'Procedures_List',
      properties: {
        procedureCode: "string",
        procedureDescription: "string",
        active: "string",
      }}]
    });
    usersList = new Realm({
      schema: [{name: 'Users_List',
      properties: {
        userId: "string",
        userPassword: "string",
        userName: "string",
        scannerCaseAuth: "string",
        scannerLinkAuth: "string",
        scannerInquiryAuth: "string",
        scannerUtilityAuth: "string",
        scannerInventoryAuth: "string",
        scannerCheckInAuth: "string",
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

    activeScanableCase = new Realm({
      schema: [{name: 'Active_Scanable_Case',
      properties: {
        chead_pk_case_number: "string",
        chead_pk_site_id: "string",
        chead_patient_id: "string",

        cproc_pk_procedure_code: "string",
        cproc_physician_id: "string",
        cproc_billing_code: "string?",
        cproc_sync_site_name: "string?",

        chead_datetime_in: "string?",
        chead_datetime_out: "string?",
        chead_user_one: "string?",
        chead_user_two: "string?",
        chead_user_three: "string?",
        chead_user_four: "string?",
      }}]
    });
    workingCaseSpace = new Realm({
      schema: [{name: 'Working_Case_Space',
      properties: {
        barcode: "string",
        barcodeMatchSegment: "string?",
        description: "string",
        scannedRfid: "bool?",
        cprod_pk_product_sequence: "int?",
        cprod_line_number: "int?",
        cprod_billing_code: "string?",
        cprod_change_timestamp: "string?",
        cprod_change_userid: "string?",
        cprod_expiration_date: "string?",
        cprod_license_number: "string?",
        cprod_product_model_number: "string",
        cprod_lot_serial_number: "string",
        cprod_no_charge_reason: "string?",
        cprod_no_charge_type: "string?",
        cprod_remote_id: "string?",
        cprod_requisition_number: "int?"
      }}]
    });
    workingScanSpace = new Realm({
      schema: [{name: 'Working_Scan_Space',
        properties:
        {
          barcode: 'string',
          barcodeMatchSegment: "string?",
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
    });
  }
  componentDidMount() {
    this.getUserData()
    //this.getAccountData()
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
                navigation.navigate('Login')
              }>
              <Icon name="sign-out" size={30} color="#102541" />
            </TouchableOpacity>
          </View>
        </View>
      ),
    }
  };
  getUserData() {
    this.setState({
      user: UserData
    })
  }
  getAccountData() {
    let accountResponse = {}
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/info')
    //test server call
    return fetch('https://insysivtestapi.herokuapp.com/insysiv/api/v1.0/info')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      accountResponse = responseJson.account;
      this.setState({
        account: accountResponse,
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  getCurrentDate = () => {
    let dateobject = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    }
    return(dateobject)
  }

  saveCurrentDate = () => {
    let fetchedTimestamps = lastProductFetch.objects('Products_Last_Fetch')
    let timestamp = fetchedTimestamps[0]
    let currentDate = this.getCurrentDate()

    if(timestamp != null && timestamp != undefined && timestamp.length > 0) {
      try {
        lastProductFetch.write(() => {
          timestamp.year = currentDate.year
          timestamp.month = currentDate.month
          timestamp.day = currentDate.day
        });
      }
      catch (e) {
        console.log("Error on timestamp update");
      }
    }
    else {
      try {
        lastProductFetch.write(() => {
          lastProductFetch.create('Products_Last_Fetch', {
            year: currentDate.year,
            month: currentDate.month,
            day: currentDate.day
          })
        })
      }
      catch (e) {
        console.log("Error on timestamp creation");
      }
    }
  }

  FetchBarcodeTable = () => {
    let barcodeResponse = []

    //Barcode Calls
    //test server call
    console.log("FETCHBARCODETABLE CALLED FROM ACCOUNT INFORMATION PAGE")
    return fetch('http://45.42.176.50:5100/api/ProductBarCodes')
    .then((pbcresponse) => pbcresponse.json())
    .then((pbcresponseJson) => {
      console.log("BARCODE RESPONSE")
      console.log(pbcresponseJson)
      barcodeResponse = pbcresponseJson;
      this.saveBarCodeTable(barcodeResponse)
      this.setState({
        barcodes: barcodeResponse,
        syncProgressMessage: 'Barcodes Synced',
        isFetchingBarcodes: false,
        showSyncFooter: true,
      })
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        isFetchingBarcodes: false,
        showSyncFooter: true,
        syncProgressMessage: 'Syncing Failed: ' + error
      })
    });
  }

  FetchProductTable = () => {
    //Product Calls
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/subscriptions')
    //test server call
    console.log("FETCHRPRODUCTTABLE CALLED FROM ACCOUNT INFORMATION PAGE")
    return fetch('http://45.42.176.50:5100/api/Products')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("PRODUCT RESPONSE")
      console.log(responseJson)
      productResponse = responseJson;
      this.saveProductTable(productResponse)

      this.setState({
        products: productResponse,
        lastFetchProductsObject: this.getCurrentDate(),
        syncProgressMessage: 'Products Synced',
        isFetchingProducts: false,
        showSyncFooter: true,
      })
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        isFetchingProducts: false,
        showSyncFooter: true,
        syncProgressMessage: 'Syncing Failed: ' + error
      })
    });
  }

  saveProductTable = (responseproducts) => {
    let savedProducts = products.objects('Products_Lookup')
    let newProducts = responseproducts

    this.setState({
      isFetchingProducts: true,
      syncProgressMessage: "Saving Products",
    })

    if(savedProducts != undefined && savedProducts != null && savedProducts.length > 0) {
      products.write(() => {
        products.deleteAll()
        newProducts.forEach(function(product, i) {
          console.log(product.productModelNumber)
          try {
            products.create('Products_Lookup', {
              licenseNumber: product.licenseNumber,
              productModelNumber: product.productModelNumber,
              orderThruVendor: product.orderThruVendor,
              productDescription: product.productDescription,
              autoReplace: product.autoReplace,
              discontinued: product.discontinued,
              productCategory: product.productCategory,
              hospitalItemNumber: product.hospitalItemNumber,
              unitOfMeasure: product.unitOfMeasure,
              unitOfMeasureQuantity: product.unitOfMeasureQuantity,
              reorderValue: product.reorderValue,
              quantityOnHand: product.quantityOnHand,
              quantityOrdered: product.quantityOrdered,
              lastRequistionNumber: product.lastRequistionNumber,
              orderStatus: product.orderStatus,
              active: product.active,
              accepted: product.accepted,
              consignment: product.consignment,
              minimumValue: product.minimumValue,
              maximumValue: product.maximumValue,
              nonOrdered: product.nonOrdered,
              productNote: product.productNote,
            })
          }
          catch (e) {
            this.setState({
              syncProgressMessage: "Error on product item creation " + i
            })
            console.log(e);
          }
        })
      })
    }
    else {
      products.write(() => {
        newProducts.forEach(function(product, i) {
          console.log(product.productModelNumber)
          try {
            products.create('Products_Lookup', {
              licenseNumber: product.licenseNumber,
              productModelNumber: product.productModelNumber,
              orderThruVendor: product.orderThruVendor,
              productDescription: product.productDescription,
              autoReplace: product.autoReplace,
              discontinued: product.discontinued,
              productCategory: product.productCategory,
              hospitalItemNumber: product.hospitalItemNumber,
              unitOfMeasure: product.unitOfMeasure,
              unitOfMeasureQuantity: product.unitOfMeasureQuantity,
              reorderValue: product.reorderValue,
              quantityOnHand: product.quantityOnHand,
              quantityOrdered: product.quantityOrdered,
              lastRequistionNumber: product.lastRequistionNumber,
              orderStatus: product.orderStatus,
              active: product.active,
              accepted: product.accepted,
              consignment: product.consignment,
              minimumValue: product.minimumValue,
              maximumValue: product.maximumValue,
              nonOrdered: product.nonOrdered,
              productNote: product.productNote,
            })
          }
          catch (e) {
            this.setState({
              syncProgressMessage: "Error on product item creation " + i
            })
            console.log(e);
          }
        })
      })
    }
  }

  saveBarCodeTable = (responsebarcodes) => {
    let savedBarcodes = productBarCodes.objects('Product_Bar_Codes')
    let newBarcodes = responsebarcodes

    this.setState({
      isFetchingBarcodes: true,
      syncProgressMessage: "Saving Barcodes",
    })

    if(savedBarcodes != undefined && savedBarcodes != null && savedBarcodes.length > 0) {
      productBarCodes.write(() => {
        productBarCodes.deleteAll()
        newBarcodes.forEach(function(barcode, i) {
          try {
            productBarCodes.create('Product_Bar_Codes', {
              productBarCode1: barcode.productBarCode1,
              licenseNumber: barcode.licenseNumber,
              productModelNumber: barcode.productModelNumber,
              encoding: barcode.encoding,
            })

          }
          catch (e) {
            this.setState({
              syncProgressMessage: "Error on barcode item creation " + i
            })
            console.log(e);
          }
        })
      })
    }
    else {
      productBarCodes.write(() => {
        newBarcodes.forEach(function(barcode, i) {
          try {
            productBarCodes.create('Product_Bar_Codes', {
              productBarCode1: barcode.productBarCode1,
              licenseNumber: barcode.licenseNumber,
              productModelNumber: barcode.productModelNumber,
              encoding: barcode.encoding,
            })
          }
          catch (e) {
            this.setState({
              syncProgressMessage: "Error on barcode item creation " + i
            })
            console.log(e);
          }
        })
      })
    }
  }

  saveRfidTable = (responserfids) => {
    let savedRfidLabels = rfidLabels.objects('RFID_Labels')
    let newRfidLabels = responserfids
    console.log('SAVE RFID TABLE CALLED')
    this.setState({
      isFetchingLabels: true,
      syncProgressMessage: "Saving Labels",
    })

    if(savedRfidLabels != undefined && savedRfidLabels != null && savedRfidLabels.length > 0) {
      rfidLabels.write(() => {
        rfidLabels.deleteAll()
        newRfidLabels.forEach(function(label, i) {
          if(label.productModelNumber != null && label.productModelNumber != undefined) {
            try {
              rfidLabels.create('RFID_Labels', {
                licenseNumber: label.licenseNumber,
                productModelNumber: label.productModelNumber,
                lotSerialNumber: label.lotSerialNumber,
                expirationDate: label.expirationDate,
                tagid: label.tagid,
              })
            }
            catch (e) {
              this.setState({
                syncProgressMessage:"Error on rfid label creation " + i
              })
              console.log(e);
            }
          }
          else {
            console.log("NULL MODEL NUMBER SKIPPED")
          }
        })
      })
    }
    else {
      rfidLabels.write(() => {
        newRfidLabels.forEach(function(label, i) {
          try {
            rfidLabels.create('RFID_Labels', {
              licenseNumber: label.licenseNumber,
              productModelNumber: label.productModelNumber,
              lotSerialNumber: label.lotSerialNumber,
              expirationDate: label.expirationDate,
              tagid: label.tagid,
            })
          }
          catch (e) {
            console.log("Error on rfid label creation");
            console.log(e);
          }
        })
      })
    }
  }

  FetchRFIDTable = () => {
    //RFID Call
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/subscriptions')
    //test server call
    console.log("FETCHRFIDTABLE CALLED FROM ACCOUNT INFORMATION PAGE")
    return fetch('http://45.42.176.50:5100/api/RfidLabels')
    .then((rfidresponse) => rfidresponse.json())
    .then((rfidresponseJson) => {
      console.log("RFID RESPONSE RECEIVED")
      rfidLabelResponse = rfidresponseJson;
      this.saveRfidTable(rfidLabelResponse)

      this.setState({
        syncProgressMessage: 'RFID Labels Synced',
        isFetchingLabels: false,
        showSyncFooter: false,
      })
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        isFetchingLabels: false,
        showSyncFooter: true,
        syncProgressMessage: 'Syncing Failed: ' + error
      })
    });
  }

  SynchronizeProductTable = () => {
    let productResponse = []
    console.log("SYNCHRONIZE PRODUCT TABLE CALLED")
    this.setState({
      isFetchingProducts: true,
      syncProgressMessage: 'Syncing Products'
    })
    this.FetchProductTable()
    //Save timestamp
    //this.saveCurrentDate()
  }

  SynchronizeBarcodeTable = () => {
    let productResponse = []
    console.log("SYNCHRONIZE BARCODE TABLE CALLED")
    this.setState({
      isFetchingBarcodes: true,
      syncProgressMessage: 'Syncing BarCodes'
    })
    this.FetchBarcodeTable()
  }

  SynchronizeRFIDTable = () => {
    let productResponse = []
    console.log("SYNCHRONIZE RFID TABLE CALLED")
    this.setState({
      isFetchingLabels: true,
      syncProgressMessage: 'Syncing BarCodes'
    })
    this.FetchRFIDTable()
  }

  LoadDummyProductTable = () => {
    let productResponse = DummyProducts

    this.saveProductTable(productResponse)
    //this.saveCurrentDate()
  }

  LoadDummyBarcodeTable = () => {
    let barcodeResponse = DummyBarcodes

    this.saveBarCodeTable(barcodeResponse)
    //this.saveCurrentDate()
  }

  LoadDummyRFIDTable = () => {
    let labelResponse = DummyLabels

    this.saveRfidTable(labelResponse)
    //this.saveCurrentDate()
  }

  LoadDummyDocTable = () => {
    let docResponse = DummyDocs

    this.saveDocTable(docResponse)
  }

  saveDocTable = (docResponse) => {
    let savedDocs = physiciansList.objects('Physicians_List')
    let newDocs = docResponse

    if(savedDocs != undefined && savedDocs != null && savedDocs.length > 0) {
      physiciansList.write(() => {
        physiciansList.deleteAll()
        newDocs.forEach(function(doc, i) {
          try {
            physiciansList.create('Physicians_List', {
              physicianId: doc.physicianId,
              firstName: doc.firstName,
              middleInitial: doc.middleInitial,
              lastName: doc.lastName,
              active: doc.active,
            })
          }
          catch (e) {
            console.log("Error on physician creation");
            console.log(e);
          }
        })
      })
    }
    else {
      physiciansList.write(() => {
        newDocs.forEach(function(doc, i) {
          try {
            physiciansList.create('Physicians_List', {
              physicianId: doc.physicianId,
              firstName: doc.firstName,
              middleInitial: doc.middleInitial,
              lastName: doc.lastName,
              active: doc.active,
            })
          }
          catch (e) {
            console.log("Error on physician creation");
            console.log(e);
          }
        })
      })
    }
  }

  LoadDummyVendorsTable = () => {
    let vendorResponse = DummyVendors

    this.saveVendorsTable(vendorResponse)
  }

  saveVendorsTable = (vendorResponse) => {
    let savedVendors = vendorsList.objects('Vendors_List')
    let newVendors = vendorResponse

    if(savedVendors != undefined && savedVendors != null && savedVendors.length > 0) {
      vendorsList.write(() => {
        vendorsList.deleteAll()
        newVendors.forEach(function(vendor, i) {
          try {
            vendorsList.create('Vendors_List', {
              licenseNumber: vendor.licenseNumber,
              vendorName: vendor.vendorName,
              active: vendor.active,
              accepted: vendor.accepted
            })
          }
          catch (e) {
            console.log("Error on vendor creation");
            console.log(e);
          }
        })
      })
    }
    else {
      vendorsList.write(() => {
        newVendors.forEach(function(vendor, i) {
          try {
            vendorsList.create('Vendors_List', {
              licenseNumber: vendor.licenseNumber,
              vendorName: vendor.vendorName,
              active: vendor.active,
              accepted: vendor.accepted
            })
          }
          catch (e) {
            console.log("Error on vendor creation");
            console.log(e);
          }
        })
      })
    }
  }

  LoadDummySiteTable = () => {
    let siteResponse = DummySites

    this.saveSiteTable(siteResponse)
  }

  saveSiteTable = (siteResponse) => {
    let savedSites = locationsList.objects('Locations_List')
    let newSites = siteResponse

    if(savedSites != undefined && savedSites != null && savedSites.length > 0) {
      locationsList.write(() => {
        locationsList.deleteAll()
        newSites.forEach(function(site, i) {
          try {
            locationsList.create('Locations_List', {
              siteId: site.siteId.toString(),
              siteDescription: site.siteDescription,
              active: site.active,
            })
          }
          catch (e) {
            console.log("Error on site creation");
            console.log(e);
          }
        })
      })
    }
    else {
      locationsList.write(() => {
        newSites.forEach(function(site, i) {
          try {
            locationsList.create('Locations_List', {
              siteId: site.siteId.toString(),
              siteDescription: site.siteDescription,
              active: site.active,
            })
          }
          catch (e) {
            console.log("Error on site creation");
            console.log(e);
          }
        })
      })
    }
  }

  LoadDummyProcedureTable = () => {
    let procedureResponse = DummyProcedures

    this.saveProcedureTable(procedureResponse)
  }

  saveProcedureTable = (procedureResponse) => {
    let savedProcedures = proceduresList.objects('Procedures_List')
    let newProcedures = procedureResponse

    if(savedProcedures != undefined && savedProcedures != null && savedProcedures.length > 0) {
      proceduresList.write(() => {
        proceduresList.deleteAll()
        newProcedures.forEach(function(procedure, i) {
          try {
            proceduresList.create('Procedures_List', {
              procedureCode: procedure.procedureCode,
              procedureDescription: procedure.procedureDescription,
              active: procedure.active,
            })
          }
          catch (e) {
            console.log("Error on procedure creation");
            console.log(e);
          }
        })
      })
    }
    else {
      proceduresList.write(() => {
        newProcedures.forEach(function(procedure, i) {
          try {
            proceduresList.create('Procedures_List', {
              procedureCode: procedure.procedureCode,
              procedureDescription: procedure.procedureDescription,
              active: procedure.active,
            })
          }
          catch (e) {
            console.log("Error on procedure creation");
            console.log(e);
          }
        })
      })
    }
  }

  LoadDummyUserTable = () => {
    let userResponse = DummyUsers

    this.saveUserTable(userResponse)
  }

  saveUserTable = (userResponse) => {
    let savedUsers = usersList.objects('Users_List')
    let newUsers = userResponse

    if(savedUsers != undefined && savedUsers != null && savedUsers.length > 0) {
      usersList.write(() => {
        usersList.deleteAll()
        newUsers.forEach(function(user, i) {
          try {
            usersList.create('Users_List', {
              userId: user.userId,
              userPassword: user.userPassword,
              userName: user.userName,
              scannerCaseAuth: user.scannerCaseAuth,
              scannerLinkAuth: user.scannerLinkAuth,
              scannerInquiryAuth: user.scannerInquiryAuth,
              scannerUtilityAuth: user.scannerUtilityAuth,
              scannerInventoryAuth: user.scannerInventoryAuth,
              scannerCheckInAuth: user.scannerCheckInAuth,
            })
          }
          catch (e) {
            console.log("Error on user creation");
            console.log(e);
          }
        })
      })
    }
    else {
      usersList.write(() => {
        newUsers.forEach(function(user, i) {
          try {
            usersList.create('Users_List', {
              userId: user.userId,
              userPassword: user.userPassword,
              userName: user.userName,
              scannerCaseAuth: user.scannerCaseAuth,
              scannerLinkAuth: user.scannerLinkAuth,
              scannerInquiryAuth: user.scannerInquiryAuth,
              scannerUtilityAuth: user.scannerUtilityAuth,
              scannerInventoryAuth: user.scannerInventoryAuth,
              scannerCheckInAuth: user.scannerCheckInAuth,
            })
          }
          catch (e) {
            console.log("Error on user creation");
            console.log(e);
          }
        })
      })
    }
  }
  SaveVendors
  CheckWorkingForLogout = () => {
    let caseSpace = workingCaseSpace.objects('Working_Case_Space').length
    let scanSpace = workingScanSpace.objects('Working_Scan_Space').length
    console.log("LOGOUT WORKING SPACE CHECK")
    console.log(caseSpace)
    console.log(scanSpace)

    if(caseSpace.toString() === "0" && scanSpace.toString() === "0") {
      this.logoutUser()
    }
    else {
      this.setState({warningModalState: true})
    }
  }

  logoutUser = () => {
    activeUser.write(() => {
      activeUser.deleteAll()
    })
    activeScanableCase.write(() => {
      activeScanableCase.deleteAll()
    })
    workingCaseSpace.write(() => {
      workingCaseSpace.deleteAll()
    })
    workingScanSpace.write(() => {
      workingScanSpace.deleteAll()
    })

    this.props.navigation.navigate('Login')
  }

  RenderWarningModal() {
    if(this.state.warningModalState === true) {
      return(
        <View style={styles.modalBackgroundContainer}>
          <View style={styles.modalInnerContainer}>
            <View style={styles.modalTitleWrapper}>
              <Text style={styles.modalTitleText}>Data Will Be Lost!</Text>
            </View>
            <Text>Logging out now will cause data to be deleted before it has synchronized to your server.</Text>
            <Text>Would you like to continue? </Text>
            <View style={styles.sectionContainer}>
              <View style={styles.modalButtonRow}>
                <View style={styles.majorColumn}>
                  <TouchableOpacity
                    style={styles.miniSubmitButton}
                    onPress={() => this.logoutUser()}>
                    <Text style={styles.miniSubmitButtonText}>Continue</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.majorColumn}>
                  <TouchableOpacity
                    style={styles.miniSubmitButton}
                    onPress={() => this.setState({warningModalState: false})}>
                    <Text style={styles.miniSubmitButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      )
    }
    else {
      return(<View></View>)
    }
  }

  render() {
    let isLoggedIn = activeUser.objects('Active_User')
    if(isLoggedIn.length === 0) {
      return(this.props.navigation.navigate('Login'))
    }
    else {
        let outputProducts = products.objects('Products_Lookup');
        let printProducts = outputProducts.length;
        let outputBarcodes = productBarCodes.objects('Product_Bar_Codes');
        let printBarcodes = outputBarcodes.length;
        let outputLabels = rfidLabels.objects('RFID_Labels');
        let printRFIDLabels = outputLabels.length;
        let outputUsers = usersList.objects('Users_List');
        let printUsers = outputUsers.length;
        let outputVendors = vendorsList.objects('Vendors_List');
        let printVendors = outputVendors.length;
        let outputProcedures = proceduresList.objects('Procedures_List');
        let printProcedures = outputProcedures.length;
        let outputDocs = physiciansList.objects('Physicians_List');
        let printDocs = outputDocs.length;
        let outputSites = locationsList.objects('Locations_List');
        let printSites = outputSites.length;
        return (
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
              <View style={styles.titleRow}>
                <Text style={styles.titleText}>Account Information</Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.bodyTextHeading}>System Information</Text>
                <Text style={styles.bodyText}>
                  <Text style={styles.bodyTextLabel}>System Version: </Text>
                  {this.state.account.organization.systemVersion}
                </Text>
                <Text style={styles.bodyText}>
                  <Text style={styles.bodyTextLabel}>Host Account: </Text>
                  {this.state.account.organization.name}
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.bodyTextHeading}>Customer Service</Text>
                <Text style={styles.bodyText}>
                  <Text style={styles.bodyTextLabel}>Phone: </Text>
                  {this.state.account.organization.customerServicePhone}
                </Text>
                <Text style={styles.bodyText}>
                  <Text style={styles.bodyTextLabel}>Email: </Text>
                  {this.state.account.organization.customerServiceEmail}
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.bodyText}>
                  <Text style={styles.bodyTextLabel}>Current User: </Text>
                  {this.state.user.username}
                </Text>
                <View style={styles.accountCenterWrapper}>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.loginButton}
                      activeOpacity={0.6}
                      onPress={() => this.CheckWorkingForLogout()
                    }>
                      <Text style={styles.loginButtonText}>Log Out</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.bodyTextHeading}>Application Data</Text>
                <View style={styles.errorTextContainer}>
                  <Text style={styles.errorText}>
                    {this.state.syncProgressMessage}
                  </Text>
                </View>
                <View style={styles.tabControlRow}>
                  <View style={styles.leftColumn}>
                    <Text>Product Table</Text>
                    <Text>{printProducts}</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <TouchableOpacity style={this.state.isFetchingProducts ? styles.miniLoadingButton : styles.miniSubmitButton} onPress={() => this.SynchronizeProductTable()} disabled={this.state.isFetchingProducts}><Text style={styles.miniSubmitButtonText}>Sync</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.tabControlRow}>
                  <View style={styles.leftColumn}>
                    <Text>Test Product Data</Text>
                    <Text>{printProducts}</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <TouchableOpacity style={this.state.isFetchingProducts ? styles.miniLoadingButton : styles.miniSubmitButton} onPress={() => this.LoadDummyProductTable()} disabled={this.state.isFetchingProducts}>
                      <Text style={styles.miniSubmitButtonText}>
                        Load
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.tabControlRow}>
                  <View style={styles.leftColumn}>
                    <Text>Barcodes</Text>
                    <Text>{printBarcodes}</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <TouchableOpacity style={this.state.isFetchingBarcodes ? styles.miniLoadingButton : styles.miniSubmitButton} onPress={() => this.SynchronizeBarcodeTable()} disabled={this.state.isFetchingBarcodes}><Text style={styles.miniSubmitButtonText}>Sync</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.tabControlRow}>
                  <View style={styles.leftColumn}>
                    <Text>Test Barcode Data</Text>
                    <Text>{printBarcodes}</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <TouchableOpacity style={this.state.isFetchingBarcodes ? styles.miniLoadingButton : styles.miniSubmitButton} onPress={() => this.LoadDummyBarcodeTable()} disabled={this.state.isFetchingBarcodes}><Text style={styles.miniSubmitButtonText}>Load</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.tabControlRow}>
                  <View style={styles.leftColumn}>
                    <Text>RFID Tags</Text>
                    <Text>{printRFIDLabels}</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <TouchableOpacity style={this.state.isFetchingLabels ? styles.miniLoadingButton : styles.miniSubmitButton} onPress={() => this.SynchronizeRFIDTable()} disabled={this.state.isFetchingLabels}><Text style={styles.miniSubmitButtonText}>Sync</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.tabControlRow}>
                  <View style={styles.leftColumn}>
                    <Text>Test RFID Data</Text>
                    <Text>{printRFIDLabels}</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <TouchableOpacity style={this.state.isFetchingLabels ? styles.miniLoadingButton : styles.miniSubmitButton} onPress={() => this.LoadDummyRFIDTable()} disabled={this.state.isFetchingLabels}><Text style={styles.miniSubmitButtonText}>Load</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.tabControlRow}>
                  <View style={styles.leftColumn}>
                    <Text>Test User Data</Text>
                    <Text>{printUsers}</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <TouchableOpacity style={styles.miniSubmitButton} onPress={() => this.LoadDummyUserTable()}><Text style={styles.miniSubmitButtonText}>Load</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.tabControlRow}>
                  <View style={styles.leftColumn}>
                    <Text>Test Procedure Data</Text>
                    <Text>{printProcedures}</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <TouchableOpacity style={styles.miniSubmitButton} onPress={() => this.LoadDummyProcedureTable()}><Text style={styles.miniSubmitButtonText}>Load</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.tabControlRow}>
                  <View style={styles.leftColumn}>
                    <Text>Test Doc Data</Text>
                    <Text>{printDocs}</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <TouchableOpacity style={styles.miniSubmitButton} onPress={() => this.LoadDummyDocTable()}><Text style={styles.miniSubmitButtonText}>Load</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.tabControlRow}>
                  <View style={styles.leftColumn}>
                    <Text>Test Site Data</Text>
                    <Text>{printSites}</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <TouchableOpacity style={styles.miniSubmitButton} onPress={() => this.LoadDummySiteTable()}><Text style={styles.miniSubmitButtonText}>Load</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.tabControlRow}>
                  <View style={styles.leftColumn}>
                    <Text>Test Vendor Data</Text>
                    <Text>{printVendors}</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <TouchableOpacity style={styles.miniSubmitButton} onPress={() => this.LoadDummyVendorsTable()}><Text style={styles.miniSubmitButtonText}>Load</Text></TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            {this.RenderWarningModal()}
          </ScrollView>
      );
    }
  }
}

import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import CaseProductItem from '../Components/CaseProductItem'

import styles from '../Styles/ContainerStyles.js'

export default class CasesScan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedValue: 0,
      caseInformation: {
        caseNumber: '',
        patientName: '',
        doctor: '',
        location: '',
        procedure: '',
        products: []
      }
    }
  }
  componentDidMount() {
    let caseInformation = this.props.navigation.getParam('caseInformation')
    this.setState({
      caseInformation: caseInformation
    })
    console.log("DATA ENTERING FROM SETUP")
    console.log(caseInformation)
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

  renderCaseProducts() {
    let caseProducts = this.state.caseInformation.products
    let caseProductsOutput = []

    caseProducts.forEach(function(product, index){
      caseProductsOutput.push(
        <CaseProductItem
          name={product.name}
          lotSerial={product.lotSerial}
          model={product.model}
          scannedTime={product.scannedTime}
          manufacturer={product.manufacturer}
          waste={product.waste}
          scanned={product.scanned} />
      )
    })
    return(caseProductsOutput)
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Case Information</Text>
            </View>
            <View style={styles.sectionContainer}>
              <View style={styles.shadedBackgroundWrapper}>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Case Number: </Text>{this.state.caseInformation.number}</Text>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Patient Name: </Text>{this.state.caseInformation.name}</Text>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Doctor: </Text> {this.state.caseInformation.doctor}</Text>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Location: </Text>{this.state.caseInformation.location}</Text>
                <Text style={styles.bodyText}><Text style={styles.bodyTextLabel}>Procedure: </Text>{this.state.caseInformation.procedure}</Text>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              {this.renderCaseProducts()}

              <View style={styles.productListItem}>
                <View style={styles.majorMinorRow}>
                  <View style={styles.majorColumn}>
                    <Text style={styles.productListHeading}>Product Name</Text>
                  </View>
                  <View style={styles.minorColumn}>
                    <Icon style={styles.productStatusIconInactive} name={"barcode"} size={24} color="#333" />
                  </View>
                </View>
                <View style={styles.inactiveListTray}></View>
              </View>
              <View style={styles.productListItem}>
                <View style={styles.majorMinorRow}>
                  <View style={styles.majorColumn}>
                    <Text style={styles.productListHeading}>Product Name</Text>
                  </View>
                  <View style={styles.minorColumn}>
                    <Icon style={styles.productStatusIcon} name={"check-circle-o"} size={24} color="#333" />
                  </View>
                </View>
                <View style={styles.inactiveListTray}></View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <View style={styles.leftColumn}>
            <Text style={styles.bodyTextLabel}>Complete</Text>
            <Text style={styles.bodyTextLabel}>Case Scanning</Text>
          </View>
          <View style={styles.rightColumn}>
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Synchronize</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

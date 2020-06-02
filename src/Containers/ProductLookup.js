import React, {Fragment, Component} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import HeaderLogo from '../Images/insysivLogoHorizontal.png'
import SearchLookupItem from '../Components/SearchLookupItem'

import styles from '../Styles/ContainerStyles.js'

export default class ProductLookup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: "",
      products: {
        products: []
      }
    }
  }
  componentDidMount() {
    this.getProductsData()
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
  scanProductBarcode = (productName) => {
    alert("Pressing this and scanning if such a thing is possible will search the product data set and return a product object for: " + productName)
  }
  getProductsData() {
    let productsResponse = {}
    //emulator call
    //return fetch('http://10.0.2.2:5000/insysiv/api/v1.0/products')
    //test server call
    return fetch('https://insysivtestapi.herokuapp.com/insysiv/api/v1.0/products')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      productsResponse = responseJson.products;
      this.setState({
        products: productsResponse,
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }
  locateProduct = (productName) => {
    alert("Clicking this button will send item barcode to sled to locate with RFID tag for: " + productName)
  }
  lookupProduct = (productName) => {
    alert("Clicking this button will send a request to FDA Lookup Service for: " + productName)
  }
  renderProductSearch() {
    let searchProducts = this.state.products.products
    let searchOutput = []
    let searchTerm = this.state.searchTerm.toUpperCase()
    if(searchProducts != null && searchProducts != undefined && searchTerm != '') {
      searchProducts.forEach(function(product, index) {
        let productName = product.name.toUpperCase()
        let productManf = product.manufacturer.toUpperCase()
        let productMod = product.model.toUpperCase()
        if(productManf.includes(searchTerm) || productName.includes(searchTerm) || productMod.includes(searchTerm)) {
          searchOutput.push(
            <SearchLookupItem
              unknownFlag={false}
              key={"SL" + index}
              name={product.name}
              manufacturer={product.manufacturer}
              model={product.model}
              onOrder={product.onOrder}
              onHand={product.onHand}
              lotSerials={product.lotSerials}
              locateFunction={() => this.locateProduct(product.name)}
              lookupFunction={() => this.lookupProduct(product.name)} />
          )
        }
      }.bind(this));
    }
    if(searchOutput.length <= 0) {
      searchOutput.push(
        <View key={"SL"+0}>
          <View>
            <Text style={styles.noDataText}>No products matched.</Text>
          </View>
          <Text style={styles.noDataText}>Search or Scan an Item to begin.</Text>
        </View>
      )
    }
    return searchOutput
  }

  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>Product Lookup</Text>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.shadedBackgroundWrapper}>
              <Text style={styles.bodyTextLabel}>Search</Text>
              <View style={styles.majorMinorRow}>
                <View style={styles.majorColumn}>
                  <TextInput style={styles.formInput} onChangeText={value => this.setState({searchTerm: value})} />
                </View>
                <View style={styles.minorColumn}>
                  <Text style={styles.seperatorHeading}>Or</Text>
                </View>
                <View style={styles.mediumColumn}>
                  <TouchableOpacity style={styles.submitButton} onPress={() => this.scanProductBarcode("Name of Product")}>
                    {/*Connect to barcode scanner*/}
                    <Text style={styles.submitButtonText}>Scan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.bodyTextLabel}>Results</Text>
            {this.renderProductSearch()}
          </View>
        </View>
      </ScrollView>
    );
  }
}

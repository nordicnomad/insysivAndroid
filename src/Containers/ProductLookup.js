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
      selectedValue: 0,
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
                  <TextInput style={styles.formInput} />
                </View>
                <View style={styles.minorColumn}>
                  <Text style={styles.bodyTextHeading}>Or</Text>
                </View>
                <View style={styles.mediumColumn}>
                  <TouchableOpacity style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Scan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.bodyTextLabel}>Results</Text>

            <SearchLookupItem name="ksdfjksdf" />
          </View>
        </View>
      </ScrollView>
    );
  }
}
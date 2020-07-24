import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  loginLogo: {
    width: 150,
    height: 150,
  },
  hideModal: {
    display: 'none',
  },
  modalBackgroundContainer: {
    backgroundColor: "#000",
    opacity: 0.5,
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    padding: 25 10 25 10, 
  },
  modalInnerContainer: {
    opacity: 1,
    backgroundColor: '#fff',
  },
  textInput: {
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 25,
    paddingTop: 5,
    paddingLeft: 8,
    paddingBottom: 5,
    width: 300,
    fontSize: 22,
  },
  textInputFocus :{
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 1,
    borderBottomColor: '#ed9a1a',
    marginBottom: 25,
    paddingTop: 5,
    paddingLeft: 8,
    paddingBottom: 5,
    width: 300,
    fontSize: 22,
  },
})

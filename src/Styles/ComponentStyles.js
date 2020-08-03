import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  loginLogo: {
    width: 150,
    height: 150,
  },
  bannerBackgroundContainer: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#36ABFC',

  },
  noConnectionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: "bold",
    textAlign: 'left',
  },
  connectionStatusIcon: {
    color: '#fff',
    marginTop: 7,
  },
  bannerRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bannerIconColumn: {
    flexDirection: 'column',
    flex: 1,
    maxWidth: 50,
  },
  bannerTextColumn: {
    flexDirection: 'column',
    flex: 1,
  }
})

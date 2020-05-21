import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  loginContainer: {
    display: 'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  loginLogoRow: {
    paddingTop: 75,
    paddingBottom: 25,
  },
  loginLogo: {
    width: 150,
    height: 150,
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
  formInput: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    marginBottom: 5,
    paddingTop: 5,
    paddingLeft: 8,
    paddingBottom: 5,
    fontSize: 22,
  },
  formInputFocus: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#ed9a1a',
    marginBottom: 5,
    paddingTop: 5,
    paddingLeft: 8,
    paddingBottom: 5,
    fontSize: 22,
  },
  loginLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888',
  },
  loginRow: {
    flex: 1,
  },
  buttonRow: {
    flex: 1,
    paddingTop: 25,
  },
  loginButton: {
    backgroundColor: '#ed9a1a',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    width: 250,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '800',
  },
  container: {
    flex: 1,
    paddingBottom: 125,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleRow: {
    paddingTop: 25,
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
  },
  titleText: {
    fontSize:22,
    fontWeight: '500',
    color: '#333',
    textAlign: 'left',
    width: '100%',
  },
  menuRow: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 25,
    flexWrap: 'wrap',
  },
  menuItem: {
    width: (width / 3),
    marginBottom: 35,
  },
  menuButton: {

  },
  menuButtonDisabled: {

  },
  menuButtonIcon: {
    textAlign: 'center',
    color: '#ed991a'
  },
  menuButtonIconDisabled: {
    textAlign: 'center',
  },
  menuButtonText: {
    textAlign: 'center',
    color: '#102541',
    fontSize: 16,
    marginTop:5,
    fontWeight: "bold",
  },
  menuButtonTextDisabled: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop:5,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: '#ed9a1a',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '800',
  },
  submitButtonAlt: {
    backgroundColor: '#ddd',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  submitButtonTextAlt: {
    color: '#333',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '800',
  },
  miniSubmitWrapper:{
    marginTop:10,
  },
  miniSubmitButton: {
    backgroundColor: '#ed9a1a',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4,
  },
  miniSubmitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '800',
  },
  miniDisabledButton: {
    backgroundColor: '#ccc',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4,
  },
  miniDisableButtonText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '800',
  },
  gateSelectionRow: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
  },
  gateSelectionColumn: {
    flex: 1,
  },
  gateSelectionSection: {
    paddingBottom: 15,
  },
  selectionPickerWrapper: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
  },
  selectionPicker: {
    height: 50,
    width: 175,
  },
  gateSelectionLabel: {
    fontSize: 20,
    color: '#666',
    paddingTop: 12,
  },
  gateRow: {
    paddingTop: 25,
    paddingBottom: 25,
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
  },
  selectedGateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    width: '100%',
  },
  selectedGateTextText: {
    fontWeight: 'normal'
  },
  tabControlRow: {
    flexDirection: 'row',
    display: 'flex',
  },
  tabControlColumn: {
    flex: 1,
  },
  tabControlButton: {
    borderWidth: 1,
    borderColor: '#eee',
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabControlButtonActive: {
    borderWidth: 1,
    backgroundColor:'#ed9a1a',
    borderColor: '#ed9a1a',
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabControlButtonTextActive: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  tabControlButtonText: {
    color: '#ed9a1a',
    textAlign: 'center',
    fontSize: 16,
  },
  tagItem: {
    flex:1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    paddingBottom: 5,
  },
  tagMissingTitle: {
    flex: 2,
    fontSize: 18,
    //color: '#666',
    color: '#0072BB',
  },
  tagMatchedTitle: {
    flex: 2,
    fontSize: 18,
    color: '#8FC93A',
  },
  tagUnexpectedTitle: {
    flex: 2,
    fontSize: 18,
    color: '#FB3640',
  },
  tagDescription: {
    color: '#888',
    fontSize: 16,
  },
  tagGateText: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },

  /* Body Main Styles */
  accountCenterWrapper: {
    display: 'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  shadedBackgroundWrapper: {
    backgroundColor: '#eee',
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 10,
    paddingLeft: 10,
  },
  bodyTextHeading: {
    textAlign: 'left',
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  bodyText: {
    textAlign: 'left',
    fontSize: 18,
    color: '#333',
    fontWeight: "300",
  },
  bodyTextLabel: {
    textAlign: 'left',
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
  },
  bodyTextLabelRight: {
    textAlign: 'right',
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
  },
  emailText: {
    textAlign: 'left',
    fontSize: 18,
    color: '#ed9a1a',
    fontWeight: '700',
  },
  inputTextLabel: {
    textAlign: 'left',
    fontSize: 14,
    color: '#888',
    fontWeight: '700',
  },
  productListHeading: {
    textAlign: 'left',
    fontSize: 20,
    color: '#333',
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  activeProductListHeading: {
    textAlign: 'left',
    fontSize: 20,
    color: '#ed9a1a',
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  productListHeadingRight: {
    textAlign: 'right',
    fontSize: 20,
    color: '#333',
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginLeft: -6,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
  statusTextReady: {
    fontSize:18,
    color: '#8FC93A',
  },
  statusTextWait: {
    fontSize: 18,
    color: '#EE7A38',
  },
  productListItem: {
    marginTop: 10,
  },
  productListTray: {
    display: 'flex',
    backgroundColor: '#f7f7f7',
    padding: 10,
  },
  activeListTray: {
    display: 'flex',
    backgroundColor: '#f7f7f7',
    padding: 10,
    marginTop: -5,
    marginRight: 50,
  },
  inactiveListTray: {
    display: 'none'
  },
  formItemWrapper: {
    marginBottom: 25,
  },
  formTitleWrapper: {
    marginBottom: 15
  },
  formPickerWrapper: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  formPicker: {

  },
  straightRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  majorMinorRow: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  majorColumn: {
    flexDirection: 'column',
    flex: 1,
  },
  minorColumn: {
    flexDirection: 'column',
    width: 50,
  },
  mediumColumn: {
    flexDirection: 'column',
    width: 100,
  },
  countText: {
    textAlign: 'right',
  },
  countTextNumber: {
    fontSize: 24,
    textAlign: "right",
    color: '#0072BB',
  },
  countTextNumberUnkown:{
    fontSize: 24,
    textAlign: "right",
    color: '#FB3640',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    display: 'flex',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexWrap: 'wrap',
    zIndex:9999,
    backgroundColor: '#fff',
  },
  equalColumn: {
    flex: 1,
    marginLeft: 2.5,
    marginRight: 2.5,
  },
  leftColumn: {
    width: (width / 2) - 15,
  },
  rightColumn: {
    width: (width / 2) - 15,
  },
  productStatusIcon: {
    textAlign: 'center',
    color: '#ed991a'
  },
  productStatusIconInactive: {
    textAlign: 'center',
    color: '#333'
  },
  trayItemWrapper: {
    marginBottom: 10,
  },
  trayLabel: {
    textAlign: 'left',
    fontSize: 14,
    color: '#888',
    fontWeight: 'bold',
  },
  trayText: {
    textAlign: 'left',
    fontSize: 14,
    color: '#333',
    fontWeight: "300",
  },

  /* Old inventory scan styles */
  scrollView: {
    backgroundColor: '#f7f7f7',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: '#fff',
  },
  sectionContainer: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#666',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  cellularWarningActive: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#EE7A38'
  },
  cellularWarning: {
    display: 'none',
  },
  bluetoothWarningActive: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#36ABFC'
  },
  bluetoothWarning: {
    display: 'none',
  }
});

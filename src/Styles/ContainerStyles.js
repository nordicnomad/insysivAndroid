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
  gateSelectionPickerWrapper: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
  },
  gateSelectionPicker: {
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

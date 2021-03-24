# insysivAndroid

## Installation

### Clone Repository
git clone https://github.com/nordicnomad/insysivAndroid.git

### install node modules
yarn


## InsysivAndroid cast to tethered device

### Start packager
yarn start

### Check tethered device is detected
adb devices

### Cast android app to device
react-native run-android --variant=release


## Fix React-Native-Zebra-Scanner Bug
open node-modules hidden folder in text editor.
open react-native-zebra-scanner/src/ZebraScanner.android.js

make line 8 "const scanListeners = []" instead read "let scanListeners = []"

without this fix old listeners will not be closed during navigation and scanned
items will be duplicated.

## Setup Zebra TC-52 Device for usage

### DataWedge Profile
Open DataWedge application on device
Select menu in top right corner, and New profile if an Insysiv profile is not present

Select the following boxes / ensure they are selected / have correct values.
- Profile Enabled
Applications
- ensure * com.insysivzebra is in the applications list
Barcode Input
- Enabled
- Hardware Trigger
- Configure Scanner settings (under Scan Params, set Decode Audio Feedback to none)
SimulScan input
- Hardware Trigger
Keystroke output
- Enabled
Intent output
- Enabled
- Intent Action (enter com.insysivzebra.ACTION)
- Intent delivery (ensure reads "Broadcast intent")

### TC-52 settings
Open Settings application, Display, Advanced
- Set Sleep to "After 30 minutes of inactivity"
- Set Wake-Up Sources to check RIGHT_TRIGGER_1 and LEFT_TRIGGER_2

## Troubleshooting

### Hardware trigger not scanning
Ensure the DataWedge profile is set up correctly by following the instructions above.
Then turn the scanner on and off (reset usually works, but hard shut down may be required) again to reassociate the scanner profile to the application.
Generally a crash in the application or new deployment to the device will require a restart to get the profile to work.

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from './src/Containers/Login';
import Home from './src/Containers/Home';

import InventoryScan from './src/Containers/InventoryScan';
import CasesSetup from './src/Containers/CasesSetup';
import CasesScan from './src/Containers/CasesScan';
import AccountInfo from './src/Containers/AccountInfo';
import IntakeScan from './src/Containers/IntakeScan';
import ProductLookup from './src/Containers/ProductLookup';
import ReportLowstock from './src/Containers/ReportLowstock';
import ReportAutoreceipt from './src/Containers/ReportAutoreceipt';
import ReportExpiring from './src/Containers/ReportExpiring';
import ReportBackorder from './src/Containers/ReportBackorder';
import ReportReconcile from './src/Containers/ReportReconcile';

const AppNavigator = createStackNavigator({
  Login: {
    screen: Login
  },
  Home: {
    screen: Home,
    title: 'Select Option',
  },
  InventoryScan: {
    screen: InventoryScan,
    title: 'Inventory Scan'
  },
  CasesSetup: {
    screen: CasesSetup,
    title: 'Cases Setup'
  },
  CasesScan: {
    screen: CasesScan,
    title: 'Cases Scan'
  },
  AccountInfo: {
    screen: AccountInfo,
    title: 'Account Info'
  },
  IntakeScan: {
    screen: IntakeScan,
    title: 'Intake Scan'
  },
  ProductLookup: {
    screen: ProductLookup,
    title: 'Product Lookup'
  },
  ReportLowstock: {
    screen: ReportLowstock,
    title: 'Low Stock Alerts'
  },
  ReportAutoreceipt: {
    screen: ReportAutoreceipt,
    title: 'Auto Receipt Report'
  },
  ReportExpiring: {
    screen: ReportExpiring,
    title: 'Expiring Items Report'
  },
  ReportBackorder: {
    screen: ReportBackorder,
    title: 'Back Order Report'
  },
  ReportReconcile: {
    screen: ReportReconcile,
    title: 'Trash Reconciliation Report'
  },
}, { headerMode: 'screen'});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from './src/Containers/Login';
import Home from './src/Containers/Home';
import Scan from './src/Containers/InventoryScan';
import Gate from './src/Containers/InventoryGate';

const AppNavigator = createStackNavigator({
  Login: {
    screen: Login
  },
  Home: {
    screen: Home,
    title: 'Select Option',
  },
  Gate: {
    screen: Gate,
    title: 'Select Gate'
  },
  Scan: {
    screen: Scan,
    title: 'Inventory Scan'
  },
}, { headerMode: 'screen'});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;

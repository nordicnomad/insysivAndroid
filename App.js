/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import {
  AppRegistry,
  View,
  Text,
  Button,
} from 'react-native';
import AppNavigator from './AppNavigator';

export default class App extends React.Component {
  render() {
    return (
      <AppNavigator/>
    );
  }
}

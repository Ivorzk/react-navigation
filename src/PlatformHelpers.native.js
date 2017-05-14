/* @flow */

import { BackAndroid, Platform, NativeModules } from 'react-native';

const LinkingManager = Platform.OS === 'android' ?
  NativeModules.IntentAndroid : NativeModules.LinkingManager;

let Linking = null;

if (LinkingManager) {
  Linking = require('react-native').Linking;
} else {
  Linking = {
    addEventListener: () => {},
    removeEventListener: () => {},
    getInitialURL: () => Promise.reject('Unsupported platform'),
  };
}
export { BackAndroid, Linking };

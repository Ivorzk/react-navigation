import Navigator from 'native-navigation';
import React, { Component, PropTypes } from 'react';

import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const ROOT_SCREEN_NAME = 'ScreenOne';

export default function RegisterAppStack(input) {
  debugger;
  const {routeConfigs, navigatorConfig} = input;
  let defaultScreen = navigatorConfig.initialRouteName || Object.keys(routeConfigs)[0];
  const nativeScreenNames = {};
  Object.keys(routeConfigs).forEach(routeName => {
    const nativeScreenName = defaultScreen === routeName ? ROOT_SCREEN_NAME : routeName;
    nativeScreenNames[routeName] = nativeScreenName;
    const routeConfig = routeConfigs[routeName];
    const ScreenComponent = routeConfig.screen;
    const navOptions = ScreenComponent.navigationOptions;
    class NativeScreen extends Component {
      state = null;
      constructor(props) {
        super();
        this.state = {
          routeName,
          params: props.initialParams || {},
          id: props.nativeNavigationInstanceId,
        };
      }
      dispatch = (action) => {
        if (action.type === NavigationActions.BACK) {
          Navigator.pop();
        } else if (action.type === NavigationActions.SET_PARAMS) {
          this.setState(state => ({
            params: {...state.params, ...action.params},
          }));
        } else if (action.type === NavigationActions.NAVIGATE) {
          Navigator.push(action.routeName, {initialParams: action.params});
        } else {
          console.error('dispatch cannot handle type '+action.type);
        }
      };
      getNavigation = () => {
        return addNavigationHelpers({
          state: this.state,
          dispatch: this.dispatch,
        });
      }
      render () {
        const navigation = this.getNavigation();
        function getOption(name) {
          let val = navOptions[name];
          if (typeof val === 'function') {
            val = val(navigation);
          }
          return val;
        }
        return (
          <Navigator.Config
            rightTitle={getOption('rightTitle')}
            onRightPress={getOption('onRightPress')}
            title={getOption('title')}
          >
            <View>
              <Navigator.Spacer animated />
              <ScreenComponent
                navigation={this.getNavigation()}
              />
            </View>
          </Navigator.Config>
        );
      }
    }
    Navigator.registerScreen(nativeScreenName, () => NativeScreen);
  });
}

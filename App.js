import React, { Component } from 'react';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator,createDrawerNavigator, DrawerItems} from 'react-navigation';
import HomeScreen from './screens/HomeScreen';

const MainStack = createStackNavigator({
  Home: {screen: HomeScreen}
},
{
  initialRouteName: 'Home',
});

const AppContainer = createAppContainer(MainStack);

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  static navigationOptions = { 
    header: null,
  };

  render() {
    return <AppContainer />
  }
}

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {
  addPostScreen,
  contactScreen,
  dashboardScreen,
  selfInfoScreen,
  loginScreen,
  privacyScreen,
  verificationEmailScreen,
} from '../constants/Screens';
import SelfInfoScreen from '../screens/Self/SelfInfoScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import PostInfoScreen from '../screens/Post/PostContentScreen';
import {headerHidden} from './navigationsoptions';
import PrivacyScreen from '../screens/Privacy/PrivacyScreen';
import ContactScreen from '../screens/Contact/ContactScreen';
import strings from '../constants/strings.json';
import EmailVerificationScreen from '../screens/EmailVerification/EmailVerificationScreen';
import {getGeoLocation, getUserUniqueID} from '../helpers/functions';
import loginDataService from '../appwrite/login';
import {Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

const Stack = createNativeStackNavigator();

function MainStackScreen(): JSX.Element {
  const linking = {
    prefixes: ['http://localhost:3000/', 'http://rohitpakhrin.com.np/'],
    config: {
      screens: {
        dashboardScreen: '',
        selfInfoScreen: 'myself',
        loginScreen: loginScreen,
        // adminDashboardScreen: '?:id/Search',
        NotFound: '*',
      },
    },
  };

  const getGeoLogin = async () => {
    const unique = await getUserUniqueID();
    if (unique) {
      const response = await getGeoLocation();
      const prevRecord = await loginDataService.getPrevLoginLocation(
        response?.data.ip,
      );
      if (prevRecord?.documents?.length === 0) {
        await loginDataService.postLoginLocation({
          ...response?.data,
          unique_id: unique,
          device: Platform.OS,
        });
      } else {
        await loginDataService.increaseCount(prevRecord?.documents[0]);
      }
    }
  };

  useEffect(() => {
    Platform.OS !== 'web' && SplashScreen.hide();
    getGeoLogin();
  }, []);

  return (
    <NavigationContainer
      documentTitle={{
        formatter: (options, route) =>
          `${options?.title ?? route?.name} - ${strings.name}`,
      }}
      linking={linking}>
      <Stack.Navigator
        screenOptions={headerHidden}
        initialRouteName={dashboardScreen}>
        <Stack.Screen name={dashboardScreen} component={DashboardScreen} />
        <Stack.Screen name={selfInfoScreen} component={SelfInfoScreen} />
        <Stack.Screen name={loginScreen} component={LoginScreen} />
        <Stack.Screen name={addPostScreen} component={PostInfoScreen} />
        <Stack.Screen name={privacyScreen} component={PrivacyScreen} />
        <Stack.Screen name={contactScreen} component={ContactScreen} />
        <Stack.Screen
          name={verificationEmailScreen}
          component={EmailVerificationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainStackScreen;

import React from 'react';
import {useTheme} from '../../context/theme/useTheme';
import CustomText from '../common/CustomText';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Theme} from '../../constants/Types';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {selfInfoScreen, privacyScreen} from '../../constants/Screens';

const DashboardButtonGroup = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const goSelfInfoScreen = () => {
    navigation.navigate(selfInfoScreen);
  };

  const goToPrivacyScreen = () => {
    navigation.navigate(privacyScreen);
  };

  // const goToContactScreen = () => {
  //   navigation.navigate(contactScreen);
  // };

  return (
    <View style={styles(theme).container}>
      <TouchableOpacity
        onPress={goSelfInfoScreen}
        style={[styles(theme).items, styles(theme).borderRight]}>
        <CustomText style={styles(theme).text} type="p1" title="Me" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={goToPrivacyScreen}
        style={[styles(theme).items]}>
        <CustomText style={styles(theme).text} type="p1" title="Privacy" />
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={goToContactScreen} style={styles(theme).items}>
        <CustomText style={styles(theme).text} type="p1" title="Contact" />
      </TouchableOpacity> */}
    </View>
  );
};
const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginBottom: theme.sizes.large,
      backgroundColor: theme.colors.modal_background_color,
      borderRadius: theme.sizes.border_radius,
    },
    items: {
      alignItems: 'center',
      paddingVertical: theme.sizes.small,
      borderRightColor: theme.colors.white,
      flex: 1,
    },
    borderRight: {
      borderRightWidth: 1,
    },
    text: {
      color: theme.colors.white,
    },
  });
export default DashboardButtonGroup;

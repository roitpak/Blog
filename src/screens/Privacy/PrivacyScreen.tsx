import React from 'react';
import CustomText from '../../components/common/CustomText';
import Wrapper from '../../components/common/Wrapper';
import strings from '../../constants/strings.json';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../context/theme/useTheme';
import {Theme} from '../../constants/Types';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from '../../assets/Icon';

function PrivacyScreen(): JSX.Element {
  const {theme} = useTheme();

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <Wrapper>
      <View style={styles(theme).container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            icon={'arrow-left2'}
            size={theme.sizes.extra_extra_large}
            color={theme.colors.text_color}
          />
        </TouchableOpacity>
        <CustomText type="p1" title={strings.privacyPolicy} />
      </View>
    </Wrapper>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.sizes.extra_extra_large * 5,
      alignItems: 'flex-start',
    },
  });
export default PrivacyScreen;

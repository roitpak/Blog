import React, {useEffect, useState} from 'react';
import CustomText from '../../components/common/CustomText';
import Wrapper from '../../components/common/Wrapper';
// import strings from '../../constants/strings.json';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useTheme} from '../../context/theme/useTheme';
import {Theme} from '../../constants/Types';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from '../../assets/Icon';
import authService from '../../appwrite/auth';
import {useModal} from '../../context/modal/useModal';
import strings from '../../constants/StringsIndex';
import Button from '../../components/common/Button';
import {BUTTON_TYPES} from '../../constants/Constants';
import {loginScreen} from '../../constants/Screens';
import {useUser} from '../../context/user/useUser';

function EmailVerificationScreen({route}: any): JSX.Element {
  const {theme} = useTheme();
  const {openModal} = useModal();
  const {user} = useUser();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlObj = new URL(route.params.url);
    const urlParams = new URLSearchParams(urlObj.search);
    const secret = urlParams.get('secret');
    const userId = urlParams.get('userId');

    userId &&
      secret &&
      authService
        .verifyUser(userId, secret)
        .then(response => {
          console.log('Response--->', response);
          setLoading(false);
          setSuccess(true);
        })
        .catch(err => {
          if (err instanceof Error) {
            openModal({title: 'Sign in', subTitle: err.message});
          } else {
            openModal({title: 'Sign in', subTitle: 'Unknown error occurred'});
          }
          navigation.replace(loginScreen);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(success, loading);
  }, [success, loading]);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const navigateToScreen = () => {
    if (user) {
      console.log('navigated to user');
      navigation.goBack();
      return;
    }
    navigation.replace(loginScreen);
  };

  return (
    <Wrapper>
      <View style={styles(theme).container}>
        <View style={styles(theme).content}>
          {loading && (
            <>
              <ActivityIndicator
                color={theme.colors.text_color}
                size={'large'}
              />
              <CustomText type="p1" title={strings.verificationInProcess} />
            </>
          )}
          {!loading && success && (
            <>
              <Icon icon="check" color={theme.colors.text_color} size={20} />
              <CustomText type="p1" title={strings.emailVerifiedSuccessfully} />
              <Button
                buttonStyle={styles(theme).button}
                type={BUTTON_TYPES.filled}
                title={user ? 'Go back' : 'Login'}
                onPress={navigateToScreen}
              />
            </>
          )}
        </View>
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
    content: {
      flex: 1,
      alignItems: 'center',
    },
    button: {
      marginTop: theme.sizes.large,
    },
  });
export default EmailVerificationScreen;

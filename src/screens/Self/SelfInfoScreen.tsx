import React from 'react';
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {dashboardScreen, loginScreen} from '../../constants/Screens';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useUser} from '../../context/user/useUser';
import Button from '../../components/common/Button';
import {BUTTON_TYPES} from '../../constants/Constants';
import {useTheme} from '../../context/theme/useTheme';
import Wrapper from '../../components/common/Wrapper';
import CustomText from '../../components/common/CustomText';
import strings from '../../constants/strings.json';
import links from '../../constants/links.json';
import {Theme} from '../../constants/Types';
import portrait from '../../assets/img/portrait.png';
import Icon from '../../assets/Icon';

function SelfInfoScreen(): JSX.Element {
  const {isDarkMode, changeTheme, theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const goToLoginScreen = () => {
    navigation.navigate(loginScreen);
  };
  const goToDashboardScreen = () => {
    navigation.navigate(dashboardScreen);
  };

  const {user} = useUser();
  return (
    <Wrapper>
      <View style={styles(theme).container}>
        <View style={styles(theme).titleContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              icon={'arrow-left2'}
              size={theme.sizes.extra_extra_large}
              color={theme.colors.text_color}
            />
          </TouchableOpacity>
          <CustomText title={strings.name} type={'h1'} />
        </View>
        <Icon
          onPress={changeTheme}
          icon={isDarkMode ? 'sun' : 'contrast'}
          size={theme.sizes.large}
          color={theme.colors.text_color}
        />
      </View>
      <View style={styles(theme).imageTextContainer}>
        <View style={styles(theme).textContainer}>
          <CustomText type="p1" title={strings.introMessage1} />
          <CustomText type="h1" title={`${strings.name},`} />
          <CustomText bold type="p1" title={strings.introMessage2} />
        </View>
        <Image
          style={
            Platform.OS === 'web' ? styles(theme).imageWeb : styles(theme).image
          }
          source={portrait}
        />
      </View>
      <CustomText
        style={styles(theme).introMessageStyle}
        type="p2"
        title={strings.introParagraph}
      />
      <View style={styles(theme).linksContainer}>
        <Icon
          onPress={() => Linking.openURL(links.github)}
          style={styles(theme).linkIcons}
          icon="github"
          size={theme.sizes.extra_large}
          color={theme.colors.text_color}
        />
        <Icon
          onPress={() => Linking.openURL(links.linkedIn)}
          style={styles(theme).linkIcons}
          icon="linkedin"
          size={theme.sizes.extra_large}
          color={theme.colors.text_color}
        />
        <Icon
          onPress={() => Linking.openURL(`mailto:${links.mail}`)}
          style={styles(theme).linkIcons}
          icon="mail"
          size={theme.sizes.extra_large}
          color={theme.colors.text_color}
        />
        <Icon
          onPress={() => Linking.openURL(links.youTube)}
          style={styles(theme).linkIcons}
          icon="youtube"
          size={theme.sizes.extra_large}
          color={theme.colors.text_color}
        />
        <Icon
          onPress={() => Linking.openURL(links.linkTree)}
          icon="linktree"
          size={theme.sizes.extra_large}
          color={theme.colors.text_color}
        />
      </View>

      <View style={styles(theme).bottomContainer}>
        {user ? (
          <CustomText
            type="h2"
            title={`${strings.hi} ${user.name}. ${strings.feelsGood}`}
          />
        ) : (
          <Button title={strings.goToLogin} onPress={goToLoginScreen} />
        )}
        <Button
          buttonStyle={styles(theme).buttonStyle}
          type={BUTTON_TYPES.filled}
          title={strings.goToDashboard}
          onPress={goToDashboardScreen}
        />
      </View>
    </Wrapper>
  );
}
const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    imageTextContainer: {
      flexDirection: 'row',
      marginTop: theme.sizes.large,
      marginBottom: theme.sizes.extra_small,
    },
    textContainer: {
      flex: 0.6,
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
    },
    image: {
      flex: 1,
      resizeMode: 'cover',
    },
    imageWeb: {
      flex: 1,
      height: 300,
      resizeMode: 'contain',
      alignSelf: 'flex-end',
    },
    introMessageStyle: {
      textAlign: 'justify',
    },
    linksContainer: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      margin: theme.sizes.extra_extra_large,
    },
    linkIcons: {
      marginRight: theme.sizes.small,
    },
    buttonStyle: {
      marginTop: theme.sizes.medium,
    },
    bottomContainer: {
      alignItems: 'center',
    },
    titleContainer: {
      marginTop: theme.sizes.small,
      alignItems: 'flex-start',
    },
  });

export default SelfInfoScreen;

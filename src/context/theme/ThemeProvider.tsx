import React, {FC, PropsWithChildren, useEffect, useState} from 'react';
import {ThemeContext} from './ThemeContext';
import {DarkTheme, LightTheme} from '../../constants/ThemeValue';
import {useColorScheme} from 'react-native';
import {DARK_MODE, LIGHT_MODE} from '../../constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_VALUE = 'themeMode';

export const ThemeProvider: FC<PropsWithChildren> = ({children}) => {
  const isDarkMode = useColorScheme() === DARK_MODE;
  const [darkMode, setDarkMode] = useState(isDarkMode);

  const changeTheme = async () => {
    await AsyncStorage.setItem(THEME_VALUE, darkMode ? LIGHT_MODE : DARK_MODE);
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    startUpTheme();
  });

  const startUpTheme = async () => {
    const themeValue = await AsyncStorage.getItem(THEME_VALUE);
    setDarkMode(themeValue === DARK_MODE ? true : false);
  };

  const getTheme = () => {
    if (darkMode) {
      return DarkTheme;
    } else {
      return LightTheme;
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: getTheme(),
        changeTheme,
        isDarkMode: darkMode,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

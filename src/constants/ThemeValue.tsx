import {Platform} from 'react-native';
import {Theme} from './Types';

const sizes = {
  extra_extra_small: 3,
  extra_small: 5,
  small: 10,
  medium: 15,
  large: 20,
  extra_large: 25,
  extra_extra_large: 30,
  border_radius: 10,
  button_width: Platform.OS === 'web' ? 200 : '100%',
  input_width: Platform.OS === 'web' ? 200 : '100%',
  text: {
    h1: 24,
    h2: 18,
    p1: 17,
    p2: 13,
    p3: 11,
    p4: 10,
  },
};

const defaultColors = {
  negative: '#FD291D',
  positive: '#137c26',
  neutral: '#FF8700',
  gray: '#555',
  white: '#FFFFFF',
  grayDarker: '#1a1a1a',
  grayDarker2: '#949494',
  grayLighter: '#D0CFD3',
  grayLighter2: '#e7e7e7',
  transparent: 'transparent',
  blackOpacity01: 'rgba(0,0,0,.1)',
  blackOpacity02: 'rgba(0,0,0,.2)',
  blackOpacity06: 'rgba(0,0,0,.6)',
  blackOpacity08: 'rgba(0,0,0,.8)',
  modal_background_color: 'rgba(52, 52, 52, 0.8)',
};

export const DarkTheme: Theme = {
  sizes: sizes,
  colors: {
    background_color: '#333333',
    text_color: '#f5f5f5',
    headers: '#6c757d',
    button_text: '#3d9bff',
    button_text_filled: '#f5f5f5',
    button_background: '#3d9bff',
    button_border: '#3d9bff',
    button_disabled: '#696969',
    button_disabled_text: '#424242',
    links: '#6c757d',
    accent_color: '#28a745',
    list_border: '#4a4a4a',
    gradient_colors: ['#424242', '#3b3a3a', '#2E2E2E'],
    ...defaultColors,
  },
};

export const LightTheme: Theme = {
  sizes: sizes,
  colors: {
    background_color: '#f5f5f5',
    text_color: '#333333',
    headers: '#3d9bff',
    button_text: '#3d9bff',
    button_text_filled: '#f5f5f5',
    button_background: '#3d9bff',
    button_border: '#3d9bff',
    button_disabled: '#dcdcdc',
    button_disabled_text: '#696969',
    links: '#3d9bff',
    accent_color: '#28a745',
    gradient_colors: ['#f5f5f5', '#cfcccc', '#bdbbbb'],
    list_border: '#b0b0b0',
    ...defaultColors,
  },
};

import {Asset} from 'react-native-image-picker';

export interface Sizes {
  extra_extra_small: number;
  extra_small: number;
  small: number;
  medium: number;
  large: number;
  extra_large: number;
  extra_extra_large: number;
  border_radius: number;
  button_width: string | number;
  input_width: string | number;
  text: TextSizes;
}

export interface TextSizes {
  h1: number;
  h2: number;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
}

export type TextTypes = 'h1' | 'h2' | 'p1' | 'p2' | 'p3' | 'p4' | 'error';

export interface Colors {
  background_color: string;
  text_color: string;
  headers: string;
  button_text: string;
  button_text_filled: string;
  button_background: string;
  button_border: string;
  button_disabled: string;
  button_disabled_text: string;
  links: string;
  accent_color: string;
  gradient_colors: string[];
  negative: string;
  positive: string;
  neutral: string;
  gray: string;
  white: string;
  grayDarker: string;
  grayDarker2: string;
  grayLighter: string;
  grayLighter2: string;
  transparent: string;
  blackOpacity01: string;
  blackOpacity02: string;
  blackOpacity06: string;
  blackOpacity08: string;
  modal_background_color: string;
  list_border: string;
}
export interface Theme {
  sizes: Sizes;
  colors: Colors;
}
export type ThemeMode = 'light' | 'dark';

export type BottomTypes = 'filled' | 'outlined' | 'text';

export interface User {
  $createdAt: string;
  $id: string;
  $updatedAt: string;
  accessedAt: string;
  email: string;
  emailVerification: boolean;
  labels: [string];
  name: string;
  passwordUpdate: string;
  phone: string;
  phoneVerification: boolean;
  prefs: {};
  registration: string;
  status: boolean;
}

export interface PostContent {
  title: string;
  subtitle: string;
  content_type: 'code' | 'text';
  image_id?: string | null;
  image?: File | Asset | null | undefined;
  content: string;
  postID: string;
}

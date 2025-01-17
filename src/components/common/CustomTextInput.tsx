import React from 'react';
import {
  DimensionValue,
  KeyboardType,
  KeyboardTypeIOS,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
} from 'react-native';
import {Theme} from '../../constants/Types';
import {useTheme} from '../../context/theme/useTheme';
import CustomText from './CustomText';

interface CustomInputProps {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<TextStyle>;
  keyboardType?: KeyboardType | KeyboardTypeIOS;
  markAsRequired?: boolean;
  secureTextEntry?: boolean;
  numberOfLines?: number;
  autoCapitalize?: 'characters' | 'none' | 'sentences' | 'words' | undefined;
  multiline?: boolean;
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
}

function CustomTextInput({
  value,
  placeholder,
  onChangeText,
  style,
  keyboardType,
  markAsRequired,
  secureTextEntry,
  numberOfLines,
  autoCapitalize,
  multiline,
  autoFocus,
  onSubmitEditing,
}: CustomInputProps): JSX.Element {
  const {theme} = useTheme();

  return (
    <View style={styles(theme).container}>
      <TextInput
        onSubmitEditing={onSubmitEditing}
        placeholderTextColor={theme.colors.button_disabled_text}
        autoFocus={autoFocus}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={[styles(theme).textInput, style]}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        numberOfLines={numberOfLines}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
      />
      {markAsRequired && (
        <CustomText style={styles(theme).textStyle} title="*" type={'error'} />
      )}
    </View>
  );
}

export default CustomTextInput;

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width:
        Platform.OS === 'web'
          ? null
          : (theme.sizes.input_width as DimensionValue),
    },
    textInput: {
      flex: 1,
      color: theme.colors.text_color,
      borderWidth: 1,
      borderColor: theme.colors.button_border,
      fontSize: theme.sizes.text.p2,
      alignItems: 'center',
      padding: theme.sizes.small,
      borderRadius: theme.sizes.border_radius,
    },
    textStyle: {
      position: 'absolute',
      top: -7,
      right: -7,
    },
  });

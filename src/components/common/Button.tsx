import React, {ReactNode} from 'react';
import {
  ActivityIndicator,
  DimensionValue,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {BottomTypes, Theme} from '../../constants/Types';
import {useTheme} from '../../context/theme/useTheme';
import {BUTTON_TYPES} from '../../constants/Constants';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  type?: BottomTypes;
}

function Button({
  title,
  onPress,
  loading, //is not shown when disabled
  iconLeft,
  iconRight,
  buttonStyle,
  textStyle,
  type = BUTTON_TYPES.filled,
  disabled,
}: ButtonProps): JSX.Element {
  const {theme} = useTheme();

  const returnStyle = () => {
    switch (type) {
      case BUTTON_TYPES.filled:
        return {
          container: {...styles(theme, disabled).filledStyleContainer},
          text: styles(theme, disabled).filledStyleText,
        };
      case BUTTON_TYPES.outlined:
        return {
          container: {...styles(theme, disabled).outlinedStyleContainer},
          text: styles(theme, disabled).outlinedStyleText,
        };
      case BUTTON_TYPES.text:
        return {
          container: {...styles(theme, disabled).textStyleContainer},
          text: styles(theme, disabled).textStyleText,
        };
      default:
        return {
          container: {...styles(theme, disabled).filledStyleContainer},
          text: styles(theme, disabled).filledStyleText,
        };
    }
  };
  const onPressTouchable = () => {
    if (loading || disabled) {
      return;
    }
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        returnStyle().container,
        // disabled && {backgroundColor: theme.colors.button_disabled},
        buttonStyle,
      ]}
      onPress={onPressTouchable}>
      <>
        {loading && !disabled ? (
          <ActivityIndicator
            size={'small'}
            color={
              type === BUTTON_TYPES.filled
                ? theme.colors.button_text_filled
                : theme.colors.button_text
            }
          />
        ) : (
          <View style={styles(theme).contentStyle}>
            {iconLeft}
            {title && (
              <Text style={[returnStyle().text, textStyle]}>{title}</Text>
            )}
            {iconRight}
          </View>
        )}
      </>
    </TouchableOpacity>
  );
}

export default Button;

const styles = (theme: Theme, disabled?: boolean) =>
  StyleSheet.create({
    filledStyleContainer: {
      borderRadius: theme.sizes.border_radius,
      width: theme.sizes.button_width as DimensionValue,
      padding: theme.sizes.small,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: disabled
        ? theme.colors.button_disabled
        : theme.colors.button_background,
    },
    outlinedStyleContainer: {
      borderWidth: 1,
      borderRadius: theme.sizes.border_radius,
      borderColor: disabled
        ? theme.colors.button_disabled
        : theme.colors.button_border,
      width: theme.sizes.button_width as DimensionValue,
      padding: theme.sizes.small,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textStyleContainer: {
      borderRadius: theme.sizes.border_radius,
      width: theme.sizes.button_width as DimensionValue,
      padding: theme.sizes.small,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filledStyleText: {
      fontSize: 13,
      color: disabled
        ? theme.colors.button_disabled_text
        : theme.colors.button_text_filled,
    },
    outlinedStyleText: {
      fontSize: 13,
      color: disabled
        ? theme.colors.button_disabled_text
        : theme.colors.button_text,
    },
    textStyleText: {
      fontSize: 13,
      color: disabled
        ? theme.colors.button_disabled_text
        : theme.colors.button_text,
    },
    contentStyle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

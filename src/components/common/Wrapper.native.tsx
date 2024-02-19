import React, {PropsWithChildren, ReactElement, forwardRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTheme} from '../../context/theme/useTheme';
import LinearGradient from 'react-native-linear-gradient';
import {Theme} from '../../constants/Types';
import {Dimensions} from '../../helpers/Dimensions';

interface WrapperProps extends PropsWithChildren {
  scrollEnabled?: boolean;
  refreshControl?: ReactElement;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollViewStyle?: ViewStyle;
  floatingContent?: ReactElement;
}

const Wrapper = forwardRef<any, WrapperProps>(
  (
    {
      scrollEnabled,
      refreshControl,
      children,
      style,
      contentContainerStyle,
      scrollViewStyle,
      floatingContent,
    },
    ref,
  ) => {
    // const scrollViewRef = useRef(null);
    const {theme, isDarkMode} = useTheme();

    return (
      <SafeAreaView>
        <LinearGradient
          style={containerStyle()}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={theme.colors.gradient_colors}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={
              isDarkMode ? theme.colors.grayDarker2 : theme.colors.white
            }
          />
          <View style={style}>
            <KeyboardAwareScrollView
              style={scrollViewStyle}
              contentContainerStyle={[
                styles(theme).scrollContainer,
                contentContainerStyle,
              ]}
              scrollEnabled={scrollEnabled}
              ref={ref}
              refreshControl={refreshControl}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View>{children}</View>
            </KeyboardAwareScrollView>
          </View>
          {floatingContent}
        </LinearGradient>
      </SafeAreaView>
    );
  },
);

export default Wrapper;

const styles = (theme: Theme) =>
  StyleSheet.create({
    scrollContainer: {
      padding: theme.sizes.extra_extra_large,
    },
  });

const containerStyle = () => ({
  height: Dimensions.windowHeight,
  width: Dimensions.windowWidth,
});

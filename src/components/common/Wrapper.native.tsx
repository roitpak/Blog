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
  contentAboveScrollable?: ReactElement;
  showsVerticalScrollIndicator?: boolean;
}

const Wrapper = forwardRef<any, WrapperProps>(
  (
    {
      scrollEnabled = true,
      refreshControl,
      children,
      style,
      contentContainerStyle,
      scrollViewStyle,
      floatingContent,
      contentAboveScrollable,
      showsVerticalScrollIndicator = false,
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
            {contentAboveScrollable}
            {scrollEnabled ? (
              <KeyboardAwareScrollView
                style={scrollViewStyle}
                contentContainerStyle={[
                  styles(theme).scrollContainer,
                  contentContainerStyle,
                ]}
                scrollEnabled={scrollEnabled}
                ref={ref}
                refreshControl={refreshControl}
                showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                <View>{children}</View>
              </KeyboardAwareScrollView>
            ) : (
              <View
                style={[styles(theme).scrollContainer, contentContainerStyle]}>
                {children}
              </View>
            )}
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
      paddingTop: theme.sizes.medium,
      paddingHorizontal: theme.sizes.extra_extra_large,
      paddingBottom: theme.sizes.extra_extra_large,
    },
  });

const containerStyle = () => ({
  height: Dimensions.windowHeight,
  width: Dimensions.windowWidth,
});

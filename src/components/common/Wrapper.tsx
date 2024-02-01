import React, {PropsWithChildren, ReactElement, forwardRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from '../../context/theme/useTheme';
import {Theme} from '../../constants/Types';
// import {Dimensions} from '../../helpers/Dimensions';

interface WrapperProps extends PropsWithChildren {
  scrollEnabled?: boolean;
  refreshControl?: ReactElement;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollViewStyle?: ViewStyle;
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
    },
    ref,
  ) => {
    const {theme} = useTheme();
    return (
      <SafeAreaView>
        <div style={containerStyle(theme)}>
          <View style={style}>
            <ScrollView
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
            </ScrollView>
          </View>
        </div>
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

const containerStyle = (theme: Theme) => ({
  backgroundImage: `linear-gradient(to bottom right, ${theme.colors.gradient_colors[0]}, ${theme.colors.gradient_colors[1]}, ${theme.colors.gradient_colors[2]})`,
  width: '100%',
  height: '100%',
});

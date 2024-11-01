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
  floatingContent?: ReactElement;
  contentAboveScrollable?: ReactElement;
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
      contentAboveScrollable,
    },
    ref,
  ) => {
    const {theme} = useTheme();
    return (
      <SafeAreaView>
        {contentAboveScrollable}
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
          {floatingContent}
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
      paddingBottom: theme.sizes.extra_extra_large * 8,
      maxWidth: 800,
      alignSelf: 'center',
    },
  });

const containerStyle = (theme: Theme) => ({
  backgroundImage: `linear-gradient(to bottom right, ${theme.colors.gradient_colors[0]}, ${theme.colors.gradient_colors[1]}, ${theme.colors.gradient_colors[2]})`,
  width: '100%',
  height: '100%',
});

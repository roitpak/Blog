import React from 'react';
import {useTheme} from '../../context/theme/useTheme';
import CustomText from '../common/CustomText';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Theme} from '../../constants/Types';
import Icon from '../../assets/Icon';

interface PaginationButtonProps {
  onLoadMore?: () => void | undefined;
  currentPage: number;
  loading?: boolean;
}

const PaginationButton = ({
  onLoadMore,
  currentPage,
  loading,
}: PaginationButtonProps) => {
  const {theme} = useTheme();

  return (
    <View style={styles(theme).container}>
      <CustomText
        style={styles(theme).text}
        type="p1"
        title={currentPage?.toString()}
      />
      {loading && (
        <ActivityIndicator size={'small'} color={theme.colors.button_text} />
      )}
      {onLoadMore && (
        <TouchableOpacity style={styles(theme).item} onPress={onLoadMore}>
          <CustomText style={styles(theme).text} type="p1" title="Load more" />
          <Icon
            icon={'arrow-down'}
            size={theme.sizes.large}
            color={theme.colors.text_color}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: theme.sizes.medium,
      width: '100%',
    },
    text: {
      color: theme.colors.text_color,
    },
    item: {
      alignItems: 'center',
      flexDirection: 'row',
    },
  });
export default PaginationButton;

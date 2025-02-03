import React from 'react';
import {useTheme} from '../../context/theme/useTheme';
import CustomText from '../common/CustomText';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Theme} from '../../constants/Types';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {postContentScreen} from '../../constants/Screens';
import {Post} from '../../appwrite/types/posts';
import {formatDate} from '../../helpers/functions';
import strings from '../../constants/strings.json';
import Icon from '../../assets/Icon';
import Status from '../post/enum/PostStatusEnum';

interface AddPostModalProps {
  item: Post;
  onPostStatusChange: (item: Post, status: Status) => void;
  loading: boolean;
}

const BlogItem = ({item}: AddPostModalProps) => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const onPressItem = () => {
    navigation.navigate(postContentScreen, item);
    return;
  };

  return (
    <TouchableOpacity onPress={onPressItem} style={styles(theme).container}>
      <View style={styles(theme).titleContainer}>
        <CustomText title={item?.title} type={'h1'} />
      </View>
      {item?.$createdAt && (
        <View style={styles(theme).timeContainer}>
          <Icon
            icon={'clock'}
            size={theme.sizes.medium}
            color={theme.colors.text_color}
          />
          <CustomText
            title={formatDate(new Date(item?.$createdAt))}
            type="p2"
          />
        </View>
      )}
      <View style={styles(theme).categoryContainer}>
        {item?.category.map(title => (
          <View key={title} style={styles(theme).category}>
            <CustomText title={title} type="p3" />
          </View>
        ))}
      </View>
      <View style={styles(theme).continueReading}>
        <CustomText
          style={styles(theme).continueText}
          title={strings.continueReading}
          type="p3"
        />
        <Icon
          icon={'play3'}
          size={theme.sizes.small}
          color={theme.colors.button_text}
        />
      </View>
    </TouchableOpacity>
  );
};
const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginTop: theme.sizes.medium,
      marginBottom: theme.sizes.large,
      borderBottomColor: theme.colors.list_border,
      borderBottomWidth: 1,
      paddingBottom: theme.sizes.extra_extra_small,
    },
    titleContainer: {
      marginBottom: theme.sizes.extra_extra_small,
    },
    category: {
      paddingHorizontal: theme.sizes.extra_small,
      paddingVertical: theme.sizes.extra_extra_small,
      borderColor: theme.colors.list_border,
      borderWidth: 1,
      borderRadius: theme.sizes.border_radius,
      alignContent: 'center',
      justifyContent: 'center',
      marginRight: theme.sizes.extra_small,
    },
    categoryContainer: {
      flexDirection: 'row',
      marginTop: theme.sizes.extra_extra_small,
    },
    continueReading: {
      marginTop: theme.sizes.extra_extra_small,
      flexDirection: 'row',
      alignItems: 'center',
    },
    continueText: {
      color: theme.colors.button_text,
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
export default BlogItem;

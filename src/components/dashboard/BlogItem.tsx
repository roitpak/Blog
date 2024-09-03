import React from 'react';
import {useTheme} from '../../context/theme/useTheme';
import CustomText from '../common/CustomText';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Theme} from '../../constants/Types';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {addPostScreen, postContentScreenV2} from '../../constants/Screens';
import {Post} from '../../appwrite/types/posts';
import {formatDate} from '../../helpers/functions';
import strings from '../../constants/strings.json';
import Icon from '../../assets/Icon';
import {useUser} from '../../context/user/useUser';
import PostStatusButton from '../post/PostStatusButton';
import Status from '../post/enum/PostStatusEnum';

interface AddPostModalProps {
  item: Post;
  onPostStatusChange: (item: Post, status: Status) => void;
  loading: boolean;
}

const BlogItem = ({item, onPostStatusChange, loading}: AddPostModalProps) => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const onPressItem = () => {
    if (item.contents.length > 0) {
      navigation.navigate(addPostScreen, item);
    } else {
      navigation.navigate(postContentScreenV2, item);
    }
  };

  const {isAdmin} = useUser();

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
      {isAdmin && (
        <PostStatusButton
          loading={loading}
          onChange={(status: Status) => onPostStatusChange(item, status)}
          status={item.status ? item.status : Status.pending}
        />
      )}
    </TouchableOpacity>
  );
};
const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginTop: theme.sizes.large,
    },
    titleContainer: {
      marginBottom: theme.sizes.extra_extra_small,
    },
    category: {
      padding: theme.sizes.extra_small,
      borderColor: theme.colors.button_border,
      borderWidth: 1.5,
      borderRadius: 2,
      alignContent: 'center',
      justifyContent: 'center',
      marginRight: theme.sizes.extra_extra_small,
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

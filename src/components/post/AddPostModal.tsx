import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {postContentScreen} from '../../constants/Screens';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useUser} from '../../context/user/useUser';
import postService from '../../appwrite/posts';
import {useModal} from '../../context/modal/useModal';
import {Post} from '../../appwrite/types/posts';
import CustomTextInput from '../common/CustomTextInput';
import CustomText from '../common/CustomText';
import Button from '../common/Button';
import {Theme} from '../../constants/Types';
import {useTheme} from '../../context/theme/useTheme';
import strings from '../../constants/strings.json';
import Icon from '../../assets/Icon';
import categoryService from '../../appwrite/category';
import {Category} from '../../appwrite/types/category';
import {useDebounce} from '../../helpers/functions';

interface AddPostModalProps {
  showAddPost: boolean;
  close: () => void;
}

function AddPostModal({showAddPost, close}: AddPostModalProps): JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [postTitle, setPostTitle] = useState('');
  const [category, setCategory] = useState<string[]>([]);
  const [tempCategory, setTempCategory] = useState('');
  const tempCategoryDebounce = useDebounce(tempCategory, 200);

  const [loading, setLoading] = useState(false);
  const [searchedCategory, setSearchedCategory] = useState<Category[] | null>(
    null,
  );
  console.log('🚀 ~ AddPostModal ~ searchedCategory:', searchedCategory);
  const {user} = useUser();
  const {openModal} = useModal();
  const {theme} = useTheme();

  const closeModal = () => {
    setPostTitle('');
    setCategory([]);
    setLoading(false);
    close();
  };

  useEffect(() => {
    const fetchCategory = async (searchCategory: string) => {
      categoryService
        .getCategory(searchCategory)
        .then(fetchedCategory => {
          console.log('fetched', fetchedCategory);
          setSearchedCategory(fetchedCategory);
        })
        .catch(err => {
          console.log('Error on category', err);
        });
    };
    fetchCategory(tempCategoryDebounce);
  }, [tempCategoryDebounce]);

  const addPost = async () => {
    setLoading(true);
    const data: Post = {
      title: postTitle.toString(),
      category: category,
      uploadedBy: user?.$id.toString(),
      contents: [],
      content: '',
      likes: [],
    };
    await postService
      .createPost(data)
      .then(response => {
        closeModal();
        if (response) {
          navigation.navigate(postContentScreen, response);
        }
      })
      .catch(err => {
        closeModal();
        console.log(err);
        if (err instanceof Error) {
          openModal({title: err.message});
        } else {
          openModal({title: 'Unknown error occurred'});
        }
      });
  };

  const onPressCategoryItem = (i: number) => {
    setCategory(prevCategory => {
      return prevCategory.filter((_, index) => index !== i);
    });
  };

  const addCategory = () => {
    if (!tempCategory) {
      return;
    }
    setCategory(prevCategory => [...prevCategory, tempCategory]);
    setTempCategory('');
  };

  const setTempCategoryDebounce = (value: string) => {
    setTempCategory(value);
  };

  return (
    <Modal transparent animationType="fade" visible={showAddPost}>
      <TouchableOpacity onPress={close} style={styles(theme).touchable}>
        <TouchableWithoutFeedback>
          <View style={styles(theme).content}>
            <View style={styles(theme).contentContainer}>
              <CustomText title={strings.newPost} type={'h1'} />
            </View>
            <CustomTextInput
              multiline
              style={styles(theme).titleContainer}
              placeholder={'Title'}
              value={postTitle}
              onChangeText={value => setPostTitle(value)}
            />
            <View style={styles(theme).contentContainer}>
              <CustomText title={'Category'} type={'h2'} />
              <CustomText title={strings.categorySubtitle} type={'p2'} />
              <View>
                <CustomTextInput
                  onSubmitEditing={addCategory}
                  markAsRequired
                  style={styles(theme).contentContainer}
                  value={tempCategory}
                  onChangeText={value => setTempCategoryDebounce(value)}
                  placeholder={strings.egNodeJS}
                />
                <TouchableOpacity
                  onPress={addCategory}
                  style={styles(theme).addContainer}>
                  <CustomText type={'p1'} title={strings.addCategory} />
                  <Icon
                    onPress={addCategory}
                    size={theme.sizes.large}
                    color={theme.colors.text_color}
                    icon="plus"
                  />
                </TouchableOpacity>
                {searchedCategory && searchedCategory?.length > 0 && (
                  <View style={styles(theme).searchedCategoryView}>
                    <FlatList
                      data={searchedCategory}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          onPress={() => setTempCategory(item.title)}>
                          <CustomText
                            title={`${item.title} (${item.posts.length})`}
                            type={'p2'}
                          />
                        </TouchableOpacity>
                      )}
                      keyExtractor={item => item.$id}
                    />
                  </View>
                )}
              </View>
              {category && (
                <View style={styles(theme).categoryContainer}>
                  {category.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => onPressCategoryItem(index)}
                      style={styles(theme).category}>
                      <CustomText title={item} type={'p2'} />
                      <View style={styles(theme).crossIcon}>
                        <Icon
                          onPress={() => onPressCategoryItem(index)}
                          size={theme.sizes.medium}
                          color={theme.colors.button_background}
                          icon="cross"
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View style={styles(theme).contentContainer}>
              <Button
                disabled={postTitle.length === 0}
                loading={loading}
                title={'Add post'}
                onPress={addPost}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}
const styles = (theme: Theme) =>
  StyleSheet.create({
    touchable: {
      flex: 1,
      backgroundColor: 'rgba(52, 52, 52, 0.8)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.sizes.extra_large,
    },
    content: {
      backgroundColor: theme.colors.background_color,
      paddingHorizontal: theme.sizes.large,
      paddingBottom: theme.sizes.large,
      borderRadius: theme.sizes.border_radius,
    },
    contentContainer: {
      marginTop: theme.sizes.medium,
    },
    titleContainer: {
      marginTop: theme.sizes.medium,
      height: Platform.OS === 'web' ? 100 : null,
      maxHeight: 300,
    },
    categoryContainer: {
      flexDirection: 'row',
      marginTop: theme.sizes.large,
    },
    category: {
      padding: theme.sizes.extra_extra_small,
      borderColor: theme.colors.text_color,
      borderWidth: 1,
      borderRadius: 2,
      alignContent: 'center',
      justifyContent: 'center',
      marginRight: theme.sizes.large,
    },
    crossIcon: {top: -10, right: -22, position: 'absolute'},
    addContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.sizes.medium,
    },
    searchedCategoryView: {
      position: 'absolute',
      left: 0,
      bottom: -theme.sizes.extra_extra_large,
      backgroundColor: theme.colors.background_color,
      borderRadius: theme.sizes.border_radius,
      padding: theme.sizes.medium,
      borderWidth: 1,
      borderColor: theme.colors.text_color,
    },
  });

export default AddPostModal;

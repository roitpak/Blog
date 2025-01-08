import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Theme} from '../../constants/Types';
import {BUTTON_TYPES} from '../../constants/Constants';
import postService from '../../appwrite/posts';
import {useModal} from '../../context/modal/useModal';
import CustomText from '../../components/common/CustomText';
import Button from '../../components/common/Button';
import Wrapper from '../../components/common/Wrapper';
import {useTheme} from '../../context/theme/useTheme';
import {useUser} from '../../context/user/useUser';
import PostStatusButton from '../../components/post/PostStatusButton';
import Status from '../../components/post/enum/PostStatusEnum';
import VideoUrlComponent from '../../components/post/VideoUrlComponent';
import TLDRComponent from '../../components/post/TLDRComponent';
import Icon from '../../assets/Icon';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Clipboard from '@react-native-clipboard/clipboard';
import GithubLink from '../../components/post/GithubLink';
import {formatDate, sanitizeRichText} from '../../helpers/functions';
import {PostMetrics} from '../../appwrite/types/post_metrics';
import postMetricsService from '../../appwrite/postMetrics';
import RichTextEditor from '../../components/common/RichTextEditor';
import {Post} from '../../appwrite/types/posts';
import HtmlRenderer from '../../components/post/HtmlRenderer';

function PostContentScreen({route}: any): JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [post, setPost] = useState<Post>(route.params);
  const [postMetrics, setPostMetrics] = useState<PostMetrics>();
  const {isAdmin, user} = useUser();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(
    !post.content || post.content.length === 0 ? true : false,
  );
  const [showMenu, setShowMenu] = useState(false);

  const {theme} = useTheme();

  useEffect(() => {
    setPost(route.params);
    postMetricsService.getPostMetrics(route?.params?.$id).then(response => {
      if (response.length > 0) {
        setPostMetrics(response[0]);
      }
    });
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  const {openModal} = useModal();

  const onChangePostContent = (value: string) => {
    setPost(prev => ({
      ...prev,
      content: value,
    }));
  };

  const getPost = async () => {
    if (!post.$id) {
      return;
    }
    await postService
      .getPost(post.$id)
      .then(response => {
        setPost(response as unknown as Post);
      })
      .catch(err => {
        if (err instanceof Error) {
          openModal({title: err.message});
        } else {
          openModal({title: 'Unknown error occurred'});
        }
      });
  };

  const onPressSavePost = async () => {
    setLoading(true);
    setIsEditing(false);
    await postService
      .updatePost(post?.$id ?? '', {
        ...post,
        content: sanitizeRichText(post.content),
      })
      .then(() => {
        console.log('Post saved successfully');
        // setPost(response as unknown as Post);
      })
      .catch(err => openModal({title: err?.message}));
    setLoading(false);
  };

  const onPostStatusChange = async (status: Status) => {
    setLoading(true);
    await postService
      .updatePost(post?.$id ?? '', {...post, status: status})
      .then(response => {
        setPost(response as unknown as Post);
      })
      .catch(err => openModal({title: err?.message}));
    setLoading(false);
  };

  const onPostVideoUrlChange = async (url: string) => {
    setLoading(true);
    await postService
      .updatePost(post?.$id ?? '', {...post, videoUrl: url})
      .then(response => {
        setPost(response as unknown as Post);
      })
      .catch(err => openModal({title: err?.message}));
    setLoading(false);
  };

  const onPostTLDRUpdate = async (value: string) => {
    setLoading(true);
    await postService
      .updatePost(post?.$id ?? '', {...post, tldr: value})
      .then(response => {
        console.log(response);
        setPost(response as unknown as Post);
      })
      .catch(err => openModal({title: err?.message}));
    setLoading(false);
  };

  const onGithubURLUpdate = async (value: string) => {
    setLoading(true);
    await postService
      .updatePost(post?.$id ?? '', {...post, githubUrl: value})
      .then(response => {
        console.log(response);
        setPost(response as unknown as Post);
      })
      .catch(err => openModal({title: err?.message}));
    setLoading(false);
  };

  const onLikePost = async () => {
    if (user?.$id && postMetrics) {
      let newPostMEtrics;
      if (postMetrics?.likes?.indexOf(user?.$id) > -1) {
        newPostMEtrics = {
          ...postMetrics,
          likes: postMetrics.likes.filter(id => id !== user?.$id),
        };
      } else {
        newPostMEtrics = {
          ...postMetrics,
          likes: [...postMetrics.likes, user?.$id],
        };
      }
      postMetricsService.updatePostMetrics({
        $id: postMetrics.$id,
        likes: newPostMEtrics.likes,
      });
      setPostMetrics(newPostMEtrics);
    } else {
      openModal({title: 'Please login to like this post'});
    }
  };

  const onPressShare = () => {
    Clipboard.setString('https://www.rohitpakhrin.com.np?id=' + post.$id);
    openModal({title: 'Link Copied, You can share it now.'});
  };

  const onPressEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  return (
    <Wrapper
      showsVerticalScrollIndicator={true}
      contentAboveScrollable={
        <View style={styles(theme).header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              icon={'arrow-left2'}
              size={theme.sizes.large}
              color={theme.colors.text_color}
            />
          </TouchableOpacity>
          <View style={styles(theme).headerRight}>
            <View>
              <Button
                buttonStyle={styles(theme).saveButtonStyle}
                title="Share"
                iconLeft={
                  <Icon
                    containerStyle={styles(theme).shareIconContainerStyle}
                    icon={'share'}
                    size={theme.sizes.medium}
                    color={theme.colors.button_text}
                  />
                }
                type={BUTTON_TYPES.outlined}
                onPress={onPressShare}
              />
            </View>
            {isEditing && isAdmin && (
              <View>
                <Button
                  buttonStyle={styles(theme).saveButtonStyle}
                  title="Save"
                  type={BUTTON_TYPES.filled}
                  onPress={onPressSavePost}
                  loading={loading}
                />
              </View>
            )}
            {post.status !== Status.published && isAdmin && (
              <View>
                <Button
                  buttonStyle={styles(theme).saveButtonStyle}
                  title="Publish"
                  type={BUTTON_TYPES.filled}
                  onPress={() => onPostStatusChange(Status.published)}
                  loading={loading}
                />
              </View>
            )}
            <View>
              <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
                <Icon
                  icon={'menu'}
                  size={theme.sizes.large}
                  color={theme.colors.text_color}
                />
              </TouchableOpacity>
              {showMenu && (
                <View style={styles(theme).menuStyle}>
                  <TouchableOpacity onPress={onPressEdit}>
                    <CustomText title={'Edit'} type={'p1'} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      }
      style={styles(theme).container}>
      <View style={styles(theme).titleContainer}>
        <View style={styles(theme).titleWithTime}>
          <CustomText
            style={styles(theme).postTitle}
            title={post.title}
            type={'h1'}
          />
          <View style={styles(theme).timeAndViews}>
            <CustomText
              style={styles(theme).date}
              title={
                ' · ' +
                formatDate(new Date(post?.$createdAt as unknown as string))
              }
              type={'p2'}
            />
            {postMetrics && (
              <View style={styles(theme).timeAndViews}>
                <Icon
                  icon={'eye'}
                  size={theme.sizes.medium}
                  color={theme.colors.text_color}
                />
                <CustomText title={' ' + postMetrics?.views} type={'p2'} />
              </View>
            )}
          </View>
        </View>
        {postMetrics && (
          <View style={styles(theme).likesContainer}>
            <View style={styles(theme).smilesContainer}>
              <CustomText
                title={postMetrics && postMetrics.likes.length.toString()}
                type="p1"
              />
              <Icon
                onPress={onLikePost}
                icon={'smile'}
                size={theme.sizes.large}
                color={
                  user?.$id &&
                  postMetrics &&
                  postMetrics.likes.indexOf(user?.$id) > -1
                    ? theme.colors.positive
                    : theme.colors.text_color
                }
              />
            </View>
            <>
              <Icon
                onPress={onPressShare}
                icon={'link'}
                size={theme.sizes.large}
                color={theme.colors.text_color}
              />
            </>
          </View>
        )}
      </View>
      {loading && (
        <ActivityIndicator
          style={styles(theme).indicator}
          size={'small'}
          color={theme.colors.text_color}
        />
      )}
      {isAdmin && (
        <PostStatusButton
          loading={loading}
          onChange={(status: Status) => onPostStatusChange(status)}
          status={post.status ? post.status : Status.pending}
        />
      )}
      {(post.githubUrl || isEditing) && (
        <GithubLink
          loading={loading}
          onChange={newUrl => onGithubURLUpdate(newUrl)}
          url={post.githubUrl as unknown as string}
        />
      )}
      {(post?.videoUrl || isEditing) && (
        <VideoUrlComponent
          loading={loading}
          url={post?.videoUrl as unknown as string}
          onUrlChange={(url: string) => onPostVideoUrlChange(url)}
        />
      )}
      {(post?.tldr || isEditing) && (
        <TLDRComponent
          loading={loading}
          onChange={value => onPostTLDRUpdate(value)}
          content={post?.tldr as unknown as string}
        />
      )}
      <View style={styles(theme).contentContainer}>
        {isEditing ? (
          <RichTextEditor
            onChangeText={onChangePostContent}
            value={post.content}
          />
        ) : (
          <HtmlRenderer content={post.content} />
        )}
      </View>
    </Wrapper>
  );
}
const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingBottom: theme.sizes.extra_extra_large * 2,
      paddingTop: theme.sizes.large,
    },
    headerContainer: {
      marginBottom: theme.sizes.medium,
    },
    postTitle: {
      marginBottom: theme.sizes.extra_extra_small,
    },
    buttonStyle: {
      alignSelf: 'center',
      marginBottom: theme.sizes.medium,
      marginTop: theme.sizes.extra_extra_large,
    },
    indicator: {
      marginTop: theme.sizes.medium,
    },
    titleContainer: {
      marginTop: theme.sizes.small,
      alignItems: 'flex-start',
    },
    titleWithTime: {
      marginVertical: theme.sizes.large,
    },
    timeAndViews: {
      flexDirection: 'row',
    },
    date: {
      marginRight: theme.sizes.small,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      flex: 1,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.sizes.large,
      paddingVertical: theme.sizes.extra_small,
      zIndex: 10,
      backgroundColor: theme.colors.background_color,
    },
    saveButtonStyle: {
      paddingVertical: theme.sizes.extra_small,
      paddingHorizontal: theme.sizes.small,
    },
    headerRight: {
      alignContent: 'flex-end',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.sizes.extra_small,
    },
    menuStyle: {
      position: 'absolute',
      bottom: -40,
      left: -50,
      backgroundColor: theme.colors.background_color,
      padding: theme.sizes.small,
      width: 80,
      alignItems: 'flex-end',
      borderRadius: theme.sizes.border_radius,
    },
    shareIconContainerStyle: {
      padding: 0,
    },
    contentContainer: {
      marginTop: theme.sizes.medium,
    },
    likesContainer: {
      flex: 1,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      paddingVertical: theme.sizes.extra_small,
      borderColor: theme.colors.list_border,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.sizes.small,
      marginBottom: theme.sizes.small,
    },
    smilesContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
  });

export default PostContentScreen;

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {PostContent, Theme} from '../../constants/Types';
import NewPostComponent from '../../components/post/NewPostComponent';
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
import {formatDate} from '../../helpers/functions';
import {PostMetrics} from '../../appwrite/types/post_metrics';
import postMetricsService from '../../appwrite/postMetrics';
import RichTextEditor from '../../components/common/RichTextEditor';

function PostContentScreenV2({route}: any): JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [post, setPost] = useState(route.params);
  const [postMetrics, setPostMetrics] = useState<PostMetrics>();
  const [newPostData, setNewPostData] = useState<PostContent | null>(null);
  const {isAdmin} = useUser();

  const [loading, setLoading] = useState(false);
  const [updatingPost, setUpdatingPost] = useState(false);

  const {theme} = useTheme();

  useEffect(() => {
    setPost(route.params);
    postMetricsService.getPostMetrics(route?.params?.$id).then(response => {
      if (response.length > 0) {
        setPostMetrics(response[0]);
      }
    });
  }, [route]);

  const onChange = (value: PostContent) => {
    setNewPostData(value);
  };

  const {openModal} = useModal();

  //   const onAdd = () => {
  //     setNewPostData({
  //       title: '',
  //       subtitle: '',
  //       content_type: TEXT_POST_TYPE,
  //       content: '',
  //       postID: post.$id,
  //     });
  //   };

  const onSave = async () => {
    if (newPostData) {
      setUpdatingPost(true);
      await postService
        .createPostContent(newPostData, post)
        .then(() => {
          setUpdatingPost(false);
          getPost();
          setNewPostData(null);
        })
        .catch(err => {
          setUpdatingPost(false);
          if (err instanceof Error) {
            openModal({title: err.message});
          } else {
            openModal({title: 'Unknown error occurred'});
          }
        });
    }
  };

  const getPost = async () => {
    await postService
      .getPost(post.$id)
      .then(response => {
        setPost(response);
      })
      .catch(err => {
        if (err instanceof Error) {
          openModal({title: err.message});
        } else {
          openModal({title: 'Unknown error occurred'});
        }
      });
  };

  const onPostStatusChange = async (status: Status) => {
    setLoading(true);
    await postService
      .updatePost(post?.$id ?? '', {...post, status: status})
      .then(response => {
        setPost(response);
      })
      .catch(err => openModal({title: err?.message}));
    setLoading(false);
  };

  const onPostVideoUrlChange = async (url: string) => {
    setLoading(true);
    await postService
      .updatePost(post?.$id ?? '', {...post, videoUrl: url})
      .then(response => {
        setPost(response);
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
        setPost(response);
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
        setPost(response);
      })
      .catch(err => openModal({title: err?.message}));
    setLoading(false);
  };

  const onPressShare = () => {
    Clipboard.setString('https://www.rohitpakhrin.com.np/' + post.$id);
    openModal({title: 'Link Copied, You can share it now.'});
  };

  return (
    <Wrapper style={styles(theme).container}>
      <View style={styles(theme).titleContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            icon={'arrow-left2'}
            size={theme.sizes.extra_extra_large}
            color={theme.colors.text_color}
          />
        </TouchableOpacity>
        <View style={styles(theme).titleWithTime}>
          <CustomText
            style={styles(theme).postTitle}
            title={post.title}
            type={'h1'}
          />
          <View style={styles(theme).timeAndViews}>
            <CustomText
              style={styles(theme).date}
              title={' · ' + formatDate(new Date(post?.$createdAt))}
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
      <GithubLink
        loading={loading}
        onChange={newUrl => onGithubURLUpdate(newUrl)}
        url={post.githubUrl}
      />
      <VideoUrlComponent
        loading={loading}
        url={post?.videoUrl}
        onUrlChange={(url: string) => onPostVideoUrlChange(url)}
      />
      {newPostData && (
        <NewPostComponent
          loading={updatingPost}
          newPost={newPostData}
          onChange={onChange}
          onSave={onSave}
        />
      )}
      <RichTextEditor />
      <TLDRComponent
        loading={loading}
        onChange={value => onPostTLDRUpdate(value)}
        content={post?.tldr}
      />
      <Button
        buttonStyle={styles(theme).buttonStyle}
        title="Share"
        type={BUTTON_TYPES.filled}
        onPress={onPressShare}
        iconRight={
          <Icon
            icon="share2"
            size={theme.sizes.large}
            color={theme.colors.button_text_filled}
          />
        }
      />
    </Wrapper>
  );
}
const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingBottom: theme.sizes.extra_extra_large * 2,
    },
    headerContainer: {
      marginBottom: theme.sizes.medium,
    },
    postTitle: {
      marginBottom: theme.sizes.extra_extra_small,
    },
    buttonStyle: {
      alignSelf: 'center',
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
  });

export default PostContentScreenV2;

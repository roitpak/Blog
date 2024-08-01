import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {useUser} from '../../context/user/useUser';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {
  addPostScreen,
  loginScreen,
  privacyScreen,
  verificationEmailScreen,
} from '../../constants/Screens';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ADMIN_LABEL} from '../../constants/Constants';
import {Post} from '../../appwrite/types/posts';
import {useModal} from '../../context/modal/useModal';
import postService from '../../appwrite/posts';
import AddPostModal from '../../components/post/AddPostModal';
import Wrapper from '../../components/common/Wrapper';
import CustomText from '../../components/common/CustomText';
import Button from '../../components/common/Button';
import strings from '../../constants/strings.json';
import Icon from '../../assets/Icon';
import {useTheme} from '../../context/theme/useTheme';
import {Theme} from '../../constants/Types';
import DarkModeButton from '../../components/common/DarkModeButton';
import DashboardButtonGroup from '../../components/dashboard/DashboardButtonGroup';
import BlogItem from '../../components/dashboard/BlogItem';
import Status from '../../components/post/enum/PostStatusEnum';
import {getValueFromUrl} from '../../helpers/functions';
import postMetricsService from '../../appwrite/postMetrics';
// import Markdown from 'react-native-markdown-display';
//TODO

function DashboardScreen(): JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {user, isAdmin, logout} = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const {openModal, closeModal} = useModal();
  const {theme} = useTheme();
  const [showAddPost, setShowAddPost] = useState(false);

  const [loading, setLoading] = useState(false);

  const goToSign = () => navigation.navigate(loginScreen);

  const addPost = () => setShowAddPost(true);

  const logUserOut = () => {
    openModal({
      title: strings.logoutText,
      buttons: [
        {label: 'Cancel', onClick: () => closeModal()},
        {
          label: 'Log out',
          onClick: () => {
            logout();
            closeModal();
          },
        },
      ],
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      postMetricsService.createPostMetrics('669e2f148b04084c5792');
      getPosts();
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    Linking.getInitialURL().then(async (url: string | null) => {
      const id = getValueFromUrl(url);
      if (id === 'verify') {
        navigation.navigate(verificationEmailScreen, {url: url});
        return;
      }
      if (id === 'PrivacyScreen') {
        navigation.navigate(privacyScreen);
        return;
      }
      if (id) {
        await postService
          .getPost(id)
          .then(response => {
            navigation.navigate(addPostScreen, response);
          })
          .catch(err => {
            console.log(err);
          });
        //http://localhost:3000/66098fb547f3dad78635
        //http://rohitpakhrin.com.np/66098fb547f3dad78635
      }
    });

    const unsubscribe = navigation.addListener('focus', () => {
      getPosts();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const getPosts = async () => {
    setLoading(true);
    await postService
      .getPosts(isAdmin)
      .then(data => {
        if (data) {
          setPosts(data);
        }
      })
      .catch(err => {
        if (err instanceof Error) {
          openModal({title: err.message});
        } else {
          openModal({title: 'Unknown error occurred'});
        }
      });
    setLoading(false);
  };

  const onPostStatusChange = async (item: Post, status: Status) => {
    setLoading(true);
    await postService
      .updatePost(item?.$id ?? '', {...item, status: status})
      .then(response => {
        return response;
      })
      .catch(err => openModal({title: err?.message}));
    await getPosts();
    setLoading(false);
  };

  return (
    <Wrapper
      style={styles(theme).mainContainer}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={getPosts} />
      }>
      <AddPostModal
        showAddPost={showAddPost}
        close={() => setShowAddPost(false)}
      />
      <View style={styles(theme).headerContainer}>
        <CustomText bold title={strings.dashboardScreenWelcome} type={'h2'} />
        <View style={styles(theme).topIcons}>
          <DarkModeButton />
          <Icon
            style={styles(theme).exitIcon}
            onPress={user ? logUserOut : goToSign}
            icon={user ? 'exit' : 'enter'}
            size={theme.sizes.large}
            color={theme.colors.text_color}
          />
        </View>
      </View>
      {/* <Markdown>this is a test single line md</Markdown> */}
      <CustomText
        style={styles(theme).introMessageStyle}
        title={strings.dashboardScreenWelcomeSub}
        type={'p2'}
      />

      <DashboardButtonGroup />
      {user && (
        <View style={styles(theme).header2StringContainer}>
          <CustomText
            title={`${strings.hi} ${isAdmin ? ADMIN_LABEL : ''} ${user.name}`}
            type={'h2'}
          />
        </View>
      )}
      {isAdmin && (
        <View style={styles(theme).topButton}>
          <Button title={'Add Post'} onPress={addPost} />
        </View>
      )}
      {posts.length === 0 && !loading && (
        <CustomText title={strings.noContent} type={'h2'} />
      )}
      {loading && (
        <ActivityIndicator
          style={styles(theme).indicator}
          size={'small'}
          color={theme.colors.text_color}
        />
      )}
      {posts &&
        posts.map(item => (
          <BlogItem
            key={item?.$createdAt}
            loading={loading}
            onPostStatusChange={onPostStatusChange}
            item={item}
          />
        ))}
    </Wrapper>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    flatList: {
      flex: 1,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.sizes.large,
    },
    header2StringContainer: {
      marginBottom: theme.sizes.medium,
      alignSelf: 'center',
    },
    topIcons: {
      flexDirection: 'row',
    },
    exitIcon: {
      marginLeft: theme.sizes.medium,
    },
    topButton: {
      alignSelf: Platform.OS === 'web' ? 'center' : undefined,
    },
    indicator: {
      marginTop: theme.sizes.medium,
    },
    introMessageStyle: {
      textAlign: 'justify',
      marginBottom: theme.sizes.medium,
    },
    mainContainer: {
      paddingBottom: theme.sizes.extra_extra_large * 2,
    },
  });

export default DashboardScreen;

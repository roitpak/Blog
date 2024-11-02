import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useUser} from '../../context/user/useUser';
import CustomText from '../common/CustomText';
import Icon from '../../assets/Icon';
import {useTheme} from '../../context/theme/useTheme';
import {Theme} from '../../constants/Types';
import CustomTextInput from '../common/CustomTextInput';
import strings from '../../constants/strings.json';
import Button from '../common/Button';
import {BUTTON_TYPES} from '../../constants/Constants';
import CustomYoutubePlayer from '../video/CustomYoutubePlayer';
import {extractVideoId} from '../../helpers/functions';
import {useModal} from '../../context/modal/useModal';

interface VideoUrlComponentProps {
  onUrlChange: (url: string) => void;
  url: string;
  loading: boolean;
}

function VideoUrlComponent({
  onUrlChange,
  url,
  loading,
}: VideoUrlComponentProps): JSX.Element {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newUrl, setNewUrl] = useState<string>(url);

  const {isAdmin} = useUser();
  const {theme} = useTheme();

  const {openModal} = useModal();

  const onConfirm = () => {
    if (extractVideoId(newUrl) === '') {
      openModal({title: 'Bad Url'});
      return;
    }
    setEditMode(false);
    onUrlChange(newUrl);
  };

  if (!isAdmin && !url) {
    return <></>;
  }

  return (
    <View style={styles(theme).container}>
      <View style={styles(theme).topContainer}>
        <View style={styles(theme).inputContainer}>
          {editMode ? (
            <CustomTextInput
              placeholder="eg: https://youtu.be/myID_123"
              value={newUrl}
              onChangeText={setNewUrl}
            />
          ) : (
            <CustomText title={'Youtube: '} type={'p1'} />
          )}
        </View>
        {!editMode && isAdmin && (
          <Icon
            color={theme.colors.text_color}
            onPress={() => setEditMode(true)}
            icon={'pencil'}
            size={theme.sizes.large}
          />
        )}
      </View>
      {url && (
        <View style={styles(theme).videoContent}>
          <CustomYoutubePlayer url={extractVideoId(url)} />
        </View>
      )}
      {editMode && isAdmin && (
        <>
          <Button
            buttonStyle={styles(theme).buttonStyle}
            loading={loading}
            title={strings.saveVideo}
            onPress={() => onConfirm()}
          />
          <Button
            type={BUTTON_TYPES.outlined}
            textStyle={styles(theme).textStyle}
            buttonStyle={styles(theme).buttonStyle}
            title={strings.cancel}
            onPress={() => setEditMode(false)}
          />
        </>
      )}
    </View>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginTop: theme.sizes.medium,
      flexDirection: 'column',
    },
    topContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    inputContainer: {
      flexDirection: 'row',
    },
    buttonStyle: {
      marginTop: theme.sizes.small,
    },
    textStyle: {
      color: theme.colors.negative,
    },
    videoContent: {
      marginVertical: theme.sizes.medium,
    },
  });

export default VideoUrlComponent;

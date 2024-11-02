import React from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import postService from '../../appwrite/posts';
import {useModal} from '../../context/modal/useModal';
import { Dimensions } from '../../helpers/Dimensions';

interface RichTextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  style?: ViewStyle;
}

export default function RichTextEditor({
  value,
  onChangeText,
  style,
}: RichTextEditorProps) {
  const {openModal, closeModal} = useModal();
  const richText = React.useRef<RichEditor>(null);

  const handleHead = ({tintColor}: {tintColor: string}) => (
    <Text style={{color: tintColor}}>H1</Text>
  );

  const handleHead2 = ({tintColor}: {tintColor: string}) => (
    <Text style={{color: tintColor}}>H2</Text>
  );

  const handleHead3 = ({tintColor}: {tintColor: string}) => (
    <Text style={{color: tintColor}}>H3</Text>
  );

  const handleParagraph = ({tintColor}: {tintColor: string}) => (
    <Text style={{color: tintColor}}>N</Text>
  );

  const onImagePicked = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });
    if (result && result?.assets && result?.assets[0]) {
      if (
        result?.assets[0]?.fileSize &&
        result?.assets[0]?.fileSize > 1000000
      ) {
        openModal({
          title: 'Image too large',
          subTitle: 'Image size should not exceed 1MB',
          buttons: [{label: 'Ok', onClick: () => closeModal()}],
        });
        return;
      }
      const response = (await postService.uploadFile(result?.assets[0])) as any;
      const imageUrl = postService.getFilePreview(response?.$id);
      imageUrl && insertImage(imageUrl);
    }
  };

  const insertImage = (imageUrl: string) => {
    const editor = richText.current;
    if (editor) {
      editor.insertHTML(`<img src="${imageUrl}"/>`);
    }
  };

  return (
    <View style={[styles.editorStyle, style]}>
      <RichEditor
        allowFileAccess={true}
        ref={richText}
        initialContentHTML={value}
        onChange={onChangeText}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        style={styles.richEditor}
        scrollEnabled={true}
      />
      <RichToolbar
        editor={richText}
        actions={[
          actions.setParagraph,
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.heading1,
          actions.heading2,
          actions.heading3,
        ]}
        iconMap={{
          [actions.setParagraph]: handleParagraph,
          [actions.heading1]: handleHead,
          [actions.heading2]: handleHead2,
          [actions.heading3]: handleHead3,
        }}
        style={styles.toolbar}
      />
      <RichToolbar
        onPressAddImage={onImagePicked}
        editor={richText}
        actions={[
          actions.blockquote,
          actions.insertOrderedList,
          actions.insertBulletsList,
          actions.code,
          actions.insertLink,
          actions.insertImage,
        ]}
        style={styles.toolbar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  editorStyle: {width: '100%', flex: 1, height: Dimensions.windowHeight * 0.9},
  richEditor: {flex: 1},
  toolbar: {backgroundColor: '#f5f5f5'},
});

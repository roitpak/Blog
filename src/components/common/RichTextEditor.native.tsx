import React from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';

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
      />
      <RichToolbar
        editor={richText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.heading1,
          actions.heading2,
          actions.heading3,
        ]}
        iconMap={{
          [actions.heading1]: handleHead,
          [actions.heading2]: handleHead2,
          [actions.heading3]: handleHead3,
        }}
        style={styles.toolbar}
      />
      <RichToolbar
        onPressAddImage={() => console.log('image added')}
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
  editorStyle: {width: '100%', flex: 1},
  richEditor: {flex: 1},
  toolbar: {backgroundColor: '#f5f5f5'},
});

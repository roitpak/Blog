import React from 'react';
import {Text, View} from 'react-native';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';

export default function RichTextEditor() {
  const richText = React.useRef<RichEditor>(null);
  const handleHead = ({tintColor}: {tintColor: string}) => (
    <Text style={{color: tintColor}}>H1</Text>
  );

  return (
    <View style={{width: '100%', height: 500}}>
      <RichEditor
        ref={richText}
        onChange={descriptionText => {
          console.log('descriptionText:', descriptionText);
        }}
      />
      <RichToolbar
        editor={richText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.heading1,
          actions.code,
          actions.insertLink,
        ]}
        iconMap={{[actions.heading1]: handleHead}}
      />
    </View>
  );
}

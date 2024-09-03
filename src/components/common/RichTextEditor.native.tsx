import React from 'react';
import {Text, View} from 'react-native';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';

export default function RichTextEditor() {
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

  const handleHead5 = ({tintColor}: {tintColor: string}) => (
    <Text style={{color: tintColor}}>H5</Text>
  );

  return (
    <View style={{width: '100%'}}>
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
          actions.heading2,
          actions.heading3,
        ]}
        iconMap={{
          [actions.heading1]: handleHead,
          [actions.heading2]: handleHead2,
          [actions.heading3]: handleHead3,
        }}
      />
      <RichToolbar
        editor={richText}
        actions={[
          actions.blockquote,
          actions.insertOrderedList,
          actions.insertBulletsList,
          actions.code,
          actions.insertLink,
        ]}
      />
    </View>
  );
}

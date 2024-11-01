import React, {ChangeEvent, useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import postService from '../../appwrite/posts';

interface RichTextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  style?: React.CSSProperties;
}

export default function RichTextEditor({
  value,
  onChangeText,
  style,
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // @ts-ignore
    quillRef.current
      .getEditor()
      .getModule('toolbar')
      .addHandler('image', async () => {
        inputFileRef?.current?.click();
      });
  }, [quillRef]);

  const onImagePicked = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event?.target?.files?.[0]);
    const response = (await postService.uploadFile(
      event?.target?.files?.[0],
    )) as any;
    const imageUrl = postService.getFilePreview(response?.$id);
    console.log('🚀 ~ onImagePicked ~ imageUrl:', imageUrl);
    imageUrl && insertImage(imageUrl);
  };

  const insertImage = (imageUrl: string) => {
    const editor = quillRef.current?.getEditor();

    if (editor) {
      const range = editor.getSelection();
      if (range) {
        editor.insertEmbed(range.index, 'image', imageUrl);
      }
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{header: [1, 2, 3, false]}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{list: 'ordered'}, {list: 'bullet'}],
        ['link', 'image', 'code-block'],
      ],
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'code-block',
    'image',
  ];

  return (
    <>
      <ReactQuill
        ref={quillRef}
        style={{...styles.editorStyle, ...style}}
        theme="snow"
        value={value}
        onChange={onChangeText}
        modules={modules}
        formats={formats}
      />
      <input
        // eslint-disable-next-line react-native/no-inline-styles
        style={{display: 'none'}}
        ref={inputFileRef}
        type="file"
        accept="image/*"
        onChange={onImagePicked}
      />
      <style>
        {`
        .ql-editor img {
          width: 100%;      /* Set width to 100% to make it responsive */
          height: auto;     /* Maintain aspect ratio */
          max-width: 100%;  /* Prevent the image from exceeding its container */
        }
      `}
      </style>
    </>
  );
}

const styles = StyleSheet.create({
  editorStyle: {minHeight: 100, width: '100%', backgroundColor: 'white'},
});

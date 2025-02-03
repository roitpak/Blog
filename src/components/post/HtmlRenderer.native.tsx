import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {useTheme} from '../../context/theme/useTheme';

interface HtmlRendererProps {
  content: string;
}

function HtmlRenderer({content}: HtmlRendererProps): JSX.Element {
  const {theme} = useTheme();
  const scaleSize = 2.5;

  const [webViewHeight, setWebViewHeight] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const returnHtmlContent = () => {
    return `
        <!DOCTYPE html>
          <html>
          <head>
            <style>
            body { 
            font-family: Arial, sans-serif; 
            color: ${theme.colors.text_color};
            font-size: ${scaleSize}em;
            }
            
            h1, h2, h3, h4, h5, h6 {
            color: ${theme.colors.text_color};
            font-weight: bold;
            margin-top: 20px;
            }

            p {
            font-size: 1em;
            line-height: 1.6;
            margin-bottom: 15px;
            color: ${theme.colors.text_color};
            text-align: justify;
            }

            pre { 
            background-color: ${theme.colors.background_color}; 
            padding: 15px; 
            border-radius: 10px; 
            overflow-x: auto;
            }
            .ql-syntax {
            font-family: monospace; 
            font-size: ${scaleSize - 1}em;
            color: ${theme.colors.text_color};
            }

            ul, ol {
            padding-left: 20px;
            margin-bottom: 15px;
            color: ${theme.colors.text_color};
            }

            li {
            color: ${theme.colors.text_color};
            margin-bottom: 5px;
            }

            a {
            color: ${theme.colors.text_color};
            text-decoration: none;
            }

            a:hover {
            color: ${theme.colors.text_color};
            text-decoration: underline;
            }

            img {
              max-height: 900px;
              width: auto;
              height: auto;
              max-width: 100%;
              display: block;
              margin: auto;
              object-fit: contain;
            }
            blockquote {
              margin: 20px 0;
              padding-left: 15px;
              border-left: 3px solid ${theme.colors.gray};
              color: ${theme.colors.text_color};
              font-style: italic;
            }
          </style>
          </head>
          <body>
            ${content}
          </body>
          </html>
        `;
  };
  const webViewScript = `
    setTimeout(function() { 
      window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight); 
    }, 500);
    true;
  `;
  return (
    <View style={{height: webViewHeight}}>
      {loading && <ActivityIndicator color={theme.colors.text_color} />}
      <WebView
        onLoadEnd={() => setTimeout(() => setLoading(false), 1000)}
        scrollEnabled={false}
        automaticallyAdjustContentInsets={true}
        originWhitelist={['*']}
        source={{html: returnHtmlContent()}}
        style={styles().container}
        onMessage={event => {
          setWebViewHeight(parseInt(event.nativeEvent.data, 10));
        }}
        javaScriptEnabled={true}
        injectedJavaScript={webViewScript}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: 'transparent',
    },
  });

export default HtmlRenderer;

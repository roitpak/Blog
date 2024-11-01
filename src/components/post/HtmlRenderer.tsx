import React from 'react';
import {useTheme} from '../../context/theme/useTheme';

interface HtmlRendererProps {
  content: string;
}

function HtmlRenderer({content}: HtmlRendererProps): JSX.Element {
  const {theme} = useTheme();
  const returnHtmlContent = () => {
    return `
        <!DOCTYPE html>
          <html>
          <head>
            <style>
            body { 
            font-family: Arial, sans-serif; 
            color: ${theme.colors.text_color};
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
            }

            pre { 
            background-color: ${theme.colors.background_color}; 
            padding: 15px; 
            border-radius: 10px; 
            overflow-x: auto;
            }
            .ql-syntax {
            font-family: monospace; 
            color: ${theme.colors.text_color};
            }
            code { 
            font-family: monospace; 
            color: #ff6347; 
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
          </style>
          </head>
          <body>
            ${content}
          </body>
          </html>
        `;
  };

  return <div dangerouslySetInnerHTML={{__html: returnHtmlContent()}} />;
}

export default HtmlRenderer;

declare module 'react-native-config' {
  export interface NativeConfig {
    REACT_APP_PROJECT_ID: string;
    REACT_APP_ENDPOINT: string;
    REACT_APP_POSTS_DATABASE: string;
    REACT_APP_POSTS_COLLECTION: string;
    REACT_APP_POSTS_DATA_COLLECTION: string;
    REACT_APP_LOGIN_LOCATION_COLLECTION: string;
    REACT_APP_POSTS_BUCKET: string;
    REACT_APP_GEO_LOGIN_TOKEN: string;
    REACT_APP_POSTS_METRICS_COLLECTION: string;
  }

  export const Config: NativeConfig;
  export default Config;
}

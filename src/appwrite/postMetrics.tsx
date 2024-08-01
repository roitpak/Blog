import {Client, Databases, Query, ID} from 'appwrite';
import Config from 'react-native-config';
import {Platform} from 'react-native';
import {PostMetrics} from './types/post_metrics';

const myConfig = Platform.OS === 'web' ? process.env : Config;
export class PostMetricsService {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(myConfig.REACT_APP_ENDPOINT)
      .setProject(myConfig.REACT_APP_PROJECT_ID);
    this.databases = new Databases(this.client);
  }

  async createPostMetrics(id: string) {
    try {
      return await this.databases.createDocument(
        myConfig.REACT_APP_POSTS_DATABASE,
        myConfig.REACT_APP_POSTS_METRICS_COLLECTION,
        ID.unique(),
        {post_id: id},
      );
    } catch (error) {
      throw error;
    }
  }

  async getPostMetrics(post_id: string) {
    const queries = [
      Query.equal('post_id', post_id.toString()),
      Query.limit(10),
    ];
    try {
      const response = await this.databases.listDocuments(
        myConfig.REACT_APP_POSTS_DATABASE,
        myConfig.REACT_APP_POSTS_METRICS_COLLECTION,
        queries,
      );
      return response;
    } catch (error) {
      throw false;
    }
  }
  async increaseViewsCount(prevData: PostMetrics) {
    const newCount = prevData.views ? prevData.views + 1 : 1;
    const postData = {
      views: newCount,
    };

    await this.databases.updateDocument(
      myConfig.REACT_APP_POSTS_DATABASE,
      myConfig.REACT_APP_POSTS_METRICS_COLLECTION,
      prevData?.$id,
      postData,
    );
  }
}

const postMetricsService = new PostMetricsService();
export default postMetricsService;

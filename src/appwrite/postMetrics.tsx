import {Client, Databases, Query, ID} from 'appwrite';
import Config from 'react-native-config';
import {Platform} from 'react-native';
import {PostMetrics} from './types/post_metrics';
import storedPostIdsService from '../helpers/functions';

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
      if (response.documents.length > 0) {
        const postMetrics = response.documents[0] as unknown as PostMetrics;
        this.increaseViewsCount(postMetrics);
      }

      return response?.documents as unknown as PostMetrics[];
    } catch (error) {
      throw false;
    }
  }

  async increaseViewsCount(prevData: PostMetrics) {
    const alreadyViewed = await storedPostIdsService.isIDPresent(
      prevData.post_id,
    );
    if (alreadyViewed) {
      return;
    }
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
  async updatePostMetrics(postMetricsData: any) {
    await this.databases.updateDocument(
      myConfig.REACT_APP_POSTS_DATABASE,
      myConfig.REACT_APP_POSTS_METRICS_COLLECTION,
      postMetricsData?.$id,
      postMetricsData,
    );
  }
}

const postMetricsService = new PostMetricsService();
export default postMetricsService;

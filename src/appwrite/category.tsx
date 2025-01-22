import {Client, Databases, ID, Query} from 'appwrite';
import Config from 'react-native-config';
import {Platform} from 'react-native';
import {Category} from './types/category';

const myConfig = Platform.OS === 'web' ? process.env : Config;
export class CategoryService {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(myConfig.REACT_APP_ENDPOINT)
      .setProject(myConfig.REACT_APP_PROJECT_ID);
    this.databases = new Databases(this.client);
  }

  async createCategory(ids: string[]) {
    try {
      return await this.databases.createDocument(
        myConfig.REACT_APP_POSTS_DATABASE,
        myConfig.REACT_APP_CATEGORIES_COLLECTION,
        ID.unique(),
        {posts: ids},
      );
    } catch (error) {
      throw error;
    }
  }
  async getCategory(categoryTitle: string) {
    const queries = [Query.search('title', categoryTitle)];
    try {
      const response = await this.databases.listDocuments(
        myConfig.REACT_APP_POSTS_DATABASE,
        myConfig.REACT_APP_CATEGORIES_COLLECTION,
        queries,
      );

      return response?.documents as unknown as Category[];
    } catch (error) {
      throw false;
    }
  }
}

const categoryService = new CategoryService();
export default categoryService;

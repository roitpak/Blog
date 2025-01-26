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

  async getCategories() {
    const queries = [Query.orderDesc('postsLength')];
    try {
      return (
        await this.databases.listDocuments(
          myConfig.REACT_APP_POSTS_DATABASE,
          myConfig.REACT_APP_CATEGORIES_COLLECTION,
          queries,
        )
      ).documents as unknown as Category[];
    } catch (error) {
      throw error;
    }
  }

  async createCategory(category: Category) {
    try {
      const response = await this.databases.createDocument(
        myConfig.REACT_APP_POSTS_DATABASE,
        myConfig.REACT_APP_CATEGORIES_COLLECTION,
        ID.unique(),
        {...category, postsLength: 1},
      );
      console.log('created category');
      return response;
    } catch (error) {
      throw error;
    }
  }
  async searchCategoryByTitle(categoryTitle: string) {
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

  async getEqualTitleCategory(categoryTitle: string) {
    const queries = [Query.equal('title', categoryTitle)];
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

  async getCategoryByID(id: string) {
    try {
      return await this.databases.getDocument(
        myConfig.REACT_APP_POSTS_DATABASE,
        myConfig.REACT_APP_CATEGORIES_COLLECTION,
        id,
      );
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(id: string, postId: string) {
    const response = (await this.getCategoryByID(id)) as unknown as Category;

    const posts = response.posts;
    posts.push(postId);

    return await this.databases.updateDocument(
      myConfig.REACT_APP_POSTS_DATABASE,
      myConfig.REACT_APP_CATEGORIES_COLLECTION,
      id,
      {posts, postsLength: posts.length},
    );
  }

  async addCategoryOrCreate(postID: string, category: string[]) {
    for (let i = 0; i < category.length; i++) {
      const response = await this.getEqualTitleCategory(category[i]);
      if (response.length === 0) {
        await this.createCategory({
          posts: [postID],
          title: category[i],
        });
      } else {
        response[0].$id && (await this.updateCategory(response[0].$id, postID));
      }
    }
  }
}

const categoryService = new CategoryService();
export default categoryService;

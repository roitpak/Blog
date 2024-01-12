import {Client, Databases, Storage, Query, ID} from 'appwrite';
import {Post} from './types/posts';
import Config from 'react-native-config';

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client.setEndpoint(Config.ENDPOINT).setProject(Config.PROJECT_ID);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async getPost(slug: string) {
    try {
      return await this.databases.getDocument(
        Config.POSTS_DATABASE,
        Config.POSTS_COLLECTION,
        slug,
      );
    } catch (error) {
      console.log('Appwrite service :: getPost() :: ', error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal('status', 'active')]) {
    try {
      return await this.databases.listDocuments(
        Config.POSTS_DATABASE,
        Config.POSTS_COLLECTION,
        queries,
      );
    } catch (error) {
      console.log('Appwrite service :: getPosts() :: ', error);
      return false;
    }
  }

  async createPost({
    title,
    slug,
    content,
    featuredImage,
    status,
    userId,
    category,
    tags,
    date,
    shareUrl,
    tldr,
    githubUrl,
    videoUrl,
    uploadedBy,
  }: Post) {
    try {
      return await this.databases.createDocument(
        Config.POSTS_DATABASE,
        Config.POSTS_COLLECTION,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
          category,
          tags,
          date,
          shareUrl,
          tldr,
          githubUrl,
          videoUrl,
          uploadedBy,
        },
      );
    } catch (error) {
      console.log('Appwrite service :: createPost() :: ', error);
      return false;
    }
  }

  async updatePost(
    slug: string,
    {title, content, featuredImage, status}: Post,
  ) {
    try {
      return await this.databases.updateDocument(
        Config.POSTS_DATABASE,
        Config.POSTS_COLLECTION,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        },
      );
    } catch (error) {
      console.log('Appwrite service :: updateDocument() :: ', error);
      return false;
    }
  }

  async deletePost(slug: string) {
    try {
      await this.databases.deleteDocument(
        Config.POSTS_DATABASE,
        Config.POSTS_DATABASE,
        slug,
      );
      return true;
    } catch (error) {
      console.log('Appwrite service :: deleteDocument() :: ', error);
      return false;
    }
  }

  // storage service

  async uploadFile(file: File) {
    try {
      return await this.bucket.createFile(
        Config.POSTS_BUCKET,
        ID.unique(),
        file,
      );
    } catch (error) {
      console.log('Appwrite service :: uploadFile() :: ', error);
      return false;
    }
  }

  async deleteFile(fileId: string) {
    try {
      return await this.bucket.deleteFile(Config.POSTS_BUCKET, fileId);
    } catch (error) {
      console.log('Appwrite service :: deleteFile() :: ', error);
      return false;
    }
  }

  getFilePreview(fileId: string) {
    return this.bucket.getFilePreview(Config.POSTS_BUCKET, fileId).href;
  }
}

const service = new Service();
export default service;
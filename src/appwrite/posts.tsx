import {Client, Databases, Storage, Query, ID} from 'appwrite';
import {Post} from './types/posts';
import Config from 'react-native-config';
import {Platform} from 'react-native';
import {Asset} from 'react-native-image-picker';
import {PostContent} from '../constants/Types';
import postMetricsService from './postMetrics';

const myConfig = Platform.OS === 'web' ? process.env : Config;
export class PostService {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(myConfig.REACT_APP_ENDPOINT)
      .setProject(myConfig.REACT_APP_PROJECT_ID);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async getPost(slug: string) {
    try {
      return await this.databases.getDocument(
        myConfig.REACT_APP_POSTS_DATABASE,
        myConfig.REACT_APP_POSTS_COLLECTION,
        slug,
      );
    } catch (error) {
      throw error;
    }
  }
  async getPostData(id: string) {
    try {
      return await this.databases.getDocument(
        myConfig.REACT_APP_POSTS_DATABASE,
        myConfig.REACT_APP_POSTS_DATA_COLLECTION,
        id,
      );
    } catch (error) {
      throw error;
    }
  }

  async getPosts(isAdmin?: boolean) {
    const queries = isAdmin
      ? [Query.limit(10), Query.offset(0), Query.orderDesc('$createdAt')]
      : [
          Query.equal('status', 'published'),
          Query.limit(10),
          Query.offset(0),
          Query.orderDesc('$createdAt'),
        ];
    try {
      const response = await this.databases.listDocuments(
        myConfig.REACT_APP_POSTS_DATABASE,
        myConfig.REACT_APP_POSTS_COLLECTION,
        queries,
      );
      // to suppress typescript error
      const posts: Post[] = (response?.documents as unknown as Post[]) || [];
      return posts;
    } catch (error) {
      throw error;
    }
  }

  async createPost(data: Post) {
    try {
      const response = await this.databases.createDocument(
        myConfig.REACT_APP_POSTS_DATABASE,
        myConfig.REACT_APP_POSTS_COLLECTION,
        ID.unique(),
        data,
      );
      postMetricsService.createPostMetrics(response.$id);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async createPostContent(data: PostContent, post: Post) {
    let tempPost = {
      $id: post.$id,
      title: post.title,
      contents: post.contents,
      category: post.category,
      shareUrl: post.shareUrl,
      likes: post.likes,
      githubUrl: post.githubUrl,
      uploadedBy: post.uploadedBy,
      status: post.status,
      tldr: post.tldr,
      videoUrl: post.videoUrl,
    };
    let postData = data;
    // If there is image upload it
    if (data?.image) {
      await this.uploadFile(data.image)
        .then((response: any) => {
          postData.image_id = response.$id;
        })
        .catch(err => {
          throw err;
        });
    }
    delete postData.image;
    let id = '';
    // create post data with that image id
    await this.databases
      .createDocument(
        myConfig.REACT_APP_POSTS_DATABASE,
        myConfig.REACT_APP_POSTS_DATA_COLLECTION,
        ID.unique(),
        postData,
      )
      .then(response => {
        id = response.$id;
      })
      .catch(error => {
        throw error;
      });
    tempPost?.contents?.push(id);
    // add post data contents to post
    if (post?.$id) {
      await this.updatePost(post.$id, tempPost)
        .then(response => {
          return response;
        })
        .catch(err => console.log(err));
    }
  }

  async getPostContentData(id: string) {
    try {
      return await this.databases.getDocument(
        myConfig.REACT_APP_POSTS_DATABASE,
        myConfig.REACT_APP_POSTS_DATA_COLLECTION,
        id,
      );
      // to suppress typescript error
    } catch (error) {
      throw error;
    }
  }

  async updatePost(slug: string, post: Post) {
    let tempPost = {
      $id: post.$id,
      title: post.title,
      contents: post.contents,
      category: post.category,
      shareUrl: post.shareUrl,
      likes: post.likes,
      githubUrl: post.githubUrl,
      uploadedBy: post.uploadedBy,
      status: post.status,
      tldr: post.tldr,
      videoUrl: post.videoUrl,
    };
    try {
      return await this.databases.updateDocument(
        myConfig.REACT_APP_POSTS_DATABASE,
        myConfig.REACT_APP_POSTS_COLLECTION,
        slug,
        tempPost,
      );
    } catch (error) {
      throw error;
    }
  }

  async updatePostContent(slug: string, post: PostContent) {
    let postData = {
      title: post?.title,
      subtitle: post?.subtitle,
      image_id: post.image_id ? post.image_id : null,
      content: post?.content,
      content_type: post?.content_type,
    };
    // if image is deleted or new uploaded, remove from server
    if (!post?.image_id || post?.image) {
      const response = await this.getPostContentData(slug);
      if (response?.image_id) {
        try {
          await this.deleteFile(response?.image_id);
        } catch (error) {
          console.log(error);
        }
      }
    }
    // If there is image upload it
    if (post?.image) {
      await this.uploadFile(post.image)
        .then((imageResponse: any) => {
          postData.image_id = imageResponse.$id;
        })
        .catch(err => {
          throw err;
        });
    }
    try {
      return await this.databases.updateDocument(
        myConfig.REACT_APP_POSTS_DATABASE,
        myConfig.REACT_APP_POSTS_DATA_COLLECTION,
        slug,
        postData,
      );
    } catch (error) {
      throw error;
    }
  }

  async deletePost(id: string) {
    try {
      return await this.databases.deleteDocument(
        myConfig.REACT_APP_POSTS_DATABASE,
        myConfig.REACT_APP_POSTS_DATABASE,
        id,
      );
    } catch (error) {
      throw error;
    }
  }

  // storage service

  async uploadFile(file: File | Asset | null | undefined) {
    if (!file) {
      throw new Error('File not found');
    }
    if (file instanceof File) {
      try {
        return await this.bucket.createFile(
          myConfig.REACT_APP_POSTS_BUCKET,
          ID.unique(),
          file,
        );
      } catch (error) {
        throw error;
      }
    } else if (file.uri && file.fileName && file.type) {
      let filename = file.uri.split('/').pop();

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(file.uri);
      let type = match ? `image/${match[1]}` : 'image';
      let formData = new FormData();
      let id = new Date()
        .toISOString()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .toLowerCase()
        .toString()
        .slice(0, 20);
      formData.append('fileId', id);
      formData.append('file', {
        uri: file.uri,
        name: filename,
        type,
      } as unknown as Blob);
      try {
        await fetch(
          `${myConfig.REACT_APP_ENDPOINT}/storage/buckets/${myConfig.REACT_APP_POSTS_BUCKET}/files/`,
          {
            method: 'POST',
            headers: {
              'content-type': 'multipart/form-data',
              'X-Appwrite-Project': myConfig.REACT_APP_PROJECT_ID,
              'x-sdk-version': 'appwrite:web:10.2.0',
            },
            body: formData,
            credentials: 'include',
          },
        );
        return {$id: id};
      } catch (e) {
        throw e;
      }
    }
  }

  async deleteFile(fileId: string) {
    try {
      return await this.bucket.deleteFile(
        myConfig.REACT_APP_POSTS_BUCKET,
        fileId,
      );
    } catch (error) {
      throw false;
    }
  }

  getFilePreview(fileId: string) {
    return this.bucket.getFilePreview(myConfig.REACT_APP_POSTS_BUCKET, fileId)
      .href;
  }
}

const postService = new PostService();
export default postService;

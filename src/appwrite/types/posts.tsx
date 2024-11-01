import Status from '../../components/post/enum/PostStatusEnum';

export interface Post {
  $id?: string;
  title: string;
  status?: Status;
  category: string[];
  uploadedBy?: string;
  contents: string[];
  shareUrl?: URL;
  likes?: number;
  githubUrl?: string;
  tldr?: string;
  videoUrl?: string;
  $createdAt?: string;
  content: string;
}

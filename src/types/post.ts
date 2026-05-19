export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: number | null;
  sortOrder?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  children?: Omit<Category, 'children'>[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  status?: string;
}

export interface PostStats {
  postId: number;
  viewCount: number;
  updatedAt: string;
}

export interface Post {
  id: number;
  slug: string;
  name: string;
  excerpt?: string | null;
  content?: string | null;
  image?: string | null;
  coverImage?: string | null;
  status: string;
  postType: string;
  videoUrl?: string | null;
  audioUrl?: string | null;
  isFeatured: boolean;
  isPinned: boolean;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  createdAt?: string;
  updatedAt?: string;
  stats?: PostStats;
  categories?: Category[];
  tags?: Tag[];
  // admin-only fields
  createdUserId?: number;
  updatedUserId?: number;
  categoryIds?: number[];
  tagIds?: number[];
}

export interface PostComment {
  id: number;
  userId: number;
  postId: number;
  parentId?: number | null;
  content: string;
  status: 'visible' | 'hidden' | 'spam' | 'deleted';
  createdAt: string;
  updatedAt: string;
  replies?: PostComment[];
  // Extended fields returned by admin API
  user?: {
    id: number;
    name: string;
    email?: string;
    image?: string | null;
  };
  post?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface PostStatisticsOverview {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  scheduledPosts: number;
  totalComments: number;
  totalViewsLast30Days: number;
  topViewedPosts: {
    id: number;
    name: string;
    slug: string;
    viewCount: number;
    publishedAt?: string;
  }[];
}

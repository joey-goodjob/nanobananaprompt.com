export type ArticleStructuredContent = string | Record<string, unknown>;

export type ArticleBlock =
  | string
  | {
      id?: string;
      blockType?: string;
      blockName?: string;
      heading?: string;
      subheading?: string;
      content?: ArticleStructuredContent | ArticleStructuredContent[];
      richText?: ArticleStructuredContent | ArticleStructuredContent[];
      text?: string;
      body?: string;
      html?: string;
      [key: string]: unknown;
    };

export type Article = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  coverImage?: string;
  htmlContent?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  category?: string;
  tags?: string[];
  blocks: ArticleBlock[];
  status?: string;
};

export type ArticleListItem = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  coverImage?: string;
  htmlContent?: string;
  publishedAt?: string;
  updatedAt?: string;
  category?: string;
  tags?: string[];
  readingTime?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type FetchArticlesParams = {
  locale?: string;
  page?: number;
  limit?: number;
  category?: string;
};

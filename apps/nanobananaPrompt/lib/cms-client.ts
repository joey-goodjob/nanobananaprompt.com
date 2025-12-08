import type {
  Article,
  ArticleBlock,
  ArticleListItem,
  FetchArticlesParams,
  PaginatedResponse,
} from "@/types/cms";

type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

type CmsListResponse<T> = {
  docs?: T[];
  totalDocs?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
  error?: unknown;
};

const isBrowser = typeof window !== "undefined";

export const cmsConfig = {
  baseUrl: (() => {
    const host = process.env.NEXT_PUBLIC_CMS_HOST || "https://cms.vumiai.com";
    return host.replace(/^["']|["']$/g, "").replace(/\/$/, "");
  })(),
  secret: (() => {
    const secret = process.env.NEXT_PUBLIC_CMS_SECRET || "";
    return secret.replace(/^["']|["']$/g, "");
  })(),
  tenantId: (() => {
    const tenantId = process.env.NEXT_PUBLIC_CMS_TENANT_ID || "1";
    return tenantId.replace(/^["']|["']$/g, "");
  })(),
  endpoints: {
    landingPages: "/api/landing-pages",
    posts: "/api/posts",
  },
  cache: {
    revalidate: 60,
  },
  defaults: {
    pageSize: 12,
    locale: "en",
  },
} as const;

//构建2

function createDefaultHeaders(): Headers {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (cmsConfig.secret) {
    headers.set("Authorization", `Bearer ${cmsConfig.secret}`);
  }

  return headers;
}

function mergeHeaders(
  ...sources: Array<HeadersInit | undefined>
): HeadersInit | undefined {
  const headers = new Headers();

  for (const source of sources) {
    if (!source) continue;

    const entry = new Headers(source);
    entry.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return headers;
}

function getBaseFetchOptions(): NextFetchInit {
  if (isBrowser) {
    return { cache: "no-store" };
  }

  return {
    next: {
      revalidate: cmsConfig.cache.revalidate,
    },
  };
}

async function cmsFetch<T>(
  url: string,
  init?: NextFetchInit
): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...getBaseFetchOptions(),
      ...init,
      headers: mergeHeaders(createDefaultHeaders(), init?.headers) ?? undefined,
    });

    if (!response.ok) {
      console.error(
        `[CMS] Request failed: ${response.status} ${response.statusText}`
      );
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`[CMS] Unexpected error for ${url}`, error);
    return null;
  }
}

function normalizeBlocks(input: unknown): ArticleBlock[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input as ArticleBlock[];
  }
  if (typeof input === "string") {
    return [];
  }
  return [input as ArticleBlock];
}

function normalizeTags(value: unknown): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) {
    return value.filter((tag): tag is string => typeof tag === "string");
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return undefined;
}

function asString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  return undefined;
}

function getImageUrl(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    return asString(obj.url);
  }
  return undefined;
}

function normalizeArticle(raw: Record<string, unknown>): Article {
  const slug =
    asString(raw.slug) ||
    asString(raw.handle) ||
    asString(raw.id) ||
    `article-${raw._id ?? raw.createdAt ?? Date.now()}`;

  const id =
    asString(raw.id) ||
    asString(raw._id) ||
    slug ||
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `article-${Date.now()}`);

  const blockSource =
    raw.content ?? raw.sections ?? raw.layout ?? raw.blocks ?? raw.body ?? [];

  const htmlContent =
    typeof raw.content === "string"
      ? raw.content
      : typeof raw.body === "string"
        ? raw.body
        : undefined;

  const coverImage =
    getImageUrl(raw.coverImage) ||
    getImageUrl(raw.featuredImage) ||
    getImageUrl(raw.heroImage) ||
    getImageUrl(raw.thumbnail);

  return {
    id,
    slug,
    title: asString(raw.title) || asString(raw.heroTitle) || slug,
    description:
      asString(raw.description) ||
      asString(raw.excerpt) ||
      asString(raw.summary),
    excerpt:
      asString(raw.excerpt) ||
      asString(raw.summary) ||
      asString(raw.description),
    coverImage: typeof coverImage === "string" ? coverImage : undefined,
    htmlContent,
    createdAt: asString(raw.createdAt),
    updatedAt: asString(raw.updatedAt),
    publishedAt: asString(raw.publishedAt) || asString(raw.createdAt),
    category:
      asString(raw.category) ||
      (Array.isArray(raw.categories) && asString(raw.categories[0])) ||
      undefined,
    tags: normalizeTags(raw.tags || raw.keywords),
    blocks: normalizeBlocks(blockSource),
    status:
      asString(raw._status) ||
      asString(raw.status) ||
      (raw.published ? "published" : "draft"),
  };
}

function mapArticleListItem(doc: Record<string, unknown>): ArticleListItem {
  const article = normalizeArticle(doc);
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.description,
    excerpt: article.excerpt,
    coverImage: article.coverImage,
    htmlContent: article.htmlContent,
    blocks: article.blocks,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    category: article.category,
    tags: article.tags,
    readingTime:
      asString(doc.readingTime) ||
      asString(doc.estimatedReadingTime) ||
      (typeof doc.metadata === "object" && doc.metadata !== null
        ? asString((doc.metadata as Record<string, unknown>).readingTime)
        : undefined),
  };
}

export async function fetchArticleClient(
  slug: string,
  locale: string = cmsConfig.defaults.locale
): Promise<Article | null> {
  const params = [
    `where[tenant][equals]=${cmsConfig.tenantId}`,
    `where[slug][equals]=${encodeURIComponent(slug)}`,
    `depth=2`,
    `locale=${locale}`,
  ];

  const url = `${cmsConfig.baseUrl}${cmsConfig.endpoints.landingPages}?${params.join(
    "&"
  )}`;

  const data = await cmsFetch<CmsListResponse<Record<string, unknown>>>(url);

  if (!data?.docs?.length) {
    console.warn(`[CMS] Landing page not found: slug=${slug}`);
    return null;
  }

  const doc = data.docs[0];
  if (!doc) return null;
  return normalizeArticle(doc);
}

export async function fetchArticlesClient(
  params: FetchArticlesParams = {}
): Promise<PaginatedResponse<ArticleListItem> | null> {
  const locale = params.locale ?? cmsConfig.defaults.locale;
  const page = params.page ?? 1;
  const limit = params.limit ?? cmsConfig.defaults.pageSize;

  const queryParts: string[] = [
    `where[tenant][equals]=${cmsConfig.tenantId}`,
    `where[published][equals]=true`,
    `limit=${limit}`,
    `page=${page}`,
    `locale=${locale}`,
  ];

  if (params.category) {
    queryParts.push(
      `where[categories][contains]=${encodeURIComponent(params.category)}`
    );
  }

  const url = `${cmsConfig.baseUrl}${cmsConfig.endpoints.posts}?${queryParts.join(
    "&"
  )}`;

  const data = await cmsFetch<CmsListResponse<Record<string, unknown>>>(url);

  if (!data) {
    return null;
  }

  const docs = Array.isArray(data.docs) ? data.docs : [];

  return {
    items: docs.map(mapArticleListItem),
    total: data.totalDocs ?? docs.length,
    page: data.page ?? page,
    pageSize: data.limit ?? limit,
    totalPages:
      data.totalPages ?? Math.ceil((data.totalDocs ?? docs.length) / limit),
  };
}

export async function fetchPostClient(
  slug: string,
  locale: string = cmsConfig.defaults.locale
): Promise<Article | null> {
  const params = [
    `where[tenant][equals]=${cmsConfig.tenantId}`,
    `where[slug][equals]=${encodeURIComponent(slug)}`,
    `where[published][equals]=true`,
    `depth=2`,
    `locale=${locale}`,
  ];

  const url = `${cmsConfig.baseUrl}${cmsConfig.endpoints.posts}?${params.join("&")}`;

  const data = await cmsFetch<CmsListResponse<Record<string, unknown>>>(url);

  if (!data?.docs?.length) {
    console.warn(`[CMS] Post not found: slug=${slug}`);
    return null;
  }

  const doc = data.docs[0];
  if (!doc) return null;
  return normalizeArticle(doc);
}

export async function fetchPostByIdClient(
  id: string,
  locale: string = cmsConfig.defaults.locale
): Promise<Article | null> {
  const url = `${cmsConfig.baseUrl}${cmsConfig.endpoints.posts}/${id}?depth=2&locale=${locale}&where[tenant][equals]=${cmsConfig.tenantId}`;

  const data = await cmsFetch<Record<string, unknown>>(url);

  if (!data) {
    return null;
  }

  if (data.tenant && `${data.tenant}` !== cmsConfig.tenantId) {
    console.warn(
      `[CMS] Tenant mismatch for post ${id}: expected ${cmsConfig.tenantId}, got ${data.tenant}`
    );
    return null;
  }

  if (data.published === false) {
    console.warn(`[CMS] Post is not published: id=${id}`);
    return null;
  }

  return normalizeArticle(data);
}

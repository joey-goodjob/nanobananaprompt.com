import { cmsConfig, fetchArticlesClient } from "@/lib/cms-client";
import PromptNavigator from "./prompt-navigator";
import styles from "./page.module.css";

export const revalidate = 60;

const PAGE_SIZE = 24;

export default async function PromptsPage() {
  const articleResponse = await fetchArticlesClient({
    limit: PAGE_SIZE,
    locale: cmsConfig.defaults.locale,
  });
  const articles = articleResponse?.items ?? [];

  // 直接从 CMS API 获取原始数据，提取所有分类
  // 因为 normalizeArticle 只提取了第一个分类，我们需要从原始数据中提取所有分类
  const url = `${cmsConfig.baseUrl}${cmsConfig.endpoints.posts}?where[tenant][equals]=${cmsConfig.tenantId}&where[published][equals]=true&limit=${PAGE_SIZE}&locale=${cmsConfig.defaults.locale}&depth=2`;

  // 构建请求头
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (cmsConfig.secret) {
    headers.Authorization = `Bearer ${cmsConfig.secret}`;
  }

  // 获取原始数据
  let allCategoriesSet = new Set<string>();
  try {
    const rawResponse = await fetch(url, {
      headers,
      next: { revalidate: cmsConfig.cache.revalidate },
    });

    if (rawResponse.ok) {
      const rawData = await rawResponse.json();
      const rawDocs = rawData?.docs || [];

      // 从所有文章的 categories 数组中提取所有分类的 name
      rawDocs.forEach((doc: Record<string, unknown>) => {
        if (Array.isArray(doc.categories)) {
          doc.categories.forEach((cat: unknown) => {
            if (cat && typeof cat === "object") {
              const catObj = cat as Record<string, unknown>;
              const name = typeof catObj.name === "string" ? catObj.name : null;
              if (name) {
                allCategoriesSet.add(name);
              }
            }
          });
        }
      });
    }
  } catch (error) {
    console.warn("[PromptsPage] 获取原始分类数据失败:", error);
  }

  // 如果从原始数据提取失败，回退到从处理后的数据提取
  const categories =
    allCategoriesSet.size > 0
      ? Array.from(allCategoriesSet).sort() // 排序以便显示
      : Array.from(
          new Set(
            articles
              .map((article) => article.category)
              .filter((category): category is string => Boolean(category))
          )
        );

  return (
    <main className={styles.page}>
      <section className={styles.heroWrapper}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1>Nanobanana Prompt</h1>
            <p>
              通过分类与模糊搜索，迅速定位不同场景的提示词。 每个分类都源于
              CMS，支持实时刷新和瀑布流预览。
            </p>
          </div>
        </div>
      </section>

      <PromptNavigator
        initialArticles={articles}
        categories={categories}
        pageSize={articleResponse?.pageSize ?? PAGE_SIZE}
        totalPages={articleResponse?.totalPages ?? 1}
        initialPage={articleResponse?.page ?? 1}
      />
    </main>
  );
}

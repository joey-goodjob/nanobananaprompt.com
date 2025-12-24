import CategoryHeroGrid from "./_components/category-hero-grid";
import PageRenderer from "./_components/page-renderer";
import { cmsConfig, fetchArticleClient } from "@/lib/cms-client";
import styles from "./page.module.css";

export const revalidate = 60;

const PAGE_SIZE = 18;

export default async function HomePage() {
  // 获取分类数据
  const url = `${cmsConfig.baseUrl}${cmsConfig.endpoints.posts}?where[tenant][equals]=${cmsConfig.tenantId}&where[published][equals]=true&limit=${PAGE_SIZE}&locale=${cmsConfig.defaults.locale}&depth=2`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (cmsConfig.secret) {
    headers.Authorization = `Bearer ${cmsConfig.secret}`;
  }

  type CategoryData = { name: string; slug: string };
  const allCategoriesMap = new Map<string, CategoryData>();

  try {
    const rawResponse = await fetch(url, {
      headers,
      next: { revalidate: cmsConfig.cache.revalidate },
    });

    if (rawResponse.ok) {
      const rawData = await rawResponse.json();
      const rawDocs = rawData?.docs || [];

      rawDocs.forEach((doc: Record<string, unknown>) => {
        if (Array.isArray(doc.categories)) {
          doc.categories.forEach((cat: unknown) => {
            if (cat && typeof cat === "object") {
              const catObj = cat as Record<string, unknown>;
              const name = typeof catObj.name === "string" ? catObj.name : null;
              const slug = typeof catObj.slug === "string" ? catObj.slug : null;
              if (name && slug) {
                allCategoriesMap.set(slug, { name, slug });
              }
            }
          });
        }
      });
    }
  } catch (error) {
    console.warn("[HomePage] 获取原始分类数据失败:", error);
  }

  const categories =
    allCategoriesMap.size > 0
      ? Array.from(allCategoriesMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      : [];

  // 从 CMS 获取首页内容（使用特殊的 slug "home"）
  const homePageArticle = await fetchArticleClient("/home");

  return (
    <main className={styles.page}>
      {/* 保留 CategoryHeroGrid 在顶部 */}
      <CategoryHeroGrid categories={categories} />

      {/* 使用 PageRenderer 渲染 CMS 内容 */}
      {homePageArticle && (
        <PageRenderer
          page={homePageArticle}
          pageType="landing-page"
          showMeta={false}
          showBreadcrumb={false}
          showHeader={false}
          className={styles.homeContent}
        />
      )}
    </main>
  );
}

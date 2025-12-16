import ArticleSection from "./_components/article";
import CtaSection from "./_components/cta";
import FaqSection from "./_components/faq";
import CategoryNavigator from "./_components/category-navigator";
import CategoryHeroGrid from "./_components/category-hero-grid";
import { cmsConfig, fetchArticlesClient } from "@/lib/cms-client";
import styles from "./page.module.css";

export const revalidate = 60;

const PAGE_SIZE = 18;

export default async function HomePage() {
  const articleResponse = await fetchArticlesClient({ limit: PAGE_SIZE });
  const articles = articleResponse?.items ?? [];
  const total = articleResponse?.total ?? articles.length;
  const totalPages = articleResponse?.totalPages ?? 1;
  const pageSize = articleResponse?.pageSize ?? PAGE_SIZE;
  const featuredArticle = articles[0];

  // 获取分类数据（和 prompts 页面相同的逻辑）
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

  return (
    <main className={styles.page}>
      <CategoryHeroGrid categories={categories} />

      <CategoryNavigator categories={categories} />

      <ArticleSection
        articles={articles}
        initialPage={articleResponse?.page ?? 1}
        totalPages={totalPages}
        pageSize={pageSize}
      />

      {/* <WhyChooseSection />
      <TutorialsGuidesSection />
      <InspirationGallerySection />
      <CommunityShowcaseSection /> */}
      <FaqSection />
      <CtaSection />
    </main>
  );
}

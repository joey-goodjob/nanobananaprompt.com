import { cmsConfig, fetchArticlesClient } from "@/lib/cms-client";
import { notFound } from "next/navigation";
import CategoryArticles from "./category-articles";
import styles from "./page.module.css";

export const revalidate = 60;

const PAGE_SIZE = 24;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  // 特殊处理 prompts 页面
  if (slug === "prompts") {
    // 重定向到 /prompts 路由或显示所有文章
    const articleResponse = await fetchArticlesClient({
      limit: PAGE_SIZE,
      locale: cmsConfig.defaults.locale,
    });
    const articles = articleResponse?.items ?? [];

    // 获取所有分类数据
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
                const name =
                  typeof catObj.name === "string" ? catObj.name : null;
                const categorySlug =
                  typeof catObj.slug === "string" ? catObj.slug : null;
                if (name && categorySlug) {
                  allCategoriesMap.set(categorySlug, {
                    name,
                    slug: categorySlug,
                  });
                }
              }
            });
          }
        });
      }
    } catch (error) {
      console.warn("[CategoryPage] 获取原始分类数据失败:", error);
    }

    const categories =
      allCategoriesMap.size > 0
        ? Array.from(allCategoriesMap.values()).sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        : [];

    return (
      <main className={styles.page}>
        <section className={styles.heroWrapper}>
          <div className={styles.heroSection}>
            <div className={styles.heroContent}>
              <h1>Nanobanana Prompt</h1>
              <p>
                通过分类与模糊搜索，迅速定位不同场景的提示词。
                每个分类都源于 CMS，支持实时刷新和瀑布流预览。
              </p>
            </div>
          </div>
        </section>

        <CategoryArticles
          initialArticles={articles}
          categories={categories}
          pageSize={articleResponse?.pageSize ?? PAGE_SIZE}
          totalPages={articleResponse?.totalPages ?? 1}
          initialPage={articleResponse?.page ?? 1}
          categorySlug={null}
          categoryName="全部"
        />
      </main>
    );
  }

  // 获取分类信息
  const categoryUrl = `${cmsConfig.baseUrl}/api/categories?where[slug][equals]=${slug}&locale=${cmsConfig.defaults.locale}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (cmsConfig.secret) {
    headers.Authorization = `Bearer ${cmsConfig.secret}`;
  }

  let categoryName = "";
  try {
    const categoryResponse = await fetch(categoryUrl, {
      headers,
      next: { revalidate: cmsConfig.cache.revalidate },
    });

    if (categoryResponse.ok) {
      const categoryData = await categoryResponse.json();
      const category = categoryData?.docs?.[0];
      if (category && typeof category.name === "string") {
        categoryName = category.name;
      } else {
        notFound();
      }
    } else {
      notFound();
    }
  } catch (error) {
    console.error("[CategoryPage] 获取分类信息失败:", error);
    notFound();
  }

  // 根据分类名称获取文章
  const articleResponse = await fetchArticlesClient({
    limit: PAGE_SIZE,
    locale: cmsConfig.defaults.locale,
    category: categoryName,
  });
  const articles = articleResponse?.items ?? [];

  // 获取所有分类数据
  const url = `${cmsConfig.baseUrl}${cmsConfig.endpoints.posts}?where[tenant][equals]=${cmsConfig.tenantId}&where[published][equals]=true&limit=${PAGE_SIZE}&locale=${cmsConfig.defaults.locale}&depth=2`;

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
              const categorySlug =
                typeof catObj.slug === "string" ? catObj.slug : null;
              if (name && categorySlug) {
                allCategoriesMap.set(categorySlug, {
                  name,
                  slug: categorySlug,
                });
              }
            }
          });
        }
      });
    }
  } catch (error) {
    console.warn("[CategoryPage] 获取原始分类数据失败:", error);
  }

  const categories =
    allCategoriesMap.size > 0
      ? Array.from(allCategoriesMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      : [];

  return (
    <main className={styles.page}>
      <section className={styles.heroWrapper}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1>{categoryName}</h1>
            <p>浏览 {categoryName} 分类下的所有提示词</p>
          </div>
        </div>
      </section>

      <CategoryArticles
        initialArticles={articles}
        categories={categories}
        pageSize={articleResponse?.pageSize ?? PAGE_SIZE}
        totalPages={articleResponse?.totalPages ?? 1}
        initialPage={articleResponse?.page ?? 1}
        categorySlug={slug}
        categoryName={categoryName}
      />
    </main>
  );
}

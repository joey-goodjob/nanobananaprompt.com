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
  const categories = Array.from(
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

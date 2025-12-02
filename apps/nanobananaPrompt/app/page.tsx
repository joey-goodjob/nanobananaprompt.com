import ArticleSection from "./_components/article";
import Hero from "./_components/hero";
import WhyChooseSection from "./_components/why-choose";
import TutorialsGuidesSection from "./_components/tutorials-guides";
import InspirationGallerySection from "./_components/inspiration-gallery";
import CommunityShowcaseSection from "./_components/showcase";
import FaqSection from "./_components/faq";
import CtaSection from "./_components/cta";
import { cmsConfig, fetchArticlesClient } from "@/lib/cms-client";
import styles from "./page.module.css";

export const revalidate = cmsConfig.cache.revalidate;

export default async function HomePage() {
  const articleResponse = await fetchArticlesClient({ limit: 18 });
  const articles = articleResponse?.items ?? [];
  const total = articleResponse?.total ?? articles.length;
  const totalPages = articleResponse?.totalPages ?? 1;
  const pageSize = articleResponse?.pageSize ?? 18;
  const featuredArticle = articles[0];

  return (
    <main className={styles.page}>
      <Hero totalArticles={total} featuredArticle={featuredArticle} />

      <ArticleSection
        initialArticles={articles}
        initialPage={articleResponse?.page ?? 1}
        totalPages={totalPages}
        pageSize={pageSize}
      />

      <WhyChooseSection />
      <TutorialsGuidesSection />
      <InspirationGallerySection />
      <CommunityShowcaseSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  fetchArticlesClient,
  fetchPostClient,
} from "@/lib/cms-client";
import ArticleContent from "./article-content";

type RouteParams = { slug: string } | Promise<{ slug: string }>;

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const articleResponse = await fetchArticlesClient({ limit: 50 });
  return (
    articleResponse?.items.map((article) => ({
      slug: article.slug,
    })) ?? []
  );
}

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchPostClient(slug);

  if (!article) {
    return {
      title: `Nanobanana Prompt · ${slug}`,
      description: "Nanobanana 提示词详情页",
    };
  }

  return {
    title: `${article.title} | Nanobanana Prompt`,
    description:
      article.description ||
      article.excerpt ||
      "Nanobanana 提示词拆解与 SEO 策略。",
    openGraph: {
      title: article.title,
      description: article.description || article.excerpt || "",
      type: "article",
      url: `/posts/${article.slug}`,
    },
    alternates: {
      canonical: `/posts/${article.slug}`,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: RouteParams;
}) {
  const { slug } = await params;
  const article = await fetchPostClient(slug);

  if (!article) {
    notFound();
  }

  return <ArticleContent slug={slug} initialArticle={article} />;
}

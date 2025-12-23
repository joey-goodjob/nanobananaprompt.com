import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchArticleClient } from "@/lib/cms-client";
import PageRenderer from "@/app/_components/page-renderer";

type RouteParams = { slug: string } | Promise<{ slug: string }>;

export const revalidate = 60;
export const dynamicParams = true;

/**
 * 生成静态路径
 * 暂时不预生成 landing pages，按需生成
 */
export async function generateStaticParams() {
  // 可以在这里预生成重要的 landing pages
  // 例如: return [{ slug: 'about' }, { slug: 'contact' }];
  return [{ slug: "text-to-image" }];
}

/**
 * 生成元数据
 */
export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { slug } = await params;
  // CMS 中的 slug 格式是 /text-to-image，需要添加前缀斜杠
  const cmsSlug = slug.startsWith('/') ? slug : `/${slug}`;
  const page = await fetchArticleClient(cmsSlug);

  if (!page) {
    return {
      title: `页面 · ${slug}`,
      description: "页面未找到",
    };
  }

  return {
    title: `${page.title} | Nanobanana`,
    description: page.description || page.excerpt || page.title,
    openGraph: {
      title: page.title,
      description: page.description || page.excerpt || "",
      type: "website",
      url: `/pages/${page.slug}`,
      images: page.coverImage ? [{ url: page.coverImage }] : [],
    },
    alternates: {
      canonical: `/pages/${page.slug}`,
    },
  };
}

/**
 * Landing Page 页面组件
 */
export default async function LandingPage({ params }: { params: RouteParams }) {
  const { slug } = await params;
  // CMS 中的 slug 格式是 /text-to-image，需要添加前缀斜杠
  const cmsSlug = slug.startsWith('/') ? slug : `/${slug}`;
  const page = await fetchArticleClient(cmsSlug);

  if (!page) {
    notFound();
  }

  return (
    <PageRenderer
      page={page}
      pageType="landing-page"
      showMeta={false}
      showBreadcrumb={false}
    />
  );
}

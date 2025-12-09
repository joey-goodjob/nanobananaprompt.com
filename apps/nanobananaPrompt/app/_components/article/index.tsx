"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ArticleList, {
  type ArticleListProps,
} from "@/app/_components/article-list";
import { fetchArticlesClient } from "@/lib/cms-client";
import { useLanguage } from "../language-provider";

type ArticleSectionProps = ArticleListProps & {
  initialPage: number;
  totalPages: number;
  pageSize: number;
};

export default function ArticleSection({
  articles: initialArticles,
  initialPage,
  totalPages,
  pageSize,
}: ArticleSectionProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  // 保留这些状态用于语言切换时的数据刷新
  const [page, setPage] = useState(initialPage);
  const [totalPageCount, setTotalPageCount] = useState(totalPages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 首页始终显示"展开更多"按钮，点击后跳转到 /prompts 页面
  const hasMore = true;
  const loadingMore = false;

  useEffect(() => {
    let cancelled = false;

    async function refreshArticles() {
      setLoading(true);
      try {
        const response = await fetchArticlesClient({
          limit: pageSize,
          page: 1,
          locale: language.locale,
        });
        if (!cancelled && response) {
          setArticles(response.items);
          setPage(response.page);
          setTotalPageCount(response.totalPages ?? response.page ?? 1);
          setError(null);
        } else if (!response) {
          setError("无法连接 CMS，请稍后重试。");
        }
      } catch (err) {
        console.error("[ArticleSection] refresh failed", err);
        if (!cancelled) {
          setError("网络异常，暂时无法获取 Nanobanana 文章。");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    refreshArticles();
    return () => {
      cancelled = true;
    };
  }, [language.locale, pageSize]);

  const handleLoadMore = useCallback(() => {
    // 首页的"展开更多"按钮跳转到 /prompts 页面
    router.push("/prompts");
  }, [router]);

  const placeholderMessage = useMemo(() => {
    if (loading) return "正在刷新 Nanobanana 提示词...";
    if (error) return error;
    return "暂时还没有来自 CMS 的文章，先写一篇吧。";
  }, [loading, error]);

  return (
    <ArticleList
      articles={articles}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      placeholder={placeholderMessage}
    />
  );
}

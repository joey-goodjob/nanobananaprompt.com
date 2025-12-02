import type { ArticleListItem } from "@/types/cms";

type DateVariant = "short" | "long";

const dateFormatters: Record<DateVariant, Intl.DateTimeFormat> = {
  short: new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
  long: new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
};

export function formatArticleDate(value?: string, variant: DateVariant = "short") {
  if (!value) return "";
  try {
    return dateFormatters[variant].format(new Date(value));
  } catch {
    return value;
  }
}

type ArticleSummary = Pick<
  ArticleListItem,
  "excerpt" | "description" | "htmlContent"
>;

function extractPlainText(html?: string) {
  if (!html) return undefined;
  const withoutTags = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return withoutTags || undefined;
}

export function getArticleDescription(article: ArticleSummary) {
  return (
    article.excerpt ||
    article.description ||
    extractPlainText(article.htmlContent) ||
    "深入解析 Nanobanana 提示词的结构、变量和落地案例。"
  );
}

export function readableTag(tag: string) {
  return tag.replace(/[-_]/g, " ").toUpperCase();
}

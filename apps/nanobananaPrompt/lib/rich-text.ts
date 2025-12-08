import type { ArticleBlock } from "@/types/cms";

const BLOCK_IMAGE_KEYS = [
  "coverImage",
  "image",
  "media",
  "asset",
  "heroImage",
  "gallery",
  "thumbnail",
  "figure",
  "file",
];

function extractUrlLikeValue(candidate: unknown): string | undefined {
  if (!candidate) return undefined;
  if (typeof candidate === "string") {
    return candidate;
  }

  if (typeof candidate === "object") {
    const record = candidate as Record<string, unknown>;
    if (typeof record.url === "string") return record.url;
    if (typeof record.src === "string") return record.src;
    if (typeof record.path === "string") return record.path;
  }

  return undefined;
}

export function normalizeImageSrc(src?: string | null): string | undefined {
  if (!src) return undefined;

  const trimmed = src.trim();
  if (!trimmed) return undefined;

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith("/_next/image")) {
    const queryString = trimmed.split("?")[1];
    if (!queryString) return trimmed;

    const params = new URLSearchParams(queryString.replace(/&amp;/gi, "&"));
    const urlParam = params.get("url");
    if (urlParam) {
      try {
        return decodeURIComponent(urlParam);
      } catch {
        return urlParam;
      }
    }
  }

  return trimmed;
}

export function extractFirstImageFromHtml(html?: string): string | undefined {
  if (!html) return undefined;
  const match = html.match(/<img[^>]+(?:data-src|src)=["']([^"']+)["']/i);
  if (!match) return undefined;
  return normalizeImageSrc(match[1]);
}

export function extractImageFromBlocks(blocks?: ArticleBlock[]): string | undefined {
  if (!blocks?.length) return undefined;

  for (const block of blocks) {
    if (!block) continue;

    if (typeof block === "string") {
      const inline = extractFirstImageFromHtml(block);
      if (inline) return inline;
      continue;
    }

    for (const key of BLOCK_IMAGE_KEYS) {
      const value = extractUrlLikeValue(block[key]);
      const normalized = normalizeImageSrc(value);
      if (normalized) {
        return normalized;
      }
    }

    if (Array.isArray(block.blocks)) {
      const nested = extractImageFromBlocks(
        block.blocks as ArticleBlock[] | undefined
      );
      if (nested) return nested;
    }

    if (Array.isArray(block.children)) {
      const nested = extractImageFromBlocks(
        block.children as ArticleBlock[] | undefined
      );
      if (nested) return nested;
    }
  }

  return undefined;
}

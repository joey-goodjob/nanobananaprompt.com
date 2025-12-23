/**
 * Why Choose Us 组件 (Style 01)
 *
 * 布局结构：
 * 1. 顶部：主标题 + 描述
 * 2. 中间：高亮特性展示 (左文右图) - 使用 items[0]
 * 3. 底部：特性网格 (三列) - 使用 items[1...]
 */

"use client";

import React, { useEffect, useState } from "react";
import {
  Laptop,
  RefreshCw,
  FileText,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  type LucideIcon,
} from "lucide-react";
import type { ComponentBlockItem } from "../../types";

type CMSMedia = {
  url?: string;
  alt?: string | null;
  thumbnailURL?: string | null;
  sizes?: Record<string, { url?: string | null }>;
  [key: string]: unknown;
};

// 扩展 Item 类型以包含图片和图标
interface FeatureItem extends ComponentBlockItem {
  image?: string | CMSMedia;
  images?: Array<string | CMSMedia>; // 媒体列表,支持多个图片/视频
  icon?: string;
}

interface WhyChooseBlockProps {
  title?: string;
  description?: string;
  items?: FeatureItem[];
}

const CMS_BASE_URL = (() => {
  const host = process.env.NEXT_PUBLIC_CMS_HOST || "https://cms.vumiai.com";
  return host.replace(/^['"]|['"]$/g, "").replace(/\/$/, "");
})();

const buildCmsAssetUrl = (url?: string | null) => {
  if (!url) {
    return undefined;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return undefined;
  }

  if (
    /^https?:\/\//i.test(trimmed) ||
    /^\/\//.test(trimmed) ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;
  }

  const shouldPrefixCmsHost =
    trimmed.startsWith("/api/") ||
    trimmed.startsWith("/media/") ||
    trimmed.startsWith("/uploads/") ||
    trimmed.startsWith("api/") ||
    trimmed.startsWith("media/") ||
    trimmed.startsWith("uploads/");

  if (!shouldPrefixCmsHost) {
    return trimmed;
  }

  return `${CMS_BASE_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
};

const resolveImageData = (
  image?: FeatureItem["image"]
): { src?: string; alt?: string } => {
  if (!image) {
    return { src: undefined, alt: undefined };
  }

  if (typeof image === "string") {
    return { src: buildCmsAssetUrl(image), alt: undefined };
  }

  const candidateUrl =
    image.url ||
    image.thumbnailURL ||
    (image.sizes
      ? Object.values(image.sizes).find((size) => size?.url)?.url ?? undefined
      : undefined);

  return {
    src:
      typeof candidateUrl === "string"
        ? buildCmsAssetUrl(candidateUrl)
        : undefined,
    alt: image.alt ?? undefined,
  };
};

// 图标映射表
const ICON_MAP: Record<string, LucideIcon> = {
  laptop: Laptop,
  refresh: RefreshCw,
  file: FileText,
  check: CheckCircle2,
  zap: Zap,
  shield: Shield,
};

export default function WhyChooseSection({
  title,
  description,
  items = [],
}: WhyChooseBlockProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 如果没有数据，不渲染
  if (!items || items.length === 0) {
    return null;
  }

  // 分离数据：第一个作为高亮，其余作为网格
  const highlightItem = items[0];
  const gridItems = items.slice(1);

  // 获取媒体列表，优先使用 images 数组，否则使用单个 image
  const mediaList =
    highlightItem.images && highlightItem.images.length > 0
      ? highlightItem.images
      : highlightItem.image
      ? [highlightItem.image]
      : [];

  // 辅助函数：获取图标组件
  const getIcon = (iconName?: string, index?: number) => {
    // 1. 尝试通过名称匹配
    if (iconName && ICON_MAP[iconName.toLowerCase()]) {
      const Icon = ICON_MAP[iconName.toLowerCase()];
      return <Icon className="w-8 h-8" />;
    }

    // 2. 如果没有匹配，根据索引返回默认图标 (为了演示效果)
    const defaultIcons = [Laptop, RefreshCw, FileText];
    const FallbackIcon = defaultIcons[index ? index % defaultIcons.length : 0];

    return <FallbackIcon className="w-8 h-8" />;
  };

  // 辅助函数：判断URL是否为视频
  const isVideoUrl = (url?: string) => {
    if (!url) return false;
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
    return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
  };

  // 辅助函数：渲染媒体内容(图片或视频)
  const renderMedia = (media?: FeatureItem["image"], alt?: string) => {
    const mediaData = resolveImageData(media);
    const mediaUrl = mediaData.src;
    const mediaAlt = mediaData.alt || alt || "Media content";

    if (!mediaUrl) {
      return (
        <div className="w-full h-full flex items-center justify-center" style={{
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
          color: 'var(--text-tertiary)'
        }}>
          <span className="text-sm">No Media</span>
        </div>
      );
    }

    if (isVideoUrl(mediaUrl)) {
      return isClient ? (
        <video
          src={mediaUrl}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <div className="w-full h-full" style={{ backgroundColor: 'var(--bg-inverse)' }} />
      );
    }

    return (
      <img
        src={mediaUrl}
        alt={mediaAlt}
        className="w-full h-full object-cover"
      />
    );
  };

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--bg-inverse)', color: 'var(--text-inverse)' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 1. 顶部 Header 区域 */}
        <div className="text-center mb-16 md:mb-20">
          {title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight" style={{ color: 'var(--text-inverse)' }}>
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm md:text-base max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              {description}
            </p>
          )}
        </div>

        {/* 2. 中间 Highlight 区域 (左文右图) */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-20">
          {/* 左侧文本 */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h3 className="text-3xl md:text-4xl font-extrabold leading-tight" style={{ color: 'var(--text-inverse)' }}>
              {highlightItem.title}
            </h3>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              {highlightItem.description}
            </p>
          </div>

          {/* 右侧媒体区域 */}
          <div className="w-full lg:w-1/2 relative group">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="aspect-video w-full relative flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                {mediaList.length > 0 ? (
                  <>
                    {mediaList.length === 1 ? (
                      // 只有一个媒体时,占据整个宽度
                      <div className="w-full h-full rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: 'var(--surface-primary)' }}>
                        {renderMedia(mediaList[0], "Media")}
                      </div>
                    ) : (
                      // 有两个媒体时,左右排列
                      <>
                        {/* 左侧媒体 */}
                        <div className="flex-1 h-full rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: 'var(--surface-primary)' }}>
                          {renderMedia(mediaList[0], "Left media")}
                        </div>

                        {/* 右侧媒体 */}
                        <div className="flex-1 h-full rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: 'var(--surface-primary)' }}>
                          {renderMedia(mediaList[1], "Right media")}
                        </div>

                        {/* 中间箭头 */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center border z-10" style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'var(--text-inverse)',
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        }}>
                          <ArrowRight className="w-6 h-6" />
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
                    color: 'var(--text-tertiary)'
                  }}>
                    <span className="text-sm">No Media</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. 底部 Grid 区域 */}
        {gridItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            {gridItems.map((item, index) => (
              <div key={item.id || index} className="flex flex-col items-start">
                {/* 图标 */}
                <div className="mb-4 p-3 rounded-lg border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-inverse)' }}>
                  {getIcon(item.icon, index)}
                </div>

                {/* 标题 */}
                <h4 className="text-xl font-bold mb-3" style={{ color: 'var(--text-inverse)' }}>
                  {item.title}
                </h4>

                {/* 描述 */}
                <p className="leading-relaxed text-base" style={{ color: 'var(--text-tertiary)' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

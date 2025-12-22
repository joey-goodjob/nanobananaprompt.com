"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";

// Unsplash 图片源，使用关键词搜索
const CATEGORY_IMAGES: Record<string, string> = {
  // 写作类 - 书写、笔、纸
  writing:
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2573&auto=format&fit=crop",
  // 编程类 - 代码、屏幕
  coding:
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2670&auto=format&fit=crop",
  code: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2670&auto=format&fit=crop",
  // 设计类 - 调色板、艺术
  design:
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
  art: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
  // 商业类 - 会议、办公
  business:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop",
  marketing:
    "https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=2676&auto=format&fit=crop",
  // 教育类 - 书籍、学习
  education:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2622&auto=format&fit=crop",
  learning:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2622&auto=format&fit=crop",
  // 生活/其他 - 自然、日常
  lifestyle:
    "https://images.unsplash.com/photo-1511871893393-82e9c16b81e3?q=80&w=2670&auto=format&fit=crop",
  // 默认备选
  default:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
};

type Category = {
  name: string;
  slug: string;
};

type CategoryHeroGridProps = {
  categories: Category[];
};

export default function CategoryHeroGrid({
  categories,
}: CategoryHeroGridProps) {
  // 只展示前 8 个分类，防止过多破坏布局
  const displayCategories = categories.slice(0, 8);

  // 根据分类 slug 或 name 关键词匹配图片
  const getImageUrl = (category: Category): string => {
    const key = category.slug.toLowerCase();
    // 精确匹配
    if (CATEGORY_IMAGES[key]) return CATEGORY_IMAGES[key];

    // 关键词匹配
    const keys = Object.keys(CATEGORY_IMAGES);
    for (const k of keys) {
      if (key.includes(k) && CATEGORY_IMAGES[k]) return CATEGORY_IMAGES[k];
    }

    // 默认
    return CATEGORY_IMAGES.default || "";
  };

  if (!displayCategories || displayCategories.length === 0) {
    return null;
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.badge}>Nanobanana 官方提示词合集</span>
        <h1 className={styles.title}>Nanobanana Prompt Atlas</h1>
        <p className={styles.description}>
          Nanobanana 官方团队整理的 Prompt
          Atlas，收录产品、营销、运营多场景的提示词。
          每篇文章都附结构化模板、变量建议与验证步骤，复制即可投入工作流。
        </p>
      </div>

      <div className={styles.gridContainer}>
        {displayCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`} // 使用 slug 跳转到动态路由 /[slug]
            className={styles.card}
          >
            <Image
              src={getImageUrl(cat)}
              alt={cat.name}
              fill
              className={styles.backgroundImage}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className={styles.overlay}>
              <span className={styles.categoryName}>{cat.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

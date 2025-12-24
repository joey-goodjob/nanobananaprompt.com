"use client";

import Link from "next/link";
import styles from "./index.module.css";

// Unsplash 图片源，根据实际分类匹配
const CATEGORY_IMAGES: Record<string, string> = {
  // 3D 模型 - 3D 渲染、建模
  "3d-model":
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop",
  // 换脸 - 人脸、肖像
  "face-swap":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop",
  // 男性照片 - 男性肖像
  "men-photo":
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop",
  // 照片修复 - 老照片、复古
  "photo-restoration":
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2670&auto=format&fit=crop",
  // 专业照片 - 摄影、相机
  "professional-photo":
    "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2574&auto=format&fit=crop",
  // 真实感 - 高清人像
  "realistic":
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop",
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
    if (CATEGORY_IMAGES[key]) {

      return CATEGORY_IMAGES[key];
    }

    // 关键词匹配
    const keys = Object.keys(CATEGORY_IMAGES);
    for (const k of keys) {
      if (key.includes(k) && CATEGORY_IMAGES[k]) {

        return CATEGORY_IMAGES[k];
      }
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
            href={`/${cat.slug}`}
            className={styles.card}
          >
            <img
              src={getImageUrl(cat)}
              alt={cat.name}
              className={styles.backgroundImage}
              loading="lazy"
              
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

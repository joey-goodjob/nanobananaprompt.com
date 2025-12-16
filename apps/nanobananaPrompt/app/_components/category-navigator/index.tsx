"use client";

import { useRouter } from "next/navigation";
import styles from "./index.module.css";

type Category = {
  name: string;
  slug: string;
};

type CategoryNavigatorProps = {
  categories: Category[];
};

const DEFAULT_CATEGORY = { name: "全部", slug: "prompts" };

export default function CategoryNavigator({
  categories,
}: CategoryNavigatorProps) {
  const router = useRouter();
  const normalizedCategories = [DEFAULT_CATEGORY, ...categories];

  const handleCategoryClick = (category: Category) => {
    router.push(`/${category.slug}`);
  };

  return (
    <section className={styles.navigator}>
      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          placeholder="模糊搜索提示词、行业、变量..."
          readOnly
        />
        <button type="button" className={styles.refreshButton} disabled>
          刷新
        </button>
      </div>

      <div className={styles.categoryBar}>
        {normalizedCategories.map((category) => (
          <button
            key={category.slug}
            type="button"
            className={styles.categoryButton}
            onClick={() => handleCategoryClick(category)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}

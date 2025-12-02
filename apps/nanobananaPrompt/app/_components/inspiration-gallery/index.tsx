"use client";

import styles from "./index.module.css";

const galleryItems = [
  {
    title: "Nano Banana Prompt Inspiration Gallery",
    description: "精选支柱页、产品页面、活动落地页的提示词截图，展示变量如何映射输出。",
  },
  {
    title: "多语言 Prompt 板块",
    description: "展示同一提示词在 EN/JP/DE 三种语言的变体与语气对照。",
  },
  {
    title: "视觉化 JSON Output",
    description: "把 JSON 输出渲染成卡片，帮助设计/前端理解 Prompt 结构。",
  },
];

export default function InspirationGallerySection() {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Nano Banana Prompt Inspiration Gallery</p>
          <h2 className={styles.title}>灵感图库</h2>
        </div>
        <p className={styles.description}>
          每一张卡片来自真实使用场景，让你知道 Prompt 如何组合图文、结构化字段与品牌语调。
        </p>
      </header>

      <div className={styles.grid}>
        {galleryItems.map((item) => (
          <article key={item.title} className={styles.card}>
            <div className={styles.mock} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

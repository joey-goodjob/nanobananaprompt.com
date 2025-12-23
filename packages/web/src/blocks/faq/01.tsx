/**
 * FAQ Accordion 组件
 * 使用 CMS 数据渲染 FAQ 列表
 */

"use client";

import React from "react";
import type { FAQBlockProps } from "../../types";

export default function FaqSection({
  title,
  description,
  faqs,
  items,
}: FAQBlockProps) {
  // 使用 faqs 或 items 数据
  const faqList = faqs || items || [];

  // 如果没有数据，不显示
  if (!title || !faqList.length) {
    return null;
  }

  return (
    <section className="py-20" style={{ backgroundColor: "var(--bg-inverse)" }}>
      <div className="container px-4 mx-auto max-w-5xl">
        {/* 标题区 */}
        <div className="text-center mb-12">
          {title && (
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              className="mt-3 max-w-3xl mx-auto"
              style={{ color: "var(--text-tertiary)" }}
            >
              {description}
            </p>
          )}
        </div>

        {/* FAQ 列表区 */}
        <div className="grid grid-cols-1 gap-4">
          {faqList.map((item, index) => {
            const title =
              "question" in item && item.question ? item.question : item.title;
            const description =
              "answer" in item && item.answer
                ? String(item.answer)
                : String(item.description ?? "");
            return (
              <div
                key={index}
                className="mt-[24px] p-4 rounded-lg"
                style={{ backgroundColor: "var(--surface-primary)" }}
              >
                <h3
                  className="!text-[28px] font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {`${index + 1}. ${title}`}
                </h3>
                <div className="mt-[12px]">
                  <p
                    className="leading-relaxed"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

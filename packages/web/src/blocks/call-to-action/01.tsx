/**
 * Call to Action 组件 01
 * 简洁美观的行动号召区块
 */

"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface CallToActionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  theme?: "light" | "dark";
}

export default function CallToAction({
  title,
  description,
  buttonText,
  buttonLink,
  theme = "dark",
}: CallToActionProps) {
  // 如果没有标题，不显示
  if (!title) {
    return null;
  }

  const isDark = theme === "dark";

  // 使用 CSS 变量而非硬编码颜色
  const bgStyle = isDark
    ? { background: `linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)` }
    : { background: `linear-gradient(135deg, var(--primary-50) 0%, var(--bg-secondary) 100%)` };

  const titleColor = isDark ? 'var(--text-inverse)' : 'var(--text-primary)';
  const descColor = isDark ? 'var(--text-tertiary)' : 'var(--text-secondary)';

  const buttonStyle = isDark
    ? { backgroundColor: 'var(--surface-primary)', color: 'var(--primary)' }
    : { backgroundColor: 'var(--primary)', color: 'var(--text-inverse)' };

  return (
    <section
      className="py-20 px-4"
      style={bgStyle}
    >
      <div className="container max-w-4xl mx-auto text-center">
        {/* Title */}
        <h2
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ color: titleColor }}
        >
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            style={{ color: descColor }}
          >
            {description}
          </p>
        )}

        {/* CTA Button */}
        {buttonText && (
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href={buttonLink || "#"}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
              style={buttonStyle}
            >
              {buttonText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

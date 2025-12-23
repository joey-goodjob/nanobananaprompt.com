/**
 * Features Grid 组件
 * 左右分栏布局：左侧大标题 + 右侧功能卡片网格
 * 复刻截图样式
 */

"use client";

import React from "react";
import { cn } from "../../lib/utils/utils";
import type { FeaturesGridBlockProps } from "../../types";

export default function FeaturesGrid({
  title,
  subtitle,
  description,
  features,
  columns = 2,
  theme = "dark",
}: FeaturesGridBlockProps) {
  // 如果没有 features 数据，不显示
  if (!features || features.length === 0) {
    return null;
  }

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className="w-full" style={{ backgroundColor: 'var(--bg-inverse)' }}>
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* 左侧标题区域 */}
          <div className="lg:col-span-4">
            {title && (
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" style={{ color: 'var(--text-inverse)' }}>
                {title}
              </h2>
            )}
            {(subtitle || description) && (
              <p className="mt-4 text-base md:text-lg" style={{ color: 'var(--text-tertiary)' }}>
                {subtitle || description}
              </p>
            )}
          </div>

          {/* 右侧功能卡片网格 */}
          <div className="lg:col-span-8">
            <div className={cn("grid gap-6", gridCols)}>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
                  style={{ backgroundColor: 'var(--surface-secondary)' }}
                >
                  {/* 图标 */}
                  {feature.icon && (
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-600) 100%)' }}>
                      {typeof feature.icon === "string" &&
                      feature.icon.startsWith("http") ? (
                        <img
                          src={feature.icon}
                          alt={feature.title}
                          className="h-6 w-6"
                        />
                      ) : (
                        <span className="text-2xl">{feature.icon}</span>
                      )}
                    </div>
                  )}

                  {/* 标题 */}
                  <h3 className="mb-2 text-lg font-semibold md:text-xl" style={{ color: 'var(--text-inverse)' }}>
                    {feature.title}
                  </h3>

                  {/* 描述 */}
                  <p className="text-sm leading-relaxed md:text-base" style={{ color: 'var(--text-tertiary)' }}>
                    {feature.description}
                  </p>

                  {/* 悬停效果 - 边框光晕 */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--primary)/10 0%, var(--accent)/10 100%)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * How It Works Steps 组件
 * 步骤展示组件 - 完全复刻截图UI
 */

"use client";

import React from "react";
import { cn } from "../../lib/utils/utils";
import type { HowItWorksStepsProps } from "../../types";

export default function HowItWorksSteps({
  title,
  subtitle,
  description,
  steps,
  theme = "light",
}: HowItWorksStepsProps) {
  // 如果没有 steps 数据，不显示
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="w-full" style={{ backgroundColor: 'var(--bg-inverse)' }}>
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
        {/* 标题区域 */}
        {(title || subtitle || description) && (
          <div className="mb-16 text-center">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl" style={{ color: 'var(--text-inverse)' }}>
                {title}
              </h2>
            )}
            {(subtitle || description) && (
              <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg" style={{ color: 'var(--text-tertiary)' }}>
                {subtitle || description}
              </p>
            )}
          </div>
        )}

        {/* 步骤网格 */}
        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {/* 连接线 - 只在桌面端显示 */}
          <div className="absolute top-8 left-0 right-0 hidden h-0.5 md:block">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-12">
              {steps.map((_, index) => (
                <React.Fragment key={index}>
                  {index < steps.length - 1 && (
                    <div className="h-0.5 flex-1 border-t-2 border-dashed" style={{ borderColor: 'var(--surface-border)' }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 步骤卡片 */}
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center"
            >
              {/* 步骤数字 */}
              <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold shadow-lg" style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--text-inverse)'
              }}>
                {step.number || index + 1}
              </div>

              {/* 步骤内容 */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold md:text-2xl" style={{ color: 'var(--text-inverse)' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed md:text-base" style={{ color: 'var(--text-tertiary)' }}>
                  {step.description}
                </p>
              </div>

              {/* 可选图标或图片 */}
              {step.icon && (
                <div className="mt-6">
                  {typeof step.icon === "string" &&
                  step.icon.startsWith("http") ? (
                    <img
                      src={step.icon}
                      alt={step.title}
                      className="h-20 w-20 object-contain"
                    />
                  ) : (
                    <span className="text-4xl">{step.icon}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 可选的CTA按钮 */}
        {steps[0]?.cta && (
          <div className="mt-16 text-center">
            <a
              href={steps[0].cta.href}
              className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold transition-all hover:shadow-lg"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--text-inverse)'
              }}
            >
              {steps[0].cta.text}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

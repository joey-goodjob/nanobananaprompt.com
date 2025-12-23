/**
 * Features Cards 组件
 * 卡片式功能展示 - 支持CMS配置
 */

"use client";

import { ImageIcon, Video, Zap, Monitor, Layers, Download } from "lucide-react";
import type { FeaturesCardsBlockProps } from "../../types";

const iconMap = {
  image: ImageIcon,
  video: Video,
  zap: Zap,
  monitor: Monitor,
  layers: Layers,
  download: Download,
};

export default function FeaturesCards({
  block,
  ...props
}: { block?: any } & FeaturesCardsBlockProps) {
  // 如果是通过 block prop 传递的数据，解构它
  const actualProps = block || props;
  const {
    title,
    subtitle,
    description,
    features: featuresFromProps,
    items,
    theme = "dark",
  } = actualProps;

  // 支持 features 或 items 字段名
  const features = featuresFromProps || items;

  // 如果既没有 features 数据，也没有标题/描述，不显示
  if ((!features || features.length === 0) && !title && !subtitle && !description) {
    return null;
  }

  return (
    <section
      className="py-20"
      style={{
        background: 'linear-gradient(to bottom, var(--primary-50), var(--bg-primary))'
      }}
    >
      <div className="container mx-auto max-w-6xl px-4">
        {/* 标题区域 */}
        {(title || subtitle || description) && (
          <div className="mb-16 text-center">
            {title && (
              <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl" style={{ color: 'var(--text-primary)' }}>
                {title}
              </h2>
            )}
            {(subtitle || description) && (
              <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
                {subtitle || description}
              </p>
            )}
          </div>
        )}

        {/* 功能卡片网格 */}
        {features && features.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8">
            {features.map((feature, index) => {
            const IconComponent = feature.iconType && iconMap[feature.iconType as keyof typeof iconMap];

            return (
              <div
                key={index}
                className="card shadow-xl transition-all duration-300 hover:shadow-2xl w-full md:w-80 lg:w-96 border-2"
                style={{
                  backgroundColor: 'var(--surface-primary)',
                  borderColor: 'var(--surface-border)'
                }}
              >
                <div className="card-body p-8">
                  {/* 图标 */}
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-600) 100%)' }}>
                    {IconComponent ? (
                      <IconComponent className="h-8 w-8" style={{ color: 'var(--text-inverse)' }} />
                    ) : (
                      <Zap className="h-8 w-8" style={{ color: 'var(--text-inverse)' }} />
                    )}
                  </div>

                  {/* 标题和描述 */}
                  <h3 className="card-title mb-4 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </section>
  );
}

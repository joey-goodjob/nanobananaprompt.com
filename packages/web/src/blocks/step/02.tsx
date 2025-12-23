"use client";

import { ArrowRight } from "lucide-react";
import type { HowItWorksStepsProps } from "../../types";

export default function HowItWorks({ title, description, steps: stepsData }: HowItWorksStepsProps) {
  // 使用 CMS 传入的 steps 数据
  const steps = stepsData && stepsData.length > 0
    ? stepsData.map((item, index: number) => ({
        number: String(index + 1),
        title: item.title,
        description: item.description,
      }))
    : [];

  // 如果没有数据，显示提示
  if (!title || !steps.length) {
    return (
      <section className="py-20" style={{ backgroundColor: 'var(--bg-inverse)' }}>
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="text-center" style={{ color: 'var(--text-tertiary)' }}>
            <p>No step data available from CMS</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20" style={{ backgroundColor: 'var(--bg-inverse)' }}>
      <div className="container px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text-inverse)' }}>
            {title}
          </h2>
          {description && (
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-tertiary)' }}>
              {description}
            </p>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-start justify-between max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 text-center relative">
              {/* Step Number Circle */}
              <div className="flex justify-center mb-8">
                <div
                  className="flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-600) 100%)',
                    color: 'var(--text-inverse)'
                  }}
                >
                  {step.number}
                </div>
              </div>

              {/* Step Content */}
              <div className="px-4">
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-inverse)' }}>
                  {step.title}
                </h3>
                <p className="leading-relaxed text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  {step.description}
                </p>
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="absolute top-8 -right-4" style={{ color: 'var(--text-tertiary)' }}>
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Step Number Circle */}
              <div className="flex justify-center mb-6">
                <div
                  className="flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-600) 100%)',
                    color: 'var(--text-inverse)'
                  }}
                >
                  {step.number}
                </div>
              </div>

              {/* Step Content */}
              <div className="px-4">
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-inverse)' }}>
                  {step.title}
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

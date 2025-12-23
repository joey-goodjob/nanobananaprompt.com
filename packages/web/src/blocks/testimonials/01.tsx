/**
 * Testimonials Marquee Grid 组件
 * 完全复刻参考代码的UI设计
 * 用户评论滚动展示组件
 */

"use client";

import React from "react";
import { cn } from "../../lib/utils/utils";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import type { TestimonialsMarqueeGridProps } from "../../types";

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "p-4 md:p-8 rounded-xl min-h-[230px] h-full max-w-md md:max-w-lg mx-4 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
        className
      )}
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {children}
    </div>
  );
};

export const Quote = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn("text-sm md:text-base font-semibold py-2", className)}
      style={{ color: "var(--text-primary)" }}
    >
      {children}
    </h3>
  );
};

export const QuoteDescription = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <p
      className={cn("text-xs md:text-sm font-normal max-w-sm", className)}
      style={{ color: "var(--text-tertiary)", ...style }}
    >
      {children}
    </p>
  );
};

export const TestimonialsGrid = ({
  testimonials,
}: {
  testimonials: Array<{
    src: string;
    quote: string;
    name: string;
    designation?: string;
  }>;
}) => {
  const first = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const second = testimonials.slice(Math.ceil(testimonials.length / 2));

  return (
    <div
      className="relative"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <Marquee direction="right" pauseOnHover speed={50}>
        {first.map((testimonial, index) => (
          <Card key={`testimonial-${testimonial.src}-${index}`}>
            <Quote>{testimonial.quote}</Quote>
            <div className="flex gap-2 items-center mt-8">
              <Image
                src={testimonial.src}
                alt={testimonial.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <QuoteDescription style={{ color: "var(--text-secondary)" }}>
                  {testimonial.name}
                </QuoteDescription>
                {testimonial.designation && (
                  <QuoteDescription style={{ color: "var(--text-tertiary)" }}>
                    {testimonial.designation}
                  </QuoteDescription>
                )}
              </div>
            </div>
          </Card>
        ))}
      </Marquee>
      <Marquee className="mt-10" direction="right" pauseOnHover speed={70}>
        {second.map((testimonial, index) => (
          <Card key={`testimonial-${testimonial.src}-${index}`}>
            <Quote>{testimonial.quote}</Quote>
            <div className="flex gap-2 items-center mt-8">
              <Image
                src={testimonial.src}
                alt={testimonial.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <QuoteDescription style={{ color: "var(--text-secondary)" }}>
                  {testimonial.name}
                </QuoteDescription>
                {testimonial.designation && (
                  <QuoteDescription style={{ color: "var(--text-tertiary)" }}>
                    {testimonial.designation}
                  </QuoteDescription>
                )}
              </div>
            </div>
          </Card>
        ))}
      </Marquee>
    </div>
  );
};

export default function TestimonialsMarqueeGrid({
  title,
  description,
  testimonials,
  items,
}: TestimonialsMarqueeGridProps) {
  // 使用 testimonials 或 items 数据
  const testimonialList = testimonials || items || [];

  // 转换 CMS 数据格式
  const formattedTestimonials = testimonialList.map((item: any) => ({
    src: item.avatar || item.image || "/images/default-avatar.png",
    quote: item.content || item.quote || item.description || "",
    name: item.name || item.author || "",
    designation: item.position || item.authorTitle || item.title || "",
  }));

  // 如果没有数据，不显示
  if (!formattedTestimonials.length) {
    return null;
  }

  return (
    <section
      className="w-full py-20"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 overflow-hidden h-full">
        {(title || description) && (
          <div className="pb-20">
            {title && (
              <h2
                className="pt-4 font-bold text-center text-lg md:text-2xl"
                style={{ color: "var(--text-primary)" }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                className="text-base mt-4"
                style={{ color: "var(--text-tertiary)" }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        <div className="relative">
          <div className="h-full overflow-hidden w-full">
            <TestimonialsGrid testimonials={formattedTestimonials} />
          </div>
        </div>

        <div
          className="absolute bottom-0 inset-x-0 h-40 w-full bg-gradient-to-t to-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to top, var(--bg-primary), transparent)",
          }}
        ></div>
      </div>
    </section>
  );
}

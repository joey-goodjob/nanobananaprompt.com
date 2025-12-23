/**
 * Simple FAQ with Background 组件
 * 完全复刻参考代码的UI设计
 * 使用 Lucide React 替代 Tabler Icons
 */

"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { SimpleFAQBlockProps } from "../../types";

const FAQItem = ({
  question,
  answer,
  setOpen,
  open,
}: {
  question: string;
  answer: string;
  open: string | null;
  setOpen: (open: string | null) => void;
}) => {
  const isOpen = open === question;

  return (
    <div
      className="mb-8 w-full cursor-pointer rounded-lg p-4 shadow-input"
      style={{ backgroundColor: 'var(--bg-inverse)' }}
      onClick={() => {
        if (isOpen) {
          setOpen(null);
        } else {
          setOpen(question);
        }
      }}
    >
      <div className="flex items-start">
        <div className="relative mr-4 mt-1 h-6 w-6 flex-shrink-0">
          <ChevronUp
            className={`absolute inset-0 h-6 w-6 transform transition-all duration-200 ${isOpen ? 'rotate-90 scale-0' : ''}`}
            style={{ color: 'var(--text-inverse)' }}
          />
          <ChevronDown
            className={`absolute inset-0 h-6 w-6 rotate-90 scale-0 transform transition-all duration-200 ${isOpen ? 'rotate-0 scale-100' : ''}`}
            style={{ color: 'var(--text-inverse)' }}
          />
        </div>
        <div>
          <h3 className="text-lg font-medium" style={{ color: 'var(--text-inverse)' }}>{question}</h3>
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {answer.split("").map((line, index) => (
                  <motion.span
                    initial={{ opacity: 0, filter: "blur(5px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                      delay: index * 0.005,
                    }}
                    key={index}
                  >
                    {line}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default function SimpleFaqWithBackground({
  title,
  description,
  supportEmail,
  faqs,
  items,
  theme = "light",
}: SimpleFAQBlockProps) {
  const [open, setOpen] = useState<string | null>(null);

  // 使用 faqs 或 items 数据
  const faqList = faqs || items || [];

  // 如果没有数据，不显示
  if (!title || !faqList.length) {
    return null;
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-20 md:px-8 md:py-40" style={{ backgroundColor: 'var(--bg-inverse)' }}>
      <h2
        className="text-center text-4xl font-medium tracking-tight md:text-5xl"
        style={{ color: 'var(--text-inverse)' }}
      >
        {title}
      </h2>
      {description && (
        <p className="mx-auto max-w-lg text-center text-base" style={{ color: 'var(--text-inverse)' }}>
          {description}
          {supportEmail && (
            <>
              {" "}
              <a
                href={`mailto:${supportEmail}`}
                style={{ color: 'var(--primary)' }}
                className="underline"
              >
                {supportEmail}
              </a>
            </>
          )}
        </p>
      )}
      <div className="mx-auto mt-10 w-full max-w-3xl">
        {faqList.map((faq, index) => {
          const question = String(
            "question" in faq && faq.question ? faq.question : faq.title
          );
          const answer = String(
            "answer" in faq && faq.answer ? faq.answer : (faq.description ?? "")
          );
          return (
            <FAQItem
              key={index}
              question={question}
              answer={answer}
              open={open}
              setOpen={setOpen}
            />
          );
        })}
      </div>
    </div>
  );
}

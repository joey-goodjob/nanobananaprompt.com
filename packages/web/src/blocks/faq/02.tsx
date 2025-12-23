/**
 * FAQ Accordion Block 组件
 * 完全复刻参考代码的UI设计
 */

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { FAQBlockProps } from "../../types";

interface FAQItemProps {
  question: string;
  answer: string;
  open: string | null;
  setOpen: (open: string | null) => void;
}

const FAQItem = ({ question, answer, open, setOpen }: FAQItemProps) => {
  const isOpen = open === question;

  return (
    <div
      className="cursor-pointer py-4"
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
          <Plus
            className={`absolute inset-0 h-6 w-6 transform transition-all duration-200 ${isOpen ? 'rotate-90 scale-0' : ''}`}
            style={{ color: 'var(--primary)' }}
          />
          <Minus
            className={`absolute inset-0 h-6 w-6 rotate-90 scale-0 transform transition-all duration-200 ${isOpen ? 'rotate-0 scale-100' : ''}`}
            style={{ color: 'var(--primary)' }}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
            {question}
          </h3>
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
                style={{ color: 'var(--text-secondary)' }}
              >
                <p className="mt-2">{answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default function FAQAccordionBlock({
  title,
  description,
  faqs,
  items,
  theme = "light",
}: FAQBlockProps) {
  const [open, setOpen] = useState<string | null>(null);

  // 使用 faqs 或 items 数据
  const faqList = faqs || items || [];

  // 如果没有数据，不显示
  if (!title || !faqList.length) {
    return null;
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-20 md:grid-cols-2 md:px-8 md:py-40" style={{ backgroundColor: 'var(--bg-inverse)' }}>
      <div>
        {title && (
          <h2
            className="text-center text-4xl font-bold tracking-tight md:text-left md:text-6xl"
            style={{ color: 'var(--text-inverse)' }}
          >
            {title}
          </h2>
        )}
        {description && (
          <p
            className="mt-4 text-center text-base md:text-left md:text-lg"
            style={{ color: 'var(--text-inverse)' }}
          >
            {description}
          </p>
        )}
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--surface-border)' }}>
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

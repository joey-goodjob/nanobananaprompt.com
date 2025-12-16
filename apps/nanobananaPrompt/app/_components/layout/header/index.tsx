"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../language-provider";
import styles from "./index.module.css";

const promptCategories = [
  {
    label: "Prompt Effects",
    items: [
      { href: "/prompts?category=3d%20model", label: "3D Model" },
      {
        href: "/prompts?category=Photo%20Restoration",
        label: "Photo Restoration",
      },
      { href: "/prompts?category=Color%20Enhancer", label: "Color Enhancer" },
      { href: "/prompts?category=AI%20Costumes", label: "AI Costumes" },
      { href: "/prompts?category=AI%20Portrait", label: "AI Portrait" },
    ],
  },
];

const navItems = [
  { href: "/create", label: "Create" },
  {
    href: "/prompts",
    label: "Prompts",
    mega: true,
  },
  { href: "/pricing", label: "Pricing" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { language, languages, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activePromptCategory, setActivePromptCategory] = useState(
    promptCategories[0]?.label ?? ""
  );
  const [showPromptMenu, setShowPromptMenu] = useState(false);
  const promptTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionCode: string) => {
    const nextLanguage = languages.find((lang) => lang.code === optionCode);
    if (nextLanguage) {
      setLanguage(nextLanguage);
      setOpen(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={`${styles.inner} page-container`}>
        <Link href="/" className={styles.brand}>
          <Image
            src="/logo.png"
            alt="Nanobanana Logo"
            width={44}
            height={44}
            className={styles.avatar}
            priority
          />
          <span className={styles.logo}>Nanobanana Prompt Atlas</span>
        </Link>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            // Prompts 专用两级联动下拉
            if (item.mega) {
              return (
                <div
                  key={item.href}
                  className={`${styles.navItemWithMenu} ${
                    showPromptMenu ? styles.navItemWithMenuOpen : ""
                  }`}
                  onMouseEnter={() => {
                    if (promptTimerRef.current) {
                      clearTimeout(promptTimerRef.current);
                    }
                    setShowPromptMenu(true);
                  }}
                  onMouseLeave={() => {
                    if (promptTimerRef.current) {
                      clearTimeout(promptTimerRef.current);
                    }
                    promptTimerRef.current = setTimeout(() => {
                      setShowPromptMenu(false);
                    }, 150); // 延迟关闭，避免过于灵敏
                  }}
                >
                  <Link
                    href={item.href}
                    className={isActive ? styles.navItemActive : styles.navItem}
                  >
                    {item.label} ▾
                  </Link>
                  {showPromptMenu && (
                    <div className={styles.megaDropdown}>
                      <div className={styles.megaLeft}>
                        {promptCategories.map((cat) => {
                          const active = activePromptCategory === cat.label;
                          return (
                            <button
                              key={cat.label}
                              type="button"
                              className={
                                active
                                  ? styles.megaLeftItemActive
                                  : styles.megaLeftItem
                              }
                              onMouseEnter={() =>
                                setActivePromptCategory(cat.label)
                              }
                            >
                              {cat.label}
                            </button>
                          );
                        })}
                      </div>
                      <div className={styles.megaRight}>
                        {promptCategories.map((cat) => {
                          if (cat.label !== activePromptCategory) return null;
                          return cat.items.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={styles.megaRightItem}
                            >
                              {sub.label}
                            </Link>
                          ));
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // 普通导航项
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? styles.navItemActive : styles.navItem}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions} ref={dropdownRef}>
          <button
            type="button"
            className={styles.languageToggle}
            onClick={() => setOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            {language.label}
            <span aria-hidden="true">▾</span>
          </button>
          {open ? (
            <div className={styles.languageDropdown} role="listbox">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={language.code === lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={
                    language.code === lang.code
                      ? styles.languageOptionActive
                      : styles.languageOption
                  }
                >
                  {lang.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

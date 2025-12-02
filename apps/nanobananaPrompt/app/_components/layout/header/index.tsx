"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../language-provider";
import styles from "./index.module.css";

const navItems = [{ href: "/prompts", label: "Prompt" }];

export default function SiteHeader() {
  const pathname = usePathname();
  const { language, languages, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

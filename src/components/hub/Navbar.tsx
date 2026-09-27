'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/hub.module.css';
import { RandomExplore } from '@/components/hub/RandomExplore';
import { Category, LinkItem } from '@/types';
import { HubStore } from '@/lib/store';
import { INITIAL_CATEGORIES, INITIAL_LINKS } from '@/lib/mockData';
import {
  GraduationCap,
  Wrench,
  Globe,
  Home,
  Shield,
} from 'lucide-react';

interface NavbarProps {
  links?: LinkItem[];
  categories?: Category[];
}

export const Navbar: React.FC<NavbarProps> = ({
  links: propLinks,
  categories: propCategories,
}) => {
  const pathname = usePathname();
  const [links, setLinks] = useState<LinkItem[]>(propLinks || INITIAL_LINKS);
  const [categories, setCategories] = useState<Category[]>(
    propCategories || INITIAL_CATEGORIES
  );

  useEffect(() => {
    if (!propLinks || !propCategories) {
      async function load() {
        const [cats, lnks] = await Promise.all([
          HubStore.getCategories(),
          HubStore.getLinks(),
        ]);
        if (cats && cats.length > 0) setCategories(cats);
        if (lnks && lnks.length > 0) setLinks(lnks);
      }
      load();
    }
  }, [propLinks, propCategories]);

  // Sync if props update
  useEffect(() => {
    if (propLinks) setLinks(propLinks);
  }, [propLinks]);

  useEffect(() => {
    if (propCategories) setCategories(propCategories);
  }, [propCategories]);

  const navItems = [
    {
      href: '/',
      label: 'Trang chủ',
      icon: <Home size={15} />,
      isActive: pathname === '/',
    },
    {
      href: '/hoc-tap',
      label: 'Học tập',
      icon: <GraduationCap size={15} color="#0284c7" />,
      isActive: pathname === '/hoc-tap' || pathname === '/education',
    },
    {
      href: '/cong-cu',
      label: 'Công cụ',
      icon: <Wrench size={15} color="#059669" />,
      isActive: pathname === '/cong-cu' || pathname === '/tools',
    },
    {
      href: '/trang-web',
      label: 'Trang web',
      icon: <Globe size={15} color="#d97706" />,
      isActive: pathname === '/trang-web' || pathname === '/websites',
    },
  ];

  return (
    <header className={styles.topNav}>
      <Link href="/" className={styles.brand}>
        <div className={styles.brandLogo}>F</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={styles.brandTitle}>Fonglab</span>
            <span className={styles.brandBadge}>Central Hub</span>
          </div>
        </div>
      </Link>

      {/* Main Multi-Page Navigation */}
      <nav className={styles.navLinks}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLinkItem} ${
              item.isActive ? styles.navLinkItemActive : ''
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.navActions}>
        {/* Random Explore Dice Button */}
        <RandomExplore links={links} categories={categories} />

        {/* Admin Dashboard Link */}
        <Link href="/admin" className={styles.adminBtn}>
          <Shield size={15} />
          <span>Quản trị</span>
        </Link>
      </div>
    </header>
  );
};

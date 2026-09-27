'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/hub.module.css';
import { Navbar } from '@/components/hub/Navbar';
import { Footer } from '@/components/hub/Footer';
import { HubCard } from '@/components/hub/HubCard';
import { CategoryId, LinkItem, Tag, Category } from '@/types';
import { HubStore } from '@/lib/store';
import { INITIAL_CATEGORIES, INITIAL_LINKS, INITIAL_TAGS } from '@/lib/mockData';
import {
  Home,
  ChevronRight,
  Filter,
  Sparkles,
  Layers,
  Search,
} from 'lucide-react';

interface CategoryPageLayoutProps {
  categoryId: CategoryId;
  categoryName: string;
  categorySlug: string;
  categoryIcon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  accentColor: string;
  description: string;
  subBadges: string[];
}

export const CategoryPageLayout: React.FC<CategoryPageLayoutProps> = ({
  categoryId,
  categoryName,
  categorySlug,
  categoryIcon,
  iconBg,
  iconBorder,
  accentColor,
  description,
  subBadges,
}) => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [allTags, setAllTags] = useState<Tag[]>(INITIAL_TAGS);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load from store
  useEffect(() => {
    async function loadData() {
      const [storedCats, storedTags, storedLinks] = await Promise.all([
        HubStore.getCategories(),
        HubStore.getTags(),
        HubStore.getLinks(),
      ]);
      setAllCategories(storedCats && storedCats.length > 0 ? storedCats : INITIAL_CATEGORIES);
      setAllTags(storedTags && storedTags.length > 0 ? storedTags : INITIAL_TAGS);
      const categoryLinks = (storedLinks && storedLinks.length > 0 ? storedLinks : INITIAL_LINKS)
        .filter((l) => l.categoryId === categoryId);
      setLinks(categoryLinks);
    }
    loadData();

    // Listen for click updates
    const handleRemoteClick = (e: Event) => {
      const customEvent = e as CustomEvent<{ linkId: string; clickCount: number }>;
      if (customEvent.detail) {
        setLinks((prev) =>
          prev.map((l) =>
            l.id === customEvent.detail.linkId
              ? { ...l, clickCount: customEvent.detail.clickCount }
              : l
          )
        );
      }
    };

    window.addEventListener('fonglab_click_updated', handleRemoteClick);
    return () => window.removeEventListener('fonglab_click_updated', handleRemoteClick);
  }, [categoryId]);

  const handleLinkClick = (linkId: string, newCount: number) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, clickCount: newCount } : l))
    );
  };

  // Find all distinct tags present in this category
  const availableTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    links.forEach((l) => {
      if (l.tags) {
        l.tags.forEach((t) => tagSet.add(t));
      }
    });
    return Array.from(tagSet);
  }, [links]);

  // Filter links by selected tag and search query
  const filteredLinks = React.useMemo(() => {
    return links.filter((item) => {
      const matchesTag = !selectedTag || (item.tags && item.tags.includes(selectedTag));
      const queryLower = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !queryLower ||
        item.title.toLowerCase().includes(queryLower) ||
        item.description.toLowerCase().includes(queryLower) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(queryLower)));

      return matchesTag && matchesQuery;
    });
  }, [links, selectedTag, searchQuery]);

  return (
    <main className={styles.container}>
      <Navbar categories={allCategories} links={links} />

      {/* Category Header Banner */}
      <section className={styles.categoryBanner}>
        <div className={styles.categoryBreadcrumb}>
          <Link href="/" className={styles.categoryBreadcrumbLink}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Home size={13} />
              Trang chủ
            </span>
          </Link>
          <ChevronRight size={13} />
          <span style={{ color: accentColor, fontWeight: 600 }}>{categoryName}</span>
        </div>

        <div className={styles.categoryBannerContent}>
          <div
            className={styles.categoryBannerIcon}
            style={{
              background: iconBg,
              border: `1px solid ${iconBorder}`,
              color: accentColor,
            }}
          >
            {categoryIcon}
          </div>

          <div className={styles.categoryBannerInfo}>
            <h1 className={styles.categoryBannerTitle}>{categoryName}</h1>
            <p className={styles.categoryBannerDesc}>{description}</p>

            <div className={styles.categoryBannerMeta}>
              <div className={styles.categoryMetaBadge}>
                <Layers size={14} color={accentColor} />
                <span>{links.length} tài nguyên sẵn có</span>
              </div>
              {subBadges.map((badge, idx) => (
                <div key={idx} className={styles.categoryMetaBadge}>
                  <Sparkles size={13} color="#f59e0b" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            background: '#ffffff',
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
          }}
        >
          {/* Tag Filter Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginRight: '0.5rem' }}>
              <Filter size={15} />
              <span>Chủ đề:</span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: selectedTag === null ? accentColor : '#e2e8f0',
                background: selectedTag === null ? `${accentColor}15` : '#f8fafc',
                color: selectedTag === null ? accentColor : '#64748b',
                transition: 'all 0.2s',
              }}
            >
              Tất cả ({links.length})
            </button>

            {availableTags.map((tag) => {
              const isActive = selectedTag === tag;
              const countInTag = links.filter((l) => l.tags && l.tags.includes(tag)).length;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(isActive ? null : tag)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.825rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: isActive ? accentColor : '#e2e8f0',
                    background: isActive ? `${accentColor}15` : '#f8fafc',
                    color: isActive ? accentColor : '#475569',
                    transition: 'all 0.2s',
                  }}
                >
                  #{tag} ({countInTag})
                </button>
              );
            })}
          </div>

          {/* Quick Search Within Category */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm trong mục này..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2.25rem',
                borderRadius: '9999px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '0.825rem',
                color: '#0f172a',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </section>

      {/* Links Grid */}
      <section>
        {filteredLinks.length === 0 ? (
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              border: '1px dashed #cbd5e1',
              color: '#64748b',
            }}
          >
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
              Không tìm thấy tài nguyên phù hợp
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              Thử xóa bộ lọc hoặc tìm kiếm với từ khóa khác.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedTag(null);
                setSearchQuery('');
              }}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                border: 'none',
                background: accentColor,
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Xem lại tất cả tài nguyên
            </button>
          </div>
        ) : (
          <div className={styles.categoryCardsGrid}>
            {filteredLinks.map((link) => {
              const span = link.isPinned ? 6 : 6;
              return (
                <HubCard
                  key={link.id}
                  link={link}
                  colSpan={span}
                  onLinkClick={handleLinkClick}
                />
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
};

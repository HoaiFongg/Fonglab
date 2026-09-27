'use client';

import React from 'react';
import styles from '@/styles/hub.module.css';
import { Category, LinkItem } from '@/types';
import { HubCard } from './HubCard';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { Inbox } from 'lucide-react';

interface BentoGridProps {
  links: LinkItem[];
  categories: Category[];
  selectedCategory: string;
  selectedTag: string | null;
  onLinkClick?: (linkId: string, newCount: number) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  links,
  categories,
  selectedCategory,
  selectedTag,
  onLinkClick,
}) => {
  // Filter links
  const filteredLinks = links.filter((link) => {
    const matchCategory = selectedCategory === 'all' || link.categoryId === selectedCategory;
    const matchTag = !selectedTag || link.tags.includes(selectedTag);
    return matchCategory && matchTag;
  });

  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  if (filteredLinks.length === 0) {
    return (
      <div
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px dashed #cbd5e1',
          boxShadow: '0 4px 15px rgba(15, 23, 42, 0.04)',
          marginTop: '2rem',
        }}
      >
        <Inbox size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.5rem' }}>
          Không tìm thấy tài nguyên
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Không có liên kết nào phù hợp với bộ lọc danh mục hoặc thẻ tag này.
        </p>
      </div>
    );
  }

  // If a specific category or tag is selected, display fluid grid
  if (selectedCategory !== 'all' || selectedTag !== null) {
    return (
      <div className={styles.bentoGrid}>
        {filteredLinks.map((link, idx) => {
          // Dynamic span for visual interest: first item or pinned item spans wider
          const span = link.isPinned || idx === 0 ? 6 : 6;
          return (
            <HubCard
              key={link.id}
              link={link}
              category={getCategory(link.categoryId)}
              colSpan={span}
              onLinkClick={onLinkClick}
            />
          );
        })}
      </div>
    );
  }

  // If "All" is selected, group into distinct Bento sections for Education and Tools
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      {categories.map((cat) => {
        const catLinks = links.filter((l) => l.categoryId === cat.id);
        if (catLinks.length === 0) return null;

        return (
          <section key={cat.id} id={cat.id}>
            {/* Category Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '1.25rem',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: `${cat.color}15`,
                    border: `1px solid ${cat.color}35`,
                    color: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DynamicIcon name={cat.icon} size={20} />
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
                    {cat.name}
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '0.825rem' }}>
                    {cat.description}
                  </p>
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.775rem',
                  color: cat.color,
                  fontWeight: 600,
                  background: `${cat.color}12`,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                }}
              >
                {catLinks.length} tài nguyên
              </span>
            </div>

            {/* Bento Grid layout for this category */}
            <div className={styles.bentoGrid}>
              {catLinks.map((link, idx) => {
                // Asymmetric bento styling: first item gets 8 cols, second gets 4, others get 6 or 4
                let span: 4 | 6 | 8 | 12 = 4;
                if (catLinks.length >= 3) {
                  if (idx === 0) span = 8;
                  else if (idx === 1) span = 4;
                  else if (idx === 2) span = 6;
                  else if (idx === 3) span = 6;
                } else {
                  span = 6;
                }

                return (
                  <HubCard
                    key={link.id}
                    link={link}
                    category={cat}
                    colSpan={span}
                    onLinkClick={onLinkClick}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

'use client';

import React from 'react';
import styles from '@/styles/hub.module.css';
import { Category, Tag } from '@/types';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { LayoutGrid, X } from 'lucide-react';

interface TagFilterProps {
  categories: Category[];
  tags: Tag[];
  selectedCategory: string; // 'all' or category.id
  selectedTag: string | null;
  onSelectCategory: (catId: string) => void;
  onSelectTag: (tagName: string | null) => void;
  categoryCounts: Record<string, number>;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onSelectCategory,
  onSelectTag,
  categoryCounts,
}) => {
  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return (
    <div className={styles.filterSection}>
      {/* Category Tabs */}
      <div className={styles.categoryTabs}>
        <button
          onClick={() => onSelectCategory('all')}
          className={`${styles.catTab} ${selectedCategory === 'all' ? styles.catTabActive : ''}`}
        >
          <LayoutGrid size={16} />
          <span>Tất cả tài nguyên</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({totalCount})</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`${styles.catTab} ${selectedCategory === cat.id ? styles.catTabActive : ''}`}
            style={{
              borderColor: selectedCategory === cat.id ? cat.color : undefined,
              boxShadow: selectedCategory === cat.id ? `0 2px 10px ${cat.color}25` : undefined,
              background: selectedCategory === cat.id ? `${cat.color}12` : undefined,
              color: selectedCategory === cat.id ? cat.color : undefined,
            }}
          >
            <DynamicIcon name={cat.icon} size={16} color={cat.color} />
            <span>{cat.name}</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({categoryCounts[cat.id] || 0})</span>
          </button>
        ))}
      </div>

      {/* Tag Chips Row */}
      <div className={styles.tagFilterRow}>
        <span style={{ fontSize: '0.8rem', color: '#64748b', marginRight: '0.3rem' }}>Lọc theo Tag:</span>
        {tags.map((tag) => {
          const isSelected = selectedTag === tag.name;
          return (
            <button
              key={tag.id}
              onClick={() => onSelectTag(isSelected ? null : tag.name)}
              className={`${styles.tagChip} ${isSelected ? styles.tagChipActive : ''}`}
            >
              #{tag.name}
            </button>
          );
        })}

        {selectedTag && (
          <button
            onClick={() => onSelectTag(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.75rem',
              color: '#dc2626',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '0.25rem 0.6rem',
              borderRadius: '9999px',
            }}
          >
            <X size={12} />
            <span>Bỏ lọc (#{selectedTag})</span>
          </button>
        )}
      </div>
    </div>
  );
};

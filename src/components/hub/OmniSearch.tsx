'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/hub.module.css';
import { LinkItem, Category } from '@/types';
import { Search, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { HubStore } from '@/lib/store';

interface OmniSearchProps {
  links: LinkItem[];
  categories: Category[];
  onSelectLink?: (link: LinkItem) => void;
}

export const OmniSearch: React.FC<OmniSearchProps> = ({ links, categories, onSelectLink }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Global hotkey Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter links based on query
  const trimmed = query.trim().toLowerCase();
  const filteredLinks = trimmed === ''
    ? []
    : links.filter((link) => {
        const titleMatch = link.title.toLowerCase().includes(trimmed);
        const descMatch = link.description.toLowerCase().includes(trimmed);
        const tagMatch = link.tags.some((t) => t.toLowerCase().includes(trimmed));
        const cat = categories.find((c) => c.id === link.categoryId);
        const catMatch = cat?.name.toLowerCase().includes(trimmed);
        return titleMatch || descMatch || tagMatch || catMatch;
      }).slice(0, 6);

  const handleSelect = async (link: LinkItem) => {
    await HubStore.recordClick(link.id);
    setIsOpen(false);
    setQuery('');
    if (onSelectLink) {
      onSelectLink(link);
    }
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredLinks.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredLinks.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredLinks.length) % filteredLinks.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredLinks[selectedIndex]) {
        handleSelect(filteredLinks[selectedIndex]);
      }
    }
  };

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : 'Khác';
  };

  return (
    <div className={styles.searchWrapper} ref={wrapperRef}>
      <div className={styles.searchBar}>
        <Search size={20} color="#0284c7" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Tìm kiếm tài nguyên (VD: 'Tin học THCS', 'Tin học Quốc tế', 'Level 1-2-3', 'Python')..."
          className={styles.searchInput}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            style={{ color: '#64748b', display: 'flex' }}
            title="Xóa tìm kiếm"
          >
            <X size={16} />
          </button>
        )}
        <div className={styles.searchKbd}>
          <span>Ctrl</span>
          <span>K</span>
        </div>
      </div>

      {isOpen && filteredLinks.length > 0 && (
        <div className={styles.searchResults}>
          <div style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem', color: '#64748b', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={12} color="#0284c7" />
            <span>Gợi ý nhanh ({filteredLinks.length} kết quả)</span>
          </div>
          {filteredLinks.map((item, idx) => (
            <div
              key={item.id}
              className={`${styles.searchItem} ${idx === selectedIndex ? styles.searchItemActive : ''}`}
              onClick={() => handleSelect(item)}
            >
              <div className={styles.searchItemMain}>
                <div className={styles.searchItemIcon}>
                  <DynamicIcon name={item.iconType || 'Globe'} size={18} />
                </div>
                <div>
                  <div className={styles.searchItemTitle}>{item.title}</div>
                  <div className={styles.searchItemSnippet}>{item.description}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={styles.badge}>{getCategoryName(item.categoryId)}</span>
                <ArrowUpRight size={16} color="#64748b" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.trim() !== '' && filteredLinks.length === 0 && (
        <div className={styles.searchResults}>
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
            Không tìm thấy tài nguyên nào phù hợp với &quot;<strong>{query}</strong>&quot;.
          </div>
        </div>
      )}

      {/* Quick Suggestion Chips */}
      <div className={styles.searchSuggestionsRow}>
        <span className={styles.suggestionLabel}>Gợi ý nhanh:</span>
        {['Tin học THCS', 'Tin học Quốc tế', 'Level 1-2-3', 'Tin học Tiểu học', 'Scripts tính điểm', 'IC3 GS6'].map((term) => (
          <button
            key={term}
            type="button"
            className={styles.suggestionChip}
            onClick={() => {
              setQuery(term);
              setIsOpen(true);
              inputRef.current?.focus();
            }}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};

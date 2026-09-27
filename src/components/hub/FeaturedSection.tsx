'use client';

import React, { useState } from 'react';
import styles from '@/styles/hub.module.css';
import { LinkItem, Category } from '@/types';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { Flame, ExternalLink, MousePointerClick, Copy, Check } from 'lucide-react';
import { HubStore } from '@/lib/store';

interface FeaturedSectionProps {
  links: LinkItem[];
  categories: Category[];
  onLinkClick?: (linkId: string, newCount: number) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  links,
  categories,
  onLinkClick,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pick top 3 featured or pinned links
  const featuredLinks = [...links]
    .filter((l) => l.isFeatured || l.isPinned)
    .slice(0, 3);

  if (featuredLinks.length === 0) return null;

  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  const handleOpenLink = async (link: LinkItem) => {
    const newCount = await HubStore.recordClick(link.id);
    if (onLinkClick) {
      onLinkClick(link.id, newCount);
    }
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = (e: React.MouseEvent, link: LinkItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className={styles.featuredSection}>
      <div className={styles.sectionHeaderBetween}>
        <div>
          <div className={styles.sectionBadgeFlame}>
            <Flame size={14} />
            <span>Tiêu Điểm Nổi Bật</span>
          </div>
          <h2 className={styles.sectionTitle}>Tài Nguyên Tiêu Điểm Tuyển Chọn</h2>
          <p className={styles.sectionSubtitle}>
            Học liệu trọng tâm và các công cụ hỗ trợ giảng dạy tiêu biểu do Thầy Fong tuyển chọn &amp; đề xuất.
          </p>
        </div>
      </div>

      <div className={styles.featuredGrid}>
        {featuredLinks.map((item) => {
          const cat = getCategory(item.categoryId);
          const catColor = cat?.color || '#0284c7';
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => handleOpenLink(item)}
              className={styles.featuredCard}
            >
              <div className={styles.featuredCardHeader}>
                <div
                  className={styles.featuredIconBox}
                  style={{
                    backgroundColor: `${catColor}15`,
                    borderColor: `${catColor}35`,
                    color: catColor,
                  }}
                >
                  <DynamicIcon name={item.iconType || 'Sparkles'} size={24} />
                </div>

                <div className={styles.featuredBadges}>
                  <span className={styles.rankBadge}>⭐ Tiêu điểm</span>
                  {item.badge && <span className={styles.badge}>{item.badge}</span>}
                  <button
                    type="button"
                    onClick={(e) => handleCopy(e, item)}
                    title={isCopied ? 'Đã sao chép!' : 'Sao chép link'}
                    className={styles.miniCopyBtn}
                  >
                    {isCopied ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              <div className={styles.featuredCategoryName} style={{ color: catColor }}>
                {cat?.name || 'Tài nguyên'}
              </div>

              <h3 className={styles.featuredTitle}>{item.title}</h3>
              <p className={styles.featuredDesc}>{item.description}</p>

              <div className={styles.featuredFooter}>
                <div className={styles.featuredMeta}>
                  {item.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className={styles.tagPill}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className={styles.featuredLaunchBtn}>
                  <span>Mở ngay</span>
                  <ExternalLink size={14} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

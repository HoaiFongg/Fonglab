'use client';

import React, { useState } from 'react';
import styles from '@/styles/hub.module.css';
import { LinkItem, Category } from '@/types';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { ArrowUpRight, Copy, Check, Pin } from 'lucide-react';
import { HubStore } from '@/lib/store';

interface HubCardProps {
  link: LinkItem;
  category?: Category;
  colSpan?: 4 | 6 | 8 | 12;
  onLinkClick?: (linkId: string, newCount: number) => void;
}

export const HubCard: React.FC<HubCardProps> = ({
  link,
  category,
  colSpan = 4,
  onLinkClick,
}) => {
  const [copied, setCopied] = useState(false);

  const getColSpanClass = () => {
    switch (colSpan) {
      case 6:
        return styles.colSpan6;
      case 8:
        return styles.colSpan8;
      case 12:
        return styles.colSpan12;
      default:
        return styles.colSpan4;
    }
  };

  const getCategoryGlow = () => {
    if (link.categoryId === 'education') return styles.hubCardGlowEdu;
    if (link.categoryId === 'tools') return styles.hubCardGlowTools;
    if (link.categoryId === 'websites') return styles.hubCardGlowWeb;
    return '';
  };

  const handleCardClick = async (e: React.MouseEvent) => {
    // If user clicked copy button, don't navigate
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    const newCount = await HubStore.recordClick(link.id);
    if (onLinkClick) {
      onLinkClick(link.id, newCount);
    }
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryColor = category?.color || '#3b82f6';

  return (
    <div
      onClick={handleCardClick}
      className={`${styles.hubCard} ${getColSpanClass()} ${getCategoryGlow()}`}
      style={{ cursor: 'pointer' }}
    >
      <div>
        <div className={styles.cardHeader}>
          <div
            className={styles.cardIconBox}
            style={{ borderColor: `${categoryColor}30`, color: categoryColor, background: `${categoryColor}12` }}
          >
            <DynamicIcon name={link.iconType || 'Globe'} size={22} />
          </div>

          <div className={styles.cardBadges}>
            {link.isPinned && (
              <span className={`${styles.badge} ${styles.badgeHighlight}`} title="Đã ghim">
                <Pin size={11} style={{ marginRight: '3px', verticalAlign: 'middle' }} />
                Ghim
              </span>
            )}
            {link.badge && (
              <span className={styles.badge}>
                {link.badge}
              </span>
            )}
            <button
              onClick={handleCopyLink}
              title={copied ? 'Đã sao chép!' : 'Sao chép liên kết'}
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.25rem 0.45rem',
                color: copied ? '#059669' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
        </div>

        <h3 className={styles.cardTitle}>{link.title}</h3>
        <p className={styles.cardDescription}>{link.description}</p>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.cardTags}>
          {link.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className={styles.tagPill}>
              #{tag}
            </span>
          ))}
        </div>

        <div className={styles.cardArrow}>
          <ArrowUpRight size={16} />
        </div>
      </div>
    </div>
  );
};

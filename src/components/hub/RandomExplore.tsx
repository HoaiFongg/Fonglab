'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/hub.module.css';
import { LinkItem, Category } from '@/types';
import { Dices, Sparkles, ArrowRight, RefreshCw, X } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { HubStore } from '@/lib/store';

interface RandomExploreProps {
  links: LinkItem[];
  categories: Category[];
}

export const RandomExplore: React.FC<RandomExploreProps> = ({ links, categories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [randomLink, setRandomLink] = useState<LinkItem | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [isRolling, setIsRolling] = useState(false);

  const pickRandom = () => {
    if (!links || links.length === 0) return;
    setIsRolling(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * links.length);
      const chosen = links[randomIndex];
      setRandomLink(chosen);
      setCountdown(5);
      setIsRolling(false);
      setIsOpen(true);
    }, 400);
  };

  const handleGoTo = async (link: LinkItem) => {
    await HubStore.recordClick(link.id);
    setIsOpen(false);
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  // Countdown auto-redirect
  useEffect(() => {
    if (!isOpen || !randomLink) return;

    if (countdown <= 0) {
      const timeoutId = setTimeout(() => {
        handleGoTo(randomLink);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, countdown, randomLink]);

  const getCategory = (catId: string) => {
    return categories.find((c) => c.id === catId);
  };

  return (
    <>
      <button
        onClick={pickRandom}
        className={styles.randomBtn}
        disabled={isRolling}
        title="Khám phá một tài nguyên ngẫu nhiên trong Fonglab"
      >
        <Dices size={18} className={isRolling ? 'animate-spin' : ''} />
        <span>{isRolling ? 'Đang quay số...' : 'Khám phá ngẫu nhiên'}</span>
      </button>

      {isOpen && randomLink && (
        <div className={styles.modalBackdrop} onClick={() => setIsOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                color: '#64748b',
                padding: '0.4rem',
              }}
            >
              <X size={20} />
            </button>

            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                margin: '0 auto 1rem auto',
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
              }}
            >
              <DynamicIcon name={randomLink.iconType || 'Sparkles'} size={28} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.775rem',
                color: '#2563eb',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                marginBottom: '0.75rem',
              }}
            >
              <Sparkles size={12} />
              <span>Điểm đến ngẫu nhiên</span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              {randomLink.title}
            </h3>

            <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {randomLink.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span className={styles.badge} style={{ color: '#0284c7', fontWeight: 600 }}>
                {getCategory(randomLink.categoryId)?.name || 'Tài nguyên'}
              </span>
              {randomLink.tags.map((t, idx) => (
                <span key={idx} className={styles.tagPill}>
                  #{t}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => handleGoTo(randomLink)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.5rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                }}
              >
                <span>Chuyển tiếp ngay (tự mở sau {countdown}s)</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={pickRandom}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '12px',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                <RefreshCw size={14} />
                <span>Quay điểm đến khác</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

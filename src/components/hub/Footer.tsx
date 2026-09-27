'use client';

import React from 'react';
import Link from 'next/link';
import styles from '@/styles/hub.module.css';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        marginTop: '6rem',
        paddingTop: '2.5rem',
        borderTop: '1px solid #e2e8f0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className={styles.backToTopBtn}
        title="Cuộn lên đầu trang"
      >
        <ArrowUp size={14} />
        <span>Lên đầu trang</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
        <span>© {new Date().getFullYear()} Fonglab Central Hub</span>
        <span>•</span>
        <span>Phát triển bởi Phạm Nguyễn Hoài Phong</span>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{ color: '#475569', fontWeight: 500, textDecoration: 'none' }}>
          Trang chủ
        </Link>
        <span>•</span>
        <Link href="/hoc-tap" style={{ color: '#0284c7', fontWeight: 500, textDecoration: 'none' }}>
          Học tập
        </Link>
        <span>•</span>
        <Link href="/cong-cu" style={{ color: '#059669', fontWeight: 500, textDecoration: 'none' }}>
          Công cụ
        </Link>
        <span>•</span>
        <Link href="/trang-web" style={{ color: '#d97706', fontWeight: 500, textDecoration: 'none' }}>
          Trang web
        </Link>
        <span>•</span>
        <Link href="/admin" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>
          Quản trị
        </Link>
        <span>•</span>
        <a
          href="https://github.com/HoaiFongg"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#64748b', fontWeight: 500, textDecoration: 'none' }}
        >
          GitHub
        </a>
      </div>
    </footer>
  );
};

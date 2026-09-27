'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/admin.module.css';
import {
  LayoutDashboard,
  Link2,
  Tags,
  Sliders,
  ArrowLeft,
  Database
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Thống kê Tổng quan', href: '/admin', icon: LayoutDashboard },
    { label: 'Quản lý Liên kết', href: '/admin/links', icon: Link2 },
    { label: 'Danh mục & Tags', href: '/admin/categories', icon: Tags },
    { label: 'Cấu hình & Supabase', href: '/admin/settings', icon: Sliders },
  ];

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.brandArea}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#fff',
              fontSize: '1.1rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            }}
          >
            F
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>Fonglab Admin</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Trung tâm điều khiển</div>
          </div>
        </div>

        <nav className={styles.navMenu}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        {/* Status Indicator */}
        <div
          style={{
            padding: '0.85rem',
            borderRadius: '12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            marginBottom: '1rem',
            fontSize: '0.775rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
            <Database size={13} color={isSupabaseConfigured ? '#059669' : '#d97706'} />
            <span style={{ fontWeight: 600, color: '#0f172a' }}>Trạng thái Dữ liệu</span>
          </div>
          <div style={{ color: '#64748b' }}>
            {isSupabaseConfigured ? '🟢 Đã kết nối Supabase' : '🟡 Lưu trữ Local & Mock (Sẵn sàng đồng bộ)'}
          </div>
        </div>

        <Link
          href="/"
          className={styles.navLink}
          style={{ color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe' }}
        >
          <ArrowLeft size={16} />
          <span>Về trang chủ Hub</span>
        </Link>
      </div>
    </aside>
  );
};

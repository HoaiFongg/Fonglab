'use client';

import React, { useState } from 'react';
import styles from '@/styles/admin.module.css';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { HubStore } from '@/lib/store';
import { Copy, Check, Download, Server } from 'lucide-react';

export default function AdminSettingsPage() {
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const sampleEnv = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`;

  const sampleSql = `-- Chạy script này trong Supabase SQL Editor để khởi tạo database
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL DEFAULT 'Folder',
    description TEXT,
    color TEXT NOT NULL DEFAULT '#3b82f6',
    order_num INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#3b82f6'
);

CREATE TABLE IF NOT EXISTS public.links (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    icon_type TEXT DEFAULT 'Globe',
    badge TEXT,
    click_count INT NOT NULL DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.link_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id TEXT REFERENCES public.links(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Public Read Links" ON public.links FOR SELECT USING (true);
CREATE POLICY "Admin All Links" ON public.links FOR ALL USING (true);
CREATE POLICY "Admin All Categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admin All Tags" ON public.tags FOR ALL USING (true);
CREATE POLICY "Insert Clicks" ON public.link_clicks FOR INSERT WITH CHECK (true);
`;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(sampleSql);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const handleExportBackup = async () => {
    const [links, categories, tags] = await Promise.all([
      HubStore.getLinks(),
      HubStore.getCategories(),
      HubStore.getTags(),
    ]);

    const backup = {
      exportedAt: new Date().toISOString(),
      links,
      categories,
      tags,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fonglab-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Cấu Hình Hệ Thống &amp; Supabase</h1>
          <p className={styles.pageSubtitle}>
            Quản lý kết nối cơ sở dữ liệu Supabase, sao lưu dữ liệu JSON và hướng dẫn triển khai Vercel.
          </p>
        </div>
      </div>

      {/* Database Connection Status Card */}
      <div className={styles.panel}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Server size={22} color={isSupabaseConfigured ? '#059669' : '#d97706'} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Trạng Thái Cơ Sở Dữ Liệu
          </h2>
        </div>

        <div
          style={{
            padding: '1.25rem',
            borderRadius: '14px',
            background: isSupabaseConfigured ? '#ecfdf5' : '#fef3c7',
            border: `1px solid ${isSupabaseConfigured ? '#a7f3d0' : '#fde68a'}`,
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ fontWeight: 600, color: isSupabaseConfigured ? '#059669' : '#d97706', marginBottom: '0.4rem' }}>
            {isSupabaseConfigured
              ? '✓ Đang kết nối trực tiếp với Supabase Cloud Database'
              : '⚡ Đang hoạt động ở chế độ Dual-Mode (LocalStorage & In-Memory Storage)'}
          </div>
          <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
            {isSupabaseConfigured
              ? 'Tất cả thay đổi về liên kết, danh mục và lượt clicks được lưu trữ vĩnh viễn trên Supabase PostgreSQL.'
              : 'Hệ thống đang lưu trữ tức thời trong trình duyệt để bạn thử nghiệm đầy đủ mọi tính năng. Khi bạn sẵn sàng kết nối Supabase, chỉ cần cấu hình biến môi trường trong file .env.local theo hướng dẫn bên dưới.'}
          </p>
        </div>

        {/* Step-by-step connection guide */}
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>
          Hướng dẫn 3 bước kết nối Supabase &amp; Triển khai Vercel:
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 600, color: '#0284c7', marginBottom: '0.3rem' }}>
              Bước 1: Tạo dự án mới trên Supabase
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Truy cập <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#0284c7', textDecoration: 'underline' }}>supabase.com</a> và tạo một project mới (miễn phí).
            </p>
          </div>

          <div style={{ padding: '1rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span style={{ fontWeight: 600, color: '#0284c7' }}>Bước 2: Chạy SQL Schema</span>
              <button onClick={handleCopySchema} className={styles.btnSecondary} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                {copiedSchema ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                <span>{copiedSchema ? 'Đã chép SQL' : 'Sao chép SQL'}</span>
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Vào mục <strong>SQL Editor</strong> trên Supabase, dán đoạn script SQL tạo bảng và bấm <strong>Run</strong>. Toàn bộ file schema hoàn chỉnh cũng đã được lưu tại <code>supabase/schema.sql</code>.
            </p>
          </div>

          <div style={{ padding: '1rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span style={{ fontWeight: 600, color: '#0284c7' }}>Bước 3: Cấu hình biến môi trường (.env.local &amp; Vercel)</span>
              <button onClick={handleCopyEnv} className={styles.btnSecondary} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                {copiedEnv ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                <span>{copiedEnv ? 'Đã chép env' : 'Sao chép mẫu'}</span>
              </button>
            </div>
            <pre style={{ background: '#0f172a', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.8rem', color: '#38bdf8', overflowX: 'auto', marginTop: '0.5rem' }}>
              {sampleEnv}
            </pre>
          </div>
        </div>

        {/* Data Backup & Export */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.2rem' }}>Sao lưu dữ liệu Hệ sinh thái</div>
            <div style={{ fontSize: '0.825rem', color: '#64748b' }}>Xuất toàn bộ liên kết, tags và danh mục hiện tại ra file JSON.</div>
          </div>

          <button onClick={handleExportBackup} className={styles.btnSecondary}>
            <Download size={16} />
            <span>Xuất file JSON Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
}

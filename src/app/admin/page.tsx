'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/admin.module.css';
import { AnalyticsSummary } from '@/types';
import { HubStore } from '@/lib/store';
import {
  MousePointerClick,
  Link2,
  FolderTree,
  TrendingUp,
  PlusCircle,
  ExternalLink,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    const data = await HubStore.getAnalytics();
    setAnalytics(data);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await HubStore.getAnalytics();
      if (mounted) {
        setAnalytics(data);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleResetData = () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục toàn bộ liên kết và lượt click về trạng thái dữ liệu mẫu mặc định?')) {
      HubStore.resetDefaults();
      fetchAnalytics();
      alert('Đã khôi phục dữ liệu mẫu thành công!');
    }
  };

  if (loading || !analytics) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
        Đang tổng hợp dữ liệu thống kê...
      </div>
    );
  }

  return (
    <div>
      {/* Top Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Bảng Điều Khiển &amp; Thống Kê</h1>
          <p className={styles.pageSubtitle}>
            Theo dõi hiệu suất điều hướng và mức độ quan tâm của người dùng tới các tài nguyên vệ tinh.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleResetData} className={styles.btnSecondary} title="Khôi phục dữ liệu mẫu ban đầu">
            <RotateCcw size={16} />
            <span>Dữ liệu mẫu</span>
          </button>

          <Link href="/admin/links" className={styles.btnPrimary}>
            <PlusCircle size={16} />
            <span>Thêm liên kết mới</span>
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Tổng lượt Click điều hướng</span>
            <div className={styles.statIconBox} style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <MousePointerClick size={20} />
            </div>
          </div>
          <div className={styles.statValue}>{analytics.totalClicks.toLocaleString()}</div>
          <div className={styles.statSubtext}>Tổng số lần người dùng đã truy cập link</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Tổng số Liên kết vệ tinh</span>
            <div className={styles.statIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Link2 size={20} />
            </div>
          </div>
          <div className={styles.statValue}>{analytics.totalLinks}</div>
          <div className={styles.statSubtext}>Tài nguyên đang hoạt động trên Fonglab</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Phân khu danh mục</span>
            <div className={styles.statIconBox} style={{ background: '#ecfdf5', color: '#059669' }}>
              <FolderTree size={20} />
            </div>
          </div>
          <div className={styles.statValue}>{analytics.categoryBreakdown.length}</div>
          <div className={styles.statSubtext}>Học tập, Công cụ và Trang web</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Trung bình Clicks / Link</span>
            <div className={styles.statIconBox} style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className={styles.statValue}>
            {analytics.totalLinks > 0 ? Math.round(analytics.totalClicks / analytics.totalLinks) : 0}
          </div>
          <div className={styles.statSubtext}>Tần suất sử dụng trung bình mỗi tài nguyên</div>
        </div>
      </div>

      {/* Category Breakdown Progress */}
      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>
          <Sparkles size={18} color="#0284c7" />
          <span>Phân bổ Lượt Truy cập Theo Phân Khu</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {analytics.categoryBreakdown.map(({ category, count, clicks }) => {
            const percentage = analytics.totalClicks > 0
              ? Math.round((clicks / analytics.totalClicks) * 100)
              : 0;

            return (
              <div key={category.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <DynamicIcon name={category.icon} size={16} color={category.color} />
                    <span style={{ color: '#0f172a' }}>{category.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>({count} tài nguyên)</span>
                  </div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>
                    {clicks} clicks ({percentage}%)
                  </div>
                </div>

                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${percentage}%`,
                      background: category.color,
                      borderRadius: '9999px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 5 Most Visited Links */}
      <div className={styles.panel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 className={styles.panelTitle} style={{ margin: 0 }}>
            <TrendingUp size={18} color="#059669" />
            <span>Top 5 Tài Nguyên Được Quan Tâm Nhất</span>
          </h2>

          <Link href="/admin/links" style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 500 }}>
            Xem tất cả liên kết →
          </Link>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Hạng</th>
                <th>Tên Tài nguyên / Trang vệ tinh</th>
                <th>Phân loại</th>
                <th>Tags</th>
                <th style={{ textAlign: 'right' }}>Lượt Click</th>
                <th style={{ textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topLinks.map((link, index) => {
                const cat = analytics.categoryBreakdown.find((c) => c.category.id === link.categoryId)?.category;
                return (
                  <tr key={link.id}>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: index === 0 ? '#f59e0b' : index === 1 ? '#64748b' : index === 2 ? '#d97706' : '#e2e8f0',
                          color: index > 2 ? '#334155' : '#fff',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      >
                        #{index + 1}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.2rem' }}>{link.title}</div>
                      <div style={{ fontSize: '0.785rem', color: '#64748b', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {link.url}
                      </div>
                    </td>
                    <td>
                      <span style={{ color: cat?.color || '#0284c7', fontWeight: 600, fontSize: '0.8rem' }}>
                        {cat?.name || link.categoryId}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {link.tags.map((t, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '0.7rem',
                              padding: '0.15rem 0.45rem',
                              background: '#f1f5f9',
                              border: '1px solid #e2e8f0',
                              borderRadius: '4px',
                              color: '#64748b',
                            }}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#0284c7', fontSize: '1rem' }}>
                      {link.clickCount || 0}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#64748b', display: 'inline-flex', padding: '0.3rem' }}
                        title="Mở liên kết"
                      >
                        <ExternalLink size={15} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

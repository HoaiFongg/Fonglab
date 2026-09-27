'use client';

import React from 'react';
import Link from 'next/link';
import styles from '@/styles/hub.module.css';
import {
  GraduationCap,
  Wrench,
  Globe,
  ArrowRight,
  Compass,
} from 'lucide-react';

interface PortalGridProps {
  categoryCounts?: Record<string, number>;
}

export const PortalGrid: React.FC<PortalGridProps> = ({ categoryCounts = {} }) => {
  const eduCount = categoryCounts['education'] || 4;
  const toolsCount = categoryCounts['tools'] || 4;
  const webCount = categoryCounts['websites'] || 4;

  const portals = [
    {
      id: 'education',
      title: 'Chuyên Trang Học Tập',
      subtitle: 'Tin học THCS & Quốc tế',
      badge: `${eduCount} tài nguyên`,
      href: '/hoc-tap',
      icon: <GraduationCap size={28} />,
      colorClass: styles.portalCardEdu,
      desc: 'Kho giáo án Word/PowerPoint Tin học THCS, bài giảng hoạt hình video AI Tiểu học và ngân hàng đề thi chuẩn Tin học Quốc tế Level 1, 2, 3.',
      highlights: [
        'Giáo án Tin học THCS (Lớp 6 - 9)',
        'Luyện thi Tin học Quốc tế (IC3 GS6, MOS)',
        'Bài giảng trực quan & Video AI Tiểu học',
      ],
      cta: 'Vào Chuyên Trang Học Tập',
    },
    {
      id: 'tools',
      title: 'Trạm Công Cụ & Scripts',
      subtitle: 'Tự động hóa giáo viên',
      badge: `${toolsCount} công cụ`,
      href: '/cong-cu',
      icon: <Wrench size={28} />,
      colorClass: styles.portalCardTools,
      desc: 'Tập hợp Python scripts xử lý bảng điểm học bạ, mini web app chuyển đổi định dạng đề thi và macro phím tắt nâng cao năng suất giảng dạy.',
      highlights: [
        'Scripts Python tổng hợp điểm & học bạ',
        'Bộ công cụ chuyển đổi đề thi sang Word/LaTeX',
        'Cẩm nang thủ thuật IT & Macro Windows',
      ],
      cta: 'Khám Phá Công Cụ Giảng Dạy',
    },
    {
      id: 'websites',
      title: 'Trang Web & Cổng Trực Tuyến',
      subtitle: 'Cổng vệ tinh & Luyện tập',
      badge: `${webCount} website`,
      href: '/trang-web',
      icon: <Globe size={28} />,
      colorClass: styles.portalCardWeb,
      desc: 'Hệ thống website vệ tinh phục vụ dạy và học: Cổng luyện đề GEMS - IC3, nền tảng luyện gõ 10 ngón, lập trình Scratch MIT và kho SGK điện tử.',
      highlights: [
        'Cổng Luyện thi Tin học Quốc tế GEMS - IC3',
        'Sách giáo khoa điện tử Hành Trang Số NXBGD',
        'Môi trường lập trình Scratch MIT Online',
      ],
      cta: 'Xem Danh Sách Trang Web',
    },
  ];

  return (
    <section className={styles.portalSection}>
      <div className={styles.sectionHeaderCentered} style={{ marginBottom: '2rem' }}>
        <div className={styles.sectionBadge}>
          <Compass size={14} />
          <span>Lối Vào Chuyên Mục Trọng Tâm</span>
        </div>
        <h2 className={styles.sectionTitle}>Lựa Chọn Phân Khu Bạn Cần Khám Phá</h2>
        <p className={styles.sectionSubtitle}>
          Mỗi chủ đề được tổ chức thành một chuyên trang riêng biệt, giúp bạn tập trung và tìm kiếm nhanh chóng.
        </p>
      </div>

      <div className={styles.portalGrid}>
        {portals.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`${styles.portalCard} ${item.colorClass}`}
          >
            <div className={styles.portalCardIconBox}>{item.icon}</div>

            <div className={styles.portalCardHeader}>
              <h3 className={styles.portalCardTitle}>{item.title}</h3>
              <span className={styles.portalCardBadge}>{item.badge}</span>
            </div>

            <p className={styles.portalCardDesc}>{item.desc}</p>

            <div className={styles.portalCardHighlights}>
              {item.highlights.map((hl, idx) => (
                <div key={idx} className={styles.portalCardHighlightItem}>
                  <span className={styles.portalCardHighlightDot} />
                  <span>{hl}</span>
                </div>
              ))}
            </div>

            <div className={styles.portalCardCta}>
              <span>{item.cta}</span>
              <ArrowRight size={16} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

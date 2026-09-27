'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/hub.module.css';
import { GraduationCap, Wrench, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingPillarsProps {
  onSelectCategory?: (catId: string) => void;
  categoryCounts: Record<string, number>;
}

export const OnboardingPillars: React.FC<OnboardingPillarsProps> = ({
  categoryCounts,
}) => {
  const router = useRouter();

  const handlePillarClick = (href: string) => {
    router.push(href);
  };

  const pillars = [
    {
      id: 'education',
      href: '/hoc-tap',
      roleTitle: 'Học Sinh & Quý Phụ Huynh',
      badge: 'Học Liệu & Luyện Thi',
      icon: GraduationCap,
      color: '#0284c7',
      glowClass: styles.pillarGlowEdu,
      desc: 'Giáo án Tin học THCS (Lớp 6-9) chuẩn GDPT mới, luyện thi Tin học Quốc tế (Level 1, 2, 3) và học liệu trực quan cho học sinh tiểu học.',
      features: [
        'Giáo án Tin học THCS (Lớp 6-9)',
        'Luyện thi Quốc tế Level 1, 2, 3',
        'Tin học Tiểu học & Video AI',
        'Ngân hàng đề thi & đáp án chuẩn'
      ],
      actionText: `Xem ${categoryCounts['education'] || 4} tài nguyên Tin học`,
    },
    {
      id: 'tools',
      href: '/cong-cu',
      roleTitle: 'Thầy Cô Giáo & Đồng Nghiệp',
      badge: 'Tối Ưu Năng Suất',
      icon: Wrench,
      color: '#059669',
      glowClass: styles.pillarGlowTools,
      desc: 'Bộ script Python tự động tổng hợp & nhận xét học bạ, công cụ chuyển đổi định dạng đề thi và macro tiện ích máy tính.',
      features: [
        'Script xử lý điểm 3 giây',
        'Web App chuyển Word/LaTeX',
        'Thủ thuật trình duyệt soạn bài',
        'Macro phím tắt máy tính'
      ],
      actionText: `Khám phá ${categoryCounts['tools'] || 4} Mini Tools`,
    },
  ];

  return (
    <section className={styles.onboardingSection}>
      <div className={styles.sectionHeaderCentered}>
        <div className={styles.sectionBadge}>
          <Sparkles size={14} />
          <span>Định Hướng Nhanh</span>
        </div>
        <h2 className={styles.sectionTitle}>Bạn đang tìm kiếm điều gì tại Fonglab?</h2>
        <p className={styles.sectionSubtitle}>
          Chọn phân khu phù hợp với nhu cầu của bạn để truy cập ngay những tài nguyên được thiết kế chuyên biệt.
        </p>
      </div>

      <div className={styles.pillarsGrid}>
        {pillars.map((pillar) => {
          const IconComponent = pillar.icon;
          return (
            <div
              key={pillar.id}
              onClick={() => handlePillarClick(pillar.href)}
              className={`${styles.pillarCard} ${pillar.glowClass}`}
            >
              <div className={styles.pillarTop}>
                <div
                  className={styles.pillarIconBox}
                  style={{
                    backgroundColor: `${pillar.color}15`,
                    borderColor: `${pillar.color}35`,
                    color: pillar.color,
                  }}
                >
                  <IconComponent size={24} />
                </div>
                <span
                  className={styles.pillarBadge}
                  style={{
                    color: pillar.color,
                    backgroundColor: `${pillar.color}12`,
                    borderColor: `${pillar.color}30`,
                  }}
                >
                  {pillar.badge}
                </span>
              </div>

              <h3 className={styles.pillarRole}>{pillar.roleTitle}</h3>
              <p className={styles.pillarDesc}>{pillar.desc}</p>

              <div className={styles.pillarFeatures}>
                {pillar.features.map((feat, idx) => (
                  <div key={idx} className={styles.pillarFeatureItem}>
                    <span className={styles.pillarDot} style={{ backgroundColor: pillar.color }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className={styles.pillarFooter}>
                <button
                  type="button"
                  className={styles.pillarActionBtn}
                  style={{
                    color: pillar.color,
                    borderColor: `${pillar.color}40`,
                  }}
                >
                  <span>{pillar.actionText}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

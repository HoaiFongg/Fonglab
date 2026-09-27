'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/hub.module.css';
import { Navbar } from '@/components/hub/Navbar';
import { Footer } from '@/components/hub/Footer';
import { OmniSearch } from '@/components/hub/OmniSearch';
import { MiniProfile } from '@/components/hub/MiniProfile';
import { OnboardingPillars } from '@/components/hub/OnboardingPillars';
import { FeaturedSection } from '@/components/hub/FeaturedSection';
import { PortalGrid } from '@/components/hub/PortalGrid';
import { FaqSection } from '@/components/hub/FaqSection';
import { INITIAL_CATEGORIES, INITIAL_LINKS, FOUNDER_PROFILE } from '@/lib/mockData';
import { Category, LinkItem } from '@/types';
import { HubStore } from '@/lib/store';
import { Sparkles } from 'lucide-react';

export default function HubHomePage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);

  // Load latest state from Store
  useEffect(() => {
    async function loadData() {
      const [storedCats, storedLinks] = await Promise.all([
        HubStore.getCategories(),
        HubStore.getLinks(),
      ]);
      if (storedCats && storedCats.length > 0) setCategories(storedCats);
      if (storedLinks && storedLinks.length > 0) setLinks(storedLinks);
    }
    loadData();

    // Listen for real-time click updates
    const handleRemoteClick = (e: Event) => {
      const customEvent = e as CustomEvent<{ linkId: string; clickCount: number }>;
      if (customEvent.detail) {
        setLinks((prev) =>
          prev.map((l) =>
            l.id === customEvent.detail.linkId
              ? { ...l, clickCount: customEvent.detail.clickCount }
              : l
          )
        );
      }
    };

    window.addEventListener('fonglab_click_updated', handleRemoteClick);
    return () => window.removeEventListener('fonglab_click_updated', handleRemoteClick);
  }, []);

  const handleLinkClickCountUpdate = (linkId: string, newCount: number) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, clickCount: newCount } : l))
    );
  };

  // Calculate link counts per category
  const categoryCounts: Record<string, number> = {};
  links.forEach((l) => {
    categoryCounts[l.categoryId] = (categoryCounts[l.categoryId] || 0) + 1;
  });

  return (
    <main className={styles.container}>
      {/* Sticky Multi-Page Navigation */}
      <Navbar links={links} categories={categories} />

      {/* Hero Welcome Section */}
      <section className={styles.hero}>
        <div className={styles.heroTagline}>
          <Sparkles size={14} />
          <span>Kho Học Liệu &amp; Công Cụ Số Giáo Dục • Miễn Phí 100%</span>
        </div>

        <h1 className={styles.heroTitle}>
          Kho Tri Thức &amp; Công Cụ Số Dành Cho{' '}
          <span className="gradient-accent">Học Sinh</span> &amp;{' '}
          <span style={{ color: '#059669' }}>Thầy Cô Giáo</span>
        </h1>

        <p className={styles.heroDesc}>
          Trạm tài nguyên tập trung của <strong>Thầy Phạm Nguyễn Hoài Phong (Fonglab)</strong>. Khám phá kho giáo án Tin học THCS,
          hệ thống luyện thi Tin học Quốc tế Level 1, 2, 3, học liệu Tin học Tiểu học cùng bộ scripts tự động hóa công việc trường lớp.
        </p>

        {/* Central Omni-Search Bar with Quick Suggestions */}
        <OmniSearch links={links} categories={categories} />
      </section>

      {/* 3 Main Portal Gateways (Học tập / Công cụ / Trang web) */}
      <PortalGrid categoryCounts={categoryCounts} />

      {/* Featured Top Pick Resources ("🔥 Tiêu Điểm Tuyển Chọn") */}
      <FeaturedSection
        links={links}
        categories={categories}
        onLinkClick={handleLinkClickCountUpdate}
      />

      {/* Onboarding Pillars ("Bạn Đang Tìm Kiếm Gì?") */}
      <OnboardingPillars categoryCounts={categoryCounts} />

      {/* About Project & Founder Section */}
      <section id="about" className={styles.aboutSection} style={{ scrollMarginTop: '6rem' }}>
        <div className={styles.sectionHeaderCentered}>
          <div className={styles.sectionBadge}>
            <Sparkles size={14} />
            <span>Về Tác Giả &amp; Sứ Mệnh</span>
          </div>
          <h2 className={styles.sectionTitle}>Fonglab Được Tạo Ra Bởi Ai?</h2>
          <p className={styles.sectionSubtitle}>
            Dự án phi lợi nhuận được duy trì nhằm chia sẻ tài nguyên giáo dục miễn phí và thúc đẩy ứng dụng công nghệ trong giảng dạy.
          </p>
        </div>

        <MiniProfile profile={FOUNDER_PROFILE} />
      </section>

      {/* Frequently Asked Questions */}
      <FaqSection />

      {/* Shared Footer */}
      <Footer />
    </main>
  );
}

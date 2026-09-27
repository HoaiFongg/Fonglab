import type { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/hub/CategoryPageLayout';
import { GraduationCap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chuyên Trang Học Tập & Giáo Dục - Fonglab',
  description: 'Kho học liệu Tin học THCS, luyện thi Tin học Quốc tế Level 1, 2, 3 (IC3 GS6, MOS), Tin học Tiểu học và đề thi chính thức của Thầy Fong.',
};

export default function EducationPage() {
  return (
    <CategoryPageLayout
      categoryId="education"
      categoryName="Chuyên Trang Học Tập & Giáo Dục"
      categorySlug="hoc-tap"
      categoryIcon={<GraduationCap size={36} />}
      accentColor="#0284c7"
      iconBg="#eff6ff"
      iconBorder="#bfdbfe"
      description="Hệ thống kho giáo án điện tử Tin học THCS, bài giảng hoạt hình video AI Tiểu học và ngân hàng tài liệu luyện thi chuẩn Tin học Quốc tế Level 1, 2, 3 (IC3 GS6, MOS) biên soạn bởi Thầy Fong."
      subBadges={[
        'Tin học THCS Lớp 6 - 9',
        'Tin học Quốc tế IC3 GS6 & MOS',
        'Tin học Tiểu học & Video AI',
        'Ngân hàng đề thi',
      ]}
    />
  );
}

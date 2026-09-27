import type { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/hub/CategoryPageLayout';
import { Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trạm Công Cụ & Scripts Trợ Giảng - Fonglab',
  description: 'Tổng hợp mini-tools, Python scripts tính điểm học bạ, công cụ chuyển đổi đề thi và thủ thuật CNTT cho giáo viên.',
};

export default function ToolsPage() {
  return (
    <CategoryPageLayout
      categoryId="tools"
      categoryName="Trạm Công Cụ & Scripts Trợ Giảng"
      categorySlug="cong-cu"
      categoryIcon={<Wrench size={36} />}
      accentColor="#059669"
      iconBg="#ecfdf5"
      iconBorder="#a7f3d0"
      description="Bộ giải pháp tự động hóa dành cho giáo viên: Python scripts tổng hợp điểm học bạ, mini web app chuyển đổi định dạng file đề thi Word/LaTeX và macro phím tắt Windows tối ưu năng suất."
      subBadges={[
        'Python Scripts Tính điểm',
        'Exam Converter Online',
        'Macro Windows & Bàn phím',
        'Thủ thuật IT năng suất',
      ]}
    />
  );
}

import type { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/hub/CategoryPageLayout';
import { Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trang Web & Cổng Trực Tuyến Hữu Ích - Fonglab',
  description: 'Hệ thống các website vệ tinh, cổng thi thử Tin học Quốc tế GEMS - IC3, nền tảng thực hành gõ phím và học liệu trực tuyến.',
};

export default function WebsitesPage() {
  return (
    <CategoryPageLayout
      categoryId="websites"
      categoryName="Trang Web & Cổng Trực Tuyến Hữu Ích"
      categorySlug="trang-web"
      categoryIcon={<Globe size={36} />}
      accentColor="#d97706"
      iconBg="#fffbeb"
      iconBorder="#fde68a"
      description="Tuyển tập các website vệ tinh và nền tảng trực tuyến uy tín phục vụ việc dạy và học: Cổng thi thử Tin học Quốc tế GEMS - IC3, phần mềm trực tuyến luyện gõ phím 10 ngón, lập trình Scratch MIT và kho SGK điện tử."
      subBadges={[
        'Cổng Luyện thi GEMS - IC3',
        'Thực hành gõ phím TypingClub',
        'Sáng tạo Scratch MIT',
        'Sách điện tử Hành Trang Số',
      ]}
    />
  );
}

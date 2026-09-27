import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
});

export const metadata: Metadata = {
  title: 'Fonglab - Cổng Học Liệu Tin Học & Trạm Công Cụ Số',
  description: 'Trạm tài nguyên số kết nối kho giáo án Tin học THCS, luyện thi Tin học Quốc tế Level 1, 2, 3, Tin học Tiểu học và công cụ hỗ trợ giảng dạy Fonglab.',
  keywords: [
    'Fonglab',
    'Hoài Fong',
    'Phạm Nguyễn Hoài Phong',
    'Tin học THCS',
    'Tin học Quốc tế',
    'IC3 GS6',
    'MOS',
    'Tin học Tiểu học',
    'Giáo án Tin học',
    'Luyện thi chứng chỉ tin học',
    'Python Scripts',
    'EdTech',
    'Công cụ giáo viên'
  ],
  authors: [{ name: 'Phạm Nguyễn Hoài Phong' }],
  openGraph: {
    title: 'Fonglab - Trạm Trung Chuyển Hệ Sinh Thái Số',
    description: 'Điều hướng thông minh tới kho tài nguyên giáo dục Tin học và công cụ giảng dạy của Fonglab.',
    siteName: 'Fonglab Hub',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={beVietnamPro.className}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}

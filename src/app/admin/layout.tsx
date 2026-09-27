import React from 'react';
import styles from '@/styles/admin.module.css';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Fonglab Admin Dashboard - Quản Trị Hệ Sinh Thái',
  description: 'Giao diện quản lý liên kết, danh mục và thống kê lượt điều hướng cho Fonglab.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}

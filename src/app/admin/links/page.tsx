'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/admin.module.css';
import { Category, LinkItem } from '@/types';
import { HubStore } from '@/lib/store';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Pin,
  X,
  Save
} from 'lucide-react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

export default function LinkManagerPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [categoryId, setCategoryId] = useState('education');
  const [tagInput, setTagInput] = useState('');
  const [iconType, setIconType] = useState('Globe');
  const [badge, setBadge] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  const loadData = async () => {
    const [fetchedLinks, fetchedCats] = await Promise.all([
      HubStore.getLinks(),
      HubStore.getCategories(),
    ]);
    setLinks(fetchedLinks);
    setCategories(fetchedCats);
    if (fetchedCats.length > 0 && !categoryId) {
      setCategoryId(fetchedCats[0].id);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [fetchedLinks, fetchedCats] = await Promise.all([
        HubStore.getLinks(),
        HubStore.getCategories(),
      ]);
      if (mounted) {
        setLinks(fetchedLinks);
        setCategories(fetchedCats);
        if (fetchedCats.length > 0) {
          setCategoryId(fetchedCats[0].id);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleOpenAddModal = () => {
    setEditingLink(null);
    setTitle('');
    setDescription('');
    setUrl('');
    setCategoryId(categories[0]?.id || 'education');
    setTagInput('');
    setIconType('Globe');
    setBadge('');
    setIsPinned(false);
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (link: LinkItem) => {
    setEditingLink(link);
    setTitle(link.title);
    setDescription(link.description);
    setUrl(link.url);
    setCategoryId(link.categoryId);
    setTagInput(link.tags.join(', '));
    setIconType(link.iconType || 'Globe');
    setBadge(link.badge || '');
    setIsPinned(Boolean(link.isPinned));
    setIsFeatured(Boolean(link.isFeatured));
    setIsModalOpen(true);
  };

  const handleDelete = async (linkId: string, linkTitle: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa liên kết "${linkTitle}"?`)) {
      await HubStore.deleteLink(linkId);
      loadData();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      alert('Vui lòng nhập đầy đủ Tiêu đề và Đường dẫn URL');
      return;
    }

    const tagsArray = tagInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    await HubStore.saveLink({
      id: editingLink ? editingLink.id : undefined,
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      categoryId,
      tags: tagsArray,
      iconType,
      badge: badge.trim() || undefined,
      isPinned,
      isFeatured,
    });

    setIsModalOpen(false);
    loadData();
  };

  const handleTogglePin = async (link: LinkItem) => {
    await HubStore.saveLink({
      ...link,
      isPinned: !link.isPinned,
    });
    loadData();
  };

  // Filter links for display
  const filtered = links.filter((l) => {
    const matchCat = selectedCatFilter === 'all' || l.categoryId === selectedCatFilter;
    const matchQuery =
      searchQuery.trim() === '' ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : catId;
  };

  return (
    <div>
      {/* Top Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Quản Lý Liên Kết Vệ Tinh</h1>
          <p className={styles.pageSubtitle}>
            Thêm mới, chỉnh sửa, gắn thẻ tag và quản lý thứ tự các trang web / tài nguyên vệ tinh.
          </p>
        </div>

        <button onClick={handleOpenAddModal} className={styles.btnPrimary}>
          <Plus size={16} />
          <span>Thêm liên kết mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.panel} style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm liên kết theo tên, URL hoặc tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.formInput}
              style={{ width: '100%', paddingLeft: '2.5rem' }}
            />
          </div>

          <div style={{ width: '220px' }}>
            <select
              value={selectedCatFilter}
              onChange={(e) => setSelectedCatFilter(e.target.value)}
              className={styles.formSelect}
              style={{ width: '100%' }}
            >
              <option value="all">Tất cả phân khu ({links.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Links Table */}
      <div className={styles.panel} style={{ padding: 0, overflow: 'hidden' }}>
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>Icon</th>
                <th>Tiêu đề &amp; Mô tả</th>
                <th>Phân loại</th>
                <th>Tags</th>
                <th style={{ textAlign: 'center' }}>Lượt Click</th>
                <th style={{ textAlign: 'center' }}>Ghim</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    Không có liên kết nào phù hợp với tìm kiếm.
                  </td>
                </tr>
              ) : (
                filtered.map((link) => (
                  <tr key={link.id}>
                    <td style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#eff6ff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0284c7',
                        }}
                      >
                        <DynamicIcon name={link.iconType || 'Globe'} size={16} />
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{link.title}</span>
                        {link.badge && (
                          <span
                            style={{
                              fontSize: '0.685rem',
                              padding: '0.15rem 0.45rem',
                              background: '#eff6ff',
                              color: '#2563eb',
                              border: '1px solid #bfdbfe',
                              borderRadius: '4px',
                            }}
                          >
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>
                        {link.description}
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.75rem', color: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <span>{link.url}</span>
                        <ExternalLink size={12} />
                      </a>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.825rem', color: '#475569', fontWeight: 500 }}>
                        {getCategoryName(link.categoryId)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {link.tags.map((t, idx) => (
                          <span
                            key={idx}
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
                    <td style={{ textAlign: 'center', fontWeight: 700, color: '#0284c7' }}>
                      {link.clickCount || 0}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleTogglePin(link)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: link.isPinned ? '#d97706' : '#cbd5e1',
                          padding: '0.3rem',
                        }}
                        title={link.isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
                      >
                        <Pin size={16} />
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenEditModal(link)}
                          className={styles.btnSecondary}
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(link.id, link.title)}
                          className={styles.btnDanger}
                          title="Xóa liên kết"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div
            className={styles.modalContent}
            style={{ maxWidth: '640px', textAlign: 'left' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                {editingLink ? 'Chỉnh sửa Liên Kết' : 'Thêm Liên Kết Vệ Tinh Mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tiêu đề tài nguyên / trang web *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Kho Giáo án Tin học THCS (Lớp 6 - 9)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Đường dẫn URL đích *</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/... hoặc https://github.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tóm tắt mô tả ngắn</label>
                <textarea
                  rows={3}
                  placeholder="Giới thiệu nội dung, mục tiêu của tài nguyên này để người dùng nắm bắt..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.formTextarea}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Thuộc Phân khu *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={styles.formSelect}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Biểu tượng Icon (Lucide)</label>
                  <select
                    value={iconType}
                    onChange={(e) => setIconType(e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="Award">Award (Chứng chỉ/Thành tích)</option>
                    <option value="BookOpen">BookOpen (Sách/Giáo án)</option>
                    <option value="FolderOpen">FolderOpen (Thư mục Drive)</option>
                    <option value="PlaySquare">PlaySquare (Video bài giảng)</option>
                    <option value="FileCode">FileCode (Script Python)</option>
                    <option value="Terminal">Terminal (Công cụ số)</option>
                    <option value="Sparkles">Sparkles (Thủ thuật/AI)</option>
                    <option value="TrendingUp">TrendingUp (Thống kê/Hiệu suất)</option>
                    <option value="Cpu">Cpu (Phần cứng/Công nghệ)</option>
                    <option value="GitBranch">GitBranch (Mã nguồn GitHub)</option>
                    <option value="Globe">Globe (Website chung)</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Gắn thẻ Tags (cách nhau bởi dấu phẩy)</label>
                  <input
                    type="text"
                    placeholder="Tin học THCS, Tin học Quốc tế, EdTech"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nhãn Badge nổi bật (Tùy chọn)</label>
                  <input
                    type="text"
                    placeholder="Hot, Mới, Google Drive, Video AI"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                  />
                  <span>Ghim tài nguyên này lên đầu danh sách</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <span>Đánh dấu nổi bật (Featured)</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.btnSecondary}
                >
                  Hủy bỏ
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  <Save size={16} />
                  <span>{editingLink ? 'Lưu thay đổi' : 'Tạo liên kết'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

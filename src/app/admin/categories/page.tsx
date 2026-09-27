'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/admin.module.css';
import { Category, Tag } from '@/types';
import { HubStore } from '@/lib/store';
import { Plus, Trash2, FolderPlus, Tag as TagIcon, X, Save } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

export default function CategoryManagerPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Category modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catColor, setCatColor] = useState('#3b82f6');
  const [catIcon, setCatIcon] = useState('Folder');

  // Tag modal
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#3b82f6');

  const loadData = async () => {
    const [cats, tgs] = await Promise.all([
      HubStore.getCategories(),
      HubStore.getTags(),
    ]);
    setCategories(cats);
    setTags(tgs);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [cats, tgs] = await Promise.all([
        HubStore.getCategories(),
        HubStore.getTags(),
      ]);
      if (mounted) {
        setCategories(cats);
        setTags(tgs);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const id = catSlug.trim() || catName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const newCat: Category = {
      id,
      name: catName.trim(),
      slug: id,
      description: catDescription.trim(),
      color: catColor,
      icon: catIcon,
      order: categories.length + 1,
    };

    await HubStore.saveCategory(newCat);
    setIsCatModalOpen(false);
    setCatName('');
    setCatSlug('');
    setCatDescription('');
    loadData();
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa phân khu "${name}"? Các liên kết thuộc phân khu này sẽ cần được gán lại.`)) {
      await HubStore.deleteCategory(id);
      loadData();
    }
  };

  const handleSaveTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    const cleanName = tagName.trim().replace(/^#/, '');
    const id = cleanName.toLowerCase().replace(/\s+/g, '-');
    const newTag: Tag = {
      id,
      name: cleanName,
      color: tagColor,
    };

    await HubStore.saveTag(newTag);
    setIsTagModalOpen(false);
    setTagName('');
    loadData();
  };

  const handleDeleteTag = async (id: string, name: string) => {
    if (confirm(`Xóa tag #${name}?`)) {
      await HubStore.deleteTag(id);
      loadData();
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Quản Lý Danh Mục &amp; Thẻ Tag</h1>
          <p className={styles.pageSubtitle}>
            Tùy biến các phân khu hệ sinh thái và quản lý danh sách từ khóa lọc theo chủ đề.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setIsTagModalOpen(true)} className={styles.btnSecondary}>
            <TagIcon size={16} />
            <span>Tạo Tag mới</span>
          </button>
          <button onClick={() => setIsCatModalOpen(true)} className={styles.btnPrimary}>
            <FolderPlus size={16} />
            <span>Thêm Phân khu mới</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>
          <FolderPlus size={18} color="#0284c7" />
          <span>Danh Sách Phân Khu Hệ Sinh Thái ({categories.length})</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `${cat.color}15`,
                      border: `1px solid ${cat.color}35`,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DynamicIcon name={cat.icon} size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{cat.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: cat.color, fontWeight: 600 }}>Slug: #{cat.slug}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                  style={{ color: '#ef4444', padding: '0.3rem' }}
                  title="Xóa phân khu"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                {cat.description || 'Chưa có mô tả chi tiết'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tags Panel */}
      <div className={styles.panel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 className={styles.panelTitle} style={{ margin: 0 }}>
            <TagIcon size={18} color="#059669" />
            <span>Danh Sách Thẻ Tag Khám Phá ({tags.length})</span>
          </h2>
          <button onClick={() => setIsTagModalOpen(true)} className={styles.btnSecondary} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            <Plus size={14} />
            <span>Thêm Tag</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {tags.map((tag) => (
            <div
              key={tag.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#334155',
                fontSize: '0.85rem',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: tag.color || '#3b82f6' }} />
              <span style={{ fontWeight: 500 }}>#{tag.name}</span>
              <button
                onClick={() => handleDeleteTag(tag.id, tag.name)}
                style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', marginLeft: '0.2rem' }}
                title="Xóa tag"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      {isCatModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsCatModalOpen(false)}>
          <div className={styles.modalContent} style={{ textAlign: 'left' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>Thêm Phân Khu Mới</h2>
              <button onClick={() => setIsCatModalOpen(false)} style={{ color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tên Phân Khu *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Khu vực Trí tuệ Nhân tạo (AI Hub)"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mô tả ngắn</label>
                <textarea
                  rows={2}
                  placeholder="Giới thiệu mục tiêu và định hướng của phân khu này..."
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className={styles.formTextarea}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Biểu tượng Icon</label>
                  <select
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="Folder">Folder</option>
                    <option value="GraduationCap">GraduationCap (Giáo dục)</option>
                    <option value="Wrench">Wrench (Công cụ)</option>
                    <option value="Cpu">Cpu (Phần cứng/Công nghệ)</option>
                    <option value="BookOpen">BookOpen (Sách)</option>
                    <option value="Sparkles">Sparkles (AI/Đột phá)</option>
                    <option value="Code">Code (Lập trình)</option>
                    <option value="TrendingUp">TrendingUp (Tài chính)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mã màu chủ đạo</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={catColor}
                      onChange={(e) => setCatColor(e.target.value)}
                      style={{ width: '42px', height: '42px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                    />
                    <input
                      type="text"
                      value={catColor}
                      onChange={(e) => setCatColor(e.target.value)}
                      className={styles.formInput}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsCatModalOpen(false)} className={styles.btnSecondary}>
                  Hủy
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  <Save size={16} />
                  <span>Lưu Phân Khu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Tag Modal */}
      {isTagModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsTagModalOpen(false)}>
          <div className={styles.modalContent} style={{ maxWidth: '440px', textAlign: 'left' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>Tạo Thẻ Tag Mới</h2>
              <button onClick={() => setIsTagModalOpen(false)} style={{ color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTag}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tên Tag *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Tin học THCS, Tin học Quốc tế, Python, IC3 GS6"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Màu sắc Tag</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={tagColor}
                    onChange={(e) => setTagColor(e.target.value)}
                    style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                  />
                  <input
                    type="text"
                    value={tagColor}
                    onChange={(e) => setTagColor(e.target.value)}
                    className={styles.formInput}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsTagModalOpen(false)} className={styles.btnSecondary}>
                  Hủy
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  <Save size={16} />
                  <span>Tạo Tag</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

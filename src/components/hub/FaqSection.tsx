'use client';

import React, { useState } from 'react';
import styles from '@/styles/hub.module.css';
import { HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  tag: string;
}

const FAQS: FaqItem[] = [
  {
    tag: 'Giới thiệu',
    question: 'Fonglab là gì và được tạo ra với mục đích gì?',
    answer:
      'Fonglab là cổng tài nguyên và công cụ số mở do Thầy Phạm Nguyễn Hoài Phong (Fonglab) sáng lập. Trang web được xây dựng nhằm cung cấp một điểm truy cập tập trung, tiện lợi cho học sinh, quý phụ huynh và thầy cô vào kho giáo án Tin học THCS, hệ thống luyện thi Tin học Quốc tế (Level 1, 2, 3), học liệu Tin học Tiểu học và các mini-tools năng suất tối ưu cho công tác giảng dạy.',
  },
  {
    tag: 'Chi phí',
    question: 'Tôi có phải trả phí để tải tài liệu hoặc sử dụng các công cụ không?',
    answer:
      'Hoàn toàn KHÔNG. 100% tài nguyên trên Fonglab (giáo án Word/PowerPoint, bài tập, video bài giảng, script Python...) đều được cung cấp miễn phí và phi thương mại nhằm phục vụ cộng đồng giáo dục.',
  },
  {
    tag: 'Sử dụng',
    question: 'Làm thế nào để tải giáo án Tin học hoặc sử dụng các script Python?',
    answer:
      'Chỉ cần bấm trực tiếp vào bất kỳ thẻ tài nguyên nào, hệ thống sẽ mở trực tiếp thư mục Google Drive chứa giáo án Tin học THCS / đề thi Quốc tế hoặc kho mã nguồn GitHub tương ứng. Bạn có thể xem trực tiếp hoặc tải về máy tính để sử dụng ngay.',
  },
  {
    tag: 'Bản quyền',
    question: 'Tôi có thể dùng tài liệu này cho học sinh và đồng nghiệp tại trường không?',
    answer:
      'Rất khuyến khích! Quý thầy cô hoàn toàn có thể sử dụng, trích dẫn hoặc chỉnh sửa nội dung giáo án, bài giảng số để phục vụ cho các tiết học tại trường lớp của mình.',
  },
  {
    tag: 'Liên hệ',
    question: 'Nếu phát hiện link hỏng hoặc muốn trao đổi chuyên môn thì liên hệ ai?',
    answer:
      'Bạn có thể liên hệ trực tiếp với Thầy Fong qua Zalo, Facebook hoặc gửi Email được đính kèm trong phần thông tin tác giả ở cuối trang.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className={styles.faqSection}>
      <div className={styles.sectionHeaderCentered}>
        <div className={styles.sectionBadge}>
          <HelpCircle size={14} />
          <span>Hỏi Đáp Thường Gặp</span>
        </div>
        <h2 className={styles.sectionTitle}>Giải Đáp Cho Người Mới Bắt Đầu</h2>
        <p className={styles.sectionSubtitle}>
          Mọi điều bạn cần biết trước khi khai thác kho tài nguyên và công cụ số tại Fonglab.
        </p>
      </div>

      <div className={styles.faqList}>
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`${styles.faqCard} ${isOpen ? styles.faqCardOpen : ''}`}
            >
              <button
                type="button"
                className={styles.faqQuestionBtn}
                onClick={() => toggleFaq(index)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
                  <span className={styles.faqTagBadge}>{faq.tag}</span>
                  <span className={styles.faqQuestionText}>{faq.question}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`${styles.faqChevron} ${isOpen ? styles.faqChevronRotated : ''}`}
                />
              </button>

              {isOpen && (
                <div className={styles.faqAnswer}>
                  <div className={styles.faqAnswerInner}>
                    <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p>{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

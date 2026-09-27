export type CategoryId = 'education' | 'tools' | 'websites' | string;

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // Lucide icon name
  description: string;
  color: string; // Accent color hex or css var
  order: number;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  categoryId: CategoryId;
  tags: string[];
  iconType?: string; // e.g. 'book', 'code', 'trending-up', 'cpu', 'file-text'
  badge?: string; // e.g. 'Hot', 'Mới', 'Drive', 'GitHub', 'Video AI'
  clickCount: number;
  isPinned?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface FounderProfile {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  badges: string[];
  socialLinks: {
    platform: 'github' | 'facebook' | 'zalo' | 'email' | 'website';
    url: string;
    label: string;
  }[];
}

export interface AnalyticsSummary {
  totalLinks: number;
  totalClicks: number;
  topLinks: LinkItem[];
  categoryBreakdown: {
    category: Category;
    count: number;
    clicks: number;
  }[];
}

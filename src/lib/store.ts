'use client';

import { AnalyticsSummary, Category, LinkItem, Tag } from '@/types';
import { INITIAL_CATEGORIES, INITIAL_LINKS, INITIAL_TAGS } from './mockData';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const STORAGE_KEY_LINKS = 'fonglab_links_v7';
const STORAGE_KEY_CATEGORIES = 'fonglab_categories_v6';
const STORAGE_KEY_TAGS = 'fonglab_tags_v6';

// In-memory fallback
let memoryLinks: LinkItem[] = [...INITIAL_LINKS];
let memoryCategories: Category[] = [...INITIAL_CATEGORIES];
let memoryTags: Tag[] = [...INITIAL_TAGS];

function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`[Fonglab Store] Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function saveStoredData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[Fonglab Store] Error writing ${key} to localStorage:`, e);
  }
}

export const HubStore = {
  // Fetch all categories
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('order_num', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((item) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            icon: item.icon,
            description: item.description,
            color: item.color,
            order: item.order_num,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch categories fallback:', err);
      }
    }
    return getStoredData<Category[]>(STORAGE_KEY_CATEGORIES, memoryCategories);
  },

  // Fetch all tags
  async getTags(): Promise<Tag[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('tags').select('*');
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch tags fallback:', err);
      }
    }
    return getStoredData<Tag[]>(STORAGE_KEY_TAGS, memoryTags);
  },

  // Fetch all links
  async getLinks(): Promise<LinkItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('links')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('click_count', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            url: item.url,
            categoryId: item.category_id,
            tags: item.tags || [],
            iconType: item.icon_type,
            badge: item.badge,
            clickCount: item.click_count || 0,
            isPinned: item.is_pinned,
            isFeatured: item.is_featured,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch links fallback:', err);
      }
    }
    return getStoredData<LinkItem[]>(STORAGE_KEY_LINKS, memoryLinks);
  },

  // Track / Increment Click
  async recordClick(linkId: string): Promise<number> {
    // 1. Update in Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('increment_link_click', {
          target_link_id: linkId,
        });
        if (!error && typeof data === 'number') {
          return data;
        }
      } catch (err) {
        console.warn('Supabase click record fallback:', err);
      }
    }

    // 2. Fallback to LocalStorage & memory
    const links = getStoredData<LinkItem[]>(STORAGE_KEY_LINKS, memoryLinks);
    let newCount = 0;
    const updatedLinks = links.map((link) => {
      if (link.id === linkId) {
        newCount = (link.clickCount || 0) + 1;
        return {
          ...link,
          clickCount: newCount,
          updatedAt: new Date().toISOString(),
        };
      }
      return link;
    });

    memoryLinks = updatedLinks;
    saveStoredData(STORAGE_KEY_LINKS, updatedLinks);

    // Dispatch a custom window event so UI can reactively update without full reloads
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('fonglab_click_updated', {
          detail: { linkId, clickCount: newCount },
        })
      );
    }

    return newCount;
  },

  // Save or update a link (Admin)
  async saveLink(linkData: Omit<LinkItem, 'id' | 'createdAt' | 'clickCount'> & { id?: string }): Promise<LinkItem> {
    const isEdit = Boolean(linkData.id);
    const id = linkData.id || `link-${Date.now()}`;
    const now = new Date().toISOString();

    const links = getStoredData<LinkItem[]>(STORAGE_KEY_LINKS, memoryLinks);
    let targetLink: LinkItem;

    if (isEdit) {
      const existing = links.find((l) => l.id === id);
      targetLink = {
        ...(existing || { clickCount: 0, createdAt: now }),
        ...linkData,
        id,
        updatedAt: now,
      } as LinkItem;
    } else {
      targetLink = {
        ...linkData,
        id,
        clickCount: 0,
        createdAt: now,
        updatedAt: now,
      };
    }

    // Supabase update
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('links').upsert({
          id: targetLink.id,
          title: targetLink.title,
          description: targetLink.description,
          url: targetLink.url,
          category_id: targetLink.categoryId,
          tags: targetLink.tags,
          icon_type: targetLink.iconType,
          badge: targetLink.badge,
          is_pinned: targetLink.isPinned ?? false,
          is_featured: targetLink.isFeatured ?? false,
          click_count: targetLink.clickCount,
          updated_at: targetLink.updatedAt,
        });
      } catch (err) {
        console.warn('Supabase saveLink error:', err);
      }
    }

    // LocalStorage update
    const updatedLinks = isEdit
      ? links.map((l) => (l.id === id ? targetLink : l))
      : [targetLink, ...links];

    memoryLinks = updatedLinks;
    saveStoredData(STORAGE_KEY_LINKS, updatedLinks);
    return targetLink;
  },

  // Delete a link (Admin)
  async deleteLink(linkId: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('links').delete().eq('id', linkId);
      } catch (err) {
        console.warn('Supabase deleteLink error:', err);
      }
    }

    const links = getStoredData<LinkItem[]>(STORAGE_KEY_LINKS, memoryLinks);
    const updatedLinks = links.filter((l) => l.id !== linkId);
    memoryLinks = updatedLinks;
    saveStoredData(STORAGE_KEY_LINKS, updatedLinks);
    return true;
  },

  // Save a category (Admin)
  async saveCategory(catData: Category): Promise<Category> {
    const categories = getStoredData<Category[]>(STORAGE_KEY_CATEGORIES, memoryCategories);
    const existingIndex = categories.findIndex((c) => c.id === catData.id);
    let updatedCats: Category[];
    if (existingIndex >= 0) {
      updatedCats = categories.map((c) => (c.id === catData.id ? catData : c));
    } else {
      updatedCats = [...categories, catData];
    }
    memoryCategories = updatedCats;
    saveStoredData(STORAGE_KEY_CATEGORIES, updatedCats);
    return catData;
  },

  // Save a tag (Admin)
  async saveTag(tagData: Tag): Promise<Tag> {
    const tags = getStoredData<Tag[]>(STORAGE_KEY_TAGS, memoryTags);
    const existingIndex = tags.findIndex((t) => t.id === tagData.id);
    let updatedTags: Tag[];
    if (existingIndex >= 0) {
      updatedTags = tags.map((t) => (t.id === tagData.id ? tagData : t));
    } else {
      updatedTags = [...tags, tagData];
    }
    memoryTags = updatedTags;
    saveStoredData(STORAGE_KEY_TAGS, updatedTags);
    return tagData;
  },

  // Delete category
  async deleteCategory(catId: string): Promise<boolean> {
    const categories = getStoredData<Category[]>(STORAGE_KEY_CATEGORIES, memoryCategories);
    const updatedCats = categories.filter((c) => c.id !== catId);
    memoryCategories = updatedCats;
    saveStoredData(STORAGE_KEY_CATEGORIES, updatedCats);
    return true;
  },

  // Delete tag
  async deleteTag(tagId: string): Promise<boolean> {
    const tags = getStoredData<Tag[]>(STORAGE_KEY_TAGS, memoryTags);
    const updatedTags = tags.filter((t) => t.id !== tagId);
    memoryTags = updatedTags;
    saveStoredData(STORAGE_KEY_TAGS, updatedTags);
    return true;
  },

  // Reset all to default seed data
  resetDefaults(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(INITIAL_LINKS));
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(INITIAL_TAGS));
    memoryLinks = [...INITIAL_LINKS];
    memoryCategories = [...INITIAL_CATEGORIES];
    memoryTags = [...INITIAL_TAGS];
  },

  // Get Analytics Summary
  async getAnalytics(): Promise<AnalyticsSummary> {
    const links = await this.getLinks();
    const categories = await this.getCategories();

    const totalClicks = links.reduce((sum, l) => sum + (l.clickCount || 0), 0);
    const topLinks = [...links].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0)).slice(0, 5);

    const categoryBreakdown = categories.map((cat) => {
      const catLinks = links.filter((l) => l.categoryId === cat.id);
      const clicks = catLinks.reduce((sum, l) => sum + (l.clickCount || 0), 0);
      return {
        category: cat,
        count: catLinks.length,
        clicks,
      };
    });

    return {
      totalLinks: links.length,
      totalClicks,
      topLinks,
      categoryBreakdown,
    };
  },
};

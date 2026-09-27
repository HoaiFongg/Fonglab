-- =========================================================
-- FONGLAB ECOSYSTEM CENTRAL HUB - SUPABASE SQL SCHEMA
-- =========================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL DEFAULT 'Folder',
    description TEXT,
    color TEXT NOT NULL DEFAULT '#3b82f6',
    order_num INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Tags Table
CREATE TABLE IF NOT EXISTS public.tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#3b82f6'
);

-- 3. Create Links Table
CREATE TABLE IF NOT EXISTS public.links (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    icon_type TEXT DEFAULT 'Globe',
    badge TEXT,
    click_count INT NOT NULL DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create Click Tracking Logs Table (For Detailed Analytics)
CREATE TABLE IF NOT EXISTS public.link_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id TEXT REFERENCES public.links(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_agent TEXT,
    referer TEXT
);

-- 5. Stored Procedure for Atomic Click Increment
CREATE OR REPLACE FUNCTION increment_link_click(target_link_id TEXT)
RETURNS INT AS $$
DECLARE
    new_count INT;
BEGIN
    UPDATE public.links
    SET click_count = click_count + 1,
        updated_at = NOW()
    WHERE id = target_link_id
    RETURNING click_count INTO new_count;

    INSERT INTO public.link_clicks(link_id)
    VALUES (target_link_id);

    RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Row Level Security (RLS) Setup
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories, tags, links
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Public Read Links" ON public.links FOR SELECT USING (true);

-- Allow authenticated users or service role to manage links
CREATE POLICY "Admin All Access Categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admin All Access Tags" ON public.tags FOR ALL USING (true);
CREATE POLICY "Admin All Access Links" ON public.links FOR ALL USING (true);
CREATE POLICY "Public Click Log Insert" ON public.link_clicks FOR INSERT WITH CHECK (true);

-- 7. Seed Initial Data
INSERT INTO public.categories (id, name, slug, icon, description, color, order_num) VALUES
('education', 'Khu vực Giáo dục', 'giao-duc', 'GraduationCap', 'Kho tài nguyên luyện thi, giáo án Toán 6 và bài giảng số', '#3b82f6', 1),
('tools', 'Công cụ & Kỹ thuật', 'cong-cu-ky-thuat', 'Wrench', 'Mini-tools, Python scripts và thủ thuật IT tối ưu năng suất', '#10b981', 2),
('research', 'Khu vực Nghiên cứu', 'nghien-cuu', 'Cpu', 'Đề tài cao học, Deep Learning, Crypto Analytics và Open Source', '#8b5cf6', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tags (id, name, color) VALUES
('toan-6', 'Toán 6', '#3b82f6'),
('luyen-thi', 'Luyện thi', '#06b6d4'),
('video-ai', 'Video AI', '#ec4899'),
('edtech', 'EdTech', '#6366f1'),
('python', 'Python', '#10b981'),
('mini-tools', 'Mini Tools', '#f59e0b'),
('thu-thuat-it', 'Thủ thuật IT', '#14b8a6'),
('crypto', 'Crypto', '#f97316'),
('deep-learning', 'Deep Learning', '#8b5cf6'),
('open-source', 'Open Source', '#64748b'),
('tai-chinh', 'Tài chính', '#eab308')
ON CONFLICT (id) DO NOTHING;

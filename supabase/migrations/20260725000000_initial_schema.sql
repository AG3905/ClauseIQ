-- ClauseIQ Initial Database Schema Migration
-- Migration Name: 20260725000000_initial_schema.sql

-- 1. Create analyses Table
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_text TEXT,
    result JSONB,
    verdict TEXT,
    risk_score INTEGER,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create chat_messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create comparisons Table
CREATE TABLE IF NOT EXISTS public.comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    original_analysis_id UUID REFERENCES public.analyses(id) ON DELETE SET NULL,
    revised_analysis_id UUID REFERENCES public.analyses(id) ON DELETE SET NULL,
    result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index Definitions for Fast Lookups
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_analysis_id ON public.chat_messages(analysis_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_user_id ON public.comparisons(user_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparisons ENABLE ROW LEVEL SECURITY;

-- 4. Row Level Security Policies (user_id = auth.uid())

-- Policies for analyses
CREATE POLICY "Users can select own analyses" ON public.analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses" ON public.analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses" ON public.analyses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses" ON public.analyses
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for chat_messages
CREATE POLICY "Users can select own chat_messages" ON public.chat_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat_messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat_messages" ON public.chat_messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat_messages" ON public.chat_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for comparisons
CREATE POLICY "Users can select own comparisons" ON public.comparisons
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own comparisons" ON public.comparisons
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comparisons" ON public.comparisons
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comparisons" ON public.comparisons
    FOR DELETE USING (auth.uid() = user_id);

-- Migration Name: 20260730000000_add_platform_settings_to_profiles.sql
-- Add workspace platform settings preferences to public.profiles table

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS risk_threshold TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS export_format TEXT DEFAULT 'pdf';

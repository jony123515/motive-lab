-- ====================================================================
-- MOTIVE LAB - Production Database Schema (PostgreSQL / Supabase)
-- Strict Row Level Security (RLS), Role-Based Permissions & Clinical Auditing
-- Totalmente idempotente (seguro para re-ejecutar sin errores)
-- ====================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enumeraciones y Tipos Personalizados
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('client', 'coach', 'nutritionist', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_level_type AS ENUM ('low', 'moderate', 'high_clinical_stop');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE primary_goal_type AS ENUM ('hypertrophy', 'fat_loss', 'recomposition', 'strength', 'endurance', 'general_health');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Tabla de Perfiles Públicos / Usuarios
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    birth_date DATE NOT NULL,
    country TEXT DEFAULT 'México',
    timezone TEXT DEFAULT 'America/Mexico_City',
    role user_role_type DEFAULT 'client' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Tabla de Consentimientos y Cumplimiento ARCO / Protección de Datos en Salud
CREATE TABLE IF NOT EXISTS public.privacy_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    terms_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    privacy_policy_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    sensitive_health_data_consented BOOLEAN NOT NULL DEFAULT TRUE,
    media_upload_consented BOOLEAN DEFAULT FALSE,
    consented_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ip_address_hash TEXT,
    revoked_at TIMESTAMPTZ
);

-- 5. Expedientes de Evaluación Integral (Cuestionario)
CREATE TABLE IF NOT EXISTS public.clinical_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    anthropometry JSONB NOT NULL,
    goal JSONB NOT NULL,
    clinical_screening JSONB NOT NULL,
    sports_background JSONB NOT NULL,
    dietary_habits JSONB NOT NULL,
    activity_recovery JSONB NOT NULL,
    risk_level risk_level_type DEFAULT 'low' NOT NULL,
    is_cleared_for_auto_plan BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Planes de Nutrición
CREATE TABLE IF NOT EXISTS public.nutrition_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_nutritionist_id UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'active' NOT NULL,
    methodology JSONB NOT NULL,
    weekly_days JSONB NOT NULL,
    safety_verified BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Planes de Entrenamiento
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_coach_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    mesocycle_weeks INT DEFAULT 6 NOT NULL,
    current_week INT DEFAULT 1 NOT NULL,
    deload_week INT DEFAULT 6 NOT NULL,
    progression_rule TEXT DEFAULT 'double_progression_standard' NOT NULL,
    sessions JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. Registro de Sesiones Realizadas y Sobrecarga Progresiva
CREATE TABLE IF NOT EXISTS public.workout_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    workout_session_id TEXT NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    duration_minutes INT NOT NULL,
    logged_exercises JSONB NOT NULL,
    session_rpe INT CHECK (session_rpe >= 1 AND session_rpe <= 10),
    fatigue_level TEXT DEFAULT 'normal',
    coach_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Registro de Métricas Físicas e Hidratación
CREATE TABLE IF NOT EXISTS public.metric_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    weight_kg NUMERIC(5,2) NOT NULL,
    waist_cm NUMERIC(5,2),
    water_ml_consumed INT DEFAULT 0,
    water_target_ml INT DEFAULT 2500,
    sleep_hours NUMERIC(3,1),
    adherence_nutrition_pct INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. POLÍTICAS DE ROW LEVEL SECURITY (RLS) - Idempotentes
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Función auxiliar con SECURITY DEFINER para evitar recursión infinita en RLS
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('coach', 'nutritionist', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER;

DROP POLICY IF EXISTS "Staff can view assigned profiles" ON public.profiles;
CREATE POLICY "Staff can view assigned profiles"
ON public.profiles FOR SELECT
USING (
  public.is_staff()
);

-- Políticas para Assessments
DROP POLICY IF EXISTS "Users can view and insert own assessments" ON public.clinical_assessments;
CREATE POLICY "Users can view and insert own assessments"
ON public.clinical_assessments FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Políticas para Workout Logs
DROP POLICY IF EXISTS "Users can view and insert own workout logs" ON public.workout_logs;
CREATE POLICY "Users can view and insert own workout logs"
ON public.workout_logs FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Políticas para Nutrition Plans
DROP POLICY IF EXISTS "Users can view own nutrition plans" ON public.nutrition_plans;
CREATE POLICY "Users can view own nutrition plans"
ON public.nutrition_plans FOR SELECT
USING (auth.uid() = user_id);

-- Políticas para Consents
DROP POLICY IF EXISTS "Users can view and manage own consents" ON public.privacy_consents;
CREATE POLICY "Users can view and manage own consents"
ON public.privacy_consents FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Políticas para Metric Logs
DROP POLICY IF EXISTS "Users can view and insert own metric logs" ON public.metric_logs;
CREATE POLICY "Users can view and insert own metric logs"
ON public.metric_logs FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_assessments_user ON public.clinical_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_date ON public.workout_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_metric_logs_user_date ON public.metric_logs(user_id, date);

-- 11. Trigger Automático para sincronizar auth.users con public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, birth_date, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Atleta MOTIVE LAB'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'birth_date')::date, '1998-01-01'::date),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role_type, 'client'::public.user_role_type)
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Supabase Storage: Bucket privado 'athlete-media' y políticas de privacidad
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'athlete-media',
  'athlete-media',
  false,
  52428800,
  ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'image/jpeg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "Athletes can upload own media" ON storage.objects;
CREATE POLICY "Athletes can upload own media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'athlete-media' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Athletes and staff can view media" ON storage.objects;
CREATE POLICY "Athletes and staff can view media"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'athlete-media' AND (
    (auth.uid())::text = (storage.foldername(name))[1] OR
    public.is_staff()
  )
);

DROP POLICY IF EXISTS "Athletes can delete own media" ON storage.objects;
CREATE POLICY "Athletes can delete own media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'athlete-media' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

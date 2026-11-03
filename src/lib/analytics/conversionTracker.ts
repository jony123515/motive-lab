'use client';

/**
 * MOTIVE LAB — Sistema de Analítica Comercial y Experimentación A/B
 * Cumple con LFPDPPP: Registra exclusivamente eventos del embudo de conversión
 * sin recopilar ni transmitir datos clínicos o antropométricos sensibles.
 */

export type ConversionEventName =
  | 'landing_view'
  | 'hero_cta_click'
  | 'evaluation_started'
  | 'evaluation_completed'
  | 'pricing_viewed'
  | 'plan_selected'
  | 'checkout_started'
  | 'checkout_completed'
  | 'subscription_activated';

export type HeroCopyVariantId = 'variant_a' | 'variant_b' | 'variant_c';

export interface HeroCopyVariant {
  id: HeroCopyVariantId;
  label: string;
  eyebrow: string;
  headlineTop: string;
  headlineAccent: string;
  subtitle: string;
  primaryCta: string;
  primaryCtaAux: string;
  secondaryCta: string;
}

export const HERO_COPY_VARIANTS: Record<HeroCopyVariantId, HeroCopyVariant> = {
  variant_a: {
    id: 'variant_a',
    label: 'Variante A — Editorial Principal',
    eyebrow: 'MOTIVE LAB • SCIENCE & STRENGTH',
    headlineTop: 'TU POTENCIAL NO SE ADIVINA.',
    headlineAccent: 'SE CONSTRUYE.',
    subtitle:
      'Entrenamiento progresivo y nutrición deportiva adaptados a tu objetivo, tu experiencia y tu estilo de vida. Menos improvisación. Más método.',
    primaryCta: 'DESCUBRE TU PLAN',
    primaryCtaAux: 'Comienza con tu evaluación inicial.',
    secondaryCta: 'EXPLORAR MEMBRESÍAS',
  },
  variant_b: {
    id: 'variant_b',
    label: 'Variante B — Enfoque Metodológico',
    eyebrow: 'NUTRICIÓN APLICADA • PROGRAMACIÓN DE FUERZA',
    headlineTop: 'ENTRENA Y ALIMÉNTATE',
    headlineAccent: 'CON CRITERIO.',
    subtitle:
      'Planificación estructurada con ingredientes cotidianos en México y progresión medible sesión a sesión. Diseñado para sostenerse en tu vida real.',
    primaryCta: 'DESCUBRE TU PLAN',
    primaryCtaAux: 'Comienza con tu evaluación inicial.',
    secondaryCta: 'EXPLORAR MEMBRESÍAS',
  },
  variant_c: {
    id: 'variant_c',
    label: 'Variante C — Evolución Medible',
    eyebrow: 'SISTEMA INTEGRAL DE ALTO RENDIMIENTO',
    headlineTop: 'LA CIENCIA DETRÁS DE',
    headlineAccent: 'TU MEJOR VERSIÓN.',
    subtitle:
      'Integramos periodización de fuerza, equivalencias nutricionales SMAE y seguimiento periódico en una plataforma clara, adaptable y transparente.',
    primaryCta: 'DESCUBRE TU PLAN',
    primaryCtaAux: 'Comienza con tu evaluación inicial.',
    secondaryCta: 'EXPLORAR MEMBRESÍAS',
  },
};

export interface ConversionEventRecord {
  id: string;
  event: ConversionEventName;
  timestamp: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  variant: HeroCopyVariantId;
  metadata?: Record<string, string | number | boolean>;
}

const STORAGE_KEY_EVENTS = 'motive_conversion_events_v1';
const STORAGE_KEY_VARIANT = 'motive_ab_hero_variant_v1';

function detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

export function getAssignedHeroVariant(): HeroCopyVariantId {
  if (typeof window === 'undefined') return 'variant_a';
  const stored = localStorage.getItem(STORAGE_KEY_VARIANT) as HeroCopyVariantId | null;
  if (stored && HERO_COPY_VARIANTS[stored]) {
    return stored;
  }
  localStorage.setItem(STORAGE_KEY_VARIANT, 'variant_a');
  return 'variant_a';
}

export function setAssignedHeroVariant(variant: HeroCopyVariantId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_VARIANT, variant);
}

export function trackConversionEvent(
  event: ConversionEventName,
  metadata?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined') return;

  try {
    const record: ConversionEventRecord = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      event,
      timestamp: new Date().toISOString(),
      deviceType: detectDeviceType(),
      variant: getAssignedHeroVariant(),
      metadata,
    };

    const existingRaw = localStorage.getItem(STORAGE_KEY_EVENTS);
    const existing: ConversionEventRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
    const updated = [...existing.slice(-99), record];
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(updated));

    // Emitir a dataLayer / gtag si está configurado en producción
    const win = window as any;
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({
        event: `motive_${event}`,
        device_type: record.deviceType,
        ab_variant: record.variant,
        ...metadata,
      });
    }
  } catch {
    // No bloquear el flujo del usuario si localStorage está restringido
  }
}

export function getConversionFunnelSummary() {
  if (typeof window === 'undefined') {
    return { totalEvents: 0, counts: {} as Record<ConversionEventName, number> };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    const list: ConversionEventRecord[] = raw ? JSON.parse(raw) : [];
    const counts = list.reduce((acc, item) => {
      acc[item.event] = (acc[item.event] || 0) + 1;
      return acc;
    }, {} as Record<ConversionEventName, number>);
    return { totalEvents: list.length, counts };
  } catch {
    return { totalEvents: 0, counts: {} as Record<ConversionEventName, number> };
  }
}

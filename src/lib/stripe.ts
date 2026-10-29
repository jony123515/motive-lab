import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const isStripeConfigured = Boolean(
  stripeSecretKey && !stripeSecretKey.includes('sk_test_placeholder')
);

export const stripe = isStripeConfigured
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-09-30.acacia' as any,
    })
  : null;

export interface PlanConfig {
  id: string;
  name: string;
  description: string;
  priceMxnMonthly: number;
  priceMxnYearly: number;
  highlighted?: boolean;
  badge?: string;
  features: string[];
}

export const SUBSCRIPTION_PLANS: PlanConfig[] = [
  {
    id: 'free',
    name: 'Plan Básico',
    description: 'Para personas que inician y quieren conocer sus requerimientos calóricos.',
    priceMxnMonthly: 0,
    priceMxnYearly: 0,
    features: [
      'Evaluación inicial completa con triaje PAR-Q+',
      'Cálculo de Tasa Metabólica Basal y TDEE (Mifflin/Katch)',
      'Biblioteca completa de ejercicios en español',
      'Acceso a biblioteca de suplementos deportivos ISSN',
      '1 Día de menú de ejemplo',
    ],
  },
  {
    id: 'pro',
    name: 'Plan Atleta Pro',
    description: 'El sistema completo de nutrición SMAE y sobrecarga progresiva automatizada.',
    priceMxnMonthly: 249,
    priceMxnYearly: 1999,
    highlighted: true,
    badge: 'MÁS POPULAR',
    features: [
      'Todo lo del Plan Básico',
      'Menús completos de 7 días adaptados a tus gustos y macros',
      'Herramienta de sustitución inteligente de alimentos SMAE',
      'Generador automático de lista de compras semanal',
      'Motor de Doble Progresión (alertas de incremento de peso)',
      'Subida de videos de técnica para autoanálisis biomecánico',
      'Descarga de reportes clínicos e imprimibles en PDF',
      'Calculadora y registro dinámico de hidratación',
    ],
  },
  {
    id: 'coach',
    name: 'Plan con Coach & Nutriólogo',
    description: 'Acompañamiento profesional 1 a 1 para maximizar tus resultados.',
    priceMxnMonthly: 999,
    priceMxnYearly: 8999,
    badge: 'ASESORÍA VIP',
    features: [
      'Todo lo del Plan Atleta Pro',
      'Revisión semanal de videos de técnica por un Coach certificado',
      'Ajustes de dieta mensuales por Nutriólogo Deportivo',
      'Canal de comunicación y feedback directo en el portal',
      'Monitoreo continuo de fatiga y semanas de descarga adaptativas',
      'Garantía de progreso físico seguro y sin lesiones',
    ],
  },
];

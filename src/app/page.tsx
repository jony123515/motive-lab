'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppState } from '@/lib/store/appState';
import { SUBSCRIPTION_PLANS, PlanConfig } from '@/lib/stripe';
import {
  HERO_COPY_VARIANTS,
  HeroCopyVariantId,
  getAssignedHeroVariant,
  setAssignedHeroVariant,
  trackConversionEvent,
} from '@/lib/analytics/conversionTracker';
import {
  Flame,
  ShieldCheck,
  Dumbbell,
  Apple,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Check,
  ChevronDown,
  ChevronUp,
  Lock,
  Clock,
  Target,
  Activity,
  RotateCw,
  Sliders,
  Layers,
  FileText,
  CreditCard,
  Compass,
} from 'lucide-react';

// Datos ilustrativos para la Demostración Interactiva (identificados explícitamente como ejemplo)
interface DemoScenario {
  id: 'fat_loss' | 'hypertrophy' | 'recomposition';
  label: string;
  profileSummary: string;
  calorieExample: number;
  proteinExample: number;
  carbsExample: number;
  fatsExample: number;
  splitName: string;
  weeklySchedule: { day: string; focus: string; volume: string; rir: string }[];
  sampleMeals: {
    time: string;
    title: string;
    items: string[];
    macros: string;
    substituteExample: string;
  }[];
  demoProgression: { week: string; metricA: string; metricB: string; loadExample: string }[];
}

const DEMO_SCENARIOS: Record<'fat_loss' | 'hypertrophy' | 'recomposition', DemoScenario> = {
  fat_loss: {
    id: 'fat_loss',
    label: 'Reducción de Grasa Corporal',
    profileSummary: 'Ejemplo ilustrativo: Déficit energético moderado (-18%) priorizando saciedad y retención de masa muscular.',
    calorieExample: 1950,
    proteinExample: 155,
    carbsExample: 185,
    fatsExample: 62,
    splitName: '4 Días • Torso / Pierna + Caminata Inclinada Zona 2',
    weeklySchedule: [
      { day: 'Lunes', focus: 'Torso A (Énfasis Empuje & Tracción)', volume: '14 series efectivas', rir: 'RIR 2' },
      { day: 'Martes', focus: 'Pierna A (Dominante de Rodilla & Glúteo)', volume: '13 series efectivas', rir: 'RIR 2' },
      { day: 'Jueves', focus: 'Torso B (Hipertrofia & Estabilidad)', volume: '14 series efectivas', rir: 'RIR 1-2' },
      { day: 'Viernes', focus: 'Pierna B (Cadena Posterior & Core)', volume: '13 series efectivas', rir: 'RIR 1-2' },
    ],
    sampleMeals: [
      {
        time: '08:30 AM • Desayuno',
        title: 'Huevos revueltos con nopales asados y tortillas de maíz',
        items: ['2 huevos enteros + 120 g claras', '1 taza de nopales asados', '2 tortillas de maíz (60 g)', '1/3 pieza de aguacate Hass'],
        macros: '485 kcal • 36g P • 42g C • 18g G',
        substituteExample: 'Sustitución SMAE disponible: Cambiar tortillas por 45 g de avena en hojuelas o 2 rebanadas de pan integral.',
      },
      {
        time: '02:30 PM • Comida Principal',
        title: 'Pechuga de pollo a la plancha con arroz al vapor y ensalada',
        items: ['160 g pechuga cruda (≈120 g cocida)', '140 g arroz blanco cocido', '1 taza de calabacitas y pepino', '1 cdita de aceite de oliva'],
        macros: '610 kcal • 48g P • 64g C • 16g G',
        substituteExample: 'Sustitución SMAE disponible: Cambiar pechuga por 180 g de filete de tilapia o 140 g de bistec de res magro.',
      },
      {
        time: '08:30 PM • Cena',
        title: 'Fajitas de res magra con pimientos y queso panela asado',
        items: ['130 g bistec de res magro', '60 g queso panela', '1 taza de pimientos y cebolla asada', '1 paquete de tostadas horneadas'],
        macros: '515 kcal • 46g P • 38g C • 19g G',
        substituteExample: 'Sustitución SMAE disponible: Cambiar bistec por 1 lata de atún en agua drenado + 1/3 de aguacate.',
      },
    ],
    demoProgression: [
      { week: 'Sem 1', metricA: '82.0 kg', metricB: '88.0 cm cintura', loadExample: 'Sentadilla: 70 kg × 8' },
      { week: 'Sem 2', metricA: '81.4 kg', metricB: '87.2 cm cintura', loadExample: 'Sentadilla: 70 kg × 9' },
      { week: 'Sem 4', metricA: '80.3 kg', metricB: '85.8 cm cintura', loadExample: 'Sentadilla: 72.5 kg × 8' },
      { week: 'Sem 6', metricA: '79.2 kg', metricB: '84.5 cm cintura', loadExample: 'Sentadilla: 75 kg × 8' },
    ],
  },
  hypertrophy: {
    id: 'hypertrophy',
    label: 'Desarrollo Muscular (Hipertrofia)',
    profileSummary: 'Ejemplo ilustrativo: Superávit energético controlado (+10%) con sobrecarga progresiva por doble progresión.',
    calorieExample: 2680,
    proteinExample: 165,
    carbsExample: 345,
    fatsExample: 72,
    splitName: '5 Días • Push / Pull / Legs + Upper / Lower',
    weeklySchedule: [
      { day: 'Lunes', focus: 'Empuje (Pecho, Hombro Anterior/Lateral, Tríceps)', volume: '16 series efectivas', rir: 'RIR 1-2' },
      { day: 'Martes', focus: 'Tracción (Espalda Ancha, Densidad, Bíceps)', volume: '16 series efectivas', rir: 'RIR 1-2' },
      { day: 'Miércoles', focus: 'Pierna Completa (Cuádriceps, Isquios, Pantorrilla)', volume: '15 series efectivas', rir: 'RIR 2' },
      { day: 'Viernes', focus: 'Torso Hipertrofia (Puntos Prioritarios)', volume: '14 series efectivas', rir: 'RIR 1-2' },
      { day: 'Sábado', focus: 'Pierna & Cadena Posterior', volume: '14 series efectivas', rir: 'RIR 2' },
    ],
    sampleMeals: [
      {
        time: '08:00 AM • Desayuno Energético',
        title: 'Hot cakes de avena con proteína, plátano y crema de cacahuate',
        items: ['70 g avena en hojuelas', '1 medida de proteína de suero o 5 claras', '1 plátano tabasco mediano', '15 g crema de cacahuate natural'],
        macros: '685 kcal • 42g P • 88g C • 18g G',
        substituteExample: 'Sustitución SMAE disponible: Cambiar avena por 3 tortillas de maíz + 3 huevos con jamón de pavo.',
      },
      {
        time: '02:00 PM • Comida Principal',
        title: 'Milanesa de pollo asada con arroz rojo, frijoles y tortillas',
        items: ['180 g pechuga cruda (≈135 g cocida)', '180 g arroz cocido', '1/2 taza de frijoles de la olla', '2 tortillas de maíz + 1/3 aguacate'],
        macros: '840 kcal • 56g P • 108g C • 20g G',
        substituteExample: 'Sustitución SMAE disponible: Cambiar arroz y tortillas por 250 g de papa cocida al horno.',
      },
      {
        time: '06:30 PM • Pre/Post Entreno',
        title: 'Rice cakes con miel de abeja y batido de suero de leche',
        items: ['4 tortitas de arroz inflado (Rice cakes)', '1 cda de miel de abeja', '1 porción de proteína en agua o leche deslactosada'],
        macros: '390 kcal • 30g P • 62g C • 3g G',
        substituteExample: 'Sustitución SMAE disponible: Cambiar rice cakes por 1 bolillo sin migajón o 2 plátanos.',
      },
    ],
    demoProgression: [
      { week: 'Sem 1', metricA: '74.0 kg', metricB: '36.5 cm brazo', loadExample: 'Press Banca: 80 kg × 6' },
      { week: 'Sem 2', metricA: '74.4 kg', metricB: '36.8 cm brazo', loadExample: 'Press Banca: 80 kg × 8' },
      { week: 'Sem 4', metricA: '75.1 kg', metricB: '37.2 cm brazo', loadExample: 'Press Banca: 82.5 kg × 7' },
      { week: 'Sem 6', metricA: '75.8 kg', metricB: '37.6 cm brazo', loadExample: 'Press Banca: 85 kg × 7' },
    ],
  },
  recomposition: {
    id: 'recomposition',
    label: 'Recomposición y Glúteo / Pierna',
    profileSummary: 'Ejemplo ilustrativo: Calorías de mantenimiento con alta densidad proteica y frecuencia 3 en tren inferior.',
    calorieExample: 1820,
    proteinExample: 132,
    carbsExample: 198,
    fatsExample: 54,
    splitName: '4 Días • Especialización Tren Inferior & Estética Corporal',
    weeklySchedule: [
      { day: 'Lunes', focus: 'Glúteo & Isquiosurales (Hip Thrust & Bisagra)', volume: '15 series efectivas', rir: 'RIR 1-2' },
      { day: 'Martes', focus: 'Torso Estético (Espalda Alta, Hombro, Core)', volume: '13 series efectivas', rir: 'RIR 2' },
      { day: 'Jueves', focus: 'Cuádriceps & Glúteo Medio (Sentadilla & Búlgaras)', volume: '15 series efectivas', rir: 'RIR 1-2' },
      { day: 'Sábado', focus: 'Glúteo Bombeo Metabólico & Abdomen', volume: '14 series efectivas', rir: 'RIR 1' },
    ],
    sampleMeals: [
      {
        time: '08:30 AM • Desayuno',
        title: 'Omelette de claras con espinaca, queso panela y pan tostado',
        items: ['1 huevo entero + 140 g claras', '50 g queso panela', '2 rebanadas de pan integral tostado', '1 taza de fresas picadas'],
        macros: '445 kcal • 35g P • 46g C • 13g G',
        substituteExample: 'Sustitución SMAE disponible: Cambiar pan integral por 2 tortillas de maíz o 50 g de avena.',
      },
      {
        time: '02:30 PM • Comida Principal',
        title: 'Filete de tilapia al limón con quinoa/arroz y verduras al vapor',
        items: ['180 g filete de tilapia', '150 g arroz cocido', '1 taza de brócoli y zanahoria', '1/3 pieza de aguacate Hass'],
        macros: '560 kcal • 44g P • 58g C • 16g G',
        substituteExample: 'Sustitución SMAE disponible: Cambiar tilapia por 150 g de pechuga de pollo sin piel.',
      },
      {
        time: '08:30 PM • Cena',
        title: 'Tostadas horneadas de pollo deshebrado con pico de gallo',
        items: ['120 g pechuga de pollo cocida deshebrada', '2 paquetes de tostadas horneadas Saníssimo', 'Pico de gallo y lechuga libre', '1/4 aguacate'],
        macros: '460 kcal • 38g P • 44g C • 14g G',
        substituteExample: 'Sustitución SMAE disponible: Cambiar pollo por 130 g de queso cottage bajo en grasa o atún.',
      },
    ],
    demoProgression: [
      { week: 'Sem 1', metricA: '62.5 kg', metricB: '96.0 cm cadera / 71 cm cintura', loadExample: 'Hip Thrust: 90 kg × 8' },
      { week: 'Sem 2', metricA: '62.4 kg', metricB: '96.5 cm cadera / 70.4 cm cintura', loadExample: 'Hip Thrust: 90 kg × 10' },
      { week: 'Sem 4', metricA: '62.2 kg', metricB: '97.2 cm cadera / 69.5 cm cintura', loadExample: 'Hip Thrust: 100 kg × 8' },
      { week: 'Sem 6', metricA: '62.0 kg', metricB: '98.0 cm cadera / 68.8 cm cintura', loadExample: 'Hip Thrust: 105 kg × 9' },
    ],
  },
};

export default function HomePage() {
  const { currentUser, hasCompletedAssessment } = useAppState();

  // Variante de copy A/B/C para experimentación comercial controlada
  const [heroVariant, setHeroVariant] = useState<HeroCopyVariantId>('variant_a');

  // Estado de la Demostración Interactiva
  const [selectedDemoGoal, setSelectedDemoGoal] = useState<'fat_loss' | 'hypertrophy' | 'recomposition'>('hypertrophy');
  const [activeDemoTab, setActiveDemoTab] = useState<'training' | 'nutrition' | 'progress'>('training');

  // Estado del Recorrido "Cómo funciona" (4 etapas)
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Estado de Membresías en el Home
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  // Estado de Preguntas Frecuentes
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Progreso de scroll y visibilidad de barra móvil persistente
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showMobileStickyCta, setShowMobileStickyCta] = useState(false);

  // Parallax ligero vinculado al cursor en desktop
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const assigned = getAssignedHeroVariant();
    setHeroVariant(assigned);
    trackConversionEvent('landing_view', { variant: assigned });

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(Math.min(100, Math.round((scrollTop / docHeight) * 100)));
      setShowMobileStickyCta(scrollTop > 520);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVariantSwitch = (v: HeroCopyVariantId) => {
    setHeroVariant(v);
    setAssignedHeroVariant(v);
  };

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setCursorOffset({
      x: Number((relX * 14).toFixed(2)),
      y: Number((relY * 14).toFixed(2)),
    });
  };

  const handlePlanCheckout = async (plan: PlanConfig) => {
    trackConversionEvent('plan_selected', {
      plan_id: plan.id,
      billing_interval: billingInterval,
      price_mxn: billingInterval === 'yearly' ? plan.priceMxnYearly : plan.priceMxnMonthly,
      location: 'home_pricing_section',
    });

    if (plan.id === 'free') {
      window.location.href = '/evaluacion';
      return;
    }

    trackConversionEvent('checkout_started', {
      plan_id: plan.id,
      billing_interval: billingInterval,
    });

    setLoadingPlanId(plan.id);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          billingInterval,
          userId: currentUser?.id,
          userEmail: currentUser?.email,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.href = '/precios';
      }
    } catch {
      window.location.href = '/precios';
    } finally {
      setLoadingPlanId(null);
    }
  };

  const activeCopy = HERO_COPY_VARIANTS[heroVariant];
  const currentDemo = DEMO_SCENARIOS[selectedDemoGoal];

  const howItWorksSteps = [
    {
      number: '01',
      title: 'Completa tu evaluación',
      subtitle: 'Diagnóstico funcional y contexto personal',
      description:
        'Registra tus medidas antropométricas, objetivo físico, historial de salud (cuestionario preventivo PAR-Q+), días disponibles, lugar de entrenamiento y alimentos habituales.',
      deliverable: 'Resultado inmediato: Estimación de tasa metabólica basal (TMB), gasto energético diario (GET) y filtro de seguridad.',
      ctaText: 'Ir al cuestionario de evaluación',
      ctaHref: '/evaluacion',
    },
    {
      number: '02',
      title: 'Conoce tu planificación',
      subtitle: 'Estructura nutricional y programación de fuerza',
      description:
        'Consulta la distribución de macronutrientes por comida con ingredientes accesibles en México (SMAE) y revisa la división semanal de ejercicios acorde a tu experiencia.',
      deliverable: 'Resultado: Plan estructurado con porciones en gramos, equivalencias de cocción y series diferenciadas.',
      ctaText: 'Explorar demostración abajo',
      ctaHref: '#demostracion',
    },
    {
      number: '03',
      title: 'Entrena y registra tu alimentación',
      subtitle: 'Ejecución guiada en el gimnasio y en la cocina',
      description:
        'Utiliza el cronómetro de descanso integrado al registrar cada serie efectiva, consulta la técnica de cada ejercicio e intercambia alimentos equivalentes cuando lo requieras.',
      deliverable: 'Resultado: Adherencia práctica sin depender de hojas de cálculo ni documentos estáticos.',
      ctaText: 'Ver módulos incluidos',
      ctaHref: '#la-solucion',
    },
    {
      number: '04',
      title: 'Evalúa y ajusta tu progreso',
      subtitle: 'Seguimiento periódico basado en datos reales',
      description:
        'Registra tu evolución de peso, perímetros corporales y cargas levantadas. Cuando tu progreso lo requiera, ajusta tus calorías o volumen de entrenamiento con criterio.',
      deliverable: 'Resultado: Progresión continua y sostenible a mediano y largo plazo.',
      ctaText: 'Revisar membresías',
      ctaHref: '#membresias',
    },
  ];

  const faqs = [
    {
      q: '¿Necesito experiencia previa entrenando para utilizar la plataforma?',
      a: 'No. Durante la evaluación inicial indicas tus años o meses de experiencia. Si estás comenzando, el sistema selecciona ejercicios con curva de aprendizaje segura, volumen moderado, margen conservador de repeticiones en reserva (RIR 2 a 3) e instrucciones detalladas en español.',
    },
    {
      q: '¿Puedo utilizar la plataforma si entreno en casa o con equipo limitado?',
      a: 'Sí. En el cuestionario defines si entrenas en gimnasio comercial, en casa con mancuernas y bandas, o únicamente con tu peso corporal. La selección de ejercicios se adapta al equipamiento que tengas disponible.',
    },
    {
      q: '¿Los alimentos incluidos en los menús son fáciles de conseguir en México?',
      a: 'Sí. Toda la base alimentaria utiliza el Sistema Mexicano de Alimentos Equivalentes (SMAE). Los menús se construyen con ingredientes cotidianos como pechuga de pollo, huevo, tortillas de maíz, arroz, frijoles, avena, atún, tilapia, queso panela, nopales y aguacate.',
    },
    {
      q: '¿Qué sucede si tengo una lesión articular o alguna condición médica?',
      a: 'El paso 3 de la evaluación aplica el cuestionario preventivo PAR-Q+. Si reportas signos de alerta cardiovascular o una condición clínica que requiera atención especializada, el sistema detiene la generación automática y te indica acudir a valoración médica presencial antes de iniciar.',
    },
    {
      q: '¿Puedo cambiar un alimento si no lo tengo disponible o no me gusta?',
      a: 'Sí. En tus preferencias iniciales puedes excluir alimentos que no consumas (o activar filtros como intolerancia a la lactosa). Además, cada platillo cuenta con un motor de sustitución que recalcula los gramos exactos de otro alimento del mismo grupo para conservar tus calorías y proteínas.',
    },
    {
      q: '¿Qué incluye la versión gratuita y qué desbloquea cada membresía?',
      a: 'El Plan Básico ($0 MXN) te permite realizar la evaluación completa, conocer tu gasto energético, explorar la biblioteca de ejercicios y visualizar el Día 1 de tu menú. El Plan Atleta Pro desbloquea los 7 días de menú, el intercambiador de alimentos, la lista de compras, el registro de sobrecarga progresiva y la descarga en PDF. El Plan con Coach añade revisión humana de videos y ajustes mensuales por especialistas.',
    },
    {
      q: '¿Puedo cancelar mi suscripción en cualquier momento?',
      a: 'Sí. Los pagos se procesan mediante Stripe sin plazos forzosos. Puedes cancelar la renovación automática desde tu perfil en cualquier momento y conservarás el acceso hasta concluir el periodo pagado.',
    },
    {
      q: '¿Cómo se protegen mis datos personales y de salud?',
      a: 'Tus datos se procesan bajo consentimiento explícito conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) en México. La información clínica no se comparte con redes publicitarias.',
    },
  ];

  return (
    <div className="relative bg-[#08080B] text-zinc-100 selection:bg-motive-red selection:text-white overflow-x-hidden">
      {/* Barra superior de progreso de lectura / scroll */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-motive-red via-motive-redBright to-amber-500 z-[60] transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* =========================================================================
          SECCIÓN A: HERO CINEMATOGRÁFICO DE ALTO IMPACTO (COMPOSICIÓN EDITORIAL ASIMÉTRICA)
          ========================================================================= */}
      <section
        onMouseMove={handleHeroMouseMove}
        className="relative min-h-[calc(100vh-68px)] flex items-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 overflow-hidden"
      >
        {/* Iluminación cinematográfica controlada */}
        <div
          aria-hidden="true"
          className="absolute -top-28 -left-28 w-[520px] h-[520px] rounded-full bg-motive-red/12 blur-[140px] pointer-events-none animate-ambient-glow"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-1/4 w-[440px] h-[440px] rounded-full bg-orange-600/8 blur-[150px] pointer-events-none"
        />

        {/* Líneas técnicas arquitectónicas discretas */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_35%,#000_65%,transparent_100%)] pointer-events-none"
        />

        <div className="relative w-full max-w-[1380px] mx-auto z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* COLUMNA IZQUIERDA (7 cols): Narrativa Editorial, Propuesta de Valor y CTAs */}
            <div className="lg:col-span-7 space-y-7 text-left">
              {/* Eyebrow + Selector discreto de variantes de copy A/B */}
              <div className="animate-reveal-1 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-motive-redBright" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-200">
                    {activeCopy.eyebrow}
                  </span>
                </div>

                {/* Conmutador de pruebas A/B de copywriting */}
                <div
                  className="inline-flex items-center space-x-1 bg-zinc-900/60 border border-zinc-800/80 rounded-full p-0.5 text-[10px]"
                  title="Variantes de copywriting para pruebas A/B"
                >
                  {(['variant_a', 'variant_b', 'variant_c'] as HeroCopyVariantId[]).map((v, idx) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleVariantSwitch(v)}
                      className={`px-2 py-0.5 rounded-full font-bold uppercase transition-colors ${
                        heroVariant === v
                          ? 'bg-motive-red text-white'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Copy {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Titular Monumental Escalonado */}
              <div className="space-y-2">
                <h1 className="animate-reveal-2 font-display font-black tracking-tight text-white uppercase text-4xl sm:text-5xl md:text-6xl xl:text-[4.15rem] leading-[0.96]">
                  <span className="block">{activeCopy.headlineTop}</span>
                  <span className="block mt-1.5 text-transparent bg-clip-text bg-gradient-to-r from-motive-redBright via-motive-red to-orange-500">
                    {activeCopy.headlineAccent}
                  </span>
                </h1>
              </div>

              {/* Subtítulo Claro y Honesto */}
              <p className="animate-reveal-3 max-w-xl text-base sm:text-lg text-zinc-300 font-normal leading-relaxed">
                {activeCopy.subtitle}
              </p>

              {/* Bloque de CTAs (Jerarquía Primaria y Secundaria) */}
              <div className="animate-reveal-4 pt-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
                  <Link
                    href="/evaluacion"
                    onClick={() =>
                      trackConversionEvent('hero_cta_click', {
                        cta: 'primary_evaluation',
                        variant: heroVariant,
                      })
                    }
                    className="group inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-motive-red to-motive-redDark hover:from-motive-redBright hover:to-motive-red text-white font-display font-black text-xs sm:text-sm uppercase tracking-[0.14em] shadow-2xl shadow-motive-red/35 hover:shadow-motive-red/55 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    <span>{activeCopy.primaryCta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href="#membresias"
                    onClick={() =>
                      trackConversionEvent('hero_cta_click', {
                        cta: 'secondary_memberships',
                        variant: heroVariant,
                      })
                    }
                    className="inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-zinc-200 font-display font-bold text-xs sm:text-sm uppercase tracking-[0.12em] hover:bg-zinc-800/80 hover:border-zinc-700 hover:text-white transition-all"
                  >
                    <span>{activeCopy.secondaryCta}</span>
                  </a>
                </div>

                <p className="text-xs text-zinc-400 flex items-center space-x-2 pl-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-motive-emerald flex-shrink-0" />
                  <span>
                    {activeCopy.primaryCtaAux}{' '}
                    <strong className="text-zinc-200 font-semibold">
                      Sin costo inicial ni tarjeta requerida para conocer tu diagnóstico base.
                    </strong>
                  </span>
                </p>
              </div>

              {/* Indicadores Reales de Credibilidad Metodológica */}
              <div className="animate-reveal-5 pt-6 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Apple className="w-4 h-4 text-motive-redBright flex-shrink-0" />
                    <span className="text-xs font-display font-black uppercase tracking-wider text-white">
                      Nutrición SMAE México
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Porciones calculadas con alimentos cotidianos, factor de cocción e intercambios equivalentes.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="w-4 h-4 text-motive-redBright flex-shrink-0" />
                    <span className="text-xs font-display font-black uppercase tracking-wider text-white">
                      Progresión por RIR
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Series de aproximación y series efectivas diferenciadas con control de esfuerzo.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-motive-emerald flex-shrink-0" />
                    <span className="text-xs font-display font-black uppercase tracking-wider text-white">
                      Filtro Preventivo PAR-Q+
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Tamizaje de salud inicial para detectar signos que requieran supervisión médica.
                  </p>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA (5 cols): Composición Editorial Atlética + Telemetría del Producto Real */}
            <div className="lg:col-span-5 relative animate-mask-reveal">
              <div
                style={{
                  transform: `translate3d(${cursorOffset.x * 0.5}px, ${cursorOffset.y * 0.5}px, 0)`,
                }}
                className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-[#0E0E13] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] transition-transform duration-300 ease-out"
              >
                {/* Imagen Atlética de Estudio de Alto Contraste */}
                <div className="relative h-[440px] sm:h-[500px] w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1100&q=85"
                    alt="Atleta ejecutando entrenamiento de fuerza estructurado en MOTIVE LAB"
                    className="w-full h-full object-cover object-center brightness-[0.68] contrast-[1.15] scale-[1.02]"
                  />
                  {/* Gradiente cinematográfico de lectura */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080B] via-[#08080B]/35 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#08080B]/55 via-transparent to-transparent" />

                  {/* Retícula Biomecánica Minimalista SVG */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 400 500"
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
                  >
                    <line x1="40" y1="80" x2="360" y2="80" stroke="#EF4444" strokeWidth="0.6" strokeDasharray="4 4" />
                    <line x1="290" y1="60" x2="290" y2="360" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="3 5" />
                    <circle cx="290" cy="175" r="22" fill="none" stroke="#EF4444" strokeWidth="1" />
                    <circle cx="290" cy="175" r="3" fill="#EF4444" />
                    <path
                      d="M 220 260 L 290 175 L 330 245"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                  </svg>

                  {/* Etiqueta Superior de Telemetría */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-[#0A0A0E]/90 backdrop-blur-md border border-zinc-800 flex items-center space-x-2">
                      <Activity className="w-3.5 h-3.5 text-motive-redBright" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-200">
                        PROGRAMACIÓN BASADA EN DATOS
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
                      VISTA DEL SISTEMA
                    </span>
                  </div>

                  {/* Tarjeta Flotante de Producto Real (Inferior) */}
                  <div className="absolute bottom-4 left-4 right-4 space-y-2.5">
                    {/* Mini-vista de prescripción de fuerza */}
                    <div className="p-4 rounded-2xl bg-[#0C0C11]/95 backdrop-blur-md border border-zinc-800/90 shadow-2xl space-y-2.5">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-motive-redBright block">
                            Control de Sobrecarga Progresiva
                          </span>
                          <p className="text-xs font-display font-bold text-white uppercase">
                            Sentadilla Trasera • Serie Efectiva #3
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-[10px] font-mono font-bold text-zinc-200">
                          Rango: 6–8 reps • RIR 2
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800/80">
                          <span className="text-[9px] uppercase text-zinc-400 block">Gasto Calculado</span>
                          <strong className="text-white font-mono">2,450 kcal</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800/80">
                          <span className="text-[9px] uppercase text-zinc-400 block">Proteína Diaria</span>
                          <strong className="text-emerald-400 font-mono">160g (2.0g/kg)</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800/80">
                          <span className="text-[9px] uppercase text-zinc-400 block">Menú SMAE</span>
                          <strong className="text-amber-400 font-mono">4 Comidas / día</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN B: EL PROBLEMA — IDENTIFICACIÓN EMPÁTICA
          ========================================================================= */}
      <section
        id="el-problema"
        className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto border-b border-zinc-900"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-motive-redBright block">
              01 / El Diagnóstico del Problema
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight leading-[1.02]">
              DEJA DE ENTRENAR SIN DIRECCIÓN.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              La mayoría de las personas no fracasan por falta de disciplina. Se estancan porque intentan sostener rutinas y planes de alimentación que fueron diseñados sin considerar su contexto, sus horarios ni su punto de partida.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-5">
            {[
              {
                num: '01',
                title: 'Rutinas que no consideran tu nivel ni tu equipo',
                desc: 'Seguir programas genéricos o copiados de atletas avanzados sin ajustar el volumen semanal, el esfuerzo (RIR) o las herramientas disponibles en tu gimnasio o casa suele derivar en fatiga acumulada, molestias articulares y abandono.',
                tag: 'Desajuste de programación',
              },
              {
                num: '02',
                title: 'Alimentación difícil de sostener en la vida cotidiana',
                desc: 'Los menús rígidos con ingredientes costosos o ajenos a la gastronomía en México se vuelven insostenibles a los pocos días. Cuando no sabes cómo intercambiar un alimento manteniendo tus porciones, cualquier imprevisto rompe tu planificación.',
                tag: 'Fricción nutricional',
              },
              {
                num: '03',
                title: 'Falta de seguimiento y criterio de progresión',
                desc: 'Entrenar sin distinguir entre series de calentamiento y series efectivas, o sin llevar un registro claro de tus cargas y medidas corporales, impide saber con certeza cuándo subir peso o cuándo ajustar tu ingesta energética.',
                tag: 'Ausencia de métricas',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="group bg-[#0E0E13] border border-zinc-800/90 hover:border-zinc-700 rounded-3xl p-6 sm:p-8 transition-all flex flex-col sm:flex-row items-start gap-5"
              >
                <span className="font-mono font-black text-2xl text-motive-redBright bg-motive-red/10 border border-motive-red/25 px-3.5 py-2 rounded-2xl flex-shrink-0">
                  {item.num}
                </span>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                    {item.tag}
                  </span>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN C: LA SOLUCIÓN — DIFERENCIACIÓN CON VISTAS REALES DEL PRODUCTO
          ========================================================================= */}
      <section
        id="la-solucion"
        className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto border-b border-zinc-900 space-y-14"
      >
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-motive-redBright block">
            02 / Arquitectura de la Plataforma
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight leading-[1.02]">
            UN SISTEMA. TU OBJETIVO. TU PROGRESO.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Integramos los tres pilares del progreso físico en una sola plataforma interactiva, eliminando hojas de cálculo dispersas y documentos estáticos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {/* PILAR 1: NUTRICIÓN */}
          <div className="bg-[#0E0E13] border border-zinc-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-motive-red/15 border border-motive-red/30 text-[11px] font-bold uppercase tracking-wider text-motive-redBright">
                  Pilar 01 • Nutrición
                </span>
                <Apple className="w-5 h-5 text-motive-redBright" />
              </div>
              <h3 className="text-xl font-display font-black text-white uppercase">
                Menús con Ingredientes de México y Equivalencias
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Planificación estructurada de 3 a 6 comidas diarias según tu preferencia. Contempla conversión entre peso crudo y cocido, lista de compras semanal e intercambio inmediato de alimentos equivalentes.
              </p>
            </div>

            {/* Vista Real del Módulo de Nutrición */}
            <div className="bg-[#09090D] border border-zinc-800/90 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-bold text-white">Comida 2 • Plato Principal</span>
                <span className="text-[11px] font-mono text-motive-redBright font-bold">620 kcal • 46g P</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-300">Pechuga de pollo (150g crudo ➔ 115g cocido)</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">Sustituir ⇄</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-300">Arroz al vapor (140g) + Tortilla de maíz (2 pzas)</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">Sustituir ⇄</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-300">Aguacate Hass (60g) + Nopales asados</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">Sustituir ⇄</span>
                </div>
              </div>
            </div>
          </div>

          {/* PILAR 2: ENTRENAMIENTO */}
          <div className="bg-[#0E0E13] border border-zinc-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-motive-red/15 border border-motive-red/30 text-[11px] font-bold uppercase tracking-wider text-motive-redBright">
                  Pilar 02 • Entrenamiento
                </span>
                <Dumbbell className="w-5 h-5 text-motive-redBright" />
              </div>
              <h3 className="text-xl font-display font-black text-white uppercase">
                Ejercicios Guiados y Doble Progresión
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Sesiones adaptadas de 3 a 6 días por semana, con especialización según objetivo y sexo, distinción entre series de aproximación y efectivas, cronómetro de descanso y protocolos de abdomen y cardio Zona 2.
              </p>
            </div>

            {/* Vista Real del Módulo de Entrenamiento */}
            <div className="bg-[#09090D] border border-zinc-800/90 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-bold text-white">Press Inclinado con Mancuernas</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Cronómetro: 120s</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Serie 1 (Aproximación)</span>
                  <span className="font-mono">20 kg × 10 • RIR 4</span>
                </div>
                <div className="flex items-center justify-between text-white font-semibold bg-motive-red/10 border-l-2 border-motive-redBright pl-2 py-1 rounded-r">
                  <span>Serie 2 (Efectiva)</span>
                  <span className="font-mono">30 kg × 8 • RIR 2 ✓</span>
                </div>
                <div className="flex items-center justify-between text-white font-semibold bg-motive-red/10 border-l-2 border-motive-redBright pl-2 py-1 rounded-r">
                  <span>Serie 3 (Efectiva)</span>
                  <span className="font-mono">30 kg × 8 • RIR 1 ✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* PILAR 3: SEGUIMIENTO */}
          <div className="bg-[#0E0E13] border border-zinc-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-motive-red/15 border border-motive-red/30 text-[11px] font-bold uppercase tracking-wider text-motive-redBright">
                  Pilar 03 • Seguimiento
                </span>
                <TrendingUp className="w-5 h-5 text-motive-redBright" />
              </div>
              <h3 className="text-xl font-display font-black text-white uppercase">
                Métricas, Registro y Ajustes Periódicos
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Monitoreo semanal de peso corporal y perímetros (cintura, cadera, brazo y pierna), compensador para comidas libres o eventos sociales y ajustes calóricos cuando tu evolución lo demanda.
              </p>
            </div>

            {/* Vista Real del Módulo de Seguimiento */}
            <div className="bg-[#09090D] border border-zinc-800/90 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-bold text-white">Check-in Corporal • 4 Semanas</span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">Adherencia: 94%</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 uppercase block">Cintura</span>
                  <strong className="text-emerald-400">-1.8 cm</strong>
                </div>
                <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 uppercase block">Cargas</span>
                  <strong className="text-white">+5.0 kg</strong>
                </div>
                <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 uppercase block">Ajuste</span>
                  <strong className="text-amber-400">Activo</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN D: DEMOSTRACIÓN INTERACTIVA DEL SISTEMA
          ========================================================================= */}
      <section
        id="demostracion"
        className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto border-b border-zinc-900 space-y-10"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulador Interactivo • Datos Ilustrativos de Demostración</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
              EXPLORA LA ESTRUCTURA POR DENTRO
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Selecciona un objetivo de ejemplo para observar cómo se organiza la programación semanal, el menú de equivalentes y el registro de evolución.{' '}
              <span className="text-zinc-300 font-medium">
                (Esta vista utiliza datos ficticios de muestra; tu plan personal se genera tras completar tu evaluación).
              </span>
            </p>
          </div>

          {/* Selector de Escenario / Objetivo */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'fat_loss', label: '1. Pérdida de Grasa' },
                { id: 'hypertrophy', label: '2. Hipertrofia Muscular' },
                { id: 'recomposition', label: '3. Recomposición & Glúteo' },
              ] as const
            ).map((goalBtn) => (
              <button
                key={goalBtn.id}
                type="button"
                onClick={() => setSelectedDemoGoal(goalBtn.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all border ${
                  selectedDemoGoal === goalBtn.id
                    ? 'bg-motive-red text-white border-motive-redBright shadow-lg shadow-motive-red/25'
                    : 'bg-[#0E0E13] border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {goalBtn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Panel Interactivo de Demostración */}
        <div className="bg-[#0C0C11] border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
          {/* Cabecera del Escenario */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-800 text-zinc-300">
                  ESCENARIO DE EJEMPLO
                </span>
                <span className="text-xs font-bold text-motive-redBright uppercase">
                  {currentDemo.label}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300">{currentDemo.profileSummary}</p>
            </div>

            {/* Pestañas de vista dentro de la demostración */}
            <div className="flex items-center space-x-1.5 bg-zinc-900/90 border border-zinc-800 p-1 rounded-2xl self-start lg:self-auto">
              {[
                { id: 'training' as const, label: 'Distribución de Entrenamiento' },
                { id: 'nutrition' as const, label: 'Menú Ilustrativo SMAE' },
                { id: 'progress' as const, label: 'Gráfica de Evolución' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveDemoTab(t.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeDemoTab === t.id
                      ? 'bg-zinc-800 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resumen energético ilustrativo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Meta Energética (Ejemplo)
              </span>
              <strong className="text-xl font-display font-black text-white">
                {currentDemo.calorieExample} kcal
              </strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Proteína Diaria
              </span>
              <strong className="text-xl font-display font-black text-motive-redBright">
                {currentDemo.proteinExample} g
              </strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Carbohidratos
              </span>
              <strong className="text-xl font-display font-black text-cyan-400">
                {currentDemo.carbsExample} g
              </strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Lípidos / Grasas
              </span>
              <strong className="text-xl font-display font-black text-amber-400">
                {currentDemo.fatsExample} g
              </strong>
            </div>
          </div>

          {/* Contenido Dinámico de la Pestaña Seleccionada */}
          {activeDemoTab === 'training' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>
                  Estructura sugerida en este ejemplo:{' '}
                  <strong className="text-white">{currentDemo.splitName}</strong>
                </span>
                <span className="hidden sm:inline font-mono text-[11px] text-zinc-500">
                  Volumen regulado por proximidad al fallo (RIR)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {currentDemo.weeklySchedule.map((sess, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#111118] border border-zinc-800 space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase text-motive-redBright block">
                        {sess.day}
                      </span>
                      <h4 className="text-sm font-display font-bold text-white leading-snug">
                        {sess.focus}
                      </h4>
                    </div>
                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                      <span>{sess.volume}</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-200 font-mono font-bold">
                        {sess.rir}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeDemoTab === 'nutrition' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentDemo.sampleMeals.map((meal, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#111118] border border-zinc-800 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-motive-redBright">
                        {meal.time}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">{meal.macros}</span>
                    </div>
                    <h4 className="text-sm font-display font-bold text-white">{meal.title}</h4>
                    <ul className="space-y-1 text-xs text-zinc-300">
                      {meal.items.map((it, i) => (
                        <li key={i}>• {it}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400 flex items-start space-x-2">
                    <RotateCw className="w-3.5 h-3.5 text-motive-redBright flex-shrink-0 mt-0.5" />
                    <span>{meal.substituteExample}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeDemoTab === 'progress' && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {currentDemo.demoProgression.map((point, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#111118] border border-zinc-800 space-y-2"
                >
                  <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 block">
                    {point.week} (Demostración)
                  </span>
                  <p className="text-lg font-display font-black text-white">{point.metricA}</p>
                  <p className="text-xs text-emerald-400 font-semibold">{point.metricB}</p>
                  <p className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-800 font-mono">
                    {point.loadExample}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Pie de la Demostración con enlace directo a la Evaluación */}
          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-zinc-400">
              ¿Quieres conocer tus propios requerimientos calóricos y la distribución para tu horario?
            </p>
            <Link
              href="/evaluacion"
              onClick={() =>
                trackConversionEvent('hero_cta_click', {
                  cta: 'demo_section_evaluation',
                  demo_goal: selectedDemoGoal,
                })
              }
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-motive-red hover:bg-motive-redDark text-white text-xs font-display font-bold uppercase tracking-wider transition-colors"
            >
              <span>Calcular mi propio plan en la evaluación</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN E: CÓMO FUNCIONA — RECORRIDO INTERACTIVO DE 4 ETAPAS
          ========================================================================= */}
      <section
        id="como-funciona"
        className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto border-b border-zinc-900 space-y-12"
      >
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-motive-redBright block">
            03 / Proceso Paso a Paso
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            CÓMO FUNCIONA MOTIVE LAB
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Un flujo estructurado en cuatro etapas para pasar de la incertidumbre a una planificación clara y medible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Selector de etapas */}
          <div className="lg:col-span-5 space-y-3">
            {howItWorksSteps.map((st, idx) => {
              const isSelected = activeStepIndex === idx;
              return (
                <button
                  key={st.number}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-start space-x-4 ${
                    isSelected
                      ? 'bg-[#12121A] border-motive-red shadow-xl shadow-motive-red/10'
                      : 'bg-[#0C0C11] border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <span
                    className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg ${
                      isSelected
                        ? 'bg-motive-red text-white'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}
                  >
                    {st.number}
                  </span>
                  <div>
                    <h3 className="text-base font-display font-bold text-white uppercase">
                      {st.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{st.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detalle de la etapa activa */}
          <div className="lg:col-span-7 bg-[#0E0E13] border border-zinc-800 rounded-3xl p-7 sm:p-10 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-motive-redBright">
                ETAPA {howItWorksSteps[activeStepIndex].number} DE 04
              </span>
              <span className="text-xs text-zinc-400">
                {howItWorksSteps[activeStepIndex].subtitle}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase">
              {howItWorksSteps[activeStepIndex].title}
            </h3>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {howItWorksSteps[activeStepIndex].description}
            </p>

            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs sm:text-sm text-zinc-200 flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-motive-emerald flex-shrink-0 mt-0.5" />
              <span>{howItWorksSteps[activeStepIndex].deliverable}</span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href={howItWorksSteps[activeStepIndex].ctaHref}
                className="inline-flex items-center space-x-2 text-xs font-display font-bold uppercase tracking-wider text-motive-redBright hover:text-white transition-colors"
              >
                <span>{howItWorksSteps[activeStepIndex].ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center space-x-2">
                {howItWorksSteps.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Ir a etapa ${idx + 1}`}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      activeStepIndex === idx ? 'w-7 bg-motive-redBright' : 'w-2 bg-zinc-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN F: CREDIBILIDAD CIENTÍFICA Y METODOLOGÍA
          ========================================================================= */}
      <section
        id="metodologia"
        className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto border-b border-zinc-900 space-y-12"
      >
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-motive-redBright block">
            04 / Fundamentación Metodológica
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            CRITERIO TÉCNICO VERIFICABLE
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            La plataforma aplica literatura publicada en ciencias del ejercicio y nutrición deportiva para estructurar cada cálculo de manera transparente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0E0E13] border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-3">
            <HeartPulse className="w-6 h-6 text-motive-redBright" />
            <h3 className="text-lg font-display font-bold text-white uppercase">
              Estimación Energética y Macronutrientes
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Calculamos la tasa metabólica basal mediante las ecuaciones predictivas de <strong>Mifflin-St Jeor</strong> (población general) o <strong>Katch-McArdle</strong> (cuando se conoce el porcentaje de grasa corporal), ajustando la ingesta proteica en rangos de 1.6 a 2.2 g/kg según el objetivo.
            </p>
          </div>

          <div className="bg-[#0E0E13] border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-3">
            <Apple className="w-6 h-6 text-motive-redBright" />
            <h3 className="text-lg font-display font-bold text-white uppercase">
              Equivalencia Alimentaria en México
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Utilizamos las tablas de composición y porciones del <strong>Sistema Mexicano de Alimentos Equivalentes (SMAE)</strong> para facilitar intercambios isocalóricos entre alimentos del mismo grupo sin alterar el balance diario de proteínas, carbohidratos y lípidos.
            </p>
          </div>

          <div className="bg-[#0E0E13] border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-3">
            <Dumbbell className="w-6 h-6 text-motive-redBright" />
            <h3 className="text-lg font-display font-bold text-white uppercase">
              Programación de Fuerza y Autorregulación
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Las rutinas organizan el volumen semanal en series efectivas cercanas al fallo muscular controlado (<strong>RIR 1 a 3</strong>) y aplican el modelo de doble progresión: primero alcanzar el límite superior del rango de repeticiones prescrito y posteriormente incrementar la carga.
            </p>
          </div>
        </div>

        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Nota de transparencia institucional: Las referencias a literatura científica, ecuaciones metabólicas, cuestionario PAR-Q+ y tablas del SMAE describen los fundamentos técnicos empleados en los algoritmos de la plataforma y no implican patrocinio ni aval comercial por parte de organismos externos.
        </p>
      </section>

      {/* =========================================================================
          SECCIÓN G: RESULTADOS, TRAZABILIDAD Y EXPERIENCIA DE USUARIO
          ========================================================================= */}
      <section
        id="resultados"
        className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto border-b border-zinc-900 space-y-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-motive-redBright block">
              05 / Transparencia y Seguimiento Real
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
              TRAZABILIDAD EN CADA CÁLCULO Y REGISTRO
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              En lugar de promesas irreales o fórmulas ocultas, cada usuario tiene acceso al desglose matemático de su plan y a las herramientas para documentar su evolución semana tras semana.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-[#0E0E13] border border-zinc-800 rounded-3xl p-6 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase">
                <FileText className="w-4 h-4" />
                <span>Auditoría Matemática Abierta</span>
              </div>
              <h3 className="text-base font-display font-bold text-white">
                Sabes exactamente de dónde salen tus números
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dentro de tu panel puedes consultar la ecuación exacta empleada para tu tasa metabólica, el factor de actividad física aplicado y la suma gramo por gramo de cada comida del día.
              </p>
            </div>

            <div className="bg-[#0E0E13] border border-zinc-800 rounded-3xl p-6 space-y-3">
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase">
                <Compass className="w-4 h-4" />
                <span>Adaptado a Imprevistos Reales</span>
              </div>
              <h3 className="text-base font-display font-bold text-white">
                Compensación de eventos sociales y sustituciones
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Incluye herramientas prácticas para ajustar el resto de tus comidas cuando asistes a un restaurante o reunión social, favoreciendo la constancia a largo plazo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN H: MEMBRESÍAS — CONVERSIÓN DE PAGO TRANSPARENTE
          ========================================================================= */}
      <section
        id="membresias"
        className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto border-b border-zinc-900 space-y-12"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-motive-redBright block">
              06 / Planes y Membresías
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
              ELIGE EL NIVEL DE HERRAMIENTAS PARA TU PROCESO
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Comienza con tu evaluación inicial sin costo o activa la plataforma completa para gestionar tu nutrición de 7 días, entrenamientos y seguimiento.
            </p>
          </div>

          {/* Toggle Mensual / Anual sincronizado con la configuración comercial */}
          <div className="bg-[#0E0E13] border border-zinc-800 p-1.5 rounded-2xl inline-flex items-center space-x-2 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setBillingInterval('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                billingInterval === 'monthly'
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Facturación Mensual
            </button>
            <button
              type="button"
              onClick={() => setBillingInterval('yearly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                billingInterval === 'yearly'
                  ? 'bg-motive-red text-white shadow-lg shadow-motive-red/25'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Facturación Anual</span>
              <span className="text-[10px] bg-white text-motive-red px-1.5 py-0.2 rounded-full font-black uppercase">
                Ahorro Anual
              </span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Membresía Conectadas a SUBSCRIPTION_PLANS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isRecommended = plan.id === 'pro';
            const price = billingInterval === 'yearly' ? plan.priceMxnYearly : plan.priceMxnMonthly;
            const monthlyEquivalent =
              billingInterval === 'yearly' && plan.priceMxnYearly > 0
                ? Math.round(plan.priceMxnYearly / 12)
                : price;

            const audienceByPlan: Record<string, string> = {
              free: 'Adecuado para conocer tus requerimientos energéticos iniciales y explorar el funcionamiento del sistema.',
              pro: 'Adecuado para usuarios que desean la planificación semanal completa de nutrición, entrenamiento y seguimiento autónomo.',
              coach: 'Adecuado para atletas que requieren supervisión humana directa, revisión de técnica en video y ajustes personalizados.',
            };

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
                  isRecommended
                    ? 'bg-gradient-to-b from-[#14141D] to-[#0E0E14] border-2 border-motive-red shadow-2xl shadow-motive-red/15'
                    : 'bg-[#0E0E13] border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-3.5 left-6">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-motive-red text-white shadow-lg">
                      SISTEMA COMPLETO RECOMENDADO
                    </span>
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <h3 className="text-xl font-display font-black text-white uppercase">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                      {audienceByPlan[plan.id] || plan.description}
                    </p>
                  </div>

                  {/* Precio real desde la configuración comercial */}
                  <div className="border-y border-zinc-800 py-4">
                    {plan.priceMxnMonthly === 0 ? (
                      <div>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-3xl sm:text-4xl font-display font-black text-white">
                            $0
                          </span>
                          <span className="text-xs text-zinc-400 font-semibold">MXN / acceso inicial</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          Sin tarjeta de crédito ni cargos automáticos.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-sm font-bold text-zinc-400">$</span>
                          <span className="text-3xl sm:text-4xl font-display font-black text-white">
                            {monthlyEquivalent}
                          </span>
                          <span className="text-xs text-zinc-400 font-semibold">MXN / mes</span>
                        </div>
                        {billingInterval === 'yearly' ? (
                          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">
                            Cobro anual único de ${price} MXN. Renovación anual cancelable en cualquier momento.
                          </p>
                        ) : (
                          <p className="text-[11px] text-zinc-500 mt-1">
                            Renovación mensual automática. Cancela en cualquier momento desde tu cuenta.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Prestaciones reales */}
                  <div className="space-y-2.5">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Prestaciones incluidas:
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start space-x-2.5">
                          <Check className="w-4 h-4 text-motive-redBright flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-7">
                  <button
                    type="button"
                    onClick={() => handlePlanCheckout(plan)}
                    disabled={loadingPlanId === plan.id}
                    className={`w-full py-3.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                      isRecommended
                        ? 'bg-gradient-to-r from-motive-red to-motive-redDark hover:from-motive-redBright hover:to-motive-red text-white shadow-lg shadow-motive-red/25'
                        : 'bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white hover:border-zinc-500'
                    }`}
                  >
                    <span>
                      {loadingPlanId === plan.id
                        ? 'Abriendo pasarela segura...'
                        : plan.priceMxnMonthly === 0
                        ? 'Iniciar Evaluación Gratuita'
                        : `Seleccionar ${plan.name}`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Claridad Comercial y Seguridad de Pagos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-zinc-400">
          <div className="p-4 rounded-2xl bg-[#0E0E13] border border-zinc-800/80 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-motive-emerald flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Evaluación Inicial Sin Costo</strong>
              <span>Conoce tu estimación metabólica y diagnóstico base antes de decidir si deseas adquirir una membresía.</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0E0E13] border border-zinc-800/80 flex items-start space-x-3">
            <CreditCard className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Pasarela Cifrada con Stripe</strong>
              <span>Pagos procesados en pesos mexicanos (MXN) con tarjetas de débito y crédito Visa, Mastercard y AMEX.</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0E0E13] border border-zinc-800/80 flex items-start space-x-3">
            <Lock className="w-5 h-5 text-motive-redBright flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Cancelación Sin Plazos Forzosos</strong>
              <span>Gestiona o cancela la renovación de tu suscripción en cualquier momento desde tu panel de usuario.</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN I: PREGUNTAS FRECUENTES (RESOLUCIÓN DE OBJECIONES)
          ========================================================================= */}
      <section
        id="faq"
        className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-b border-zinc-900 space-y-10"
      >
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-motive-redBright block">
            07 / Preguntas Frecuentes
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            INFORMACIÓN CLARA ANTES DE EMPEZAR
          </h2>
          <p className="text-zinc-400 text-sm">
            Respuestas directas sobre el funcionamiento técnico y comercial de la plataforma.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#0E0E13] border border-zinc-800 rounded-2xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-white hover:text-motive-redBright transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-motive-redBright flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-400 flex-shrink-0 ml-4" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN J: CIERRE DE CONVERSIÓN
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-motive-red/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center space-y-7">
          <div className="w-14 h-14 rounded-2xl bg-motive-red/15 border border-motive-red/35 text-motive-redBright flex items-center justify-center mx-auto shadow-xl shadow-motive-red/20">
            <Flame className="w-7 h-7" />
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tight leading-[0.98]">
            TU SIGUIENTE ETAPA{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-motive-redBright to-orange-400">
              EMPIEZA CON UN PLAN.
            </span>
          </h2>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-300 leading-relaxed">
            Completa tu evaluación inicial para conocer tus requerimientos energéticos y estructurar tu alimentación y entrenamiento con criterio.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/evaluacion"
              onClick={() =>
                trackConversionEvent('hero_cta_click', {
                  cta: 'footer_closing_evaluation',
                  variant: heroVariant,
                })
              }
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-10 py-4.5 rounded-2xl bg-gradient-to-r from-motive-red to-motive-redDark hover:from-motive-redBright hover:to-motive-red text-white font-display font-black text-sm sm:text-base uppercase tracking-[0.14em] shadow-2xl shadow-motive-red/40 hover:-translate-y-0.5 transition-all"
            >
              <span>COMENZAR MI EVALUACIÓN</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            {hasCompletedAssessment && (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4.5 rounded-2xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-display font-bold text-xs sm:text-sm uppercase tracking-wider hover:text-white"
              >
                <span>Abrir mi Panel Activo</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Barra Móvil Persistente de Acceso Rápido (Solo visible al hacer scroll en móvil) */}
      {showMobileStickyCta && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0E]/95 backdrop-blur-xl border-t border-zinc-800 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-motive-redBright">
              Evaluación Inicial
            </p>
            <p className="text-xs font-bold text-white truncate">
              Calcula tu plan personalizado
            </p>
          </div>
          <Link
            href="/evaluacion"
            onClick={() =>
              trackConversionEvent('hero_cta_click', {
                cta: 'mobile_sticky_evaluation',
              })
            }
            className="px-4 py-2.5 rounded-xl bg-motive-red text-white text-xs font-display font-bold uppercase tracking-wider flex items-center space-x-1.5 flex-shrink-0 shadow-lg shadow-motive-red/30"
          >
            <span>Descubre tu plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

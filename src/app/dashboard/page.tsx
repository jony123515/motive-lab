'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAppState } from '@/lib/store/appState';
import { 
  Flame, 
  Dumbbell, 
  Apple, 
  Droplets, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowUpRight, 
  Plus, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  Clock,
  Award,
  CreditCard,
  ClipboardCheck
} from 'lucide-react';
import { evaluateDoubleProgression } from '@/lib/engines/progressionEngine';
import { PhysiologicalGuaranteeCard } from '@/components/dashboard/PhysiologicalGuaranteeCard';

function PaymentBanner({ onUpgrade }: { onUpgrade: (tier: 'pro' | 'coach') => void }) {
  const searchParams = useSearchParams();
  const payment = searchParams.get('payment');
  const plan = searchParams.get('plan') as 'pro' | 'coach' | null;
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (payment && plan) {
      onUpgrade(plan);
    }
  }, [payment, plan, onUpgrade]);

  if (closed || !payment) return null;

  const isSimulated = payment === 'simulated_success';
  const planName = plan === 'coach' ? 'Plan con Coach & Nutriólogo' : 'Plan Atleta Pro';

  return (
    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-start space-x-3.5">
        <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-display font-bold text-emerald-300 text-sm uppercase">
            {isSimulated ? '🎉 Modo de Prueba: Pago Simulado Aprobado' : '🎉 ¡Suscripción Activada Exitosamente!'}
          </h4>
          <p className="text-xs text-emerald-200/90 leading-relaxed">
            Tu cuenta ahora cuenta con todos los beneficios de <strong>{planName}</strong>. Acceso completo a nutrición SMAE de 7 días, biblioteca de videos y sobrecarga progresiva.
          </p>
        </div>
      </div>
      <button
        onClick={() => setClosed(true)}
        className="text-emerald-400 hover:text-white text-xs font-bold px-2 py-1"
        title="Cerrar notificación"
      >
        ✕
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const { 
    currentUser, 
    setSubscriptionTier,
    assessment, 
    hasCompletedAssessment,
    nutritionPlan, 
    workoutPlan, 
    waterConsumedMl, 
    addWaterMl, 
    resetWater,
    progressWeightHistory,
    addWeightLog,
    checkInsHistory,
    addBodyCheckIn,
    applyMetabolicAutoAdjust,
    safetyTriage
  } = useAppState();

  const [selectedDayTab, setSelectedDayTab] = useState(1);
  const [newWeightInput, setNewWeightInput] = useState('');
  const [activeMetricChart, setActiveMetricChart] = useState<'weightKg' | 'waistCm' | 'hipCm' | 'thighCm'>('weightKg');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [metabolicAdjustBanner, setMetabolicAdjustBanner] = useState<string | null>(null);
  const [checkInForm, setCheckInForm] = useState({
    weightKg: assessment?.anthropometry.weightKg || 78.5,
    waistCm: assessment?.anthropometry.waistCm || 82,
    hipCm: assessment?.anthropometry.hipCm || 98,
    armCm: 37.5,
    thighCm: 57.5,
    adherencePct: 95,
    notes: '',
    frontPhotoUrl: '',
  });

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCheckInForm((prev) => ({ ...prev, frontPhotoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    addBodyCheckIn({
      date: `Semana ${checkInsHistory.length + 1}`,
      weightKg: Number(checkInForm.weightKg),
      waistCm: Number(checkInForm.waistCm),
      hipCm: Number(checkInForm.hipCm),
      armCm: Number(checkInForm.armCm),
      thighCm: Number(checkInForm.thighCm),
      adherencePct: Number(checkInForm.adherencePct),
      notes: checkInForm.notes || 'Check-in semanal registrado',
      frontPhotoUrl: checkInForm.frontPhotoUrl || undefined,
    });
    setShowCheckInModal(false);
  };

  const handleApplyAutoAdjust = (delta: number) => {
    applyMetabolicAutoAdjust(delta);
    setMetabolicAdjustBanner(
      delta < 0
        ? `✓ Ajuste Anti-Estancamiento aplicado (${delta} kcal/día). Tu menú SMAE de 7 días ha sido recalculado automáticamente.`
        : `✓ Ajuste Anabólico aplicado (+${delta} kcal/día). Tu menú SMAE de 7 días ha sido recalculado automáticamente.`
    );
  };
  
  // Estado para registrar series en vivo de la sesión de hoy
  const [loggedSetsState, setLoggedSetsState] = useState<Record<string, { reps: number; weight: number; rir: number; pain: boolean; done: boolean }>>({
    'set-1': { reps: 8, weight: 80, rir: 2, pain: false, done: true },
    'set-2': { reps: 8, weight: 80, rir: 2, pain: false, done: true },
    'set-3': { reps: 8, weight: 80, rir: 2, pain: false, done: true },
  });

  const [progressionAlert, setProgressionAlert] = useState<string | null>(
    '¡Objetivo cumplido en Sentadilla! Has completado 3 series de 8 reps con RIR 2. Recomendación: +2.5 kg en la próxima sesión.'
  );

  const waterTargetMl = 2800;
  const waterPct = Math.min(100, Math.round((waterConsumedMl / waterTargetMl) * 100));

  const currentWorkoutSession = workoutPlan?.sessions[0];
  const currentDayMenu = nutritionPlan?.weeklyDays.find(d => d.dayNumber === selectedDayTab) || nutritionPlan?.weeklyDays[0];

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeightInput && !isNaN(Number(newWeightInput))) {
      addWeightLog(Number(newWeightInput));
      setNewWeightInput('');
    }
  };

  const handleSetToggle = (setId: string, defaultWeight: number) => {
    setLoggedSetsState(prev => {
      const current = prev[setId] || { reps: 8, weight: defaultWeight, rir: 2, pain: false, done: false };
      const nextDone = !current.done;
      const updated = { ...prev, [setId]: { ...current, done: nextDone } };

      // Evaluar sobrecarga progresiva
      const allDone = Object.values(updated).filter(s => s.done).length >= 3;
      if (allDone) {
        setProgressionAlert('¡Sobrecarga Progresiva alcanzada! Has completado todas las series en el límite superior con RIR >= 1. Sugerencia: Incrementar +1.25 a +2.5 kg.');
      }

      return updated;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Notificación de Estado de Pago */}
      <Suspense fallback={null}>
        <PaymentBanner onUpgrade={setSubscriptionTier} />
      </Suspense>

      {/* Alerta de Diagnóstico Pendiente */}
      {!hasCompletedAssessment && (
        <div className="bg-gradient-to-r from-motive-red/20 via-motive-surfaceLight to-motive-red/10 border-2 border-motive-red/50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-motive-red/20 border border-motive-red/40 flex items-center justify-center flex-shrink-0 text-motive-redBright">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-tight">
                Paso 1: Completa tu Diagnóstico Inicial
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                Tus planes de nutrición (SMAE) y rutinas de entrenamiento están bloqueados hasta registrar tus datos biométricos, objetivos y género. Toma sólo 3 minutos para desbloquearlos.
              </p>
            </div>
          </div>
          <Link
            href="/evaluacion"
            className="px-6 py-3.5 rounded-xl bg-motive-red hover:bg-motive-redBright text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-motive-red/30 flex items-center space-x-2 flex-shrink-0 hover:scale-105 transition-all"
          >
            <span>Iniciar Diagnóstico Ahora</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Alerta de Triaje Clínico si existe riesgo */}
      {safetyTriage && !safetyTriage.canProceedWithAutomaticPlan && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-start space-x-4">
          <ShieldAlert className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-display font-bold text-amber-300 text-sm uppercase">Precaución Médica en Curso</h4>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {safetyTriage.medicalReferralMessage}
            </p>
          </div>
        </div>
      )}

      {/* Hero Welcome Bar */}
      <div className="bg-gradient-to-r from-motive-surface via-motive-surfaceLight to-motive-surface border border-motive-surfaceBorder rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-motive-red/15 text-motive-redBright border border-motive-red/30">
              Mesociclo 1 • Semana 1 de 6
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
              currentUser.subscriptionTier === 'coach'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : currentUser.subscriptionTier === 'pro'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}>
              {currentUser.subscriptionTier === 'coach' ? '★ PLAN COACH VIP' : currentUser.subscriptionTier === 'pro' ? '★ PLAN ATLETA PRO' : 'PLAN BÁSICO'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
            Bienvenido, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">{currentUser.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Objetivo: <strong className="text-white uppercase">{assessment?.goal.primary === 'hypertrophy' ? 'Hipertrofia Muscular' : 'Optimización Física'}</strong> • Enfoque en sobrecarga progresiva y nutrición SMAE.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {currentUser.subscriptionTier === 'free' ? (
            <Link
              href="/precios"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Mejorar a PRO</span>
            </Link>
          ) : (
            <Link
              href="/precios"
              className="px-4 py-2.5 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder text-xs font-bold text-zinc-300 hover:text-white transition-colors flex items-center space-x-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
              <span>Gestionar Plan</span>
            </Link>
          )}
          <Link
            href="/evaluacion"
            className="px-4 py-2.5 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder text-xs font-bold text-zinc-300 hover:text-white transition-colors"
          >
            Actualizar Expediente
          </Link>
          <Link
            href="/reportes"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-motive-red to-motive-redDark text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-motive-red/25 hover:scale-[1.02] transition-transform"
          >
            Descargar Reporte PDF
          </Link>
        </div>
      </div>

      {/* Garantía Fisiológica & Cronograma de Resultados */}
      <PhysiologicalGuaranteeCard />

      {/* KPI Cards: Calorías, Macros, Entrenamiento y Agua */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Calorías */}
        <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Objetivo Calórico</span>
            <Flame className="w-5 h-5 text-motive-redBright" />
          </div>
          <div className="my-3">
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-display font-black text-white">{nutritionPlan?.methodology.calorieTarget || 2650}</span>
              <span className="text-xs font-semibold text-zinc-400">kcal/día</span>
            </div>
            <p className="text-[11px] text-motive-emerald mt-1 font-semibold flex items-center">
              <span>+250 kcal Superávit controlado</span>
            </p>
          </div>
          <div className="pt-3 border-t border-motive-surfaceBorder/60 flex justify-between text-[11px] text-zinc-400">
            <span>GEB: {nutritionPlan?.methodology.bmr || 1780} kcal</span>
            <span>GET: {nutritionPlan?.methodology.tdee || 2400} kcal</span>
          </div>
        </div>

        {/* Macronutrientes */}
        <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Distribución Macros</span>
            <Apple className="w-5 h-5 text-motive-red" />
          </div>
          <div className="my-3 grid grid-cols-3 gap-2 text-center">
            <div className="bg-motive-surfaceLight p-2 rounded-xl border border-motive-surfaceBorder/40">
              <p className="text-[10px] uppercase font-bold text-motive-redBright">Proteína</p>
              <p className="text-base font-black text-white font-display mt-0.5">{nutritionPlan?.methodology.macroTargetGrams.protein || 160}g</p>
              <p className="text-[9px] text-zinc-500">2.0 g/kg</p>
            </div>
            <div className="bg-motive-surfaceLight p-2 rounded-xl border border-motive-surfaceBorder/40">
              <p className="text-[10px] uppercase font-bold text-cyan-400">Carbos</p>
              <p className="text-base font-black text-white font-display mt-0.5">{nutritionPlan?.methodology.macroTargetGrams.carbs || 330}g</p>
              <p className="text-[9px] text-zinc-500">Energía</p>
            </div>
            <div className="bg-motive-surfaceLight p-2 rounded-xl border border-motive-surfaceBorder/40">
              <p className="text-[10px] uppercase font-bold text-amber-400">Grasas</p>
              <p className="text-base font-black text-white font-display mt-0.5">{nutritionPlan?.methodology.macroTargetGrams.fats || 70}g</p>
              <p className="text-[9px] text-zinc-500">Hormonal</p>
            </div>
          </div>
          <div className="pt-2 border-t border-motive-surfaceBorder/60 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Fibra: {nutritionPlan?.methodology.macroTargetGrams.fiber || 37}g</span>
            <Link href="/nutricion" className="text-motive-redBright hover:underline flex items-center">
              <span>Ver Menú</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Entrenamiento de Hoy */}
        <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Sesión de Hoy</span>
            <Dumbbell className="w-5 h-5 text-motive-redBright" />
          </div>
          <div className="my-3">
            <p className="text-sm font-bold text-white line-clamp-1">
              {currentWorkoutSession?.dayName || 'Torso Pesado'}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              {currentWorkoutSession?.exercises.length || 6} Ejercicios • 4-8 reps RIR 2
            </p>
            <div className="mt-2 flex items-center space-x-1.5 text-[11px] text-motive-emerald">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Aproximación vs Efectivas activadas</span>
            </div>
          </div>
          <div className="pt-2 border-t border-motive-surfaceBorder/60">
            <Link href="/entrenamiento" className="text-[11px] font-bold text-motive-redBright hover:text-white flex items-center justify-between uppercase">
              <span>Iniciar Sesión en Vivo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Hidratación */}
        <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Hidratación</span>
            <Droplets className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="my-3 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-display font-black text-white">{(waterConsumedMl / 1000).toFixed(1)} L</span>
              <span className="text-xs text-zinc-400">Meta: {(waterTargetMl / 1000).toFixed(1)} L</span>
            </div>
            <div className="w-full bg-motive-surfaceBorder h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full transition-all duration-300"
                style={{ width: `${waterPct}%` }}
              />
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => addWaterMl(250)}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
              >
                +250 ml
              </button>
              <button
                onClick={() => addWaterMl(500)}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
              >
                +500 ml
              </button>
              <button
                onClick={resetWater}
                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Reiniciar agua"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="pt-2 border-t border-motive-surfaceBorder/60 text-[11px] text-zinc-400">
            <span>{Math.round(waterConsumedMl / 250)} de {Math.round(waterTargetMl / 250)} vasos completados</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Sesión Activa de Entrenamiento y Menú del Día */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda (2 cols): Rutina del Día con Logger de Sobrecarga Progresiva */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-motive-surfaceBorder/60 pb-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-motive-redBright uppercase tracking-wider mb-1">
                  <Flame className="w-4 h-4" />
                  <span>Entrenamiento Fisiológico de Hoy</span>
                </div>
                <h3 className="text-xl font-display font-black text-white uppercase">
                  {currentWorkoutSession?.dayName}
                </h3>
              </div>
              <span className="text-xs text-zinc-400 font-semibold px-3 py-1 rounded-lg bg-motive-surfaceLight border border-motive-surfaceBorder self-start sm:self-auto">
                Doble Progresión • RIR 1-3
              </span>
            </div>

            {/* Banner de Progresión Automática */}
            {progressionAlert && (
              <div className="p-4 rounded-xl bg-motive-red/10 border border-motive-red/30 flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-motive-redBright flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-white uppercase">Sugerencia de Sobrecarga Progresiva</p>
                  <p className="text-zinc-300 leading-relaxed">{progressionAlert}</p>
                </div>
              </div>
            )}

            {/* Ejercicios de la Sesión */}
            <div className="space-y-4">
              {currentWorkoutSession?.exercises.slice(0, 3).map((item, idx) => (
                <div
                  key={item.exerciseId}
                  className="bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Ejercicio #{idx + 1} • {item.exercise.movementPattern.replace('_', ' ')}
                      </span>
                      <h4 className="text-base font-bold text-white">{item.exercise.nameSpanish}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{item.exercise.instructions.startingPosition.slice(0, 100)}...</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-motive-surface border border-motive-surfaceBorder text-zinc-300">
                      {item.exercise.tier}
                    </span>
                  </div>

                  {/* Tabla de Series: Aproximación vs Efectivas */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-motive-surfaceBorder text-zinc-500 text-[10px] uppercase">
                          <th className="py-2">Serie</th>
                          <th className="py-2">Tipo</th>
                          <th className="py-2">Prescripción</th>
                          <th className="py-2">RIR Meta</th>
                          <th className="py-2">Descanso</th>
                          <th className="py-2 text-right">Completar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-motive-surfaceBorder/40">
                        {item.sets.map((set, sIdx) => {
                          const setId = `ex-${idx}-set-${sIdx}`;
                          const isDone = loggedSetsState[setId]?.done || false;
                          const isWarmup = set.setType === 'warmup_approximation';

                          return (
                            <tr key={sIdx} className={`hover:bg-motive-surface/40 transition-colors ${isDone ? 'opacity-60' : ''}`}>
                              <td className="py-2 font-bold text-white">#{set.setNumber}</td>
                              <td className="py-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  isWarmup
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    : 'bg-motive-red/10 text-motive-redBright border border-motive-red/20 font-bold'
                                }`}>
                                  {isWarmup ? 'Aproximación' : 'Efectiva'}
                                </span>
                              </td>
                              <td className="py-2 text-zinc-200">
                                {set.targetRepsMin}-{set.targetRepsMax} reps
                              </td>
                              <td className="py-2 text-zinc-400">RIR {set.targetRIR}</td>
                              <td className="py-2 text-zinc-400">{set.restSeconds}s</td>
                              <td className="py-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleSetToggle(setId, 80)}
                                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                    isDone
                                      ? 'bg-motive-emerald text-black shadow-lg shadow-motive-emerald/20'
                                      : 'bg-motive-surface border border-motive-surfaceBorder text-zinc-300 hover:border-zinc-500'
                                  }`}
                                >
                                  {isDone ? '✓ Hecho' : 'Marcar'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {item.notes && (
                    <div className="text-[11px] text-zinc-400 bg-motive-surface/60 p-2.5 rounded-lg border border-motive-surfaceBorder/40">
                      <strong>Criterio Técnico:</strong> {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/entrenamiento"
                className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder hover:border-zinc-500 text-xs font-bold text-white uppercase tracking-wider transition-colors"
              >
                <span>Ver Todos los Ejercicios y Registrar Cargas Completas</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* Check-in Semanal Automatizado, Gráficas Multi-Métrica & Auto-Ajuste Metabólico */}
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-motive-surfaceBorder/60 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-motive-redBright block">
                  Seguimiento Antropométrico & Bio-Feedback
                </span>
                <h4 className="font-display font-black text-lg text-white uppercase">
                  Check-in Semanal & Evolución Corporal
                </h4>
                <p className="text-xs text-zinc-400">
                  Monitoreo de peso, perímetros corporales y ajuste calórico automático contra estancamientos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckInModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-motive-red to-motive-redDark text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-motive-red/25 hover:scale-[1.02] transition-transform flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Check-in Semanal</span>
              </button>
            </div>

            {/* Selector de Métrica Corporal */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'weightKg' as const, label: 'Peso Corporal (kg)', unit: 'kg' },
                { key: 'waistCm' as const, label: 'Cintura (cm)', unit: 'cm' },
                { key: 'hipCm' as const, label: 'Cadera / Glúteo (cm)', unit: 'cm' },
                { key: 'thighCm' as const, label: 'Pierna / Muslo (cm)', unit: 'cm' },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setActiveMetricChart(m.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    activeMetricChart === m.key
                      ? 'bg-motive-red text-white border-motive-redBright shadow-md shadow-motive-red/20'
                      : 'bg-motive-surfaceLight border-motive-surfaceBorder text-zinc-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Gráfica Visual Interactiva por Métrica */}
            {(() => {
              const unit = activeMetricChart === 'weightKg' ? 'kg' : 'cm';
              const values = checkInsHistory.map((c) => Number(c[activeMetricChart] || 0));
              const minVal = Math.min(...values) - 2;
              const maxVal = Math.max(...values) + 1;
              const range = Math.max(4, maxVal - minVal);
              const firstVal = values[0] || 0;
              const lastVal = values[values.length - 1] || 0;
              const delta = Number((lastVal - firstVal).toFixed(1));

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs bg-motive-surfaceLight px-3.5 py-2 rounded-xl border border-motive-surfaceBorder">
                    <span className="text-zinc-400">
                      Inicio: <strong className="text-white">{firstVal} {unit}</strong> ➔ Actual: <strong className="text-white">{lastVal} {unit}</strong>
                    </span>
                    <span className={`font-bold px-2 py-0.5 rounded ${
                      delta === 0
                        ? 'bg-zinc-800 text-zinc-300'
                        : activeMetricChart === 'waistCm'
                        ? delta < 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                        : 'bg-emerald-500/15 text-emerald-400'
                    }`}>
                      Cambio Total: {delta > 0 ? `+${delta}` : delta} {unit}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-4 items-end h-40">
                    {checkInsHistory.slice(-5).map((pt, i) => {
                      const val = Number(pt[activeMetricChart] || 0);
                      const pct = Math.min(100, Math.max(18, Math.round(((val - minVal) / range) * 100)));
                      return (
                        <div key={pt.id || i} className="flex flex-col items-center justify-end h-full space-y-2">
                          <span className="text-xs font-bold text-white">{val} {unit}</span>
                          <div
                            className="w-full bg-gradient-to-t from-motive-red to-motive-redBright rounded-t-xl transition-all duration-500"
                            style={{ height: `${pct}%` }}
                          />
                          <span className="text-[10px] text-zinc-400 font-medium truncate w-full text-center">{pt.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Motor de Auto-Ajuste Metabólico Inteligente */}
            <div className="p-4 rounded-2xl bg-motive-surfaceLight border border-motive-surfaceBorder space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h5 className="text-xs font-display font-black text-white uppercase tracking-wider">
                    Motor de Auto-Ajuste Metabólico (Rompe-Estancamientos)
                  </h5>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Adherencia Promedio: {checkInsHistory[checkInsHistory.length - 1]?.adherencePct || 95}%
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                ¿Llevas 2 semanas con el peso o cintura estancados pese a cumplir tu plan al 90%? Aplica un micro-ajuste fisiológico con 1 clic y el sistema recalculará automáticamente las porciones de tus 7 días del menú SMAE:
              </p>

              {metabolicAdjustBanner && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 font-semibold">
                  {metabolicAdjustBanner}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleApplyAutoAdjust(-150)}
                  className="px-3.5 py-2 rounded-xl bg-motive-surface border border-motive-surfaceBorder hover:border-motive-red text-xs font-bold text-zinc-200 hover:text-white transition-colors"
                >
                  🔥 Recorte Definición (-150 kcal / día)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyAutoAdjust(150)}
                  className="px-3.5 py-2 rounded-xl bg-motive-surface border border-motive-surfaceBorder hover:border-emerald-500 text-xs font-bold text-zinc-200 hover:text-white transition-colors"
                >
                  💪 Empuje Masa Muscular (+150 kcal / día)
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Columna Derecha (1 col): Plan de Alimentación SMAE del Día y Sustitución */}
        <div className="space-y-6">
          
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-motive-surfaceBorder/60 pb-3">
              <div>
                <span className="text-xs font-bold text-motive-redBright uppercase tracking-wider block">Nutrición SMAE</span>
                <h3 className="text-lg font-display font-black text-white uppercase">Comidas del Día</h3>
              </div>
              <Link href="/nutricion" className="text-xs font-bold text-zinc-400 hover:text-white flex items-center">
                <span>7 Días</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Selector de Día */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1">
              {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDayTab(dayNum)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedDayTab === dayNum
                      ? 'bg-motive-red text-white'
                      : 'bg-motive-surfaceLight text-zinc-400 hover:text-white'
                  }`}
                >
                  D{dayNum}
                </button>
              ))}
            </div>

            {/* Lista de Comidas */}
            <div className="space-y-4">
              {currentDayMenu?.meals.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{meal.name}</span>
                    <span className="text-[11px] font-semibold text-zinc-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>{meal.suggestedTime}</span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {meal.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-zinc-300">
                        <span>• {it.foodName} ({it.grams}g)</span>
                        <span className="text-zinc-500 text-[11px]">{it.calories} kcal | {it.protein}g P</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-motive-surfaceBorder/60 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 font-medium">
                      Total: <strong className="text-white">{meal.totals.calories} kcal</strong> ({meal.totals.protein}g Prot)
                    </span>
                    <Link
                      href="/nutricion"
                      className="text-motive-redBright hover:underline font-semibold"
                    >
                      Sustituir Alimento
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-motive-surfaceLight/60 rounded-xl border border-motive-surfaceBorder text-xs text-zinc-400 space-y-1">
              <p className="font-semibold text-white flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-motive-emerald" />
                <span>Ingredientes SMAE México</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                Rendimientos calculados: Pechuga de pollo y bistec expresados en cocido; avena y arroz convertidos a rendimiento de absorción.
              </p>
            </div>

          </div>

          {/* Quick link a Suplementación y Fichas */}
          <div className="bg-gradient-to-br from-motive-surface to-motive-surfaceLight border border-motive-surfaceBorder rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-motive-redBright">
              <Award className="w-5 h-5" />
              <h4 className="font-display font-bold text-sm text-white uppercase">Dossiers de Suplementos ISSN</h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Consulta fichas clínicas de Creatina, Proteína Whey, Cafeína, Magnesio y Omega 3 respaldadas por literatura grado A.
            </p>
            <Link
              href="/recuperacion"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-motive-redBright hover:text-white uppercase tracking-wider"
            >
              <span>Abrir Biblioteca de Evidencia</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* Modal de Nuevo Check-in Semanal + Comparador Visual */}
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between border-b border-motive-surfaceBorder pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-motive-redBright block">
                  Control Quincenal / Semanal
                </span>
                <h3 className="text-lg font-display font-black text-white uppercase">
                  Registrar Check-in Corporal
                </h3>
              </div>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCheckIn} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-zinc-300 uppercase mb-1">Peso en Ayunas (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={checkInForm.weightKg}
                    onChange={(e) => setCheckInForm({ ...checkInForm, weightKg: Number(e.target.value) })}
                    className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-300 uppercase mb-1">Cintura (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={checkInForm.waistCm}
                    onChange={(e) => setCheckInForm({ ...checkInForm, waistCm: Number(e.target.value) })}
                    className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-300 uppercase mb-1">Cadera / Glúteo (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={checkInForm.hipCm}
                    onChange={(e) => setCheckInForm({ ...checkInForm, hipCm: Number(e.target.value) })}
                    className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-300 uppercase mb-1">Brazo Contraído (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={checkInForm.armCm}
                    onChange={(e) => setCheckInForm({ ...checkInForm, armCm: Number(e.target.value) })}
                    className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-300 uppercase mb-1">Pierna / Muslo (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={checkInForm.thighCm}
                    onChange={(e) => setCheckInForm({ ...checkInForm, thighCm: Number(e.target.value) })}
                    className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-300 uppercase mb-1">% Adherencia al Plan</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={checkInForm.adherencePct}
                    onChange={(e) => setCheckInForm({ ...checkInForm, adherencePct: Number(e.target.value) })}
                    className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-300 uppercase mb-1">Foto de Progreso (Opcional - Frente / Perfil)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-motive-red file:text-white hover:file:bg-motive-redDark"
                />
                {checkInForm.frontPhotoUrl && (
                  <div className="mt-2 h-28 w-28 rounded-xl overflow-hidden border border-motive-surfaceBorder">
                    <img src={checkInForm.frontPhotoUrl} alt="Previsualización" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-zinc-300 uppercase mb-1">Sensaciones de Energía, Digestión y Sueño</label>
                <textarea
                  rows={2}
                  value={checkInForm.notes}
                  onChange={(e) => setCheckInForm({ ...checkInForm, notes: e.target.value })}
                  placeholder="Ej. Excelente bombeo muscular, sin hambre entre comidas..."
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-3 py-2 text-white placeholder-zinc-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder text-zinc-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-motive-red to-motive-redDark text-white font-bold uppercase tracking-wider shadow-lg shadow-motive-red/30"
                >
                  Guardar Check-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

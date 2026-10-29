'use client';

import React from 'react';
import Link from 'next/link';
import { useAppState } from '@/lib/store/appState';
import { ClipboardCheck, Lock, ArrowRight, Sparkles, HeartPulse, Dumbbell, Apple, ShieldCheck } from 'lucide-react';

interface AssessmentGateProps {
  children?: React.ReactNode;
  featureName?: string;
}

export function AssessmentGate({
  children,
  featureName = 'tu Plan Nutricional & Rutina de Entrenamiento',
}: AssessmentGateProps) {
  const { hasCompletedAssessment, currentUser } = useAppState();

  // Si ya completó la evaluación, dar acceso total
  if (hasCompletedAssessment) {
    return <>{children}</>;
  }

  // Si es admin o coach, también permitir ver el contenido
  if (currentUser?.role === 'admin' || currentUser?.role === 'coach' || currentUser?.role === 'nutritionist') {
    return <>{children}</>;
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-motive-surface via-motive-surfaceLight to-[#0A0A0C] border border-motive-red/30 shadow-2xl text-center space-y-8 animate-in fade-in duration-500">
      
      {/* Icon Badge */}
      <div className="relative inline-block">
        <div className="w-20 h-20 rounded-3xl bg-motive-red/15 border-2 border-motive-red/40 flex items-center justify-center mx-auto shadow-2xl shadow-motive-red/30">
          <ClipboardCheck className="w-10 h-10 text-motive-redBright" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-motive-surface border-2 border-motive-redBright flex items-center justify-center">
          <Lock className="w-4 h-4 text-motive-redBright" />
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-motive-red/10 border border-motive-red/30 text-motive-redBright text-xs font-bold uppercase tracking-wider">
          <HeartPulse className="w-4 h-4" />
          <span>Prescripción Basada en Evidencia Médica</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
          Diagnóstico Inicial Requerido
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Para desbloquear <strong>{featureName}</strong>, primero necesitamos conocer tus datos biométricos, objetivos y género. En MOTIVE LAB no creemos en planes genéricos idénticos para todos.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
        <div className="p-4 rounded-2xl bg-motive-surface border border-motive-surfaceBorder space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Apple className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-white text-xs uppercase">Calorías Exactas (SMAE)</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Tu menú de 7 días se calculará según tu gasto calórico real (Mifflin-St Jeor), repartiendo macronutrientes al gramo exacto.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-motive-surface border border-motive-surfaceBorder space-y-2">
          <div className="w-8 h-8 rounded-lg bg-motive-red/10 text-motive-redBright flex items-center justify-center">
            <Dumbbell className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-white text-xs uppercase">Rutina a tu Medida</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Para mujeres: especialización biomecánica en <strong>aumento de pierna y glúteo</strong> (Hip Thrust y sentadilla). Para hombres: hipertrofia neuromuscular balanceada.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-motive-surface border border-motive-surfaceBorder space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-white text-xs uppercase">Triaje Clínico Seguro</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Evaluamos el cuestionario PAR-Q+ para descartar contraindicaciones o dolores articulares previos.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <Link
          href="/evaluacion"
          className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-motive-red to-motive-redDark text-white text-sm sm:text-base font-extrabold uppercase tracking-wider hover:brightness-110 transition-all shadow-xl shadow-motive-red/30 hover:scale-[1.02]"
        >
          <span>Comenzar Mi Diagnóstico Ahora (Toma 3 Minutos)</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-xs text-zinc-500 mt-3">
          Tus respuestas se almacenan con cifrado de grado médico y activan de inmediato tus programas.
        </p>
      </div>

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useAppState } from '@/lib/store/appState';
import { 
  ShieldCheck, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Dumbbell, 
  Apple, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  Zap,
  Target
} from 'lucide-react';

export function PhysiologicalGuaranteeCard() {
  const { assessment, nutritionPlan, workoutPlan } = useAppState();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!nutritionPlan || !assessment) return null;

  const { methodology } = nutritionPlan;
  const isFemale = assessment.anthropometry.gender === 'female';
  const goal = assessment.goal.primary;

  const goalText = 
    goal === 'fat_loss'
      ? 'Déficit calórico estructurado del 20% para oxidar grasa protegiendo el 100% de la masa muscular'
      : goal === 'hypertrophy'
      ? 'Superávit calórico controlado (+250 kcal) para maximizar la síntesis proteica miofibrilar'
      : 'Aporte de recomposición para ganancia de tono y reducción de tejido adiposo simultáneo';

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#101915] via-motive-surfaceLight to-[#0c120f] p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Garantía Fisiológica & Evidencia Científica</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
            ¿Por qué este protocolo funcionará en tu cuerpo?
          </h3>
          <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
            Tu plan no es una plantilla al azar. Fue generado mediante modelos matemáticos deterministas adaptados a tu fisiología, peso, edad y hábitos.
          </p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all self-start sm:self-auto"
        >
          <span>{isExpanded ? 'Ocultar Desglose' : 'Ver Desglose Completo'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Fórmulas y Auditoría Matemática */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-motive-surface border border-motive-surfaceBorder space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                1. Gasto Basal (Mifflin-St Jeor)
              </span>
              <p className="text-2xl font-display font-black text-white">
                {methodology.bmr} <span className="text-xs font-semibold text-zinc-400">kcal/día</span>
              </p>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Energía mínima vital que requiere tu organismo en reposo para órganos y metabolismo basal.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-motive-surface border border-motive-surfaceBorder space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                2. Gasto Energético Total (GET)
              </span>
              <p className="text-2xl font-display font-black text-white">
                {methodology.tdee} <span className="text-xs font-semibold text-zinc-400">kcal/día</span>
              </p>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Incluye tu actividad ocupacional y el gasto metabólico de tus sesiones de entrenamiento.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-motive-surface border border-emerald-500/40 space-y-1.5 bg-emerald-500/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                3. Objetivo Calórico Prescrito
              </span>
              <p className="text-2xl font-display font-black text-emerald-300">
                {methodology.calorieTarget} <span className="text-xs font-semibold text-emerald-400">kcal/día</span>
              </p>
              <p className="text-[11px] text-emerald-200/90 leading-snug">
                {goalText}
              </p>
            </div>
          </div>

          {/* Cronograma de Resultados Semana a Semana */}
          <div className="bg-motive-surface/80 border border-motive-surfaceBorder rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Línea de Tiempo de Cambios Fisiológicos Esperados
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* Semanas 1-2 */}
              <div className="p-4 rounded-xl bg-motive-surfaceLight/60 border border-motive-surfaceBorder space-y-2 relative overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-cyan-400 absolute top-3 right-3" />
                <span className="text-[10px] font-black uppercase text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/30">
                  Semanas 1 - 2
                </span>
                <p className="font-bold text-white text-sm">Adaptación Neuromuscular & Glucógeno</p>
                <ul className="text-zinc-300 space-y-1 text-[11px] leading-relaxed">
                  <li>• Desinflamación digestiva y menor retención de líquidos (1 a 2 kg iniciales).</li>
                  <li>• Mayor conexión mente-músculo y activación {isFemale ? 'de glúteos e isquiosurales' : 'del tren superior e inferior'}.</li>
                  <li>• Niveles de energía estables sin caídas glucémicas.</li>
                </ul>
              </div>

              {/* Semanas 3-4 */}
              <div className="p-4 rounded-xl bg-motive-surfaceLight/60 border border-motive-surfaceBorder space-y-2 relative overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-amber-400 absolute top-3 right-3" />
                <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                  Semanas 3 - 4
                </span>
                <p className="font-bold text-white text-sm">Sobrecarga Progresiva & Firmeza</p>
                <ul className="text-zinc-300 space-y-1 text-[11px] leading-relaxed">
                  <li>• El algoritmo te indicará tu primer aumento de peso (+1.25 a +2.5 kg).</li>
                  <li>• Reducción visible de 1 a 3 cm de cintura y mayor firmeza muscular.</li>
                  <li>• Adaptación del apetito gracias a las porciones saciantes de proteína y fibra.</li>
                </ul>
              </div>

              {/* Semanas 5-6 */}
              <div className="p-4 rounded-xl bg-motive-surfaceLight/60 border border-motive-surfaceBorder space-y-2 relative overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-emerald-400 absolute top-3 right-3" />
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/30">
                  Semanas 5 - 6
                </span>
                <p className="font-bold text-white text-sm">Recomposición & Hipertrofia Visible</p>
                <ul className="text-zinc-300 space-y-1 text-[11px] leading-relaxed">
                  <li>• Desarrollo perceptible {isFemale ? 'y redondez en glúteo y tono de piernas' : 'en densidad de torso y piernas'}.</li>
                  <li>• Oxidación sostenida de grasa corporal (0.5% a 0.8% del peso corporal semanal).</li>
                  <li>• Descarga programada (deload) para regenerar articulaciones y sistema nervioso.</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Tres Pilares de Adherencia */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-motive-surface border border-motive-surfaceBorder">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Cero Dietas Aburridas:</strong>
                <span className="text-zinc-400 text-[11px]">Incluye hot cakes proteicos, tilapia fresca al limón, rice cakes y fajitas.</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-motive-surface border border-motive-surfaceBorder">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Sustituciones Clínicas SMAE:</strong>
                <span className="text-zinc-400 text-[11px]">Si algo no te apetece, cámbialo en 1 clic manteniendo exactamente tus macros.</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-motive-surface border border-motive-surfaceBorder">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Sobrecarga Doble ACSM:</strong>
                <span className="text-zinc-400 text-[11px]">El sistema evita mesetas de progreso subiendo peso únicamente cuando estás listo.</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

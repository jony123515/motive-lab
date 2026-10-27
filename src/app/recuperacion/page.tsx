'use client';

import React, { useState } from 'react';
import { useAppState } from '@/lib/store/appState';
import { calculateHydrationPlan } from '@/lib/engines/hydrationEngine';
import { SUPPLEMENT_DOSSIERS, SupplementDossier } from '@/lib/data/supplementEvidence';
import { 
  Droplets, 
  Flame, 
  Award, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Plus, 
  RotateCcw,
  BookOpen,
  ChevronRight
} from 'lucide-react';

export default function RecoveryPage() {
  const { assessment, waterConsumedMl, addWaterMl, resetWater } = useAppState();

  const [sweatRate, setSweatRate] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [trainingDuration, setTrainingDuration] = useState<number>(60);
  const [isHotClimate, setIsHotClimate] = useState<boolean>(false);
  const [selectedDossier, setSelectedDossier] = useState<SupplementDossier | null>(SUPPLEMENT_DOSSIERS[0]);

  const weightKg = assessment?.anthropometry.weightKg || 75;
  const hydrationPlan = calculateHydrationPlan(weightKg, trainingDuration, sweatRate, isHotClimate);

  const waterPct = Math.min(100, Math.round((waterConsumedMl / (hydrationPlan.totalDailyTargetLiters * 1000)) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
            <Droplets className="w-4 h-4" />
            <span>Fisiología de la Recuperación, Hidratación & ISSN</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
            Hidratación Dinámica & Biblioteca de Suplementos
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Optimiza el balance hídrico celular y conoce la verdad científica detrás de los suplementos deportivos para evitar gastos innecesarios y proteger tu salud.
          </p>
        </div>
      </div>

      {/* MÓDULO 1: Calculadora y Registro de Hidratación */}
      <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-motive-surfaceBorder/60 pb-5">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Módulo 1</span>
            <h3 className="text-xl font-display font-black text-white uppercase">Plan Personalizado de Hidratación</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => addWaterMl(250)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            >
              + 1 Vaso (250 ml)
            </button>
            <button
              onClick={() => addWaterMl(500)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            >
              + Botella (500 ml)
            </button>
            <button
              onClick={resetWater}
              className="p-2 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder text-zinc-400 hover:text-white"
              title="Reiniciar contador de agua"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Inputs de Configuración Ambiental y Esfuerzo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Duración del Entrenamiento de Hoy</label>
            <select
              value={trainingDuration}
              onChange={(e) => setTrainingDuration(Number(e.target.value))}
              className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="0">Día de Descanso (0 min)</option>
              <option value="45">45 Minutos</option>
              <option value="60">60 Minutos</option>
              <option value="90">90 Minutos</option>
              <option value="120">120 Minutos</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Tasa de Sudoración Estimada</label>
            <select
              value={sweatRate}
              onChange={(e) => setSweatRate(e.target.value as any)}
              className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="low">Baja (Ropa seca o sudor ligero)</option>
              <option value="moderate">Moderada (Sudor evidente en frente y playera)</option>
              <option value="high">Alta (Playera empapada por completo)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Clima y Temperatura</label>
            <select
              value={isHotClimate ? 'yes' : 'no'}
              onChange={(e) => setIsHotClimate(e.target.value === 'yes')}
              className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="no">Templado / Climatizado con aire acondicionado</option>
              <option value="yes">Calor extremo / Humedad elevada (&gt; 28°C)</option>
            </select>
          </div>
        </div>

        {/* Visual Progress Bar & KPIs */}
        <div className="bg-motive-surfaceLight border border-motive-surfaceBorder rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-3xl font-display font-black text-white">{(waterConsumedMl / 1000).toFixed(2)} L</span>
              <span className="text-xs text-zinc-400 ml-2">consumidos de tu meta de {hydrationPlan.totalDailyTargetLiters} L</span>
            </div>
            <span className="text-sm font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
              {waterPct}% Completado
            </span>
          </div>

          <div className="w-full bg-motive-surface h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${waterPct}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
            <div className="bg-motive-surface p-3 rounded-xl border border-motive-surfaceBorder/60">
              <span className="text-zinc-500 uppercase text-[10px] font-bold block">Tasa Basal (35 ml/kg)</span>
              <span className="text-sm font-bold text-white mt-0.5 block">{hydrationPlan.baselineLiters} Litros</span>
            </div>
            <div className="bg-motive-surface p-3 rounded-xl border border-motive-surfaceBorder/60">
              <span className="text-zinc-500 uppercase text-[10px] font-bold block">Reemplazo por Ejercicio</span>
              <span className="text-sm font-bold text-cyan-400 mt-0.5 block">+{hydrationPlan.trainingAddonLiters} Litros</span>
            </div>
            <div className="bg-motive-surface p-3 rounded-xl border border-motive-surfaceBorder/60">
              <span className="text-zinc-500 uppercase text-[10px] font-bold block">Equivalencia en Vasos</span>
              <span className="text-sm font-bold text-white mt-0.5 block">{hydrationPlan.glassesTarget250ml} Vasos de 250 ml</span>
            </div>
          </div>
        </div>

        {/* Protocolo Peri-Entrenamiento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-motive-surfaceLight p-4 rounded-xl border border-motive-surfaceBorder space-y-1.5 text-xs">
            <span className="font-bold text-white uppercase flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Pre-Entreno (-2h)</span>
            </span>
            <p className="text-zinc-300 leading-relaxed">{hydrationPlan.periWorkoutProtocol.preWorkoutMl}</p>
          </div>

          <div className="bg-motive-surfaceLight p-4 rounded-xl border border-motive-surfaceBorder space-y-1.5 text-xs">
            <span className="font-bold text-white uppercase flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Intra-Entreno</span>
            </span>
            <p className="text-zinc-300 leading-relaxed">{hydrationPlan.periWorkoutProtocol.intraWorkoutMl}</p>
          </div>

          <div className="bg-motive-surfaceLight p-4 rounded-xl border border-motive-surfaceBorder space-y-1.5 text-xs">
            <span className="font-bold text-white uppercase flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Post-Entreno (+2h)</span>
            </span>
            <p className="text-zinc-300 leading-relaxed">{hydrationPlan.periWorkoutProtocol.postWorkoutMl}</p>
          </div>
        </div>

      </div>

      {/* MÓDULO 2: Fichas de Suplementación Basadas en Evidencia (ISSN) */}
      <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-motive-surfaceBorder/60 pb-5">
          <div>
            <span className="text-xs font-bold text-motive-redBright uppercase tracking-wider block">Módulo 2</span>
            <h3 className="text-xl font-display font-black text-white uppercase">
              Biblioteca Científica de Suplementos & Vitaminas
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Fichas basadas en revisiones sistemáticas de la ISSN, ACSM y OMS. Sin promesas milagrosas.
            </p>
          </div>
        </div>

        {/* Grid de Pestañas y Vista Detallada */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Lista de Suplementos */}
          <div className="space-y-2 lg:col-span-1">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Selecciona un suplemento</p>
            {SUPPLEMENT_DOSSIERS.map((dossier) => (
              <button
                key={dossier.id}
                onClick={() => setSelectedDossier(dossier)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  selectedDossier?.id === dossier.id
                    ? 'bg-motive-red/15 border-motive-red text-white shadow-lg shadow-motive-red/20'
                    : 'bg-motive-surfaceLight border-motive-surfaceBorder text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div>
                  <p className="font-bold text-xs text-white">{dossier.name}</p>
                  <span className={`text-[10px] font-semibold uppercase mt-0.5 inline-block ${
                    dossier.category === 'A_evidence' ? 'text-motive-emerald' : 'text-cyan-400'
                  }`}>
                    {dossier.category === 'A_evidence' ? 'Evidencia Grado A' : 'Micronutriente Esencial'}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>
            ))}
          </div>

          {/* Ficha Detallada del Suplemento */}
          {selectedDossier && (
            <div className="lg:col-span-2 bg-motive-surfaceLight border border-motive-surfaceBorder rounded-2xl p-6 space-y-5">
              
              <div className="border-b border-motive-surfaceBorder/60 pb-4">
                <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-motive-emerald bg-motive-emerald/10 border border-motive-emerald/20 px-2.5 py-0.5 rounded-full mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>{selectedDossier.scientificEvidenceLevel}</span>
                </div>
                <h4 className="text-2xl font-display font-black text-white">{selectedDossier.name}</h4>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                  {selectedDossier.primaryPurpose}
                </p>
              </div>

              {/* Beneficios Clave */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-motive-emerald" />
                  <span>Beneficios Comprobados</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {selectedDossier.keyBenefits.map((b, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-motive-emerald mt-1.5 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dosis Segura y Cuándo es Innecesario */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-motive-surface p-4 rounded-xl border border-motive-surfaceBorder text-xs space-y-1.5">
                  <span className="font-bold text-white uppercase block">Dosis Segura Sugerida</span>
                  <p className="text-zinc-300 leading-relaxed">{selectedDossier.suggestedDosageSafe}</p>
                </div>

                <div className="bg-motive-surface p-4 rounded-xl border border-motive-surfaceBorder text-xs space-y-1.5">
                  <span className="font-bold text-amber-400 uppercase block">¿Cuándo es Prescindible?</span>
                  <p className="text-zinc-300 leading-relaxed">{selectedDossier.whenUnnecessary}</p>
                </div>
              </div>

              {/* Riesgos, Interacciones y Nota Clínica */}
              <div className="space-y-2 pt-2 border-t border-motive-surfaceBorder/60 text-xs">
                <span className="font-bold text-rose-400 uppercase flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Riesgos, Contraindicaciones e Interacciones</span>
                </span>
                <ul className="list-disc list-inside space-y-1 text-zinc-300">
                  {selectedDossier.risksAndInteractions.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl mt-3 text-[11px] leading-relaxed">
                  <strong>Aviso Profesional Obligatorio:</strong> {selectedDossier.professionalReviewNotice}
                </div>

                <p className="text-[10px] text-zinc-500 pt-1">
                  <strong>Fuente Bibliográfica:</strong> {selectedDossier.referenceSource}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

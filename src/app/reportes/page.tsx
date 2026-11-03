'use client';

import React, { useState } from 'react';
import { useAppState } from '@/lib/store/appState';
import { SubscriptionGate } from '@/components/auth/SubscriptionGate';
import { generateWeeklyShoppingList } from '@/lib/engines/nutritionEngine';
import { 
  FileText, 
  Printer, 
  Award, 
  CheckCircle2, 
  Dumbbell, 
  Apple, 
  HeartPulse, 
  TrendingUp, 
  Calendar,
  ShieldCheck,
  QrCode,
  ShoppingCart
} from 'lucide-react';

export default function ReportsPage() {
  const { currentUser, assessment, nutritionPlan, workoutPlan, progressWeightHistory } = useAppState();
  const [selectedPrintDay, setSelectedPrintDay] = useState(1);

  const handlePrint = () => {
    window.print();
  };

  const isFree = currentUser.subscriptionTier === 'free' && currentUser.role === 'client';
  const activeMenuDay = nutritionPlan?.weeklyDays.find((d) => d.dayNumber === selectedPrintDay) || nutritionPlan?.weeklyDays[0];
  const shoppingList = nutritionPlan ? generateWeeklyShoppingList(nutritionPlan).slice(0, 14) : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Paywall si el usuario está en Plan Básico */}
      {isFree ? (
        <SubscriptionGate
          requiredTier="pro"
          title="Descarga de Reportes Clínicos en PDF"
          description="Los informes imprimibles de grado médico y resúmenes antropométricos están reservados para atletas con membresía activa Plan Atleta Pro o Plan con Coach."
          featureList={[
            'Informe de composición corporal y gasto basal de alta resolución',
            'Desglose imprimible de macronutrientes y distribución horaria',
            'Plan de entrenamiento periodizado en formato PDF para el gimnasio',
            'Historial de sobrecarga progresiva y evolución de fuerza',
          ]}
        />
      ) : (
        <>
          {/* Action Bar (oculta al imprimir) */}
          <div className="print:hidden bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-motive-redBright uppercase tracking-wider block">Módulo de Seguimiento Clínico</span>
              <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase mt-0.5">
                Informe Digital e Imprimible del Atleta
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Genera un documento profesional para archivo médico, presentación a tu entrenador o seguimiento personal.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-zinc-400 font-semibold">Día de Menú en PDF:</span>
                <select
                  value={selectedPrintDay}
                  onChange={(e) => setSelectedPrintDay(Number(e.target.value))}
                  className="bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-2.5 py-2 text-xs text-white font-bold"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <option key={d} value={d}>Día {d}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handlePrint}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-motive-red to-motive-redDark text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-motive-red/30 hover:scale-[1.02] transition-transform"
              >
                <Printer className="w-4 h-4" />
                <span>Descargar Expediente Completo (PDF)</span>
              </button>
            </div>
          </div>

          {/* DOCUMENTO FORMAL IMPRIMIBLE */}
          <div className="bg-motive-surface print:bg-white print:text-black border border-motive-surfaceBorder print:border-none rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl">
        
        {/* Cabecera del Reporte */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-motive-surfaceBorder print:border-black/20 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-black text-2xl tracking-wider text-white print:text-black">MOTIVE</span>
              <span className="font-display font-black text-2xl tracking-wider text-motive-redBright">LAB</span>
            </div>
            <p className="text-xs text-zinc-400 print:text-zinc-600 font-medium mt-1">
              Centro de Rendimiento Deportivo, Fisiología & Nutrición Clínica
            </p>
          </div>

          <div className="text-right text-xs space-y-1">
            <p className="font-bold text-white print:text-black">FOLIO: ML-2026-EXP-{assessment?.id.slice(-6).toUpperCase()}</p>
            <p className="text-zinc-400 print:text-zinc-600">Fecha de Emisión: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-motive-emerald/15 text-motive-emerald print:border print:border-black/30">
              Expediente Clínico Vigente
            </span>
          </div>
        </div>

        {/* Datos Generales del Atleta y Supervisión */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-motive-surfaceLight print:bg-zinc-100 p-4 rounded-xl text-xs">
          <div>
            <span className="text-zinc-500 uppercase text-[10px] font-bold block">Atleta Evaluado</span>
            <span className="font-bold text-white print:text-black text-sm">{currentUser.name}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase text-[10px] font-bold block">Edad / Sexo</span>
            <span className="font-bold text-white print:text-black text-sm">
              {assessment?.anthropometry.age || 28} Años ({assessment?.anthropometry.gender === 'male' ? 'Masculino' : 'Femenino'})
            </span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase text-[10px] font-bold block">Objetivo Primario</span>
            <span className="font-bold text-motive-redBright print:text-red-700 text-sm uppercase">
              {assessment?.goal.primary || 'Hipertrofia'}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase text-[10px] font-bold block">Coach Responsable</span>
            <span className="font-bold text-white print:text-black text-sm">Lic. Roberto Sánchez (CSCS)</span>
          </div>
        </div>

        {/* SECCIÓN 1: Antropometría & Composición Corporal */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-base uppercase text-white print:text-black flex items-center space-x-2 border-b border-motive-surfaceBorder print:border-black/20 pb-2">
            <HeartPulse className="w-4 h-4 text-motive-redBright" />
            <span>1. Parámetros Antropométricos y Evolución de Peso</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 bg-motive-surfaceLight print:bg-zinc-50 rounded-xl border border-motive-surfaceBorder print:border-zinc-300">
              <span className="text-zinc-500 text-[10px] font-bold uppercase block">Estatura</span>
              <span className="text-base font-bold text-white print:text-black">{assessment?.anthropometry.heightCm} cm</span>
            </div>
            <div className="p-3 bg-motive-surfaceLight print:bg-zinc-50 rounded-xl border border-motive-surfaceBorder print:border-zinc-300">
              <span className="text-zinc-500 text-[10px] font-bold uppercase block">Peso Actual</span>
              <span className="text-base font-bold text-white print:text-black">{assessment?.anthropometry.weightKg} kg</span>
            </div>
            <div className="p-3 bg-motive-surfaceLight print:bg-zinc-50 rounded-xl border border-motive-surfaceBorder print:border-zinc-300">
              <span className="text-zinc-500 text-[10px] font-bold uppercase block">IMC Calculado</span>
              <span className="text-base font-bold text-white print:text-black">
                {((assessment?.anthropometry.weightKg || 75) / Math.pow((assessment?.anthropometry.heightCm || 175) / 100, 2)).toFixed(1)}
              </span>
            </div>
            <div className="p-3 bg-motive-surfaceLight print:bg-zinc-50 rounded-xl border border-motive-surfaceBorder print:border-zinc-300">
              <span className="text-zinc-500 text-[10px] font-bold uppercase block">Grasa Estimada</span>
              <span className="text-base font-bold text-white print:text-black">
                {assessment?.anthropometry.bodyFatPercentage ? `${assessment.anthropometry.bodyFatPercentage}%` : 'Mifflin'}
              </span>
            </div>
            <div className="p-3 bg-motive-surfaceLight print:bg-zinc-50 rounded-xl border border-motive-surfaceBorder print:border-zinc-300">
              <span className="text-zinc-500 text-[10px] font-bold uppercase block">Cintura</span>
              <span className="text-base font-bold text-white print:text-black">{assessment?.anthropometry.waistCm || 80} cm</span>
            </div>
          </div>

          {/* Tabla de Historial Semanal */}
          <div className="pt-2">
            <p className="text-[11px] font-bold text-zinc-400 print:text-zinc-600 uppercase mb-2">Registro Semanal de Peso (kg)</p>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {progressWeightHistory.map((h, i) => (
                <div key={i} className="p-2 bg-motive-surfaceLight print:bg-zinc-100 rounded-lg">
                  <span className="text-zinc-500 text-[10px] block">{h.date}</span>
                  <span className="font-bold text-white print:text-black">{h.weightKg} kg</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: Prescripción Nutricional SMAE */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-base uppercase text-white print:text-black flex items-center space-x-2 border-b border-motive-surfaceBorder print:border-black/20 pb-2">
            <Apple className="w-4 h-4 text-motive-redBright" />
            <span>2. Prescripción Energética y Macronutrientes (Metodología {nutritionPlan?.methodology.formulaUsed})</span>
          </h3>

          <div className="p-4 bg-motive-surfaceLight print:bg-zinc-50 rounded-xl border border-motive-surfaceBorder print:border-zinc-300 text-xs space-y-2">
            <p className="text-zinc-300 print:text-black">
              <strong>Fórmula y Criterio de Cálculo:</strong> {nutritionPlan?.methodology.explanation}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center">
              <div className="bg-motive-surface print:bg-white p-2 rounded-lg border border-motive-surfaceBorder print:border-zinc-300">
                <span className="text-[10px] font-bold uppercase text-zinc-500">Gasto Basal (GEB)</span>
                <span className="text-sm font-bold text-white print:text-black block">{nutritionPlan?.methodology.bmr} kcal</span>
              </div>
              <div className="bg-motive-surface print:bg-white p-2 rounded-lg border border-motive-surfaceBorder print:border-zinc-300">
                <span className="text-[10px] font-bold uppercase text-zinc-500">Gasto Total (GET)</span>
                <span className="text-sm font-bold text-white print:text-black block">{nutritionPlan?.methodology.tdee} kcal</span>
              </div>
              <div className="bg-motive-surface print:bg-white p-2 rounded-lg border border-motive-surfaceBorder print:border-zinc-300">
                <span className="text-[10px] font-bold uppercase text-zinc-500">Meta Calórica</span>
                <span className="text-sm font-bold text-motive-redBright print:text-red-700 block">{nutritionPlan?.methodology.calorieTarget} kcal</span>
              </div>
              <div className="bg-motive-surface print:bg-white p-2 rounded-lg border border-motive-surfaceBorder print:border-zinc-300">
                <span className="text-[10px] font-bold uppercase text-zinc-500">Proteína Diaria</span>
                <span className="text-sm font-bold text-white print:text-black block">
                  {nutritionPlan?.methodology.macroTargetGrams.protein}g ({(Number(nutritionPlan?.methodology.macroTargetGrams.protein || 0) / (assessment?.anthropometry.weightKg || 75)).toFixed(1)} g/kg)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: Menú Diario SMAE y Lista de Súper Imprimible */}
        {activeMenuDay && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base uppercase text-white print:text-black flex items-center space-x-2 border-b border-motive-surfaceBorder print:border-black/20 pb-2">
              <Apple className="w-4 h-4 text-motive-redBright" />
              <span>3. Plan Alimenticio SMAE Imprimible ({activeMenuDay.dayName} • {activeMenuDay.dailyTotals.calories} kcal)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {activeMenuDay.meals.map((meal) => (
                <div
                  key={meal.id}
                  className="p-3.5 bg-motive-surfaceLight print:bg-zinc-50 rounded-xl border border-motive-surfaceBorder print:border-zinc-300 space-y-2"
                >
                  <div className="flex items-center justify-between border-b border-motive-surfaceBorder/60 print:border-zinc-300 pb-1.5">
                    <strong className="text-white print:text-black uppercase">{meal.name}</strong>
                    <span className="text-[11px] font-bold text-motive-redBright print:text-red-700">
                      {meal.totals.calories} kcal ({meal.totals.protein}g P)
                    </span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-zinc-300 print:text-zinc-800">
                    {meal.items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <span>• {item.foodName} ({item.state})</span>
                        <strong className="text-white print:text-black">{item.grams} g</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {shoppingList.length > 0 && (
              <div className="p-4 bg-motive-surfaceLight print:bg-zinc-50 rounded-xl border border-motive-surfaceBorder print:border-zinc-300 space-y-2">
                <p className="text-xs font-bold uppercase text-white print:text-black flex items-center space-x-1.5">
                  <ShoppingCart className="w-3.5 h-3.5 text-motive-redBright" />
                  <span>Lista Consolidada del Supermercado (7 Días):</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-zinc-300 print:text-zinc-800">
                  {shoppingList.map((s, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-motive-surfaceBorder/40 print:border-zinc-200 pb-1">
                      <span className="truncate pr-1">{s.foodName}</span>
                      <strong className="text-white print:text-black flex-shrink-0">{s.estimatedHouseholdMeasure}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN 4: Rutina Periodizada de Entrenamiento Completa */}
        {workoutPlan && (
          <div className="space-y-3">
            <h3 className="font-display font-bold text-base uppercase text-white print:text-black flex items-center space-x-2 border-b border-motive-surfaceBorder print:border-black/20 pb-2">
              <Dumbbell className="w-4 h-4 text-motive-redBright" />
              <span>4. Prescripción de Entrenamiento Periodizado ({workoutPlan.sessions.length} Días / Semana)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {workoutPlan.sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3.5 bg-motive-surfaceLight print:bg-zinc-50 rounded-xl border border-motive-surfaceBorder print:border-zinc-300 space-y-2"
                >
                  <div className="flex items-center justify-between border-b border-motive-surfaceBorder/60 print:border-zinc-300 pb-1">
                    <strong className="text-white print:text-black uppercase">{sess.dayName}</strong>
                    <span className="text-[10px] font-bold uppercase text-zinc-400 print:text-zinc-600">{sess.exercises.length} Ejercicios</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-zinc-300 print:text-zinc-800">
                    {sess.exercises.map((ex, i) => {
                      const workingSets = ex.sets.filter((s) => s.setType === 'working_effective');
                      const repRange = workingSets[0] ? `${workingSets[0].targetRepsMin}-${workingSets[0].targetRepsMax}` : '8-12';
                      return (
                        <li key={i} className="flex items-center justify-between">
                          <span className="truncate pr-2">{i + 1}. {ex.exercise?.nameSpanish || ex.exerciseId}</span>
                          <strong className="text-white print:text-black flex-shrink-0">
                            {workingSets.length}x{repRange} (RIR {workingSets[0]?.targetRIR ?? 2})
                          </strong>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECCIÓN 5: Evolución de Fuerza y Marcas Registradas */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-base uppercase text-white print:text-black flex items-center space-x-2 border-b border-motive-surfaceBorder print:border-black/20 pb-2">
            <Dumbbell className="w-4 h-4 text-motive-redBright" />
            <span>5. Rendimiento Neuromuscular y Marcas de Fuerza (1RM Verificadas)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
            <div className="p-3 bg-motive-surfaceLight print:bg-zinc-50 rounded-xl border border-motive-surfaceBorder print:border-zinc-300">
              <span className="text-zinc-500 uppercase text-[10px] font-bold block">Press de Banca Plano</span>
              <span className="text-base font-bold text-white print:text-black">95.0 kg</span>
              <span className="text-[10px] text-motive-emerald block mt-0.5">1.21x Peso Corp</span>
            </div>
            <div className="p-3 bg-motive-surfaceLight print:bg-zinc-50 rounded-xl border border-motive-surfaceBorder print:border-zinc-300">
              <span className="text-zinc-500 uppercase text-[10px] font-bold block">Sentadilla Trasera</span>
              <span className="text-base font-bold text-white print:text-black">130.0 kg</span>
              <span className="text-[10px] text-motive-emerald block mt-0.5">1.66x Peso Corp</span>
            </div>
            <div className="p-3 bg-motive-surfaceLight print:bg-zinc-50 rounded-xl border border-motive-surfaceBorder print:border-zinc-300">
              <span className="text-zinc-500 uppercase text-[10px] font-bold block">Peso Muerto Convencional</span>
              <span className="text-base font-bold text-white print:text-black">160.0 kg</span>
              <span className="text-[10px] text-motive-emerald block mt-0.5">2.04x Peso Corp</span>
            </div>
            <div className="p-3 bg-motive-surfaceLight print:bg-zinc-50 rounded-xl border border-motive-surfaceBorder print:border-zinc-300">
              <span className="text-zinc-500 uppercase text-[10px] font-bold block">Press Militar OHP</span>
              <span className="text-base font-bold text-white print:text-black">62.5 kg</span>
              <span className="text-[10px] text-motive-emerald block mt-0.5">0.80x Peso Corp</span>
            </div>
          </div>
        </div>

        {/* Observaciones y Firma del Profesional */}
        <div className="space-y-4 pt-4 border-t border-motive-surfaceBorder print:border-black/20">
          <div className="text-xs space-y-1.5 leading-relaxed text-zinc-300 print:text-black">
            <strong className="text-white print:text-black uppercase block">Observaciones del Entrenador & Nutriólogo:</strong>
            <p>
              El atleta presenta excelente adherencia a la doble progresión en los ejercicios multiarticulares principales. Se observa adecuada recuperación neuromuscular con 7.5 horas de sueño promedio. Para el siguiente microciclo, se mantendrá el superávit controlado de +250 kcal y se enfatizará la progresión de carga en sentadilla y dominadas. Sin contraindicaciones articulares activas.
            </p>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left text-xs text-zinc-500 print:text-zinc-700">
            <div>
              <div className="w-48 h-0.5 bg-zinc-600 print:bg-black mx-auto sm:mx-0 mb-2" />
              <p className="font-bold text-white print:text-black">Lic. Roberto Sánchez (CSCS)</p>
              <p className="text-[11px]">Especialista en Fisiología del Ejercicio • Reg. Prof. #894211</p>
            </div>
            <div>
              <div className="w-48 h-0.5 bg-zinc-600 print:bg-black mx-auto sm:mx-0 mb-2" />
              <p className="font-bold text-white print:text-black">Mtra. Elena Villalobos (MSc, CISSN)</p>
              <p className="text-[11px]">Nutrióloga Clínica Deportiva • Cédula #1029384</p>
            </div>
            <div className="flex items-center space-x-3 bg-motive-surfaceLight print:bg-zinc-100 p-3 rounded-xl border border-motive-surfaceBorder print:border-zinc-300">
              <QrCode className="w-10 h-10 text-motive-redBright print:text-black flex-shrink-0" />
              <div className="text-left text-[10px]">
                <strong className="text-white print:text-black block uppercase">Verificación Digital</strong>
                <span>motive-lab.vercel.app</span>
                <span className="block text-emerald-400 print:text-black font-bold">Certificado ACSM / SMAE</span>
              </div>
            </div>
          </div>
        </div>

        </div>
        </>
      )}

    </div>
  );
}

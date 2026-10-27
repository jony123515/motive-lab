'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/store/appState';
import { UserAssessment, Gender, PrimaryGoal, ActivityLevel, TrainingLocation } from '@/types';
import { evaluateClinicalSafety } from '@/lib/engines/safetyTriageEngine';
import { 
  ClipboardCheck, 
  User, 
  Target, 
  HeartPulse, 
  Dumbbell, 
  Utensils, 
  Moon, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Lock
} from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();
  const { assessment, saveAssessment } = useAppState();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Estado del formulario prellenado con datos del expediente o default
  const [formData, setFormData] = useState<UserAssessment>(
    assessment || {
      id: `ass-${Date.now()}`,
      userId: 'usr-demo-001',
      updatedAt: new Date().toISOString(),
      anthropometry: {
        age: 28,
        gender: 'male',
        heightCm: 175,
        weightKg: 75,
        waistCm: 80,
        hipCm: 95,
        bodyFatPercentage: undefined,
        recentWeightTrend: 'stable',
      },
      goal: {
        primary: 'hypertrophy',
        secondary: 'Aumentar fuerza y volumen muscular',
        priorityMuscles: ['pecho', 'espalda'],
        timeframeWeeks: 12,
        commitmentLevel: 'strict',
        previousObstacles: 'Falta de tiempo y desorganización en comidas',
      },
      clinical: {
        hasChestPainAtRestOrExercise: false,
        hasSyncopeOrDizziness: false,
        hasUncontrolledHypertension: false,
        hasKnownHeartMurmurOrDisease: false,
        diagnosedDiseases: [],
        currentMedications: [],
        knownAllergies: [],
        recentSurgeriesOrFractures: [],
        hasJointPainDuringExercise: false,
        jointPainLocations: [],
        functionalLimitations: '',
        hasSevereEatingDisorderHistory: false,
        digestiveIssues: [],
        medicalClearanceRequired: false,
        safetyObservations: [],
      },
      sports: {
        yearsTraining: 2,
        daysAvailable: 4,
        sessionDurationMinutes: 60,
        trainingLocation: 'gym',
        equipmentAvailable: ['barbell', 'dumbbells', 'cables', 'machines'],
        exerciseDiscomforts: [],
        additionalSports: '',
      },
      diet: {
        preferredMealsPerDay: 4,
        budgetLevel: 'economical',
        cookingTimeMinutes: 30,
        dietaryRestrictions: [],
        dislikedFoods: [],
        favoriteFoods: ['pollo', 'huevos', 'arroz', 'avena', 'frijoles', 'aguacate'],
        currentSupplements: ['Creatina', 'Proteína'],
        dailyWaterLitres: 2.5,
        trainingTime: 'afternoon',
      },
      activityRecovery: {
        occupationType: 'sedentary_desk',
        averageDailySteps: 7000,
        sleepHours: 7.5,
        sleepQuality: 'good',
        stressLevel: 'moderate',
      },
      consents: {
        privacyPolicyAccepted: true,
        sensitiveHealthDataConsent: true,
        termsAccepted: true,
        date: new Date().toISOString(),
      },
    }
  );

  const [triageAlert, setTriageAlert] = useState<string | null>(null);

  const handleNext = () => {
    // Si estamos en la sección clínica, evaluar banderas rojas en tiempo real
    if (currentStep === 3) {
      const triage = evaluateClinicalSafety(formData.clinical);
      if (!triage.canProceedWithAutomaticPlan) {
        setTriageAlert(triage.medicalReferralMessage || 'Banderas rojas clínicas detectadas.');
      } else {
        setTriageAlert(null);
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Guardar evaluación final
      saveAssessment(formData);
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-motive-red/10 border border-motive-red/30 text-motive-redBright text-xs font-bold uppercase">
          <ClipboardCheck className="w-4 h-4" />
          <span>Expediente Integral del Atleta</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase">
          Evaluación Inicial Multidisciplinaria
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
          Tus respuestas alimentan los motores fisiológicos y determinan la seguridad médica de la prescripción.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-4">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-300 mb-2">
          <span>Paso {currentStep} de {totalSteps}</span>
          <span className="text-motive-redBright">
            {currentStep === 1 && '1. Antropometría Fisiológica'}
            {currentStep === 2 && '2. Objetivo & Prioridades'}
            {currentStep === 3 && '3. Seguridad Clínica & PAR-Q+'}
            {currentStep === 4 && '4. Experiencia & Disponibilidad'}
            {currentStep === 5 && '5. Hábitos Nutricionales & SMAE'}
            {currentStep === 6 && '6. Privacidad & Consentimiento'}
          </span>
        </div>
        <div className="w-full bg-motive-surfaceBorder h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-motive-red to-motive-redBright h-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-6 sm:p-8 space-y-6">
        
        {/* STEP 1: Antropometría */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-display font-bold text-white uppercase flex items-center space-x-2">
              <User className="w-5 h-5 text-motive-redBright" />
              <span>A. Información Antropométrica Verificable</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Edad (Años)</label>
                <input
                  type="number"
                  min="16"
                  max="90"
                  value={formData.anthropometry.age}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      anthropometry: { ...formData.anthropometry, age: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Sexo Biológico (Para ecuaciones GEB)</label>
                <select
                  value={formData.anthropometry.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      anthropometry: { ...formData.anthropometry, gender: e.target.value as Gender },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                >
                  <option value="male">Masculino (Fórmula Mifflin +5 kcal)</option>
                  <option value="female">Femenino (Fórmula Mifflin -161 kcal)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Estatura (cm)</label>
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={formData.anthropometry.heightCm}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      anthropometry: { ...formData.anthropometry, heightCm: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Peso Corporal Actual (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="35"
                  max="250"
                  value={formData.anthropometry.weightKg}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      anthropometry: { ...formData.anthropometry, weightKg: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Porcentaje de Grasa Corporal (%) - <span className="text-zinc-500 font-normal">Opcional</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Sólo si cuentas con DEXA o plicometría válida"
                  value={formData.anthropometry.bodyFatPercentage || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      anthropometry: {
                        ...formData.anthropometry,
                        bodyFatPercentage: e.target.value ? Number(e.target.value) : undefined,
                      },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Si se omite, el sistema utilizará Mifflin-St Jeor en lugar de Katch-McArdle para evitar invenciones imprecisas.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Tendencia reciente de peso (Último mes)</label>
                <select
                  value={formData.anthropometry.recentWeightTrend}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      anthropometry: {
                        ...formData.anthropometry,
                        recentWeightTrend: e.target.value as any,
                      },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                >
                  <option value="stable">Estable (± 1 kg)</option>
                  <option value="increasing">En aumento progresivo</option>
                  <option value="decreasing">En disminución no intencionada</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Objetivo */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-display font-bold text-white uppercase flex items-center space-x-2">
              <Target className="w-5 h-5 text-motive-redBright" />
              <span>B. Objetivo Principal y Priorización Muscular</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">Meta Física Principal</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'hypertrophy', label: 'Hipertrofia Muscular', desc: 'Superávit moderado (+250 kcal) y alto volumen efectivo.' },
                  { id: 'fat_loss', label: 'Pérdida de Grasa', desc: 'Déficit del ~20% protegiendo masa magra y fuerza.' },
                  { id: 'recomposition', label: 'Recomposición Corporal', desc: 'Gana músculo y reduce grasa con aporte normocalórico.' },
                  { id: 'strength', label: 'Fuerza Máxima', desc: 'Prioridad neuromuscular con intensidades elevadas.' },
                  { id: 'endurance', label: 'Resistencia & Salud', desc: 'Capacidad aeróbica, vascular y equilibrio funcional.' },
                ].map((obj) => (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        goal: { ...formData.goal, primary: obj.id as PrimaryGoal },
                      })
                    }
                    className={`p-4 rounded-xl text-left border transition-all ${
                      formData.goal.primary === obj.id
                        ? 'bg-motive-red/15 border-motive-red text-white shadow-lg shadow-motive-red/20'
                        : 'bg-motive-surfaceLight border-motive-surfaceBorder text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <p className="font-bold text-sm text-white">{obj.label}</p>
                    <p className="text-xs text-zinc-400 mt-1 leading-snug">{obj.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Horizonte Temporal (Semanas del Mesociclo)</label>
                <select
                  value={formData.goal.timeframeWeeks}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      goal: { ...formData.goal, timeframeWeeks: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                >
                  <option value="6">6 Semanas (1 Bloque de acumulación + 1 Descarga)</option>
                  <option value="12">12 Semanas (2 Mesociclos estructurados)</option>
                  <option value="16">16 Semanas (Fase de transformación profunda)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Nivel de Compromiso y Disponibilidad</label>
                <select
                  value={formData.goal.commitmentLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      goal: { ...formData.goal, commitmentLevel: e.target.value as any },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                >
                  <option value="strict">Alto / Estricto (Pesaje de comida y registro diario)</option>
                  <option value="medium">Moderado / Flexible (Porciones en tazas y palmas)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Seguridad Clínica & PAR-Q+ */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-display font-bold text-white uppercase flex items-center space-x-2">
              <HeartPulse className="w-5 h-5 text-motive-redBright" />
              <span>C. Cuestionario Clínico de Seguridad (PAR-Q+ y Triaje)</span>
            </h3>

            <p className="text-xs text-zinc-400">
              Responde con total veracidad. Si existe algún síntoma cardiovascular o antecedente de riesgo, la plataforma detendrá la generación automática por tu propia integridad física.
            </p>

            <div className="space-y-3 bg-motive-surfaceLight/60 p-4 rounded-xl border border-motive-surfaceBorder">
              {[
                {
                  id: 'hasChestPainAtRestOrExercise',
                  label: '¿Has experimentado dolor u opresión en el pecho durante el reposo o al hacer ejercicio?',
                  sub: 'Indicador cardiovascular de alarma primaria.',
                },
                {
                  id: 'hasSyncopeOrDizziness',
                  label: '¿Has sufrido desmayos, pérdida del conocimiento o mareos intensos durante el esfuerzo físico?',
                  sub: 'Posible alteración hemodinámica o reflejo vasovagal.',
                },
                {
                  id: 'hasUncontrolledHypertension',
                  label: '¿Padeces hipertensión arterial NO controlada por tratamiento médico?',
                  sub: 'Riesgo ante picos tensionales en esfuerzos isométricos (maniobra de Valsalva).',
                },
                {
                  id: 'hasSevereEatingDisorderHistory',
                  label: '¿Tienes antecedentes diagnosticados de anorexia, bulimia o conductas alimentarias de riesgo?',
                  sub: 'Excluye la prescripción de déficit calórico estricto sin supervisión multidisciplinaria.',
                },
              ].map((item) => (
                <div key={item.id} className="flex items-start justify-between py-2 border-b border-motive-surfaceBorder/60 last:border-0">
                  <div className="pr-4">
                    <p className="text-xs font-semibold text-zinc-200">{item.label}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{item.sub}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          clinical: { ...formData.clinical, [item.id]: false },
                        })
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        !(formData.clinical as any)[item.id]
                          ? 'bg-motive-emerald/20 text-motive-emerald border border-motive-emerald/40'
                          : 'bg-motive-surface text-zinc-400'
                      }`}
                    >
                      NO
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          clinical: { ...formData.clinical, [item.id]: true },
                        })
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        (formData.clinical as any)[item.id]
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-motive-surface text-zinc-400'
                      }`}
                    >
                      SÍ
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Dolor Articular */}
            <div className="pt-2">
              <label className="flex items-center space-x-2 text-xs font-semibold text-zinc-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.clinical.hasJointPainDuringExercise}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clinical: { ...formData.clinical, hasJointPainDuringExercise: e.target.checked },
                    })
                  }
                  className="rounded border-motive-surfaceBorder text-motive-red focus:ring-0"
                />
                <span>¿Presentas dolor articular o muscular crónico en algún ejercicio?</span>
              </label>

              {formData.clinical.hasJointPainDuringExercise && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Ejemplo: Hombro derecho en press de banca, rodilla izquierda en sentadilla profunda"
                    value={formData.clinical.functionalLimitations}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinical: { ...formData.clinical, functionalLimitations: e.target.value },
                      })
                    }
                    className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-motive-red"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    El motor de entrenamiento filtrará ejercicios lesivos para esa articulación específica.
                  </p>
                </div>
              )}
            </div>

            {triageAlert && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
                <p className="leading-relaxed">{triageAlert}</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Experiencia Deportiva */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-display font-bold text-white uppercase flex items-center space-x-2">
              <Dumbbell className="w-5 h-5 text-motive-redBright" />
              <span>D. Experiencia Deportiva y Distribución Semanal</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Años Entrenando con Sobrecargas</label>
                <select
                  value={formData.sports.yearsTraining}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sports: { ...formData.sports, yearsTraining: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                >
                  <option value="0">Principiante (0 a 6 meses)</option>
                  <option value="1">Intermedio Inicial (6 meses a 2 años)</option>
                  <option value="3">Intermedio Avanzado (2 a 5 años)</option>
                  <option value="6">Avanzado (&gt; 5 años)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Días Disponibles por Semana</label>
                <select
                  value={formData.sports.daysAvailable}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sports: { ...formData.sports, daysAvailable: Number(e.target.value) as any },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                >
                  <option value="2">2 Días (Full Body A/B)</option>
                  <option value="3">3 Días (Full Body A/B/C)</option>
                  <option value="4">4 Días (Torso / Pierna) - Recomendado</option>
                  <option value="5">5 Días (Torso / Pierna + Especialización)</option>
                  <option value="6">6 Días (Empuje / Tirón / Piernas x 2)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Lugar y Equipamiento</label>
                <select
                  value={formData.sports.trainingLocation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sports: { ...formData.sports, trainingLocation: e.target.value as TrainingLocation },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                >
                  <option value="gym">Gimnasio Comercial Completo (Barras, Mancuernas, Poleas, Máquinas)</option>
                  <option value="home_dumbbells">Casa con Mancuernas y Banco Ajustable</option>
                  <option value="home_minimal">Casa con Peso Corporal y Bandas de Resistencia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Duración Deseada por Sesión</label>
                <select
                  value={formData.sports.sessionDurationMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sports: { ...formData.sports, sessionDurationMinutes: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                >
                  <option value="45">45 Minutos (Sesiones densas)</option>
                  <option value="60">60 Minutos (Estándar equilibrado)</option>
                  <option value="75">75 Minutos (Óptimo para descansos completos 2-3 min)</option>
                  <option value="90">90 Minutos</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Hábitos Nutricionales & SMAE */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-lg font-display font-bold text-white uppercase flex items-center space-x-2">
              <Utensils className="w-5 h-5 text-motive-redBright" />
              <span>E. Hábitos Alimentarios & Presupuesto (SMAE México)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Número Preferido de Comidas al Día</label>
                <select
                  value={formData.diet.preferredMealsPerDay}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      diet: { ...formData.diet, preferredMealsPerDay: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                >
                  <option value="3">3 Comidas Principales</option>
                  <option value="4">4 Tiempos (3 Comidas + 1 Colación Pre/Post)</option>
                  <option value="5">5 Tiempos (3 Comidas + 2 Snacks)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Presupuesto y Accesibilidad</label>
                <select
                  value={formData.diet.budgetLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      diet: { ...formData.diet, budgetLevel: e.target.value as any },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                >
                  <option value="economical">Económico (Huevos, pollo, frijoles, arroz, tortillas, avena, nopales)</option>
                  <option value="moderate">Moderado (Incluye cortes magros de res, yogur griego, atún, panela)</option>
                  <option value="flexible">Flexible (Salmón, suplementos premium, frutos secos importados)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Horario Habitual de Entrenamiento</label>
                <select
                  value={formData.diet.trainingTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      diet: { ...formData.diet, trainingTime: e.target.value as any },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                >
                  <option value="morning">Mañana (06:00 - 09:00)</option>
                  <option value="noon">Mediodía (12:00 - 14:00)</option>
                  <option value="afternoon">Tarde (16:00 - 19:00)</option>
                  <option value="evening">Noche (20:00 - 22:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Consumo Diario Estimado de Agua (Litros)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.diet.dailyWaterLitres}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      diet: { ...formData.diet, dailyWaterLitres: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-motive-red"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Privacidad & Consentimiento */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h3 className="text-lg font-display font-bold text-white uppercase flex items-center space-x-2">
              <Lock className="w-5 h-5 text-motive-redBright" />
              <span>F. Marco Legal, Consentimiento Clínico & Derechos ARCO</span>
            </h3>

            <div className="p-4 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder text-xs text-zinc-300 space-y-3 leading-relaxed">
              <p>
                De conformidad con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (México)</strong>, tus datos sobre salud, medidas corporales y hábitos constituyen información sensible y serán tratados exclusivamente para generar tus recomendaciones fisiológicas bajo cifrado y aislamiento estricto (Row Level Security).
              </p>
              <p>
                Ningún otro usuario ni entidad comercial tendrá acceso a tu historial. Puedes ejercer tus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) en cualquier momento desde tu panel de usuario.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start space-x-3 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consents.termsAccepted}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      consents: { ...formData.consents, termsAccepted: e.target.checked },
                    })
                  }
                  className="mt-0.5 rounded border-motive-surfaceBorder text-motive-red focus:ring-0"
                />
                <span>Acepto los Términos de Servicio y Metodología de Prescripción Deportiva MOTIVE LAB.</span>
              </label>

              <label className="flex items-start space-x-3 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consents.sensitiveHealthDataConsent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      consents: { ...formData.consents, sensitiveHealthDataConsent: e.target.checked },
                    })
                  }
                  className="mt-0.5 rounded border-motive-surfaceBorder text-motive-red focus:ring-0"
                />
                <span className="font-semibold text-white">
                  Otorgo mi consentimiento explícito y separado para el tratamiento confidencial de mis datos sensibles de salud física y nutricional.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-motive-surfaceBorder/60">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder text-xs font-bold text-zinc-300 hover:text-white uppercase transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-motive-red to-motive-redDark text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-motive-red/30 hover:scale-[1.02] transition-transform"
          >
            <span>{currentStep === totalSteps ? 'Finalizar y Generar Plan' : 'Continuar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}

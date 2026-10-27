'use client';

import React, { useState } from 'react';
import { useAppState } from '@/lib/store/appState';
import { 
  UserCheck, 
  Dumbbell, 
  Apple, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Video, 
  MessageSquare, 
  AlertCircle,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';

export default function CoachPortalPage() {
  const { currentUser, coachFeedbackList, reviewCoachFeedback, assessment, workoutPlan, nutritionPlan } = useAppState();

  const [activeTab, setActiveTab] = useState<'pending_reviews' | 'athletes' | 'approvals'>('pending_reviews');
  const [replyText, setReplyText] = useState('');
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(coachFeedbackList[0]?.id || null);

  const isSpecialist = currentUser.role === 'coach' || currentUser.role === 'nutritionist' || currentUser.role === 'admin';

  if (!isSpecialist) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-display font-black text-white uppercase">Acceso Restringido para Especialistas</h2>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          Esta vista está reservada para Coaches Certificados, Nutriólogos Clínicos y Administradores de MOTIVE LAB.
        </p>
        <p className="text-xs text-zinc-500">
          Tip: Puedes cambiar tu rol en cualquier momento desde el selector superior de la barra de navegación para evaluar esta interfaz.
        </p>
      </div>
    );
  }

  const handleSendFeedback = (id: string) => {
    if (replyText.trim()) {
      reviewCoachFeedback(id, replyText);
      setReplyText('');
      alert('Respuesta y ajustes técnicos enviados al atleta exitosamente.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-motive-red/15 text-motive-redBright border border-motive-red/30 text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>Portal Clínico y de Alto Rendimiento</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
            Panel del Coach & Nutriólogo Deportivo
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Gestión de atletas autorizados, aprobación de menús SMAE, revisión técnica de videos y supervisión de sobrecarga progresiva.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-motive-surfaceLight border border-motive-surfaceBorder px-4 py-2.5 rounded-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-motive-emerald animate-pulse" />
          <span className="font-bold text-white capitalize">{currentUser.role}:</span>
          <span className="text-zinc-300">{currentUser.name}</span>
        </div>
      </div>

      {/* Tabs de Navegación del Panel */}
      <div className="flex items-center space-x-2 border-b border-motive-surfaceBorder pb-2">
        <button
          onClick={() => setActiveTab('pending_reviews')}
          className={`px-5 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'pending_reviews'
              ? 'bg-motive-red text-white'
              : 'text-zinc-400 hover:text-white hover:bg-motive-surface'
          }`}
        >
          <span>Revisiones Pendientes ({coachFeedbackList.filter(f => f.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('athletes')}
          className={`px-5 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'athletes'
              ? 'bg-motive-red text-white'
              : 'text-zinc-400 hover:text-white hover:bg-motive-surface'
          }`}
        >
          <span>Atletas Asignados (3)</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-5 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'approvals'
              ? 'bg-motive-red text-white'
              : 'text-zinc-400 hover:text-white hover:bg-motive-surface'
          }`}
        >
          <span>Aprobación de Planes & Fórmulas</span>
        </button>
      </div>

      {/* TAB 1: Revisiones Pendientes (Videos y feedback) */}
      {activeTab === 'pending_reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Lista de solicitudes */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Solicitudes de los atletas</p>
            {coachFeedbackList.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedReviewId(item.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedReviewId === item.id
                    ? 'bg-motive-surfaceLight border-motive-red'
                    : 'bg-motive-surface border-motive-surfaceBorder hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{item.clientName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.status === 'pending'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-motive-emerald/10 text-motive-emerald'
                  }`}>
                    {item.status === 'pending' ? 'Por Revisar' : 'Revisado'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{item.message}</p>
                <span className="text-[10px] text-zinc-500 block mt-2">{item.date}</span>
              </div>
            ))}
          </div>

          {/* Panel de Respuesta y Revisión Técnica */}
          <div className="lg:col-span-2 bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-motive-surfaceBorder/60 pb-4">
              <span className="text-xs font-bold text-motive-redBright uppercase tracking-wider">Detalle de Revisión Biomecánica</span>
              <h3 className="text-xl font-display font-black text-white uppercase mt-1">
                Atleta: Alejandro Morales
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Material adjunto: Sentadilla con barra trasera (80 kg x 8 reps). Notó leve fatiga en la serie 3.
              </p>
            </div>

            {/* Checklist Técnico del Coach */}
            <div className="space-y-3 bg-motive-surfaceLight p-4 rounded-xl border border-motive-surfaceBorder text-xs">
              <p className="font-bold text-white uppercase">Guía de Puntos Técnicos Observables (Coach CSCS):</p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-zinc-300">
                  <input type="checkbox" defaultChecked className="rounded border-motive-surfaceBorder text-motive-red focus:ring-0" />
                  <span>Profundidad válida: pliegue de la cadera rebasa el paralelo de la rótula.</span>
                </label>
                <label className="flex items-center space-x-2 text-zinc-300">
                  <input type="checkbox" defaultChecked className="rounded border-motive-surfaceBorder text-motive-red focus:ring-0" />
                  <span>Trayectoria de la barra vertical centrada sobre el mediopié.</span>
                </label>
                <label className="flex items-center space-x-2 text-zinc-300">
                  <input type="checkbox" defaultChecked className="rounded border-motive-surfaceBorder text-motive-red focus:ring-0" />
                  <span>Control de rodillas: sin colapso en valgo durante la fase concéntrica.</span>
                </label>
                <label className="flex items-center space-x-2 text-zinc-300">
                  <input type="checkbox" className="rounded border-motive-surfaceBorder text-motive-red focus:ring-0" />
                  <span>Tempo excéntrico: requiere 0.5s más de control en el descenso de la serie 3.</span>
                </label>
              </div>
            </div>

            {/* Formulario de Respuesta del Profesional */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-white uppercase">
                Devolución Técnica y Ajuste de Cargas
              </label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe tu recomendación al atleta: ajustes de tempo, colocación de pies o confirmación de incremento de carga..."
                className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl p-3 text-xs text-white focus:outline-none focus:border-motive-red"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => selectedReviewId && handleSendFeedback(selectedReviewId)}
                  className="px-6 py-2.5 rounded-xl bg-motive-red text-white text-xs font-bold uppercase tracking-wider hover:bg-motive-redDark transition-colors shadow-lg shadow-motive-red/20"
                >
                  Enviar Devolución al Atleta
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: Atletas Asignados */}
      {activeTab === 'athletes' && (
        <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-motive-surfaceBorder/60 pb-4">
            <h3 className="text-lg font-display font-bold text-white uppercase">Directorio de Atletas en Seguimiento</h3>
            <span className="text-xs text-zinc-400">Total: 3 Atletas</span>
          </div>

          <div className="divide-y divide-motive-surfaceBorder/60">
            {[
              { name: 'Alejandro Morales', age: 28, goal: 'Hipertrofia Muscular', adherence: '96%', status: 'Al día', plan: '4 Días Torso/Pierna' },
              { name: 'Mariana Silva', age: 31, goal: 'Pérdida de Grasa', adherence: '91%', status: 'Sustitución pendiente', plan: '4 Días Torso/Pierna' },
              { name: 'Carlos Mendoza', age: 24, goal: 'Fuerza Neuromuscular', adherence: '98%', status: 'Al día', plan: '3 Días Full Body' },
            ].map((at, idx) => (
              <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-sm">{at.name}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {at.age} Años • Meta: <strong className="text-zinc-200">{at.goal}</strong> • Plan: {at.plan}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right text-xs">
                    <span className="text-zinc-500 uppercase text-[10px] block font-bold">Adherencia</span>
                    <span className="font-bold text-motive-emerald">{at.adherence}</span>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-motive-surfaceLight border border-motive-surfaceBorder text-xs font-bold text-zinc-300 hover:text-white">
                    Ver Expediente
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Aprobación de Planes */}
      {activeTab === 'approvals' && (
        <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-6 space-y-6">
          <div className="border-b border-motive-surfaceBorder/60 pb-4">
            <h3 className="text-lg font-display font-bold text-white uppercase">Validación de Metodologías & Seguridad</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Revisión de fórmulas de cálculo basal ({nutritionPlan?.methodology.formulaUsed}) y prescripción de volumen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-motive-surfaceLight rounded-xl border border-motive-surfaceBorder space-y-3 text-xs">
              <span className="font-bold text-white uppercase block">Plan Nutricional SMAE Activo:</span>
              <p className="text-zinc-300">Gasto Basal: {nutritionPlan?.methodology.bmr} kcal | Meta: {nutritionPlan?.methodology.calorieTarget} kcal</p>
              <p className="text-zinc-400">Proteínas: {nutritionPlan?.methodology.macroTargetGrams.protein}g ({((nutritionPlan?.methodology.macroTargetGrams.protein || 0) / 78.5).toFixed(1)} g/kg peso corporal)</p>
              <div className="pt-2 flex items-center space-x-2 text-motive-emerald font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Dentro de los rangos de seguridad ISSN y guías alimentarias mexicanas.</span>
              </div>
            </div>

            <div className="p-4 bg-motive-surfaceLight rounded-xl border border-motive-surfaceBorder space-y-3 text-xs">
              <span className="font-bold text-white uppercase block">Plan de Entrenamiento ACSM 2026:</span>
              <p className="text-zinc-300">Mesociclo: {workoutPlan?.title}</p>
              <p className="text-zinc-400">Volumen semanal: 12-16 series efectivas por grupo muscular con 1-2 RIR.</p>
              <div className="pt-2 flex items-center space-x-2 text-motive-emerald font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Estratificación PAR-Q+ sin banderas rojas cardiovasculares.</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

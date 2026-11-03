'use client';

import React, { useState } from 'react';
import { useAppState } from '@/lib/store/appState';
import { EXERCISE_DATABASE } from '@/lib/data/exerciseDatabase';
import { ExerciseDefinition, MuscleGroup, PrescribedSet } from '@/types';
import { evaluateDoubleProgression } from '@/lib/engines/progressionEngine';
import { 
  uploadAthleteMedia, 
  listAthleteMedia, 
  deleteAthleteMedia, 
  MediaFileItem 
} from '@/lib/supabase/storage';
import { 
  Dumbbell, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Video, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  X, 
  Play, 
  RotateCcw, 
  ShieldAlert, 
  Info,
  Upload,
  Trash2,
  Film,
  Heart,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { AssessmentGate } from '@/components/auth/AssessmentGate';
import { ABDOMINAL_ROUTINES } from '@/lib/data/abdominalRoutines';
import { CARDIO_PROTOCOLS, calculateHeartRateZones } from '@/lib/data/cardioProtocols';

export default function TrainingPage() {
  const { currentUser, workoutPlan, saveLoggedWorkout } = useAppState();

  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const [trainingSection, setTrainingSection] = useState<'sessions' | 'abs' | 'cardio'>('sessions');
  const [activeAbsRoutineId, setActiveAbsRoutineId] = useState<string>('ab-hypertrophy-3d');
  const [cardioAge, setCardioAge] = useState<number>(26);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<ExerciseDefinition | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string>('todos');

  // Estado para gestión de videos en Supabase Storage
  const [uploadedVideos, setUploadedVideos] = useState<MediaFileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [hasMediaConsent, setHasMediaConsent] = useState(true);
  const [activePlayingVideo, setActivePlayingVideo] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const loadAthleteVideos = async () => {
    if (currentUser?.id) {
      const videos = await listAthleteMedia(currentUser.id, 'videos');
      setUploadedVideos(videos);
    }
  };

  const handleOpenVideoModal = () => {
    setVideoModalOpen(true);
    loadAthleteVideos();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!hasMediaConsent) {
      setUploadError('Debes otorgar tu consentimiento explícito para procesar el video biomecánico.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const res = await uploadAthleteMedia(file, currentUser.id, 'videos');
    if (res.error) {
      setUploadError(res.error);
    } else {
      await loadAthleteVideos();
      if (res.signedUrl) {
        setActivePlayingVideo(res.signedUrl);
      }
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteVideo = async (fileName: string) => {
    if (confirm('¿Deseas eliminar este video de tu expediente privado?')) {
      const fullPath = `${currentUser.id}/videos/${fileName}`;
      await deleteAthleteMedia(fullPath);
      await loadAthleteVideos();
      if (activePlayingVideo) setActivePlayingVideo(null);
    }
  };

  // Interactive Live Set Logger
  const [loggedSets, setLoggedSets] = useState<Record<string, { reps: number; weight: number; rir: number; pain: boolean; done: boolean }>>({
    'ex-0-set-0': { reps: 8, weight: 70, rir: 2, pain: false, done: true },
    'ex-0-set-1': { reps: 8, weight: 70, rir: 2, pain: false, done: true },
    'ex-0-set-2': { reps: 8, weight: 70, rir: 2, pain: false, done: true },
  });

  const [progressionAlert, setProgressionAlert] = useState<string | null>(null);

  // Cronómetro de Descanso Inteligente (Modo Entrenamiento en Vivo)
  const [restSecondsLeft, setRestSecondsLeft] = useState<number>(0);
  const [restTotalSeconds, setRestTotalSeconds] = useState<number>(90);
  const [isRestRunning, setIsRestRunning] = useState<boolean>(false);
  const [restLabel, setRestLabel] = useState<string>('Listo para iniciar descanso');
  const [restFinishedBanner, setRestFinishedBanner] = useState<boolean>(false);

  const playRestFinishedChime = () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.14);
          gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.14);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.14 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.14);
          osc.stop(ctx.currentTime + i * 0.14 + 0.26);
        });
      }
    } catch {
      // Ignore audio errors if blocked by browser autoplay policy
    }
  };

  React.useEffect(() => {
    if (!isRestRunning || restSecondsLeft <= 0) return;
    const interval = setInterval(() => {
      setRestSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRestRunning(false);
          setRestFinishedBanner(true);
          playRestFinishedChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRestRunning, restSecondsLeft]);

  const startRestTimer = (seconds: number, label?: string) => {
    setRestTotalSeconds(seconds);
    setRestSecondsLeft(seconds);
    setIsRestRunning(true);
    setRestFinishedBanner(false);
    if (label) setRestLabel(label);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const activeSession = workoutPlan?.sessions[activeSessionIndex] || workoutPlan?.sessions[0];

  const handleSetUpdate = (
    setId: string,
    reps: number,
    weight: number,
    rir: number,
    pain: boolean,
    restSeconds = 120,
    exerciseName = 'Serie Completada'
  ) => {
    setLoggedSets(prev => ({
      ...prev,
      [setId]: { reps, weight, rir, pain, done: true }
    }));

    startRestTimer(restSeconds, `${exerciseName} (${weight} kg × ${reps} reps)`);

    // Evaluar sobrecarga progresiva
    const mockPrescribed: PrescribedSet = {
      setNumber: 1,
      setType: 'working_effective',
      targetRepsMin: 6,
      targetRepsMax: 8,
      targetRIR: 2,
      restSeconds,
    };

    const currentSets = Object.values({
      ...loggedSets,
      [setId]: { reps, weight, rir, pain, done: true }
    }).map((s, idx) => ({
      setNumber: idx + 1,
      setType: 'working_effective' as const,
      weightKg: s.weight,
      repsCompleted: s.reps,
      actualRIR: s.rir,
      perceivedPain: s.pain,
    }));

    const result = evaluateDoubleProgression(mockPrescribed, currentSets, 'upper');
    setProgressionAlert(result.reason);
  };

  const filteredExercises = selectedMuscleFilter === 'todos'
    ? EXERCISE_DATABASE
    : EXERCISE_DATABASE.filter(e => e.primaryMuscle === selectedMuscleFilter);

  return (
    <AssessmentGate featureName="tu Rutina de Entrenamiento Personalizada">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-motive-red/15 text-motive-redBright border border-motive-red/30 text-xs font-bold uppercase tracking-wider">
            <Dumbbell className="w-4 h-4" />
            <span>Fisiología del Ejercicio & ACSM 2026</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
            Motor de Entrenamiento & Sobrecarga Progresiva
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Periodización basada en volumen efectivo, diferenciación rigurosa entre series de aproximación y series efectivas, y autorregulación por RIR (*Reps in Reserve*).
          </p>
        </div>

        <button
          onClick={handleOpenVideoModal}
          className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder text-xs font-bold text-white uppercase tracking-wider hover:border-motive-red transition-all shadow-lg"
        >
          <Video className="w-4 h-4 text-motive-redBright" />
          <span>Subir Video para Revisión Técnica</span>
        </button>
      </div>

      {/* Selector de Sección de Entrenamiento: Pesas / Abdomen / Cardio */}
      <div className="flex items-center space-x-2 bg-motive-surface border border-motive-surfaceBorder p-1.5 rounded-2xl w-full max-w-2xl overflow-x-auto shadow-lg">
        <button
          onClick={() => setTrainingSection('sessions')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 whitespace-nowrap ${
            trainingSection === 'sessions'
              ? 'bg-gradient-to-r from-motive-red to-motive-redDark text-white shadow-md shadow-motive-red/30'
              : 'text-zinc-400 hover:text-white hover:bg-motive-surfaceLight'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          <span>Rutina de Pesas ({workoutPlan?.sessions.length || 6} Días)</span>
        </button>

        <button
          onClick={() => setTrainingSection('abs')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 whitespace-nowrap ${
            trainingSection === 'abs'
              ? 'bg-gradient-to-r from-motive-red to-motive-redDark text-white shadow-md shadow-motive-red/30'
              : 'text-zinc-400 hover:text-white hover:bg-motive-surfaceLight'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Rutinas de Abdomen</span>
        </button>

        <button
          onClick={() => setTrainingSection('cardio')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 whitespace-nowrap ${
            trainingSection === 'cardio'
              ? 'bg-gradient-to-r from-motive-red to-motive-redDark text-white shadow-md shadow-motive-red/30'
              : 'text-zinc-400 hover:text-white hover:bg-motive-surfaceLight'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cardio Quema Grasa</span>
        </button>
      </div>

      {/* 1. SECCIÓN DE PESAS / SESIONES DEL MESOCICLO */}
      {trainingSection === 'sessions' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Selector de Sesiones del Mesociclo */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {workoutPlan?.sessions.map((session, sIdx) => (
              <button
                key={session.id}
                onClick={() => setActiveSessionIndex(sIdx)}
                className={`flex-shrink-0 px-5 py-3 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all border ${
                  activeSessionIndex === sIdx
                    ? 'bg-motive-red border-motive-redBright text-white shadow-lg shadow-motive-red/30'
                    : 'bg-motive-surface border-motive-surfaceBorder text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span>{session.dayName}</span>
                <span className="block text-[10px] font-normal opacity-80 mt-0.5">{session.exercises.length} Ejercicios</span>
              </button>
            ))}
          </div>

          {/* Sesión Activa con Calentamiento y Ejercicios */}
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-motive-surfaceBorder/60 pb-5">
              <div>
                <span className="text-xs font-bold text-motive-redBright uppercase tracking-wider block">Sesión en Curso</span>
                <h3 className="text-2xl font-display font-black text-white uppercase">{activeSession?.dayName}</h3>
              </div>
              <div className="flex items-center space-x-2 text-xs text-zinc-400">
                <span className="px-3 py-1 rounded-lg bg-motive-surfaceLight border border-motive-surfaceBorder font-semibold">
                  Split: {activeSession?.splitType.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-lg bg-motive-surfaceLight border border-motive-surfaceBorder font-semibold">
                  RIR Sugerido: 1 a 2
                </span>
              </div>
            </div>

            {/* Protocolo de Calentamiento Específico */}
            <div className="bg-motive-surfaceLight/70 border border-motive-surfaceBorder rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Protocolo de Calentamiento Dinámico & Activación</span>
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-zinc-300">
                {activeSession?.warmupRoutine.map((w, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CRONÓMETRO DE DESCANSO INTELIGENTE (MODO ENTRENAMIENTO EN VIVO) */}
            <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
              restFinishedBanner
                ? 'bg-emerald-500/15 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                : isRestRunning
                ? 'bg-motive-red/10 border-motive-red/40 shadow-lg shadow-motive-red/10'
                : 'bg-motive-surfaceLight border-motive-surfaceBorder'
            }`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-display font-black text-base ${
                    restFinishedBanner
                      ? 'bg-emerald-500 text-black'
                      : isRestRunning
                      ? 'bg-motive-red text-white animate-pulse'
                      : 'bg-motive-surface border border-motive-surfaceBorder text-zinc-300'
                  }`}>
                    {restSecondsLeft > 0 ? formatTimer(restSecondsLeft) : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-motive-redBright">
                        Cronómetro Fisiológico de Descanso (ATP-PCr)
                      </span>
                      {isRestRunning && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-motive-red text-white">
                          En Curso
                        </span>
                      )}
                      {restFinishedBanner && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500 text-black">
                          ¡Listo para la siguiente serie!
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-white mt-0.5">
                      {restFinishedBanner
                        ? '🔔 ¡Descanso completado! Tu fosfocreatina muscular está recuperada al 90%.'
                        : restSecondsLeft > 0
                        ? `Recuperando: ${restLabel}`
                        : 'Al marcar cualquier serie como "Registrar", el cronómetro iniciará automáticamente.'}
                    </p>
                  </div>
                </div>

                {/* Controles Rápidos del Cronómetro */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { sec: 60, label: '60s (Aislamiento)' },
                    { sec: 90, label: '90s (Hipertrofia)' },
                    { sec: 120, label: '2m (Compuesto)' },
                    { sec: 180, label: '3m (Fuerza)' },
                  ].map((preset) => (
                    <button
                      key={preset.sec}
                      type="button"
                      onClick={() => startRestTimer(preset.sec, `Descanso Manual (${preset.label})`)}
                      className="px-2.5 py-1.5 rounded-lg bg-motive-surface border border-motive-surfaceBorder hover:border-motive-red text-[11px] font-bold text-zinc-300 hover:text-white transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}

                  {restSecondsLeft > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setRestSecondsLeft((prev) => Math.max(5, prev - 15))}
                        className="px-2 py-1.5 rounded-lg bg-motive-surface border border-motive-surfaceBorder text-[11px] font-bold text-zinc-400 hover:text-white"
                      >
                        -15s
                      </button>
                      <button
                        type="button"
                        onClick={() => setRestSecondsLeft((prev) => prev + 15)}
                        className="px-2 py-1.5 rounded-lg bg-motive-surface border border-motive-surfaceBorder text-[11px] font-bold text-zinc-400 hover:text-white"
                      >
                        +15s
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRestRunning(!isRestRunning)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-[11px] font-bold text-amber-300 hover:bg-amber-500/30"
                      >
                        {isRestRunning ? 'Pausar' : 'Reanudar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsRestRunning(false);
                          setRestSecondsLeft(0);
                          setRestFinishedBanner(false);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-[11px] font-bold text-rose-300 hover:bg-rose-500/25"
                      >
                        Omitir
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Barra de Progreso del Descanso */}
              {restSecondsLeft > 0 && (
                <div className="w-full bg-motive-surface h-1.5 rounded-full overflow-hidden mt-3">
                  <div
                    className="bg-gradient-to-r from-motive-red to-amber-400 h-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (restSecondsLeft / Math.max(1, restTotalSeconds)) * 100)}%` }}
                  />
                </div>
              )}
            </div>

            {/* Sugerencia de Sobrecarga Progresiva */}
            {progressionAlert && (
              <div className="p-4 rounded-xl bg-motive-red/10 border border-motive-red/30 flex items-start space-x-3 text-xs">
                <Sparkles className="w-5 h-5 text-motive-redBright flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white uppercase">Evaluación del Algoritmo de Doble Progresión</p>
                  <p className="text-zinc-300 leading-relaxed">{progressionAlert}</p>
                </div>
              </div>
            )}

            {/* Lista de Ejercicios de la Sesión */}
            <div className="space-y-6">
              {activeSession?.exercises.map((item, exIdx) => (
                <div
                  key={item.exerciseId}
                  className="bg-motive-surfaceLight border border-motive-surfaceBorder rounded-2xl p-5 space-y-4 hover:border-zinc-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-xl bg-motive-surface border border-motive-surfaceBorder flex items-center justify-center text-xs font-display font-bold text-zinc-300">
                        #{exIdx + 1}
                      </span>
                      <div>
                        <h4 className="text-base font-display font-bold text-white flex items-center space-x-2">
                          <span>{item.exercise?.nameSpanish || item.exerciseId}</span>
                          <button
                            onClick={() => setSelectedExerciseForModal(item.exercise)}
                            className="p-1 hover:text-motive-redBright text-zinc-500 transition-colors"
                            title="Ver especificación biomecánica"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </h4>
                        <span className="text-xs text-zinc-400 capitalize">
                          {item.exercise?.primaryMuscle} • {item.exercise?.movementPattern.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-zinc-400">
                      <span className="px-2.5 py-1 rounded-lg bg-motive-surface border border-motive-surfaceBorder">
                        {item.sets.length} Series Prescritas
                      </span>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="p-3 rounded-xl bg-motive-surface/60 border border-motive-surfaceBorder/60 text-xs text-zinc-300 flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{item.notes}</span>
                    </div>
                  )}

                  {/* Tabla Interactiva de Series */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-zinc-300">
                      <thead className="text-[11px] uppercase tracking-wider text-zinc-400 border-b border-motive-surfaceBorder">
                        <tr>
                          <th className="py-2">Serie</th>
                          <th className="py-2">Tipo</th>
                          <th className="py-2">Rango Objetivo</th>
                          <th className="py-2">Carga (kg)</th>
                          <th className="py-2">Reps</th>
                          <th className="py-2">RIR</th>
                          <th className="py-2 text-center">Dolor</th>
                          <th className="py-2 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-motive-surfaceBorder/40">
                        {item.sets.map((set, sIdx) => {
                          const setId = `ex-${exIdx}-set-${sIdx}`;
                          const log = loggedSets[setId];
                          const isDone = log?.done;

                          return (
                            <tr key={sIdx} className={isDone ? 'bg-emerald-500/5' : ''}>
                              <td className="py-2.5 font-bold text-white">{set.setNumber}</td>
                              <td className="py-2.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  set.setType === 'warmup_approximation'
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    : 'bg-motive-red/10 text-motive-redBright border border-motive-red/20'
                                }`}>
                                  {set.setType === 'warmup_approximation' ? 'Aproximación' : 'Efectiva'}
                                </span>
                              </td>
                              <td className="py-2.5">{set.targetRepsMin} - {set.targetRepsMax} reps</td>
                              <td className="py-2.5">
                                <input
                                  type="number"
                                  id={`${setId}-kg`}
                                  defaultValue={log?.weight || 60}
                                  className="w-16 bg-motive-surface border border-motive-surfaceBorder rounded-lg px-2 py-1 text-white text-xs"
                                />
                              </td>
                              <td className="py-2.5">
                                <input
                                  type="number"
                                  id={`${setId}-reps`}
                                  defaultValue={log?.reps || set.targetRepsMin}
                                  className="w-14 bg-motive-surface border border-motive-surfaceBorder rounded-lg px-2 py-1 text-white text-xs"
                                />
                              </td>
                              <td className="py-2.5">
                                <select
                                  id={`${setId}-rir`}
                                  defaultValue={log?.rir ?? set.targetRIR}
                                  className="bg-motive-surface border border-motive-surfaceBorder rounded-lg px-2 py-1 text-white text-xs"
                                >
                                  <option value={0}>0 (Fallo)</option>
                                  <option value={1}>1</option>
                                  <option value={2}>2</option>
                                  <option value={3}>3</option>
                                </select>
                              </td>
                              <td className="py-2.5 text-center">
                                <input
                                  type="checkbox"
                                  id={`${setId}-pain`}
                                  defaultChecked={log?.pain || false}
                                  className="rounded border-motive-surfaceBorder text-motive-red focus:ring-0"
                                />
                              </td>
                              <td className="py-2.5 text-right">
                                <button
                                  onClick={() => {
                                    const kgEl = document.getElementById(`${setId}-kg`) as HTMLInputElement;
                                    const repsEl = document.getElementById(`${setId}-reps`) as HTMLInputElement;
                                    const rirEl = document.getElementById(`${setId}-rir`) as HTMLSelectElement;
                                    const painEl = document.getElementById(`${setId}-pain`) as HTMLInputElement;

                                    handleSetUpdate(
                                      setId,
                                      Number(repsEl?.value || 8),
                                      Number(kgEl?.value || 80),
                                      Number(rirEl?.value || 2),
                                      painEl?.checked || false,
                                      set.restSeconds || 120,
                                      `${item.exercise?.nameSpanish || item.exerciseId} • Serie #${set.setNumber}`
                                    );
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                                    isDone
                                      ? 'bg-motive-emerald text-black shadow-lg shadow-motive-emerald/20'
                                      : 'bg-motive-surface border border-motive-surfaceBorder text-zinc-300 hover:border-zinc-500'
                                  }`}
                                >
                                  {isDone ? '✓ Registrado' : 'Registrar'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* 2. SECCIÓN DE RUTINAS DE ABDOMEN & CORE */}
      {trainingSection === 'abs' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header de Abdomen */}
          <div className="bg-gradient-to-r from-motive-surface via-motive-surfaceLight to-motive-surface border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 inline-flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Especialización Biomecánica de Core & Six-Pack</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                  Rutinas de Abdomen Basadas en Evidencia
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                  El abdomen es un músculo esquelético que se hipertrofia con <strong>sobrecarga mecánica progresiva y tensión isométrica</strong>, no con 500 repeticiones sin peso.
                </p>
              </div>

              {/* Selector de Rutinas de Abdomen */}
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                {ABDOMINAL_ROUTINES.map((routine) => (
                  <button
                    key={routine.id}
                    onClick={() => setActiveAbsRoutineId(routine.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all border ${
                      activeAbsRoutineId === routine.id
                        ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30'
                        : 'bg-motive-surface border-motive-surfaceBorder text-zinc-300 hover:text-white hover:border-zinc-600'
                    }`}
                  >
                    {routine.title.split(' ')[0]} {routine.title.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Rutina Activa Detalle */}
            {(() => {
              const activeRoutine = ABDOMINAL_ROUTINES.find((r) => r.id === activeAbsRoutineId) || ABDOMINAL_ROUTINES[0];
              return (
                <div className="space-y-6 pt-4 border-t border-motive-surfaceBorder/60">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-motive-surface border border-motive-surfaceBorder">
                      <span className="text-[10px] font-semibold text-zinc-400 block uppercase">Frecuencia Recomendada</span>
                      <strong className="text-white font-bold">{activeRoutine.frequencyWeekly}</strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-motive-surface border border-motive-surfaceBorder">
                      <span className="text-[10px] font-semibold text-zinc-400 block uppercase">Momento Óptimo</span>
                      <strong className="text-amber-400 font-bold">{activeRoutine.bestTiming}</strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-motive-surface border border-motive-surfaceBorder">
                      <span className="text-[10px] font-semibold text-zinc-400 block uppercase">Nivel de Exigencia</span>
                      <strong className="text-white font-bold capitalize">{activeRoutine.difficulty}</strong>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-200 space-y-1">
                    <span className="font-bold text-amber-300 block uppercase text-[11px]">Fundamento Fisiológico:</span>
                    <p className="leading-relaxed">{activeRoutine.scientificRationale}</p>
                  </div>

                  {/* Ejercicios de la Rutina de Abdomen */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-display font-black text-white uppercase tracking-wider">
                      Ejercicios del Protocolo ({activeRoutine.exercises.length} Ejercicios de Precisión)
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {activeRoutine.exercises.map((ex, exI) => (
                        <div
                          key={exI}
                          className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-amber-500/40 transition-all"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                {ex.targetAreaName}
                              </span>
                              <span className="text-xs font-bold text-zinc-400">#{exI + 1}</span>
                            </div>

                            <h5 className="font-display font-bold text-white text-base leading-snug">
                              {ex.name}
                            </h5>

                            <div className="p-2.5 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder flex items-center justify-between text-xs">
                              <span className="text-zinc-400 font-medium">Series & Reps:</span>
                              <strong className="text-white font-bold">{ex.sets} series x {ex.reps}</strong>
                            </div>

                            {/* Puntos Clave Biomecánicos */}
                            <div className="space-y-1 pt-1">
                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Cómo Ejecutarlo:</span>
                              <ul className="space-y-1 text-[11px] text-zinc-300">
                                {ex.biomechanicalCues.slice(0, 2).map((cue, cI) => (
                                  <li key={cI} className="flex items-start space-x-1.5">
                                    <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                                    <span>{cue}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Error Común a Evitar */}
                          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300">
                            <strong>⚠️ Evitar:</strong> {ex.mistakesToAvoid[0]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>

        </div>
      )}

      {/* 3. SECCIÓN DE CARDIO PARA PÉRDIDA DE GRASA */}
      {trainingSection === 'cardio' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header & Protocolo Estrella: LISS Inclinado */}
          <div className="bg-gradient-to-r from-motive-surface via-motive-surfaceLight to-motive-surface border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-flex items-center space-x-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Fisiología de la Oxidación Lipídica (Zona FatMax)</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                  El Cardio Más Eficaz para Perder Grasa Pura
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                  Comprobado por la ciencia deportiva: la <strong>Caminata en Cinta Inclinada en Zona 2 (LISS Inclinado)</strong> quema grasa visceral y subcutánea sin degradar la masa muscular ni perjudicar tus levantamientos pesados.
                </p>
              </div>

              {/* Calculadora Interactiva de FCM y Zona 2 */}
              <div className="p-4 rounded-2xl bg-motive-surface border border-motive-surfaceBorder space-y-2.5 min-w-[260px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase flex items-center space-x-1.5">
                    <Heart className="w-3.5 h-3.5 text-motive-redBright animate-pulse" />
                    <span>Tu Zona 2 Personal</span>
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] text-zinc-400">Edad:</span>
                    <input
                      type="number"
                      min={15}
                      max={85}
                      value={cardioAge}
                      onChange={(e) => setCardioAge(Number(e.target.value))}
                      className="w-12 bg-motive-surfaceLight border border-motive-surfaceBorder rounded px-1.5 py-0.5 text-xs text-white text-center font-bold"
                    />
                  </div>
                </div>

                {(() => {
                  const zones = calculateHeartRateZones(cardioAge);
                  return (
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-baseline justify-between border-b border-motive-surfaceBorder/60 pb-1">
                        <span className="text-zinc-400 text-[11px]">FCM Teórica:</span>
                        <strong className="text-white">{zones.maxHR} bpm</strong>
                      </div>
                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-emerald-400 font-bold text-[11px]">Zona 2 FatMax (60-70%):</span>
                        <strong className="text-emerald-400 text-sm font-black">{zones.zone2.min} - {zones.zone2.max} bpm</strong>
                      </div>
                      <p className="text-[10px] text-zinc-400 pt-1 leading-tight">
                        Mantén tus pulsaciones en este rango para quemar ácidos grasos puros sin fatigar el SNC.
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Los 3 Protocolos de Cardio en Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-motive-surfaceBorder/60">
              {CARDIO_PROTOCOLS.map((proto) => {
                const isKing = proto.hierarchyTier === 'rey_perdida_grasa';
                return (
                  <div
                    key={proto.id}
                    className={`rounded-2xl p-5 space-y-4 flex flex-col justify-between border transition-all ${
                      isKing
                        ? 'bg-gradient-to-b from-emerald-500/10 via-motive-surface to-motive-surface border-emerald-500/40 shadow-xl shadow-emerald-500/10'
                        : 'bg-motive-surface border-motive-surfaceBorder'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isKing
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {isKing ? '🏆 Estándar de Oro' : '⚡ Acelerador'}
                        </span>
                        <span className="text-[11px] font-bold text-zinc-400">{proto.recommendedDuration}</span>
                      </div>

                      <div>
                        <h4 className="font-display font-black text-white text-base uppercase leading-snug">
                          {proto.name}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                          {proto.subtitle}
                        </p>
                      </div>

                      {/* Pasos de Ejecución */}
                      <div className="p-3 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder text-xs space-y-1.5">
                        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider block">Protocolo Exacto:</span>
                        <ul className="space-y-1 text-[11px] text-zinc-300 leading-relaxed">
                          {proto.protocolSteps.slice(0, 3).map((step, sI) => (
                            <li key={sI} className="flex items-start space-x-1.5">
                              <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Impacto en Músculo */}
                      <div className="text-[11px] text-zinc-300">
                        <strong className="text-white block">Impacto en Masa Muscular:</strong>
                        <p className="text-zinc-400 mt-0.5">{proto.fatLossVsMuscleMassImpact}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-motive-surfaceBorder/60 flex items-center justify-between text-xs font-semibold text-zinc-400">
                      <span>Frecuencia:</span>
                      <strong className="text-white">{proto.frequencyPerWeek}</strong>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comparación Científica: Por qué NO debes correr para perder grasa */}
            <div className="p-5 rounded-2xl bg-motive-surface border border-motive-surfaceBorder space-y-3">
              <h4 className="text-sm font-display font-bold text-white uppercase flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>¿Por qué Caminar Inclinado supera a Correr para Perder Grasa?</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300 leading-relaxed">
                <div className="p-3 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder space-y-1">
                  <strong className="text-emerald-400 block font-bold">✓ Caminata Inclinada (10-12% a 5 km/h):</strong>
                  <p>Oxida 85% de grasa como combustible (Zona 2). Cero impacto articular. No interfiere con el crecimiento muscular (vía mTOR intacta). Mantiene la fuerza en sentadilla.</p>
                </div>
                <div className="p-3 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder space-y-1">
                  <strong className="text-rose-400 block font-bold">✗ Correr en Asfalto / Ritmo Intenso:</strong>
                  <p>Quema principalmente glucógeno muscular y aminoácidos. Impacto articular repetitivo. Activa fuertemente AMPK bloqueando la hipertrofia. Desencadena hambre voraz por grelina.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Biblioteca Completa de Ejercicios */}
      <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-motive-surfaceBorder/60 pb-4">
          <div>
            <h3 className="text-xl font-display font-black text-white uppercase">Biblioteca Anatómica de Ejercicios</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Explora las especificaciones técnicas, músculos implicados y errores comunes.</p>
          </div>

          {/* Filtro de Músculo */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-zinc-400">Grupo:</span>
            <select
              value={selectedMuscleFilter}
              onChange={(e) => setSelectedMuscleFilter(e.target.value)}
              className="bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-motive-red capitalize"
            >
              <option value="todos">Todos los Grupos</option>
              <option value="pecho">Pecho</option>
              <option value="espalda">Espalda</option>
              <option value="cuadriceps">Cuádriceps</option>
              <option value="isquiosurales">Isquiosurales</option>
              <option value="gluteos">Glúteos</option>
              <option value="hombros">Hombros</option>
              <option value="biceps">Bíceps</option>
              <option value="triceps">Tríceps</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((ex) => (
            <div
              key={ex.id}
              onClick={() => setSelectedExerciseForModal(ex)}
              className="bg-motive-surfaceLight border border-motive-surfaceBorder rounded-2xl overflow-hidden hover:border-motive-red/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-white flex items-center justify-center p-2 rounded-t-2xl">
                  <img
                    src={ex.imageUrl}
                    alt={ex.nameSpanish}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/70 backdrop-blur-sm text-white border border-white/20">
                      {ex.primaryMuscle}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-motive-red text-white">
                      {ex.tier.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-display font-bold text-white text-base group-hover:text-motive-redBright transition-colors">
                    {ex.nameSpanish}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {ex.instructions.startingPosition}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-motive-surfaceBorder/40 flex items-center justify-between text-xs text-zinc-500 font-semibold mt-2">
                <span>Equipo: {ex.equipmentRequired}</span>
                <span className="text-motive-redBright flex items-center space-x-1">
                  <span>Detalles</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Ficha Técnica Completa */}
      {selectedExerciseForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-motive-surfaceBorder pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-motive-redBright">
                  Ficha Biomecánica Certificada
                </span>
                <h3 className="text-2xl font-display font-black text-white uppercase mt-1">
                  {selectedExerciseForModal.nameSpanish}
                </h3>
                <p className="text-xs text-zinc-400">{selectedExerciseForModal.nameEnglish}</p>
              </div>
              <button
                onClick={() => setSelectedExerciseForModal(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-motive-surfaceLight"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl overflow-hidden border border-motive-surfaceBorder h-56 bg-white flex items-center justify-center p-2">
                <img
                  src={selectedExerciseForModal.imageUrl}
                  alt={selectedExerciseForModal.nameSpanish}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <strong className="text-white uppercase block">Posición Inicial:</strong>
                  <p className="text-zinc-300 mt-0.5 leading-relaxed">{selectedExerciseForModal.instructions.startingPosition}</p>
                </div>
                <div>
                  <strong className="text-white uppercase block">Ejecución & Fase Excéntrica:</strong>
                  <p className="text-zinc-300 mt-0.5 leading-relaxed">{selectedExerciseForModal.instructions.execution}</p>
                </div>
                <div>
                  <strong className="text-white uppercase block">Respiración (Valsalva controlada):</strong>
                  <p className="text-zinc-300 mt-0.5 leading-relaxed">{selectedExerciseForModal.instructions.breathing}</p>
                </div>
              </div>
            </div>

            {/* Puntos Clave de Seguridad y Errores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-motive-emerald/10 border border-motive-emerald/30 p-4 rounded-xl text-xs space-y-2">
                <span className="font-bold text-motive-emerald uppercase flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Criterios de Seguridad</span>
                </span>
                <ul className="list-disc list-inside space-y-1 text-zinc-300">
                  {selectedExerciseForModal.instructions.keySafetyCues.map((cue, cIdx) => (
                    <li key={cIdx}>{cue}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-xs space-y-2">
                <span className="font-bold text-rose-400 uppercase flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Errores Frecuentes a Evitar</span>
                </span>
                <ul className="list-disc list-inside space-y-1 text-zinc-300">
                  {selectedExerciseForModal.instructions.commonMistakes.map((mis, mIdx) => (
                    <li key={mIdx}>{mis}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 bg-motive-surfaceLight rounded-xl border border-motive-surfaceBorder text-xs text-zinc-400">
              <strong className="text-white">Protocolo de Aproximación:</strong> {selectedExerciseForModal.warmupProtocol}
            </div>

          </div>
        </div>
      )}

      {/* Modal de Revisión Técnica y Almacenamiento en Video (Supabase Storage) */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-motive-surfaceBorder pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-motive-redBright flex items-center space-x-1.5">
                  <Video className="w-4 h-4" />
                  <span>Análisis Biomecánico Audiovisual (Storage Privado)</span>
                </span>
                <h3 className="text-xl font-display font-black text-white uppercase mt-1">
                  Revisión Técnica de Ejecución
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Sube tus levantamientos para recibir correcciones del Coach y validar sobrecarga progresiva.
                </p>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-motive-surfaceLight"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reproductor de Video Activo si hay uno seleccionado */}
            {activePlayingVideo && (
              <div className="space-y-2 bg-black rounded-2xl p-2 border border-motive-surfaceBorder">
                <video
                  src={activePlayingVideo}
                  controls
                  autoPlay
                  className="w-full max-h-64 rounded-xl mx-auto"
                />
                <div className="flex items-center justify-between px-2 py-1 text-xs text-zinc-400">
                  <span className="flex items-center space-x-1.5 text-motive-emerald">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Reproducción segura mediante token firmado temporal</span>
                  </span>
                  <button
                    onClick={() => setActivePlayingVideo(null)}
                    className="text-zinc-500 hover:text-white text-[11px]"
                  >
                    Cerrar reproductor
                  </button>
                </div>
              </div>
            )}

            {/* Zona de Carga Real de Archivos */}
            <div className="p-6 border-2 border-dashed border-motive-surfaceBorder rounded-2xl text-center space-y-3 bg-motive-surfaceLight/50">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="video/mp4,video/quicktime,video/webm"
                className="hidden"
                id="athlete-video-upload"
              />

              <Film className="w-10 h-10 text-motive-redBright mx-auto" />
              
              <div>
                <p className="text-sm font-bold text-white">Sube tu video de sentadilla, banca o levantamiento</p>
                <p className="text-xs text-zinc-400 mt-1">Formatos admitidos: MP4, MOV, WebM (Máximo 50 MB)</p>
              </div>

              {isUploading ? (
                <div className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-motive-surface border border-motive-surfaceBorder text-xs text-zinc-300">
                  <span className="w-3 h-3 rounded-full border-2 border-motive-red border-t-transparent animate-spin" />
                  <span>Subiendo al almacenamiento seguro...</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-motive-red text-white text-xs font-bold uppercase tracking-wider hover:bg-motive-redDark transition-colors shadow-lg shadow-motive-red/20"
                >
                  <Upload className="w-4 h-4" />
                  <span>Seleccionar Archivo de Video</span>
                </button>
              )}

              {uploadError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 text-left">
                  {uploadError}
                </div>
              )}
            </div>

            {/* Consentimiento para Material Audiovisual (Requisito 18) */}
            <label className="flex items-start space-x-3 text-xs text-zinc-300 cursor-pointer bg-motive-surfaceLight/40 p-3 rounded-xl border border-motive-surfaceBorder">
              <input
                type="checkbox"
                checked={hasMediaConsent}
                onChange={(e) => setHasMediaConsent(e.target.checked)}
                className="mt-0.5 rounded border-motive-surfaceBorder text-motive-red focus:ring-0"
              />
              <span className="text-[11px] leading-relaxed">
                <strong className="text-white">Consentimiento Audiovisual Expreso:</strong> Autorizo que este material sea analizado por el Coach asignado exclusivamente con fines biomecánicos. Puedo eliminar permanentemente mis videos en cualquier momento.
              </span>
            </label>

            {/* Lista de Videos Subidos por el Atleta */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-motive-surfaceBorder/60 pb-2">
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  Videos en tu Expediente ({uploadedVideos.length})
                </p>
                <button
                  onClick={loadAthleteVideos}
                  className="text-[11px] text-zinc-400 hover:text-white flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Actualizar lista</span>
                </button>
              </div>

              {uploadedVideos.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-2 text-center">
                  Aún no has subido videos a tu carpeta privada. Selecciona un archivo para comenzar tu primera revisión técnica.
                </p>
              ) : (
                <div className="space-y-2">
                  {uploadedVideos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl p-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <div className="w-8 h-8 rounded-lg bg-motive-surface flex items-center justify-center text-motive-redBright flex-shrink-0">
                          <Film className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-white truncate">{video.name}</p>
                          <p className="text-[10px] text-zinc-500">
                            {video.created_at ? new Date(video.created_at).toLocaleDateString('es-MX') : 'Reciente'} • {(video.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {video.signedUrl && (
                          <button
                            onClick={() => setActivePlayingVideo(video.signedUrl || null)}
                            className="px-2.5 py-1 rounded-lg bg-motive-surface border border-motive-surfaceBorder text-zinc-300 hover:text-white hover:border-motive-red text-[11px] font-bold flex items-center space-x-1"
                          >
                            <Play className="w-3 h-3 text-motive-redBright" />
                            <span>Reproducir</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteVideo(video.name)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-motive-surface transition-colors"
                          title="Eliminar permanentemente del servidor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-[11px] text-zinc-500 leading-relaxed space-y-1 pt-2 border-t border-motive-surfaceBorder/60">
              <p>• Los videos son privados y se guardan bajo las políticas de Row Level Security (RLS) en Supabase Storage.</p>
              <p>• El análisis evalúa profundidad, trayectoria y ángulo tibiofemoral; no sustituye un examen ortopédico presencial.</p>
            </div>

          </div>
        </div>
      )}

      {/* Widget Flotante de Descanso en Vivo (Abajo a la Izquierda) */}
      {(restSecondsLeft > 0 || restFinishedBanner) && (
        <div className="fixed bottom-5 left-5 z-40 max-w-xs w-full bg-[#0e0e14]/95 backdrop-blur-md border-2 border-motive-red/60 rounded-2xl p-3.5 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-display font-black text-sm flex-shrink-0 ${
                restFinishedBanner ? 'bg-emerald-500 text-black' : 'bg-motive-red text-white animate-pulse'
              }`}>
                {restSecondsLeft > 0 ? formatTimer(restSecondsLeft) : '✓'}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-motive-redBright">
                  {restFinishedBanner ? '¡Descanso Completo!' : 'Descanso en Vivo'}
                </p>
                <p className="text-xs font-bold text-white truncate">
                  {restFinishedBanner ? 'Inicia tu siguiente serie' : restLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 flex-shrink-0">
              {restSecondsLeft > 0 && (
                <button
                  onClick={() => setRestSecondsLeft((prev) => prev + 15)}
                  className="px-2 py-1 rounded-lg bg-motive-surface border border-motive-surfaceBorder text-[10px] font-bold text-zinc-300 hover:text-white"
                >
                  +15s
                </button>
              )}
              <button
                onClick={() => {
                  setIsRestRunning(false);
                  setRestSecondsLeft(0);
                  setRestFinishedBanner(false);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-motive-surface"
                title="Cerrar cronómetro"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </AssessmentGate>
  );
}

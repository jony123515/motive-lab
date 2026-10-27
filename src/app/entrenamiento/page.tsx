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
  Film
} from 'lucide-react';

export default function TrainingPage() {
  const { currentUser, workoutPlan, saveLoggedWorkout } = useAppState();

  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
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

  const activeSession = workoutPlan?.sessions[activeSessionIndex] || workoutPlan?.sessions[0];

  const handleSetUpdate = (setId: string, reps: number, weight: number, rir: number, pain: boolean) => {
    setLoggedSets(prev => ({
      ...prev,
      [setId]: { reps, weight, rir, pain, done: true }
    }));

    // Evaluar sobrecarga progresiva
    const mockPrescribed: PrescribedSet = {
      setNumber: 1,
      setType: 'working_effective',
      targetRepsMin: 6,
      targetRepsMax: 8,
      targetRIR: 2,
      restSeconds: 180,
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
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-motive-surface border border-motive-surfaceBorder text-zinc-400">
                      Ejercicio #{exIdx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-motive-red/10 text-motive-redBright border border-motive-red/30">
                      {item.exercise.tier.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-lg font-display font-bold text-white">{item.exercise.nameSpanish}</h4>
                  <p className="text-xs text-zinc-400">
                    Músculo principal: <strong className="text-zinc-200 capitalize">{item.exercise.primaryMuscle}</strong> • Patrón: {item.exercise.movementPattern.replace('_', ' ')}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedExerciseForModal(item.exercise)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-motive-surface border border-motive-surfaceBorder text-xs font-bold text-zinc-300 hover:text-white hover:border-motive-red transition-colors self-start sm:self-auto"
                >
                  <Info className="w-3.5 h-3.5 text-motive-redBright" />
                  <span>Ver Ficha Técnica & Errores</span>
                </button>
              </div>

              {/* Pauta de Series de Aproximación */}
              <div className="text-[11px] bg-amber-500/10 border border-amber-500/20 text-amber-300 p-2.5 rounded-xl flex items-start space-x-2">
                <Flame className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <strong className="block text-white">Series de Aproximación Obligatorias:</strong>
                  {item.exercise.warmupProtocol}
                </div>
              </div>

              {/* Tabla Interactiva de Series */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-motive-surfaceBorder text-zinc-500 text-[10px] uppercase">
                      <th className="py-2.5">Serie</th>
                      <th className="py-2.5">Tipo</th>
                      <th className="py-2.5">Objetivo</th>
                      <th className="py-2.5">RIR Meta</th>
                      <th className="py-2.5">Descanso</th>
                      <th className="py-2.5">Carga (kg)</th>
                      <th className="py-2.5">Reps Logradas</th>
                      <th className="py-2.5">RIR Real</th>
                      <th className="py-2.5">Dolor</th>
                      <th className="py-2.5 text-right">Confirmar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-motive-surfaceBorder/40">
                    {item.sets.map((set, sIdx) => {
                      const setId = `ex-${exIdx}-set-${sIdx}`;
                      const isDone = loggedSets[setId]?.done;
                      const isWarmup = set.setType === 'warmup_approximation';

                      return (
                        <tr key={sIdx} className="hover:bg-motive-surface/50">
                          <td className="py-2.5 font-bold text-white">#{set.setNumber}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isWarmup
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-motive-red/10 text-motive-redBright border border-motive-red/20'
                            }`}>
                              {isWarmup ? 'Aprox' : 'Efectiva'}
                            </span>
                          </td>
                          <td className="py-2.5 text-zinc-300">{set.targetRepsMin}-{set.targetRepsMax} reps</td>
                          <td className="py-2.5 text-zinc-400">RIR {set.targetRIR}</td>
                          <td className="py-2.5 text-zinc-400">{set.restSeconds}s</td>
                          
                          {/* Inputs de registro */}
                          <td className="py-2.5">
                            <input
                              type="number"
                              defaultValue={isWarmup ? 40 : 80}
                              className="w-16 bg-motive-surface border border-motive-surfaceBorder rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-motive-red"
                              id={`${setId}-kg`}
                            />
                          </td>
                          <td className="py-2.5">
                            <input
                              type="number"
                              defaultValue={set.targetRepsMax}
                              className="w-14 bg-motive-surface border border-motive-surfaceBorder rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-motive-red"
                              id={`${setId}-reps`}
                            />
                          </td>
                          <td className="py-2.5">
                            <select
                              defaultValue={set.targetRIR}
                              className="bg-motive-surface border border-motive-surfaceBorder rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-motive-red"
                              id={`${setId}-rir`}
                            >
                              <option value="0">0 (Fallo muscular)</option>
                              <option value="1">1 RIR</option>
                              <option value="2">2 RIR</option>
                              <option value="3">3 RIR</option>
                            </select>
                          </td>
                          <td className="py-2.5">
                            <input
                              type="checkbox"
                              className="rounded border-motive-surfaceBorder text-motive-red focus:ring-0"
                              id={`${setId}-pain`}
                              title="Marca sólo si sentiste dolor articular"
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
                                  painEl?.checked || false
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
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={ex.imageUrl}
                    alt={ex.nameSpanish}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
              <div className="rounded-2xl overflow-hidden border border-motive-surfaceBorder h-56">
                <img
                  src={selectedExerciseForModal.imageUrl}
                  alt={selectedExerciseForModal.nameSpanish}
                  className="w-full h-full object-cover"
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

    </div>
  );
}

import { LoggedSetData, PrescribedSet } from '@/types';

export interface ProgressionEvaluation {
  shouldIncreaseLoad: boolean;
  suggestedDeltaKg: number;
  reason: string;
  techniqueAlert?: string;
  deloadRecommended: boolean;
}

export function evaluateDoubleProgression(
  prescribedSet: PrescribedSet,
  loggedSets: LoggedSetData[],
  exerciseType: 'upper' | 'lower' = 'upper'
): ProgressionEvaluation {
  const effectiveSets = loggedSets.filter(s => s.setType === 'working_effective');

  if (effectiveSets.length === 0) {
    return {
      shouldIncreaseLoad: false,
      suggestedDeltaKg: 0,
      reason: 'No hay series efectivas registradas para esta sesión.',
      deloadRecommended: false
    };
  }

  // 1. Revisión de Banderas de Dolor o Molestia Articular
  const painReported = effectiveSets.some(s => s.perceivedPain);
  if (painReported) {
    return {
      shouldIncreaseLoad: false,
      suggestedDeltaKg: 0,
      reason: 'Se ha reportado molestia articular durante la ejecución. Por seguridad biomecánica se suspende el incremento de carga. Mantener peso o reducir un 10% y revisar técnica.',
      techniqueAlert: '¡Atención! Dolor articular detectado. No confundir con ardor por fatiga muscular. Prioriza trayectoria y control excéntrico.',
      deloadRecommended: false
    };
  }

  // 2. Criterio de Sobrecarga Progresiva (Doble Progresión)
  // ¿Cumplió todas las series efectivas en el límite superior del rango de repeticiones (targetRepsMax) con RIR válido (>= 1)?
  const allSetsMetMaxReps = effectiveSets.every(s => s.repsCompleted >= prescribedSet.targetRepsMax);
  const goodReserve = effectiveSets.every(s => s.actualRIR >= 1);

  if (allSetsMetMaxReps && goodReserve) {
    // Incremento micro-progresivo seguro
    const delta = exerciseType === 'lower' ? 2.5 : 1.25;
    return {
      shouldIncreaseLoad: true,
      suggestedDeltaKg: delta,
      reason: `¡Excelente rendimiento! Has completado todas las series efectivas con ${prescribedSet.targetRepsMax} repeticiones y reserva de esfuerzo (RIR >= 1). Se sugiere aumentar +${delta} kg en la próxima sesión.`,
      deloadRecommended: false
    };
  }

  // Si no alcanzó el tope, pero mejoró o mantuvo reps
  const averageReps = effectiveSets.reduce((sum, s) => sum + s.repsCompleted, 0) / effectiveSets.length;
  if (averageReps < prescribedSet.targetRepsMin) {
    return {
      shouldIncreaseLoad: false,
      suggestedDeltaKg: 0,
      reason: `El volumen de repeticiones quedó por debajo del mínimo prescrito (${prescribedSet.targetRepsMin}). Mantener la carga actual y buscar ganar 1 repetición adicional en la primera serie antes de subir peso.`,
      deloadRecommended: false
    };
  }

  return {
    shouldIncreaseLoad: false,
    suggestedDeltaKg: 0,
    reason: `Rendimiento sólido dentro del rango prescrito (${prescribedSet.targetRepsMin}-${prescribedSet.targetRepsMax} reps). Continúa con este peso hasta dominar el rango superior en todas las series.`,
    deloadRecommended: false
  };
}

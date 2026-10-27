export interface HydrationTarget {
  baselineLiters: number;
  trainingAddonLiters: number;
  totalDailyTargetLiters: number;
  glassesTarget250ml: number;
  periWorkoutProtocol: {
    preWorkoutMl: string;
    intraWorkoutMl: string;
    postWorkoutMl: string;
    electrolytesAdvice: string;
  };
  clinicalNotice: string;
}

export function calculateHydrationPlan(
  weightKg: number,
  trainingDurationMinutes: number = 60,
  sweatRate: 'low' | 'moderate' | 'high' = 'moderate',
  isHotClimate: boolean = false
): HydrationTarget {
  // 1. Tasa basal: 35 ml por kg de peso corporal (Estándar ACSM / OMS)
  let baselineMl = weightKg * 35;

  // 2. Reemplazo por ejercicio y sudoración
  // ACSM: 400-800 ml por cada hora de ejercicio moderado a intenso
  let sweatRateFactor = 500; // ml por hora
  if (sweatRate === 'high') sweatRateFactor = 800;
  if (sweatRate === 'low') sweatRateFactor = 350;

  if (isHotClimate) sweatRateFactor += 200;

  const trainingAddonMl = Math.round((trainingDurationMinutes / 60) * sweatRateFactor);
  const totalMl = Math.round(baselineMl + trainingAddonMl);
  const totalLiters = Number((totalMl / 1000).toFixed(2));
  const baselineLiters = Number((baselineMl / 1000).toFixed(2));
  const trainingAddonLiters = Number((trainingAddonMl / 1000).toFixed(2));
  const glassesTarget = Math.round(totalMl / 250);

  return {
    baselineLiters,
    trainingAddonLiters,
    totalDailyTargetLiters: totalLiters,
    glassesTarget250ml: glassesTarget,
    periWorkoutProtocol: {
      preWorkoutMl: '400 a 500 ml de agua 2 horas antes de la sesión para asegurar euhidratación sin pesadez estomacal.',
      intraWorkoutMl: '150 a 250 ml a sorbos pequeños cada 15-20 minutos durante la sesión de entrenamiento.',
      postWorkoutMl: '500 a 700 ml en las 2 horas posteriores al ejercicio para reponer el déficit de sudor.',
      electrolytesAdvice: trainingDurationMinutes > 60 || sweatRate === 'high'
        ? 'Se recomienda añadir 400-500 mg de sodio (pizca de sal o electrolitos) al agua de entrenamiento para mantener la retención hídrica y prevenir caídas de presión.'
        : 'Para sesiones menores a 60 minutos en clima templado, el agua pura es completamente suficiente.'
    },
    clinicalNotice: 'Personas con insuficiencia cardíaca congestiva, edema o enfermedad renal bajo prescripción de restricción hídrica deben apegarse estrictamente a la indicación de su nefrólogo.'
  };
}

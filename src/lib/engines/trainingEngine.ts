import { WorkoutPlan, WorkoutSession, SessionExercise, PrescribedSet } from '@/types';
import { EXERCISE_DATABASE } from '@/lib/data/exerciseDatabase';

export function generatePersonalizedWorkoutPlan(
  userId: string,
  daysAvailable: 2 | 3 | 4 | 5 | 6 = 4,
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
): WorkoutPlan {
  const getExercise = (id: string) => {
    const ex = EXERCISE_DATABASE.find((e) => e.id === id);
    if (!ex) throw new Error(`Exercise not found: ${id}`);
    return ex;
  };

  // Helper para construir series de trabajo y aproximación
  const createSets = (
    workingSetsCount: number,
    minReps: number,
    maxReps: number,
    rir: number = 2,
    hasWarmup: boolean = true
  ): PrescribedSet[] => {
    const sets: PrescribedSet[] = [];
    if (hasWarmup) {
      sets.push({
        setNumber: 1,
        setType: 'warmup_approximation',
        targetRepsMin: 8,
        targetRepsMax: 10,
        targetRIR: 4,
        restSeconds: 90,
      });
      sets.push({
        setNumber: 2,
        setType: 'warmup_approximation',
        targetRepsMin: 4,
        targetRepsMax: 5,
        targetRIR: 3,
        restSeconds: 90,
      });
    }

    for (let i = 1; i <= workingSetsCount; i++) {
      sets.push({
        setNumber: (hasWarmup ? 2 : 0) + i,
        setType: 'working_effective',
        targetRepsMin: minReps,
        targetRepsMax: maxReps,
        targetRIR: rir,
        restSeconds: minReps <= 6 ? 180 : 120, // 3 min para compuestos pesados, 2 min para accesorios
      });
    }
    return sets;
  };

  const sessions: WorkoutSession[] = [];

  if (daysAvailable === 2) {
    // Full Body A / B
    sessions.push({
      id: 'session-fb-a',
      dayName: 'Día 1: Full Body A (Enfoque Sentadilla & Empuje)',
      splitType: 'full_body',
      targetMuscleGroups: ['cuadriceps', 'pecho', 'espalda', 'core_abdomen'],
      warmupRoutine: [
        '5 min caminata ligera en cinta inclinada o bicicleta estática',
        'Movilidad articular dinámica: rotaciones de cadera, tobillos y muñecas',
        'Activación de glúteo medio: 2x15 pasos laterales con banda elástica',
      ],
      exercises: [
        {
          exerciseId: 'ex-sentadilla-trasera-barra',
          exercise: getExercise('ex-sentadilla-trasera-barra'),
          order: 1,
          sets: createSets(3, 6, 8, 2, true),
          notes: 'Mantener control excéntrico de 2 segundos. Profundidad paralela.',
        },
        {
          exerciseId: 'ex-press-banca-plano-barra',
          exercise: getExercise('ex-press-banca-plano-barra'),
          order: 2,
          sets: createSets(3, 6, 8, 2, true),
          notes: 'Pausa de 1 segundo en el esternón sin perder tensión escapular.',
        },
        {
          exerciseId: 'ex-remo-con-barra-pronado',
          exercise: getExercise('ex-remo-con-barra-pronado'),
          order: 3,
          sets: createSets(3, 8, 10, 2, false),
          notes: 'Tirar con los codos hacia la cadera.',
        },
        {
          exerciseId: 'ex-elevaciones-laterales-mancuerna',
          exercise: getExercise('ex-elevaciones-laterales-mancuerna'),
          order: 4,
          sets: createSets(3, 12, 15, 1, false),
          notes: 'Control excéntrico estricto sin balanceo corporal.',
        },
      ],
      cardioPrescription: {
        type: 'walking',
        durationMinutes: 15,
      },
    });

    sessions.push({
      id: 'session-fb-b',
      dayName: 'Día 2: Full Body B (Enfoque Peso Muerto & Tracción)',
      splitType: 'full_body',
      targetMuscleGroups: ['isquiosurales', 'gluteos', 'espalda', 'hombros', 'biceps', 'triceps'],
      warmupRoutine: [
        'Movilidad de cadera (World Greatest Stretch)',
        'Cat-Cow y bird-dog para activación neuromuscular de columna',
      ],
      exercises: [
        {
          exerciseId: 'ex-peso-muerto-convencional',
          exercise: getExercise('ex-peso-muerto-convencional'),
          order: 1,
          sets: createSets(3, 5, 6, 2, true),
          notes: 'La barra no se separa de las espinillas. Reseteo en el suelo en cada rep.',
        },
        {
          exerciseId: 'ex-press-militar-barra-de-pie',
          exercise: getExercise('ex-press-militar-barra-de-pie'),
          order: 2,
          sets: createSets(3, 6, 8, 2, true),
        },
        {
          exerciseId: 'ex-dominadas-o-jalon-pecho',
          exercise: getExercise('ex-dominadas-o-jalon-pecho'),
          order: 3,
          sets: createSets(3, 8, 10, 2, false),
        },
        {
          exerciseId: 'ex-curl-femoral-tumbado-maquina',
          exercise: getExercise('ex-curl-femoral-tumbado-maquina'),
          order: 4,
          sets: createSets(3, 10, 12, 1, false),
        },
      ],
      cardioPrescription: {
        type: 'LISS',
        durationMinutes: 20,
      },
    });
  } else {
    // 4 Días: Torso / Pierna (Upper / Lower) - El estándar de oro en hipertrofia y fuerza
    sessions.push({
      id: 'session-torso-1',
      dayName: 'Día 1: Torso Pesado (Empuje & Tracción Primaria)',
      splitType: 'upper',
      targetMuscleGroups: ['pecho', 'espalda', 'hombros', 'triceps'],
      warmupRoutine: [
        'Dislocaciones de hombro con pica o banda elástica x 15 reps',
        'Rotadores externos de hombro en polea baja x 15 reps',
        'Push-ups escapulares x 10 reps',
      ],
      exercises: [
        {
          exerciseId: 'ex-press-banca-plano-barra',
          exercise: getExercise('ex-press-banca-plano-barra'),
          order: 1,
          sets: createSets(3, 6, 8, 2, true),
          notes: 'Series efectivas con RIR 2. Descanso completo de 3 minutos.',
        },
        {
          exerciseId: 'ex-remo-con-barra-pronado',
          exercise: getExercise('ex-remo-con-barra-pronado'),
          order: 2,
          sets: createSets(3, 6, 8, 2, true),
        },
        {
          exerciseId: 'ex-press-inclinado-mancuernas',
          exercise: getExercise('ex-press-inclinado-mancuernas'),
          order: 3,
          sets: createSets(3, 8, 10, 2, false),
        },
        {
          exerciseId: 'ex-dominadas-o-jalon-pecho',
          exercise: getExercise('ex-dominadas-o-jalon-pecho'),
          order: 4,
          sets: createSets(3, 8, 10, 2, false),
        },
        {
          exerciseId: 'ex-elevaciones-laterales-mancuerna',
          exercise: getExercise('ex-elevaciones-laterales-mancuerna'),
          order: 5,
          sets: createSets(3, 12, 15, 1, false),
        },
        {
          exerciseId: 'ex-extension-triceps-polea-alta',
          exercise: getExercise('ex-extension-triceps-polea-alta'),
          order: 6,
          sets: createSets(3, 10, 12, 1, false),
        },
      ],
      cardioPrescription: {
        type: 'walking',
        durationMinutes: 15,
      },
    });

    sessions.push({
      id: 'session-pierna-1',
      dayName: 'Día 2: Pierna Fuerza & Cuádriceps',
      splitType: 'lower',
      targetMuscleGroups: ['cuadriceps', 'gluteos', 'isquiosurales', 'pantorrillas'],
      warmupRoutine: [
        '5 min caminata en cinta con pendiente',
        'Movilidad de dorsiflexión de tobillo contra la pared',
        'Sentadilla profunda isométrica en suspensión o soporte x 45 seg',
      ],
      exercises: [
        {
          exerciseId: 'ex-sentadilla-trasera-barra',
          exercise: getExercise('ex-sentadilla-trasera-barra'),
          order: 1,
          sets: createSets(3, 6, 8, 2, true),
          notes: 'Priorizar control técnico y contacto plantar completo.',
        },
        {
          exerciseId: 'ex-prensa-piernas-45',
          exercise: getExercise('ex-prensa-piernas-45'),
          order: 2,
          sets: createSets(3, 8, 10, 2, false),
        },
        {
          exerciseId: 'ex-curl-femoral-tumbado-maquina',
          exercise: getExercise('ex-curl-femoral-tumbado-maquina'),
          order: 3,
          sets: createSets(3, 10, 12, 1, false),
        },
        {
          exerciseId: 'ex-hip-thrust-con-barra',
          exercise: getExercise('ex-hip-thrust-con-barra'),
          order: 4,
          sets: createSets(3, 8, 10, 2, true),
        },
      ],
      cardioPrescription: {
        type: 'walking',
        durationMinutes: 10,
      },
    });

    sessions.push({
      id: 'session-torso-2',
      dayName: 'Día 3: Torso Hipertrofia & Brazos',
      splitType: 'upper',
      targetMuscleGroups: ['hombros', 'pecho', 'espalda', 'biceps', 'triceps'],
      warmupRoutine: [
        'Rotaciones de escápula y movilidad torácica con foam roller',
      ],
      exercises: [
        {
          exerciseId: 'ex-press-militar-barra-de-pie',
          exercise: getExercise('ex-press-militar-barra-de-pie'),
          order: 1,
          sets: createSets(3, 6, 8, 2, true),
        },
        {
          exerciseId: 'ex-dominadas-o-jalon-pecho',
          exercise: getExercise('ex-dominadas-o-jalon-pecho'),
          order: 2,
          sets: createSets(3, 8, 10, 2, false),
        },
        {
          exerciseId: 'ex-press-inclinado-mancuernas',
          exercise: getExercise('ex-press-inclinado-mancuernas'),
          order: 3,
          sets: createSets(3, 10, 12, 2, false),
        },
        {
          exerciseId: 'ex-elevaciones-laterales-mancuerna',
          exercise: getExercise('ex-elevaciones-laterales-mancuerna'),
          order: 4,
          sets: createSets(4, 12, 15, 1, false),
        },
        {
          exerciseId: 'ex-curl-biceps-barra-recta',
          exercise: getExercise('ex-curl-biceps-barra-recta'),
          order: 5,
          sets: createSets(3, 10, 12, 1, false),
        },
        {
          exerciseId: 'ex-extension-triceps-polea-alta',
          exercise: getExercise('ex-extension-triceps-polea-alta'),
          order: 6,
          sets: createSets(3, 10, 12, 1, false),
        },
      ],
      cardioPrescription: {
        type: 'LISS',
        durationMinutes: 20,
      },
    });

    sessions.push({
      id: 'session-pierna-2',
      dayName: 'Día 4: Cadena Posterior & Glúteo',
      splitType: 'lower',
      targetMuscleGroups: ['isquiosurales', 'gluteos', 'cuadriceps'],
      warmupRoutine: [
        'Puentes de glúteo bipodales y unipodales de activación',
        'Bisagra de cadera con pica alineando sacro y occipital',
      ],
      exercises: [
        {
          exerciseId: 'ex-peso-muerto-convencional',
          exercise: getExercise('ex-peso-muerto-convencional'),
          order: 1,
          sets: createSets(3, 5, 6, 2, true),
          notes: 'Máxima tensión en dorsales y fijación lumbar antes del despegue.',
        },
        {
          exerciseId: 'ex-hip-thrust-con-barra',
          exercise: getExercise('ex-hip-thrust-con-barra'),
          order: 2,
          sets: createSets(3, 8, 10, 1, true),
          notes: 'Pausa de 1 segundo en la contracción pico arriba.',
        },
        {
          exerciseId: 'ex-prensa-piernas-45',
          exercise: getExercise('ex-prensa-piernas-45'),
          order: 3,
          sets: createSets(3, 10, 12, 2, false),
        },
        {
          exerciseId: 'ex-curl-femoral-tumbado-maquina',
          exercise: getExercise('ex-curl-femoral-tumbado-maquina'),
          order: 4,
          sets: createSets(3, 12, 15, 1, false),
        },
      ],
      cardioPrescription: {
        type: 'walking',
        durationMinutes: 15,
      },
    });
  }

  return {
    id: `plan-train-${Date.now()}`,
    userId,
    title: `Mesociclo de Hipertrofia & Fuerza Fisiológica (${daysAvailable} Días)`,
    mesocycleWeeks: 6,
    currentWeek: 1,
    deloadWeek: 6,
    progressionRule: 'double_progression_standard',
    sessions,
  };
}

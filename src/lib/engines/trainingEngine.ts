import { WorkoutPlan, WorkoutSession, SessionExercise, PrescribedSet, PrimaryGoal } from '@/types';
import { EXERCISE_DATABASE } from '@/lib/data/exerciseDatabase';

export function generatePersonalizedWorkoutPlan(
  userId: string,
  daysAvailable: number = 4,
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
  gender: 'male' | 'female' = 'male',
  goal: PrimaryGoal = 'hypertrophy',
  trainingLocation: 'gym' | 'home_minimal' | 'home_dumbbells' = 'gym'
): WorkoutPlan {
  const getExercise = (id: string) => {
    const ex = EXERCISE_DATABASE.find((e) => e.id === id);
    if (!ex) throw new Error(`Exercise not found: ${id}`);
    return ex;
  };

  // Helper para construir series según objetivo
  const createSets = (
    workingSetsCount: number,
    baseMinReps: number,
    baseMaxReps: number,
    rir: number = 2,
    hasWarmup: boolean = true
  ): PrescribedSet[] => {
    let minReps = baseMinReps;
    let maxReps = baseMaxReps;
    let restSec = minReps <= 6 ? 180 : 120;

    // Modulaciones según objetivo del usuario
    if (goal === 'strength') {
      minReps = Math.max(3, baseMinReps - 2);
      maxReps = Math.max(5, baseMaxReps - 2);
      restSec = 180;
    } else if (goal === 'fat_loss') {
      minReps = baseMinReps + 2;
      maxReps = baseMaxReps + 3;
      restSec = 90;
    }

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
        restSeconds: restSec,
      });
    }
    return sets;
  };

  const sessions: WorkoutSession[] = [];
  const normalizedDays = Math.min(6, Math.max(2, Math.round(daysAvailable)));

  // =========================================================================
  // PROGRAMACIÓN PARA MUJERES: ENFOQUE EN AUMENTO DE PIERNA Y GLÚTEO
  // (Mayor frecuencia, sobrecarga progresiva en Hip Thrust, sentadillas y cadena posterior)
  // =========================================================================
  if (gender === 'female') {
    if (normalizedDays === 2) {
      sessions.push({
        id: 'session-fem-2d-1',
        dayName: 'Día 1: Glúteo & Pierna Fuerza (Enfoque Hip Thrust & Prensa)',
        splitType: 'lower',
        targetMuscleGroups: ['gluteos', 'cuadriceps', 'isquiosurales'],
        warmupRoutine: [
          '5 min caminata en cinta con pendiente inclinada (activación cardiovascular)',
          '2x15 pasos de monstruo (banded monster walks) para activación de glúteo medio',
          'Puentes de glúteo en suelo manteniendo 2 seg de contracción isométrica',
        ],
        exercises: [
          {
            exerciseId: 'ex-hip-thrust-con-barra',
            exercise: getExercise('ex-hip-thrust-con-barra'),
            order: 1,
            sets: createSets(4, 8, 10, 1, true),
            notes: 'Ejercicio rey para hipertrofia de glúteo. Mantén 1 segundo de pausa en contracción máxima arriba.',
          },
          {
            exerciseId: 'ex-prensa-piernas-45',
            exercise: getExercise('ex-prensa-piernas-45'),
            order: 2,
            sets: createSets(3, 10, 12, 2, false),
            notes: 'Pies colocados en la parte alta de la plataforma para maximizar activación glútea e isquios.',
          },
          {
            exerciseId: 'ex-sentadilla-trasera-barra',
            exercise: getExercise('ex-sentadilla-trasera-barra'),
            order: 3,
            sets: createSets(3, 8, 10, 2, true),
            notes: 'Profundidad controlada por debajo del paralelo.',
          },
          {
            exerciseId: 'ex-curl-femoral-tumbado-maquina',
            exercise: getExercise('ex-curl-femoral-tumbado-maquina'),
            order: 4,
            sets: createSets(3, 12, 15, 1, false),
            notes: 'Control excéntrico de 3 segundos en el retorno.',
          },
        ],
        cardioPrescription: { type: 'walking', durationMinutes: 15 },
      });

      sessions.push({
        id: 'session-fem-2d-2',
        dayName: 'Día 2: Torso Atlético, Hombros & Segundo Estímulo Glúteo',
        splitType: 'full_body',
        targetMuscleGroups: ['espalda', 'hombros', 'gluteos', 'core_abdomen'],
        warmupRoutine: [
          'Dislocaciones de hombro con banda elástica x 15 reps',
          'Activación de rotadores externos y bisagra de cadera',
        ],
        exercises: [
          {
            exerciseId: 'ex-peso-muerto-convencional',
            exercise: getExercise('ex-peso-muerto-convencional'),
            order: 1,
            sets: createSets(3, 8, 10, 2, true),
            notes: 'Enfoque en bisagra de cadera empujando glúteos atrás.',
          },
          {
            exerciseId: 'ex-dominadas-o-jalon-pecho',
            exercise: getExercise('ex-dominadas-o-jalon-pecho'),
            order: 2,
            sets: createSets(3, 8, 10, 2, false),
            notes: 'Espalda firme, codos hacia la cintura para tono dorsal.',
          },
          {
            exerciseId: 'ex-press-militar-barra-de-pie',
            exercise: getExercise('ex-press-militar-barra-de-pie'),
            order: 3,
            sets: createSets(3, 8, 10, 2, true),
            notes: 'Postura sólida y core apretado para estabilidad escapular.',
          },
          {
            exerciseId: 'ex-elevaciones-laterales-mancuerna',
            exercise: getExercise('ex-elevaciones-laterales-mancuerna'),
            order: 4,
            sets: createSets(4, 12, 15, 1, false),
            notes: 'Deltoides lateral para crear una estética armoniosa y cintura visualmente más reducida.',
          },
        ],
        cardioPrescription: { type: 'LISS', durationMinutes: 20 },
      });
    } else if (normalizedDays === 3) {
      sessions.push({
        id: 'session-fem-3d-1',
        dayName: 'Día 1: Glúteo & Cadena Posterior Pesada (Hip Thrust & Isquios)',
        splitType: 'lower',
        targetMuscleGroups: ['gluteos', 'isquiosurales'],
        warmupRoutine: [
          'Caminata en pendiente 5 min',
          '2 series de puentes de glúteo unipodales x 12 reps por pierna',
          'Abducciones con banda elástica en rodillas',
        ],
        exercises: [
          {
            exerciseId: 'ex-hip-thrust-con-barra',
            exercise: getExercise('ex-hip-thrust-con-barra'),
            order: 1,
            sets: createSets(4, 8, 10, 1, true),
            notes: 'Carga progresiva pesada. Bloqueo pélvico arriba con retroversión 1 segundo.',
          },
          {
            exerciseId: 'ex-peso-muerto-convencional',
            exercise: getExercise('ex-peso-muerto-convencional'),
            order: 2,
            sets: createSets(3, 8, 10, 2, true),
            notes: 'Siente la tensión en isquiotibiales y glúteos al bajar.',
          },
          {
            exerciseId: 'ex-prensa-piernas-45',
            exercise: getExercise('ex-prensa-piernas-45'),
            order: 3,
            sets: createSets(3, 10, 12, 2, false),
            notes: 'Pies en parte superior de la plancha, bajada lenta en 3 seg.',
          },
          {
            exerciseId: 'ex-curl-femoral-tumbado-maquina',
            exercise: getExercise('ex-curl-femoral-tumbado-maquina'),
            order: 4,
            sets: createSets(4, 12, 15, 1, false),
            notes: 'Aislamiento de isquiosurales sin despegar la pelvis del banco.',
          },
        ],
        cardioPrescription: { type: 'walking', durationMinutes: 15 },
      });

      sessions.push({
        id: 'session-fem-3d-2',
        dayName: 'Día 2: Torso Esculpido, Hombro 3D & Espalda',
        splitType: 'upper',
        targetMuscleGroups: ['hombros', 'espalda', 'triceps', 'core_abdomen'],
        warmupRoutine: [
          'Rotadores externos de hombro con banda 2x15',
          'Cat-cow dinámico y movilidad torácica',
        ],
        exercises: [
          {
            exerciseId: 'ex-dominadas-o-jalon-pecho',
            exercise: getExercise('ex-dominadas-o-jalon-pecho'),
            order: 1,
            sets: createSets(3, 8, 10, 2, false),
            notes: 'Deprime escápulas antes de jalar.',
          },
          {
            exerciseId: 'ex-press-militar-barra-de-pie',
            exercise: getExercise('ex-press-militar-barra-de-pie'),
            order: 2,
            sets: createSets(3, 8, 10, 2, true),
            notes: 'Tono deltoideo y estabilidad de columna.',
          },
          {
            exerciseId: 'ex-remo-con-barra-pronado',
            exercise: getExercise('ex-remo-con-barra-pronado'),
            order: 3,
            sets: createSets(3, 10, 12, 2, false),
            notes: 'Espalda media densa y postura erguida.',
          },
          {
            exerciseId: 'ex-elevaciones-laterales-mancuerna',
            exercise: getExercise('ex-elevaciones-laterales-mancuerna'),
            order: 4,
            sets: createSets(4, 12, 15, 1, false),
            notes: 'Excelente para crear curvatura armónica del hombro.',
          },
          {
            exerciseId: 'ex-extension-triceps-polea-alta',
            exercise: getExercise('ex-extension-triceps-polea-alta'),
            order: 5,
            sets: createSets(3, 12, 15, 1, false),
            notes: 'Firmeza en la zona posterior del brazo.',
          },
        ],
        cardioPrescription: { type: 'LISS', durationMinutes: 20 },
      });

      sessions.push({
        id: 'session-fem-3d-3',
        dayName: 'Día 3: Pierna Completa & Hipertrofia Glúteo Volumen',
        splitType: 'lower',
        targetMuscleGroups: ['cuadriceps', 'gluteos', 'pantorrillas'],
        warmupRoutine: [
          'Sentadilla isométrica con peso corporal contra la pared x 45 seg',
          'Movilidad de tobillo en dorsiflexión',
        ],
        exercises: [
          {
            exerciseId: 'ex-sentadilla-trasera-barra',
            exercise: getExercise('ex-sentadilla-trasera-barra'),
            order: 1,
            sets: createSets(4, 8, 10, 2, true),
            notes: 'Empuja con los talones y abre rodillas en línea con los pies.',
          },
          {
            exerciseId: 'ex-hip-thrust-con-barra',
            exercise: getExercise('ex-hip-thrust-con-barra'),
            order: 2,
            sets: createSets(3, 10, 12, 1, false),
            notes: 'Pausa de 2 segundos en contracción máxima arriba.',
          },
          {
            exerciseId: 'ex-prensa-piernas-45',
            exercise: getExercise('ex-prensa-piernas-45'),
            order: 3,
            sets: createSets(3, 12, 15, 1, false),
            notes: 'Rango de recorrido completo sin despegar la zona lumbar.',
          },
          {
            exerciseId: 'ex-curl-femoral-tumbado-maquina',
            exercise: getExercise('ex-curl-femoral-tumbado-maquina'),
            order: 4,
            sets: createSets(3, 12, 15, 1, false),
          },
        ],
        cardioPrescription: { type: 'walking', durationMinutes: 15 },
      });
    } else {
      // 4 o más días para Mujeres (Diseño de Especialización en Glúteo & Pierna Femenina)
      sessions.push({
        id: 'session-fem-4d-1',
        dayName: 'Día 1: Glúteo Pesado & Isquiosurales (Tensión Mecánica)',
        splitType: 'lower',
        targetMuscleGroups: ['gluteos', 'isquiosurales'],
        warmupRoutine: [
          '5 min caminata en cinta inclinada al 8%',
          'Puentes de glúteo unipodales de activación 2x15',
          'Caminatas de cangrejo con banda de resistencia',
        ],
        exercises: [
          {
            exerciseId: 'ex-hip-thrust-con-barra',
            exercise: getExercise('ex-hip-thrust-con-barra'),
            order: 1,
            sets: createSets(4, 8, 10, 1, true),
            notes: 'Máxima carga efectiva. Retroversión pélvica y mirada al frente.',
          },
          {
            exerciseId: 'ex-peso-muerto-convencional',
            exercise: getExercise('ex-peso-muerto-convencional'),
            order: 2,
            sets: createSets(3, 6, 8, 2, true),
            notes: 'Bisagra estricta estirando glúteos e isquios en la bajada.',
          },
          {
            exerciseId: 'ex-prensa-piernas-45',
            exercise: getExercise('ex-prensa-piernas-45'),
            order: 3,
            sets: createSets(3, 10, 12, 2, false),
            notes: 'Pies altos y anchos en la plataforma para máxima palanca glútea.',
          },
          {
            exerciseId: 'ex-curl-femoral-tumbado-maquina',
            exercise: getExercise('ex-curl-femoral-tumbado-maquina'),
            order: 4,
            sets: createSets(4, 12, 15, 1, false),
            notes: 'Contracción pico en isquiosurales.',
          },
        ],
        cardioPrescription: { type: 'walking', durationMinutes: 15 },
      });

      sessions.push({
        id: 'session-fem-4d-2',
        dayName: 'Día 2: Torso Esculpido, Hombros 3D & Cintura Estética',
        splitType: 'upper',
        targetMuscleGroups: ['espalda', 'hombros', 'pecho', 'core_abdomen'],
        warmupRoutine: [
          'Dislocaciones de hombro con banda 2x15',
          'Rotadores externos en polea 2x15',
        ],
        exercises: [
          {
            exerciseId: 'ex-dominadas-o-jalon-pecho',
            exercise: getExercise('ex-dominadas-o-jalon-pecho'),
            order: 1,
            sets: createSets(3, 8, 10, 2, false),
            notes: 'Jala llevando el pecho hacia la barra.',
          },
          {
            exerciseId: 'ex-press-militar-barra-de-pie',
            exercise: getExercise('ex-press-militar-barra-de-pie'),
            order: 2,
            sets: createSets(3, 8, 10, 2, true),
            notes: 'Hombros redondeados y firmes.',
          },
          {
            exerciseId: 'ex-remo-con-barra-pronado',
            exercise: getExercise('ex-remo-con-barra-pronado'),
            order: 3,
            sets: createSets(3, 10, 12, 2, false),
          },
          {
            exerciseId: 'ex-elevaciones-laterales-mancuerna',
            exercise: getExercise('ex-elevaciones-laterales-mancuerna'),
            order: 4,
            sets: createSets(4, 12, 15, 1, false),
            notes: 'Enfoque estético para crear amplitud escapular que estiliza la cintura.',
          },
          {
            exerciseId: 'ex-extension-triceps-polea-alta',
            exercise: getExercise('ex-extension-triceps-polea-alta'),
            order: 5,
            sets: createSets(3, 12, 15, 1, false),
          },
        ],
        cardioPrescription: { type: 'LISS', durationMinutes: 20 },
      });

      sessions.push({
        id: 'session-fem-4d-3',
        dayName: 'Día 3: Cuádriceps & Glúteo (Sentadilla & Prensa Profunda)',
        splitType: 'lower',
        targetMuscleGroups: ['cuadriceps', 'gluteos'],
        warmupRoutine: [
          'Sentadillas libres con pausa isométrica 2x10',
          'Movilidad dinámica de cadera y tobillos',
        ],
        exercises: [
          {
            exerciseId: 'ex-sentadilla-trasera-barra',
            exercise: getExercise('ex-sentadilla-trasera-barra'),
            order: 1,
            sets: createSets(4, 8, 10, 2, true),
            notes: 'Profundidad controlada para involucrar cuádriceps y glúteo simultáneamente.',
          },
          {
            exerciseId: 'ex-prensa-piernas-45',
            exercise: getExercise('ex-prensa-piernas-45'),
            order: 2,
            sets: createSets(3, 10, 12, 1, false),
            notes: 'Bajada en 3 segundos manteniendo el sacro pegado.',
          },
          {
            exerciseId: 'ex-hip-thrust-con-barra',
            exercise: getExercise('ex-hip-thrust-con-barra'),
            order: 3,
            sets: createSets(3, 12, 15, 1, false),
            notes: 'Pausa de 2 segundos en cada repetición para estrés metabólico.',
          },
          {
            exerciseId: 'ex-curl-femoral-tumbado-maquina',
            exercise: getExercise('ex-curl-femoral-tumbado-maquina'),
            order: 4,
            sets: createSets(3, 12, 15, 1, false),
          },
        ],
        cardioPrescription: { type: 'walking', durationMinutes: 15 },
      });

      sessions.push({
        id: 'session-fem-4d-4',
        dayName: 'Día 4: Glúteo Pump, Hombro Lateral & Tono de Brazos',
        splitType: 'full_body',
        targetMuscleGroups: ['gluteos', 'hombros', 'biceps', 'core_abdomen'],
        warmupRoutine: [
          'Puentes de glúteo con banda elástica 2x20',
          'Rotaciones articulares de brazos y cadera',
        ],
        exercises: [
          {
            exerciseId: 'ex-hip-thrust-con-barra',
            exercise: getExercise('ex-hip-thrust-con-barra'),
            order: 1,
            sets: createSets(4, 10, 12, 1, true),
            notes: 'Volumen hipertrófico para rematar la semana.',
          },
          {
            exerciseId: 'ex-elevaciones-laterales-mancuerna',
            exercise: getExercise('ex-elevaciones-laterales-mancuerna'),
            order: 2,
            sets: createSets(4, 15, 18, 0, false),
            notes: 'Serie al fallo técnico en deltoides lateral.',
          },
          {
            exerciseId: 'ex-curl-biceps-barra-recta',
            exercise: getExercise('ex-curl-biceps-barra-recta'),
            order: 3,
            sets: createSets(3, 12, 15, 1, false),
          },
          {
            exerciseId: 'ex-press-inclinado-mancuernas',
            exercise: getExercise('ex-press-inclinado-mancuernas'),
            order: 4,
            sets: createSets(3, 10, 12, 2, false),
            notes: 'Firmeza en la zona clavicular superior.',
          },
        ],
        cardioPrescription: { type: 'LISS', durationMinutes: 20 },
      });

      // Si seleccionó 5 días
      if (normalizedDays >= 5) {
        sessions.push({
          id: 'session-fem-5d-5',
          dayName: 'Día 5: Glúteo Aislamiento, Isquiotibiales & Core Dinámico',
          splitType: 'lower',
          targetMuscleGroups: ['gluteos', 'isquiosurales', 'core_abdomen'],
          warmupRoutine: [
            'Estiramiento dinámico de flexores de cadera',
            'Bird-dog y planchas isométricas 3x30 seg',
          ],
          exercises: [
            {
              exerciseId: 'ex-peso-muerto-convencional',
              exercise: getExercise('ex-peso-muerto-convencional'),
              order: 1,
              sets: createSets(3, 8, 10, 2, true),
            },
            {
              exerciseId: 'ex-curl-femoral-tumbado-maquina',
              exercise: getExercise('ex-curl-femoral-tumbado-maquina'),
              order: 2,
              sets: createSets(4, 12, 15, 1, false),
            },
            {
              exerciseId: 'ex-prensa-piernas-45',
              exercise: getExercise('ex-prensa-piernas-45'),
              order: 3,
              sets: createSets(3, 15, 18, 1, false),
            },
            {
              exerciseId: 'ex-hip-thrust-con-barra',
              exercise: getExercise('ex-hip-thrust-con-barra'),
              order: 4,
              sets: createSets(3, 12, 15, 1, false),
            },
          ],
          cardioPrescription: { type: 'walking', durationMinutes: 20 },
        });
      }
    }

    return {
      id: `plan-train-fem-${Date.now()}`,
      userId,
      title: `Mesociclo Femenino: Especialización en Glúteo & Pierna (${normalizedDays} Días)`,
      mesocycleWeeks: 6,
      currentWeek: 1,
      deloadWeek: 6,
      progressionRule: 'double_progression_standard',
      sessions,
    };
  }

  // =========================================================================
  // PROGRAMACIÓN PARA HOMBRES: HIPERTROFIA, FUERZA & COMPOSICIÓN MUSCULAR
  // (Torso / Pierna, Push / Pull / Legs balanceado con pecho, espalda, hombros y piernas)
  // =========================================================================
  if (normalizedDays === 2) {
    sessions.push({
      id: 'session-male-2d-1',
      dayName: 'Día 1: Full Body A (Sentadilla Pesada & Empuje)',
      splitType: 'full_body',
      targetMuscleGroups: ['cuadriceps', 'pecho', 'espalda', 'core_abdomen'],
      warmupRoutine: [
        '5 min caminata ligera en cinta inclinada o bicicleta estática',
        'Movilidad articular dinámica: cadera, tobillos y muñecas',
      ],
      exercises: [
        {
          exerciseId: 'ex-sentadilla-trasera-barra',
          exercise: getExercise('ex-sentadilla-trasera-barra'),
          order: 1,
          sets: createSets(3, 6, 8, 2, true),
          notes: 'Control excéntrico de 2 segundos. Profundidad paralela.',
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
        },
      ],
      cardioPrescription: { type: 'walking', durationMinutes: 15 },
    });

    sessions.push({
      id: 'session-male-2d-2',
      dayName: 'Día 2: Full Body B (Peso Muerto & Tracción Vertical)',
      splitType: 'full_body',
      targetMuscleGroups: ['isquiosurales', 'gluteos', 'espalda', 'hombros', 'biceps', 'triceps'],
      warmupRoutine: [
        'Movilidad de cadera y cat-cow para columna',
      ],
      exercises: [
        {
          exerciseId: 'ex-peso-muerto-convencional',
          exercise: getExercise('ex-peso-muerto-convencional'),
          order: 1,
          sets: createSets(3, 5, 6, 2, true),
          notes: 'Barra pegada a las espinillas. Reseteo en el suelo cada rep.',
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
      cardioPrescription: { type: 'LISS', durationMinutes: 20 },
    });
  } else if (normalizedDays === 3) {
    // 3 Días Hombres: Push / Pull / Legs
    sessions.push({
      id: 'session-male-ppl-push',
      dayName: 'Día 1: Empuje (Pecho, Hombro & Tríceps)',
      splitType: 'upper',
      targetMuscleGroups: ['pecho', 'hombros', 'triceps'],
      warmupRoutine: [
        'Dislocaciones de hombro con banda 2x15',
        'Flexiones de apoyo escapular 2x10',
      ],
      exercises: [
        {
          exerciseId: 'ex-press-banca-plano-barra',
          exercise: getExercise('ex-press-banca-plano-barra'),
          order: 1,
          sets: createSets(4, 6, 8, 2, true),
          notes: 'Series efectivas con RIR 2. Descanso 3 min.',
        },
        {
          exerciseId: 'ex-press-inclinado-mancuernas',
          exercise: getExercise('ex-press-inclinado-mancuernas'),
          order: 2,
          sets: createSets(3, 8, 10, 2, false),
        },
        {
          exerciseId: 'ex-press-militar-barra-de-pie',
          exercise: getExercise('ex-press-militar-barra-de-pie'),
          order: 3,
          sets: createSets(3, 8, 10, 2, true),
        },
        {
          exerciseId: 'ex-elevaciones-laterales-mancuerna',
          exercise: getExercise('ex-elevaciones-laterales-mancuerna'),
          order: 4,
          sets: createSets(4, 12, 15, 1, false),
        },
        {
          exerciseId: 'ex-extension-triceps-polea-alta',
          exercise: getExercise('ex-extension-triceps-polea-alta'),
          order: 5,
          sets: createSets(3, 10, 12, 1, false),
        },
      ],
      cardioPrescription: { type: 'walking', durationMinutes: 15 },
    });

    sessions.push({
      id: 'session-male-ppl-pull',
      dayName: 'Día 2: Tracción (Espalda, Deltoides Posterior & Bíceps)',
      splitType: 'upper',
      targetMuscleGroups: ['espalda', 'biceps'],
      warmupRoutine: [
        'Cat-cow y movilidad escapular en suspensión',
      ],
      exercises: [
        {
          exerciseId: 'ex-peso-muerto-convencional',
          exercise: getExercise('ex-peso-muerto-convencional'),
          order: 1,
          sets: createSets(3, 5, 6, 2, true),
        },
        {
          exerciseId: 'ex-remo-con-barra-pronado',
          exercise: getExercise('ex-remo-con-barra-pronado'),
          order: 2,
          sets: createSets(4, 6, 8, 2, true),
        },
        {
          exerciseId: 'ex-dominadas-o-jalon-pecho',
          exercise: getExercise('ex-dominadas-o-jalon-pecho'),
          order: 3,
          sets: createSets(3, 8, 10, 2, false),
        },
        {
          exerciseId: 'ex-curl-biceps-barra-recta',
          exercise: getExercise('ex-curl-biceps-barra-recta'),
          order: 4,
          sets: createSets(3, 10, 12, 1, false),
        },
      ],
      cardioPrescription: { type: 'walking', durationMinutes: 15 },
    });

    sessions.push({
      id: 'session-male-ppl-legs',
      dayName: 'Día 3: Pierna Completa & Potencia (Cuádriceps, Isquios & Glúteo)',
      splitType: 'lower',
      targetMuscleGroups: ['cuadriceps', 'isquiosurales', 'gluteos'],
      warmupRoutine: [
        '5 min bicicleta estática',
        'Sentadillas libres y movilidad de tobillos',
      ],
      exercises: [
        {
          exerciseId: 'ex-sentadilla-trasera-barra',
          exercise: getExercise('ex-sentadilla-trasera-barra'),
          order: 1,
          sets: createSets(4, 6, 8, 2, true),
          notes: 'Fuerza primaria en miembros inferiores.',
        },
        {
          exerciseId: 'ex-prensa-piernas-45',
          exercise: getExercise('ex-prensa-piernas-45'),
          order: 2,
          sets: createSets(3, 8, 10, 2, false),
        },
        {
          exerciseId: 'ex-hip-thrust-con-barra',
          exercise: getExercise('ex-hip-thrust-con-barra'),
          order: 3,
          sets: createSets(3, 8, 10, 1, true),
        },
        {
          exerciseId: 'ex-curl-femoral-tumbado-maquina',
          exercise: getExercise('ex-curl-femoral-tumbado-maquina'),
          order: 4,
          sets: createSets(3, 10, 12, 1, false),
        },
      ],
      cardioPrescription: { type: 'walking', durationMinutes: 15 },
    });
  } else {
    // 4, 5 o 6 Días Hombres: Torso / Pierna Estándar de Oro
    sessions.push({
      id: 'session-male-torso-1',
      dayName: 'Día 1: Torso Pesado (Empuje & Tracción Primaria)',
      splitType: 'upper',
      targetMuscleGroups: ['pecho', 'espalda', 'hombros', 'triceps'],
      warmupRoutine: [
        'Dislocaciones de hombro con banda elástica x 15 reps',
        'Rotadores externos de hombro en polea baja x 15 reps',
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
      cardioPrescription: { type: 'walking', durationMinutes: 15 },
    });

    sessions.push({
      id: 'session-male-pierna-1',
      dayName: 'Día 2: Pierna Fuerza & Cuádriceps Primario',
      splitType: 'lower',
      targetMuscleGroups: ['cuadriceps', 'gluteos', 'isquiosurales'],
      warmupRoutine: [
        '5 min caminata en cinta con pendiente',
        'Movilidad de dorsiflexión de tobillo',
      ],
      exercises: [
        {
          exerciseId: 'ex-sentadilla-trasera-barra',
          exercise: getExercise('ex-sentadilla-trasera-barra'),
          order: 1,
          sets: createSets(3, 6, 8, 2, true),
          notes: 'Priorizar control técnico y profundidad.',
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
      cardioPrescription: { type: 'walking', durationMinutes: 10 },
    });

    sessions.push({
      id: 'session-male-torso-2',
      dayName: 'Día 3: Torso Hipertrofia & Brazos',
      splitType: 'upper',
      targetMuscleGroups: ['hombros', 'pecho', 'espalda', 'biceps', 'triceps'],
      warmupRoutine: [
        'Rotaciones de escápula y movilidad torácica',
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
      cardioPrescription: { type: 'LISS', durationMinutes: 20 },
    });

    sessions.push({
      id: 'session-male-pierna-2',
      dayName: 'Día 4: Cadena Posterior & Peso Muerto Pesado',
      splitType: 'lower',
      targetMuscleGroups: ['isquiosurales', 'gluteos', 'cuadriceps'],
      warmupRoutine: [
        'Puentes de glúteo bipodales y unipodales de activación',
        'Bisagra de cadera con pica',
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
      cardioPrescription: { type: 'walking', durationMinutes: 15 },
    });

    if (normalizedDays >= 5) {
      sessions.push({
        id: 'session-male-5d-5',
        dayName: 'Día 5: Especialización en Hombros, Brazos & Core',
        splitType: 'upper',
        targetMuscleGroups: ['hombros', 'biceps', 'triceps', 'core_abdomen'],
        warmupRoutine: [
          'Movilidad escapular y calentamiento dinámico con mancuernas ligeras',
        ],
        exercises: [
          {
            exerciseId: 'ex-press-militar-barra-de-pie',
            exercise: getExercise('ex-press-militar-barra-de-pie'),
            order: 1,
            sets: createSets(3, 8, 10, 2, true),
          },
          {
            exerciseId: 'ex-elevaciones-laterales-mancuerna',
            exercise: getExercise('ex-elevaciones-laterales-mancuerna'),
            order: 2,
            sets: createSets(4, 12, 15, 1, false),
          },
          {
            exerciseId: 'ex-curl-biceps-barra-recta',
            exercise: getExercise('ex-curl-biceps-barra-recta'),
            order: 3,
            sets: createSets(4, 10, 12, 1, false),
          },
          {
            exerciseId: 'ex-extension-triceps-polea-alta',
            exercise: getExercise('ex-extension-triceps-polea-alta'),
            order: 4,
            sets: createSets(4, 10, 12, 1, false),
          },
        ],
        cardioPrescription: { type: 'LISS', durationMinutes: 20 },
      });
    }
  }

  return {
    id: `plan-train-${Date.now()}`,
    userId,
    title: `Mesociclo de Hipertrofia & Fuerza Fisiológica (${normalizedDays} Días)`,
    mesocycleWeeks: 6,
    currentWeek: 1,
    deloadWeek: 6,
    progressionRule: 'double_progression_standard',
    sessions,
  };
}

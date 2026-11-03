export interface AbdominalExercise {
  name: string;
  targetArea: 'recto_superior' | 'recto_inferior' | 'oblicuos' | 'transverso_anti_extension' | 'core_global';
  targetAreaName: string;
  equipment: 'cable' | 'bodyweight' | 'barbell' | 'ab_wheel' | 'dumbbell';
  sets: number;
  reps: string;
  restSeconds: number;
  biomechanicalCues: string[];
  mistakesToAvoid: string[];
}

export interface AbdominalRoutine {
  id: string;
  title: string;
  tagline: string;
  frequencyWeekly: string;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  bestTiming: string;
  focus: string;
  exercises: AbdominalExercise[];
  scientificRationale: string;
}

export const ABDOMINAL_ROUTINES: AbdominalRoutine[] = [
  {
    id: 'ab-hypertrophy-3d',
    title: 'Hipertrofia Abdominal 3D (Gimnasio & Sobrecarga Progresiva)',
    tagline: 'Construcción de volumen y relieve en los "cuadritos" del recto abdominal con carga mecánica.',
    frequencyWeekly: '2 a 3 veces por semana (días alternos)',
    difficulty: 'avanzado',
    bestTiming: 'Al final de la sesión de torso o empuje, o en días de descanso de sentadilla pesada.',
    focus: 'Sobrecarga mecánica en flexión espinal y pélvica controlada con RIR 1-2.',
    scientificRationale: 'Al igual que los bíceps o cuádriceps, el recto abdominal es un músculo esquelético tipo II que responde a la sobrecarga mecánica progresiva entre 8 y 15 repeticiones pesadas.',
    exercises: [
      {
        name: 'Cable Crunch en Polea Alta con Cuerda',
        targetArea: 'recto_superior',
        targetAreaName: 'Recto Abdominal Superior & Medio',
        equipment: 'cable',
        sets: 4,
        reps: '10 - 12 reps pesadas',
        restSeconds: 90,
        biomechanicalCues: [
          'De rodillas a 1 metro de la polea, manos junto a las sienes.',
          'Inicia flexionando la columna toracolumbar llevando los codos hacia las rodillas.',
          'Mantén la pelvis fija: no te sientes sobre los talones ni uses la cadera como palanca.',
          'Exhala todo el aire en la contracción máxima y aprieta 1 segundo.'
        ],
        mistakesToAvoid: [
          'Flexionar la cadera en lugar de flexionar la columna (trabaja el psoas ilíaco, no el abdomen).',
          'Tirar con los brazos en vez de flexionar el torso.'
        ]
      },
      {
        name: 'Elevaciones de Piernas Colgado en Barra (Hanging Leg / Knee Raises)',
        targetArea: 'recto_inferior',
        targetAreaName: 'Recto Abdominal Inferior & Flexión Pélvica',
        equipment: 'bodyweight',
        sets: 3,
        reps: '12 - 15 reps',
        restSeconds: 90,
        biomechanicalCues: [
          'Agarre firme en barra fija con escápulas activadas (no colgar pasivamente).',
          'Eleva las rodillas o piernas enrollando la pelvis hacia el pecho (retroversión pélvica).',
          'El estímulo abdominal real ocurre cuando la pelvis gira hacia arriba, no solo al subir los muslos.',
          'Fase excéntrica lenta (3 segundos) sin balancear el cuerpo.'
        ],
        mistakesToAvoid: [
          'Usar inercia o columpio para subir las piernas.',
          'Detener el movimiento cuando los muslos están paralelos sin girar la pelvis.'
        ]
      },
      {
        name: 'Rueda Abdominal (Ab Wheel Rollout) de Rodillas',
        targetArea: 'transverso_anti_extension',
        targetAreaName: 'Anti-Extensión Lumbar & Core Profundo',
        equipment: 'ab_wheel',
        sets: 3,
        reps: '8 - 10 reps',
        restSeconds: 90,
        biomechanicalCues: [
          'Comienza de rodillas con la rueda bajo los hombros y espalda ligeramente redondeada (gato).',
          'Rueda hacia adelante extendiendo cadera y brazos manteniendo el abdomen en máxima tensión.',
          'Baja hasta donde tu zona lumbar permanezca neutra (sin arquear la espalda hacia el suelo).',
          'Jala de regreso utilizando la flexión de los abdominales y no empujando con la cadera.'
        ],
        mistakesToAvoid: [
          'Dejar caer la pelvis arqueando la zona lumbar (riesgo discal).',
          'Llevar las caderas hacia atrás antes de mover la rueda.'
        ]
      }
    ]
  },
  {
    id: 'ab-waist-vacuum',
    title: 'Cintura Estrecha & Vacío Abdominal (Transverso & Oblicuos)',
    tagline: 'Reducción del perímetro de cintura y compactación de la pared visceral mediante activación isométrica.',
    frequencyWeekly: '3 a 4 veces por semana (ideal en ayunas o post-entreno)',
    difficulty: 'intermedio',
    bestTiming: 'Por las mañanas con estómago vacío o al finalizar la rutina.',
    focus: 'Fortalecimiento del músculo transverso profundo (la faja natural del cuerpo) y oblicuos funcionales.',
    scientificRationale: 'El músculo transverso del abdomen actúa como un corsé biológico. Al entrenarlo con vacíos isométricos y ejercicios anti-rotacionales, se compacta la cavidad abdominal logrando una apariencia de cintura más estrecha en forma de V.',
    exercises: [
      {
        name: 'Vacío Abdominal Isométrico (Stomach Vacuum de Pie o Cuadrupedia)',
        targetArea: 'transverso_anti_extension',
        targetAreaName: 'Músculo Transverso Abdominal Profundo',
        equipment: 'bodyweight',
        sets: 4,
        reps: 'Sostener 20 - 30 segundos',
        restSeconds: 60,
        biomechanicalCues: [
          'Exhala profundamente expulsando el 100% del aire de los pulmones.',
          'Sin inhalar, succiona el ombligo hacia adentro y hacia arriba, como si quisieras pegarlo a la columna.',
          'Expande la caja torácica mientras mantienes el abdomen completamente sumido.',
          'Respira de manera superficial por la nariz manteniendo la tensión isométrica profunda.'
        ],
        mistakesToAvoid: [
          'Aguantar la respiración cerrando la garganta en lugar de contraer el transverso.',
          'Arquear la espalda o encogerse de hombros.'
        ]
      },
      {
        name: 'Press Pallof en Polea Media (Anti-Rotación)',
        targetArea: 'oblicuos',
        targetAreaName: 'Oblicuos Internos / Externos & Estabilidad Lumbar',
        equipment: 'cable',
        sets: 3,
        reps: '12 reps por lado (pausa 2 seg al frente)',
        restSeconds: 60,
        biomechanicalCues: [
          'De pie perpendicular a la polea, sujeta la manija con ambas manos pegadas al pecho.',
          'Pies a la anchura de hombros, rodillas semiflexionadas y pelvis bloqueada.',
          'Extiende los brazos al frente resistiendo la fuerza de la polea que intenta girarte.',
          'Mantén 2 segundos al frente con el torso 100% inmóvil y regresa al pecho.'
        ],
        mistakesToAvoid: [
          'Permitir que el torso rote hacia el origen del cable.',
          'Girar las caderas o despegar los pies del suelo.'
        ]
      },
      {
        name: 'Deadbug Controlado con Respiración Diafragmática',
        targetArea: 'core_global',
        targetAreaName: 'Control Lumbo-Pélvico & Transverso',
        equipment: 'bodyweight',
        sets: 3,
        reps: '10 reps por pierna alternadas',
        restSeconds: 60,
        biomechanicalCues: [
          'Boca arriba con rodillas a 90° y brazos extendidos hacia el techo.',
          'Presiona la zona lumbar firmemente contra el suelo (cero espacio entre la espalda y el suelo).',
          'Extiende brazo derecho y pierna izquierda lentamente sin que la zona lumbar se despegue.',
          'Regresa y alterna de lado.'
        ],
        mistakesToAvoid: [
          'Arquear la espalda baja al bajar la pierna.',
          'Moverse rápido perdiendo la conexión mente-músculo.'
        ]
      }
    ]
  },
  {
    id: 'ab-home-circuit',
    title: 'Circuito Funcional de Abdomen en Casa (Sin Equipo)',
    tagline: 'Protocolo de alta densidad metabólica para tonificación abdominal y quema calórica sin accesorios.',
    frequencyWeekly: '3 veces por semana',
    difficulty: 'principiante',
    bestTiming: 'En cualquier momento del día o al despertar.',
    focus: 'Tensión continua y fatiga metabólica acumulada con autocarga corporal.',
    scientificRationale: 'Ideal para quienes entrenan en casa o viajan. La combinación de flexión de tronco, anti-extensión en plancha y elevación de pelvis ofrece cobertura 360° del core.',
    exercises: [
      {
        name: 'Crunch en Suelo con Pies Elevados (90°)',
        targetArea: 'recto_superior',
        targetAreaName: 'Recto Abdominal Superior',
        equipment: 'bodyweight',
        sets: 3,
        reps: '15 - 20 reps',
        restSeconds: 45,
        biomechanicalCues: [
          'Pies elevados en el aire con rodillas a 90° para anular los flexores de cadera.',
          'Manos detrás de las orejas sin tirar del cuello.',
          'Despega las escápulas del suelo contrayendo el abdomen, mirada hacia el techo.'
        ],
        mistakesToAvoid: ['Jalar la nuca con los brazos produciendo tensión cervical.']
      },
      {
        name: 'Plancha RKC de Máxima Tensión (Hardstyle Plank)',
        targetArea: 'transverso_anti_extension',
        targetAreaName: 'Core Global & Glúteos',
        equipment: 'bodyweight',
        sets: 3,
        reps: 'Sostener 25 - 35 segundos de máxima fuerza',
        restSeconds: 60,
        biomechanicalCues: [
          'Posición de plancha sobre antebrazos.',
          'Aprieta los puños, contrae los cuádriceps, aprieta los glúteos al máximo.',
          'Jala activamente los codos hacia las puntas de los pies creando una contracción isométrica brutal.'
        ],
        mistakesToAvoid: ['Quedarse en plancha relajada 2 minutos; es preferible 30 segundos de tensión extrema.']
      },
      {
        name: 'Mountain Climbers (Escaladores) Lentos & Controlados',
        targetArea: 'core_global',
        targetAreaName: 'Estabilidad Dinámica & Recto Inferior',
        equipment: 'bodyweight',
        sets: 3,
        reps: '12 reps lentas por pierna (2 seg de pausa en rodilla al pecho)',
        restSeconds: 45,
        biomechanicalCues: [
          'Posición de flexión alta (manos bajo hombros).',
          'Lleva la rodilla hacia el codo opuesto lentamente sin elevar la cadera.',
          'Exhala y aprieta el abdomen 2 segundos antes de regresar.'
        ],
        mistakesToAvoid: ['Rebotar como cardio acelerado; el foco es la contracción muscular abdominal.']
      }
    ]
  }
];

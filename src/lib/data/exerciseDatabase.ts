import { ExerciseDefinition } from '@/types';

export const EXERCISE_DATABASE: ExerciseDefinition[] = [
  // --- DOMINANTE RODILLA (PIERNAS / CUÁDRICEPS / GLÚTEO) ---
  {
    id: 'ex-sentadilla-trasera-barra',
    nameSpanish: 'Sentadilla trasera con barra',
    nameEnglish: 'Barbell Back Squat',
    primaryMuscle: 'cuadriceps',
    secondaryMuscles: ['gluteos', 'core_abdomen'],
    movementPattern: 'dominante_rodilla',
    tier: 'compound_primary',
    equipmentRequired: 'barbell',
    instructions: {
      startingPosition: 'Barra apoyada sobre los trapecios (barra alta) o espina de la escápula (barra baja). Pies separados al ancho de hombros con puntas ligeramente rotadas hacia afuera (15-30°). Mirada al frente con cuello neutro.',
      execution: 'Inicia flexionando simultáneamente rodillas y cadera. Desciende de manera controlada hasta que el pliegue de la cadera quede por debajo de la parte superior de la rótula (paralelo o profundo). Empuja contra el suelo manteniendo el torso firme.',
      breathing: 'Inhala profundamente en la parte superior (maniobra de Valsalva breve), retén el aire fijando el core durante el descenso, y exhala al superar el punto de estancamiento (sticking point) en el ascenso.',
      keySafetyCues: [
        'Mantén 3 puntos de apoyo en los pies (talón, base del dedo gordo y base del meñique)',
        'Evita el colapso medial de las rodillas (valgo de rodilla)',
        'Mantén la columna toracolumbar neutra sin retroversión pélvica excesiva (butt wink)'
      ],
      commonMistakes: [
        'Despegar los talones del suelo durante la fase excéntrica',
        'Inclinar excesivamente el torso hacia adelante por falta de movilidad de tobillo',
        'Hacer medias repeticiones sin alcanzar profundidad válida'
      ]
    },
    warmupProtocol: '1 serie x 8 reps sólo con la barra vacía; 1 serie de aproximación con el 50% de la carga de trabajo x 5 reps; 1 serie con el 75% x 3 reps; 1 serie con el 90% x 1 rep. Descanso 2 min antes de la primera serie efectiva.',
    imageUrl: '/exercises/sentadilla-trasera.jpg',
    contraindications: ['hernia_discal_aguda_sintomatica', 'meniscopatia_aguda']
  },
  {
    id: 'ex-prensa-piernas-45',
    nameSpanish: 'Prensa de piernas inclinada 45°',
    nameEnglish: 'Incline Leg Press 45°',
    primaryMuscle: 'cuadriceps',
    secondaryMuscles: ['gluteos', 'pantorrillas'],
    movementPattern: 'dominante_rodilla',
    tier: 'compound_secondary',
    equipmentRequired: 'machine',
    instructions: {
      startingPosition: 'Espalda y glúteos completamente pegados al respaldo. Pies colocados al centro de la plataforma con separación equivalente a los hombros.',
      execution: 'Desbloquea el seguro. Baja la plataforma de manera excéntrica controlada (3 segundos) hasta conseguir flexión de rodilla de 90° o más sin que la pelvis se despegue del respaldo. Empuja sin bloquear bruscamente las rodillas al final.',
      breathing: 'Inhala en el descenso, exhala al empujar la plataforma.',
      keySafetyCues: [
        'Nunca hiper-extender ni bloquear las rodillas en la parte superior',
        'Los glúteos deben permanecer siempre anclados al asiento'
      ],
      commonMistakes: [
        'Colocar las manos en las rodillas para ayudarse en lugar de agarrar las manijas laterales',
        'Despegar el sacro en el fondo comprometiendo los discos lumbares'
      ]
    },
    warmupProtocol: '1 serie de 8 reps con el 50% del peso de trabajo antes de las series efectivas.',
    imageUrl: '/exercises/prensa-piernas.jpg',
    contraindications: ['dolor_patelofemoral_agudo']
  },

  // --- EMPUJE HORIZONTAL / PECHO ---
  {
    id: 'ex-press-banca-plano-barra',
    nameSpanish: 'Press de banca plano con barra',
    nameEnglish: 'Flat Barbell Bench Press',
    primaryMuscle: 'pecho',
    secondaryMuscles: ['triceps', 'hombros'],
    movementPattern: 'empuje_horizontal',
    tier: 'compound_primary',
    equipmentRequired: 'barbell',
    instructions: {
      startingPosition: 'Acostado en el banco con 5 puntos de contacto: cabeza, escápulas, glúteos y ambos pies firmemente plantados en el piso. Retrae y deprime activamente las escápulas. Agarre ligeramente más ancho que los hombros.',
      execution: 'Saca la barra del soporte. Desciende trazando una ligera curva hacia la parte media/inferior del esternón (altura de pezones) con los codos formando un ángulo de 45-75° respecto al torso. Toca el pecho de forma controlada y empuja hacia la posición inicial.',
      breathing: 'Inhala en la parte superior reteniendo presión intraabdominal durante la bajada; exhala al pasar la mitad del ascenso.',
      keySafetyCues: [
        'Retracción escapular constante durante toda la serie para proteger los manguitos rotadores',
        'Muñecas rectas sobre los antebrazos, no hiperextendidas'
      ],
      commonMistakes: [
        'Rebotar la barra violentamente contra el esternón',
        'Abrir los codos a 90° estilo "T", lo cual genera pinzamiento subacromial',
        'Despegar los glúteos del banco para generar mayor palanca'
      ]
    },
    warmupProtocol: '1 serie barra vacía x 10 reps; 50% de carga x 5 reps; 75% x 3 reps; 90% x 1 rep. 2 minutos de reposo antes de la primera serie efectiva.',
    imageUrl: '/exercises/press-banca-plano.jpg',
    contraindications: ['pinzamiento_subacromial_severo', 'tendinopatia_pectoral']
  },
  {
    id: 'ex-press-inclinado-mancuernas',
    nameSpanish: 'Press inclinado con mancuernas (30°-45°)',
    nameEnglish: 'Incline Dumbbell Press',
    primaryMuscle: 'pecho',
    secondaryMuscles: ['hombros', 'triceps'],
    movementPattern: 'empuje_horizontal',
    tier: 'compound_secondary',
    equipmentRequired: 'dumbbells',
    instructions: {
      startingPosition: 'Banco ajustado a 30° o 45°. Siéntate con las mancuernas sobre los muslos y con un golpe de rodilla elévalas hacia el pecho mientras te recuestas. Escápulas retraídas.',
      execution: 'Baja las mancuernas sintiendo el estiramiento en la porción clavicular del pectoral. Empuja en convergencia natural sin chocar las mancuernas en la parte superior.',
      breathing: 'Inhala al descender, exhala en la fase concéntrica de empuje.',
      keySafetyCues: ['No exceder los 45° de inclinación para evitar sobrecargar excesivamente el deltoides anterior.'],
      commonMistakes: ['Juntar o golpear las mancuernas en la cima perdiendo tensión mecánica.']
    },
    warmupProtocol: '1 serie de aproximación al 60% del peso de trabajo x 6 reps.',
    imageUrl: '/exercises/press-inclinado-mancuernas.jpg',
    contraindications: ['inestabilidad_anterior_glenohumeral']
  },

  // --- TRACCIÓN / ESPALDA ---
  {
    id: 'ex-peso-muerto-convencional',
    nameSpanish: 'Peso muerto convencional con barra',
    nameEnglish: 'Barbell Conventional Deadlift',
    primaryMuscle: 'isquiosurales',
    secondaryMuscles: ['gluteos', 'espalda', 'core_abdomen'],
    movementPattern: 'dominante_cadera',
    tier: 'compound_primary',
    equipmentRequired: 'barbell',
    instructions: {
      startingPosition: 'Pies al ancho de caderas con la barra situada sobre la mitad del pie (a 2-3 cm de las espinillas). Agarre por fuera de las rodillas. Pecho erguido, dorsales activos tirando de la barra contra el cuerpo.',
      execution: 'Presiona el piso con los pies como si quisieras alejar el suelo. La cadera y los hombros deben elevarse al mismo ritmo hasta que la barra pase las rodillas; luego extiende la cadera hasta completar el bloqueo glúteo.',
      breathing: 'Inhala y fija el abdomen antes del despegue; exhala al completar el bloqueo vertical.',
      keySafetyCues: [
        'La barra debe rozar las piernas durante toda la trayectoria para minimizar el brazo de momento lumbar',
        'No hiper-extender la columna lumbar en la parte final'
      ],
      commonMistakes: [
        'Curvar la espalda lumbar en flexión pasiva (columna redonda)',
        'Subir la cadera primero dejando que la espalda levante todo el peso ("buenos días")'
      ]
    },
    warmupProtocol: 'Barra vacía o discos ligeros x 6 reps; 50% x 4 reps; 75% x 2 reps; 90% x 1 rep.',
    imageUrl: '/exercises/peso-muerto.jpg',
    contraindications: ['hernia_discal_aguda_lumbosacra', 'espondilolistesis_inestable']
  },
  {
    id: 'ex-remo-con-barra-pronado',
    nameSpanish: 'Remo horizontal con barra inclinado 45°',
    nameEnglish: 'Barbell Bent-Over Row',
    primaryMuscle: 'espalda',
    secondaryMuscles: ['biceps', 'hombros'],
    movementPattern: 'traccion_horizontal',
    tier: 'compound_primary',
    equipmentRequired: 'barbell',
    instructions: {
      startingPosition: 'Flexión de cadera con torso inclinado aproximadamente a 45° respecto al suelo. Rodillas semiflexionadas, columna neutra. Agarre en pronación al ancho de hombros.',
      execution: 'Tira de la barra hacia la zona del ombligo / parte baja del esternón guiando el movimiento con los codos hacia atrás. Aprieta las escápulas al final de la tracción y baja de forma controlada.',
      breathing: 'Inhala abajo, exhala al traccionar hacia el cuerpo.',
      keySafetyCues: ['Mantén el torso estable sin balanceos corporales excesivos.'],
      commonMistakes: ['Usar inercia lumbar para levantar el peso perdiendo estímulo en dorsales y romboides.']
    },
    warmupProtocol: '1 serie de aproximación con el 60% de la carga x 6 reps.',
    imageUrl: '/exercises/remo-barra.jpg',
    contraindications: ['lumbalgia_mecanica_aguda']
  },
  {
    id: 'ex-dominadas-o-jalon-pecho',
    nameSpanish: 'Jalón al pecho en polea alta (o Dominadas)',
    nameEnglish: 'Lat Pulldown / Pull-ups',
    primaryMuscle: 'espalda',
    secondaryMuscles: ['biceps', 'hombros'],
    movementPattern: 'traccion_vertical',
    tier: 'compound_secondary',
    equipmentRequired: 'cable_machine',
    instructions: {
      startingPosition: 'Muslos asegurados bajo las almohadillas. Agarre con separación 1.5 veces el ancho de hombros. Pecho elevado hacia la barra.',
      execution: 'Deprime las escápulas e inicia la tracción llevando los codos hacia abajo y ligeramente hacia adentro, acercando la barra a la parte superior del esternón. Extiende los brazos controladamente estirando dorsales.',
      breathing: 'Exhala al bajar la barra, inhala en el ascenso.',
      keySafetyCues: ['No jalar la barra detrás de la nuca para evitar estrés perjudicial en el manguito rotador y vértebras cervicales.'],
      commonMistakes: ['Balancear el torso excesivamente hacia atrás para convertir el jalón en un remo.']
    },
    warmupProtocol: '1 serie de 8 reps con el 50% del peso de trabajo.',
    imageUrl: '/exercises/jalon-pecho.jpg',
    contraindications: ['pinzamiento_subacromial']
  },

  // --- HOMBROS & BRAZOS ---
  {
    id: 'ex-press-militar-barra-de-pie',
    nameSpanish: 'Press militar estricto de pie con barra',
    nameEnglish: 'Overhead Standing Barbell Press (OHP)',
    primaryMuscle: 'hombros',
    secondaryMuscles: ['triceps', 'core_abdomen'],
    movementPattern: 'empuje_vertical',
    tier: 'compound_primary',
    equipmentRequired: 'barbell',
    instructions: {
      startingPosition: 'Pies al ancho de hombros, glúteos y abdomen apretados. Agarre por fuera de los hombros con codos ligeramente adelantados respecto a la barra.',
      execution: 'Mueve la cabeza ligeramente hacia atrás para permitir que la barra suba vertical en línea recta; una vez superada la frente, mete la cabeza bajo la barra y bloquea con hombros elevados.',
      breathing: 'Inhala abajo fijando el core; exhala al completar el bloqueo arriba.',
      keySafetyCues: ['No hiperextender la zona lumbar formando arco excesivo para empujar.'],
      commonMistakes: ['Empujar hacia adelante en lugar de perpendicular sobre el centro del pie.']
    },
    warmupProtocol: 'Barra vacía x 8 reps; 60% x 4 reps; 80% x 2 reps.',
    imageUrl: '/exercises/press-militar.jpg',
    contraindications: ['inestabilidad_glenohumeral_severa']
  },
  {
    id: 'ex-elevaciones-laterales-mancuerna',
    nameSpanish: 'Elevaciones laterales estrictas con mancuernas',
    nameEnglish: 'Dumbbell Lateral Raises',
    primaryMuscle: 'hombros',
    secondaryMuscles: ['pecho'],
    movementPattern: 'aislamiento',
    tier: 'isolation',
    equipmentRequired: 'dumbbells',
    instructions: {
      startingPosition: 'De pie con ligera inclinación anterior del torso (10°). Mancuernas a los costados con ligera flexión de codo.',
      execution: 'Eleva los brazos en el plano escapular (30° adelantado al plano frontal) hasta que los codos queden a la altura de los hombros, guiando el movimiento con los codos.',
      breathing: 'Exhala al elevar, inhala al descender en 2 segundos.',
      keySafetyCues: ['Evita el encogimiento de hombros con trapecios excesivamente dominantes.'],
      commonMistakes: ['Utilizar balanceo de tronco o impulso de rodillas para elevar pesos excesivos.']
    },
    warmupProtocol: '1 serie ligera de 10 reps.',
    imageUrl: '/exercises/elevaciones-laterales.jpg',
    contraindications: []
  },
  {
    id: 'ex-curl-biceps-barra-recta',
    nameSpanish: 'Curl de bíceps con barra o mancuernas',
    nameEnglish: 'Biceps Curl',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['hombros'],
    movementPattern: 'aislamiento',
    tier: 'isolation',
    equipmentRequired: 'barbell',
    instructions: {
      startingPosition: 'De pie con agarre en supinación al ancho de hombros. Codos pegados a los costados del torso.',
      execution: 'Flexiona los codos contrayendo con fuerza los bíceps hasta la máxima contracción voluntaria sin desplazar los codos hacia adelante. Desciende controladamente en 3 segundos.',
      breathing: 'Exhala al flexionar, inhala en el descenso.',
      keySafetyCues: ['Muñecas firmes y rectas durante todo el recorrido.'],
      commonMistakes: ['Mover el torso hacia atrás en un balanceo inercial.']
    },
    warmupProtocol: '1 serie ligera con barra vacía x 10 reps.',
    imageUrl: '/exercises/curl-biceps.jpg',
    contraindications: ['epitrocleitis_aguda']
  },
  {
    id: 'ex-extension-triceps-polea-alta',
    nameSpanish: 'Extensión de tríceps en polea alta con cuerda',
    nameEnglish: 'Triceps Rope Pushdown',
    primaryMuscle: 'triceps',
    secondaryMuscles: [],
    movementPattern: 'aislamiento',
    tier: 'isolation',
    equipmentRequired: 'cable_machine',
    instructions: {
      startingPosition: 'De pie con rodillas flexionadas ligeramente y torso inclinado 15°. Codos fijos a los costados del tórax sujetando la cuerda.',
      execution: 'Extiende completamente los codos empujando hacia abajo y separando los extremos de la cuerda al final para máxima contracción de la cabeza lateral y medial.',
      breathing: 'Exhala al extender, inhala al retornar a 90° de flexión.',
      keySafetyCues: ['Los codos deben permanecer inamovibles como pivotes.'],
      commonMistakes: ['Dejar que los codos se muevan adelante y atrás convirtiendo el ejercicio en un press.']
    },
    warmupProtocol: '1 serie ligera de 10 reps.',
    imageUrl: '/exercises/extension-triceps.jpg',
    contraindications: ['epicondilitis_aguda']
  },

  // --- GLÚTEO E ISQUIOSURALES ---
  {
    id: 'ex-hip-thrust-con-barra',
    nameSpanish: 'Empuje de cadera (Hip Thrust) con barra',
    nameEnglish: 'Barbell Hip Thrust',
    primaryMuscle: 'gluteos',
    secondaryMuscles: ['isquiosurales', 'cuadriceps'],
    movementPattern: 'dominante_cadera',
    tier: 'compound_primary',
    equipmentRequired: 'barbell',
    instructions: {
      startingPosition: 'Espalda apoyada contra el borde inferior de un banco estable a la altura de la línea del sostén/escápulas. Barra almohadillada sobre el pliegue de la cadera. Pies apoyados firmemente con tibias verticales en la cima del movimiento.',
      execution: 'Empuja a través de los talones extendiendo la cadera por completo hasta que el torso y los muslos queden paralelos al suelo. Mantén la barbilla pegada al pecho (mirada al frente) para evitar hiperlordosis lumbar. Aprieta los glúteos arriba por 1 segundo.',
      breathing: 'Inhala en la bajada, exhala al empujar la cadera hacia arriba.',
      keySafetyCues: ['Mantén la pelvis en retroversión pélvica posterior en la cima para máxima activación glútea.'],
      commonMistakes: ['Mirar al techo o dejar caer la cabeza atrás provocando sobrecarga en la columna lumbar.']
    },
    warmupProtocol: '1 serie peso corporal x 10 reps; 1 serie con 50% de carga x 5 reps.',
    imageUrl: '/exercises/hip-thrust.jpg',
    contraindications: []
  },
  {
    id: 'ex-curl-femoral-tumbado-maquina',
    nameSpanish: 'Curl de piernas acostado en máquina (Femoral)',
    nameEnglish: 'Lying Leg Curl',
    primaryMuscle: 'isquiosurales',
    secondaryMuscles: ['pantorrillas'],
    movementPattern: 'aislamiento',
    tier: 'isolation',
    equipmentRequired: 'machine',
    instructions: {
      startingPosition: 'Acostado boca abajo con la almohadilla rodante ubicada justo por encima del tendón de Aquiles. Sujeta los manerales frontales fijando la cadera.',
      execution: 'Flexiona las rodillas llevando los talones hacia los glúteos manteniendo la pelvis pegada al banco. Desciende en 3 segundos sintiendo el estiramiento excéntrico de los isquiosurales.',
      breathing: 'Exhala al flexionar, inhala en el descenso.',
      keySafetyCues: ['No arquear la espalda lumbar para levantar el peso.'],
      commonMistakes: ['Despegar la cadera de la almohadilla compensando con los flexores de cadera.']
    },
    warmupProtocol: '1 serie ligera de 8 reps.',
    imageUrl: '/exercises/curl-femoral.jpg',
    contraindications: []
  }
];

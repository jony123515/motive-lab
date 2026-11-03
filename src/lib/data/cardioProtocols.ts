export interface CardioProtocol {
  id: string;
  name: string;
  subtitle: string;
  hierarchyTier: 'rey_perdida_grasa' | 'complementario' | 'acelerador_metabolico';
  targetHeartRateZone: string;
  heartRateRangePercentFCM: string;
  recommendedDuration: string;
  idealTiming: string;
  frequencyPerWeek: string;
  whyItWorksScientifically: string[];
  protocolSteps: string[];
  fatLossVsMuscleMassImpact: string;
  pros: string[];
  cons: string[];
}

export const CARDIO_PROTOCOLS: CardioProtocol[] = [
  {
    id: 'liss-incline-walk',
    name: 'Caminata en Cinta Inclinada en Zona 2 (LISS Inclinado)',
    subtitle: 'El Protocolo Estándar de Oro en Fisiología Deportiva y Culturismo Natural para Quema de Grasa Pura',
    hierarchyTier: 'rey_perdida_grasa',
    targetHeartRateZone: 'Zona 2 (Lipólisis & Oxidación Máxima de Ácidos Grasos)',
    heartRateRangePercentFCM: '60% - 70% de tu Frecuencia Cardíaca Máxima (FCM = 220 - edad)',
    recommendedDuration: '25 a 40 minutos por sesión',
    idealTiming: 'Inmediatamente después del entrenamiento de pesas o por la mañana en ayunas.',
    frequencyPerWeek: '4 a 6 días por semana',
    whyItWorksScientifically: [
      'Zona FatMax: A una intensidad del 60-70% de la FCM, el sustrato energético predominante son los ácidos grasos libres (triglicéridos intramusculares y tejido adiposo subcutáneo) en lugar del glucógeno muscular.',
      'Cero Impacto Articular: A diferencia de correr en asfalto, caminar con inclinación no produce fuerzas de impacto en rodillas, cadera ni tobillos.',
      'Mínima Fatiga del Sistema Nervioso Central (SNC): No agota las reservas de neurotransmisores, permitiendo mantener el 100% de la fuerza y las cargas pesadas en la sala de pesas al día siguiente.',
      'Cero Interferencia Molecular (mTOR vs AMPK): El cardio extenuante activa fuertemente AMPK, bloqueando la vía anabólica mTOR. La caminata en Zona 2 no interfiere con la hipertrofia muscular.',
      'Control del Apetito: No genera el pico masivo de grelina (hormona del hambre) que producen los entrenamientos de cardio de alta intensidad.'
    ],
    protocolSteps: [
      '1. Subir a la cinta caminadora y programar una inclinación de entre 10% y 12%.',
      '2. Ajustar la velocidad a un ritmo de marcha enérgica pero sostenible: entre 4.5 km/h y 5.5 km/h.',
      '3. ¡REGLA DE ORO!: NO sujetarse de los pasamanos ni colgarse de la máquina (sujetarse reduce el gasto calórico hasta un 30% y arruina la postura). Mueve los brazos de forma natural.',
      '4. Respiración rítmica nasal/bucal: deberías ser capaz de mantener una conversación corta sin jadear (Talk Test de Zona 2).',
      '5. Mantener el ritmo constante durante 25 a 35 minutos sin pausas.'
    ],
    fatLossVsMuscleMassImpact: '100% seguro para la masa muscular. Preserva el tejido magro mientras maximiza el déficit calórico diario.',
    pros: [
      'Fácil de recuperar.',
      'Quema directa de grasa visceral y subcutánea.',
      'No perjudica tus marcas en sentadilla, banca o peso muerto.',
      'Excelente para la salud cardiovascular y mitocondrial.'
    ],
    cons: [
      'Requiere entre 30 y 45 minutos por sesión.',
      'Puede ser monótono si no escuchas música o podcasts.'
    ]
  },
  {
    id: 'hiit-sprints',
    name: 'HIIT en Assault Bike o Remo (Intervalos de Alta Intensidad)',
    subtitle: 'Acelerador Metabólico con Efecto EPOC (Quema Calórica Post-Ejercicio)',
    hierarchyTier: 'acelerador_metabolico',
    targetHeartRateZone: 'Zona 4 - 5 (Anaeróbica Láctic & Aláctica)',
    heartRateRangePercentFCM: '85% - 95% de tu Frecuencia Cardíaca Máxima',
    recommendedDuration: '12 a 18 minutos (sesiones cortas y explosivas)',
    idealTiming: 'En días separados de pierna pesada, o al final de una sesión de torso ligera.',
    frequencyPerWeek: '1 a 2 veces por semana como máximo',
    whyItWorksScientifically: [
      'Efecto EPOC (Excess Post-Exercise Oxygen Consumption): Al trabajar a intensidades supramáximas, el cuerpo continúa quemando calorías durante las 12-24 horas posteriores para restablecer el ATP, fosfocreatina y balance térmico.',
      'Optimización de la Sensibilidad a la Insulina: Vacía rápidamente el glucógeno de los depósitos musculares mediante contracciones de alta potencia.',
      'Mejora de la Capacidad de Trabajo y VO2 Máximo.'
    ],
    protocolSteps: [
      '1. Calentamiento suave de 3 minutos a ritmo moderado.',
      '2. Rondas de Sprint: 20 segundos de esfuerzo al 100% de potencia máxima ("All-out").',
      '3. Rondas de Recuperación: 40 segundos de pedaleo o remada muy suave.',
      '4. Repetir el ciclo durante 8 a 12 rondas (total: 12-16 minutos).',
      '5. Enfriamiento de 2 minutos para estabilizar la frecuencia cardíaca.'
    ],
    fatLossVsMuscleMassImpact: 'Efectivo pero demandante. Si se hace con demasiada frecuencia (>2 veces/semana), puede acumular fatiga residual en las piernas y perjudicar tus entrenamientos de sentadilla y prensa.',
    pros: [
      'Máxima eficiencia de tiempo (solo 15 minutos).',
      'Potente efecto en condición física atlética y potencia cardíaca.',
      'Estimula el consumo metabólico posterior (EPOC).'
    ],
    cons: [
      'Alta fatiga del sistema nervioso central.',
      'Requiere gran fuerza de voluntad y tolerancia al lactato.',
      'No recomendado si estás en déficit calórico muy agresivo.'
    ]
  },
  {
    id: 'neat-optimization',
    name: 'Optimización del NEAT (Pasos Diarios No Asociados al Ejercicio)',
    subtitle: 'El Verdadero Secreto Silencioso de las Personas Definidas Todo el Año',
    hierarchyTier: 'rey_perdida_grasa',
    targetHeartRateZone: 'Zona 1 (Actividad Basal Diaria)',
    heartRateRangePercentFCM: '50% - 60% de tu FCM',
    recommendedDuration: 'Distribuidos a lo largo del día',
    idealTiming: 'Durante todo el día: caminatas de 10 min tras comer, subir escaleras, llamadas caminando.',
    frequencyPerWeek: '7 días a la semana (Hábito de Estilo de Vida)',
    whyItWorksScientifically: [
      'El NEAT representa entre el 15% y el 30% del gasto energético total diario (TDEE), mientras que una hora de gimnasio solo representa el 5-8%.',
      'Caminar 10,000 pasos al día quema entre 350 y 500 kcal adicionales sin ningún tipo de estrés biológico ni fatiga articular.',
      'Caminar 10 minutos inmediatamente después de cada comida reduce los picos de glucosa e insulina postprandial en un 30%.'
    ],
    protocolSteps: [
      '1. Instalar un podómetro en el teléfono o reloj inteligente.',
      '2. Fijar una meta base de 8,000 pasos diarios (nivel mínimo para evitar sedentarismo metabólico).',
      '3. Elevar a 10,000 - 12,000 pasos diarios en fases de definición o pérdida de grasa.',
      '4. Implementar 3 caminatas breves de 10 minutos inmediatamente después del desayuno, comida y cena.',
      '5. Optar por escaleras en lugar de elevador y aparcar más lejos.'
    ],
    fatLossVsMuscleMassImpact: 'Cero impacto muscular negativo. Es la forma más limpia y sostenible de acelerar el déficit calórico.',
    pros: [
      'No requiere equipo ni gimnasio.',
      'Reduce el estrés y el cortisol sistémico.',
      'Mejora drásticamente la digestión y la sensibilidad a la glucosa.'
    ],
    cons: [
      'Requiere disciplina de movimiento a lo largo del día.'
    ]
  }
];

export function calculateHeartRateZones(age: number) {
  const safeAge = Math.min(90, Math.max(15, age || 25));
  const maxHR = 220 - safeAge;
  return {
    maxHR,
    zone1: { min: Math.round(maxHR * 0.50), max: Math.round(maxHR * 0.60), name: 'Zona 1: Recuperación Activa / NEAT' },
    zone2: { min: Math.round(maxHR * 0.60), max: Math.round(maxHR * 0.70), name: 'Zona 2: Oxidación Máxima de Grasa (FatMax)' },
    zone3: { min: Math.round(maxHR * 0.70), max: Math.round(maxHR * 0.80), name: 'Zona 3: Aeróbica / Capacidad Cardiovascular' },
    zone4: { min: Math.round(maxHR * 0.80), max: Math.round(maxHR * 0.90), name: 'Zona 4: Umbral Anaeróbico' },
    zone5: { min: Math.round(maxHR * 0.90), max: maxHR, name: 'Zona 5: Máximo Esfuerzo / Sprints HIIT' },
  };
}

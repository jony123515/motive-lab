export interface SupplementDossier {
  id: string;
  name: string;
  category: 'A_evidence' | 'B_evidence' | 'micronutrient';
  primaryPurpose: string;
  scientificEvidenceLevel: string; // e.g. "ISSN Categoría A - Máxima evidencia"
  keyBenefits: string[];
  suggestedDosageSafe: string;
  whenUnnecessary: string;
  risksAndInteractions: string[];
  professionalReviewNotice: string;
  referenceSource: string;
}

export const SUPPLEMENT_DOSSIERS: SupplementDossier[] = [
  {
    id: 'sup-creatina-monohidrato',
    name: 'Creatina Monohidrato (Creapure o micronizada)',
    category: 'A_evidence',
    primaryPurpose: 'Aumento de los depósitos intramusculares de fosfocreatina (PCr), mejorando la potencia en esfuerzos anaeróbicos repetidos de alta intensidad y la masa muscular libre de grasa.',
    scientificEvidenceLevel: 'ISSN Grado A (Evidencia robusta y consensuada en cientos de ensayos clínicos controlados aleatorizados).',
    keyBenefits: [
      'Incremento del 5% al 15% en fuerza y potencia pico en series de alta intensidad',
      'Mayor hidratación celular y señalización anabólica intramuscular',
      'Efectos neuroprotectores y mejora de la función cognitiva en situaciones de privación de sueño o estrés'
    ],
    suggestedDosageSafe: '3 a 5 gramos diarios de forma continua (0.04 a 0.07 g/kg de peso corporal). No es obligatoria una fase de carga agresiva; la saturación se alcanza de manera segura en 3 a 4 semanas.',
    whenUnnecessary: 'En deportistas de ultra-resistencia pura donde el incremento de 1-2 kg de peso por agua intracelular represente una penalización biomecánica directa, o cuando la dieta proporcione suficiente creatina exógena y no se busque rendimiento anaeróbico.',
    risksAndInteractions: [
      'Aumento transitorio de peso corporal (1-2 kg) por hiperhidratación intracelular benéfica',
      'Malestar gastrointestinal leve únicamente si se ingieren dosis masivas (>10 g) de golpe sin suficiente líquido',
      'Elevación benigna de creatinina sérica sin alteración de la tasa de filtración glomerular real'
    ],
    professionalReviewNotice: 'Individuos con enfermedad renal crónica preexistente diagnosticada deben someter su uso a aprobación de su nefrólogo o médico tratante.',
    referenceSource: 'Kreider et al., International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine (JISSN).'
  },
  {
    id: 'sup-proteina-suero-whey',
    name: 'Proteína de Suero de Leche (Whey Isolate / Concentrate)',
    category: 'A_evidence',
    primaryPurpose: 'Aporte de aminoácidos esenciales con alto contenido de leucina (~2.5-3g por scoop) para optimizar la síntesis proteica muscular (MPS) cuando la dieta habitual no cubre el requerimiento proteico diario.',
    scientificEvidenceLevel: 'ISSN / ACSM Grado A. Máxima biodisponibilidad y valor biológico.',
    keyBenefits: [
      'Facilita alcanzar la meta de 1.6 - 2.2 g/kg de peso corporal total',
      'Digestibilidad y absorción rápida ideal en ventanas peri-entrenamiento',
      'Practicidad y conveniencia económica frente a ciertas fuentes cárnicas'
    ],
    suggestedDosageSafe: '1 scoop (25 a 30 g de proteína) diluido en 250-300 ml de agua o leche descremada.',
    whenUnnecessary: 'Totalmente prescindible si el usuario ya cubre su meta diaria de proteínas mediante alimentos enteros (huevos, pollo, carne magra, pescado, leguminosas, queso panela).',
    risksAndInteractions: [
      'Personas con intolerancia a la lactosa severa deben elegir proteína aislada (Isolate) o hidrolizada',
      'Alergia confirmada a las proteínas de la leche de vaca (caseína o suero) es contraindicación absoluta'
    ],
    professionalReviewNotice: 'En presencia de patologías hepáticas o renales avanzadas con restricción proteica prescrita.',
    referenceSource: 'Jäger et al., International Society of Sports Nutrition Position Stand: protein and exercise.'
  },
  {
    id: 'sup-cafeina-anhidra',
    name: 'Cafeína Anhidra / Café Natural',
    category: 'A_evidence',
    primaryPurpose: 'Antagonista de los receptores de adenosina en el sistema nervioso central, reduciendo la percepción del esfuerzo (RPE), aumentando la vigilia y mejorando la tasa de desarrollo de fuerza.',
    scientificEvidenceLevel: 'ISSN Grado A. Potente ayuda ergogénica demostrada en fuerza y resistencia.',
    keyBenefits: [
      'Aumento de la resistencia a la fatiga y número total de repeticiones completadas al fallo',
      'Mayor foco atencional y estado de alerta neuromuscular',
      'Ligero incremento en la tasa metabólica y movilización de ácidos grasos'
    ],
    suggestedDosageSafe: '3 a 6 mg por kg de peso corporal, ingeridos 45-60 minutos antes del entrenamiento. En personas no habituadas, comenzar con 1.5 a 2 mg/kg.',
    whenUnnecessary: 'Entrenamientos nocturnos (menos de 6 horas antes de dormir), ya que degrada gravemente la arquitectura del sueño profundo y la recuperación neuroendocrina.',
    risksAndInteractions: [
      'Taquicardia, temblores o ansiedad aguda en metabolizadores lentos (polimorfismo CYP1A2)',
      'Efecto rebote de fatiga y desarrollo de tolerancia si se utiliza de forma indiscriminada todos los días'
    ],
    professionalReviewNotice: 'Contraindicado en hipertensión arterial no controlada, arritmias cardíacas o trastornos de ansiedad descompensados.',
    referenceSource: 'Guest et al., International society of sports nutrition position stand: caffeine and exercise performance.'
  },
  {
    id: 'sup-omega-3',
    name: 'Ácidos Grasos Omega-3 (EPA y DHA)',
    category: 'A_evidence',
    primaryPurpose: 'Modulación de vías antiinflamatorias (resolvinas y protectinas), mejora de la sensibilidad a la insulina muscular y salud endotelial/cardiovascular.',
    scientificEvidenceLevel: 'ISSN / AHA Grado A. Evidencia consistente en salud cardiovascular y resolución inflamatoria.',
    keyBenefits: [
      'Atenuación del dolor muscular de aparición tardía (DOMS) tras entrenamientos extenuantes',
      'Soporte a la fluidez de membrana en miocitos facilitando la síntesis proteica',
      'Perfil lipídico favorable con reducción de triglicéridos en sangre'
    ],
    suggestedDosageSafe: '1.5 a 2.5 g combinados de EPA y DHA al día junto con una comida que contenga grasas para optimizar su absorción.',
    whenUnnecessary: 'Si el individuo consume 3 o más raciones de pescados grasos a la semana (sardina, salmón, trucha, atún fresco).',
    risksAndInteractions: [
      'Dosis muy altas (>4 g/día) pueden tener efecto antiagregante plaquetario',
      'Eructos o reflujo con olor a pescado si no se utiliza una formulación entérica o destilada molecularmente'
    ],
    professionalReviewNotice: 'Personas bajo terapia anticoagulante (warfarina, acenocumarol, aspirina en dosis alta) deben consultar a su médico.',
    referenceSource: 'Philpott et al., Influence of Dietary Omega-3 Fatty Acids on Muscle Mass and Function in Humans.'
  },
  {
    id: 'sup-vitamina-b12',
    name: 'Vitamina B12 (Cianocobalamina / Metilcobalamina)',
    category: 'micronutrient',
    primaryPurpose: 'Cofactor esencial en la síntesis de ADN, maduración de eritrocitos (glóbulos rojos) y mantenimiento de la vaina de mielina en neuronas motoras.',
    scientificEvidenceLevel: 'Evidencia clínica universal (IOM / OMS). Imprescindible en dietas basadas en plantas.',
    keyBenefits: [
      'Prevención de anemia megaloblástica y neuropatía periférica',
      'Óptimo metabolismo de la homocisteína protegiendo la salud vascular'
    ],
    suggestedDosageSafe: '25 a 100 mcg diarios en veganos/vegetarianos, o dosis semanal de 1000 a 2000 mcg.',
    whenUnnecessary: 'En personas omnívoras que consumen carne magra, huevos, pollo y lácteos regularmente sin problemas de absorción gástrica.',
    risksAndInteractions: [
      'Toxicidad prácticamente nula (vitamina hidrosoluble que se excreta por orina)',
      'Fármacos como metformina o inhibidores de la bomba de protones (omeprazol) reducen su absorción a largo plazo'
    ],
    professionalReviewNotice: 'Requiere dosificación sérica periódica de B12 y ácido fólico en dietas veganas estrictas.',
    referenceSource: 'Dietary Reference Intakes (DRI), Institute of Medicine (US).'
  },
  {
    id: 'sup-magnesio-bisglicinato',
    name: 'Magnesio (Bisglicinato / Citrato)',
    category: 'micronutrient',
    primaryPurpose: 'Cofactor en más de 300 reacciones enzimáticas, facilitando la relajación neuromuscular, el balance de electrolitos y la regulación del receptor GABA para un descanso profundo.',
    scientificEvidenceLevel: 'Grado B/A en deportistas con pérdidas por sudoración profusa o déficit dietético.',
    keyBenefits: [
      'Disminución de calambres nocturnos y rigidez muscular',
      'Mejora de la latencia y calidad subjetiva del sueño',
      'Regulación de la presión arterial y tono vascular'
    ],
    suggestedDosageSafe: '200 a 400 mg de magnesio elemental al día, preferentemente 1 hora antes de dormir.',
    whenUnnecessary: 'Si la dieta contiene abundantes semillas de calabaza, espinacas, almendras, leguminosas y cereales enteros de forma consistente.',
    risksAndInteractions: [
      'El óxido de magnesio tiene baja biodisponibilidad y puede generar diarrea osmótica; preferir formas queladas (bisglicinato)',
      'Puede competir en absorción si se toma simultáneamente con dosis masivas de calcio o zinc'
    ],
    professionalReviewNotice: 'Precaución en insuficiencia renal moderada o severa debido al riesgo de hipermagnesemia.',
    referenceSource: 'Volpe SL., Magnesium and athletic performance. Sports Med.'
  },
  {
    id: 'sup-zinc-gluconato',
    name: 'Zinc (Gluconato / Picolinato)',
    category: 'micronutrient',
    primaryPurpose: 'Mantenimiento de la función inmune, síntesis proteica, cicatrización y homeostasis hormonal (eje testosterona en hombres con deficiencia).',
    scientificEvidenceLevel: 'Grado B. Esencial pero sólo efectivo ante ingesta marginal o déficit.',
    keyBenefits: [
      'Mantenimiento de la respuesta inmunitaria durante fases de alto volumen de entrenamiento',
      'Cofactor en la anhidrasa carbónica y superóxido dismutasa (antioxidante celular)'
    ],
    suggestedDosageSafe: '15 a 25 mg diarios junto a una comida.',
    whenUnnecessary: 'En dietas con consumo adecuado de carne de res magra, mariscos, huevos y leguminosas bien preparadas.',
    risksAndInteractions: [
      'Dosis crónicas superiores a 40 mg/día pueden provocar deficiencia de cobre inducida por la sobreexpresión de metalotioneína',
      'Náuseas si se consume con el estómago vacío'
    ],
    professionalReviewNotice: 'Evaluar niveles en plasma si hay síntomas de deficiencia persistentes.',
    referenceSource: 'Prasad AS., Zinc in human health: an update. J Trace Elem Med Biol.'
  },
  {
    id: 'sup-electrolitos-hidratacion',
    name: 'Electrolitos Orales (Sodio, Potasio, Magnesio)',
    category: 'A_evidence',
    primaryPurpose: 'Mantenimiento del volumen plasmático, prevención de hiponatremia y soporte de la contracción muscular en sesiones de ejercicio prolongadas o bajo calor extremo.',
    scientificEvidenceLevel: 'ACSM Grado A para ejercicio >60 minutos o altas tasas de sudoración (>1 L/hora).',
    keyBenefits: [
      'Prevención de caídas agudas del gasto cardíaco y fatiga central',
      'Mejora de la palatabilidad del agua y retención de líquidos en el espacio extracelular'
    ],
    suggestedDosageSafe: '400 a 700 mg de sodio y 150 a 250 mg de potasio por litro de agua consumido durante el entrenamiento intenso.',
    whenUnnecessary: 'Sesiones de baja intensidad o duración menor a 45 minutos en ambientes templados; el agua pura es suficiente.',
    risksAndInteractions: [
      'No abusar de preparados altos en sodio en pacientes con hipertensión arterial no controlada sin supervisión médica'
    ],
    professionalReviewNotice: 'Enfermedades cardíacas, renales o uso de diuréticos/antihipertensivos requieren pauta personalizada.',
    referenceSource: 'American College of Sports Medicine. Exercise and fluid replacement position stand.'
  }
];

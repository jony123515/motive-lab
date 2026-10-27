import { AnthropometryData, PrimaryGoal, ActivityLevel } from '@/types';

export interface MetabolicCalculationResult {
  formulaUsed: 'Mifflin-St Jeor' | 'Katch-McArdle';
  bmr: number; // Tasa metabólica basal
  neatMultiplier: number;
  tdee: number; // Gasto energético total estimado
  calorieTarget: number; // Objetivo calórico ajustado
  goalDeltaCalories: number; // Superávit o déficit
  macros: {
    proteinGrams: number;
    proteinPerKg: number;
    carbsGrams: number;
    fatsGrams: number;
    fiberGrams: number;
  };
  calorieContributions: {
    proteinKcal: number;
    carbsKcal: number;
    fatsKcal: number;
  };
  mathematicalAuditTrail: {
    bmrFormula: string;
    tdeeFormula: string;
    targetFormula: string;
    macroMethodology: string;
  };
}

export function calculateMetabolicTargets(
  anthropometry: AnthropometryData,
  goal: PrimaryGoal,
  activityLevel: ActivityLevel,
  trainingDaysPerWeek: number
): MetabolicCalculationResult {
  const { weightKg, heightCm, age, gender, bodyFatPercentage } = anthropometry;

  let bmr: number;
  let formulaUsed: 'Mifflin-St Jeor' | 'Katch-McArdle' = 'Mifflin-St Jeor';
  let bmrFormulaText = '';

  // 1. Cálculo de Tasa Metabólica Basal (BMR / GEB)
  if (bodyFatPercentage && bodyFatPercentage > 4 && bodyFatPercentage < 55) {
    // Katch-McArdle: Basada en masa libre de grasa (FFM)
    formulaUsed = 'Katch-McArdle';
    const leanBodyMassKg = weightKg * (1 - bodyFatPercentage / 100);
    bmr = 370 + 21.6 * leanBodyMassKg;
    bmrFormulaText = `Katch-McArdle: 370 + (21.6 × Masa Magra [${leanBodyMassKg.toFixed(1)} kg]) = ${Math.round(bmr)} kcal`;
  } else {
    // Mifflin-St Jeor: Estándar clínico para población general
    formulaUsed = 'Mifflin-St Jeor';
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (gender === 'male') {
      bmr = base + 5;
      bmrFormulaText = `Mifflin-St Jeor (Hombre): (10 × ${weightKg}) + (6.25 × ${heightCm}) - (5 × ${age}) + 5 = ${Math.round(bmr)} kcal`;
    } else {
      bmr = base - 161;
      bmrFormulaText = `Mifflin-St Jeor (Mujer): (10 × ${weightKg}) + (6.25 × ${heightCm}) - (5 × ${age}) - 161 = ${Math.round(bmr)} kcal`;
    }
  }

  // 2. Factor de Actividad Integrado (NEAT + EAT sin doble conteo)
  let activityMultiplier = 1.2;
  switch (activityLevel) {
    case 'sedentary':
      activityMultiplier = 1.2;
      break;
    case 'light':
      activityMultiplier = 1.375;
      break;
    case 'moderate':
      activityMultiplier = 1.55;
      break;
    case 'intense':
      activityMultiplier = 1.725;
      break;
    case 'very_intense':
      activityMultiplier = 1.9;
      break;
    default:
      activityMultiplier = 1.4;
  }

  // Ajuste fino según días reales de gimnasio para evitar sobreestimación
  if (trainingDaysPerWeek <= 2 && activityMultiplier > 1.375) {
    activityMultiplier -= 0.1;
  } else if (trainingDaysPerWeek >= 5 && activityMultiplier < 1.55) {
    activityMultiplier += 0.1;
  }

  const tdee = Math.round(bmr * activityMultiplier);
  const tdeeFormulaText = `GET = GEB (${Math.round(bmr)} kcal) × Factor de Actividad (${activityMultiplier.toFixed(2)}) = ${tdee} kcal`;

  // 3. Ajuste calórico según Objetivo Científico
  let goalDeltaCalories = 0;
  let targetExplanation = '';

  switch (goal) {
    case 'hypertrophy':
      // Superávit calórico moderado (+250 kcal) para maximizar síntesis proteica con mínima ganancia grasa
      goalDeltaCalories = 250;
      targetExplanation = 'Superávit moderado (+250 kcal) según guías ISSN para optimizar la hipertrofia muscular.';
      break;
    case 'fat_loss':
      // Déficit conservador del ~20% o -450 kcal para proteger masa magra y rendimiento neuromuscular
      const deficit = Math.min(Math.round(tdee * 0.20), 500);
      goalDeltaCalories = -deficit;
      targetExplanation = `Déficit estructurado de ${deficit} kcal (~20% del GET) para preservar masa magra y rendimiento.`;
      break;
    case 'recomposition':
      // Ligero déficit o normocalórica
      goalDeltaCalories = -150;
      targetExplanation = 'Ligero déficit (-150 kcal) con alta ingesta proteica para movilización lipídica y ganancia muscular simultánea.';
      break;
    case 'strength':
      goalDeltaCalories = 150;
      targetExplanation = 'Leve superávit (+150 kcal) centrado en recuperación del sistema nervioso central y recarga de glucógeno.';
      break;
    case 'endurance':
    case 'general_health':
    default:
      goalDeltaCalories = 0;
      targetExplanation = 'Aporte normocalórico de mantenimiento para optimizar homeostasis y vitalidad.';
      break;
  }

  // Salvaguardas de seguridad clínica: nunca por debajo de BMR o límites biológicos mínimos
  const safetyFloor = gender === 'male' ? 1500 : 1200;
  let calorieTarget = Math.max(tdee + goalDeltaCalories, Math.round(bmr), safetyFloor);

  // 4. Distribución de Macronutrientes basada en Evidencia (ISSN / ACSM)
  let proteinPerKg = 2.0;
  if (goal === 'fat_loss') {
    // Mayor proteína para saciedad y efecto anticatabólico
    proteinPerKg = 2.2;
  } else if (goal === 'hypertrophy') {
    proteinPerKg = 2.0;
  } else if (goal === 'endurance') {
    proteinPerKg = 1.6;
  }

  const proteinGrams = Math.round(weightKg * proteinPerKg);
  const proteinKcal = proteinGrams * 4;

  // Grasas: 0.8 a 1.0 g/kg (mínimo esencial para perfil hormonal y absorción de vitaminas liposolubles)
  const fatsPerKg = goal === 'fat_loss' ? 0.8 : 0.9;
  const fatsGrams = Math.round(weightKg * fatsPerKg);
  const fatsKcal = fatsGrams * 9;

  // Carbohidratos: el remanente calórico para asegurar sustrato glucolítico anaeróbico
  const remainingKcal = Math.max(calorieTarget - (proteinKcal + fatsKcal), 300);
  const carbsGrams = Math.round(remainingKcal / 4);
  const carbsKcal = carbsGrams * 4;

  // Re-ajuste final de calorías por redondeo de gramos
  calorieTarget = proteinKcal + fatsKcal + carbsKcal;

  // Fibra: 14 gramos por cada 1000 kcal (Recomendación OMS / Dietary Guidelines)
  const fiberGrams = Math.round((calorieTarget / 1000) * 14);

  return {
    formulaUsed,
    bmr: Math.round(bmr),
    neatMultiplier: Number(activityMultiplier.toFixed(2)),
    tdee,
    calorieTarget,
    goalDeltaCalories,
    macros: {
      proteinGrams,
      proteinPerKg: Number(proteinPerKg.toFixed(1)),
      carbsGrams,
      fatsGrams,
      fiberGrams
    },
    calorieContributions: {
      proteinKcal,
      carbsKcal,
      fatsKcal
    },
    mathematicalAuditTrail: {
      bmrFormula: bmrFormulaText,
      tdeeFormula: tdeeFormulaText,
      targetFormula: `${tdee} kcal ${goalDeltaCalories >= 0 ? '+' : ''}${goalDeltaCalories} kcal = ${calorieTarget} kcal (${targetExplanation})`,
      macroMethodology: `Proteína: ${proteinPerKg} g/kg (${proteinGrams}g, ${proteinKcal} kcal) | Grasas: ${fatsPerKg} g/kg (${fatsGrams}g, ${fatsKcal} kcal) | Carbohidratos remanentes: ${carbsGrams}g (${carbsKcal} kcal) | Fibra recomendada: ${fiberGrams}g`
    }
  };
}

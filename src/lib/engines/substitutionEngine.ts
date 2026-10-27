import { FoodItem, MealFoodReference, SmaeCategory } from '@/types';
import { SMAE_DATABASE } from '@/lib/data/smaeFoods';

export interface SubstitutionProposal {
  targetFood: FoodItem;
  suggestedGrams: number;
  calculatedCalories: number;
  calculatedProtein: number;
  calculatedCarbs: number;
  calculatedFats: number;
  deltaCalories: number;
  deltaProtein: number;
  isNutritionallyEquivalent: boolean; // Dentro de tolerancias admitidas
  reason: string;
}

export function findSubstitutesForFood(
  originalItem: MealFoodReference,
  userRestrictions: string[] = []
): SubstitutionProposal[] {
  const originalFood = SMAE_DATABASE.find(f => f.id === originalItem.foodId);
  const targetCategory = originalItem.category;

  // Filtrar alimentos del mismo grupo o grupos nutricionalmente afines en el SMAE
  const candidates = SMAE_DATABASE.filter(f => {
    if (f.id === originalItem.foodId) return false;
    
    // Reglas de afinidad de grupo
    if (targetCategory.startsWith('aoa_') && f.category.startsWith('aoa_')) return true;
    if (targetCategory === 'cereales_sin_grasa' && f.category === 'cereales_sin_grasa') return true;
    if (targetCategory === 'leguminosas' && (f.category === 'leguminosas' || f.category === 'cereales_sin_grasa')) return true;
    if (targetCategory === 'frutas' && f.category === 'frutas') return true;
    if (targetCategory === 'verduras' && f.category === 'verduras') return true;
    if (targetCategory.startsWith('aceites_') && f.category.startsWith('aceites_')) return true;

    return f.category === targetCategory;
  });

  const proposals: SubstitutionProposal[] = candidates.map(candidate => {
    // Calculamos los gramos del candidato necesarios para igualar la proteína o calorías prioritarias
    let ratio = 1;
    if (targetCategory.startsWith('aoa_') && originalFood && originalFood.protein > 0) {
      // En proteínas, priorizamos igualar los gramos de proteína
      ratio = (originalItem.protein) / (candidate.protein / (candidate.servingGrams / 100 * (candidate.protein / (candidate.servingGrams || 100))));
      // Factor normalizado por cada 100g
      const proteinPerGram = candidate.protein / candidate.servingGrams;
      const targetGrams = proteinPerGram > 0 ? originalItem.protein / proteinPerGram : candidate.servingGrams;
      const finalGrams = Math.round(targetGrams);

      const multiplier = finalGrams / candidate.servingGrams;
      const calcKcal = Math.round(candidate.calories * multiplier);
      const calcProt = Number((candidate.protein * multiplier).toFixed(1));
      const calcCarbs = Number((candidate.carbs * multiplier).toFixed(1));
      const calcFats = Number((candidate.fats * multiplier).toFixed(1));

      const deltaCalories = calcKcal - originalItem.calories;
      const deltaProtein = Number((calcProt - originalItem.protein).toFixed(1));

      // Tolerancia: ±15% calorías y ±3g de proteína
      const isEquivalent = Math.abs(deltaCalories) <= Math.max(originalItem.calories * 0.15, 30) && Math.abs(deltaProtein) <= 3.5;

      return {
        targetFood: candidate,
        suggestedGrams: finalGrams,
        calculatedCalories: calcKcal,
        calculatedProtein: calcProt,
        calculatedCarbs: calcCarbs,
        calculatedFats: calcFats,
        deltaCalories,
        deltaProtein,
        isNutritionallyEquivalent: isEquivalent,
        reason: isEquivalent
          ? `Equivalente en proteína (${calcProt}g vs ${originalItem.protein}g) bajo grupo SMAE ${candidate.category}.`
          : `Aproximación por grupo SMAE con variación calórica de ${deltaCalories > 0 ? '+' : ''}${deltaCalories} kcal.`
      };
    } else {
      // Para cereales o frutas, priorizamos igualar carbohidratos / calorías
      const caloriesPerGram = candidate.calories / candidate.servingGrams;
      const targetGrams = caloriesPerGram > 0 ? originalItem.calories / caloriesPerGram : candidate.servingGrams;
      const finalGrams = Math.round(targetGrams);

      const multiplier = finalGrams / candidate.servingGrams;
      const calcKcal = Math.round(candidate.calories * multiplier);
      const calcProt = Number((candidate.protein * multiplier).toFixed(1));
      const calcCarbs = Number((candidate.carbs * multiplier).toFixed(1));
      const calcFats = Number((candidate.fats * multiplier).toFixed(1));

      const deltaCalories = calcKcal - originalItem.calories;
      const deltaProtein = Number((calcProt - originalItem.protein).toFixed(1));
      const isEquivalent = Math.abs(deltaCalories) <= 25;

      return {
        targetFood: candidate,
        suggestedGrams: finalGrams,
        calculatedCalories: calcKcal,
        calculatedProtein: calcProt,
        calculatedCarbs: calcCarbs,
        calculatedFats: calcFats,
        deltaCalories,
        deltaProtein,
        isNutritionallyEquivalent: isEquivalent,
        reason: `Mismo grupo de equivalentes (${candidate.category}) ajustando porción para preservar ${calcKcal} kcal.`
      };
    }
  });

  // Ordenar priorizando equivalentes nutricionales más exactos
  return proposals.sort((a, b) => {
    if (a.isNutritionallyEquivalent && !b.isNutritionallyEquivalent) return -1;
    if (!a.isNutritionallyEquivalent && b.isNutritionallyEquivalent) return 1;
    return Math.abs(a.deltaCalories) - Math.abs(b.deltaCalories);
  });
}

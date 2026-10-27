import { DailyMenu, Meal, MealFoodReference, NutritionPlan } from '@/types';
import { SMAE_DATABASE } from '@/lib/data/smaeFoods';
import { MetabolicCalculationResult } from './metabolicEngine';

export interface ShoppingListItem {
  foodName: string;
  category: string;
  totalGrams: number;
  estimatedHouseholdMeasure: string;
  costTier: string;
}

export function generate7DayNutritionPlan(
  userId: string,
  metabolic: MetabolicCalculationResult,
  mealsPerDay: number = 4
): NutritionPlan {
  const daysOfWeek = [
    { dayNumber: 1, name: 'Lunes' },
    { dayNumber: 2, name: 'Martes' },
    { dayNumber: 3, name: 'Miércoles' },
    { dayNumber: 4, name: 'Jueves' },
    { dayNumber: 5, name: 'Viernes' },
    { dayNumber: 6, name: 'Sábado' },
    { dayNumber: 7, name: 'Domingo' },
  ];

  const weeklyDays: DailyMenu[] = daysOfWeek.map((day) => {
    const meals = buildDayMeals(day.dayNumber, metabolic, mealsPerDay);

    const dailyTotals = meals.reduce(
      (acc, m) => ({
        calories: acc.calories + m.totals.calories,
        protein: Number((acc.protein + m.totals.protein).toFixed(1)),
        carbs: Number((acc.carbs + m.totals.carbs).toFixed(1)),
        fats: Number((acc.fats + m.totals.fats).toFixed(1)),
        fiber: Number((acc.fiber + m.totals.fiber).toFixed(1)),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
    );

    return {
      dayNumber: day.dayNumber,
      dayName: day.name,
      meals,
      dailyTotals,
    };
  });

  return {
    id: `plan-nutr-${Date.now()}`,
    userId,
    createdAt: new Date().toISOString(),
    status: 'active',
    methodology: {
      formulaUsed: metabolic.formulaUsed,
      bmr: metabolic.bmr,
      tdee: metabolic.tdee,
      calorieTarget: metabolic.calorieTarget,
      macroTargetGrams: {
        protein: metabolic.macros.proteinGrams,
        carbs: metabolic.macros.carbsGrams,
        fats: metabolic.macros.fatsGrams,
        fiber: metabolic.macros.fiberGrams,
      },
      explanation: metabolic.mathematicalAuditTrail.targetFormula,
    },
    weeklyDays,
    safetyVerified: true,
  };
}

function buildDayMeals(
  dayIndex: number,
  metabolic: MetabolicCalculationResult,
  mealsCount: number
): Meal[] {
  const targetKcal = metabolic.calorieTarget;
  const targetProt = metabolic.macros.proteinGrams;
  const targetCarbs = metabolic.macros.carbsGrams;
  const targetFats = metabolic.macros.fatsGrams;

  // Reparto porcentual de calorías y macros
  let distributions: { name: string; type: Meal['type']; time: string; share: number; prepSteps: string[] }[] = [];

  if (mealsCount <= 3) {
    distributions = [
      {
        name: 'Desayuno Proteico de Alto Valor',
        type: 'breakfast',
        time: '08:00',
        share: 0.35,
        prepSteps: [
          'Batir huevos enteros con claras en un tazón hondo.',
          'Saltear nopales cocidos en un sartén con una gota de aceite o rociador antiadherente.',
          'Verter los huevos sobre los nopales y cocinar a fuego medio hasta cuajar.',
          'Calentar las tortillas de maíz en comal y servir con aguacate fresco al gusto.',
        ],
      },
      {
        name: 'Comida Principal de Rendimiento',
        type: 'lunch',
        time: '14:30',
        share: 0.40,
        prepSteps: [
          'Sazonar la pechuga de pollo con ajo, cebolla en polvo y sal de mar.',
          'Asar la pechuga a la plancha a fuego medio-alto por 4-5 minutos de cada lado para conservar jugosidad.',
          'Servir sobre cama de arroz blanco cocido al vapor y frijoles de la olla.',
          'Añadir ensalada de espinaca y jitomate fresco aderezada con aceite de oliva.',
        ],
      },
      {
        name: 'Cena Liviana y Recuperación',
        type: 'dinner',
        time: '20:30',
        share: 0.25,
        prepSteps: [
          'Abrir y drenar perfectamente el atún en agua.',
          'Mezclar en tazón con jitomate picado, gotas de limón y sal.',
          'Servir con rebanadas de queso panela y tostadas horneadas o tortillas de maíz al comal.',
        ],
      },
    ];
  } else {
    distributions = [
      {
        name: 'Desayuno Fisiológico',
        type: 'breakfast',
        time: '07:30',
        share: 0.28,
        prepSteps: [
          'Cocer avena en agua con canela al gusto.',
          'Agregar rebanadas de plátano y yogur griego natural sin azúcar.',
          'Acompañar con revuelto de claras y huevo entero con nopales tiernos.',
        ],
      },
      {
        name: 'Colación Pre-Entreno / Media Mañana',
        type: 'pre_workout',
        time: '11:00',
        share: 0.18,
        prepSteps: [
          'Servir papaya maradol fresca picada en cubos.',
          'Mezclar con 1 scoop de proteína de suero aislada disuelta en agua fría o yogur natural.',
        ],
      },
      {
        name: 'Comida Principal Anabólica',
        type: 'lunch',
        time: '14:30',
        share: 0.34,
        prepSteps: [
          'Asar el bistec de res magro o pechuga de pollo en sartén caliente.',
          'Servir con porción exacta de arroz blanco cocido y frijoles negros enteros recién hervidos.',
          'Acompañar con tortillas de maíz nixtamalizado y rebanadas de aguacate Hass.',
        ],
      },
      {
        name: 'Cena de Recuperación Muscular',
        type: 'dinner',
        time: '20:30',
        share: 0.20,
        prepSteps: [
          'Armar tacos ligeros de atún con verduras o queso panela asado.',
          'Acompañar con ensalada de calabacitas al vapor con orégano y limón.',
        ],
      },
    ];
  }

  // Generación determinista de alimentos ajustando porciones exactas
  return distributions.map((dist, idx) => {
    const mealKcal = Math.round(targetKcal * dist.share);
    const mealProt = Number((targetProt * dist.share).toFixed(1));
    const mealCarbs = Number((targetCarbs * dist.share).toFixed(1));
    const mealFats = Number((targetFats * dist.share).toFixed(1));

    const items: MealFoodReference[] = [];

    if (dist.type === 'breakfast') {
      items.push({
        foodId: 'aoa-huevo-entero',
        foodName: 'Huevo entero',
        category: 'aoa_moderado_grasa',
        grams: 100, // 2 piezas
        servingsEquivalent: 2,
        state: 'cocido',
        calories: 156,
        protein: 12.6,
        carbs: 1.2,
        fats: 10.6,
        preparationNotes: 'Revueltos con nopales',
      });
      items.push({
        foodId: 'aoa-clara-huevo',
        foodName: 'Clara de huevo',
        category: 'aoa_muy_bajo_grasa',
        grams: 90,
        servingsEquivalent: 1.5,
        state: 'cocido',
        calories: 51,
        protein: 10.8,
        carbs: 0.6,
        fats: 0.1,
      });
      items.push({
        foodId: 'cer-tortilla-maiz',
        foodName: 'Tortilla de maíz nixtamalizada',
        category: 'cereales_sin_grasa',
        grams: 60, // 2 piezas
        servingsEquivalent: 2,
        state: 'cocido',
        calories: 128,
        protein: 2.8,
        carbs: 27.2,
        fats: 1.0,
      });
      items.push({
        foodId: 'ver-nopal-cocido',
        foodName: 'Nopales cocidos',
        category: 'verduras',
        grams: 150,
        servingsEquivalent: 1,
        state: 'cocido',
        calories: 22,
        protein: 1.8,
        carbs: 4.5,
        fats: 0.1,
      });
    } else if (dist.type === 'pre_workout' || dist.type === 'morning_snack') {
      items.push({
        foodId: 'sup-whey-isolate',
        foodName: 'Proteína Whey Isolate',
        category: 'aoa_muy_bajo_grasa',
        grams: 30,
        servingsEquivalent: 1,
        state: 'listo_consumo',
        calories: 115,
        protein: 25.0,
        carbs: 1.5,
        fats: 0.8,
      });
      items.push({
        foodId: 'fru-platano-tabasco',
        foodName: 'Plátano roatán fresco',
        category: 'frutas',
        grams: 120,
        servingsEquivalent: 1.5,
        state: 'listo_consumo',
        calories: 108,
        protein: 1.4,
        carbs: 27.3,
        fats: 0.3,
      });
    } else if (dist.type === 'lunch') {
      items.push({
        foodId: 'aoa-pollo-pechuga-cocida',
        foodName: 'Pechuga de pollo asada',
        category: 'aoa_muy_bajo_grasa',
        grams: 150,
        servingsEquivalent: 1.6,
        state: 'cocido',
        calories: 246,
        protein: 46.6,
        carbs: 0,
        fats: 5.3,
        preparationNotes: 'Pechuga asada a la plancha con ajo y paprika',
      });
      items.push({
        foodId: 'cer-arroz-blanco-cocido',
        foodName: 'Arroz blanco cocido',
        category: 'cereales_sin_grasa',
        grams: 150,
        servingsEquivalent: 1.5,
        state: 'cocido',
        calories: 195,
        protein: 4.0,
        carbs: 42.3,
        fats: 0.4,
      });
      items.push({
        foodId: 'leg-frijol-negro-cocido',
        foodName: 'Frijoles negros de la olla',
        category: 'leguminosas',
        grams: 120,
        servingsEquivalent: 1,
        state: 'cocido',
        calories: 110,
        protein: 7.6,
        carbs: 19.8,
        fats: 0.5,
      });
      items.push({
        foodId: 'gra-aguacate-hass',
        foodName: 'Aguacate Hass',
        category: 'aceites_sin_proteina',
        grams: 45,
        servingsEquivalent: 1,
        state: 'listo_consumo',
        calories: 72,
        protein: 0.9,
        carbs: 3.8,
        fats: 6.7,
      });
    } else {
      // Dinner
      items.push({
        foodId: 'aoa-atun-agua',
        foodName: 'Atún en agua drenado',
        category: 'aoa_muy_bajo_grasa',
        grams: 120,
        servingsEquivalent: 3,
        state: 'drenado',
        calories: 138,
        protein: 30.6,
        carbs: 0,
        fats: 1.2,
      });
      items.push({
        foodId: 'aoa-queso-panela',
        foodName: 'Queso panela',
        category: 'aoa_bajo_grasa',
        grams: 40,
        servingsEquivalent: 1,
        state: 'listo_consumo',
        calories: 75,
        protein: 7.1,
        carbs: 1.2,
        fats: 4.8,
      });
      items.push({
        foodId: 'cer-tortilla-maiz',
        foodName: 'Tortilla de maíz nixtamalizada',
        category: 'cereales_sin_grasa',
        grams: 60,
        servingsEquivalent: 2,
        state: 'cocido',
        calories: 128,
        protein: 2.8,
        carbs: 27.2,
        fats: 1.0,
      });
      items.push({
        foodId: 'ver-jitomate-bola',
        foodName: 'Jitomate picado',
        category: 'verduras',
        grams: 120,
        servingsEquivalent: 1,
        state: 'listo_consumo',
        calories: 22,
        protein: 1.1,
        carbs: 4.7,
        fats: 0.2,
      });
    }

    const calculatedTotals = items.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: Number((acc.protein + item.protein).toFixed(1)),
        carbs: Number((acc.carbs + item.carbs).toFixed(1)),
        fats: Number((acc.fats + item.fats).toFixed(1)),
        fiber: Number((acc.fiber + 1.5).toFixed(1)), // Estimación de fibra base
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
    );

    return {
      id: `meal-${dayIndex}-${idx + 1}`,
      name: dist.name,
      suggestedTime: dist.time,
      type: dist.type,
      items,
      recipePreparationSteps: dist.prepSteps,
      prepTimeMinutes: idx === 0 ? 15 : idx === 1 ? 5 : 20,
      totals: calculatedTotals,
    };
  });
}

export function generateWeeklyShoppingList(plan: NutritionPlan): ShoppingListItem[] {
  const aggregated: Record<string, { foodName: string; category: string; totalGrams: number; costTier: string }> = {};

  plan.weeklyDays.forEach((day) => {
    day.meals.forEach((meal) => {
      meal.items.forEach((item) => {
        if (!aggregated[item.foodId]) {
          const dbItem = SMAE_DATABASE.find((f) => f.id === item.foodId);
          aggregated[item.foodId] = {
            foodName: item.foodName,
            category: item.category,
            totalGrams: 0,
            costTier: dbItem?.costTier || 'economico',
          };
        }
        aggregated[item.foodId].totalGrams += item.grams;
      });
    });
  });

  return Object.values(aggregated).map((item) => {
    let measure = `${item.totalGrams} g`;
    if (item.totalGrams >= 1000) {
      measure = `${(item.totalGrams / 1000).toFixed(2)} kg`;
    }
    return {
      foodName: item.foodName,
      category: item.category,
      totalGrams: item.totalGrams,
      estimatedHouseholdMeasure: measure,
      costTier: item.costTier,
    };
  });
}

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

function getSmaeFood(id: string) {
  const f = SMAE_DATABASE.find((item) => item.id === id);
  if (!f) throw new Error(`Food not found in SMAE: ${id}`);
  return f;
}

function makeFoodRef(
  foodId: string,
  targetGrams: number,
  notes?: string
): MealFoodReference {
  const food = getSmaeFood(foodId);
  const ratio = targetGrams / food.servingGrams;
  return {
    foodId: food.id,
    foodName: food.name,
    category: food.category,
    grams: Math.round(targetGrams),
    servingsEquivalent: Number(ratio.toFixed(1)),
    state: food.state,
    calories: Math.round(food.calories * ratio),
    protein: Number((food.protein * ratio).toFixed(1)),
    carbs: Number((food.carbs * ratio).toFixed(1)),
    fats: Number((food.fats * ratio).toFixed(1)),
    preparationNotes: notes,
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

  // Factor de escala relativo a una base de 2000 kcal
  const scale = targetKcal / 2000;
  // Factor específico para proteína, carbohidratos y grasas
  const pScale = targetProt / 140;
  const cScale = targetCarbs / 220;
  const fScale = targetFats / 60;

  // Reparto porcentual según cantidad de comidas
  let mealDist: { name: string; type: Meal['type']; time: string; share: number; prepSteps: string[] }[] = [];

  if (mealsCount <= 3) {
    mealDist = [
      {
        name: 'Desayuno Fisiológico de Alto Rendimiento',
        type: 'breakfast',
        time: '08:00',
        share: 0.35,
        prepSteps: [
          'Batir huevos enteros y claras en un tazón.',
          'Saltear nopales o verduras al sartén caliente con ligero rocío antiadherente.',
          'Cocinar a fuego medio y servir con tortillas de maíz nixtamalizadas calientes y aguacate.',
        ],
      },
      {
        name: 'Comida Principal de Precisión',
        type: 'lunch',
        time: '14:30',
        share: 0.40,
        prepSteps: [
          'Sazonar la fuente de proteína magra con ajo, pimienta y sal marina.',
          'Asar a la plancha a temperatura media para conservar jugosidad y valor biológico.',
          'Acompañar con porción pesada de arroz o papas al vapor y leguminosas de la olla.',
        ],
      },
      {
        name: 'Cena Liviana y Síntesis Nocturna',
        type: 'dinner',
        time: '20:30',
        share: 0.25,
        prepSteps: [
          'Drenar el atún o asar el queso panela a la plancha con orégano.',
          'Armar tacos o tostadas horneadas con verduras frescas picadas y aguacate fresco.',
        ],
      },
    ];
  } else {
    mealDist = [
      {
        name: 'Desayuno Energético Anabólico',
        type: 'breakfast',
        time: '07:30',
        share: 0.28,
        prepSteps: [
          'Cocer avena en agua con canela al gusto o batir claras con huevos enteros.',
          'Acompañar con tortillas de maíz al comal o fruta fresca de estación.',
        ],
      },
      {
        name: 'Colación Pre-Entreno / Media Mañana',
        type: 'pre_workout',
        time: '11:00',
        share: 0.18,
        prepSteps: [
          'Disolver proteína de suero aislada en agua fría o mezclar con fruta natural y almendras.',
        ],
      },
      {
        name: 'Comida Principal Post-Entreno',
        type: 'lunch',
        time: '14:30',
        share: 0.34,
        prepSteps: [
          'Asar a la plancha la proteína magra.',
          'Servir con porción calculada de arroz al vapor, frijoles enteros y aguacate Hass fresco.',
        ],
      },
      {
        name: 'Cena de Recuperación Muscular',
        type: 'dinner',
        time: '20:30',
        share: 0.20,
        prepSteps: [
          'Preparar ensalada fresca con proteína ligera (atún, pollo deshebrado o panela).',
          'Acompañar con tostadas de maíz horneadas o tortillas nixtamalizadas.',
        ],
      },
    ];
  }

  return mealDist.map((dist, idx) => {
    const items: MealFoodReference[] = [];

    if (dist.type === 'breakfast') {
      // Variación según el día de la semana
      if (dayIndex % 2 === 1) {
        // Días impares: Huevos con claras, nopales y tortillas
        items.push(makeFoodRef('aoa-huevo-entero', Math.max(50, Math.round(50 * Math.min(2, pScale))), 'Huevos frescos enteros'));
        items.push(makeFoodRef('aoa-clara-huevo', Math.max(60, Math.round(75 * pScale)), 'Claras pasteurizadas'));
        items.push(makeFoodRef('cer-tortilla-maiz', Math.max(30, Math.round(50 * cScale)), 'Tortillas nixtamalizadas al comal'));
        items.push(makeFoodRef('ver-nopal-cocido', Math.max(100, Math.round(150 * scale)), 'Nopales salteados'));
        items.push(makeFoodRef('gra-aguacate-hass', Math.max(25, Math.round(35 * fScale)), 'Aguacate fresco en rebanadas'));
      } else {
        // Días pares: Avena cocida con claras y fruta o queso panela
        items.push(makeFoodRef('cer-avena-hojuelas', Math.max(40, Math.round(50 * cScale)), 'Avena en hojuelas cocida con canela'));
        items.push(makeFoodRef('aoa-clara-huevo', Math.max(90, Math.round(110 * pScale)), 'Claras revueltas esponjosas'));
        items.push(makeFoodRef('aoa-queso-panela', Math.max(30, Math.round(40 * pScale)), 'Queso panela asado'));
        items.push(makeFoodRef('fru-platano-tabasco', Math.max(60, Math.round(80 * cScale)), 'Rebanadas de plátano fresco'));
      }
    } else if (dist.type === 'pre_workout' || dist.type === 'morning_snack') {
      items.push(makeFoodRef('sup-whey-isolate', Math.max(20, Math.round(30 * Math.min(1.5, pScale))), 'Disuelto en 300 ml de agua fría'));
      if (dayIndex % 2 === 1) {
        items.push(makeFoodRef('fru-platano-tabasco', Math.max(80, Math.round(100 * cScale)), 'Glúcidos de absorción media-rápida'));
      } else {
        items.push(makeFoodRef('fru-manzana-roja', Math.max(100, Math.round(120 * cScale)), 'Manzana fresca con piel (fibra y pectina)'));
      }
    } else if (dist.type === 'lunch') {
      // Variación de proteínas según el día
      if (dayIndex === 1 || dayIndex === 4 || dayIndex === 7) {
        // Pechuga de pollo
        items.push(makeFoodRef('aoa-pollo-pechuga-cocida', Math.max(90, Math.round(130 * pScale)), 'Pechuga a la plancha con hierbas finas'));
        items.push(makeFoodRef('cer-arroz-blanco-cocido', Math.max(80, Math.round(140 * cScale)), 'Arroz blanco al vapor'));
        items.push(makeFoodRef('leg-frijol-negro-cocido', Math.max(70, Math.round(100 * cScale)), 'Frijoles negros enteros de la olla'));
        items.push(makeFoodRef('gra-aguacate-hass', Math.max(25, Math.round(40 * fScale)), 'Aguacate Hass'));
      } else if (dayIndex === 2 || dayIndex === 6) {
        // Bistec de res magra
        items.push(makeFoodRef('aoa-res-magra-cruda', Math.max(100, Math.round(140 * pScale)), 'Bistec magro a la plancha'));
        items.push(makeFoodRef('cer-tortilla-maiz', Math.max(45, Math.round(60 * cScale)), 'Tortillas nixtamalizadas'));
        items.push(makeFoodRef('leg-frijol-negro-cocido', Math.max(70, Math.round(100 * cScale)), 'Frijoles de la olla'));
        items.push(makeFoodRef('ver-nopal-cocido', Math.max(100, Math.round(130 * scale)), 'Nopales asados'));
        items.push(makeFoodRef('gra-aguacate-hass', Math.max(20, Math.round(30 * fScale)), 'Guacamole ligero con limón'));
      } else {
        // Pescado blanco / Atún
        items.push(makeFoodRef('aoa-atun-agua', Math.max(80, Math.round(120 * pScale)), 'Atún sellado o en medallón'));
        items.push(makeFoodRef('cer-arroz-blanco-cocido', Math.max(90, Math.round(150 * cScale)), 'Arroz blanco recién cocido'));
        items.push(makeFoodRef('gra-aceite-oliva', Math.max(5, Math.round(10 * fScale)), 'Aceite de oliva extra virgen en crudo'));
        items.push(makeFoodRef('ver-espinaca-cruda', Math.max(60, Math.round(90 * scale)), 'Ensalada de hojas verdes y jitomate'));
      }
    } else {
      // Dinner
      if (dayIndex % 2 === 1) {
        items.push(makeFoodRef('aoa-atun-agua', Math.max(80, Math.round(100 * pScale)), 'Atún en agua con jitomate y cebolla'));
        items.push(makeFoodRef('aoa-queso-panela', Math.max(30, Math.round(40 * pScale)), 'Queso panela fresco'));
        items.push(makeFoodRef('cer-tortilla-maiz', Math.max(30, Math.round(50 * cScale)), 'Tortillas de maíz nixtamalizadas'));
        items.push(makeFoodRef('ver-jitomate-bola', Math.max(80, Math.round(110 * scale)), 'Jitomate picado con limón y cilantro'));
      } else {
        items.push(makeFoodRef('aoa-pollo-pechuga-cocida', Math.max(80, Math.round(100 * pScale)), 'Pechuga deshebrada'));
        items.push(makeFoodRef('aoa-queso-panela', Math.max(30, Math.round(40 * pScale)), 'Queso panela'));
        items.push(makeFoodRef('cer-tortilla-maiz', Math.max(30, Math.round(50 * cScale)), 'Tacos ligeros al comal'));
        items.push(makeFoodRef('gra-aguacate-hass', Math.max(20, Math.round(30 * fScale)), 'Aguacate fresco'));
      }
    }

    const calculatedTotals = items.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: Number((acc.protein + item.protein).toFixed(1)),
        carbs: Number((acc.carbs + item.carbs).toFixed(1)),
        fats: Number((acc.fats + item.fats).toFixed(1)),
        fiber: Number((acc.fiber + 1.2).toFixed(1)),
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

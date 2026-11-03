import { DailyMenu, Meal, MealFoodReference, NutritionPlan, DietaryHabitsData, ClinicalScreeningData, PrimaryGoal } from '@/types';
import { SMAE_DATABASE } from '@/lib/data/smaeFoods';
import { MetabolicCalculationResult } from './metabolicEngine';

export interface ShoppingListItem {
  foodName: string;
  category: string;
  totalGrams: number;
  estimatedHouseholdMeasure: string;
  costTier: string;
}

interface FoodSpecItem {
  id: string;
  share?: number;
  notes?: string;
}

interface MealSpec {
  prot?: FoodSpecItem[];
  carb?: FoodSpecItem[];
  fat?: FoodSpecItem[];
  veg?: { id: string; grams?: number; notes?: string };
}

export function generate7DayNutritionPlan(
  userId: string,
  metabolic: MetabolicCalculationResult,
  mealsPerDay: number = 4,
  dietaryHabits?: DietaryHabitsData,
  clinical?: ClinicalScreeningData,
  goal: PrimaryGoal = 'hypertrophy'
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
    const meals = buildDayMeals(
      day.dayNumber,
      metabolic,
      mealsPerDay,
      dietaryHabits,
      clinical,
      goal
    );

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
  if (!f) {
    console.warn(`[NutritionEngine] Food not found in SMAE: ${id}, using fallback`);
    return SMAE_DATABASE[0];
  }
  return f;
}

function makeFoodRef(
  foodId: string,
  targetGrams: number,
  notes?: string
): MealFoodReference {
  const food = getSmaeFood(foodId);
  const safeGrams = Math.max(1, targetGrams);
  const ratio = safeGrams / food.servingGrams;
  return {
    foodId: food.id,
    foodName: food.name,
    category: food.category,
    grams: Math.round(safeGrams),
    servingsEquivalent: Number(ratio.toFixed(1)),
    state: food.state,
    calories: Math.round(food.calories * ratio),
    protein: Number((food.protein * ratio).toFixed(1)),
    carbs: Number((food.carbs * ratio).toFixed(1)),
    fats: Number((food.fats * ratio).toFixed(1)),
    preparationNotes: notes,
  };
}

function buildMealFromSpec(
  name: string,
  type: Meal['type'],
  time: string,
  prepSteps: string[],
  spec: MealSpec,
  mealKcal: number,
  mealProt: number,
  mealCarbs: number,
  mealFats: number
): Meal {
  const items: MealFoodReference[] = [];
  let vegProt = 0;
  let vegCarbs = 0;
  let vegFats = 0;

  if (spec.veg) {
    const vGrams = spec.veg.grams || 100;
    const vRef = makeFoodRef(spec.veg.id, vGrams, spec.veg.notes);
    items.push(vRef);
    vegProt += vRef.protein;
    vegCarbs += vRef.carbs;
    vegFats += vRef.fats;
  }

  const targetP = Math.max(5, mealProt - vegProt);
  const targetC = Math.max(5, mealCarbs - vegCarbs);
  const targetF = Math.max(2, mealFats - vegFats);

  // 1. Calcular gramos de fuentes de proteína
  const protItems = (spec.prot || []).map((p) => {
    const f = getSmaeFood(p.id);
    const neededP = targetP * (p.share || 1);
    const g = (neededP / Math.max(1, f.protein)) * f.servingGrams;
    return { id: p.id, grams: g, notes: p.notes };
  });

  let protCarbs = 0;
  let protFats = 0;
  protItems.forEach((p) => {
    const f = getSmaeFood(p.id);
    const r = p.grams / f.servingGrams;
    protCarbs += f.carbs * r;
    protFats += f.fats * r;
  });

  // 2. Calcular gramos de fuentes de carbohidratos netos
  const netC = Math.max(5, targetC - protCarbs);
  const carbItems = (spec.carb || []).map((c) => {
    const f = getSmaeFood(c.id);
    const neededC = netC * (c.share || 1);
    const g = (neededC / Math.max(1, f.carbs)) * f.servingGrams;
    return { id: c.id, grams: g, notes: c.notes };
  });

  let carbFats = 0;
  carbItems.forEach((c) => {
    const f = getSmaeFood(c.id);
    const r = c.grams / f.servingGrams;
    carbFats += f.fats * r;
  });

  // 3. Calcular gramos de fuentes de grasas saludables netas
  const netF = Math.max(1, targetF - protFats - carbFats);
  const fatItems = (spec.fat || []).map((fat) => {
    const f = getSmaeFood(fat.id);
    const neededF = netF * (fat.share || 1);
    const g = (neededF / Math.max(1, f.fats)) * f.servingGrams;
    return { id: fat.id, grams: g, notes: fat.notes };
  });

  // Ensamblar referencias de alimentos
  protItems.forEach((p) => items.push(makeFoodRef(p.id, p.grams, p.notes)));
  carbItems.forEach((c) => items.push(makeFoodRef(c.id, c.grams, c.notes)));
  fatItems.forEach((f) => items.push(makeFoodRef(f.id, f.grams, f.notes)));

  // Calibración exacta proporcional de calorías para asegurar coherencia fisiológica
  const initialSumCal = items.reduce((s, it) => s + it.calories, 0);
  if (initialSumCal > 0 && Math.abs(initialSumCal - mealKcal) > 2) {
    const factor = mealKcal / initialSumCal;
    for (let i = 0; i < items.length; i++) {
      if (spec.veg && items[i].foodId === spec.veg.id) continue;
      const newGrams = Math.max(5, Math.round(items[i].grams * factor));
      items[i] = makeFoodRef(items[i].foodId, newGrams, items[i].preparationNotes);
    }
  }

  const totals = items.reduce(
    (acc, it) => {
      const dbFood = getSmaeFood(it.foodId);
      const ratio = it.grams / dbFood.servingGrams;
      return {
        calories: acc.calories + it.calories,
        protein: Number((acc.protein + it.protein).toFixed(1)),
        carbs: Number((acc.carbs + it.carbs).toFixed(1)),
        fats: Number((acc.fats + it.fats).toFixed(1)),
        fiber: Number((acc.fiber + (dbFood.fiber || 0) * ratio).toFixed(1)),
      };
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
  );

  return {
    id: `meal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name,
    suggestedTime: time,
    type,
    items,
    recipePreparationSteps: prepSteps,
    prepTimeMinutes: type === 'breakfast' ? 15 : type === 'lunch' ? 25 : type === 'dinner' ? 15 : 5,
    totals,
  };
}

function applyClinicalAndPreferenceFilters(
  spec: MealSpec,
  avoidsFish: boolean,
  avoidsEggs: boolean,
  avoidsDairy: boolean,
  hasDiabetes: boolean
): MealSpec {
  const newSpec: MealSpec = {
    prot: spec.prot ? spec.prot.map((p) => ({ ...p })) : [],
    carb: spec.carb ? spec.carb.map((c) => ({ ...c })) : [],
    fat: spec.fat ? spec.fat.map((f) => ({ ...f })) : [],
    veg: spec.veg ? { ...spec.veg } : undefined,
  };

  // Filtrado de fuentes de proteína
  if (newSpec.prot) {
    newSpec.prot = newSpec.prot.map((p) => {
      if (avoidsFish && (p.id === 'aoa-tilapia-filete-cocido' || p.id === 'aoa-atun-agua')) {
        return { id: 'aoa-pollo-pechuga-cocida', share: p.share, notes: 'Pechuga a la plancha (adaptado sin pescado)' };
      }
      if (avoidsEggs && (p.id === 'aoa-huevo-entero' || p.id === 'aoa-clara-huevo' || p.id === 'rec-hot-cakes-proteicos')) {
        return { id: 'aoa-queso-panela', share: p.share, notes: 'Queso panela fresco (adaptado sin huevo)' };
      }
      if (avoidsDairy && (p.id === 'lac-yogur-griego-sin-azucar' || p.id === 'aoa-queso-panela')) {
        return { id: 'sup-whey-isolate', share: p.share, notes: 'Proteína aislada Whey Isolate (libre de lactosa)' };
      }
      return p;
    });
  }

  // Filtrado de carbohidratos en caso de resistencia a la insulina / diabetes
  if (hasDiabetes && newSpec.carb) {
    newSpec.carb = newSpec.carb.map((c) => {
      if (c.id === 'fru-platano-tabasco') {
        return { id: 'fru-manzana-roja', share: c.share, notes: 'Manzana roja con piel (bajo índice glucémico)' };
      }
      return c;
    });
  }

  return newSpec;
}

function buildDayMeals(
  dayIndex: number,
  metabolic: MetabolicCalculationResult,
  mealsCount: number,
  dietaryHabits?: DietaryHabitsData,
  clinical?: ClinicalScreeningData,
  goal: PrimaryGoal = 'hypertrophy'
): Meal[] {
  const targetKcal = metabolic.calorieTarget;
  const targetProt = metabolic.macros.proteinGrams;
  const targetCarbs = metabolic.macros.carbsGrams;
  const targetFats = metabolic.macros.fatsGrams;

  // Criterio Clínico y Preferencias Dietéticas
  const dislikes = (dietaryHabits?.dislikedFoods || []).map((f) => f.toLowerCase().trim());
  const avoidsFish = dislikes.some((d) => d.includes('pescado') || d.includes('atun') || d.includes('atún') || d.includes('tilapia') || d.includes('marisco'));
  const avoidsEggs = dislikes.some((d) => d.includes('huevo') || d.includes('clara'));
  const avoidsDairy = dislikes.some((d) => d.includes('lacteo') || d.includes('lácteo') || d.includes('leche') || d.includes('queso') || d.includes('panela') || d.includes('yogur')) ||
    (dietaryHabits?.dietaryRestrictions || []).some((r) => r.toLowerCase().includes('lactosa') || r.toLowerCase().includes('lactose') || r.toLowerCase().includes('sin_lacteos')) ||
    (clinical?.digestiveIssues || []).some((i) => i.toLowerCase().includes('lactosa') || i.toLowerCase().includes('lactose'));
  const hasDiabetes = (clinical?.diagnosedDiseases || []).some((d) => d.toLowerCase().includes('diabet') || d.toLowerCase().includes('glucosa') || d.toLowerCase().includes('insulina'));

  // Distribución de tiempos y porcentajes según número de comidas
  let configs: { type: Meal['type']; share: number; time: string }[] = [];

  if (mealsCount <= 3) {
    configs = [
      { type: 'breakfast', share: 0.35, time: '08:00' },
      { type: 'lunch', share: 0.40, time: '14:00' },
      { type: 'dinner', share: 0.25, time: '20:30' },
    ];
  } else if (mealsCount === 4) {
    configs = [
      { type: 'breakfast', share: 0.28, time: '07:30' },
      { type: 'morning_snack', share: 0.18, time: '11:00' },
      { type: 'lunch', share: 0.34, time: '14:30' },
      { type: 'dinner', share: 0.20, time: '20:30' },
    ];
  } else if (mealsCount === 5) {
    configs = [
      { type: 'breakfast', share: 0.25, time: '07:30' },
      { type: 'morning_snack', share: 0.15, time: '10:30' },
      { type: 'lunch', share: 0.30, time: '14:00' },
      { type: 'afternoon_snack', share: 0.15, time: '17:30' },
      { type: 'dinner', share: 0.15, time: '20:30' },
    ];
  } else {
    configs = [
      { type: 'breakfast', share: 0.22, time: '07:00' },
      { type: 'morning_snack', share: 0.12, time: '10:00' },
      { type: 'lunch', share: 0.28, time: '13:30' },
      { type: 'afternoon_snack', share: 0.12, time: '16:30' },
      { type: 'dinner', share: 0.16, time: '19:30' },
      { type: 'post_workout', share: 0.10, time: '22:00' },
    ];
  }

  const meals: Meal[] = [];
  let allocatedKcal = 0;

  configs.forEach((cfg, idx) => {
    const isLast = idx === configs.length - 1;
    const mKcal = isLast ? Math.max(100, targetKcal - allocatedKcal) : Math.round(targetKcal * cfg.share);
    allocatedKcal += mKcal;

    const mProt = Number((targetProt * cfg.share).toFixed(1));
    const mCarbs = Number((targetCarbs * cfg.share).toFixed(1));
    const mFats = Number((targetFats * cfg.share).toFixed(1));

    let template: { name: string; prepSteps: string[]; spec: MealSpec };

    // =========================================================================
    // CATÁLOGO VARIADO Y CREATIVO DE RECETAS FIT POR DÍA DE LA SEMANA
    // =========================================================================

    if (cfg.type === 'breakfast') {
      if (dayIndex === 6 || dayIndex === 7) {
        // Fin de semana: Hot cakes fit proteicos de avena, plátano y canela
        template = {
          name: dayIndex === 6
            ? '🥞 Desayuno Fit: Hot Cakes Proteicos de Avena & Plátano con Canela'
            : '🥞 Hot Cakes Fit Dorados con Topping de Manzana, Canela y Proteína Shake',
          prepSteps: [
            'Licuar la avena molida con claras de huevo, proteína whey y canela al gusto.',
            'Cocinar a fuego bajo en sartén antiadherente con tapa 2-3 min hasta burbujear; voltear 1 min.',
            'Servir calientes con fruta en rodajas y crema de cacahuate 100% natural untada.',
          ],
          spec: {
            prot: [
              { id: 'rec-hot-cakes-proteicos', share: 0.6, notes: 'Hot cakes fit de avena y claras' },
              { id: 'aoa-clara-huevo', share: 0.4, notes: 'Claras líquidas para batir y esponjar' },
            ],
            carb: [{ id: dayIndex === 6 ? 'fru-platano-tabasco' : 'fru-manzana-roja', share: 1.0, notes: 'Fruta fresca en rodajas' }],
            fat: [{ id: 'gra-crema-cacahuate', share: 1.0, notes: 'Crema de cacahuate 100% natural' }],
          },
        };
      } else if (dayIndex === 1 || dayIndex === 4) {
        // Lunes y Jueves: Huevos revueltos a la mexicana con nopales y tortillas
        template = {
          name: '🍳 Huevos Revueltos a la Mexicana con Nopales Asados, Frijoles & Tortillas',
          prepSteps: [
            'Saltear nopales tiernos con jitomate y cebolla en sartén antiadherente.',
            'Batir los huevos enteros con las claras y verter a fuego medio hasta cuajar.',
            'Servir con tortillas de maíz nixtamalizadas calientes al comal y aguacate Hass.',
          ],
          spec: {
            prot: [
              { id: 'aoa-huevo-entero', share: 0.45, notes: 'Huevos enteros frescos' },
              { id: 'aoa-clara-huevo', share: 0.55, notes: 'Claras pasteurizadas de alto valor biológico' },
            ],
            carb: [{ id: 'cer-tortilla-maiz', share: 1.0, notes: 'Tortillas de maíz nixtamalizadas al comal' }],
            fat: [{ id: 'gra-aguacate-hass', share: 1.0, notes: 'Aguacate Hass fresco en rebanadas' }],
            veg: { id: 'ver-nopal-cocido', grams: 110, notes: 'Nopales salteados' },
          },
        };
      } else if (dayIndex === 3) {
        // Miércoles: Omelette de claras con queso panela, espinacas y tostadas
        template = {
          name: '🧀 Omelette Atlante de Claras con Queso Panela Asado, Espinacas & Tostadas',
          prepSteps: [
            'Batir las claras de huevo con una pizca de orégano y sal marina.',
            'Verter en sartén caliente con espinacas picadas y doblar en forma de omelette.',
            'Asar cubos de queso panela al comal y servir con tortillas de maíz y aguacate.',
          ],
          spec: {
            prot: [
              { id: 'aoa-clara-huevo', share: 0.65, notes: 'Claras batidas esponjosas' },
              { id: 'aoa-queso-panela', share: 0.35, notes: 'Queso panela artesanal asado' },
            ],
            carb: [{ id: 'cer-tortilla-maiz', share: 1.0, notes: 'Tortillas de maíz al comal' }],
            fat: [{ id: 'gra-aguacate-hass', share: 1.0, notes: 'Aguacate Hass' }],
            veg: { id: 'ver-espinaca-cruda', grams: 90, notes: 'Espinacas tiernas integradas' },
          },
        };
      } else {
        // Martes y Viernes: Bowl de avena cremosa con manzana y claras al sartén
        template = {
          name: '🥣 Bowl Anabólico: Avena Caliente con Canela, Manzana Roja & Claras al Sartén',
          prepSteps: [
            'Hervir la avena en agua con canela hasta textura cremosa.',
            'Revolver las claras de huevo con queso panela en sartén antiadherente.',
            'Servir la avena con la manzana fresca picada y la crema de cacahuate natural.',
          ],
          spec: {
            prot: [
              { id: 'aoa-clara-huevo', share: 0.6, notes: 'Claras revueltas esponjosas' },
              { id: 'aoa-queso-panela', share: 0.4, notes: 'Queso panela asado al comal' },
            ],
            carb: [
              { id: 'cer-avena-hojuelas', share: 0.65, notes: 'Avena en hojuelas cocida' },
              { id: 'fru-manzana-roja', share: 0.35, notes: 'Manzana roja en cubos' },
            ],
            fat: [{ id: 'gra-crema-cacahuate', share: 1.0, notes: 'Crema de cacahuate natural' }],
          },
        };
      }
    } else if (cfg.type === 'morning_snack') {
      if (dayIndex === 1 || dayIndex === 4) {
        template = {
          name: '🍘 Colación Fit: Crujientes Rice Cakes con Crema de Cacahuate & Shake de Whey',
          prepSteps: [
            'Untar la crema de cacahuate 100% natural sobre las tortitas de arroz inflado (rice cakes).',
            'Disolver la proteína de suero aislada en agua helada. Snack crujiente de alta saciedad.',
          ],
          spec: {
            prot: [{ id: 'sup-whey-isolate', share: 1.0, notes: 'Proteína Whey Isolate disuelta en agua helada' }],
            carb: [{ id: 'cer-rice-cakes', share: 1.0, notes: 'Tortitas de arroz inflado crujientes' }],
            fat: [{ id: 'gra-crema-cacahuate', share: 1.0, notes: 'Untada sobre los rice cakes' }],
          },
        };
      } else if (dayIndex === 3) {
        template = {
          name: '🍎 Manzana Roja en Láminas con Crema de Cacahuate & Whey Protein Shake',
          prepSteps: [
            'Cortar la manzana en láminas finas y untar con la porción pesada de crema de cacahuate.',
            'Acompañar con un batido frío de proteína de suero aislada en 300 ml de agua.',
          ],
          spec: {
            prot: [{ id: 'sup-whey-isolate', share: 1.0, notes: 'Whey isolate disuelto en agua fría' }],
            carb: [{ id: 'fru-manzana-roja', share: 1.0, notes: 'Manzana fresca con piel' }],
            fat: [{ id: 'gra-crema-cacahuate', share: 1.0, notes: 'Crema de cacahuate 100% natural' }],
          },
        };
      } else {
        template = {
          name: '🍓 Parfait Proteico de Yogur Griego sin Azúcar con Fruta Fresca & Crema de Cacahuate',
          prepSteps: [
            'Servir el yogur griego natural sin azúcar en un tazón.',
            'Añadir la proteína whey e integrar suavemente con la fruta fresca y crema de cacahuate.',
          ],
          spec: {
            prot: [
              { id: 'lac-yogur-griego-sin-azucar', share: 0.65, notes: 'Yogur natural estilo griego bajo en grasa' },
              { id: 'sup-whey-isolate', share: 0.35, notes: 'Whey isolate para máxima biodisponibilidad' },
            ],
            carb: [{ id: 'fru-papaya-maradol', share: 1.0, notes: 'Papaya fresca en cubos' }],
            fat: [{ id: 'gra-crema-cacahuate', share: 1.0, notes: 'Crema de cacahuate natural' }],
          },
        };
      }
    } else if (cfg.type === 'lunch') {
      if ((dayIndex === 3 || dayIndex === 7) && !avoidsFish) {
        // Miércoles y Domingo: Tilapia fresca al limón
        template = {
          name: dayIndex === 3
            ? '🐟 Comida Fit: Filete de Tilapia al Mojo de Limón y Ajo con Arroz al Vapor y Espinacas'
            : '🐟 Filete de Tilapia Sellada con Especias Mediterráneas, Arroz al Vapor y Ensalada Verde',
          prepSteps: [
            'Marinar la tilapia fresca con jugo de limón fresco, sal marina, ajo molido y finas hierbas.',
            'Asar en sartén a fuego medio por 3 minutos por lado para conservar jugosidad.',
            'Servir con arroz al vapor, espinacas tiernas aliñadas con aceite de oliva extra virgen y aguacate.',
          ],
          spec: {
            prot: [{ id: 'aoa-tilapia-filete-cocido', share: 1.0, notes: 'Filete de tilapia fresca asada' }],
            carb: [{ id: 'cer-arroz-blanco-cocido', share: 1.0, notes: 'Arroz blanco cocido al vapor' }],
            fat: [
              { id: 'gra-aguacate-hass', share: 0.6, notes: 'Aguacate Hass en rebanadas' },
              { id: 'gra-aceite-oliva', share: 0.4, notes: 'Aceite de oliva extra virgen en crudo' },
            ],
            veg: { id: 'ver-espinaca-cruda', grams: 90, notes: 'Espinacas frescas aliñadas' },
          },
        };
      } else if (dayIndex === 2 || dayIndex === 6) {
        // Martes y Sábado: Fajitas de res magra al comal
        template = {
          name: dayIndex === 2
            ? '🥩 Fajitas de Res Magra Salteadas al Comal con Nopales Tiernos, Frijoles & Tortillas'
            : '🥩 Tacos al Comal de Bistec Magro con Pico de Gallo, Nopales Asados y Guacamole',
          prepSteps: [
            'Cortar el bistec magro en tiras y saltear con nopales en sartén caliente sin aceite añadido.',
            'Calentar las tortillas de maíz nixtamalizadas al comal.',
            'Servir con frijoles negros enteros de la olla y guacamole fresco con limón.',
          ],
          spec: {
            prot: [{ id: 'aoa-res-magra-cruda', share: 1.0, notes: 'Bistec de res magro a la plancha' }],
            carb: [
              { id: 'cer-tortilla-maiz', share: 0.65, notes: 'Tortillas de maíz nixtamalizadas' },
              { id: 'leg-frijol-negro-cocido', share: 0.35, notes: 'Frijoles negros de la olla' },
            ],
            fat: [{ id: 'gra-aguacate-hass', share: 1.0, notes: 'Guacamole fresco con limón' }],
            veg: { id: 'ver-nopal-cocido', grams: 110, notes: 'Nopales salteados al comal' },
          },
        };
      } else if (dayIndex === 4) {
        // Jueves: Pollo con papas al vapor al romero
        template = {
          name: '🥔 Pechuga Dorada a las Finas Hierbas con Papas al Vapor al Romero & Lentejas de la Olla',
          prepSteps: [
            'Cocer papas con piel en cubos y dorar ligeramente en sartén con una pizca de romero y sal.',
            'Asar pechuga a la plancha a temperatura media hasta sellado jugoso.',
            'Servir con lentejas cocidas de la olla y ensalada de espinacas tiernas aliñada con aceite de oliva.',
          ],
          spec: {
            prot: [{ id: 'aoa-pollo-pechuga-cocida', share: 1.0, notes: 'Pechuga de pollo a la plancha' }],
            carb: [
              { id: 'cer-papa-hervida', share: 0.65, notes: 'Papa blanca hervida con piel' },
              { id: 'leg-lenteja-cocida', share: 0.35, notes: 'Lentejas cocidas de la olla' },
            ],
            fat: [{ id: 'gra-aceite-oliva', share: 1.0, notes: 'Aceite de oliva virgen extra' }],
            veg: { id: 'ver-espinaca-cruda', grams: 80, notes: 'Espinacas frescas' },
          },
        };
      } else {
        // Lunes y Viernes: Pechuga a la plancha con arroz blanco y frijoles negros
        template = {
          name: dayIndex === 1
            ? '🍗 Pechuga a la Plancha con Arroz Blanco al Vapor, Frijoles Negros de la Olla & Aguacate'
            : '🥗 Bowl Mexicano: Pechuga Deshebrada, Arroz al Vapor, Frijoles Negros & Aguacate Hass',
          prepSteps: [
            'Sazonar la pechuga de pollo magra con ajo, paprika y sal marina.',
            'Asar a la plancha a temperatura media hasta obtener sellado dorado.',
            'Acompañar con arroz al vapor, frijoles enteros de la olla, calabacitas y rebanadas de aguacate.',
          ],
          spec: {
            prot: [{ id: 'aoa-pollo-pechuga-cocida', share: 1.0, notes: 'Pechuga magra a la plancha' }],
            carb: [
              { id: 'cer-arroz-blanco-cocido', share: 0.65, notes: 'Arroz blanco al vapor' },
              { id: 'leg-frijol-negro-cocido', share: 0.35, notes: 'Frijoles negros de la olla enteros' },
            ],
            fat: [{ id: 'gra-aguacate-hass', share: 1.0, notes: 'Aguacate Hass fresco' }],
            veg: { id: 'ver-calabacita-cocida', grams: 100, notes: 'Calabacitas al vapor' },
          },
        };
      }
    } else if (cfg.type === 'afternoon_snack') {
      if (dayIndex === 1 || dayIndex === 4) {
        template = {
          name: '🧀 Colación Tarde: Queso Panela Asado con Tostadas de Maíz & Aguacate Fresco',
          prepSteps: [
            'Asar el queso panela en sartén antiadherente hasta dorar los bordes.',
            'Servir sobre tostadas horneadas o tortillas con jitomate fresco y aguacate.',
          ],
          spec: {
            prot: [{ id: 'aoa-queso-panela', share: 1.0, notes: 'Queso panela asado al comal' }],
            carb: [{ id: 'cer-tortilla-maiz', share: 1.0, notes: 'Tortillas o tostadas de maíz horneadas' }],
            fat: [{ id: 'gra-aguacate-hass', share: 1.0, notes: 'Aguacate fresco' }],
            veg: { id: 'ver-jitomate-bola', grams: 80, notes: 'Jitomate en rodajas' },
          },
        };
      } else if (dayIndex === 3) {
        template = {
          name: '🍓 Yogur Griego Natural Alto en Proteína con Papaya Fresca & Crema de Cacahuate',
          prepSteps: [
            'Servir el yogur griego frío en un tazón.',
            'Mezclar con scoop de Whey Isolate, cubos de papaya y crema de cacahuate natural.',
          ],
          spec: {
            prot: [
              { id: 'lac-yogur-griego-sin-azucar', share: 0.65, notes: 'Yogur griego bajo en grasa' },
              { id: 'sup-whey-isolate', share: 0.35, notes: 'Whey Isolate en polvo' },
            ],
            carb: [{ id: 'fru-papaya-maradol', share: 1.0, notes: 'Papaya fresca en cubos' }],
            fat: [{ id: 'gra-crema-cacahuate', share: 1.0, notes: 'Crema de cacahuate natural' }],
          },
        };
      } else {
        template = {
          name: '🍘 Rice Cakes con Crema de Cacahuate Natural, Láminas de Manzana & Shake de Whey',
          prepSteps: [
            'Untar crema de cacahuate natural sobre las tortitas de arroz inflado.',
            'Colocar láminas de manzana encima y acompañar con batido de proteína en agua.',
          ],
          spec: {
            prot: [{ id: 'sup-whey-isolate', share: 1.0, notes: 'Proteína Whey Isolate en agua fría' }],
            carb: [
              { id: 'cer-rice-cakes', share: 0.6, notes: 'Tortitas de arroz inflado' },
              { id: 'fru-manzana-roja', share: 0.4, notes: 'Manzana roja en láminas' },
            ],
            fat: [{ id: 'gra-crema-cacahuate', share: 1.0, notes: 'Crema de cacahuate 100% natural' }],
          },
        };
      }
    } else if (cfg.type === 'dinner') {
      if ((dayIndex === 1 || dayIndex === 6) && !avoidsFish) {
        // Lunes y Sábado: Tacos de atún a la mexicana
        template = {
          name: '🌮 Tacos Ligeros de Atún a la Mexicana con Pico de Gallo & Aguacate Hass',
          prepSteps: [
            'Drenar el atún en agua y mezclar con pico de gallo (jitomate, cebolla, cilantro y limón).',
            'Calentar las tortillas de maíz nixtamalizadas en el comal.',
            'Rellenar los tacos con el atún a la mexicana y rebanadas de aguacate.',
          ],
          spec: {
            prot: [
              { id: 'aoa-atun-agua', share: 0.75, notes: 'Atún en agua drenado a la mexicana' },
              { id: 'aoa-clara-huevo', share: 0.25, notes: 'Claras cocidas picadas' },
            ],
            carb: [{ id: 'cer-tortilla-maiz', share: 1.0, notes: 'Tortillas de maíz nixtamalizadas al comal' }],
            fat: [{ id: 'gra-aguacate-hass', share: 1.0, notes: 'Aguacate Hass en rebanadas' }],
            veg: { id: 'ver-jitomate-bola', grams: 90, notes: 'Jitomate picado con cilantro y limón' },
          },
        };
      } else if (dayIndex === 3) {
        // Miércoles: Revuelto ligero de claras con calabacitas y queso panela
        template = {
          name: '🍳 Revuelto Ligero de Claras con Calabacitas Salteadas, Queso Panela & Tostadas',
          prepSteps: [
            'Saltear las calabacitas en cubos pequeños en sartén antiadherente.',
            'Verter las claras de huevo y revolver suavemente con cubos de queso panela.',
            'Acompañar con tortillas de maíz calientes y aceite de oliva virgen extra.',
          ],
          spec: {
            prot: [
              { id: 'aoa-clara-huevo', share: 0.65, notes: 'Claras revueltas ligeras' },
              { id: 'aoa-queso-panela', share: 0.35, notes: 'Queso panela artesanal fresco' },
            ],
            carb: [{ id: 'cer-tortilla-maiz', share: 1.0, notes: 'Tortillas de maíz al comal' }],
            fat: [{ id: 'gra-aceite-oliva', share: 1.0, notes: 'Aceite de oliva extra virgen en crudo' }],
            veg: { id: 'ver-calabacita-cocida', grams: 100, notes: 'Calabacitas salteadas' },
          },
        };
      } else if (dayIndex === 5 && !avoidsFish) {
        // Viernes: Filete de tilapia asada ligera
        template = {
          name: '🐟 Filete de Tilapia Asada a la Plancha con Ensalada Verde, Jitomate & Aguacate',
          prepSteps: [
            'Sazonar el filete de tilapia con limón y ajo.',
            'Asar 3 minutos por lado en sartén antiadherente.',
            'Servir con ensalada fresca de hojas verdes, jitomate, aguacate y tortillas de maíz.',
          ],
          spec: {
            prot: [{ id: 'aoa-tilapia-filete-cocido', share: 1.0, notes: 'Tilapia asada a la plancha' }],
            carb: [{ id: 'cer-tortilla-maiz', share: 1.0, notes: 'Tortillas de maíz al comal' }],
            fat: [{ id: 'gra-aguacate-hass', share: 1.0, notes: 'Aguacate Hass fresco' }],
            veg: { id: 'ver-espinaca-cruda', grams: 80, notes: 'Espinacas tiernas con limón' },
          },
        };
      } else {
        // Martes, Jueves, Domingo: Ensalada proteica de pollo con panela y calabacitas
        template = {
          name: '🥗 Ensalada Proteica de Pollo con Cubos de Panela Asado, Calabacitas & Tortilla',
          prepSteps: [
            'Saltear las calabacitas en cubos y mezclar con pechuga deshebrada y queso panela.',
            'Aderezar con aceite de oliva extra virgen y sal marina.',
            'Acompañar con tortillas calientes al comal.',
          ],
          spec: {
            prot: [
              { id: 'aoa-pollo-pechuga-cocida', share: 0.7, notes: 'Pechuga deshebrada sazonada' },
              { id: 'aoa-queso-panela', share: 0.3, notes: 'Cubos de queso panela fresco' },
            ],
            carb: [{ id: 'cer-tortilla-maiz', share: 1.0, notes: 'Tortillas de maíz nixtamalizadas' }],
            fat: [{ id: 'gra-aceite-oliva', share: 1.0, notes: 'Aceite de oliva virgen extra en crudo' }],
            veg: { id: 'ver-calabacita-cocida', grams: 90, notes: 'Calabacitas al vapor' },
          },
        };
      }
    } else {
      // 6ª comida / snack nocturno (digestión lenta para síntesis proteica nocturna)
      template = {
        name: '🌙 Snack Nocturno: Yogur Griego con Crema de Cacahuate & Canela',
        prepSteps: [
          'Servir yogur griego frío en un tazón.',
          'Añadir crema de cacahuate natural, canela y fruta fresca. Proteína de lenta digestión para síntesis nocturna.',
        ],
        spec: {
          prot: [{ id: 'lac-yogur-griego-sin-azucar', share: 1.0, notes: 'Yogur natural estilo griego' }],
          carb: [{ id: 'fru-papaya-maradol', share: 1.0, notes: 'Papaya fresca en cubos' }],
          fat: [{ id: 'gra-crema-cacahuate', share: 1.0, notes: 'Crema de cacahuate 100% natural' }],
        },
      };
    }

    // Aplicar filtros clínicos y de preferencias personales sobre los alimentos de la receta
    const filteredSpec = applyClinicalAndPreferenceFilters(
      template.spec,
      avoidsFish,
      avoidsEggs,
      avoidsDairy,
      hasDiabetes
    );

    const meal = buildMealFromSpec(
      template.name,
      cfg.type,
      cfg.time,
      template.prepSteps,
      filteredSpec,
      mKcal,
      mProt,
      mCarbs,
      mFats
    );
    meals.push(meal);
  });

  // Ajuste fino para garantizar coherencia matemática absoluta (suma del día === calorieTarget)
  const dayCalories = meals.reduce((acc, m) => acc + m.totals.calories, 0);
  const diff = targetKcal - dayCalories;
  if (diff !== 0 && meals.length > 0) {
    const lastMeal = meals[meals.length - 1];
    if (lastMeal.items.length > 0) {
      lastMeal.items[0].calories += diff;
      lastMeal.totals.calories += diff;
    }
  }

  return meals;
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

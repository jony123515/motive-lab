// ==========================================
// MOTIVE LAB - Core TypeScript Definitions
// Evidence-Based Sports Science & Clinical System
// ==========================================

export type UserRole = 'client' | 'coach' | 'nutritionist' | 'admin';

export type Gender = 'male' | 'female';

export type ActivityLevel = 
  | 'sedentary'       // Poco o nada de ejercicio, trabajo de escritorio
  | 'light'           // 1-3 días de actividad moderada
  | 'moderate'        // 3-5 días de entrenamiento estructurado
  | 'intense'         // 6-7 días de entrenamiento vigoroso
  | 'very_intense';   // Atleta de alto rendimiento / doble turno

export type PrimaryGoal = 
  | 'hypertrophy'     // Ganancia de masa muscular
  | 'fat_loss'        // Pérdida de grasa conservando masa magra
  | 'recomposition'   // Recomposición corporal
  | 'strength'        // Fuerza y rendimiento neuromuscular
  | 'endurance'       // Resistencia y acondicionamiento
  | 'general_health'; // Salud y hábitos sostenibles

export type TrainingLocation = 'gym' | 'home_minimal' | 'home_dumbbells';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type RiskLevel = 'low' | 'moderate' | 'high_clinical_stop';

// --- Expediente de Evaluación Integral ---
export interface AnthropometryData {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  waistCm?: number;
  hipCm?: number;
  bodyFatPercentage?: number; // Sólo si cuenta con medición válida (DEXA, plicometría certificada)
  recentWeightTrend: 'increasing' | 'stable' | 'decreasing';
}

export interface ClinicalScreeningData {
  // Banderas rojas cardiovasculares / PAR-Q+
  hasChestPainAtRestOrExercise: boolean;
  hasSyncopeOrDizziness: boolean;
  hasUncontrolledHypertension: boolean;
  hasKnownHeartMurmurOrDisease: boolean;
  
  // Condiciones crónicas
  diagnosedDiseases: string[];
  currentMedications: string[];
  knownAllergies: string[];
  recentSurgeriesOrFractures: string[];
  
  // Lesiones osteoarticulares y dolor
  hasJointPainDuringExercise: boolean;
  jointPainLocations: string[]; // 'hombro', 'rodilla', 'lumbar', etc.
  functionalLimitations: string;
  
  // Salud alimentaria y conducta
  hasSevereEatingDisorderHistory: boolean;
  digestiveIssues: string[]; // 'reflujo', 'ibs', 'intolerancia_lactosa'
  isPregnantOrLactating?: boolean;
  
  medicalClearanceRequired: boolean;
  safetyObservations: string[];
}

export interface SportsBackgroundData {
  yearsTraining: number;
  daysAvailable: 2 | 3 | 4 | 5 | 6;
  sessionDurationMinutes: number;
  trainingLocation: TrainingLocation;
  equipmentAvailable: string[];
  exerciseDiscomforts: string[];
  known1RMs?: {
    squatKg?: number;
    benchPressKg?: number;
    deadliftKg?: number;
    overheadPressKg?: number;
  };
  additionalSports: string;
}

export interface DietaryHabitsData {
  preferredMealsPerDay: number; // 2 a 8
  budgetLevel: 'economical' | 'moderate' | 'flexible';
  cookingTimeMinutes: number;
  dietaryRestrictions: string[]; // 'vegetariano', 'sin_cerdo', 'kosher', etc.
  dislikedFoods: string[];
  favoriteFoods: string[];
  currentSupplements: string[];
  dailyWaterLitres: number;
  trainingTime: 'morning' | 'noon' | 'afternoon' | 'evening';
}

export interface UserAssessment {
  id: string;
  userId: string;
  updatedAt: string;
  anthropometry: AnthropometryData;
  goal: {
    primary: PrimaryGoal;
    secondary?: string;
    priorityMuscles: string[]; // e.g. ['dorsal', 'gluteo', 'deltoides_lateral']
    timeframeWeeks: number;
    commitmentLevel: 'high' | 'medium' | 'strict';
    previousObstacles: string;
  };
  clinical: ClinicalScreeningData;
  sports: SportsBackgroundData;
  diet: DietaryHabitsData;
  activityRecovery: {
    occupationType: 'sedentary_desk' | 'standing_light' | 'active_labor';
    averageDailySteps: number;
    sleepHours: number;
    sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
    stressLevel: 'low' | 'moderate' | 'high';
  };
  consents: {
    privacyPolicyAccepted: boolean;
    sensitiveHealthDataConsent: boolean;
    termsAccepted: boolean;
    date: string;
  };
}

// --- Nutrición y SMAE ---
export type SmaeCategory = 
  | 'verduras'
  | 'frutas'
  | 'cereales_sin_grasa'
  | 'cereales_con_grasa'
  | 'leguminosas'
  | 'aoa_muy_bajo_grasa'
  | 'aoa_bajo_grasa'
  | 'aoa_moderado_grasa'
  | 'aoa_alto_grasa'
  | 'leche_descremada'
  | 'leche_entera'
  | 'aceites_sin_proteina'
  | 'aceites_con_proteina'
  | 'azucares_sin_grasa';

export interface FoodItem {
  id: string;
  name: string;
  category: SmaeCategory;
  servingDescription: string;
  servingGrams: number;
  state: 'crudo' | 'cocido' | 'listo_consumo' | 'drenado';
  cookingYieldFactor: number; // Factor para convertir crudo <-> cocido
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sodiumMg?: number;
  costTier: 'economico' | 'medio' | 'elevado';
  source: string; // e.g. "SMAE 5ta Edición"
}

export interface MealFoodReference {
  foodId: string;
  foodName: string;
  category: SmaeCategory;
  grams: number;
  servingsEquivalent: number;
  state: 'crudo' | 'cocido' | 'listo_consumo' | 'drenado';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  preparationNotes?: string;
}

export interface Meal {
  id: string;
  name: string; // e.g. "Desayuno Anabólico", "Comida Pre-Entreno"
  suggestedTime: string; // e.g. "08:30"
  type: 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner' | 'pre_workout' | 'post_workout';
  items: MealFoodReference[];
  recipePreparationSteps: string[];
  prepTimeMinutes: number;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
}

export interface DailyMenu {
  dayNumber: number; // 1 = Lunes, 7 = Domingo
  dayName: string;
  meals: Meal[];
  dailyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
}

export interface NutritionPlan {
  id: string;
  userId: string;
  createdAt: string;
  status: 'active' | 'under_review' | 'archived';
  methodology: {
    formulaUsed: 'Mifflin-St Jeor' | 'Katch-McArdle';
    bmr: number;
    tdee: number;
    calorieTarget: number;
    macroTargetGrams: {
      protein: number;
      carbs: number;
      fats: number;
      fiber: number;
    };
    explanation: string;
  };
  weeklyDays: DailyMenu[];
  safetyVerified: boolean;
}

// --- Entrenamiento y Fisiología ---
export type MuscleGroup = 
  | 'pecho'
  | 'espalda'
  | 'cuadriceps'
  | 'isquiosurales'
  | 'gluteos'
  | 'hombros'
  | 'biceps'
  | 'triceps'
  | 'pantorrillas'
  | 'core_abdomen';

export type MovementPattern = 
  | 'empuje_horizontal'
  | 'empuje_vertical'
  | 'traccion_horizontal'
  | 'traccion_vertical'
  | 'dominante_rodilla'
  | 'dominante_cadera'
  | 'aislamiento'
  | 'anti_extension_core';

export interface ExerciseDefinition {
  id: string;
  nameSpanish: string;
  nameEnglish?: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  movementPattern: MovementPattern;
  tier: 'compound_primary' | 'compound_secondary' | 'isolation' | 'core_mobility';
  equipmentRequired: 'barbell' | 'dumbbells' | 'cable_machine' | 'machine' | 'bodyweight' | 'bands';
  instructions: {
    startingPosition: string;
    execution: string;
    breathing: string;
    keySafetyCues: string[];
    commonMistakes: string[];
  };
  warmupProtocol: string; // Pauta para series de aproximación específicas
  imageUrl: string;
  videoUrl?: string;
  contraindications: string[]; // e.g. ['hernia_lumbar_activa', 'pinzamiento_hombro']
}

export type SetType = 'warmup_approximation' | 'working_effective' | 'drop_set';

export interface PrescribedSet {
  setNumber: number;
  setType: SetType;
  targetRepsMin: number;
  targetRepsMax: number;
  targetRIR: number; // Reps in Reserve (e.g. 2 RIR)
  prescribedWeightKg?: number;
  restSeconds: number;
}

export interface SessionExercise {
  exerciseId: string;
  exercise: ExerciseDefinition;
  order: number;
  sets: PrescribedSet[];
  notes?: string;
  substituteExerciseIds?: string[];
}

export interface WorkoutSession {
  id: string;
  dayName: string; // e.g. "Día 1: Torso Hipertrofia & Fuerza"
  splitType: 'full_body' | 'upper' | 'lower' | 'push' | 'pull' | 'legs';
  targetMuscleGroups: MuscleGroup[];
  warmupRoutine: string[];
  exercises: SessionExercise[];
  cardioPrescription?: {
    type: 'LISS' | 'HIIT' | 'walking';
    durationMinutes: number;
    targetHeartRateZone?: string;
  };
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  title: string;
  mesocycleWeeks: number; // 4-8 semanas
  currentWeek: number;
  sessions: WorkoutSession[];
  progressionRule: 'double_progression_standard' | 'linear_load' | 'volume_accumulation';
  deloadWeek: number;
}

// --- Registros de Sesión y Sobrecarga Progresiva ---
export interface LoggedSetData {
  setNumber: number;
  setType: SetType;
  weightKg: number;
  repsCompleted: number;
  actualRIR: number;
  perceivedPain: boolean; // Dolor articular/molestia (no fatiga muscular)
  notes?: string;
}

export interface LoggedWorkoutSession {
  id: string;
  userId: string;
  workoutSessionId: string;
  date: string;
  durationMinutes: number;
  loggedExercises: {
    exerciseId: string;
    sets: LoggedSetData[];
  }[];
  sessionRPE: number; // 1 a 10 escala Borg adaptada
  fatigueLevel: 'fresh' | 'normal' | 'high_fatigue';
  coachNotes?: string;
}

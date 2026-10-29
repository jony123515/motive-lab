'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserAssessment,
  NutritionPlan,
  WorkoutPlan,
  LoggedWorkoutSession,
  MealFoodReference,
} from '@/types';
import { calculateMetabolicTargets } from '@/lib/engines/metabolicEngine';
import { generate7DayNutritionPlan } from '@/lib/engines/nutritionEngine';
import { generatePersonalizedWorkoutPlan } from '@/lib/engines/trainingEngine';
import { calculateHydrationPlan } from '@/lib/engines/hydrationEngine';
import { evaluateClinicalSafety, SafetyTriageResult } from '@/lib/engines/safetyTriageEngine';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  birthDate: string;
  avatarUrl?: string;
  subscriptionTier?: 'free' | 'pro' | 'coach';
  subscriptionStatus?: string;
  stripeCustomerId?: string;
}

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUserRole: (role: UserRole) => void;
  setSubscriptionTier: (tier: 'free' | 'pro' | 'coach') => void;
  assessment: UserAssessment | null;
  hasCompletedAssessment: boolean;
  saveAssessment: (data: UserAssessment) => void;
  resetAssessment: () => void;
  safetyTriage: SafetyTriageResult | null;
  nutritionPlan: NutritionPlan | null;
  workoutPlan: WorkoutPlan | null;
  waterConsumedMl: number;
  addWaterMl: (ml: number) => void;
  resetWater: () => void;
  substituteMealFood: (dayNumber: number, mealId: string, oldFoodId: string, newFood: MealFoodReference) => void;
  loggedWorkouts: LoggedWorkoutSession[];
  saveLoggedWorkout: (log: LoggedWorkoutSession) => void;
  progressWeightHistory: { date: string; weightKg: number }[];
  addWeightLog: (weightKg: number) => void;
  coachFeedbackList: { id: string; clientName: string; date: string; message: string; status: 'pending' | 'reviewed' }[];
  reviewCoachFeedback: (id: string, reply: string) => void;
}

const defaultUser: UserProfile = {
  id: 'usr-demo-001',
  name: 'Alejandro Morales',
  email: 'alejandro.motive@ejemplo.com',
  role: 'admin',
  birthDate: '1996-05-14',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  subscriptionTier: 'coach',
  subscriptionStatus: 'active',
};

const defaultAssessment: UserAssessment = {
  id: 'ass-demo-001',
  userId: 'usr-demo-001',
  updatedAt: new Date().toISOString(),
  anthropometry: {
    age: 28,
    gender: 'male',
    heightCm: 178,
    weightKg: 78.5,
    waistCm: 82,
    hipCm: 98,
    bodyFatPercentage: 14.5,
    recentWeightTrend: 'stable',
  },
  goal: {
    primary: 'hypertrophy',
    secondary: 'Incrementar fuerza en banca y sentadilla',
    priorityMuscles: ['pecho', 'espalda', 'deltoides_lateral'],
    timeframeWeeks: 12,
    commitmentLevel: 'strict',
    previousObstacles: 'Estancamiento en cargas y dificultad para preparar alimentos a tiempo',
  },
  clinical: {
    hasChestPainAtRestOrExercise: false,
    hasSyncopeOrDizziness: false,
    hasUncontrolledHypertension: false,
    hasKnownHeartMurmurOrDisease: false,
    diagnosedDiseases: [],
    currentMedications: [],
    knownAllergies: [],
    recentSurgeriesOrFractures: [],
    hasJointPainDuringExercise: false,
    jointPainLocations: [],
    functionalLimitations: 'Sin limitaciones articulares agudas',
    hasSevereEatingDisorderHistory: false,
    digestiveIssues: [],
    medicalClearanceRequired: false,
    safetyObservations: ['Apto para prescripción deportiva sin restricciones'],
  },
  sports: {
    yearsTraining: 3,
    daysAvailable: 4,
    sessionDurationMinutes: 75,
    trainingLocation: 'gym',
    equipmentAvailable: ['barbell', 'dumbbells', 'cables', 'machines'],
    exerciseDiscomforts: [],
    known1RMs: {
      benchPressKg: 95,
      squatKg: 130,
      deadliftKg: 160,
      overheadPressKg: 62.5,
    },
    additionalSports: 'Ciclismo recreativo de fin de semana',
  },
  diet: {
    preferredMealsPerDay: 4,
    budgetLevel: 'economical',
    cookingTimeMinutes: 30,
    dietaryRestrictions: [],
    dislikedFoods: ['hígado', 'mariscos crudos'],
    favoriteFoods: ['pollo asado', 'huevos con nopales', 'arroz', 'avena', 'aguacate'],
    currentSupplements: ['Creatina Monohidrato', 'Proteína Whey Isolate'],
    dailyWaterLitres: 2.5,
    trainingTime: 'afternoon',
  },
  activityRecovery: {
    occupationType: 'sedentary_desk',
    averageDailySteps: 7500,
    sleepHours: 7.5,
    sleepQuality: 'good',
    stressLevel: 'moderate',
  },
  consents: {
    privacyPolicyAccepted: true,
    sensitiveHealthDataConsent: true,
    termsAccepted: true,
    date: new Date().toISOString(),
  },
};

const AppContext = createContext<AppContextType | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(defaultUser);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState<boolean>(false);
  const [assessment, setAssessment] = useState<UserAssessment | null>(null);
  const [safetyTriage, setSafetyTriage] = useState<SafetyTriageResult | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [waterConsumedMl, setWaterConsumedMl] = useState<number>(1500);
  const [loggedWorkouts, setLoggedWorkouts] = useState<LoggedWorkoutSession[]>([]);
  const [progressWeightHistory, setProgressWeightHistory] = useState([
    { date: 'Semana 1', weightKg: 77.2 },
    { date: 'Semana 2', weightKg: 77.6 },
    { date: 'Semana 3', weightKg: 78.1 },
    { date: 'Semana 4 (Actual)', weightKg: 78.5 },
  ]);

  // Cargar evaluación almacenada localmente en la carga inicial
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCompleted = localStorage.getItem('motive_assessment_completed');
      const savedAssessment = localStorage.getItem('motive_user_assessment');
      if (savedCompleted === 'true' && savedAssessment) {
        try {
          const parsed = JSON.parse(savedAssessment);
          setAssessment(parsed);
          setHasCompletedAssessment(true);
        } catch (e) {
          console.error('Error parsing stored assessment:', e);
        }
      }
    }
  }, []);

  const [coachFeedbackList, setCoachFeedbackList] = useState([
    {
      id: 'fb-1',
      clientName: 'Alejandro Morales',
      date: '2026-10-22',
      message: 'Video de sentadilla subido para revisión técnica. Notó leve fatiga en la serie 3.',
      status: 'pending' as const,
    },
    {
      id: 'fb-2',
      clientName: 'Mariana Silva',
      date: '2026-10-21',
      message: 'Solicitud de sustitución de pechuga de pollo por atún para los días jueves.',
      status: 'reviewed' as const,
    },
  ]);

  // Detectar y cargar sesión real de Supabase si está configurado
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    const loadUserProfile = async (userId: string, email: string) => {
      try {
        const { data: profile } = await client
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profile) {
          setCurrentUser({
            id: profile.id,
            name: profile.full_name,
            email: profile.email || email,
            role: profile.role || 'client',
            birthDate: profile.birth_date || '1998-01-01',
            avatarUrl: profile.avatar_url || defaultUser.avatarUrl,
            subscriptionTier: profile.subscription_tier || 'free',
            subscriptionStatus: profile.subscription_status || 'inactive',
            stripeCustomerId: profile.stripe_customer_id,
          });
        }

        // Cargar última evaluación clínica
        const { data: assessmentData } = await client
          .from('clinical_assessments')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (assessmentData) {
          setAssessment({
            id: assessmentData.id,
            userId: assessmentData.user_id,
            updatedAt: assessmentData.updated_at,
            anthropometry: assessmentData.anthropometry,
            goal: assessmentData.goal,
            clinical: assessmentData.clinical_screening,
            sports: assessmentData.sports_background,
            diet: assessmentData.dietary_habits,
            activityRecovery: assessmentData.activity_recovery,
            consents: {
              privacyPolicyAccepted: true,
              sensitiveHealthDataConsent: true,
              termsAccepted: true,
              date: assessmentData.created_at,
            },
          });
          setHasCompletedAssessment(true);
        }
      } catch (err) {
        console.error('Error cargando datos de Supabase:', err);
      }
    };

    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id, session.user.email || '');
      }
    });

    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id, session.user.email || '');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Inicializar planes derivados de forma dinámica según datos del diagnóstico
  useEffect(() => {
    if (assessment && hasCompletedAssessment) {
      const triage = evaluateClinicalSafety(assessment.clinical);
      setSafetyTriage(triage);

      if (triage.canProceedWithAutomaticPlan) {
        // Estimar factor de actividad real desde pasos y hábitos
        let actLevel: 'sedentary' | 'light' | 'moderate' | 'intense' | 'very_intense' = 'moderate';
        const steps = assessment.activityRecovery?.averageDailySteps || 7000;
        if (steps < 5000) actLevel = 'sedentary';
        else if (steps < 8000) actLevel = 'light';
        else if (steps < 12000) actLevel = 'moderate';
        else actLevel = 'intense';

        const days = assessment.sports?.daysAvailable || 4;
        const metabolic = calculateMetabolicTargets(
          assessment.anthropometry,
          assessment.goal.primary,
          actLevel,
          days
        );

        const nutrPlan = generate7DayNutritionPlan(
          assessment.userId,
          metabolic,
          assessment.diet?.preferredMealsPerDay || 4
        );

        const expLevel = 
          (assessment.sports?.yearsTraining || 0) < 1 
            ? 'beginner' 
            : (assessment.sports?.yearsTraining || 0) > 3 
              ? 'advanced' 
              : 'intermediate';

        const workPlan = generatePersonalizedWorkoutPlan(
          assessment.userId,
          days,
          expLevel,
          assessment.anthropometry.gender,
          assessment.goal.primary,
          assessment.sports?.trainingLocation || 'gym'
        );

        setNutritionPlan(nutrPlan);
        setWorkoutPlan(workPlan);
      }
    } else {
      setNutritionPlan(null);
      setWorkoutPlan(null);
    }
  }, [assessment, hasCompletedAssessment]);

  const setCurrentUserRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
  };

  const saveAssessment = (data: UserAssessment) => {
    setAssessment(data);
    setHasCompletedAssessment(true);

    if (typeof window !== 'undefined') {
      localStorage.setItem('motive_user_assessment', JSON.stringify(data));
      localStorage.setItem('motive_assessment_completed', 'true');
    }

    const client = supabase;
    if (isSupabaseConfigured && client) {
      const triage = evaluateClinicalSafety(data.clinical);
      client.from('clinical_assessments').insert({
        user_id: data.userId,
        anthropometry: data.anthropometry,
        goal: data.goal,
        clinical_screening: data.clinical,
        sports_background: data.sports,
        dietary_habits: data.diet,
        activity_recovery: data.activityRecovery,
        risk_level: triage.riskLevel,
        is_cleared_for_auto_plan: triage.canProceedWithAutomaticPlan,
      }).then(({ error }) => {
        if (error) console.error('Error guardando evaluación en Supabase:', error);
      });
    }
  };

  const resetAssessment = () => {
    setAssessment(null);
    setHasCompletedAssessment(false);
    setNutritionPlan(null);
    setWorkoutPlan(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('motive_user_assessment');
      localStorage.removeItem('motive_assessment_completed');
    }
  };

  const addWaterMl = (ml: number) => {
    setWaterConsumedMl((prev) => Math.max(0, prev + ml));
  };

  const resetWater = () => {
    setWaterConsumedMl(0);
  };

  const substituteMealFood = (
    dayNumber: number,
    mealId: string,
    oldFoodId: string,
    newFood: MealFoodReference
  ) => {
    if (!nutritionPlan) return;

    const updatedWeeklyDays = nutritionPlan.weeklyDays.map((day) => {
      if (day.dayNumber !== dayNumber) return day;

      const updatedMeals = day.meals.map((meal) => {
        if (meal.id !== mealId) return meal;

        const updatedItems = meal.items.map((item) =>
          item.foodId === oldFoodId ? newFood : item
        );

        const newMealTotals = updatedItems.reduce(
          (acc, it) => ({
            calories: acc.calories + it.calories,
            protein: Number((acc.protein + it.protein).toFixed(1)),
            carbs: Number((acc.carbs + it.carbs).toFixed(1)),
            fats: Number((acc.fats + it.fats).toFixed(1)),
            fiber: acc.fiber,
          }),
          { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
        );

        return {
          ...meal,
          items: updatedItems,
          totals: newMealTotals,
        };
      });

      const newDailyTotals = updatedMeals.reduce(
        (acc, m) => ({
          calories: acc.calories + m.totals.calories,
          protein: Number((acc.protein + m.totals.protein).toFixed(1)),
          carbs: Number((acc.carbs + m.totals.carbs).toFixed(1)),
          fats: Number((acc.fats + m.totals.fats).toFixed(1)),
          fiber: acc.fiber,
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
      );

      return {
        ...day,
        meals: updatedMeals,
        dailyTotals: newDailyTotals,
      };
    });

    setNutritionPlan({
      ...nutritionPlan,
      weeklyDays: updatedWeeklyDays,
    });
  };

  const saveLoggedWorkout = (log: LoggedWorkoutSession) => {
    setLoggedWorkouts((prev) => [log, ...prev]);
  };

  const addWeightLog = (weightKg: number) => {
    setProgressWeightHistory((prev) => [
      ...prev,
      { date: `Semana ${prev.length + 1}`, weightKg },
    ]);
  };

  const reviewCoachFeedback = (id: string, reply: string) => {
    setCoachFeedbackList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'reviewed' as const } : item
      )
    );
  };

  const setSubscriptionTier = (tier: 'free' | 'pro' | 'coach') => {
    setCurrentUser((prev) => ({
      ...prev,
      subscriptionTier: tier,
      subscriptionStatus: 'active',
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUserRole,
        setSubscriptionTier,
        assessment,
        hasCompletedAssessment,
        saveAssessment,
        resetAssessment,
        safetyTriage,
        nutritionPlan,
        workoutPlan,
        waterConsumedMl,
        addWaterMl,
        resetWater,
        substituteMealFood,
        loggedWorkouts,
        saveLoggedWorkout,
        progressWeightHistory,
        addWeightLog,
        coachFeedbackList,
        reviewCoachFeedback,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

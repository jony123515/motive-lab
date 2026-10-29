'use client';

import React, { useState } from 'react';
import { useAppState } from '@/lib/store/appState';
import { MealFoodReference, FoodItem } from '@/types';
import { findSubstitutesForFood, SubstitutionProposal } from '@/lib/engines/substitutionEngine';
import { generateWeeklyShoppingList, ShoppingListItem } from '@/lib/engines/nutritionEngine';
import { 
  Apple, 
  Clock, 
  RotateCw, 
  ShoppingCart, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  X, 
  Sparkles, 
  Info, 
  Layers,
  Lock
} from 'lucide-react';
import { SubscriptionGate } from '@/components/auth/SubscriptionGate';
import { AssessmentGate } from '@/components/auth/AssessmentGate';
import { PhysiologicalGuaranteeCard } from '@/components/dashboard/PhysiologicalGuaranteeCard';

export default function NutritionPage() {
  const { currentUser, nutritionPlan, substituteMealFood } = useAppState();

  const isFree = currentUser.subscriptionTier === 'free' && currentUser.role === 'client';
  const [activeDay, setActiveDay] = useState(1);
  const [selectedFoodForSub, setSelectedFoodForSub] = useState<{
    mealId: string;
    food: MealFoodReference;
  } | null>(null);

  const [substitutionProposals, setSubstitutionProposals] = useState<SubstitutionProposal[]>([]);
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  const currentDayMenu = nutritionPlan?.weeklyDays.find((d) => d.dayNumber === activeDay) || nutritionPlan?.weeklyDays[0];

  const handleOpenSubstitution = (mealId: string, food: MealFoodReference) => {
    setSelectedFoodForSub({ mealId, food });
    const proposals = findSubstitutesForFood(food);
    setSubstitutionProposals(proposals);
  };

  const handleApplySubstitution = (proposal: SubstitutionProposal) => {
    if (!selectedFoodForSub) return;

    const newFoodRef: MealFoodReference = {
      foodId: proposal.targetFood.id,
      foodName: proposal.targetFood.name,
      category: proposal.targetFood.category,
      grams: proposal.suggestedGrams,
      servingsEquivalent: Number((proposal.suggestedGrams / proposal.targetFood.servingGrams).toFixed(1)),
      state: proposal.targetFood.state,
      calories: proposal.calculatedCalories,
      protein: proposal.calculatedProtein,
      carbs: proposal.calculatedCarbs,
      fats: proposal.calculatedFats,
      preparationNotes: `Sustitución aprobada por equivalencia SMAE (${proposal.targetFood.servingDescription})`,
    };

    substituteMealFood(activeDay, selectedFoodForSub.mealId, selectedFoodForSub.food.foodId, newFoodRef);
    setSelectedFoodForSub(null);
  };

  const handleOpenShoppingList = () => {
    if (nutritionPlan) {
      const list = generateWeeklyShoppingList(nutritionPlan);
      setShoppingList(list);
      setShowShoppingModal(true);
    }
  };

  return (
    <AssessmentGate featureName="tu Plan Nutricional Personalizado SMAE">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Bar */}
      <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-motive-red/15 text-motive-redBright border border-motive-red/30 text-xs font-bold uppercase tracking-wider">
            <Apple className="w-4 h-4" />
            <span>Sistema Mexicano de Alimentos Equivalentes (SMAE 5.ª Ed.)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
            Plan Semanal de Nutrición de Precisión
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Menú de 7 días ajustado a tu gasto energético total ({nutritionPlan?.methodology.calorieTarget || 2650} kcal). Todos los alimentos contemplan rendimientos de cocción y sustitución interactiva certificada.
          </p>
        </div>

        <button
          onClick={() => {
            if (isFree) {
              window.location.href = '/precios';
            } else {
              handleOpenShoppingList();
            }
          }}
          className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-motive-red to-motive-redDark text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-motive-red/30 hover:scale-[1.02] transition-transform"
        >
          {isFree ? <Lock className="w-4 h-4 text-amber-300" /> : <ShoppingCart className="w-4 h-4" />}
          <span>{isFree ? 'Lista de Compras (Plan Pro)' : 'Generar Lista de Compras Semanal'}</span>
        </button>
      </div>

      {/* Garantía Fisiológica & Desglose Matemático */}
      <PhysiologicalGuaranteeCard />

      {/* Selector de Días de la Semana */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {nutritionPlan?.weeklyDays.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => setActiveDay(day.dayNumber)}
            className={`flex-shrink-0 px-5 py-3 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all border ${
              activeDay === day.dayNumber
                ? 'bg-motive-red border-motive-redBright text-white shadow-lg shadow-motive-red/30'
                : 'bg-motive-surface border-motive-surfaceBorder text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <span>{day.dayName}</span>
              {day.dayNumber > 1 && isFree && (
                <Lock className="w-3 h-3 text-amber-400" />
              )}
            </div>
            <span className="block text-[10px] font-normal opacity-80 mt-0.5">{day.dailyTotals.calories} kcal</span>
          </button>
        ))}
      </div>

      {/* Resumen de Macros del Día Seleccionado o Paywall */}
      {activeDay > 1 && isFree ? (
        <SubscriptionGate
          requiredTier="pro"
          title={`Día ${activeDay} (${currentDayMenu?.dayName}): Exclusivo Plan Atleta Pro`}
          description="Tu Plan Básico incluye acceso completo al Día 1 para que conozcas la estructura. Para desbloquear los 7 días de menús con macros calculados al gramo y sustituciones SMAE, suscríbete a Atleta Pro."
          featureList={[
            'Menú estructurado de lunes a domingo sincronizado con tus días de entrenamiento',
            'Herramienta de sustitución inteligente de alimentos con equivalencia SMAE',
            'Generador automático de lista de compras para el supermercado',
            'Rendimientos de cocción calculados (peso crudo vs peso cocido)',
          ]}
        />
      ) : (
        <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-motive-surfaceBorder/60 pb-4">
          <div>
            <h3 className="text-lg font-display font-bold text-white uppercase">
              Totales Programados • {currentDayMenu?.dayName}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Verificación matemática contra objetivo: {nutritionPlan?.methodology.calorieTarget} kcal
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-bold">
            <span className="text-white"><strong className="text-motive-redBright">{currentDayMenu?.dailyTotals.calories}</strong> kcal</span>
            <span className="text-zinc-400">•</span>
            <span className="text-motive-redBright">{currentDayMenu?.dailyTotals.protein}g Proteína</span>
            <span className="text-zinc-400">•</span>
            <span className="text-cyan-400">{currentDayMenu?.dailyTotals.carbs}g Carbos</span>
            <span className="text-zinc-400">•</span>
            <span className="text-amber-400">{currentDayMenu?.dailyTotals.fats}g Grasas</span>
          </div>
        </div>

        {/* Detalle de Comidas del Día */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {currentDayMenu?.meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-motive-surfaceLight border border-motive-surfaceBorder rounded-2xl p-5 space-y-4 hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-motive-redBright uppercase tracking-wider block">
                      {meal.type.replace('_', ' ')}
                    </span>
                    <h4 className="text-base font-display font-bold text-white">{meal.name}</h4>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-zinc-400 font-semibold bg-motive-surface px-2.5 py-1 rounded-lg border border-motive-surfaceBorder">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{meal.suggestedTime}</span>
                  </div>
                </div>

                {/* Lista de Alimentos con botón de sustitución */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Ingredientes y Porciones</p>
                  <div className="divide-y divide-motive-surfaceBorder/40">
                    {meal.items.map((item, itIdx) => (
                      <div
                        key={itIdx}
                        className="py-2.5 flex items-center justify-between text-xs group"
                      >
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-semibold text-zinc-200">{item.foodName}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-motive-surface text-zinc-400 border border-motive-surfaceBorder">
                              {item.state}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            {item.grams} g • {item.calories} kcal • {item.protein}g P • {item.carbs}g C • {item.fats}g G
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenSubstitution(meal.id, item)}
                          className="px-2.5 py-1 rounded-lg bg-motive-surface border border-motive-surfaceBorder text-[11px] font-bold text-zinc-300 hover:text-white hover:border-motive-red transition-colors flex items-center space-x-1"
                          title="Sustituir por otro alimento equivalente del SMAE"
                        >
                          <RotateCw className="w-3 h-3 text-motive-redBright" />
                          <span>Sustituir</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pasos de Preparación Casera */}
                <div className="space-y-2 pt-2 border-t border-motive-surfaceBorder/60">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Preparación ({meal.prepTimeMinutes} min)</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-zinc-300">
                    {meal.recipePreparationSteps.map((step, sIdx) => (
                      <li key={sIdx} className="leading-relaxed">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Subtotal de la Comida */}
              <div className="pt-3 border-t border-motive-surfaceBorder flex items-center justify-between text-xs font-semibold text-zinc-400 mt-4">
                <span>Subtotal Comida:</span>
                <span className="text-white">{meal.totals.calories} kcal ({meal.totals.protein}g Proteína)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Modal Interactivo de Sustitución SMAE */}
      {selectedFoodForSub && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-motive-surfaceBorder pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-motive-redBright flex items-center space-x-1.5">
                  <RotateCw className="w-4 h-4" />
                  <span>Motor de Sustitución Nutricional Inteligente</span>
                </span>
                <h3 className="text-xl font-display font-black text-white uppercase mt-1">
                  Reemplazar: {selectedFoodForSub.food.foodName}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Porción original: {selectedFoodForSub.food.grams}g ({selectedFoodForSub.food.calories} kcal, {selectedFoodForSub.food.protein}g proteína)
                </p>
              </div>
              <button
                onClick={() => setSelectedFoodForSub(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-motive-surfaceLight"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-motive-surfaceLight rounded-xl border border-motive-surfaceBorder text-xs text-zinc-300 flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-motive-redBright flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                El algoritmo calcula automáticamente los gramos exactos del alimento sustituto para mantener la equivalencia dentro de un margen clínico seguro (±5% calorías y ±3g de proteína).
              </p>
            </div>

            {/* Lista de Propuestas de Sustitución */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Opciones del mismo grupo SMAE</p>
              {substitutionProposals.map((prop, idx) => (
                <div
                  key={idx}
                  className="bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-600 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white">{prop.targetFood.name}</span>
                      {prop.isNutritionallyEquivalent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-motive-emerald/15 text-motive-emerald border border-motive-emerald/30">
                          Equivalente
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">
                      Porción sugerida: <strong className="text-white">{prop.suggestedGrams} g</strong> ({prop.calculatedCalories} kcal | {prop.calculatedProtein}g P | {prop.calculatedCarbs}g C | {prop.calculatedFats}g G)
                    </p>
                    <p className="text-[11px] text-zinc-500">{prop.reason}</p>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                    <div className="text-right text-[11px]">
                      <span className={`font-bold block ${prop.deltaCalories >= 0 ? 'text-zinc-300' : 'text-zinc-400'}`}>
                        {prop.deltaCalories > 0 ? `+${prop.deltaCalories}` : prop.deltaCalories} kcal
                      </span>
                    </div>
                    <button
                      onClick={() => handleApplySubstitution(prop)}
                      className="px-4 py-2 rounded-xl bg-motive-red text-white text-xs font-bold uppercase tracking-wider hover:bg-motive-redDark transition-colors shadow-lg shadow-motive-red/20"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Modal de Lista de Compras Semanal */}
      {showShoppingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-motive-surfaceBorder pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-motive-redBright flex items-center space-x-1.5">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Consolidado Semanal SMAE</span>
                </span>
                <h3 className="text-xl font-display font-black text-white uppercase mt-1">
                  Lista de Compras (7 Días)
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Cantidades calculadas a partir de tus requerimientos exactos para evitar desperdicio y optimizar el gasto semanal.
                </p>
              </div>
              <button
                onClick={() => setShowShoppingModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-motive-surfaceLight"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shoppingList.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl p-3.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{item.foodName}</p>
                    <p className="text-[11px] text-zinc-400 capitalize">{item.category.replace(/_/g, ' ')}</p>
                  </div>
                  <span className="font-mono font-bold text-motive-redBright text-sm bg-motive-surface px-2.5 py-1 rounded-lg border border-motive-surfaceBorder">
                    {item.estimatedHouseholdMeasure}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-motive-surfaceBorder flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder text-xs font-bold text-white uppercase tracking-wider hover:bg-motive-surface hover:border-zinc-500"
              >
                Imprimir Lista
              </button>
            </div>

          </div>
        </div>
      )}

      </div>
    </AssessmentGate>
  );
}

import { UserAssessment, WorkoutPlan, NutritionPlan, UserProfile } from '@/types';
import { CARDIO_PROTOCOLS, calculateHeartRateZones } from '@/lib/data/cardioProtocols';
import { ABDOMINAL_ROUTINES } from '@/lib/data/abdominalRoutines';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: 'nutrition' | 'workout' | 'cardio' | 'abs' | 'supplements' | 'general';
  quickActions?: { label: string; prompt: string }[];
}

export function generateCoachResponse(
  userQuery: string,
  userProfile?: UserProfile | null,
  assessment?: UserAssessment | null,
  workoutPlan?: WorkoutPlan | null,
  nutritionPlan?: NutritionPlan | null
): ChatMessage {
  const query = userQuery.toLowerCase().trim();
  const userName = userProfile?.name?.split(' ')[0] || userProfile?.fullName?.split(' ')[0] || 'Atleta';
  const age = assessment?.anthropometry?.age || 26;
  const gender = assessment?.anthropometry?.gender || 'male';
  const targetKcal = nutritionPlan?.methodology?.calorieTarget || assessment ? 2143 : 2100;
  const pGrams = nutritionPlan?.methodology?.macroTargetGrams?.protein || 150;
  const cGrams = nutritionPlan?.methodology?.macroTargetGrams?.carbs || 230;
  const fGrams = nutritionPlan?.methodology?.macroTargetGrams?.fats || 65;
  const days = assessment?.sports?.daysAvailable || 6;
  const mealsCount = assessment?.diet?.preferredMealsPerDay || 5;

  const hrZones = calculateHeartRateZones(age);

  // =========================================================================
  // 1. INTENT: CARDIO MÁS EFICAZ PARA PERDER GRASA
  // =========================================================================
  if (
    query.includes('cardio') || 
    query.includes('perder grasa') || 
    query.includes('quemar grasa') || 
    query.includes('caminar') || 
    query.includes('correr') || 
    query.includes('zona 2') ||
    query.includes('inclinad') ||
    query.includes('hiit') ||
    query.includes('liss')
  ) {
    const liss = CARDIO_PROTOCOLS[0];
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      category: 'cardio',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hola ${userName}, como tu Coach MOTIVE te explico la fisiología real comprobada por la ciencia:

### 🏆 El Cardio #1 Más Eficaz: Caminata en Cinta Inclinada en Zona 2 (LISS Inclinado)

A diferencia de salir a correr o matarte en la elíptica, la **caminata inclinada a paso firme** es el estándar de oro por 4 razones científicas:

1. **Zona FatMax (Oxidación Pura de Grasa):** 
Al mantener tu pulso entre el **60% y 70% de tu Frecuencia Cardíaca Máxima** (${hrZones.zone2.min} a ${hrZones.zone2.max} latidos por minuto para tus ${age} años), tu cuerpo oxida directamente **ácidos grasos de reserva** en vez de devorar glucógeno muscular.

2. **Cero Impacto Articular y Cero Pérdida de Músculo:** 
Correr genera un impacto de 3 a 5 veces tu peso corporal en cada zancada. La caminata inclinada elimina el impacto articular y **no interfiere con la vía anabólica mTOR**. Tus marcas en sentadilla, prensa y banca seguirán subiendo.

3. **No Dispara el Hambre Voraz:** 
El cardio extremo dispara la grelina (hormona del apetito), haciendo que termines comiendo de más. La Zona 2 mantiene tu apetito bajo control.

---

### 📋 Tu Protocolo Exacto Prescrito:
* **Inclinación:** 10% a 12%.
* **Velocidad:** 4.5 a 5.2 km/h (marcha enérgica).
* **Duración:** 25 a 35 minutos.
* **Momento ideal:** Inmediatamente después de tu rutina de pesas o por la mañana.
* **⚠️ Regla de Oro:** ¡NO te sujetes de los pasamanos de la cinta! Dejar los brazos libres quema hasta un 25% más de calorías y mantiene tu postura erguida.
* **NEAT:** Complementa con 8,000 a 10,000 pasos diarios.`,
      quickActions: [
        { label: 'Ver Rutinas de Abdomen', prompt: '¿Qué rutina de abdomen debo hacer para marcar los cuadritos?' },
        { label: '¿Cómo calcular mis calorías?', prompt: '¿Cuántas calorías necesito para quemar grasa sin perder músculo?' },
        { label: '¿Funciona el HIIT?', prompt: '¿Es mejor el HIIT que el LISS para perder grasa?' },
      ]
    };
  }

  // =========================================================================
  // 2. INTENT: RUTINAS DE ABDOMEN & CORE
  // =========================================================================
  if (
    query.includes('abdomen') || 
    query.includes('abs') || 
    query.includes('abdominal') || 
    query.includes('cuadritos') || 
    query.includes('six pack') || 
    query.includes('cintura') ||
    query.includes('vacio') ||
    query.includes('vacuum') ||
    query.includes('core')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      category: 'abs',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Excelente pregunta, ${userName}. Para tener un abdomen marcado y rocoso hay que entender dos verdades fisiológicas:

> **Ley #1:** Los abdominales se revelan en la cocina mediante el déficit calórico (necesitas bajar al 10-12% de grasa en hombres y 18-20% en mujeres).  
> **Ley #2:** El grosor y relieve 3D de los "cuadritos" se construyen en el gimnasio con **sobrecarga mecánica progresiva**, no haciendo 500 abdominales ligeros.

---

### 💥 Tu Rutina de Hipertrofia Abdominal Recomendada (2-3 veces por semana):

1. **Cable Crunch en Polea Alta con Cuerda (Flexión Espinal Pesada):**
   * **Series:** 4 series de 10 a 12 repeticiones pesadas.
   * **Clave biomecánica:** De rodillas, flexiona la columna llevando los codos hacia las rodillas. Aprieta 1 segundo abajo y exhala todo el aire. No flexiones la cadera.

2. **Elevaciones de Piernas Colgado en Barra (Hanging Leg / Knee Raises):**
   * **Series:** 3 series de 12 a 15 repeticiones controladas.
   * **Clave biomecánica:** Lo que estimula el abdomen inferior no es subir los muslos, sino **enrollar la pelvis hacia el ombligo** (retroversión pélvica). Cero balanceo corporal.

3. **Rueda Abdominal (Ab Wheel Rollout) o Plancha RKC:**
   * **Series:** 3 series de 8 a 10 repeticiones.
   * **Clave biomecánica:** Anti-extensión lumbar. Mantén la pelvis en retroversión sin que se caiga la espalda baja.

---

### ⏳ Para Mantener la Cintura Estrecha:
* Haz **Vacío Abdominal (Stomach Vacuum)** en ayunas: 4 series sosteniendo 25 segundos sin aire. Fortalece el músculo transverso (tu faja biológica interna).`,
      quickActions: [
        { label: 'Cardio para definir abdomen', prompt: '¿Cuál es el mejor cardio para perder la grasa del abdomen bajo?' },
        { label: 'Alimentos recomendados', prompt: '¿Qué alimentos me ayudan a desinflamar y marcar abdomen?' },
        { label: '¿Hacer abdomen diario?', prompt: '¿Se debe entrenar el abdomen todos los días?' }
      ]
    };
  }

  // =========================================================================
  // 3. INTENT: NUTRICIÓN, CALORÍAS Y MACROS
  // =========================================================================
  if (
    query.includes('caloria') || 
    query.includes('proteina') || 
    query.includes('carbohidrato') || 
    query.includes('grasa') || 
    query.includes('dieta') || 
    query.includes('comida') ||
    query.includes('nutricion') ||
    query.includes('deficit') ||
    query.includes('superavit') ||
    query.includes('2143') ||
    query.includes('menu')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      category: 'nutrition',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Con gusto, ${userName}. Analizando tu perfil fisiológico actual en MOTIVE LAB:

### 📊 Tu Prescripción Nutricional de Precisión:
* **Calorías Objetivo Diarias:** **${targetKcal} kcal**
* **Proteína Magra:** **${pGrams}g** (~2.0g por kg de peso corporal para máxima síntesis proteica miofibrilar).
* **Carbohidratos Complejos:** **${cGrams}g** (recuperación de glucógeno muscular y rendimiento).
* **Grasas Saludables:** **${fGrams}g** (soporte hormonal, testosterona y absorción de vitaminas liposolubles A, D, E, K).
* **Distribución:** **${mealsCount} Tiempos de Comida** ajustados al gramo exacto.

---

### 🥞 ¿Recetas Fit que puedes disfrutar en tu plan?
* **Hot Cakes Fit Proteicos:** Avena en hojuelas molida, claras de huevo, canela y plátano con crema de cacahuate natural.
* **Filete de Tilapia al Limón o Mojo de Ajo:** Proteína blanca magra rica en aminoácidos esenciales, acompañada con arroz blanco al vapor y espinacas tiernas.
* **Rice Cakes Crujientes con Crema de Cacahuate y Whey:** El snack crujiente ideal pre-entreno para absorción rápida de energía limpia.
* **Fajitas de Res Magra al Comal:** Con tortillas nixtamalizadas tradicionales y frijoles negros de la olla.

---

### 💡 Regla de Oro MOTIVE LAB:
El Sistema Mexicano de Alimentos Equivalentes (SMAE) te permite intercambiar alimentos dentro del mismo grupo (ej. 1 tortilla de maíz = 1/2 taza de arroz al vapor = 1 papa mediana) manteniendo exactamente tus ${targetKcal} kcal.`,
      quickActions: [
        { label: '¿Cómo sustituir alimentos?', prompt: '¿Cómo puedo cambiar el pollo o el arroz por otro alimento equivalente?' },
        { label: '¿Qué tomar pre-entreno?', prompt: '¿Qué debo comer antes de ir a entrenar?' },
        { label: 'Ver rutina Push Pull Legs', prompt: '¿Cómo está organizada mi rutina de entrenamiento?' }
      ]
    };
  }

  // =========================================================================
  // 4. INTENT: ENTRENAMIENTO & RUTINA DE 6 DÍAS (PUSH / PULL / LEGS)
  // =========================================================================
  if (
    query.includes('rutina') || 
    query.includes('push') || 
    query.includes('pull') || 
    query.includes('leg') || 
    query.includes('entrenamiento') || 
    query.includes('pesas') || 
    query.includes('fuerza') || 
    query.includes('hipertrofia') ||
    query.includes('ejercicio') ||
    query.includes('press') ||
    query.includes('sentadilla') ||
    query.includes('peso muerto')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      category: 'workout',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Excelente, ${userName}. Tu estructura de entrenamiento está diseñada bajo los principios del ACSM y la ciencia neuromuscular moderna:

### 🏋️‍♂️ Tu División de Entrenamiento: ${days} Días (${days === 6 ? 'Push / Pull / Legs x 2 Frecuencia 2x' : 'Especialización de Rendimiento'})

${days === 6 ? `
1. **Día 1 - Push A (Fuerza):** Press banca plano barra, Press militar, Press inclinado mancuernas, Elevaciones laterales y Tríceps polea.
2. **Día 2 - Pull A (Fuerza):** Peso muerto convencional, Remo con barra pronado, Dominadas / Jalón al pecho y Curl de bíceps.
3. **Día 3 - Legs A (Cuádriceps & Sentadilla):** Sentadilla trasera con barra, Prensa 45°, Hip Thrust y Curl femoral.
4. **Día 4 - Push B (Hipertrofia):** Press inclinado mancuernas, Press plano pausa, Press militar, Elevaciones laterales bombeo y Tríceps copa.
5. **Día 5 - Pull B (Densidad Espalda):** Remo con barra 45°, Jalón neutro, Variante bisagra cadera y Curl de bíceps concentrado.
6. **Día 6 - Legs B (Cadena Posterior & Glúteo):** Hip Thrust pesado con contracción 1s, Prensa pies altos, Sentadilla controlada y Curl femoral altas reps.
7. **Día 7:** Descanso total y recuperación del SNC.
` : `
Tu rutina equilibra el volumen de series efectivas (10 a 20 series por grupo muscular a la semana) respetando un **RIR de 1 a 2** (dejando 1 o 2 repeticiones en reserva antes del fallo técnico).
`}

---

### 📈 La Regla de la Doble Progresión:
* Si tu rango es **6 a 8 reps**, no subas el peso hasta que seas capaz de completar **8 repeticiones perfectas en todas las series**.
* Cuando lo logres, sube de 1 a 2.5 kg por lado y vuelve a empezar en 6 repeticiones. Así garantizas hipertrofia real sin estancarte.`,
      quickActions: [
        { label: 'Rutina de Abdomen', prompt: '¿Cómo integro el abdomen en mi rutina Push Pull Legs?' },
        { label: 'Cardio post-pesas', prompt: '¿Hago el cardio antes o después de las pesas?' },
        { label: '¿Qué suplementos usar?', prompt: '¿Cuáles son los mejores suplementos para ganar músculo?' }
      ]
    };
  }

  // =========================================================================
  // 5. INTENT: SUPLEMENTACIÓN BASADA EN EVIDENCIA
  // =========================================================================
  if (
    query.includes('suplemento') || 
    query.includes('creatina') || 
    query.includes('whey') || 
    query.includes('proteina en polvo') || 
    query.includes('cafeina') || 
    query.includes('pre entreno') ||
    query.includes('bcaa')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      category: 'supplements',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `${userName}, en MOTIVE LAB nos basamos en la evidencia científica de la ISSN (Sociedad Internacional de Nutrición Deportiva). 

### 🥇 Suplementos con Evidencia Grado A (Realmente Funcionan):

1. **Creatina Monohidrato (Creapure o micronizada):**
   * **Dosis:** 3 a 5 gramos diarios todos los días (con o sin entrenamiento).
   * **Efecto:** Aumenta las reservas de fosfocreatina celular, incrementando la fuerza máxima entre un 5% y 15% y promoviendo la hidratación intracelular.
   * **Mito:** No produce caída de cabello ni daño renal en personas sanas.

2. **Proteína Whey Isolate (Aislada de Suero):**
   * **Dosis:** 1 scoop (25-30g de proteína de alto valor biológico).
   * **Efecto:** Practicidad pura. Ideal en tus snacks (como con los rice cakes) o post-entreno para estimular la vía mTOR con su alta concentración de leucina.

3. **Cafeína Anhidra / Café Negro:**
   * **Dosis:** 3 a 5 mg/kg consumidos 45 minutos antes de entrenar.
   * **Efecto:** Reduce la percepción del esfuerzo (RPE), aumenta la potencia neuromuscular y favorece la movilización de ácidos grasos.

---

### ❌ Suplementos que NO necesitas comprar:
* **BCAAs:** Si consumes suficiente proteína en tu dieta (tus ${pGrams}g), los BCAAs son un gasto innecesario; la proteína completa ya los contiene.
* **Quemadores de grasa milagro:** La mayoría son solo cafeína cara con ingredientes de relleno. El déficit calórico y el cardio en Zona 2 son 100 veces más efectivos.`,
      quickActions: [
        { label: 'Cómo tomar la creatina', prompt: '¿La creatina se toma antes o después de entrenar?' },
        { label: 'Cardio Zona 2', prompt: 'Explícame el cardio en cinta inclinada paso a paso' },
        { label: 'Mis macros de hoy', prompt: '¿Cuáles son mis calorías y macros asignados?' }
      ]
    };
  }

  // =========================================================================
  // 6. DEFAULT INTENT: ASISTENCIA PERSONALIZADA GENERAL
  // =========================================================================
  return {
    id: `bot-${Date.now()}`,
    sender: 'assistant',
    category: 'general',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: `¡Hola ${userName}! Soy tu **Coach Inteligente MOTIVE LAB**, especialista en fisiología del ejercicio, biomecánica y nutrición basada en el SMAE.

Tengo presente todo tu expediente actual:
* **Meta Calórica:** ${targetKcal} kcal diarias (${pGrams}g Proteína, ${cGrams}g Carbohidratos, ${fGrams}g Grasas).
* **Estructura Nutricional:** ${mealsCount} comidas al día con recetas variadas y equivalencias exactas.
* **Frecuencia de Entrenamiento:** ${days} días por semana (${days === 6 ? 'Push / Pull / Legs x 2' : 'Estructura personalizada'}).

¿En qué área deseas optimizar tus resultados hoy? Puedes preguntarme sobre:
1. **El cardio más eficaz para perder grasa** (Incline Treadmill LISS vs HIIT).
2. **Rutinas científicas de abdomen** para hipertrofia y cintura estrecha.
3. **Equivalencias y sustituciones de alimentos** en tu dieta.
4. **Técnica, sobrecarga progresiva y recuperación muscular**.`,
    quickActions: [
      { label: '🔥 El mejor cardio para quemar grasa', prompt: '¿Cuál es el mejor tipo de cardio para perder grasa sin perder músculo?' },
      { label: '🍫 Rutina de Abdomen Efectiva', prompt: '¿Qué rutina de abdomen me recomiendas para marcar los cuadritos?' },
      { label: '🥗 Mis calorías y recetas fit', prompt: 'Explícame mis calorías objetivo y recetas recomendadas' },
      { label: '🏋️‍♂️ Rutina Push Pull Legs', prompt: '¿Cómo funciona mi rutina de 6 días Push Pull Legs?' }
    ]
  };
}

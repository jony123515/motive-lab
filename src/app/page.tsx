import React from 'react';
import Link from 'next/link';
import { 
  Flame, 
  ShieldCheck, 
  Activity, 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  HeartPulse, 
  AlertCircle,
  Award
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-hero-glow">
        
        {/* Decorative background grid and blurs */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2315_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2315_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-motive-surface border border-motive-surfaceBorder shadow-lg">
            <span className="w-2 h-2 rounded-full bg-motive-redBright animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Prescripción Deportiva y Nutrición Basada en Evidencia
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white uppercase">
            DESARROLLA TU <span className="text-transparent bg-clip-text bg-gradient-to-r from-motive-redBright via-motive-red to-rose-400">MÁXIMO POTENCIAL</span> SIN COMPROMETER LA SALUD
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-zinc-300 font-normal leading-relaxed">
            MOTIVE LAB no es una calculadora genérica ni un recetario estático. Es un ecosistema clínico e integrado de evaluación profunda, periodización científica ACSM 2026 y planificación nutricional con alimentos accesibles en México (SMAE).
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/evaluacion"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-motive-red to-motive-redDark text-white font-display font-bold text-sm uppercase tracking-wider shadow-xl shadow-motive-red/30 hover:shadow-motive-red/50 hover:scale-[1.02] transition-all"
            >
              <span>Comenzar Evaluación Integral</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-motive-surface border border-motive-surfaceBorder text-zinc-200 font-display font-bold text-sm uppercase tracking-wider hover:bg-motive-surfaceLight hover:border-zinc-600 transition-all"
            >
              <span>Ver Dashboard Interactivo</span>
            </Link>
          </div>

          {/* Trust Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-motive-surfaceBorder/60 max-w-4xl mx-auto text-left">
            <div className="bg-motive-surface/60 p-4 rounded-xl border border-motive-surfaceBorder/60">
              <p className="text-2xl font-black font-display text-white">100%</p>
              <p className="text-xs text-zinc-400 mt-1 font-medium">Fórmulas Verificables (Mifflin & Katch)</p>
            </div>
            <div className="bg-motive-surface/60 p-4 rounded-xl border border-motive-surfaceBorder/60">
              <p className="text-2xl font-black font-display text-motive-redBright">SMAE 5.ª</p>
              <p className="text-xs text-zinc-400 mt-1 font-medium">Alimentos Mexicanos y Rendimientos</p>
            </div>
            <div className="bg-motive-surface/60 p-4 rounded-xl border border-motive-surfaceBorder/60">
              <p className="text-2xl font-black font-display text-motive-emerald">PAR-Q+</p>
              <p className="text-xs text-zinc-400 mt-1 font-medium">Triaje Clínico y Detección de Banderas Rojas</p>
            </div>
            <div className="bg-motive-surface/60 p-4 rounded-xl border border-motive-surfaceBorder/60">
              <p className="text-2xl font-black font-display text-white">ACSM 2026</p>
              <p className="text-xs text-zinc-400 mt-1 font-medium">Sobrecarga Progresiva y Control de RIR</p>
            </div>
          </div>

        </div>
      </section>

      {/* Pilares Científicos del Sistema */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-motive-redBright">Arquitectura Multidisciplinaria</p>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase">
            La Fusión Entre Fisiología, Nutrición y Algoritmos Clínicos
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Diseñado de raíz por especialistas en hipertrofia, dietistas clínicos deportivos y médicos del deporte para erradicar las pautas lesivas e insostenibles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-6 hover:border-motive-red/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-motive-red/10 border border-motive-red/30 flex items-center justify-center text-motive-redBright">
                <Apple className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white uppercase">Motor de Nutrición SMAE</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cálculo de TDEE sin doble conteo de actividad. Menús de 7 días ajustados a ingredientes económicos y comunes en México (tortillas, pollo, frijoles, huevos, nopales), con motor de sustitución por grupos de equivalentes.
              </p>
            </div>
            <div className="pt-6 border-t border-motive-surfaceBorder/60 mt-6 flex items-center text-xs text-zinc-300 font-semibold space-x-1">
              <CheckCircle2 className="w-4 h-4 text-motive-emerald mr-1" />
              <span>Diferenciación estricta de peso crudo vs cocido</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-6 hover:border-motive-red/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-motive-red/10 border border-motive-red/30 flex items-center justify-center text-motive-redBright">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white uppercase">Entrenamiento & Sobrecarga</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Periodización en mesociclos con diferenciación obligatoria entre series de aproximación y series efectivas. Algoritmo de doble progresión adaptado a RIR (Reps in Reserve) para hipertrofia y fuerza.
              </p>
            </div>
            <div className="pt-6 border-t border-motive-surfaceBorder/60 mt-6 flex items-center text-xs text-zinc-300 font-semibold space-x-1">
              <CheckCircle2 className="w-4 h-4 text-motive-emerald mr-1" />
              <span>Ajustes sensibles a dolores articulares o fatiga</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-6 hover:border-motive-red/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-motive-red/10 border border-motive-red/30 flex items-center justify-center text-motive-redBright">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white uppercase">Triaje Clínico & Seguridad</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Evaluación integral tipo PAR-Q+. Detección de síntomas cardiovasculares o antecedentes de riesgo que detienen automáticamente la prescripción no supervisada para requerir valoración médica.
              </p>
            </div>
            <div className="pt-6 border-t border-motive-surfaceBorder/60 mt-6 flex items-center text-xs text-zinc-300 font-semibold space-x-1">
              <CheckCircle2 className="w-4 h-4 text-motive-emerald mr-1" />
              <span>Prioridad absoluta a la salud sobre la estética</span>
            </div>
          </div>

        </div>
      </section>

      {/* Sección Institucional Ampliada */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-motive-surface/30 border-y border-motive-surfaceBorder">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-motive-red/10 border border-motive-red/30 text-motive-redBright text-xs font-bold uppercase">
              <Award className="w-4 h-4" />
              <span>Manifiesto MOTIVE LAB</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase">
              ¿Por Qué Construimos Esta Plataforma?
            </h2>
            <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
              <p>
                <strong>El problema de la industria:</strong> Durante años, el acondicionamiento físico se ha vendido a través de falsas promesas: dietas de 800 calorías incompatibles con el metabolismo basal, rutinas que ignoran el volumen máximo recuperable (MRV) y suplementos inútiles con etiquetados engañosos.
              </p>
              <p>
                <strong>Nuestra respuesta:</strong> MOTIVE LAB une a ingenieros de software, médicos del deporte, fisiólogos y nutriólogos clínicos para brindar una herramienta accesible que educa al atleta en la autorregulación, la técnica depurada y el balance nutricional sustentable.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/evaluacion"
                className="inline-flex items-center space-x-2 text-xs font-bold text-motive-redBright hover:text-white uppercase tracking-wider transition-colors"
              >
                <span>Conoce el cuestionario de evaluación integral</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-motive-surfaceBorder shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80"
              alt="Atleta entrenando fuerza en MOTIVE LAB"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-6">
              <div>
                <p className="text-white font-display font-bold text-lg uppercase">Ciencia y Rigor Aplicados al Esfuerzo Físico</p>
                <p className="text-xs text-zinc-300 mt-1">Cada serie, cada gramo y cada repetición tienen una justificación biológica.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

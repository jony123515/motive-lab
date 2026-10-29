'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  ShieldCheck, 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  HeartPulse, 
  Award,
  Star,
  Zap,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  MessageSquare,
  Users,
  Clock,
  Target
} from 'lucide-react';

export default function HomePage() {
  const [activePreviewTab, setActivePreviewTab] = useState<'dashboard' | 'nutrition' | 'training'>('dashboard');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="relative overflow-hidden selection:bg-motive-red selection:text-white">
      
      {/* =========================================================================
          HERO SECTION: SHOCK VISUAL Y GANCHO INMEDIATO
          ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-hero-glow">
        
        {/* Grilla visual futurista y destellos de fondo */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5091410_1px,transparent_1px),linear-gradient(to_bottom,#e5091410_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_10%,#000_80%,transparent_100%)] pointer-events-none" />
        
        {/* Glow esférico ambiental rojo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-motive-red/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          
          {/* Badge de Rigor Científico */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-motive-surface/90 border border-motive-red/40 shadow-xl shadow-motive-red/10 backdrop-blur-md animate-in fade-in duration-700">
            <span className="w-2.5 h-2.5 rounded-full bg-motive-redBright animate-pulse shadow-md shadow-motive-redBright" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-zinc-200">
              FISIOLOGÍA ACSM 2026 • NUTRICIÓN CLÍNICA SMAE 5.ª EDICIÓN
            </span>
          </div>

          {/* Headline Titánico y Provocador */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-white uppercase leading-[0.92]">
              DEJA DE ADIVINAR. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-motive-redBright via-motive-red to-orange-400 drop-shadow-[0_10px_20px_rgba(229,9,20,0.3)]">
                EMPIEZA A MUTAR.
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-display uppercase tracking-widest text-zinc-400 font-bold">
              El cuerpo que deseas no se construye con motivación pasajera. Se construye con ciencia implacable.
            </p>
          </div>

          {/* Subtítulo Persuasivo y Directo */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-zinc-300 font-normal leading-relaxed">
            Basta de dietas de 800 calorías que arruinan tu metabolismo y rutinas genéricas de gimnasio. Prescripción nutricional con alimentos reales de México y sobrecarga progresiva automatizada calculada para tu genética y tus horarios.
          </p>

          {/* Botones de Acción de Alta Conversión */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/evaluacion"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-motive-red to-motive-redDark text-white font-display font-black text-sm uppercase tracking-wider shadow-2xl shadow-motive-red/40 hover:shadow-motive-red/70 hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>Hacer Evaluación Gratuita (3 Min)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/precios"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-motive-surface border border-motive-surfaceBorder text-zinc-200 font-display font-bold text-sm uppercase tracking-wider hover:bg-motive-surfaceLight hover:border-zinc-500 hover:text-white transition-all shadow-lg"
            >
              <span>Ver Planes y Membresías</span>
            </Link>
          </div>

          {/* Social Proof & Rating Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs text-zinc-400">
            <div className="flex items-center space-x-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-white font-bold ml-1.5 text-xs">4.9 / 5.0</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              <span><strong>+1,400</strong> evaluaciones clínicas completadas</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              <span><strong>100%</strong> Sin dietas de hambre ni lesiones</span>
            </div>
          </div>

          {/* Métricas Científicas del Sistema */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-10 border-t border-motive-surfaceBorder/60 max-w-4xl mx-auto text-left">
            <div className="bg-motive-surface/70 p-4 rounded-2xl border border-motive-surfaceBorder backdrop-blur-sm">
              <p className="text-xl sm:text-2xl font-black font-display text-white">0% REBOTE</p>
              <p className="text-[11px] text-zinc-400 mt-1 font-medium leading-tight">Déficit metabólico seguro basado en Katch & Mifflin.</p>
            </div>
            <div className="bg-motive-surface/70 p-4 rounded-2xl border border-motive-surfaceBorder backdrop-blur-sm">
              <p className="text-xl sm:text-2xl font-black font-display text-motive-redBright">SMAE 5.ª ED.</p>
              <p className="text-[11px] text-zinc-400 mt-1 font-medium leading-tight">Tortillas, pollo, frijoles y huevos. Comida mexicana accesible.</p>
            </div>
            <div className="bg-motive-surface/70 p-4 rounded-2xl border border-motive-surfaceBorder backdrop-blur-sm">
              <p className="text-xl sm:text-2xl font-black font-display text-emerald-400">PAR-Q+</p>
              <p className="text-[11px] text-zinc-400 mt-1 font-medium leading-tight">Triaje médico estricto para descartar banderas rojas.</p>
            </div>
            <div className="bg-motive-surface/70 p-4 rounded-2xl border border-motive-surfaceBorder backdrop-blur-sm">
              <p className="text-xl sm:text-2xl font-black font-display text-cyan-400">RIR 1-3</p>
              <p className="text-[11px] text-zinc-400 mt-1 font-medium leading-tight">Sobrecarga progresiva: el sistema te dice cuándo subir peso.</p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SHOWCASE VISUAL: MIRA LA APLICACIÓN POR DENTRO (EL PRODUCTO)
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-motive-surfaceBorder/70">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-motive-red/10 border border-motive-red/30 text-motive-redBright text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Showcase Tecnológico</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            Una Plataforma Diseñada Para Ganar
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Nada de archivos PDF estáticos que se pierden en WhatsApp. Una aplicación web reactiva e intuitiva que te acompaña en la cocina y en la barra de entrenamiento.
          </p>

          {/* Selector de Pestañas del Showcase */}
          <div className="pt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setActivePreviewTab('dashboard')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all ${
                activePreviewTab === 'dashboard'
                  ? 'bg-motive-red text-white shadow-lg shadow-motive-red/30'
                  : 'bg-motive-surface border border-motive-surfaceBorder text-zinc-400 hover:text-white'
              }`}
            >
              1. Dashboard Clínico
            </button>
            <button
              onClick={() => setActivePreviewTab('nutrition')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all ${
                activePreviewTab === 'nutrition'
                  ? 'bg-motive-red text-white shadow-lg shadow-motive-red/30'
                  : 'bg-motive-surface border border-motive-surfaceBorder text-zinc-400 hover:text-white'
              }`}
            >
              2. Menú SMAE 7 Días
            </button>
            <button
              onClick={() => setActivePreviewTab('training')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all ${
                activePreviewTab === 'training'
                  ? 'bg-motive-red text-white shadow-lg shadow-motive-red/30'
                  : 'bg-motive-surface border border-motive-surfaceBorder text-zinc-400 hover:text-white'
              }`}
            >
              3. Sobrecarga Progresiva
            </button>
          </div>
        </div>

        {/* Mockup Interactivo de la App */}
        <div className="bg-[#0e0e12] border-2 border-motive-surfaceBorder rounded-3xl p-4 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Barra superior de ventana tipo app */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-motive-surfaceBorder">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-zinc-500 font-mono ml-2">motive-lab.app/dashboard</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              SISTEMA EN VIVO
            </span>
          </div>

          {/* VISTA 1: DASHBOARD */}
          {activePreviewTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-motive-surface border border-motive-surfaceBorder p-4 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Calorías Diarias Meta</span>
                  <p className="text-2xl font-black font-display text-white mt-1">2,650 <span className="text-xs text-motive-redBright">kcal</span></p>
                  <p className="text-[10px] text-zinc-500 mt-1">Mifflin-St Jeor + Factor Actividad</p>
                </div>
                <div className="bg-motive-surface border border-motive-surfaceBorder p-4 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Proteína Óptima (ISSN)</span>
                  <p className="text-2xl font-black font-display text-emerald-400 mt-1">165 <span className="text-xs text-zinc-400">g (2.1 g/kg)</span></p>
                  <p className="text-[10px] text-zinc-500 mt-1">Preservación muscular en déficit</p>
                </div>
                <div className="bg-motive-surface border border-motive-surfaceBorder p-4 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Volumen Semanal</span>
                  <p className="text-2xl font-black font-display text-cyan-400 mt-1">14 <span className="text-xs text-zinc-400">series efectivas</span></p>
                  <p className="text-[10px] text-zinc-500 mt-1">Por grupo muscular (RIR 1-2)</p>
                </div>
                <div className="bg-motive-surface border border-motive-surfaceBorder p-4 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Hidratación Dinámica</span>
                  <p className="text-2xl font-black font-display text-blue-400 mt-1">3.2 <span className="text-xs text-zinc-400">Litros</span></p>
                  <p className="text-[10px] text-zinc-500 mt-1">Ajustado a sudoración y clima</p>
                </div>
              </div>

              {/* Alerta de progresión simulada */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-300 uppercase">¡Sobrecarga Progresiva Alcanzada en Press de Banca!</h4>
                    <p className="text-[11px] text-emerald-200/80">Completaste 3 series de 8 reps con RIR 2. Recomendación calculada: <strong>+2.5 kg</strong> en tu próxima sesión.</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-black px-2.5 py-1 rounded-lg flex-shrink-0">
                  Algoritmo ACSM
                </span>
              </div>
            </div>
          )}

          {/* VISTA 2: NUTRICIÓN SMAE */}
          {activePreviewTab === 'nutrition' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 bg-motive-surface border border-motive-surfaceBorder rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-display font-bold text-white uppercase">Comida 2 • Comida Principal (SMAE 5.ª Ed.)</h4>
                  <p className="text-xs text-zinc-400">Fórmula de cocción: 150g pechuga cruda ➔ 115g peso cocido medido en plato.</p>
                </div>
                <span className="text-xs font-bold text-motive-redBright bg-motive-red/10 border border-motive-red/30 px-3 py-1 rounded-xl">
                  680 kcal • 48g Proteína • 72g Carbos
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-motive-surfaceLight border border-motive-surfaceBorder p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Pechuga de Pollo Asada</span>
                    <span className="text-[11px] text-zinc-400">150g crudo (3 porciones AOA bajo)</span>
                  </div>
                  <span className="text-emerald-400 font-bold">165 kcal</span>
                </div>
                <div className="bg-motive-surfaceLight border border-motive-surfaceBorder p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Arroz Integral al Vapor</span>
                    <span className="text-[11px] text-zinc-400">1 taza cocida (2 porciones Cereales)</span>
                  </div>
                  <span className="text-cyan-400 font-bold">140 kcal</span>
                </div>
                <div className="bg-motive-surfaceLight border border-motive-surfaceBorder p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Aguacate Hass & Nopales</span>
                    <span className="text-[11px] text-zinc-400">1/3 pieza + 1 taza asada</span>
                  </div>
                  <span className="text-amber-400 font-bold">95 kcal</span>
                </div>
              </div>

              <div className="p-3 bg-motive-surface border border-motive-surfaceBorder rounded-xl flex items-center justify-between text-xs text-zinc-400">
                <span>¿No tienes pechuga hoy? El botón de <strong>Sustitución Inteligente</strong> la cambia al instante por bistec magro, atún o huevo manteniendo los mismos macros.</span>
                <span className="text-white font-bold text-[11px] underline cursor-pointer ml-3 flex-shrink-0">Ver Sustituto</span>
              </div>
            </div>
          )}

          {/* VISTA 3: SOBRECARGA PROGRESIVA */}
          {activePreviewTab === 'training' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 bg-motive-surface border border-motive-surfaceBorder rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-display font-bold text-white uppercase">Sentadilla Trasera con Barra (Back Squat)</h4>
                  <p className="text-xs text-zinc-400">Patrón: Dominante de rodilla • RIR Objetivo: 2 (dejar 2 repeticiones antes del fallo)</p>
                </div>
                <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-xl">
                  Mesociclo 1 • Semana 2 de 6
                </span>
              </div>

              <div className="divide-y divide-motive-surfaceBorder/60 bg-motive-surfaceLight border border-motive-surfaceBorder rounded-2xl overflow-hidden text-xs">
                <div className="p-3 flex items-center justify-between text-zinc-400 font-bold uppercase text-[10px]">
                  <span>Serie / Tipo</span>
                  <span>Carga (kg)</span>
                  <span>Reps</span>
                  <span>RIR</span>
                  <span>Estado</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="font-medium text-zinc-400">Calentamiento</span>
                  <span className="text-white font-mono">Barra (20 kg)</span>
                  <span className="text-zinc-300">12</span>
                  <span className="text-zinc-500">-</span>
                  <span className="text-emerald-400 font-bold">✓ Completada</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="font-medium text-zinc-400">Aproximación</span>
                  <span className="text-white font-mono">60 kg</span>
                  <span className="text-zinc-300">6</span>
                  <span className="text-zinc-500">-</span>
                  <span className="text-emerald-400 font-bold">✓ Completada</span>
                </div>
                <div className="p-3 flex items-center justify-between bg-motive-red/10 border-l-4 border-motive-redBright">
                  <span className="font-bold text-white">Serie Efectiva 1</span>
                  <span className="text-white font-mono font-bold">100 kg</span>
                  <span className="text-white font-bold">8</span>
                  <span className="text-amber-400 font-bold">RIR 2</span>
                  <span className="text-emerald-400 font-bold">✓ Efectiva</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          TABLA COMPARATIVA FRONTAL: MOTIVE LAB VS OTROS
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-motive-redBright">La Verdad Sin Filtros</p>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            ¿Por Qué MOTIVE LAB Deja Atrás a Todo lo Demás?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Comparamos la ciencia y el costo real de entrenar con nosotros frente a las alternativas tradicionales.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-motive-surface border border-motive-surfaceBorder rounded-3xl overflow-hidden shadow-2xl">
            <thead>
              <tr className="border-b border-motive-surfaceBorder bg-motive-surfaceLight/80">
                <th className="p-5 text-xs font-display font-bold uppercase text-zinc-400">Criterio Fundamental</th>
                <th className="p-5 text-xs font-display font-bold uppercase text-zinc-400">Apps Extranjeras Genéricas</th>
                <th className="p-5 text-xs font-display font-bold uppercase text-zinc-400">El Instructor Típico de Gym</th>
                <th className="p-5 text-xs font-display font-black uppercase text-motive-redBright bg-motive-red/10 border-x border-motive-red/30">
                  MOTIVE LAB
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-motive-surfaceBorder/60 text-xs sm:text-sm">
              <tr>
                <td className="p-5 font-bold text-white">Alimentación y Cultura en México</td>
                <td className="p-5 text-zinc-400">❌ Salmón ahumado, kale, ingredientes en dólares</td>
                <td className="p-5 text-zinc-400">❌ Dieta militar: pollo y arroz sin sabor</td>
                <td className="p-5 font-bold text-emerald-400 bg-motive-red/5 border-x border-motive-red/20">
                  ✔ SMAE 5.ª Ed: Tortillas, frijoles, huevos, carne y nopales
                </td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Sobrecarga Progresiva Real</td>
                <td className="p-5 text-zinc-400">❌ Rutinas aleatorias sin cálculo de peso</td>
                <td className="p-5 text-zinc-400">❌ Te pone lo que se le ocurre ese día</td>
                <td className="p-5 font-bold text-emerald-400 bg-motive-red/5 border-x border-motive-red/20">
                  ✔ Algoritmo ACSM: Avisos matemáticos de cuándo subir carga (+kg)
                </td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Seguridad Médica y Salud</td>
                <td className="p-5 text-zinc-400">❌ Cero triaje ni evaluación de riesgos</td>
                <td className="p-5 text-zinc-400">❌ Te lesiona por falta de biomecánica</td>
                <td className="p-5 font-bold text-emerald-400 bg-motive-red/5 border-x border-motive-red/20">
                  ✔ Triaje PAR-Q+ clínico que frena planes lesivos
                </td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Revisión de Videos de Técnica</td>
                <td className="p-5 text-zinc-400">❌ No existe en apps estáticas</td>
                <td className="p-5 text-zinc-400">❌ Te mira 5 segundos mientras ve su celular</td>
                <td className="p-5 font-bold text-emerald-400 bg-motive-red/5 border-x border-motive-red/20">
                  ✔ Subida a la nube privada y revisión técnica semanal
                </td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Costo Mensual Aproximado</td>
                <td className="p-5 text-zinc-400">$350 - $600 MXN / mes</td>
                <td className="p-5 text-zinc-400">$1,500 - $3,500 MXN / mes</td>
                <td className="p-5 font-black text-white bg-motive-red/10 border-x border-motive-red/30">
                  Desde $249 MXN / mes (Todo Incluido)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================================
          PRUEBA SOCIAL & TRANSFORMACIONES REALES DE ATLETAS
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-motive-surfaceBorder/70">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-motive-redBright">Prueba Social & Resultados</p>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            Atletas Reales. Resultados Sin Mentiras.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Historias verídicas de personas que dejaron de improvisar y aplicaron ciencia a sus entrenamientos y nutrición.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Testimonio 1 */}
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl p-6 sm:p-8 space-y-5 hover:border-motive-red/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                “Llevaba 2 años estancado haciendo la dieta de pollo hervido de mi entrenador del gym. Con MOTIVE LAB como 5 tortillas al día, frijoles y carne asada. He bajado 7.4 kg de grasa y mis pesos en banca y sentadilla rompieron récord personal.”
              </p>
            </div>
            <div className="pt-4 border-t border-motive-surfaceBorder flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Carlos Mendoza"
                className="w-11 h-11 rounded-full object-cover border border-motive-surfaceBorder"
              />
              <div>
                <h4 className="text-sm font-bold text-white">Carlos Mendoza</h4>
                <p className="text-[11px] text-zinc-400">Ingeniero & Atleta Natural • Guadalajara, Jal.</p>
                <span className="text-[10px] font-bold text-emerald-400">Plan Atleta Pro (4 Meses)</span>
              </div>
            </div>
          </div>

          {/* Testimonio 2 */}
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl p-6 sm:p-8 space-y-5 hover:border-motive-red/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                “Como médico, siempre fui muy escéptica de las aplicaciones fitness porque prescriben barbaridades metabólicas. El triaje PAR-Q+ y la periodización de series efectivas de MOTIVE LAB están impecables. 100% recomendado para quien busque salud y fuerza real.”
              </p>
            </div>
            <div className="pt-4 border-t border-motive-surfaceBorder flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                alt="Dra. Sofía Ramos"
                className="w-11 h-11 rounded-full object-cover border border-motive-surfaceBorder"
              />
              <div>
                <h4 className="text-sm font-bold text-white">Dra. Sofía Ramos</h4>
                <p className="text-[11px] text-zinc-400">Médico General & Corredora • CDMX</p>
                <span className="text-[10px] font-bold text-emerald-400">Plan con Coach VIP (6 Meses)</span>
              </div>
            </div>
          </div>

          {/* Testimonio 3 */}
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl p-6 sm:p-8 space-y-5 hover:border-motive-red/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                “Nunca había pisado un gimnasio y me daba pánico lesionarme. La función de registrar series con RIR y la lista de compras del súper me salvaron la vida. En 90 días no solo cambié físicamente, sino que entiendo exactamente lo que hago.”
              </p>
            </div>
            <div className="pt-4 border-t border-motive-surfaceBorder flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="Diego Valenzuela"
                className="w-11 h-11 rounded-full object-cover border border-motive-surfaceBorder"
              />
              <div>
                <h4 className="text-sm font-bold text-white">Diego Valenzuela</h4>
                <p className="text-[11px] text-zinc-400">Diseñador Gráfico • Monterrey, N.L.</p>
                <span className="text-[10px] font-bold text-emerald-400">Plan Atleta Pro (3 Meses)</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          GARANTÍA DE CONFIANZA & CERO RIESGO
          ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-motive-surface via-motive-surfaceLight to-motive-surface border-2 border-emerald-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantía de Transparencia Total</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
              Cero Letras Chiquitas. Cancela Cuando Quieras en 1 Clic.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Sin contratos anuales forzosos ni llamadas interminables para darte de baja como en los gimnasios de cadena. Desde tu panel de facturación en Stripe puedes pausar o cancelar tu suscripción con un solo botón en cualquier momento.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-motive-surfaceBorder flex-shrink-0 text-center space-y-2">
            <Lock className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs font-bold text-white uppercase tracking-wider">Pagos Blindados con Stripe</p>
            <p className="text-[11px] text-zinc-400">Tarjetas Visa, Mastercard, AMEX y Apple Pay</p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          PREGUNTAS FRECUENTES (FAQ INTERACTIVO)
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-motive-surfaceBorder/70">
        <div className="text-center space-y-4 mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-motive-redBright">Resolvemos Tus Dudas</p>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-zinc-400 text-sm">
            Todo lo que necesitas saber antes de dar el primer paso con MOTIVE LAB.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: '¿Sirve si soy principiante y nunca he ido al gimnasio?',
              a: 'Totalmente. Durante la evaluación inicial seleccionas tu nivel de experiencia ("Principiante") y el sistema ajusta el volumen a series de adaptación, con RIR conservador y videos demostrativos paso a paso para que no te lesiones.',
            },
            {
              q: '¿Tengo que comprar alimentos caros o difíciles de conseguir en México?',
              a: 'No. El sistema está 100% basado en el Sistema Mexicano de Alimentos Equivalentes (SMAE). Tu menú se diseña con alimentos accesibles en cualquier supermercado o tianguis de México: pollo, huevos, tortillas de maíz, frijoles, arroz, nopales y aguacate.',
            },
            {
              q: '¿Puedo entrenar si no voy a un gimnasio y solo tengo mancuernas en casa?',
              a: 'Sí. En el cuestionario defines tu lugar de entrenamiento y tu equipo disponible (desde solo peso corporal o mancuernas, hasta gimnasio comercial completo). Los ejercicios generados se adaptarán estrictamente a tus herramientas.',
            },
            {
              q: '¿Cómo funciona el cobro y cómo cancelo si decido no continuar?',
              a: 'El cobro es mensual o anual a través de la pasarela segura de Stripe. No hay plazos forzosos. Puedes cancelar tu membresía en cualquier segundo desde tu panel de usuario con un solo clic y no se volverá a cobrar.',
            },
            {
              q: '¿Cuál es la diferencia entre el Plan Atleta Pro y el Plan con Coach?',
              a: 'El Plan Atleta Pro ($249 MXN) te da acceso a todos los algoritmos automatizados: menú de 7 días, sustituciones inteligentes, alertas de sobrecarga progresiva y reportes clínicos en PDF. El Plan con Coach ($999 MXN) añade acompañamiento humano: revisión semanal de tus videos de técnica por un Coach certificado y ajustes mensuales por un Nutriólogo Clínico.',
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-white hover:text-motive-redBright transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-motive-redBright flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-400 flex-shrink-0 ml-4" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-motive-surfaceBorder/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          CALL TO ACTION FINAL DE CIERRE Y URGENCIA
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-motive-red/10 to-transparent border-t border-motive-surfaceBorder">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-motive-red/15 border border-motive-red/40 text-motive-redBright flex items-center justify-center mx-auto shadow-2xl shadow-motive-red/30">
            <Flame className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tight">
            DENTRO DE 6 MESES <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-motive-redBright to-orange-400">
              DESEARÁS HABER EMPEZADO HOY.
            </span>
          </h2>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-300">
            Tu cuerpo responde a estímulos biológicos y matemáticos precisos, no a la suerte. Da el primer paso y descubre tus requerimientos exactos en 3 minutos.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/evaluacion"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-motive-red to-motive-redDark text-white font-display font-black text-base uppercase tracking-wider shadow-2xl shadow-motive-red/50 hover:scale-[1.04] transition-transform"
            >
              <span>Comenzar Mi Evaluación Gratuita</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold pt-2">
            Sin tarjeta de crédito requerida para la evaluación inicial
          </p>
        </div>
      </section>

    </div>
  );
}

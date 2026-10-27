import React from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, BookOpen, HeartPulse, Scale } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#08080A] border-t border-motive-surfaceBorder text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Misión */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-motive-red flex items-center justify-center text-white">
                <Flame className="w-5 h-5" />
              </div>
              <span className="font-display font-black text-lg text-white">MOTIVE <span className="text-motive-redBright">LAB</span></span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Plataforma biomecánica y clínica basada en evidencia. Desarrollamos personas fuertes, disciplinadas y saludables mediante metodologías reproducibles sin atajos peligrosos.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-motive-emerald" />
              <span>Apego a Estándares Médicos ACSM & SMAE</span>
            </div>
          </div>

          {/* Institucional: Quiénes somos y Nuestra Historia */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-motive-redBright" />
              <span>Institucional</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-white font-medium block">Quiénes Somos</span>
                <span className="text-zinc-400">Equipo interdisciplinario de médicos del deporte, nutriólogos clínicos, biomecánicos y desarrolladores.</span>
              </li>
              <li>
                <span className="text-white font-medium block">Nuestra Historia</span>
                <span className="text-zinc-400">Nacidos ante la proliferación de dietas milagro y rutinas lesivas en redes sociales, con el fin de democratizar la ciencia del ejercicio.</span>
              </li>
              <li>
                <span className="text-white font-medium block">Misión y Visión</span>
                <span className="text-zinc-400">Maximizar el potencial físico humano de forma sustentable, priorizando la longevidad y la salud funcional.</span>
              </li>
            </ul>
          </div>

          {/* Fundamentación Científica */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase flex items-center space-x-1.5">
              <HeartPulse className="w-4 h-4 text-motive-redBright" />
              <span>Evidencia Científica</span>
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-motive-redBright mt-1.5 flex-shrink-0"></span>
                <span><strong>ACSM (2026):</strong> Pautas de entrenamiento de fuerza y sobrecarga progresiva.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-motive-redBright mt-1.5 flex-shrink-0"></span>
                <span><strong>ISSN:</strong> Sincronización de nutrientes, dosis proteicas (1.6-2.2 g/kg) y suplementación grado A.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-motive-redBright mt-1.5 flex-shrink-0"></span>
                <span><strong>SMAE (5.ª Ed.):</strong> Sistema Mexicano de Alimentos Equivalentes y rendimiento de cocción.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-motive-redBright mt-1.5 flex-shrink-0"></span>
                <span><strong>OMS / PAR-Q+:</strong> Triaje clínico de seguridad y estratificación de riesgo cardiovascular.</span>
              </li>
            </ul>
          </div>

          {/* Marco Legal & Privacidad ARCO (México) */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase flex items-center space-x-1.5">
              <Scale className="w-4 h-4 text-motive-redBright" />
              <span>Privacidad & Legal</span>
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              En estricto cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (México)</strong>, tus datos antropométricos y de salud reciben tratamiento confidencial bajo consentimiento explícito.
            </p>
            <div className="pt-2 border-t border-motive-surfaceBorder flex flex-col space-y-1 text-[11px]">
              <span className="text-zinc-300 hover:text-white cursor-pointer">Ejercicio de Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</span>
              <span className="text-zinc-500">Aviso de Privacidad Integral v1.4 (México)</span>
            </div>
          </div>

        </div>

        {/* Disclaimer médico obligatorio */}
        <div className="mt-12 pt-6 border-t border-motive-surfaceBorder/60 text-[11px] text-zinc-500 leading-relaxed text-center sm:text-left">
          <p>
            <strong>Aviso Clínico de Responsabilidad:</strong> Las herramientas y cálculos provistos por MOTIVE LAB tienen fines educativos y de prescripción en población adulta asintomática. Si presentas dolor torácico, palpitaciones, lesiones previas o condiciones metabólicas no controladas, la plataforma detendrá la prescripción algorítmica y solicitará una valoración médica presencial.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-zinc-600">
            <p>© {new Date().getFullYear()} MOTIVE LAB Inc. Todos los derechos reservados.</p>
            <p className="mt-2 sm:mt-0">Diseñado con arquitectura modular Next.js & Supabase PostgreSQL.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}

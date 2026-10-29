'use client';

import React from 'react';
import Link from 'next/link';
import { useAppState } from '@/lib/store/appState';
import { Lock, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface SubscriptionGateProps {
  children?: React.ReactNode;
  requiredTier?: 'pro' | 'coach';
  title?: string;
  description?: string;
  featureList?: string[];
  blurContent?: boolean;
}

export function SubscriptionGate({
  children,
  requiredTier = 'pro',
  title,
  description,
  featureList,
  blurContent = false,
}: SubscriptionGateProps) {
  const { currentUser } = useAppState();

  const userTier = currentUser?.subscriptionTier || 'free';
  const isCoach = currentUser?.role === 'coach' || currentUser?.role === 'nutritionist' || currentUser?.role === 'admin';

  // Coaches, nutriólogos y administradores tienen bypass de prueba
  if (isCoach) {
    return <>{children}</>;
  }

  // Comprobar si el usuario cumple con el nivel requerido
  const hasAccess =
    userTier === 'coach' ||
    (requiredTier === 'pro' && userTier === 'pro');

  if (hasAccess) {
    return <>{children}</>;
  }

  const defaultTitle =
    requiredTier === 'coach'
      ? 'Exclusivo del Plan con Coach & Nutriólogo VIP'
      : 'Desbloquea esta función con el Plan Atleta Pro';

  const defaultDescription =
    requiredTier === 'coach'
      ? 'Esta funcionalidad incluye acompañamiento 1 a 1, revisión biomecánica de videos y ajustes nutricionales personalizados.'
      : 'Accede al sistema completo de nutrición SMAE de 7 días, sustituciones inteligentes de alimentos, motor de sobrecarga progresiva y reportes clínicos en PDF.';

  const defaultFeatures =
    requiredTier === 'coach'
      ? [
          'Revisión semanal de videos de técnica por un Coach certificado',
          'Ajustes de dieta mensuales por Nutriólogo Deportivo',
          'Canal directo de mensajes y feedback continuo',
        ]
      : [
          'Menú completo de 7 días adaptado a tus macros y requerimientos',
          'Herramienta de sustitución inteligente de alimentos SMAE',
          'Generador automático de lista de compras para el supermercado',
          'Alertas biomecánicas de Sobrecarga Progresiva (+peso)',
          'Descarga de reportes clínicos e imprimibles en PDF',
        ];

  return (
    <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-b from-motive-surface via-motive-surfaceLight to-[#0c0c10] p-6 sm:p-10 shadow-2xl">
      {/* Si se activa blurContent, muestra el contenido desenfocado de fondo */}
      {blurContent && (
        <div className="absolute inset-0 pointer-events-none select-none opacity-20 filter blur-md overflow-hidden">
          {children}
        </div>
      )}

      <div className="relative z-10 max-w-xl mx-auto text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Membresía Requerida: {requiredTier === 'coach' ? 'Plan Coach VIP' : 'Atleta Pro'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
            {title || defaultTitle}
          </h3>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {description || defaultDescription}
          </p>
        </div>

        <div className="bg-motive-surface/80 border border-motive-surfaceBorder rounded-2xl p-4 text-left space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
            Beneficios incluidos en tu membresía:
          </p>
          {(featureList || defaultFeatures).map((feat, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs text-zinc-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/precios"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-motive-red to-motive-redDark text-white text-xs font-display font-black uppercase tracking-wider shadow-lg shadow-motive-red/30 hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2"
          >
            <span>Activar Membresía {requiredTier === 'coach' ? 'Coach VIP' : 'Pro'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-motive-surface border border-motive-surfaceBorder text-zinc-400 hover:text-white text-xs font-bold transition-colors"
          >
            Continuar en Plan Básico
          </Link>
        </div>
      </div>
    </div>
  );
}

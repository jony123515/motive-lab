'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppState } from '@/lib/store/appState';
import { SUBSCRIPTION_PLANS, PlanConfig } from '@/lib/stripe';
import { 
  Check, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight,
  CreditCard,
  Lock,
  Zap
} from 'lucide-react';

export default function PricingPage() {
  const { currentUser } = useAppState();

  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const handleSubscribe = async (plan: PlanConfig) => {
    if (plan.id === 'free') {
      window.location.href = '/registro';
      return;
    }

    setLoadingPlanId(plan.id);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          billingInterval,
          userId: currentUser?.id,
          userEmail: currentUser?.email,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'No se pudo iniciar el proceso de suscripción.');
      }
    } catch (err) {
      console.error('Error al conectar con la pasarela de pagos:', err);
      alert('Error de conexión con Stripe. Intenta de nuevo.');
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-motive-red/10 border border-motive-red/30 text-motive-redBright text-xs font-bold uppercase tracking-wider">
          <Zap className="w-4 h-4" />
          <span>Inversión en tu Salud & Rendimiento</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
          Elige el Plan que Transformará tu Físico
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Sin dietas milagro ni programas genéricos. Prescripción nutricional SMAE y sobrecarga progresiva adaptada a tu cuerpo y horario.
        </p>

        {/* Toggle Mensual / Anual */}
        <div className="pt-6 flex items-center justify-center">
          <div className="bg-motive-surface border border-motive-surfaceBorder p-1.5 rounded-2xl inline-flex items-center space-x-2">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                billingInterval === 'monthly'
                  ? 'bg-motive-surfaceLight text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Pago Mensual
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                billingInterval === 'yearly'
                  ? 'bg-motive-red text-white shadow-lg shadow-motive-red/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Pago Anual</span>
              <span className="text-[10px] bg-white text-motive-red px-1.5 py-0.2 rounded-full font-black uppercase">
                Ahorra 25%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Tarjetas de Precios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isPro = plan.id === 'pro';
          const price = billingInterval === 'yearly' ? plan.priceMxnYearly : plan.priceMxnMonthly;
          const monthlyEquivalent = billingInterval === 'yearly' && plan.priceMxnYearly > 0
            ? Math.round(plan.priceMxnYearly / 12)
            : price;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                isPro
                  ? 'bg-gradient-to-b from-motive-surface to-motive-surfaceLight border-2 border-motive-red shadow-2xl shadow-motive-red/20 scale-105 z-10'
                  : 'bg-motive-surface border border-motive-surfaceBorder hover:border-zinc-700'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-motive-red to-motive-redDark text-white shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-display font-black text-white uppercase">{plan.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 min-h-[32px]">{plan.description}</p>
                </div>

                {/* Precio */}
                <div className="border-y border-motive-surfaceBorder/60 py-4">
                  {plan.priceMxnMonthly === 0 ? (
                    <div className="flex items-baseline space-x-1">
                      <span className="text-4xl font-display font-black text-white">Gratis</span>
                      <span className="text-xs text-zinc-500 font-semibold">para siempre</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-sm font-bold text-zinc-400">$</span>
                        <span className="text-4xl font-display font-black text-white font-display">
                          {monthlyEquivalent}
                        </span>
                        <span className="text-xs text-zinc-400 font-semibold">MXN / mes</span>
                      </div>
                      {billingInterval === 'yearly' && (
                        <p className="text-[11px] text-motive-emerald mt-1 font-semibold">
                          Facturado anualmente: ${price} MXN (2 meses gratis)
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Lista de Funcionalidades */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Incluye:</p>
                  <ul className="space-y-2.5 text-xs text-zinc-300">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-2.5">
                        <Check className="w-4 h-4 text-motive-redBright flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Botón de Acción */}
              <div className="pt-8">
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlanId === plan.id}
                  className={`w-full py-3.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg ${
                    isPro
                      ? 'bg-gradient-to-r from-motive-red to-motive-redDark text-white shadow-motive-red/30 hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-motive-surfaceLight border border-motive-surfaceBorder text-zinc-200 hover:text-white hover:border-zinc-500'
                  }`}
                >
                  <span>
                    {loadingPlanId === plan.id
                      ? 'Conectando con Stripe...'
                      : plan.priceMxnMonthly === 0
                      ? 'Comenzar Gratis'
                      : `Elegir ${plan.name}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Garantía y Seguridad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6 text-center text-xs text-zinc-400">
        <div className="p-4 bg-motive-surface rounded-2xl border border-motive-surfaceBorder/60 space-y-2">
          <ShieldCheck className="w-6 h-6 text-motive-emerald mx-auto" />
          <p className="font-bold text-white uppercase">Cancelación Flexible</p>
          <p className="text-[11px]">Cancela tu suscripción en cualquier momento con un solo clic desde tu perfil.</p>
        </div>

        <div className="p-4 bg-motive-surface rounded-2xl border border-motive-surfaceBorder/60 space-y-2">
          <CreditCard className="w-6 h-6 text-cyan-400 mx-auto" />
          <p className="font-bold text-white uppercase">Pagos Cifrados con Stripe</p>
          <p className="text-[11px]">Aceptamos tarjetas mexicanas e internacionales Visa, Mastercard y American Express.</p>
        </div>

        <div className="p-4 bg-motive-surface rounded-2xl border border-motive-surfaceBorder/60 space-y-2">
          <Lock className="w-6 h-6 text-motive-redBright mx-auto" />
          <p className="font-bold text-white uppercase">Protección de Datos</p>
          <p className="text-[11px]">Cumplimiento estricto con la Ley de Datos Personales en Posesión de Particulares (LFPDPPP).</p>
        </div>
      </div>

      {/* Preguntas Frecuentes (FAQ) */}
      <div className="max-w-3xl mx-auto space-y-6 pt-8 border-t border-motive-surfaceBorder/60">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-display font-black text-white uppercase">Preguntas Frecuentes</h3>
          <p className="text-xs text-zinc-400">Todo lo que necesitas saber sobre los planes y pagos de MOTIVE LAB</p>
        </div>

        <div className="space-y-4 text-xs">
          {[
            {
              q: '¿Cómo funciona el cobro de la suscripción?',
              a: 'Se realiza mediante Stripe, la pasarela de pagos más segura del mundo. Puedes pagar con cualquier tarjeta de débito o crédito en moneda nacional (MXN). Se renueva automáticamente mes con mes o año con año.',
            },
            {
              q: '¿Puedo cambiar de plan o cancelar cuando quiera?',
              a: 'Sí, totalmente. No hay plazos forzosos. Si cancelas, mantendrás acceso a todas tus funciones Pro hasta el final de tu ciclo de facturación actual.',
            },
            {
              q: '¿Por qué no es una calculadora de calorías común?',
              a: 'A diferencia de las apps comerciales que usan fórmulas desactualizadas y alimentos genéricos de EE.UU., MOTIVE LAB utiliza el Sistema Mexicano de Alimentos Equivalentes (SMAE 5.ª Ed.), distingue rendimientos de cocción (crudo vs cocido) y autorregula tus series con RIR.',
            },
            {
              q: '¿Qué incluye la Asesoría VIP con Coach?',
              a: 'Incluye revisión semanal de tus videos de levantamientos por un entrenador certificado (CSCS), ajustes mensuales a tus macronutrientes por un nutriólogo deportivo y resolución de dudas técnicas.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-5 space-y-2">
              <p className="font-bold text-white text-sm flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-motive-redBright flex-shrink-0" />
                <span>{faq.q}</span>
              </p>
              <p className="text-zinc-400 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

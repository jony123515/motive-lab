'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Flame, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RecuperarPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });

        if (error) throw new Error(error.message);
      }
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al enviar el correo de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="max-w-md w-full space-y-8 bg-motive-surface border border-motive-surfaceBorder rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-motive-red to-motive-redDark flex items-center justify-center mx-auto shadow-lg shadow-motive-red/30">
            <Flame className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">
              Recuperar Contraseña
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Ingresa el correo asociado a tu cuenta para recibir un enlace de restablecimiento.
            </p>
          </div>
        </div>

        {success ? (
          <div className="space-y-6 text-center">
            <div className="p-4 bg-motive-emerald/15 border border-motive-emerald/30 rounded-2xl text-xs text-emerald-300 flex flex-col items-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-motive-emerald" />
              <p className="font-semibold text-white">¡Enlace Enviado!</p>
              <p className="text-zinc-300">
                Hemos enviado un correo con instrucciones para restablecer tu contraseña. Revisa también tu carpeta de spam.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center space-x-2 text-xs font-bold text-motive-redBright hover:text-white uppercase transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Regresar al Inicio de Sesión</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <p>{errorMsg}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Correo Electrónico Registrado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.correo@ejemplo.com"
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-motive-red transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-motive-red to-motive-redDark text-white text-xs font-display font-bold uppercase tracking-wider shadow-lg shadow-motive-red/30 hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a Iniciar Sesión</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

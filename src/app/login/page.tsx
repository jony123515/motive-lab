'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAppState } from '@/lib/store/appState';
import { Flame, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Info } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUserRole } = useAppState();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        // Consultar el rol del usuario en profiles
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profile?.role) {
            setCurrentUserRole(profile.role);
          }
        }

        router.push('/dashboard');
      } else {
        // Modo Demo local sin Supabase configurado todavía
        setTimeout(() => {
          router.push('/dashboard');
        }, 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="max-w-md w-full space-y-8 bg-motive-surface border border-motive-surfaceBorder rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow de acento */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-motive-red/10 rounded-full blur-3xl pointer-events-none" />

        {/* Cabecera */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-motive-red to-motive-redDark flex items-center justify-center mx-auto shadow-lg shadow-motive-red/30">
            <Flame className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">
              Iniciar Sesión
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Accede a tu expediente y prescripción en <strong className="text-white">MOTIVE LAB</strong>
            </p>
          </div>
        </div>

        {/* Alerta de Modo de Conexión */}
        {!isSupabaseConfigured && (
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-cyan-300 flex items-start space-x-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-400" />
            <p className="leading-relaxed">
              <strong>Modo Demo Activo:</strong> Puedes iniciar sesión con cualquier correo o colocar tus claves en <code className="text-white">.env.local</code> para activar la autenticación en la nube.
            </p>
          </div>
        )}

        {/* Error si falla el login */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Correo Electrónico
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Contraseña
              </label>
              <Link
                href="/recuperar"
                className="text-[11px] text-motive-redBright hover:text-white transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-motive-red transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-motive-red to-motive-redDark text-white text-xs font-display font-bold uppercase tracking-wider shadow-lg shadow-motive-red/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Verificando...' : 'Entrar a la Plataforma'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer y Enlace a Registro */}
        <div className="pt-4 border-t border-motive-surfaceBorder/60 text-center space-y-3">
          <p className="text-xs text-zinc-400">
            ¿Aún no tienes una cuenta?{' '}
            <Link
              href="/registro"
              className="text-motive-redBright font-bold hover:text-white transition-colors ml-1"
            >
              Regístrate aquí
            </Link>
          </p>

          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-motive-emerald" />
            <span>Conexión cifrada con protección de datos LFPDPPP</span>
          </div>
        </div>

      </div>
    </div>
  );
}

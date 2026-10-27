'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { UserRole } from '@/types';
import { 
  Flame, 
  Lock, 
  Mail, 
  User, 
  Calendar, 
  Globe, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2,
  Info
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    birthDate: '1998-05-15',
    country: 'México',
    timezone: 'America/Mexico_City',
    role: 'client' as UserRole,
    acceptTerms: false,
    consentSensitiveHealthData: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.acceptTerms) {
      setErrorMsg('Debes aceptar los Términos de Servicio y el Aviso de Privacidad.');
      return;
    }

    if (!formData.consentSensitiveHealthData) {
      setErrorMsg('Es indispensable otorgar tu consentimiento para el tratamiento de datos de salud física.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              birth_date: formData.birthDate,
              role: formData.role,
              country: formData.country,
              timezone: formData.timezone,
            },
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        // Si Supabase requiere verificación de correo
        if (data.user && !data.session) {
          setSuccessMsg(
            '¡Registro exitoso! Hemos enviado un enlace de confirmación a tu correo electrónico. Por favor verifícalo para acceder.'
          );
        } else {
          // Sesión iniciada automáticamente
          router.push('/evaluacion');
        }
      } else {
        // Modo local
        setSuccessMsg('Registro simulado con éxito. Redirigiendo a la evaluación integral...');
        setTimeout(() => {
          router.push('/evaluacion');
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="max-w-xl w-full space-y-8 bg-motive-surface border border-motive-surfaceBorder rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow de acento */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-motive-red/10 rounded-full blur-3xl pointer-events-none" />

        {/* Cabecera */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-motive-red to-motive-redDark flex items-center justify-center mx-auto shadow-lg shadow-motive-red/30">
            <Flame className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">
              Crear Cuenta en MOTIVE LAB
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Únete al ecosistema de fisiología, nutrición SMAE y alto rendimiento.
            </p>
          </div>
        </div>

        {/* Mensaje de éxito si se registró */}
        {successMsg && (
          <div className="p-4 bg-motive-emerald/15 border border-motive-emerald/40 rounded-2xl text-xs text-emerald-300 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-motive-emerald" />
            <p className="leading-relaxed font-semibold">{successMsg}</p>
          </div>
        )}

        {/* Mensaje de error */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Nombre y Correo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Tu nombre y apellido"
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-motive-red transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu.correo@ejemplo.com"
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-motive-red transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Contraseña y Fecha de Nacimiento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Contraseña Segura
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-motive-red transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Fecha de Nacimiento
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-motive-red transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Rol y País */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Rol en la Plataforma
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full bg-motive-surfaceLight border border-motive-surfaceBorder rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-motive-red transition-colors"
              >
                <option value="client">Cliente / Atleta (Prescripción Personal)</option>
                <option value="coach">Entrenador (Coach de Fuerza)</option>
                <option value="nutritionist">Nutriólogo Deportivo Clínico</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                País y Zona Horaria
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={`${formData.country} (GMT-6)`}
                  disabled
                  className="w-full bg-motive-surfaceLight/50 border border-motive-surfaceBorder rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-zinc-400"
                />
              </div>
            </div>
          </div>

          {/* Consentimientos Legales (LFPDPPP México & ARCO) */}
          <div className="pt-2 space-y-3 bg-motive-surfaceLight/60 p-4 rounded-2xl border border-motive-surfaceBorder">
            <label className="flex items-start space-x-3 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-0.5 rounded border-motive-surfaceBorder text-motive-red focus:ring-0"
              />
              <span>
                Acepto los <strong className="text-white">Términos y Condiciones</strong> y el <strong className="text-white">Aviso de Privacidad Integral</strong> de MOTIVE LAB.
              </span>
            </label>

            <label className="flex items-start space-x-3 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consentSensitiveHealthData}
                onChange={(e) => setFormData({ ...formData, consentSensitiveHealthData: e.target.checked })}
                className="mt-0.5 rounded border-motive-surfaceBorder text-motive-red focus:ring-0"
              />
              <span>
                <strong className="text-motive-redBright">Consentimiento Separado para Datos de Salud:</strong> Autorizo el tratamiento confidencial de mis datos antropométricos y de salud física bajo los estándares del INAI y la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-motive-red to-motive-redDark text-white text-xs font-display font-bold uppercase tracking-wider shadow-lg shadow-motive-red/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Creando Expediente...' : 'Crear Mi Cuenta y Comenzar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer y Enlace a Login */}
        <div className="pt-4 border-t border-motive-surfaceBorder/60 text-center space-y-2">
          <p className="text-xs text-zinc-400">
            ¿Ya tienes una cuenta registrada?{' '}
            <Link
              href="/login"
              className="text-motive-redBright font-bold hover:text-white transition-colors ml-1"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

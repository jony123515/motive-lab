'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/lib/store/appState';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { UserRole } from '@/types';
import { 
  Flame, 
  Dumbbell, 
  Apple, 
  ClipboardCheck, 
  Droplets, 
  FileText, 
  UserCheck, 
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Sparkles,
  ShieldCheck,
  Lock,
  Smartphone,
  Download
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, setCurrentUserRole, setSubscriptionTier, safetyTriage, hasCompletedAssessment } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [pwaModalOpen, setPwaModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
      setPwaModalOpen(false);
    } else {
      setPwaModalOpen(true);
    }
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    window.location.href = '/login';
  };

  const navLinks = [
    { href: '/', label: 'Inicio', icon: Flame },
    { href: '/dashboard', label: 'Dashboard', icon: Flame },
    { href: '/evaluacion', label: 'Evaluación', icon: ClipboardCheck },
    { href: '/nutricion', label: 'Nutrición', icon: Apple },
    { href: '/entrenamiento', label: 'Entrenamiento', icon: Dumbbell },
    { href: '/recuperacion', label: 'Hidratación', icon: Droplets },
    { href: '/reportes', label: 'Reporte', icon: FileText },
    { href: '/precios', label: 'Planes Pro', icon: Sparkles },
  ];

  if (currentUser.role === 'admin') {
    navLinks.push({ href: '/admin', label: 'Admin', icon: ShieldCheck });
    navLinks.push({ href: '/coach', label: 'Coach', icon: UserCheck });
  } else if (currentUser.role === 'coach' || currentUser.role === 'nutritionist') {
    navLinks.push({ href: '/coach', label: 'Coach', icon: UserCheck });
  }

  const handleRoleChange = (role: UserRole) => {
    setCurrentUserRole(role);
    setRoleDropdownOpen(false);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'client': return 'Cliente / Atleta';
      case 'coach': return 'Entrenador (Coach)';
      case 'nutritionist': return 'Nutriólogo Deportivo';
      case 'admin': return 'Administrador';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0C]/90 backdrop-blur-md border-b border-motive-surfaceBorder w-full">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between gap-2 h-16">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-motive-red to-motive-redDark flex items-center justify-center shadow-lg shadow-motive-red/30 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-display font-extrabold text-lg tracking-wider text-white">MOTIVE</span>
                <span className="font-display font-black text-lg tracking-wider text-motive-redBright">LAB</span>
              </div>
              <p className="text-[9px] text-motive-gray-400 uppercase tracking-widest font-semibold leading-none">Science & Strength</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-1 min-w-0 justify-center overflow-x-auto no-scrollbar py-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              const isGated = !hasCompletedAssessment && (link.href === '/nutricion' || link.href === '/entrenamiento');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-2 xl:px-2.5 py-1.5 rounded-lg text-[11px] xl:text-xs font-semibold tracking-wide transition-all whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-motive-red/10 text-motive-redBright border border-motive-red/30'
                      : 'text-zinc-300 hover:text-white hover:bg-motive-surface'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-motive-redBright' : 'text-zinc-400'}`} />
                  <span>{link.label}</span>
                  {isGated && (
                    <span title="Requiere diagnóstico">
                      <Lock className="w-3 h-3 text-zinc-500" />
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Role Switcher & User Profile */}
          <div className="hidden sm:flex items-center gap-1.5 xl:gap-2 flex-shrink-0">
            {safetyTriage && !safetyTriage.canProceedWithAutomaticPlan && (
              <span className="hidden xl:inline-flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse whitespace-nowrap">
                <ShieldAlert className="w-3 h-3" />
                <span>Revisión Médica</span>
              </span>
            )}

            {/* Acceso Administrador o Badge de Membresía */}
            {currentUser.role === 'admin' ? (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-motive-red to-motive-redDark border border-motive-redBright/50 text-white font-display font-black text-[11px] uppercase tracking-wider shadow-lg shadow-motive-red/30 hover:scale-105 transition-transform whitespace-nowrap"
                  title="Consola de Control del Administrador"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-white flex-shrink-0" />
                  <span>Admin</span>
                  <ChevronDown className="w-3 h-3 text-zinc-300 flex-shrink-0" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-motive-surfaceLight border border-motive-surfaceBorder rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3.5 py-1.5 border-b border-motive-surfaceBorder/60 flex items-center justify-between">
                      <p className="text-[11px] font-bold text-white uppercase tracking-wider">Consola Admin</p>
                      <Link
                        href="/admin"
                        onClick={() => setRoleDropdownOpen(false)}
                        className="text-[10px] font-bold text-motive-redBright hover:underline"
                      >
                        Abrir Panel ➔
                      </Link>
                    </div>

                    <div className="px-3.5 py-1.5 border-b border-motive-surfaceBorder/60">
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Previsualizar Rol</p>
                    </div>
                    {(['admin', 'client', 'coach', 'nutritionist'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => handleRoleChange(r)}
                        className={`w-full text-left px-3.5 py-1.5 text-xs font-medium transition-colors flex items-center justify-between ${
                          currentUser.role === r
                            ? 'bg-motive-red/10 text-motive-redBright font-bold'
                            : 'text-zinc-300 hover:bg-motive-surface hover:text-white'
                        }`}
                      >
                        <span>{getRoleLabel(r)}</span>
                        {currentUser.role === r && <span className="w-1.5 h-1.5 rounded-full bg-motive-redBright"></span>}
                      </button>
                    ))}

                    <div className="px-3.5 py-1.5 border-b border-t border-motive-surfaceBorder/60 mt-1">
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Previsualizar Membresía</p>
                    </div>
                    {[
                      { tier: 'free' as const, label: 'Plan Básico ($0 MXN)' },
                      { tier: 'pro' as const, label: '★ Atleta Pro ($249 MXN)' },
                      { tier: 'coach' as const, label: '★ Coach VIP ($999 MXN)' },
                    ].map((p) => (
                      <button
                        key={p.tier}
                        onClick={() => {
                          setSubscriptionTier(p.tier);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-xs font-medium transition-colors flex items-center justify-between ${
                          currentUser.subscriptionTier === p.tier
                            ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                            : 'text-zinc-300 hover:bg-motive-surface hover:text-white'
                        }`}
                      >
                        <span>{p.label}</span>
                        {currentUser.subscriptionTier === p.tier && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center flex-shrink-0">
                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${
                  currentUser.subscriptionTier === 'coach'
                    ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    : currentUser.subscriptionTier === 'pro'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  {currentUser.subscriptionTier === 'coach' ? '★ COACH VIP' : currentUser.subscriptionTier === 'pro' ? '★ ATLETA PRO' : 'PLAN BÁSICO'}
                </span>
              </div>
            )}

            {/* Enlaces de Autenticación Siempre Visibles */}
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-motive-surfaceBorder/80 flex-shrink-0">
              <button
                onClick={handleInstallPwa}
                className="p-1.5 rounded-lg text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors flex items-center space-x-1 flex-shrink-0"
                title="Instalar App Móvil / Escritorio (PWA)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden 2xl:inline text-[10px] font-bold uppercase">App</span>
              </button>
              <Link
                href="/login"
                className="px-2.5 py-1.5 rounded-lg text-[11px] xl:text-xs font-bold text-zinc-200 hover:text-white bg-motive-surface hover:bg-motive-surfaceLight border border-motive-surfaceBorder transition-colors whitespace-nowrap"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="px-2.5 py-1.5 rounded-lg text-[11px] xl:text-xs font-bold text-white bg-motive-red hover:bg-motive-redDark uppercase tracking-wider transition-colors shadow-md shadow-motive-red/20 whitespace-nowrap"
              >
                Registro
              </Link>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-motive-surface transition-colors flex-shrink-0"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full border border-motive-surfaceBorder overflow-hidden bg-motive-surface flex-shrink-0">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Mobile & Tablet menu trigger + Quick Login Button */}
          <div className="lg:hidden flex items-center space-x-2 flex-shrink-0">
            <Link
              href="/login"
              className="sm:hidden px-2.5 py-1.5 rounded-lg text-xs font-bold text-zinc-200 bg-motive-surface border border-motive-surfaceBorder whitespace-nowrap"
            >
              Entrar
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-motive-surface"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-motive-surface/95 border-b border-motive-surfaceBorder px-4 pt-3 pb-6 space-y-3 max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-motive-surfaceBorder">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-center rounded-xl text-xs font-bold text-white bg-motive-surfaceLight border border-motive-surfaceBorder hover:border-zinc-500"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/registro"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-center rounded-xl text-xs font-bold text-white bg-motive-red hover:bg-motive-redDark uppercase tracking-wider"
            >
              Crear Cuenta
            </Link>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleInstallPwa();
            }}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center space-x-2"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Instalar App en mi Celular (PWA)</span>
          </button>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              const isGated = !hasCompletedAssessment && (link.href === '/nutricion' || link.href === '/entrenamiento');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-motive-red/15 text-motive-redBright font-semibold'
                      : 'text-zinc-300 hover:bg-motive-surfaceLight'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {isGated && (
                    <span className="flex items-center space-x-1 text-[10px] text-zinc-500 font-bold bg-motive-surface px-2 py-0.5 rounded border border-motive-surfaceBorder">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Diagnóstico</span>
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-motive-surfaceBorder flex flex-col space-y-2">
            <p className="text-xs text-zinc-400 font-semibold uppercase">Rol en Sesión</p>
            <div className="grid grid-cols-2 gap-2">
              {(['client', 'coach', 'nutritionist', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    handleRoleChange(r);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                    currentUser.role === r
                      ? 'bg-motive-red text-white'
                      : 'bg-motive-surfaceLight text-zinc-300 border border-motive-surfaceBorder'
                  }`}
                >
                  {getRoleLabel(r)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Instalación PWA (iPhone / Android / Desktop) */}
      {pwaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-motive-surfaceBorder pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">App Nativa Web (PWA)</span>
                  <h3 className="text-base font-display font-black text-white uppercase">Instalar MOTIVE LAB</h3>
                </div>
              </div>
              <button
                onClick={() => setPwaModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Instala <strong>MOTIVE LAB</strong> en la pantalla de inicio de tu celular para abrir tu rutina en el gimnasio y tu dieta en la cocina a pantalla completa, sin barras de navegador.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder space-y-1">
                <strong className="text-white block">📱 En iPhone / iPad (Safari):</strong>
                <p className="text-zinc-400">1. Toca el botón <strong>Compartir</strong> (ícono de flecha hacia arriba en la barra inferior).</p>
                <p className="text-zinc-400">2. Selecciona <strong>&ldquo;Agregar a pantalla de inicio&rdquo;</strong> y confirma.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder space-y-1">
                <strong className="text-white block">🤖 En Android (Chrome) / PC:</strong>
                <p className="text-zinc-400">1. Toca el menú de 3 puntos <strong>(⋮)</strong> arriba a la derecha en tu navegador.</p>
                <p className="text-zinc-400">2. Toca <strong>&ldquo;Instalar aplicación&rdquo;</strong> o <strong>&ldquo;Agregar a la pantalla principal&rdquo;</strong>.</p>
              </div>
            </div>

            <button
              onClick={() => setPwaModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-motive-red hover:bg-motive-redDark text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

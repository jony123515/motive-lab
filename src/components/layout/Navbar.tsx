'use client';

import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  LayoutDashboard,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const {
    currentUser,
    isAuthenticated,
    logoutUser,
    setCurrentUserRole,
    setSubscriptionTier,
    safetyTriage,
    hasCompletedAssessment,
  } = useAppState();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [pwaModalOpen, setPwaModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  // Determinar si estamos en una ruta pública comercial (Home / Auth)
  const isPublicMarketingRoute =
    pathname === '/' || pathname === '/login' || pathname === '/registro' || pathname === '/recuperar';

  // Mostrar navegación pública limpia cuando el visitante está en rutas públicas y no ha iniciado sesión
  const showPublicNavbar = isPublicMarketingRoute && !isAuthenticated;

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
    logoutUser();
    window.location.href = '/';
  };

  // Enlaces para visitantes públicos (no autenticados en el Home)
  const publicLinks = [
    { href: '/#el-problema', label: 'El Enfoque' },
    { href: '/#demostracion', label: 'Demostración' },
    { href: '/#como-funciona', label: 'Cómo funciona' },
    { href: '/#metodologia', label: 'Metodología' },
    { href: '/#membresias', label: 'Membresías' },
  ];

  // Enlaces de la aplicación privada / interna
  const appNavLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/evaluacion', label: 'Evaluación', icon: ClipboardCheck },
    { href: '/nutricion', label: 'Nutrición', icon: Apple },
    { href: '/entrenamiento', label: 'Entrenamiento', icon: Dumbbell },
    { href: '/recuperacion', label: 'Hidratación', icon: Droplets },
    { href: '/reportes', label: 'Reporte', icon: FileText },
    { href: '/precios', label: 'Membresías', icon: Sparkles },
  ];

  if (isAuthenticated && currentUser.role === 'admin') {
    appNavLinks.push({ href: '/admin', label: 'Admin', icon: ShieldCheck });
    appNavLinks.push({ href: '/coach', label: 'Coach', icon: UserCheck });
  } else if (isAuthenticated && (currentUser.role === 'coach' || currentUser.role === 'nutritionist')) {
    appNavLinks.push({ href: '/coach', label: 'Coach', icon: UserCheck });
  }

  const handleRoleChange = (role: UserRole) => {
    setCurrentUserRole(role);
    setRoleDropdownOpen(false);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'client':
        return 'Cliente / Atleta';
      case 'coach':
        return 'Entrenador (Coach)';
      case 'nutritionist':
        return 'Nutriólogo Deportivo';
      case 'admin':
        return 'Administrador';
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#08080B]/95 backdrop-blur-xl border-b border-zinc-800/80 shadow-2xl shadow-black/50'
          : 'bg-[#0A0A0C]/85 backdrop-blur-md border-b border-zinc-900'
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16 sm:h-[68px]">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-motive-red via-motive-red to-motive-redDark flex items-center justify-center shadow-lg shadow-motive-red/25 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-display font-extrabold text-lg tracking-wider text-white">MOTIVE</span>
                <span className="font-display font-black text-lg tracking-wider text-motive-redBright">LAB</span>
              </div>
              <p className="text-[9px] text-zinc-400 uppercase tracking-[0.22em] font-semibold leading-none">
                Science & Strength
              </p>
            </div>
          </Link>

          {/* NAVEGACIÓN PÚBLICA vs NAVEGACIÓN INTERNA */}
          {showPublicNavbar ? (
            <nav
              aria-label="Navegación principal"
              className="hidden lg:flex items-center space-x-7 xl:space-x-9"
            >
              {publicLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-motive-redBright hover:after:w-full after:transition-all"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          ) : (
            <nav
              aria-label="Módulos de la plataforma"
              className="hidden lg:flex items-center gap-1 flex-1 min-w-0 justify-center overflow-x-auto no-scrollbar py-1"
            >
              {appNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                const isGated =
                  !hasCompletedAssessment && (link.href === '/nutricion' || link.href === '/entrenamiento');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap flex-shrink-0 ${
                      isActive
                        ? 'bg-motive-red/15 text-motive-redBright border border-motive-red/35'
                        : 'text-zinc-300 hover:text-white hover:bg-motive-surface'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        isActive ? 'text-motive-redBright' : 'text-zinc-400'
                      }`}
                    />
                    <span>{link.label}</span>
                    {isGated && (
                      <span title="Requiere completar evaluación inicial">
                        <Lock className="w-3 h-3 text-zinc-500" />
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* CONTROLES DERECHOS: PÚBLICOS vs AUTENTICADOS */}
          {showPublicNavbar ? (
            <div className="hidden sm:flex items-center space-x-3 flex-shrink-0">
              {hasCompletedAssessment && (
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors whitespace-nowrap flex items-center space-x-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Mi Plan</span>
                </Link>
              )}

              <Link
                href="/login"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Iniciar sesión
              </Link>

              <Link
                href="/evaluacion"
                className="px-4 py-2.5 rounded-xl text-xs font-display font-bold text-white bg-gradient-to-r from-motive-red to-motive-redDark hover:from-motive-redBright hover:to-motive-red uppercase tracking-wider transition-all shadow-lg shadow-motive-red/25 hover:scale-[1.02] whitespace-nowrap flex items-center space-x-1.5"
              >
                <span>Descubre tu plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              {safetyTriage && !safetyTriage.canProceedWithAutomaticPlan && (
                <span className="hidden xl:inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse whitespace-nowrap">
                  <ShieldAlert className="w-3 h-3" />
                  <span>Revisión Médica</span>
                </span>
              )}

              {/* Selector de Rol solo para Administradores Autenticados */}
              {isAuthenticated && currentUser.role === 'admin' ? (
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
                    <div className="absolute right-0 mt-2 w-56 bg-motive-surfaceLight border border-motive-surfaceBorder rounded-2xl shadow-2xl py-2 z-50">
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
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                          Previsualizar Rol
                        </p>
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
                          {currentUser.role === r && (
                            <span className="w-1.5 h-1.5 rounded-full bg-motive-redBright"></span>
                          )}
                        </button>
                      ))}

                      <div className="px-3.5 py-1.5 border-b border-t border-motive-surfaceBorder/60 mt-1">
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                          Previsualizar Membresía
                        </p>
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
                          {currentUser.subscriptionTier === p.tier && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${
                    currentUser.subscriptionTier === 'coach'
                      ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      : currentUser.subscriptionTier === 'pro'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {currentUser.subscriptionTier === 'coach'
                    ? '★ COACH PRO'
                    : currentUser.subscriptionTier === 'pro'
                    ? '★ ATLETA PRO'
                    : 'PLAN BÁSICO'}
                </span>
              )}

              <button
                onClick={handleInstallPwa}
                className="p-1.5 rounded-lg text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors flex items-center space-x-1 flex-shrink-0"
                title="Instalar App Móvil / Escritorio (PWA)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[10px] font-bold uppercase">App</span>
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2 pl-2 border-l border-motive-surfaceBorder/80">
                  <div className="w-8 h-8 rounded-full border border-motive-surfaceBorder overflow-hidden bg-motive-surface flex-shrink-0">
                    <img
                      src={
                        currentUser.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                      }
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-motive-surface transition-colors flex-shrink-0"
                    title="Cerrar Sesión"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 pl-1.5 border-l border-motive-surfaceBorder/80 flex-shrink-0">
                  <Link
                    href="/login"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-zinc-200 hover:text-white bg-motive-surface hover:bg-motive-surfaceLight border border-motive-surfaceBorder transition-colors whitespace-nowrap"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/registro"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-motive-red hover:bg-motive-redDark uppercase tracking-wider transition-colors shadow-md shadow-motive-red/20 whitespace-nowrap"
                  >
                    Registro
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile & Tablet menu trigger */}
          <div className="lg:hidden flex items-center space-x-2 flex-shrink-0">
            <Link
              href={isAuthenticated ? '/dashboard' : '/login'}
              className="sm:hidden px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-200 bg-motive-surface border border-motive-surfaceBorder whitespace-nowrap"
            >
              {isAuthenticated ? 'Panel' : 'Iniciar sesión'}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú de navegación"
              className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-motive-surface"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0B0F]/98 backdrop-blur-xl border-b border-motive-surfaceBorder px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {!isAuthenticated ? (
            <div className="grid grid-cols-2 gap-2.5 pb-3 border-b border-motive-surfaceBorder">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-xl text-xs font-bold text-white bg-motive-surfaceLight border border-motive-surfaceBorder"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/evaluacion"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-xl text-xs font-bold text-white bg-motive-red uppercase tracking-wider"
              >
                Descubre tu plan
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-3 border-b border-motive-surfaceBorder">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-motive-surfaceBorder">
                  <img
                    src={
                      currentUser.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                    }
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{currentUser.name}</p>
                  <p className="text-[10px] text-zinc-400">{getRoleLabel(currentUser.role)}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20"
              >
                Salir
              </button>
            </div>
          )}

          {/* Enlaces en Móvil según modo público o privado */}
          {showPublicNavbar ? (
            <div className="space-y-1">
              {publicLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-motive-surfaceLight hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              {hasCompletedAssessment && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 mt-2"
                >
                  Ir a mi Panel Activo ➔
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {appNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                const isGated =
                  !hasCompletedAssessment && (link.href === '/nutricion' || link.href === '/entrenamiento');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
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
                        <span>Evaluación</span>
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

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
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                    App Nativa Web (PWA)
                  </span>
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
                <p className="text-zinc-400">
                  1. Toca el botón <strong>Compartir</strong> (ícono de flecha hacia arriba en la barra inferior).
                </p>
                <p className="text-zinc-400">
                  2. Selecciona <strong>&ldquo;Agregar a pantalla de inicio&rdquo;</strong> y confirma.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder space-y-1">
                <strong className="text-white block">🤖 En Android (Chrome) / PC:</strong>
                <p className="text-zinc-400">
                  1. Toca el menú de 3 puntos <strong>(⋮)</strong> arriba a la derecha en tu navegador.
                </p>
                <p className="text-zinc-400">
                  2. Toca <strong>&ldquo;Instalar aplicación&rdquo;</strong> o{' '}
                  <strong>&ldquo;Agregar a la pantalla principal&rdquo;</strong>.
                </p>
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

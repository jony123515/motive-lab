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
  Lock
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, setCurrentUserRole, setSubscriptionTier, safetyTriage, hasCompletedAssessment } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

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
    { href: '/nutricion', label: 'Nutrición SMAE', icon: Apple },
    { href: '/entrenamiento', label: 'Entrenamiento', icon: Dumbbell },
    { href: '/recuperacion', label: 'Hidratación & Ciencia', icon: Droplets },
    { href: '/reportes', label: 'Reporte Clínico', icon: FileText },
    { href: '/precios', label: 'Planes Pro', icon: Sparkles },
  ];

  if (currentUser.role === 'admin') {
    navLinks.push({ href: '/admin', label: 'Panel Maestro', icon: ShieldCheck });
    navLinks.push({ href: '/coach', label: 'Portal Especialistas', icon: UserCheck });
  } else if (currentUser.role === 'coach' || currentUser.role === 'nutritionist') {
    navLinks.push({ href: '/coach', label: 'Portal Especialistas', icon: UserCheck });
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
    <header className="sticky top-0 z-50 bg-[#0A0A0C]/90 backdrop-blur-md border-b border-motive-surfaceBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-motive-red to-motive-redDark flex items-center justify-center shadow-lg shadow-motive-red/30 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-extrabold text-xl tracking-wider text-white">MOTIVE</span>
                <span className="font-display font-black text-xl tracking-wider text-motive-redBright">LAB</span>
              </div>
              <p className="text-[10px] text-motive-gray-400 uppercase tracking-widest font-semibold">Science & Strength</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              const isGated = !hasCompletedAssessment && (link.href === '/nutricion' || link.href === '/entrenamiento');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-motive-red/10 text-motive-redBright border border-motive-red/30'
                      : 'text-zinc-300 hover:text-white hover:bg-motive-surface'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-motive-redBright' : 'text-zinc-400'}`} />
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
          <div className="hidden sm:flex items-center space-x-3">
            {safetyTriage && !safetyTriage.canProceedWithAutomaticPlan && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Revisión Médica</span>
              </span>
            )}

            {/* Acceso Administrador o Badge de Membresía */}
            {currentUser.role === 'admin' ? (
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-motive-red to-motive-redDark border border-motive-redBright/50 text-white font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-motive-red/30 hover:scale-105 transition-transform"
                  title="Consola de Control del Administrador"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Admin Master</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-300" />
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
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
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

            {/* Enlaces de Autenticación */}
            <div className="flex items-center space-x-2 pl-1 border-l border-motive-surfaceBorder/80">
              <Link
                href="/login"
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:bg-motive-surface transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/registro"
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-motive-red hover:bg-motive-redDark uppercase tracking-wider transition-colors shadow-md shadow-motive-red/20"
              >
                Registro
              </Link>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-motive-surface transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full border border-motive-surfaceBorder overflow-hidden bg-motive-surface">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center space-x-2">
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
        <div className="lg:hidden bg-motive-surface/95 border-b border-motive-surfaceBorder px-4 pt-3 pb-6 space-y-3">
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
    </header>
  );
}

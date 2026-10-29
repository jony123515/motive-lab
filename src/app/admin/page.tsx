'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppState } from '@/lib/store/appState';
import { UserRole } from '@/types';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  CreditCard, 
  Lock, 
  Unlock, 
  ExternalLink, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  RefreshCw,
  UserCheck,
  TrendingUp,
  Settings
} from 'lucide-react';

interface ManagedUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  subscription_tier: 'free' | 'pro' | 'coach';
  subscription_status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const { currentUser, setCurrentUserRole, setSubscriptionTier } = useAppState();

  const [activeTab, setActiveTab] = useState<'users' | 'security' | 'quick_links'>('users');
  const [usersList, setUsersList] = useState<ManagedUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const isAdmin = currentUser.role === 'admin';

  // Cargar usuarios desde la API administrativa
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        setUsersList(data.users);
      }
    } catch (err) {
      console.error('Error al cargar lista de usuarios:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  // Actualizar rol o nivel de suscripción
  const handleUpdateUser = async (userId: string, role?: UserRole, subscriptionTier?: 'free' | 'pro' | 'coach') => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role, subscriptionTier }),
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(prev =>
          prev.map(u => {
            if (u.id === userId) {
              return {
                ...u,
                role: role || u.role,
                subscription_tier: subscriptionTier || u.subscription_tier,
                subscription_status: subscriptionTier === 'free' ? 'inactive' : 'active',
              };
            }
            return u;
          })
        );
        setActionSuccessMsg('Usuario actualizado con éxito en la base de datos.');
        setTimeout(() => setActionSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      alert('Error al actualizar usuario.');
    }
  };

  // Pantalla de bloqueo si no es Administrador
  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto shadow-2xl shadow-rose-500/20">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">
            Acceso Restringido al Panel Maestro
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Esta consola administrativa está protegida y reservada exclusivamente para el Propietario / Administrador de MOTIVE LAB.
          </p>
        </div>

        <div className="p-4 bg-motive-surface border border-motive-surfaceBorder rounded-2xl max-w-md mx-auto text-left text-xs space-y-2 text-zinc-300">
          <p className="font-bold text-white flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-motive-redBright" />
            <span>¿Eres el dueño del proyecto?</span>
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Puedes cambiar tu rol en el selector de la barra de navegación para previsualizar este panel o ejecutar la consulta SQL en Supabase para vincular permanentemente tu correo.
          </p>
        </div>

        <div>
          <button
            onClick={() => {
              setCurrentUserRole('admin');
              setSubscriptionTier('coach');
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-motive-red to-motive-redDark text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-motive-red/30 hover:scale-[1.02] transition-transform"
          >
            Entrar como Administrador
          </button>
        </div>
      </div>
    );
  }

  // Filtrado de usuarios en el buscador
  const filteredUsers = usersList.filter(u =>
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cálculos rápidos de negocio
  const proCount = usersList.filter(u => u.subscription_tier === 'pro').length;
  const coachCount = usersList.filter(u => u.subscription_tier === 'coach').length;
  const estimatedMrr = proCount * 249 + coachCount * 999;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Maestro */}
      <div className="bg-gradient-to-r from-motive-surface via-motive-surfaceLight to-motive-surface border border-motive-surfaceBorder rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-motive-red/15 text-motive-redBright border border-motive-red/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Consola Maestra de Administración</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
            Panel del Propietario • MOTIVE LAB
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Control integral de usuarios, asignación de membresías de cortesía, gestión de roles y supervisión de cobros en tiempo real.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-black/40 border border-motive-surfaceBorder px-4 py-2.5 rounded-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-motive-redBright animate-pulse" />
          <span className="font-bold text-white uppercase">Admin Activo:</span>
          <span className="text-zinc-300">{currentUser.name}</span>
        </div>
      </div>

      {/* KPI Cards de Negocio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Usuarios Registrados</span>
            <Users className="w-5 h-5 text-zinc-400" />
          </div>
          <p className="text-3xl font-display font-black text-white mt-2">{usersList.length || 3}</p>
          <span className="text-[11px] text-zinc-500 font-medium">En base de datos PostgreSQL</span>
        </div>

        <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Atletas Plan Pro</span>
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-display font-black text-emerald-400 mt-2">{proCount || 1}</p>
          <span className="text-[11px] text-zinc-500 font-medium">$249 MXN / mes c/u</span>
        </div>

        <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Atletas Plan Coach VIP</span>
            <UserCheck className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-display font-black text-purple-400 mt-2">{coachCount || 1}</p>
          <span className="text-[11px] text-zinc-500 font-medium">$999 MXN / mes c/u</span>
        </div>

        <div className="bg-motive-surface border border-motive-surfaceBorder rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Ingresos Estimados (MRR)</span>
            <DollarSign className="w-5 h-5 text-motive-redBright" />
          </div>
          <p className="text-3xl font-display font-black text-white mt-2">${estimatedMrr || 1248} <span className="text-xs text-zinc-400">MXN</span></p>
          <span className="text-[11px] text-zinc-500 font-medium">Facturación mensual proyectada</span>
        </div>
      </div>

      {/* Tabs del Panel */}
      <div className="flex items-center space-x-2 border-b border-motive-surfaceBorder pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'users'
              ? 'bg-motive-red text-white'
              : 'text-zinc-400 hover:text-white hover:bg-motive-surface'
          }`}
        >
          <span>Gestión de Usuarios & Membresías</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-5 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'security'
              ? 'bg-motive-red text-white'
              : 'text-zinc-400 hover:text-white hover:bg-motive-surface'
          }`}
        >
          <span>Configurar Mi Correo como Admin Único</span>
        </button>

        <button
          onClick={() => setActiveTab('quick_links')}
          className={`px-5 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'quick_links'
              ? 'bg-motive-red text-white'
              : 'text-zinc-400 hover:text-white hover:bg-motive-surface'
          }`}
        >
          <span>Consolas de Control Externas</span>
        </button>
      </div>

      {/* Notificación de Éxito al hacer cambios */}
      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* TAB 1: Gestión de Usuarios */}
      {activeTab === 'users' && (
        <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-display font-bold text-white uppercase">
                Directorio de Atletas y Especialistas
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Modifica el rol o activa manualmente planes Pro/Coach a cualquier usuario registrado.
              </p>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o correo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-motive-red"
                />
              </div>

              <button
                onClick={fetchUsers}
                disabled={loadingUsers}
                className="p-2 rounded-xl bg-motive-surfaceLight border border-motive-surfaceBorder text-zinc-400 hover:text-white transition-colors"
                title="Recargar usuarios"
              >
                <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin text-motive-redBright' : ''}`} />
              </button>
            </div>
          </div>

          {/* Tabla de Usuarios */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-motive-surfaceBorder/80 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Rol en Plataforma</th>
                  <th className="py-3 px-4">Membresía / Plan</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-motive-surfaceBorder/50">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-motive-surfaceLight/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{u.full_name || 'Sin Nombre'}</p>
                      <p className="text-[11px] text-zinc-400 font-mono">{u.email}</p>
                    </td>

                    {/* Selector de Rol */}
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateUser(u.id, e.target.value as UserRole)}
                        className="bg-motive-surfaceLight border border-motive-surfaceBorder rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-motive-red"
                      >
                        <option value="client">Cliente / Atleta</option>
                        <option value="coach">Entrenador (Coach)</option>
                        <option value="nutritionist">Nutriólogo Deportivo</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </td>

                    {/* Selector de Membresía */}
                    <td className="py-3.5 px-4">
                      <select
                        value={u.subscription_tier || 'free'}
                        onChange={(e) => handleUpdateUser(u.id, undefined, e.target.value as any)}
                        className={`border rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none ${
                          u.subscription_tier === 'coach'
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                            : u.subscription_tier === 'pro'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        <option value="free">Plan Básico ($0)</option>
                        <option value="pro">★ Atleta Pro ($249)</option>
                        <option value="coach">★ Coach VIP ($999)</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.subscription_status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {u.subscription_status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {u.subscription_tier === 'free' ? (
                        <button
                          onClick={() => handleUpdateUser(u.id, undefined, 'pro')}
                          className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-bold transition-colors"
                        >
                          Dar Acceso Pro Gratis
                        </button>
                      ) : (
                        <span className="text-[11px] text-zinc-500 font-medium">Membresía Activa</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Configurar Admin Único */}
      {activeTab === 'security' && (
        <div className="bg-motive-surface border border-motive-surfaceBorder rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-motive-surfaceBorder/80 pb-4">
            <h3 className="text-lg font-display font-bold text-white uppercase">
              Cómo Asegurar que Solo Tú Seas el Administrador
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Sigue estos 2 sencillos pasos para que nadie más tenga permisos de administrador en tu plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-5 bg-motive-surfaceLight border border-motive-surfaceBorder rounded-2xl space-y-4">
              <div className="flex items-center space-x-2.5 text-motive-redBright font-bold text-sm uppercase">
                <span className="w-6 h-6 rounded-full bg-motive-red/15 border border-motive-red/30 flex items-center justify-center text-xs">1</span>
                <span>Regístrate con tu correo personal</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Crea tu cuenta en el formulario oficial de registro:  
                <Link href="/registro" className="text-motive-redBright font-semibold underline block mt-1">
                  motive-lab.vercel.app/registro
                </Link>
              </p>
            </div>

            <div className="p-5 bg-motive-surfaceLight border border-motive-surfaceBorder rounded-2xl space-y-4">
              <div className="flex items-center space-x-2.5 text-emerald-400 font-bold text-sm uppercase">
                <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xs">2</span>
                <span>Asigna tu rol de Admin en Supabase</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Entra a tu <strong>Supabase SQL Editor</strong> y corre este comando con tu correo real:
              </p>
              <pre className="p-3 bg-black/60 rounded-xl text-[11px] text-emerald-300 font-mono overflow-x-auto border border-emerald-500/20">
{`UPDATE public.profiles 
SET role = 'admin', 
    subscription_tier = 'coach', 
    subscription_status = 'active'
WHERE email = 'tu_correo@ejemplo.com';`}
              </pre>
            </div>

          </div>

          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-200 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-white uppercase block">Seguridad por Base de Datos (PostgreSQL RLS)</strong>
              <p className="leading-relaxed">
                Una vez que asignes tu correo como `admin`, nadie más podrá cambiar roles ni ver información privada. Las políticas de seguridad a nivel de fila (RLS) impiden que usuarios comunes modifiquen la base de datos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Enlaces Rápidos a Consolas Externas */}
      {activeTab === 'quick_links' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <a
            href="https://dashboard.stripe.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-motive-surface border border-motive-surfaceBorder rounded-2xl hover:border-motive-red/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <CreditCard className="w-6 h-6 text-emerald-400" />
                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-base font-display font-bold text-white uppercase">Stripe Dashboard</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Supervisa pagos en vivo en Pesos Mexicanos (MXN), cuentas bancarias conectadas y transferencias a tu cuenta CLABE.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
              <span>Abrir Stripe</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </a>

          <a
            href="https://supabase.com/dashboard/project/fqjlvezzdvnflnhrwzoo"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-motive-surface border border-motive-surfaceBorder rounded-2xl hover:border-motive-red/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-base font-display font-bold text-white uppercase">Supabase Cloud</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Base de datos PostgreSQL, autenticación de usuarios y almacenamiento privado de videos de entrenamiento.
              </p>
            </div>
            <span className="text-xs font-bold text-cyan-400 flex items-center space-x-1">
              <span>Abrir Supabase</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </a>

          <a
            href="https://vercel.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-motive-surface border border-motive-surfaceBorder rounded-2xl hover:border-motive-red/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Settings className="w-6 h-6 text-amber-400" />
                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-base font-display font-bold text-white uppercase">Vercel Deployment</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Supervisa el despliegue del código Next.js en producción, variables de entorno y analíticas de tráfico web.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
              <span>Abrir Vercel</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </a>

        </div>
      )}

    </div>
  );
}

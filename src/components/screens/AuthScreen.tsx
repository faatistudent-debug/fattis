import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoleType } from '../../types';
import {
  ShieldCheck,
  UserCheck,
  Utensils,
  Award,
  Lock,
  Mail,
  User,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';

export function AuthScreen() {
  const {
    signInWithUsernameOrEmail,
    signUpEmail,
    signInGoogle,
    loading,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType>('Nutricionista');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setActionLoading(true);
    try {
      setSuccessMsg(`Conectando con Google como ${selectedRole}...`);
      await signInGoogle(selectedRole);
      setSuccessMsg(`¡Sesión iniciada con éxito con Google como ${selectedRole}!`);
    } catch (err: any) {
      console.error('Google auth error:', err);
      setSuccessMsg(null);
      if (err.code === 'auth/popup-blocked') {
        setErrorMsg('El navegador bloqueó la ventana emergente de Google. Usa tu correo y contraseña abajo.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Ventana de Google cerrada antes de completar el inicio de sesión.');
      } else {
        setErrorMsg('No se pudo conectar con Google (' + (err.message || err.code) + '). Por favor ingresa con tu correo y contraseña.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setActionLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail) {
      setErrorMsg('Por favor ingresa tu correo electrónico.');
      setActionLoading(false);
      return;
    }

    if (!cleanPass || cleanPass.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      setActionLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const cleanName = name.trim();
        if (!cleanName) {
          setErrorMsg('Por favor ingresa tu nombre completo.');
          setActionLoading(false);
          return;
        }

        setSuccessMsg(`Creando cuenta para ${cleanName} como ${selectedRole}...`);
        await signUpEmail(cleanEmail, cleanPass, cleanName, selectedRole);
        setSuccessMsg(`¡Cuenta creada con éxito! Bienvenido, ${cleanName}.`);
      } else {
        setSuccessMsg(`Iniciando sesión como ${selectedRole}...`);
        await signInWithUsernameOrEmail(cleanEmail, cleanPass, selectedRole);
        setSuccessMsg(`¡Sesión iniciada con éxito! Accediendo a tu panel de ${selectedRole}...`);
      }
    } catch (err: any) {
      console.error('Auth submit error:', err);
      setSuccessMsg(null);
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        // If they attempted login with a valid password but account was not found, offer auto-signup or clear explanation
        setErrorMsg('Credenciales no encontradas. Si es tu primera vez, puedes registrarte seleccionando la pestaña "Crear Cuenta".');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Este correo ya está registrado. Selecciona "Iniciar Sesión" para acceder con tu contraseña.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('La contraseña debe contener al menos 6 caracteres.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('Por favor ingresa un formato de correo electrónico válido.');
      } else {
        setErrorMsg(err.message || 'Error al autenticar. Por favor verifica tus datos e intenta nuevamente.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-full w-full bg-gradient-to-b from-slate-950 via-slate-900 to-cyan-950 text-white flex flex-col items-center justify-center p-3 sm:p-5 py-8">
      <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-md border border-cyan-500/20 rounded-3xl shadow-2xl p-5 sm:p-7">
        
        {/* App Logo & Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <BrandLogo size="lg" />
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[11px] uppercase tracking-widest text-cyan-400 font-extrabold">
              Acceso Seguro Rendí+
            </p>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {mode === 'login'
              ? 'Ingresa con tu correo y contraseña para entrar directamente a tu panel.'
              : 'Registra tus credenciales y selecciona tu rol para comenzar.'}
          </p>
        </div>

        {/* Mode Switcher: Iniciar Sesión / Registrarse */}
        <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Iniciar Sesión</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Crear Cuenta</span>
          </button>
        </div>

        {/* Security badges */}
        <div className="grid grid-cols-3 gap-2 p-2.5 mb-5 bg-slate-950/70 border border-slate-800 rounded-2xl text-[10px] text-slate-300 text-center">
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">Rol Asignado</span>
            <span className="text-slate-400 text-[9px]">Permisos RBAC</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-slate-800 px-1">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-white">Datos Aislados</span>
            <span className="text-slate-400 text-[9px]">Sin mezclar cuentas</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <UserCheck className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-white">Privacidad</span>
            <span className="text-slate-400 text-[9px]">Protección total</span>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2.5 p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ROLE SELECTOR (Deportista, Nutricionista, Entrenador) */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              Modo de acceso (¿Cómo vas a ingresar?):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: 'Nutricionista' as RoleType,
                  label: 'Nutricionista',
                  icon: Utensils,
                  color: 'border-emerald-500 bg-emerald-950/70 text-emerald-300 ring-emerald-500/50',
                },
                {
                  id: 'Deportista' as RoleType,
                  label: 'Deportista',
                  icon: Award,
                  color: 'border-amber-500 bg-amber-950/70 text-amber-300 ring-amber-500/50',
                },
                {
                  id: 'Entrenador' as RoleType,
                  label: 'Entrenador',
                  icon: UserCheck,
                  color: 'border-teal-500 bg-teal-950/70 text-teal-300 ring-teal-500/50',
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedRole(item.id)}
                    className={`py-2.5 px-1.5 rounded-xl border text-xs font-black transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      isSelected
                        ? `${item.color} shadow-md ring-2`
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* If Signup: Name Field */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Faati Morales"
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">
                Contraseña
              </label>
              <span className="text-[10px] text-slate-400">
                Mínimo 6 caracteres
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={actionLoading || loading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] text-slate-950 font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-60"
          >
            {actionLoading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : mode === 'login' ? (
              <>
                <span>Entrar como {selectedRole}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Registrarme como {selectedRole}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Google Sign In option */}
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold">O también</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <button
              type="button"
              disabled={actionLoading || loading}
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-3 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-2.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar con Google como {selectedRole}</span>
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            {mode === 'login' ? (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                  }}
                  className="text-cyan-400 hover:underline font-bold"
                >
                  Regístrate aquí
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  className="text-cyan-400 hover:underline font-bold"
                >
                  Inicia sesión aquí
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

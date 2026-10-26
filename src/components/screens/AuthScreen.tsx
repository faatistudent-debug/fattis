import React, { useState, useMemo } from 'react';
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
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  KeyRound,
  UserPlus,
  LogIn,
  HelpCircle,
  ExternalLink,
  Info,
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { resolveIdentifierToEmail, slugifyUsername } from '../../utils/authHelpers';

export function AuthScreen() {
  const {
    signInWithUsernameOrEmail,
    signUpWithUsernameOrEmail,
    signInGoogle,
    quickLoginDemo,
    enterDirectSession,
    savedUsers,
    loading,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<RoleType>('Nutricionista');
  const [loginRole, setLoginRole] = useState<RoleType>('Nutricionista');
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomEmail, setShowCustomEmail] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [unregisteredPrompt, setUnregisteredPrompt] = useState<string | null>(null);

  // Live identification of username or email
  const identifiedInfo = useMemo(() => {
    if (!identifier.trim()) return null;
    return resolveIdentifierToEmail(identifier);
  }, [identifier]);

  const generatedUsername = useMemo(() => {
    return slugifyUsername(name);
  }, [name]);

  const handleSwitchToSignUp = (prefillIdentifier?: string, prefillRole?: RoleType) => {
    setMode('signup');
    setErrorMsg(null);
    setUnregisteredPrompt(null);
    if (prefillRole) setRole(prefillRole);
    if (prefillIdentifier) {
      if (prefillIdentifier.includes('@')) {
        setName(prefillIdentifier.split('@')[0]);
        setCustomEmail(prefillIdentifier);
        setShowCustomEmail(true);
      } else {
        setName(prefillIdentifier);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setActionLoading(true);
    try {
      setSuccessMsg('Conectando con Google como ' + loginRole + '...');
      await signInGoogle(loginRole);
      setSuccessMsg('¡Sesión iniciada con éxito con Google como ' + loginRole + '!');
    } catch (err: any) {
      console.error('Google auth error:', err);
      setSuccessMsg(null);
      if (err.code === 'auth/popup-blocked') {
        setErrorMsg('El navegador bloqueó la ventana emergente de Google. Por favor permite ventanas emergentes o usa tu nombre de usuario y contraseña.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Ventana de Google cerrada antes de completar el inicio de sesión.');
      } else {
        setErrorMsg('No se pudo conectar con Google (' + (err.message || err.code) + '). Te recomendamos usar el botón directo "Entrar como Faati (Nutricionista)".');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setUnregisteredPrompt(null);
    setActionLoading(true);

    try {
      if (mode === 'login') {
        if (!identifier.trim()) {
          setErrorMsg('Por favor ingresa tu nombre de usuario o correo electrónico.');
          setActionLoading(false);
          return;
        }

        const displayName = identifiedInfo?.matchedUser?.name || identifier.trim();
        setSuccessMsg(`Verificando credenciales para ${displayName} como ${loginRole}...`);

        await signInWithUsernameOrEmail(identifier, password, loginRole);
        setSuccessMsg(`¡Bienvenido, ${displayName}! Accediendo a tu panel de ${loginRole}...`);
      } else {
        if (!name.trim()) {
          setErrorMsg('Por favor ingresa tu nombre o nombre de usuario.');
          setActionLoading(false);
          return;
        }
        if (!password || password.length < 6) {
          setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
          setActionLoading(false);
          return;
        }

        setSuccessMsg(`Creando cuenta para ${name.trim()} (${role})...`);
        await signUpWithUsernameOrEmail(name, password, role, showCustomEmail ? customEmail : undefined);
        setSuccessMsg(`¡Cuenta creada con éxito! Concediendo acceso como ${role}...`);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setSuccessMsg(null);
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        setErrorMsg(`No encontramos esta cuenta o la contraseña no coincide.`);
        setUnregisteredPrompt(identifier.trim());
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Este usuario o correo ya existe. Puedes iniciar sesión directamente con tu contraseña.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('La contraseña debe contener al menos 6 caracteres.');
      } else {
        setErrorMsg(err.message || 'Ocurrió un error al autenticar. Intenta nuevamente.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectUser = async (userRecord: { name: string; username: string; email: string; role: RoleType }) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setUnregisteredPrompt(null);
    setIdentifier(userRecord.username);

    // If it's a known demo user, log in immediately with 1 click
    if (userRecord.email.includes('rendiplus.demo')) {
      setActionLoading(true);
      try {
        setSuccessMsg(`Iniciando sesión como ${userRecord.name} (${userRecord.role})...`);
        await signInWithUsernameOrEmail(userRecord.username, 'RendiDemo2026!');
      } catch (err: any) {
        setErrorMsg('Error al conectar: ' + (err.message || String(err)));
      } finally {
        setActionLoading(false);
      }
    } else {
      // Focus on password for custom users
      setMode('login');
      setSuccessMsg(`Usuario ${userRecord.name} seleccionado. Ingresa tu contraseña para entrar.`);
    }
  };

  return (
    <div className="min-h-full w-full bg-gradient-to-b from-slate-950 via-slate-900 to-cyan-950 text-white flex flex-col items-center justify-center p-3 sm:p-5 py-8">
      <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-md border border-cyan-500/20 rounded-3xl shadow-2xl p-5 sm:p-7">
        
        {/* App Logo & Title */}
        <div className="flex flex-col items-center text-center mb-5">
          <BrandLogo size="lg" />
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[11px] uppercase tracking-widest text-cyan-400 font-extrabold">
              Control de Acceso Seguro
            </p>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            {mode === 'login' ? 'Iniciar Sesión por Usuario' : 'Registrar Nuevo Usuario'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {mode === 'login'
              ? 'Ingresa con tu nombre de usuario para acceder a tu panel de acuerdo a tu rol.'
              : 'Crea tu cuenta con tu nombre y recibe acceso inmediato personalizado.'}
          </p>
        </div>

        {/* BIGGEST UNMISSABLE 1-CLICK INSTANT ENTRY BUTTON */}
        <div className="mb-5 p-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 rounded-3xl shadow-2xl text-slate-950 text-center">
          <div className="flex items-center justify-center gap-1.5 font-black text-xs uppercase tracking-wider mb-2 text-slate-950">
            <Sparkles className="w-4 h-4 fill-current text-slate-950" />
            <span>Acceso Inmediato Sin Bloqueos</span>
          </div>
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => enterDirectSession('Faati (Nutricionista)', 'Nutricionista', 'faatistudent@gmail.com')}
            className="w-full py-4 px-3 bg-slate-950 hover:bg-slate-900 active:scale-[0.98] text-emerald-300 hover:text-white font-black text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 shadow-2xl transition cursor-pointer border-2 border-emerald-300"
          >
            <Utensils className="w-6 h-6 text-emerald-400 shrink-0" />
            <span>INGRESAR AHORA COMO NUTRICIONISTA (1 CLIC)</span>
            <ArrowRight className="w-5 h-5 text-emerald-400 shrink-0" />
          </button>
          <p className="text-[11px] text-slate-950 font-black mt-2">
            ✓ Haz 1 solo clic aquí para entrar directamente a tu panel sin contraseñas
          </p>
        </div>

        {/* Security badges */}
        <div className="grid grid-cols-3 gap-2 p-2.5 mb-5 bg-slate-950/70 border border-slate-800 rounded-2xl text-[10px] text-slate-300 text-center">
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">Acceso por Rol</span>
            <span className="text-slate-400 text-[9px]">Permisos RBAC</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-slate-800 px-1">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-white">Datos Aislados</span>
            <span className="text-slate-400 text-[9px]">Sin mezclar registros</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <UserCheck className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-white">Sesión Segura</span>
            <span className="text-slate-400 text-[9px]">Identidad personal</span>
          </div>
        </div>

        {/* Dedicated Instant Nutricionista Access Banner */}
        <div className="p-3.5 mb-4 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 border border-emerald-500/50 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-emerald-300 font-extrabold text-xs">
              <Utensils className="w-4 h-4 text-emerald-400" />
              <span>¿Deseas entrar como Nutricionista?</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-black border border-emerald-500/30">
              1 Clic Directo
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mb-2.5 leading-relaxed">
            Acceso instantáneo con permisos de Nutricionista para publicar/editar recetas, subir fotos de platos y asignar planes:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => quickLoginDemo('faati')}
              className="py-2.5 px-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow cursor-pointer active:scale-98"
            >
              <span>🥗 Entrar como Faati</span>
            </button>
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => quickLoginDemo('nutri')}
              className="py-2.5 px-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>👩‍⚕️ Dra. Claudia</span>
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-slate-950/80 p-1 rounded-2xl mb-4 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Registrarse
          </button>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3 mb-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <div className="flex-1">
              <span className="font-semibold block">{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Unregistered User Quick Action Banner */}
        {unregisteredPrompt && mode === 'login' && (
          <div className="p-3 mb-4 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs shadow-md">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>¿Quieres entrar ahora como Nutricionista con "{unregisteredPrompt}"?</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-100/90 leading-relaxed">
              Si tu cuenta no inició sesión, podemos crear y abrir tu acceso seguro como <strong>Nutricionista</strong> de inmediato:
            </p>
            <div className="mt-2.5 flex flex-col gap-2">
              <button
                type="button"
                onClick={async () => {
                  setActionLoading(true);
                  setErrorMsg(null);
                  try {
                    await signUpWithUsernameOrEmail(
                      unregisteredPrompt,
                      password && password.length >= 6 ? password : 'RendiDemo2026!',
                      'Nutricionista'
                    );
                  } catch (err: any) {
                    setErrorMsg(err.message || 'Error al conectar');
                  } finally {
                    setActionLoading(false);
                  }
                }}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition shadow cursor-pointer active:scale-98"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Entrar como Nutricionista ({unregisteredPrompt}) en 1 Clic</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchToSignUp(unregisteredPrompt, 'Nutricionista')}
                className="w-full py-1.5 text-slate-400 hover:text-white text-[11px] underline"
              >
                O personalizar mi contraseña en el formulario
              </button>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2.5 p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'login' ? (
            /* LOGIN MODE */
            <>
              {/* Desired Login Role Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  Rol al que deseas ingresar:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Nutricionista' as RoleType, label: 'Nutricionista', icon: Utensils },
                    { id: 'Deportista' as RoleType, label: 'Deportista', icon: Award },
                    { id: 'Entrenador' as RoleType, label: 'Entrenador', icon: UserCheck },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = loginRole === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setLoginRole(item.id)}
                        className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-950/70 text-emerald-300 shadow ring-1 ring-emerald-400/40'
                            : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Nombre de Usuario o Correo
                  </label>
                  {identifiedInfo?.matchedUser && (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {identifiedInfo.matchedUser.role}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (unregisteredPrompt) setUnregisteredPrompt(null);
                    }}
                    placeholder="Ej. faati, Lucas, Sofía, o tu correo"
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                {/* Identification chip feedback */}
                {identifiedInfo?.matchedUser && (
                  <div className="mt-1.5 p-2 bg-slate-950/80 rounded-lg border border-cyan-500/30 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-slate-300">Usuario registrado:</span>
                      <strong className="text-white">{identifiedInfo.matchedUser.name}</strong>
                    </div>
                    <span className="text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded text-[10px]">
                      {identifiedInfo.matchedUser.role}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Contraseña
                  </label>
                  {identifiedInfo?.isDemoUser ? (
                    <span className="text-[10px] text-amber-400 font-medium">
                      Opcional para cuentas de prueba
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSwitchToSignUp(identifier, 'Nutricionista')}
                      className="text-[10px] text-cyan-400 hover:underline"
                    >
                      ¿No tienes contraseña? Regístrate
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      identifiedInfo?.isDemoUser
                        ? 'Contraseña de prueba lista (opcional)'
                        : 'Ingresa tu contraseña (mínimo 6 caracteres)'
                    }
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>
            </>
          ) : (
            /* SIGNUP MODE */
            <>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Tu Nombre o Nombre de Usuario
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Mateo Gómez, Valentina, o faati"
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
                {name.trim() && (
                  <p className="text-[10px] text-cyan-300/80 mt-1 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-cyan-400" />
                    Tu usuario de acceso será:{' '}
                    <code className="text-cyan-200 font-mono font-bold bg-cyan-950/60 px-1.5 py-0.5 rounded">
                      {generatedUsername}
                    </code>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  Selecciona el Rol de Acceso
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: 'Deportista' as RoleType,
                      label: 'Deportista',
                      icon: Award,
                      desc: 'Desayuno, comidas y agua',
                    },
                    {
                      id: 'Nutricionista' as RoleType,
                      label: 'Nutricionista',
                      icon: Utensils,
                      desc: 'Recetas, fotos y planes',
                    },
                    {
                      id: 'Entrenador' as RoleType,
                      label: 'Entrenador',
                      icon: UserCheck,
                      desc: 'Lesiones y rendimiento',
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = role === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setRole(item.id)}
                        className={`flex flex-col items-center p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-sm'
                            : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span className="font-bold">{item.label}</span>
                        <span className="text-[9px] text-slate-400 text-center mt-0.5 leading-tight">
                          {item.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Contraseña de Acceso (mínimo 6 caracteres)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              {/* Optional Custom Email */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowCustomEmail(!showCustomEmail)}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Mail className="w-3 h-3" />
                  {showCustomEmail ? 'Ocultar correo personalizado' : '¿Deseas especificar tu correo real? (Opcional)'}
                </button>
                {showCustomEmail && (
                  <div className="mt-1.5 relative animate-fadeIn">
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="tu.correo@gmail.com"
                      className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-3 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={actionLoading || loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {actionLoading ? (
              <span>Procesando acceso seguro...</span>
            ) : mode === 'login' ? (
              <>
                <span>
                  {identifiedInfo?.matchedUser
                    ? `Entrar como ${identifiedInfo.matchedUser.name}`
                    : identifier.trim()
                    ? `Entrar como ${identifier.trim()}`
                    : 'Ingresar a Rendí+'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>
                  {name.trim()
                    ? `Registrar y Entrar como ${name.trim()} (${role})`
                    : `Registrar y Entrar como ${role}`}
                </span>
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
              <span>Continuar con Google</span>
            </button>
          </div>
        </form>

        {/* Diagnostic Guide Accordion: "¿Por qué no me deja entrar?" */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setShowHelpGuide(!showHelpGuide)}
            className="w-full flex items-center justify-between text-[11px] font-bold text-cyan-400 hover:text-cyan-300 py-1 cursor-pointer transition"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              ¿Por qué no puedo entrar? (Haz clic aquí para resolverlo)
            </span>
            <span className="text-xs">{showHelpGuide ? '▲ Cerrar' : '▼ Ver solución'}</span>
          </button>

          {showHelpGuide && (
            <div className="mt-2.5 p-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-[11px] text-slate-300 space-y-2.5 animate-fadeIn">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-white block font-bold">Si es tu primera vez en la aplicación:</strong>
                  <span>
                    No intentes iniciar sesión directamente en "Iniciar Sesión" sin una cuenta previa. Ve a la pestaña{' '}
                    <button
                      type="button"
                      onClick={() => handleSwitchToSignUp(identifier)}
                      className="text-cyan-400 underline font-bold inline hover:text-cyan-300"
                    >
                      "Registrarse"
                    </button>{' '}
                    arriba, escribe tu nombre y contraseña (mínimo 6 caracteres), o usa <strong>Continuar con Google</strong>.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-white block font-bold">¿Quieres probar la aplicación de inmediato sin contraseñas?</strong>
                  <span>
                    Haz <strong>1 solo clic</strong> en cualquiera de los botones de abajo (Lucas, Sofía, Dra. Claudia o Prof. Carlos). Entrarás al instante.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-white block font-bold">Separación estricta de datos (Tu privacidad):</strong>
                  <span>
                    Cada usuario tiene su propio almacén aislado en Firestore. Lo que Lucas suba a su desayuno nunca se mostrará en la cuenta de Sofía ni en la de otros deportistas.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Access Users List (1-Click Login according to user name) */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Acceso rápido por nombre de usuario
            </span>
            <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded-full">
              1 Clic
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
            Selecciona un usuario para ingresar de inmediato a su panel correspondiente y verificar que sus comidas y registros se mantienen completamente separados:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {savedUsers.map((userItem) => {
              const isDemo = userItem.email.includes('rendiplus.demo');
              let emoji = '🥋';
              let badgeColor = 'text-cyan-300';
              if (userItem.role === 'Nutricionista') {
                emoji = '🥗';
                badgeColor = 'text-purple-300';
              } else if (userItem.role === 'Entrenador') {
                emoji = '⏱️';
                badgeColor = 'text-amber-300';
              } else if (userItem.name.toLowerCase().includes('sof')) {
                emoji = '🏊';
                badgeColor = 'text-emerald-300';
              } else {
                emoji = '🏅';
              }

              const isCurrentSelected =
                identifier.toLowerCase() === userItem.username.toLowerCase() ||
                identifier.toLowerCase() === userItem.name.toLowerCase();

              return (
                <button
                  key={userItem.email}
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleSelectUser(userItem)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition disabled:opacity-50 cursor-pointer ${
                    isCurrentSelected
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-sm'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700'
                  }`}
                  title={`Iniciar como ${userItem.name} (${userItem.role})`}
                >
                  <span className="text-base shrink-0">{emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white truncate text-[11px]">
                      {userItem.name}
                    </div>
                    <div className={`text-[10px] truncate ${badgeColor}`}>
                      {userItem.role}
                      {isDemo ? '' : ' • Personal'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  UserProfile,
  DayHabitLog,
  InjuryRecord,
  InjuryStatus,
  InjurySeverity,
  TrainingDuration,
  TrainingIntensity,
  TrainingSchedule,
  AthleteData,
} from '../../types';
import { SportIcon } from '../SportIcons';
import { MoodEmoji } from '../MoodEmojis';

interface CoachScreenProps {
  coachName: string;
  onUpdateCoachName: (name: string) => void;
  athletes: AthleteData[];
  selectedAthleteId: string;
  onSelectAthlete: (id: string) => void;
  athleteProfile: UserProfile | AthleteData;
  todayLog: DayHabitLog;
  logsHistory: Record<string, DayHabitLog>;
  injuries: InjuryRecord[];
  onUpdateInjuries: (injuries: InjuryRecord[]) => void;
  onUpdateAthleteTraining: (updates: Partial<UserProfile>) => void;
  onViewAthleteHome: () => void;
}

export const CoachScreen: React.FC<CoachScreenProps> = ({
  coachName,
  onUpdateCoachName,
  athletes,
  selectedAthleteId,
  onSelectAthlete,
  athleteProfile,
  todayLog,
  logsHistory,
  injuries,
  onUpdateInjuries,
  onUpdateAthleteTraining,
  onViewAthleteHome,
}) => {
  const [activeTab, setActiveTab] = useState<'progreso' | 'lesiones' | 'ajustar_entreno'>('lesiones');
  const [isEditingCoachName, setIsEditingCoachName] = useState(false);
  const [tempCoachName, setTempCoachName] = useState(coachName);

  // Modal / Form state for Editing or Creating an Injury
  const [editingInjury, setEditingInjury] = useState<InjuryRecord | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form Fields
  const [injuryTitle, setInjuryTitle] = useState('');
  const [injuryBodyArea, setInjuryBodyArea] = useState('Rodilla derecha');
  const [injurySeverity, setInjurySeverity] = useState<InjurySeverity>('Leve');
  const [injuryStatus, setInjuryStatus] = useState<InjuryStatus>('En recuperación');
  const [injuryProgress, setInjuryProgress] = useState(70);
  const [injuryDescription, setInjuryDescription] = useState('');
  const [injuryRestrictions, setInjuryRestrictions] = useState('Evitar saltos de impacto alto, Calentamiento articular extra');
  const [injuryTreatment, setInjuryTreatment] = useState('Hielo 15 min post-entreno, trabajo de isometría con banda.');
  const [injuryNotes, setInjuryNotes] = useState('');

  const openCreateModal = () => {
    setIsCreatingNew(true);
    setEditingInjury(null);
    setInjuryTitle('');
    setInjuryBodyArea('Tobillo / Pie');
    setInjurySeverity('Leve');
    setInjuryStatus('Activa');
    setInjuryProgress(20);
    setInjuryDescription('');
    setInjuryRestrictions('Sin patadas con giro');
    setInjuryTreatment('Crioterapia y reposo relativo');
    setInjuryNotes('');
  };

  const openEditModal = (inj: InjuryRecord) => {
    setIsCreatingNew(false);
    setEditingInjury(inj);
    setInjuryTitle(inj.title);
    setInjuryBodyArea(inj.bodyArea);
    setInjurySeverity(inj.severity);
    setInjuryStatus(inj.status);
    setInjuryProgress(inj.recoveryProgress);
    setInjuryDescription(inj.description);
    setInjuryRestrictions(inj.restrictions.join(', '));
    setInjuryTreatment(inj.treatment);
    setInjuryNotes(inj.notes || '');
  };

  const handleSaveInjury = (e: React.FormEvent) => {
    e.preventDefault();
    if (!injuryTitle.trim()) return;

    const restrictionsArray = injuryRestrictions
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);

    if (isCreatingNew) {
      const newInj: InjuryRecord = {
        id: `inj-${Date.now()}`,
        title: injuryTitle.trim(),
        date: new Date().toISOString().split('T')[0],
        bodyArea: injuryBodyArea,
        severity: injurySeverity,
        status: injuryStatus,
        recoveryProgress: Number(injuryProgress),
        description: injuryDescription.trim(),
        restrictions: restrictionsArray,
        treatment: injuryTreatment.trim(),
        notes: injuryNotes.trim(),
      };
      onUpdateInjuries([newInj, ...injuries]);
    } else if (editingInjury) {
      const updatedList = injuries.map((item) => {
        if (item.id === editingInjury.id) {
          return {
            ...item,
            title: injuryTitle.trim(),
            bodyArea: injuryBodyArea,
            severity: injurySeverity,
            status: injuryStatus,
            recoveryProgress: Number(injuryProgress),
            description: injuryDescription.trim(),
            restrictions: restrictionsArray,
            treatment: injuryTreatment.trim(),
            notes: injuryNotes.trim(),
          };
        }
        return item;
      });
      onUpdateInjuries(updatedList);
    }

    setEditingInjury(null);
    setIsCreatingNew(false);
  };

  const handleDeleteInjury = (id: string) => {
    if (window.confirm('¿Deseas eliminar este registro de lesión?')) {
      onUpdateInjuries(injuries.filter((i) => i.id !== id));
      setEditingInjury(null);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-[660px] p-3.5 select-none space-y-3 animate-fadeIn overflow-y-auto max-h-[85vh]">
      {/* Top Banner: Panel Entrenador */}
      <div className="bg-[#99f6e4] border-2 border-[#5eead4] px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-black shadow-2xs text-lg">
            🥋
          </div>
          <div>
            <h2 className="text-teal-950 font-black text-sm md:text-base leading-tight">
              Panel del Entrenador
            </h2>
            {isEditingCoachName ? (
              <div className="flex items-center gap-1 mt-0.5">
                <input
                  type="text"
                  value={tempCoachName}
                  onChange={(e) => setTempCoachName(e.target.value)}
                  placeholder="Tu nombre..."
                  className="bg-white text-xs font-bold text-gray-900 px-1.5 py-0.5 rounded border border-teal-400 w-28"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    onUpdateCoachName(tempCoachName.trim());
                    setIsEditingCoachName(false);
                  }}
                  className="text-[10px] font-bold bg-teal-800 text-white px-1.5 py-0.5 rounded cursor-pointer"
                >
                  OK
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <p className="text-[10px] text-teal-800 font-bold">
                  {coachName || 'Entrenador'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTempCoachName(coachName);
                    setIsEditingCoachName(true);
                  }}
                  className="text-[9px] text-teal-700 hover:text-teal-900 underline cursor-pointer"
                >
                  (cambiar nombre)
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onViewAthleteHome}
          className="text-[11px] font-extrabold text-teal-950 bg-white hover:bg-teal-50 px-2.5 py-1 rounded-xl shadow-2xs border border-teal-300 transition-all cursor-pointer"
          title="Ver aplicación del deportista"
        >
          Vista Deportista →
        </button>
      </div>

      {/* Athlete Selector Bar */}
      {athletes.length > 0 && (
        <div className="bg-[#cbd5e1]/80 px-3 py-2 rounded-2xl border border-white/60 flex items-center justify-between gap-2 shadow-xs">
          <span className="text-[11px] font-black text-gray-800 shrink-0">
            Deportista a consultar:
          </span>
          <select
            value={selectedAthleteId}
            onChange={(e) => onSelectAthlete(e.target.value)}
            className="bg-white text-gray-900 text-xs font-bold rounded-xl px-2.5 py-1 border border-gray-300 focus:ring-2 focus:ring-teal-400 flex-1 truncate cursor-pointer shadow-2xs"
          >
            {athletes.map((ath) => (
              <option key={ath.id} value={ath.id}>
                {ath.name} ({ath.sport.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1.5 bg-[#cbd5e1]/70 p-1 rounded-2xl border border-white/60">
        <button
          type="button"
          onClick={() => setActiveTab('lesiones')}
          className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'lesiones'
              ? 'bg-white text-gray-950 shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Lesiones ({injuries.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('progreso')}
          className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'progreso'
              ? 'bg-white text-gray-950 shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Progreso y Carga
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ajustar_entreno')}
          className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'ajustar_entreno'
              ? 'bg-white text-gray-950 shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Ajustar Entreno
        </button>
      </div>

      {/* TAB 1: GESTIÓN Y EDICIÓN DE LESIONES */}
      {activeTab === 'lesiones' && (
        <div className="space-y-3">
          {/* Header Action: Add Injury */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-gray-900">
              Historial y Estado de Lesiones
            </span>
            <button
              type="button"
              onClick={openCreateModal}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span>+</span> Registrar Lesión
            </button>
          </div>

          {/* Injuries List */}
          <div className="space-y-2.5">
            {injuries.length === 0 ? (
              <div className="bg-white/80 p-4 rounded-2xl text-center text-xs text-gray-600 border border-gray-200">
                El deportista no tiene lesiones registradas actualmente.
              </div>
            ) : (
              injuries.map((inj) => {
                const statusStyles: Record<InjuryStatus, { badge: string; text: string }> = {
                  Activa: { badge: 'bg-rose-100 text-rose-800 border-rose-300', text: 'Activa' },
                  'En recuperación': {
                    badge: 'bg-amber-100 text-amber-800 border-amber-300',
                    text: 'En Recuperación',
                  },
                  'Dada de alta': {
                    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                    text: 'Dada de Alta',
                  },
                };

                return (
                  <div
                    key={inj.id}
                    className="bg-[#f5eedc] border border-[#e4dcbf] rounded-3xl p-3.5 shadow-xs space-y-2 relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${statusStyles[inj.status].badge}`}
                          >
                            {statusStyles[inj.status].text}
                          </span>
                          <span className="text-[10px] font-bold text-gray-600 bg-white px-2 py-0.5 rounded-md">
                            {inj.bodyArea} • {inj.severity}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-gray-950 leading-tight">
                          {inj.title}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => openEditModal(inj)}
                        className="px-2.5 py-1 bg-white hover:bg-amber-50 text-gray-900 font-extrabold text-[11px] rounded-lg border border-gray-300 shadow-2xs cursor-pointer"
                      >
                        Editar ✏️
                      </button>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">
                      {inj.description}
                    </p>

                    {/* Recovery Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                        <span className="text-gray-700">Avance de Recuperación</span>
                        <span className="text-teal-900 font-black">{inj.recoveryProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            inj.recoveryProgress >= 90
                              ? 'bg-emerald-500'
                              : inj.recoveryProgress >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${inj.recoveryProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Restrictions */}
                    {inj.restrictions.length > 0 && (
                      <div className="bg-rose-50 border border-rose-200 p-2 rounded-xl text-[11px] text-rose-950">
                        <strong>Restricciones de combate:</strong> {inj.restrictions.join(' • ')}
                      </div>
                    )}

                    {/* Treatment / Physio */}
                    {inj.treatment && (
                      <div className="bg-sky-50 border border-sky-200 p-2 rounded-xl text-[11px] text-sky-950">
                        <strong>Fisioterapia / Cuidado:</strong> {inj.treatment}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Injury Prevention Quick Tips */}
          <div className="bg-[#cbd5e1]/70 p-3 rounded-2xl border border-white/60 space-y-1.5">
            <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              <span>🛡️</span> Protocolo de Prevención de Lesiones en Tatami
            </span>
            <ul className="text-xs text-gray-800 space-y-1 pl-1">
              <li>• Calentamiento articular de 12 minutos con énfasis en dorsiflexión de tobillo.</li>
              <li>• Vendaje neuromuscular preventivo en días de combate de alta intensidad.</li>
              <li>• 10 minutos de vuelta a la calma con estiramiento asistido de isquiotibiales.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: PROGRESO Y CARGA DE ENTRENAMIENTO */}
      {activeTab === 'progreso' && (
        <div className="space-y-3">
          {/* Athlete Profile Card */}
          <div className="bg-[#f5eedc] border border-[#e4dcbf] rounded-3xl p-3.5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-200 border-2 border-amber-400 flex items-center justify-center shadow-xs">
                <SportIcon sport={athleteProfile.sport} size={36} className="text-gray-900" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider block">
                  Deportista
                </span>
                <h3 className="text-base font-black text-gray-950 leading-tight">
                  {athleteProfile.name || 'Deportista'}
                </h3>
                <p className="text-[11px] font-bold text-gray-700">
                  {athleteProfile.sport.toUpperCase()} {athleteProfile.sport === 'taekwondo' ? `• Cinta ${athleteProfile.beltColor}` : ''} • {athleteProfile.habitualIntensity} Intensidad
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-teal-100 text-teal-900 text-[10px] font-black px-2.5 py-1 rounded-full border border-teal-300">
                {athleteProfile.weeklyFrequency} sesiones / sem
              </span>
            </div>
          </div>

          {/* Today's Training & Readiness Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-amber-100/90 border border-amber-300 p-2.5 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-amber-900 block">Entrenamiento Hoy</span>
              <span className="text-lg font-black text-gray-950 my-0.5 block">
                {todayLog.trainingHours} hrs
              </span>
              <span className="text-[9px] font-extrabold text-emerald-800">
                {todayLog.trainingCompleted ? '✓ Completado' : '○ Pendiente'}
              </span>
            </div>

            <div className="bg-purple-100/90 border border-purple-300 p-2.5 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-purple-900 block">Sueño Registrado</span>
              <span className="text-lg font-black text-gray-950 my-0.5 block">
                {todayLog.sleepHours} hrs
              </span>
              <span className="text-[9px] font-extrabold text-purple-900">
                Recuperación {todayLog.restQuality || 'Buena'}
              </span>
            </div>

            <div className="bg-sky-100/90 border border-sky-300 p-2.5 rounded-2xl text-center flex flex-col items-center justify-between">
              <span className="text-[10px] font-bold text-sky-900 block">Estado Anímico</span>
              {todayLog.mood ? (
                <MoodEmoji mood={todayLog.mood} size={30} />
              ) : (
                <span className="text-xs font-bold text-gray-600">Neutral</span>
              )}
              <span className="text-[9px] font-extrabold text-sky-900 capitalize">
                {todayLog.mood || 'Listo'}
              </span>
            </div>
          </div>

          {/* Weekly Training History */}
          <div className="bg-[#f5eedc] border border-[#e4dcbf] rounded-3xl p-3.5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-900">
                Registro de Sesiones (Semana Septiembre 2026)
              </span>
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                5 de 5 días
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              {Object.values(logsHistory).map((log) => (
                <div
                  key={log.date}
                  className="flex items-center justify-between bg-white/80 px-3 py-1.5 rounded-xl border border-gray-200"
                >
                  <span className="font-bold text-gray-800">{log.date}</span>
                  <span className="text-gray-700 font-medium">
                    🥋 {log.trainingHours} hrs entreno • 😴 {log.sleepHours} hrs sueño
                  </span>
                  <span className="font-black text-emerald-700">✓ Realizado</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AJUSTAR PLAN DE ENTRENAMIENTO */}
      {activeTab === 'ajustar_entreno' && (
        <div className="space-y-3">
          <div className="bg-[#f5eedc] border border-[#e4dcbf] p-3.5 rounded-3xl shadow-xs space-y-3">
            <span className="text-xs font-black text-gray-900 block">
              Ajustes de Parámetros Deportivos para {athleteProfile.name}
            </span>

            {/* Frecuencia semanal */}
            <div>
              <label className="text-[11px] font-bold text-gray-800 block mb-1">
                Frecuencia semanal programada
              </label>
              <div className="grid grid-cols-7 gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                  const isSelected = athleteProfile.weeklyFrequency === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onUpdateAthleteTraining({ weeklyFrequency: num })}
                      className={`py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-400'
                          : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {num} d
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duración por sesión */}
            <div>
              <label className="text-[11px] font-bold text-gray-800 block mb-1">
                Duración por sesión de entrenamiento
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Menos de 1 hora', '1 a 2 horas', 'Más de 2 horas'] as TrainingDuration[]).map(
                  (dur) => {
                    const isSelected = athleteProfile.sessionDuration === dur;
                    return (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => onUpdateAthleteTraining({ sessionDuration: dur })}
                        className={`py-2 px-1 text-center text-xs font-bold rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {dur}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Intensidad habitual */}
            <div>
              <label className="text-[11px] font-bold text-gray-800 block mb-1">
                Intensidad técnica habitual
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Baja', 'Moderada', 'Alta'] as TrainingIntensity[]).map((intensity) => {
                  const isSelected = athleteProfile.habitualIntensity === intensity;
                  return (
                    <button
                      key={intensity}
                      type="button"
                      onClick={() => onUpdateAthleteTraining({ habitualIntensity: intensity })}
                      className={`py-2 px-1 text-center text-xs font-bold rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {intensity}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Horario habitual */}
            <div>
              <label className="text-[11px] font-bold text-gray-800 block mb-1">
                Turno de entrenamiento
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Mañana', 'Tarde', 'Noche'] as TrainingSchedule[]).map((sched) => {
                  const isSelected = athleteProfile.habitualSchedule === sched;
                  return (
                    <button
                      key={sched}
                      type="button"
                      onClick={() => onUpdateAthleteTraining({ habitualSchedule: sched })}
                      className={`py-2 px-1 text-center text-xs font-bold rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {sched}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR / EDITAR LESIÓN */}
      {(isCreatingNew || editingInjury) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#fdfbf7] rounded-3xl max-w-sm w-full p-5 shadow-2xl border-4 border-teal-400 text-gray-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-black text-base text-teal-950">
                {isCreatingNew ? 'Registrar Nueva Lesión' : 'Editar Registro de Lesión'}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingInjury(null);
                }}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveInjury} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                  Diagnóstico / Título de la lesión
                </label>
                <input
                  type="text"
                  value={injuryTitle}
                  onChange={(e) => setInjuryTitle(e.target.value)}
                  placeholder="Ej. Contractura de isquiotibial derecho"
                  required
                  className="w-full p-2 text-xs font-bold rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                    Zona anatómica
                  </label>
                  <input
                    type="text"
                    value={injuryBodyArea}
                    onChange={(e) => setInjuryBodyArea(e.target.value)}
                    className="w-full p-2 text-xs font-bold rounded-xl border border-gray-300 bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                    Severidad
                  </label>
                  <select
                    value={injurySeverity}
                    onChange={(e) => setInjurySeverity(e.target.value as InjurySeverity)}
                    className="w-full p-2 text-xs font-bold rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="Leve">Leve</option>
                    <option value="Moderada">Moderada</option>
                    <option value="Grave">Grave</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                    Estado clínico
                  </label>
                  <select
                    value={injuryStatus}
                    onChange={(e) => setInjuryStatus(e.target.value as InjuryStatus)}
                    className="w-full p-2 text-xs font-bold rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="Activa">Activa</option>
                    <option value="En recuperación">En recuperación</option>
                    <option value="Dada de alta">Dada de alta</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                    Avance: {injuryProgress}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={injuryProgress}
                    onChange={(e) => setInjuryProgress(Number(e.target.value))}
                    className="w-full accent-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                  Descripción clínica del incidente
                </label>
                <textarea
                  rows={2}
                  value={injuryDescription}
                  onChange={(e) => setInjuryDescription(e.target.value)}
                  placeholder="Detallar cuándo y cómo ocurrió durante el combate..."
                  className="w-full p-2 text-xs font-medium rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                  Restricciones de entrenamiento (separadas por coma)
                </label>
                <input
                  type="text"
                  value={injuryRestrictions}
                  onChange={(e) => setInjuryRestrictions(e.target.value)}
                  placeholder="Sin saltos, evitar impacto directo..."
                  className="w-full p-2 text-xs font-medium rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                  Tratamiento prescrito / Fisioterapia
                </label>
                <input
                  type="text"
                  value={injuryTreatment}
                  onChange={(e) => setInjuryTreatment(e.target.value)}
                  placeholder="Hielo, electroestimulación, movilidad..."
                  className="w-full p-2 text-xs font-medium rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Guardar Lesión
                </button>
                {!isCreatingNew && editingInjury && (
                  <button
                    type="button"
                    onClick={() => handleDeleteInjury(editingInjury.id)}
                    className="px-3 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { UserProfile } from '../types';
import { RANKS, MODULES, MODULE_XP_REQUIREMENTS, getUnlockedModuleIds } from '../constants';
import { Trophy, BookOpen, LogOut, Star, CheckCircle2, Lock, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  user: UserProfile;
  activeModuleId: number;
  onLogout: () => void;
  onModuleChange: (moduleId: number) => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeModuleId, onLogout, onModuleChange, onClose }) => {
  const currentRankIdx = RANKS.findIndex(r => r.title === user.rank);
  const currentRank    = RANKS[currentRankIdx] || RANKS[0];
  const nextRank       = RANKS[currentRankIdx + 1];

  const progressPercent = nextRank
    ? Math.min(((user.xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100, 100)
    : 100;

  const unlockedModuleIds = getUnlockedModuleIds(user.xp, user.completedModules);

  return (
    <div className="w-72 lg:w-80 h-full glass-dark text-slate-300 flex flex-col z-20 shadow-[20px_0_50px_rgba(0,0,0,0.2)]">
      
      {/* ── User Header ── */}
      <div className="p-6 lg:p-8 border-b border-white/5 relative overflow-hidden">
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors z-20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}
        <div className="absolute top-0 right-0 w-32 h-32 bg-medical-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-medical-500/40 border border-white/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="text-white font-display font-bold text-lg truncate leading-none mb-1.5">{user.name}</h2>
            <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/5 text-medical-400 text-[10px] font-black uppercase tracking-[0.1em] border border-white/10">
              {user.rank}
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between text-[10px] font-black tracking-widest uppercase text-slate-500">
            <span>{user.xp.toLocaleString()} XP</span>
            <span>{nextRank ? `${nextRank.minXp.toLocaleString()} XP` : 'MAX LEVEL'}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full bg-gradient-to-r from-medical-600 via-medical-400 to-medical-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)]"
            />
          </div>
          {nextRank && (
            <p className="text-[10px] text-slate-500 font-medium italic opacity-80">
              Faltan <span className="text-medical-400 font-bold">{(nextRank.minXp - user.xp).toLocaleString()} XP</span> para {nextRank.title}
            </p>
          )}
        </div>
      </div>

      {/* ── Module List ── */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
        <div className="px-4 mb-4 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Programa Académico</span>
          <span className="text-[9px] px-2 py-0.5 rounded-lg bg-white/5 text-slate-400 border border-white/10 font-bold">{user.level}</span>
        </div>

        {MODULES.map((module) => {
          const isCompleted = user.completedModules.includes(module.id);
          const isUnlocked  = unlockedModuleIds.includes(module.id);
          const isActive    = module.id === activeModuleId;
          const isBonus     = module.id === 11 || module.id === 12;
          const xpRequired  = MODULE_XP_REQUIREMENTS[module.id] ?? 0;
          const xpMissing   = Math.max(0, xpRequired - user.xp);
          const prevId      = module.id - 1;
          const lockedMsg   = isBonus ? `${xpMissing} XP` : `M${prevId} pendiente`;

          const IconComp = isBonus ? Star
            : isCompleted ? CheckCircle2
            : isActive    ? PlayCircle
            : isUnlocked  ? BookOpen
            : Lock;

          return (
            <button
              key={module.id}
              disabled={!isUnlocked}
              onClick={() => onModuleChange(module.id)}
              className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all group relative border-2 ${
                isActive 
                  ? 'bg-medical-600/10 text-white border-medical-500/40 shadow-lg shadow-medical-500/5' 
                  : isUnlocked 
                    ? 'hover:bg-white/5 text-slate-400 hover:text-slate-100 border-transparent' 
                    : 'opacity-40 cursor-not-allowed text-slate-600 border-transparent'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute -left-1 w-1.5 h-8 bg-medical-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.8)]"
                />
              )}
              
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isActive 
                  ? 'bg-medical-600 text-white shadow-xl shadow-medical-500/30 scale-110' 
                  : isCompleted 
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                    : isUnlocked 
                      ? 'bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-300 border border-white/5' 
                      : 'bg-slate-900/50 text-slate-700 border border-white/5'
              }`}>
                <IconComp size={18} className={isActive ? 'animate-pulse' : ''} />
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className={`text-sm font-bold truncate tracking-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {module.id}. {module.title}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {isCompleted ? (
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                      <CheckCircle2 size={8} /> Completado
                    </span>
                  ) : isActive ? (
                    <span className="text-[9px] font-black text-medical-400 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-medical-500 rounded-full animate-ping" /> En curso
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Disponible</span>
                  ) : (
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                      <Lock size={8} /> {lockedMsg}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div className="p-6 border-t border-white/5 bg-slate-900/40 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-default group">
            <Trophy size={18} className="text-amber-500 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-white font-black text-lg leading-none">{user.badges.length}</span>
            <span className="text-[9px] text-slate-500 uppercase font-black mt-1.5 tracking-widest">Badges</span>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-default group">
            <BookOpen size={18} className="text-medical-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-white font-black text-lg leading-none">{user.completedModules.length}</span>
            <span className="text-[9px] text-slate-500 uppercase font-black mt-1.5 tracking-widest">Módulos</span>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2.5 p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all text-xs font-black uppercase tracking-widest"
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

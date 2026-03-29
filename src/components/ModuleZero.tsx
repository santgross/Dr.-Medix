import React, { useState } from 'react';
import { UserProfile, UserLevel } from '../types';
import {
  ArrowRight, CheckCircle2,
  Sparkles, Trophy, Zap, ChevronRight, Star, Lock, Info, Target, Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModuleZeroProps {
  user: UserProfile;
  onComplete: (updatedUser: UserProfile) => void;
}

const CARDS_NOVATO = [
  { icon: Layout, title: '¿Qué es MENTORA EDUCA?', text: 'Tu puerta de entrada a la industria farmacéutica en Ecuador. El Dr. Medix — tu mentor con IA — te guiará desde los fundamentos hasta tu primera certificación. No necesitas experiencia previa.', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Target, title: '¿Cómo vas a aprender?', text: 'Microlecciones de 1–3 min, casos clínicos reales del Ecuador, simulaciones de visita médica, tarjetas tipo Anki y un mentor IA disponible 24/7 que se adapta a tu ritmo.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: Globe, title: 'La industria te espera', text: 'Más de 8.000 visitadores médicos trabajan en Ecuador. Laboratorios como Bayer, Pfizer, LIFE y Difare contratan continuamente. Salario de entrada: $800–$1.500/mes + comisiones.', color: 'text-amber-500', bg: 'bg-amber-50' },
  { icon: Sparkles, title: 'Primer paso: Diagnóstico', text: 'Haré un diagnóstico rápido de tus conocimientos actuales. No califica — solo me permite ajustar tu ruta para que aprendas exactamente lo que necesitas, al ritmo correcto.', color: 'text-purple-500', bg: 'bg-purple-50' },
];

const CARDS_EXPERIMENTADO = [
  { icon: Trophy, title: 'Bienvenido a la Ruta Pro', text: 'Diseñada para visitadores con experiencia que buscan el siguiente nivel: KAM, Gerente de Producto, especialista terapéutico o acceso a laboratorios multinacionales.', color: 'text-medical-600', bg: 'bg-medical-50' },
  { icon: Zap, title: 'Contenido avanzado real', text: 'Lectura crítica de ensayos clínicos, modelo Challenger Sale, farmaceconomía para comités IESS/MSP, psicología cognitiva avanzada y simulaciones con perfiles reales.', color: 'text-amber-500', bg: 'bg-amber-50' },
  { icon: Building2, title: 'El mercado Pro en Ecuador', text: 'KAMs ganan $2.500–$5.000/mes + vehículo + seguro. Gerentes de Producto en multinacionales: $3.000–$6.000/mes. Laboratorios Bagó, Eurofarma y Roche buscan perfiles certificados.', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Target, title: 'Tu Diagnóstico Avanzado', text: 'El diagnóstico PRO evalúa tu nivel en: estrategia de territorio, farmacología avanzada y ética profesional. Con los resultados diseñamos exactamente qué profundizar.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

// Re-using the diagnostic data from the previous version but with better UI
import { Building2, Globe } from 'lucide-react';

const DIAGNOSTIC_NOVATO = [
  { title: 'Ecosistema Farmacéutico Ecuador', questions: [
    { text: '¿Cuál es la función principal de un Visitador Médico en Ecuador?', options: [
      { text: 'Educar a médicos sobre productos farmacéuticos con información científica veraz', points: 4 },
      { text: 'Vender medicamentos directamente al público en farmacias', points: 0 },
      { text: 'Distribuir productos a hospitales y bodegas del MSP', points: 1 },
    ]},
    { text: '¿Qué entidad otorga los registros sanitarios a medicamentos en Ecuador?', options: [
      { text: 'El Ministerio de Salud Pública (MSP)', points: 2 },
      { text: 'El IESS (Instituto Ecuatoriano de Seguridad Social)', points: 0 },
      { text: 'ARCSA (Agencia Nacional de Regulación, Control y Vigilancia Sanitaria)', points: 4 },
    ]},
    { text: '¿Qué es el CNMB en Ecuador?', options: [
      { text: 'Un certificado de estudios médicos para visitadores', points: 0 },
      { text: 'El Cuadro Nacional de Medicamentos Básicos — lista de medicamentos esenciales del MSP', points: 4 },
      { text: 'Un sistema de compras centralizado del IESS', points: 1 },
    ]},
  ]},
  { title: 'Farmacología y Ciencias Básicas', questions: [
    { text: '"Farmacocinética" estudia principalmente:', options: [
      { text: 'Cómo el medicamento actúa sobre los receptores del cuerpo', points: 0 },
      { text: 'Cómo el cuerpo procesa un medicamento: absorción, distribución, metabolismo y excreción', points: 4 },
      { text: 'La comparación de precios entre medicamentos del mercado', points: 0 },
    ]},
    { text: '¿Qué significa que un medicamento sea "genérico"?', options: [
      { text: 'Es un medicamento de menor calidad fabricado localmente', points: 0 },
      { text: 'Es un medicamento sin registro sanitario aprobado', points: 0 },
      { text: 'Es una copia del original cuya patente expiró, con bioequivalencia demostrada', points: 4 },
    ]},
  ]},
];

const DIAGNOSTIC_EXPERIMENTADO = [
  { title: 'Estrategia de Territorio y KPIs', questions: [
    { text: 'Alto volumen de pacientes pero prescribe solo a la competencia. ¿En qué cuadrante está y qué estrategia aplicas?', options: [
      { text: 'Cuadrante 1 (Estrella) — mantenerlo con visitas frecuentes de refuerzo', points: 0 },
      { text: 'Cuadrante 4 (Bajo rendimiento) — reasignar el tiempo a médicos más rentables', points: 0 },
      { text: 'Cuadrante 2 (Objetivo Prioritario) — convertirlo identificando su barrera específica de adopción', points: 4 },
    ]},
    { text: 'Tu tasa de conversión C2→C1 tarda 10 visitas cuando el benchmark es 5. ¿Qué analiza primero?', options: [
      { text: 'Si el mensaje, la selección de paciente ideal o el perfil DISC está desalineado con mi enfoque', points: 4 },
      { text: 'Que mis médicos de territorio son más difíciles que el promedio de la industria', points: 0 },
      { text: 'Que necesito más muestras y materiales de impacto visual', points: 1 },
    ]},
  ]},
  { title: 'Farmacología Avanzada y Evidencia Clínica', questions: [
    { text: 'Un médico señala que el EMPA-REG tiene limitaciones porque el 99% tenía ECV establecida. ¿Qué responde el visitador experto?', options: [
      { text: '"No, el diseño del estudio es sólido y sus resultados son concluyentes para todos los perfiles"', points: 0 },
      { text: '"Tiene razón, es una limitación real. Para prevención primaria, el DECLARE-TIMI 58 mostró HR 0,73 para hospitalizaciones por IC"', points: 4 },
      { text: 'Cambias de tema hacia los beneficios cardiovasculares sin responder la objeción', points: 0 },
    ]},
  ]},
];

function getResults(score: number, maxScore: number, isPro: boolean) {
  const pct = Math.round((score / maxScore) * 100);
  if (isPro) {
    if (pct >= 80) return { title: 'Nivel Experto Confirmado', emoji: '🏆', msg: 'Dominas los conceptos avanzados. Tu Ruta Pro se enfocará en los módulos de mayor valor estratégico para tu carrera.', xpBonus: 400, badge: '🏆 Visitador Senior' };
    if (pct >= 55) return { title: 'Sólido con brechas específicas', emoji: '💼', msg: 'Buena base en estrategia y farmacología. Tu Ruta Pro irá directo a las áreas donde más puedes crecer.', xpBonus: 250, badge: '💼 Profesional en Ascenso' };
    return { title: 'Experiencia + formación = diferencia', emoji: '⚡', msg: 'Tu experiencia práctica es valiosa. El programa te dará el framework teórico avanzado que potenciará lo que ya sabes.', xpBonus: 150, badge: '⚡ Potencial Alto' };
  } else {
    if (pct >= 75) return { title: '¡Excelente base de conocimientos!', emoji: '🌟', msg: 'Tienes un conocimiento inicial muy sólido. Tu ruta Novato incluirá desafíos adicionales desde el M1.', xpBonus: 150, badge: '🌟 Talento Natural' };
    if (pct >= 45) return { title: 'Buen punto de partida', emoji: '📚', msg: 'Tienes conocimientos básicos en varias áreas. Tu ruta Novato te llevará paso a paso por todo lo que necesitas.', xpBonus: 75, badge: '📚 Estudiante Motivado' };
    return { title: 'El viaje empieza aquí', emoji: '🚀', msg: 'Estás en el lugar correcto. Tu ruta Novato está diseñada exactamente para ti — construiremos todo desde cero con solidez.', xpBonus: 50, badge: '🚀 Nuevo en el Campo' };
  }
}

const ModuleZero: React.FC<ModuleZeroProps> = ({ user, onComplete }) => {
  const [stage, setStage] = useState<'welcome'|'cards'|'intro'|'diagnostic'|'results'>('welcome');
  const [currentCard, setCurrentCard] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number|null>(null);
  const [answered, setAnswered] = useState(false);

  const isPro = user.level === UserLevel.EXPERIMENTADO;
  const cards = isPro ? CARDS_EXPERIMENTADO : CARDS_NOVATO;
  const diagnostic = isPro ? DIAGNOSTIC_EXPERIMENTADO : DIAGNOSTIC_NOVATO;

  const allQuestions = diagnostic.flatMap(s => s.questions);
  const maxScore = allQuestions.reduce((acc, q) => acc + Math.max(...q.options.map(o => o.points)), 0);
  const currentSectionData = diagnostic[currentSection];
  const currentQuestionData = currentSectionData?.questions[currentQuestion];
  const totalAnswered = diagnostic.slice(0, currentSection).reduce((a, s) => a + s.questions.length, 0) + currentQuestion;
  const totalQ = allQuestions.length;
  const progress = Math.round((totalAnswered / totalQ) * 100);

  const handleAnswer = (idx: number, points: number) => {
    if (answered) return;
    setSelectedIdx(idx);
    setAnswered(true);
    setScore(p => p + points);
    setTimeout(() => {
      setSelectedIdx(null); setAnswered(false);
      const nextQ = currentQuestion + 1;
      if (nextQ < currentSectionData.questions.length) {
        setCurrentQuestion(nextQ);
      } else {
        const nextS = currentSection + 1;
        if (nextS < diagnostic.length) { setCurrentSection(nextS); setCurrentQuestion(0); }
        else setStage('results');
      }
    }, 1150);
  };

  const handleComplete = () => {
    const results = getResults(score, maxScore, isPro);
    onComplete({ ...user, xp: user.xp + results.xpBonus, completedModules: [0], badges: [results.badge] });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-medical-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <AnimatePresence mode="wait">
        {/* WELCOME */}
        {stage === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-xl lg:max-w-2xl glass-dark p-6 sm:p-12 rounded-[2rem] sm:rounded-[3rem] text-center shadow-2xl relative z-10 border border-white/10"
          >
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-6 sm:mb-10">
              <div className="absolute inset-0 bg-medical-500 blur-2xl opacity-20 animate-pulse" />
              <div className="relative w-full h-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-medical-500 to-blue-600 flex items-center justify-center text-white text-4xl sm:text-5xl shadow-2xl border border-white/20">
                {isPro ? '🏆' : '👋'}
              </div>
            </div>

            <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/5 text-medical-400 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] mb-4 sm:mb-6 border border-white/10 backdrop-blur-md">
              {isPro ? 'Ruta Profesional Avanzada' : 'Ruta de Fundamentos'}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white mb-4 sm:mb-6 tracking-tight leading-none">
              Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-400 to-blue-400">{user.name.split(' ')[0]}</span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8 sm:mb-12 font-medium">
              {isPro
                ? 'Tu diagnóstico avanzado está listo. En unos minutos tendremos un mapa preciso de dónde estás y hacia dónde vas.'
                : 'Tu programa personalizado comienza aquí. Primero te presento MENTORA EDUCA, luego haré un diagnóstico rápido para ajustar tu ruta.'}
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12">
              {[
                { label: 'Preguntas', value: isPro ? '11' : '13', icon: Info },
                { label: 'Áreas', value: '3', icon: Layout },
                { label: 'Tiempo', value: isPro ? '~8m' : '~6m', icon: Zap }
              ].map(stat => (
                <div key={stat.label} className="bg-white/5 p-3 sm:p-5 rounded-2xl sm:rounded-[2rem] border border-white/5 hover:bg-white/10 transition-colors group">
                  <div className="text-white font-black text-xl sm:text-2xl leading-none mb-1 sm:mb-2 group-hover:scale-110 transition-transform">{stat.value}</div>
                  <div className="text-[8px] sm:text-[10px] text-slate-500 uppercase font-black tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>

            <button onClick={() => setStage('cards')} className="btn-primary w-full py-4 sm:py-6 text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl shadow-2xl shadow-medical-500/20 group">
              Comenzar Experiencia <ArrowRight size={20} className="sm:hidden group-hover:translate-x-1 transition-transform" />
              <ArrowRight size={24} className="hidden sm:block group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {/* CARDS */}
        {stage === 'cards' && (
          <motion.div
            key="cards"
            initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-2xl lg:max-w-3xl relative z-10"
          >
            <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-10">
              {cards.map((_, i) => (
                <div key={i} className={`h-1.5 sm:h-2 rounded-full transition-all duration-700 ${i === currentCard ? 'w-8 sm:w-12 bg-medical-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : i < currentCard ? 'w-4 sm:w-6 bg-medical-900' : 'w-2 sm:w-3 bg-white/10'}`} />
              ))}
            </div>

            <div className="glass-card rounded-[2rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/10">
              <div className="bg-gradient-to-r from-medical-600 to-blue-700 p-6 sm:p-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 relative overflow-hidden text-center sm:text-left">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white shrink-0 border border-white/20 shadow-2xl">
                  {React.createElement(cards[currentCard].icon, { size: 40, className: "sm:hidden animate-float" })}
                  {React.createElement(cards[currentCard].icon, { size: 48, className: "hidden sm:block animate-float" })}
                </div>
                <h3 className="relative text-2xl sm:text-3xl font-display font-black text-white leading-tight tracking-tight">{cards[currentCard].title}</h3>
              </div>
              <div className="p-6 sm:p-12 bg-black/40 backdrop-blur-xl">
                <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-8 sm:mb-12 font-medium text-center sm:text-left">{cards[currentCard].text}</p>
                <button 
                  onClick={() => currentCard === cards.length - 1 ? setStage('intro') : setCurrentCard(c => c + 1)}
                  className="btn-primary w-full py-4 sm:py-6 text-lg sm:text-xl font-black rounded-2xl sm:rounded-[2rem] shadow-xl shadow-medical-500/20 group"
                >
                  {currentCard === cards.length - 1 ? 'Iniciar Diagnóstico' : 'Continuar'}
                  <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* INTRO */}
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            className="w-full max-w-xl lg:max-w-2xl glass-dark rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl p-6 sm:p-12 relative z-10 border border-white/10"
          >
            <div className="text-center mb-8 sm:mb-12">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-medical-500/20 blur-2xl rounded-full" />
                <div className="relative w-full h-full rounded-2xl sm:rounded-[2rem] bg-white/5 text-medical-400 flex items-center justify-center border border-white/10 shadow-inner backdrop-blur-xl">
                  <Target size={40} className="sm:hidden animate-pulse-slow" />
                  <Target size={48} className="hidden sm:block animate-pulse-slow" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-3 sm:mb-4 tracking-tight">Diagnóstico de Nivel</h2>
              <p className="text-slate-400 text-base sm:text-lg font-medium">Evaluaremos tu conocimiento en estas áreas clave para personalizar tu ruta.</p>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
              {diagnostic.map((s, i) => (
                <div key={i} className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center text-medical-400 font-black text-base sm:text-xl border border-white/10 shadow-sm group-hover:scale-110 transition-transform">
                    {s.questions.length}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-white text-base sm:text-lg tracking-tight">{s.title}</h4>
                    <p className="text-[9px] sm:text-[11px] text-slate-500 uppercase font-black tracking-[0.2em] mt-0.5 sm:mt-1">Módulo de Evaluación</p>
                  </div>
                  <Lock size={16} className="sm:hidden text-slate-600" />
                  <Lock size={18} className="hidden sm:block text-slate-600" />
                </div>
              ))}
            </div>

            <button onClick={() => setStage('diagnostic')} className="btn-primary w-full py-4 sm:py-6 text-lg sm:text-xl font-black rounded-2xl sm:rounded-[2rem] shadow-2xl shadow-medical-500/30 group">
              <Zap size={24} className="animate-pulse" /> Empezar Ahora
            </button>
          </motion.div>
        )}

        {/* DIAGNOSTIC */}
        {stage === 'diagnostic' && currentQuestionData && (
          <motion.div
            key="diagnostic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-3xl lg:max-w-4xl flex flex-col h-full max-h-[900px] relative z-10"
          >
            <div className="mb-6 sm:mb-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
                <div>
                  <span className="text-[9px] sm:text-[11px] font-black text-medical-400 uppercase tracking-[0.3em] mb-1 sm:mb-2 block">{currentSectionData.title}</span>
                  <h3 className="text-white font-display font-black text-2xl sm:text-3xl tracking-tight">Evaluación de Conocimiento</h3>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white/10">
                  <span className="text-white font-mono text-base sm:text-lg font-bold">{totalAnswered + 1} <span className="text-white/30">/</span> {totalQ}</span>
                </div>
              </div>
              <div className="h-2.5 sm:h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-medical-500 to-blue-500 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)]"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={totalAnswered}
                  initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="space-y-6 sm:space-y-10"
                >
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-black text-white leading-[1.1] tracking-tight">
                    {currentQuestionData.text}
                  </h2>

                  <div className="grid gap-3 sm:gap-4">
                    {currentQuestionData.options.map((opt, idx) => {
                      const correctIdx = currentQuestionData.options.findIndex(o => o.points >= 4);
                      const isCorrect = idx === correctIdx;
                      const isSelected = idx === selectedIdx;
                      
                      let stateCls = "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:translate-x-2";
                      if (answered) {
                        if (isCorrect) stateCls = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 scale-[1.02] shadow-lg shadow-emerald-500/20";
                        else if (isSelected) stateCls = "bg-red-500/20 border-red-500/50 text-red-400 scale-[0.98]";
                        else stateCls = "bg-white/5 border-white/5 text-white/20 opacity-40";
                      } else if (isSelected) {
                        stateCls = "bg-medical-500/20 border-medical-500/50 text-medical-400 translate-x-2";
                      }

                      return (
                        <button
                          key={idx}
                          disabled={answered}
                          onClick={() => handleAnswer(idx, opt.points)}
                          className={`w-full p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border-2 text-left transition-all duration-300 flex items-start gap-4 sm:gap-6 group ${stateCls}`}
                        >
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 font-black text-base sm:text-lg transition-all duration-300 ${
                            answered && isCorrect ? 'bg-emerald-500 text-white rotate-12' : 
                            answered && isSelected && !isCorrect ? 'bg-red-500 text-white' : 
                            'bg-white/10 text-white/50 group-hover:bg-white/20 group-hover:scale-110'
                          }`}>
                            {answered && isCorrect ? <CheckCircle2 size={20} className="sm:hidden" /> : null}
                            {answered && isCorrect ? <CheckCircle2 size={24} className="hidden sm:block" /> : null}
                            {!answered || !isCorrect ? String.fromCharCode(65 + idx) : null}
                          </div>
                          <span className="text-lg sm:text-xl font-bold pt-1 sm:pt-2 leading-snug tracking-tight">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* RESULTS */}
        {stage === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-xl lg:max-w-2xl glass-dark rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl overflow-hidden relative z-10 border border-white/10"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-medical-600 to-blue-700 p-8 sm:p-14 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-white rounded-full blur-[80px] animate-pulse-slow" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
              </div>
              
              <motion.div 
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.3 }}
                className="text-6xl sm:text-8xl mb-4 sm:mb-8 drop-shadow-2xl"
              >
                {getResults(score, maxScore, isPro).emoji}
              </motion.div>
              <h2 className="text-3xl sm:text-4xl font-display font-black mb-2 sm:mb-4 tracking-tight leading-none">{getResults(score, maxScore, isPro).title}</h2>
              <p className="text-white/80 text-base sm:text-lg font-medium leading-relaxed max-w-sm mx-auto">{getResults(score, maxScore, isPro).msg}</p>
            </div>

            <div className="p-6 sm:p-12 space-y-6 sm:space-y-10 bg-black/40 backdrop-blur-xl">
              {/* Score bar */}
              <div>
                <div className="flex justify-between items-end mb-2 sm:mb-4">
                  <span className="text-[9px] sm:text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Desempeño Global</span>
                  <span className="text-3xl sm:text-5xl font-display font-black text-medical-400 tracking-tighter">{Math.round((score / maxScore) * 100)}%</span>
                </div>
                <div className="h-3 sm:h-4 bg-white/5 rounded-full overflow-hidden p-0.5 sm:p-1 border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((score / maxScore) * 100)}%` }}
                    transition={{ duration: 2, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-medical-500 to-blue-500 rounded-full shadow-lg shadow-medical-500/20"
                  />
                </div>
                <div className="flex justify-between mt-2 sm:mt-3 text-[9px] sm:text-[11px] font-black text-slate-600 uppercase tracking-widest">
                  <span>{score} Puntos Obtenidos</span>
                  <span>Meta: {maxScore} Puntos</span>
                </div>
              </div>

              {/* Rewards Grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center shadow-sm hover:bg-white/10 transition-all"
                >
                  <div className="w-10 h-10 sm:w-12 h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center text-medical-400 mb-3 sm:mb-4 shadow-sm border border-white/10">
                    <Star size={20} className="sm:hidden animate-pulse-slow" />
                    <Star size={24} className="hidden sm:block animate-pulse-slow" />
                  </div>
                  <div className="text-2xl sm:text-4xl font-black text-white leading-none mb-1">+{getResults(score, maxScore, isPro).xpBonus}</div>
                  <div className="text-[9px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest">XP Bonus</div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-white/5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center shadow-sm hover:bg-white/10 transition-all"
                >
                  <div className="w-10 h-10 sm:w-12 h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center text-amber-500 mb-3 sm:mb-4 shadow-sm border border-white/10">
                    <Trophy size={20} className="sm:hidden animate-float" />
                    <Trophy size={24} className="hidden sm:block animate-float" />
                  </div>
                  <div className="text-xs sm:text-sm font-black text-white leading-tight mb-1">{getResults(score, maxScore, isPro).badge}</div>
                  <div className="text-[9px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest">Badge</div>
                </motion.div>
              </div>

              {/* Route Info */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] bg-white/5 border border-white/5 flex gap-4 sm:gap-6 items-center"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center text-medical-400 shrink-0 shadow-sm border border-white/10">
                  <Info size={20} className="sm:hidden" />
                  <Info size={28} className="hidden sm:block" />
                </div>
                <div>
                  <h4 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.2em] mb-1 sm:mb-1.5">Ruta Personalizada</h4>
                  <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed font-medium">
                    {isPro 
                      ? 'Contenido avanzado desbloqueado: Farmacología clínica, estrategia KAM y comités de alto nivel.' 
                      : 'Ruta de fundamentos activada: Construiremos tu carrera desde los pilares de la visita médica.'}
                  </p>
                </div>
              </motion.div>

              <button onClick={handleComplete} className="btn-primary w-full py-5 sm:py-7 text-xl sm:text-2xl font-black rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl shadow-medical-500/30 group">
                <Sparkles size={24} className="sm:hidden group-hover:rotate-12 transition-transform" />
                <Sparkles size={28} className="hidden sm:block group-hover:rotate-12 transition-transform" /> Comenzar el Programa
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModuleZero;

import React, { useState, useEffect } from 'react';
import { UserLevel, UserProfile } from '../types';
import {
  Stethoscope, User, Briefcase, ArrowRight,
  RefreshCw, Mail, Phone, Lock, CheckCircle2,
  RotateCcw, X, Building2, TrendingUp,
  GraduationCap, HeartPulse, FlaskConical, Globe,
  Rocket, BarChart3, Sparkles, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const MOTIVACIONES_NOVATO = [
  { id: 'entry_pharma', text: 'Quiero entrar a la industria farmacéutica', sub: 'Sin experiencia previa. Comienzo desde cero en visita médica.', icon: Rocket },
  { id: 'health_switch', text: 'Soy profesional de salud buscando el campo comercial', sub: 'Médico, enfermero, bioquímico o carrera de salud afín.', icon: HeartPulse },
  { id: 'sales_switch', text: 'Vengo de ventas en otra industria', sub: 'Tengo base comercial y quiero entrar al mundo farmacéutico.', icon: RefreshCw },
  { id: 'student', text: 'Soy estudiante explorando opciones de carrera', sub: 'Farmacia, medicina, administración, marketing o afines.', icon: GraduationCap },
];

const MOTIVACIONES_EXPERIMENTADO = [
  { id: 'ascend_kam', text: 'Ascender a Key Account Manager (KAM)', sub: 'Gestionar cuentas institucionales IESS/MSP/privadas de alto valor.', icon: Building2 },
  { id: 'ascend_product', text: 'Moverme a Gerente de Producto o Brand Manager', sub: 'Del campo a la estrategia de marketing y posicionamiento de marca.', icon: BarChart3 },
  { id: 'improve_results', text: 'Mejorar mis resultados y superar mis metas actuales', sub: 'Tengo experiencia pero quiero técnicas avanzadas y mejores KPIs.', icon: TrendingUp },
  { id: 'multinational', text: 'Acceder a un laboratorio multinacional', sub: 'Pfizer, Bayer, Roche, Novartis, GSK u otras internacionales.', icon: Globe },
  { id: 'specialty', text: 'Especializarme en un área terapéutica de alto valor', sub: 'Oncología, cardiología, endocrinología, neurología u otras.', icon: FlaskConical },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState<UserLevel | null>(null);
  const [motivation, setMotivation] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showDemoNotification, setShowDemoNotification] = useState(false);

  useEffect(() => { setMotivation(''); }, [level]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) interval = setInterval(() => setResendTimer(p => p - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const generateAndSendCode = async () => {
    setIsSending(true);
    setVerificationCode('');
    setShowDemoNotification(false);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    await new Promise(r => setTimeout(r, 1500));
    setIsSending(false);
    setResendTimer(30);
    setVerificationCode(code);
    setShowDemoNotification(true);
    setTimeout(() => setShowDemoNotification(false), 6000);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else if (step === 3) { setStep(4); generateAndSendCode(); }
  };

  const handleVerifyAndSubmit = () => {
    if (verificationCode === generatedCode || verificationCode === '000000') {
      if (name && level && motivation && email && phone) {
        onComplete({ name, email, phone, level, motivation, xp: 0, rank: 'Aprendiz', streak: 1, completedModules: [], badges: [] });
      }
    } else {
      alert('❌ Código incorrecto.\n\nPista Demo: Usa 000000 o el código de la notificación.');
    }
  };

  const isPro = level === UserLevel.EXPERIMENTADO;
  const motivations = isPro ? MOTIVACIONES_EXPERIMENTADO : MOTIVACIONES_NOVATO;

  return (
    <div className="min-h-screen bg-[#05070A] flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-medical-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -120, 0],
            x: [0, -150, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-24 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            y: [0, -80, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px]" 
        />
      </div>

      {/* Demo notification */}
      <AnimatePresence>
        {showDemoNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -100, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -100, x: '-50%' }}
            className="fixed top-0 left-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="glass-dark p-4 rounded-2xl shadow-2xl border border-white/10 flex gap-4 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-medical-600 flex items-center justify-center shrink-0 shadow-lg shadow-medical-600/20">
                <Mail size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-medical-400 uppercase tracking-[0.2em]">Notificación de Acceso</span>
                  <button onClick={() => setShowDemoNotification(false)} className="text-white/40 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <p className="text-sm font-medium mt-1 text-white">Tu código de acceso es: <span className="text-medical-400 font-mono font-bold tracking-widest">{generatedCode}</span></p>
                <p className="text-[10px] text-white/40 mt-0.5">De: sistema@dr-medix.ai</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl glass-dark rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden relative z-10 backdrop-blur-2xl h-[90vh] sm:h-auto sm:max-h-[95vh] flex flex-col"
      >
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          
          {/* Sidebar Info (Desktop) */}
          <div className="hidden md:flex w-56 lg:w-64 bg-black/40 p-6 lg:p-8 flex-col justify-between relative overflow-hidden border-r border-white/5 shrink-0">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute top-10 left-10 w-24 h-24 border-2 border-medical-500/30 rounded-full blur-sm" />
              <div className="absolute bottom-20 -right-10 w-32 h-32 border border-blue-500/20 rounded-full blur-sm" />
            </div>
            
            <div className="relative z-10">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-10 h-10 rounded-xl bg-medical-600 flex items-center justify-center text-white mb-4 shadow-xl shadow-medical-600/20"
              >
                <Stethoscope size={20} />
              </motion.div>
              <h1 className="text-xl font-display font-bold text-white leading-tight mb-1 tracking-tight">DR. MEDIX</h1>
              <p className="text-white/50 text-[10px] leading-relaxed font-light">
                Entrenamiento inmersivo con IA para la industria farmacéutica.
              </p>
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-medical-400 group-hover:bg-medical-600/20 transition-colors">
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-white uppercase tracking-wider">Certificación</span>
                  <span className="block text-[7px] text-white/40">Avalado</span>
                </div>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-medical-400 group-hover:bg-medical-600/20 transition-colors">
                  <Sparkles size={14} />
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-white uppercase tracking-wider">IA Adaptativa</span>
                  <span className="block text-[7px] text-white/40">Personalizado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-white/[0.02] overflow-hidden">
            {/* Inner Padding Container */}
            <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col overflow-hidden">
              {/* Progress Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 shrink-0">
                <div className="flex gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div 
                      key={i} 
                      className={`h-1 rounded-full transition-all duration-700 relative overflow-hidden ${
                        i < step ? 'w-5 sm:w-7 bg-medical-500' : i === step ? 'w-8 sm:w-10 bg-medical-600' : 'w-2.5 sm:w-3 bg-white/5'
                      }`} 
                    >
                      {i === step && (
                        <motion.div 
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-white/30"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">Paso {step} de 4</span>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <AnimatePresence mode="wait">
                  {/* STEP 1: Personal Info */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4 sm:space-y-5"
                    >
                      <div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-white mb-1 tracking-tight">Bienvenido a Dr. Medix</h2>
                        <p className="text-white/50 text-[9px] sm:text-xs font-light">Comencemos configurando tu perfil profesional.</p>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Nombre Completo</label>
                          <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-medical-500 transition-colors" size={14} />
                            <input 
                              type="text" 
                              placeholder="Ej: Dr. Alejandro Silva" 
                              value={name} 
                              onChange={e => setName(e.target.value)}
                              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:bg-white/[0.08] focus:border-medical-500/50 transition-all outline-none text-white text-xs sm:text-sm font-medium placeholder:text-white/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Correo Institucional</label>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-medical-500 transition-colors" size={14} />
                            <input 
                              type="email" 
                              placeholder="correo@laboratorio.com" 
                              value={email} 
                              onChange={e => setEmail(e.target.value)}
                              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:bg-white/[0.08] focus:border-medical-500/50 transition-all outline-none text-white text-xs sm:text-sm font-medium placeholder:text-white/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Teléfono de Contacto</label>
                          <div className="relative group">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-medical-500 transition-colors" size={14} />
                            <input 
                              type="tel" 
                              placeholder="+593 99 999 9999" 
                              value={phone} 
                              onChange={e => setPhone(e.target.value)}
                              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:bg-white/[0.08] focus:border-medical-500/50 transition-all outline-none text-white text-xs sm:text-sm font-medium placeholder:text-white/20"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Level Selection */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4 sm:space-y-5"
                    >
                      <div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-white mb-1 tracking-tight">Nivel de Experiencia</h2>
                        <p className="text-white/50 text-[9px] sm:text-xs font-light">Personalizaremos el rigor científico según tu trayectoria.</p>
                      </div>

                      <div className="grid gap-3">
                        <button
                          onClick={() => setLevel(UserLevel.NOVATO)}
                          className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${
                            level === UserLevel.NOVATO 
                              ? 'border-medical-500 bg-medical-600/10 shadow-lg shadow-medical-600/10' 
                              : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                          }`}
                        >
                          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                            <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center transition-colors ${level === UserLevel.NOVATO ? 'bg-medical-600 text-white shadow-lg shadow-medical-600/30' : 'bg-white/10 text-white/40'}`}>
                              <User size={16} className="sm:hidden" />
                              <User size={20} className="hidden sm:block" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-xs sm:text-sm">Aspirante / Junior</h3>
                              <p className="text-[8px] sm:text-[9px] text-white/40 mt-0.5">Iniciando carrera en la industria.</p>
                            </div>
                          </div>
                          {level === UserLevel.NOVATO && (
                            <motion.div layoutId="level-glow" className="absolute inset-0 bg-gradient-to-r from-medical-600/10 to-transparent pointer-events-none" />
                          )}
                        </button>

                        <button
                          onClick={() => setLevel(UserLevel.EXPERIMENTADO)}
                          className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${
                            level === UserLevel.EXPERIMENTADO 
                              ? 'border-medical-500 bg-medical-600/10 shadow-lg shadow-medical-600/10' 
                              : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                          }`}
                        >
                          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                            <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center transition-colors ${level === UserLevel.EXPERIMENTADO ? 'bg-medical-600 text-white shadow-lg shadow-medical-600/30' : 'bg-white/10 text-white/40'}`}>
                              <Briefcase size={16} className="sm:hidden" />
                              <Briefcase size={20} className="hidden sm:block" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-xs sm:text-sm">Senior / Especialista</h3>
                              <p className="text-[8px] sm:text-[9px] text-white/40 mt-0.5">+2 años de experiencia en visita médica.</p>
                            </div>
                          </div>
                          {level === UserLevel.EXPERIMENTADO && (
                            <motion.div layoutId="level-glow" className="absolute inset-0 bg-gradient-to-r from-medical-600/10 to-transparent pointer-events-none" />
                          )}
                        </button>
                      </div>

                      {level && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-xl bg-black/40 text-white/60 text-[9px] sm:text-xs leading-relaxed border border-white/5 backdrop-blur-md"
                        >
                          <div className="flex items-center gap-2 mb-1 text-medical-400 font-bold uppercase tracking-[0.2em] text-[8px]">
                            <Sparkles size={10} />
                            Insight
                          </div>
                          {level === UserLevel.NOVATO ? (
                            <p>El mercado farmacéutico en Ecuador proyecta un crecimiento del <span className="text-white font-bold">12%</span>.</p>
                          ) : (
                            <p>Los visitadores que dominan herramientas digitales incrementan su efectividad en un <span className="text-white font-bold">40%</span>.</p>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* STEP 3: Motivation */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4 sm:space-y-5"
                    >
                      <div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-white mb-1 tracking-tight">Objetivo Profesional</h2>
                        <p className="text-white/50 text-[9px] sm:text-xs font-light">¿Hacia dónde quieres proyectar tu carrera?</p>
                      </div>

                      <div className="space-y-2">
                        {motivations.map((m) => {
                          const Icon = m.icon;
                          const isSelected = motivation === m.text;
                          return (
                            <button
                              key={m.id}
                              onClick={() => setMotivation(m.text)}
                              className={`w-full p-3 sm:p-3.5 rounded-xl border-2 text-left transition-all flex items-center gap-3 sm:gap-4 group relative overflow-hidden ${
                                isSelected 
                                  ? 'border-medical-500 bg-medical-600/10' 
                                  : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                              }`}
                            >
                              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-medical-600 text-white shadow-lg shadow-medical-600/20' : 'bg-white/10 text-white/40'}`}>
                                <Icon size={14} className="sm:hidden" />
                                <Icon size={18} className="hidden sm:block" />
                              </div>
                              <div className="min-w-0 relative z-10">
                                <h4 className="font-bold text-white text-[10px] sm:text-xs truncate">{m.text}</h4>
                                <p className="text-[7px] sm:text-[8px] text-white/40 truncate mt-0.5">{m.sub}</p>
                              </div>
                              {isSelected && (
                                <motion.div layoutId="motivation-glow" className="absolute inset-0 bg-gradient-to-r from-medical-600/10 to-transparent pointer-events-none" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: Verification */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4 sm:space-y-5 text-center py-2"
                    >
                      {isSending ? (
                        <div className="py-8 sm:py-10 flex flex-col items-center justify-center space-y-4">
                          <div className="relative">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-white/5 border-t-medical-600 rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Lock size={16} className="text-medical-600 animate-pulse" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-white">Generando Acceso Seguro</h3>
                            <p className="text-[9px] sm:text-[10px] text-white/40 mt-1 font-light">Encriptando credenciales...</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-medical-600/20 text-medical-500 flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-medical-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
                          >
                            <ShieldCheck size={28} className="sm:hidden" />
                            <ShieldCheck size={32} className="hidden sm:block" />
                          </motion.div>
                          <div>
                            <h2 className="text-lg sm:text-xl font-display font-bold text-white mb-1 tracking-tight">Verificación de Identidad</h2>
                            <p className="text-white/50 text-[9px] sm:text-xs font-light">
                              Ingresa el código enviado a <span className="text-white font-bold">{email}</span>
                            </p>
                          </div>

                          <div className="relative max-w-[180px] sm:max-w-[220px] mx-auto group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-medical-500 transition-colors" size={16} />
                            <input 
                              type="text" 
                              maxLength={6}
                              placeholder="······"
                              value={verificationCode}
                              onChange={e => setVerificationCode(e.target.value)}
                              className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center text-lg sm:text-xl font-mono tracking-[0.4em] sm:tracking-[0.5em] focus:bg-white/[0.08] focus:border-medical-500/50 outline-none transition-all text-white"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <button
                              onClick={handleVerifyAndSubmit}
                              disabled={verificationCode.length !== 6}
                              className="btn-primary w-full py-3 sm:py-3.5 text-sm shadow-2xl shadow-medical-600/20"
                            >
                              Iniciar Programa <ArrowRight size={16} />
                            </button>

                            <button
                              onClick={generateAndSendCode}
                              disabled={resendTimer > 0}
                              className="text-[8px] sm:text-[9px] font-bold text-white/30 hover:text-medical-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              <RotateCcw size={10} />
                              {resendTimer > 0 ? `Reenviar en ${resendTimer}s` : 'Solicitar nuevo código'}
                            </button>
                          </div>

                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-left backdrop-blur-md">
                            <CheckCircle2 size={14} className="text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-[8px] sm:text-[9px] text-amber-200/70 leading-relaxed">
                              <strong className="text-amber-400">Demo:</strong> Usa el código <span className="text-white font-bold">000000</span>.
                            </p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              {step < 4 && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-white/5 flex items-center justify-between shrink-0">
                  {step > 1 ? (
                    <button 
                      onClick={() => setStep(step - 1)}
                      className="text-[9px] sm:text-[10px] font-bold text-white/30 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <RotateCcw size={10} className="rotate-180" />
                      Anterior
                    </button>
                  ) : <div />}
                  
                  <button
                    onClick={handleNext}
                    disabled={
                      (step === 1 && (!name || !email || !phone)) ||
                      (step === 2 && level === null) ||
                      (step === 3 && !motivation)
                    }
                    className="btn-primary px-5 sm:px-7 py-2 sm:py-3 text-[11px] sm:text-xs group"
                  >
                    {step === 3 ? 'Finalizar Registro' : 'Continuar'}
                    <ArrowRight size={14} className="sm:hidden group-hover:translate-x-1 transition-transform" />
                    <ArrowRight size={16} className="hidden sm:block group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;

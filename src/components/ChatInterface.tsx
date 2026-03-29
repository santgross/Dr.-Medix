import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, AppMode, UserProfile } from '../types';
import { sendMessageToGemini, initializeChat } from '../services/geminiService';
import { Send, GraduationCap, Scale, Users, HeartHandshake, Bot, Mic, MicOff, Volume2, StopCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onXPIncrease: () => void;
  activeModuleId: number;
  userProfile: UserProfile;
}

const MODES = [
  { id: AppMode.TUTOR,     label: 'Tutor',     icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', tooltip: 'Explica conceptos, responde dudas y guía tu aprendizaje paso a paso' },
  { id: AppMode.EVALUADOR, label: 'Evaluador', icon: Scale,         color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', tooltip: 'Lanza quizzes, corrige respuestas y mide tu nivel de conocimiento' },
  { id: AppMode.SIMULADOR, label: 'Simulador', icon: Users,         color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100', tooltip: 'Practica visitas médicas: el Dr. Medix interpreta al médico real' },
  { id: AppMode.MENTOR,    label: 'Mentor',    icon: HeartHandshake,color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', tooltip: 'Consejo de carrera, estrategia profesional y desarrollo personal' },
];

const MODE_PLACEHOLDER: Record<AppMode, string> = {
  [AppMode.TUTOR]:     'Pregúntale al Tutor cualquier concepto del módulo...',
  [AppMode.EVALUADOR]: 'Pide un quiz: "evalúame sobre el ecosistema farmacéutico"...',
  [AppMode.SIMULADOR]: 'Di "simula una visita con un cardiólogo" para comenzar...',
  [AppMode.MENTOR]:    'Comparte un resto de carrera y pide consejo al Mentor...',
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, setMessages, onXPIncrease, activeModuleId, userProfile }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.TUTOR);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hoveredMode, setHoveredMode] = useState<AppMode | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        await initializeChat(userProfile, messages, activeModuleId);
        if (messages.length === 0) {
          const firstResponse = await sendMessageToGemini("Hola Dr. Medix, estoy listo para comenzar este módulo.", currentMode);
          const aiMsg: Message = { id: Date.now().toString(), role: 'model', text: firstResponse, timestamp: new Date() };
          setMessages([aiMsg]);
        }
      } catch (err) {
        console.error("Error initializing chat:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModuleId]);

  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setAvailableVoices(v);
    };
    load();
    if (window.speechSynthesis.onvoiceschanged !== undefined)
      window.speechSynthesis.onvoiceschanged = load;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const toggleListening = () => isListening ? stopListening() : startListening();

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz. Por favor usa Chrome o Edge.');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'es-EC';
    recognition.onstart  = () => setIsListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setInput(t);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend   = () => setIsListening(false);
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); }
  };

  const speakText = (text: string, messageId: string) => {
    if (isSpeaking === messageId) { window.speechSynthesis.cancel(); setIsSpeaking(null); return; }
    window.speechSynthesis.cancel();
    const clean = text
      .replace(/\*\*/g,'').replace(/\*/g,'').replace(/#/g,'').replace(/`/g,'')
      .replace(/\[.*?\]/g,'').replace(/---/g,'')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '');
    const utt = new SpeechSynthesisUtterance(clean);
    const voice = availableVoices.find(v => v.lang === 'es-US')
                || availableVoices.find(v => v.lang === 'es-MX')
                || availableVoices.find(v => v.lang.startsWith('es'));
    if (voice) utt.voice = voice;
    utt.lang = voice ? voice.lang : 'es-ES';
    utt.rate = 1.0; utt.pitch = 1.0;
    utt.onstart = () => setIsSpeaking(messageId);
    utt.onend   = () => setIsSpeaking(null);
    utt.onerror = () => setIsSpeaking(null);
    window.speechSynthesis.speak(utt);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const newMsg: Message = { id: Date.now().toString(), role: 'user', text: userText, timestamp: new Date() };
    setMessages(prev => [...prev, newMsg]);
    setIsLoading(true);
    try {
      const responseText = await sendMessageToGemini(userText, currentMode);
      const aiMsg: Message = { id: (Date.now()+1).toString(), role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      onXPIncrease();
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const displayMode = hoveredMode ?? currentMode;
  const displayInfo = MODES.find(m => m.id === displayMode)!;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070A] overflow-hidden relative">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-medical-500/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      {/* ── Header ── */}
      <header className="h-16 sm:h-20 lg:h-24 glass-dark px-3 sm:px-4 lg:px-8 flex items-center justify-between z-20 shrink-0 border-b border-white/5 sticky top-0">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 ml-10 sm:ml-12 lg:ml-0">
          <div className="relative group hidden xs:block">
            <div className="absolute -inset-1 bg-gradient-to-r from-medical-400 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center text-medical-400 border border-white/10 shadow-2xl backdrop-blur-xl">
              <Bot size={18} className="sm:hidden animate-float" />
              <Bot size={24} className="hidden sm:block lg:hidden animate-float" />
              <Bot size={28} className="hidden lg:block animate-float" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-emerald-500 border-2 border-[#05070A] rounded-full shadow-sm" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              <h2 className="font-display font-black text-lg sm:text-xl lg:text-2xl text-white leading-none tracking-tight">Dr. Medix</h2>
              <div className="flex items-center gap-1 px-1 sm:px-1.5 lg:px-2 py-0.5 rounded-lg bg-medical-500/10 text-medical-400 text-[7px] sm:text-[8px] lg:text-[10px] font-black uppercase tracking-widest border border-medical-500/20">
                <Sparkles size={7} className="sm:hidden" />
                <Sparkles size={8} className="hidden sm:block lg:hidden" />
                <Sparkles size={10} className="hidden lg:block" />
                M{activeModuleId}
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 lg:mt-1.5">
              <span className="text-[8px] sm:text-[9px] lg:text-[11px] font-bold text-slate-500 uppercase tracking-widest">IA Mentora</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 bg-white/5 p-1 lg:p-1.5 rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/5 backdrop-blur-md">
          {MODES.map(mode => {
            const Icon = mode.icon;
            const isActive = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setCurrentMode(mode.id)}
                onMouseEnter={() => setHoveredMode(mode.id)}
                onMouseLeave={() => setHoveredMode(null)}
                className={`p-1.5 sm:p-2 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 sm:gap-2 ${
                  isActive 
                    ? 'bg-medical-600 text-white shadow-xl shadow-medical-600/20 border border-medical-500/50' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
                title={mode.label}
              >
                <Icon size={12} className={isActive ? 'text-white' : 'text-slate-500'} />
                <span className="hidden md:inline">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Mode Info Bar ── */}
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-medical-600 text-white px-3 sm:px-4 lg:px-8 py-1.5 sm:py-2 lg:py-2.5 flex items-center justify-between z-10 shrink-0 shadow-lg shadow-medical-600/20"
      >
        <div className="flex items-center gap-2 lg:gap-3 min-w-0">
          <div className="p-0.5 sm:p-1 bg-white/20 rounded-lg shrink-0">
            {React.createElement(displayInfo.icon, { size: 10 })}
          </div>
          <span className="text-[8px] sm:text-[9px] lg:text-[11px] font-black uppercase tracking-[0.15em] shrink-0">{displayInfo.label}:</span>
          <span className="text-[9px] sm:text-[10px] lg:text-xs font-medium text-white/90 italic truncate">{displayInfo.tooltip}</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-white/70 shrink-0">
          <span className="flex items-center gap-1.5"><div className="w-1 h-1 bg-white rounded-full" /> Latencia: 1.2s</span>
          <span className="flex items-center gap-1.5"><div className="w-1 h-1 bg-white rounded-full" /> Modelo: Gemini 3.1 Pro</span>
        </div>
      </motion.div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-10 custom-scrollbar relative z-0">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[92%] sm:max-w-[85%] lg:max-w-[75%] group relative ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`relative p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-[2rem] transition-all duration-300 ${
                  msg.role === 'user' 
                    ? 'bg-medical-600 text-white rounded-tr-none shadow-2xl shadow-medical-600/30' 
                    : 'bg-white/[0.03] border border-white/10 text-slate-200 rounded-tl-none shadow-xl backdrop-blur-xl hover:bg-white/[0.05]'
                }`}>
                  {msg.role === 'model' && (
                    <div className="absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 lg:-top-3 lg:-left-3 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-lg lg:rounded-xl bg-medical-600 text-white flex items-center justify-center shadow-lg border-2 border-[#05070A]">
                      <Bot size={10} className="sm:hidden" />
                      <Bot size={12} className="hidden sm:block lg:hidden" />
                      <Bot size={16} className="hidden lg:block" />
                    </div>
                  )}
                  
                  <div className={`markdown-body text-xs sm:text-sm lg:text-base ${msg.role === 'user' ? 'text-white' : 'text-slate-200'}`}>
                    {msg.role === 'user'
                      ? <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                      : <ReactMarkdown>{msg.text}</ReactMarkdown>
                    }
                  </div>
                </div>
                
                <div className={`flex items-center gap-4 mt-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.role === 'model' && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        className={`p-2 rounded-xl transition-all ${
                          isSpeaking === msg.id 
                            ? 'bg-medical-500/20 text-medical-400' 
                            : 'text-slate-600 hover:text-medical-400 hover:bg-white/5'
                        }`}
                      >
                        {isSpeaking === msg.id ? <StopCircle size={16} /> : <Volume2 size={16} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl rounded-tl-none shadow-xl backdrop-blur-xl flex items-center gap-4">
              <div className="flex gap-1.5">
                <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-medical-400" />
                <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-medical-500" />
                <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-medical-600" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dr. Medix está analizando...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* ── Input ── */}
      <div className="p-3 sm:p-4 lg:p-8 bg-black/40 backdrop-blur-2xl border-t border-white/5 shrink-0 z-20">
        <div className="max-w-5xl mx-auto">
          <div className={`relative flex items-end gap-1.5 sm:gap-2 lg:gap-3 p-1.5 sm:p-2 lg:p-3 rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] border-2 transition-all duration-500 ${
            isListening 
              ? 'border-medical-500 bg-medical-500/10 shadow-2xl shadow-medical-500/20' 
              : 'border-white/5 bg-white/[0.02] focus-within:border-medical-500/50 focus-within:bg-white/[0.04] focus-within:shadow-2xl focus-within:shadow-medical-500/10'
          }`}>
            <button
              onClick={toggleListening}
              className={`p-2.5 sm:p-3 lg:p-4 rounded-full transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 scale-110' 
                  : 'text-slate-500 hover:text-medical-400 hover:bg-white/5 hover:shadow-md'
              }`}
            >
              <MicOff size={18} className="sm:hidden" />
              <Mic size={18} className="sm:hidden" />
              <MicOff size={20} className="hidden sm:block lg:hidden" />
              <Mic size={20} className="hidden sm:block lg:hidden" />
              <MicOff size={24} className="hidden lg:block" />
              <Mic size={24} className="hidden lg:block" />
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Escuchando...' : MODE_PLACEHOLDER[currentMode]}
              className="flex-1 bg-transparent border-none focus:ring-0 py-2.5 sm:py-3 lg:py-4 text-white placeholder:text-slate-600 resize-none max-h-40 custom-scrollbar text-xs sm:text-sm lg:text-base font-medium leading-relaxed"
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-2.5 sm:p-3 lg:p-4 rounded-full transition-all duration-300 ${
                !input.trim() || isLoading
                  ? 'text-slate-700 bg-white/5'
                  : 'bg-medical-600 text-white shadow-xl shadow-medical-600/40 hover:bg-medical-700 hover:scale-105 active:scale-95'
              }`}
            >
              <Send size={18} className="sm:hidden" />
              <Send size={20} className="hidden sm:block lg:hidden" />
              <Send size={24} className="hidden lg:block" />
            </button>
          </div>
          
          <div className="mt-2 sm:mt-3 lg:mt-4 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 lg:px-6 gap-2 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <span className="text-[7px] sm:text-[8px] lg:text-[10px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-1">
                <div className="w-1 h-1 bg-slate-700 rounded-full" /> Enter para enviar
              </span>
              <span className="text-[7px] sm:text-[8px] lg:text-[10px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-1">
                <div className="w-1 h-1 bg-slate-700 rounded-full" /> Shift + Enter para línea
              </span>
            </div>
            <span className="text-[7px] sm:text-[8px] lg:text-[10px] text-slate-600 font-bold italic opacity-60 text-center sm:text-right">
              Verifica información normativa con ARCSA/MSP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

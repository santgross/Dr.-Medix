import { X, Play, Pause } from 'lucide-react';
import { useState, useRef } from 'react';

interface IntroAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioUrl: string;
  title: string;
}

export default function IntroAudioModal({ isOpen, onClose, audioUrl, title }: IntroAudioModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <button 
              onClick={togglePlay}
              className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-transform active:scale-95 text-white"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-slate-600 mb-2">Escucha la introducción del Dr. Medix</p>
            <p className="text-sm text-slate-400">Haz clic en el botón para reproducir</p>
          </div>

          <audio 
            ref={audioRef} 
            src={audioUrl} 
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-8 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

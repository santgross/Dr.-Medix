export type Role = 'user' | 'model';

export enum UserLevel {
  NOVATO = 'NOVATO',
  EXPERIMENTADO = 'EXPERIMENTADO'
}

export enum AppMode {
  TUTOR = 'TUTOR',
  EVALUADOR = 'EVALUADOR',
  SIMULADOR = 'SIMULADOR',
  MENTOR = 'MENTOR'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
}

export interface UserProfile {
  name: string; // Nombre y Apellido
  email: string;
  phone: string;
  level: UserLevel;
  motivation: string;
  xp: number;
  rank: string; // Aprendiz, Practicante, etc.
  streak: number;
  completedModules: number[];
  badges: string[];
}

export interface ChatSession {
  messages: Message[];
  isLoading: boolean;
}


import { GoogleGenAI, Chat, Content } from "@google/genai";
import { getSystemPromptForModule } from "../constants";
import { UserProfile, AppMode, Message } from "../types";

let aiInstance: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getAIInstance = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

// Determina el módulo activo basado en XP y módulos completados
export const getActiveModuleId = (user: UserProfile): number => {
  if (!user.completedModules.includes(0)) return 0;
  const completed = [...user.completedModules].sort((a, b) => b - a);
  const highestCompleted = completed[0] ?? 0;
  // El módulo activo es el siguiente al más alto completado (mínimo 1)
  return Math.max(1, highestCompleted + 1 <= 12 ? highestCompleted + 1 : highestCompleted);
};

export const initializeChat = async (
  user: UserProfile,
  previousMessages: Message[] = [],
  activeModuleId?: number
) => {
  const ai = getAIInstance();

  // Determinar módulo activo
  const moduleId = activeModuleId ?? getActiveModuleId(user);

  // Seleccionar el system prompt correcto para el módulo
  const baseSystemPrompt = getSystemPromptForModule(moduleId);

  // Convertir historial de mensajes al formato de Gemini
  const history: Content[] = previousMessages.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const hasHistory = history.length > 0;

  // Instrucción específica según si es sesión nueva o continuación
  let specificInstruction = "";

  if (!hasHistory) {
    // SESIÓN NUEVA — primera interacción del módulo
    if (moduleId === 1) {
      specificInstruction = `
**ESTADO ACTUAL:** El estudiante ACABA de iniciar el Módulo 1 por primera vez.

**TU PRIMERA ACCIÓN (OBLIGATORIA):**
1. Bienvenida breve y motivadora: "¡Bienvenido a bordo, ${user.name}! 🚀 Módulo 1 activado oficialmente."
2. Contexto del dilema central del módulo: En el ecosistema farmacéutico ecuatoriano existe una pregunta estratégica que divide a los visitadores novatos: ¿Dónde concentrar la energía — en el sector público (MSP/IESS, 68% de la población) o en el sector privado (más ágil y personalizado)?
3. Pregunta de activación: "Antes de entrar a la teoría: ¿cuál es tu intuición inicial? ¿Dónde crees que debería enfocarse un visitador nuevo en Ecuador — en la escala del sector público o en la agilidad del privado? ¿Por qué?"

NOTA: NO preguntes "¿en qué te ayudo?". TOMA LA INICIATIVA con el dilema estratégico del módulo.
      `;
    } else {
      specificInstruction = `
**ESTADO ACTUAL:** El estudiante está iniciando el Módulo ${moduleId} por primera vez.

**TU PRIMERA ACCIÓN (OBLIGATORIA):**
1. Bienvenida al módulo: Indica el nombre del módulo y felicita al estudiante por haber llegado hasta aquí.
2. Resumen de lo que aprenderá en este módulo (3 puntos clave).
3. Pregunta diagnóstica de nivel: Haz la pregunta de detección de nivel específica de este módulo.

NOTA: Sé motivador y directo. Adapta el nivel según la respuesta diagnóstica.
      `;
    }
  } else {
    // SESIÓN EN CURSO — continuación de conversación
    specificInstruction = `
**ESTADO ACTUAL:** Conversación en curso en el Módulo ${moduleId}. El estudiante ya ha interactuado contigo.

**REGLAS DE CONTINUIDAD:**
1. MEMORIA ACTIVA: Analiza el historial de chat. Tus respuestas deben tener coherencia total con lo último que se habló.
2. CERO REPETICIONES: NO vuelvas a dar la bienvenida ni a presentarte como Dr. Medix.
3. REFUERZO POSITIVO variado: "¡Excelente, ${user.name}!", "¡Muy bien analizado!", "¡Exacto!", "¡Punto clave!"
4. FLUJO NATURAL: Si el estudiante respondió una pregunta, evalúala y pasa suavemente al siguiente concepto.
    `;
  }

  // Construir el system prompt personalizado completo
  const personalizedSystemInstruction = `
${baseSystemPrompt}

**PERFIL DEL ESTUDIANTE:**
- Nombre: ${user.name}
- Nivel declarado: ${user.level}
- XP actual: ${user.xp} (Rango: ${user.rank})
- Módulo activo: ${moduleId}
- Módulos completados: ${user.completedModules.join(", ") || "Ninguno aún"}
- Badges obtenidos: ${user.badges.length > 0 ? user.badges.join(", ") : "Ninguno aún"}

${specificInstruction}
  `;

  // Crear sesión de chat con historial
  chatSession = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: personalizedSystemInstruction,
      temperature: 0.7,
      topK: 40,
    },
    history: history
  });

  return chatSession;
};

export const sendMessageToGemini = async (
  text: string,
  currentMode: AppMode
): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  // Añadir contexto del modo activo al mensaje
  const contextualizedMessage = `[MODO ACTUAL: ${currentMode}]\n${text}`;

  try {
    const response = await chatSession.sendMessage({ message: contextualizedMessage });
    return response.text || "Lo siento, tuve un problema generando la respuesta.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocurrió un error de conexión con Dr. Medix. Por favor intenta de nuevo.";
  }
};

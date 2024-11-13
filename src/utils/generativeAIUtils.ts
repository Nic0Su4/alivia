import { GoogleGenerativeAI } from "@google/generative-ai";

const clave = "AIzaSyDv5stBhwypguJ6khEgUPQ1OERWZCMl6vc"; // Copia tu clave aquí
const genAI = new GoogleGenerativeAI(clave);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let chatInstance: any = null; // Almacena la instancia de chat

export const iniciarChat = (
  history: { role: string; parts: { text: string }[] }[]
) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "Eres un chatbot llamado AlivIA, principalmente los usuarios serán de Perú, especializado en asistencia virtual de salud. Tu principal función es ayudar a los usuarios a identificar posibles diagnósticos preliminares basados en los síntomas que describan. En caso te pregunten otra cosa, responde amablemente pero recuérdales que tu función principal es ayudar con diagnósticos preliminares. Recuerda que siempre que te pregunten otra cosa, les respondes pero les recuerdas tu función principal en ese mismo mensaje.",
  });

  chatInstance = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });
};

export const enviarMensaje = async (mensaje: string) => {
  if (!chatInstance) throw new Error("El chat no ha sido iniciado.");

  const result = await chatInstance.sendMessage(mensaje); // Envía el mensaje del usuario
  const response = await result.response;
  return response.text();
};

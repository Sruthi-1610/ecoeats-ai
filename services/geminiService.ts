
import { GoogleGenAI, Type, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeImage = async (imageFile: File, prompt: string) => {
  const base64Image = await fileToBase64(imageFile);
  const imagePart = {
    inlineData: {
      mimeType: imageFile.type,
      data: base64Image,
    },
  };
  const textPart = { text: prompt };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
  });
  
  return response.text;
};

export const getChatResponse = async (history: { role: 'user' | 'model'; parts: { text: string }[] }[], newMessage: string) => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
        config: {
            systemInstruction: 'You are a helpful assistant focused on reducing food waste. Provide creative recipes, storage tips, and practical advice.'
        }
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text;
};


export const findNearbyPlaces = async (location: { latitude: number; longitude: number }) => {
  const prompt = "Find food banks, compost centers, or community fridges near me.";
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        },
      },
    },
  });

  return {
    text: response.text,
    chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const getFoodWasteFacts = async (query: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
            tools: [{googleSearch: {}}],
        },
    });

    return {
        text: response.text,
        chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
};

export const generateComplexPlan = async (prompt: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            systemInstruction: 'You are a master meal planner. Create a detailed, day-by-day meal plan based on the user\'s ingredients and constraints, with the primary goal of using up all ingredients and minimizing food waste. Provide a shopping list for any minor missing items.',
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    return response.text;
};

export const transcribeAudio = async (audioFile: File) => {
    const base64Audio = await fileToBase64(audioFile);
    const audioPart = {
        inlineData: {
            mimeType: audioFile.type,
            data: base64Audio,
        },
    };
    const textPart = { text: "Transcribe the following audio recording." };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [audioPart, textPart] },
    });
    return response.text;
};

export const generateSpeech = async (text: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

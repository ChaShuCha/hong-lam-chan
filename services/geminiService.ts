
import { GoogleGenAI, Type } from "@google/genai";
import { SiteConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSiteConfig = async (prompt: string): Promise<SiteConfig> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a creative archive setup for a narrative project called 'ECHO'. 
    Theme: ${prompt}.
    
    Aesthetic Directives:
    - Tone: Industrial, Brutalist, Retro-Future, Cyber-Dystopian.
    - Context: This is a 'Classified Log' or 'Archive File'.
    - Style: Use terms like 'Observer', 'System Integrity', 'Signal Playback', 'Conflict Logs'.
    
    Content Structure:
    - companyName: The name of the archive or the author.
    - heroHeadline: A striking philosophical title for this specific archive log.
    - aboutText: A brief 'Observer Profile'.
    - features: 3-6 core thematic nodes or conflicts (e.g., 'Identity Collapse', 'Network Dependency').`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          tagline: { type: Type.STRING },
          heroHeadline: { type: Type.STRING },
          heroSubheadline: { type: Type.STRING },
          primaryColor: { type: Type.STRING },
          secondaryColor: { type: Type.STRING },
          fontStyle: { type: Type.STRING, enum: ["modern", "classic", "playful"] },
          aboutText: { type: Type.STRING },
          features: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                icon: { type: Type.STRING, enum: ['Zap', 'Shield', 'Star', 'Globe', 'Camera', 'Layout'] }
              },
              required: ["title", "description", "icon"]
            }
          },
          testimonials: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                author: { type: Type.STRING },
                role: { type: Type.STRING },
                quote: { type: Type.STRING }
              }
            }
          },
          ctaText: { type: Type.STRING }
        },
        required: ["companyName", "tagline", "heroHeadline", "heroSubheadline", "features", "aboutText", "ctaText"]
      }
    }
  });

  const text = response.text.trim();
  return JSON.parse(text);
};

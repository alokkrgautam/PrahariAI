import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ScanResult, ThreatLevel, SuspectProfile, Platform } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize safely. If key is missing, calls will fail but app won't crash on load.
if (!apiKey) {
  console.warn("PrahariAI: process.env.API_KEY is not set. AI features will not function.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

export const analyzeProfile = async (
  username: string,
  bio: string,
  recentPosts: string
): Promise<ScanResult> => {
  
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      trustScore: {
        type: Type.NUMBER,
        description: "A score from 0 to 100 indicating how trustworthy the profile is. 100 is very trustworthy, 0 is a fake/bot.",
      },
      isSuspicious: {
        type: Type.BOOLEAN,
        description: "Whether the account is likely fake or malicious.",
      },
      flags: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of specific indicators of suspicion (e.g., 'Generic Bio', 'Bot-like syntax', 'Inflammatory keywords').",
      },
      analysis: {
        type: Type.STRING,
        description: "A brief summary explaining the reasoning behind the score.",
      },
      threatLevel: {
        type: Type.STRING,
        description: "Categorize as Low, Medium, High, or Critical based on potential for misinformation or harm.",
      },
      suggestedAction: {
        type: Type.STRING,
        description: "Recommended action (e.g., 'Monitor', 'Report', 'Immediate Takedown').",
      }
    },
    required: ["trustScore", "isSuspicious", "flags", "analysis", "threatLevel", "suggestedAction"],
  };

  const prompt = `
    Analyze the following social media profile data for authenticity and threat potential.
    The system is PrahariAI, designed for national security agencies to detect fake accounts, impersonation, and bots.

    Username: ${username}
    Bio: ${bio}
    Recent Content/Context: ${recentPosts}

    Provide a JSON response evaluating if this is a fake account, bot, or malicious actor.
    Consider patterns of misinformation, impersonation of officials, or bot-like repetitive behavior.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Map string threat level to Enum if necessary, ensuring type safety
      let tLevel = ThreatLevel.LOW;
      const apiThreat = data.threatLevel?.toLowerCase();
      if (apiThreat?.includes('crit')) tLevel = ThreatLevel.CRITICAL;
      else if (apiThreat?.includes('high')) tLevel = ThreatLevel.HIGH;
      else if (apiThreat?.includes('med')) tLevel = ThreatLevel.MEDIUM;

      return {
        ...data,
        threatLevel: tLevel
      } as ScanResult;
    }
    
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback result in case of API failure
    return {
      trustScore: 50,
      isSuspicious: true,
      flags: ["Analysis Failed", "Check Connectivity"],
      analysis: "Unable to process request at this time. Manual review recommended.",
      threatLevel: ThreatLevel.MEDIUM,
      suggestedAction: "Manual Review"
    };
  }
};

export const scanNetworkForThreats = async (topic: string): Promise<SuspectProfile[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        username: { type: Type.STRING },
        platform: { 
          type: Type.STRING, 
          enum: ["Twitter", "Instagram", "Facebook", "Telegram"] 
        },
        bio: { type: Type.STRING },
        recentPosts: { type: Type.STRING, description: "A representative recent post content from this user." }
      },
      required: ["username", "platform", "bio", "recentPosts"]
    }
  };

  const prompt = `
    Simulate a social media network scan. 
    Generate 3 realistic but fictional 'suspicious' social media profiles related to the topic: "${topic}".
    
    These profiles should look like:
    1. Bots spreading propaganda.
    2. Impersonators of officials.
    3. Scammers.
    
    Vary the platforms between Twitter, Instagram, Facebook, and Telegram.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Ensure platform maps correctly to our enum, default to Twitter if mismatch
      return data.map((item: any) => ({
        ...item,
        platform: Object.values(Platform).includes(item.platform) ? item.platform : Platform.TWITTER
      }));
    }
    return [];
  } catch (error) {
    console.error("Network scan simulation failed:", error);
    return [];
  }
};

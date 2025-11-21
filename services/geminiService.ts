
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
        description: "A score from 0 to 100. 100 is verified/safe, 0 is confirmed bot/malicious.",
      },
      isSuspicious: {
        type: Type.BOOLEAN,
        description: "Boolean flag for immediate threat tagging.",
      },
      flags: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Technical indicators (e.g., 'High Entropy Username', 'Botnet Coordination', 'Scam Pattern Match').",
      },
      analysis: {
        type: Type.STRING,
        description: "Technical justification for the score. Use cyber-security terminology.",
      },
      threatLevel: {
        type: Type.STRING,
        description: "Categorize as Low, Medium, High, or Critical.",
      },
      suggestedAction: {
        type: Type.STRING,
        description: "Operational next steps (e.g., 'Monitor', 'Report to Cyber Cell', 'Immediate Takedown').",
      }
    },
    required: ["trustScore", "isSuspicious", "flags", "analysis", "threatLevel", "suggestedAction"],
  };

  const prompt = `
    You are PrahariAI, an elite cybersecurity AI agent for the National Security Cyber Cell.
    Your task is to detect bots, impersonators, and disinformation agents.
    
    Analyze the following profile metadata:
    User Handle: ${username}
    Bio String: ${bio}
    Content Vector: ${recentPosts}

    Be strict. Look for:
    1. Impersonation of government officials or support desks.
    2. Urgency cues (phishing).
    3. Bot-like repetitive syntax or crypto-scam keywords.
    
    Output strictly in JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3, // Lower temperature for more deterministic/analytical results
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
    Simulate a threat detection scan for the topic: "${topic}". 
    Generate 3 highly realistic, dangerous profiles that would flag a national security system.
    
    Profiles should include:
    1. An impersonator of a relevant authority figure or support channel.
    2. A bot spreading polarized disinformation.
    3. A financial scammer exploiting the topic.
    
    Make the usernames and bios look authentic to the platform (e.g., use 'Official' in fake names).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
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


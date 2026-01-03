import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize Gemini Client
// CRITICAL: Using process.env.API_KEY as strictly required.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const streamStrategyAnalysis = async (
  appDescription: string, 
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    const prompt = `
      You are an expert App Monetization Strategist and Product Manager.
      
      The user has an app idea: "${appDescription}".
      
      Please provide a comprehensive monetization analysis. Structure your response with Markdown using the following sections:
      1. **Core Value Proposition**: Briefly validate the value.
      2. **Recommended Business Model**: (e.g., Freemium, Subscription, Paid, Ad-supported, Usage-based) and WHY.
      3. **Pricing Strategy**: Specific price points to test.
      4. **Growth Channels**: How to acquire the first 1,000 users.
      5. **Potential Pitfalls**: What to avoid.
      6. **Implementation Roadmap (Tutorial)**: A step-by-step technical and operational tutorial on how to build and launch the MVP for this specific idea.
      
      Keep the tone professional, encouraging, and highly actionable.
    `;

    const responseStream = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: "You are a Silicon Valley product strategy expert.",
        temperature: 0.7,
      }
    });

    let fullText = "";
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }
    return fullText;
  } catch (error) {
    console.error("Error generating strategy:", error);
    throw error;
  }
};

export const streamMarketTrends = async (
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    const prompt = `
      What are the top 5 emerging trends in app monetization right now? 
      Focus on things like AI features, micro-SaaS, B2B vertical SaaS, and community-led growth.
      Provide concise, bulleted insights.
    `;

    const responseStream = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: prompt,
    });

    let fullText = "";
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }
    return fullText;
  } catch (error) {
    console.error("Error fetching trends:", error);
    throw error;
  }
};

export const streamAiMonetizationTips = async (
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    const prompt = `
      You are a tech entrepreneur coach.
      Provide a comprehensive guide on "How to Make Money with AI as a Developer".
      
      Structure the response in Markdown:
      1. **Building Micro-SaaS Wrappers**: How to wrap existing APIs (like Gemini/OpenAI) into niche value props.
      2. **AI Agency / B2B Consulting**: Selling custom automation workflows to non-tech businesses.
      3. **Data & Fine-Tuning**: Creating datasets or fine-tuned models for specific domains.
      4. **Content Operations**: Using AI to scale content sites or marketing agencies.
      
      For each section, provide a "Difficulty Level" (Low/Medium/High) and "Revenue Potential".
      Keep it actionable and realistic.
    `;

    const responseStream = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: prompt,
    });

    let fullText = "";
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }
    return fullText;
  } catch (error) {
    console.error("Error fetching tips:", error);
    throw error;
  }
};
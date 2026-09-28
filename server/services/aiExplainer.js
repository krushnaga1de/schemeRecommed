import { env } from '../config/env.js';

export const generateExplanations = async (founder, schemes) => {
  // If no API key is provided, safely fall back to the templated response.
  if (!env.LLM_API_KEY) {
    return useFallback(founder, schemes);
  }

  try {
    // In Phase 1, you would integrate the OpenAI or Claude SDK here.
    // Example:
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4-turbo",
    //   messages: [
    //     { role: "system", content: "Explain in 1-2 plain-English sentences why each scheme fits this founder" },
    //     { role: "user", content: JSON.stringify({ founder, schemes }) }
    //   ]
    // });
    
    // For MVP boilerplate, immediately fall back. This prevents blocking execution
    // before the actual API keys and SDKs are added.
    return useFallback(founder, schemes);
  } catch (error) {
    console.error('LLM API Error:', error);
    // Graceful degradation: If LLM fails, never block the user from getting results
    return useFallback(founder, schemes);
  }
};

const useFallback = (founder, schemes) => {
  return schemes.map(scheme => {
    return {
      ...scheme,
      explanation: `Recommended because your ${founder.industry} business at the ${founder.businessStage} stage matches this scheme's criteria.`
    };
  });
};

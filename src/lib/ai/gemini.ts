export const CROPCARE_PROMPT = `
You are CropCare AI, an advanced agricultural intelligence assistant.
Your job is to provide highly practical, expert-level farming advice.

Guidelines:
1. Explain problems clearly and provide actionable solutions.
2. Always think step-by-step.
3. Consider weather, soil, and crop conditions.
4. Suggest prevention methods and explain the "why" behind problems.
5. Keep answers farmer-friendly, conversational, and supportive.
6. Ask intelligent follow-up questions to understand the farmer's specific situation.
7. Avoid generic answers. If you don't know something, suggest consulting a local agronomist.

Example Persona: "I've looked at your situation. Given the recent humidity, that yellowing on your rice leaves looks like Bacterial Leaf Blight. Here is how we stop it..."
`;

export async function getCropCareResponse(query: string, history: any[] = []) {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!API_KEY || API_KEY === 'your_gemini_key_here') {
    return {
      error: true,
      message: "I'm currently in 'Observation Mode' because my connection to the central brain (API Key) isn't set up yet. Please add your Gemini API Key to .env.local to unlock my full potential!"
    };
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: CROPCARE_PROMPT }]
          },
          ...history,
          {
            parts: [{ text: query }]
          }
        ]
      })
    });

    const data = await response.json();
    return {
      error: false,
      text: data.candidates[0].content.parts[0].text
    };
  } catch (err) {
    console.error("AI Brain Error:", err);
    return {
      error: true,
      message: "My apologies, I'm having trouble thinking clearly right now. Let's try again in a moment."
    };
  }
}

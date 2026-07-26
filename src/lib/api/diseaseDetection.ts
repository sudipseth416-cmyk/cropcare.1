import { CROPCARE_PROMPT } from '../ai/gemini';

export interface DetectionResult {
  diseaseName: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High' | 'Emergency';
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  description?: string;
  error?: string;
}

export async function detectDisease(image: File): Promise<DetectionResult> {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!API_KEY || API_KEY === 'your_gemini_key_here') {
    throw new Error("Gemini API key is missing. Please add it to .env.local");
  }

  try {
    // Convert image to base64
    const base64Image = await fileToBase64(image);
    const base64Data = base64Image.split(',')[1];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: `${CROPCARE_PROMPT}\n\nAnalyze this crop image and provide a diagnosis in JSON format. 
            Identify the crop, the disease (or if it's healthy), confidence score (0-100), severity, symptoms, organic/chemical treatments, and prevention steps.
            
            Return ONLY a JSON object with this structure:
            {
              "diseaseName": "Name of disease",
              "confidence": 95,
              "severity": "Low" | "Medium" | "High" | "Emergency",
              "symptoms": ["list", "of", "symptoms"],
              "treatment": ["list", "of", "treatments"],
              "prevention": ["list", "of", "prevention", "steps"],
              "description": "Brief explanation of what you see"
            }` },
            {
              inline_data: {
                mime_type: image.type,
                data: base64Data
              }
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      throw new Error("Failed to reach Gemini brain");
    }

    const data = await response.json();
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Clean JSON response (Gemini sometimes adds markdown blocks)
    const jsonStr = textResponse.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr) as DetectionResult;

  } catch (error) {
    console.error("Detection Error:", error);
    throw new Error("The AI brain couldn't analyze this image. Please try a clearer photo.");
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

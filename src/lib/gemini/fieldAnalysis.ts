import { CROPCARE_PROMPT } from '../ai/gemini';
import { FieldAnalysisResult } from '@/types/fieldAnalysis';
import { detectDisease, DetectionResult } from '../api/diseaseDetection';

export async function analyzeSingleImage(image: File): Promise<DetectionResult> {
  return detectDisease(image);
}

export async function analyzeFieldImages(images: File[]): Promise<FieldAnalysisResult> {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!API_KEY || API_KEY === 'your_gemini_key_here') {
    throw new Error("Gemini API key is missing. Please add it to .env.local");
  }

  try {
    // Convert all images to base64 inline_data parts
    const base64Promises = images.map(async (image, index) => {
      const base64Str = await fileToBase64(image);
      const base64Data = base64Str.split(',')[1];
      return {
        inline_data: {
          mime_type: image.type,
          data: base64Data
        }
      };
    });

    const inlineDataParts = await Promise.all(base64Promises);

    const fileNamesText = images.map((img, i) => `Image Index ${i}: "${img.name}"`).join('\n');

    const promptText = `
${CROPCARE_PROMPT}

These images belong to the same agricultural field. Analyze all images collectively and generate a complete agricultural field health report.

Here are the filenames corresponding to the uploaded images in sequence:
${fileNamesText}

Tasks:
- detect plant diseases across the uploaded photos
- identify repeated disease patterns
- estimate disease spread percentage across the field
- estimate severity levels
- identify nutrient deficiencies
- generate treatment recommendations
- recommend fertilizers with NPK ratio, purpose, dosage, and application method
- recommend organic and chemical solutions
- generate overall field summary
- identify urgent risks if present

You MUST return a clean, valid JSON object conforming exactly to this schema:
{
  "overallHealth": 78,
  "severity": "Low" | "Medium" | "High" | "Emergency",
  "spreadEstimate": "32%",
  "riskLevel": "Low" | "Medium" | "High" | "Emergency",
  "diseases": [
    {
      "name": "Leaf Blight",
      "severity": "Low" | "Medium" | "High" | "Emergency",
      "spread": "35%",
      "symptoms": ["list of symptoms observed in these images"],
      "fertilizers": [
        {
          "name": "NPK 19:19:19",
          "purpose": "Improve leaf recovery and plant growth",
          "dosage": "5g per liter",
          "applicationMethod": "Foliar spray"
        }
      ],
      "organicTreatments": ["list of organic treatment alternatives"],
      "chemicalTreatments": ["list of chemical treatment alternatives"]
    }
  ],
  "recommendations": ["general field maintenance or improvement recommendations"],
  "urgentActions": ["list of immediate/urgent actions the farmer must take to prevent spread"],
  "summary": "AI-generated collective field summary of the current status.",
  "imageWiseAnalysis": [
    {
      "imageIndex": 0,
      "fileName": "Name of image matching the input list",
      "detectedDisease": "Disease name or Healthy",
      "severity": "Low" | "Medium" | "High" | "Emergency",
      "confidence": 85,
      "description": "Brief diagnostic details about what is visible in this specific image"
    }
  ]
}

Ensure smart disease grouping: If multiple images contain the same disease, merge them into one grouped entry in the "diseases" list, estimate the field-wide spread percentage, and avoid duplicating entries. Do not output anything other than raw, valid JSON. Do not include markdown \`\`\`json wrappers.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: promptText },
            ...inlineDataParts
          ]
        }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error Detail:", errText);
      throw new Error(`Failed to reach Gemini brain for multi-image analysis: ${response.statusText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Clean and extract JSON robustly
    try {
      const start = textResponse.indexOf('{');
      const end = textResponse.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        const jsonStr = textResponse.substring(start, end + 1);
        return JSON.parse(jsonStr) as FieldAnalysisResult;
      }
      // Fallback simple replacement
      const jsonStr = textResponse.replace(/```json|```/g, '').trim();
      return JSON.parse(jsonStr) as FieldAnalysisResult;
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON. Raw response:", textResponse);
      throw new Error("Received invalid diagnostic format from AI. Please try scanning again.");
    }

  } catch (error) {
    console.error("Multi-Image Field Detection Error:", error);
    throw new Error("The AI brain couldn't analyze the field images. Please ensure the photos are clear and try again.");
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

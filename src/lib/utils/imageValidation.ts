export interface ImageQualityReport {
  isValid: boolean;
  score: number;
  warnings: string[];
  metrics: {
    brightness: number;
    blur: number;
    resolution: { width: number; height: number };
  };
}

export async function validateImageQuality(file: File): Promise<ImageQualityReport> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ isValid: true, score: 100, warnings: [], metrics: { brightness: 100, blur: 0, resolution: { width: img.width, height: img.height } } });
        return;
      }

      // Resize for performance
      const scale = Math.min(1, 400 / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 1. Brightness Check
      let brightnessSum = 0;
      for (let i = 0; i < data.length; i += 4) {
        brightnessSum += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }
      const avgBrightness = brightnessSum / (data.length / 4);

      // 2. Simple Blur Detection (Edge Detection Variance)
      // We check the variance of grayscale values to approximate sharpness
      let graySum = 0;
      const grayData = new Float32Array(data.length / 4);
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        grayData[i / 4] = gray;
        graySum += gray;
      }
      const grayAvg = graySum / grayData.length;
      let variance = 0;
      for (let i = 0; i < grayData.length; i++) {
        variance += Math.pow(grayData[i] - grayAvg, 2);
      }
      const sharpness = Math.sqrt(variance / grayData.length);

      const warnings: string[] = [];
      if (avgBrightness < 50) warnings.push("Image is too dark. Please use better lighting.");
      if (avgBrightness > 220) warnings.push("Image is overexposed. Avoid direct harsh light.");
      if (sharpness < 20) warnings.push("Image appears blurry or out of focus.");
      if (img.width < 500 || img.height < 500) warnings.push("Low resolution. Please move closer to the crop.");

      URL.revokeObjectURL(img.src);

      resolve({
        isValid: warnings.length === 0,
        score: Math.max(0, 100 - (warnings.length * 25)),
        warnings,
        metrics: {
          brightness: Math.round((avgBrightness / 255) * 100),
          blur: Math.round(sharpness),
          resolution: { width: img.width, height: img.height }
        }
      });
    };

    img.onerror = () => {
      resolve({ isValid: false, score: 0, warnings: ["Invalid image file."], metrics: { brightness: 0, blur: 0, resolution: { width: 0, height: 0 } } });
    };
  });
}

/**
 * High-performance browser canvas image compressor.
 * Downscales and compresses user-selected images to crisp, compact WebP / JPEG Data URLs
 * ensuring total payload remains well under Vercel's 4.5MB Serverless Function limit.
 */
export async function compressImage(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  targetMaxKb = 150
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selected file must be an image");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let { width, height } = img;

        // Calculate proportional scale
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return resolve(img.src);
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Try JPEG with progressive quality reduction to meet targetMaxKb
        let quality = 0.78;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        // Approximate size in KB: base64 string length * 0.75 / 1024
        let sizeKb = Math.round((dataUrl.length * 0.75) / 1024);

        if (sizeKb > targetMaxKb) {
          // Pass 2: Reduce quality
          quality = 0.65;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
          sizeKb = Math.round((dataUrl.length * 0.75) / 1024);
        }

        if (sizeKb > targetMaxKb) {
          // Pass 3: Downscale canvas slightly
          const smallCanvas = document.createElement("canvas");
          smallCanvas.width = Math.round(width * 0.8);
          smallCanvas.height = Math.round(height * 0.8);
          const sCtx = smallCanvas.getContext("2d");
          if (sCtx) {
            sCtx.imageSmoothingEnabled = true;
            sCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
            dataUrl = smallCanvas.toDataURL("image/jpeg", 0.60);
          }
        }

        resolve(dataUrl);
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}

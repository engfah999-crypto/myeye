export function validateImageFile(file: File) {
  const errors: string[] = [];

  if (!file.type.startsWith("image/")) {
    errors.push("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
  }

  if (file.size > 8 * 1024 * 1024) {
    errors.push("ขนาดไฟล์ต้องไม่เกิน 8 MB");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function analyzeImageQuality(file: File) {
  const dataUrl = await fileToDataUrl(file);

  return new Promise<{ width: number; height: number; brightness: number; blur: number }>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("ไม่สามารถอ่านคุณภาพภาพได้"));
        return;
      }

      context.drawImage(img, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let brightness = 0;
      let blur = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        brightness += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      }

      brightness /= pixels.length / 4;
      blur = Math.max(0, 100 - brightness / 2.55);

      resolve({
        width: img.width,
        height: img.height,
        brightness,
        blur,
      });
    };

    img.onerror = () => reject(new Error("ไม่สามารถเปิดไฟล์ภาพได้"));
    img.src = dataUrl;
  });
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("ไม่สามารถอ่านไฟล์ได้"));
    reader.readAsDataURL(file);
  });
}

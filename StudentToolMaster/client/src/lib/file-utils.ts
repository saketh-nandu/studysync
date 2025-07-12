export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export const getFileIcon = (fileType: string): string => {
  if (fileType.startsWith("image/")) return "image";
  if (fileType.startsWith("video/")) return "videocam";
  if (fileType.startsWith("audio/")) return "audiotrack";
  if (fileType.includes("pdf")) return "picture_as_pdf";
  if (fileType.includes("word") || fileType.includes("document")) return "description";
  if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "table_chart";
  if (fileType.includes("powerpoint") || fileType.includes("presentation")) return "slideshow";
  if (fileType.includes("zip") || fileType.includes("rar") || fileType.includes("tar")) return "archive";
  if (fileType.includes("text")) return "text_snippet";
  return "insert_drive_file";
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.type.includes(type));
};

export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const downloadFile = (data: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsText(file);
  });
};

export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsDataURL(file);
  });
};

export const compressImage = (file: File, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to compress image"));
          }
        }, "image/jpeg", quality);
      } else {
        reject(new Error("Failed to get canvas context"));
      }
    };
    
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};

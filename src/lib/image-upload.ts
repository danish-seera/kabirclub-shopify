// Image upload utility using ImgBB API

const IMGBB_API_KEY = '6a2c9d07c5f49f5ca92a420af7dca100';
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

export interface ImageUploadResult {
  url: string;
  deleteUrl?: string;
  filename: string;
  size: number;
}

export const uploadImage = async (
  base64Image: string, 
  controller: AbortController
): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('image', base64Image);

    const response = await fetch(`${IMGBB_API_URL}?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error('Failed to upload image: API returned error');
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw error;
    }
    throw error;
  }
};

export const uploadImageFile = async (
  file: File,
  controller?: AbortController
): Promise<ImageUploadResult> => {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);
    
    const formData = new FormData();
    formData.append('image', base64);

    const response = await fetch(`${IMGBB_API_URL}?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
      signal: controller?.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.success) {
      return {
        url: data.data.url,
        deleteUrl: data.data.delete_url,
        filename: data.data.title || file.name,
        size: data.data.size
      };
    } else {
      throw new Error('Failed to upload image: API returned error');
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw error;
    }
    console.error('Image upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

export const uploadMultipleImages = async (
  files: File[],
  // eslint-disable-next-line no-unused-vars
  onProgress?: (uploaded: number, total: number) => void,
  controller?: AbortController
): Promise<ImageUploadResult[]> => {
  const results: ImageUploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;
    
    try {
      const result = await uploadImageFile(file, controller);
      results.push(result);
      if (onProgress) {
        onProgress(i + 1, files.length);
      }
    } catch (error) {
      console.error(`Failed to upload image ${i + 1}:`, error);
      throw error;
    }
  }
  
  return results;
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove data:image/...;base64, prefix
        const base64 = reader.result.split(',')[1];
        if (base64) {
          resolve(base64);
        } else {
          reject(new Error('Failed to extract base64 data'));
        }
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

// Helper function to validate image file
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'File must be an image' };
  }

  // Check file size (max 32MB for ImgBB)
  const maxSize = 32 * 1024 * 1024; // 32MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'Image size must be less than 32MB' };
  }

  // Check supported formats
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!supportedFormats.includes(file.type)) {
    return { isValid: false, error: 'Supported formats: JPEG, PNG, GIF, WebP' };
  }

  return { isValid: true };
};

// Helper function to compress image if needed
export const compressImage = (file: File, maxWidth = 1920, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file); // Return original if compression fails
          }
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

export const uploadProfilePhoto = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Image size must be less than 5MB'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      resolve(base64String);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

export const deleteProfilePhoto = (userId: string) => {
  const key = `mindcare_profile_photo_${userId}`;
  localStorage.removeItem(key);
};

// Image service for handling profile picture functionality locally
// This service converts images to base64 and stores them in local storage

const LOCAL_STORAGE_PROFILE_IMAGE_KEY = "volunteerSyncProfileImage";

class ImageService {
  /**
   * Converts an image File to a base64 string
   * @param file The image file to convert
   * @returns A Promise that resolves to the base64 string
   */
  convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert image to base64"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Failed to read the image file"));
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Saves the profile image to local storage
   * @param userId The ID of the user
   * @param imageBase64 The base64 encoded image
   */
  saveProfileImage(userId: string, imageBase64: string): void {
    try {
      const profileImagesMap = this.getProfileImagesMap();
      profileImagesMap[userId] = imageBase64;
      localStorage.setItem(
        LOCAL_STORAGE_PROFILE_IMAGE_KEY,
        JSON.stringify(profileImagesMap)
      );
    } catch (error) {
      console.error("Error saving profile image to localStorage:", error);
    }
  }

  /**
   * Gets the profile image from local storage
   * @param userId The ID of the user
   * @returns The base64 encoded image or null if not found
   */
  getProfileImage(userId: string): string | null {
    try {
      const profileImagesMap = this.getProfileImagesMap();
      return profileImagesMap[userId] || null;
    } catch (error) {
      console.error("Error retrieving profile image from localStorage:", error);
      return null;
    }
  }

  /**
   * Removes the profile image from local storage
   * @param userId The ID of the user
   */
  removeProfileImage(userId: string): void {
    try {
      const profileImagesMap = this.getProfileImagesMap();
      delete profileImagesMap[userId];
      localStorage.setItem(
        LOCAL_STORAGE_PROFILE_IMAGE_KEY,
        JSON.stringify(profileImagesMap)
      );
    } catch (error) {
      console.error("Error removing profile image from localStorage:", error);
    }
  }

  /**
   * Gets the map of all profile images from local storage
   * @returns A map of user IDs to base64 encoded images
   */
  private getProfileImagesMap(): Record<string, string> {
    const profileImagesString = localStorage.getItem(
      LOCAL_STORAGE_PROFILE_IMAGE_KEY
    );
    return profileImagesString ? JSON.parse(profileImagesString) : {};
  }
}

const imageService = new ImageService();
export default imageService;

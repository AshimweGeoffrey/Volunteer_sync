// Google Maps API Loader
// Handles dynamic loading of Google Maps JavaScript API to avoid loading warnings

const GOOGLE_MAPS_API_KEY = "AIzaSyAk2NlJaP3zmlm2csl0xDrf_-WeRyYpgwU";

interface GoogleMapsLoaderOptions {
  apiKey?: string;
  libraries?: string[];
  version?: string;
  language?: string;
  region?: string;
}

class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private isLoading = false;
  private isLoaded = false;
  private loadPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  public async load(options: GoogleMapsLoaderOptions = {}): Promise<void> {
    // If already loaded, return immediately
    if (this.isLoaded) {
      return Promise.resolve();
    }

    // If currently loading, return the existing promise
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    // Start loading
    this.isLoading = true;
    this.loadPromise = this.loadScript(options);

    try {
      await this.loadPromise;
      this.isLoaded = true;
    } catch (error) {
      console.error("Failed to load Google Maps API:", error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private loadScript(options: GoogleMapsLoaderOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.google?.maps) {
        resolve();
        return;
      }

      // Check if script tag already exists
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (existingScript) {
        // Script exists but may not be loaded yet
        existingScript.addEventListener("load", () => resolve());
        existingScript.addEventListener("error", (error) => reject(error));
        return;
      }

      // Create script element
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.defer = true;

      // Build URL with parameters
      const params = new URLSearchParams({
        key: options.apiKey || GOOGLE_MAPS_API_KEY,
        libraries: (options.libraries || ["places"]).join(","),
        v: options.version || "weekly",
        ...(options.language && { language: options.language }),
        ...(options.region && { region: options.region }),
      });

      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;

      // Set up event handlers
      script.addEventListener("load", () => {
        if (window.google?.maps) {
          resolve();
        } else {
          reject(new Error("Google Maps API failed to load properly"));
        }
      });

      script.addEventListener("error", (error) => {
        reject(new Error(`Failed to load Google Maps API script: ${error}`));
      });

      // Add to document
      document.head.appendChild(script);
    });
  }

  public isGoogleMapsLoaded(): boolean {
    return this.isLoaded && !!window.google?.maps;
  }
}

// Export singleton instance
export const googleMapsLoader = GoogleMapsLoader.getInstance();

// Utility function for components
export const loadGoogleMapsAPI = (
  options?: GoogleMapsLoaderOptions
): Promise<void> => {
  return googleMapsLoader.load(options);
};

// Type declarations for Google Maps
declare global {
  interface Window {
    google?: {
      maps: typeof google.maps;
    };
  }
}

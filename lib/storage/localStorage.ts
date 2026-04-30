/**
 * LocalStorage Service
 * 
 * Provides type-safe localStorage operations with error handling for demo-mode data persistence.
 * Handles QuotaExceededError and localStorage unavailability gracefully.
 * 
 * Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 21.3
 */

/**
 * Service class for managing browser localStorage operations with type safety and error handling
 */
export class LocalStorageService {
    /**
     * Check if localStorage is available in the current browser environment
     * 
     * @returns {boolean} True if localStorage is available and functional, false otherwise
     */
    static isAvailable(): boolean {
        try {
            const testKey = '__localStorage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            console.warn('localStorage is not available:', error);
            return false;
        }
    }

    /**
     * Retrieve a value from localStorage with type safety
     * 
     * @template T The expected type of the stored value
     * @param {string} key The localStorage key to retrieve
     * @param {T} defaultValue The default value to return if key doesn't exist or parsing fails
     * @returns {T} The parsed value from localStorage or the default value
     */
    static get<T>(key: string, defaultValue: T): T {
        if (!this.isAvailable()) {
            console.warn('localStorage unavailable, returning default value');
            return defaultValue;
        }

        try {
            const item = localStorage.getItem(key);

            if (item === null) {
                return defaultValue;
            }

            return JSON.parse(item) as T;
        } catch (error) {
            console.error(`Error reading from localStorage (key: ${key}):`, error);
            return defaultValue;
        }
    }

    /**
     * Store a value in localStorage with error handling
     * 
     * @template T The type of the value to store
     * @param {string} key The localStorage key to set
     * @param {T} value The value to store (will be JSON stringified)
     * @returns {boolean} True if storage succeeded, false if it failed
     */
    static set<T>(key: string, value: T): boolean {
        if (!this.isAvailable()) {
            console.warn('localStorage unavailable, operating in memory-only mode');
            return false;
        }

        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            if (error instanceof DOMException) {
                if (error.name === 'QuotaExceededError') {
                    console.error('localStorage quota exceeded. Please clear some data to continue.');
                    // You can emit a custom event or use a toast notification here
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(
                            new CustomEvent('localStorage:quotaExceeded', {
                                detail: { key, error }
                            })
                        );
                    }
                } else {
                    console.error(`localStorage error (${error.name}):`, error.message);
                }
            } else {
                console.error(`Error writing to localStorage (key: ${key}):`, error);
            }
            return false;
        }
    }

    /**
     * Remove a specific key from localStorage
     * 
     * @param {string} key The localStorage key to remove
     * @returns {boolean} True if removal succeeded, false if it failed
     */
    static remove(key: string): boolean {
        if (!this.isAvailable()) {
            console.warn('localStorage unavailable');
            return false;
        }

        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing from localStorage (key: ${key}):`, error);
            return false;
        }
    }

    /**
     * Clear all data from localStorage
     * 
     * @returns {boolean} True if clear succeeded, false if it failed
     */
    static clear(): boolean {
        if (!this.isAvailable()) {
            console.warn('localStorage unavailable');
            return false;
        }

        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
}

/**
 * Storage keys used throughout the application
 * Centralized to prevent typos and ensure consistency
 */
export const STORAGE_KEYS = {
    PORTFOLIO: 'carbon-trade-x:portfolio',
    PROFILE: 'carbon-trade-x:profile',
    ONBOARDING_PROGRESS: 'carbon-trade-x:onboarding',
    CONSENT: 'carbon-trade-x:consent',
    MARKETPLACE: 'carbon-trade-x:marketplace',
} as const;

/**
 * Type for storage keys to ensure type safety when accessing storage
 */
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

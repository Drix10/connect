/**
 * Unit tests for LocalStorage Service
 * 
 * Tests Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 21.3
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LocalStorageService, STORAGE_KEYS } from './localStorage';

describe('LocalStorageService', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    describe('isAvailable', () => {
        it('should return true when localStorage is available', () => {
            expect(LocalStorageService.isAvailable()).toBe(true);
        });

        it('should return false when localStorage throws an error', () => {
            const originalSetItem = localStorage.setItem;
            const originalRemoveItem = localStorage.removeItem;

            localStorage.setItem = vi.fn(() => {
                throw new Error('localStorage disabled');
            });
            localStorage.removeItem = vi.fn();

            expect(LocalStorageService.isAvailable()).toBe(false);

            localStorage.setItem = originalSetItem;
            localStorage.removeItem = originalRemoveItem;
        });
    });

    describe('get', () => {
        it('should retrieve and parse stored data correctly', () => {
            const testData = { id: '1', name: 'Test Credit', value: 100 };
            localStorage.setItem('test-key', JSON.stringify(testData));

            const result = LocalStorageService.get('test-key', null);
            expect(result).toEqual(testData);
        });

        it('should return default value when key does not exist', () => {
            const defaultValue = { empty: true };
            const result = LocalStorageService.get('nonexistent-key', defaultValue);
            expect(result).toEqual(defaultValue);
        });

        it('should handle different data types correctly', () => {
            // String
            localStorage.setItem('string-key', JSON.stringify('test string'));
            expect(LocalStorageService.get('string-key', '')).toBe('test string');

            // Number
            localStorage.setItem('number-key', JSON.stringify(42));
            expect(LocalStorageService.get('number-key', 0)).toBe(42);

            // Boolean
            localStorage.setItem('boolean-key', JSON.stringify(true));
            expect(LocalStorageService.get('boolean-key', false)).toBe(true);

            // Array
            const arrayData = [1, 2, 3, 4, 5];
            localStorage.setItem('array-key', JSON.stringify(arrayData));
            expect(LocalStorageService.get('array-key', [])).toEqual(arrayData);

            // Object
            const objectData = { nested: { value: 'test' } };
            localStorage.setItem('object-key', JSON.stringify(objectData));
            expect(LocalStorageService.get('object-key', {})).toEqual(objectData);
        });

        it('should return default value when stored data is invalid JSON', () => {
            localStorage.setItem('invalid-json', 'not valid json {');
            const defaultValue = { fallback: true };
            const result = LocalStorageService.get('invalid-json', defaultValue);
            expect(result).toEqual(defaultValue);
        });

        it('should return default value when localStorage is unavailable', () => {
            const originalGetItem = localStorage.getItem;
            localStorage.getItem = vi.fn(() => {
                throw new Error('localStorage unavailable');
            });

            const defaultValue = { fallback: true };
            const result = LocalStorageService.get('test-key', defaultValue);
            expect(result).toEqual(defaultValue);

            localStorage.getItem = originalGetItem;
        });

        it('should handle null values correctly', () => {
            localStorage.setItem('null-key', JSON.stringify(null));
            expect(LocalStorageService.get('null-key', 'default')).toBe(null);
        });

        it('should handle empty string values', () => {
            localStorage.setItem('empty-key', JSON.stringify(''));
            expect(LocalStorageService.get('empty-key', 'default')).toBe('');
        });
    });

    describe('set', () => {
        it('should store data correctly and return true', () => {
            const testData = { id: '1', name: 'Test', value: 100 };
            const result = LocalStorageService.set('test-key', testData);

            expect(result).toBe(true);
            const stored = localStorage.getItem('test-key');
            expect(JSON.parse(stored!)).toEqual(testData);
        });

        it('should handle different data types correctly', () => {
            // String
            expect(LocalStorageService.set('string-key', 'test')).toBe(true);
            expect(JSON.parse(localStorage.getItem('string-key')!)).toBe('test');

            // Number
            expect(LocalStorageService.set('number-key', 42)).toBe(true);
            expect(JSON.parse(localStorage.getItem('number-key')!)).toBe(42);

            // Boolean
            expect(LocalStorageService.set('boolean-key', true)).toBe(true);
            expect(JSON.parse(localStorage.getItem('boolean-key')!)).toBe(true);

            // Array
            const arrayData = [1, 2, 3];
            expect(LocalStorageService.set('array-key', arrayData)).toBe(true);
            expect(JSON.parse(localStorage.getItem('array-key')!)).toEqual(arrayData);

            // Object
            const objectData = { nested: { value: 'test' } };
            expect(LocalStorageService.set('object-key', objectData)).toBe(true);
            expect(JSON.parse(localStorage.getItem('object-key')!)).toEqual(objectData);
        });

        it('should overwrite existing data', () => {
            LocalStorageService.set('test-key', 'first value');
            LocalStorageService.set('test-key', 'second value');

            const result = LocalStorageService.get('test-key', '');
            expect(result).toBe('second value');
        });

        it('should return false when localStorage is unavailable', () => {
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = vi.fn(() => {
                throw new Error('localStorage unavailable');
            });

            const result = LocalStorageService.set('test-key', 'data');
            expect(result).toBe(false);

            localStorage.setItem = originalSetItem;
        });

        it('should handle null values', () => {
            expect(LocalStorageService.set('null-key', null)).toBe(true);
            expect(LocalStorageService.get('null-key', 'default')).toBe(null);
        });
    });

    describe('remove', () => {
        it('should remove a key from localStorage and return true', () => {
            localStorage.setItem('test-key', 'test value');
            expect(localStorage.getItem('test-key')).toBe('test value');

            const result = LocalStorageService.remove('test-key');

            expect(result).toBe(true);
            expect(localStorage.getItem('test-key')).toBe(null);
        });

        it('should return true even when removing non-existent key', () => {
            const result = LocalStorageService.remove('nonexistent-key');
            expect(result).toBe(true);
        });

        it('should return false when localStorage is unavailable', () => {
            const originalRemoveItem = localStorage.removeItem;
            localStorage.removeItem = vi.fn(() => {
                throw new Error('localStorage unavailable');
            });

            const result = LocalStorageService.remove('test-key');
            expect(result).toBe(false);

            localStorage.removeItem = originalRemoveItem;
        });
    });

    describe('clear', () => {
        it('should clear all data from localStorage and return true', () => {
            localStorage.setItem('key1', 'value1');
            localStorage.setItem('key2', 'value2');
            localStorage.setItem('key3', 'value3');

            expect(localStorage.length).toBe(3);

            const result = LocalStorageService.clear();

            expect(result).toBe(true);
            expect(localStorage.length).toBe(0);
            expect(localStorage.getItem('key1')).toBe(null);
            expect(localStorage.getItem('key2')).toBe(null);
            expect(localStorage.getItem('key3')).toBe(null);
        });

        it('should return true when clearing already empty localStorage', () => {
            expect(localStorage.length).toBe(0);
            const result = LocalStorageService.clear();
            expect(result).toBe(true);
        });

        it('should return false when localStorage is unavailable', () => {
            const originalClear = localStorage.clear;
            localStorage.clear = vi.fn(() => {
                throw new Error('localStorage unavailable');
            });

            const result = LocalStorageService.clear();
            expect(result).toBe(false);

            localStorage.clear = originalClear;
        });
    });

    describe('Integration scenarios', () => {
        it('should handle complete workflow: set, get, remove', () => {
            const portfolio = {
                credits: [
                    { id: '1', name: 'Credit 1', value: 100 },
                    { id: '2', name: 'Credit 2', value: 200 },
                ],
                totalValue: 300,
            };

            // Set
            expect(LocalStorageService.set(STORAGE_KEYS.PORTFOLIO, portfolio)).toBe(true);

            // Get
            const retrieved = LocalStorageService.get(STORAGE_KEYS.PORTFOLIO, null);
            expect(retrieved).toEqual(portfolio);

            // Remove
            expect(LocalStorageService.remove(STORAGE_KEYS.PORTFOLIO)).toBe(true);
            expect(LocalStorageService.get(STORAGE_KEYS.PORTFOLIO, null)).toBe(null);
        });

        it('should handle multiple storage keys independently', () => {
            const portfolio = { credits: [], totalValue: 0 };
            const profile = { name: 'Test User', email: 'test@example.com' };
            const consent = { given: true, date: '2025-01-27' };

            LocalStorageService.set(STORAGE_KEYS.PORTFOLIO, portfolio);
            LocalStorageService.set(STORAGE_KEYS.PROFILE, profile);
            LocalStorageService.set(STORAGE_KEYS.CONSENT, consent);

            expect(LocalStorageService.get(STORAGE_KEYS.PORTFOLIO, null)).toEqual(portfolio);
            expect(LocalStorageService.get(STORAGE_KEYS.PROFILE, null)).toEqual(profile);
            expect(LocalStorageService.get(STORAGE_KEYS.CONSENT, null)).toEqual(consent);

            LocalStorageService.remove(STORAGE_KEYS.PROFILE);

            expect(LocalStorageService.get(STORAGE_KEYS.PORTFOLIO, null)).toEqual(portfolio);
            expect(LocalStorageService.get(STORAGE_KEYS.PROFILE, null)).toBe(null);
            expect(LocalStorageService.get(STORAGE_KEYS.CONSENT, null)).toEqual(consent);
        });

        it('should handle complex nested data structures', () => {
            const complexData = {
                user: {
                    profile: {
                        name: 'Test User',
                        settings: {
                            theme: 'dark',
                            notifications: {
                                email: true,
                                push: false,
                            },
                        },
                    },
                    portfolio: {
                        credits: [
                            {
                                id: '1',
                                details: {
                                    name: 'Credit 1',
                                    metadata: {
                                        tags: ['renewable', 'solar'],
                                    },
                                },
                            },
                        ],
                    },
                },
            };

            LocalStorageService.set('complex-key', complexData);
            const retrieved = LocalStorageService.get('complex-key', null);
            expect(retrieved).toEqual(complexData);
        });
    });

    describe('Error handling for QuotaExceededError', () => {
        it('should handle QuotaExceededError and emit custom event', () => {
            const eventListener = vi.fn();
            window.addEventListener('localStorage:quotaExceeded', eventListener);

            // Mock setItem to throw QuotaExceededError only for actual data, not for availability check
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = vi.fn((key: string, value: string) => {
                if (key === '__localStorage_test__') {
                    // Allow availability check to pass
                    originalSetItem.call(localStorage, key, value);
                } else {
                    // Throw QuotaExceededError for actual data
                    const error = new Error('Quota exceeded');
                    error.name = 'QuotaExceededError';
                    Object.setPrototypeOf(error, DOMException.prototype);
                    throw error;
                }
            });

            const result = LocalStorageService.set('test-key', 'data');

            expect(result).toBe(false);
            expect(eventListener).toHaveBeenCalled();

            window.removeEventListener('localStorage:quotaExceeded', eventListener);
            localStorage.setItem = originalSetItem;
        });
    });
});

describe('STORAGE_KEYS', () => {
    it('should have all required storage keys defined', () => {
        expect(STORAGE_KEYS.PORTFOLIO).toBe('carbon-trade-x:portfolio');
        expect(STORAGE_KEYS.PROFILE).toBe('carbon-trade-x:profile');
        expect(STORAGE_KEYS.ONBOARDING_PROGRESS).toBe('carbon-trade-x:onboarding');
        expect(STORAGE_KEYS.CONSENT).toBe('carbon-trade-x:consent');
        expect(STORAGE_KEYS.MARKETPLACE).toBe('carbon-trade-x:marketplace');
    });

    it('should have unique values for all keys', () => {
        const values = Object.values(STORAGE_KEYS);
        const uniqueValues = new Set(values);
        expect(uniqueValues.size).toBe(values.length);
    });

    it('should follow consistent naming convention', () => {
        const values = Object.values(STORAGE_KEYS);
        values.forEach((value) => {
            expect(value).toMatch(/^carbon-trade-x:/);
        });
    });
});

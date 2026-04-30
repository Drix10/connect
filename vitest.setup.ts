import { beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock localStorage for tests
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
        get length() {
            return Object.keys(store).length;
        },
        key: (index: number) => {
            const keys = Object.keys(store);
            return keys[index] || null;
        },
    };
})();

// Setup before each test
beforeEach(() => {
    global.localStorage = localStorageMock as Storage;
    localStorage.clear();
    // Reset any mocked functions
    vi.restoreAllMocks();
});

// Cleanup after each test
afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

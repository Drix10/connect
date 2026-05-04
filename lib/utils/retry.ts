/**
 * Retry Logic and Circuit Breaker for External API Calls
 * Fixes Issue 10: No Retry Logic for External API Calls
 */

/**
 * Retry configuration options
 */
export interface RetryOptions {
    /** Maximum number of retry attempts */
    maxRetries?: number;
    /** Initial delay in milliseconds */
    initialDelay?: number;
    /** Maximum delay in milliseconds */
    maxDelay?: number;
    /** Multiplier for exponential backoff */
    backoffMultiplier?: number;
    /** Function to determine if error should trigger retry */
    shouldRetry?: (error: any) => boolean;
    /** Callback for retry attempts */
    onRetry?: (attempt: number, error: any) => void;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    shouldRetry: (error: any) => {
        // Retry on network errors or 5xx server errors
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            return true;
        }
        if (error.response?.status >= 500 && error.response?.status < 600) {
            return true;
        }
        // Retry on rate limiting (429)
        if (error.response?.status === 429) {
            return true;
        }
        return false;
    },
    onRetry: (attempt: number, error: any) => {
        console.warn(`Retry attempt ${attempt}:`, error.message);
    },
};

/**
 * Executes a function with exponential backoff retry logic
 * 
 * @param fn - Async function to execute
 * @param options - Retry configuration options
 * @returns Promise resolving to function result
 * 
 * @example
 * const data = await retryWithBackoff(
 *   () => fetch('https://api.example.com/data'),
 *   { maxRetries: 3, initialDelay: 1000 }
 * );
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: any;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Don't retry if this is the last attempt
            if (attempt === config.maxRetries) {
                break;
            }

            // Check if we should retry this error
            if (!config.shouldRetry(error)) {
                throw error;
            }

            // Calculate delay with exponential backoff
            const delay = Math.min(
                config.initialDelay * Math.pow(config.backoffMultiplier, attempt),
                config.maxDelay
            );

            // Call retry callback
            config.onRetry(attempt + 1, error);

            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

/**
 * Circuit breaker states
 * FIXED: Exported for external use
 */
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerOptions {
    /** Number of failures before opening circuit */
    failureThreshold?: number;
    /** Time in milliseconds before attempting to close circuit */
    resetTimeout?: number;
    /** Callback when circuit opens */
    onOpen?: () => void;
    /** Callback when circuit closes */
    onClose?: () => void;
    /** Callback when circuit half-opens */
    onHalfOpen?: () => void;
}

/**
 * Circuit Breaker Pattern Implementation
 * FIXED: Added mutex-like protection against race conditions
 * Prevents cascading failures by stopping requests to failing services
 * 
 * @example
 * const breaker = new CircuitBreaker({ failureThreshold: 5, resetTimeout: 60000 });
 * 
 * try {
 *   const result = await breaker.execute(() => fetchExternalAPI());
 * } catch (error) {
 *   if (error.message === 'Circuit breaker is OPEN') {
 *     // Service is down, use fallback
 *   }
 * }
 */
export class CircuitBreaker {
    private failures = 0;
    private lastFailureTime: number | null = null;
    private state: CircuitState = 'CLOSED';
    private successCount = 0;
    private executing = 0; // FIXED: Track concurrent executions

    private readonly failureThreshold: number;
    private readonly resetTimeout: number;
    private readonly onOpen?: () => void;
    private readonly onClose?: () => void;
    private readonly onHalfOpen?: () => void;

    constructor(options: CircuitBreakerOptions = {}) {
        this.failureThreshold = options.failureThreshold ?? 5;
        this.resetTimeout = options.resetTimeout ?? 60000;
        this.onOpen = options.onOpen;
        this.onClose = options.onClose;
        this.onHalfOpen = options.onHalfOpen;
    }

    /**
     * Executes a function with circuit breaker protection
     * FIXED: Added execution tracking to prevent race conditions
     * 
     * @param fn - Async function to execute
     * @returns Promise resolving to function result
     * @throws Error if circuit is open
     */
    async execute<T>(fn: () => Promise<T>): Promise<T> {
        // Check if circuit should transition from OPEN to HALF_OPEN
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime! > this.resetTimeout) {
                // Only first caller transitions to HALF_OPEN
                if (this.executing === 0) {
                    this.transitionTo('HALF_OPEN');
                } else {
                    // Other concurrent callers still see OPEN
                    throw new Error('Circuit breaker is OPEN');
                }
            } else {
                throw new Error('Circuit breaker is OPEN');
            }
        }

        // FIXED: Track execution
        this.executing++;

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        } finally {
            // FIXED: Always decrement
            this.executing--;
        }
    }

    /**
     * Handles successful execution
     * FIXED: Validate state before transitions
     */
    private onSuccess(): void {
        if (this.state === 'HALF_OPEN') {
            this.successCount++;
            // Require 2 successful calls to close circuit
            if (this.successCount >= 2) {
                this.transitionTo('CLOSED');
            }
        } else if (this.state === 'CLOSED') {
            this.failures = 0;
        }
    }

    /**
     * Handles failed execution
     * FIXED: Validate state before transitions
     */
    private onFailure(): void {
        this.failures++;
        this.lastFailureTime = Date.now();

        if (this.state === 'HALF_OPEN') {
            // Immediately open on failure in HALF_OPEN state
            this.transitionTo('OPEN');
        } else if (this.state === 'CLOSED' && this.failures >= this.failureThreshold) {
            this.transitionTo('OPEN');
        }
    }

    /**
     * Transitions circuit to a new state
     */
    private transitionTo(newState: CircuitState): void {
        const oldState = this.state;
        this.state = newState;

        console.log(`Circuit breaker: ${oldState} -> ${newState}`);

        if (newState === 'CLOSED') {
            this.failures = 0;
            this.successCount = 0;
            this.onClose?.();
        } else if (newState === 'OPEN') {
            this.successCount = 0;
            this.onOpen?.();
        } else if (newState === 'HALF_OPEN') {
            this.successCount = 0;
            this.onHalfOpen?.();
        }
    }

    /**
     * Gets current circuit state
     */
    getState(): CircuitState {
        return this.state;
    }

    /**
     * Gets current failure count
     */
    getFailures(): number {
        return this.failures;
    }

    /**
     * Manually resets the circuit breaker
     */
    reset(): void {
        this.transitionTo('CLOSED');
    }
}

/**
 * Creates a fetch wrapper with retry and circuit breaker
 * 
 * @param options - Combined retry and circuit breaker options
 * @returns Wrapped fetch function
 * 
 * @example
 * const resilientFetch = createResilientFetch({
 *   maxRetries: 3,
 *   failureThreshold: 5,
 *   resetTimeout: 60000
 * });
 * 
 * const response = await resilientFetch('https://api.example.com/data');
 */
export function createResilientFetch(
    options: RetryOptions & CircuitBreakerOptions = {}
) {
    const circuitBreaker = new CircuitBreaker(options);

    return async function resilientFetch(
        url: string,
        init?: RequestInit
    ): Promise<Response> {
        return await circuitBreaker.execute(async () => {
            return await retryWithBackoff(
                async () => {
                    const response = await fetch(url, init);

                    // Throw on HTTP errors to trigger retry
                    if (!response.ok) {
                        const error: any = new Error(
                            `HTTP ${response.status}: ${response.statusText}`
                        );
                        error.response = response;
                        throw error;
                    }

                    return response;
                },
                {
                    ...options,
                    shouldRetry: (error) => {
                        // Don't retry 4xx errors (except 429)
                        if (
                            error.response?.status >= 400 &&
                            error.response?.status < 500 &&
                            error.response?.status !== 429
                        ) {
                            return false;
                        }
                        return options.shouldRetry?.(error) ?? DEFAULT_RETRY_OPTIONS.shouldRetry(error);
                    },
                }
            );
        });
    };
}

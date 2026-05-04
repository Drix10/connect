/**
 * Encryption Utilities for Sensitive Data
 * Fixes Issue 5: Unencrypted Sensitive Data in Database
 * 
 * Uses AES-256-GCM for authenticated encryption
 */

import crypto from 'crypto';

// FIXED: Conditional key loading to prevent crashes in dev/test
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
    ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
    : (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')
        ? crypto.randomBytes(32) // Generate ephemeral key for dev/test
        : (() => {
            throw new Error(
                'ENCRYPTION_KEY environment variable is required. Generate one with: node -e "console.log(crypto.randomBytes(32).toString(\'hex\'))"'
            );
        })();

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Validates that encryption key is properly configured
 * FIXED: Require ENCRYPTION_KEY in all environments except development and test
 */
function validateEncryptionKey(): void {
    const safeEnvironments = ['development', 'test'];
    const currentEnv = process.env.NODE_ENV || 'development';

    if (!safeEnvironments.includes(currentEnv) && !process.env.ENCRYPTION_KEY) {
        throw new Error(
            `ENCRYPTION_KEY environment variable must be set in ${currentEnv} environment`
        );
    }

    if (ENCRYPTION_KEY.length !== 32) {
        throw new Error('ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters)');
    }
}

// Validate on module load
validateEncryptionKey();

/**
 * Encrypts a string using AES-256-GCM
 * 
 * @param text - Plain text to encrypt
 * @returns Encrypted string in format: iv:authTag:encrypted
 * 
 * @example
 * const encrypted = encrypt('+91-9876543210');
 * // Returns: "a1b2c3d4....:e5f6g7h8....:i9j0k1l2...."
 */
export function encrypt(text: string): string {
    // FIXED: Always encrypt, even for empty strings (no early return)
    const normalizedText = String(text || '');

    try {
        // Generate random IV for each encryption
        const iv = crypto.randomBytes(IV_LENGTH);

        // Create cipher
        const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

        // Encrypt the text
        let encrypted = cipher.update(normalizedText, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Get authentication tag
        const authTag = cipher.getAuthTag();

        // Format: iv:authTag:encrypted
        return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
        console.error('Encryption failed:', error);
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypts a string encrypted with AES-256-GCM
 * 
 * @param encryptedText - Encrypted string in format: iv:authTag:encrypted
 * @returns Decrypted plain text
 * 
 * @example
 * const decrypted = decrypt("a1b2c3d4....:e5f6g7h8....:i9j0k1l2....");
 * // Returns: "+91-9876543210"
 */
export function decrypt(encryptedText: string): string {
    // FIXED: Consistent with encrypt - handle empty strings properly
    if (!encryptedText) {
        return '';
    }

    try {
        // Split the encrypted text into components
        const [ivHex, authTagHex, encrypted] = encryptedText.split(':');

        if (!ivHex || !authTagHex || encrypted === undefined) {
            throw new Error('Invalid encrypted format');
        }

        // Convert hex strings back to buffers
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');

        // Create decipher
        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        decipher.setAuthTag(authTag);

        // Decrypt the text
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Failed to decrypt data');
    }
}

/**
 * Encrypts an object's sensitive fields
 * 
 * @param obj - Object containing sensitive fields
 * @param fields - Array of field names to encrypt
 * @returns New object with encrypted fields
 * 
 * @example
 * const user = { email: 'user@example.com', phone: '+91-9876543210' };
 * const encrypted = encryptFields(user, ['phone']);
 * // Returns: { email: 'user@example.com', phone: 'a1b2c3d4....:e5f6g7h8....:i9j0k1l2....' }
 */
export function encryptFields<T extends Record<string, any>>(
    obj: T,
    fields: (keyof T)[]
): T {
    const result = { ...obj };

    for (const field of fields) {
        if (result[field] && typeof result[field] === 'string') {
            result[field] = encrypt(result[field] as string) as any;
        }
    }

    return result;
}

/**
 * Decrypts an object's encrypted fields
 * FIXED: Added throwOnDecryptError option for explicit error handling
 * 
 * @param obj - Object containing encrypted fields
 * @param fields - Array of field names to decrypt
 * @param options - Decryption options
 * @returns New object with decrypted fields or error details
 * 
 * @example
 * const encrypted = { email: 'user@example.com', phone: 'a1b2c3d4....:e5f6g7h8....:i9j0k1l2....' };
 * const decrypted = decryptFields(encrypted, ['phone']);
 * // Returns: { email: 'user@example.com', phone: '+91-9876543210' }
 */
export function decryptFields<T extends Record<string, any>>(
    obj: T,
    fields: (keyof T)[],
    options: { throwOnDecryptError?: boolean } = {}
): { success: boolean; data: T; decryptErrors?: Array<{ field: string; error: string }> } {
    const result = { ...obj };
    const decryptErrors: Array<{ field: string; error: string }> = [];

    for (const field of fields) {
        if (result[field] && typeof result[field] === 'string') {
            try {
                result[field] = decrypt(result[field] as string) as any;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(`Failed to decrypt a sensitive field:`, errorMessage);

                if (options.throwOnDecryptError) {
                    throw new Error(`Failed to decrypt a sensitive field: ${errorMessage}`);
                }

                // Collect error for return
                decryptErrors.push({
                    field: String(field),
                    error: errorMessage
                });
                // Keep encrypted value if decryption fails
            }
        }
    }

    // Return with error details if any decryption failed
    if (decryptErrors.length > 0) {
        return { success: false, data: result, decryptErrors };
    }

    return { success: true, data: result };
}

/**
 * Generates a secure random encryption key
 * Use this to generate a new ENCRYPTION_KEY for your environment
 * 
 * @returns 32-byte key as hex string
 * 
 * @example
 * const key = generateEncryptionKey();
 * console.log(`ENCRYPTION_KEY=${key}`);
 * // Add this to your .env file
 */
export function generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Hashes a value using HMAC-SHA256 with application key (FIXED: Keyed hash to prevent rainbow tables)
 * Use this for values that need to be compared but never decrypted
 * 
 * @param value - Value to hash
 * @returns HMAC-SHA256 hash as hex string
 * 
 * @example
 * const hash = hashValue('sensitive-data');
 * // Use for comparison: hashValue(input) === storedHash
 */
export function hashValue(value: string): string {
    return crypto.createHmac('sha256', ENCRYPTION_KEY).update(value).digest('hex');
}

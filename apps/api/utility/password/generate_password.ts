
import crypto from 'crypto'

export const generatePassword = (length = 6)=>{
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    
    while (password.length < length) {
        const randomByte = crypto.randomBytes(1)[0]; // Generate a random byte
        const charIndex = randomByte % chars.length; // Limit to the length of `chars`
        password += chars[charIndex]; // Append character
    }
    
    return password;
}
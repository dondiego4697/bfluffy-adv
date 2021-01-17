import * as crypto from 'crypto';

export function getPasswordHash(password: string) {
    return crypto.createHmac('sha256', '').update(password).digest('hex');
}

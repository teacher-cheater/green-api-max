export function normalizePhone(input: string): string | null {
    let digits = String(input).replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('8'))
        digits = `7${digits.slice(1)}`;
    if (digits.length === 10 && digits.startsWith('9')) digits = `7${digits}`;
    return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

export const toChatId = (phone: string) => `${phone}@c.us`;

export const formatPhone = (phone: string) => `+${phone}`;

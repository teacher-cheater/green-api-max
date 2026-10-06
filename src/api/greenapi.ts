import type { GreenApiNotification } from '../types/notification';

export const API_URL = 'https://api.green-api.com';

export interface ApiCredentials {
    apiUrl?: string;
    idInstance: string;
    apiTokenInstance: string;
}

interface StateInstanceResponse {
    stateInstance:
        | 'authorized'
        | 'notAuthorized'
        | 'blocked'
        | 'sleepMode'
        | 'starting';
}

interface SendMessageResponse {
    idMessage: string;
}

export class ApiError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);

        this.name = 'ApiError';
        this.status = status;
    }
}

function methodUrl(
    { apiUrl, idInstance, apiTokenInstance }: ApiCredentials,
    method: string,
    suffix = '',
): string {
    const base = (apiUrl || API_URL).replace(/\/* + $/, '');

    return `${base}/waInstance${idInstance}/${method}/${apiTokenInstance}${suffix}`;
}

async function request<T>(
    url: string,
    options?: RequestInit,
): Promise<T | null> {
    let response: Response;

    try {
        response = await fetch(url, options);
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw error;
        }

        throw new ApiError('Нет связи с GREEN-API');
    }

    if (!response.ok) {
        const reason =
            response.status === 401 || response.status === 403
                ? 'Неверные idInstance или apiTokenInstance'
                : `Ошибка GREEN-API (HTTP ${response.status})`;

        throw new ApiError(reason, response.status);
    }

    const text = await response.text();

    return text ? (JSON.parse(text) as T) : null;
}

export function getStateInstance(
    creds: ApiCredentials,
): Promise<StateInstanceResponse | null> {
    return request<StateInstanceResponse>(methodUrl(creds, 'getStateInstance'));
}

export function sendMessage(
    creds: ApiCredentials,
    chatId: string,
    message: string,
): Promise<SendMessageResponse> {
    return request(methodUrl(creds, 'sendMessage'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, message }),
    }) as Promise<SendMessageResponse>;
}

export function receiveNotification(
    creds: ApiCredentials,
    signal: AbortSignal,
    receiveTimeout = 5,
) {
    return request<GreenApiNotification | null>(
        methodUrl(
            creds,
            'receiveNotification',
            `?receiveTimeout=${receiveTimeout}`,
        ),
        { signal },
    );
}

export function deleteNotification(
    creds: ApiCredentials,
    receiptId: number,
    signal?: AbortSignal,
) {
    return request<{ result: boolean }>(
        methodUrl(creds, 'deleteNotification', `/${receiptId}`),
        { method: 'DELETE', signal },
    );
}

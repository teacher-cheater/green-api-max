import { useEffect, useRef, useState } from 'react';
import {
    deleteNotification,
    receiveNotification,
    type ApiCredentials,
} from '../../api/greenapi';
import type { ConnectionStatus } from '../../types/chat';
import type { NotificationBody } from '../../types/greenapi';

const MAX_BACKOFF_MS = 15_000;

const sleep = (ms: number, signal: AbortSignal) =>
    new Promise<void>(resolve => {
        if (signal.aborted) return resolve();
        const onAbort = () => {
            clearTimeout(timer);
            resolve();
        };
        const timer = setTimeout(() => {
            signal.removeEventListener('abort', onAbort);
            resolve();
        }, ms);
        signal.addEventListener('abort', onAbort, { once: true });
    });

export function useNotifications(
    creds: ApiCredentials,
    onNotification: (body: NotificationBody) => void,
): ConnectionStatus {
    const [status, setStatus] = useState<ConnectionStatus>('connecting');
    const handlerRef = useRef(onNotification);

    useEffect(() => {
        handlerRef.current = onNotification;
    }, [onNotification]);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        void (async () => {
            let failures = 0;
            while (!signal.aborted) {
                try {
                    const notification = await receiveNotification(
                        creds,
                        signal,
                    );
                    failures = 0;
                    setStatus('online');
                    if (!notification) continue;

                    try {
                        handlerRef.current(notification.body);
                    } catch (e: unknown) {
                        console.error('Не удалось обработать уведомление', e);
                    }
                    await deleteNotification(
                        creds,
                        notification.receiptId,
                        signal,
                    );
                } catch (e: unknown) {
                    if (signal.aborted) return;
                    failures += 1;
                    setStatus('offline');
                    console.warn('Ошибка получения уведомлений', e);
                    await sleep(
                        Math.min(1000 * 2 ** (failures - 1), MAX_BACKOFF_MS),
                        signal,
                    );
                }
            }
        })();

        return () => controller.abort();
    }, [creds]);

    return status;
}

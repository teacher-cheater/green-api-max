import type { Credentials } from './chat';

export type ApiCredentials = Credentials;

/* ---------- messageData ---------- */

export interface TextMessageData {
    typeMessage: 'textMessage';
    textMessageData: { textMessage: string };
}

export interface ExtendedTextMessageData {
    typeMessage: 'extendedTextMessage';
    extendedTextMessageData: {
        text: string;
        title?: string;
        description?: string;
    };
}

// пока не обрабатываем, но тип должен быть в union
export interface MediaMessageData {
    typeMessage:
        | 'imageMessage'
        | 'videoMessage'
        | 'audioMessage'
        | 'documentMessage';
}

export type IncomingMessageData =
    | TextMessageData
    | ExtendedTextMessageData
    | MediaMessageData;

/* ---------- senderData ---------- */

export interface SenderData {
    chatId: string;
    chatName?: string;
    sender?: string;
    senderName?: string;
    senderContactName?: string;
    senderPhoneNumber?: number | string;
}

/* ---------- вебхуки ---------- */

interface WebhookBase {
    timestamp: number; // секунды
}

export interface IncomingMessageWebhook extends WebhookBase {
    typeWebhook: 'incomingMessageReceived';
    idMessage: string;
    senderData: SenderData;
    messageData: IncomingMessageData;
}

export interface OutgoingMessageStatusWebhook extends WebhookBase {
    typeWebhook: 'outgoingMessageStatus';
    chatId: string;
    idMessage: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface StateInstanceChangedWebhook extends WebhookBase {
    typeWebhook: 'stateInstanceChanged';
    stateInstance:
        | 'authorized'
        | 'notAuthorized'
        | 'blocked'
        | 'sleepMode'
        | 'starting'
        | 'yellowCard';
}

export type NotificationBody =
    | IncomingMessageWebhook
    | OutgoingMessageStatusWebhook
    | StateInstanceChangedWebhook;

export type WebhookType = NotificationBody['typeWebhook'];

export interface GreenApiNotification {
    receiptId: number;
    body: NotificationBody;
}

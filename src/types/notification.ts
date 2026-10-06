import type { Credentials } from './chat';
import type { NotificationBody } from './greenapi';

export type ApiCredentials = Credentials;

export type WebhookType =
    | 'incomingMessageReceived'
    | 'outgoingMessageStatus'
    | 'stateInstanceChanged'
    | string;

// export type NotificationBody = {
//     typeWebhook: WebhookType;
//     idMessage?: string;
//     timestamp?: number;
//     senderData?: {
//         chatId: string;
//         senderName?: string;
//     };
//     messageData?: {
//         typeMessage: string;
//         textMessageData?: { textMessage: string };
//     };
// };

export type GreenApiNotification = {
    receiptId: number;
    body: NotificationBody;
};

export type Notification = {
    receiptId: number;
    body: NotificationBody;
};

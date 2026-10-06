// import { formatPhone, toChatId } from '../utils/phone.js';

// export function parseIncomingMessage(body) {
//     if (body?.typeWebhook !== 'incomingMessageReceived') return null;

//     const data = body.messageData;
//     let text = null;
//     if (data?.typeMessage === 'textMessage')
//         text = data.textMessageData?.textMessage;
//     if (data?.typeMessage === 'extendedTextMessage')
//         text = data.extendedTextMessageData?.text;
//     if (!text) return null;

//     const sender = body.senderData ?? {};

//     const phone = sender.senderPhoneNumber
//         ? String(sender.senderPhoneNumber)
//         : null;
//     const key = phone ?? sender.chatId;
//     if (!key) return null;

//     return {
//         chat: {
//             key,
//             phone: phone ?? '',
//             chatId: phone ? toChatId(phone) : sender.chatId,
//             name:
//                 sender.chatName ||
//                 sender.senderName ||
//                 (phone ? formatPhone(phone) : String(key)),
//         },
//         message: {
//             id: body.idMessage,
//             text,
//             direction: 'in',
//             ts: (body.timestamp ?? Math.floor(Date.now() / 1000)) * 1000,
//         },
//     };
// }

import type { ChatInfo, Message } from '../types/chat';
import type { IncomingMessageData, NotificationBody } from '../types/greenapi';
import { formatPhone, toChatId } from '../utils/phone';

export interface ParsedIncomingMessage {
    chat: ChatInfo;
    message: Message;
}

function extractText(data: IncomingMessageData): string | null {
    switch (data.typeMessage) {
        case 'textMessage':
            return data.textMessageData.textMessage;
        case 'extendedTextMessage':
            return data.extendedTextMessageData.text;
        default:
            return null;
    }
}

export function parseIncomingMessage(
    body: NotificationBody,
): ParsedIncomingMessage | null {
    if (body.typeWebhook !== 'incomingMessageReceived') return null;

    const { senderData, messageData, idMessage, timestamp } = body;

    const text = extractText(messageData);
    if (!text) return null;

    const phone = senderData.senderPhoneNumber
        ? String(senderData.senderPhoneNumber)
        : null;
    const key = phone ?? senderData.chatId;
    if (!key) return null;

    return {
        chat: {
            key,
            phone: phone ?? '',
            chatId: phone ? toChatId(phone) : senderData.chatId,
            name:
                senderData.chatName ||
                senderData.senderName ||
                (phone ? formatPhone(phone) : key),
        },
        message: {
            id: idMessage,
            text,
            direction: 'in',
            ts: timestamp * 1000,
        },
    };
}

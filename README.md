# MAX Chat

Чат для отправки и получения сообщений в MAX через [GREEN-API](https://green-api.com/max).
Интерфейс https://web.max.ru/: слева список чатов, справа переписка.

- Вход по `idInstance` и `apiTokenInstance` (проверка через `getStateInstance`)
- Создание чата по номеру телефона
- Отправка текста — метод [SendMessage](https://green-api.com/v3/docs/api/sending/

## Запуск

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production-сборка в dist/
```

1. Откройте приложение, введите `idInstance` и `apiTokenInstance`
2. Нажмите "+"", введите номер получателя и создайте чат
3. Отправьте сообщение - оно появится у получателя
4. Ответьте с телефона получателя - ответ появится в чате (задержка до нескольких секунд)

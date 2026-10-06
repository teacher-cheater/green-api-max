# MAX Chat

Чат для отправки и получения сообщений в MAX через [GREEN-API](https://green-api.com/max).
Интерфейс https://web.max.ru/: слева список чатов, справа переписка.

- Вход по `idInstance` и `apiTokenInstance` (проверка через `getStateInstance`)
- Создание чата по номеру телефона
- Отправка текста — метод [SendMessage](https://green-api.com/v3/docs/api/sending/)

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


<img width="836" height="681" alt="Screenshot_4" src="https://github.com/user-attachments/assets/5eb73b98-abe0-467a-a25e-95226cafcb3b" />
<img width="835" height="643" alt="Screenshot_3" src="https://github.com/user-attachments/assets/4f3fd3f4-435b-4424-a9c3-4d18b51d93df" />
<img width="836" height="611" alt="Screenshot_2" src="https://github.com/user-attachments/assets/cd989e9a-cc9b-4f0b-8ddb-4a61a95ec12b" />
<img width="525" height="360" alt="Screenshot_1" src="https://github.com/user-attachments/assets/7ce961a8-0a49-4ea5-bf10-b2000e5b6365" />

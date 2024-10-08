const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Создаем Express приложение
const app = express();

// Отдаем статические файлы
app.use(express.static('public'));

// Создаем HTTP сервер и WebSocket сервер
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Обработка подключений WebSocket
wss.on('connection', function connection(ws) {
    console.log('A user connected.');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        // Отправляем сообщение всем подключенным клиентам (кроме отправителя)
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', function close() {
        console.log('A user disconnected.');
    });
});

// Запускаем сервер на порту 3000
server.listen(3000, function () {
    console.log('Server is listening on port 3000');
});

import http from 'http';
import express from 'express';
import WebSocket from 'ws';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListen = () => console.log('Listening on localhost:3000');

// 아래와 같이 하면 HTTP 서버 위에 Websocket 서버를 만들어서 둘 다 작동 시킬 수 있음
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

wss.on('connection', (socket) => {
    console.log('Connected to Browser ✅');

    socket.on('close', () => console.log('Disconnected from the Browser ❌'));
    socket.on('message', message => {
        console.log(message.toString());
    })

    socket.send('hello!!');
});

server.listen(3000, handleListen);
import http from "http";
import express from "express";
import SocketIO from "socket.io"; // websocket 사용할 수 없을 때 http long polling

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on localhost:3000");

// 아래와 같이 하면 HTTP 서버 위에 Websocket 서버를 만들어서 둘 다 작동 시킬 수 있음
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";

  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();

    socket.to(roomName).emit("welcome", socket.nickname);
  });

  // 접속 끊어지기 전
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname));
  });

  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });

  socket.on("nickname", (nickname) => socket["nickname"] = nickname);
});

httpServer.listen(3000, handleListen);

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const Pusher = require("pusher");

const connections = [];
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const pusher = new Pusher({
  appId: "1761048",
  key: "b52fb78ee469899ad657",
  secret: "2c848a394fc537cbbdf3",
  cluster: "ap1",
  useTLS: true,
});

wss.on("connection", (ws) => {
  console.log("Koneksi WebSocket baru");
  connections.push(ws);

  ws.on("message", (message) => {
    console.log(`Menerima pesan: ${message}`);
  });

  ws.on("close", () => {
    console.log("Koneksi WebSocket ditutup");
    const index = connections.indexOf(ws);
    connections.splice(index, 1);
  });

  setInterval(() => {
    ws.send("Pesan dari server ke klien");
  }, 5000);
});

function sendGlobalMessage(message) {
  connections.forEach((ws) => {
    ws.send(message);
  });
}

app.get("/", (req, res) => {
  sendGlobalMessage(req.query.txt);
//   pusher.trigger("my-channel", "my-event", {
//     message: "hello world",
//   });
  res.send("Selamat datang di Express.js dengan WebSocket!");
});

server.listen(4000, () => {
  console.log("Server berjalan di http://localhost:4000");
});

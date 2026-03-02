const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

const Watcher = require("./watcher");

const watcher = new Watcher("sample.log");

watcher.start();

watcher.on("process", (data) => {
  io.emit("update-log", data);
});

watcher.on("error", (err) => {
  console.error("Watcher error:", err);
});

app.get("/log", (req, res, next) => {
  console.log("request received");
  const options = {
    root: path.join(__dirname),
  };

  const fileName = "index.html";
  res.sendFile(fileName, options, (err) => {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

io.on("connection", (socket) => {
  console.log("new connection established:" + socket.id);
  const data = watcher.getLogs();
  socket.emit("init", data);
});

http.listen(3000, () => {
  console.log("listening on localhost:3000");
});

function shutdown() {
  console.log("\nShutting down...");
  watcher.stop();
  http.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

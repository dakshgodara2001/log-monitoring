const events = require("events");
const fs = require("fs");

const LAST_LINES = 10;

class Watcher extends events.EventEmitter {
  constructor(watchFile) {
    super();
    this.watchFile = watchFile;
    this.store = [];
  }

  getLogs() {
    return this.store;
  }

  watch(curr, prev) {
    const deltaSize = curr.size - prev.size;
    if (deltaSize <= 0) return;

    const buf = Buffer.alloc(deltaSize);

    fs.open(this.watchFile, "r", (err, fd) => {
      if (err) {
        this.emit("error", err);
        return;
      }

      fs.read(fd, buf, 0, deltaSize, prev.size, (err, bytesRead) => {
        fs.close(fd, () => {});

        if (err) {
          this.emit("error", err);
          return;
        }

        if (bytesRead > 0) {
          const data = buf.slice(0, bytesRead).toString();
          const logs = data.split("\n").filter((line) => line.length > 0);

          if (logs.length === 0) return;

          if (logs.length >= LAST_LINES) {
            this.store = logs.slice(-LAST_LINES);
          } else {
            for (const line of logs) {
              if (this.store.length >= LAST_LINES) {
                this.store.shift();
              }
              this.store.push(line);
            }
          }

          this.emit("process", logs);
        }
      });
    });
  }

  start() {
    fs.open(this.watchFile, "r", (err, fd) => {
      if (err) {
        this.emit("error", err);
        return;
      }

      const stat = fs.fstatSync(fd);
      const buf = Buffer.alloc(stat.size);

      fs.read(fd, buf, 0, stat.size, 0, (err, bytesRead) => {
        fs.close(fd, () => {});

        if (err) {
          this.emit("error", err);
          return;
        }

        if (bytesRead > 0) {
          const data = buf.slice(0, bytesRead).toString();
          const logs = data.split("\n").filter((line) => line.length > 0);
          this.store = logs.slice(-LAST_LINES);
        }

        fs.watchFile(
          this.watchFile,
          { interval: 1000 },
          (curr, prev) => {
            this.watch(curr, prev);
          }
        );
      });
    });
  }

  stop() {
    fs.unwatchFile(this.watchFile);
  }
}

module.exports = Watcher;

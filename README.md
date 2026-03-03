# Log Monitoring

I'm a product manager. I built this to understand what engineers actually deal with. Not from a slide deck. From code.

It watches a log file and pushes new lines to your browser over WebSockets. That's it.

## How to run

```
npm install
node server.js
```

Open http://localhost:3000/log

If you want fake logs to test with, run `node test.js` in another terminal. It writes a line every second.

## How it works

A file watcher polls `sample.log` every second. When bytes are added, it reads only the new part, splits it into lines, and emits an event. The server picks that up and pushes it to every connected browser via Socket.IO. The browser renders the lines. Last 10 lines are kept in memory.

```
log file -> watcher (fs.watchFile) -> server (Express + Socket.IO) -> browser
```

Four files do all the work:
- `watcher.js` - watches the file, reads deltas, emits events
- `server.js` - serves the page, handles WebSocket connections
- `index.html` - connects to the socket, renders logs
- `test.js` - writes fake log lines for testing

## Where you'd actually use this

- **Watching a server in dev** - better than tailing a file in terminal when you want to share it with someone
- **Debugging with QA** - they reproduce the bug, you both watch the same log stream, nobody has to copy-paste anything
- **Monitoring a Raspberry Pi or edge device** - lightweight, no agents, just Node
- **Build pipelines** - point it at a build log, watch it in the browser instead of refreshing Jenkins
- **Hackathon demos** - real-time anything looks good on a projector
- **Learning** - this is ~100 lines of actual code covering file I/O, EventEmitters, WebSockets, and streaming. No framework magic hiding the interesting parts

## What I learned as a PM

**"Simple" features aren't simple.** This is "show file changes in a browser." Sounds trivial. It involves memory management, file descriptor lifecycle, connection cleanup, security (XSS from raw log injection), and race conditions. When an engineer gives you a higher estimate than you expected, they're probably right.

**Ship first, fix later. But actually fix later.** V1 allocated 512MB of memory to read a text file. It had security holes. It leaked file descriptors. But it worked and the demo landed. The fixes came in V2. The point is V2 actually happened — most "fix later" never does. Put tech debt on the roadmap or admit you're okay with the risk.

**Real-time has ongoing cost.** Every WebSocket connection holds state. Listeners need cleanup. Polling costs CPU. "Can we make it real-time?" isn't a feature toggle, it's an infrastructure conversation.

**Error states are product decisions.** When the server dies, does the user see a blank page or a "disconnected" message? That's not an engineering detail. That's UX. Spec the sad paths.

**Building things makes you a better PM.** Not because you should be writing production code. But because when someone says "WebSocket" in a planning meeting, you know what that actually means. You ask better questions. You push back in the right places. You stop treating engineering like a black box.

## Tech

Node.js, Express, Socket.IO, vanilla HTML/JS. No build tools, no frameworks, no dependencies you don't need.

---

Built by a PM who wanted to understand the craft, not just manage it.

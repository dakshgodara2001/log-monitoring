# Real-Time Log Monitoring Dashboard

**A PM who codes? Yeah, we exist.**

I built this from scratch — not a Jira ticket, not a PRD, not a "can engineering prioritize this?" Slack message. Actual code. Running code. Ship-it-on-a-Friday code.

This project watches a log file and streams updates to your browser in real time. Dark terminal aesthetic. WebSockets. The works.

---

## What It Does

```
Log File --> Watcher --> Server --> WebSocket --> Your Browser
  (new lines)   (detects changes)  (Express)   (Socket.IO)    (live updates)
```

- Watches any log file for changes (polls every second)
- Streams new log entries to a browser dashboard instantly
- Maintains a rolling window of the last 10 lines
- Auto-reconnects if the connection drops
- Dark terminal-themed UI because we have taste

---

## Run It

```bash
npm install
node server.js        # Start the server
node test.js          # (Optional) Simulate logs being written
```

Open **http://localhost:3000/log** and watch the magic.

---

## Tech Stack

| Layer     | Tech             |
|-----------|------------------|
| Backend   | Node.js, Express |
| Real-time | Socket.IO        |
| File I/O  | fs.watchFile     |
| Frontend  | Vanilla HTML/JS  |

No React. No webpack. No 400MB node_modules meme. Just clean, lean code.

---

## PM Learnings (The Real README)

### 1. "Simple" Is a Lie We Tell Stakeholders

This project is literally "watch a file, show it in a browser." Sounds like a 2-hour task, right?

Reality check: memory management, file descriptor leaks, WebSocket connection lifecycles, XSS vulnerabilities, race conditions with shared buffers...

**PM takeaway:** When your engineer says "it's more complex than it looks" — believe them. Then buy them coffee.

### 2. The User Doesn't See Your Architecture, They See the Lag

Nobody cares that you used EventEmitters elegantly. They care that the logs showed up *fast* and didn't crash their browser tab.

**PM takeaway:** Optimize for what the user feels, not what the system diagram looks like in your deck.

### 3. The First Version Will Embarrass You (Ship It Anyway)

V1 of this project had a 512MB memory allocation for reading a text file. It had XSS vulnerabilities. It leaked file descriptors like a broken faucet.

And you know what? It worked. It showed logs in a browser. The demo landed.

**PM takeaway:** Perfect is the enemy of shipped. Get it in front of users, then iterate. Your V1 is supposed to make your V2 self obvious.

### 4. Tech Debt Is Just Deferred Product Decisions

Every "we'll fix it later" is a product decision. That innerHTML injection wasn't just a code smell — it was a security risk that could block an enterprise deal.

**PM takeaway:** Tech debt belongs on the roadmap. Not as a favor to engineering, but because it's a product risk you're choosing to carry.

### 5. Understanding the Stack Makes You Dangerous (in a Good Way)

After building this, when an engineer says "we need WebSocket support," I don't just nod and add it to the backlog. I know what that means — the connection lifecycle, the reconnection strategy, the scaling implications.

**PM takeaway:** You don't need to be an engineer. But understanding the building blocks makes you a better PM, a better prioritizer, and a better partner.

### 6. Real-Time Isn't Free

Polling vs. native events. Memory per connection. Listener cleanup on disconnect. Real-time features carry ongoing cost — not just build cost.

**PM takeaway:** "Can we make it real-time?" is not a simple yes/no. It's a conversation about infrastructure, maintenance, and whether the user actually needs it or just thinks it sounds cool.

### 7. Error Handling Is a Product Feature

When the server goes down, does the user see a blank screen or a "Disconnected — reconnecting..." message? That's not an engineering detail. That's user experience.

**PM takeaway:** Spec the sad paths. What happens when things break? That's where trust is built or lost.

---

## The Bottom Line

Building things yourself doesn't make you a better coder. It makes you a better *product thinker*. You start seeing the trade-offs, feeling the constraints, and respecting the craft.

Every PM should have a pride project. Not to prove anything to anyone else — but to remind yourself what it actually takes to turn an idea into something real.

---

**Built with stubbornness and Stack Overflow by a Product Manager who refused to just write docs about it.**

const express = require("express");
const app = express();
const port = 4001;

// Disable compression for this route (in case Vercel auto-applies compression)
app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // Send headers immediately

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Keep alive mechanism
  const keepAliveInterval = setInterval(() => {
    res.write(": heartbeat\n\n"); // Keep the connection alive
    res.flush(); // Ensure the heartbeat is sent immediately
  }, 30000); // Every 30 seconds

  try {
    for (let i = 0; i < 10; i++) {
      await delay(1000); // Wait 1 second
      res.write(`data: ${i}\n\n`); // Send the data
      res.flush(); // Force the data to be sent immediately
    }
  } finally {
    clearInterval(keepAliveInterval); // Stop the keep-alive messages
    res.end(); // End the stream
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;


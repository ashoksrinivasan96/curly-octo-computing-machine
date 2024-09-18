const express = require("express");

const app = express();
const port = 4001;

app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Content-Encoding", "none");
  res.flushHeaders();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const keepAliveInterval = setInterval(() => {
    res.write(`: heartbeat\n\n`); // Send a comment to keep the connection alive
  }, 30000); // 30 seconds

  try {
    for (let i = 0; i < 10; i++) {
      await delay(1000); // Wait 1 second
      res.write(`data: ${i}\n\n`); // Send the data
    }
  } finally {
    clearInterval(keepAliveInterval); // Clear the interval when done
    res.end(); // End the stream after all messages have been sent
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;

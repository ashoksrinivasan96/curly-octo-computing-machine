const express = require("express");
const app = express();
const port = 4001;

// Endpoint to stream data
app.get("/", async (req, res) => {
  // Set headers for Server-Sent Events (SSE)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  
  // Flush headers so the client starts receiving the response immediately
  res.flushHeaders();

  // A delay function to simulate async operations
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Simulating streaming of 10 data chunks
  for (let i = 0; i < 10; i++) {
    await delay(1000); // Simulate a 1-second delay for each chunk
    res.write(`data: ${i}\n\n`); // Stream data to the client
  }

  // Optional: Send a comment to keep the connection alive
  const keepAliveInterval = setInterval(() => {
    res.write(`: keep-alive\n\n`); // This won't display but keeps the connection open
  }, 30000); // Keep the connection alive by sending a comment every 30 seconds

  // End the response after all data is sent
  res.on("close", () => {
    clearInterval(keepAliveInterval); // Clear the interval when the connection closes
    res.end(); // Ensure the stream is closed properly
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;

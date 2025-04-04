#!/usr/bin/env node

import { createServer } from "./server.js";
import { ensureLogDirectory, registerExitHandlers, scheduleLogRotation, setupLogRotation } from "./logging.js";

// Run setup for logging
ensureLogDirectory();
setupLogRotation();
scheduleLogRotation();
registerExitHandlers();


import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
const app = express();

const server = createServer();
let transport: SSEServerTransport;

app.get("/sse", (req, res) => {
    console.log("Received connection");
    transport = new SSEServerTransport("/messages", res);
    server.connect(transport);
});

app.post("/messages", (req, res) => {
    console.log("Received message handle message");
    if (transport) {
        transport.handlePostMessage(req, res);
    }
});

const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

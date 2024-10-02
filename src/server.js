const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const authMiddleware = require('./auth-middleware');
const { runCowsay } = require('./wasm-handler');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Middleware pour parser le JSON
app.use(express.json());

// API RESTful avec authentification
app.get('/api/cowsay', authMiddleware, async (req, res) => {
  try {
    const message = req.query.message || 'Hello world';
    console.log(`[REST] Received message: "${message}"`);
    
    const output = await runCowsay(message);
    console.log(`[REST] Generated output: "${output}"`);
    
    res.json({ output });
  } catch (error) {
    console.error('[REST] Error occurred:', error);
    res.status(500).json({ error: error.message });
  }
});

// WebSocket handling
wss.on('connection', (ws) => {
  console.log('[WebSocket] Client connected');
  
  ws.on('message', async (message) => {
    console.log(`[WebSocket] Received message: "${message}"`);
    try {
      const output = await runCowsay(message.toString());
      console.log(`[WebSocket] Generated output: "${output}"`);
      ws.send(output);
    } catch (error) {
      console.error('[WebSocket] Error occurred:', error);
      ws.send('Error: ' + error.message);
    }
  });

  ws.on('close', () => {
    console.log('[WebSocket] Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

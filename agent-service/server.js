const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients (the IDE frontend)
let clients = [];

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.push(ws);

  // Send initial status
  ws.send(JSON.stringify({
    type: 'task_boundary',
    data: {
      mode: 'IDLE',
      taskName: 'Waiting for instructions',
      taskStatus: 'Ready',
      taskSummary: 'Agent is online and waiting for user input.'
    }
  }));

  ws.on('message', (message) => {
    console.log('Received:', message);
    try {
      const parsed = JSON.parse(message);
      handleMessage(ws, parsed);
    } catch (e) {
      console.error('Failed to parse message:', e);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients = clients.filter(c => c !== ws);
  });
});

function handleMessage(ws, msg) {
  if (msg.type === 'user_request') {
    // Simulate agent thinking and working
    broadcast({
      type: 'task_boundary',
      data: {
        mode: 'PLANNING',
        taskName: 'Processing User Request',
        taskStatus: 'Analyzing requirements',
        taskSummary: `Received request: ${msg.content}`
      }
    });

    setTimeout(() => {
      broadcast({
        type: 'task_boundary',
        data: {
          mode: 'EXECUTION',
          taskName: 'Executing Task',
          taskStatus: 'Running commands',
          taskSummary: 'Identified steps. Executing now.'
        }
      });
    }, 2000);

    setTimeout(() => {
      broadcast({
        type: 'task_boundary',
        data: {
          mode: 'IDLE',
          taskName: 'Task Completed',
          taskStatus: 'Done',
          taskSummary: 'Request processed successfully.'
        }
      });
    }, 5000);
  }
}

function broadcast(data) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Agent Service running on port ${PORT}`);
});

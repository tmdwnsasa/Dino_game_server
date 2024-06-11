import { create } from 'domain';
import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets, getGameAssets } from './init/assets.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
initSocket(server);

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Hello World!' });
});

server.listen(PORT, async () => {
  try {
    const assets = await loadGameAssets();
  } catch (err) {
    console.log('Failed to load game assets');
  }
});

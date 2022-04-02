import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const port = 3001;
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors());

io.on('connection', socket => {
  console.log(`${socket}: Join`);
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const port = 3001;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

app.use(cors());

io.on('connection', socket => {
  console.log(`${socket.id}: Join`);

  socket.on('move_slide', data => {
    console.log(`${socket.id}: Move Slide (${data})`);
    io.emit('move_slide', data);
  });

  socket.on('reset_presentation', () => {
    console.log(`${socket.id}: Reset Presentation`);
    io.emit('reset_presentation');
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id}: Disconnect`);
  });
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

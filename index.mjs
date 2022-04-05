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

// Sample Presentation JSON
const presentation = {
  slides: [
    {
      title: 'Intro',
    },
    {
      title: 'Slide 1',
      points: [
        'Point 1',
        'Point 2',
        'Point 3',
        'Point 4',
        'Point 5',
      ],
    },
    {
      title: 'Slide 2',
      points: [
        'Point 1',
        'Point 2',
        'Point 3',
      ],
    },
    {
      title: 'Slide 3',
      points: [
        'Point 1',
        'Point 2',
        'Point 3',
        'Point 4',
      ],
    },
    {
      title: 'Slide 4',
      points: [
        'Point 1',
        'Point 2',
        'Point 3',
        'Point 4',
        'Point 5',
      ],
    },
  ],
};

const hostedPresentations = [
  { id: 1, presentation: presentation },
];

io.on('connection', socket => {
  console.log(`${socket.id}: Join`);

  socket.on('join_presentation', data => {
    socket.join(data);
    console.log(`${socket.id}: Join Presentation`);
  });

  socket.on('leave_presentation', data => {
    socket.leave(data);
    console.log(`${socket.id}: Leave Presentation`);
  });

  socket.on('move_slide', ({ data, room }) => {
    console.log(`${socket.id}: Move Slide (${data})`);
    io.to(`${room}`).emit('move_slide', data);
  });

  socket.on('reset_presentation', ({ room }) => {
    console.log(`${socket.id}: Reset Presentation`);
    io.to(`${room}`).emit('reset_presentation');
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id}: Disconnect`);
  });
});

httpServer.listen(port, () => {
  console.log(`Socket.io listening on port ${port}...`);
});

app.listen(port + 1, () => {
  console.log(`Server listening on port ${port + 1}...`);
});

app.get('/get_presentation', (req, res) => {
  const result = hostedPresentations.filter(
    presentation =>
    presentation.id == req.query.id
  );

  if (result) res.send(result[0]);
});

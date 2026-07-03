import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors());

app.use(express.json({ limit: '50mb' }));

const uploadPath = './uploads';

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const name = Date.now() + '.jpg';
    cb(null, name);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {

  console.log('Screenshot received');

  io.emit('new-screenshot', {
    filename: req.file.filename,
    timestamp: Date.now()
  });

  res.json({
    success: true
  });
});

app.post('/event', (req, res) => {

  console.log('EVENT:', req.body);

  io.emit('event', req.body);

  res.json({
    success: true
  });
});

io.on('connection', socket => {
  console.log('Admin connected');
});

server.listen(5000, () => {
  console.log('Backend running on 5000');
});
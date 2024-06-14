import { CLIENT_VERSION } from './Constants.js';
import { setHS } from './Score.js';

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;

socket.on('response', (data) => {
  console.log(data);
  if (data.broadcast) setHS(data.broadcast);
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
  setHS(data.highScore);
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent };

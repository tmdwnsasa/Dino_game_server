import { CLIENT_VERSION } from '../constants.js';
import { getGameAssets } from '../init/assets.js';
import { createItem } from '../models/item.model.js';
import { createStage, setStage } from '../models/stage.model.js';
import { getUser, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';

export const handleDiscnnect = (socket, uuid) => {
  removeUser(socket.id);
  console.log(`User disconneted ${socket.id}`);
  console.log('Current users : ', getUser());
};

export const handleConnection = (socket, uuid) => {
  console.log(`New user connected: ${uuid} with ${socket.id}`);
  console.log('Current users : ', getUser());

  createStage(uuid);
  createItem(uuid);

  socket.emit('connection', { uuid });
};

export const handlerEvent = (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Wrong client version' });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = handler(data.userId, data.payload);
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }

  socket.emit('response', response);
};

import { addUser } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDiscnnect, handlerEvent } from './helper.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    const userUUID = '1234';
    addUser({ uuid: userUUID, socketId: socket.id });

    handleConnection(socket, userUUID);

    socket.on('event', (data) => handlerEvent(io, socket, data));
    socket.on('disconnect', (socket) => {
      handleDiscnnect(socket, userUUID);
    });
  });
};

export default registerHandler;

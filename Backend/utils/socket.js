import { Server } from 'socket.io';

export const setSocket = (server) => {
  const socketIo = new Server(server, {
    cors: {
      origin: true, // Replace 'true' with the allowed origins if needed
      // methods: ['POST', 'GET'],
      credentials: true, // Ensure this is plural
    },
  });

  const OnlineUsers=new Map()


  socketIo.on('connect', (socket) => {
    console.log('New client connected:', socket.id);

    const userId =socket.handshake.query.userId;

    if (userId) {
        OnlineUsers.set(userId,socket.id)
    }
    console.log(OnlineUsers);
    socket.emit('onlineUsers',OnlineUsers.keys())
    socket.on('sendMessage',(e)=>{

      console.log(e.user._id);
      console.log(OnlineUsers.get(e.user._id));
      
      socket.to(OnlineUsers.get(e.user._id)).emit('receiveMsg',e.msgInput)
      
    })
    socket.on('disconnect',()=>{

        OnlineUsers.delete(socket.id)
        console.log('disconnected user',socket.id);
    })
  });
};

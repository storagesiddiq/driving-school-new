const socketIo = require('socket.io');
const setSocket = (server) => {
    const io = socketIo(server, {
        pingTimeout: 60000,
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Ensure this matches your frontend URL
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('Connected to Seocket.io');

        socket.on('setup', async (userData) => {
            if (userData && userData._id) { // Check if userData and userData._id are valid
                socket.join(userData._id);
                socket.emit('connection');
            } else {
                console.error('Invalid userData received');
            }
        });

        socket.on('join chat', (room) => {
            socket.join(room);
            console.log('User Joined Room' + room);
        });

        socket.on('typing', (room) => socket.in(room).emit('typing'))
        socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))


        socket.on('newMessage', (newMessageRecieved) => {
            console.log(newMessageRecieved);

            var chat = newMessageRecieved.chat;
            if (!chat.users) return console.log('chat.users not defined');

            chat.users.forEach(user => {
                if (user._id == newMessageRecieved._id) return;

                socket.in(user._id).emit("message received", newMessageRecieved)
            })

        });

        socket.off('setup', () => {
            console.log('Client disconnected');
            socket.leave(userData._id)
        });

    });

    return io;
};

module.exports = setSocket;

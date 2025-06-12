const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const rooms = {};

io.on('connection', socket => {
    socket.on('joinRoom', ({ room, user, token }) => {
        if (!rooms[room]) {
            rooms[room] = { users: [], typing: {} };
        }

        if (rooms[room].users.length >= 15) {
            socket.emit('message', { type: 'system', text: '❌ Cette session est pleine.' });
            return;
        }

        socket.join(room);
        socket.room = room;
        socket.user = user;
        
        
        const existingIndex = rooms[room].users.findIndex(u => u.name === user);
        if (existingIndex !== -1) {
            if (rooms[room].users[existingIndex].token !== token) {
                socket.emit('message', { type: 'system', text: '❌ Ce pseudo est déjà utilisé dans cette session.' });
                return;
            }
        }
    
            socket.emit('message', { type: 'system', text: '❌ Ce pseudo est déjà utilisé dans cette session.' });
            return;
        }
        rooms[room].users.push({ name: user, token });
    

        io.to(room).emit('message', { type: 'system', text: `💬 ${user} a rejoint la session.` });
    });

    socket.on('chatMessage', ({ room, user, text }) => {
        io.to(room).emit('message', { user, text });
    });

    socket.on('typing', ({ room, user }) => {
        socket.to(room).emit('userTyping', user);
    });

    socket.on('stopTyping', room => {
        socket.to(room).emit('stopTyping');
    });

    socket.on('disconnect', () => {
        const room = socket.room;
        const user = socket.user;
        if (room && rooms[room]) {
            rooms[room].users = rooms[room].users.filter(u => u.name !== user);
            io.to(room).emit('message', { type: 'system', text: `👋 ${user} a quitté la session.` });
            if (rooms[room].users.length === 0) {
                delete rooms[room]; // nettoyage de la room vide
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

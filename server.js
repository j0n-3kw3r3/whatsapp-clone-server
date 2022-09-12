const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors');
app.use(cors())
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
})
const PORT = process.env.PORT || 5000
const router = require('./router')

server.listen(PORT, () => {
    console.log('server is active on port', PORT)
})

app.use(router)


io.on('connection', socket => {
    const id = socket.handshake.query.id
    socket.join(id)


    socket.on('send-message', ({ recipients, text }) => {
        recipients.forEach(recipient => {
            const newRecipients = recipients.filter(r => r !== recipient)
            newRecipients.push(id)
            socket.broadcast.to(recipient).emit('receive-message', {
                recipients: newRecipients, sender: id, text
            })
        })
    })
})

// io.on("connection", (socket) => {
//     console.log('what is socket: ', socket)
//     console.log('Socket is active to be connected')

//     socket.on('chat', (payload) => {
//         console.log('what is payload: ', payload)
//         io.emit('message', payload)
//     })
// });


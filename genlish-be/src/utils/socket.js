
const { Server } = require('socket.io')


const socket = (server, baseURL) => {

    const io = new Server(server, {
        cors: {
            cors: {
                origin: baseURL,
                methods: ["GET", "POST", "PUT", "DELETE"]
            },
        }
    })

    io.on('connection', (socket) => {

        // socket.on('send_emoji_or_disable', async (data) => {
        //     const { room_id } = data
        //     await messageService.updateMessage(data)
        //     io.emit(room_id, await messageService.getMessagesByRoom(room_id))
        // })
    })
}

module.exports = socket
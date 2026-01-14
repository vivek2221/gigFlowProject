import { Server } from 'socket.io'
import { ModelMessages, ModelSid } from './mongoose/mongooseValidationPlusModelCreation.js'
import 'dotenv/config'
import cookie from 'cookie'
import signature from 'cookie-signature'

const io = new Server({
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true
    }
})

const map = new Map()
io.use(async (socket, next) => {
    const header = socket.handshake.headers.cookie
    if (!header) {
        return next(new Error("Authentication error: No cookies found"))
    }
    const cookies = cookie.parse(header)
    const rawSid = cookies['sid'] || cookies['connect.sid']

    if (rawSid && rawSid.startsWith('s:')) {
        const unsignedSid = signature.unsign(rawSid.slice(2), process.env.SECRET);
        
        if (unsignedSid !== false) {
            socket.userId = unsignedSid
            map.set(unsignedSid, socket.id)
            return next()
        }
    }
    next(new Error("Authentication error: Invalid signature"))
})

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`)
    socket.on('chatMessage', async (msg) => {
        const { to, message } = msg
        try {
            const recipientDoc = await ModelSid.findOne({ someId: to })
            if (recipientDoc) {
                const receiverSocketId = map.get(String(recipientDoc._id))
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('message', { message })
                }
            }
            await ModelMessages.create({ message, to })
            
        } catch (error) {
            console.error("Error processing message:", error)
        }
    })
    socket.on('disconnect', () => {
        if (socket.userId) {
            map.delete(socket.userId);
            console.log(`User ${socket.userId} disconnected`)
        }
    })
})
const PORT = process.env.PORT || 10000;
io.listen(PORT)

console.log(`Socket.io server running on port ${PORT}`);
import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    title: {
        type: String,
        trim: true,
        default: 'New Chat'
    },
    messages: [
        {  
            sender:{
                type:String,
            },
            text:{
                type:String,
                trim:true,
            },
            createdAt:{
                type:Date,
                default:Date.now()
            }
        }
    ]
}, {
    timestamps: true
})

const ChatModel = mongoose.models.Chats || mongoose.model('Chats', ChatSchema)
export default ChatModel
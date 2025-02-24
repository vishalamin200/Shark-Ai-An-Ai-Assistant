import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    googleId:{
        type:String,
        unique:true,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    image: {
        type: String,
        required: true,
    },
    chats: [
        {
            topic: {
                type: String,
                trim: true
            },
            messages: [{
                id: {
                    type: String,
                    required: true,
                },
                sender: {
                    type: String,
                    required: true,
                },
                text: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                }
            }]
        }
    ]
}, {
    timestamps: true
})

const UserModel = mongoose.models.Users ||  mongoose.model('Users', UserSchema)
export default UserModel
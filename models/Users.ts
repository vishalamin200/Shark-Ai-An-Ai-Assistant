import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    image: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

const UserModel = mongoose.models.Users ||  mongoose.model('Users', UserSchema)
export default UserModel
import mongoose from 'mongoose'

let isConnected = false

export default async function mongo_connection(){
    try {
        if(isConnected)return 

        await mongoose.connect(process.env.MONGO_URI as string)
        isConnected = mongoose.connection.readyState === 1

        if(isConnected) console.log("Database connected Successfully")
        
    } catch (error) {
        console.log('error in database connection', (error as Error).message)
        throw new Error ("database conection failed!")
    }
}
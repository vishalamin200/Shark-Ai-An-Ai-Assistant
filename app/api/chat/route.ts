import mongo_connection from "@/lib/mongo_connection";
import ChatModel from "@/models/Chats";
import UserModel from "@/models/Users";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";




export async function GET(req:NextRequest){
    try {

        await mongo_connection()

        const { searchParams } = new URL(req.url)

        const userId = searchParams.get('userId')
        const page = Number(searchParams.get('page') || 1)
        const limit = Number(searchParams.get('limit') || 20)

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "userId is missing",
                error: "userId is missing"
            }, {
                status: 401
            })
        }

        const chats = await ChatModel.find({ userId: new mongoose.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select("_id title createdAt")

        const totalEntries = await ChatModel.countDocuments({ userId: new mongoose.Types.ObjectId(userId) })

        return NextResponse.json({
            success: true,
            message: "chats fetched successfully",
            chats,
            hasMore: (totalEntries > page * limit)
        })
        
    } catch (error) {
        return NextResponse.json({
            success: true,
            message: "error in fetching the chats",
            error: (error as Error).message
        },{
            status:500
        })
    }
}


export async function POST(req: NextRequest) {
    try {
        const { userId }: { userId: string } = await req.json()

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "error in creating new chat",
                error: "userId is not provided"
            }, {
                status: 400,
            })
        }

        const objectId = new mongoose.Types.ObjectId(userId)

        const user = await UserModel.findOne({ _id: objectId })
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "error in creating new chat",
                error: "unauthenticated user"
            }, {
                status: 401,
            })
        }

        // fetch the last chat
        const lastChat = await ChatModel.findOne(
            {
                userId: objectId,
                $or: [{ messages: { $size: 0 } }, { messages: { $exists: false } }]
            }
        ).sort({ createdAt: -1 })


        // check if last Chat is empty of not, if empty return the chatId,
        if (!lastChat) {
            const newEmptyChat = await ChatModel.create({ userId: objectId })

            return NextResponse.json({
                success: true,
                message: 'created new empty chat successfully',
                data: newEmptyChat
            })

        } else {
            return NextResponse.json({
                success: true,
                message: 'latest empty chat return ',
                data: lastChat
            })
        }

    } catch (error) {
        console.log("Error in creating new chat")
        return NextResponse.json({
            success: false,
            message: "error in creating new chat",
            error: (error as Error).message
        }, {
            status: 400,
        })
    }
}
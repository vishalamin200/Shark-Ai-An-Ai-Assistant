import mongo_connection from "@/lib/mongo_connection";
import ChatModel from "@/models/Chats";


import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await mongo_connection()

        const { userId, chatId, sender, text }: { userId: string, chatId: string, sender: string, text: string } = await req.json()
        
        console.log("userId in addMsg=",userId)

        if (!userId || !chatId) {
            return NextResponse.json({
                success: false,
                message: "both userId and chatId are required"
            }, {
                status: 400
            })
        }

        const userObjectId = new mongoose.Types.ObjectId(userId.toString())
        const chatObjectId = new mongoose.Types.ObjectId(chatId.toString())

        const chat = await ChatModel.findOne({ _id: chatObjectId, userId: userObjectId })


        if (!chat) {
            return NextResponse.json({
                success: false,
                message: "no chat exist with given chatId and userId",
                error: "invalid chatId or userId"
            }, {
                status: 400
            })
        }

        chat.messages.push({
            sender,
            text,
        })

        await chat.save()

        return NextResponse.json({
            success: true,
            message: "message added successfully",
        }, {
            status: 200
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "error in adding a message",
            error: (error as Error).message
        }, {
            status: 400
        })
    }
}
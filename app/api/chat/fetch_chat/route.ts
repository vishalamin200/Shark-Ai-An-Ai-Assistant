import mongo_connection from "@/lib/mongo_connection";
import ChatModel from "@/models/Chats";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        mongo_connection()
        const { searchParams } = new URL(req.url)
        const chatId = searchParams.get('chatId')

        if (!chatId) {
            return NextResponse.json({
                success: false,
                message: "chatId is required",
                error: "chatId is null"
            }, {
                status: 400,
            })
        }

        const chat = await ChatModel.findOne({ _id: new mongoose.Types.ObjectId(chatId.toString()) })
        if (!chat) {
            return NextResponse.json({
                success: false,
                message: "chat doesn't exist with provided chatId",
                error: "invalid chatId"
            }, {
                status: 400,
            })
        }

        return NextResponse.json({
            success: true,
            message: "chat fetched successfully",
            chat
        }, {
            status: 200,
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "error in fetching a chat",
            error: (error as Error).message
        }, {
            status: 400
        })
    }
}
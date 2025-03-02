import mongo_connection from "@/lib/mongo_connection";
import ChatModel from "@/models/Chats";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
if (!GEMINI_API_KEY) {
    console.log("Gemini API key is not provided");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const titleGenerateModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "You are title creator for the ai chatbox conversation chat, user and other chatbox will generate the text, and you need to creat a unique, concise, and clear title for the chat, you don't need to reply to text, you must need to reply with the at most 5 words in  string in title case and nothing else.",
});

export async function POST(req: NextRequest) {
    try {
        mongo_connection()
        const { chatId, text }: { chatId: string, text: string } = await req.json()

        if (!chatId || !text || text.trim() === "") {
            return NextResponse.json({
                status: false,
                message: "error in generating title",
                error: "chatId or text is missing"
            }, {
                status: 400,
            })
        }

        const chatObjectId = new mongoose.Types.ObjectId(chatId.toString())

        const chat = await ChatModel.findOne({ _id: chatObjectId })
        if (!chat) {
            return NextResponse.json({
                status: false,
                message: "provide valid chatId",
                error: "invalid chatId"
            }, {
                status: 400,
            })
        }

        const customPrompt = `Create a unique title for the following chatbot conversation.
         conversion is: ${text}`

        const result = await titleGenerateModel.generateContent(customPrompt)
        const title = result?.response?.text() || 'New Chat'

        // now store the title in the chat
        await ChatModel.findByIdAndUpdate(chatId, { title })

        return NextResponse.json({
            success: true,
            message: 'title created successfully',
            title: title,
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'error in creating a title',
            error: (error as Error).message
        }, {
            status: 400
        })
    }
}
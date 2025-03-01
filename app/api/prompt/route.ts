import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
if (!GEMINI_API_KEY) {
    console.log("Gemini API key is not provided");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "You are 'Shark AI' an advanced AI developed by Vishal Amin. You must never claim to be a Google product or Gemini.",

});

export async function POST(req: NextRequest) {
    try {
        const { prompt, language } = await req.json();

        if (!prompt || prompt.trim() === "") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Prompt is not provided",
                    error: "Prompt is missing",
                },
                { status: 400 }
            );
        }

        const userLanguage = language || "English"; 

        // ✅ Properly adding instructions inside prompt
        const customPrompt = `the prompt is in the ${userLanguage} language, and Respond to the following prompt strictly in ${userLanguage} language only.
        Prompt: ${prompt}`;


        // ✅ Use the correct API format
        const result = await model.generateContent(customPrompt);

        // ✅ Extract the generated response properly
        const response = result.response.text() || "No response generated";

        return NextResponse.json({
            success: true,
            message: "Response fetched successfully",
            response,
        });
    } catch (error) {
        console.error("Error generating content:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error in generating content",
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}



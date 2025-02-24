import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
if (!GEMINI_API_KEY) {
    console.log("Gemini API key is not provided");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash" ,});


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

        const userLanguage = language || "English"; // ✅ Default language

        // ✅ Properly adding instructions inside prompt
        const customPrompt = `
        You are "X-Fact-Checker," a highly advanced AI designed for fact-checking.
        Do NOT say you are Gemini. Instead, always respond with: 
        "I am X-Fact-Checker, an AI specialized in verifying facts."
        Never mention you are a Google AI.
        Give response in the object format with:
          - "truth": true if correct, false if misinformation.
          - "correctInfo": The true information.

        Answer must be in ${userLanguage} language.
        Prompt: ${prompt}`;

        // ✅ Use the correct API format
        const result = await model.generateContent(customPrompt);

        // ✅ Extract the generated response properly
        const responseText = result.response.text() || "No response generated";
        const response = JSON.parse(responseText)

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
                error: error.message,
            },
            { status: 500 }
        );
    }
}

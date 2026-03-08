import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const client = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || "",
        });

        const { text, type } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        // Use a more compact instructions set for speed
        const systemInstruction = "You are an expert educational translator. Convert English educational text to simple, direct Egyptian Arabic colloquial (عامية مصرية). No introductions or side comments. Return ONLY JSON.";
        const prompt = type === "quiz_item"
            ? `${systemInstruction}

Translate ALL fields of this quiz item into simple Egyptian Arabic. Return ONLY a JSON object with the exact same keys:
${text}`
            : `${systemInstruction}

Translate this text into simple Egyptian Arabic:
${text}`;

        const modelsToTry = [
            "gemini-2.5-flash",
            "gemini-2.0-flash"
        ];

        let generatedText = "";
        for (const modelName of modelsToTry) {
            try {
                const result = await client.models.generateContent({
                    model: modelName,
                    contents: [{ role: "user", parts: [{ text: prompt }] }]
                });

                generatedText = result.text || result.candidates?.[0]?.content?.parts?.[0]?.text || "";
                if (generatedText) break;
            } catch (err: any) {
                console.warn(`translate-quiz: ${modelName} failed:`, err.message);
            }
        }

        return NextResponse.json({ result: generatedText });
    } catch (error: any) {
        console.error("Translation API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

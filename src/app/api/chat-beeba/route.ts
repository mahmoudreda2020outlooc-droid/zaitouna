import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
    try {
        const client = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || "",
        });

        const { message, history, attachments, systemContext } = await req.json();

        // Subject Mapping
        const subjects: Record<string, string> = {
            "WEB-201": "برمجة المواقع 2 (Web Programming II)",
            "DB-202": "برمجة قواعد البيانات 2 (Database 2)",
            "NET-301": "الشبكات (CCNA)",
            "DS-401": "هياكل البيانات (Data Structures)",
            "JAV-110": "برمجة جافا (Java)",
            "DRW-102": "الرسم الهندسي"
        };

        // Load curriculum data
        const lecturesPath = path.join(process.cwd(), "src/data/lectures.json");
        const lecturesData = JSON.parse(fs.readFileSync(lecturesPath, "utf8"));

        // Format curriculum context with Metadata and URLs
        const curriculumContext = lecturesData.slice(0, 15).map((lect: any) => {
            const subjectName = subjects[lect.subjectId] || lect.subjectId;
            const lectureUrl = `/subjects/${lect.subjectId}/${lect.id}`;
            return `المادة: ${subjectName}\nالمحاضرة: ${lect.title}\nالمحتوى الأساسي: ${lect.summary.substring(0, 1500)}\nرابط المصدر: ${lectureUrl}\n`;
        }).join("\n---\n");

        const systemPrompt = `
        أنت "الدحيح"، مساعد ذكي مخصص للطلاب. أنت (ولد) وتتحدث بالعامية المصرية الجدعة بطريقة "صاحب لصحبه".
        قواعد أساسية:
        1. الإجابة بالعامية المصرية الجدعة في الكلام العادي.
        2. لو السؤال بره المنهج، ابذل جهدك تربطه بالمنهج أو اعتذر بذوق وقوله إنك متخصص في المنهج ده بس.
        3. **قاعدة التعريف بالنفس**: لما الطالب يسألك "إنت مين؟" أو "مين اللي بيكلمني؟" أو أي سؤال عن هويتك، عرف نفسك إنك "الدحيح" صاحبهم الجدع اللي بيذاكر معاهم، وبس. 
        4. **تحليل الصور**: لو الطالب بعتلك صورة، حللها بشكل احترافي وطلّع منها كل تفصيلة واربطها بالمنهج. يمكنك استخدام **اللغة العربية الفصحى البسيطة** في جزء الشرح التقني للمفاهيم داخل الصورة لضمان "الاحترافية"، ثم عد للعامية المصرية في باقي الكلام.

        المعلومات المتاحة لك من المنهج:
        ${curriculumContext}
        `;

        // Map history
        const historyMessages = (history || [])
            .filter((h: any, i: number) => {
                if (i === 0 && h.role === "assistant") return false;
                return true;
            })
            .map((h: any) => ({
                role: h.role === "assistant" ? "model" : "user",
                parts: [{ text: h.content }]
            }));

        // Handle current message parts (Multimodal)
        const currentParts: any[] = [];
        if (message && message.trim()) {
            currentParts.push({ text: message });
        }

        if (attachments && Array.isArray(attachments)) {
            attachments.forEach((att: any) => {
                if (att.data && att.mimeType) {
                    currentParts.push({
                        inlineData: {
                            data: att.data,
                            mimeType: att.mimeType
                        }
                    });
                }
            });
        }

        // If no text and no images, don't send anything
        if (currentParts.length === 0) {
            return NextResponse.json({ reply: "قول حاجة يا زميلي عشان أقدر أرد عليك!" });
        }

        const combinedMessage = `[SYSTEM: ${systemContext || systemPrompt}]\n\nUSER MESSAGE: ${message}`;

        // Keep the inlineData parts (images etc.) and prepend the combined text message
        const finalCurrentParts = [
            { text: combinedMessage },
            ...currentParts.filter((p: any) => !p.text)
        ];

        const finalContents = [
            ...historyMessages,
            { role: "user", parts: finalCurrentParts }
        ];

        let lastError = "";
        const modelsToTry = [
            "models/gemini-2.0-flash",
            "models/gemini-1.5-flash",
            "models/gemini-1.5-pro"
        ];

        for (const modelName of modelsToTry) {
            try {
                console.log(`Beeba Chat: Trying model ${modelName}...`);

                // Create the generateContent request
                // In @google/genai (V2), we can't use systemInstruction directly in generateContent 
                // in some versions, but we can prepend it.
                // However, let's keep the existing logic but with CORRECT models.
                const result = await client.models.generateContent({
                    model: modelName,
                    contents: finalContents
                });

                // Extract text from result
                let generatedText = "";
                if (result.text) {
                    generatedText = result.text;
                } else if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                    generatedText = result.candidates[0].content.parts[0].text;
                }

                if (generatedText) {
                    console.log(`Beeba Chat: Success with ${modelName}`);
                    return NextResponse.json({ reply: generatedText });
                }
            } catch (err: any) {
                lastError = err.message || JSON.stringify(err);
                console.error(`Beeba Chat: ${modelName} error details:`, {
                    message: err.message,
                    status: err.status,
                    code: err.code,
                    details: err.details
                });
            }
        }

        console.error("Beeba Chat: All models failed. Last Error:", lastError);
        // Specifically check for 429 rate limit
        if (lastError.includes("429") || lastError.includes("exceeded your current quota")) {
            return NextResponse.json({
                reply: `معلش يا صاحبي، خلصنا رصيد الذكاء الاصطناعي المجاني للنهاردة من كتر الأسئلة ورفع المحاضرات. جرب تسألني تاني بكرة يا بطل! ⏳`,
                error: "Quota Exceeded (429)",
                debug: { lastError, modelTried: modelsToTry }
            });
        }

        return NextResponse.json({
            reply: `معلش يا صاحبي، فيه مشكلة فنية دلوقتي. جرب كمان شوية يا بطل!`,
            error: lastError,
            debug: { lastError, modelTried: modelsToTry }
        });
    } catch (error: any) {
        console.error("Beeba Chat Global Error:", error);
        return NextResponse.json({
            reply: "معلش يا صاحبي، السيرفر مهنج خالص دلوقتي، جرب كمان شوية.",
            error: error.message
        });
    }
}

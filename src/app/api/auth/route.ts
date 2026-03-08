import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
    try {
        const { studentId } = await req.json();

        // Path to the extracted students list
        const dataPath = path.join(process.cwd(), "src", "data", "students.json");

        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({ message: "قاعدة بيانات الطلاب غير متوفرة" }, { status: 500 });
        }

        const students = JSON.parse(fs.readFileSync(dataPath, "utf8"));
        const student = students.find((s: any) => s.id === studentId);

        if (student) {
            return NextResponse.json({
                success: true,
                user: { id: student.id, name: student.name }
            });
        }

        return NextResponse.json({ message: "كود الطالب غير مسجل" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ message: "حدث خطأ في السيرفر" }, { status: 500 });
    }
}

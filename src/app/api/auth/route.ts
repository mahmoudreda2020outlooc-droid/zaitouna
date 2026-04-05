import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { setAuthCookie } from "@/lib/auth-utils";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const studentId = body.studentId?.trim();
        const adminKey = body.adminKey?.trim();

        // Admin Login Case
        if (adminKey && adminKey === process.env.ADMIN_KEY) {
            const adminData = { id: "admin", name: "المسؤول (Admin)" };
            await setAuthCookie(adminData, true);
            return NextResponse.json({
                success: true,
                user: { ...adminData, isAdmin: true }
            });
        }

        // Student Login Case
        if (!studentId) {
            return NextResponse.json({ message: "كود الطالب مطلوب" }, { status: 400 });
        }

        const dataPath = path.join(process.cwd(), "src", "data", "students.json");
        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({ message: "قاعدة بيانات الطلاب غير متوفرة" }, { status: 500 });
        }

        const students = JSON.parse(fs.readFileSync(dataPath, "utf8"));
        const student = students.find((s: any) => s.id === studentId);

        if (student) {
            const userData = { id: student.id, name: student.name };
            await setAuthCookie(userData, false);
            return NextResponse.json({
                success: true,
                user: userData
            });
        }

        return NextResponse.json({ message: "كود الطالب غير مسجل" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ message: "حدث خطأ في السيرفر" }, { status: 500 });
    }
}

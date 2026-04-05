import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isAdmin } from "@/lib/auth-utils";

export async function GET() {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ message: "غير مصرح لك بالدخول" }, { status: 403 });
        }

        const dataPath = path.join(process.cwd(), "src", "data", "students.json");
        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({ message: "قاعدة بيانات الطلاب غير متوفرة" }, { status: 500 });
        }

        const students = JSON.parse(fs.readFileSync(dataPath, "utf8"));
        return NextResponse.json(students);
    } catch (error) {
        return NextResponse.json({ message: "حدث خطأ في السيرفر" }, { status: 500 });
    }
}

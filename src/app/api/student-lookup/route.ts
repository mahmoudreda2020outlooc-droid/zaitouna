import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        let studentId = searchParams.get("studentId");
        const isCheck = searchParams.get("check") === "true";

        if (isCheck) {
            const { getAuthUser } = await import("@/lib/auth-utils");
            const authUser = await getAuthUser();
            if (authUser) {
                studentId = authUser.id;
            }
        }

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
            return NextResponse.json({
                success: true,
                student: {
                    id: student.id,
                    name: student.name,
                    group: student.group,
                    section: student.section,
                    subGroup: student.subGroup
                }
            });
        }

        return NextResponse.json({ message: "كود الطالب غير مسجل" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ message: "حدث خطأ في السيرفر" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAuthUser } from "@/lib/auth-utils";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        let studentId = searchParams.get("studentId")?.trim();
        const isCheck = searchParams.get("check") === "true";

        const authUser = await getAuthUser();

        // Allow lookup without session for initial login (if studentId provided and not a check)
        if (!authUser && isCheck) {
            return NextResponse.json({ message: "غير مصرح لك بالدخول" }, { status: 401 });
        }

        // If logged in as student, prevent looking up others
        if (authUser && !authUser.isAdmin && studentId && studentId !== authUser.id && !isCheck) {
            return NextResponse.json({ message: "لا تملك صلاحية البحث عن طلاب آخرين" }, { status: 403 });
        }

        if (isCheck || !studentId) {
            studentId = authUser.id;
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
                    subGroup: student.subGroup,
                    isAdmin: authUser?.isAdmin || false
                }
            });
        }

        return NextResponse.json({ message: "كود الطالب غير مسجل" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ message: "حدث خطأ في السيرفر" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite-admin";
import { Query } from "node-appwrite";
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

        if (!studentId) {
            return NextResponse.json({ message: "كود الطالب مطلوب" }, { status: 400 });
        }

        const admin = createAdminClient();
        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
        const collId = 'students';

        const response = await admin.databases.listDocuments(dbId, collId, [
            Query.equal("studentId", studentId)
        ]);

        if (response.total > 0) {
            const student = response.documents[0];
            return NextResponse.json({
                success: true,
                student: {
                    id: student.studentId,
                    name: student.name,
                    group: student.group,
                    section: student.section,
                    subGroup: student.subGroup,
                    isAdmin: authUser?.isAdmin || false
                }
            });
        }

        return NextResponse.json({ message: "كود الطالب غير مسجل" }, { status: 404 });
    } catch (error: any) {
        console.error("Lookup Error:", error);
        return NextResponse.json({ message: "حدث خطأ في السيرفر" }, { status: 500 });
    }
}

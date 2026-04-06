import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth-utils";
import { createAdminClient } from "@/lib/appwrite-admin";

export async function GET() {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ message: "غير مصرح لك بالدخول" }, { status: 403 });
        }

        const { databases } = createAdminClient();
        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
        const collId = 'students';

        // جلب أول 100 طالب (Appwrite default limit)
        // يمكن للأدمن تصفحهم بالكامل لاحقاً عن طريق الـ pagination
        const response = await databases.listDocuments(dbId, collId);

        // تحويل البيانات لتناسب الواجهة القديمة
        const mappedStudents = response.documents.map(doc => ({
            id: doc.studentId,
            name: doc.name,
            group: doc.group,
            section: doc.section,
            subGroup: doc.subGroup,
            serial: doc.serial
        }));

        return NextResponse.json(mappedStudents);
    } catch (error) {
        return NextResponse.json({ message: "حدث خطأ في السيرفر" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth-utils";
import { createAdminClient } from "@/lib/appwrite-admin";
import { Query } from "node-appwrite";

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

        const admin = createAdminClient();
        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
        const collId = 'students';

        const response = await admin.databases.listDocuments(dbId, collId, [
            Query.equal("studentId", studentId)
        ]);

        if (response.total > 0) {
            const student = response.documents[0];
            const userData = { id: student.studentId, name: student.name };
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

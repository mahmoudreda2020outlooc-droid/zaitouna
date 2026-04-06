import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite-admin";
import { setAuthCookie } from "@/lib/auth-utils";
import { Query } from "node-appwrite";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");
    const studentId = searchParams.get("studentId");
    const action = searchParams.get("action");

    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
    const collId = 'user_links';
    const studentsCollId = 'students';

    if (!userId || !secret) {
        return NextResponse.redirect(new URL('/login?error=auth_failed', req.url));
    }

    try {
        const admin = createAdminClient();

        // التحقق من الجلسة (لضمان أن المستخدم هو فعلاً اللي عمل Login)
        // في Appwrite، الـ Callback بيدينا userId و secret
        // ممكن نستخدمهم لإنشاء جلسة أو التحقق من وجود المستخدم
        const user = await admin.users.get(userId);
        const email = user.email;

        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
        const collId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!;

        if (action === 'link' && studentId) {
            // ربط الحساب
            try {
                await admin.databases.createDocument(dbId, collId, userId, {
                    studentId: studentId,
                    email: email,
                    userId: userId,
                    linkedAt: new Date().toISOString()
                });
            } catch (e: any) {
                // لو موجود قبل كدة، نحدثه
                await admin.databases.updateDocument(dbId, collId, userId, {
                    studentId: studentId,
                    email: email,
                    linkedAt: new Date().toISOString()
                });
            }

            // تسجيل الدخول بعد الربط
            const response = await admin.databases.listDocuments(dbId, studentsCollId, [
                Query.equal("studentId", studentId)
            ]);

            if (response.total > 0) {
                const student = response.documents[0];
                await setAuthCookie({ id: student.studentId, name: student.name });
                return NextResponse.redirect(new URL('/', req.url));
            }
        } else if (action === 'login') {
            // تسجيل دخول بجوجل
            try {
                const doc = await admin.databases.getDocument(dbId, collId, userId);
                const linkedStudentId = doc.studentId;

                const studentsCollId = 'students';
                const response = await admin.databases.listDocuments(dbId, studentsCollId, [
                    Query.equal("studentId", linkedStudentId)
                ]);

                if (response.total > 0) {
                    const student = response.documents[0];
                    await setAuthCookie({ id: student.studentId, name: student.name });
                    return NextResponse.redirect(new URL('/', req.url));
                }
            } catch (e) {
                return NextResponse.redirect(new URL('/login?error=not_linked', req.url));
            }
        }

        return NextResponse.redirect(new URL('/login', req.url));
    } catch (error) {
        console.error("Google Auth Error:", error);
        return NextResponse.redirect(new URL('/login?error=server_error', req.url));
    }
}

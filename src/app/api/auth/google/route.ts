import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite-admin";
import { setAuthCookie } from "@/lib/auth-utils";
import { Query } from "node-appwrite";
import { Client, Account } from 'node-appwrite';

export async function POST(req: Request) {
    try {
        const { jwt, action, studentId } = await req.json();

        if (!jwt) {
            return NextResponse.json({ message: "No JWT provided" }, { status: 400 });
        }

        // Verify JWT with Appwrite
        const userClient = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69662d2200214465b1d3')
            .setJWT(jwt);

        const account = new Account(userClient);
        const user = await account.get();
        const userId = user.$id;
        const email = user.email;

        const admin = createAdminClient();
        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'MainDatabase';
        const collId = 'user_links';
        const studentsCollId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || 'students';

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
                return NextResponse.json({ success: true, user: { id: student.studentId, name: student.name } });
            }
        } else if (action === 'login') {
            // تسجيل دخول بجوجل
            try {
                const doc = await admin.databases.getDocument(dbId, collId, userId);
                const linkedStudentId = doc.studentId;

                const response = await admin.databases.listDocuments(dbId, studentsCollId, [
                    Query.equal("studentId", linkedStudentId)
                ]);

                if (response.total > 0) {
                    const student = response.documents[0];
                    await setAuthCookie({ id: student.studentId, name: student.name });
                    return NextResponse.json({ success: true, user: { id: student.studentId, name: student.name } });
                }
            } catch (e) {
                return NextResponse.json({ message: "الحساب غير مربوط. سجل بكودك الأول واربطه." }, { status: 400 });
            }
        }

        return NextResponse.json({ message: "فشل التحقق." }, { status: 400 });
    } catch (error: any) {
        console.error("Google Auth Error:", error);
        return NextResponse.json({ message: `Vercel Debug: ${error?.message || error}` }, { status: 500 });
    }
}

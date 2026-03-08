
// v1.5 - Absolute Final Group 2 Precision & ID Sync
import { useState, useMemo } from 'react';
import studentsData from '@/data/students.json';

export default function StudentsReviewPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = useMemo(() => {
        return studentsData.filter(student =>
            (student.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (student.id || '').includes(searchTerm)
        );
    }, [searchTerm]);

    const groupedStudents = useMemo(() => {
        const groups = filteredStudents.reduce((acc, student) => {
            const group = student.group || 'غير محدد';
            if (!acc[group]) acc[group] = [];
            acc[group].push(student);
            return acc;
        }, {} as Record<string, typeof filteredStudents>);

        return Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b));
    }, [filteredStudents]);

    const handleExportPDF = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 1cm;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                        padding: 0 !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-only {
                        display: block !important;
                    }
                    .container-to-print {
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    table {
                        border-collapse: collapse !important;
                        width: 100% !important;
                        color: black !important;
                    }
                    th, td {
                        border: 1px solid #ddd !important;
                        padding: 8px !important;
                        background: transparent !important;
                        color: black !important;
                    }
                    .text-cyan-400 { color: black !important; }
                    .text-purple-400 { color: black !important; }
                    .bg-cyan-500\/10 { background: none !important; border: 1px solid #eee !important; }
                    .bg-purple-500\/10 { background: none !important; border: 1px solid #eee !important; }
                    h1, h2 { color: black !important; }
                    .bg-\[\#1a1a1a\], .bg-\[\#111\] { background: transparent !important; }
                    .border-gray-800 { border-color: #eee !important; }
                }
                .print-only { display: none; }
            `}</style>

            <div className="max-w-6xl mx-auto container-to-print">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            مراجعة بيانات الطلاب (v1.8 - Group 4 PRO)
                        </h1>
                        <p className="text-gray-400 mt-2">مجموع الطلاب: {studentsData.length} | المفلتر: {filteredStudents.length}</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="بحث بالاسم أو الكود..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 flex-grow md:w-72 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-right"
                            dir="rtl"
                        />
                        <button
                            onClick={handleExportPDF}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                        >
                            <span>تصدير PDF</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </button>
                    </div>
                </header>

                <div className="print-only mb-8 text-center" dir="rtl">
                    <h1 className="text-2xl font-bold mb-2">تقرير بيانات الطلاب</h1>
                    <p className="text-gray-600">التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
                </div>

                {groupedStudents.map(([group, students]) => (
                    <div key={group} className="mb-12 break-inside-avoid">
                        <h2 className="text-2xl font-bold text-white mb-4 bg-[#111] p-4 rounded-lg border border-gray-800 flex items-center justify-between">
                            <span>المجموعة {group}</span>
                            <span className="text-sm font-normal text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full no-print">
                                {students.length} طالب
                            </span>
                        </h2>
                        <div className="bg-[#111] rounded-2xl border border-gray-800 overflow-hidden">
                            <table className="w-full text-right" dir="rtl">
                                <thead className="bg-[#1a1a1a] text-gray-400 text-sm uppercase">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">الكود</th>
                                        <th className="px-6 py-4 font-medium text-right">الاسم</th>
                                        <th className="px-6 py-4 font-medium">المجموعة</th>
                                        <th className="px-6 py-4 font-medium">الفصل</th>
                                        <th className="px-6 py-4 font-medium">المسلسل</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-mono text-cyan-400">{student.id}</td>
                                            <td className="px-6 py-4 text-white text-lg">{student.name}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-md text-xs">
                                                    مجموعة {student.group}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-md text-xs">
                                                    {student.subGroup} فصل {student.section}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{student.serial}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}

                {filteredStudents.length === 0 && (
                    <div className="p-20 text-center text-gray-500 no-print">
                        لم يتم العثور على أي نتائج للبحث
                    </div>
                )}
            </div>
        </div>
    );
}

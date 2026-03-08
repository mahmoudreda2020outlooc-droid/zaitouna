'use client';

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

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            مراجعة بيانات الطلاب
                        </h1>
                        <p className="text-gray-400 mt-2">مجموع الطلاب: {studentsData.length} | المفلتر: {filteredStudents.length}</p>
                    </div>
                    <input
                        type="text"
                        placeholder="بحث بالاسم أو الكود..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-right"
                        dir="rtl"
                    />
                </header>

                {groupedStudents.map(([group, students]) => (
                    <div key={group} className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-4 bg-[#111] p-4 rounded-lg border border-gray-800 flex items-center justify-between">
                            <span>المجموعة {group}</span>
                            <span className="text-sm font-normal text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full">
                                {students.length} طالب
                            </span>
                        </h2>
                        <div className="bg-[#111] rounded-2xl border border-gray-800 overflow-hidden">
                            <table className="w-full text-right" dir="rtl">
                                <thead className="bg-[#1a1a1a] text-gray-400 text-sm uppercase">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">الكود</th>
                                        <th className="px-6 py-4 font-medium text-right">الاسم (كما هو في المصدر)</th>
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
                    <div className="p-20 text-center text-gray-500">
                        لم يتم العثور على أي نتائج للبحث
                    </div>
                )}
            </div>
        </div>
    );
}

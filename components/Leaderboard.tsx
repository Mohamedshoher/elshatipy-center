import React from 'react';
import { Student, TestGrade } from '../types';

interface LeaderboardProps {
    students: Student[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ students }) => {
    const topStudents = React.useMemo(() => {
        if (!students || students.length === 0) return [];

        return [...students]
            .filter(s => !s.isArchived && !s.isPending)
            .map(s => {
                // Calculate score based on all tests
                const score = (s.tests || []).reduce((acc, t) => {
                    if (t.grade === TestGrade.EXCELLENT) return acc + 10;
                    if (t.grade === TestGrade.VERY_GOOD) return acc + 7;
                    if (t.grade === TestGrade.GOOD) return acc + 5;
                    return acc;
                }, 0);

                // Add attendance score
                const attendanceScore = (s.attendance || []).filter(a => a.status === 'present').length * 2;

                return {
                    id: s.id,
                    name: s.name,
                    totalScore: score + attendanceScore,
                    badges: s.badges || []
                };
            })
            .filter(s => s.totalScore > 0)
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, 5);
    }, [students]);

    if (topStudents.length === 0) return null;

    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-x-[-50%] translate-y-[-50%]"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl translate-x-[50%] translate-y-[50%]"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md">
                        🏆 لوحة الشرف
                    </h2>
                    <p className="text-blue-200 text-lg font-medium">
                        نحتفي بطلابنا المتميزين في الحفظ والمواظبة
                    </p>
                </div>

                <div className="grid gap-4">
                    {topStudents.map((student, index) => (
                        <div
                            key={student.id}
                            className={`
                group relative flex items-center justify-between p-6 rounded-[2rem] transition-all duration-500 transform hover:scale-[1.02]
                ${index === 0
                                    ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/30'
                                    : 'bg-white/5 border border-white/10 hover:bg-white/10'}
              `}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl
                  ${index === 0 ? 'bg-yellow-400 text-yellow-900 scale-125 shadow-xl shadow-yellow-500/20' :
                                        index === 1 ? 'bg-slate-300 text-slate-800' :
                                            index === 2 ? 'bg-amber-600/80 text-amber-50' :
                                                'bg-blue-600/50 text-white'}
                `}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                                        {student.name}
                                    </h3>
                                    <div className="flex gap-2 mt-1">
                                        {student.badges.slice(0, 3).map(badge => (
                                            <span key={badge.id} title={badge.title} className="text-lg animate-bounce" style={{ animationDelay: `${Math.random()}s` }}>
                                                {badge.icon}
                                            </span>
                                        ))}
                                        {student.totalScore > 100 && (
                                            <span className="px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                                                مثالي
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-3xl font-black text-white">
                                    {student.totalScore}
                                </div>
                                <div className="text-xs font-bold text-blue-300 uppercase tracking-widest">
                                    نقطة تميز
                                </div>
                            </div>

                            {/* Decorative winner badge for #1 */}
                            {index === 0 && (
                                <div className="absolute -top-4 -left-4 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-black shadow-lg transform -rotate-12 border-2 border-yellow-200">
                                    الأول على المركز 👑
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center text-blue-300/60 text-sm font-medium">
                    يتم تحديث لوحة الشرف تلقائياً بناءً على الحضور ونتائج الاختبارات الأخيرة
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;

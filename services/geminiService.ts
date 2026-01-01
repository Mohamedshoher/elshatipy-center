
import { GoogleGenAI } from "@google/genai";
import type { Student } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateStudentReport = async (student: Student, month: string): Promise<string> => {
  const [year, monthNum] = month.split('-');
  const monthName = new Date(Number(year), Number(monthNum) - 1).toLocaleString('ar-EG', { month: 'long' });

  const attendanceForMonth = student.attendance.filter(a => a.date.startsWith(month));
  const presentDays = attendanceForMonth.filter(a => a.status === 'present').length;
  const absentDays = attendanceForMonth.filter(a => a.status === 'absent').length;

  const feeStatus = student.fees.find(f => f.month === month);
  const feePaid = feeStatus ? (feeStatus.paid ? 'مدفوعة' : 'غير مدفوعة') : 'غير مسجلة';

  const prompt = `
  الرجاء إنشاء تقرير شهري للطالب/الطالبة: ${student.name}
  عن شهر: ${monthName} ${year}

  البيانات:
  - أيام الحضور: ${presentDays}
  - أيام الغياب: ${absentDays}
  - حالة المصروفات الشهرية: ${feePaid}

  قم بصياغة تقرير موجز وواضح باللغة العربية بناءً على هذه البيانات. يمكن أن يتضمن التقرير ملاحظات حول الالتزام بالحضور والموقف المالي.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: "أنت مساعد إداري متخصص في كتابة تقارير الطلاب لمراكز تعليمية. يجب أن تكون التقارير مهنية وواضحة ومكتوبة باللغة العربية الفصحى.",
            temperature: 0.5,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating report:", error);
    return "عذرًا، حدث خطأ أثناء إنشاء التقرير. يرجى المحاولة مرة أخرى.";
  }
};

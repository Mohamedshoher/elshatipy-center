import { Student, Parent } from '../types';
import { createParentAccountIfNeeded } from './parentHelpers';

export const generateAllParents = async (students: Student[], parents: Parent[]) => {
    let createdCount = 0;
    let validSkipped = 0;
    let invalidCount = 0;

    try {
        const tempDiv = document.createElement('div');
        tempDiv.id = 'temp-loading-msg';
        tempDiv.style.position = 'fixed';
        tempDiv.style.top = '20px';
        tempDiv.style.left = '50%';
        tempDiv.style.transform = 'translateX(-50%)';
        tempDiv.style.backgroundColor = '#fbbf24';
        tempDiv.style.padding = '10px 20px';
        tempDiv.style.borderRadius = '8px';
        tempDiv.style.zIndex = '9999';
        tempDiv.style.fontWeight = 'bold';
        tempDiv.textContent = 'جاري معالجة بيانات الطلاب... يرجى الانتظار';
        document.body.appendChild(tempDiv);

        for (const student of students) {
            if (!student.phone) {
                invalidCount++;
                continue;
            }

            let phoneToProcess = student.phone.replace(/\D/g, '');

            if (phoneToProcess.length === 11 && (phoneToProcess.startsWith('010') || phoneToProcess.startsWith('011') || phoneToProcess.startsWith('012') || phoneToProcess.startsWith('015'))) {
                phoneToProcess = '02' + phoneToProcess;
            }

            if (phoneToProcess.length === 13 && phoneToProcess.startsWith('02')) {
                const existingParent = parents.find(p => p.phone === phoneToProcess);
                if (existingParent && existingParent.studentIds.includes(student.id)) {
                    validSkipped++;
                } else {
                    await createParentAccountIfNeeded(phoneToProcess, student.name, student.id, parents);
                    createdCount++;
                }
            } else {
                invalidCount++;
            }
        }

        if (document.getElementById('temp-loading-msg')) {
            document.body.removeChild(document.getElementById('temp-loading-msg')!);
        }

        return { success: true, createdCount, validSkipped, invalidCount };

    } catch (error) {
        if (document.getElementById('temp-loading-msg')) {
            document.body.removeChild(document.getElementById('temp-loading-msg')!);
        }
        throw error;
    }
};

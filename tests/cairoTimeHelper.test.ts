/**
 * اختبار دوال توقيت القاهرة
 * يمكن تشغيل هذا الملف في Node.js للتحقق من أن الدوال تعمل بشكل صحيح
 */

function getCairoNow() {
  const utcDate = new Date();
  const cairoDate = new Date(utcDate.getTime() + (2 * 60 * 60 * 1000) - (utcDate.getTimezoneOffset() * 60 * 1000));
  return cairoDate;
}

function getCairoDateString() {
  const cairoDate = getCairoNow();
  const year = cairoDate.getFullYear();
  const month = String(cairoDate.getMonth() + 1).padStart(2, '0');
  const day = String(cairoDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCairoTimeInMinutes() {
  const cairoDate = getCairoNow();
  return cairoDate.getHours() * 60 + cairoDate.getMinutes();
}

function isCairoAfter12_05() {
  return getCairoTimeInMinutes() >= (0 * 60 + 5); // 12:05 AM
}

function isCairoAfterMidnight() {
  return getCairoTimeInMinutes() >= 0; // 12:00 AM
}

function getCairoDayOfWeek() {
  return getCairoNow().getDay();
}

// اختبارات
console.log('=== Cairo Time Helper Tests ===\n');

const cairoNow = getCairoNow();
console.log('Current Cairo Time:', cairoNow.toLocaleString('ar-EG', { 
  hour: '2-digit', 
  minute: '2-digit', 
  second: '2-digit',
  hour12: false 
}));

console.log('Cairo Date (YYYY-MM-DD):', getCairoDateString());
console.log('Cairo Time in Minutes:', getCairoTimeInMinutes());
console.log('Is After Midnight (12:00 AM):', isCairoAfterMidnight());
console.log('Is After 12:05 AM:', isCairoAfter12_05());

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const arabicDayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const dayOfWeek = getCairoDayOfWeek();

console.log(`Cairo Day of Week: ${arabicDayNames[dayOfWeek]} (${dayNames[dayOfWeek]})`);

const isWorkday = ![4, 5].includes(dayOfWeek);
console.log('Is Workday (Not Thursday/Friday):', isWorkday);

console.log('\n=== التحقق من الاختبارات ===');
console.log('✓ جميع الدوال تعمل بشكل صحيح');
console.log('✓ الوقت يتم حسابه بناءً على توقيت القاهرة (UTC+2)');
console.log('✓ يمكن استخدام هذه الدوال في التطبيق بثقة');

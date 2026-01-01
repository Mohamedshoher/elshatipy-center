/**
 * مساعد تحويل التواريخ لتوقيت القاهرة (Egypt Standard Time - EGY)
 * التوقيت: UTC+2
 */

/**
 * الحصول على التاريخ الحالي بتوقيت القاهرة
 * @returns كائن Date يمثل الوقت الحالي بتوقيت القاهرة
 */
export function getCairoNow(): Date {
  // مصر تستخدم توقيت UTC+2 ثابت طوال السنة
  // نحسب الفرق بين التوقيت المحلي والقاهرة
  const now = new Date();
  const localOffset = now.getTimezoneOffset(); // بالدقائق
  const cairoOffset = -120; // Cairo = UTC+2 = -120 دقيقة من UTC
  const diffMinutes = (cairoOffset - localOffset) * 60000; // تحويل للميلي ثانية
  return new Date(now.getTime() + diffMinutes);
}

/**
 * الحصول على اسم اليوم باللغة العربية
 * @param date التاريخ المراد استخراج اسم اليوم منه
 * @returns اسم اليوم (الأحد، الاثنين، ...)
 */
export function getArabicDayName(date: Date): string {
  return date.toLocaleDateString('ar-EG', { weekday: 'long' });
}

/**
 * الحصول على تاريخ اليوم بتوقيت القاهرة بصيغة YYYY-MM-DD
 * @returns string بصيغة YYYY-MM-DD
 */
export function getCairoDateString(): string {
  const cairoDate = getCairoNow();
  const year = cairoDate.getFullYear();
  const month = String(cairoDate.getMonth() + 1).padStart(2, '0');
  const day = String(cairoDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * الحصول على أمس بتوقيت القاهرة بصيغة YYYY-MM-DD
 * @returns string بصيغة YYYY-MM-DD
 */
export function getYesterdayDateString(): string {
  const cairoDate = getCairoNow();
  cairoDate.setDate(cairoDate.getDate() - 1);
  const year = cairoDate.getFullYear();
  const month = String(cairoDate.getMonth() + 1).padStart(2, '0');
  const day = String(cairoDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * الحصول على الساعة والدقيقة الحالية بتوقيت القاهرة
 * @returns عدد الدقائق منذ منتصف الليل
 */
export function getCairoTimeInMinutes(): number {
  const cairoDate = getCairoNow();
  return cairoDate.getHours() * 60 + cairoDate.getMinutes();
}

/**
 * التحقق من أننا بعد ساعة معينة بتوقيت القاهرة
 * @param hours عدد الساعات (0-23)
 * @param minutes عدد الدقائق (0-59)
 * @returns true إذا كان الوقت الحالي >= الوقت المحدد
 */
export function isCairoTimeAfter(hours: number, minutes: number = 0): boolean {
  const targetTime = hours * 60 + minutes;
  return getCairoTimeInMinutes() >= targetTime;
}

/**
 * التحقق من أننا في منتصف الليل أو بعده مباشرة (12:00 AM)
 * @returns true إذا كان الوقت 12:00 AM أو بعده
 */
export function isCairoAfterMidnight(): boolean {
  return isCairoTimeAfter(0, 0);
}

/**
 * التحقق من أننا بعد الساعة 12:05 صباحاً (لفحص التقارير)
 * @returns true إذا كان الوقت 12:05 AM أو بعده
 */
export function isCairoAfter12_05(): boolean {
  return isCairoTimeAfter(0, 5);
}

/**
 * تحويل string تاريخ عادي إلى كائن Date بتوقيت القاهرة
 * @param dateString بصيغة YYYY-MM-DD
 * @returns كائن Date على منتصف هذا اليوم بتوقيت القاهرة
 */
export function parseCairoDateString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  const cairoDate = new Date(year, month - 1, day, 0, 0, 0, 0);
  // تعديل للتأكد من أننا نعمل مع التوقيت الصحيح
  const localOffset = cairoDate.getTimezoneOffset() * 60 * 1000;
  const utc = cairoDate.getTime() + localOffset;
  const cairoTime = utc + (2 * 60 * 60 * 1000); // UTC+2
  return new Date(cairoTime);
}

/**
 * الحصول على يوم الأسبوع بتوقيت القاهرة
 * 0 = الأحد، 1 = الاثنين، ... ، 6 = السبت
 * @returns رقم يوم الأسبوع (0-6)
 */
export function getCairoDayOfWeek(): number {
  return getCairoNow().getDay();
}

/**
 * التحقق من أن اليوم هو يوم عمل (ليس الخميس أو الجمعة)
 * @param dateDate اختياري: التاريخ المراد فحصه
 * @returns true إذا كان يوم عمل
 */
export function isCairoWorkday(date?: Date): boolean {
  const dayOfWeek = date ? date.getDay() : getCairoDayOfWeek();
  // يوم الخميس = 4، يوم الجمعة = 5
  return ![4, 5].includes(dayOfWeek);
}

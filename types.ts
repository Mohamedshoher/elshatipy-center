








// تقريب المبالغ المالية إلى أقرب 5 جنيهات
export function roundToNearest5(amount: number): number {
  return Math.round(amount / 5) * 5;
}

export interface Group {
  id: string;
  name: string;
  teacherId?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string; // 'director' or Teacher ID
  content: string;
  timestamp: any; // Firestore Timestamp
  read: boolean;
  isPinned?: boolean;
}

export type UserRole = 'director' | 'teacher' | 'supervisor' | 'parent';

export interface ChatUser {
  id: string;
  name: string;
  role: UserRole;
  lastSeen?: any;
  isOnline?: boolean;
  unreadCount?: number;
  description?: string;
  lastMessageTimestamp?: any;
  lastMessageContent?: string;
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface FeePayment {
  month: string; // YYYY-MM
  paid: boolean;
  amount: number; // The fee that was due for the month
  paymentDate?: string;
  amountPaid?: number;
  receiptNumber?: string;
  collectedBy?: string; // Teacher ID
  collectedByName?: string; // Teacher Name
}

export enum TestType {
  NEW = 'new',
  RECENT_PAST = 'recent_past',
  DISTANT_PAST = 'distant_past',
  READING = 'reading',
}

export enum TestGrade {
  EXCELLENT = 'excellent',
  VERY_GOOD = 'very_good',
  GOOD = 'good',
  REPEAT = 'repeat',
}

export interface TestRecord {
  id: string;
  date: string; // YYYY-MM-DD
  suraName: string;
  type: TestType;
  grade: TestGrade;
}

export enum DayOfWeek {
  SUNDAY = 'sunday',
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
}

export interface WeeklySchedule {
  day: DayOfWeek;
  isEnabled: boolean;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface ProgressPlan {
  [TestType.NEW]?: string;
  [TestType.RECENT_PAST]?: string;
  [TestType.DISTANT_PAST]?: string;
}

export interface ProgressPlanRecord {
  id: string;
  date: string; // ISO String
  plan: ProgressPlan;
  isCompleted: boolean;
  authorName: string;
  modifiedBy?: string;
  modifiedDate?: string; // ISO String
}

export interface Badge {
  id: string;
  type: string;
  dateEarned: string; // YYYY-MM-DD
  title: string;
  icon: string;
  description?: string;
  criteria?: string;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  monthlyFee: number;
  joiningDate: string; // YYYY-MM-DD
  groupId: string;
  attendance: AttendanceRecord[];
  fees: FeePayment[];
  tests: TestRecord[];
  schedule?: WeeklySchedule[];
  progressPlan?: ProgressPlan;
  progressPlanHistory?: ProgressPlanRecord[];
  isArchived: boolean;
  archivedBy?: string; // 'director' or teacher's id
  archiveDate?: string; // YYYY-MM-DD
  archivedGroupName?: string; // اسم المجموعة عند الأرشفة (للحفاظ عليه في حال حذف المجموعة)
  isPending?: boolean; // true if waiting for approval
  approvedBy?: string; // 'director' or supervisor's id
  approvalDate?: string; // YYYY-MM-DD
  addedBy?: string; // teacher's id who added the student
  hasDebt?: boolean; // true if student has unpaid fees and attended 10+ sessions
  debtMonths?: string[]; // Array of months (YYYY-MM) with unpaid fees
  lastWeeklyReportDate?: string;
  isOrphan?: boolean; // If true, the student is an orphan
  badges?: Badge[]; // Array of earned badges
}

export enum TeacherStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum PaymentType {
  SALARY = 'salary',      // راتب ثابت
  PARTNERSHIP = 'partnership'  // شراكة بنسبة مئوية
}

export interface Teacher {
  id: string;
  name: string;
  phone: string;
  status: TeacherStatus;
  paymentType?: PaymentType; // نوع المحاسبة (راتب أو شراكة)
  salary?: number; // الراتب الثابت (إذا كان نوع المحاسبة راتب)
  partnershipPercentage?: number; // نسبة الشراكة (إذا كان نوع المحاسبة شراكة)
  password?: string;
}

export type GroupType = 'all' | 'قرآن' | 'نور بيان' | 'تلقين' | 'إقراء' | 'orphans' | 'invalid_phone' | 'with_badges';

export interface Supervisor {
  id: string;
  name: string;
  password: string;
  section: GroupType[]; // Array of sections they supervise
  salary: number;
  phone: string;
  status: TeacherStatus;
}

export interface Parent {
  id: string; // رقم الهاتف الكامل (02 + 14 digits)
  name: string; // اسم ولي الأمر (يتم جلبه من أول طالب له)
  phone: string; // نفس الـ ID
  password: string; // آخر 6 أرقام من رقم الهاتف
  studentIds: string[]; // قائمة بأرقام الطلاب المرتبطين بهذا الرقم
}

export type CurrentUser =
  | { role: 'director' }
  | { role: 'teacher'; id: string; name: string; }
  | { role: 'supervisor'; id: string; name: string; section: GroupType[]; }
  | { role: 'parent'; id: string; name: string; phone: string; studentIds: string[]; };


// NEW TYPES FOR FINANCE MODULE
export enum TeacherAttendanceStatus {
  // Attendance only
  PRESENT = 'present',
  ABSENT = 'absent',

  // Deductions (خصومات)
  DEDUCTION_FULL_DAY = 'deduction_full_day',      // خصم يوم كامل
  DEDUCTION_HALF_DAY = 'deduction_half_day',      // خصم نصف يوم
  DEDUCTION_QUARTER_DAY = 'deduction_quarter_day', // خصم ربع يوم
  MISSING_REPORT = 'missing_report',               // عدم تسليم تقرير (ربع يوم)

  // Bonuses (مكافآت)
  BONUS_DAY = 'bonus_day',                         // مكافأة يوم كامل
  BONUS_HALF_DAY = 'bonus_half_day',               // مكافأة نصف يوم
  BONUS_QUARTER_DAY = 'bonus_quarter_day',         // مكافأة ربع يوم
  EXCUSED = 'excused',                             // معذور (تم حذف الخصم التلقائي)

  // Legacy (for backward compatibility - will be migrated)
  HALF_DAY = 'half_day',
  QUARTER_DAY = 'quarter_day',
}

export interface TeacherAttendanceRecord {
  id: string;
  teacherId: string;
  date: string; // YYYY-MM-DD
  status: TeacherAttendanceStatus;
  reason?: string;
}

export interface TeacherPayrollAdjustment {
  id: string;
  teacherId: string;
  month: string; // YYYY-MM
  bonus: number;
  isPaid: boolean;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  salary: number;
}

export enum ExpenseCategory {
  RENT = 'rent',
  DEVELOPMENT = 'development',
  UTILITIES = 'utilities',
  TEACHER_SALARY = 'teacher_salary',
  TEACHER_BONUS = 'teacher_bonus',
  STAFF_SALARY = 'staff_salary',
  SUPERVISOR_SALARY = 'supervisor_salary',
  OTHER = 'other',
}

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  category: ExpenseCategory;
  description: string;
  amount: number;
}

export interface FinancialSettings {
  workingDaysPerMonth: number;
  absenceDeductionPercentage: number;
  publicHolidays?: string[]; // Array of YYYY-MM-DD
}

// NOTE TYPE
export interface Note {
  id: string;
  studentId: string;
  authorId: string; // 'director' or teacher's id
  authorName: string;
  date: string; // ISO String
  content: string;
  isAcknowledged: boolean;
}

export interface TeacherCollectionRecord {
  id: string;
  teacherId: string;
  month: string; // YYYY-MM
  amount: number;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface TeacherManualBonus {
  id: string;
  teacherId: string;
  month: string; // YYYY-MM
  amount: number;
  date: string; // YYYY-MM-DD
  reason?: string;
  addedBy: string; // 'director' or supervisor's id
}

export interface Donation {
  id: string;
  donorName: string; // اسم المتبرع
  amount: number;
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  notes?: string;
  addedBy: string; // 'director' or supervisor's id
}

// NOTIFICATION TYPE
export interface Notification {
  id: string;
  date: string; // ISO String
  content: string;
  senderName: string; // "المدير"
  target: { type: 'teacher'; id: string } | { type: 'group'; id: string; name: string; };
  readBy: string[]; // Array of teacher IDs who have read it
  deletedBy?: string[]; // Array of teacher IDs who have deleted it
}

// DASHBOARD TYPES
export interface DashboardModule {
  id: 'stats' | 'unpaid' | 'notes' | 'actions';
  title: string;
  visible: boolean;
}

export interface DashboardData {
  dailyAttendance: {
    present: number;
    absent: number;
  };
  unpaidStudentsCount: number;
  unacknowledgedNotesCount: number;
}

// DIRECTOR NOTIFICATION TYPES
export enum DirectorNotificationType {
  TEACHER_ABSENT_REPORT = 'teacher_absent_report',
  TEACHER_NO_TESTS_REPORT = 'teacher_no_tests_report',
  TEACHER_NO_FEES_REPORT = 'teacher_no_fees_report',
}

export interface DirectorNotification {
  id: string;
  date: string; // ISO String for when it was created
  forDate: string; // YYYY-MM-DD date the report was for
  content: string;
  isRead: boolean;
  type: DirectorNotificationType;
  teacherId: string;
  teacherName: string;
  isDeleted?: boolean; // Soft delete flag
}

// LANDING PAGE CONTENT TYPES
export type PageSectionType = 'text' | 'image' | 'video' | 'testimonial' | 'cta' | 'advertisement' | 'slider' | 'youtube_shorts' | 'student_certificates';

export interface SliderImage {
  id: string;
  url: string;
  caption?: string;
  imagePosition?: string;
}

export interface PageSection {
  id: string;                    // معرّف فريد (UUID)
  type: PageSectionType;         // نوع القسم
  order: number;                 // ترتيب العرض (1, 2, 3...)

  // حقول مشتركة
  title: string;                 // عنوان القسم
  description?: string;          // وصف إضافي

  // حقول حسب النوع:
  // نوع "text": نص بسيط
  content?: string;              // محتوى النص

  // نوع "image": صورة واحدة
  imageUrl?: string;             // رابط الصورة (Firebase Storage)
  imageCaption?: string;         // تعليق على الصورة

  // نوع "video": فيديو YouTube
  youtubeUrl?: string;           // رابط الفيديو (https://www.youtube.com/watch?v=...)

  // نوع "testimonial": شهادة عميل
  testimonialText?: string;      // نص الشهادة
  testimonialAuthor?: string;    // اسم صاحب الشهادة
  testimonialRole?: string;      // مسمى وظيفي/أسرة
  testimonialImage?: string;     // صورة الشخص

  // نوع "cta": زر دعوة للعمل
  ctaText?: string;              // نص الزر (مثل: "سجل الآن")
  ctaLink?: string;              // الرابط الذي يذهب إليه الزر
  ctaColor?: 'blue' | 'green' | 'red'; // لون الزر

  // نوع "advertisement": إعلان
  adImageUrl?: string;           // صورة الإعلان
  adLink?: string;               // رابط الإعلان
  adAltText?: string;            // نص بديل

  // نوع "slider": شريط صور متحرّك
  sliderImages?: SliderImage[];  // قائمة الصور في السلايدر
  sliderInterval?: number;       // مدة العرض بالثواني

  // نوع "youtube_shorts": فيديوهات الشورتس
  youtubeShortsUrls?: string[];  // قائمة روابط فيديوهات الشورتس

  imagePosition?: string;        // وضعية الصورة (CSS object-position مثل 'center 20%')

  isActive: boolean;             // هل القسم مفعل أم مخفي؟
  createdAt: string;             // تاريخ الإنشاء
  updatedAt: string;             // آخر تحديث
}

export interface LandingPageContent {
  id: string;                    // معرّف فريد

  // معلومات العنوان والبطل
  heroTitle: string;             // العنوان الرئيسي
  heroSubtitle?: string;         // العنوان الفرعي
  heroImage?: string;            // صورة البطل
  heroImagePosition?: string;    // وضعية صورة البطل (CSS object-position)

  // الأقسام المرنة
  sections: PageSection[];       // قائمة الأقسام

  // حالة النشر
  isPublished: boolean;          // هل المحتوى منشور؟
  publishedAt?: string;          // تاريخ آخر نشر
  publishedBy?: string;          // اسم المدير الذي نشر

  // البيانات الوصفية
  createdAt: string;             // تاريخ الإنشاء
  updatedAt: string;             // آخر تحديث
  updatedBy: string;             // معرّف المدير الذي عدّل
}

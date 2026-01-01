# نظام أولياء الأمور - دليل التنفيذ

## المتطلبات
1. **الحساب:**
   - اسم المستخدم: رقم الهاتف (02 + 14 رقم = 16 رقم إجمالي)
   - كلمة المرور: آخر 6 أرقام من رقم الهاتف
   - لا يُسمح بإنشاء حساب إلا للطلاب الذين لديهم رقم هاتف صحيح (16 رقم يبدأ بـ 02)

2. **الصفحة الخاصة:**
   - عرض جميع الأبناء المسجلين بنفس رقم الهاتف
   - عرض تفاصيل كل طالب:
     - سجل الاختبارات (Read-only)
     - المصروفات (Read-only)
     - الحضور (Read-only)
     - خطة السير (Read-only)
   - إمكانية الدردشة مع:
     - المدرس المسؤول
     - المدير
     - المشرف

## الملفات المُنشأة

### 1. types.ts
- ✅ تم إضافة `Parent` interface
- ✅ تم تحديث `CurrentUser` لدعم role: 'parent'
- ✅ تم تحديث `ChatUser` لدعم parent

### 2. ParentLoginScreen.tsx
- ✅ شاشة تسجيل دخول خاصة بأولياء الأمور
- ✅ التحقق من رقم الهاتف (16 رقم يبدأ بـ 02)
-  ✅ التحقق من كلمة المرور (6 أرقام)

### 3. ParentDashboard.tsx
- ✅ لوحة تحكم تعرض جميع الأبناء
- ✅ إحصائيات لكل طالب (الحضور، الاختبارات، المصروفات)
- ✅ إمكانية الضغط على أي طالب لعرض التفاصيل

### 4. ParentStudentDetails.tsx
- ✅ صفحة تفاصيل الطالب (Read-only)
- ✅ تبويبات: الاختبارات، المصروفات، الحضور، خطة السير
- ✅ عرض جميع البيانات بدون إمكانية التعديل

## التعديلات المطلوبة في App.tsx

### 1. إضافة State لـ Parents
```typescript
const [parents, setParents] = useState<Parent[]>([]);
```

### 2. إضافة Firestore Listener للـ Parents
```typescript
useEffect(() => {
  const unsub = onSnapshot(collection(db, 'parents'), (snapshot) => {
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Parent));
    setParents(data);
  }, (error) => {
    console.error("Error loading parents:", error);
    if (error.code === 'permission-denied') {
      setPermissionError(true);
    }
  });
  return () => unsub();
}, []);
```

### 3. دالة لإنشاء حساب ولي أمر تلقائياً عند حفظ طالب
```typescript
const createParentAccountIfNeeded = async (studentPhone: string, studentName: string, studentId: string) => {
  // التحقق من صحة رقم الهاتف
  if (!studentPhone.startsWith('02') || studentPhone.length !== 16) {
    console.log('رقم الهاتف غير صالح لإنشاء حساب ولي أمر');
    return;
  }

  // التحقق من وجود حساب ولي أمر بهذا الرقم
  const existingParent = parents.find(p => p.phone === studentPhone);
  
  if (existingParent) {
    // تحديث قائمة الطلاب
    if (!existingParent.studentIds.includes(studentId)) {
      await updateDoc(doc(db, 'parents', existingParent.id), {
        studentIds: arrayUnion(studentId)
      });
    }
  } else {
    // إنشاء حساب جديد
    const password = studentPhone.slice(-6); // آخر 6 أرقام
    await addDoc(collection(db, 'parents'), {
      phone: studentPhone,
      name: `ولي أمر ${studentName}`,
      password: password,
      studentIds: [studentId]
    });
  }
};
```

### 4. تحديث دالة handleLogin
```typescript
const handleParentLogin = (phone: string, password: string) => {
  const parent = parents.find(p => p.phone === phone && p.password === password);
  if (parent) {
    setCurrentUser({
      role: 'parent',
      id: parent.id,
      name: parent.name,
      phone: parent.phone,
      studentIds: parent.studentIds
    });
  }
};
```

### 5. تحديث شاشة Login الرئيسية
```typescript
if (!currentUser) {
  // عرض خيارات تسجيل الدخول
  return (
    <div>
      <button onClick={() => setLoginMode('staff')}>تسجيل دخول الموظفين</button>
      <button onClick={() => setLoginMode('parent')}>تسجيل دخول أولياء الأمور</button>
      
      {loginMode === 'staff' && <LocalLoginScreen ... />}
      {loginMode === 'parent' && <ParentLoginScreen onLogin={handleParentLogin} parents={parents} />}
    </div>
  );
}
```

### 6. عرض محتوى ولي الأمر
```typescript
const renderParentContent = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  if (currentUser.role !== 'parent') return null;
  
  // جلب طلاب ولي الأمر
  const parentStudents = students.filter(s => currentUser.studentIds.includes(s.id));
  
  if (selectedStudent) {
    const group = groups.find(g => g.id === selectedStudent.groupId);
    const teacher = teachers.find(t => t.id === group?.teacherId);
    
    return (
      <ParentStudentDetails
        student={selectedStudent}
        group={group}
        teacher={teacher}
        onClose={() => setSelectedStudent(null)}
      />
    );
  }
  
  return (
    <ParentDashboard
      students={parentStudents}
      groups={groups}
      onViewStudent={setSelectedStudent}
      parentPhone={currentUser.phone}
    />
  );
};

// في return الرئيسي
{currentUser.role === 'parent' && renderParentContent()}
```

## قواعد Firestore Security Rules

```javascript
// إضافة قواعد للـ parents collection
match /parents/{parentId} {
  allow read: if request.auth != null;
  allow write: if request.auth.token.role == 'director';
}
```

## الخطوات التالية

1. ✅ تحديث App.tsx بالتعديلات المذكورة أعلاه
2. ⏳ تحديث ChatPage لدعم أولياء الأمور
3. ⏳ تحديث Firestore Security Rules
4. ⏳ اختبار النظام بالكامل
5. ⏳ إضافة ميزة إرسال كلمة المرور عبر WhatsApp (اختياري)

## ملاحظات مهمة

- رقم الهاتف يجب أن يكون 16 رقم (02 + 14 رقم)
- كلمة المرور تُنشأ تلقائياً من آخر 6 أرقام
- ولي الأمر لا يمكنه تعديل أي بيانات - فقط العرض
- يمكن لأكثر من طالب أن يكون لهم نفس رقم الهاتف (نفس ولي الأمر)
- حساب ولي الأمر يُنشأ تلقائياً عند حفظ طالب برقم هاتف صالح

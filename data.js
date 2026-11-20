/**
 * data.js - Seed Data and LocalStorage Management
 * School Attendance & Student Management System (نظام مدرستي الذكي)
 */

const STORAGE_KEYS = {
    STUDENTS: 'madrasti_students_v1',
    ATTENDANCE: 'madrasti_attendance_v1',
    NOTES: 'madrasti_notes_v1',
    EXCUSES: 'madrasti_excuses_v1',
    CURRENT_USER: 'madrasti_user_v1'
};

// Available Classes
const SCHOOL_CLASSES = [
    { id: 'c4a', name: 'الصف الرابع (أ)', grade: 'الرابع الابتدائي', room: 'قاعة 101', teacher: 'أ. عبد الله المنصور' },
    { id: 'c4b', name: 'الصف الرابع (ب)', grade: 'الرابع الابتدائي', room: 'قاعة 102', teacher: 'أ. سارة القحطاني' },
    { id: 'c2a', name: 'الصف الثاني (أ)', grade: 'الثاني الابتدائي', room: 'قاعة 204', teacher: 'أ. محمد العمري' }
];

// Initial Students Seed Data
const INITIAL_STUDENTS = [
    {
        id: 'STD-1001',
        fullName: 'أحمد عبد الله السعيد',
        classId: 'c4a',
        className: 'الصف الرابع (أ)',
        nationalId: '1098452310',
        gender: 'male',
        parentName: 'عبد الله السعيد',
        parentPhone: '0501234567',
        parentEmail: 'parent.ahmed@example.com',
        avatarBg: 'bg-blue-100 text-blue-700',
        emergencyContact: '0501234567'
    },
    {
        id: 'STD-1002',
        fullName: 'سارة محمد الحربي',
        classId: 'c4a',
        className: 'الصف الرابع (أ)',
        nationalId: '1098452311',
        gender: 'female',
        parentName: 'محمد الحربي',
        parentPhone: '0552345678',
        parentEmail: 'parent.sara@example.com',
        avatarBg: 'bg-emerald-100 text-emerald-700',
        emergencyContact: '0552345678'
    },
    {
        id: 'STD-1003',
        fullName: 'فيصل عبد الرحمن الغامدي',
        classId: 'c4a',
        className: 'الصف الرابع (أ)',
        nationalId: '1098452312',
        gender: 'male',
        parentName: 'عبد الرحمن الغامدي',
        parentPhone: '0543456789',
        parentEmail: 'parent.faisal@example.com',
        avatarBg: 'bg-indigo-100 text-indigo-700',
        emergencyContact: '0543456789'
    },
    {
        id: 'STD-1004',
        fullName: 'ريم خالد الدوسري',
        classId: 'c4a',
        className: 'الصف الرابع (أ)',
        nationalId: '1098452313',
        gender: 'female',
        parentName: 'خالد الدوسري',
        parentPhone: '0564567890',
        parentEmail: 'parent.reem@example.com',
        avatarBg: 'bg-pink-100 text-pink-700',
        emergencyContact: '0564567890'
    },
    {
        id: 'STD-1005',
        fullName: 'يوسف إبراهيم الشهري',
        classId: 'c4a',
        className: 'الصف الرابع (أ)',
        nationalId: '1098452314',
        gender: 'male',
        parentName: 'إبراهيم الشهري',
        parentPhone: '0505678901',
        parentEmail: 'parent.yousef@example.com',
        avatarBg: 'bg-amber-100 text-amber-800',
        emergencyContact: '0505678901'
    },
    {
        id: 'STD-1006',
        fullName: 'مريم علي القحطاني',
        classId: 'c4a',
        className: 'الصف الرابع (أ)',
        nationalId: '1098452315',
        gender: 'female',
        parentName: 'علي القحطاني',
        parentPhone: '0556789012',
        parentEmail: 'parent.maryam@example.com',
        avatarBg: 'bg-purple-100 text-purple-700',
        emergencyContact: '0556789012'
    },
    {
        id: 'STD-1007',
        fullName: 'عمر فهد العتيبي',
        classId: 'c4a',
        className: 'الصف الرابع (أ)',
        nationalId: '1098452316',
        gender: 'male',
        parentName: 'فهد العتيبي',
        parentPhone: '0537890123',
        parentEmail: 'parent.omar@example.com',
        avatarBg: 'bg-teal-100 text-teal-700',
        emergencyContact: '0537890123'
    },
    {
        id: 'STD-1008',
        fullName: 'جنى سلطان المطيري',
        classId: 'c4a',
        className: 'الصف الرابع (أ)',
        nationalId: '1098452317',
        gender: 'female',
        parentName: 'سلطان المطيري',
        parentPhone: '0548901234',
        parentEmail: 'parent.jana@example.com',
        avatarBg: 'bg-rose-100 text-rose-700',
        emergencyContact: '0548901234'
    },
    // Class 4B
    {
        id: 'STD-1009',
        fullName: 'زياد طارق المالكي',
        classId: 'c4b',
        className: 'الصف الرابع (ب)',
        nationalId: '1098452318',
        gender: 'male',
        parentName: 'طارق المالكي',
        parentPhone: '0509012345',
        parentEmail: 'parent.zeyad@example.com',
        avatarBg: 'bg-sky-100 text-sky-700',
        emergencyContact: '0509012345'
    },
    {
        id: 'STD-1010',
        fullName: 'ليان ناصر السبيعي',
        classId: 'c4b',
        className: 'الصف الرابع (ب)',
        nationalId: '1098452319',
        gender: 'female',
        parentName: 'ناصر السبيعي',
        parentPhone: '0550123456',
        parentEmail: 'parent.layan@example.com',
        avatarBg: 'bg-violet-100 text-violet-700',
        emergencyContact: '0550123456'
    },
    {
        id: 'STD-1011',
        fullName: 'بدر سعود الشمري',
        classId: 'c4b',
        className: 'الصف الرابع (ب)',
        nationalId: '1098452320',
        gender: 'male',
        parentName: 'سعود الشمري',
        parentPhone: '0531234567',
        parentEmail: 'parent.badr@example.com',
        avatarBg: 'bg-cyan-100 text-cyan-800',
        emergencyContact: '0531234567'
    },
    {
        id: 'STD-1012',
        fullName: 'هند راشد العنزي',
        classId: 'c4b',
        className: 'الصف الرابع (ب)',
        nationalId: '1098452321',
        gender: 'female',
        parentName: 'راشد العنزي',
        parentPhone: '0542345678',
        parentEmail: 'parent.hind@example.com',
        avatarBg: 'bg-fuchsia-100 text-fuchsia-700',
        emergencyContact: '0542345678'
    },
    // Class 2A (Sibling of Ahmed Al-Saeed: Khalid Al-Saeed)
    {
        id: 'STD-1013',
        fullName: 'خالد عبد الله السعيد',
        classId: 'c2a',
        className: 'الصف الثاني (أ)',
        nationalId: '1098452322',
        gender: 'male',
        parentName: 'عبد الله السعيد',
        parentPhone: '0501234567',
        parentEmail: 'parent.ahmed@example.com',
        avatarBg: 'bg-emerald-100 text-emerald-800',
        emergencyContact: '0501234567'
    },
    {
        id: 'STD-1014',
        fullName: 'سلمان ماجد الزهراني',
        classId: 'c2a',
        className: 'الصف الثاني (أ)',
        nationalId: '1098452323',
        gender: 'male',
        parentName: 'ماجد الزهراني',
        parentPhone: '0563456789',
        parentEmail: 'parent.salman@example.com',
        avatarBg: 'bg-blue-100 text-blue-800',
        emergencyContact: '0563456789'
    },
    {
        id: 'STD-1015',
        fullName: 'نوف صالح الخالدي',
        classId: 'c2a',
        className: 'الصف الثاني (أ)',
        nationalId: '1098452324',
        gender: 'female',
        parentName: 'صالح الخالدي',
        parentPhone: '0554567890',
        parentEmail: 'parent.nouf@example.com',
        avatarBg: 'bg-pink-100 text-pink-800',
        emergencyContact: '0554567890'
    },
    {
        id: 'STD-1016',
        fullName: 'عبد العزيز يحيى عسيري',
        classId: 'c2a',
        className: 'الصف الثاني (أ)',
        nationalId: '1098452325',
        gender: 'male',
        parentName: 'يحيى عسيري',
        parentPhone: '0506789012',
        parentEmail: 'parent.abdulaziz@example.com',
        avatarBg: 'bg-indigo-100 text-indigo-800',
        emergencyContact: '0506789012'
    }
];

// Helper to format ISO date string (YYYY-MM-DD)
function getFormattedDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Generate past 20 school days attendance
function generateSeedAttendance() {
    const attendance = {};
    const today = new Date();
    
    // Generate dates for current month up to today
    for (let i = 0; i < 20; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        
        // Skip Friday (5) and Saturday (6) in Arab school week
        const dayOfWeek = d.getDay();
        if (dayOfWeek === 5 || dayOfWeek === 6) continue;
        
        const dateKey = getFormattedDateString(d);
        attendance[dateKey] = {};

        INITIAL_STUDENTS.forEach(student => {
            // Realistic realistic attendance patterns
            // Ahmed: very diligent, rarely absent, 1 late
            if (student.id === 'STD-1001') {
                if (i === 4) attendance[dateKey][student.id] = 'late';
                else if (i === 12) attendance[dateKey][student.id] = 'absent';
                else attendance[dateKey][student.id] = 'present';
            } 
            // Faisal: 2 absences, 2 lates
            else if (student.id === 'STD-1003') {
                if (i === 2 || i === 8) attendance[dateKey][student.id] = 'absent';
                else if (i === 5 || i === 11) attendance[dateKey][student.id] = 'late';
                else attendance[dateKey][student.id] = 'present';
            }
            // Sara: almost 100% present
            else if (student.id === 'STD-1002') {
                if (i === 7) attendance[dateKey][student.id] = 'late';
                else attendance[dateKey][student.id] = 'present';
            }
            // Others random high attendance
            else {
                const rand = (student.id.charCodeAt(6) + i * 7) % 20;
                if (rand === 0) attendance[dateKey][student.id] = 'absent';
                else if (rand === 1) attendance[dateKey][student.id] = 'late';
                else attendance[dateKey][student.id] = 'present';
            }
        });
    }

    return attendance;
}

// Seed Notes and Behavior
const INITIAL_NOTES = [
    {
        id: 'NOTE-101',
        studentId: 'STD-1001',
        studentName: 'أحمد عبد الله السعيد',
        className: 'الصف الرابع (أ)',
        teacherName: 'أ. عبد الله المنصور',
        type: 'positive', // positive, academic, behavior, appreciation
        title: 'تفوق وتألق في مشروع مادة العلوم',
        content: 'أظهر أحمد مهارات استثنائية وتفكيراً علمياً منظماً أثناء تقديم مشروع دورة حياة النبات أمام زملائه. نبارك له هذا الإبداع ونحثه على الاستمرار بنفس العزيمة.',
        timestamp: '2026-11-20T10:15:00',
        formattedDate: 'اليوم، 10:15 صباحاً',
        isRead: false
    },
    {
        id: 'NOTE-102',
        studentId: 'STD-1001',
        studentName: 'أحمد عبد الله السعيد',
        className: 'الصف الرابع (أ)',
        teacherName: 'أ. سامي الحربي (معلم الرياضيات)',
        type: 'academic',
        title: 'الدرجة الكاملة في الاختبار القصير لمادة الرياضيات',
        content: 'حقق الطالب الدرجة الكاملة (20/20) في الاختبار الدوري لوحدة الضرب والقسمة. أداء متميز وحل نموذجي يعكس المتابعة المنزلية الممتازة.',
        timestamp: '2026-11-18T11:45:00',
        formattedDate: '18 نوفمبر 2026',
        isRead: true
    },
    {
        id: 'NOTE-103',
        studentId: 'STD-1001',
        studentName: 'أحمد عبد الله السعيد',
        className: 'الصف الرابع (أ)',
        teacherName: 'أ. عبد الله المنصور',
        type: 'behavior',
        title: 'تنبيه لطيف بشأن إحضار كتاب لغتي بانتظام',
        content: 'نأمل التكرم بمتابعة حقيبة الطالب مساء اليوم للتأكد من إحضار كتاب لغتي الجميلة ودفتر الواجبات الصفية يومياً للاستفادة الكاملة من الحصص.',
        timestamp: '2026-11-15T09:30:00',
        formattedDate: '15 نوفمبر 2026',
        isRead: true
    },
    {
        id: 'NOTE-104',
        studentId: 'STD-1002',
        studentName: 'سارة محمد الحربي',
        className: 'الصف الرابع (أ)',
        teacherName: 'أ. نوال الشمري',
        type: 'appreciation',
        title: 'شكر وتقدير للمشاركة المتميزة في الإذاعة الصباحية',
        content: 'ألقت الطالبة سارة كلمة الإذاعة المدرسية بطلاقة وفصاحة نالت إعجاب الجميع. شكراً لولي الأمر الكريم على تشجيعها الدائم.',
        timestamp: '2026-11-19T08:10:00',
        formattedDate: 'أمس، 08:10 صباحاً',
        isRead: true
    },
    {
        id: 'NOTE-105',
        studentId: 'STD-1003',
        studentName: 'فيصل عبد الرحمن الغامدي',
        className: 'الصف الرابع (أ)',
        teacherName: 'أ. عبد الله المنصور',
        type: 'behavior',
        title: 'ملاحظة حول التأخر عن طابور الصباح',
        content: 'لوحظ تكرار تأخر الطالب فيصل عن الطابور الصباحي خلال هذا الأسبوع. نرجو الحرص على الحضور المبكر لما له من أثر إيجابي على انضباط الطالب.',
        timestamp: '2026-11-19T07:45:00',
        formattedDate: 'أمس، 07:45 صباحاً',
        isRead: false
    },
    {
        id: 'NOTE-106',
        studentId: 'STD-1013',
        studentName: 'خالد عبد الله السعيد',
        className: 'الصف الثاني (أ)',
        teacherName: 'أ. محمد العمري',
        type: 'positive',
        title: 'تحسن ملحوظ في القراءة السريعة بالحركات',
        content: 'خالد يبلي بلاءً حسناً في قراءة النصوص القصيرة بالحركات الثلاث. بارك الله في خطاه ونتمنى له مزيداً من التقدم.',
        timestamp: '2026-11-17T12:00:00',
        formattedDate: '17 نوفمبر 2026',
        isRead: true
    }
];

// Seed Absence Excuses
const INITIAL_EXCUSES = [
    {
        id: 'EXC-201',
        studentId: 'STD-1001',
        studentName: 'أحمد عبد الله السعيد',
        date: '2026-11-08',
        reasonType: 'مرضي',
        reasonDetail: 'مراجعة عيادة الأسنان نظراً لوجود ألم حاد وموعد مسبق في المستشفى التخصصي.',
        status: 'approved', // pending, approved, rejected
        submittedAt: '2026-11-08T08:00:00',
        responseNote: 'تم قبول العذر وحفظه في سجل الحضور المعتمد. نتمنى للابن دوام الصحة والعافية.'
    }
];

// App Data Repository
const SchoolData = {
    // Get all students
    getStudents() {
        const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
        if (!data) {
            localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
            return INITIAL_STUDENTS;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return INITIAL_STUDENTS;
        }
    },

    // Save student list
    saveStudents(students) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    },

    // Add a single new student
    addStudent(studentData) {
        const students = this.getStudents();
        const newId = 'STD-' + (1000 + students.length + 1);
        
        // Random badge background for avatar
        const avatarBgs = [
            'bg-blue-100 text-blue-700',
            'bg-emerald-100 text-emerald-700',
            'bg-indigo-100 text-indigo-700',
            'bg-amber-100 text-amber-800',
            'bg-teal-100 text-teal-700',
            'bg-purple-100 text-purple-700',
            'bg-rose-100 text-rose-700'
        ];
        const randomBg = avatarBgs[Math.floor(Math.random() * avatarBgs.length)];

        const classObj = SCHOOL_CLASSES.find(c => c.id === studentData.classId) || SCHOOL_CLASSES[0];

        const newStudent = {
            id: studentData.id || newId,
            fullName: studentData.fullName,
            classId: studentData.classId,
            className: classObj.name,
            nationalId: studentData.nationalId || ('' + Math.floor(1000000000 + Math.random() * 9000000000)),
            gender: studentData.gender || 'male',
            parentName: studentData.parentName || 'ولي أمر ' + studentData.fullName.split(' ')[0],
            parentPhone: studentData.parentPhone,
            parentEmail: studentData.parentEmail || `parent.${newStudent?.id || newId}@example.com`,
            avatarBg: randomBg,
            emergencyContact: studentData.parentPhone
        };

        students.unshift(newStudent);
        this.saveStudents(students);
        return newStudent;
    },

    // Get attendance map
    getAttendance() {
        const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
        if (!data) {
            const seed = generateSeedAttendance();
            localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(seed));
            return seed;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            const seed = generateSeedAttendance();
            return seed;
        }
    },

    // Save attendance for a specific date
    saveAttendanceForDate(dateKey, records) {
        const attendance = this.getAttendance();
        attendance[dateKey] = {
            ...(attendance[dateKey] || {}),
            ...records
        };
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
        return attendance[dateKey];
    },

    // Get notes
    getNotes() {
        const data = localStorage.getItem(STORAGE_KEYS.NOTES);
        if (!data) {
            localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
            return INITIAL_NOTES;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return INITIAL_NOTES;
        }
    },

    // Add note
    addNote(note) {
        const notes = this.getNotes();
        const now = new Date();
        const newNote = {
            id: 'NOTE-' + Date.now().toString().slice(-5),
            ...note,
            timestamp: now.toISOString(),
            formattedDate: 'اليوم، ' + now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            isRead: false
        };
        notes.unshift(newNote);
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
        return newNote;
    },

    // Mark note as read
    markNoteAsRead(noteId) {
        const notes = this.getNotes();
        const target = notes.find(n => n.id === noteId);
        if (target) {
            target.isRead = true;
            localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
        }
    },

    // Get excuses
    getExcuses() {
        const data = localStorage.getItem(STORAGE_KEYS.EXCUSES);
        if (!data) {
            localStorage.setItem(STORAGE_KEYS.EXCUSES, JSON.stringify(INITIAL_EXCUSES));
            return INITIAL_EXCUSES;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return INITIAL_EXCUSES;
        }
    },

    // Add excuse
    addExcuse(excuse) {
        const excuses = this.getExcuses();
        const now = new Date();
        const newExcuse = {
            id: 'EXC-' + Date.now().toString().slice(-5),
            ...excuse,
            status: 'pending',
            submittedAt: now.toISOString(),
            responseNote: 'قيد المراجعة من قِبل إدارة المدرسة ومسؤول شؤون الطلاب.'
        };
        excuses.unshift(newExcuse);
        localStorage.setItem(STORAGE_KEYS.EXCUSES, JSON.stringify(excuses));
        return newExcuse;
    },

    // Reset all data to factory seed
    resetAll() {
        localStorage.removeItem(STORAGE_KEYS.STUDENTS);
        localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
        localStorage.removeItem(STORAGE_KEYS.NOTES);
        localStorage.removeItem(STORAGE_KEYS.EXCUSES);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        location.reload();
    }
};

window.SchoolData = SchoolData;
window.SCHOOL_CLASSES = SCHOOL_CLASSES;
window.getFormattedDateString = getFormattedDateString;

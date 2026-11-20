/**
 * app.js - School Attendance & Student Management Application Logic
 * Full RTL Arabic Application
 */

// Application State
const AppState = {
    currentUser: null,       // { role: 'teacher'|'parent', name, ... }
    selectedClass: 'c4a',    // 'all' or class id like 'c4a'
    selectedDate: getFormattedDateString(new Date()),
    searchQuery: '',
    currentAttendance: {},   // Map of studentId -> 'present'|'absent'|'late'
    selectedParentChildId: null, // For parent portal
    notesFilter: 'all',
    activeParentTab: 'overview' // 'overview' | 'calendar' | 'notes'
};

// Initialize App on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initEventListeners();
    setupCurrentDateDisplay();
});

// Setup Hijri & Arabic Date in Header
function setupCurrentDateDisplay() {
    const dateElements = document.querySelectorAll('.arabic-current-date');
    const now = new Date();
    
    // Arabic formatted date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formatted = now.toLocaleDateString('ar-SA-u-ca-gregory', options);
    
    dateElements.forEach(el => {
        el.textContent = formatted;
    });
}

// -------------------------------------------------------------
// Authentication & Session
// -------------------------------------------------------------
function initAuth() {
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
        try {
            AppState.currentUser = JSON.parse(savedUser);
            renderAppView();
            return;
        } catch (e) {
            console.error('Failed to parse saved user', e);
        }
    }
    // Default show login screen
    showView('login-view');
}

function loginAsTeacher(teacherName = 'أ. عبد الله المنصور', classId = 'c4a') {
    AppState.currentUser = {
        role: 'teacher',
        name: teacherName,
        email: 'abdullah.almansoor@school.edu.sa',
        assignedClass: classId,
        title: 'معلم الصف الرابع (أ) ورائد النشاط'
    };
    AppState.selectedClass = classId;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(AppState.currentUser));
    renderAppView();
    showToast(`مرحباً بك يا ${AppState.currentUser.name} في لوحة التحكم`, 'success');
}

function loginAsParent(parentPhone = '0501234567', parentName = 'عبد الله السعيد') {
    const allStudents = SchoolData.getStudents();
    const children = allStudents.filter(s => s.parentPhone === parentPhone || s.parentName.includes('السعيد'));
    
    AppState.currentUser = {
        role: 'parent',
        name: parentName,
        phone: parentPhone,
        email: 'parent.ahmed@example.com',
        childrenIds: children.map(c => c.id)
    };
    
    if (children.length > 0) {
        AppState.selectedParentChildId = children[0].id;
    }

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(AppState.currentUser));
    renderAppView();
    showToast(`أهلاً بك يا ${AppState.currentUser.name} في بوابة أولياء الأمور`, 'success');
}

function logout() {
    AppState.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    showView('login-view');
    showToast('تم تسجيل الخروج بنجاح', 'info');
}

function switchRole() {
    if (AppState.currentUser && AppState.currentUser.role === 'teacher') {
        loginAsParent();
    } else {
        loginAsTeacher();
    }
}

// Show specific view container
function showView(viewId) {
    const views = ['login-view', 'teacher-dashboard-view', 'parent-portal-view'];
    views.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === viewId) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });

    const topHeader = document.getElementById('main-app-header');
    if (topHeader) {
        if (viewId === 'login-view') {
            topHeader.classList.add('hidden');
        } else {
            topHeader.classList.remove('hidden');
        }
    }
}

function renderAppView() {
    if (!AppState.currentUser) {
        showView('login-view');
        return;
    }

    updateHeaderUserInfo();

    if (AppState.currentUser.role === 'teacher') {
        showView('teacher-dashboard-view');
        renderTeacherDashboard();
    } else if (AppState.currentUser.role === 'parent') {
        showView('parent-portal-view');
        renderParentPortal();
    }
}

function updateHeaderUserInfo() {
    const userNameEl = document.getElementById('header-user-name');
    const userRoleBadge = document.getElementById('header-user-role');
    const switchRoleBtnText = document.getElementById('switch-role-btn-text');

    if (userNameEl && AppState.currentUser) {
        userNameEl.textContent = AppState.currentUser.name;
    }

    if (userRoleBadge && AppState.currentUser) {
        if (AppState.currentUser.role === 'teacher') {
            userRoleBadge.textContent = 'معلم / إدارة';
            userRoleBadge.className = 'text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-100 text-blue-800 border border-blue-200';
            if (switchRoleBtnText) switchRoleBtnText.textContent = 'معاينة بوابة ولي الأمر';
        } else {
            userRoleBadge.textContent = 'ولي أمر';
            userRoleBadge.className = 'text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200';
            if (switchRoleBtnText) switchRoleBtnText.textContent = 'العودة للوحة المعلم';
        }
    }
}

// -------------------------------------------------------------
// Teacher Dashboard Logic
// -------------------------------------------------------------
function renderTeacherDashboard() {
    // Sync date selector input
    const dateInput = document.getElementById('attendance-date-picker');
    if (dateInput) {
        dateInput.value = AppState.selectedDate;
    }

    // Load attendance records for current selected date
    const allAttendance = SchoolData.getAttendance();
    AppState.currentAttendance = { ...(allAttendance[AppState.selectedDate] || {}) };

    // Render classes dropdown selector
    renderClassFilterDropdown();

    // Render student table & quick stats
    renderAttendanceList();
    renderQuickStats();

    // Render Student dropdown in Note Modal
    populateNoteStudentDropdown();

    // Render Notes Feed in Teacher view
    renderTeacherNotesFeed();
}

function renderClassFilterDropdown() {
    const classSelect = document.getElementById('class-filter-select');
    if (!classSelect) return;

    classSelect.innerHTML = `
        <option value="all" ${AppState.selectedClass === 'all' ? 'selected' : ''}>جميع الفصول المتاحة</option>
        ${SCHOOL_CLASSES.map(c => `
            <option value="${c.id}" ${AppState.selectedClass === c.id ? 'selected' : ''}>${c.name} - ${c.teacher}</option>
        `).join('')}
    `;
}

function getFilteredStudents() {
    const students = SchoolData.getStudents();
    return students.filter(student => {
        // Class filter
        const matchClass = AppState.selectedClass === 'all' || student.classId === AppState.selectedClass;
        
        // Search filter
        const query = AppState.searchQuery.trim().toLowerCase();
        const matchSearch = !query || 
            student.fullName.toLowerCase().includes(query) || 
            student.id.toLowerCase().includes(query) ||
            student.parentPhone.includes(query);

        return matchClass && matchSearch;
    });
}

function renderQuickStats() {
    const filteredStudents = getFilteredStudents();
    const total = filteredStudents.length;

    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let unrecordedCount = 0;

    filteredStudents.forEach(st => {
        const status = AppState.currentAttendance[st.id];
        if (status === 'present') presentCount++;
        else if (status === 'absent') absentCount++;
        else if (status === 'late') lateCount++;
        else unrecordedCount++;
    });

    const recordedTotal = presentCount + absentCount + lateCount;
    const attendanceRate = total > 0 ? Math.round(((presentCount + (lateCount * 0.5)) / total) * 100) : 0;

    // Update DOM counters
    const totalEl = document.getElementById('stat-total-students');
    const presentEl = document.getElementById('stat-present-count');
    const absentEl = document.getElementById('stat-absent-count');
    const lateEl = document.getElementById('stat-late-count');
    const rateEl = document.getElementById('stat-attendance-rate');
    const progressBar = document.getElementById('stat-rate-progress-bar');

    if (totalEl) totalEl.textContent = total;
    if (presentEl) presentEl.textContent = presentCount;
    if (absentEl) absentEl.textContent = absentCount;
    if (lateEl) lateEl.textContent = lateCount;
    if (rateEl) rateEl.textContent = `${attendanceRate}%`;
    if (progressBar) progressBar.style.width = `${attendanceRate}%`;

    // Print summary elements
    const printDate = document.getElementById('print-date-display');
    const printClass = document.getElementById('print-class-display');
    const printRate = document.getElementById('print-rate-display');
    if (printDate) printDate.textContent = AppState.selectedDate;
    if (printClass) {
        const cls = SCHOOL_CLASSES.find(c => c.id === AppState.selectedClass);
        printClass.textContent = cls ? cls.name : 'جميع الفصول';
    }
    if (printRate) printRate.textContent = `${attendanceRate}%`;
}

function renderAttendanceList() {
    const container = document.getElementById('attendance-table-body');
    const mobileContainer = document.getElementById('attendance-mobile-cards');
    if (!container) return;

    const students = getFilteredStudents();

    if (students.length === 0) {
        const emptyState = `
            <tr>
                <td colspan="5" class="py-12 text-center text-slate-500">
                    <div class="flex flex-col items-center justify-center">
                        <i class="fa-solid fa-user-slash text-4xl text-slate-300 mb-3"></i>
                        <p class="font-medium text-slate-600">لم يتم العثور على طلاب مطابقين للبحث أو الفصل المحدد</p>
                        <p class="text-sm text-slate-400 mt-1">تأكد من اختيار الفصل أو قم بإضافة طالب جديد</p>
                    </div>
                </td>
            </tr>
        `;
        container.innerHTML = emptyState;
        if (mobileContainer) mobileContainer.innerHTML = emptyState;
        return;
    }

    // Desktop Table Rows
    const rowsHtml = students.map((student, idx) => {
        const currentStatus = AppState.currentAttendance[student.id] || null;
        const initials = student.fullName.split(' ').slice(0, 2).map(n => n[0]).join(' ');

        return `
            <tr class="hover:bg-slate-50/70 border-b border-slate-100 transition-colors ${currentStatus === 'absent' ? 'bg-rose-50/20' : ''}">
                <!-- # & Student Info -->
                <td class="py-3.5 px-4">
                    <div class="flex items-center gap-3">
                        <span class="text-xs font-semibold text-slate-400 w-5">${idx + 1}</span>
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${student.avatarBg} shadow-sm shrink-0">
                            ${initials}
                        </div>
                        <div>
                            <div class="font-bold text-slate-900 flex items-center gap-2">
                                <span>${student.fullName}</span>
                                ${student.gender === 'female' ? '<span class="text-xs text-pink-500" title="طالبة">●</span>' : ''}
                            </div>
                            <div class="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                <span class="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">${student.id}</span>
                                <span>•</span>
                                <span>${student.className}</span>
                            </div>
                        </div>
                    </div>
                </td>

                <!-- Parent Contact -->
                <td class="py-3.5 px-4 hidden md:table-cell">
                    <div class="text-sm text-slate-700 font-medium">${student.parentName}</div>
                    <div class="flex items-center gap-2 mt-1">
                        <a href="tel:${student.parentPhone}" class="text-xs text-slate-500 hover:text-sky-600 flex items-center gap-1 bg-slate-100 hover:bg-sky-50 px-2 py-0.5 rounded transition">
                            <i class="fa-solid fa-phone text-[10px]"></i>
                            <span dir="ltr">${student.parentPhone}</span>
                        </a>
                        <a href="https://wa.me/966${student.parentPhone.replace(/^0/, '')}" target="_blank" class="text-emerald-600 hover:text-emerald-700 text-xs px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 transition" title="مراسلة واتساب">
                            <i class="fa-brands fa-whatsapp"></i>
                        </a>
                    </div>
                </td>

                <!-- Current Status Badge -->
                <td class="py-3.5 px-4 text-center">
                    ${getStatusBadge(currentStatus)}
                </td>

                <!-- Fast Action Toggle Buttons -->
                <td class="py-3.5 px-4 action-buttons-cell">
                    <div class="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200/80 gap-1">
                        <button type="button" 
                            onclick="setStudentStatus('${student.id}', 'present')" 
                            class="btn-status btn-status-present px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${currentStatus === 'present' ? 'active' : 'text-slate-600 hover:bg-white'}">
                            <i class="fa-solid fa-check text-xs"></i>
                            <span>حاضر</span>
                        </button>
                        <button type="button" 
                            onclick="setStudentStatus('${student.id}', 'late')" 
                            class="btn-status btn-status-late px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${currentStatus === 'late' ? 'active' : 'text-slate-600 hover:bg-white'}">
                            <i class="fa-regular fa-clock text-xs"></i>
                            <span>متأخر</span>
                        </button>
                        <button type="button" 
                            onclick="setStudentStatus('${student.id}', 'absent')" 
                            class="btn-status btn-status-absent px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${currentStatus === 'absent' ? 'active' : 'text-slate-600 hover:bg-white'}">
                            <i class="fa-solid fa-xmark text-xs"></i>
                            <span>غائب</span>
                        </button>
                    </div>
                </td>

                <!-- Quick Actions (Note / Details) -->
                <td class="py-3.5 px-4 text-left action-buttons-cell">
                    <button type="button" 
                        onclick="openNoteModalForStudent('${student.id}')"
                        class="p-2 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition" 
                        title="إضافة ملاحظة سلوكية أو دراسية">
                        <i class="fa-regular fa-comment-dots text-base"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    container.innerHTML = rowsHtml;

    // Mobile Cards View
    if (mobileContainer) {
        mobileContainer.innerHTML = students.map((student, idx) => {
            const currentStatus = AppState.currentAttendance[student.id] || null;
            const initials = student.fullName.split(' ').slice(0, 2).map(n => n[0]).join(' ');

            return `
                <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-3">
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex items-center gap-2.5">
                            <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${student.avatarBg} shrink-0">
                                ${initials}
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900 text-sm">${student.fullName}</h4>
                                <span class="text-xs text-slate-400 font-mono">${student.id} • ${student.className}</span>
                            </div>
                        </div>
                        <div>${getStatusBadge(currentStatus)}</div>
                    </div>

                    <div class="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100">
                        <button type="button" 
                            onclick="setStudentStatus('${student.id}', 'present')" 
                            class="btn-status btn-status-present py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${currentStatus === 'present' ? 'active' : 'bg-slate-100 text-slate-700'}">
                            <i class="fa-solid fa-check"></i>
                            <span>حاضر</span>
                        </button>
                        <button type="button" 
                            onclick="setStudentStatus('${student.id}', 'late')" 
                            class="btn-status btn-status-late py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${currentStatus === 'late' ? 'active' : 'bg-slate-100 text-slate-700'}">
                            <i class="fa-regular fa-clock"></i>
                            <span>متأخر</span>
                        </button>
                        <button type="button" 
                            onclick="setStudentStatus('${student.id}', 'absent')" 
                            class="btn-status btn-status-absent py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${currentStatus === 'absent' ? 'active' : 'bg-slate-100 text-slate-700'}">
                            <i class="fa-solid fa-xmark"></i>
                            <span>غائب</span>
                        </button>
                    </div>

                    <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
                        <span class="flex items-center gap-1">
                            <i class="fa-solid fa-phone text-slate-400"></i>
                            <span dir="ltr">${student.parentPhone}</span>
                        </span>
                        <button type="button" onclick="openNoteModalForStudent('${student.id}')" class="text-sky-600 font-medium hover:underline flex items-center gap-1">
                            <i class="fa-regular fa-comment-dots"></i>
                            <span>ملاحظة</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function getStatusBadge(status) {
    if (status === 'present') {
        return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold badge-present">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>حاضر</span>
        </span>`;
    } else if (status === 'absent') {
        return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold badge-absent">
            <span class="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>غائب</span>
        </span>`;
    } else if (status === 'late') {
        return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold badge-late">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>متأخر</span>
        </span>`;
    }
    return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium badge-unrecorded">
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        <span>لم يُرصد بعد</span>
    </span>`;
}

function setStudentStatus(studentId, status) {
    AppState.currentAttendance[studentId] = status;
    renderAttendanceList();
    renderQuickStats();
}

function markAllFiltered(status) {
    const students = getFilteredStudents();
    students.forEach(st => {
        AppState.currentAttendance[st.id] = status;
    });
    renderAttendanceList();
    renderQuickStats();

    const arabicStatus = status === 'present' ? 'حاضر' : (status === 'absent' ? 'غائب' : 'متأخر');
    showToast(`تم تحديد جميع الطلاب المعروضين (${students.length}) كـ "${arabicStatus}"`, 'info');
}

function clearAllFiltered() {
    const students = getFilteredStudents();
    students.forEach(st => {
        delete AppState.currentAttendance[st.id];
    });
    renderAttendanceList();
    renderQuickStats();
    showToast('تم تفريغ تحديد حضور الطلاب المعروضين', 'info');
}

function saveAttendance() {
    SchoolData.saveAttendanceForDate(AppState.selectedDate, AppState.currentAttendance);
    
    // Animate save button feedback
    const saveBtn = document.getElementById('save-attendance-btn');
    if (saveBtn) {
        const originalHtml = saveBtn.innerHTML;
        saveBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>تم الحفظ بنجاح!</span>`;
        saveBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
        saveBtn.classList.add('bg-slate-800');
        setTimeout(() => {
            saveBtn.innerHTML = originalHtml;
            saveBtn.classList.remove('bg-slate-800');
            saveBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
        }, 1800);
    }

    const recordedCount = Object.keys(AppState.currentAttendance).length;
    showToast(`تم اعتماد وحفظ سجل الحضور ليوم (${AppState.selectedDate}) بإجمالي ${recordedCount} طالب`, 'success');
}

// -------------------------------------------------------------
// Add New Student Modal
// -------------------------------------------------------------
function openAddStudentModal() {
    const modal = document.getElementById('add-student-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.getElementById('new-student-name')?.focus();
    }
}

function closeAddStudentModal() {
    const modal = document.getElementById('add-student-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.getElementById('add-student-form')?.reset();
    }
}

function handleAddStudentForm(e) {
    e.preventDefault();
    const fullName = document.getElementById('new-student-name').value.trim();
    const classId = document.getElementById('new-student-class').value;
    const nationalId = document.getElementById('new-student-nid').value.trim();
    const parentPhone = document.getElementById('new-student-phone').value.trim();
    const parentEmail = document.getElementById('new-student-email').value.trim();
    const parentName = document.getElementById('new-student-parent-name').value.trim();
    const gender = document.querySelector('input[name="new-student-gender"]:checked')?.value || 'male';

    if (!fullName || !parentPhone) {
        showToast('يرجى كتابة اسم الطالب ورقم هاتف ولي الأمر بشكل صحيح', 'warning');
        return;
    }

    const newStudent = SchoolData.addStudent({
        fullName,
        classId,
        nationalId,
        parentPhone,
        parentEmail,
        parentName,
        gender
    });

    closeAddStudentModal();
    renderTeacherDashboard();
    showToast(`تمت إضافة الطالب (${newStudent.fullName}) بنجاح إلى النظام`, 'success');
}

// -------------------------------------------------------------
// Student Notes & Behavior
// -------------------------------------------------------------
function populateNoteStudentDropdown() {
    const select = document.getElementById('note-student-select');
    if (!select) return;

    const students = SchoolData.getStudents();
    select.innerHTML = `
        <option value="">-- اختر طالباً لكتابة ملاحظة له --</option>
        ${students.map(s => `
            <option value="${s.id}">${s.fullName} (${s.className}) - رقم القيد: ${s.id}</option>
        `).join('')}
    `;
}

function openNoteModalForStudent(studentId) {
    const modal = document.getElementById('add-note-modal');
    if (!modal) return;
    
    populateNoteStudentDropdown();
    const select = document.getElementById('note-student-select');
    if (select && studentId) {
        select.value = studentId;
    }
    
    modal.classList.remove('hidden');
    document.getElementById('note-title-input')?.focus();
}

function closeNoteModal() {
    const modal = document.getElementById('add-note-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.getElementById('add-note-form')?.reset();
    }
}

function handleAddNoteForm(e) {
    e.preventDefault();
    const studentId = document.getElementById('note-student-select').value;
    const type = document.getElementById('note-type-select').value;
    const title = document.getElementById('note-title-input').value.trim();
    const content = document.getElementById('note-content-input').value.trim();

    if (!studentId || !title || !content) {
        showToast('يرجى تحديد الطالب وعنوان الملاحظة ومحتواها', 'warning');
        return;
    }

    const student = SchoolData.getStudents().find(s => s.id === studentId);
    if (!student) return;

    SchoolData.addNote({
        studentId: student.id,
        studentName: student.fullName,
        className: student.className,
        teacherName: AppState.currentUser?.name || 'معلم الفصل',
        type,
        title,
        content
    });

    closeNoteModal();
    renderTeacherNotesFeed();
    showToast(`تم إرسال الملاحظة لولي أمر الطالب (${student.fullName}) بنجاح`, 'success');
}

function renderTeacherNotesFeed() {
    const container = document.getElementById('teacher-notes-feed-container');
    if (!container) return;

    const allNotes = SchoolData.getNotes();
    const filter = AppState.notesFilter;

    const filtered = allNotes.filter(n => {
        if (filter === 'all') return true;
        return n.type === filter;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-slate-400">
                <i class="fa-regular fa-clipboard text-3xl mb-2"></i>
                <p>لا توجد ملاحظات مسجلة ضمن هذا التصنيف</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(note => {
        const typeConfig = getNoteTypeConfig(note.type);
        return `
            <div class="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition shadow-xs flex flex-col gap-2">
                <div class="flex items-center justify-between gap-2">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${typeConfig.badgeClass}">
                        <i class="${typeConfig.icon}"></i>
                        <span>${typeConfig.label}</span>
                    </span>
                    <span class="text-xs text-slate-400">${note.formattedDate}</span>
                </div>
                <div>
                    <h5 class="font-bold text-slate-900 text-sm">${note.title}</h5>
                    <p class="text-xs text-slate-600 mt-1 leading-relaxed">${note.content}</p>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span class="font-medium text-slate-800">
                        <i class="fa-solid fa-graduation-cap text-sky-600 ml-1"></i>
                        <span>الطالب: ${note.studentName}</span>
                    </span>
                    <span>${note.teacherName}</span>
                </div>
            </div>
        `;
    }).join('');
}

function getNoteTypeConfig(type) {
    switch (type) {
        case 'positive':
            return {
                label: 'إيجابي وتفوق',
                icon: 'fa-solid fa-star',
                badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            };
        case 'academic':
            return {
                label: 'متابعة دراسية',
                icon: 'fa-solid fa-book-open',
                badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200'
            };
        case 'behavior':
            return {
                label: 'تنبيه سلوكي',
                icon: 'fa-solid fa-triangle-exclamation',
                badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200'
            };
        case 'appreciation':
            return {
                label: 'شكر وتقدير',
                icon: 'fa-solid fa-award',
                badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200'
            };
        default:
            return {
                label: 'ملاحظة عامة',
                icon: 'fa-regular fa-comment',
                badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200'
            };
    }
}

// -------------------------------------------------------------
// Parent Portal Logic
// -------------------------------------------------------------
function renderParentPortal() {
    const parent = AppState.currentUser;
    if (!parent) return;

    const allStudents = SchoolData.getStudents();
    const children = allStudents.filter(s => {
        if (parent.childrenIds && parent.childrenIds.includes(s.id)) return true;
        if (parent.phone && s.parentPhone === parent.phone) return true;
        return false;
    });

    // If no specific child selected, select the first
    if (!AppState.selectedParentChildId && children.length > 0) {
        AppState.selectedParentChildId = children[0].id;
    }

    // Render Children Tabs
    renderParentChildrenSelector(children);

    const activeChild = allStudents.find(s => s.id === AppState.selectedParentChildId) || children[0];
    if (!activeChild) return;

    renderParentChildOverview(activeChild);
    renderParentAttendanceCalendar(activeChild);
    renderParentAttendanceHistoryTable(activeChild);
    renderParentNotesFeed(activeChild);
    renderParentExcusesList(activeChild);
}

function renderParentChildrenSelector(children) {
    const container = document.getElementById('parent-children-tabs');
    if (!container) return;

    if (children.length <= 1) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <div class="flex items-center gap-2 overflow-x-auto pb-1">
            <span class="text-xs font-bold text-slate-400 shrink-0">اختر الابن:</span>
            ${children.map(child => {
                const isActive = child.id === AppState.selectedParentChildId;
                return `
                    <button type="button" 
                        onclick="selectParentChild('${child.id}')"
                        class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                            isActive 
                            ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20' 
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }">
                        <i class="fa-solid fa-child-reaching text-sm"></i>
                        <span>${child.fullName}</span>
                        <span class="opacity-70 text-[10px]">(${child.className})</span>
                    </button>
                `;
            }).join('')}
        </div>
    `;
}

function selectParentChild(childId) {
    AppState.selectedParentChildId = childId;
    renderParentPortal();
}

function renderParentChildOverview(child) {
    // Child info card
    const nameEl = document.getElementById('parent-child-name');
    const classEl = document.getElementById('parent-child-class');
    const idEl = document.getElementById('parent-child-id');
    const avatarEl = document.getElementById('parent-child-avatar');

    if (nameEl) nameEl.textContent = child.fullName;
    if (classEl) classEl.textContent = child.className;
    if (idEl) idEl.textContent = child.id;
    if (avatarEl) {
        avatarEl.className = `w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${child.avatarBg} shadow-sm`;
        avatarEl.textContent = child.fullName.split(' ').slice(0, 2).map(n => n[0]).join(' ');
    }

    // Calculate attendance stats for this child across all recorded days
    const allAttendance = SchoolData.getAttendance();
    let totalRecordedDays = 0;
    let presentDays = 0;
    let absentDays = 0;
    let lateDays = 0;

    Object.keys(allAttendance).forEach(dateKey => {
        const status = allAttendance[dateKey][child.id];
        if (status) {
            totalRecordedDays++;
            if (status === 'present') presentDays++;
            else if (status === 'absent') absentDays++;
            else if (status === 'late') lateDays++;
        }
    });

    const attendanceRate = totalRecordedDays > 0 ? Math.round(((presentDays + (lateDays * 0.5)) / totalRecordedDays) * 100) : 100;

    document.getElementById('child-rate-val').textContent = `${attendanceRate}%`;
    document.getElementById('child-present-val').textContent = presentDays;
    document.getElementById('child-absent-val').textContent = absentDays;
    document.getElementById('child-late-val').textContent = lateDays;
    
    const rateBar = document.getElementById('child-rate-bar');
    if (rateBar) rateBar.style.width = `${attendanceRate}%`;
}

// Generate interactive monthly attendance calendar
function renderParentAttendanceCalendar(child) {
    const calendarContainer = document.getElementById('parent-calendar-grid');
    if (!calendarContainer) return;

    const allAttendance = SchoolData.getAttendance();
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // Current month (0-indexed)

    // Number of days in current month
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarBoxes = [];

    for (let day = 1; day <= totalDaysInMonth; day++) {
        const dateObj = new Date(year, month, day);
        const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Friday & Saturday in Arabic schools
        const isFuture = dateObj > today;
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        let status = null;
        if (!isWeekend && !isFuture && allAttendance[dateKey]) {
            status = allAttendance[dateKey][child.id] || 'present'; // Default seed fallback
        }

        let bgClass = 'bg-white border-slate-200 text-slate-800';
        let badgeHtml = '';
        let statusText = 'يوم دراسي';

        if (isWeekend) {
            bgClass = 'bg-slate-50 border-slate-100 text-slate-300';
            statusText = 'عطلة أسبوعية';
        } else if (isFuture) {
            bgClass = 'bg-slate-50/50 border-dashed border-slate-200 text-slate-400';
            statusText = 'قادم';
        } else if (status === 'present') {
            bgClass = 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-bold';
            badgeHtml = '<span class="calendar-dot bg-emerald-500" title="حاضر"></span>';
            statusText = 'حاضر';
        } else if (status === 'absent') {
            bgClass = 'bg-rose-50 border-rose-200 text-rose-900 font-bold';
            badgeHtml = '<span class="calendar-dot bg-rose-500 animate-pulse" title="غائب"></span>';
            statusText = 'غائب';
        } else if (status === 'late') {
            bgClass = 'bg-amber-50 border-amber-200 text-amber-900 font-bold';
            badgeHtml = '<span class="calendar-dot bg-amber-500" title="متأخر"></span>';
            statusText = 'متأخر';
        }

        calendarBoxes.push(`
            <div class="calendar-day-box border ${bgClass} p-1 text-center group relative cursor-pointer"
                 title="${dateKey}: ${statusText}">
                <span class="text-xs leading-none">${day}</span>
                ${badgeHtml}
            </div>
        `);
    }

    calendarContainer.innerHTML = calendarBoxes.join('');

    // Calendar month header display
    const monthHeader = document.getElementById('calendar-month-name');
    if (monthHeader) {
        monthHeader.textContent = today.toLocaleDateString('ar-SA-u-ca-gregory', { month: 'long', year: 'numeric' });
    }
}

function renderParentAttendanceHistoryTable(child) {
    const tableBody = document.getElementById('parent-history-table-body');
    if (!tableBody) return;

    const allAttendance = SchoolData.getAttendance();
    const excuses = SchoolData.getExcuses().filter(e => e.studentId === child.id);

    // Sort dates descending
    const sortedDates = Object.keys(allAttendance).sort().reverse().slice(0, 15);

    if (sortedDates.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-6 text-slate-400">لا توجد سجلات حضور مسجلة بعد</td></tr>`;
        return;
    }

    tableBody.innerHTML = sortedDates.map(dateKey => {
        const status = allAttendance[dateKey][child.id] || 'present';
        const dateObj = new Date(dateKey + 'T00:00:00');
        const dayName = dateObj.toLocaleDateString('ar-SA', { weekday: 'long' });
        
        // Find if there is an excuse for this date
        const matchExcuse = excuses.find(e => e.date === dateKey);

        let excuseBadge = `<span class="text-xs text-slate-400">-</span>`;
        if (status === 'absent') {
            if (matchExcuse) {
                if (matchExcuse.status === 'approved') {
                    excuseBadge = `<span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">عذر مقبول: ${matchExcuse.reasonType}</span>`;
                } else {
                    excuseBadge = `<span class="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">عذر قيد المراجعة</span>`;
                }
            } else {
                excuseBadge = `<button type="button" onclick="openExcuseModalWithDate('${dateKey}')" class="text-xs px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold border border-rose-200 transition">تقديم عذر</button>`;
            }
        }

        return `
            <tr class="border-b border-slate-100 hover:bg-slate-50/60 transition">
                <td class="py-3 px-4 font-bold text-slate-800 text-sm">${dayName}</td>
                <td class="py-3 px-4 font-mono text-xs text-slate-500">${dateKey}</td>
                <td class="py-3 px-4">${getStatusBadge(status)}</td>
                <td class="py-3 px-4">${excuseBadge}</td>
            </tr>
        `;
    }).join('');
}

function renderParentNotesFeed(child) {
    const feedContainer = document.getElementById('parent-notes-feed');
    if (!feedContainer) return;

    const allNotes = SchoolData.getNotes().filter(n => n.studentId === child.id);

    if (allNotes.length === 0) {
        feedContainer.innerHTML = `
            <div class="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100 p-6">
                <i class="fa-regular fa-comment-smile text-4xl text-sky-300 mb-3"></i>
                <h4 class="font-bold text-slate-700">لا توجد ملاحظات مرسلة حتى الآن</h4>
                <p class="text-xs text-slate-400 mt-1">سوف تظهر هنا أي إشعارات أو ملاحظات دراسية وسلوكية يرسلها المعلمون بخصوص ${child.fullName}</p>
            </div>
        `;
        return;
    }

    feedContainer.innerHTML = allNotes.map(note => {
        const typeConfig = getNoteTypeConfig(note.type);
        return `
            <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col gap-3 relative overflow-hidden">
                <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-2">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${typeConfig.badgeClass}">
                            <i class="${typeConfig.icon}"></i>
                            <span>${typeConfig.label}</span>
                        </span>
                        ${!note.isRead ? '<span class="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">جديد</span>' : ''}
                    </div>
                    <span class="text-xs text-slate-400">${note.formattedDate}</span>
                </div>

                <div>
                    <h4 class="font-bold text-slate-900 text-base leading-snug">${note.title}</h4>
                    <p class="text-sm text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">${note.content}</p>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div class="flex items-center gap-2 text-slate-600">
                        <i class="fa-solid fa-chalkboard-user text-sky-600"></i>
                        <span>المرسل: <strong class="text-slate-800">${note.teacherName}</strong></span>
                    </div>

                    ${note.isRead ? `
                        <span class="text-emerald-600 flex items-center gap-1 font-semibold text-xs">
                            <i class="fa-solid fa-check-double"></i>
                            <span>تم الاطلاع</span>
                        </span>
                    ` : `
                        <button type="button" 
                            onclick="acknowledgeNote('${note.id}')"
                            class="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold transition flex items-center gap-1">
                            <i class="fa-regular fa-eye"></i>
                            <span>تأكيد الاطلاع</span>
                        </button>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

function acknowledgeNote(noteId) {
    SchoolData.markNoteAsRead(noteId);
    const activeChild = SchoolData.getStudents().find(s => s.id === AppState.selectedParentChildId);
    if (activeChild) {
        renderParentNotesFeed(activeChild);
    }
    showToast('تم تأكيد اطلاعك على الملاحظة وإشعار إدارة المدرسة', 'success');
}

function renderParentExcusesList(child) {
    const container = document.getElementById('parent-excuses-container');
    if (!container) return;

    const excuses = SchoolData.getExcuses().filter(e => e.studentId === child.id);

    if (excuses.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-400 py-3 text-center">لا توجد طلبات أعذار سابقة</p>`;
        return;
    }

    container.innerHTML = excuses.map(excuse => {
        let statusBadge = `<span class="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">قيد المراجعة</span>`;
        if (excuse.status === 'approved') {
            statusBadge = `<span class="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">مقبول</span>`;
        } else if (excuse.status === 'rejected') {
            statusBadge = `<span class="bg-rose-100 text-rose-800 text-xs px-2.5 py-0.5 rounded-full font-bold">مرفوض</span>`;
        }

        return `
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-800">عذر غياب: ${excuse.reasonType}</span>
                    ${statusBadge}
                </div>
                <div class="text-slate-500 font-mono">تاريخ الغياب: ${excuse.date}</div>
                <div class="text-slate-600">${excuse.reasonDetail}</div>
                ${excuse.responseNote ? `<div class="text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200/60 mt-1">رد الإدارة: ${excuse.responseNote}</div>` : ''}
            </div>
        `;
    }).join('');
}

// -------------------------------------------------------------
// Absence Excuse Modal
// -------------------------------------------------------------
function openExcuseModalWithDate(date) {
    const modal = document.getElementById('submit-excuse-modal');
    if (modal) {
        modal.classList.remove('hidden');
        if (date) {
            document.getElementById('excuse-date-input').value = date;
        }
    }
}

function closeExcuseModal() {
    const modal = document.getElementById('submit-excuse-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.getElementById('submit-excuse-form')?.reset();
    }
}

function handleSubmitExcuseForm(e) {
    e.preventDefault();
    const activeChild = SchoolData.getStudents().find(s => s.id === AppState.selectedParentChildId);
    if (!activeChild) return;

    const date = document.getElementById('excuse-date-input').value;
    const reasonType = document.getElementById('excuse-type-select').value;
    const reasonDetail = document.getElementById('excuse-detail-input').value.trim();

    if (!date || !reasonDetail) {
        showToast('يرجى تحديد تاريخ الغياب وكتابة توضيح العذر', 'warning');
        return;
    }

    SchoolData.addExcuse({
        studentId: activeChild.id,
        studentName: activeChild.fullName,
        date,
        reasonType,
        reasonDetail
    });

    closeExcuseModal();
    renderParentPortal();
    showToast('تم إرسال طلب عذر الغياب إلى إدارة المدرسة للمراجعة والاعتماد', 'success');
}

// -------------------------------------------------------------
// UI Event Listeners
// -------------------------------------------------------------
function initEventListeners() {
    // Login form tabs
    const teacherTabBtn = document.getElementById('tab-btn-teacher');
    const parentTabBtn = document.getElementById('tab-btn-parent');
    const teacherForm = document.getElementById('form-teacher-login');
    const parentForm = document.getElementById('form-parent-login');

    if (teacherTabBtn && parentTabBtn) {
        teacherTabBtn.addEventListener('click', () => {
            teacherTabBtn.classList.add('bg-navy-800', 'text-white', 'shadow-sm');
            teacherTabBtn.classList.remove('text-slate-600', 'hover:text-slate-900');
            parentTabBtn.classList.remove('bg-navy-800', 'text-white', 'shadow-sm');
            parentTabBtn.classList.add('text-slate-600', 'hover:text-slate-900');
            teacherForm.classList.remove('hidden');
            parentForm.classList.add('hidden');
        });

        parentTabBtn.addEventListener('click', () => {
            parentTabBtn.classList.add('bg-navy-800', 'text-white', 'shadow-sm');
            parentTabBtn.classList.remove('text-slate-600', 'hover:text-slate-900');
            teacherTabBtn.classList.remove('bg-navy-800', 'text-white', 'shadow-sm');
            teacherTabBtn.classList.add('text-slate-600', 'hover:text-slate-900');
            parentForm.classList.remove('hidden');
            teacherForm.classList.add('hidden');
        });
    }

    // Teacher login submit
    teacherForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('teacher-email').value;
        const name = email.includes('sara') ? 'أ. سارة القحطاني' : 'أ. عبد الله المنصور';
        loginAsTeacher(name, email.includes('sara') ? 'c4b' : 'c4a');
    });

    // Parent login submit
    parentForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = document.getElementById('parent-phone').value || '0501234567';
        loginAsParent(phone, 'عبد الله السعيد (ولي أمر)');
    });

    // Date picker change
    const datePicker = document.getElementById('attendance-date-picker');
    datePicker?.addEventListener('change', (e) => {
        AppState.selectedDate = e.target.value;
        renderTeacherDashboard();
    });

    // Previous / Next Date arrows
    document.getElementById('prev-date-btn')?.addEventListener('click', () => {
        adjustSelectedDate(-1);
    });
    document.getElementById('next-date-btn')?.addEventListener('click', () => {
        adjustSelectedDate(1);
    });
    document.getElementById('today-date-btn')?.addEventListener('click', () => {
        AppState.selectedDate = getFormattedDateString(new Date());
        renderTeacherDashboard();
    });

    // Class Filter change
    document.getElementById('class-filter-select')?.addEventListener('change', (e) => {
        AppState.selectedClass = e.target.value;
        renderAttendanceList();
        renderQuickStats();
    });

    // Student Search input
    document.getElementById('student-search-input')?.addEventListener('input', (e) => {
        AppState.searchQuery = e.target.value;
        renderAttendanceList();
        renderQuickStats();
    });

    // Notes category filters in teacher dashboard
    document.querySelectorAll('.note-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.note-filter-btn').forEach(b => {
                b.classList.remove('bg-sky-600', 'text-white');
                b.classList.add('bg-slate-100', 'text-slate-700');
            });
            const clicked = e.currentTarget;
            clicked.classList.remove('bg-slate-100', 'text-slate-700');
            clicked.classList.add('bg-sky-600', 'text-white');
            AppState.notesFilter = clicked.dataset.filter || 'all';
            renderTeacherNotesFeed();
        });
    });

    // Forms
    document.getElementById('add-student-form')?.addEventListener('submit', handleAddStudentForm);
    document.getElementById('add-note-form')?.addEventListener('submit', handleAddNoteForm);
    document.getElementById('submit-excuse-form')?.addEventListener('submit', handleSubmitExcuseForm);
}

function adjustSelectedDate(offsetDays) {
    const parts = AppState.selectedDate.split('-');
    const current = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    current.setDate(current.getDate() + offsetDays);
    AppState.selectedDate = getFormattedDateString(current);
    renderTeacherDashboard();
}

// -------------------------------------------------------------
// Toast Notifications
// -------------------------------------------------------------
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold max-w-md';

    let icon = 'fa-solid fa-circle-info';
    let colors = 'bg-white text-slate-800 border-slate-200';

    if (type === 'success') {
        icon = 'fa-solid fa-circle-check text-emerald-500';
        colors = 'bg-white text-slate-900 border-emerald-200 shadow-emerald-500/10';
    } else if (type === 'warning') {
        icon = 'fa-solid fa-triangle-exclamation text-amber-500';
        colors = 'bg-white text-slate-900 border-amber-200';
    } else if (type === 'error') {
        icon = 'fa-solid fa-circle-xmark text-rose-500';
        colors = 'bg-white text-slate-900 border-rose-200';
    } else {
        icon = 'fa-solid fa-circle-info text-sky-500';
        colors = 'bg-white text-slate-900 border-sky-200';
    }

    toast.className += ` ${colors}`;
    toast.innerHTML = `
        <i class="${icon} text-lg shrink-0"></i>
        <span class="flex-1">${message}</span>
        <button type="button" class="text-slate-400 hover:text-slate-600 transition" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Print attendance sheet
function printAttendanceSheet() {
    window.print();
}

// Global Exports
window.loginAsTeacher = loginAsTeacher;
window.loginAsParent = loginAsParent;
window.logout = logout;
window.switchRole = switchRole;
window.setStudentStatus = setStudentStatus;
window.markAllFiltered = markAllFiltered;
window.clearAllFiltered = clearAllFiltered;
window.saveAttendance = saveAttendance;
window.openAddStudentModal = openAddStudentModal;
window.closeAddStudentModal = closeAddStudentModal;
window.openNoteModalForStudent = openNoteModalForStudent;
window.closeNoteModal = closeNoteModal;
window.openExcuseModalWithDate = openExcuseModalWithDate;
window.closeExcuseModal = closeExcuseModal;
window.acknowledgeNote = acknowledgeNote;
window.printAttendanceSheet = printAttendanceSheet;
window.selectParentChild = selectParentChild;
window.showToast = showToast;

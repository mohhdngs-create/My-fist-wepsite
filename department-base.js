/**
 * DepartmentBase - قاعدة البيانات والمنطق الأساسي لكل قسم تدريبي
 * نظام إدارة مركز التدريب المهني (VTC Management System)
 */
class DepartmentBase {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.code = config.code;
    this.icon = config.icon || 'wrench';
    this.badgeColor = config.badgeColor || '#ea580c';
    this.authorizedIp = config.authorizedIp;
    this.workshopName = config.workshopName || `معمل / ورشة ${config.name}`;
    this.building = config.building || 'المبنى الرئيسي - الورش الهندسية';
    this.capacity = config.capacity || 25;
    
    // بيانات المهندس المسؤول
    this.engineer = config.engineer || {
      name: 'مهندس القسم',
      email: `${config.id}@vtc.edu`,
      password: 'password123',
      title: 'رئيس ورشة التدريب',
      phone: '0500000000'
    };

    this.description = config.description || '';
    this.competencies = config.competencies || [];
    this.equipment = config.equipment || [];
    this.trainees = config.trainees || [];
    this.attendanceRecords = config.attendanceRecords || {}; // { 'YYYY-MM-DD': { traineeId: 'present'|'absent'|'late'|'excused' } }
  }

  // جلب كافة متدربي القسم
  getTrainees() {
    return this.trainees;
  }

  // البحث عن متدرب بالمعرّف أو الكود أو الهوية
  getTrainee(query) {
    if (!query) return null;
    const q = String(query).trim().toLowerCase();
    return this.trainees.find(t => 
      t.id === query ||
      (t.code && t.code.toLowerCase() === q) ||
      (t.nationalId && t.nationalId === q)
    ) || null;
  }

  // إضافة متدرب جديد للقسم
  addTrainee(traineeData) {
    const newId = traineeData.id || `TRN-${this.id.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const newTrainee = {
      id: newId,
      code: traineeData.code || `${this.code.substring(0, 3)}-${(this.trainees.length + 1).toString().padStart(3, '0')}`,
      name: traineeData.name,
      nationalId: traineeData.nationalId,
      phone: traineeData.phone || '—',
      guardianName: traineeData.guardianName || '—',
      guardianPhone: traineeData.guardianPhone || '—',
      group: traineeData.group || 'المجموعة الأساسية',
      enrollmentDate: traineeData.enrollmentDate || new Date().toISOString().split('T')[0],
      safetyNotes: traineeData.safetyNotes || 'لا توجد ملاحظات طبية خاصة - جاهز للعمل بالورشة',
      evaluations: traineeData.evaluations || [],
      departmentId: this.id,
      departmentName: this.name
    };

    this.trainees.push(newTrainee);
    return newTrainee;
  }

  // تسجيل الحضور والغياب لتاريخ معين
  recordAttendance(date, recordsMap) {
    if (!this.attendanceRecords[date]) {
      this.attendanceRecords[date] = {};
    }
    // recordsMap: { [traineeId]: 'present' | 'absent' | 'late' | 'excused' }
    Object.assign(this.attendanceRecords[date], recordsMap);
    return this.attendanceRecords[date];
  }

  // جلب سجل الحضور لتاريخ معين
  getAttendanceForDate(date) {
    return this.attendanceRecords[date] || {};
  }

  // إضافة تقييم عملي وملاحظات سلوكية لمتدرب
  addEvaluation(traineeId, evalData) {
    const trainee = this.getTrainee(traineeId);
    if (!trainee) return null;

    if (!trainee.evaluations) {
      trainee.evaluations = [];
    }

    const practicalScore = Number(evalData.practicalScore) || 0;
    const safetyScore = Number(evalData.safetyScore) || 0;
    const maintenanceScore = Number(evalData.maintenanceScore) || 0;
    const theoryScore = Number(evalData.theoryScore) || 0;

    // حساب الدرجة الكلية الموزونة من 100
    // 40% عملي، 30% سلامة مهنية، 15% صيانة ومعدات، 15% استيعاب فني
    const totalScore = Math.round((practicalScore * 0.40) + (safetyScore * 0.30) + (maintenanceScore * 0.15) + (theoryScore * 0.15));

    const evaluationRecord = {
      id: `EVAL-${Date.now()}`,
      date: evalData.date || new Date().toISOString().split('T')[0],
      title: evalData.title || 'تقييم أداء عملي أسبوعي',
      practicalScore,
      safetyScore,
      maintenanceScore,
      theoryScore,
      totalScore,
      noteType: evalData.noteType || 'technical', // technical | safety | disciplinary | excellence
      notes: evalData.notes || '',
      evaluator: evalData.evaluator || this.engineer.name,
      createdAt: new Date().toISOString()
    };

    trainee.evaluations.unshift(evaluationRecord);
    return evaluationRecord;
  }

  // إحصائيات حضور المتدرب الفردي
  getTraineeAttendanceStats(traineeId) {
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;
    const allDates = Object.keys(this.attendanceRecords);
    const totalSessions = allDates.length;

    allDates.forEach(date => {
      const status = this.attendanceRecords[date][traineeId];
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'late') late++;
      else if (status === 'excused') excused++;
    });

    const attendedCount = present + (late * 0.8) + (excused * 0.5);
    const rate = totalSessions > 0 ? Math.round((attendedCount / totalSessions) * 100) : 100;

    return {
      totalSessions,
      present,
      absent,
      late,
      excused,
      attendanceRate: Math.min(100, Math.max(0, rate))
    };
  }

  // إحصائيات عامة للقسم
  getDepartmentStats(todayDate) {
    const today = todayDate || new Date().toISOString().split('T')[0];
    const todayRecords = this.getAttendanceForDate(today);
    const totalTrainees = this.trainees.length;

    let presentToday = 0;
    let absentToday = 0;
    let lateToday = 0;
    let excusedToday = 0;

    this.trainees.forEach(t => {
      const status = todayRecords[t.id];
      if (status === 'present') presentToday++;
      else if (status === 'absent') absentToday++;
      else if (status === 'late') lateToday++;
      else if (status === 'excused') excusedToday++;
    });

    const recordedTodayCount = presentToday + absentToday + lateToday + excusedToday;
    const attendancePercentage = recordedTodayCount > 0 ? Math.round((presentToday / recordedTodayCount) * 100) : 0;

    // حساب متوسط الأداء العملي والسلامة لجميع المتدربين
    let totalPractical = 0;
    let totalSafety = 0;
    let evalCount = 0;

    this.trainees.forEach(t => {
      if (t.evaluations && t.evaluations.length > 0) {
        const latest = t.evaluations[0];
        totalPractical += latest.practicalScore;
        totalSafety += latest.safetyScore;
        evalCount++;
      }
    });

    const avgPractical = evalCount > 0 ? Math.round(totalPractical / evalCount) : 85;
    const avgSafety = evalCount > 0 ? Math.round(totalSafety / evalCount) : 92;

    return {
      totalTrainees,
      presentToday,
      absentToday,
      lateToday,
      excusedToday,
      unrecordedToday: Math.max(0, totalTrainees - recordedTodayCount),
      attendancePercentage,
      avgPractical,
      avgSafety,
      totalMachines: this.equipment.length,
      activeMachines: this.equipment.filter(e => e.status === 'operational').length
    };
  }
}

// تصدير الكلاس لاستخدامه في المتصفح والـ Modules
if (typeof window !== 'undefined') {
  window.DepartmentBase = DepartmentBase;
}

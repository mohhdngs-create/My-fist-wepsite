/**
 * قسم برمجة وتشغيل ماكينات CNC (CNC Programming & Machining)
 * رمز القسم: WRK-CNC-303
 * عنوان IP المصرح به للورشة: 192.168.30.55
 */

(function () {
  const cncDepartmentData = {
    id: 'cnc',
    name: 'برمجة ماكينات CNC',
    code: 'WRK-CNC-303',
    icon: 'cpu',
    badgeColor: '#0ea5e9', // أزرق سيان تكنولوجي
    authorizedIp: '192.168.30.55',
    workshopName: 'مركز التصنيع الرقمي المتقدم وماكينات التحكم الرقمي CNC',
    building: 'مجمع الورش الصناعية - الجناح A - قاعة 105',
    capacity: 18,
    engineer: {
      name: 'م. طارق الصاوي',
      email: 'eng.cnc@vtc.edu.sa',
      password: 'cnc123',
      title: 'خبير التصنيع الذكي وبرمجة ماكينات CNC و CAM',
      phone: '0553344556',
      badge: 'مشرف ورشة CNC-303'
    },
    description: 'إكساب المتدربين مهارات كتابة وفحص برامج G-Code و M-Code، واستخدام حزم CAM الحديثة لتوليد مسارات العدة Toolpaths، وإجراء المعايرة وصفر الشغلة (Work Offset G54) وتشغيل مراكز التفريز والخراطة الرقمية.',
    competencies: [
      'البرمجة اليدوية للأكواد المعيارية ISO G-Codes & Canned Cycles',
      'توليد برامج التشغيل بالحاسب عبر حزم Mastercam و Siemens NX CAM',
      'تصفير العدة والشغلة وضبط جداول الإزاحة Tool Geometry & Wear Offsets',
      'تشغيل مراكز التفريز الرأسي ثلاثية ورباعية المحاور VMC 3-Axis / 4-Axis',
      'فحص القطع المصنعة باستخدام أجهزة القياس الإحداثي CMM'
    ],
    equipment: [
      { id: 'CNC-M01', name: 'مركز تشغيل تفريز رأسي Haas VF-2 3-Axis VMC', status: 'operational', specs: '10,000 RPM, 30-Pocket Tool Changer, Wireless Intuitive Probing' },
      { id: 'CNC-M02', name: 'مركز تفريز DMG MORI CMX 600V (محور رابع مضاف)', status: 'operational', specs: 'Heidenhain TNC 620 Control, 12,000 RPM' },
      { id: 'CNC-L01', name: 'مخرطة تحكم رقمي Haas ST-10 CNC Lathe', status: 'operational', specs: '6000 RPM, 12-Station VDI Turret' },
      { id: 'EDM-01', name: 'ماكينة قطع بالليزر والسلك Wire EDM AgieCharmilles', status: 'operational', specs: '0.1 Micron Precision Sub-micron finish' }
    ],
    trainees: [
      {
        id: 'TRN-CNC-001',
        code: 'CNC-301',
        name: 'عبدالله بن عادل القاسم',
        nationalId: '1097890123',
        phone: '0557890123',
        guardianName: 'عادل بن عبدالعزيز القاسم',
        guardianPhone: '0507890123',
        group: 'المجموعة المتقدمة CNC',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - منضبط تماماً ببروتوكول السلامة وزر التوقف الطارئ E-Stop',
        departmentId: 'cnc',
        departmentName: 'برمجة ماكينات CNC',
        evaluations: [
          {
            id: 'EVAL-CNC-01',
            date: '2026-11-19',
            title: 'برمجة وتشغيل قالب حقن ألومنيوم ثلاثي الأبعاد 3D Surface',
            practicalScore: 96,
            safetyScore: 98,
            maintenanceScore: 94,
            theoryScore: 95,
            totalScore: 96,
            noteType: 'excellence',
            notes: 'تنفيذ احترافي لمسار التشغيل التكيفي Adaptive Clearing بزمن تشغيل قياسي وتشطيب سطحي ناعم بدون أي اهتزازات.',
            evaluator: 'م. طارق الصاوي'
          },
          {
            id: 'EVAL-CNC-02',
            date: '2026-11-12',
            title: 'معايرة مجس الشغلة اللاسلكي Renishaw Probe وضبط G54',
            practicalScore: 90,
            safetyScore: 95,
            maintenanceScore: 92,
            theoryScore: 90,
            totalScore: 92,
            noteType: 'technical',
            notes: 'إتقان تام لدورات قياس المركز والارتفاع وتحديث إحداثيات العمل تلقائياً.',
            evaluator: 'م. طارق الصاوي'
          }
        ]
      },
      {
        id: 'TRN-CNC-002',
        code: 'CNC-302',
        name: 'محمد بن هشام القرني',
        nationalId: '1098901234',
        phone: '0558901234',
        guardianName: 'هشام بن سعيد القرني',
        guardianPhone: '0508901234',
        group: 'المجموعة المتقدمة CNC',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - تم التأكيد على إغلاق باب الكابينة بالكامل قبل الضغط على Cycle Start',
        departmentId: 'cnc',
        departmentName: 'برمجة ماكينات CNC',
        evaluations: [
          {
            id: 'EVAL-CNC-03',
            date: '2026-11-18',
            title: 'كتابة برنامج يدوي لثقب دائري وتفريغ جيوب Pocketing',
            practicalScore: 89,
            safetyScore: 92,
            maintenanceScore: 88,
            theoryScore: 86,
            totalScore: 89,
            noteType: 'technical',
            notes: 'شفرة G-Code متناسقة مع استخدام ممتاز لدورات G81 و G83 للثقب العميق وتبريد السائل.',
            evaluator: 'م. طارق الصاوي'
          }
        ]
      },
      {
        id: 'TRN-CNC-003',
        code: 'CNC-303',
        name: 'إبراهيم بن صالح الغامدي',
        nationalId: '1099012345',
        phone: '0559012345',
        guardianName: 'صالح بن علي الغامدي',
        guardianPhone: '0509012345',
        group: 'المجموعة الأساسية CNC',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - تم التنبيه لمراقبة مؤشر الحمل على المغزل Spindle Load',
        departmentId: 'cnc',
        departmentName: 'برمجة ماكينات CNC',
        evaluations: [
          {
            id: 'EVAL-CNC-04',
            date: '2026-11-17',
            title: 'محاكاة افتراضية Verification ومنع تصادم العدة (Dry Run)',
            practicalScore: 85,
            safetyScore: 90,
            maintenanceScore: 86,
            theoryScore: 84,
            totalScore: 86,
            noteType: 'technical',
            notes: 'أجرى فحص التصادم بنجاح على نظام المحاكاة قبل إرسال البرنامج للماكينة الحقيقية.',
            evaluator: 'م. طارق الصاوي'
          }
        ]
      },
      {
        id: 'TRN-CNC-004',
        code: 'CNC-304',
        name: 'مازن بن ناصر الشهراني',
        nationalId: '1080123456',
        phone: '0550123456',
        guardianName: 'ناصر بن فهد الشهراني',
        guardianPhone: '0500123456',
        group: 'المجموعة الأساسية CNC',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - تنبيه لعدم تنظيف الرايش بالهواء المضغوط بالقرب من عدسات القياس',
        departmentId: 'cnc',
        departmentName: 'برمجة ماكينات CNC',
        evaluations: [
          {
            id: 'EVAL-CNC-05',
            date: '2026-11-16',
            title: 'تقييم السلامة ونظافة مجاري التصنيع بالماكينة',
            practicalScore: 82,
            safetyScore: 78,
            maintenanceScore: 84,
            theoryScore: 82,
            totalScore: 81,
            noteType: 'safety',
            notes: 'تم توجيه المتدرب لاستخدام المكنسة الصناعية والفرشاة المخصصة لسحب الرايش بدلاً من نفخ الهواء الذي يشتت البرادة في موجهات الماكينة.',
            evaluator: 'م. طارق الصاوي'
          }
        ]
      },
      {
        id: 'TRN-CNC-005',
        code: 'CNC-305',
        name: 'حمزة بن عثمان الأنصاري',
        nationalId: '1081234567',
        phone: '0551123456',
        guardianName: 'عثمان بن بكر الأنصاري',
        guardianPhone: '0501123456',
        group: 'المجموعة المتقدمة CNC',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - دقيق جداً في الحسابات الهندسية ومطابقة كود الإنتاج',
        departmentId: 'cnc',
        departmentName: 'برمجة ماكينات CNC',
        evaluations: [
          {
            id: 'EVAL-CNC-06',
            date: '2026-11-15',
            title: 'تشغيل أشكال معقدة على المحور الرابع الفهرسي 4th Rotary Axis',
            practicalScore: 93,
            safetyScore: 96,
            maintenanceScore: 92,
            theoryScore: 91,
            totalScore: 93,
            noteType: 'excellence',
            notes: 'مهارة فائقة في ضبط توازي محور الدوران وحساب إحداثيات الدوران الزاوي A-Axis.',
            evaluator: 'م. طارق الصاوي'
          }
        ]
      },
      {
        id: 'TRN-CNC-006',
        code: 'CNC-306',
        name: 'طلال بن فهد السبيعي',
        nationalId: '1082345678',
        phone: '0552234567',
        guardianName: 'فهد بن سعد السبيعي',
        guardianPhone: '0502234567',
        group: 'المجموعة الأساسية CNC',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - مستوى تدريبي متميز وجاهز للمرحلة الثانية',
        departmentId: 'cnc',
        departmentName: 'برمجة ماكينات CNC',
        evaluations: [
          {
            id: 'EVAL-CNC-07',
            date: '2026-11-14',
            title: 'اختيار سرعات التغذية والقطع لحفر الفولاذ المقاوم للصدأ SS316',
            practicalScore: 87,
            safetyScore: 91,
            maintenanceScore: 88,
            theoryScore: 85,
            totalScore: 88,
            noteType: 'technical',
            notes: 'اختيار موفق لسرعات Surface Speed (SFM) ومعدل Chip Load مع حفظ عمر العدة القاطعة.',
            evaluator: 'م. طارق الصاوي'
          }
        ]
      }
    ],
    attendanceRecords: {
      '2026-11-20': {
        'TRN-CNC-001': 'present',
        'TRN-CNC-002': 'present',
        'TRN-CNC-003': 'present',
        'TRN-CNC-004': 'present',
        'TRN-CNC-005': 'present',
        'TRN-CNC-006': 'present'
      },
      '2026-11-19': {
        'TRN-CNC-001': 'present',
        'TRN-CNC-002': 'present',
        'TRN-CNC-003': 'present',
        'TRN-CNC-004': 'late',
        'TRN-CNC-005': 'present',
        'TRN-CNC-006': 'present'
      },
      '2026-11-18': {
        'TRN-CNC-001': 'present',
        'TRN-CNC-002': 'absent',
        'TRN-CNC-003': 'present',
        'TRN-CNC-004': 'present',
        'TRN-CNC-005': 'present',
        'TRN-CNC-006': 'present'
      }
    }
  };

  if (typeof window !== 'undefined') {
    if (!window.DepartmentModules) window.DepartmentModules = {};
    window.DepartmentModules['cnc'] = cncDepartmentData;

    if (window.DepartmentRegistry) {
      window.DepartmentRegistry.register(cncDepartmentData);
    }
  }
})();

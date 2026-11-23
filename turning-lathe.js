/**
 * قسم الخراطة والتشغيل الميكانيكي (Turning / Mechanical Lathe Machining)
 * رمز القسم: WRK-MECH-202
 * عنوان IP المصرح به للورشة: 192.168.20.40
 */

(function () {
  const turningLatheDepartmentData = {
    id: 'turning-lathe',
    name: 'الخراطة والتشغيل الميكانيكي',
    code: 'WRK-MECH-202',
    icon: 'disc',
    badgeColor: '#ea580c', // برتقالي أمني صناعي
    authorizedIp: '192.168.20.40',
    workshopName: 'ورشة الخراطة والتشغيل الميكانيكي الثقيل',
    building: 'مجمع الورش الصناعية - الجناح B - ورشة 102',
    capacity: 20,
    engineer: {
      name: 'م. محمود عبد الرحمن',
      email: 'eng.turning@vtc.edu.sa',
      password: 'turn123',
      title: 'كبير مهندسي الإنتاج والتشغيل الميكانيكي',
      phone: '0552233445',
      badge: 'مشرف ورشة MECH-202'
    },
    description: 'تدريب المتدربين على تشغيل مخارط المعادن التقليدية والحديثة، تنفيذ عمليات السطح والقلوظة وخراطة الأعمدة طبقاً للمخططات الهندسية بدقة الميكرون، والتطبيق الصارم لمعايير السلامة المهنية ومعدات الحماية الشخصية (PPE).',
    competencies: [
      'قراءة وتفسير المخططات الهندسية والتفاوتات الميكانيكية ISO Limits & Fits',
      'عمليات الخراطة الطولية، السطحية، والداخلية والخارجية',
      'قلوظة المعادن اللولبية (Metric & Whitworth Threading)',
      'استخدام أدوات القياس الدقيقة (Micrometer, Vernier Caliper, Dial Indicator)',
      'تطبيق بروتوكولات السلامة الصناعية وإدارة الرايش ومستحلبات التبريد'
    ],
    equipment: [
      { id: 'LTH-01', name: 'مخرطة ميكانيكية متقدمة Colchester Triumph 2500', status: 'operational', specs: 'Swing 400mm, 2000 RPM, DRO 2-Axis' },
      { id: 'LTH-02', name: 'مخرطة تقليدية للأشغال الشاقة Harrison M300 (عدد 6)', status: 'operational', specs: 'Spindle bore 38mm, 12 Spindle Speeds' },
      { id: 'GRD-01', name: 'ماكينة تجليخ وتثقيب شحذ الأقلام والمثاقب Tool Grinder', status: 'operational', specs: 'Dual Wheel 200mm with Eye Shield' },
      { id: 'QCL-01', name: 'محطة فحص الجودة والمطابقة الهندسية Metrology Lab', status: 'operational', specs: 'Bore Gauges, Height Gauge, Roughness Tester' }
    ],
    trainees: [
      {
        id: 'TRN-LAT-001',
        code: 'LAT-201',
        name: 'سلطان بن تركي الحربي',
        nationalId: '1091234567',
        phone: '0551234567',
        guardianName: 'تركي بن عائض الحربي',
        guardianPhone: '0501234567',
        group: 'المجموعة الميكانيكية الأولى',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'ملتزم التزاماً كاملاً بارتداء حذاء الأمان والنظارة الواقية وحماية الأذن',
        departmentId: 'turning-lathe',
        departmentName: 'الخراطة والتشغيل الميكانيكي',
        evaluations: [
          {
            id: 'EVAL-LAT-01',
            date: '2026-11-19',
            title: 'خراطة وتدرج عمود نقل حركة مع قلوظة M24x2.0',
            practicalScore: 92,
            safetyScore: 96,
            maintenanceScore: 90,
            theoryScore: 88,
            totalScore: 92,
            noteType: 'excellence',
            notes: 'دقة عالية في الأبعاد ضمن حدود تفاوت ±0.02mm، مظهر سطحي أملس ممتاز وانضباط تام في ارتداء واقي الوجه أثناء كسر الرايش.',
            evaluator: 'م. محمود عبد الرحمن'
          },
          {
            id: 'EVAL-LAT-02',
            date: '2026-11-12',
            title: 'تقييم شحذ وتجهيز أقلام الخراطة من صلب السرعات العالية (HSS)',
            practicalScore: 85,
            safetyScore: 90,
            maintenanceScore: 85,
            theoryScore: 84,
            totalScore: 86,
            noteType: 'technical',
            notes: 'زوايا القطع (Rake & Clearance angles) جيدة ومناسبة لتشغيل الألومنيوم والصلب الطري.',
            evaluator: 'م. محمود عبد الرحمن'
          }
        ]
      },
      {
        id: 'TRN-LAT-002',
        code: 'LAT-202',
        name: 'فهد بن منصور السبيعي',
        nationalId: '1092345678',
        phone: '0552345678',
        guardianName: 'منصور بن ناصر السبيعي',
        guardianPhone: '0502345678',
        group: 'المجموعة الميكانيكية الأولى',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - تم التنبيه على عدم ارتداء أي خواتم أو سلاسل أثناء دوران المخرطة',
        departmentId: 'turning-lathe',
        departmentName: 'الخراطة والتشغيل الميكانيكي',
        evaluations: [
          {
            id: 'EVAL-LAT-03',
            date: '2026-11-19',
            title: 'خراطة طواقي وجلب مسننة دقيقة',
            practicalScore: 88,
            safetyScore: 90,
            maintenanceScore: 86,
            theoryScore: 82,
            totalScore: 87,
            noteType: 'technical',
            notes: 'تحكم جيد في سرعات الدوران (RPM) ومعدلات التغذية، يوصى بالانتباه أكثر لمستوى تدفق سائل التبريد.',
            evaluator: 'م. محمود عبد الرحمن'
          }
        ]
      },
      {
        id: 'TRN-LAT-003',
        code: 'LAT-203',
        name: 'نايف بن مشعل المطيري',
        nationalId: '1093456789',
        phone: '0553456789',
        guardianName: 'مشعل بن هزاع المطيري',
        guardianPhone: '0503456789',
        group: 'المجموعة الميكانيكية الثانية',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم طبياً - تنبيه سلامة سابق بضرورة إغلاق حاجز المخرطة الزجاجي',
        departmentId: 'turning-lathe',
        departmentName: 'الخراطة والتشغيل الميكانيكي',
        evaluations: [
          {
            id: 'EVAL-LAT-04',
            date: '2026-11-17',
            title: 'تقييم السلامة المهنية: حواجز الحماية وإيقاف الطوارئ',
            practicalScore: 80,
            safetyScore: 72,
            maintenanceScore: 80,
            theoryScore: 85,
            totalScore: 78,
            noteType: 'safety',
            notes: 'توجيه تنبيه مهني لمخالفة تشغيل المخرطة قبل إحكام إغلاق الغطاء الواقي لظرف المخرطة (Chuck Guard). تم إيقاف الماكينة وتوجيه المتدرب.',
            evaluator: 'م. محمود عبد الرحمن'
          }
        ]
      },
      {
        id: 'TRN-LAT-004',
        code: 'LAT-204',
        name: 'خالد بن زياد الغامدي',
        nationalId: '1094567890',
        phone: '0554567890',
        guardianName: 'زياد بن سعيد الغامدي',
        guardianPhone: '0504567890',
        group: 'المجموعة الميكانيكية الثانية',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - نموذج في النظافة المهنية وصيانة ماكينات الورشة',
        departmentId: 'turning-lathe',
        departmentName: 'الخراطة والتشغيل الميكانيكي',
        evaluations: [
          {
            id: 'EVAL-LAT-05',
            date: '2026-11-16',
            title: 'خراطة المخروط الداخلي والخارجي وحساب زاوية الميل',
            practicalScore: 94,
            safetyScore: 98,
            maintenanceScore: 96,
            theoryScore: 90,
            totalScore: 94,
            noteType: 'excellence',
            notes: 'حسابات هندسية رياضية دقيقة لزاوية ميل الراسمة الصغرى، وجودة سطح ناعمة جداً.',
            evaluator: 'م. محمود عبد الرحمن'
          }
        ]
      },
      {
        id: 'TRN-LAT-005',
        code: 'LAT-205',
        name: 'سعود بن وليد الزهراني',
        nationalId: '1095678901',
        phone: '0555678901',
        guardianName: 'وليد بن أحمد الزهراني',
        guardianPhone: '0505678901',
        group: 'المجموعة الميكانيكية الأولى',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - تم تزويده بنظارة حماية مقاومة للخدش',
        departmentId: 'turning-lathe',
        departmentName: 'الخراطة والتشغيل الميكانيكي',
        evaluations: [
          {
            id: 'EVAL-LAT-06',
            date: '2026-11-15',
            title: 'تزييت وصيانة مجاري المخرطة بعد الوردية',
            practicalScore: 86,
            safetyScore: 92,
            maintenanceScore: 95,
            theoryScore: 82,
            totalScore: 88,
            noteType: 'technical',
            notes: 'جهد ممتاز في تنظيف فرش المخرطة من الرايش وتزييت مجاري التزليق بزيت Way-Lube 68.',
            evaluator: 'م. محمود عبد الرحمن'
          }
        ]
      },
      {
        id: 'TRN-LAT-006',
        code: 'LAT-206',
        name: 'ريان بن فيصل الشهري',
        nationalId: '1096789012',
        phone: '0556789012',
        guardianName: 'فيصل بن صالح الشهري',
        guardianPhone: '0506789012',
        group: 'المجموعة الميكانيكية الثانية',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - جاهز لأداء التدريبات الشاقة',
        departmentId: 'turning-lathe',
        departmentName: 'الخراطة والتشغيل الميكانيكي',
        evaluations: [
          {
            id: 'EVAL-LAT-07',
            date: '2026-11-14',
            title: 'خراطة تفريغ داخلي وتثقيب على المخرطة',
            practicalScore: 83,
            safetyScore: 88,
            maintenanceScore: 85,
            theoryScore: 80,
            totalScore: 84,
            noteType: 'technical',
            notes: 'التقدم مستقر، يحتاج لتمرين إضافي على قياس القطر الداخلي بالميكرومتر الداخلي.',
            evaluator: 'م. محمود عبد الرحمن'
          }
        ]
      }
    ],
    attendanceRecords: {
      '2026-11-20': {
        'TRN-LAT-001': 'present',
        'TRN-LAT-002': 'present',
        'TRN-LAT-003': 'present',
        'TRN-LAT-004': 'present',
        'TRN-LAT-005': 'late',
        'TRN-LAT-006': 'present'
      },
      '2026-11-19': {
        'TRN-LAT-001': 'present',
        'TRN-LAT-002': 'present',
        'TRN-LAT-003': 'present',
        'TRN-LAT-004': 'present',
        'TRN-LAT-005': 'present',
        'TRN-LAT-006': 'absent'
      },
      '2026-11-18': {
        'TRN-LAT-001': 'present',
        'TRN-LAT-002': 'late',
        'TRN-LAT-003': 'present',
        'TRN-LAT-004': 'present',
        'TRN-LAT-005': 'present',
        'TRN-LAT-006': 'present'
      }
    }
  };

  if (typeof window !== 'undefined') {
    if (!window.DepartmentModules) window.DepartmentModules = {};
    window.DepartmentModules['turning-lathe'] = turningLatheDepartmentData;

    if (window.DepartmentRegistry) {
      window.DepartmentRegistry.register(turningLatheDepartmentData);
    }
  }
})();

/**
 * قسم الكهرباء والتحكم الآلي (Industrial Electricity & PLC)
 * رمز القسم: LAB-PLC-404
 * عنوان IP المصرح به للمعمل: 192.168.40.70
 */

(function () {
  const electricityPlcDepartmentData = {
    id: 'electricity-plc',
    name: 'الكهرباء والتحكم الآلي',
    code: 'LAB-PLC-404',
    icon: 'zap',
    badgeColor: '#eab308', // أصفر كهربائي تحذيري
    authorizedIp: '192.168.40.70',
    workshopName: 'معمل الأتمتة الصناعية ومتحكمات الـ PLC المبرمجة',
    building: 'مجمع الورش الصناعية - الجناح C - معمل 201',
    capacity: 22,
    engineer: {
      name: 'م. سارة القحطاني',
      email: 'eng.plc@vtc.edu.sa',
      password: 'plc123',
      title: 'مهندسة أولى للتحكم الآلي والروبوتات الصناعية',
      phone: '0554455667',
      badge: 'مشرفة معمل PLC-404'
    },
    description: 'تأهيل الكوادر الهندسية والتقنية على تصميم وتنفيذ دوائر الكنترول الكلاسيكي والتحكم المنطقي المبرمج (PLC)، وبرمجة محولات التردد VFD، وشاشات المشغل HMI، وتطبيق إجراءات العزل الكهربائي الآمن Lockout/Tagout (LOTO).',
    competencies: [
      'برمجة المتحكمات المنطقية Siemens S7-1200 / S7-1500 عبر TIA Portal',
      'برمجة لغات التدرج المنطقي Ladder Logic و Function Block Diagram (FBD)',
      'توصيل وفحص لوحات التحكم الكلاسيكية (Contactors, Relays, Timers, Overloads)',
      'معايرة وضبط مغيرات السرعة الترددية للمحركات الحثية VFD Drives',
      'تطبيق بروتوكولات العزل الآمن للطاقة Lockout/Tagout (LOTO) واختبار الجهد الصفري'
    ],
    equipment: [
      { id: 'PLC-S01', name: 'حقيبة تدريب سيمنز Siemens S7-1200 Training Kit (عدد 10)', status: 'operational', specs: 'CPU 1214C DC/DC/DC, Signal Board, Ethernet/Profinet' },
      { id: 'HMI-01', name: 'شاشات مشغل صناعية Siemens KTP700 Basic HMI', status: 'operational', specs: '7" Touchscreen, WinCC Flexible runtime' },
      { id: 'VFD-01', name: 'مغيرات سرعة محركات Danfoss & Schneider Altivar ATV320', status: 'operational', specs: '3-Phase 380V, Modbus RTU / CANopen' },
      { id: 'LOTO-01', name: 'محطة التدريب على العزل الكهربائي الشامل LOTO Safety Station', status: 'operational', specs: 'Master Lock safety padlocks, Hasps, Circuit breaker lockouts' }
    ],
    trainees: [
      {
        id: 'TRN-PLC-001',
        code: 'PLC-401',
        name: 'حاتم بن سعد الرويلي',
        nationalId: '1071234567',
        phone: '0553456701',
        guardianName: 'سعد بن مشعل الرويلي',
        guardianPhone: '0503456701',
        group: 'المجموعة المتقدمة PLC',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - نموذج يحتذى به في الالتزام بعزل الطاقة وقفل LOTO',
        departmentId: 'electricity-plc',
        departmentName: 'الكهرباء والتحكم الآلي',
        evaluations: [
          {
            id: 'EVAL-PLC-01',
            date: '2026-11-19',
            title: 'برمجة خط تعبئة آلي متكامل باستخدام S7-1200 مع شاشة HMI',
            practicalScore: 97,
            safetyScore: 99,
            maintenanceScore: 95,
            theoryScore: 96,
            totalScore: 97,
            noteType: 'excellence',
            notes: 'تصميم متقن لمخطط السلم Ladder Diagram يشمل المؤقتات والعدادات ومعالجة إشارات الحساسات الضوئية والتقاربية، مع إنذارات تفاعلية على شاشة الـ HMI.',
            evaluator: 'م. سارة القحطاني'
          },
          {
            id: 'EVAL-PLC-02',
            date: '2026-11-12',
            title: 'توصيل دائرة بدء وتشغيل نجمة / دلتا لمحرك 15kW مع قواطع حماية',
            practicalScore: 91,
            safetyScore: 95,
            maintenanceScore: 90,
            theoryScore: 89,
            totalScore: 91,
            noteType: 'technical',
            notes: 'ترتيب وتنظيم فائق للأسلاك داخل مجاري الكابلات وترقيم الموصلات (Ferrules) بدقة عالية.',
            evaluator: 'م. سارة القحطاني'
          }
        ]
      },
      {
        id: 'TRN-PLC-002',
        code: 'PLC-402',
        name: 'نواف بن عبدالمحسن العتيبي',
        nationalId: '1072345678',
        phone: '0554567812',
        guardianName: 'عبدالمحسن بن ناصر العتيبي',
        guardianPhone: '0504567812',
        group: 'المجموعة المتقدمة PLC',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - تم التنبيه على عدم فحص اللوحة أثناء سريان التيار إلا بحضور المدرب',
        departmentId: 'electricity-plc',
        departmentName: 'الكهرباء والتحكم الآلي',
        evaluations: [
          {
            id: 'EVAL-PLC-03',
            date: '2026-11-18',
            title: 'معايرة سرعة محرك حثي عبر VFD وبروتوكول الاتصال Modbus',
            practicalScore: 88,
            safetyScore: 92,
            maintenanceScore: 87,
            theoryScore: 85,
            totalScore: 88,
            noteType: 'technical',
            notes: 'تحكم سليم في أزمنة التسارع والتباطؤ (Acceleration / Deceleration times) ومنع التيارات العالية.',
            evaluator: 'م. سارة القحطاني'
          }
        ]
      },
      {
        id: 'TRN-PLC-003',
        code: 'PLC-403',
        name: 'يوسف بن ماجد الشهيل',
        nationalId: '1073456789',
        phone: '0555678923',
        guardianName: 'ماجد بن فيصل الشهيل',
        guardianPhone: '0505678923',
        group: 'المجموعة الأساسية للأتمتة',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - تنبيه سلامة سابق بعدم فحص الجهد بجهاز ملتيميتر بدون معايرة CAT III',
        departmentId: 'electricity-plc',
        departmentName: 'الكهرباء والتحكم الآلي',
        evaluations: [
          {
            id: 'EVAL-PLC-04',
            date: '2026-11-17',
            title: 'تقييم السلامة الكهربائية وفحص الجهد الصفري Zero Voltage Verification',
            practicalScore: 82,
            safetyScore: 75,
            maintenanceScore: 80,
            theoryScore: 84,
            totalScore: 80,
            noteType: 'safety',
            notes: 'توجيه تنبيه مهني لمخالفة قياس الجهد على لوحة 380V دون ارتداء القفازات العازلة 1000V المعتمدة. تم التوجيه العملي لإجراءات السلامة.',
            evaluator: 'م. سارة القحطاني'
          }
        ]
      },
      {
        id: 'TRN-PLC-004',
        code: 'PLC-404',
        name: 'منصور بن فايز الدوسري',
        nationalId: '1074567890',
        phone: '0556789034',
        guardianName: 'فايز بن مبارك الدوسري',
        guardianPhone: '0506789034',
        group: 'المجموعة الأساسية للأتمتة',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - دقيق في رسم المخططات الكهربائية ببرنامج AutoCAD Electrical',
        departmentId: 'electricity-plc',
        departmentName: 'الكهرباء والتحكم الآلي',
        evaluations: [
          {
            id: 'EVAL-PLC-05',
            date: '2026-11-16',
            title: 'اكتشاف وتصحيح أعطال لوحة تحكم كهربائية بها التماس خفي',
            practicalScore: 93,
            safetyScore: 96,
            maintenanceScore: 92,
            theoryScore: 90,
            totalScore: 93,
            noteType: 'excellence',
            notes: 'سرعة قياسية في تتبع المسار الكهربائي بمخطط التوصيل واكتشاف تلامس نقطة مساعد الكونتاكتور التالفة واستبدالها.',
            evaluator: 'م. سارة القحطاني'
          }
        ]
      },
      {
        id: 'TRN-PLC-005',
        code: 'PLC-405',
        name: 'عبدالرحمن بن بدر العنزي',
        nationalId: '1075678901',
        phone: '0557890145',
        guardianName: 'بدر بن عواد العنزي',
        guardianPhone: '0507890145',
        group: 'المجموعة المتقدمة PLC',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - حريص على إعادة أدوات الفحص والأفوميتر إلى خزانتها المغلقة',
        departmentId: 'electricity-plc',
        departmentName: 'الكهرباء والتحكم الآلي',
        evaluations: [
          {
            id: 'EVAL-PLC-06',
            date: '2026-11-15',
            title: 'برمجة التحكم التناسبي التكاملي والتفاضلي PID للتحكم في درجات الحرارة',
            practicalScore: 89,
            safetyScore: 92,
            maintenanceScore: 88,
            theoryScore: 87,
            totalScore: 89,
            noteType: 'technical',
            notes: 'تطبيق ناجح لضبط ثوابت PID Tuning على معالج S7-1200 والوصول لنقطة الاستقرار بسرعة.',
            evaluator: 'م. سارة القحطاني'
          }
        ]
      },
      {
        id: 'TRN-PLC-006',
        code: 'PLC-406',
        name: 'زياد بن هشام السليمان',
        nationalId: '1076789012',
        phone: '0558901256',
        guardianName: 'هشام بن عبدالعزيز السليمان',
        guardianPhone: '0508901256',
        group: 'المجموعة الأساسية للأتمتة',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم طبياً وجاهز لكافة التدريبات العملية',
        departmentId: 'electricity-plc',
        departmentName: 'الكهرباء والتحكم الآلي',
        evaluations: [
          {
            id: 'EVAL-PLC-07',
            date: '2026-11-14',
            title: 'توصيل حساسات الضغط والتدفق التناظرية 4-20mA بالـ PLC',
            practicalScore: 84,
            safetyScore: 90,
            maintenanceScore: 85,
            theoryScore: 82,
            totalScore: 85,
            noteType: 'technical',
            notes: 'استيعاب جيد لمعايرة الإشارات التناظرية (Scaling & Unscaling NORM_X / SCALE_X).',
            evaluator: 'م. سارة القحطاني'
          }
        ]
      }
    ],
    attendanceRecords: {
      '2026-11-20': {
        'TRN-PLC-001': 'present',
        'TRN-PLC-002': 'present',
        'TRN-PLC-003': 'present',
        'TRN-PLC-004': 'present',
        'TRN-PLC-005': 'present',
        'TRN-PLC-006': 'late'
      },
      '2026-11-19': {
        'TRN-PLC-001': 'present',
        'TRN-PLC-002': 'present',
        'TRN-PLC-003': 'late',
        'TRN-PLC-004': 'present',
        'TRN-PLC-005': 'present',
        'TRN-PLC-006': 'present'
      },
      '2026-11-18': {
        'TRN-PLC-001': 'present',
        'TRN-PLC-002': 'present',
        'TRN-PLC-003': 'present',
        'TRN-PLC-004': 'present',
        'TRN-PLC-005': 'absent',
        'TRN-PLC-006': 'present'
      }
    }
  };

  if (typeof window !== 'undefined') {
    if (!window.DepartmentModules) window.DepartmentModules = {};
    window.DepartmentModules['electricity-plc'] = electricityPlcDepartmentData;

    if (window.DepartmentRegistry) {
      window.DepartmentRegistry.register(electricityPlcDepartmentData);
    }
  }
})();

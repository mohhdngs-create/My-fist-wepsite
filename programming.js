/**
 * قسم البرمجة وتطوير الويب (Programming & Web Development)
 * رمز القسم: LAB-IT-101
 * عنوان IP المصرح به للمعمل: 192.168.10.25
 */

(function () {
  const programmingDepartmentData = {
    id: 'programming',
    name: 'البرمجة وتطوير الويب',
    code: 'LAB-IT-101',
    icon: 'code',
    badgeColor: '#3b82f6', // أزرق تقني
    authorizedIp: '192.168.10.25',
    workshopName: 'معمل هندسة البرمجيات وتطبيقات السحاب',
    building: 'مبنى تكنولوجيا المعلومات - الطابق الثاني - قاعة 204',
    capacity: 25,
    engineer: {
      name: 'م. أحمد النجار',
      email: 'eng.programming@vtc.edu.sa',
      password: 'prog123',
      title: 'كبير مهندسي البرمجيات والأنظمة السحابية',
      phone: '0551122334',
      badge: 'مشرف معمل IT-101'
    },
    description: 'تأهيل الكوادر الفنية على تطوير تطبيقات الويب التفاعلية، بناء قواعد البيانات، وتأمين بيئات البرمجيات والربط السحابي.',
    competencies: [
      'تطوير الواجهات التفاعلية (HTML5, CSS3, Modern JavaScript)',
      'برمجة الخوادم وواجهات التطبيقات RESTful APIs',
      'إدارة وتصميم قواعد البيانات SQL & NoSQL',
      'نظم التحكم بالنسخ Git & GitHub وحماية الشيفرات'
    ],
    equipment: [
      { id: 'WS-01', name: 'محطة عمل Dell Precision 3660 (عدد 20)', status: 'operational', specs: 'Core i7, 32GB RAM, RTX 3060' },
      { id: 'SRV-01', name: 'خادم تجارب محلي Local Lab Server', status: 'operational', specs: 'Ubuntu 22.04 LTS, Docker Swarm' },
      { id: 'NET-01', name: 'محول شبكة Cisco Catalyst 48-Port GbE', status: 'operational', specs: 'VLAN 10 isolated, 1Gbps Duplex' },
      { id: 'PRJ-01', name: 'شاشة تفاعلية ذكية Smart Interactive 85"', status: 'operational', specs: '4K Multi-touch' }
    ],
    trainees: [
      {
        id: 'TRN-PRG-001',
        code: 'PRG-101',
        name: 'فيصل بن خالد الشمري',
        nationalId: '1098765432',
        phone: '0559871234',
        guardianName: 'خالد بن محمد الشمري',
        guardianPhone: '0509871234',
        group: 'المجموعة أ (تطوير النظم)',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'حالة ممتازة - التزام كامل بإجراءات السلامة الرقمية ومحطات العمل',
        departmentId: 'programming',
        departmentName: 'البرمجة وتطوير الويب',
        evaluations: [
          {
            id: 'EVAL-PRG-01',
            date: '2026-11-18',
            title: 'تقييم مشروع بناء واجهة مستخدم متجاوبة',
            practicalScore: 95,
            safetyScore: 98,
            maintenanceScore: 92,
            theoryScore: 90,
            totalScore: 94,
            noteType: 'excellence',
            notes: 'أظهر براعة فائقة في تنظيم بنية الملفات وتطبيق معايير تجربة المستخدم. شفرة نظيفة وتوثيق ممتاز.',
            evaluator: 'م. أحمد النجار'
          },
          {
            id: 'EVAL-PRG-02',
            date: '2026-11-11',
            title: 'اختبار خوارزميات وربط قواعد البيانات',
            practicalScore: 88,
            safetyScore: 95,
            maintenanceScore: 90,
            theoryScore: 85,
            totalScore: 88,
            noteType: 'technical',
            notes: 'أداء متميز في استعلامات SQL، يوصى بالتركيز على تحسين زمن استجابة الـ API.',
            evaluator: 'م. أحمد النجار'
          }
        ]
      },
      {
        id: 'TRN-PRG-002',
        code: 'PRG-102',
        name: 'عمر بن سلطان الدوسري',
        nationalId: '1087654321',
        phone: '0558762345',
        guardianName: 'سلطان بن إبراهيم الدوسري',
        guardianPhone: '0508762345',
        group: 'المجموعة أ (تطوير النظم)',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم طبياً - يرتدي نظارة مخصصة للشاشات',
        departmentId: 'programming',
        departmentName: 'البرمجة وتطوير الويب',
        evaluations: [
          {
            id: 'EVAL-PRG-03',
            date: '2026-11-18',
            title: 'تقييم تكامل واجهات API مع الواجهة الأمامية',
            practicalScore: 90,
            safetyScore: 94,
            maintenanceScore: 90,
            theoryScore: 88,
            totalScore: 91,
            noteType: 'technical',
            notes: 'إتقان جيد جداً للـ Asynchronous JavaScript والتعامل مع حالات الأخطاء البرمجية.',
            evaluator: 'م. أحمد النجار'
          }
        ]
      },
      {
        id: 'TRN-PRG-003',
        code: 'PRG-103',
        name: 'راشد بن عبدالله العتيبي',
        nationalId: '1076543210',
        phone: '0557653456',
        guardianName: 'عبدالله بن فهد العتيبي',
        guardianPhone: '0507653456',
        group: 'المجموعة ب (البرمجيات الخلفية)',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - تم التنبيه على وضعية الجلوس السليمة أمام الشاشة',
        departmentId: 'programming',
        departmentName: 'البرمجة وتطوير الويب',
        evaluations: [
          {
            id: 'EVAL-PRG-04',
            date: '2026-11-17',
            title: 'تقييم صيانة وتحديث خادم الاختبار',
            practicalScore: 82,
            safetyScore: 88,
            maintenanceScore: 85,
            theoryScore: 80,
            totalScore: 84,
            noteType: 'technical',
            notes: 'يحتاج لمزيد من التدريب العملي على أوامر Docker وإدارة الحاويات.',
            evaluator: 'م. أحمد النجار'
          }
        ]
      },
      {
        id: 'TRN-PRG-004',
        code: 'PRG-104',
        name: 'ياسر بن ناصر القحطاني',
        nationalId: '1065432109',
        phone: '0556544567',
        guardianName: 'ناصر بن علي القحطاني',
        guardianPhone: '0506544567',
        group: 'المجموعة ب (البرمجيات الخلفية)',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - ملتزم بتعليمات الحفاظ على كابلات المعمل',
        departmentId: 'programming',
        departmentName: 'البرمجة وتطوير الويب',
        evaluations: [
          {
            id: 'EVAL-PRG-05',
            date: '2026-11-16',
            title: 'تقييم أمني لاختبار اختراق الثغرات البرمجية',
            practicalScore: 92,
            safetyScore: 96,
            maintenanceScore: 94,
            theoryScore: 91,
            totalScore: 93,
            noteType: 'excellence',
            notes: 'مهارة فائقة في اكتشاف ثغرات SQL Injection وتصحيحها فورياً.',
            evaluator: 'م. أحمد النجار'
          }
        ]
      },
      {
        id: 'TRN-PRG-005',
        code: 'PRG-105',
        name: 'بدر بن سعود الحربي',
        nationalId: '1054321098',
        phone: '0555435678',
        guardianName: 'سعود بن حمد الحربي',
        guardianPhone: '0505435678',
        group: 'المجموعة أ (تطوير النظم)',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم - تم التنبيه على عدم إدخال مشروبات داخل معمل الحواسيب',
        departmentId: 'programming',
        departmentName: 'البرمجة وتطوير الويب',
        evaluations: [
          {
            id: 'EVAL-PRG-06',
            date: '2026-11-15',
            title: 'ملاحظة التزام بأنظمة السلامة في المعمل',
            practicalScore: 78,
            safetyScore: 70,
            maintenanceScore: 75,
            theoryScore: 82,
            totalScore: 76,
            noteType: 'safety',
            notes: 'تنبيه شفهي بضرورة إبقاء المشروبات خارج معمل الحواسيب للحفاظ على الأجهزة الكهربائية.',
            evaluator: 'م. أحمد النجار'
          }
        ]
      },
      {
        id: 'TRN-PRG-006',
        code: 'PRG-106',
        name: 'عبدالعزيز بن طارق المالكي',
        nationalId: '1043210987',
        phone: '0554326789',
        guardianName: 'طارق بن سالم المالكي',
        guardianPhone: '0504326789',
        group: 'المجموعة ب (البرمجيات الخلفية)',
        enrollmentDate: '2026-09-01',
        safetyNotes: 'سليم طبياً وجاهز للتدريب الفني',
        departmentId: 'programming',
        departmentName: 'البرمجة وتطوير الويب',
        evaluations: [
          {
            id: 'EVAL-PRG-07',
            date: '2026-11-14',
            title: 'تقييم برمجة هياكل البيانات',
            practicalScore: 86,
            safetyScore: 92,
            maintenanceScore: 88,
            theoryScore: 89,
            totalScore: 88,
            noteType: 'technical',
            notes: 'مستوى متقدم واستيعاب عميق للخوارزميات المعقدة.',
            evaluator: 'م. أحمد النجار'
          }
        ]
      }
    ],
    attendanceRecords: {
      '2026-11-20': {
        'TRN-PRG-001': 'present',
        'TRN-PRG-002': 'present',
        'TRN-PRG-003': 'late',
        'TRN-PRG-004': 'present',
        'TRN-PRG-005': 'present',
        'TRN-PRG-006': 'absent'
      },
      '2026-11-19': {
        'TRN-PRG-001': 'present',
        'TRN-PRG-002': 'present',
        'TRN-PRG-003': 'present',
        'TRN-PRG-004': 'present',
        'TRN-PRG-005': 'late',
        'TRN-PRG-006': 'present'
      },
      '2026-11-18': {
        'TRN-PRG-001': 'present',
        'TRN-PRG-002': 'present',
        'TRN-PRG-003': 'present',
        'TRN-PRG-004': 'present',
        'TRN-PRG-005': 'present',
        'TRN-PRG-006': 'present'
      }
    }
  };

  // إنشاء القسم وتسجيله في سجل الأقسام
  if (typeof window !== 'undefined') {
    if (!window.DepartmentModules) window.DepartmentModules = {};
    window.DepartmentModules['programming'] = programmingDepartmentData;

    if (window.DepartmentRegistry) {
      window.DepartmentRegistry.register(programmingDepartmentData);
    }
  }
})();

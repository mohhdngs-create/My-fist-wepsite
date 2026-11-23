/**
 * مصنع الأقسام التدريبية الديناميكية (Dynamic Department Generator)
 * يتيح لمدير النظام إضافة أقسام تدريبية جديدة ببياناتها ومهندسيها وعناوين الـ IP الخاصة بها
 */

(function () {
  class DynamicDepartmentFactory {
    static create(data) {
      const id = data.id || `dept-${Date.now()}`;
      const code = data.code || `WRK-${id.substring(0, 4).toUpperCase()}`;
      const authorizedIp = data.authorizedIp || '192.168.50.10';

      const config = {
        id: id,
        name: data.name,
        code: code,
        icon: data.icon || 'layers',
        badgeColor: data.badgeColor || '#059669',
        authorizedIp: authorizedIp,
        workshopName: data.workshopName || `ورشة / معمل ${data.name}`,
        building: data.building || 'مبنى التدريب التقني المتقدم - الجناح D',
        capacity: Number(data.capacity) || 20,
        engineer: {
          name: data.engineerName || 'المهندس المسؤول',
          email: data.engineerEmail || `${id}@vtc.edu.sa`,
          password: data.engineerPassword || 'dept123',
          title: data.engineerTitle || 'رئيس ورشة التدريب والتشغيل',
          phone: data.engineerPhone || '0550001122',
          badge: `مشرف ${code}`
        },
        description: data.description || 'قسم تدريبي مهني متخصص لإكساب المتدربين المهارات الحرفية والهندسية المتطورة.',
        competencies: data.competencies || [
          'التعامل الاحترافي مع المعدات والماكينات التخصصية',
          'تطبيق أسس ومعايير السلامة المهنية والصحة والبيئة (HSE)',
          'تنفيذ المشاريع التخصصية وفق المواصفات القياسية'
        ],
        equipment: data.equipment || [
          { id: 'EQ-01', name: 'محطة العمل والمعدة الرئيسية 01', status: 'operational', specs: 'معدة تدريبية معتمدة' },
          { id: 'EQ-02', name: 'أجهزة القياس والفحص الدقيق', status: 'operational', specs: 'معايرة قياسية' }
        ],
        trainees: data.trainees || [
          {
            id: `TRN-${id.substring(0, 3).toUpperCase()}-001`,
            code: `${code.substring(0, 3)}-01`,
            name: 'متدرب نموذجي تجريبي',
            nationalId: '1099999999',
            phone: '0559999999',
            guardianName: 'ولي أمر المتدرب',
            guardianPhone: '0509999999',
            group: 'المجموعة التأسيسية',
            enrollmentDate: new Date().toISOString().split('T')[0],
            safetyNotes: 'سليم طبياً وجاهز للتدريب الفني',
            departmentId: id,
            departmentName: data.name,
            evaluations: [
              {
                id: `EVAL-${id}-01`,
                date: new Date().toISOString().split('T')[0],
                title: 'التقييم الفني الأولي للقسم الجديد',
                practicalScore: 90,
                safetyScore: 95,
                maintenanceScore: 90,
                theoryScore: 88,
                totalScore: 91,
                noteType: 'excellence',
                notes: 'بداية مشجعة والتزام واضح بالتعليمات الفنية.',
                evaluator: data.engineerName || 'المهندس المسؤول'
              }
            ]
          }
        ],
        attendanceRecords: data.attendanceRecords || {}
      };

      const deptInstance = new window.DepartmentBase(config);

      // حفظ وتسجيل القسم في السجل العام
      if (window.DepartmentRegistry) {
        window.DepartmentRegistry.register(deptInstance);
      }

      return deptInstance;
    }
  }

  if (typeof window !== 'undefined') {
    window.DynamicDepartmentFactory = DynamicDepartmentFactory;
  }
})();

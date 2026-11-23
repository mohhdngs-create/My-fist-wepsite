/**
 * DepartmentRegistry - سجل ومنسق الأقسام التدريبية
 * يقوم بإدارة وتنسيق كافة ملفات ووحدات الأقسام
 */

(function () {
  class DepartmentRegistryClass {
    constructor() {
      this.departments = new Map();
      this.listeners = [];
    }

    // تسجيل قسم في النظام
    register(deptData) {
      if (!deptData || !deptData.id) {
        console.error('Invalid department data provided to registry:', deptData);
        return null;
      }

      let instance;
      if (deptData instanceof window.DepartmentBase) {
        instance = deptData;
      } else {
        instance = new window.DepartmentBase(deptData);
      }

      this.departments.set(instance.id, instance);
      this.notifyListeners('department_registered', instance);
      return instance;
    }

    // جلب قسم بواسطة المعرّف
    getDepartment(id) {
      return this.departments.get(id) || null;
    }

    // جلب كافة الأقسام المسجلة
    getAllDepartments() {
      return Array.from(this.departments.values());
    }

    // جلب قسم بواسطة كود الورشة
    getDepartmentByCode(code) {
      if (!code) return null;
      const c = code.trim().toLowerCase();
      return this.getAllDepartments().find(d => d.code.toLowerCase() === c) || null;
    }

    // جلب قسم بواسطة بريد المهندس
    getDepartmentByEngineerEmail(email) {
      if (!email) return null;
      const cleanEmail = email.trim().toLowerCase();
      return this.getAllDepartments().find(d => 
        d.engineer && d.engineer.email && d.engineer.email.toLowerCase() === cleanEmail
      ) || null;
    }

    // البحث عن متدرب عبر كافة الأقسام (لبوابة أولياء الأمور)
    findTraineeGlobally(query) {
      if (!query) return null;
      const cleanQuery = String(query).trim().toLowerCase();

      for (const dept of this.departments.values()) {
        const trainee = dept.getTrainee(cleanQuery);
        if (trainee) {
          return {
            trainee,
            department: dept,
            stats: dept.getTraineeAttendanceStats(trainee.id)
          };
        }
      }
      return null;
    }

    // البحث عن جميع المتدربين عبر المركز
    getAllTrainees() {
      const all = [];
      for (const dept of this.departments.values()) {
        dept.getTrainees().forEach(t => {
          all.push({
            ...t,
            departmentId: dept.id,
            departmentName: dept.name,
            departmentCode: dept.code
          });
        });
      }
      return all;
    }

    // إضافة مستمع للتغييرات
    subscribe(callback) {
      this.listeners.push(callback);
      return () => {
        this.listeners = this.listeners.filter(cb => cb !== callback);
      };
    }

    notifyListeners(event, data) {
      this.listeners.forEach(cb => {
        try {
          cb(event, data);
        } catch (e) {
          console.error('Error in DepartmentRegistry listener:', e);
        }
      });
    }
  }

  // تصدير نسخة عامة
  if (typeof window !== 'undefined') {
    window.DepartmentRegistry = new DepartmentRegistryClass();
  }
})();

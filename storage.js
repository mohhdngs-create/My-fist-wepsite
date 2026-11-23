/**
 * StorageManager - إدارة التخزين الدائم واسترجاع بيانات الأقسام
 * يدعم الحفظ الدائم في ملف القرص (data/vtc_data.json) عبر خادم النظام مع مزامنة التخزين المحلي (LocalStorage)
 */

(function () {
  const STORAGE_KEYS = {
    DEPARTMENTS: 'vtc_departments_data_v1',
    AUDIT_LOG: 'vtc_audit_log_v1',
    SIMULATED_IP: 'vtc_simulated_client_ip_v1',
    SESSION: 'vtc_current_session_v1'
  };

  class StorageManagerClass {
    constructor() {
      this.isInitialized = false;
      this.isServerConnected = false;
      this.saveTimeout = null;
    }

    // تهيئة البيانات وتحميلها في DepartmentRegistry
    async init() {
      if (this.isInitialized) return;

      // 1. محاولة الجلب أولاً من الخادم الدائم (data/vtc_data.json)
      let serverData = null;
      try {
        const resp = await fetch('/api/data');
        if (resp.ok) {
          const json = await resp.json();
          if (json && Object.keys(json).length > 0) {
            serverData = json;
            this.isServerConnected = true;
          }
        }
      } catch (e) {
        // لا يعمل عبر خادم HTTP (مثلاً فتح مباشر file://)
        this.isServerConnected = false;
      }

      const storedDepartments = serverData || this.loadDepartmentsLocal();
      if (storedDepartments && Object.keys(storedDepartments).length > 0) {
        // تسجيل الأقسام في السجل المركزي
        Object.values(storedDepartments).forEach(deptData => {
          window.DepartmentRegistry.register(deptData);
        });
        // تحديث التخزين المحلي ليكون متطابقاً
        this.saveDepartmentsLocal(storedDepartments);
      } else {
        // تحميل من الموديولات المعرفة مسبقاً (Seed Data)
        if (window.DepartmentModules) {
          Object.values(window.DepartmentModules).forEach(deptData => {
            window.DepartmentRegistry.register(deptData);
          });
          this.saveAll();
        }
      }

      this.isInitialized = true;
      this.updateStorageIndicator();
    }

    updateStorageIndicator() {
      const badge = document.getElementById('storageStatusBadge');
      if (badge) {
        if (this.isServerConnected) {
          badge.innerHTML = '<span>🟢 الحفظ الدائم مفعل (ملفات القرص متصلة)</span>';
          badge.className = 'dept-meta-pill verified-ip';
        } else {
          badge.innerHTML = '<span>💾 الحفظ الدائم محلي (متصفح الويب)</span>';
          badge.className = 'dept-meta-pill';
        }
      }
    }

    // جلب بيانات الأقسام من LocalStorage
    loadDepartmentsLocal() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    // حفظ محلي في LocalStorage
    saveDepartmentsLocal(payload) {
      try {
        localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(payload));
      } catch (e) {}
    }

    // حفظ قسم معين بصورة دائمة
    saveDepartment(departmentInstance) {
      const allDepts = window.DepartmentRegistry.getAllDepartments();
      const payload = {};
      allDepts.forEach(dept => {
        payload[dept.id] = {
          id: dept.id,
          name: dept.name,
          code: dept.code,
          icon: dept.icon,
          badgeColor: dept.badgeColor,
          authorizedIp: dept.authorizedIp,
          workshopName: dept.workshopName,
          building: dept.building,
          capacity: dept.capacity,
          engineer: dept.engineer,
          description: dept.description,
          competencies: dept.competencies,
          equipment: dept.equipment,
          trainees: dept.trainees,
          attendanceRecords: dept.attendanceRecords
        };
      });

      this.saveDepartmentsLocal(payload);
      this.syncToServer(payload);
    }

    // حفظ كافة الأقسام دفعة واحدة بصورة دائمة على القرص
    saveAll() {
      const allDepts = window.DepartmentRegistry.getAllDepartments();
      const payload = {};
      allDepts.forEach(dept => {
        payload[dept.id] = {
          id: dept.id,
          name: dept.name,
          code: dept.code,
          icon: dept.icon,
          badgeColor: dept.badgeColor,
          authorizedIp: dept.authorizedIp,
          workshopName: dept.workshopName,
          building: dept.building,
          capacity: dept.capacity,
          engineer: dept.engineer,
          description: dept.description,
          competencies: dept.competencies,
          equipment: dept.equipment,
          trainees: dept.trainees,
          attendanceRecords: dept.attendanceRecords
        };
      });

      this.saveDepartmentsLocal(payload);
      this.syncToServer(payload);
    }

    // مزامنة فورية دائمة مع خادم الويب (POST /api/save) لكتابة ملف data/vtc_data.json على القرص
    syncToServer(payload) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(async () => {
        try {
          const resp = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload, null, 2)
          });
          if (resp.ok) {
            this.isServerConnected = true;
          }
        } catch (e) {
          // الخادم غير متصل حالياً
        }
        this.updateStorageIndicator();
      }, 200);
    }

    // استعادة ضبط المصنع للبيانات الافتراضية
    resetToFactoryDefaults() {
      try {
        localStorage.removeItem(STORAGE_KEYS.DEPARTMENTS);
        localStorage.removeItem(STORAGE_KEYS.AUDIT_LOG);
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        localStorage.removeItem('vtc_passwords_v1');
        window.location.reload();
      } catch (e) {}
    }

    // تصدير نسخة احتياطية بصيغة JSON
    exportBackup() {
      const allDepts = window.DepartmentRegistry.getAllDepartments();
      const backup = {
        exportedAt: new Date().toISOString(),
        departments: allDepts,
        passwords: window.PasswordManager ? window.PasswordManager.getAllPasswords() : {},
        auditLog: this.getAuditLog()
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vtc_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    // إدارة عنوان الـ IP المحاكى
    getSimulatedIp() {
      try {
        return localStorage.getItem(STORAGE_KEYS.SIMULATED_IP) || '192.168.10.25';
      } catch (e) {
        return '192.168.10.25';
      }
    }

    setSimulatedIp(ip) {
      try {
        localStorage.setItem(STORAGE_KEYS.SIMULATED_IP, ip);
      } catch (e) {}
    }

    // سجل الأمان Audit Log
    getAuditLog() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    saveAuditLog(logs) {
      try {
        localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(logs));
      } catch (e) {}
    }

    // إدارة الجلسة الحالية
    getCurrentSession() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    setCurrentSession(sessionData) {
      try {
        if (!sessionData) {
          localStorage.removeItem(STORAGE_KEYS.SESSION);
        } else {
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
        }
      } catch (e) {}
    }
  }

  if (typeof window !== 'undefined') {
    window.StorageManager = new StorageManagerClass();
  }
})();

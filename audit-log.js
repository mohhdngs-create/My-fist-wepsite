/**
 * AuditLog - سجل الرقابة والأمان لمركز التدريب المهني
 * يسجل كافة محاولات تسجيل الدخول، وفحوصات تطابق عنوان الـ IP، ومحاولات الاختراق أو الدخول من شبكات غير مصرحة
 */

(function () {
  class AuditLogManager {
    constructor() {
      this.logs = [];
      this.init();
    }

    init() {
      if (window.StorageManager) {
        this.logs = window.StorageManager.getAuditLog();
      }
      if (!this.logs || this.logs.length === 0) {
        // إضافة سجلات أولية تجريبية للتوضيح
        this.logs = [
          {
            id: 'LOG-001',
            timestamp: new Date(Date.now() - 3600000 * 4).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + new Date().toISOString().split('T')[0],
            event: 'LOGIN_SUCCESS',
            userName: 'م. أحمد النجار',
            email: 'eng.programming@vtc.edu.sa',
            departmentId: 'programming',
            departmentName: 'البرمجة وتطوير الويب',
            clientIp: '192.168.10.25',
            authorizedIp: '192.168.10.25',
            isMatch: true,
            statusText: 'دخول ناجح - IP مصرح ومطابق لشبكة المعمل'
          },
          {
            id: 'LOG-002',
            timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + new Date().toISOString().split('T')[0],
            event: 'SECURITY_BLOCKED',
            userName: 'م. محمود عبد الرحمن',
            email: 'eng.turning@vtc.edu.sa',
            departmentId: 'turning-lathe',
            departmentName: 'الخراطة والتشغيل الميكانيكي',
            clientIp: '10.0.99.12',
            authorizedIp: '192.168.20.40',
            isMatch: false,
            statusText: 'محظور أمنياً - محاولة دخول من شبكة خارجية غير مطابقة لورشة الخراطة'
          }
        ];
        this.persist();
      }
    }

    logEvent(entry) {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const record = {
        id: `LOG-${Date.now()}`,
        timestamp: `${timeStr} ${dateStr}`,
        event: entry.event, // LOGIN_SUCCESS | SECURITY_BLOCKED | BAD_CREDENTIALS | ADMIN_LOGIN
        userName: entry.userName || 'مستخدم غير معروف',
        email: entry.email || '—',
        departmentId: entry.departmentId || '—',
        departmentName: entry.departmentName || '—',
        clientIp: entry.clientIp || 'غير محدد',
        authorizedIp: entry.authorizedIp || 'غير محدد',
        isMatch: entry.isMatch !== undefined ? entry.isMatch : false,
        statusText: entry.statusText || ''
      };

      this.logs.unshift(record);
      // الاحتفاظ بآخر 100 سجل فقط
      if (this.logs.length > 100) {
        this.logs = this.logs.slice(0, 100);
      }
      this.persist();
      return record;
    }

    persist() {
      if (window.StorageManager) {
        window.StorageManager.saveAuditLog(this.logs);
      }
    }

    getLogs() {
      return this.logs;
    }

    clearLogs() {
      this.logs = [];
      this.persist();
    }
  }

  if (typeof window !== 'undefined') {
    window.AuditLog = new AuditLogManager();
  }
})();

/**
 * AuthManager - نظام المصادقة وفحص الأمان والتحقق من كلمات المرور وعنوان الـ IP
 * يقرأ كلمات المرور من مدير كلمات المرور المرتبط بملف 'password'
 */

(function () {
  class AuthManagerClass {
    constructor() {
      this.currentSession = null;
      this.init();
    }

    init() {
      if (window.StorageManager) {
        this.currentSession = window.StorageManager.getCurrentSession();
      }
    }

    // جلب عنوان IP المحاكى الحالي
    getCurrentClientIp() {
      return window.StorageManager ? window.StorageManager.getSimulatedIp() : '192.168.10.25';
    }

    // تعيين عنوان IP المحاكى
    setClientIp(ip) {
      if (window.StorageManager) {
        window.StorageManager.setSimulatedIp(ip);
      }
    }

    /**
     * تسجيل دخول مهندس القسم
     * @param {string} email - البريد الإلكتروني للمهندس
     * @param {string} password - كلمة المرور
     * @param {string} simulatedIp - عنوان الـ IP المراد اختباره
     */
    loginEngineer(email, password, simulatedIp) {
      const clientIp = (simulatedIp || this.getCurrentClientIp()).trim();
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      // البحث عن القسم المرتبط ببريد هذا المهندس
      const department = window.DepartmentRegistry.getDepartmentByEngineerEmail(cleanEmail);

      if (!department) {
        const errorMsg = 'البريد الإلكتروني غير مسجل لأي مهندس قسم في المركز.';
        if (window.AuditLog) {
          window.AuditLog.logEvent({
            event: 'BAD_CREDENTIALS',
            userName: 'غير معروف',
            email: cleanEmail,
            clientIp: clientIp,
            statusText: 'محاولة تسجيل دخول ببريد غير مسجل'
          });
        }
        return {
          success: false,
          errorType: 'INVALID_CREDENTIALS',
          message: errorMsg
        };
      }

      // التحقق من صحة كلمة المرور من ملف 'password'
      let isPasswordValid = false;
      if (window.PasswordManager) {
        isPasswordValid = window.PasswordManager.verifyEngineerPassword(cleanEmail, cleanPassword);
      } else {
        isPasswordValid = (department.engineer.password === cleanPassword);
      }

      if (!isPasswordValid) {
        const errorMsg = 'كلمة المرور غير صحيحة، يرجى مراجعة ملف كلمات المرور وإعادة المحاولة.';
        if (window.AuditLog) {
          window.AuditLog.logEvent({
            event: 'BAD_CREDENTIALS',
            userName: department.engineer.name,
            email: cleanEmail,
            departmentId: department.id,
            departmentName: department.name,
            clientIp: clientIp,
            authorizedIp: department.authorizedIp,
            statusText: 'فشل كلمة المرور لمهندس القسم'
          });
        }
        return {
          success: false,
          errorType: 'INVALID_CREDENTIALS',
          message: errorMsg
        };
      }

      // التحقق الصارم من عنوان الـ IP المخصص لورشة / معمل هذا القسم
      const authorizedIp = (department.authorizedIp || '').trim();
      const isIpMatched = (clientIp === authorizedIp);

      if (!isIpMatched) {
        // نص التنبيه الأمني المطلوب بالضبط
        const exactSecurityMessage = 'عذراً، غير مصرح لك بالدخول من هذا الجهاز أو الشبكة (عنوان IP غير مطابق للقسم)';

        if (window.AuditLog) {
          window.AuditLog.logEvent({
            event: 'SECURITY_BLOCKED',
            userName: department.engineer.name,
            email: cleanEmail,
            departmentId: department.id,
            departmentName: department.name,
            clientIp: clientIp,
            authorizedIp: authorizedIp,
            isMatch: false,
            statusText: 'محاولة دخول مرفوضة - الـ IP غير مطابق لمعمل القسم'
          });
        }

        return {
          success: false,
          errorType: 'IP_MISMATCH',
          message: exactSecurityMessage,
          details: {
            engineerName: department.engineer.name,
            departmentName: department.name,
            workshopName: department.workshopName,
            clientIp: clientIp,
            authorizedIp: authorizedIp
          }
        };
      }

      // في حال تطابق البيانات وتطابق الـ IP
      const sessionData = {
        role: 'engineer',
        engineer: {
          name: department.engineer.name,
          email: department.engineer.email,
          title: department.engineer.title,
          badge: department.engineer.badge
        },
        departmentId: department.id,
        departmentName: department.name,
        departmentCode: department.code,
        clientIp: clientIp,
        loginTime: new Date().toISOString()
      };

      this.currentSession = sessionData;
      if (window.StorageManager) {
        window.StorageManager.setCurrentSession(sessionData);
      }

      if (window.AuditLog) {
        window.AuditLog.logEvent({
          event: 'LOGIN_SUCCESS',
          userName: department.engineer.name,
          email: cleanEmail,
          departmentId: department.id,
          departmentName: department.name,
          clientIp: clientIp,
          authorizedIp: authorizedIp,
          isMatch: true,
          statusText: 'تم التحقق من الصلاحية ومطابقة عنوان IP شبكة القسم بنجاح'
        });
      }

      return {
        success: true,
        session: sessionData,
        department: department
      };
    }

    /**
     * تسجيل دخول المتدرب / المستخدم بواسطة كود المتدرب أو الهوية وكلمة المرور
     * @param {string} identifier - كود المتدرب أو رقم الهوية
     * @param {string} password - كلمة المرور المحفوظة في ملف password
     */
    loginUser(identifier, password) {
      const cleanId = String(identifier || '').trim();
      const cleanPass = String(password || '').trim();

      if (!cleanId || !cleanPass) {
        return {
          success: false,
          message: 'يرجى إدخال الكود أو رقم الهوية وكلمة المرور.'
        };
      }

      // البحث عن المتدرب عبر المركز
      const traineeData = window.DepartmentRegistry.findTraineeGlobally(cleanId);
      if (!traineeData) {
        return {
          success: false,
          message: 'لم يتم العثور على المتدرب، تأكد من صحة الكود أو رقم الهوية.'
        };
      }

      // فحص كلمة المرور من ملف 'password'
      let isPassValid = false;
      if (window.PasswordManager) {
        isPassValid = window.PasswordManager.verifyUserPassword(traineeData.trainee.code, cleanPass) ||
                      window.PasswordManager.verifyUserPassword(traineeData.trainee.nationalId, cleanPass);
      } else {
        isPassValid = (cleanPass === 'user101' || cleanPass === '123456');
      }

      if (!isPassValid) {
        if (window.AuditLog) {
          window.AuditLog.logEvent({
            event: 'BAD_CREDENTIALS',
            userName: traineeData.trainee.name,
            email: traineeData.trainee.code,
            departmentId: traineeData.department.id,
            departmentName: traineeData.department.name,
            clientIp: this.getCurrentClientIp(),
            statusText: 'فشل كلمة مرور المتدرب'
          });
        }
        return {
          success: false,
          message: 'عذراً، كلمة المرور أو كود المتدرب غير صحيح (راجع ملف password).'
        };
      }

      // تسجيل جلسة المتدرب
      const sessionData = {
        role: 'trainee',
        trainee: {
          id: traineeData.trainee.id,
          code: traineeData.trainee.code,
          name: traineeData.trainee.name,
          nationalId: traineeData.trainee.nationalId,
          group: traineeData.trainee.group
        },
        departmentId: traineeData.department.id,
        departmentName: traineeData.department.name,
        loginTime: new Date().toISOString()
      };

      this.currentSession = sessionData;
      if (window.StorageManager) {
        window.StorageManager.setCurrentSession(sessionData);
      }

      if (window.AuditLog) {
        window.AuditLog.logEvent({
          event: 'LOGIN_SUCCESS',
          userName: traineeData.trainee.name,
          email: traineeData.trainee.code,
          departmentId: traineeData.department.id,
          departmentName: traineeData.department.name,
          clientIp: this.getCurrentClientIp(),
          isMatch: true,
          statusText: 'تسجيل دخول ناجح للمتدرب بكلمة المرور'
        });
      }

      return {
        success: true,
        session: sessionData,
        traineeResult: traineeData
      };
    }

    /**
     * تسجيل دخول مدير المركز العام (System Admin)
     */
    loginAdmin(email, password) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      let isMatch = false;
      if (window.PasswordManager) {
        isMatch = window.PasswordManager.verifyAdminPassword(cleanEmail, cleanPassword);
      } else {
        isMatch = (cleanEmail === 'admin@vtc.edu.sa' && cleanPassword === 'admin123');
      }

      if (isMatch) {
        const sessionData = {
          role: 'admin',
          engineer: {
            name: 'إدارة مركز التدريب المهني',
            email: 'admin@vtc.edu.sa',
            title: 'مدير عام المركز والأنظمة التقنية',
            badge: 'المشرف الإداري العام'
          },
          departmentId: 'all',
          departmentName: 'كافة الأقسام التدريبية',
          departmentCode: 'HQ-ADMIN',
          clientIp: this.getCurrentClientIp(),
          loginTime: new Date().toISOString()
        };

        this.currentSession = sessionData;
        if (window.StorageManager) {
          window.StorageManager.setCurrentSession(sessionData);
        }

        if (window.AuditLog) {
          window.AuditLog.logEvent({
            event: 'ADMIN_LOGIN',
            userName: 'مدير المركز العام',
            email: cleanEmail,
            departmentId: 'all',
            departmentName: 'الإدارة المركزية',
            clientIp: this.getCurrentClientIp(),
            authorizedIp: 'أي شبكة (امتياز إداري)',
            isMatch: true,
            statusText: 'تسجيل دخول الإدارة المركزية بكلمة المرور'
          });
        }

        return {
          success: true,
          session: sessionData
        };
      }

      return {
        success: false,
        errorType: 'INVALID_CREDENTIALS',
        message: 'بيانات اعتماد الإدارة أو كلمة المرور غير صحيحة.'
      };
    }

    // تسجيل الخروج
    logout() {
      this.currentSession = null;
      if (window.StorageManager) {
        window.StorageManager.setCurrentSession(null);
      }
    }

    // فحص ما إذا كان المستخدم مسجلاً حالياً
    isAuthenticated() {
      return !!this.currentSession;
    }

    getSession() {
      return this.currentSession;
    }
  }

  if (typeof window !== 'undefined') {
    window.AuthManager = new AuthManagerClass();
  }
})();

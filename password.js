/**
 * password.js - واجهة الوصول لملف كلمات المرور (password)
 * يقرأ مباشرة من الملف المنفصل 'password' أو يوفر النسخة الاحتياطية المتطابقة
 */

(function () {
  const defaultPasswords = {
    "admin": {
      "admin@vtc.edu.sa": { "password": "admin123", "name": "إدارة مركز التدريب المهني", "role": "admin" }
    },
    "engineers": {
      "eng.programming@vtc.edu.sa": { "password": "prog123", "name": "م. أحمد النجار", "department": "programming", "authorizedIp": "192.168.10.25" },
      "eng.turning@vtc.edu.sa": { "password": "turn123", "name": "م. محمود عبد الرحمن", "department": "turning-lathe", "authorizedIp": "192.168.20.40" },
      "eng.cnc@vtc.edu.sa": { "password": "cnc123", "name": "م. طارق الصاوي", "department": "cnc", "authorizedIp": "192.168.30.55" },
      "eng.plc@vtc.edu.sa": { "password": "plc123", "name": "م. سارة القحطاني", "department": "electricity-plc", "authorizedIp": "192.168.40.70" }
    },
    "users": {
      "PRG-101": { "password": "user101", "name": "فيصل بن خالد الشمري", "nationalId": "1098765432", "department": "programming" },
      "1098765432": { "password": "user101", "name": "فيصل بن خالد الشمري", "code": "PRG-101", "department": "programming" },
      "PRG-102": { "password": "user102", "name": "عمر بن سلطان الدوسري", "nationalId": "1087654321", "department": "programming" },
      "1087654321": { "password": "user102", "name": "عمر بن سلطان الدوسري", "code": "PRG-102", "department": "programming" },
      "PRG-103": { "password": "user103", "name": "راشد بن عبدالله العتيبي", "nationalId": "1076543210", "department": "programming" },
      "1076543210": { "password": "user103", "name": "راشد بن عبدالله العتيبي", "code": "PRG-103", "department": "programming" },
      "PRG-104": { "password": "user104", "name": "ياسر بن ناصر القحطاني", "nationalId": "1065432109", "department": "programming" },
      "1065432109": { "password": "user104", "name": "ياسر بن ناصر القحطاني", "code": "PRG-104", "department": "programming" },
      "PRG-105": { "password": "user105", "name": "بدر بن سعود الحربي", "nationalId": "1054321098", "department": "programming" },
      "1054321098": { "password": "user105", "name": "بدر بن سعود الحربي", "code": "PRG-105", "department": "programming" },
      "PRG-106": { "password": "user106", "name": "عبدالعزيز بن طارق المالكي", "nationalId": "1043210987", "department": "programming" },
      "1043210987": { "password": "user106", "name": "عبدالعزيز بن طارق المالكي", "code": "PRG-106", "department": "programming" },
      "LAT-201": { "password": "user201", "name": "سلطان بن تركي الحربي", "nationalId": "1091234567", "department": "turning-lathe" },
      "1091234567": { "password": "user201", "name": "سلطان بن تركي الحربي", "code": "LAT-201", "department": "turning-lathe" },
      "LAT-202": { "password": "user202", "name": "فهد بن منصور السبيعي", "nationalId": "1092345678", "department": "turning-lathe" },
      "1092345678": { "password": "user202", "name": "فهد بن منصور السبيعي", "code": "LAT-202", "department": "turning-lathe" },
      "LAT-203": { "password": "user203", "name": "نايف بن مشعل المطيري", "nationalId": "1093456789", "department": "turning-lathe" },
      "1093456789": { "password": "user203", "name": "نايف بن مشعل المطيري", "code": "LAT-203", "department": "turning-lathe" },
      "LAT-204": { "password": "user204", "name": "خالد بن زياد الغامدي", "nationalId": "1094567890", "department": "turning-lathe" },
      "1094567890": { "password": "user204", "name": "خالد بن زياد الغامدي", "code": "LAT-204", "department": "turning-lathe" },
      "LAT-205": { "password": "user205", "name": "سعود بن وليد الزهراني", "nationalId": "1095678901", "department": "turning-lathe" },
      "1095678901": { "password": "user205", "name": "سعود بن وليد الزهراني", "code": "LAT-205", "department": "turning-lathe" },
      "LAT-206": { "password": "user206", "name": "ريان بن فيصل الشهري", "nationalId": "1096789012", "department": "turning-lathe" },
      "1096789012": { "password": "user206", "name": "ريان بن فيصل الشهري", "code": "LAT-206", "department": "turning-lathe" },
      "CNC-301": { "password": "user301", "name": "عبدالله بن عادل القاسم", "nationalId": "1097890123", "department": "cnc" },
      "1097890123": { "password": "user301", "name": "عبدالله بن عادل القاسم", "code": "CNC-301", "department": "cnc" },
      "CNC-302": { "password": "user302", "name": "محمد بن هشام القرني", "nationalId": "1098901234", "department": "cnc" },
      "1098901234": { "password": "user302", "name": "محمد بن هشام القرني", "code": "CNC-302", "department": "cnc" },
      "CNC-303": { "password": "user303", "name": "إبراهيم بن صالح الغامدي", "nationalId": "1099012345", "department": "cnc" },
      "1099012345": { "password": "user303", "name": "إبراهيم بن صالح الغامدي", "code": "CNC-303", "department": "cnc" },
      "CNC-304": { "password": "user304", "name": "مازن بن ناصر الشهراني", "nationalId": "1080123456", "department": "cnc" },
      "1080123456": { "password": "user304", "name": "مازن بن ناصر الشهراني", "code": "CNC-304", "department": "cnc" },
      "CNC-305": { "password": "user305", "name": "حمزة بن عثمان الأنصاري", "nationalId": "1081234567", "department": "cnc" },
      "1081234567": { "password": "user305", "name": "حمزة بن عثمان الأنصاري", "code": "CNC-305", "department": "cnc" },
      "CNC-306": { "password": "user306", "name": "طلال بن فهد السبيعي", "nationalId": "1082345678", "department": "cnc" },
      "1082345678": { "password": "user306", "name": "طلال بن فهد السبيعي", "code": "CNC-306", "department": "cnc" },
      "PLC-401": { "password": "user401", "name": "حاتم بن سعد الرويلي", "nationalId": "1071234567", "department": "electricity-plc" },
      "1071234567": { "password": "user401", "name": "حاتم بن سعد الرويلي", "code": "PLC-401", "department": "electricity-plc" },
      "PLC-402": { "password": "user402", "name": "نواف بن عبدالمحسن العتيبي", "nationalId": "1072345678", "department": "electricity-plc" },
      "1072345678": { "password": "user402", "name": "نواف بن عبدالمحسن العتيبي", "code": "PLC-402", "department": "electricity-plc" },
      "PLC-403": { "password": "user403", "name": "يوسف بن ماجد الشهيل", "nationalId": "1073456789", "department": "electricity-plc" },
      "1073456789": { "password": "user403", "name": "يوسف بن ماجد الشهيل", "code": "PLC-403", "department": "electricity-plc" },
      "PLC-404": { "password": "user404", "name": "منصور بن فايز الدوسري", "nationalId": "1074567890", "department": "electricity-plc" },
      "1074567890": { "password": "user404", "name": "منصور بن فايز الدوسري", "code": "PLC-404", "department": "electricity-plc" },
      "PLC-405": { "password": "user405", "name": "عبدالرحمن بن بدر العنزي", "nationalId": "1075678901", "department": "electricity-plc" },
      "1075678901": { "password": "user405", "name": "عبدالرحمن بن بدر العنزي", "code": "PLC-405", "department": "electricity-plc" },
      "PLC-406": { "password": "user406", "name": "زياد بن هشام السليمان", "nationalId": "1076789012", "department": "electricity-plc" },
      "1076789012": { "password": "user406", "name": "زياد بن هشام السليمان", "code": "PLC-406", "department": "electricity-plc" }
    }
  };

  class PasswordManagerClass {
    constructor() {
      this.passwords = defaultPasswords;
      this.loadFromStorageOrServer();
    }

    async loadFromStorageOrServer() {
      // 1. محاولة الجلب من ملف 'password' عبر الخادم
      try {
        const resp = await fetch('password');
        if (resp.ok) {
          const data = await resp.json();
          this.passwords = data;
          this.saveLocal();
          return;
        }
      } catch (e) {
        // fetch not available (e.g. file://)
      }

      // 2. التحقق من التخزين المحلي
      try {
        const stored = localStorage.getItem('vtc_passwords_v1');
        if (stored) {
          this.passwords = JSON.parse(stored);
        } else {
          this.saveLocal();
        }
      } catch (e) {}
    }

    saveLocal() {
      try {
        localStorage.setItem('vtc_passwords_v1', JSON.stringify(this.passwords));
      } catch (e) {}
    }

    // حفظ كلمة مرور جديدة وإرسالها للملف password عبر الخادم
    async setPassword(category, identifier, password, extraData = {}) {
      if (!this.passwords[category]) {
        this.passwords[category] = {};
      }
      this.passwords[category][identifier] = {
        password: password,
        ...extraData
      };
      this.saveLocal();

      // إرسال تحديث للخادم لحفظه في ملف 'password' الفعلي على القرص
      try {
        await fetch('/api/passwords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.passwords)
        });
      } catch (e) {}
    }

    // التحقق من كلمة مرور مستخدم (متدرب)
    verifyUserPassword(identifier, password) {
      if (!identifier || !password) return false;
      const cleanId = String(identifier).trim();
      const cleanPass = String(password).trim();

      const userEntry = this.passwords.users[cleanId];
      if (userEntry) {
        const storedPass = typeof userEntry === 'string' ? userEntry : userEntry.password;
        return storedPass === cleanPass;
      }
      return false;
    }

    // التحقق من كلمة مرور مهندس
    verifyEngineerPassword(email, password) {
      if (!email || !password) return false;
      const cleanEmail = String(email).trim().toLowerCase();
      const cleanPass = String(password).trim();

      const engEntry = this.passwords.engineers[cleanEmail];
      if (engEntry) {
        const storedPass = typeof engEntry === 'string' ? engEntry : engEntry.password;
        return storedPass === cleanPass;
      }
      return false;
    }

    // التحقق من كلمة مرور الإدارة
    verifyAdminPassword(email, password) {
      if (!email || !password) return false;
      const cleanEmail = String(email).trim().toLowerCase();
      const cleanPass = String(password).trim();

      const adminEntry = this.passwords.admin[cleanEmail];
      if (adminEntry) {
        const storedPass = typeof adminEntry === 'string' ? adminEntry : adminEntry.password;
        return storedPass === cleanPass;
      }
      return cleanEmail === 'admin@vtc.edu.sa' && cleanPass === 'admin123';
    }

    getAllPasswords() {
      return this.passwords;
    }
  }

  if (typeof window !== 'undefined') {
    window.PasswordManager = new PasswordManagerClass();
  }
})();

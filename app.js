/**
 * App.js - المحرك الرئيسي لنظام إدارة مركز التدريب المهني
 * يدعم الحفظ الدائم (Permanent Storage)، تسجيل الدخول بكلمات المرور للمستخدمين والمهندسين والإدارة،
 * والربط مع ملف كلمات المرور المنفصل 'password'.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. تهيئة النظام والبيانات المخزنة الدائمة
  if (window.StorageManager) {
    await window.StorageManager.init();
  }

  // المتغيرات العامة لحالة التطبيق
  let currentActiveDepartment = null;
  let currentSelectedAttendanceDate = new Date().toISOString().split('T')[0];
  let stagedAttendanceChanges = {};

  // عناصر واجهة المستخدم الرئيسية
  const views = {
    login: document.getElementById('view-login'),
    dashboard: document.getElementById('view-department-dashboard'),
    portal: document.getElementById('view-trainee-parent-portal'),
    admin: document.getElementById('view-admin-dashboard')
  };

  const navTabs = {
    login: document.getElementById('tabNavLogin'),
    dashboard: document.getElementById('tabNavDashboard'),
    portal: document.getElementById('tabNavPortal'),
    admin: document.getElementById('tabNavAdmin')
  };

  const userSessionBadge = document.getElementById('userSessionBadge');
  const sessionUserName = document.getElementById('sessionUserName');
  const sessionDeptBadge = document.getElementById('sessionDeptBadge');
  const btnLogout = document.getElementById('btnLogout');

  // عناصر محاكي الـ IP
  const clientIpInput = document.getElementById('clientIpInput');
  const quickIpButtons = document.querySelectorAll('.btn-ip-quick[data-ip]');

  // تبويبات نوع تسجيل الدخول
  const tabLoginTypeEngineer = document.getElementById('tabLoginTypeEngineer');
  const tabLoginTypeUser = document.getElementById('tabLoginTypeUser');
  const tabLoginTypeAdmin = document.getElementById('tabLoginTypeAdmin');

  const engineerLoginSection = document.getElementById('engineerLoginSection');
  const userLoginSection = document.getElementById('userLoginSection');
  const adminLoginSection = document.getElementById('adminLoginSection');

  // نماذج تسجيل الدخول
  const engineerLoginForm = document.getElementById('engineerLoginForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const securityAlertBox = document.getElementById('securityAlertBox');
  const detectedIpDisplay = document.getElementById('detectedIpDisplay');
  const expectedIpDisplay = document.getElementById('expectedIpDisplay');

  const userLoginForm = document.getElementById('userLoginForm');
  const userLoginCode = document.getElementById('userLoginCode');
  const userLoginPassword = document.getElementById('userLoginPassword');

  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminEmail = document.getElementById('adminEmail');
  const adminPassword = document.getElementById('adminPassword');

  // عناصر لوحة تحكم القسم
  const deptHeaderName = document.getElementById('deptHeaderName');
  const deptHeaderDesc = document.getElementById('deptHeaderDesc');
  const deptHeaderIcon = document.getElementById('deptHeaderIcon');
  const deptCodePill = document.getElementById('deptCodePill');
  const deptIpPill = document.getElementById('deptIpPill');
  const deptBuildingPill = document.getElementById('deptBuildingPill');
  const deptSupervisorPill = document.getElementById('deptSupervisorPill');

  const statTotalTrainees = document.getElementById('statTotalTrainees');
  const statTodayAttendanceRate = document.getElementById('statTodayAttendanceRate');
  const statAvgPractical = document.getElementById('statAvgPractical');
  const statAvgSafety = document.getElementById('statAvgSafety');

  const attendanceDatePicker = document.getElementById('attendanceDatePicker');
  const attendanceTableBody = document.getElementById('attendanceTableBody');
  const btnMarkAllPresent = document.getElementById('btnMarkAllPresent');
  const btnResetDayAttendance = document.getElementById('btnResetDayAttendance');
  const btnSaveAttendance = document.getElementById('btnSaveAttendance');

  const evaluationsTableBody = document.getElementById('evaluationsTableBody');
  const equipmentTableBody = document.getElementById('equipmentTableBody');
  const subnavBtns = document.querySelectorAll('.subnav-btn');

  // عناصر النوافذ المنبثقة
  const btnOpenAddTraineeModal = document.getElementById('btnOpenAddTraineeModal');
  const modalAddTrainee = document.getElementById('modalAddTrainee');
  const formAddTrainee = document.getElementById('formAddTrainee');

  const modalEvaluateTrainee = document.getElementById('modalEvaluateTrainee');
  const formEvaluateTrainee = document.getElementById('formEvaluateTrainee');
  const evalTraineeId = document.getElementById('evalTraineeId');
  const evalModalTraineeName = document.getElementById('evalModalTraineeName');
  const evalModalTraineeCode = document.getElementById('evalModalTraineeCode');

  // عناصر بوابة المتدرب وولي الأمر
  const portalUserLoginHero = document.getElementById('portalUserLoginHero');
  const portalLoginForm = document.getElementById('portalLoginForm');
  const portalInputCode = document.getElementById('portalInputCode');
  const portalInputPassword = document.getElementById('portalInputPassword');
  const portalActiveUserBar = document.getElementById('portalActiveUserBar');
  const portalActiveUserName = document.getElementById('portalActiveUserName');
  const portalActiveUserCode = document.getElementById('portalActiveUserCode');
  const btnPortalLogout = document.getElementById('btnPortalLogout');

  const traineeReportContainer = document.getElementById('traineeReportContainer');
  const btnPrintReport = document.getElementById('btnPrintReport');
  const quickTraineeButtons = document.querySelectorAll('.quick-trainee-selector button[data-code]');

  // عناصر لوحة الإدارة
  const adminDepartmentsList = document.getElementById('adminDepartmentsList');
  const btnOpenAddDepartmentModal = document.getElementById('btnOpenAddDepartmentModal');
  const modalAddDepartment = document.getElementById('modalAddDepartment');
  const formAddDepartment = document.getElementById('formAddDepartment');
  const auditLogTableBody = document.getElementById('auditLogTableBody');
  const btnClearAuditLog = document.getElementById('btnClearAuditLog');
  const btnExportPermanentBackup = document.getElementById('btnExportPermanentBackup');
  const btnResetAllDefaults = document.getElementById('btnResetAllDefaults');

  // =========================================================================
  // وظائف مساعدة عامة وتنبيهات Toast
  // =========================================================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function getIconEmoji(iconName) {
    const map = {
      'code': '💻',
      'disc': '⚙️',
      'cpu': '🎛️',
      'zap': '⚡',
      'layers': '🏗️',
      'wrench': '🔧'
    };
    return map[iconName] || '🛠️';
  }

  // =========================================================================
  // إدارة محاكي عنوان الـ IP (Simulate Lab IP Logic)
  // =========================================================================
  function initIpSimulator() {
    const savedIp = window.AuthManager ? window.AuthManager.getCurrentClientIp() : '192.168.10.25';
    if (clientIpInput) {
      clientIpInput.value = savedIp;
    }
    updateIpButtonsState(savedIp);

    if (clientIpInput) {
      clientIpInput.addEventListener('input', (e) => {
        const newIp = e.target.value.trim();
        if (window.AuthManager) window.AuthManager.setClientIp(newIp);
        updateIpButtonsState(newIp);
      });
    }

    quickIpButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const ip = btn.getAttribute('data-ip');
        if (ip && clientIpInput) {
          clientIpInput.value = ip;
          if (window.AuthManager) window.AuthManager.setClientIp(ip);
          updateIpButtonsState(ip);
          showToast(`تم تعيين عنوان IP المحاكى إلى: ${ip}`, 'info');
        }
      });
    });
  }

  function updateIpButtonsState(currentIp) {
    quickIpButtons.forEach(btn => {
      const btnIp = btn.getAttribute('data-ip');
      if (btnIp === currentIp) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // =========================================================================
  // نظام التنقل بين المشاهد (Views Switching)
  // =========================================================================
  function switchView(viewKey) {
    Object.values(views).forEach(v => {
      if (v) v.classList.remove('active');
    });

    Object.values(navTabs).forEach(t => {
      if (t) t.classList.remove('active');
    });

    if (views[viewKey]) {
      views[viewKey].classList.add('active');
    }

    if (navTabs[viewKey]) {
      navTabs[viewKey].classList.add('active');
    }

    if (viewKey === 'admin') {
      renderAdminDashboard();
    }
  }

  Object.keys(navTabs).forEach(key => {
    const btn = navTabs[key];
    if (btn) {
      btn.addEventListener('click', () => {
        switchView(key);
      });
    }
  });

  const brandHomeLink = document.getElementById('brandHomeLink');
  if (brandHomeLink) {
    brandHomeLink.addEventListener('click', (e) => {
      e.preventDefault();
      const session = window.AuthManager ? window.AuthManager.getSession() : null;
      if (session) {
        if (session.role === 'admin') switchView('admin');
        else if (session.role === 'trainee') switchView('portal');
        else switchView('dashboard');
      } else {
        switchView('login');
      }
    });
  }

  // =========================================================================
  // إدارة تبويبات نوع تسجيل الدخول في الواجهة الرئيسية
  // =========================================================================
  function setLoginTab(tabKey) {
    [tabLoginTypeEngineer, tabLoginTypeUser, tabLoginTypeAdmin].forEach(b => b && b.classList.remove('active'));
    [engineerLoginSection, userLoginSection, adminLoginSection].forEach(s => s && (s.style.display = 'none'));

    if (tabKey === 'engineer') {
      if (tabLoginTypeEngineer) tabLoginTypeEngineer.classList.add('active');
      if (engineerLoginSection) engineerLoginSection.style.display = 'block';
    } else if (tabKey === 'user') {
      if (tabLoginTypeUser) tabLoginTypeUser.classList.add('active');
      if (userLoginSection) userLoginSection.style.display = 'block';
    } else if (tabKey === 'admin') {
      if (tabLoginTypeAdmin) tabLoginTypeAdmin.classList.add('active');
      if (adminLoginSection) adminLoginSection.style.display = 'block';
    }
  }

  if (tabLoginTypeEngineer) tabLoginTypeEngineer.addEventListener('click', () => setLoginTab('engineer'));
  if (tabLoginTypeUser) tabLoginTypeUser.addEventListener('click', () => setLoginTab('user'));
  if (tabLoginTypeAdmin) tabLoginTypeAdmin.addEventListener('click', () => setLoginTab('admin'));

  // =========================================================================
  // إدارة جلسة المستخدم الحالية وشريط الحالة
  // =========================================================================
  function updateSessionUI() {
    const session = window.AuthManager ? window.AuthManager.getSession() : null;

    if (session) {
      if (userSessionBadge) userSessionBadge.style.display = 'flex';
      if (btnLogout) btnLogout.style.display = 'inline-block';
      if (navTabs.login) navTabs.login.style.display = 'none';

      if (session.role === 'admin') {
        if (sessionUserName) sessionUserName.textContent = 'إدارة المركز العام';
        if (sessionDeptBadge) sessionDeptBadge.textContent = 'HQ-ADMIN';
        if (navTabs.dashboard) navTabs.dashboard.style.display = 'none';
        if (navTabs.admin) navTabs.admin.style.display = 'inline-flex';
      } else if (session.role === 'trainee') {
        if (sessionUserName) sessionUserName.textContent = `المتدرب: ${session.trainee.name}`;
        if (sessionDeptBadge) sessionDeptBadge.textContent = session.trainee.code;
        if (navTabs.dashboard) navTabs.dashboard.style.display = 'none';
        if (navTabs.admin) navTabs.admin.style.display = 'none';
      } else {
        if (sessionUserName) sessionUserName.textContent = session.engineer.name;
        if (sessionDeptBadge) sessionDeptBadge.textContent = session.departmentCode;
        if (navTabs.dashboard) navTabs.dashboard.style.display = 'inline-flex';
        if (navTabs.admin) navTabs.admin.style.display = 'none';
      }
    } else {
      if (userSessionBadge) userSessionBadge.style.display = 'none';
      if (btnLogout) btnLogout.style.display = 'none';
      if (navTabs.login) navTabs.login.style.display = 'inline-flex';
      if (navTabs.dashboard) navTabs.dashboard.style.display = 'none';
      if (navTabs.admin) navTabs.admin.style.display = 'none';
    }
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (window.AuthManager) window.AuthManager.logout();
      currentActiveDepartment = null;
      updateSessionUI();
      if (portalUserLoginHero) portalUserLoginHero.style.display = 'block';
      if (portalActiveUserBar) portalActiveUserBar.style.display = 'none';
      if (traineeReportContainer) traineeReportContainer.classList.remove('visible');
      switchView('login');
      showToast('تم تسجيل الخروج بنجاح.', 'info');
    });
  }

  // =========================================================================
  // 1. تسجيل دخول مهندسي الأقسام وفحص الـ IP وكلمة المرور من ملف password
  // =========================================================================
  if (engineerLoginForm) {
    engineerLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = loginEmail.value.trim();
      const password = loginPassword.value.trim();
      const clientIp = clientIpInput ? clientIpInput.value.trim() : '192.168.10.25';

      const result = window.AuthManager.loginEngineer(email, password, clientIp);

      if (result.success) {
        if (securityAlertBox) securityAlertBox.classList.remove('visible');
        showToast(`مرحباً بك يا ${result.session.engineer.name}، تم التحقق من كلمة المرور و IP المعمل.`, 'success');
        updateSessionUI();
        currentActiveDepartment = result.department;
        renderDepartmentDashboard(currentActiveDepartment);
        switchView('dashboard');
      } else {
        if (result.errorType === 'IP_MISMATCH') {
          if (securityAlertBox) {
            securityAlertBox.classList.add('visible');
            const alertMsg = document.getElementById('securityAlertMessage');
            if (alertMsg) alertMsg.textContent = result.message;
            if (detectedIpDisplay) detectedIpDisplay.textContent = result.details.clientIp;
            if (expectedIpDisplay) expectedIpDisplay.textContent = result.details.authorizedIp;
          }
          showToast(result.message, 'danger');
        } else {
          if (securityAlertBox) securityAlertBox.classList.remove('visible');
          showToast(result.message || 'بيانات الدخول أو كلمة المرور غير صحيحة.', 'danger');
        }
      }
    });
  }

  // =========================================================================
  // 2. تسجيل دخول المستخدمين / المتدربين بكلمة المرور (User Password Login)
  // =========================================================================
  function handleUserLogin(codeOrId, password) {
    const result = window.AuthManager.loginUser(codeOrId, password);
    if (result.success) {
      updateSessionUI();
      displayTraineeReport(result.traineeResult);

      if (portalUserLoginHero) portalUserLoginHero.style.display = 'none';
      if (portalActiveUserBar) portalActiveUserBar.style.display = 'flex';
      if (portalActiveUserName) portalActiveUserName.textContent = result.traineeResult.trainee.name;
      if (portalActiveUserCode) portalActiveUserCode.textContent = result.traineeResult.trainee.code;

      switchView('portal');
      showToast(`أهلاً بك يا ${result.traineeResult.trainee.name}، تم تسجيل دخولك بنجاح.`, 'success');
    } else {
      showToast(result.message, 'danger');
    }
  }

  if (userLoginForm) {
    userLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = userLoginCode.value.trim();
      const pass = userLoginPassword.value.trim();
      handleUserLogin(code, pass);
    });
  }

  if (portalLoginForm) {
    portalLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = portalInputCode.value.trim();
      const pass = portalInputPassword.value.trim();
      handleUserLogin(code, pass);
    });
  }

  if (btnPortalLogout) {
    btnPortalLogout.addEventListener('click', () => {
      if (window.AuthManager) window.AuthManager.logout();
      updateSessionUI();
      if (portalUserLoginHero) portalUserLoginHero.style.display = 'block';
      if (portalActiveUserBar) portalActiveUserBar.style.display = 'none';
      if (traineeReportContainer) traineeReportContainer.classList.remove('visible');
      showToast('تم تسجيل خروج المتدرب.', 'info');
    });
  }

  // =========================================================================
  // 3. تسجيل دخول إدارة المركز بكلمة المرور
  // =========================================================================
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = adminEmail.value.trim();
      const pass = adminPassword.value.trim();

      const res = window.AuthManager.loginAdmin(email, pass);
      if (res.success) {
        updateSessionUI();
        switchView('admin');
        showToast('تم تسجيل الدخول بصلاحيات الإدارة المركزية.', 'success');
      } else {
        showToast(res.message, 'danger');
      }
    });
  }

  // أزرار الدخول السريع للاختبار التجريبي
  document.querySelectorAll('.btn-fill-valid').forEach(btn => {
    btn.addEventListener('click', () => {
      setLoginTab('engineer');
      const email = btn.getAttribute('data-email');
      const pass = btn.getAttribute('data-pass');
      const ip = btn.getAttribute('data-ip');

      if (loginEmail) loginEmail.value = email;
      if (loginPassword) loginPassword.value = pass;
      if (clientIpInput) {
        clientIpInput.value = ip;
        if (window.AuthManager) window.AuthManager.setClientIp(ip);
        updateIpButtonsState(ip);
      }

      setTimeout(() => {
        if (engineerLoginForm) engineerLoginForm.dispatchEvent(new Event('submit'));
      }, 100);
    });
  });

  document.querySelectorAll('.btn-fill-invalid').forEach(btn => {
    btn.addEventListener('click', () => {
      setLoginTab('engineer');
      const email = btn.getAttribute('data-email');
      const pass = btn.getAttribute('data-pass');
      const ip = btn.getAttribute('data-ip');

      if (loginEmail) loginEmail.value = email;
      if (loginPassword) loginPassword.value = pass;
      if (clientIpInput) {
        clientIpInput.value = ip;
        if (window.AuthManager) window.AuthManager.setClientIp(ip);
        updateIpButtonsState(ip);
      }

      setTimeout(() => {
        if (engineerLoginForm) engineerLoginForm.dispatchEvent(new Event('submit'));
      }, 100);
    });
  });

  document.querySelectorAll('.btn-fill-user').forEach(btn => {
    btn.addEventListener('click', () => {
      setLoginTab('user');
      const code = btn.getAttribute('data-user-code');
      const pass = btn.getAttribute('data-user-pass');
      if (userLoginCode) userLoginCode.value = code;
      if (userLoginPassword) userLoginPassword.value = pass;

      setTimeout(() => {
        if (userLoginForm) userLoginForm.dispatchEvent(new Event('submit'));
      }, 100);
    });
  });

  document.querySelectorAll('.btn-fill-admin').forEach(btn => {
    btn.addEventListener('click', () => {
      setLoginTab('admin');
      if (adminEmail) adminEmail.value = 'admin@vtc.edu.sa';
      if (adminPassword) adminPassword.value = 'admin123';

      setTimeout(() => {
        if (adminLoginForm) adminLoginForm.dispatchEvent(new Event('submit'));
      }, 100);
    });
  });

  quickTraineeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      const pass = btn.getAttribute('data-pass');
      if (portalInputCode) portalInputCode.value = code;
      if (portalInputPassword) portalInputPassword.value = pass;
      handleUserLogin(code, pass);
    });
  });

  // =========================================================================
  // لوحة تحكم القسم التدريبي (Department Dashboard Logic)
  // =========================================================================
  function renderDepartmentDashboard(department) {
    if (!department) return;

    if (deptHeaderName) deptHeaderName.textContent = department.name;
    if (deptHeaderDesc) deptHeaderDesc.textContent = department.description;
    if (deptHeaderIcon) deptHeaderIcon.textContent = getIconEmoji(department.icon);
    if (deptCodePill) deptCodePill.textContent = department.code;
    if (deptIpPill) {
      deptIpPill.innerHTML = `<span>🔒 اتصال شبكي آمن مصرح به (IP: ${department.authorizedIp})</span>`;
    }
    if (deptBuildingPill) {
      deptBuildingPill.innerHTML = `<span>📍 ${department.building}</span>`;
    }
    if (deptSupervisorPill) {
      deptSupervisorPill.innerHTML = `<span>👨‍🏫 المشرف: ${department.engineer.name}</span>`;
    }

    updateDepartmentStats(department);

    if (attendanceDatePicker) {
      attendanceDatePicker.value = currentSelectedAttendanceDate;
    }
    stagedAttendanceChanges = {};
    renderAttendanceTable(department, currentSelectedAttendanceDate);
    renderEvaluationsTable(department);
    renderEquipmentTable(department);
  }

  function updateDepartmentStats(department) {
    const stats = department.getDepartmentStats(currentSelectedAttendanceDate);
    if (statTotalTrainees) statTotalTrainees.textContent = stats.totalTrainees;
    if (statTodayAttendanceRate) statTodayAttendanceRate.textContent = `${stats.attendancePercentage}%`;
    if (statAvgPractical) statAvgPractical.textContent = `${stats.avgPractical}/100`;
    if (statAvgSafety) statAvgSafety.textContent = `${stats.avgSafety}%`;
  }

  subnavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subnavBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetSubviewId = btn.getAttribute('data-subview');
      document.querySelectorAll('.subview-content').forEach(sub => {
        sub.style.display = 'none';
      });

      const targetElem = document.getElementById(targetSubviewId);
      if (targetElem) targetElem.style.display = 'block';
    });
  });

  if (attendanceDatePicker) {
    attendanceDatePicker.addEventListener('change', (e) => {
      currentSelectedAttendanceDate = e.target.value;
      stagedAttendanceChanges = {};
      if (currentActiveDepartment) {
        renderAttendanceTable(currentActiveDepartment, currentSelectedAttendanceDate);
        updateDepartmentStats(currentActiveDepartment);
      }
    });
  }

  function renderAttendanceTable(department, date) {
    if (!attendanceTableBody) return;
    attendanceTableBody.innerHTML = '';

    const trainees = department.getTrainees();
    const existingRecords = department.getAttendanceForDate(date);

    if (trainees.length === 0) {
      attendanceTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 24px; color: var(--slate-400);">
            لا يوجد متدربون مسجلون في هذا القسم حتى الآن. انقر على زر "+ إضافة متدرب للقسم" للبدء.
          </td>
        </tr>
      `;
      return;
    }

    trainees.forEach((trainee, index) => {
      const currentStatus = stagedAttendanceChanges[trainee.id] || existingRecords[trainee.id] || 'present';
      const stats = department.getTraineeAttendanceStats(trainee.id);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td><span class="trainee-code-badge">${trainee.code}</span></td>
        <td>
          <div class="trainee-identity">
            <span class="trainee-name">${trainee.name}</span>
            <span style="font-size: 0.75rem; color: var(--slate-400);">هوية: ${trainee.nationalId} | ${trainee.phone}</span>
          </div>
        </td>
        <td>${trainee.group}</td>
        <td>
          <div class="attendance-btn-group" data-trainee-id="${trainee.id}">
            <button type="button" class="btn-att ${currentStatus === 'present' ? 'active-present' : ''}" data-status="present">حاضر</button>
            <button type="button" class="btn-att ${currentStatus === 'late' ? 'active-late' : ''}" data-status="late">متأخر</button>
            <button type="button" class="btn-att ${currentStatus === 'absent' ? 'active-absent' : ''}" data-status="absent">غائب</button>
            <button type="button" class="btn-att ${currentStatus === 'excused' ? 'active-excused' : ''}" data-status="excused">مأذون</button>
          </div>
        </td>
        <td>
          <span class="score-badge ${stats.attendanceRate >= 85 ? 'high' : stats.attendanceRate >= 70 ? 'medium' : 'low'}">
            ${stats.attendanceRate}% (${stats.present} يوم)
          </span>
        </td>
        <td>
          <button type="button" class="btn-secondary btn-evaluate-trigger" data-trainee-id="${trainee.id}" style="font-size: 0.78rem; padding: 4px 10px;">
            ⭐ تقييم
          </button>
        </td>
      `;

      const btnGroup = tr.querySelector('.attendance-btn-group');
      const attButtons = btnGroup.querySelectorAll('.btn-att');
      attButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const status = btn.getAttribute('data-status');
          stagedAttendanceChanges[trainee.id] = status;

          attButtons.forEach(b => {
            b.classList.remove('active-present', 'active-absent', 'active-late', 'active-excused');
          });

          if (status === 'present') btn.classList.add('active-present');
          else if (status === 'absent') btn.classList.add('active-absent');
          else if (status === 'late') btn.classList.add('active-late');
          else if (status === 'excused') btn.classList.add('active-excused');
        });
      });

      tr.querySelector('.btn-evaluate-trigger').addEventListener('click', () => {
        openEvaluationModal(trainee);
      });

      attendanceTableBody.appendChild(tr);
    });
  }

  if (btnMarkAllPresent) {
    btnMarkAllPresent.addEventListener('click', () => {
      if (!currentActiveDepartment) return;
      currentActiveDepartment.getTrainees().forEach(t => {
        stagedAttendanceChanges[t.id] = 'present';
      });
      renderAttendanceTable(currentActiveDepartment, currentSelectedAttendanceDate);
      showToast('تم تعيين جميع متدربي القسم كحاضرين.', 'info');
    });
  }

  if (btnResetDayAttendance) {
    btnResetDayAttendance.addEventListener('click', () => {
      if (!currentActiveDepartment) return;
      stagedAttendanceChanges = {};
      renderAttendanceTable(currentActiveDepartment, currentSelectedAttendanceDate);
      showToast('تمت استعادة السجل المحفوظ لهذا اليوم.', 'info');
    });
  }

  // حفظ دائم لسجل الحضور في data/vtc_data.json
  if (btnSaveAttendance) {
    btnSaveAttendance.addEventListener('click', () => {
      if (!currentActiveDepartment) return;
      
      currentActiveDepartment.recordAttendance(currentSelectedAttendanceDate, stagedAttendanceChanges);
      if (window.StorageManager) {
        window.StorageManager.saveDepartment(currentActiveDepartment);
      }
      stagedAttendanceChanges = {};
      updateDepartmentStats(currentActiveDepartment);
      renderAttendanceTable(currentActiveDepartment, currentSelectedAttendanceDate);
      showToast(`تم الحفظ الدائم لسجل الحضور والغياب (${currentSelectedAttendanceDate}) في قاعدة البيانات.`, 'success');
    });
  }

  function renderEvaluationsTable(department) {
    if (!evaluationsTableBody) return;
    evaluationsTableBody.innerHTML = '';

    const trainees = department.getTrainees();

    trainees.forEach(trainee => {
      const latestEval = (trainee.evaluations && trainee.evaluations.length > 0) ? trainee.evaluations[0] : null;

      const practicalVal = latestEval ? `${latestEval.practicalScore}/100` : 'لم يقيم';
      const safetyVal = latestEval ? `${latestEval.safetyScore}%` : '—';
      const totalScore = latestEval ? latestEval.totalScore : 0;
      const latestNote = latestEval ? latestEval.notes : 'لا توجد ملاحظات مسجلة بعد';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="trainee-code-badge">${trainee.code}</span></td>
        <td>
          <span class="trainee-name">${trainee.name}</span>
        </td>
        <td>
          <span class="score-badge ${totalScore >= 85 ? 'high' : totalScore >= 70 ? 'medium' : 'low'}">
            ${practicalVal} (${totalScore} موزونة)
          </span>
        </td>
        <td>
          <span style="font-weight: 700; color: ${safetyVal !== '—' && parseInt(safetyVal) >= 90 ? '#34d399' : '#f87171'};">
            ${safetyVal}
          </span>
        </td>
        <td>
          <div style="max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.82rem; color: var(--slate-300);">
            ${latestNote}
          </div>
        </td>
        <td>
          <button type="button" class="btn-primary btn-eval-row" data-trainee-id="${trainee.id}" style="padding: 4px 12px; font-size: 0.78rem;">
            + تقييم جديد
          </button>
        </td>
      `;

      tr.querySelector('.btn-eval-row').addEventListener('click', () => {
        openEvaluationModal(trainee);
      });

      evaluationsTableBody.appendChild(tr);
    });
  }

  function renderEquipmentTable(department) {
    if (!equipmentTableBody) return;
    equipmentTableBody.innerHTML = '';

    department.equipment.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="color: var(--amber-400); font-family: 'Consolas', monospace;">${item.id}</strong></td>
        <td><strong>${item.name}</strong></td>
        <td style="color: var(--slate-400); font-size: 0.82rem;">${item.specs}</td>
        <td>
          <span class="dept-meta-pill ${item.status === 'operational' ? 'verified-ip' : ''}" style="display: inline-flex;">
            ${item.status === 'operational' ? '✓ جاهزة للتشغيل والتدريب' : '⚠️ تحت الصيانة الدورية'}
          </span>
        </td>
        <td>
          <button type="button" class="btn-secondary btn-toggle-machine" style="font-size: 0.75rem; padding: 4px 8px;">
            تغيير الحالة
          </button>
        </td>
      `;

      tr.querySelector('.btn-toggle-machine').addEventListener('click', () => {
        item.status = (item.status === 'operational') ? 'maintenance' : 'operational';
        if (window.StorageManager) window.StorageManager.saveDepartment(department);
        renderEquipmentTable(department);
        showToast(`تم تحديث حالة المعدة ${item.name} وحفظها بشكل دائم.`, 'info');
      });

      equipmentTableBody.appendChild(tr);
    });
  }

  // =========================================================================
  // نموذج إضافة متدرب جديد وتعيين كلمة المرور وحفظها في ملف password
  // =========================================================================
  if (btnOpenAddTraineeModal) {
    btnOpenAddTraineeModal.addEventListener('click', () => {
      if (modalAddTrainee) modalAddTrainee.classList.add('active');
    });
  }

  if (formAddTrainee) {
    formAddTrainee.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentActiveDepartment) return;

      const name = document.getElementById('newTraineeName').value.trim();
      const nationalId = document.getElementById('newTraineeNationalId').value.trim();
      const phone = document.getElementById('newTraineePhone').value.trim();
      const password = document.getElementById('newTraineePassword').value.trim() || 'user123';
      const guardianName = document.getElementById('newGuardianName').value.trim();
      const guardianPhone = document.getElementById('newGuardianPhone').value.trim();
      const group = document.getElementById('newTraineeGroup').value.trim();
      const safetyNotes = document.getElementById('newTraineeSafety').value.trim();

      const newTrainee = currentActiveDepartment.addTrainee({
        name,
        nationalId,
        phone,
        guardianName,
        guardianPhone,
        group,
        safetyNotes
      });

      // حفظ كلمة المرور في مدير كلمات المرور وملف password المنفصل
      if (window.PasswordManager) {
        window.PasswordManager.setPassword('users', newTrainee.code, password, {
          name: newTrainee.name,
          nationalId: newTrainee.nationalId,
          department: currentActiveDepartment.id
        });
        window.PasswordManager.setPassword('users', newTrainee.nationalId, password, {
          name: newTrainee.name,
          code: newTrainee.code,
          department: currentActiveDepartment.id
        });
      }

      // حفظ دائم في قاعدة البيانات data/vtc_data.json
      if (window.StorageManager) {
        window.StorageManager.saveDepartment(currentActiveDepartment);
      }

      formAddTrainee.reset();
      if (modalAddTrainee) modalAddTrainee.classList.remove('active');

      renderAttendanceTable(currentActiveDepartment, currentSelectedAttendanceDate);
      renderEvaluationsTable(currentActiveDepartment);
      updateDepartmentStats(currentActiveDepartment);

      showToast(`تم تسجيل المتدرب (${newTrainee.name}) بنجاح بكود [${newTrainee.code}] وحفظ كلمة المرور في ملف password.`, 'success');
    });
  }

  // =========================================================================
  // نموذج تقييم الأداء العملي والملاحظات
  // =========================================================================
  function openEvaluationModal(trainee) {
    if (!modalEvaluateTrainee) return;
    if (evalTraineeId) evalTraineeId.value = trainee.id;
    if (evalModalTraineeName) evalModalTraineeName.textContent = trainee.name;
    if (evalModalTraineeCode) evalModalTraineeCode.textContent = `الرقم الأكاديمي: ${trainee.code} | القسم: ${trainee.departmentName || currentActiveDepartment.name}`;

    modalEvaluateTrainee.classList.add('active');
  }

  if (formEvaluateTrainee) {
    formEvaluateTrainee.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentActiveDepartment) return;

      const traineeId = evalTraineeId.value;
      const title = document.getElementById('evalTitle').value.trim();
      const practicalScore = Number(document.getElementById('evalPracticalScore').value);
      const safetyScore = Number(document.getElementById('evalSafetyScore').value);
      const maintenanceScore = Number(document.getElementById('evalMaintenanceScore').value);
      const theoryScore = Number(document.getElementById('evalTheoryScore').value);
      const noteType = document.getElementById('evalNoteType').value;
      const notes = document.getElementById('evalNotes').value.trim();

      currentActiveDepartment.addEvaluation(traineeId, {
        title,
        practicalScore,
        safetyScore,
        maintenanceScore,
        theoryScore,
        noteType,
        notes,
        evaluator: currentActiveDepartment.engineer.name
      });

      if (window.StorageManager) {
        window.StorageManager.saveDepartment(currentActiveDepartment);
      }

      formEvaluateTrainee.reset();
      if (modalEvaluateTrainee) modalEvaluateTrainee.classList.remove('active');

      renderEvaluationsTable(currentActiveDepartment);
      updateDepartmentStats(currentActiveDepartment);

      showToast('تم اعتماد وحفظ التقييم العملي بشكل دائم في قاعدة البيانات.', 'success');
    });
  }

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      const targetModal = document.getElementById(modalId);
      if (targetModal) targetModal.classList.remove('active');
    });
  });

  // =========================================================================
  // عرض تقرير المتدرب الشامل (Trainee Performance Report)
  // =========================================================================
  function displayTraineeReport(searchResult) {
    const { trainee, department, stats } = searchResult;

    const repName = document.getElementById('repName');
    const repCode = document.getElementById('repCode');
    const repNationalId = document.getElementById('repNationalId');
    const repDepartment = document.getElementById('repDepartment');
    const repAttendanceRate = document.getElementById('repAttendanceRate');
    const repAttendanceCounts = document.getElementById('repAttendanceCounts');
    const repPracticalScore = document.getElementById('repPracticalScore');
    const repSafetyScore = document.getElementById('repSafetyScore');
    const repTotalScore = document.getElementById('repTotalScore');
    const repPhone = document.getElementById('repPhone');
    const repGuardianName = document.getElementById('repGuardianName');
    const repGuardianPhone = document.getElementById('repGuardianPhone');
    const repEnrollDate = document.getElementById('repEnrollDate');
    const repGroup = document.getElementById('repGroup');
    const repSafetyNotes = document.getElementById('repSafetyNotes');
    const repEvalTimeline = document.getElementById('repEvalTimeline');

    if (repName) repName.textContent = trainee.name;
    if (repCode) repCode.textContent = trainee.code;
    if (repNationalId) repNationalId.textContent = trainee.nationalId;
    if (repDepartment) repDepartment.textContent = department.name;

    if (repAttendanceRate) repAttendanceRate.textContent = `${stats.attendanceRate}%`;
    if (repAttendanceCounts) {
      repAttendanceCounts.textContent = `${stats.present} حاضر | ${stats.late} متأخر | ${stats.absent} غائب`;
    }

    let practical = 0;
    let safety = 0;
    let total = 0;
    if (trainee.evaluations && trainee.evaluations.length > 0) {
      const latest = trainee.evaluations[0];
      practical = latest.practicalScore;
      safety = latest.safetyScore;
      total = latest.totalScore;
    }

    if (repPracticalScore) repPracticalScore.textContent = `${practical}/100`;
    if (repSafetyScore) repSafetyScore.textContent = `${safety}%`;
    if (repTotalScore) repTotalScore.textContent = `${total}/100`;

    if (repPhone) repPhone.textContent = trainee.phone;
    if (repGuardianName) repGuardianName.textContent = trainee.guardianName;
    if (repGuardianPhone) repGuardianPhone.textContent = trainee.guardianPhone;
    if (repEnrollDate) repEnrollDate.textContent = trainee.enrollmentDate;
    if (repGroup) repGroup.textContent = trainee.group;
    if (repSafetyNotes) repSafetyNotes.textContent = trainee.safetyNotes;

    if (repEvalTimeline) {
      repEvalTimeline.innerHTML = '';
      if (!trainee.evaluations || trainee.evaluations.length === 0) {
        repEvalTimeline.innerHTML = '<p style="color: var(--slate-400);">لا توجد تقييمات مسجلة حتى الآن.</p>';
      } else {
        trainee.evaluations.forEach(ev => {
          const item = document.createElement('div');
          const isSafety = ev.noteType === 'safety';
          const isExcellence = ev.noteType === 'excellence';

          item.className = `eval-timeline-item ${isSafety ? 'safety-warning' : isExcellence ? 'excellence' : ''}`;
          item.innerHTML = `
            <div class="eval-item-header">
              <span class="eval-item-title">${ev.title}</span>
              <span class="eval-item-date">${ev.date} | المقيّم: ${ev.evaluator}</span>
            </div>
            <div class="eval-scores-chips">
              <span class="score-chip">الدرجة الموزونة: <strong>${ev.totalScore}/100</strong></span>
              <span class="score-chip">المهارة العملية: <strong>${ev.practicalScore}%</strong></span>
              <span class="score-chip">السلامة المهنية (PPE): <strong>${ev.safetyScore}%</strong></span>
              <span class="score-chip">صيانة المعدات: <strong>${ev.maintenanceScore}%</strong></span>
            </div>
            <div class="eval-notes-text">
              <strong>${isSafety ? '⚠️ تنبيه سلامة:' : isExcellence ? '🌟 إشادة وتميز:' : '📝 ملاحظة المهندس:'}</strong>
              ${ev.notes}
            </div>
          `;
          repEvalTimeline.appendChild(item);
        });
      }
    }

    if (traineeReportContainer) traineeReportContainer.classList.add('visible');
    traineeReportContainer.scrollIntoView({ behavior: 'smooth' });
  }

  if (btnPrintReport) {
    btnPrintReport.addEventListener('click', () => {
      window.print();
    });
  }

  // =========================================================================
  // لوحة الإدارة المركزية والنسخ الاحتياطي الدائم
  // =========================================================================
  function renderAdminDashboard() {
    renderAdminDepartmentsList();
    renderAuditLogTable();
  }

  function renderAdminDepartmentsList() {
    if (!adminDepartmentsList) return;
    adminDepartmentsList.innerHTML = '';

    const allDepts = window.DepartmentRegistry.getAllDepartments();

    allDepts.forEach(dept => {
      const tile = document.createElement('div');
      tile.className = 'dept-admin-tile';
      tile.innerHTML = `
        <div>
          <div class="dept-tile-top">
            <span class="dept-tile-name">${getIconEmoji(dept.icon)} ${dept.name}</span>
            <span class="dept-meta-pill code-pill">${dept.code}</span>
          </div>
          <div style="font-size: 0.82rem; color: var(--slate-300); margin-bottom: 6px;">
            <strong>المهندس المشرف:</strong> ${dept.engineer.name}
          </div>
          <div style="font-size: 0.82rem; color: var(--slate-300); margin-bottom: 6px;">
            <strong>الـ IP المصرح:</strong> <span class="dept-tile-ip">${dept.authorizedIp}</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--slate-400);">
            عدد المتدربين: <strong>${dept.getTrainees().length}</strong> متدرب
          </div>
        </div>
        <div style="margin-top: 14px; display: flex; gap: 8px;">
          <button type="button" class="btn-primary btn-open-dept" data-dept-id="${dept.id}" style="padding: 6px 12px; font-size: 0.8rem;">
            دخول لوحة القسم
          </button>
        </div>
      `;

      tile.querySelector('.btn-open-dept').addEventListener('click', () => {
        currentActiveDepartment = dept;
        renderDepartmentDashboard(dept);
        switchView('dashboard');
        showToast(`تم فتح لوحة تحكم: ${dept.name}`, 'info');
      });

      adminDepartmentsList.appendChild(tile);
    });
  }

  function renderAuditLogTable() {
    if (!auditLogTableBody) return;
    auditLogTableBody.innerHTML = '';

    const logs = window.AuditLog ? window.AuditLog.getLogs() : [];

    if (logs.length === 0) {
      auditLogTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--slate-400); padding: 18px;">
            لا توجد سجلات دخول مسجلة حالياً.
          </td>
        </tr>
      `;
      return;
    }

    logs.forEach(log => {
      const tr = document.createElement('tr');
      const isSuccess = log.event === 'LOGIN_SUCCESS' || log.event === 'ADMIN_LOGIN';
      const isBlocked = log.event === 'SECURITY_BLOCKED';

      tr.innerHTML = `
        <td style="font-family: 'Consolas', monospace; font-size: 0.82rem; direction: ltr; text-align: right;">${log.timestamp}</td>
        <td><strong>${log.userName}</strong></td>
        <td>${log.departmentName}</td>
        <td style="font-family: 'Consolas', monospace; direction: ltr; text-align: right;">${log.authorizedIp}</td>
        <td style="font-family: 'Consolas', monospace; direction: ltr; text-align: right; font-weight: 700; color: ${isBlocked ? '#f87171' : '#34d399'};">
          ${log.clientIp}
        </td>
        <td>
          <span class="dept-meta-pill ${isSuccess ? 'verified-ip' : ''}" style="color: ${isBlocked ? '#f87171' : ''}; border-color: ${isBlocked ? 'rgba(239, 68, 68, 0.4)' : ''};">
            ${isSuccess ? '✓ مصرح ومطابق' : isBlocked ? '🚫 محظور أمنياً (IP غير مطابق)' : 'بيانات غير صحيحة'}
          </span>
        </td>
      `;

      auditLogTableBody.appendChild(tr);
    });
  }

  if (btnClearAuditLog) {
    btnClearAuditLog.addEventListener('click', () => {
      if (window.AuditLog) window.AuditLog.clearLogs();
      renderAuditLogTable();
      showToast('تم تفريغ سجل الأمان.', 'info');
    });
  }

  if (btnExportPermanentBackup) {
    btnExportPermanentBackup.addEventListener('click', () => {
      if (window.StorageManager) window.StorageManager.exportBackup();
    });
  }

  if (btnResetAllDefaults) {
    btnResetAllDefaults.addEventListener('click', () => {
      if (confirm('هل أنت متأكد من رغبتك في استعادة ضبط المصنع لكافة البيانات وسجلات الحضور؟')) {
        if (window.StorageManager) window.StorageManager.resetToFactoryDefaults();
      }
    });
  }

  // إضافة قسم تدريبي جديد ديناميكياً مع حفظ كلمة المرور في ملف password
  if (btnOpenAddDepartmentModal) {
    btnOpenAddDepartmentModal.addEventListener('click', () => {
      if (modalAddDepartment) modalAddDepartment.classList.add('active');
    });
  }

  if (formAddDepartment) {
    formAddDepartment.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('newDeptName').value.trim();
      const code = document.getElementById('newDeptCode').value.trim();
      const authorizedIp = document.getElementById('newDeptAuthorizedIp').value.trim();
      const engineerName = document.getElementById('newDeptEngName').value.trim();
      const engineerEmail = document.getElementById('newDeptEngEmail').value.trim();
      const engineerPassword = document.getElementById('newDeptEngPass').value.trim();
      const capacity = Number(document.getElementById('newDeptCapacity').value);
      const description = document.getElementById('newDeptDesc').value.trim();

      const newDept = window.DynamicDepartmentFactory.create({
        name,
        code,
        authorizedIp,
        engineerName,
        engineerEmail,
        engineerPassword,
        capacity,
        description
      });

      // حفظ كلمة مرور المهندس في ملف password
      if (window.PasswordManager) {
        window.PasswordManager.setPassword('engineers', engineerEmail, engineerPassword, {
          name: engineerName,
          department: newDept.id,
          authorizedIp: authorizedIp
        });
      }

      if (window.StorageManager) {
        window.StorageManager.saveDepartment(newDept);
      }

      formAddDepartment.reset();
      if (modalAddDepartment) modalAddDepartment.classList.remove('active');

      renderAdminDepartmentsList();
      showToast(`تم إنشاء وتفعيل قسم (${newDept.name}) وحفظ بياناته وكلمة المرور بشكل دائم.`, 'success');
    });
  }

  // =========================================================================
  // الإطلاق الأولي للتطبيق وفحص الجلسة النشطة
  // =========================================================================
  initIpSimulator();
  updateSessionUI();

  const existingSession = window.AuthManager ? window.AuthManager.getSession() : null;
  if (existingSession) {
    if (existingSession.role === 'admin') {
      switchView('admin');
    } else if (existingSession.role === 'trainee') {
      const searchRes = window.DepartmentRegistry.findTraineeGlobally(existingSession.trainee.code);
      if (searchRes) {
        displayTraineeReport(searchRes);
        if (portalUserLoginHero) portalUserLoginHero.style.display = 'none';
        if (portalActiveUserBar) portalActiveUserBar.style.display = 'flex';
        if (portalActiveUserName) portalActiveUserName.textContent = searchRes.trainee.name;
        if (portalActiveUserCode) portalActiveUserCode.textContent = searchRes.trainee.code;
      }
      switchView('portal');
    } else {
      currentActiveDepartment = window.DepartmentRegistry.getDepartment(existingSession.departmentId);
      if (currentActiveDepartment) {
        renderDepartmentDashboard(currentActiveDepartment);
        switchView('dashboard');
      } else {
        switchView('login');
      }
    }
  } else {
    switchView('login');
  }
});

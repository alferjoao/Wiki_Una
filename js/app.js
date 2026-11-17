/**
 * ==========================================================================
 * WikiUna - Sistema de Autenticação e Validação
 * Implementação das 10 Heurísticas de Usabilidade de Jakob Nielsen
 * ==========================================================================
 */

(function () {
  'use strict';

  // Chaves de armazenamento local (localStorage)
  const STORAGE_USERS_KEY = 'wikiuna_users_db';
  const STORAGE_SESSION_KEY = 'wikiuna_active_session';
  const STORAGE_REMEMBER_KEY = 'wikiuna_remembered_email';

  // Domínio Institucional Obrigatório da Una
  const REQUIRED_DOMAIN = '@ulife.com.br';

  // Usuários padrão demonstrativos para testes rápidos
  const DEFAULT_USERS = [
    {
      name: 'Usuário Teste',
      email: 'teste@ulife.com.br',
      password: '123456',
      course: 'Ciência da Computação',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Estudante Una',
      email: 'estudante.demo@ulife.com.br',
      password: 'Senha@123',
      course: 'Sistemas de Informação',
      createdAt: new Date().toISOString()
    }
  ];

  // Elementos do DOM
  const dom = {
    // Abas
    tabLogin: document.getElementById('tabLogin'),
    tabRegister: document.getElementById('tabRegister'),
    formLogin: document.getElementById('formLogin'),
    formRegister: document.getElementById('formRegister'),

    // Campos Login
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    loginRemember: document.getElementById('loginRemember'),
    btnLoginSubmit: document.getElementById('btnLoginSubmit'),
    loginEmailFeedback: document.getElementById('loginEmailFeedback'),
    loginPasswordFeedback: document.getElementById('loginPasswordFeedback'),
    loginDomainSuggestion: document.getElementById('loginDomainSuggestion'),

    // Campos Cadastro
    regName: document.getElementById('regName'),
    regEmail: document.getElementById('regEmail'),
    regCourse: document.getElementById('regCourse'),
    regPassword: document.getElementById('regPassword'),
    regConfirmPassword: document.getElementById('regConfirmPassword'),
    regTerms: document.getElementById('regTerms'),
    btnRegisterSubmit: document.getElementById('btnRegisterSubmit'),
    regEmailFeedback: document.getElementById('regEmailFeedback'),
    regEmailSuggestion: document.getElementById('regEmailSuggestion'),
    regPasswordFeedback: document.getElementById('regPasswordFeedback'),
    regConfirmFeedback: document.getElementById('regConfirmFeedback'),

    // Checklist de Senha
    strengthBars: document.querySelectorAll('.strength-segment'),
    strengthLabel: document.getElementById('strengthLabel'),
    reqLength: document.getElementById('reqLength'),
    reqNumber: document.getElementById('reqNumber'),
    reqUpper: document.getElementById('reqUpper'),
    reqSpecial: document.getElementById('reqSpecial'),

    // Tela de Usuário Logado
    authCardHeader: document.getElementById('authCardHeader'),
    authTabsNav: document.getElementById('authTabsNav'),
    domainAlertBox: document.getElementById('domainAlertBox'),
    userWelcomeScreen: document.getElementById('userWelcomeScreen'),
    welcomeAvatar: document.getElementById('welcomeAvatar'),
    welcomeUserName: document.getElementById('welcomeUserName'),
    welcomeUserEmail: document.getElementById('welcomeUserEmail'),
    welcomeUserCourse: document.getElementById('welcomeUserCourse'),
    btnLogout: document.getElementById('btnLogout'),
    cardFooterActions: document.querySelector('.card-footer-actions'),

    // Botões de Demo e Modais
    btnQuickLogin: document.getElementById('btnQuickLogin'),
    btnFillDemo: document.getElementById('btnFillDemo'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalActionBtn: document.getElementById('modalActionBtn'),
    toastContainer: document.getElementById('toastContainer'),
    btnOpenHeuristics: document.getElementById('btnOpenHeuristics'),
    btnForgotPass: document.getElementById('btnForgotPass'),
    btnOpenTerms: document.getElementById('btnOpenTerms')
  };

  /**
   * Inicialização do Banco de Dados Local
   */
  function initDatabase() {
    let users = getUsers();
    if (!users || users.length === 0) {
      users = DEFAULT_USERS;
    } else {
      // Garante que o perfil de teste está sempre disponível no banco local
      if (!users.some(u => u.email.toLowerCase() === 'teste@ulife.com.br')) {
        users.unshift(DEFAULT_USERS[0]);
      }
    }
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

    // Preenche e-mail se foi lembrado anteriormente
    const remembered = localStorage.getItem(STORAGE_REMEMBER_KEY);
    if (remembered && dom.loginEmail) {
      dom.loginEmail.value = remembered;
      dom.loginRemember.checked = true;
      validateUlifeEmail(dom.loginEmail, dom.loginEmailFeedback, dom.loginDomainSuggestion);
    }

    // Verifica se já existe sessão ativa
    checkActiveSession();
  }

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY)) || DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  }

  function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }

  /**
   * Heurística #1: Visibilidade do Status do Sistema (Toasts)
   */
  function showToast(title, message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-body">
        <div class="toast-title">${escapeHtml(title)}</div>
        <div class="toast-message">${escapeHtml(message)}</div>
      </div>
      <button type="button" class="toast-close" aria-label="Fechar notificação">&times;</button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.remove();
    });

    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'all 250ms ease';
        setTimeout(() => toast.remove(), 260);
      }
    }, duration);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  /**
   * Heurística #3: Controle do Usuário e Liberdade (Alternância de Abas)
   */
  function switchTab(mode) {
    if (mode === 'login') {
      dom.tabLogin.classList.add('active');
      dom.tabRegister.classList.remove('active');
      dom.formLogin.classList.add('active');
      dom.formRegister.classList.remove('active');
      dom.loginEmail.focus();
    } else {
      dom.tabRegister.classList.add('active');
      dom.tabLogin.classList.remove('active');
      dom.formRegister.classList.add('active');
      dom.formLogin.classList.remove('active');
      dom.regName.focus();
    }
  }

  /**
   * Heurística #5 & #9: Prevenção de Erros e Validação Clara do E-mail Institucional (@ulife.com.br)
   */
  function validateUlifeEmail(input, feedbackEl, suggestionEl) {
    const rawValue = input.value.trim();
    const group = input.closest('.form-group');

    // Se estiver vazio
    if (!rawValue) {
      group.classList.remove('has-error', 'has-success');
      feedbackEl.className = 'input-feedback';
      feedbackEl.textContent = '';
      if (suggestionEl) suggestionEl.classList.remove('visible');
      return false;
    }

    const value = rawValue.toLowerCase();

    // Sugestão de auto-completar se o usuário digitou apenas o nome de usuário (ex: "joao.silva")
    if (suggestionEl) {
      if (!value.includes('@') && value.length >= 3) {
        suggestionEl.innerHTML = `<span>+ Sugestão: <strong>${escapeHtml(value)}${REQUIRED_DOMAIN}</strong></span>`;
        suggestionEl.classList.add('visible');
      } else {
        suggestionEl.classList.remove('visible');
      }
    }

    // Validação formal com Regex
    // Deve conter algo antes do @ e terminar estritamente com @ulife.com.br
    const emailPattern = /^[a-zA-Z0-9._%+-]+@ulife\.com\.br$/;

    if (!value.endsWith(REQUIRED_DOMAIN)) {
      group.classList.add('has-error');
      group.classList.remove('has-success');
      feedbackEl.className = 'input-feedback error';
      feedbackEl.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span>O e-mail deve terminar com <strong>@ulife.com.br</strong> (ex: seu.nome@ulife.com.br).</span>
      `;
      return false;
    } else if (!emailPattern.test(value)) {
      group.classList.add('has-error');
      group.classList.remove('has-success');
      feedbackEl.className = 'input-feedback error';
      feedbackEl.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span>Formato de e-mail inválido antes do @ulife.com.br.</span>
      `;
      return false;
    } else {
      group.classList.remove('has-error');
      group.classList.add('has-success');
      feedbackEl.className = 'input-feedback success';
      feedbackEl.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>E-mail institucional Una reconhecido.</span>
      `;
      return true;
    }
  }

  /**
   * Heurística #6: Reconhecimento em vez de memorização (Checklist e Medidor de Força)
   */
  function checkPasswordStrength(password) {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    updateRequirementUI(dom.reqLength, hasMinLength);
    updateRequirementUI(dom.reqNumber, hasNumber);
    updateRequirementUI(dom.reqUpper, hasUpper);
    updateRequirementUI(dom.reqSpecial, hasSpecial);

    let score = 0;
    if (hasMinLength) score++;
    if (hasNumber) score++;
    if (hasUpper) score++;
    if (hasSpecial) score++;

    // Atualiza barras
    dom.strengthBars.forEach((bar, index) => {
      bar.style.backgroundColor = '#E2E8F0';
    });

    if (password.length === 0) {
      dom.strengthLabel.textContent = 'Mínimo 8 caracteres';
      dom.strengthLabel.style.color = 'var(--text-muted)';
      return false;
    }

    if (score <= 1) {
      dom.strengthBars[0].style.backgroundColor = 'var(--error)';
      dom.strengthLabel.textContent = 'Muito fraca';
      dom.strengthLabel.style.color = 'var(--error)';
      return false;
    } else if (score === 2) {
      dom.strengthBars[0].style.backgroundColor = 'var(--warning)';
      dom.strengthBars[1].style.backgroundColor = 'var(--warning)';
      dom.strengthLabel.textContent = 'Razoável';
      dom.strengthLabel.style.color = 'var(--warning)';
      return false;
    } else if (score === 3) {
      dom.strengthBars[0].style.backgroundColor = '#3B82F6';
      dom.strengthBars[1].style.backgroundColor = '#3B82F6';
      dom.strengthBars[2].style.backgroundColor = '#3B82F6';
      dom.strengthLabel.textContent = 'Boa';
      dom.strengthLabel.style.color = '#3B82F6';
      return true;
    } else {
      dom.strengthBars.forEach(bar => bar.style.backgroundColor = 'var(--success)');
      dom.strengthLabel.textContent = 'Excelente e segura';
      dom.strengthLabel.style.color = 'var(--success)';
      return true;
    }
  }

  function updateRequirementUI(element, isMet) {
    if (!element) return;
    if (isMet) {
      element.classList.add('met');
      element.querySelector('svg').innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
    } else {
      element.classList.remove('met');
      element.querySelector('svg').innerHTML = '<circle cx="12" cy="12" r="10"></circle>';
    }
  }

  /**
   * Confirmação de Senha
   */
  function checkPasswordMatch() {
    const pass = dom.regPassword.value;
    const confirm = dom.regConfirmPassword.value;
    const group = dom.regConfirmPassword.closest('.form-group');

    if (!confirm) {
      group.classList.remove('has-error', 'has-success');
      dom.regConfirmFeedback.className = 'input-feedback';
      dom.regConfirmFeedback.textContent = '';
      return false;
    }

    if (pass !== confirm) {
      group.classList.add('has-error');
      group.classList.remove('has-success');
      dom.regConfirmFeedback.className = 'input-feedback error';
      dom.regConfirmFeedback.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span>As senhas não coincidem.</span>
      `;
      return false;
    } else {
      group.classList.remove('has-error');
      group.classList.add('has-success');
      dom.regConfirmFeedback.className = 'input-feedback success';
      dom.regConfirmFeedback.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>Senhas compatíveis.</span>
      `;
      return true;
    }
  }

  /**
   * Heurística #3: Controle do Usuário - Revelar/Ocultar Senha
   */
  function setupPasswordToggles() {
    const toggles = document.querySelectorAll('.toggle-password-btn');
    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        // Atualiza ícone
        btn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Ver senha');
        btn.innerHTML = isPassword
          ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      });
    });
  }

  /**
   * Processamento de Login
   */
  function handleLogin(e) {
    e.preventDefault();

    const email = dom.loginEmail.value.trim().toLowerCase();
    const password = dom.loginPassword.value;

    const isEmailValid = validateUlifeEmail(dom.loginEmail, dom.loginEmailFeedback, dom.loginDomainSuggestion);

    if (!isEmailValid) {
      dom.loginEmail.focus();
      showToast('Atenção ao E-mail', 'Utilize seu e-mail institucional @ulife.com.br.', 'error');
      return;
    }

    if (!password) {
      dom.loginPassword.closest('.form-group').classList.add('has-error');
      dom.loginPasswordFeedback.className = 'input-feedback error';
      dom.loginPasswordFeedback.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span>Por favor, informe sua senha institucional.</span>
      `;
      dom.loginPassword.focus();
      return;
    } else {
      dom.loginPassword.closest('.form-group').classList.remove('has-error');
      dom.loginPasswordFeedback.className = 'input-feedback';
      dom.loginPasswordFeedback.textContent = '';
    }

    // Heurística #1: Indicador de carregamento (visibilidade do status)
    dom.btnLoginSubmit.classList.add('loading');
    dom.btnLoginSubmit.disabled = true;

    setTimeout(() => {
      dom.btnLoginSubmit.classList.remove('loading');
      dom.btnLoginSubmit.disabled = false;

      const users = getUsers();
      const matched = users.find(u => u.email.toLowerCase() === email && u.password === password);

      if (matched) {
        // Sucesso de autenticação
        if (dom.loginRemember.checked) {
          localStorage.setItem(STORAGE_REMEMBER_KEY, email);
        } else {
          localStorage.removeItem(STORAGE_REMEMBER_KEY);
        }

        // Salva sessão ativa
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(matched));

        showToast('Login bem-sucedido!', `Bem-vindo(a) à Wiki Una, ${matched.name.split(' ')[0]}! Redirecionando...`, 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 500);
      } else {
        // Falha no Login (Heurística #9)
        const emailExists = users.some(u => u.email.toLowerCase() === email);

        if (!emailExists) {
          dom.loginEmailFeedback.className = 'input-feedback error';
          dom.loginEmailFeedback.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>Conta não encontrada com este e-mail. <a href="#" id="linkGoToRegister" style="color:var(--primary);font-weight:600;">Criar conta agora?</a></span>
          `;
          document.getElementById('linkGoToRegister')?.addEventListener('click', (ev) => {
            ev.preventDefault();
            switchTab('register');
            dom.regEmail.value = email;
            validateUlifeEmail(dom.regEmail, dom.regEmailFeedback, dom.regEmailSuggestion);
          });
        } else {
          dom.loginPasswordFeedback.className = 'input-feedback error';
          dom.loginPasswordFeedback.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>Senha incorreta para esta conta. Verifique maiúsculas/minúsculas.</span>
          `;
        }

        showToast('Falha na autenticação', 'Credenciais inválidas. Verifique seu e-mail e senha.', 'error');
      }
    }, 700);
  }

  /**
   * Processamento de Criação de Conta
   */
  function handleRegister(e) {
    e.preventDefault();

    const name = dom.regName.value.trim();
    const email = dom.regEmail.value.trim().toLowerCase();
    const course = dom.regCourse.value.trim() || 'Comunidade Acadêmica Una';
    const password = dom.regPassword.value;
    const confirmPassword = dom.regConfirmPassword.value;
    const acceptedTerms = dom.regTerms.checked;

    if (!name || name.length < 3) {
      showToast('Nome incompleto', 'Informe seu nome e sobrenome.', 'error');
      dom.regName.focus();
      return;
    }

    const isEmailValid = validateUlifeEmail(dom.regEmail, dom.regEmailFeedback, dom.regEmailSuggestion);
    if (!isEmailValid) {
      showToast('E-mail Institucional Obrigatório', 'Você deve utilizar o e-mail @ulife.com.br fornecido pela Una.', 'error');
      dom.regEmail.focus();
      return;
    }

    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email)) {
      dom.regEmailFeedback.className = 'input-feedback error';
      dom.regEmailFeedback.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span>Este e-mail já possui cadastro. Faça login ou recupere sua senha.</span>
      `;
      showToast('E-mail já cadastrado', 'Já existe uma conta associada a este endereço.', 'error');
      dom.regEmail.focus();
      return;
    }

    if (password.length < 8) {
      showToast('Senha muito curta', 'A senha deve conter ao menos 8 caracteres com letras e números.', 'error');
      dom.regPassword.focus();
      return;
    }

    if (password !== confirmPassword) {
      showToast('Senhas não conferem', 'Certifique-se de digitar a mesma senha nos dois campos.', 'error');
      dom.regConfirmPassword.focus();
      return;
    }

    if (!acceptedTerms) {
      showToast('Termos de Uso', 'Você deve concordar com as diretrizes acadêmicas da Wiki Una.', 'error');
      dom.regTerms.focus();
      return;
    }

    // Heurística #1: Feedback de criação de conta
    dom.btnRegisterSubmit.classList.add('loading');
    dom.btnRegisterSubmit.disabled = true;

    setTimeout(() => {
      dom.btnRegisterSubmit.classList.remove('loading');
      dom.btnRegisterSubmit.disabled = false;

      const newUser = {
        name,
        email,
        password,
        course,
        createdAt: new Date().toISOString()
      };

      saveUser(newUser);

      // Salva sessão direta
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newUser));

      showToast('Conta criada com sucesso!', 'Seu acesso à Wiki Una foi ativado. Redirecionando...', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 500);
    }, 800);
  }

  /**
   * Apresentação da Área Logada (Dashboard do Aluno / Wiki Una)
   */
  function showUserDashboard(user) {
    window.location.href = 'dashboard.html';
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    dom.userWelcomeScreen.style.display = 'none';

    dom.authCardHeader.style.display = 'flex';
    dom.authTabsNav.style.display = 'grid';
    dom.domainAlertBox.style.display = 'flex';
    if (dom.cardFooterActions) dom.cardFooterActions.style.display = 'flex';

    switchTab('login');
    showToast('Sessão encerrada', 'Você saiu da Wiki Una com segurança.', 'info');
  }

  function checkActiveSession() {
    const session = localStorage.getItem(STORAGE_SESSION_KEY);
    if (session) {
      try {
        const user = JSON.parse(session);
        if (user && user.email) {
          window.location.href = 'dashboard.html';
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_SESSION_KEY);
      }
    }
  }

  /**
   * Heurística #7: Atalho para Teste / Avaliação Rápida
   */
  function setupDemoHelper() {
    if (dom.btnFillDemo) {
      dom.btnFillDemo.addEventListener('click', () => {
        switchTab('login');
        dom.loginEmail.value = 'teste@ulife.com.br';
        dom.loginPassword.value = '123456';
        validateUlifeEmail(dom.loginEmail, dom.loginEmailFeedback, dom.loginDomainSuggestion);
        showToast('Credenciais preenchidas', 'Perfil de teste preenchido (teste@ulife.com.br)!', 'info');
      });
    }

    if (dom.btnQuickLogin) {
      dom.btnQuickLogin.addEventListener('click', () => {
        const testUser = {
          name: 'Usuário Teste',
          email: 'teste@ulife.com.br',
          password: '123456',
          course: 'Ciência da Computação',
          createdAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(testUser));
        showToast('Acesso Rápido', 'Entrando como Usuário Teste...', 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 300);
      });
    }
  }

  /**
   * Modais de Ajuda (Heurísticas de Nielsen, Esqueci a Senha, Termos)
   */
  function openModal(title, htmlContent) {
    dom.modalTitle.textContent = title;
    dom.modalBody.innerHTML = htmlContent;
    dom.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    dom.modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function setupModals() {
    dom.modalCloseBtn.addEventListener('click', closeModal);
    dom.modalActionBtn.addEventListener('click', closeModal);
    dom.modalOverlay.addEventListener('click', (e) => {
      if (e.target === dom.modalOverlay) closeModal();
    });

    // Tecla ESC para fechar modal (Heurística #3 - Liberdade do usuário)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dom.modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });

    // Modal das 10 Heurísticas de Nielsen
    if (dom.btnOpenHeuristics) {
      dom.btnOpenHeuristics.addEventListener('click', (e) => {
        e.preventDefault();
        const content = `
          <div class="heuristics-grid">
            <div class="heuristic-card">
              <h4>1. Visibilidade do status do sistema</h4>
              <p>Botões com estado de carregamento (spinner), feedbacks em tempo real de validação e sistema dinâmico de notificações Toast.</p>
            </div>
            <div class="heuristic-card">
              <h4>2. Correspondência com o mundo real</h4>
              <p>Linguagem institucional clara, contextualizada para a comunidade Una e ecossistema @ulife.com.br com ícones intuitivos.</p>
            </div>
            <div class="heuristic-card">
              <h4>3. Controle e liberdade do usuário</h4>
              <p>Alternância suave entre Login e Cadastro, botões para mostrar/ocultar senha, tecla ESC para modais e encerramento de sessão simplificado.</p>
            </div>
            <div class="heuristic-card">
              <h4>4. Consistência e padrões</h4>
              <p>Identidade visual alinhada às cores institucionais da Una, posicionamento convencional de formulários e convenções da web.</p>
            </div>
            <div class="heuristic-card">
              <h4>5. Prevenção de erros</h4>
              <p>Bloqueio e alerta instantâneo caso o e-mail não seja @ulife.com.br, chip de auto-completar e checklist de requisitos de senha em tempo real.</p>
            </div>
            <div class="heuristic-card">
              <h4>6. Reconhecimento em vez de memorização</h4>
              <p>Rótulos fixos e visíveis, checklist explicativo de requisitos de segurança da senha e lembrete de conta salva.</p>
            </div>
            <div class="heuristic-card">
              <h4>7. Flexibilidade e eficiência de uso</h4>
              <p>Navegação por teclado (Tab e Enter), botão de demonstração rápida ("Preencher Demo") e sugestão de sufixo institucional em 1 clique.</p>
            </div>
            <div class="heuristic-card">
              <h4>8. Design estético e minimalista</h4>
              <p>Layout clean, espaçamento harmônico, ausência de poluição visual e foco total na tarefa primária de autenticação.</p>
            </div>
            <div class="heuristic-card">
              <h4>9. Auxílio no reconhecimento e recuperação de erros</h4>
              <p>Mensagens de erro explícitas, gentis e que indicam exatamente como corrigir (ex: sugerir o formato institucional e link rápido para cadastro se não existir).</p>
            </div>
            <div class="heuristic-card">
              <h4>10. Ajuda e documentação</h4>
              <p>Tooltips informativos sobre a obrigatoriedade do e-mail acadêmico, termos de uso e guia das heurísticas acessível a qualquer momento.</p>
            </div>
          </div>
        `;
        openModal('Heurísticas de Jakob Nielsen na Wiki Una', content);
      });
    }

    // Modal Esqueci Minha Senha
    if (dom.btnForgotPass) {
      dom.btnForgotPass.addEventListener('click', (e) => {
        e.preventDefault();
        const currentEmail = dom.loginEmail.value.trim();
        const content = `
          <p>Para sua segurança, a redefinição de acesso aos sistemas acadêmicos da Una é sincronizada com o Portal Ulife.</p>
          <br>
          <div style="background:var(--surface-alt);padding:1rem;border-radius:var(--radius-md);border:1px solid var(--border);">
            <label style="font-weight:600;font-size:0.85rem;display:block;margin-bottom:0.4rem;">Confirmar seu e-mail @ulife.com.br:</label>
            <input type="email" id="modalForgotEmail" value="${escapeHtml(currentEmail)}" placeholder="seu.nome@ulife.com.br" class="form-input" style="padding-left:1rem;">
          </div>
          <br>
          <button type="button" id="btnSendResetLink" class="btn-primary" style="margin-top:0.5rem;">
            Enviar Instruções de Recuperação
          </button>
        `;
        openModal('Recuperação de Senha - Wiki Una', content);

        setTimeout(() => {
          document.getElementById('btnSendResetLink')?.addEventListener('click', () => {
            const input = document.getElementById('modalForgotEmail');
            if (input && input.value.endsWith('@ulife.com.br')) {
              showToast('Link de recuperação enviado', `Instruções enviadas para ${input.value}.`, 'success');
              closeModal();
            } else {
              showToast('E-mail inválido', 'Digite um e-mail válido com o final @ulife.com.br.', 'error');
            }
          });
        }, 100);
      });
    }

    // Modal Termos de Uso
    if (dom.btnOpenTerms) {
      dom.btnOpenTerms.addEventListener('click', (e) => {
        e.preventDefault();
        const content = `
          <p>Bem-vindo(a) à <strong>Wiki Una</strong>! Esta plataforma foi desenvolvida como um repositório colaborativo de conhecimento acadêmico, projetos e materiais didáticos para estudantes e professores da Una.</p>
          <br>
          <h4 style="color:var(--text-main);margin-bottom:0.3rem;">1. Acesso Institucional</h4>
          <p>O acesso é exclusivo a discentes, docentes e colaboradores devidamente matriculados ou vinculados à instituição com e-mail ativo <strong>@ulife.com.br</strong>.</p>
          <br>
          <h4 style="color:var(--text-main);margin-bottom:0.3rem;">2. Ética e Colaboração</h4>
          <p>Todas as contribuições e edições na Wiki devem respeitar a integridade acadêmica, direitos autorais e as diretrizes do código de conduta institucional da Ânima Educação.</p>
          <br>
          <h4 style="color:var(--text-main);margin-bottom:0.3rem;">3. Privacidade e Dados</h4>
          <p>Seus dados cadastrais são utilizados unicamente para identificação nas colaborações e artigos da plataforma.</p>
        `;
        openModal('Diretrizes e Termos de Uso da Wiki Una', content);
      });
    }
  }

  /**
   * Registro de Eventos e Listeners
   */
  function setupEventListeners() {
    // Alternância de Abas
    if (dom.tabLogin && dom.tabRegister) {
      dom.tabLogin.addEventListener('click', () => switchTab('login'));
      dom.tabRegister.addEventListener('click', () => switchTab('register'));
    }

    // Validação em tempo real do e-mail de login
    if (dom.loginEmail) {
      dom.loginEmail.addEventListener('input', () => {
        validateUlifeEmail(dom.loginEmail, dom.loginEmailFeedback, dom.loginDomainSuggestion);
      });
    }

    // Clique na sugestão de domínio no login
    if (dom.loginDomainSuggestion) {
      dom.loginDomainSuggestion.addEventListener('click', () => {
        const val = dom.loginEmail?.value.trim() || '';
        dom.loginEmail.value = `${val}${REQUIRED_DOMAIN}`;
        validateUlifeEmail(dom.loginEmail, dom.loginEmailFeedback, dom.loginDomainSuggestion);
        dom.loginPassword?.focus();
      });
    }

    // Validação em tempo real do e-mail de cadastro
    if (dom.regEmail) {
      dom.regEmail.addEventListener('input', () => {
        validateUlifeEmail(dom.regEmail, dom.regEmailFeedback, dom.regEmailSuggestion);
      });
    }

    // Clique na sugestão de domínio no cadastro
    if (dom.regEmailSuggestion) {
      dom.regEmailSuggestion.addEventListener('click', () => {
        const val = dom.regEmail?.value.trim() || '';
        dom.regEmail.value = `${val}${REQUIRED_DOMAIN}`;
        validateUlifeEmail(dom.regEmail, dom.regEmailFeedback, dom.regEmailSuggestion);
        dom.regPassword?.focus();
      });
    }

    // Validação de força de senha no cadastro
    if (dom.regPassword) {
      dom.regPassword.addEventListener('input', () => {
        checkPasswordStrength(dom.regPassword.value);
        if (dom.regConfirmPassword && dom.regConfirmPassword.value) checkPasswordMatch();
      });
    }

    // Confirmação de senha
    if (dom.regConfirmPassword) {
      dom.regConfirmPassword.addEventListener('input', checkPasswordMatch);
    }

    // Submissão dos formulários
    if (dom.formLogin) {
      dom.formLogin.addEventListener('submit', handleLogin);
    }
    if (dom.formRegister) {
      dom.formRegister.addEventListener('submit', handleRegister);
    }

    // Logout
    if (dom.btnLogout) {
      dom.btnLogout.addEventListener('click', handleLogout);
    }

    // Senhas
    setupPasswordToggles();

    // Utilitário de Demonstração
    setupDemoHelper();

    // Modais
    setupModals();
  }

  // Executa na carga do DOM
  document.addEventListener('DOMContentLoaded', () => {
    initDatabase();
    setupEventListeners();
  });
})();


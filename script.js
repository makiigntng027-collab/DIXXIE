// Storage Key for registered users in LocalStorage
    const USERS_KEY = 'dixxie_registered_users';
    const CURRENT_USER_KEY = 'dixxie_active_session';

    // Seed default demo account if none exists
    function initUsers() {
      let users = JSON.parse(localStorage.getItem(USERS_KEY));
      if (!users || !Array.isArray(users)) {
        users = [
          { username: 'dixxie', name: 'Dixxie Owner', password: '123' }
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    }

    // Check auth on load
    window.addEventListener('DOMContentLoaded', () => {
      initUsers();
      checkAuthSession();
    });

    function checkAuthSession() {
      const activeUser = localStorage.getItem(CURRENT_USER_KEY);
      const authScreen = document.getElementById('authScreen');
      const userDisplay = document.getElementById('currentUserDisplay');

      if (activeUser) {
        authScreen.classList.add('hidden');
        userDisplay.textContent = activeUser.toUpperCase();
      } else {
        authScreen.classList.remove('hidden');
      }
    }

    // Auth Tab Switcher
    function switchAuthTab(tab) {
      const loginForm = document.getElementById('loginForm');
      const regForm = document.getElementById('registerForm');
      const tabLoginBtn = document.getElementById('tabLoginBtn');
      const tabRegBtn = document.getElementById('tabRegisterBtn');
      const toast = document.getElementById('authToast');

      toast.classList.add('hidden');

      if (tab === 'login') {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
        tabLoginBtn.className = "flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-brand-cyan to-blue-600 text-black shadow-neon-cyan";
        tabRegBtn.className = "flex-1 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-white transition-all duration-300";
      } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
        tabRegBtn.className = "flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-neon-purple";
        tabLoginBtn.className = "flex-1 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-white transition-all duration-300";
      }
    }

    // Toast Notice helper
    function showAuthToast(msg, type = 'error') {
      const toast = document.getElementById('authToast');
      toast.classList.remove('hidden', 'bg-red-500/20', 'text-red-300', 'bg-emerald-500/20', 'text-emerald-300');
      
      if (type === 'error') {
        toast.classList.add('bg-red-500/20', 'text-red-300', 'border', 'border-red-500/30');
      } else {
        toast.classList.add('bg-emerald-500/20', 'text-emerald-300', 'border', 'border-emerald-500/30');
      }
      toast.textContent = msg;
    }

    // Login Handler
    function handleLogin(e) {
      e.preventDefault();
      const userVal = document.getElementById('loginUser').value.trim();
      const passVal = document.getElementById('loginPass').value.trim();

      const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
      const match = users.find(u => u.username.toLowerCase() === userVal.toLowerCase() && u.password === passVal);

      if (match) {
        localStorage.setItem(CURRENT_USER_KEY, match.username);
        showAuthToast('Login successful! Launching portal...', 'success');
        setTimeout(() => {
          checkAuthSession();
        }, 600);
      } else {
        showAuthToast('Invalid username or password. Try demo: dixxie / 123', 'error');
      }
    }

    // Register Handler
    function handleRegister(e) {
      e.preventDefault();
      const nameVal = document.getElementById('regName').value.trim();
      const userVal = document.getElementById('regUser').value.trim();
      const passVal = document.getElementById('regPass').value.trim();

      if (passVal.length < 3) {
        showAuthToast('Password must be at least 3 characters.', 'error');
        return;
      }

      const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
      const exists = users.some(u => u.username.toLowerCase() === userVal.toLowerCase());

      if (exists) {
        showAuthToast('Username already taken. Try another.', 'error');
        return;
      }

      users.push({ name: nameVal, username: userVal, password: passVal });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      showAuthToast('Account created successfully! Switching to sign in...', 'success');
      setTimeout(() => {
        switchAuthTab('login');
        document.getElementById('loginUser').value = userVal;
        document.getElementById('loginPass').value = '';
      }, 1000);
    }

    // Quick Demo Login Action
    function useDemoLogin() {
      document.getElementById('loginUser').value = 'dixxie';
      document.getElementById('loginPass').value = '123';
      showAuthToast('Demo credentials pre-filled! Click Access Portal.', 'success');
    }

    // Logout
    function handleLogout() {
      localStorage.removeItem(CURRENT_USER_KEY);
      checkAuthSession();
      // Reset sidebar if open
      document.getElementById('sidebar').classList.add('-translate-x-full');
      document.getElementById('sidebarOverlay').classList.add('hidden');
    }

    // Sidebar Toggle
    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      
      const isOpen = !sidebar.classList.contains('-translate-x-full');
      if (isOpen) {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
      } else {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
      }
    }

    // Theme Toggle (Dark / Light)
    function toggleTheme() {
      const html = document.documentElement;
      const themeIcon = document.getElementById('themeIcon');
      
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        document.body.classList.remove('bg-brand-dark', 'text-slate-100');
        document.body.classList.add('bg-slate-100', 'text-slate-900');
      } else {
        html.classList.remove('light');
        html.classList.add('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        document.body.classList.remove('bg-slate-100', 'text-slate-900');
        document.body.classList.add('bg-brand-dark', 'text-slate-100');
      }
    }

    // Contact Form Handler
    function handleContactSubmit(e) {
      e.preventDefault();
      alert('Thank you for reaching out to DIXXIE NEWERA! Your message has been sent successfully.');
      e.target.reset();
    }

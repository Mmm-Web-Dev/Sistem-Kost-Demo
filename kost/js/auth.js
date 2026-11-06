/**
 * auth.js — Kost Management System
 * Authentication management: login, logout, session, role guards.
 *
 * Depends on: data.js (window.KostDB must be loaded first)
 */

(function () {
  'use strict';

  /* ============================================================
     Helpers
  ============================================================ */

  /**
   * Determine whether the current page lives inside a sub-folder
   * (admin/, user/, owner/, payment/) or at the root.
   * Returns '../' when inside a sub-folder, '' when at root.
   */
  function _rootPrefix() {
    const path = window.location.pathname;
    // Any segment deeper than root (e.g. /admin/dashboard.html)
    const segments = path.split('/').filter(Boolean);
    // If the second-to-last segment is one of the known sub-folders, we're one level deep
    const subFolders = ['admin', 'user', 'owner', 'payment'];
    if (segments.length >= 2 && subFolders.includes(segments[segments.length - 2])) {
      return '../';
    }
    return '';
  }

  /**
   * Safely redirect, preventing infinite redirect loops.
   */
  function _redirect(url) {
    if (window.location.href.indexOf(url) === -1) {
      window.location.href = url;
    }
  }

  /* ============================================================
     window.KostAuth — Public API
  ============================================================ */

  window.KostAuth = {

    /**
     * Returns the currently logged-in user object, or null.
     */
    getCurrentUser() {
      try {
        return JSON.parse(localStorage.getItem('kost_current_user') || 'null');
      } catch (e) {
        return null;
      }
    },

    /**
     * Attempt login with email + password.
     * @returns {{ success: boolean, user?: object, error?: string }}
     */
    login(email, password) {
      if (!email || !password) {
        return { success: false, error: 'Email dan password harus diisi.' };
      }

      const users = window.KostDB.getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return { success: false, error: 'Email atau password salah.' };
      }

      if (!user.is_active) {
        return { success: false, error: 'Akun Anda telah dinonaktifkan. Hubungi admin.' };
      }

      // Strip password from session object
      const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar || null
      };

      localStorage.setItem('kost_current_user', JSON.stringify(sessionUser));

      // Activity log
      window.KostDB.addLog(user.id, user.name, 'Login', 'Berhasil masuk ke sistem.');

      return { success: true, user: sessionUser };
    },

    /**
     * Log out the current user and redirect to login page.
     * @param {boolean} [askConfirm=false] Whether to ask user confirmation first
     */
    logout(askConfirm) {
      const doLogout = () => {
        const user = this.getCurrentUser();
        if (user && window.KostDB) {
          window.KostDB.addLog(user.id, user.name, 'Logout', 'Pengguna keluar dari sesi akun.');
        }
        localStorage.removeItem('kost_current_user');
        window.location.href = _rootPrefix() + 'login.html';
      };

      if (askConfirm && window.KostUtils && typeof window.KostUtils.confirm === 'function') {
        window.KostUtils.confirm('Apakah Anda yakin ingin keluar dari akun ini?', 'Konfirmasi Keluar', doLogout);
      } else {
        doLogout();
      }
    },

    /**
     * Alias for requireAuth
     */
    guard(allowedRoles) {
      return this.requireAuth(allowedRoles);
    },

    /**
     * Guard: ensures a user is logged in and has an allowed role.
     * Call this at the top of every dashboard page.
     *
     * @param {string|string[]} allowedRoles  e.g. 'admin', ['admin','owner']
     * @returns {object} The current user object (or redirects away).
     */
    requireAuth(allowedRoles) {
      const user = this.getCurrentUser();
      const prefix = _rootPrefix();

      if (!user) {
        _redirect(prefix + 'login.html');
        return null;
      }

      if (allowedRoles) {
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        if (!roles.includes(user.role)) {
          // Redirect to their own dashboard
          _redirect(this.getDashboardUrl(user.role));
          return null;
        }
      }

      return user;
    },

    /**
     * Returns the absolute dashboard URL for a given role.
     * Uses _rootPrefix() to handle sub-folder vs root pages.
     */
    getDashboardUrl(role) {
      const prefix = _rootPrefix();
      if (role === 'admin') return prefix + 'admin/dashboard.html';
      if (role === 'owner') return prefix + 'owner/dashboard.html';
      return prefix + 'user/dashboard.html';
    },

    /**
     * Update the current user's profile fields.
     * @param {object} data  Fields to update (name, phone, address, etc.)
     * @returns {{ success: boolean, error?: string }}
     */
    updateProfile(data) {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return { success: false, error: 'Tidak ada sesi aktif.' };

      // Disallow role / password changes via this method
      const forbidden = ['password', 'role', 'id'];
      forbidden.forEach(f => delete data[f]);

      const updatedUser = window.KostDB.updateUser(currentUser.id, data);
      if (!updatedUser) return { success: false, error: 'Gagal memperbarui profil.' };

      // Refresh session (strip password)
      const sessionUser = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar || null
      };
      localStorage.setItem('kost_current_user', JSON.stringify(sessionUser));

      window.KostDB.addLog(currentUser.id, currentUser.name, 'Update Profil', 'Memperbarui data profil.');

      return { success: true, user: sessionUser };
    },

    /**
     * Change the current user's password.
     * @param {string} oldPassword
     * @param {string} newPassword
     * @returns {{ success: boolean, error?: string }}
     */
    changePassword(oldPassword, newPassword) {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return { success: false, error: 'Tidak ada sesi aktif.' };

      if (!oldPassword || !newPassword) {
        return { success: false, error: 'Password lama dan baru harus diisi.' };
      }
      if (newPassword.length < 6) {
        return { success: false, error: 'Password baru minimal 6 karakter.' };
      }

      const userRecord = window.KostDB.getUserById(currentUser.id);
      if (!userRecord || userRecord.password !== oldPassword) {
        return { success: false, error: 'Password lama tidak sesuai.' };
      }

      window.KostDB.updateUser(currentUser.id, { password: newPassword });
      window.KostDB.addLog(currentUser.id, currentUser.name, 'Ganti Password', 'Password berhasil diubah.');

      return { success: true };
    },

    /**
     * Register a new user (role always 'user').
     * @param {object} data  { name, email, password, phone, ... }
     * @returns {{ success: boolean, user?: object, error?: string }}
     */
    register(data) {
      if (!data.name || !data.email || !data.password) {
        return { success: false, error: 'Nama, email, dan password harus diisi.' };
      }

      const existing = window.KostDB.getUserByEmail(data.email);
      if (existing) {
        return { success: false, error: 'Email sudah terdaftar.' };
      }

      if (data.password.length < 6) {
        return { success: false, error: 'Password minimal 6 karakter.' };
      }

      const newUser = window.KostDB.createUser(Object.assign({ role: 'user', is_active: true }, data));

      window.KostDB.addLog(newUser.id, newUser.name, 'Registrasi', 'Akun baru berhasil dibuat.');

      const sessionUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone || null,
        avatar: newUser.avatar || null
      };

      localStorage.setItem('kost_current_user', JSON.stringify(sessionUser));

      return { success: true, user: sessionUser };
    }
  };

})();

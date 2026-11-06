/**
 * utils.js — Kost Management System
 * Shared utility functions exposed as window.KostUtils.
 *
 * Depends on: data.js, auth.js
 */

(function () {
  'use strict';

  /* ============================================================
     Internal helpers
  ============================================================ */

  const INDONESIAN_MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  /** Inject a <style> block once for toast + confirm modal */
  let _stylesInjected = false;
  function _injectStyles() {
    if (_stylesInjected) return;
    _stylesInjected = true;

    const css = `
/* ---- KostUtils: Toast ---- */
#kost-toast-container {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}
.kost-toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 280px;
  max-width: 380px;
  padding: 0.875rem 1rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #2563eb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  pointer-events: all;
  animation: kost-toast-in 0.25s ease;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: #0f172a;
}
.kost-toast.success  { border-left-color: #16a34a; }
.kost-toast.warning  { border-left-color: #d97706; }
.kost-toast.danger   { border-left-color: #dc2626; }
.kost-toast.info     { border-left-color: #2563eb; }
.kost-toast__icon    { flex-shrink: 0; margin-top: 1px; }
.kost-toast__icon svg{ display: block; }
.kost-toast.success  .kost-toast__icon { color: #16a34a; }
.kost-toast.warning  .kost-toast__icon { color: #d97706; }
.kost-toast.danger   .kost-toast__icon { color: #dc2626; }
.kost-toast.info     .kost-toast__icon { color: #2563eb; }
.kost-toast__body    { flex: 1; }
.kost-toast__title   { font-weight: 600; margin-bottom: 2px; }
.kost-toast__msg     { color: #64748b; line-height: 1.4; }
.kost-toast__close   { flex-shrink: 0; cursor: pointer; color: #94a3b8; border: none; background: none; padding: 0; line-height: 1; }
.kost-toast__close:hover { color: #64748b; }
.kost-toast.removing { animation: kost-toast-out 0.25s ease forwards; }
@keyframes kost-toast-in  { from { opacity: 0; transform: translateX(1rem); } to { opacity: 1; transform: translateX(0); } }
@keyframes kost-toast-out { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(1rem); } }

/* ---- KostUtils: Confirm Modal ---- */
#kost-confirm-overlay {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(15,23,42,0.45);
  display: flex; align-items: center; justify-content: center;
  animation: kost-fade-in 0.15s ease;
  font-family: 'Inter', sans-serif;
}
@keyframes kost-fade-in { from { opacity: 0; } to { opacity: 1; } }
#kost-confirm-box {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  animation: kost-slide-up 0.2s ease;
}
@keyframes kost-slide-up { from { transform: translateY(1rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
#kost-confirm-box h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
}
#kost-confirm-box p {
  margin: 0 0 1.5rem;
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
}
.kost-confirm-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
.kost-confirm-actions button {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background 0.15s;
  font-family: 'Inter', sans-serif;
}
.kost-btn-cancel {
  background: #f1f5f9;
  color: #475569;
}
.kost-btn-cancel:hover { background: #e2e8f0; }
.kost-btn-confirm {
  background: #dc2626;
  color: #fff;
}
.kost-btn-confirm:hover { background: #b91c1c; }
`;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* Toast icon SVGs (inline, no lucide dependency needed here) */
  const TOAST_ICONS = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    danger:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    info:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
  };

  const TOAST_TITLES = {
    success: 'Berhasil',
    warning: 'Peringatan',
    danger:  'Gagal',
    info:    'Informasi'
  };

  /* ============================================================
     window.KostUtils — Public API
  ============================================================ */

  window.KostUtils = {

    /* ---- Toast ---- */

    /**
     * Show a toast notification in the top-right corner.
     * @param {string} message
     * @param {'success'|'warning'|'danger'|'info'} type
     * @param {number} duration  Auto-dismiss ms (default 3500)
     */
    showToast(message, type = 'success', duration = 3500) {
      _injectStyles();

      let container = document.getElementById('kost-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'kost-toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `kost-toast ${type}`;
      toast.innerHTML = `
        <span class="kost-toast__icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</span>
        <div class="kost-toast__body">
          <div class="kost-toast__title">${TOAST_TITLES[type] || 'Info'}</div>
          <div class="kost-toast__msg">${message}</div>
        </div>
        <button class="kost-toast__close" aria-label="Tutup">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;

      const removeToast = () => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 250);
      };

      toast.querySelector('.kost-toast__close').addEventListener('click', removeToast);
      container.appendChild(toast);

      setTimeout(removeToast, duration);
    },

    /* ---- Confirm Dialog ---- */

    /**
     * Show a confirmation dialog modal.
     * @param {string} message      Body text
     * @param {Function} onConfirm  Called on confirm
     * @param {Function} [onCancel] Called on cancel
     * @param {string} [title]      Dialog title (default 'Konfirmasi')
     */
    confirm(message, onConfirm, onCancel, title = 'Konfirmasi') {
      _injectStyles();

      // Remove any existing dialog
      const existing = document.getElementById('kost-confirm-overlay');
      if (existing) existing.remove();

      const overlay = document.createElement('div');
      overlay.id = 'kost-confirm-overlay';
      overlay.innerHTML = `
        <div id="kost-confirm-box">
          <h3>${title}</h3>
          <p>${message}</p>
          <div class="kost-confirm-actions">
            <button class="kost-btn-cancel" id="kost-confirm-cancel">Batal</button>
            <button class="kost-btn-confirm" id="kost-confirm-ok">Ya, Lanjutkan</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      const cleanup = () => {
        overlay.style.animation = 'kost-fade-in 0.15s ease reverse';
        setTimeout(() => overlay.remove(), 150);
      };

      overlay.querySelector('#kost-confirm-ok').addEventListener('click', () => {
        cleanup();
        if (typeof onConfirm === 'function') onConfirm();
      });

      overlay.querySelector('#kost-confirm-cancel').addEventListener('click', () => {
        cleanup();
        if (typeof onCancel === 'function') onCancel();
      });

      // Click outside to cancel
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          cleanup();
          if (typeof onCancel === 'function') onCancel();
        }
      });
    },

    /* ---- Formatting ---- */

    /**
     * Format a number as Indonesian Rupiah.
     * @param {number} amount
     * @returns {string}  e.g. "Rp 1.500.000"
     */
    formatCurrency(amount) {
      if (amount === null || amount === undefined) return 'Rp 0';
      return 'Rp ' + Number(amount).toLocaleString('id-ID');
    },

    /**
     * Format a date string to Indonesian long format.
     * @param {string} dateStr
     * @returns {string}  e.g. "15 Februari 2024"
     */
    formatDate(dateStr) {
      if (!dateStr) return '-';
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.getDate() + ' ' + INDONESIAN_MONTHS[d.getMonth()] + ' ' + d.getFullYear();
      } catch (e) {
        return dateStr;
      }
    },

    /**
     * Format a date-time string to Indonesian long format with time.
     * @param {string} dateStr
     * @returns {string}  e.g. "15 Februari 2024, 10:30 WIB"
     */
    formatDateTime(dateStr) {
      if (!dateStr) return '-';
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const hh = d.getHours().toString().padStart(2, '0');
        const mm = d.getMinutes().toString().padStart(2, '0');
        return d.getDate() + ' ' + INDONESIAN_MONTHS[d.getMonth()] + ' ' + d.getFullYear() + ', ' + hh + ':' + mm + ' WIB';
      } catch (e) {
        return dateStr;
      }
    },

    /* ---- Status Badges ---- */

    /**
     * Return an HTML string for a colour-coded pill badge.
     * @param {string} status
     * @param {'booking'|'payment'|'complaint'|'room'|string} [context]
     * @returns {string}
     */
    getStatusBadge(status, context) {
      const maps = {
        booking: {
          pending:   { color: '#d97706', bg: '#fffbeb', label: 'Menunggu' },
          approved:  { color: '#2563eb', bg: '#eff6ff', label: 'Disetujui' },
          active:    { color: '#16a34a', bg: '#f0fdf4', label: 'Aktif' },
          completed: { color: '#475569', bg: '#f8fafc', label: 'Selesai' },
          cancelled: { color: '#dc2626', bg: '#fef2f2', label: 'Dibatalkan' }
        },
        payment: {
          pending:   { color: '#d97706', bg: '#fffbeb', label: 'Menunggu' },
          success:   { color: '#16a34a', bg: '#f0fdf4', label: 'Lunas' },
          failed:    { color: '#dc2626', bg: '#fef2f2', label: 'Gagal' },
          expired:   { color: '#475569', bg: '#f8fafc', label: 'Kedaluwarsa' },
          cancelled: { color: '#475569', bg: '#f8fafc', label: 'Dibatalkan' },
          refunded:  { color: '#2563eb', bg: '#eff6ff', label: 'Dikembalikan' }
        },
        complaint: {
          open:        { color: '#dc2626', bg: '#fef2f2', label: 'Terbuka' },
          in_progress: { color: '#d97706', bg: '#fffbeb', label: 'Diproses' },
          resolved:    { color: '#16a34a', bg: '#f0fdf4', label: 'Selesai' }
        },
        room: {
          available:   { color: '#16a34a', bg: '#f0fdf4', label: 'Tersedia' },
          occupied:    { color: '#475569', bg: '#f8fafc', label: 'Ditempati' },
          reserved:    { color: '#d97706', bg: '#fffbeb', label: 'Dipesan' },
          maintenance: { color: '#dc2626', bg: '#fef2f2', label: 'Renovasi' }
        }
      };

      let config = null;

      if (context && maps[context] && maps[context][status]) {
        config = maps[context][status];
      } else {
        // Auto-detect from all maps
        for (const ctx of Object.values(maps)) {
          if (ctx[status]) { config = ctx[status]; break; }
        }
      }

      if (!config) {
        config = { color: '#64748b', bg: '#f1f5f9', label: status };
      }

      return `<span style="
        display: inline-flex;
        align-items: center;
        padding: 2px 10px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.01em;
        color: ${config.color};
        background: ${config.bg};
        white-space: nowrap;
      ">${config.label}</span>`;
    },

    /* ---- Notifications ---- */

    /**
     * Update the unread notification badge count in the topbar.
     * Looks for an element with id="notif-badge".
     */
    updateNotificationBadge() {
      const badge = document.getElementById('notif-badge');
      if (!badge) return;

      const user = window.KostAuth ? window.KostAuth.getCurrentUser() : null;
      if (!user) { badge.style.display = 'none'; return; }

      const unread = window.KostDB.getNotificationsByUserId(user.id).filter(n => !n.is_read).length;

      if (unread > 0) {
        badge.textContent = unread > 99 ? '99+' : unread;
        badge.style.display = 'inline-flex';
      } else {
        badge.style.display = 'none';
      }
    },

    /* ---- Lucide Icons ---- */

    /**
     * Re-render all Lucide icon placeholders on the page.
     */
    initIcons() {
      if (window.lucide) {
        lucide.createIcons();
      }
    },

    /* ---- Pagination ---- */

    /**
     * Slice an array into a page.
     * @param {any[]} array
     * @param {number} page     1-indexed
     * @param {number} perPage
     * @returns {{ data: any[], total: number, page: number, perPage: number, totalPages: number }}
     */
    paginate(array, page, perPage) {
      const total = array.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const currentPage = Math.min(Math.max(1, page), totalPages);
      const start = (currentPage - 1) * perPage;
      return {
        data: array.slice(start, start + perPage),
        total,
        page: currentPage,
        perPage,
        totalPages
      };
    },

    /**
     * Build HTML for a pagination control.
     * @param {{ page, totalPages, total, perPage }} paginationInfo
     * @param {Function} onPageChange  Called with new page number
     * @returns {string}  HTML string
     */
    renderPagination(paginationInfo, onPageChange) {
      const { page, totalPages, total, perPage } = paginationInfo;
      if (totalPages <= 1) return '';

      const start = (page - 1) * perPage + 1;
      const end = Math.min(page * perPage, total);

      let html = `<div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-top:1rem;">
        <span style="font-size:0.8rem;color:#64748b;">Menampilkan ${start}–${end} dari ${total} data</span>
        <div style="display:flex;gap:0.25rem;">`;

      const btn = (label, p, disabled = false, active = false) => {
        const style = active
          ? 'background:#2563eb;color:#fff;border-color:#2563eb;'
          : (disabled ? 'opacity:0.4;cursor:not-allowed;' : '');
        return `<button onclick="${disabled || active ? '' : `(${onPageChange.toString()})(${p})`}"
          style="min-width:32px;height:32px;padding:0 0.5rem;border:1px solid #e2e8f0;border-radius:6px;
                 background:#fff;cursor:pointer;font-size:0.8rem;font-family:inherit;${style}"
          ${disabled ? 'disabled' : ''}>${label}</button>`;
      };

      html += btn('«', 1, page === 1);
      html += btn('‹', page - 1, page === 1);

      // Page numbers (show up to 5 around current)
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(totalPages, startPage + 4);
      startPage = Math.max(1, endPage - 4);

      for (let p = startPage; p <= endPage; p++) {
        html += btn(p, p, false, p === page);
      }

      html += btn('›', page + 1, page === totalPages);
      html += btn('»', totalPages, page === totalPages);
      html += `</div></div>`;

      return html;
    },

    /* ---- Debounce ---- */

    /**
     * Returns a debounced version of a function.
     * @param {Function} func
     * @param {number} wait  Milliseconds
     * @returns {Function}
     */
    debounce(func, wait) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    },

    /* ---- Invoice / Print ---- */

    /**
     * Open a simple print dialog for a payment invoice.
     * @param {string} paymentId
     */
    printInvoice(paymentId) {
      const payment = window.KostDB.getPaymentById(paymentId);
      if (!payment) {
        this.showToast('Data pembayaran tidak ditemukan.', 'danger');
        return;
      }

      const booking = window.KostDB.getBookingById(payment.booking_id);
      const user    = window.KostDB.getUserById(payment.user_id);

      const methodLabel = {
        virtual_account: 'Virtual Account (BCA)',
        transfer:        'Transfer Bank',
        qris:            'QRIS',
        ewallet:         'E-Wallet (OVO/GoPay)'
      };

      const typeLabel = {
        monthly: 'Pembayaran Bulanan',
        deposit: 'Deposit',
        booking: 'Biaya Booking'
      };

      const html = `
<!DOCTYPE html><html lang="id"><head>
  <meta charset="UTF-8">
  <title>Invoice ${payment.invoice_number || payment.id}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 2rem; color: #0f172a; font-size: 14px; }
    h1 { font-size: 1.4rem; margin-bottom: 0.25rem; }
    .sub { color: #64748b; margin-bottom: 2rem; font-size: 0.85rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #e2e8f0; }
    td:first-child { font-weight: 600; width: 40%; color: #64748b; }
    .total td { font-size: 1.1rem; font-weight: 700; border-bottom: none; }
    .footer { margin-top: 2rem; font-size: 0.8rem; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 1rem; }
  </style>
</head><body>
  <h1>INVOICE PEMBAYARAN</h1>
  <p class="sub">Kost Management System &mdash; ${payment.invoice_number || payment.id}</p>
  <table>
    <tr><td>No. Invoice</td><td>${payment.invoice_number || payment.id}</td></tr>
    <tr><td>Tanggal Bayar</td><td>${payment.paid_at ? this.formatDateTime(payment.paid_at) : '-'}</td></tr>
    <tr><td>Nama Penyewa</td><td>${user ? user.name : '-'}</td></tr>
    <tr><td>Kamar</td><td>${booking ? booking.room_number : '-'}</td></tr>
    <tr><td>Periode</td><td>${payment.month || (booking ? booking.start_date + ' s/d ' + booking.end_date : '-')}</td></tr>
    <tr><td>Jenis Pembayaran</td><td>${typeLabel[payment.type] || payment.type}</td></tr>
    <tr><td>Metode</td><td>${methodLabel[payment.method] || payment.method}</td></tr>
    <tr><td>Referensi</td><td>${payment.reference || '-'}</td></tr>
    <tr><td>Status</td><td>${payment.status === 'success' ? 'LUNAS' : payment.status.toUpperCase()}</td></tr>
    <tr class="total"><td>Total</td><td>${this.formatCurrency(payment.amount)}</td></tr>
  </table>
  <div class="footer">Dicetak pada ${this.formatDateTime(new Date().toISOString())} &bull; Dokumen ini sah sebagai bukti pembayaran.</div>
  <script>window.onload = function(){ window.print(); window.close(); }<\/script>
</body></html>`;

      const win = window.open('', '_blank', 'width=700,height=600');
      if (win) {
        win.document.write(html);
        win.document.close();
      } else {
        this.showToast('Pop-up diblokir. Izinkan pop-up untuk mencetak invoice.', 'warning');
      }
    },

    /* ---- CSV Export ---- */

    /**
     * Export an HTML table to a CSV file download.
     * @param {string} tableId
     * @param {string} filename   Without extension
     */
    exportTableToCSV(tableId, filename) {
      const table = document.getElementById(tableId);
      if (!table) {
        this.showToast('Tabel tidak ditemukan.', 'danger');
        return;
      }

      const rows = Array.from(table.querySelectorAll('tr'));
      const csv = rows.map(row => {
        return Array.from(row.querySelectorAll('th, td')).map(cell => {
          let text = cell.innerText || cell.textContent || '';
          text = text.replace(/\n/g, ' ').trim();
          // Escape double-quotes
          if (text.includes(',') || text.includes('"') || text.includes('\n')) {
            text = '"' + text.replace(/"/g, '""') + '"';
          }
          return text;
        }).join(',');
      }).join('\n');

      const bom = '\uFEFF'; // UTF-8 BOM for Excel compatibility
      const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (filename || 'export') + '_' + new Date().toISOString().slice(0, 10) + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showToast('Data berhasil diekspor ke CSV.', 'success');
    },

    /* ---- Date Utilities ---- */

    /**
     * Calculate the number of whole months between two date strings.
     * @param {string} startDate  ISO date string
     * @param {string} endDate    ISO date string
     * @returns {number}
     */
    monthsBetween(startDate, endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (isNaN(s) || isNaN(e)) return 0;
      return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    },

    /**
     * Return a human-readable relative time string in Indonesian.
     * @param {string} dateStr
     * @returns {string}  e.g. "2 jam yang lalu", "3 hari yang lalu"
     */
    timeAgo(dateStr) {
      if (!dateStr) return '-';
      const diff = Date.now() - new Date(dateStr).getTime();
      if (isNaN(diff)) return dateStr;

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours   = Math.floor(minutes / 60);
      const days    = Math.floor(hours / 24);
      const weeks   = Math.floor(days / 7);
      const months  = Math.floor(days / 30);
      const years   = Math.floor(days / 365);

      if (seconds < 60)   return 'Baru saja';
      if (minutes < 60)   return minutes + ' menit yang lalu';
      if (hours < 24)     return hours + ' jam yang lalu';
      if (days < 7)       return days + ' hari yang lalu';
      if (weeks < 4)      return weeks + ' minggu yang lalu';
      if (months < 12)    return months + ' bulan yang lalu';
      return years + ' tahun yang lalu';
    },

    /* ---- Validation ---- */

    /**
     * Validate an email address format.
     * @param {string} email
     * @returns {boolean}
     */
    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
    },

    /**
     * Validate an Indonesian phone number (08xx / +628xx / 628xx).
     * @param {string} phone
     * @returns {boolean}
     */
    isValidPhone(phone) {
      return /^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(String(phone).replace(/[\s-]/g, ''));
    },

    /* ---- Misc ---- */

    /**
     * Format a month key (e.g. '2024-11') to Indonesian (e.g. 'November 2024').
     * @param {string} monthKey  'YYYY-MM'
     * @returns {string}
     */
    formatMonthKey(monthKey) {
      if (!monthKey) return '-';
      const parts = monthKey.split('-');
      if (parts.length !== 2) return monthKey;
      const monthIdx = parseInt(parts[1], 10) - 1;
      return (INDONESIAN_MONTHS[monthIdx] || monthKey) + ' ' + parts[0];
    },

    /**
     * Truncate text to a max length, appending ellipsis.
     * @param {string} text
     * @param {number} maxLength
     * @returns {string}
     */
    truncate(text, maxLength = 80) {
      if (!text) return '';
      return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
    },

    /**
     * Escape HTML special characters to prevent XSS.
     * @param {string} str
     * @returns {string}
     */
    escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    /* ---- Responsive Mobile Navigation ---- */

    /**
     * Inisialisasi navigasi responsif mobile otomatis untuk dashboard dan public navbar
     */
    initResponsiveMobile() {
      // 1. Dashboard Sidebar Mobile Drawer
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        let backdrop = document.getElementById('kostSidebarBackdrop');
        if (!backdrop) {
          backdrop = document.createElement('div');
          backdrop.id = 'kostSidebarBackdrop';
          backdrop.className = 'sidebar-backdrop';
          document.body.appendChild(backdrop);
        }

        const closeSidebar = () => {
          sidebar.classList.remove('collapsed', 'mobile-open', 'active', 'open');
          backdrop.classList.remove('active');
          document.body.classList.remove('sidebar-open');
        };

        const toggleSidebar = (e) => {
          if (e) e.stopPropagation();
          const isOpen = sidebar.classList.contains('collapsed') || 
                         sidebar.classList.contains('mobile-open') || 
                         sidebar.classList.contains('active') || 
                         sidebar.classList.contains('open');
          if (isOpen) {
            closeSidebar();
          } else {
            sidebar.classList.add('mobile-open', 'collapsed');
            backdrop.classList.add('active');
            document.body.classList.add('sidebar-open');
          }
        };

        // Pasang toggle listener ke semua tombol toggle
        document.querySelectorAll('.sidebar-toggle, .sidebar-toggle-btn').forEach(btn => {
          btn.onclick = toggleSidebar;
        });

        backdrop.onclick = closeSidebar;

        // Auto close saat item sidebar diklik pada layar mobile
        sidebar.querySelectorAll('.nav-item').forEach(link => {
          link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
              closeSidebar();
            }
          });
        });
      }

      // 2. Public Navbar Mobile Menu
      const navbarInner = document.querySelector('.navbar-inner');
      if (navbarInner && !document.getElementById('navHamburger')) {
        const hamburger = document.createElement('button');
        hamburger.id = 'navHamburger';
        hamburger.className = 'navbar-hamburger';
        hamburger.setAttribute('aria-label', 'Buka Menu Navigasi');
        hamburger.innerHTML = `
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        `;

        let mobileMenu = document.getElementById('navMobileMenu');
        if (!mobileMenu) {
          mobileMenu = document.createElement('div');
          mobileMenu.id = 'navMobileMenu';
          mobileMenu.className = 'navbar-mobile';

          const curPath = window.location.pathname.split('/').pop() || 'index.html';
          const user = window.KostAuth ? KostAuth.getCurrentUser() : null;

          mobileMenu.innerHTML = `
            <a href="index.html" class="${curPath === 'index.html' || curPath === '' ? 'active' : ''}">Beranda</a>
            <a href="about.html" class="${curPath === 'about.html' ? 'active' : ''}">Tentang Kost</a>
            <a href="rooms.html" class="${curPath === 'rooms.html' || curPath === 'room-detail.html' ? 'active' : ''}">Daftar Kamar</a>
            <a href="facilities.html" class="${curPath === 'facilities.html' ? 'active' : ''}">Fasilitas</a>
            <a href="rules.html" class="${curPath === 'rules.html' ? 'active' : ''}">Peraturan Kost</a>
            <a href="contact.html" class="${curPath === 'contact.html' ? 'active' : ''}">Kontak</a>
            <div class="navbar-mobile-actions">
              ${user ? `
                <div style="font-size:0.875rem; font-weight:600; color:#0f172a; padding:6px 0;">Halo, ${KostUtils.escapeHtml(user.name)}</div>
                <a href="${KostAuth.getDashboardUrl(user.role)}" class="btn btn-primary" style="display:block; text-align:center; padding:10px; border-radius:6px; color:#fff; text-decoration:none;">Buka Dashboard</a>
                <button onclick="KostAuth.logout(true)" class="btn btn-outline" style="width:100%; padding:10px; border-radius:6px; border:1px solid #fca5a5; color:#dc2626; cursor:pointer;">Keluar dari Akun</button>
              ` : `
                <a href="login.html" class="btn btn-outline" style="display:block; text-align:center; padding:10px; border-radius:6px; border:1px solid #cbd5e1; text-decoration:none; color:#0f172a;">Masuk</a>
                <a href="register.html" class="btn btn-primary" style="display:block; text-align:center; padding:10px; border-radius:6px; background:#2563eb; color:#fff; text-decoration:none;">Daftar Akun</a>
              `}
            </div>
          `;
          document.body.appendChild(mobileMenu);
        }

        hamburger.onclick = () => {
          hamburger.classList.toggle('open');
          mobileMenu.classList.toggle('open');
        };

        navbarInner.appendChild(hamburger);
      }
    }
  };

  // Auto-init responsive helpers saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => KostUtils.initResponsiveMobile());
  } else {
    KostUtils.initResponsiveMobile();
  }

})();

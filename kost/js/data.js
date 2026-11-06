/**
 * data.js — Kost Management System
 * Core data layer: seeds localStorage with demo data on first load
 * and exposes window.KostDB for CRUD operations.
 */

(function () {
  'use strict';

  /* ============================================================
     SEED DATA
  ============================================================ */

  const SEED_USERS = [
    {
      id: 'usr-001',
      name: 'Ahmad Fauzi',
      email: 'admin@kost.com',
      password: 'admin123',
      role: 'admin',
      phone: '081234567890',
      avatar: null,
      created_at: '2024-01-01T00:00:00',
      is_active: true
    },
    {
      id: 'usr-002',
      name: 'Hendra Wijaya',
      email: 'owner@kost.com',
      password: 'owner123',
      role: 'owner',
      phone: '081234567891',
      avatar: null,
      created_at: '2024-01-01T00:00:00',
      is_active: true
    },
    {
      id: 'usr-003',
      name: 'Budi Santoso',
      email: 'budi@email.com',
      password: 'user123',
      role: 'user',
      phone: '081234567892',
      avatar: null,
      created_at: '2024-02-15T00:00:00',
      is_active: true,
      id_number: '3271012502980001',
      emergency_contact: 'Ibu Sulasmi - 081298765432',
      address: 'Jl. Merdeka No. 10, Bandung'
    },
    {
      id: 'usr-004',
      name: 'Siti Rahayu',
      email: 'siti@email.com',
      password: 'user123',
      role: 'user',
      phone: '081234567893',
      avatar: null,
      created_at: '2024-10-01T00:00:00',
      is_active: true,
      id_number: '3271015510990002',
      emergency_contact: 'Bapak Rahmat - 081287654321',
      address: 'Jl. Sudirman No. 45, Jakarta'
    },
    {
      id: 'usr-005',
      name: 'Dian Permata',
      email: 'dian@email.com',
      password: 'user123',
      role: 'user',
      phone: '081298765432',
      avatar: null,
      created_at: '2024-03-01T00:00:00',
      is_active: true,
      id_number: '3271012003010003',
      emergency_contact: 'Bapak Permata - 085612345678',
      address: 'Jl. Pahlawan No. 7, Surabaya'
    },
    {
      id: 'usr-006',
      name: 'Reza Firmansyah',
      email: 'reza@email.com',
      password: 'user123',
      role: 'user',
      phone: '085612345678',
      avatar: null,
      created_at: '2024-04-01T00:00:00',
      is_active: true,
      id_number: '3271011501990004',
      emergency_contact: 'Ibu Firmansyah - 081345678901',
      address: 'Jl. Diponegoro No. 23, Yogyakarta'
    }
  ];

  const SEED_ROOMS = [
    { id: 'room-001', number: 'A-101', type: 'Standard', floor: 1, price: 1500000, size: '3x4 m', status: 'occupied', facilities: ['AC', 'Kamar Mandi Dalam', 'WiFi', 'Kasur Single', 'Lemari', 'Meja Belajar', 'Kipas Angin'], description: 'Kamar standard lantai 1, cocok untuk 1 orang. Dilengkapi kamar mandi dalam dan AC.', max_occupants: 1 },
    { id: 'room-002', number: 'A-102', type: 'Standard', floor: 1, price: 1500000, size: '3x4 m', status: 'available', facilities: ['AC', 'Kamar Mandi Dalam', 'WiFi', 'Kasur Single', 'Lemari', 'Meja Belajar'], description: 'Kamar standard lantai 1, cocok untuk 1 orang.', max_occupants: 1 },
    { id: 'room-003', number: 'A-103', type: 'Standard', floor: 1, price: 1500000, size: '3x4 m', status: 'occupied', facilities: ['AC', 'Kamar Mandi Dalam', 'WiFi', 'Kasur Single', 'Lemari', 'Meja Belajar'], description: 'Kamar standard lantai 1.', max_occupants: 1 },
    { id: 'room-004', number: 'B-201', type: 'Deluxe', floor: 2, price: 2000000, size: '4x5 m', status: 'occupied', facilities: ['AC', 'Kamar Mandi Dalam', 'WiFi', 'Kasur Double', 'Lemari', 'Meja Kerja', 'TV 24"', 'Kulkas Mini', 'Water Heater'], description: 'Kamar deluxe lantai 2 dengan fasilitas lengkap termasuk kulkas mini dan TV.', max_occupants: 2 },
    { id: 'room-005', number: 'B-202', type: 'Deluxe', floor: 2, price: 2000000, size: '4x5 m', status: 'available', facilities: ['AC', 'Kamar Mandi Dalam', 'WiFi', 'Kasur Double', 'Lemari', 'Meja Kerja', 'TV 24"', 'Kulkas Mini', 'Water Heater'], description: 'Kamar deluxe lantai 2 dengan fasilitas lengkap.', max_occupants: 2 },
    { id: 'room-006', number: 'B-203', type: 'Deluxe', floor: 2, price: 2000000, size: '4x5 m', status: 'reserved', facilities: ['AC', 'Kamar Mandi Dalam', 'WiFi', 'Kasur Double', 'Lemari', 'Meja Kerja', 'TV 24"', 'Kulkas Mini', 'Water Heater'], description: 'Kamar deluxe lantai 2.', max_occupants: 2 },
    { id: 'room-007', number: 'C-301', type: 'Premium', floor: 3, price: 2800000, size: '5x6 m', status: 'occupied', facilities: ['AC 2 PK', 'Kamar Mandi Dalam', 'WiFi', 'Kasur King', 'Lemari Besar', 'Meja Kerja', 'TV 32"', 'Kulkas', 'Water Heater', 'Sofa', 'Dapur Kecil'], description: 'Kamar premium lantai 3, kamar paling luas dengan fasilitas terlengkap.', max_occupants: 2 },
    { id: 'room-008', number: 'C-302', type: 'Premium', floor: 3, price: 2800000, size: '5x6 m', status: 'available', facilities: ['AC 2 PK', 'Kamar Mandi Dalam', 'WiFi', 'Kasur King', 'Lemari Besar', 'Meja Kerja', 'TV 32"', 'Kulkas', 'Water Heater', 'Sofa', 'Dapur Kecil'], description: 'Kamar premium lantai 3.', max_occupants: 2 },
    { id: 'room-009', number: 'A-104', type: 'Standard', floor: 1, price: 1500000, size: '3x4 m', status: 'maintenance', facilities: ['AC', 'Kamar Mandi Dalam', 'WiFi', 'Kasur Single', 'Lemari'], description: 'Kamar sedang dalam renovasi.', max_occupants: 1 },
    { id: 'room-010', number: 'B-204', type: 'Deluxe', floor: 2, price: 2000000, size: '4x5 m', status: 'occupied', facilities: ['AC', 'Kamar Mandi Dalam', 'WiFi', 'Kasur Double', 'Lemari', 'Meja Kerja', 'TV 24"', 'Kulkas Mini', 'Water Heater'], description: 'Kamar deluxe lantai 2.', max_occupants: 2 }
  ];

  const SEED_BOOKINGS = [
    {
      id: 'BKG-001',
      user_id: 'usr-003',
      room_id: 'room-001',
      room_number: 'A-101',
      user_name: 'Budi Santoso',
      start_date: '2024-02-15',
      end_date: '2025-02-14',
      duration_months: 12,
      status: 'active',
      total_amount: 18000000,
      deposit: 1500000,
      notes: 'Penyewa tetap, pekerja swasta.',
      created_at: '2024-02-10T09:00:00'
    },
    {
      id: 'BKG-002',
      user_id: 'usr-005',
      room_id: 'room-003',
      room_number: 'A-103',
      user_name: 'Dian Permata',
      start_date: '2024-03-01',
      end_date: '2025-02-28',
      duration_months: 12,
      status: 'active',
      total_amount: 18000000,
      deposit: 1500000,
      notes: 'Mahasiswi, membawa kendaraan motor.',
      created_at: '2024-02-25T10:30:00'
    },
    {
      id: 'BKG-003',
      user_id: 'usr-006',
      room_id: 'room-004',
      room_number: 'B-201',
      user_name: 'Reza Firmansyah',
      start_date: '2024-04-01',
      end_date: '2024-09-30',
      duration_months: 6,
      status: 'completed',
      total_amount: 12000000,
      deposit: 2000000,
      notes: 'Kontrak 6 bulan pertama.',
      created_at: '2024-03-25T14:00:00'
    },
    {
      id: 'BKG-004',
      user_id: 'usr-006',
      room_id: 'room-010',
      room_number: 'B-204',
      user_name: 'Reza Firmansyah',
      start_date: '2024-10-01',
      end_date: '2025-03-31',
      duration_months: 6,
      status: 'active',
      total_amount: 12000000,
      deposit: 2000000,
      notes: 'Perpanjangan sewa dengan pindah kamar.',
      created_at: '2024-09-20T11:00:00'
    },
    {
      id: 'BKG-005',
      user_id: 'usr-004',
      room_id: 'room-006',
      room_number: 'B-203',
      user_name: 'Siti Rahayu',
      start_date: '2024-11-15',
      end_date: '2025-11-14',
      duration_months: 12,
      status: 'pending',
      total_amount: 24000000,
      deposit: 2000000,
      notes: 'Penyewa baru, pegawai negeri.',
      created_at: '2024-11-05T08:30:00'
    },
    {
      id: 'BKG-006',
      user_id: 'usr-003',
      room_id: 'room-007',
      room_number: 'C-301',
      user_name: 'Budi Santoso',
      start_date: '2024-07-01',
      end_date: '2024-07-31',
      duration_months: 1,
      status: 'completed',
      total_amount: 2800000,
      deposit: 2800000,
      notes: 'Upgrade kamar sementara selama renovasi.',
      created_at: '2024-06-28T10:00:00'
    }
  ];

  /* ---- Build payments ---- */
  function buildPayments() {
    const payments = [];
    let idx = 1;
    const methods = ['virtual_account', 'transfer', 'qris', 'ewallet'];
    const refs = {
      virtual_account: () => 'VA-BCA-' + Math.floor(100000 + Math.random() * 900000),
      transfer: () => 'TRF-' + Math.floor(1000000 + Math.random() * 9000000),
      qris: () => 'QRIS-' + Math.floor(10000000 + Math.random() * 90000000),
      ewallet: () => 'OVO-' + Math.floor(100000 + Math.random() * 900000)
    };
    const pad = (n) => String(n).padStart(4, '0');
    const payId = () => 'PAY-' + pad(idx);
    const invId = () => 'INV-2024-' + pad(idx);

    function addPay(bookingId, userId, type, amount, method, status, createdAt, paidAt, dueDate, month) {
      const m = methods[(idx - 1) % methods.length];
      const finalMethod = method || m;
      payments.push({
        id: payId(),
        booking_id: bookingId,
        user_id: userId,
        type: type,
        amount: amount,
        method: finalMethod,
        status: status,
        created_at: createdAt,
        paid_at: paidAt,
        due_date: dueDate,
        reference: status === 'success' ? refs[finalMethod]() : null,
        month: month || null,
        invoice_number: invId()
      });
      idx++;
    }

    // BKG-001: Budi, room-001, Feb-Nov 2024 monthly (all success), 1500000/month
    const bkg001Months = [
      ['2024-02', '2024-02-15', '2024-02-15T10:00:00', '2024-02-15T10:30:00'],
      ['2024-03', '2024-03-15', '2024-03-10T09:00:00', '2024-03-14T14:00:00'],
      ['2024-04', '2024-04-15', '2024-04-10T09:00:00', '2024-04-12T11:00:00'],
      ['2024-05', '2024-05-15', '2024-05-10T09:00:00', '2024-05-13T16:00:00'],
      ['2024-06', '2024-06-15', '2024-06-10T09:00:00', '2024-06-11T10:00:00'],
      ['2024-07', '2024-07-15', '2024-07-10T09:00:00', '2024-07-13T15:00:00'],
      ['2024-08', '2024-08-15', '2024-08-10T09:00:00', '2024-08-14T09:00:00'],
      ['2024-09', '2024-09-15', '2024-09-10T09:00:00', '2024-09-12T13:00:00'],
      ['2024-10', '2024-10-15', '2024-10-10T09:00:00', '2024-10-11T10:00:00'],
      ['2024-11', '2024-11-15', '2024-11-05T09:00:00', '2024-11-07T14:00:00']
    ];
    bkg001Months.forEach(([month, due, created, paid]) => {
      addPay('BKG-001', 'usr-003', 'monthly', 1500000, null, 'success', created, paid, due, month);
    });

    // BKG-002: Dian, room-003, Mar-Nov 2024 monthly (all success), 1500000/month
    const bkg002Months = [
      ['2024-03', '2024-03-01', '2024-03-01T10:00:00', '2024-03-01T10:30:00'],
      ['2024-04', '2024-04-01', '2024-04-01T09:00:00', '2024-03-29T14:00:00'],
      ['2024-05', '2024-05-01', '2024-05-01T09:00:00', '2024-04-29T11:00:00'],
      ['2024-06', '2024-06-01', '2024-06-01T09:00:00', '2024-05-30T16:00:00'],
      ['2024-07', '2024-07-01', '2024-07-01T09:00:00', '2024-06-28T10:00:00'],
      ['2024-08', '2024-08-01', '2024-08-01T09:00:00', '2024-07-30T15:00:00'],
      ['2024-09', '2024-09-01', '2024-09-01T09:00:00', '2024-08-29T09:00:00'],
      ['2024-10', '2024-10-01', '2024-10-01T09:00:00', '2024-09-28T13:00:00'],
      ['2024-11', '2024-11-01', '2024-11-01T09:00:00', '2024-10-30T10:00:00']
    ];
    bkg002Months.forEach(([month, due, created, paid]) => {
      addPay('BKG-002', 'usr-005', 'monthly', 1500000, null, 'success', created, paid, due, month);
    });

    // BKG-003: Reza, room-004, Apr-Sep 2024 (completed), 2000000/month
    const bkg003Months = [
      ['2024-04', '2024-04-01', '2024-04-01T10:00:00', '2024-04-01T11:00:00'],
      ['2024-05', '2024-05-01', '2024-05-01T09:00:00', '2024-04-30T14:00:00'],
      ['2024-06', '2024-06-01', '2024-06-01T09:00:00', '2024-05-29T11:00:00'],
      ['2024-07', '2024-07-01', '2024-07-01T09:00:00', '2024-06-28T16:00:00'],
      ['2024-08', '2024-08-01', '2024-08-01T09:00:00', '2024-07-30T10:00:00'],
      ['2024-09', '2024-09-01', '2024-09-01T09:00:00', '2024-08-29T15:00:00']
    ];
    bkg003Months.forEach(([month, due, created, paid]) => {
      addPay('BKG-003', 'usr-006', 'monthly', 2000000, null, 'success', created, paid, due, month);
    });

    // BKG-004: Reza, room-010, Oct-Nov 2024 success, Dec pending, 2000000/month
    addPay('BKG-004', 'usr-006', 'monthly', 2000000, 'virtual_account', 'success',
      '2024-10-01T09:00:00', '2024-10-01T10:00:00', '2024-10-01', '2024-10');
    addPay('BKG-004', 'usr-006', 'monthly', 2000000, 'transfer', 'success',
      '2024-11-01T09:00:00', '2024-10-30T14:00:00', '2024-11-01', '2024-11');
    addPay('BKG-004', 'usr-006', 'monthly', 2000000, 'qris', 'pending',
      '2024-12-01T09:00:00', null, '2024-12-01', '2024-12');

    // BKG-005: Siti, deposit pending
    addPay('BKG-005', 'usr-004', 'deposit', 2000000, 'virtual_account', 'pending',
      '2024-11-05T08:30:00', null, '2024-11-12', null);

    return payments;
  }

  const SEED_COMPLAINTS = [
    {
      id: 'CPL-001',
      user_id: 'usr-003',
      user_name: 'Budi Santoso',
      room_id: 'room-001',
      room_number: 'A-101',
      title: 'AC tidak dingin',
      description: 'AC di kamar saya sudah beberapa hari tidak dingin, suhu tidak turun meskipun sudah di setting ke suhu terendah. Mohon segera diperbaiki.',
      category: 'Fasilitas',
      priority: 'medium',
      status: 'resolved',
      admin_response: 'Teknisi telah memperbaiki freon AC dan membersihkan filter. AC sudah berfungsi normal kembali.',
      created_at: '2024-09-15T09:00:00',
      updated_at: '2024-09-18T14:00:00',
      resolved_at: '2024-09-18T14:00:00'
    },
    {
      id: 'CPL-002',
      user_id: 'usr-005',
      user_name: 'Dian Permata',
      room_id: 'room-003',
      room_number: 'A-103',
      title: 'Kunci kamar sulit dibuka',
      description: 'Kunci kamar saya sering macet dan sulit dibuka, kadang harus dipaksa beberapa kali baru bisa masuk. Ini sangat menyulitkan terutama malam hari.',
      category: 'Keamanan',
      priority: 'high',
      status: 'resolved',
      admin_response: 'Silinder kunci telah diganti dengan yang baru. Kunci sudah berfungsi dengan baik.',
      created_at: '2024-10-02T16:00:00',
      updated_at: '2024-10-04T11:00:00',
      resolved_at: '2024-10-04T11:00:00'
    },
    {
      id: 'CPL-003',
      user_id: 'usr-006',
      user_name: 'Reza Firmansyah',
      room_id: 'room-010',
      room_number: 'B-204',
      title: 'WiFi lemot di kamar',
      description: 'Kecepatan WiFi di kamar saya sangat lambat, terutama pada malam hari antara pukul 19.00-22.00. Streaming video sering buffering dan meeting online terganggu.',
      category: 'Jaringan',
      priority: 'medium',
      status: 'in_progress',
      admin_response: 'Sudah dikoordinasikan dengan provider internet. Teknisi akan datang minggu ini untuk melakukan pengecekan dan upgrade router.',
      created_at: '2024-11-01T20:00:00',
      updated_at: '2024-11-03T09:00:00',
      resolved_at: null
    },
    {
      id: 'CPL-004',
      user_id: 'usr-003',
      user_name: 'Budi Santoso',
      room_id: 'room-001',
      room_number: 'A-101',
      title: 'Lampu kamar mandi mati',
      description: 'Lampu di kamar mandi saya mati sejak tadi malam. Sudah saya coba ganti bohlam sendiri tetapi tidak menyala, kemungkinan masalah di kabel atau stop kontak.',
      category: 'Listrik',
      priority: 'high',
      status: 'open',
      admin_response: null,
      created_at: '2024-11-04T07:00:00',
      updated_at: '2024-11-04T07:00:00',
      resolved_at: null
    },
    {
      id: 'CPL-005',
      user_id: 'usr-004',
      user_name: 'Siti Rahayu',
      room_id: 'room-006',
      room_number: 'B-203',
      title: 'Pertanyaan fasilitas kamar',
      description: 'Saya ingin menanyakan apakah kamar B-203 yang akan saya tempati sudah dilengkapi dengan water heater dan rak sepatu. Jika belum, apakah bisa disediakan sebelum saya pindah?',
      category: 'Lainnya',
      priority: 'low',
      status: 'open',
      admin_response: null,
      created_at: '2024-11-05T08:00:00',
      updated_at: '2024-11-05T08:00:00',
      resolved_at: null
    }
  ];

  const SEED_NOTIFICATIONS = [
    {
      id: 'notif-001',
      user_id: 'usr-003',
      title: 'Tagihan Jatuh Tempo',
      message: 'Pembayaran bulan Desember 2024 jatuh tempo 7 hari lagi. Segera lakukan pembayaran.',
      type: 'warning',
      is_read: false,
      link: '/user/payments.html',
      created_at: '2024-11-24T08:00:00'
    },
    {
      id: 'notif-002',
      user_id: 'usr-003',
      title: 'Masa Sewa Hampir Berakhir',
      message: 'Masa sewa Anda berakhir 15 Februari 2025. Segera perpanjang sewa untuk menghindari kamar ditempati orang lain.',
      type: 'warning',
      is_read: false,
      link: '/user/lease.html',
      created_at: '2024-11-05T09:00:00'
    },
    {
      id: 'notif-003',
      user_id: 'usr-003',
      title: 'Keluhan Diselesaikan',
      message: 'Keluhan Anda mengenai "AC tidak dingin" telah diselesaikan. Silakan berikan feedback jika masih ada masalah.',
      type: 'success',
      is_read: true,
      link: '/user/complaints.html',
      created_at: '2024-09-18T14:30:00'
    },
    {
      id: 'notif-004',
      user_id: 'usr-004',
      title: 'Booking Menunggu Persetujuan',
      message: 'Booking Anda untuk kamar B-203 sedang menunggu persetujuan admin. Anda akan diberitahu setelah diproses.',
      type: 'info',
      is_read: false,
      link: '/user/bookings.html',
      created_at: '2024-11-05T08:35:00'
    },
    {
      id: 'notif-005',
      user_id: 'usr-006',
      title: 'Tagihan Belum Dibayar',
      message: 'Pembayaran bulan Desember 2024 untuk kamar B-204 belum dibayar. Batas waktu pembayaran 1 Desember 2024.',
      type: 'danger',
      is_read: false,
      link: '/user/payments.html',
      created_at: '2024-11-05T10:00:00'
    },
    {
      id: 'notif-006',
      user_id: 'usr-001',
      title: 'Keluhan Baru',
      message: 'Budi Santoso (A-101) mengajukan keluhan baru: "Lampu kamar mandi mati". Segera ditindaklanjuti.',
      type: 'warning',
      is_read: false,
      link: '/admin/complaints.html',
      created_at: '2024-11-04T07:05:00'
    },
    {
      id: 'notif-007',
      user_id: 'usr-001',
      title: 'Booking Baru Menunggu Persetujuan',
      message: 'Siti Rahayu mengajukan booking kamar B-203 mulai 15 November 2024. Silakan tinjau dan setujui.',
      type: 'info',
      is_read: false,
      link: '/admin/bookings.html',
      created_at: '2024-11-05T08:31:00'
    },
    {
      id: 'notif-008',
      user_id: 'usr-002',
      title: 'Laporan Bulanan Tersedia',
      message: 'Laporan bulanan November 2024 sudah tersedia. Klik untuk melihat ringkasan pendapatan dan hunian bulan ini.',
      type: 'info',
      is_read: true,
      link: '/owner/statistics.html',
      created_at: '2024-11-01T07:00:00'
    }
  ];

  const SEED_ANNOUNCEMENTS = [
    {
      id: 'ANN-001',
      title: 'Jadwal Maintenance Air',
      content: 'Akan dilakukan maintenance pompa air pada Sabtu, 9 November 2024 pukul 08.00–12.00 WIB. Selama maintenance berlangsung, air di seluruh kamar akan mati sementara. Mohon maaf atas ketidaknyamanannya. Kami menyarankan penghuni untuk menyiapkan air cadangan sebelumnya.',
      date: '2024-11-04',
      created_by: 'usr-001',
      author_name: 'Ahmad Fauzi',
      target: 'all',
      is_active: true,
      created_at: '2024-11-04T10:00:00'
    },
    {
      id: 'ANN-002',
      title: 'Peraturan Parkir Baru',
      content: 'Mulai 1 Desember 2024, parkir motor di area samping kost dilarang antara pukul 00.00–05.00 WIB. Pelanggaran akan dikenakan teguran dan kendaraan dapat dipindahkan oleh petugas keamanan. Harap mematuhi peraturan demi kenyamanan bersama.',
      date: '2024-11-01',
      created_by: 'usr-001',
      author_name: 'Ahmad Fauzi',
      target: 'all',
      is_active: true,
      created_at: '2024-11-01T09:00:00'
    },
    {
      id: 'ANN-003',
      title: 'Promo Perpanjangan Sewa',
      content: 'Perpanjang sewa minimal 6 bulan sebelum 31 Desember 2024 dan dapatkan diskon Rp 200.000. Promo berlaku untuk semua tipe kamar. Hubungi admin untuk informasi lebih lanjut dan proses perpanjangan. Jangan lewatkan kesempatan ini!',
      date: '2024-10-28',
      created_by: 'usr-001',
      author_name: 'Ahmad Fauzi',
      target: 'all',
      is_active: true,
      created_at: '2024-10-28T11:00:00'
    }
  ];

  const SEED_ACTIVITY_LOGS = [
    {
      id: 'LOG-001',
      user_id: 'usr-001',
      user_name: 'Ahmad Fauzi',
      action: 'Menyetujui Booking',
      detail: 'Menyetujui booking BKG-004 oleh Reza Firmansyah untuk kamar B-204.',
      created_at: '2024-09-20T11:30:00'
    },
    {
      id: 'LOG-002',
      user_id: 'usr-001',
      user_name: 'Ahmad Fauzi',
      action: 'Menambah Catatan Pembayaran',
      detail: 'Mencatat pembayaran manual bulan Oktober 2024 untuk Reza Firmansyah (B-204).',
      created_at: '2024-10-01T10:15:00'
    },
    {
      id: 'LOG-003',
      user_id: 'usr-001',
      user_name: 'Ahmad Fauzi',
      action: 'Update Status Kamar',
      detail: 'Mengubah status kamar A-104 menjadi "maintenance" untuk keperluan renovasi.',
      created_at: '2024-10-15T09:00:00'
    },
    {
      id: 'LOG-004',
      user_id: 'usr-001',
      user_name: 'Ahmad Fauzi',
      action: 'Menutup Keluhan',
      detail: 'Menyelesaikan keluhan CPL-002 (Kunci kamar sulit dibuka) oleh Dian Permata.',
      created_at: '2024-10-04T11:30:00'
    },
    {
      id: 'LOG-005',
      user_id: 'usr-001',
      user_name: 'Ahmad Fauzi',
      action: 'Membuat Pengumuman',
      detail: 'Membuat pengumuman promo perpanjangan sewa untuk semua penghuni.',
      created_at: '2024-10-28T11:10:00'
    },
    {
      id: 'LOG-006',
      user_id: 'usr-001',
      user_name: 'Ahmad Fauzi',
      action: 'Memproses Keluhan',
      detail: 'Memulai penanganan keluhan CPL-003 (WiFi lemot) oleh Reza Firmansyah.',
      created_at: '2024-11-03T09:05:00'
    },
    {
      id: 'LOG-007',
      user_id: 'usr-001',
      user_name: 'Ahmad Fauzi',
      action: 'Membuat Pengumuman',
      detail: 'Membuat pengumuman peraturan parkir baru mulai Desember 2024.',
      created_at: '2024-11-01T09:10:00'
    },
    {
      id: 'LOG-008',
      user_id: 'usr-003',
      user_name: 'Budi Santoso',
      action: 'Mengajukan Keluhan',
      detail: 'Mengajukan keluhan baru: "Lampu kamar mandi mati" untuk kamar A-101.',
      created_at: '2024-11-04T07:02:00'
    },
    {
      id: 'LOG-009',
      user_id: 'usr-004',
      user_name: 'Siti Rahayu',
      action: 'Mengajukan Booking',
      detail: 'Mengajukan booking kamar B-203 untuk periode 15 November 2024 – 14 November 2025.',
      created_at: '2024-11-05T08:30:00'
    },
    {
      id: 'LOG-010',
      user_id: 'usr-001',
      user_name: 'Ahmad Fauzi',
      action: 'Membuat Pengumuman',
      detail: 'Membuat pengumuman jadwal maintenance air tanggal 9 November 2024.',
      created_at: '2024-11-04T10:05:00'
    }
  ];

  /* ============================================================
     INITIALIZATION
  ============================================================ */

  function initializeData() {
    if (localStorage.getItem('kost_initialized') === 'true') return;

    localStorage.setItem('kost_users', JSON.stringify(SEED_USERS));
    localStorage.setItem('kost_rooms', JSON.stringify(SEED_ROOMS));
    localStorage.setItem('kost_bookings', JSON.stringify(SEED_BOOKINGS));
    localStorage.setItem('kost_payments', JSON.stringify(buildPayments()));
    localStorage.setItem('kost_complaints', JSON.stringify(SEED_COMPLAINTS));
    localStorage.setItem('kost_notifications', JSON.stringify(SEED_NOTIFICATIONS));
    localStorage.setItem('kost_announcements', JSON.stringify(SEED_ANNOUNCEMENTS));
    localStorage.setItem('kost_activity_logs', JSON.stringify(SEED_ACTIVITY_LOGS));
    localStorage.setItem('kost_initialized', 'true');

    console.info('[KostDB] Demo data seeded successfully.');
  }

  /* ============================================================
     HELPERS
  ============================================================ */

  const INDONESIAN_MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  /* ============================================================
     window.KostDB — Public API
  ============================================================ */

  window.KostDB = {

    /* ---- Generic ---- */

    get(key) {
      try {
        return JSON.parse(localStorage.getItem(key) || '[]');
      } catch (e) {
        console.error('[KostDB] get error:', e);
        return [];
      }
    },

    set(key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error('[KostDB] set error:', e);
      }
    },

    /* ---- Users ---- */

    getUsers() {
      return this.get('kost_users');
    },

    getUserById(id) {
      return this.getUsers().find(u => u.id === id) || null;
    },

    getUserByEmail(email) {
      return this.getUsers().find(u => u.email === email) || null;
    },

    createUser(data) {
      const users = this.getUsers();
      const newUser = Object.assign({ id: this.generateId('usr'), created_at: new Date().toISOString(), is_active: true }, data);
      users.push(newUser);
      this.set('kost_users', users);
      return newUser;
    },

    updateUser(id, data) {
      const users = this.getUsers();
      const idx = users.findIndex(u => u.id === id);
      if (idx === -1) return null;
      users[idx] = Object.assign({}, users[idx], data);
      this.set('kost_users', users);
      return users[idx];
    },

    /* ---- Rooms ---- */

    getRooms() {
      return this.get('kost_rooms');
    },

    getRoomById(id) {
      return this.getRooms().find(r => r.id === id) || null;
    },

    createRoom(data) {
      const rooms = this.getRooms();
      const newRoom = Object.assign({ id: this.generateId('room'), status: 'available' }, data);
      rooms.push(newRoom);
      this.set('kost_rooms', rooms);
      return newRoom;
    },

    updateRoom(id, data) {
      const rooms = this.getRooms();
      const idx = rooms.findIndex(r => r.id === id);
      if (idx === -1) return null;
      rooms[idx] = Object.assign({}, rooms[idx], data);
      this.set('kost_rooms', rooms);
      return rooms[idx];
    },

    deleteRoom(id) {
      const rooms = this.getRooms().filter(r => r.id !== id);
      this.set('kost_rooms', rooms);
    },

    /* ---- Bookings ---- */

    getBookings() {
      return this.get('kost_bookings');
    },

    getBookingById(id) {
      return this.getBookings().find(b => b.id === id) || null;
    },

    getBookingsByUserId(userId) {
      return this.getBookings().filter(b => b.user_id === userId);
    },

    createBooking(data) {
      const bookings = this.getBookings();
      const newBooking = Object.assign({ id: this.generateId('BKG'), created_at: new Date().toISOString(), status: 'pending' }, data);
      bookings.push(newBooking);
      this.set('kost_bookings', bookings);
      return newBooking;
    },

    updateBooking(id, data) {
      const bookings = this.getBookings();
      const idx = bookings.findIndex(b => b.id === id);
      if (idx === -1) return null;
      bookings[idx] = Object.assign({}, bookings[idx], data);
      this.set('kost_bookings', bookings);
      return bookings[idx];
    },

    /* ---- Payments ---- */

    getPayments() {
      return this.get('kost_payments');
    },

    getPaymentById(id) {
      return this.getPayments().find(p => p.id === id) || null;
    },

    getPaymentsByBookingId(bookingId) {
      return this.getPayments().filter(p => p.booking_id === bookingId);
    },

    getPaymentsByUserId(userId) {
      return this.getPayments().filter(p => p.user_id === userId);
    },

    createPayment(data) {
      const payments = this.getPayments();
      const newPayment = Object.assign({ id: this.generateId('PAY'), created_at: new Date().toISOString(), status: 'pending' }, data);
      payments.push(newPayment);
      this.set('kost_payments', payments);
      return newPayment;
    },

    updatePayment(id, data) {
      const payments = this.getPayments();
      const idx = payments.findIndex(p => p.id === id);
      if (idx === -1) return null;
      payments[idx] = Object.assign({}, payments[idx], data);
      this.set('kost_payments', payments);
      return payments[idx];
    },

    /* ---- Complaints ---- */

    getComplaints() {
      return this.get('kost_complaints');
    },

    createComplaint(data) {
      const complaints = this.getComplaints();
      const now = new Date().toISOString();
      const newComplaint = Object.assign({
        id: this.generateId('CPL'),
        status: 'open',
        admin_response: null,
        created_at: now,
        updated_at: now,
        resolved_at: null
      }, data);
      complaints.push(newComplaint);
      this.set('kost_complaints', complaints);
      return newComplaint;
    },

    updateComplaint(id, data) {
      const complaints = this.getComplaints();
      const idx = complaints.findIndex(c => c.id === id);
      if (idx === -1) return null;
      complaints[idx] = Object.assign({}, complaints[idx], data, { updated_at: new Date().toISOString() });
      if (data.status === 'resolved' && !complaints[idx].resolved_at) {
        complaints[idx].resolved_at = new Date().toISOString();
      }
      this.set('kost_complaints', complaints);
      return complaints[idx];
    },

    /* ---- Notifications ---- */

    getNotifications() {
      return this.get('kost_notifications');
    },

    getNotificationsByUserId(userId) {
      return this.getNotifications()
        .filter(n => n.user_id === userId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    markNotificationRead(id) {
      const notifications = this.getNotifications();
      const idx = notifications.findIndex(n => n.id === id);
      if (idx === -1) return null;
      notifications[idx].is_read = true;
      this.set('kost_notifications', notifications);
      return notifications[idx];
    },

    markAllNotificationsRead(userId) {
      const notifications = this.getNotifications().map(n => {
        if (n.user_id === userId) n.is_read = true;
        return n;
      });
      this.set('kost_notifications', notifications);
    },

    createNotification(data) {
      const notifications = this.getNotifications();
      const newNotif = Object.assign({
        id: this.generateId('notif'),
        is_read: false,
        created_at: new Date().toISOString()
      }, data);
      notifications.unshift(newNotif);
      this.set('kost_notifications', notifications);
      return newNotif;
    },

    /* ---- Announcements ---- */

    getAnnouncements() {
      return this.get('kost_announcements')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    createAnnouncement(data) {
      const announcements = this.get('kost_announcements');
      const now = new Date().toISOString();
      const newAnn = Object.assign({
        id: this.generateId('ANN'),
        is_active: true,
        created_at: now
      }, data);
      announcements.push(newAnn);
      this.set('kost_announcements', announcements);
      return newAnn;
    },

    updateAnnouncement(id, data) {
      const announcements = this.get('kost_announcements');
      const idx = announcements.findIndex(a => a.id === id);
      if (idx === -1) return null;
      announcements[idx] = Object.assign({}, announcements[idx], data);
      this.set('kost_announcements', announcements);
      return announcements[idx];
    },

    deleteAnnouncement(id) {
      const announcements = this.get('kost_announcements').filter(a => a.id !== id);
      this.set('kost_announcements', announcements);
    },

    /* ---- Activity Logs ---- */

    getLogs() {
      return this.get('kost_activity_logs')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    addLog(userId, userName, action, detail) {
      const logs = this.get('kost_activity_logs');
      const newLog = {
        id: this.generateId('LOG'),
        user_id: userId,
        user_name: userName,
        action: action,
        detail: detail,
        created_at: new Date().toISOString()
      };
      logs.push(newLog);
      this.set('kost_activity_logs', logs);
      return newLog;
    },

    /* ---- Utility ---- */

    generateId(prefix) {
      return prefix + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    },

    formatCurrency(amount) {
      if (amount === null || amount === undefined) return 'Rp 0';
      return 'Rp ' + Number(amount).toLocaleString('id-ID');
    },

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

    formatDateTime(dateStr) {
      if (!dateStr) return '-';
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const time = d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
        return d.getDate() + ' ' + INDONESIAN_MONTHS[d.getMonth()] + ' ' + d.getFullYear() + ', ' + time + ' WIB';
      } catch (e) {
        return dateStr;
      }
    }
  };

  /* ---- Run initialization ---- */
  initializeData();

})();

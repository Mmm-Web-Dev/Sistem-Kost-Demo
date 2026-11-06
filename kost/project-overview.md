# Sistem Manajemen Kost dan Pembayaran Sewa Kost — Project Overview

## Status: ✅ SELESAI (100% Siap Demo & Presentasi Profesional)

Sistem Manajemen Kost dan Pembayaran Sewa Kost berbasis website dengan tampilan profesional, modern, realistis, dan modular tanpa AI-clichés. Mendukung 3 Role Pengguna utama (**User/Penyewa**, **Admin**, **Pemilik Kost/Owner**) dengan hak akses, dashboard, dan alur pembayaran payment gateway interaktif (Midtrans/Xendit Mock Sandbox).

---

## Struktur Proyek Lengkap (31 Files)

```
c:\dummy project\kost\
├── index.html              ← Landing Page publik utama
├── about.html              ← Profil properti, lokasi & pengelola
├── rooms.html              ← Katalog kamar publik + filter harga/fasilitas
├── room-detail.html        ← Detail kamar, kalkulator durasi sewa, booking
├── facilities.html         ← Matriks komparasi fasilitas umum & kamar
├── rules.html              ← Tata tertib, jam malam, sanksi & ketentuan sewa
├── contact.html            ← Form survey/tanya jawab pengelola & FAQ
├── login.html              ← Portal login profesional (multi-role)
├── register.html           ← Pendaftaran akun calon penyewa baru
│
├── css/
│   ├── main.css            ← Global CSS variables, reset, components, buttons
│   └── dashboard.css       ← Sidebar, topbar, cards, tables, badges styling
│
├── js/
│   ├── data.js             ← Seed data (10 kamar, 6 booking, 30+ trx) + KostDB CRUD
│   ├── auth.js             ← KostAuth session, role guards, login, logout
│   └── utils.js            ← Rupiah formatting, date formatting, CSV export, toast, print
│
├── user/                   ← DASHBOARD USER (PENYEWA)
│   ├── dashboard.html      ← Ringkasan sewa, tagihan bulan ini, notifikasi, pengumuman
│   ├── rooms.html          ← Eksplorasi kamar & modal pengajuan booking
│   ├── bookings.html       ← Daftar booking saya, status permohonan, batalkan, bayar
│   ├── payments.html       ← Tagihan berjalan, bayar sewa bulanan, instruksi
│   ├── transactions.html   ← Riwayat transaksi, filter status, export CSV, cetak kwitansi
│   ├── lease.html          ← Informasi kontrak sewa aktif, countdown sisa hari, perpanjangan
│   ├── complaints.html     ← Layanan pengaduan & laporan kerusakan fasilitas + respon admin
│   └── profile.html        ← Profil penghuni, kontak darurat, alamat KTP, ganti password
│
├── admin/                  ← DASHBOARD ADMINISTRATOR
│   ├── dashboard.html      ← Metrik okupansi, booking masuk, approval cepat, keluhan
│   ├── rooms.html          ← Manajemen kamar, tambah unit baru, edit fasilitas/harga, status
│   ├── tenants.html        ← Data seluruh penyewa, kamar dihuni, status kontrak, export
│   ├── bookings.html       ← Kelola booking calon penyewa, aksi Setujui / Tolak
│   ├── payments.html       ← Log arus pembayaran masuk, verifikasi manual pelunasan, cetak kwitansi
│   ├── complaints.html     ← Tindak lanjut keluhan penyewa: Open -> In Progress -> Resolved
│   ├── announcements.html  ← Siaran pengumuman ke seluruh dashboard penghuni
│   ├── reports.html        ← Laporan pendapatan bulanan, okupansi kamar, audit log aktivitas
│   └── settings.html       ← Pengaturan operasional kost, tarif denda, jatuh tempo, rekening kost
│
├── owner/                  ← DASHBOARD PEMILIK KOST (EXECUTIVE)
│   ├── dashboard.html      ← Ringkasan eksekutif bisnis, grafik pendapatan 6 bulan, tren hunian
│   ├── statistics.html     ← Statistik retensi penghuni, durasi tinggal, metode pembayaran
│   ├── rooms.html          ← Pemantauan aset kamar, akumulasi revenue per unit kamar (ROI)
│   ├── tenants.html        ← Data penghuni dan kepatuhan pembayaran sewa
│   ├── income.html         ← Laporan keuangan lengkap: Gross revenue, biaya operasional 15%, Net profit
│   ├── payments.html       ← Audit seluruh pembayaran masuk & invoice
│   ├── occupancy.html      ← Laporan tingkat okupansi per tipe kamar (Standard, Deluxe, Premium)
│   ├── activity.html       ← Pengawasan audit trail seluruh aktivitas operasional admin
│   └── settings.html       ← Rekening pencairan profit pemilik & otorisasi kebijakan harga sewa
│
└── payment/                ← PAYMENT GATEWAY SIMULATOR (MIDTRANS/XENDIT MOCK)
    ├── checkout.html       ← Rincian tagihan sewa + deposit, opsi QRIS, VA 4 Bank, E-Wallet, simulator response
    └── status.html         ← Bukti pembayaran resmi / Invoice kwitansi LUNAS, tombol Cetak PDF
```

---

## Akun Demo Pengujian (Pre-configured)

| Role | Email | Password | Nama Akun | Keterangan |
|------|-------|----------|-----------|------------|
| **Admin** | `admin@kost.com` | `admin123` | Ahmad Fauzi | Akses penuh operasional sistem & data kost |
| **Pemilik (Owner)** | `owner@kost.com` | `owner123` | Hendra Wijaya | Akses pantau bisnis, laporan finansial & audit |
| **Penyewa (Aktif)** | `budi@email.com` | `user123` | Budi Santoso | Penghuni aktif Kamar A-101 |
| **Penyewa (Baru)** | `siti@email.com` | `user123` | Siti Rahayu | Calon penyewa siap booking kamar baru |

---

## Fitur Utama & Kepatuhan Aturan Desain

1. **Non-AI Design Standards**:
   - Skema warna elegan: Navy `#1e3a5f`, Blue `#2563eb`, Green `#16a34a`, Slate `#64748b`, Surface `#ffffff`, Background `#f8fafc`.
   - Menggunakan SVG Icons murni (Lucide standard), tanpa emoji generik pada menu/tombol/badge.
   - Menggunakan tabel data yang rapi dan terstruktur untuk menyajikan informasi tabular.
   - Grafik berbasis bar chart statistik yang proporsional sesuai data aktual sistem.
   - Modal konfirmasi kustom (`KostUtils.confirm`) sebelum aksi destruktif (batal booking, hapus data).
   - Cetak Kwitansi & Invoice didukung `@media print` untuk menghasilkan format PDF formal.
   - Fitur ekspor Excel/CSV (`KostUtils.exportToCSV`) di semua halaman laporan dan transaksi.

2. **Simulasi Payment Gateway Realistis**:
   - Tampilan checkout menyerupai Midtrans Snap / Xendit.
   - QRIS dinamis dengan countdown timer batas pembayaran.
   - Virtual Account otomatis untuk BCA, Mandiri, BNI, dan BRI dengan tombol salin nomor VA.
   - Simulasi respon callback: Pembayaran Berhasil, Pembayaran Gagal, atau Pembayaran Dibatalkan.
   - Update otomatis status kamar (available -> reserved -> occupied) dan penerbitan kwitansi lunas.

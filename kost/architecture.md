# Kost Management System - Architecture

## Color Palette
- Primary: #1e3a5f (Navy)
- Secondary: #2563eb (Blue)
- Accent: #16a34a (Green)
- Background: #f8fafc
- Surface: #ffffff
- Border: #e2e8f0
- Text Primary: #0f172a
- Text Secondary: #64748b
- Status Colors:
  - Success: #16a34a
  - Warning: #d97706
  - Danger: #dc2626
  - Info: #2563eb

## Font
- Inter (Google Fonts)

## Icons
- Lucide Icons (CDN: https://unpkg.com/lucide@latest/dist/umd/lucide.min.js)

## File Structure
```
c:\dummy project\kost\
├── index.html              (Landing page / Beranda)
├── about.html              (Tentang Kost)
├── rooms.html              (Daftar Kamar)
├── room-detail.html        (Detail Kamar)
├── facilities.html         (Fasilitas)
├── rules.html              (Peraturan)
├── contact.html            (Kontak)
├── login.html              (Login)
├── register.html           (Registrasi)
├── css/
│   ├── main.css            (Global styles, variables, components)
│   └── dashboard.css       (Dashboard-specific styles)
├── js/
│   ├── data.js             (Seed data + localStorage management)
│   ├── auth.js             (Authentication logic)
│   └── utils.js            (Utility functions)
├── user/
│   ├── dashboard.html
│   ├── rooms.html
│   ├── bookings.html
│   ├── payments.html
│   ├── transactions.html
│   ├── lease.html
│   ├── complaints.html
│   └── profile.html
├── admin/
│   ├── dashboard.html
│   ├── rooms.html
│   ├── tenants.html
│   ├── bookings.html
│   ├── payments.html
│   ├── complaints.html
│   ├── announcements.html
│   ├── reports.html
│   └── settings.html
├── owner/
│   ├── dashboard.html
│   ├── statistics.html
│   ├── rooms.html
│   ├── tenants.html
│   ├── income.html
│   ├── payments.html
│   ├── occupancy.html
│   ├── activity.html
│   └── settings.html
└── payment/
    ├── checkout.html       (Payment method selection)
    └── status.html         (Payment status page)
```

## Demo Accounts
- Admin: admin@kost.com / admin123
- Owner: owner@kost.com / owner123
- User 1: budi@email.com / user123 (Active tenant, room A-101)
- User 2: siti@email.com / user123 (New user, no active booking)

## LocalStorage Keys
- kost_users
- kost_rooms
- kost_bookings
- kost_payments
- kost_complaints
- kost_notifications
- kost_announcements
- kost_activity_logs
- kost_current_user
- kost_initialized

## Room Data Structure
```json
{
  "id": "room-001",
  "number": "A-101",
  "type": "Standard",
  "floor": 1,
  "price": 1500000,
  "size": "3x4",
  "status": "occupied|available|maintenance|reserved",
  "facilities": ["AC", "Kamar Mandi Dalam", "WiFi", "Kasur", "Lemari"],
  "description": "...",
  "images": [],
  "max_occupants": 1
}
```

## Booking Data Structure
```json
{
  "id": "BKG-001",
  "user_id": "usr-001",
  "room_id": "room-001",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "duration_months": 12,
  "status": "pending|approved|active|completed|cancelled",
  "created_at": "2024-01-01T00:00:00",
  "total_price": 18000000,
  "deposit": 1500000
}
```

## Payment Data Structure
```json
{
  "id": "TRX-001",
  "booking_id": "BKG-001",
  "user_id": "usr-001",
  "type": "booking|monthly|deposit",
  "amount": 1500000,
  "method": "qris|virtual_account|transfer|ewallet",
  "status": "pending|success|failed|expired|cancelled|refunded",
  "created_at": "2024-01-01T00:00:00",
  "paid_at": null,
  "due_date": "2024-01-07T00:00:00",
  "reference": "VA-BCA-123456",
  "month": "2024-01"
}
```

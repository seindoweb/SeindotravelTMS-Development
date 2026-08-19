# SeindoTravel TMS

Fast repository cloning:

```bash
git clone https://github.com/your-organization/SeindotravelTMS-Development.git tms.seindotravel
```

**SeindoTravel TMS (Travel Management System)** adalah sistem manajemen operasional untuk mengelola proses bisnis dan operasional perjalanan secara terintegrasi, mulai dari booking, supplier, produk perjalanan, harga, pembayaran, hingga pelaporan.

Sistem ini dikembangkan untuk mendukung kebutuhan operasional **SeindoTravel** agar proses pengelolaan transaksi perjalanan menjadi lebih terstruktur, efisien, dan mudah dipantau.

## ✨ Features

### Booking Management
- Kelola booking pelanggan
- Kelola status booking
- Booking tiket pesawat
- Booking hotel
- Booking paket tour
- Riwayat transaksi

### Flight Management
- Kelola produk tiket pesawat
- Kelola airline
- Kelola rute penerbangan
- Kelola jadwal penerbangan
- Kelola harga tiket

### Hotel Management
- Kelola data hotel
- Kelola room type
- Kelola room availability
- Kelola harga hotel
- Kelola supplier hotel

### Tour Management
- Kelola paket tour
- Kelola itinerary
- Kelola harga paket
- Kelola periode perjalanan
- Kelola peserta tour

### Supplier / Provider Management
- Kelola supplier
- Kelola provider
- Kelola produk supplier
- Kelola credential dan konfigurasi provider
- Monitoring transaksi provider

### Pricing & Markup
- Kelola harga dasar
- Kelola markup
- Markup berdasarkan produk
- Markup berdasarkan supplier
- Markup berdasarkan customer
- Perhitungan selling price

### Payment & Finance
- Kelola pembayaran
- Monitoring status pembayaran
- Refund
- Commission
- Invoice
- Payment reconciliation

### Reporting
- Laporan booking
- Laporan penjualan
- Laporan pembayaran
- Laporan refund
- Laporan commission
- Laporan profit & margin

## 🛠️ Technology Stack

| Technology | Description |
|---|---|
| Laravel | Backend Framework |
| PHP | Backend Language |
| MySQL | Database |
| React | Frontend |
| TypeScript | Frontend Language |
| Inertia.js | Backend & Frontend Integration |
| Tailwind CSS | UI Framework |
| Vite | Frontend Build Tool |
| Laravel Breeze | Authentication |

## 📋 Requirements

Pastikan environment sudah memiliki:

- PHP >= 8.3
- Composer
- Node.js
- Yarn / npm
- MySQL
- Git

## 🚀 Installation

Clone repository:

```bash
git clone https://github.com/your-organization/SeindotravelTMS-Development.git
```

Masuk ke directory project:

```bash
cd SeindotravelTMS-Development
```

Install dependency PHP:

```bash
composer install
```

Install dependency frontend:

```bash
yarn install
```

atau:

```bash
npm install
```

Copy file environment:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

Konfigurasikan database pada file `.env`:

```env
DB_DATABASE=tms_seindotravel
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan migration:

```bash
php artisan migrate
```

Jika menggunakan seeder:

```bash
php artisan db:seed
```

Build frontend:

```bash
yarn build
```

Untuk development:

```bash
yarn dev
```

Jalankan Laravel:

```bash
php artisan serve
```

## 💻 Development

Untuk menjalankan project dalam mode development:

```bash
php artisan serve
```

Kemudian pada terminal lain:

```bash
yarn dev
```

Project dapat diakses melalui:

```text
http://localhost:8000
```

## 📁 Project Structure

Struktur utama project:

```text
SeindotravelTMS-Development/
├── app/
│   ├── Http/
│   ├── Models/
│   └── Services/
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── resources/
│   ├── css/
│   └── js/
│       ├── Components/
│       ├── Layouts/
│       ├── Pages/
│       └── app.tsx
├── routes/
│   ├── web.php
│   └── api.php
├── public/
├── storage/
├── tests/
├── .env.example
├── composer.json
├── package.json
└── vite.config.ts
```

## 🔐 Authentication

Authentication menggunakan **Laravel Breeze** dan dapat dikembangkan lebih lanjut untuk mendukung kebutuhan keamanan dan akses pengguna.

Role dan permission dapat digunakan untuk membatasi akses berdasarkan fungsi operasional, seperti:

- Administrator
- Sales
- Reservation / Ticketing
- Finance
- Operations
- Manager

## 🔄 Business Flow

Secara umum proses bisnis TMS:

```text
Customer
   │
   ▼
Booking
   │
   ├── Flight
   ├── Hotel
   └── Tour
   │
   ▼
Supplier / Provider
   │
   ▼
Pricing & Markup
   │
   ▼
Payment
   │
   ▼
Invoice
   │
   ▼
Commission & Profit
   │
   ▼
Reporting
```

## 🧪 Testing

Menjalankan test:

```bash
php artisan test
```

Atau:

```bash
./vendor/bin/pest
```

## 📦 Production Build

Build frontend untuk production:

```bash
yarn build
```

Kemudian jalankan Laravel menggunakan environment production:

```env
APP_ENV=production
APP_DEBUG=false
```

Optimasi Laravel:

```bash
php artisan optimize
```

## 🌱 Development Branch

Branch utama yang digunakan:

```text
main
```

Branch development:

```text
development
```

Gunakan branch feature untuk pengembangan fitur baru:

```text
feature/booking-management
feature/hotel-management
feature/flight-management
feature/payment-management
```

## 🤝 Development Guidelines

Sebelum melakukan commit:

```bash
git status
```

Pastikan kode sudah diuji:

```bash
php artisan test
```

Kemudian commit perubahan:

```bash
git add .
git commit -m "Add booking management"
```

Push ke repository:

```bash
git push origin development
```

## 📌 Project Status

> 🚧 **Under Development**

SeindoTravel TMS saat ini masih dalam tahap pengembangan dan fitur dapat berubah mengikuti kebutuhan bisnis dan operasional SeindoTravel.

## 📄 License

This project is proprietary software developed for **SeindoTravel**.

Unauthorized copying, distribution, modification, or commercial use is prohibited without permission.

---

**SeindoTravel TMS**  
*Travel Management System for SeindoTravel*

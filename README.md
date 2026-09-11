# 🏘️ Smart Village

**Smart Village** adalah sistem informasi dan layanan masyarakat berbasis digital yang dikembangkan untuk mendukung penyampaian informasi serta pelayanan administrasi di tingkat padukuhan.

Sistem ini terdiri dari tiga bagian utama:

- 📱 **mobile_flutter** — Flutter untuk masyarakat
- ⚙️ **Backend** — Node.js & Express.js
- 🖥️ **frontend_admin** — React.js untuk pengelola

---

## 📱 Mobile Application

Aplikasi mobile dikembangkan menggunakan **Flutter & Dart** sebagai platform utama untuk masyarakat.

Melalui aplikasi ini, masyarakat dapat mengakses informasi dan menggunakan berbagai layanan secara langsung melalui perangkat mobile.

### Fitur Utama

- 🔐 Registrasi dan login pengguna
- 🏠 Beranda informasi padukuhan
- 📢 Informasi kegiatan
- 📦 inventori dan peminjaman inventori
- 📝 Pengajuan pengaduan
- 📋 Riwayat pengaduan
- 📄 Pengajuan surat domisili
- 📋 Riwayat pengajuan surat
- 🔔 Notifikasi menggunakan Firebase Cloud Messaging (FCM)

---

## ⚙️ Backend

Backend berfungsi sebagai **REST API** yang menghubungkan aplikasi Flutter dengan database serta dashboard admin.

### Teknologi

- Node.js
- Express.js
- REST API
- Sequelize
- Database
- Firebase

### Struktur Backend

```text
Backend/
├── config/
├── controllers/
├── cron/
├── middleware/
├── migrations/
├── models/
├── routes/
├── app.js
└── package.json

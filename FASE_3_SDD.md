# Fase 3: SDD (Software Design Document)

## 1. Arsitektur Sistem & Infrastruktur
* **Arsitektur:** Fullstack Monolithic menggunakan Next.js (*App Router*).
* **Deployment:** Aplikasi di-*hosting* di lokal server Linux menggunakan PM2 sebagai *process manager* agar aplikasi *online* 24/7.
* **Aksesibilitas:** Diakses via IP lokal untuk jaringan internal, atau menggunakan *Reverse Proxy* untuk akses publik via domain.

## 2. Database & ORM
* **Fase Development:** SQLite (lokal).
* **Fase Production:** PostgreSQL.
* **ORM:** Prisma (sebagai *Source of Truth* untuk AI Code Generator).

## 3. Struktur Backend (Entitas Database)
* **User:** Menyimpan kredensial pemilik.
* **Vehicle:** Relasi *One-to-Many* dengan User. Atribut: Nama Motor, Plat Nomor, Merek, Odometer Awal.
* **ServiceRecord:** Relasi *One-to-Many* dengan Vehicle. Atribut: Tanggal, Odometer, Total Biaya, Saran/Notes.
* **ServiceDetail:** Relasi *One-to-Many* dengan ServiceRecord. Atribut: Nama Barang/Jasa, Harga, Status Reminder.

## 4. API
Aplikasi tidak menggunakan API *route* tradisional, melainkan memanfaatkan fitur *Server Actions* bawaan Next.js untuk mengeksekusi operasi CRUD langsung ke *database*.

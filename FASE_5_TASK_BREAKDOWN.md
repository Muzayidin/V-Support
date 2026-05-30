# Fase 5: Task Breakdown

## Milestone 1: Setup & Fondasi Database (Tahap Persiapan)
* **1.1:** Inisialisasi proyek Next.js dengan Tailwind CSS.
* **1.2:** Instalasi Prisma dan setup SQLite untuk *development* lokal.
* **1.3:** Instruksikan AI untuk menulis `schema.prisma` mencakup model `User`, `Vehicle`, `ServiceRecord`, dan `ServiceDetail`.
* **1.4:** Jalankan `prisma db push` untuk memvalidasi struktur tabel.

## Milestone 2: Server Actions & Logika Backend (Tahap "Mesin")
* **2.1:** Buat fungsi CRUD untuk `Vehicle`.
* **2.2:** Buat fungsi CRUD bersarang untuk `ServiceRecord` dan `ServiceDetail`.
* **2.3:** Susun *logic* komputasi untuk fitur Estimasi Biaya Servis.
* **2.4:** Susun *logic* komparasi data untuk memicu sistem *Reminder*.

## Milestone 3: UI/UX & Komponen Frontend (Tahap Visual)
* **3.1:** Bangun Global Layout dan Bottom Navigation Bar.
* **3.2:** *Styling* Dashboard Utama (Odometer Hero, Card Estimasi & Reminder).
* **3.3:** Buat Form Input Servis (Chips interaktif dan validasi input numerik).
* **3.4:** Buat *Timeline View* untuk Halaman Riwayat.
* **3.5:** Implementasikan *Bottom Sheet Modal* untuk notifikasi Saran Otomatis.

## Milestone 4: Integrasi & Testing (Tahap Perakitan)
* **4.1:** Hubungkan Form Input (Frontend) dengan fungsi simpan dari *Server Actions* (Backend).
* **4.2:** Uji logika *Multi-Vehicle* dengan *dummy data* (pastikan riwayat motor A tidak masuk ke motor B).
* **4.3:** Verifikasi kalkulasi *Reminder* dan keluaran Estimasi Biaya di Dashboard.

## Milestone 5: Production & Deployment (Tahap Rilis)
* **5.1:** Migrasikan koneksi *database* dari SQLite lokal ke PostgreSQL.
* **5.2:** Melakukan `npm run build` untuk optimasi produksi.
* **5.3:** Konfigurasikan dan jalankan aplikasi menggunakan *process manager* di Linux server lokal.
* **5.4:** *Quality Assurance* (QA) akhir menggunakan antarmuka *smartphone*.

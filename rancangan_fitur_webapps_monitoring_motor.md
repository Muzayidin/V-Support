# Rancangan Fitur Webapps Monitoring Pemeliharaan Motor (V-Support)

**V-Support** adalah aplikasi web berbasis *mobile-first* yang dirancang untuk memudahkan pemilik sepeda motor dalam memantau kondisi kendaraan, menjadwalkan perawatan rutin, mengelola riwayat servis, serta merencanakan anggaran pengeluaran kendaraan secara mandiri.

Dokumen ini menyelaraskan ide perancangan fitur awal dengan spesifikasi teknis dan implementasi produk (**PRD**, **SRS**, **SDD**, **UI/UX Flow**, dan **Design System**).

---

## 1. Garasi Digital & Profil Motor (*Vehicle Management*)
* **Multi-Kendaraan (*Multi-Vehicle Support*):** 
  * Mendukung penyimpanan dan pengelolaan lebih dari satu motor dalam satu akun.
  * Setiap kendaraan memiliki identitas: Nama Kendaraan (e.g., Honda Vario 150), Nomor Polisi/Plat, Merek & Model, serta Odometer terkini.
  * *[Roadmap Lanjutan]:* Unggah foto profil kendaraan, tahun perakitan, dan nomor rangka/mesin.
* **Indikator Kesehatan Motor (*Health Status Gauge*):**
  * Tampilan visual meter/gauge status kesehatan kendaraan di Dashboard Hero ("Kondisi Prima" / "Perlu Servis") yang dihitung secara dinamis.
* **Pembaruan Odometer (*Mileage Tracking*):**
  * Pelacakan KM terakhir melalui form servis dan menu edit kendaraan.
  * *[Roadmap Lanjutan]:* Input cepat (*quick update*) KM langsung dari Hero Card Dashboard untuk merefresh status kalkulasi tanpa perlu membuat riwayat servis baru.

---

## 2. Pencatatan Servis & Manajemen Pengeluaran (*Service & Expense Log*)
* **Log Perawatan Berkala (*Service Log Form*):**
  * Pencatatan riwayat servis komprehensif: tanggal servis, posisi angka odometer (KM), daftar suku cadang/jasa, dan biaya per item.
  * Dilengkapi validasi integritas data: angka odometer servis baru wajib lebih besar atau sama dengan servis sebelumnya.
* **Input Cepat Interaktif (*Chips / Tags Selector*):**
  * Pilihan suku cadang/pekerjaan servis rutin instan dalam bentuk *chips* (misal: `Oli Mesin`, `Oli Gardan`, `Kampas Rem Depan`, `Kampas Rem Belakang`, `Busi`, `V-Belt`) dan dukungan input komponen kustom untuk kemudahan input satu tangan di ponsel.
* **Timeline Riwayat Servis (*Vertical History Timeline*):**
  * Daftar catatan servis yang disajikan secara kronologis terbalik (terbaru ke terlama) dilengkapi rincian biaya, tanggal, dan jarak tempuh saat perawatan dilakukan.
* **Proyeksi Estimasi Biaya Servis Mendatang (*Upcoming Cost Estimation*):**
  * Algoritma kalkulasi prediktif yang memperkirakan dana yang perlu disiapkan pengguna untuk jadwal servis berikutnya berdasarkan rata-rata biaya servis berkala sebelumnya.
* **Arsip Bukti Transaksi (*Receipt Upload* - Roadmap Lanjutan):**
  * Fitur unggah foto nota bengkel, kuitansi, atau faktur pembelian suku cadang untuk arsip digital di penyimpanan *cloud*/lokal.
* **Kalkulator Finansial & Analitik (*Financial Analytics* - Roadmap Lanjutan):**
  * Laporan grafik pengeluaran perawatan berkala per bulan atau per tahun untuk evaluasi anggaran operasional kendaraan.

---

## 3. Pengingat Cerdas & Rekomendasi (*Smart Reminder & Suggestions*)
* **Pengingat Komponen Rutin (*Mileage & Time-Based Reminder*):**
  * Algoritma pengingat internal yang memantau sisa jarak tempuh menuju servis berkala (standar interval 2.000 KM atau sesuai rekomendasi pabrikan).
  * Sistem peringatan visual (*warning alert*) pada Dashboard saat jarak tempuh mendekati ambang batas servis (<= 200 KM).
  * *[Roadmap Lanjutan]:* Integrasi *Web Push Notification* dan email pengingat terjadwal.
* **Pop-up Rekomendasi Pintar (*Smart Suggestion Engine*):**
  * *Bottom Sheet Modal* interaktif yang muncul sesaat setelah pengguna mencatat servis baru, memberikan saran perawatan komponen berikutnya berdasarkan pola riwayat servis yang baru dicatat.
* **Alarm Pajak & Administrasi Kendaraan (*Tax & Document Reminder* - Roadmap Lanjutan):**
  * Pengingat tanggal jatuh tempo pembayaran Pajak Kendaraan Bermotor (PKB) tahunan serta perpanjangan plat nomor/STNK 5 tahunan.

---

## 4. Edukasi & Nilai Tambah Kendaraan (*Value-Added Features*)
* **Referensi Standar Pabrikan (*Manufacturer Knowledge Base* - Roadmap Lanjutan):**
  * Basis data panduan umur ideal suku cadang standar dan jadwal servis berkala pabrikan untuk melindungi pemilik awam dari tindakan curang atau servis berlebih (*over-servicing*).
* **Buku Servis Digital & Ekspor PDF (*Digital Service Passport* - Roadmap Lanjutan):**
  * Fitur ekspor riwayat perawatan menjadi dokumen PDF resmi yang rapi dan terverifikasi, dapat digunakan sebagai bukti riwayat perawatan otentik (*well-maintained record*) untuk mendongkrak harga jual kembali (*resale value*).

---

## 5. Ringkasan Status Implementasi (Pemetaan Fitur ke Roadmap V-Support)

| Kategori Fitur | Sub-Fitur | Status Rilis | Catatan Teknis / UI |
| :--- | :--- | :--- | :--- |
| **Garasi Digital** | Multi-Kendaraan (Nama, Plat, KM) | **Tersedia (Fase 1/MVP)** | Tabel `Vehicle`, Dropdown switch di Header |
| | Health Status Gauge (Lingkaran Prima) | **Tersedia (Fase 1/MVP)** | SVG circular meter di Hero Section |
| | Profil Lengkap (Foto, Tahun, Merek) | *Fase 2 (Roadmap)* | Memerlukan perluasan kolom schema Prisma |
| | Input Cepat Odometer di Dashboard | *Fase 2 (Roadmap)* | Dialog modal cepat di dashboard |
| **Pencatatan Servis** | Form Catat Servis + Validasi KM | **Tersedia (Fase 1/MVP)** | `createServiceRecord` Server Action |
| | Chips Komponen Cepat & Dynamic Price | **Tersedia (Fase 1/MVP)** | Form interaktif di `/add-service` |
| | Timeline Riwayat Servis | **Tersedia (Fase 1/MVP)** | Halaman `/history` dengan sorting kronologis |
| | Proyeksi Estimasi Biaya Servis Terdekat | **Tersedia (Fase 1/MVP)** | `estimateNextServiceCost` di dashboard |
| | Upload Foto Nota / Bukti Servis | *Fase 2 (Roadmap)* | Penyimpanan file lokal / S3 storage |
| | Grafik Analitik Pengeluaran | *Fase 2 (Roadmap)* | Komponen Chart (Recharts / Chart.js) |
| **Pengingat & Saran** | In-App Reminder Card (Sisa KM) | **Tersedia (Fase 1/MVP)** | Card "Perlu Perhatian" di dashboard |
| | Smart Suggestion Modal Pasca-Input | **Tersedia (Fase 1/MVP)** | Bottom sheet modal pasca-submit |
| | Web Push / Email Notification | *Fase 2 (Roadmap)* | Web Push API / Nodemailer service |
| | Alarm Pajak STNK / PKB | *Fase 2 (Roadmap)* | Field tanggal pajak pada `Vehicle` |
| **Edukasi & Nilai Tambah** | Referensi Umur Standar Komponen | *Fase 2 (Roadmap)* | Tabel data referensi suku cadang |
| | Ekspor Riwayat Servis ke PDF | *Fase 2 (Roadmap)* | Generator PDF (@react-pdf/renderer / jsPDF) |
# STITCH UI GENERATOR PROMPT: V-SUPPORT MOBILE APP

## GLOBAL STYLE GUIDE (Untuk Pengaturan Awal di Stitch)
- **Platform:** Mobile App (iOS/Android Native Look)
- **Design System:** Modern, Clean, Minimalist
- **Color Palette:** - Primary: Deep Teal / Slate Blue (Memberikan kesan terpercaya dan mekanis)
  - Secondary: Emerald Green (Untuk status aman/sukses)
  - Accent: Amber Orange (Untuk status reminder/peringatan)
  - Background: Light Gray (#F8F9FA) dengan Card berwarna Putih Bersih (#FFFFFF)
- **Typography:** Sans-serif (Inter atau Roboto), bersih, dengan keterbacaan tinggi di layar smartphone.
- **Navigation:** Bottom Navigation Bar fixed dengan 4 menu (Beranda, Riwayat, Kendaraan, Profil).

---

## SCREEN 1: DASHBOARD / UTAMA (BERANDA)
**Prompt Text untuk Stitch:**
"Create a mobile dashboard screen for a Motor Maintenance application named V-Support. Clean and modern card-based layout."

**Struktur Komponen & Tata Letak:**
1. **Top Bar / Header:**
   - Sisi Kiri: Teks ucapan "Halo, Pengguna!" dengan ukuran kecil.
   - Sisi Kanan: Dropdown pemilih kendaraan yang elegan berbentuk pil (Contoh: "Honda Vario 150 ▾").
2. **Hero Section (Status Kendaraan Card):**
   - Sebuah card besar di bagian atas dengan background putih dan shadow tipis.
   - Di dalamnya terdapat grafik lingkaran atau indikator visual "Status Kesehatan Motor" berwarna hijau dengan teks "Kondisi Prima".
   - Tampilkan angka Odometer saat ini dengan font berukuran besar dan tebal (Contoh: "24.500 KM").
3. **Section 1: Pengingat & Proyeksi Biaya (Reminder & Budget Card):**
   - Judul section: "Perlu Perhatian".
   - List item berbentuk card kecil horizontal:
     - Item 1: Teks "Oli Mesin (Sisa 150 KM lagi)" di sebelah kiri, dan estimasi biaya "Rp 65.000" di sebelah kanan dengan tag warna Amber Orange.
     - Item 2: Teks "Pajak Tahunan (Jatuh tempo 12 Des)" dengan tag peringatan.
4. **Floating Action Button (FAB):**
   - Tombol bulat melayang di pojok kanan bawah dengan warna Primary, berisi ikon tanda tambah ("+") berukuran besar untuk pintasan cepat melakukan servis.
5. **Bottom Navigation Bar:**
   - Bar navigasi bawah yang statis dengan ikon dan label: [Beranda (Aktif)] | [Riwayat] | [Kendaraan] | [Profil].

---

## SCREEN 2: FORM INPUT DATA SERVIS (TAMBAH SERVIS)
**Prompt Text untuk Stitch:**
"Create a mobile form screen for logging a motorcycle service event for V-Support app. Clean input fields, large touch targets."

**Struktur Komponen & Tata Letak:**
1. **Top Navigation:**
   - Tombol kembali (Back arrow) di pojok kiri atas dan judul halaman "Catat Servis Baru" di tengah.
2. **Form Fields (Vertikal Stack):**
   - **Dropdown Kendaraan:** Input pilihan motor yang diservis.
   - **Input Tanggal:** Kolom input dengan ikon kalender di sebelah kanan.
   - **Input Odometer:** Kolom input angka (Numeric only) untuk KM saat ini.
3. **Section Sparepart & Jasa (Chips Selector):**
   - Label: "Pilih Komponen yang Diganti/Diservis".
   - Tampilkan deretan tombol kecil berbentuk kapsul (Chips/Tags) yang bisa diklik (multi-select), contoh komponen: `[Oli Mesin]`, `[Oli Gardan]`, `[Kampas Rem Depan]`, `[Kampas Rem Belakang]`, `[Busi]`, `[V-Belt]`.
   - Di bawah chips, sediakan tombol "+ Tambah Komponen Kustom" jika tidak ada di daftar.
4. **Dynamic Price List:**
   - Setiap komponen yang dipilih di atas akan memunculkan baris input baru di bawahnya secara dinamis: `[Nama Komponen] - [Input Harga (Rupiah)]`.
5. **Bottom Fixed Button:**
   - Tombol "Simpan Riwayat Servis" berukuran penuh (Full-width button) di bagian paling bawah layar dengan warna Primary, mudah ditekan dengan ibu jari.

---

## SCREEN 3: RIWAYAT SERVIS (HISTORY LOG)
**Prompt Text untuk Stitch:**
"Create a mobile history log screen for vehicle maintenance records in V-Support. Vertical timeline format with clear typography."

**Struktur Komponen & Tata Letak:**
1. **Header:**
   - Judul "Riwayat Servis" yang tebal, di bawahnya terdapat kolom pencarian (Search bar) dan tombol filter kecil untuk menyaring berdasarkan jenis motor atau rentang tanggal.
2. **Timeline List (Scrollable):**
   - Desain baris per baris yang dipisahkan oleh garis vertikal halus (Timeline):
     - **Card Riwayat 1:** - Kiri: Lingkaran kecil berisi ikon kunci pas.
       - Tengah: Tanggal "25 Mei 2026" (tebal), di bawahnya sub-teks daftar komponen "Ganti Oli Mesin, Kampas Rem" dan informasi "Pada 24.350 KM".
       - Kanan: Teks harga total dicetak tebal dengan warna gelap: **Rp 115.000**.
     - **Card Riwayat 2:** - Kiri: Lingkaran kecil berisi ikon dokumen.
       - Tengah: Tanggal "10 Januari 2026", sub-teks "Pembayaran Pajak Tahunan STNK".
       - Kanan: Teks harga: **Rp 350.000**.

---

## SCREEN 4: BOTTOM SHEET POP-UP (SARAN PINTAR)
**Prompt Text untuk Stitch:**
"Create a mobile bottom sheet modal component for a success state with smart recommendations text for V-Support."

**Struktur Komponen & Tata Letak:**
1. **Modal Container:**
   - Layar setengah terbuka yang meluncur dari bagian bawah (*Bottom Sheet*), menutup sebagian halaman latar belakang dengan efek overlay gelap transparan.
2. **Success Indicator:**
   - Ikon lingkaran centang hijau besar di bagian atas tengah modal, diikuti teks tebal "Data Berhasil Disimpan!".
3. **Recommendation Content Box:**
   - Kotak informasi dengan background hijau sangat muda atau abu-abu lembut.
   - Berisi teks saran otomatis: *"Saran Sistem: Berdasarkan riwayat, Kampas Rem Belakang Anda perlu diperiksa dalam 1.000 KM lagi. Estimasi biaya berikutnya: Rp 45.000."*
4. **Action Button:**
   - Tombol tunggal "Selesai & Kembali ke Beranda" di bagian bawah modal untuk menutup halaman pop-up.
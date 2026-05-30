# Fase 2: SRS (Software Requirements Specification)

## 1. Validasi Form (Aturan Aplikasi)
Saat pengguna menyimpan riwayat servis, sistem mewajibkan kolom berikut terisi:
* **Pemilihan Kendaraan:** Dropdown wajib diisi untuk menentukan motor mana yang diservis.
* **Tanggal Servis:** Format DD/MM/YYYY.
* **Odometer/KM Saat Ini:** Wajib angka numerik dan nilainya harus lebih besar dari input KM pada servis sebelumnya.
* **Daftar *Sparepart* & Jasa:** Minimal 1 item wajib diisi.
* **Harga per *Item*:** Wajib numerik untuk kalkulasi total otomatis.

## 2. Behavior: Logika Reminder
* Pengguna dapat mengatur interval secara manual (contoh: per 2.000 KM atau per 2 bulan).
* Jika tidak diatur manual, sistem menggunakan rekomendasi pabrik sebagai *default* (misal: Oli Mesin 2.000 KM). Pengingat akan terpicu berdasarkan mana yang tercapai lebih dulu (Waktu atau KM terakhir).

## 3. Behavior: Logika Estimasi Biaya
* Sistem menghitung **Biaya Dasar** (harga item rutin dari servis terakhir, misal: Oli + Jasa).
* Sistem mengecek **Komponen Jatuh Tempo** untuk bulan/periode berikutnya berdasarkan KM atau Waktu.
* Harga historis dari komponen yang jatuh tempo tersebut akan ditambahkan ke Biaya Dasar untuk menghasilkan angka **Estimasi Biaya Servis Selanjutnya**.

## 4. Behavior: Logika Saran Otomatis
Sistem memunculkan *feedback* otomatis setelah input data berdasarkan:
* Usia komponen (peringatan mendekati batas pemakaian).
* Anomali biaya (peringatan jika pengeluaran melonjak dari rata-rata).
* Saran tindakan (misal: penyesuaian gaya berkendara pasca ganti komponen spesifik).

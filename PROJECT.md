# MuslimKu

Jenis: pwa | Bahasa: id

## Fitur
- F1 Jadwal shalat 5 waktu
  - lulus bila: jadwal Jakarta ditampilkan
  - lulus bila: daftar kota pilihan tersedia
  - lulus bila: tidak ada kesalahan konsol saat online
- F2 Doa harian
  - lulus bila: daftar doa ditampilkan
  - lulus bila: bisa diakses offline
- F3 Bacaan surah pendek Juz 30
  - lulus bila: surah pendek ditampilkan
  - lulus bila: bisa diakses offline
- F4 Arah kiblat via kompas
  - lulus bila: kompas ditampilkan
  - lulus bila: arah kiblat ditunjukkan
- F5 Notifikasi pengingat shalat
  - lulus bila: izin notifikasi diminta
  - lulus bila: pengingat 10 menit sebelum adzan

## File
- index.html
- css/style.css
- js/app.js — renderJadwal(data), requestNotifikasi(), hitungKiblat(lat,lon), simpanData(kunci,data), bacaData(kunci)
- sw.js
- manifest.webmanifest

## Keputusan
- UI satu halaman tema hijau putih tanpa framework
- jadwal online dari API disimpan sementara di browser
- doa dan surah tersedia offline via service worker
- kartu pengetahuan hanya prayer-times dan qibla; fitur lain tidak ada kartu
- notifikasi browser 10 menit sebelum adzan

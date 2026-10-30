# Islam Pintar

Jenis: pwa | Bahasa: id

## Fitur
- F1 Konten dasar Islam
  - lulus bila: halaman utama menampilkan judul
  - lulus bila: 5 pilar Islam tercantum
  - lulus bila: cara wudhu dan sholat tersedia
- F2 Jadwal sholat
  - lulus bila: jadwal sholat ditampilkan
  - lulus bila: default kota Jakarta digunakan
  - lulus bila: cache terakhir digunakan offline
- F3 Arah kiblat
  - lulus bila: derajat kiblat ditampilkan
  - lulus bila: kompas ponsel atau fallback manual
  - lulus bila: input derajat manual tersedia
- F4 PWA offline
  - lulus bila: service worker terdaftar
  - lulus bila: manifest webapp tersedia
  - lulus bila: bisa diakses offline
- F5 Notifikasi sholat
  - lulus bila: tombol izinkan notifikasi tersedia
  - lulus bila: izin browser diminta

## File
- index.html
- js/app.js — initApp(), showPrayerTimes(times), showQibla(bearing), requestNotificationPermission()
- js/prayer.js — getPrayerTimes(lat,lon,date), cachePrayerTimes(times), loadCachedPrayerTimes()
- js/qibla.js — getQiblaBearing(lat,lon), startCompass(callback), setManualBearing(deg)
- style.css
- manifest.webmanifest

## Keputusan
- Tanpa login, semua konten publik
- GPS otomatis dengan fallback Jakarta
- Notifikasi teks tanpa suara
- Kompas ponsel dengan fallback manual derajat

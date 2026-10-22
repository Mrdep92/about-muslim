# Rencana Implementasi — About Muslim

## Fase 1: Setup dan Fondasi (Minggu 1)
- Inisialisasi project Android Studio dengan Kotlin + Jetpack Compose
- Konfigurasi Gradle (Kotlin DSL), Hilt, dan Navigation Compose
- Buat struktur folder berdasarkan Clean Architecture
- Implementasi Design System dasar (Theme, Warna, Tipografi, Tema gelap/terang)
- Buat `PROJECT_BIBLE.md` versi akhir sebagai referensi tim

## Fase 2: Layer Data dan Domain (Minggu 2)
- Siapkan Room database untuk konten statis (Rukun Iman, Rukun Islam, daftar surah)
- Integrasi Retrofit untuk API jadwal sholat dan Al-Quran (sumber publik)
- Implementasi Repository dan Use case untuk setiap fitur
- Tulis unit test untuk semua use case layer domain (JUnit + Mockito)

## Fase 3: Fitur Int
- Layar Tentang Islam (konten statis dari Room)
- Layar Jadwal Sholat (deteksi lokasi, tampilan daftar harian)
- Layar Arah Qibla (sensor kompas, visual arah kiblat)
- Layar Al-Quran (daftar surah, detail ayat)
- Fitur pencarian lintas konten

## Fase 4: Navigasi dan UX (Minggu 4)
- Hubungkan semua layar dengan Navigation Compose
- Tambahkan transisi dan handling error (loading, empty, error state)
- Implementasi preferensi tema (gelap/terang) dengan DataStore
- Uji navigasi dan alur pengguna secara menyeluruh

## Fase 5: Testing dan Kualitas (Minggu 5)
- Compose UI Test untuk layar utama
- Uji coba pada perangkat fisik dan emulator (API 24–34)
- Perbaikan lint, formatting, dan peringatan build
- Dokumentasi API dan cara menjalankan project

## Fase 6: Polish dan Rilis (Minggu 6)
- Ikon aplikasi, layar splash, dan pengaturan build release
- Penyesesuaian aksesibilitas (contentDescription, kontras warna)
- Siapkan APK/AAB untuk distribusi internal
- Review akhir terhadap Acceptance Criteria di PROJECT_BIBLE

## Keputusan dan Risiko
- Keputusan: Menggunakan Android Native (Kotlin + Compose) untuk performa dan akses sensor kompas terbaik.
- Risiko: Ketergantungan API publik jadwal sholat dapat berubah; siapkan fallback data statis.
- Risiko: Akses lokasi memerlukan izin runtime; atur di `AndroidManifest.xml` dan coba tangani penolakan izin.

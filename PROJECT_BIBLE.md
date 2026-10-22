# Project Bible — About Muslim

## Tujuan
Membuat aplikasi mobile referensi tentang Islam yang menyediakan informasi dasar, jadwal sholat, arah qibla, dan bacaan Al-Quran dalam bahasa Indonesia, dengan data akurat dan pengalaman pengguna yang ramah bagi semua kalangan.

## Tech stack
- Platform: Android (minSDK 24, targetSDK 34)
- Bahasa: Kotlin
- UI: Jetpack Compose
- Navigasi: Jetpack Compose Navigation
- Arsitektur: MVVM + Clean Architecture (presentation, domain, data)
- Injeksi Dependensi: Hilt
- Database Lokal: Room
- Jaringan: Retrofit + OkHttp + Kotlin Serialization
- Build: Gradle (Kotlin DSL)
- Testing: JUnit 5, Mockito, Turbine, Compose UI Test

## Aturan
- Jawab singkat dan konkret
- Ikuti gaya kode yang sudah ada
- Komentar dan dokumentasi dalam bahasa Indonesia
- Nama variabel/fungsi konsisten (Indonesia atau Inggris, tidak campur secara acak)
- Setiap use case di layer domain harus memiliki unit test

## Arsitektur
- **Presentation:** Jetpack Compose (Screen, Component, ViewModel, UI State)
- **Domain:** Entitas, Use case, Interface Repository
- **Data:** Implementasi Repository, Room DAO, Remote API, DataSource, Mapper

## Fitur MVP
1. Halaman tentang Islam (sejarah singkat, Rukun Iman, Rukun Islam)
2. Jadwal sholat harian berdasarkan lokasi GPS
3. Arah qibla dengan sensor kompas perangkat
4. Daftar surah Al-Quran dan bacaan ayat
5. Pencarian kontes dalam aplikasi
6. Tema gelap/terang

## Acceptance Criteria
- Aplikasi berjalan tanpa crash di Android API 24 ke atas
- Jadwal sholat ditampilkan sesuai sumber data eksternal
- Kompas qibla berfungsi pada perangkat yang memiliki sensor magnetometer
- Semua teks antarmuka dalam bahasa Indonesia
- Pengguna dapat berpindah tema gelap/terang
- Setiap layar utama memiliki minimal satu Compose UI Test

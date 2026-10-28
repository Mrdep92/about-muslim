package com.example.pixelforge;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Menghitung jadwal sholat harian berdasarkan lokasi (lintang, bujur),
 * tanggal, dan offset zona waktu menggunakan perhitungan astronomi.
 */
public class PrayerTimeCalculator {

    private static final double PI = Math.PI;

    private final double latitude;
    private final double longitude;
    private final int timeZone; // offset dalam jam dari UTC

    public PrayerTimeCalculator(double latitude, double longitude, int timeZone) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.timeZone = timeZone;
    }

    /**
     * Mengembalikan peta nama sholat -> jam desimal (0-24) untuk tanggal tertentu.
     */
    public Map<String, Double> calculateTimes(LocalDate date) {
        double dayOfYear = date.getDayOfYear();
        double equationOfTime = calculateEquationOfTime(dayOfYear);
        double declination = calculateSolarDeclination(dayOfYear);

        double timeOffset = timeZone * 60.0 - longitude; // menit
        double noon = 12.0 + timeOffset / 60.0;

        double sunriseAngle = 0.833; // derajat
        double fajrAngle = 18.0;
        double ishaAngle = 18.0;
        double asrFactor = 1.0; // Asr standard (saya = panjang objek)

        Map<String, Double> times = new HashMap<>();

        double sunrise = calculateSunTime(noon, sunriseAngle, equationOfTime, declination, true);
        double sunset = calculateSunTime(noon, sunriseAngle, equationOfTime, declination, false);

        times.put("Imsak", roundToMinutes(noon - calculateHourAngle(fajrAngle, equationOfTime, declination) / 15.0 - timeOffset / 60.0));
        times.put("Fajr", roundToMinutes(noon - calculateHourAngle(fajrAngle, equationOfTime, declination) / 15.0 - timeOffset / 60.0));
        times.put("Sunrise", roundToMinutes(sunrise));
        times.put("Dhuhr", roundToMinutes(noon));
        times.put("Asr", roundToMinutes(calculateAsr(noon, asrFactor, equationOfTime, declination)));
        times.put("Sunset", roundToMinutes(sunset));
        times.put("Maghrib", roundToMinutes(sunset));
        times.put("Isha", roundToMinutes(noon + calculateHourAngle(ishaAngle, equationOfTime, declination) / 15.0 - timeOffset / 60.0));
        times.put("Midnight", roundToMinutes((noon + 12.0) % 24));

        return times;
    }

    private double calculateEquationOfTime(double dayOfYear) {
        double b = 2 * PI * (dayOfYear - 81) / 365.0;
        return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
    }

    private double calculateSolarDeclination(double dayOfYear) {
        return 23.45 * Math.sin(Math.toRadians(360.0 * (284.0 + dayOfYear) / 365.0));
    }

    private double calculateHourAngle(double angle, double equationOfTime, double declination) {
        double latRad = Math.toRadians(latitude);
        double decRad = Math.toRadians(declination);
        double angleRad = Math.toRadians(angle);

        double val = (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decRad)) /
                (Math.cos(latRad) * Math.cos(decRad));

        // Clamp untuk menghindari NaN di daerah lingkaran kutub
        val = Math.max(-1.0, Math.min(1.0, val));

        double hourAngle = Math.toDegrees(Math.acos(val));
        return hourAngle;
    }

    private double calculateSunTime(double noon, double angle, double equationOfTime,
                                    double declination, boolean isSunrise) {
        double hourAngle = calculateHourAngle(angle, equationOfTime, declination);
        double time = noon - hourAngle / 15.0;
        if (!isSunrise) {
            time = noon + hourAngle / 15.0;
        }
        return wrapTime(time);
    }

    private double calculateAsr(double noon, double factor, double equationOfTime, double declination) {
        double latRad = Math.toRadians(latitude);
        double decRad = Math.toRadians(declination);

        double angle = Math.toDegrees(Math.atan(1.0 / (factor + Math.abs(Math.tan(latRad - decRad)))));
        double hourAngle = calculateHourAngle(angle, equationOfTime, declination);
        return wrapTime(noon + hourAngle / 15.0);
    }

    private double wrapTime(double t) {
        while (t < 0) t += 24;
        while (t >= 24) t -= 24;
        return t;
    }

    private double roundToMinutes(double decimalHours) {
        double totalMinutes = decimalHours * 60.0;
        int roundedMinutes = (int) Math.round(totalMinutes);
        return roundedMinutes / 60.0;
    }

    public static String formatTime(double decimalHours) {
        int totalMinutes = (int) Math.round(decimalHours * 60.0);
        int h = (totalMinutes / 60) % 24;
        int m = totalMinutes % 60;
        return String.format("%02d:%02d", h, m);
    }

    public List<String> getPrayerNames() {
        List<String> names = new ArrayList<>();
        names.add("Imsak");
        names.add("Fajr");
        names.add("Sunrise");
        names.add("Dhuhr");
        names.add("Asr");
        names.add("Sunset");
        names.add("Maghrib");
        names.add("Isha");
        names.add("Midnight");
        return names;
    }
}

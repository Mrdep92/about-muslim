package com.example.pixelforge;

/**
 * Menghitung azimut arah kiblat dari lokasi pengguna menuju Ka'bah
 * (Mekah: lintang 21.4225° N, bujur 39.8262° E) menggunakan rumus
 * great-circle bearing. Menyediakan konversi azimut ke arah mata angin tekstual.
 */
public class QiblaCompass {

    private static final double KAABA_LAT = 21.4225;
    private static final double KAABA_LON = 39.8262;

    private final double userLatitude;
    private final double userLongitude;

    public QiblaCompass(double userLatitude, double userLongitude) {
        this.userLatitude = userLatitude;
        this.userLongitude = userLongitude;
    }

    /**
     * Mengembalikan azimut kiblat dalam derajat (0-360), di mana 0 = Utara.
     */
    public double calculateQiblaAzimuth() {
        double lat1 = Math.toRadians(userLatitude);
        double lon1 = Math.toRadians(userLongitude);
        double lat2 = Math.toRadians(KAABA_LAT);
        double lon2 = Math.toRadians(KAABA_LON);

        double deltaLon = lon2 - lon1;

        double y = Math.sin(deltaLon) * Math.cos(lat2);
        double x = Math.cos(lat1) * Math.sin(lat2) -
                Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

        double bearing = Math.toDegrees(Math.atan2(y, x));
        double azimuth = (bearing + 360.0) % 360.0;
        return azimuth;
    }

    /**
     * Mengonversi azimut (derajat) menjadi arah mata angin tekstual (8 arah).
     */
    public static String getDirectionName(double azimuth) {
        String[] directions = {"Utara", "Utara Timur", "Timur", "Selatan Timur",
                "Selatan", "Selatan Barat", "Barat", "Utara Barat"};
        int index = (int) Math.round(((azimuth % 360) / 45.0)) % 8;
        if (index < 0) index += 8;
        return directions[index];
    }

    public double getUserLatitude() {
        return userLatitude;
    }

    public double getUserLongitude() {
        return userLongitude;
    }
}

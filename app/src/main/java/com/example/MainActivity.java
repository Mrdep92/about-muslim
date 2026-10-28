package com.example.pixelforge;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Map;

public class MainActivity extends AppCompatActivity implements LocationListener {

    private static final int REQUEST_LOCATION_PERMISSION = 1001;

    private LocationManager locationManager;
    private TextView tvLocation;
    private TextView tvPrayerTimes;
    private double currentLat = -6.2088;
    private double currentLon = 106.8456;
    private int timeZoneOffset = 7;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        tvLocation = findViewById(R.id.tv_location);
        tvPrayerTimes = findViewById(R.id.tv_prayer_times);
        Button btnUpdateLocation = findViewById(R.id.btn_update_location);
        Button btnPrayerTimes = findViewById(R.id.btn_prayer_times);
        Button btnQiblaCompass = findViewById(R.id.btn_qibla_compass);

        locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);

        btnUpdateLocation.setOnClickListener(v -> requestLocationUpdate());
        btnPrayerTimes.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, PrayerTimesActivity.class);
            intent.putExtra("latitude", currentLat);
            intent.putExtra("longitude", currentLon);
            intent.putExtra("timeZone", timeZoneOffset);
            startActivity(intent);
        });
        btnQiblaCompass.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, QiblaCompassActivity.class);
            intent.putExtra("latitude", currentLat);
            intent.putExtra("longitude", currentLon);
            startActivity(intent);
        });

        checkLocationPermissionAndUpdate();
    }

    private void checkLocationPermissionAndUpdate() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED &&
                ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION)
                        != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_COARSE_LOCATION},
                    REQUEST_LOCATION_PERMISSION);
        } else {
            requestLocationUpdate();
        }
    }

    private void requestLocationUpdate() {
        try {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                    == PackageManager.PERMISSION_GRANTED ||
                    ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION)
                            == PackageManager.PERMISSION_GRANTED) {
                boolean gpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
                boolean networkEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);

                if (gpsEnabled) {
                    locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, this);
                    Location last = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                    if (last != null) onLocationChanged(last);
                } else if (networkEnabled) {
                    locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, this);
                    Location last = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                    if (last != null) onLocationChanged(last);
                } else {
                    tvLocation.setText("GPS/Jaringan tidak aktif. Menggunakan default Jakarta.");
                    loadPrayerTimes(currentLat, currentLon);
                }
            }
        } catch (SecurityException e) {
            Toast.makeText(this, "Izin lokasi tidak diberikan", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onLocationChanged(Location location) {
        currentLat = location.getLatitude();
        currentLon = location.getLongitude();

        timeZoneOffset = (int) Math.round(currentLon / 15.0);

        tvLocation.setText(String.format("Lokasi: %.4f, %.4f (TZ %+d)", currentLat, currentLon, timeZoneOffset));
        loadPrayerTimes(currentLat, currentLon);

        locationManager.removeUpdates(this);
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {}

    @Override
    public void onProviderEnabled(String provider) {}

    @Override
    public void onProviderDisabled(String provider) {}

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_LOCATION_PERMISSION) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                requestLocationUpdate();
            } else {
                Toast.makeText(this, "Izin lokasi ditolak", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void loadPrayerTimes(double lat, double lon) {
        PrayerTimeCalculator calc = new PrayerTimeCalculator(lat, lon, timeZoneOffset);
        Map<String, Double> times = calc.calculateTimes(LocalDate.now(ZoneId.of("UTC").plusHours(timeZoneOffset)));
        StringBuilder sb = new StringBuilder("Jadwal Sholat Hari Ini:\n");
        for (String name : calc.getPrayerNames()) {
            sb.append(name).append(": ").append(PrayerTimeCalculator.formatTime(times.get(name))).append("\n");
        }
        tvPrayerTimes.setText(sb.toString());
    }
}

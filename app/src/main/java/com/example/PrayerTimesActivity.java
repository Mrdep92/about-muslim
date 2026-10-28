package com.example.pixelforge;

import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Map;

public class PrayerTimesActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_prayer_times);

        double lat = getIntent().getDoubleExtra("latitude", -6.2088);
        double lon = getIntent().getDoubleExtra("longitude", 106.8456);
        int tz = getIntent().getIntExtra("timeZone", 7);

        TextView tvHeader = findViewById(R.id.tv_header);
        TextView tvTimes = findViewById(R.id.tv_times);

        tvHeader.setText(String.format("Jadwal Sholat (%.4f, %.4f)", lat, lon));

        PrayerTimeCalculator calc = new PrayerTimeCalculator(lat, lon, tz);
        LocalDate date = LocalDate.now(ZoneId.of("UTC").plusHours(tz));
        Map<String, Double> times = calc.calculateTimes(date);

        StringBuilder sb = new StringBuilder("Tanggal: ").append(date).append("\n\n");
        for (String name : calc.getPrayerNames()) {
            sb.append(name).append(": ").append(PrayerTimeCalculator.formatTime(times.get(name))).append("\n");
        }
        tvTimes.setText(sb.toString());
    }
}

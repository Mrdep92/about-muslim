package com.example.pixelforge;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class QiblaCompassActivity extends AppCompatActivity implements SensorEventListener {

    private SensorManager sensorManager;
    private Sensor rotationVectorSensor;
    private TextView tvAzimuth;
    private TextView tvQiblaDirection;
    private TextView tvLocationInfo;

    private double userLat = -6.2088;
    private double userLon = 106.8456;
    private float currentAzimuth = 0f;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qibla_compass);

        userLat = getIntent().getDoubleExtra("latitude", -6.2088);
        userLon = getIntent().getDoubleExtra("longitude", 106.8456);

        tvAzimuth = findViewById(R.id.tv_azimuth);
        tvQiblaDirection = findViewById(R.id.tv_qibla_direction);
        tvLocationInfo = findViewById(R.id.tv_location_info);

        tvLocationInfo.setText(String.format("Lokasi: %.4f, %.4f", userLat, userLon));

        QiblaCompass qibla = new QiblaCompass(userLat, userLon);
        double qiblaAzimuth = qibla.calculateQiblaAzimuth();
        tvQiblaDirection.setText("Arah Kiblat: " + QiblaCompass.getDirectionName(qiblaAzimuth) +
                " (" + String.format("%.1f", qiblaAzimuth) + "°)");

        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        rotationVectorSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (rotationVectorSensor != null) {
            sensorManager.registerListener(this, rotationVectorSensor, SensorManager.SENSOR_DELAY_UI);
        } else {
            tvAzimuth.setText("Sensor kompas tidak tersedia");
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        sensorManager.unregisterListener(this);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_ROTATION_VECTOR) {
            float[] rotationMatrix = new float[16];
            SensorManager.getRotationMatrixFromVector(rotationMatrix, event.values);
            float[] orientation = new float[3];
            SensorManager.getOrientation(rotationMatrix, orientation);

            // orientation[0] = azimuth (radian), 0 = Utara
            float azimuth = (float) Math.toDegrees(orientation[0]);
            azimuth = (azimuth + 360) % 360;
            currentAzimuth = azimuth;

            QiblaCompass qibla = new QiblaCompass(userLat, userLon);
            double qiblaAzimuth = qibla.calculateQiblaAzimuth();

            float selisih = (float) ((qiblaAzimuth - azimuth + 540) % 360 - 180);

            tvAzimuth.setText(String.format("Azimut perangkat: %.1f°\nSelisih ke kiblat: %+.1f°", azimuth, selisih));
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {}
}

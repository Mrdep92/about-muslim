/* -------------------------------------------------
   Aplikasi Islam - Core JavaScript
   Implements:
   - renderJadwal(data)
   - requestNotifikasi()
   - hitungKiblat(lat, lon)
   - simpanData(kunci, data)
   - bacaData(kunci)
   ------------------------------------------------- */

const JAKARTA = { name: 'Jakarta', lat: -6.2088, lon: 106.8456 };
const KOTA_LIST = [
  JAKARTA,
  { name: 'Bandung', lat: -6.9147, lon: 107.6098 },
  { name: 'Surabaya', lat: -7.2575, lon: 112.7521 },
];

const KAABA = { lat: 21.4225, lon: 39.8262 }; // degrees

/* ---------- Utility ---------- */
function deg2rad(d) { return (d * Math.PI) / 180; }
function rad2deg(r) { return (r * 180) / Math.PI; }
function normalizeAngle(a) { // 0..360
  a = a % 360;
  return a < 0 ? a + 360 : a;
}
function pad2(n) { return n < 10 ? '0' + n : n; }
function decimalToHM(dec) {
  const h = Math.floor(dec);
  const m = Math.round((dec - h) * 60);
  return pad2(h) + ':' + pad2(m);
}

/* ---------- Local Storage ---------- */
function simpanData(kunci, data) {
  try {
    localStorage.setItem(kunci, JSON.stringify(data));
  } catch (e) {
    console.error('Gagal menyimpan data ke localStorage', e);
  }
}
function bacaData(kunci) {
  try {
    const raw = localStorage.getItem(kunci);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Gagal membaca data dari localStorage', e);
    return null;
  }
}

/* ---------- Prayer Times (Astronomical) ---------- */
function getJulianDate(date) {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1; // Jan = 1
  const d = date.getUTCDate() + date.getUTCHours() / 24 + date.getUTCMinutes() / 1440;
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  return jd;
}

function getPrayerTimes(lat, lon, date, method = 'Indonesia') {
  // Method angles (Fajr/Isha) for Indonesia
  const methodAngles = {
    Indonesia: { fajr: 20, isha: 18 },
    // other methods could be added here
  };
  const angles = methodAngles[method] || methodAngles['Indonesia'];
  const timeZone = -date.getTimezoneOffset() / 60; // local offset in hours

  const jd = getJulianDate(date);
  const d = jd - 2451545.0;
  const g = normalizeAngle(357.529 + 0.98560028 * d);
  const q = normalizeAngle(280.459 + 0.98564736 * d);
  const L = normalizeAngle(q + 1.915 * Math.sin(deg2rad(g)) + 0.020 * Math.sin(deg2rad(2 * g)));
  const e = 23.439 - 0.00000036 * d;
  const RA = rad2deg(Math.atan2(Math.cos(deg2rad(e)) * Math.sin(deg2rad(L)), Math.cos(deg2rad(L)))) / 15;
  const D = rad2deg(Math.asin(Math.sin(deg2rad(e)) * Math.sin(deg2rad(L))));
  const EqT = q / 15 - RA; // hours

  const Dhuhr = 12 + timeZone - lon / 15 - EqT;

  function T(a) {
    const phi = deg2rad(lat);
    const delta = deg2rad(D);
    const term = (-Math.sin(deg2rad(a)) - Math.sin(phi) * Math.sin(delta)) / (Math.cos(phi) * Math.cos(delta));
    return rad2deg(Math.acos(term)) / 15; // hours
  }

  function A(asrFactor) {
    const phi = deg2rad(lat);
    const delta = deg2rad(D);
    const term = (Math.sin(Math.atan(1 / (asrFactor + Math.tan(Math.abs(phi - delta))))) - Math.sin(phi) * Math.sin(delta)) /
      (Math.cos(phi) * Math.cos(delta));
    return rad2deg(Math.acos(term)) / 15; // hours
  }

  const sunrise = Dhuhr - T(0.833);
  const sunset = Dhuhr + T(0.833);
  const fajr = Dhuhr - T(angles.fajr);
  const isha = Dhuhr + T(angles.isha);
  const asr = Dhuhr + A(1); // Shafi'i (default)
  const maghrib = sunset; // simple

  return {
    Fajr: decimalToHM(fajr),
    Sunrise: decimalToHM(sunrise),
    Dhuhr: decimalToHM(Dhuhr),
    Asr: decimalToHM(asr),
    Maghrib: decimalToHM(maghrib),
    Isha: decimalToHM(isha),
  };
}

/* ---------- Rendering ---------- */
function renderJadwal(data) {
  const container = document.getElementById('jadwal-container');
  if (!container) return;
  container.innerHTML = '';
  const cityEl = document.createElement('h3');
  cityEl.textContent = `Jadwal Sholat (${data.city})`;
  container.appendChild(cityEl);
  const table = document.createElement('table');
  Object.keys(data.times).forEach((key) => {
    const row = document.createElement('tr');
    const tdName = document.createElement('td');
    tdName.textContent = key;
    const tdTime = document.createElement('td');
    tdTime.textContent = data.times[key];
    row.appendChild(tdName);
    row.appendChild(tdTime);
    table.appendChild(row);
  });
  container.appendChild(table);
}

/* ---------- Doa & Surah (static placeholders) ---------- */
function loadDoa() {
  const doaList = [
    'Doa Sebelum Makan',
    'Doa Setelah Makan',
    'Doa Tidur',
    'Doa Bangun',
  ];
  const container = document.getElementById('doa-container');
  if (!container) return;
  container.innerHTML = '<h3>Doa Harian</h3>';
  const ul = document.createElement('ul');
  doaList.forEach((d) => {
    const li = document.createElement('li');
    li.textContent = d;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}
function loadSurah() {
  const surah = `سورة العصر
وَالْعَصْرِ
إِنَّ الإِنسَانَ لَفِي خُسْرٍ
...`; // TODO: add full short surah text
  const container = document.getElementById('surah-container');
  if (!container) return;
  container.innerHTML = '<h3>Surah Pendek (Juz 30)</h3>';
  const pre = document.createElement('pre');
  pre.textContent = surah;
  container.appendChild(pre);
}

/* ---------- Qibla Calculation ---------- */
function hitungKiblat(lat1, lon1) {
  const phi1 = deg2rad(lat1);
  const phi2 = deg2rad(KAABA.lat);
  const dLon = deg2rad(KAABA.lon - lon1);
  const y = Math.sin(dLon) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLon);
  const bearing = (rad2deg(Math.atan2(y, x)) + 360) % 360;
  return bearing; // degrees clockwise from true north
}

/* ---------- Compass & Qibla Display ---------- */
function startCompass(callback) {
  if (!window.DeviceOrientationEvent) {
    console.warn('DeviceOrientationEvent tidak tersedia.');
    return;
  }
  function handler(event) {
    const heading = event.alpha; // 0..360 magnetic north
    if (heading != null) {
      const compEl = document.getElementById('kompas-container');
      if (compEl) compEl.textContent = `Kompas: ${Math.round(heading)}°`;
      const kiblatDeg = hitungKiblat(currentLocation.lat, currentLocation.lon);
      const kiblatEl = document.getElementById('kiblat-info');
      if (kiblatEl) kiblatEl.textContent = `Arah kiblat: ${Math.round(kiblatDeg)}° (true north)`;
      if (typeof callback === 'function') callback(kiblatDeg);
    }
  }
  window.addEventListener('deviceorientation', handler, true);
}

/* ---------- Notification ---------- */
function requestNotifikasi() {
  const statusEl = document.getElementById('notif-status');
  if (!('Notification' in window)) {
    if (statusEl) statusEl.textContent = 'Browser tidak mendukung Notifikasi.';
    return;
  }
  Notification.requestPermission().then((perm) => {
    if (statusEl) statusEl.textContent = `Status Notifikasi: ${perm}`;
    if (perm === 'granted') scheduleNextPrayerNotification();
  });
}
function scheduleNextPrayerNotification() {
  const today = new Date();
  const times = getPrayerTimes(currentLocation.lat, currentLocation.lon, today);
  const now = today.getTime();
  const upcoming = Object.entries(times)
    .map(([name, hm]) => {
      const [h, m] = hm.split(':').map(Number);
      const dt = new Date(today);
      dt.setHours(h, m, 0, 0);
      return { name, time: dt.getTime() };
    })
    .filter((p) => p.time > now)
    .sort((a, b) => a.time - b.time)[0];
  if (!upcoming) return; // semua selesai
  const notifyAt = upcoming.time - 10 * 60 * 1000; // 10 menit sebelum
  const delay = Math.max(notifyAt - now, 0);
  setTimeout(() => {
    new Notification('Waktu Sholat', {
      body: `${upcoming.name} akan dimulai dalam 10 menit.`,
    });
  }, delay);
}

/* ---------- Application State ---------- */
let currentLocation = JAKARTA; // default

/* ---------- Initialization ---------- */
function initApp() {
  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  // Populate city selector (kota-display)
  const cityEl = document.getElementById('kota-display');
  if (cityEl) {
    const select = document.createElement('select');
    KOTA_LIST.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = c.name;
      select.appendChild(opt);
    });
    select.onchange = function () {
      const chosen = KOTA_LIST.find((c) => c.name === this.value);
      if (chosen) {
        currentLocation = chosen;
        loadAndRenderJadwal();
      }
    };
    cityEl.appendChild(select);
  }

  // Load static contents
  loadDoa();
  loadSurah();

  // Notification button
  const notifBtn = document.getElementById('notif-btn');
  if (notifBtn) {
    notifBtn.textContent = 'Izinkan Notifikasi Sholat';
    notifBtn.onclick = requestNotifikasi;
  }

  // Initial load
  loadAndRenderJadwal();

  // Start compass
  startCompass();
}

/* ---------- Load & Render Jadwal ---------- */
function loadAndRenderJadwal() {
  const cacheKey = `jadwal_${currentLocation.name}`;
  const cached = bacaData(cacheKey);
  if (cached) {
    renderJadwal(cached);
    return;
  }
  const today = new Date();
  const times = getPrayerTimes(currentLocation.lat, currentLocation.lon, today);
  const data = { city: currentLocation.name, times };
  simpanData(cacheKey, data);
  renderJadwal(data);
}

/* ---------- Start when DOM ready ---------- */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

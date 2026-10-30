// Fitur F2: Jadwal sholat
// Bahasa teks: id

const DEFAULT_CITY = { name: 'Jakarta', lat: -6.2088, lon: 106.8456, tz: 7 };
const CACHE_KEY = 'prayer_times_cache';

const PRAYER_METHODS = {
  mwl: { label: 'Muslim World League', fajr: 18, isha: 17 },
  isna: { label: 'ISNA', fajr: 15, isha: 15 },
  egyptian: { label: 'Egyptian', fajr: 19.5, isha: 17.5 },
  karachi: { label: 'Karachi', fajr: 18, isha: 18 },
  singapore: { label: 'Singapore', fajr: 20, isha: 18 },
  kemenag: { label: 'Kemenag RI (Fajr 20, Isha 18) — konfirmasi ke sumber resmi', fajr: 20, isha: 18 }
};

const DEFAULT_METHOD = 'kemenag';

function deg2rad(deg) { return deg * Math.PI / 180; }
function rad2deg(rad) { return rad * 180 / Math.PI; }
function norm360(a) { return ((a % 360) + 360) % 360; }
function fixHour(h) { return ((h % 24) + 24) % 24; }

function hhmm(decimalHours) {
  const h = Math.floor(fixHour(decimalHours));
  let m = Math.round((fixHour(decimalHours) - h) * 60);
  if (m === 60) { m = 0; return String((h + 1) % 24).padStart(2, '0') + ':00'; }
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}

function toJulian(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function getPrayerTimes(lat, lon, date, methodId = DEFAULT_METHOD) {
  if (lat === undefined || lat === null) lat = DEFAULT_CITY.lat;
  if (lon === undefined || lon === null) lon = DEFAULT_CITY.lon;
  if (!date) date = new Date();

  if (Math.abs(lat) > 48) {
    console.warn('Peringatan: |lat| > 48 derajat. Perhitungan sholat di lintang tinggi memerlukan penanganan khusus dan tidak ditebak di sini.');
  }

  const method = PRAYER_METHODS[methodId] || PRAYER_METHODS[DEFAULT_METHOD];
  const tz = DEFAULT_CITY.tz;

  const jd = toJulian(date);
  const d = jd - 2451545.0;
  const g = norm360(357.529 + 0.98560028 * d);
  const q = norm360(280.459 + 0.98564736 * d);
  const L = norm360(q + 1.915 * Math.sin(deg2rad(g)) + 0.020 * Math.sin(deg2rad(2 * g)));
  const e = 23.439 - 0.00000036 * d;
  const RA = rad2deg(Math.atan2(Math.cos(deg2rad(e)) * Math.sin(deg2rad(L)), Math.cos(deg2rad(L)))) / 15;
  const D = rad2deg(Math.asin(Math.sin(deg2rad(e)) * Math.sin(deg2rad(L))));
  const EqT = q / 15 - RA;

  const Dhuhr = 12 + tz - lon / 15 - EqT;

  function T(a) {
    const num = -Math.sin(deg2rad(a)) - Math.sin(deg2rad(lat)) * Math.sin(deg2rad(D));
    const den = Math.cos(deg2rad(lat)) * Math.cos(deg2rad(D));
    let val = num / den;
    val = Math.max(-1, Math.min(1, val));
    return (1 / 15) * rad2deg(Math.acos(val));
  }

  function acot(x) { return Math.atan(1 / x); }

  function A(t) {
    const inner = acot(t + Math.tan(deg2rad(Math.abs(lat - D))));
    const num = Math.sin(deg2rad(inner)) - Math.sin(deg2rad(lat)) * Math.sin(deg2rad(D));
    const den = Math.cos(deg2rad(lat)) * Math.cos(deg2rad(D));
    let val = num / den;
    val = Math.max(-1, Math.min(1, val));
    return (1 / 15) * rad2deg(Math.acos(val));
  }

  const Fajr = Dhuhr - T(method.fajr);
  const Sunrise = Dhuhr - T(0.833);
  const Asr = Dhuhr + A(1);
  const Sunset = Dhuhr + T(0.833);
  const Maghrib = Sunset;
  const Isha = Dhuhr + T(method.isha);

  return {
    date: date.toISOString().split('T')[0],
    city: DEFAULT_CITY.name,
    method: method.label,
    lat: lat,
    lon: lon,
    times: {
      Fajr: hhmm(Fajr),
      Sunrise: hhmm(Sunrise),
      Dhuhr: hhmm(Dhuhr),
      Asr: hhmm(Asr),
      Maghrib: hhmm(Maghrib),
      Isha: hhmm(Isha)
    },
    raw: { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha, Sunset }
  };
}

function cachePrayerTimes(times) {
  try {
    const payload = { times, cachedAt: new Date().toISOString() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    return true;
  } catch (e) {
    console.warn('Gagal menyimpan cache jadwal sholat:', e);
    return false;
  }
}

function loadCachedPrayerTimes() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Gagal memuat cache jadwal sholat:', e);
    return null;
  }
}

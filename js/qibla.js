const QIBLA_LAT = 21.4225;
const QIBLA_LON = 39.8262;

function toRad(deg) {
  return deg * Math.PI / 180;
}

function toDeg(rad) {
  return rad * 180 / Math.PI;
}

// Menghitung bearing ke Ka'bah (derajat searah jarum jam dari utara laut)
function getQiblaBearing(lat, lon) {
  const lat1 = toRad(lat);
  const lon1 = toRad(lon);
  const lat2 = toRad(QIBLA_LAT);
  const lon2 = toRad(QIBLA_LON);
  const dLon = lon2 - lon1;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  const bearing = Math.atan2(y, x);
  return ((toDeg(bearing) + 360) % 360);
}

// Nilai fallback input manual
let manualBearing = null;

// Simpan derajat manual (0-360)
function setManualBearing(deg) {
  const d = Number(deg);
  if (!isNaN(d)) {
    manualBearing = ((d % 360) + 360) % 360;
  }
  return manualBearing;
}

// Mulai kompas ponsel; callback(derajat) dipanggil setiap update.
// Jika sensor tidak tersedia, callback(null) agar UI pakai fallback manual.
function startCompass(callback) {
  if (typeof callback !== 'function') return;

  function onDeviceOrientation(e) {
    if (e.alpha !== null) {
      callback(e.alpha);
    }
  }

  if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permission => {
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', onDeviceOrientation);
          } else {
            callback(null);
          }
        })
        .catch(() => callback(null));
    } else {
      window.addEventListener('deviceorientation', onDeviceOrientation);
    }
  } else {
    callback(null);
  }
}

// Catatan kompas ponsel mengarah ke utara magnetik, bukan utara laut.
// Harap kalibrasi kompas ponsel; akurasi tergantung sensor.

if (typeof window !== 'undefined') {
  window.qibla = {
    getQiblaBearing: getQiblaBearing,
    startCompass: startCompass,
    setManualBearing: setManualBearing
  };
}

const JAKARTA_LAT = -6.2088;
const JAKARTA_LON = 106.8456;

function initApp() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(function () {});
  }

  document.title = 'Aplikasi Islam';

  var h1 = document.createElement('h1');
  h1.textContent = 'Aplikasi Islam';
  document.body.appendChild(h1);

  var pilar = ['Syahadat', 'Sholat', 'Zakat', 'Puasa', 'Haji'];
  var ul = document.createElement('ul');
  pilar.forEach(function (p) {
    var li = document.createElement('li');
    li.textContent = p;
    ul.appendChild(li);
  });
  document.body.appendChild(ul);

  var pWudhu = document.createElement('p');
  pWudhu.textContent = 'Cara wudhu: niat, cuci tangan, berkuluk, masukkan air ke hidung, cuci muka, cuci tangan hingga siku, sapu kepala, cuci kaki hingga mata kaki.';
  document.body.appendChild(pWudhu);

  var pSholat = document.createElement('p');
  pSholat.textContent = 'Cara sholat: berdiri, takbir, bacaan pembuka, ruku, sujud, duduk, tahiyat, salam.';
  document.body.appendChild(pSholat);

  var divTimes = document.createElement('div');
  divTimes.id = 'prayer-times';
  document.body.appendChild(divTimes);

  var divQibla = document.createElement('div');
  divQibla.id = 'qibla';
  document.body.appendChild(divQibla);

  var inputDeg = document.createElement('input');
  inputDeg.type = 'number';
  inputDeg.id = 'manual-bearing';
  inputDeg.placeholder = 'Masukkan derajat manual';
  document.body.appendChild(inputDeg);

  var btnDeg = document.createElement('button');
  btnDeg.textContent = 'Setel Derajat Kiblat';
  btnDeg.onclick = function () {
    var deg = parseInt(inputDeg.value, 10);
    if (!isNaN(deg)) {
      setManualBearing(deg);
      showQibla(deg);
    }
  };
  document.body.appendChild(btnDeg);

  var btnNotif = document.createElement('button');
  btnNotif.textContent = 'Izinkan Notifikasi Sholat';
  btnNotif.onclick = requestNotificationPermission;
  document.body.appendChild(btnNotif);

  loadPrayerTimes();
  loadQibla();
}

function loadPrayerTimes() {
  var today = new Date();
  var cached = loadCachedPrayerTimes();
  if (cached) {
    showPrayerTimes(cached);
    return;
  }
  var times = getPrayerTimes(JAKARTA_LAT, JAKARTA_LON, today);
  if (times) {
    cachePrayerTimes(times);
    showPrayerTimes(times);
  }
}

function loadQibla() {
  var bearing = getQiblaBearing(JAKARTA_LAT, JAKARTA_LON);
  showQibla(bearing);
  startCompass(showQibla);
}

function showPrayerTimes(times) {
  var container = document.getElementById('prayer-times');
  if (!container) return;
  container.innerHTML = '<h3>Jadwal Sholat (Jakarta)</h3>';
  for (var key in times) {
    if (times.hasOwnProperty(key)) {
      var div = document.createElement('div');
      div.textContent = key + ': ' + times[key];
      container.appendChild(div);
    }
  }
}

function showQibla(bearing) {
  var container = document.getElementById('qibla');
  if (!container) return;
  container.textContent = 'Arah kiblat: ' + bearing + '° derajat';
}

function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

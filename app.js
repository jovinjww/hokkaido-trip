// 載入行程
async function init() {
  const res = await fetch('data.json');
  const data = await res.json();

  const container = document.getElementById('days');

  data.days.forEach(day => {
    const el = document.createElement('div');
    el.className = 'card';

    el.innerHTML = `
      <div class="card-header">${day.title}</div>
      <div class="card-content">
        ${day.desc}<br>
        <a href="geo:0,0?q=${day.map}">📍導航</a>
      </div>
    `;

    container.appendChild(el);
  });
}

init();

// 卡片展開
document.addEventListener('click', e => {
  const h = e.target.closest('.card-header');
  if (!h) return;
  h.parentElement.classList.toggle('active');
});


// 🔔 通知功能
function enableNotify() {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      scheduleNotify();
      alert("已開啟提醒！");
    }
  });
}

// ⏰ 模擬集合提醒（實務可改時間）
function scheduleNotify() {
  setTimeout(() => {
    new Notification("集合提醒", {
      body: "07:30 準備集合！",
    });
  }, 5000); // demo用5秒
}


// 🌤️ 天氣（含快取）
async function loadWeather() {
  const el = document.getElementById('weather');
  const key = 'weather';

  try {
    const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=43&longitude=141&daily=temperature_2m_max,temperature_2m_min&forecast_days=4");
    const data = await res.json();

    const txt = data.daily.time.map((d,i)=>
      `${d}：${data.daily.temperature_2m_min[i]}°~${data.daily.temperature_2m_max[i]}°`
    ).join('<br>');

    localStorage.setItem(key, txt);
    el.innerHTML = txt;

  } catch {
    el.innerHTML = localStorage.getItem(key) || "天氣失敗";
  }
}

loadWeather();


// 📲 QR Code（用簡單API）
function generateQR() {
  const url = location.href;
  const qr = document.getElementById('qr');
  const img = new Image();
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  img.onload = () => {
    const ctx = qr.getContext('2d');
    ctx.drawImage(img, 0, 0);
  };
}

generateQR();


// PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}
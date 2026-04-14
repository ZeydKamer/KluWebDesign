/* 1. SAYFA YÜKLENİNCE */
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('klu_theme') === 'dark') {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('#themeToggleBtn i');
        if (icon) icon.classList.replace('fa-moon', 'fa-sun');
    }
    const savedColor = localStorage.getItem('klu_color_mode');
    if (savedColor && savedColor !== 'standart') {
        document.documentElement.classList.add(savedColor);
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('onclick').includes(savedColor)) btn.classList.add('active');
        });
    }
    const savedZoom = parseInt(localStorage.getItem('klu_zoom') || '0', 10);
    if (savedZoom > 0) {
        currentZoomLevel = savedZoom;
        document.body.classList.add('zoom-level-' + savedZoom);
        const zBtn = document.getElementById('zoomBtn');
        if (zBtn) { zBtn.classList.add('active'); zBtn.setAttribute('data-level', savedZoom); }
    }
    if (localStorage.getItem('klu_contrast') === 'on') document.body.classList.add('high-contrast');
    if (localStorage.getItem('klu_video') === 'paused') {
        const video = document.getElementById('heroVideo');
        const icon = document.getElementById('videoToggleIcon');
        const btn = document.getElementById('videoToggleBtn');
        if (video) { video.pause(); }
        if (icon) { icon.classList.replace('fa-pause', 'fa-play'); }
        if (btn) { btn.classList.add('paused'); btn.title = 'Videoyu Başlat'; }
    }
});

/* 2. SCROLL KONTROLÜ */
let scrollBekliyor = false;
window.addEventListener('scroll', () => {
    if (!scrollBekliyor) {
        window.requestAnimationFrame(() => {
            document.querySelector('.header-wrapper').classList.toggle('scrolled', window.scrollY > 50);
            document.getElementById('scrollTopBtn').classList.toggle('show', window.scrollY > 300);
            scrollBekliyor = false;
        });
        scrollBekliyor = true;
    }
}, { passive: true });

/* 3. ARAMA VE YUKARI ÇIK */
function toggleSearch() {
    const box = document.querySelector('.search-box');
    box.classList.toggle('active');
    if (box.classList.contains('active')) document.querySelector('.search-input').focus();
}

let scrollAnimasyonu;
function scrollToTop() {
    cancelAnimationFrame(scrollAnimasyonu);
    (function adim() {
        const pos = window.scrollY;
        if (pos > 0) { window.scrollTo(0, pos - Math.max(5, pos / 15)); scrollAnimasyonu = requestAnimationFrame(adim); }
    })();
}

/* 4. ERİŞİLEBİLİRLİK VE TEMA */
function toggleAccessibility() { document.getElementById('accessibilityPanel').classList.toggle('active'); }
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    localStorage.setItem('klu_contrast', document.body.classList.contains('high-contrast') ? 'on' : 'off');
}
function setColorMode(mode, btnElement) {
    document.documentElement.classList.remove('protanopia', 'tritanopia', 'monochromacy');
    if (mode !== 'standart') document.documentElement.classList.add(mode);
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
    localStorage.setItem('klu_color_mode', mode);
}

let currentZoomLevel = 0;
function cycleTextSize(btn) {
    currentZoomLevel = currentZoomLevel >= 3 ? 0 : currentZoomLevel + 1;
    document.body.classList.remove('zoom-level-1', 'zoom-level-2', 'zoom-level-3');
    if (currentZoomLevel > 0) { document.body.classList.add('zoom-level-' + currentZoomLevel); btn.classList.add('active'); }
    else { btn.classList.remove('active'); }
    btn.setAttribute('data-level', currentZoomLevel);
    localStorage.setItem('klu_zoom', currentZoomLevel);
}

function toggleTheme(event) {
    event.preventDefault();
    const icon = document.querySelector('#themeToggleBtn i');
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    icon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
    localStorage.setItem('klu_theme', isDark ? 'dark' : 'light');
}

/* 5. PRELOADER VE VİDEO KONTROLÜ */
window.addEventListener('load', () => setTimeout(() => document.getElementById('preloader').classList.add('fade-out'), 500));

function toggleVideo() {
    const video = document.getElementById('heroVideo'), icon = document.getElementById('videoToggleIcon'), btn = document.getElementById('videoToggleBtn');
    if (video.paused) { video.play(); icon.classList.replace('fa-play', 'fa-pause'); btn.classList.remove('paused'); btn.title = 'Videoyu Durdur'; localStorage.setItem('klu_video', 'playing'); }
    else { video.pause(); icon.classList.replace('fa-pause', 'fa-play'); btn.classList.add('paused'); btn.title = 'Videoyu Başlat'; localStorage.setItem('klu_video', 'paused'); }
}

/* 6. SLIDER VE GALERİ */
let currentStep = 0;
function moveSlider(direction) {
    const sliderContainer = document.getElementById('newsSlider');
    if (!sliderContainer) return;
    const stepWidth = sliderContainer.parentElement.offsetWidth + 30;
    if (direction === 'right') { currentStep++; if (currentStep > 1) currentStep = 0; }
    else if (direction === 'left') { currentStep--; if (currentStep < 0) currentStep = 1; }
    sliderContainer.style.transform = `translateX(-${currentStep * stepWidth}px)`;
}

/* 7. KAMPÜS/ARGE TAB GEÇİŞİ */
let currentSection = 'campus';
function switchToNextSection() {
    const campusPane = document.getElementById('tab-campus'), rndPane = document.getElementById('tab-rnd'), btn = document.getElementById('sectionNextBtn'), icon = document.getElementById('sectionNextIcon');
    if (currentSection === 'campus') { campusPane.classList.remove('active'); rndPane.classList.add('active'); currentSection = 'rnd'; icon.classList.replace('fa-arrow-right', 'fa-arrow-left'); btn.title = 'Kampüste Yaşama Dön'; }
    else { rndPane.classList.remove('active'); campusPane.classList.add('active'); currentSection = 'campus'; icon.classList.replace('fa-arrow-left', 'fa-arrow-right'); btn.title = 'Ar-Ge Projelerine Geç'; }
}

/* 8. ETKİNLİK TARİH KONTROLÜ VE POP-UP */
document.addEventListener('DOMContentLoaded', () => {
    const monthMap = { 'OCA':0, 'OCAK':0, 'ŞUB':1, 'ŞUBAT':1, 'MAR':2, 'MART':2, 'NİS':3, 'NİSAN':3, 'MAY':4, 'MAYIS':4, 'HAZ':5, 'HAZİRAN':5, 'TEM':6, 'TEMMUZ':6, 'AĞU':7, 'AĞUSTOS':7, 'EYL':8, 'EYLÜL':8, 'EKİ':9, 'EKİM':9, 'KAS':10, 'KASIM':10, 'ARA':11, 'ARALIK':11 };
    const today = new Date(); today.setHours(0, 0, 0, 0);
    document.querySelectorAll('.ea-column:first-child .ea-item').forEach(item => {
        const match = item.querySelector('.day-month').innerText.trim().match(/(\d{1,2})\s+([A-ZÇŞĞÜÖİa-zçşğüöı]+)/);
        if (match) {
            const monthIndex = monthMap[match[2].toUpperCase()];
            if (monthIndex !== undefined) {
                if (new Date(parseInt(item.querySelector('.ea-item-year span').innerText.trim()), monthIndex, parseInt(match[1])) < today) {
                    item.querySelector('.ea-date-box').classList.add('past-event-bg'); item.querySelector('.ea-date-box').classList.remove('upcoming-event-bg'); item.classList.add('past-event-item');
                } else {
                    item.querySelector('.ea-date-box').classList.add('upcoming-event-bg'); item.querySelector('.ea-date-box').classList.remove('past-event-bg'); item.classList.remove('past-event-item');
                }
            }
        }
    });
});

window.addEventListener('load', () => { setTimeout(() => { if (!sessionStorage.getItem('vize_mesaji_gosterildi')) { document.getElementById('welcomePopup').classList.add('show'); sessionStorage.setItem('vize_mesaji_gosterildi', 'true'); } }, 1500); });
function closePopup() { document.getElementById('welcomePopup').classList.remove('show'); }

/* 9. DÜNYA HARİTASI (ERASMUS) */
if (document.getElementById('globe-container')) {
    const width = 800, height = 800, globe = { type: "Sphere" }, projection = d3.geo.orthographic().scale(height / 2.1).translate([width / 2, height / 2]).precision(0.6);
    const c = d3.select("#globe-container").append("canvas").attr("width", width).attr("height", height).style("cursor", "grab").node().getContext("2d");
    const path = d3.geo.path().projection(projection).context(c);
    queue().defer(d3.json, "https://unpkg.com/world-atlas@1.1.4/world/110m.json").await((error, world) => {
        if (error) throw error;
        const land = topojson.feature(world, world.objects.land), countries = topojson.feature(world, world.objects.countries).features, borders = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);
        let i = -1, isFirstLoad = true;
        const cj = [
            {"id":"795","name":"TÜRKMENİSTAN","flag":"tm","student":"Arslan B.","msg":"Kırklareli Üniversitesi'nde eğitim almak vizyonumu geliştirdi. Kampüs yaşamı çok samimi."},
            {"id":"300","name":"YUNANİSTAN","flag":"gr","student":"Eleni K.","msg":"Kırklareli, Yunanistan'a çok yakın ve kültürel olarak kendimi evimde gibi hissediyorum."},
            {"id":"031","name":"AZERBAYCAN","flag":"az","student":"Cavidan M.","msg":"Tek millet iki devlet anlayışını kampüste her an hissediyoruz. Eğitim kalitesi çok yüksek."},
            {"id":"398","name":"KAZAKİSTAN","flag":"kz","student":"Aizhan N.","msg":"Erasmus ile geldim ve dönmek istemiyorum! Modern laboratuvarlar gerçekten etkileyici."},
            {"id":"008","name":"ARNAVUTLUK","flag":"al","student":"Erika Z.","msg":"Türkçeyi burada öğrendim. İnsanlar çok yardımsever ve sıcakkanlı."},
            {"id":"250","name":"FRANSA","flag":"fr","student":"Lucas D.","msg":"Uluslararası bir ortamda eğitim almak harika bir deneyim."}
        ];
        (function transition() {
            if (++i >= cj.length) i = 0;
            const ix = countries.findIndex(x => x.id == cj[i].id || x.id == parseInt(cj[i].id));
            if (ix === -1) { transition(); return; }
            d3.transition().duration(isFirstLoad ? 0 : 1250).delay(isFirstLoad ? 0 : 2000).each("start", () => { if (!isFirstLoad) document.getElementById('active-student-content').style.opacity = "0"; })
                .tween("rotate", () => {
                    const r = d3.interpolate(projection.rotate(), [-d3.geo.centroid(countries[ix])[0], -d3.geo.centroid(countries[ix])[1]]);
                    setTimeout(() => {
                        document.getElementById('active-student-flag').src = `https://flagcdn.com/w320/${cj[i].flag}.png`; document.getElementById('active-student-name').innerText = cj[i].student;
                        document.getElementById('active-student-country').innerText = cj[i].name; document.getElementById('active-student-text').innerText = `"${cj[i].msg}"`;
                        document.getElementById('active-student-content').style.opacity = "1";
                    }, isFirstLoad ? 0 : 1000);
                    return t => {
                        c.clearRect(0, 0, width, height); projection.rotate(r(t)).clipAngle(90);
                        const isDark = document.body.classList.contains('dark-mode');
                        c.fillStyle = isDark ? "#374151" : "#3b82f6"; c.beginPath(), path(globe), c.fill();
                        c.fillStyle = isDark ? "#111827" : "#ffffff"; c.beginPath(), path(land), c.fill();
                        c.fillStyle = isDark ? "#60a5fa" : "#182956"; c.beginPath(), path(countries[ix]), c.fill();
                        c.strokeStyle = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)"; c.lineWidth = 1, c.beginPath(), path(borders), c.stroke();
                        c.strokeStyle = "rgba(255, 255, 255, 0.1)", c.lineWidth = 1, c.beginPath(), path(globe), c.stroke();
                    };
                }).transition().each("end", () => { isFirstLoad = false; transition(); });
        })();
    });
}


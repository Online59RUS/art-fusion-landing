// script.js
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");

function openMenu() {
  if (!burger || !mobileMenu) return;
  mobileMenu.classList.add("is-open");
  burger.setAttribute("aria-expanded", "true");
  mobileMenu.setAttribute("aria-hidden", "false");
}

function closeMenu() {
  if (!burger || !mobileMenu) return;
  mobileMenu.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
}

function toggleMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.contains("is-open") ? closeMenu() : openMenu();
}

if (burger) {
  burger.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu();
  });
}

if (mobileMenu) {
  mobileMenu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    closeMenu(); // <-- ключевое: закрываем по клику на ссылку
  });
}

// (опционально) закрывать по клику вне меню
document.addEventListener("click", (e) => {
  if (!mobileMenu || !burger) return;
  const clickInsideMenu = mobileMenu.contains(e.target);
  const clickOnBurger = burger.contains(e.target);
  if (!clickInsideMenu && !clickOnBurger) closeMenu();
});

// (опционально) закрывать по Esc
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});



// Пока без бэкенда: просто покажем "заявка принята".
// На следующем шаге подключим отправку в Telegram/почту.
const leadForm = document.getElementById("leadForm");
const hint = document.getElementById("formHint");

if (leadForm) {
  leadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(leadForm);
    const name = (data.get("name") || "").toString().trim();

    if (hint) {
      hint.textContent = `Спасибо${name ? ", " + name : ""}! Заявка принята. Мы свяжемся с вами.`;
    }
    leadForm.reset();
  });
}

// Branches block
const BRANCHES = [
  {
    id: "landau",
    name: "Филиал - Академика Ландау",
    badge: "Основной",
    address: "ул. Академика Ландау, д.51, пом.183, Екатеринбург",
    phone: "+79221779204",
    hours: "Пн-Пт 10:00-20:00 - Сб 11:00-18:00 - Вс выходной",
    mapYandex: "https://yandex.ru/maps/-/CLxARN9A",
    map2gis: "https://go.2gis.com/Z7mpl"
  },
  {
    id: "repina",
    name: "Филиал - Репина",
    badge: "Кировский",
    address: "ул. Репина, д.79а, Екатеринбург",
    phone: "+79221779204",
    hours: "Пн-Пт 10:00-20:00 - Сб 11:00-18:00 - Вс выходной",
    mapYandex: "https://yandex.ru/maps/-/CLxAVMyN",
    map2gis: "https://go.2gis.com/kTeV5"
  },
  {
    id: "sovetskaya",
    name: "Филиал - Советская",
    badge: "Пионерский",
    address: "ул. Советская, д.60, Екатеринбург",
    phone: "+79221779204",
    hours: "Пн-Пт 10:00-20:00 - Сб 11:00-18:00 - Вс выходной",
    mapYandex: "https://yandex.ru/maps/-/CLxAZI4b",
    map2gis: "https://go.2gis.com/ca0A4"
  },
  {
    id: "bisertskaya",
    name: "Филиал - Бисертская",
    badge: "Чкаловский",
    address: "ул. Бисертская, д.128, Екатеринбург",
    phone: "+79221779204",
    hours: "Пн-Пт 10:00-20:00 - Сб 11:00-18:00 - Вс выходной",
    mapYandex: "https://yandex.ru/maps/-/CLxAZCiO",
    map2gis: "https://go.2gis.com/AD1Pn"
  }
];

function normalizePhoneForTel(phone){
  return String(phone || "").replace(/[^\d+]/g, "");
}

function renderBranchTabs(activeId){
  const tabs = document.getElementById("branchesTabs");
  if (!tabs) return;

  tabs.innerHTML = BRANCHES.map((b) => {
    const isActive = b.id === activeId;
    return `
      <button class="branch-tab ${isActive ? "is-active" : ""}" type="button" data-branch="${b.id}">
        <div class="branch-tab__title">${b.name}</div>
        <div class="branch-tab__meta">${b.address}</div>
      </button>
    `;
  }).join("");
}

function isValidLink(url){
  const u = String(url || "").trim();
  return u && u !== "#";
}

function renderBranchCard(activeId){
  const card = document.getElementById("branchCard");
  if (!card) return;

  const b = BRANCHES.find(x => x.id === activeId) || BRANCHES[0];
  const tel = normalizePhoneForTel(b.phone);

  const yandexOk = isValidLink(b.mapYandex);
  const gisOk = isValidLink(b.map2gis);

  card.innerHTML = `
    <div class="branch-card__top">
      <h3 class="branch-card__name">${b.name}</h3>
      <div class="branch-badge">${b.badge || "Филиал"}</div>
    </div>

    <p class="branch-card__addr">${b.address}</p>

    <div class="branch-row">
      <div class="branch-info">
        <div class="branch-info__label">График</div>
        <div class="branch-info__value">${b.hours}</div>
      </div>

      <div class="branch-info">
        <div class="branch-info__label">Телефон</div>
        <div class="branch-info__value"><a href="tel:${tel}">${b.phone}</a></div>
      </div>
    </div>

    <div class="branch-actions">
      <a class="btn btn--primary" href="#lead">Записаться</a>

      <a class="btn btn--ghost ${yandexOk ? "" : "is-disabled"}"
         href="${yandexOk ? b.mapYandex : "javascript:void(0)"}"
         ${yandexOk ? 'target="_blank" rel="noopener"' : 'aria-disabled="true" tabindex="-1"'}>
        Маршрут - Яндекс
      </a>

      <a class="btn btn--ghost ${gisOk ? "" : "is-disabled"}"
         href="${gisOk ? b.map2gis : "javascript:void(0)"}"
         ${gisOk ? 'target="_blank" rel="noopener"' : 'aria-disabled="true" tabindex="-1"'}>
        Маршрут - 2ГИС
      </a>
    </div>
  `;
}


function initBranches(){
  const tabs = document.getElementById("branchesTabs");
  const card = document.getElementById("branchCard");
  if (!tabs || !card) return;

  let activeId = BRANCHES[0]?.id || "landau";
  renderBranchTabs(activeId);
  renderBranchCard(activeId);

  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-branch]");
    if (!btn) return;
    activeId = btn.getAttribute("data-branch");
    renderBranchTabs(activeId);
    renderBranchCard(activeId);
  });
}

initBranches();

document.addEventListener('click', (e) => {
  const img = e.target.closest('.work-card__img');
  if (!img) return;

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt || '';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('.lightbox__img');
const closeBtn = lightbox.querySelector('.lightbox__close');
const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
const nextBtn = lightbox.querySelector('.lightbox__nav--next');

let gallery = [];
let currentIndex = -1;

// Свайп-параметры
let touchStartX = 0;
let touchStartY = 0;

function collectGallery(){
  // Собираем все изображения работ (важно: .work-card__img должны быть именно IMG)
  gallery = Array.from(document.querySelectorAll('.work-card__img'));
}

function openLightboxByIndex(index){
  if (!gallery.length) collectGallery();
  if (!gallery.length) return;

  // нормализуем индекс по кругу
  currentIndex = (index + gallery.length) % gallery.length;

  const src = gallery[currentIndex].getAttribute('data-full') || gallery[currentIndex].src;
  const alt = gallery[currentIndex].alt || '';

  lightboxImg.src = src;
  lightboxImg.alt = alt;

  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox(){
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
  currentIndex = -1;
}

function next(){
  if (currentIndex < 0) return;
  openLightboxByIndex(currentIndex + 1);
}

function prev(){
  if (currentIndex < 0) return;
  openLightboxByIndex(currentIndex - 1);
}

// ===== Works Lightbox + Swipe (единый рабочий вариант) =====
(() => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const imgEl = lightbox.querySelector(".lightbox__img");
  const closeBtn = lightbox.querySelector(".lightbox__close");
  const prevBtn = lightbox.querySelector(".lightbox__nav--prev");
  const nextBtn = lightbox.querySelector(".lightbox__nav--next");
  const backdrop = lightbox.querySelector(".lightbox__backdrop");

  let gallery = [];
  let index = 0;

  const collect = () => {
    gallery = Array.from(document.querySelectorAll(".work-card__img"));
  };

  const openByIndex = (i) => {
    if (!gallery.length) collect();
    if (!gallery.length) return;

    index = (i + gallery.length) % gallery.length;

    const src = gallery[index].getAttribute("data-full") || gallery[index].src;
    imgEl.src = src;
    imgEl.alt = gallery[index].alt || "Работа ребёнка";

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
  };

  const close = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
    imgEl.src = "";
  };

  const next = () => openByIndex(index + 1);
  const prev = () => openByIndex(index - 1);

  // Открытие по клику на картинку
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".work-card__img");
    if (!img) return;

    if (!gallery.length) collect();
    const i = gallery.indexOf(img);
    openByIndex(i >= 0 ? i : 0);
  });

  // Кнопки и закрытие
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  // Клавиши
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // SWIPE
  let startX = 0;
  let startY = 0;

  imgEl.addEventListener("touchstart", (e) => {
    const t = e.changedTouches[0];
    startX = t.clientX;
    startY = t.clientY;
  }, { passive: true });

  imgEl.addEventListener("touchend", (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    if (Math.abs(dy) > Math.abs(dx)) return;

    const threshold = 40;
    if (dx <= -threshold) next();
    if (dx >= threshold) prev();
  }, { passive: true });

  window.addEventListener("load", collect);
})();

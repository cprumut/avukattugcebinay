// DOM yüklendikten sonra çalışacak kodlar
document.addEventListener("DOMContentLoaded", function () {
  // Dil değiştirme işlevi
  const langSelector = document.querySelector(".language-selector");
  const langDropdown = document.querySelector(".lang-dropdown");
  const langItems = document.querySelectorAll(".lang-dropdown li");
  const currentLangText = document.querySelector(".current-lang span");
  const currentLangFlag = document.querySelector(".current-lang .flag-icon");

  // Kayıtlı dili oku (gizli sekmede localStorage hata verebilir)
  let currentLang = "tr";
  try {
    currentLang = localStorage.getItem("selectedLang") || "tr";
  } catch (e) {}

  // Dil değiştirme işlevi
  function changeLang(lang) {
    if (!translations[lang]) lang = "tr";

    // Dil dropdown'ında aktif dili işaretle
    langItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("data-lang") === lang) {
        item.classList.add("active");
        // Dil metnini güncelle
        currentLangText.textContent = item.textContent.trim();

        // Bayrak görselini güncelle
        const flagImg = item.querySelector(".flag-icon");
        if (flagImg) {
          currentLangFlag.src = flagImg.src;
          currentLangFlag.alt = flagImg.alt;
        }
      }
    });

    // Sayfa dilini ayarla
    document.documentElement.lang = lang;

    // Arapça ve Farsça için RTL desteği
    document.documentElement.dir = lang === "ar" || lang === "fa" ? "rtl" : "ltr";

    // Tüm çevirileri uygula
    document.querySelectorAll("[data-key]").forEach((el) => {
      const key = el.getAttribute("data-key");
      if (translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    // Dil seçimini localStorage'a kaydet
    try {
      localStorage.setItem("selectedLang", lang);
    } catch (e) {}

    // Metin uzunluğu değişince header yüksekliği de değişebilir
    updateHeaderHeight();
  }

  // Dil seçimi için event listener'lar
  langItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.stopPropagation(); // Tıklamanın üst öğelere yayılmasını engelle
      changeLang(this.getAttribute("data-lang"));

      // Dropdown'ı kapat
      langDropdown.classList.remove("show");
    });
  });

  // Dil seçim menüsünü tıklama ile açıp kapama
  if (langSelector) {
    langSelector
      .querySelector(".current-lang")
      .addEventListener("click", function (e) {
        e.stopPropagation(); // Belge tıklamasının dropdown'ı kapatmasını engelle
        langDropdown.classList.toggle("show");
      });
  }

  // Belgeye tıklayınca dropdown'ı kapat
  document.addEventListener("click", function () {
    langDropdown.classList.remove("show");
  });

  // Responsive menü işlevselliği
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }

  // Header yüksekliğini ölçüp CSS'e aktar (hero boşluğu ve mobil menü konumu için)
  const header = document.getElementById("header");

  function updateHeaderHeight() {
    document.documentElement.style.setProperty(
      "--header-height",
      header.offsetHeight + "px"
    );
  }

  window.addEventListener("resize", updateHeaderHeight);

  // Sayfayı ilk yüklediğimizde dil ayarını uygula
  changeLang(currentLang);

  // Sayfa içi linklerin yumuşak kaydırma (smooth scroll) efekti
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

        // Menu'yu kapat (eğer açıksa ve responsive modda isek)
        if (navMenu && navMenu.classList.contains("active")) {
          navMenu.classList.remove("active");
        }

        window.scrollTo({
          top: targetElement.offsetTop - header.offsetHeight,
          behavior: "smooth",
        });
      }
    });
  });

  // Aktif menü öğesini vurgulama
  const sections = document.querySelectorAll("section[id]");

  function highlightActiveMenuItem() {
    const scrollPosition = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - header.offsetHeight - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute("id");

      document
        .querySelector(`.nav-menu a[href="#${sectionId}"]`)
        ?.classList.toggle(
          "active",
          scrollPosition >= sectionTop && scrollPosition < sectionBottom
        );
    });
  }

  window.addEventListener("scroll", highlightActiveMenuItem);

  // Footer'da yılı otomatik güncelleme
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

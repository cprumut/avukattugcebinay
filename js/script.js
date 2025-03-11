// DOM yüklendikten sonra çalışacak kodlar
document.addEventListener("DOMContentLoaded", function () {
  // Dil değiştirme işlevi
  const langSelector = document.querySelector(".language-selector");
  const langItems = document.querySelectorAll(".lang-dropdown li");
  const currentLangText = document.querySelector(".current-lang span");
  const currentLangFlag = document.querySelector(".current-lang .flag-icon");

  // Sayfa yüklendiğinde tarayıcı dilini veya varsayılan dili algılama
  let currentLang = localStorage.getItem("selectedLang") || "tr";

  // Sayfayı ilk yüklediğimizde dil ayarını uygula
  changeLang(currentLang);

  // Dil değiştirme işlevi
  function changeLang(lang) {
    console.log("Dil değiştiriliyor:", lang); // Debug için

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
    if (lang === "ar" || lang === "fa") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }

    // Form alanlarındaki placeholder'ları güncelle
    document.querySelectorAll("[data-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-placeholder");
      if (translations[lang] && translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });

    // Tüm çevirileri uygula
    document.querySelectorAll("[data-key]").forEach((el) => {
      const key = el.getAttribute("data-key");
      if (translations[lang] && translations[lang][key]) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = translations[lang][key];
        } else {
          el.textContent = translations[lang][key];
        }
      }
    });

    // Dil seçimini localStorage'a kaydet
    localStorage.setItem("selectedLang", lang);
  }

  // Dil seçimi için event listener'lar
  langItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.stopPropagation(); // Tıklamanın üst öğelere yayılmasını engelle
      const lang = this.getAttribute("data-lang");
      changeLang(lang);

      // Dropdown'ı kapat
      document.querySelector(".lang-dropdown").classList.remove("show");
    });
  });

  // Dil seçim menüsünü tıklama ile açıp kapama
  if (langSelector) {
    langSelector
      .querySelector(".current-lang")
      .addEventListener("click", function (e) {
        e.stopPropagation(); // Belge tıklamasının dropdown'ı kapatmasını engelle
        document.querySelector(".lang-dropdown").classList.toggle("show");
      });
  }

  // Belgeye tıklayınca dropdown'ı kapat
  document.addEventListener("click", function () {
    document.querySelector(".lang-dropdown").classList.remove("show");
  });

  // Responsive menü işlevselliği
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }

  // Sayfada gezinirken header stilini değiştirme
  const header = document.getElementById("header");

  if (header) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 100) {
        header.style.background = "rgba(255, 255, 255, 0.98)";
        header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
      } else {
        header.style.background = "#fff";
        header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
      }
    });
  }

  // Sayfa içi linklerin yumuşak kaydırma (smooth scroll) efekti
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");

      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
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

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        document
          .querySelector(`.nav-menu a[href="#${sectionId}"]`)
          ?.classList.add("active");
      } else {
        document
          .querySelector(`.nav-menu a[href="#${sectionId}"]`)
          ?.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", highlightActiveMenuItem);

  // İletişim formunun işlevselliği
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Form verilerini alma
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
      };

      // Gerçek bir uygulamada, bu verileri bir API'ye gönderirsiniz
      console.log("Form verileri:", formData);

      // Kullanıcıya başarılı mesajı gösterme
      const currentLang = localStorage.getItem("selectedLang") || "tr";
      let successMessage =
        "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.";

      if (currentLang === "en") {
        successMessage =
          "Your message has been sent successfully. We will get back to you as soon as possible.";
      } else if (currentLang === "ar") {
        successMessage =
          "تم إرسال رسالتك بنجاح. سنعاود الاتصال بك في أقرب وقت ممكن.";
      } else if (currentLang === "fa") {
        successMessage =
          "پیام شما با موفقیت ارسال شد. در اسرع وقت با شما تماس خواهیم گرفت.";
      }

      alert(successMessage);
      contactForm.reset();
    });
  }

  // Footer'da yılı otomatik güncelleme
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Placeholder görsellerini gerçek görseller ile değiştirebilirsiniz
  const placeholderImages = document.querySelectorAll(".placeholder-image");

  placeholderImages.forEach((img) => {
    if (!img.src || img.src.includes("placeholder")) {
      img.innerHTML = '<span style="color: #999;">Görsel</span>';
    }
  });
});

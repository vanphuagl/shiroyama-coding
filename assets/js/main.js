"use strict";

// ===== init =====
const init = () => {
  // # app height
  appHeight();
  // # lazy load
  const ll = new LazyLoad({
    threshold: 0,
    elements_selector: ".lazy",
  });
};

const mobileMediaQuery = window.matchMedia('(max-width: 1023px)');

// ===== app height =====
const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty(
    "--app-height",
    `${document.documentElement.clientHeight}px`
  );
  const windowHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  if (window.innerWidth < 1024) {
    document.querySelector("[data-header-menu]").style.height =
      windowHeight + "px";
  }
};
window.addEventListener("resize", appHeight);

// ===== init header =====
const initHeader = () => {
  const scrollY = window.scrollY;
  const header = document.querySelector("[data-header]");
  const hSize =
    document.querySelector("[data-offset-top]").getBoundingClientRect().top +
    scrollY;

  if (!header.hasAttribute("data-header-black")) {
    if (scrollY > hSize) {
      header.classList.add("--black");
    } else {
      header.classList.remove("--black");
    }
  }
};

"pageshow scroll".split(" ").forEach((evt) => {
  window.addEventListener(evt, initHeader);
});

// ===== menu =====
const [overlay, menu] = [
  document.querySelector("[data-header-overlay]"),
  document.querySelector("[data-header-menu]"),
];

// Detect Overlay
const detectOverlay = function (detect) {
  if (detect) {
    overlay.classList.add("--visible");
    document.body.style.overflow = "hidden";
  } else {
    overlay.classList.remove("--visible");
    document.body.style.removeProperty("overflow");
  }
};

// Hander Overlay click
overlay.addEventListener("click", () => {
  detectOverlay(false);
  menu.classList.remove("--show");
});

// Handler menu button click
document.querySelectorAll("[data-header-toggler]").forEach((button) => {
  button.addEventListener("click", () => {
    if (menu.classList.contains("--show")) {
      menu.classList.remove("--show");
      detectOverlay(false);
    } else {
      menu.classList.add("--show");
      detectOverlay(true);
    }
  });
});

// Handle menu link and background clicks
document.querySelectorAll("[data-header-link]").forEach((element) => {
  element.addEventListener("click", () => {
    menu.classList.remove("--show");
    detectOverlay(false);
  });
});

// ===== href fadeout =====
document.addEventListener("click", function (e) {
  const link = e.target.closest(
    'a:not([href^="#"]):not([target]):not([href^="mailto"]):not([href^="tel"])'
  );
  if (!link) return;

  e.preventDefault();
  const url = link.getAttribute("href");

  if (url && url !== "") {
    const idx = url.indexOf("#");
    const hash = idx !== -1 ? url.substring(idx) : "";

    if (hash && hash !== "#") {
      try {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          return false;
        }
      } catch (err) {
        console.error("Invalid hash selector:", hash, err);
      }
    }

    document.body.classList.add("fadeout");
    setTimeout(function () {
      window.location = url;
    }, 500);
  }

  return false;
});

// ===== hide reservation =====
const [reservation, footer] = [
  document.querySelector("[data-reservation]"),
  document.querySelector("[data-footer]"),
];
"pageshow scroll".split(" ").forEach((evt) => {
  window.addEventListener(evt, () => {
    const footerInView = footer.offsetTop;
    if (window.scrollY + window.innerHeight >= footerInView) {
      reservation.classList.add("--hidden");
    } else {
      reservation.classList.remove("--hidden");
    }
  });
});

// ===== scroll fade content =====
const fadeInArray = document.querySelectorAll("[data-fadein]");
const fadeIn = () => {
  for (let i = 0; i < fadeInArray.length; i++) {
    let elem = fadeInArray[i];
    let distInView =
      elem.getBoundingClientRect().top - window.innerHeight + 100;
    if (distInView < 0) {
      elem.classList.add("--inview");
    }
  }
};
"pageshow scroll".split(" ").forEach((evt) => {
  window.addEventListener(evt, fadeIn);
});

// ===== accordion ======
if (document.querySelector("[data-accordion-btn]")) {
  const accordion = document.querySelectorAll("[data-accordion-btn]");
  const panelAccordion = document.querySelectorAll("[data-accordion-panel]");
  for (let i = 0; i < accordion.length; i++) {
    accordion[i].addEventListener("click", function () {
      this.classList.toggle("--active");
      if (panelAccordion[i].style.maxHeight) {
        panelAccordion[i].style.maxHeight = null;
      } else {
        panelAccordion[i].style.maxHeight =
          panelAccordion[i].scrollHeight + "px";
      }
    });
  }
}

// ===== handle tabs change =====
const initTabs = () => {
  const tabs = document.querySelectorAll('[data-tabs-items]');
  const contents = document.querySelectorAll('[data-tabs-content]');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // remove all class items/content
      tabs.forEach(t => t.classList.remove('--active'));
      contents.forEach(c => c.classList.remove('--active'));

      // add class item/click show/content
      tab.classList.add('--active');
      contents[index].classList.add('--active');
    });
  });
}
initTabs();

// ===== swiper components =====
const swiperComponents = new Swiper("[data-swiper-components]", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  speed: 600,
  breakpoints: {
    0: {
      slidesPerView: 1.167,
      spaceBetween: 15,
      draggable: true,
    },
    1024: {
      slidesPerView: 1.45,
      spaceBetween: 30,
      draggable: false,
    },
  },
});

// ## init custom cursor
const initCustomCursor = () => {
  const cursorPrev = document.querySelector('.cursor-prev');
  const cursorNext = document.querySelector('.cursor-next');
  const swiper = document.querySelector('[data-swiper-components]');

  if (!cursorPrev || !cursorNext || !swiper) return;

  document.addEventListener('mousemove', (e) => {
    cursorPrev.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    cursorNext.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

    const target = e.target;
    if (target.closest('.swiper-button-next')) {
      cursorNext.classList.add('--active');
      cursorPrev.classList.remove('--active');
    } else if (target.closest('.swiper-button-prev')) {
      cursorPrev.classList.add('--active');
      cursorNext.classList.remove('--active');
    } else {
      cursorPrev.classList.remove('--active');
      cursorNext.classList.remove('--active');
    }
  });

  // Ẩn cursor khi chuột rời swiper
  swiper.addEventListener('mouseleave', () => {
    cursorPrev.classList.remove('--active');
    cursorNext.classList.remove('--active');
  });
}
initCustomCursor();

// ====== news page ======
if (document.querySelector("[data-news-category]")) {
  const categoryBtn = document.querySelector("[data-news-btn]");
  const categoryPanel = document.querySelector("[data-news-group]");
  categoryBtn.addEventListener("click", function () {
    console.log("hello");
    this.classList.toggle("--active");
    if (categoryPanel.style.maxHeight) {
      categoryPanel.style.maxHeight = null;
    } else {
      categoryPanel.style.maxHeight = categoryPanel.scrollHeight + "px";
    }
  });
}

// ====== education/daily swiper ======
let swiperBasic = null;
const initSwiperBasic = () => {
  if (mobileMediaQuery.matches && !swiperBasic) {
    swiperBasic = new Swiper("[data-basic-swiper]", {
      breakpoints: {
        0: {
          slidesPerView: 1.164,
          spaceBetween: 20,
          allowTouchMove: true,
          draggable: true,
        },
        1024: {
          slidesPerView: 1,
          draggable: false,
          allowTouchMove: false,
        },
      },
    });
  } else if (!mobileMediaQuery.matches && swiperBasic) {
    swiperBasic.destroy(true, true);
    swiperBasic = null;
  }
};
initSwiperBasic();
mobileMediaQuery.addEventListener('change', initSwiperBasic);

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("pageshow", () => {
  document.body.classList.remove("fadeout");
});
window.addEventListener("DOMContentLoaded", init);

"use strict";

// ===== init =====
const homepage = () => {
  // # init loading
  initLoading();
};

// ===== init loading =====
const preventScroll = (e) => e.preventDefault();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initLoading = async () => {
  if (sessionStorage.getItem("opening-displayed") === "true") {
    document.querySelector("[data-loading]").remove();
    swiperFv.autoplay.start();
  } else {
    // # Block scroll events
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("scroll", preventScroll, { passive: false });
    window.addEventListener(
      "keydown",
      (e) => {
        if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    // # step 1 -- fadein logo
    await delay(300);
    document.querySelector("[data-loading-logo]").classList.add("--show");

    // # step 2 -- fadeout background
    await delay(1500);
    document.querySelector("[data-loading]").classList.add("--done");

    // # Unblock scroll events
    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);
    window.removeEventListener("scroll", preventScroll);
    window.removeEventListener("keydown", preventScroll);

    // # play swiper fv
    swiperFv.autoplay.start();

    // # set sessionStorage
    sessionStorage.setItem("opening-displayed", !0);
  }
};

// ===== fv =====
const swiperFv = new Swiper("[data-fv-swiper]", {
  effect: "fade",
  speed: 2000,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  on: {
    init: function () {
      this.autoplay.stop();
    },
  },
});

// ===== philosophy =====
const swiperPhy = new Swiper("[data-phy-swiper]", {
  effect: "fade",
  speed: 2000,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      allowTouchMove: true,
      draggable: true,
    },
    1024: {
      draggable: false,
      allowTouchMove: false,
    },
  },
});

// ===== feature =====
const swiperFeature = new Swiper("[data-feature-swiper]", {
  breakpoints: {
    0: {
      slidesPerView: 1.167,
      spaceBetween: 14,
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

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("DOMContentLoaded", homepage);

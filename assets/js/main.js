console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(2)
const addClassByHover = (mainClass, innerWrapperClass, delay = 300) => {
  const elements = document.querySelectorAll(mainClass);
  let activeTimeoutId = null; // Глобальный таймер
  let lastHoveredElement = null; // Последний элемент, на который был наведен курсор

  elements.forEach((element) => {
    const containerDetails = element.querySelector(innerWrapperClass);

    element.addEventListener("mouseenter", () => {
      // Если таймер активен, очищаем его
      if (activeTimeoutId) {
        clearTimeout(activeTimeoutId);
        activeTimeoutId = null;
      }

      // Если курсор перешел с другого элемента, сворачиваем старый
      if (lastHoveredElement && lastHoveredElement !== element) {
        const previousDetails =
          lastHoveredElement.querySelector(innerWrapperClass);
        if (previousDetails) {
          previousDetails.classList.remove("active");
        }
        $(".dropdown-toggle").dropdown("hide");
        lastHoveredElement.classList.remove("active");
      }

      // Устанавливаем текущий элемент как последний наведенный
      lastHoveredElement = element;

      // Раскрываем текущий элемент
      if (containerDetails) {
        containerDetails.classList.add("active");
      }
      element.classList.add("active");
    });

    element.addEventListener("mouseleave", () => {
      // Устанавливаем таймер на удаление класса и сворачивание
      activeTimeoutId = setTimeout(() => {
        if (containerDetails) {
          containerDetails.classList.remove("active");
        }
        $(".dropdown-toggle").dropdown("hide");
        element.classList.remove("active");

        // Сбрасываем только если таймер завершился
        if (lastHoveredElement === element) {
          lastHoveredElement = null;
        }
      }, delay);
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");

  const onClickOutside = (elements, callback) => {
    document.addEventListener("click", (e) => {
      if (![...elements].some((element) => element.contains(e.target))) {
        callback();
      }
    });
  };

  addClassByHover(".header__menu-item", ".header__submenu", 150);

  const swiper = new Swiper(".js-swiper", {
    slidesPerView: "auto",
    spaceBetween: 19,
    navigation: {
      nextEl: ".common-slider__btn--next",
      prevEl: ".common-slider__btn--prev",
    },
  });

  const swiperProjects = new Swiper(".js-projects-swiper", {
    slidesPerView: 3,
    spaceBetween: 12,
    navigation: {
      nextEl: ".projects-block__btn--next",
      prevEl: ".projects-block__btn--prev",
    },
    breakpoints: {
      200: {
        slidesPerView: "auto",
        freeMode: true,
      },
      // when window width is >= 992
      992: {
        slidesPerView: 3,
      },
    },
  });

  const swiperNews = new Swiper(".js-news-swiper", {
    slidesPerView: 4,
    spaceBetween: 12,
    breakpoints: {
      200: {
        slidesPerView: 1,
        spaceBetween: 12,
        autoHeight: true,
      },
      // when window width is >= 568
      568: {
        slidesPerView: 2,
      },
      // when window width is >= 992
      992: {
        slidesPerView: 3,
      },
      // when window width is >= 1200
      1200: {
        slidesPerView: 4,
      },
    },
  });

  const swiperThumbs = new Swiper(".js-product-thumbs", {
    slidesPerView: "auto",
    spaceBetween: 12,
    // freeMode: true,
    watchSlidesProgress: true,
  });

  const swiperProduct = new Swiper(".js-product-slider", {
    slidesPerView: 1,
    spaceBetween: 30,
    thumbs: {
      swiper: swiperThumbs,
    },
  });

  const bootstrapMenuDropdowns = document.querySelectorAll(".dropdown-menu");

  bootstrapMenuDropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  const swiperImportant = new Swiper(".js-important-swiper", {
    slidesPerView: 4,
    spaceBetween: 12,
    navigation: {
      nextEl: ".important-block__btn--right",
      prevEl: ".important-block__btn--left",
    },
    breakpoints: {
      200: {
        slidesPerView: 1,
        spaceBetween: 12,
        autoHeight: true,
      },
      // when window width is >= 568
      500: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      992: {
        slidesPerView: 4,
      },
    },
  });

  const swiperCategories = new Swiper(".js-slider-categories", {
    slidesPerView: "auto",
    spaceBetween: 8,
    freeMode: true,
  });

  const choicesSelect = document.querySelector(".js-choice");

  if (choicesSelect) {
    const choices = new Choices(".js-choice", {
      searchEnabled: false,
      itemSelectText: false,
    });
  }

  function initHeaderToggle() {
    const burgerBtn = document.querySelector(".header__burger-btn");
    const closeBtn = document.querySelector(".header__close-btn");
    const mobileWrapper = document.querySelector(".header__mobile-wrapper");

    if (burgerBtn && closeBtn && mobileWrapper) {
      burgerBtn.addEventListener("click", () => {
        mobileWrapper.classList.add("active");
      });

      closeBtn.addEventListener("click", () => {
        mobileWrapper.classList.remove("active");
      });
    }

    onClickOutside([mobileWrapper, burgerBtn], () => {
      mobileWrapper.classList.remove("active");
    });
  }

  initHeaderToggle();

  const customDropdowns = document.querySelectorAll(".js-r-dropcustom");

  customDropdowns.forEach((dropdown) => {
    const targetId = dropdown.dataset.rTarget;
    const target = document.querySelector(`#${targetId}`);

    dropdown.addEventListener("click", () => {
      target.classList.toggle("active");
    });

    onClickOutside([target, dropdown], () => {
      target.classList.remove("active");
    });
  });

  const homeActivation = () => {
    const blocks = document.querySelectorAll(".home-block");
    const images = document.querySelectorAll(".home__view-image");
    const wrapper = document.querySelector(".home__grid");

    const resetAll = () => {
      blocks.forEach((block) => block.classList.remove("active"));
      images.forEach((image) => image.classList.remove("active"));
    };

    const checkAndRemoveWrapperClass = () => {
      const hasActiveBlocks = Array.from(blocks).some((block) =>
        block.classList.contains("active")
      );
      if (!hasActiveBlocks) {
        wrapper.classList.remove("active");
      }
    };

    blocks.forEach((block, id) => {
      onClickOutside([block], () => {
        block.classList.remove("active");
        images[id].classList.remove("active");
        checkAndRemoveWrapperClass();
      });

      block.addEventListener("click", () => {
        resetAll();
        block.classList.add("active");
        images[id].classList.add("active");
        wrapper.classList.add("active");
      });
    });
  };

  homeActivation();

  const mobileMenu = () => {
    const items = document.querySelectorAll(".header__menu-item");
    const submenus = document.querySelectorAll(".header__submenu");

    const clearAll = () => {
      items.forEach((item) => item.classList.remove("mobile-active"));
      submenus.forEach((submenu) => submenu.classList.remove("mobile-active"));
    };

    items.forEach((item, idx) => {
      item.addEventListener("click", () => {
        clearAll();
        item.classList.add("mobile-active");
        submenus[idx].classList.add("mobile-active");
      });
    });
  };

  mobileMenu();
});
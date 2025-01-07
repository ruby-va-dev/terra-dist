console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(2)
const addClassByHover = (
  mainClass,
  innerWrapperClass,
  delay = 300,
  callbackOnClose
) => {
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
        callbackOnClose();
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
        callbackOnClose();
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
  let activeTooltip = null; // Variable for storing the current active tooltip

  function toggleTooltip(element) {
    const targetId = element.getAttribute("data-r-tooltip-target"); // Get target ID
    const tooltip = document.getElementById(targetId); // Find the corresponding tooltip

    if (!tooltip) return; // Do nothing if no tooltip is found

    const rect = element.getBoundingClientRect();

    console.log(rect);

    // If the tooltip is already active, hide it
    if (tooltip === activeTooltip) {
      hideTooltip();
      return;
    }

    // Hide the current active tooltip if it exists
    if (activeTooltip) {
      hideTooltip();
    }

    // Position and display the new tooltip
    positionTooltip(tooltip, rect);

    tooltip.classList.add("active");
    activeTooltip = tooltip; // Update the reference to the current active tooltip

    // Use the onClickOutside helper to handle clicks outside the tooltip
    onClickOutside2([tooltip, element], () => {
      hideTooltip();
    });
  }

  function hideTooltip() {
    if (activeTooltip) {
      activeTooltip.classList.remove("active");
      activeTooltip = null; // Reset the reference to the active tooltip
    }
  }

  // Helper function to position the tooltip
  function positionTooltip(tooltip, rect) {
    tooltip.style.right = `${document.body.clientWidth - rect.right}px`;
    tooltip.style.top = `${rect.bottom}px`;
  }

  const onClickOutside = (elements, callback) => {
    document.addEventListener("click", (e) => {
      if (![...elements].some((element) => element.contains(e.target))) {
        callback();
      }
    });
  };

  const onClickOutside2 = (elements, callback) => {
    const handler = (e) => {
      if (![...elements].some((element) => element.contains(e.target))) {
        callback();
        document.removeEventListener("mousedown", handler); // Убираем обработчик после срабатывания
      }
    };

    document.addEventListener("mousedown", handler);
  };

  // Add click event handlers to tooltip activators
  document.querySelectorAll(".js-tooltip-activator").forEach((activator) => {
    activator.addEventListener("click", (e) => {
      e.stopPropagation(); // Stop event bubbling
      toggleTooltip(e.target);
    });
  });

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // Add resize event listener to reposition the active tooltip
  window.addEventListener(
    "resize",
    debounce(() => {
      if (activeTooltip) {
        const activator = document.querySelector(
          `[data-r-tooltip-target="${activeTooltip.id}"]`
        );
        if (activator) {
          const rect = activator.getBoundingClientRect();
          positionTooltip(activeTooltip, rect);
        }
      }
    }, 200)
  );

  addClassByHover(".header__menu-item", ".header__submenu", 200, () => {
    hideTooltip();
  });

  const swiper = new Swiper(".js-swiper", {
    slidesPerView: "auto",
    spaceBetween: 6,
    navigation: {
      nextEl: ".common-slider__btn--next",
      prevEl: ".common-slider__btn--prev",
    },
  });

  const swiperHero = new Swiper(".js-hero-swiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    breakpoints: {
      200: {
        spaceBetween: 0,
      },
      // when window width is >= 993
      992: {
        spaceBetween: 10,
      },
    },
  });

  const swiperProjects = new Swiper(".js-projects-swiper", {
    slidesPerView: 3,
    spaceBetween: 12,
    autoHeight: true,
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

  const activateProductSliderBadgesVisibilityChange = () => {
    const productSliderContainer = document.querySelector(".r-product-slider");

    if (!productSliderContainer) return;
    const infoBlock = productSliderContainer.querySelector(
      ".single-product__info"
    );
    const badge = productSliderContainer.querySelector(
      ".single-product__badge"
    );

    const hideElements = () => {
      if (badge) {
        badge.classList.remove("active");
      }
      if (infoBlock) {
        infoBlock.classList.remove("active");
      }
    };

    const showElements = () => {
      if (badge) {
        badge.classList.add("active");
      }
      if (infoBlock) {
        infoBlock.classList.add("active");
      }
    };

    const swiperProduct = new Swiper(".js-product-slider", {
      slidesPerView: 1,
      spaceBetween: 30,
      thumbs: {
        swiper: swiperThumbs,
      },
      on: {
        init: (swiper) => {
          const activeSlide = swiper.slides[swiper.activeIndex];

          if (activeSlide.classList.contains(".r-video-slide")) {
            hideElements();
          } else {
            showElements();
          }
        },
        slideChange: (swiper) => {
          const activeSlide = swiper.slides[swiper.activeIndex];
          console.log(activeSlide);

          if (activeSlide.classList.contains("r-video-slide")) {
            hideElements();
          } else {
            showElements();
          }
        },
      },
    });
  };

  activateProductSliderBadgesVisibilityChange();

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

  const choicesSelects = document.querySelectorAll(".js-choice");

  choicesSelects.forEach((select) => {
    const choices = new Choices(select, {
      searchEnabled: false,
      itemSelectText: false,
    });
  });

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

  const showModal = (selector) => {
    const btns = document.querySelectorAll(selector);

    btns.forEach((btn) => {
      console.log(btn.dataset.rModal);
      const modal = document.querySelector(btn.dataset.rModal);

      const closeBtn = modal.querySelector(".js-close");

      closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
      });

      btn.addEventListener("click", () => {
        modal.classList.add("active");
      });
    });
  };

  showModal(".js-modal-activator");

  function enableSwipe(
    elementSelector,
    { direction = "up", threshold = 50, onSwipe } = {}
  ) {
    const element = document.querySelector(elementSelector);
    if (!element) {
      return;
    }

    let startY = 0;
    let endY = 0;
    let isTouchMoved = false; // Добавлено для отслеживания движения

    element.addEventListener("touchstart", (event) => {
      startY = event.touches[0].clientY;
      endY = startY; // Сбрасываем endY
      isTouchMoved = false; // Сбрасываем флаг
    });

    element.addEventListener("touchmove", (event) => {
      endY = event.touches[0].clientY;
      isTouchMoved = true; // Устанавливаем флаг, если было движение
    });

    element.addEventListener("touchend", () => {
      if (!isTouchMoved) {
        console.log("Клик без движения — свайп не выполняется.");
        return; // Если не было движения, ничего не делаем
      }

      const swipeDistance = startY - endY;

      if (direction === "up" && swipeDistance > threshold) {
        onSwipe?.(element); // Вызываем callback при свайпе вверх
      } else if (direction === "down" && swipeDistance < -threshold) {
        onSwipe?.(element); // Вызываем callback при свайпе вниз
      }
    });
  }

  enableSwipe(".js-swipe-block", {
    direction: "up",
    threshold: 50,
    onSwipe: (element) => {
      element.classList.add("swiped-up");
      console.log(`Swiped up on`, element);
    },
  });

  enableSwipe(".js-swipe-block", {
    direction: "down",
    threshold: 50,
    onSwipe: (element) => {
      element.classList.remove("swiped-up");
      console.log(`Swiped down on`, element);
    },
  });

  const searchingClearEnable = () => {
    const searchInputs = document.querySelectorAll(".js-r-search");

    searchInputs.forEach((search) => {
      const input = search.querySelector("input");
      const clearBtn = search.querySelector(".r-search__clear");

      const checkInput = () => {
        if (input.value.length > 2) {
          clearBtn.classList.add("active");
        } else {
          clearBtn.classList.remove("active");
        }
      };

      checkInput();

      input.addEventListener("input", () => {
        checkInput();
      });

      clearBtn.addEventListener("click", () => {
        input.value = "";
        checkInput();
      });
    });
  };

  searchingClearEnable();

  const mobileMenuOpenSearch = () => {
    const searchBtn = document.querySelector(".js-header-search-mobile");
    const searchInput = document.querySelector(".js-header-search-input");
    const searchInputField = searchInput.querySelector("input");
    const closeBtn = searchInput.querySelector(".r-search__clear");
    const dropdownSearch = document.querySelector(".r-search-dropdown");

    searchBtn.addEventListener("click", () => {
      searchInput.classList.add("active");
      searchInputField.focus();
    });

    closeBtn.addEventListener("click", () => {
      searchInput.classList.remove("active");
      closeBtn.classList.remove("active");
      dropdownSearch.classList.remove("active");
    });

    onClickOutside([searchInput, searchBtn, dropdownSearch], () => {
      searchInput.classList.remove("active");
      dropdownSearch.classList.remove("active");
    });
  };

  mobileMenuOpenSearch();

  function toggleElementOnScroll(tracked, target, offset = 0) {
    const targetElement = document.getElementById(target);
    const trackedElement = document.getElementById(tracked);

    if (!targetElement || !trackedElement) return;

    const checkView = () => {
      const rect = trackedElement.getBoundingClientRect();
      const isOutOfView = rect.bottom + offset <= 0;

      if (isOutOfView) {
        targetElement.classList.add("active");
      } else {
        targetElement.classList.remove("active");
      }
    };

    checkView();
    const onScroll = () => {
      checkView();
    };

    window.addEventListener("scroll", debounce(onScroll, 100));
  }

  toggleElementOnScroll("trackedElement", "targetElement", 0);

  Fancybox.bind("[data-fancybox]", {
    backFocus: false,
    touch: false,
  });

  const buildRutubeIframes = () => {
    const iframes = document.querySelectorAll("[data-r-load-iframe]");

    iframes.forEach((iframe) => {
      const src = iframe.dataset.rLoadIframe;
      console.log(src);

      const iframeElement = iframe.querySelector("iframe");
      const preview = iframe.querySelector("img");

      const previewSrc = src.match(/[a-f0-9]{32}/);
      preview.src = `https://rutube.ru/api/video/${previewSrc}/thumbnail/?redirect=1`;

      iframe.addEventListener("click", () => {
        iframeElement.src = `${src}?autoplay=1`;

        iframeElement.onload = () => {
          iframeElement.contentWindow.postMessage(
            JSON.stringify({ type: "player:play" }),
            "*"
          );
        };
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
            } else {
              iframeElement.contentWindow.postMessage(
                JSON.stringify({ type: "player:pause" }),
                "*"
              );
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(iframeElement);
    });
  };

  buildRutubeIframes();

  // const thumbsSlides = document.querySelectorAll(".r-product-thumbs__slide");

  // thumbsSlides.forEach((slide) => {
  //   const videoThumb = slide.querySelector("img[src*='rutube']");

  //   if (videoThumb) {
  //     // Получаем ID RuTube видео
  //     const iframeSrc = videoThumb.src.match(/[a-f0-9]{32}/)[0];

  //     // Настраиваем Fancybox
  //     const link = slide.querySelector("a");
  //     link.dataset.fancybox = "gallery"; // Группировка в галерею
  //     link.href = `https://rutube.ru/play/embed/${iframeSrc}/?autoplay=1`;
  //     link.setAttribute("data-type", "iframe"); // Указание на iframe
  //   }
  // });
});
(function () {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');

  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  root.setAttribute('data-theme', theme);

  function updateThemeIcon() {
    if (!toggle) return;

    toggle.innerHTML = theme === 'dark'
      ? `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42
          M18.36 18.36l1.42 1.42M1 12h2M21 12h2
          M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
        </svg>
      `
      : `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3
          7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;

    toggle.setAttribute(
      'aria-label',
      theme === 'dark'
        ? 'Ativar modo claro'
        : 'Ativar modo escuro'
    );
  }

  if (toggle) {
    updateThemeIcon();

    toggle.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      updateThemeIcon();
    });
  }

  const tabs = document.querySelectorAll('.catalog-tab');
  const pages = document.querySelectorAll('.catalog-page');
  const cards = document.querySelectorAll('.product-card');

  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const resultsCount = document.getElementById('resultsCount');
  const emptyState = document.getElementById('emptyState');

  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');

  const contactButton = document.getElementById('contactWhatsappButton');
  const inputNome = document.getElementById('nome');
  const inputWhats = document.getElementById('whats');
  const inputMsg = document.getElementById('msg');

  let currentTab = 'roupas';

  function switchTab(tabName) {
    currentTab = tabName;

    tabs.forEach(function (tab) {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    pages.forEach(function (page) {
      page.classList.toggle('active', page.id === tabName);
    });

    if (categoryFilter) {
      categoryFilter.value = 'all';
    }

    applyFilters();
  }

  function normalizeText(text) {
    return text
      .toLocaleLowerCase('pt-BR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function applyFilters() {
    if (!searchInput || !categoryFilter) return;

    const searchValue = normalizeText(searchInput.value.trim());
    const categoryValue = categoryFilter.value;
    let visibleCount = 0;

    cards.forEach(function (card) {
      const cardPage = card.dataset.page || '';
      const cardCategory = card.dataset.category || '';
      const cardName = card.dataset.name || '';
      const cardDescription =
        card.querySelector('.product-desc')?.textContent || '';

      const searchableText = normalizeText(
        `${cardName} ${cardCategory} ${cardDescription}`
      );

      const matchesTab = cardPage === currentTab;
      const matchesCategory =
        categoryValue === 'all' || cardCategory === categoryValue;
      const matchesSearch =
        searchValue === '' || searchableText.includes(searchValue);

      const shouldShow =
        matchesTab && matchesCategory && matchesSearch;

      card.style.display = shouldShow ? '' : 'none';

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    if (resultsCount) {
      resultsCount.textContent =
        visibleCount === 1
          ? '1 produto encontrado.'
          : `${visibleCount} produtos encontrados.`;
    }

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  function scrollToFirstVisibleProduct() {
    const activePage = document.querySelector('.catalog-page.active');

    if (!activePage) return;

    const firstVisible = Array.from(
      activePage.querySelectorAll('.product-card')
    ).find(function (card) {
      return card.style.display !== 'none';
    });

    if (!firstVisible) return;

    firstVisible.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    firstVisible.classList.add('product-highlight');

    setTimeout(function () {
      firstVisible.classList.remove('product-highlight');
    }, 1200);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      switchTab(tab.dataset.tab);
    });
  });

  document.querySelectorAll('[data-tab-link]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();

      const targetTab = link.dataset.tabLink;
      const targetCategory = link.dataset.categoryTarget;

      if (targetTab) {
        switchTab(targetTab);
      }

      if (targetCategory && categoryFilter) {
        categoryFilter.value = targetCategory;
      }

      if (searchInput) {
        searchInput.value = '';
      }

      applyFilters();

      setTimeout(function () {
        scrollToFirstVisibleProduct();
      }, 100);
    });
  });

  function closeSearchPanel() {
    if (!searchPanel || !searchToggle) return;

    searchPanel.classList.remove('open');
    searchToggle.setAttribute('aria-expanded', 'false');
  }

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', function (event) {
      event.stopPropagation();

      const isOpen = searchPanel.classList.toggle('open');

      searchToggle.setAttribute(
        'aria-expanded',
        isOpen ? 'true' : 'false'
      );

      if (isOpen) {
        setTimeout(function () {
          searchInput?.focus();
        }, 50);
      }
    });

    searchPanel.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  document.addEventListener('click', function () {
    closeSearchPanel();
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);

    searchInput.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter') return;

      event.preventDefault();
      applyFilters();
      scrollToFirstVisibleProduct();
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', function () {
      applyFilters();
      scrollToFirstVisibleProduct();
    });
  }

  if (contactButton) {
    contactButton.addEventListener('click', function () {
      const nome = inputNome?.value.trim() || 'Cliente';
      const whats = inputWhats?.value.trim() || 'não informado';
      const msg =
        inputMsg?.value.trim() ||
        'Gostaria de mais informações sobre as peças.';

      const text = `Olá! Meu nome é ${nome}.
WhatsApp: ${whats}.
Mensagem: ${msg}`;

      const url =
        `https://wa.me/5561986474665?text=${encodeURIComponent(text)}`;

      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  /* =========================================
     GALERIA DE FOTOS DOS PRODUTOS
     ========================================= */
  document.querySelectorAll('.product-gallery').forEach(function (gallery) {
    const mainImage = gallery.querySelector('.product-main-image');
    const previousButton = gallery.querySelector('.gallery-prev');
    const nextButton = gallery.querySelector('.gallery-next');
    const dots = gallery.querySelectorAll('.gallery-dot');
    const galleryImages = gallery.dataset.galleryImages;

    if (!mainImage || !galleryImages) return;

    const images = galleryImages
      .split(',')
      .map(function (image) {
        return image.trim();
      })
      .filter(Boolean);

    if (images.length === 0) return;

    let currentImage = 0;
    let touchStartX = 0;

    function updateGallery(index) {
      currentImage = (index + images.length) % images.length;

      mainImage.src = images[currentImage];

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === currentImage);
      });
    }

    previousButton?.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      updateGallery(currentImage - 1);
    });

    nextButton?.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      updateGallery(currentImage + 1);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        updateGallery(dotIndex);
      });
    });

    gallery.addEventListener(
      'touchstart',
      function (event) {
        touchStartX = event.changedTouches[0].screenX;
      },
      { passive: true }
    );

    gallery.addEventListener(
      'touchend',
      function (event) {
        const touchEndX = event.changedTouches[0].screenX;
        const distance = touchEndX - touchStartX;

        if (Math.abs(distance) < 40) return;

        updateGallery(
          distance > 0
            ? currentImage - 1
            : currentImage + 1
        );
      },
      { passive: true }
    );
  });

  applyFilters();

  /* =========================================
     SCROLL REVEAL + BOTÃO VOLTAR AO TOPO
     ========================================= */
  const revealSections = document.querySelectorAll(
    'section:not(#produtos), .stats-bar, footer'
  );

  revealSections.forEach(function (section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealSections.forEach(function (section) {
    revealObserver.observe(section);
  });

  const backToTop = document.createElement('button');

  backToTop.innerHTML = '↑';
  backToTop.setAttribute('aria-label', 'Voltar ao topo');

  backToTop.style.cssText = `
    position: fixed;
    right: 20px;
    bottom: 84px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--color-text);
    color: var(--color-text-inverse);
    border: 2px solid #d3af37;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 1000;
    box-shadow: var(--shadow-md);
  `;

  backToTop.addEventListener('mouseenter', function () {
    backToTop.style.transform = 'translateY(-3px)';
  });

  backToTop.addEventListener('mouseleave', function () {
    backToTop.style.transform = 'translateY(0)';
  });

  backToTop.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  document.body.appendChild(backToTop);

  window.addEventListener('scroll', function () {
    const shouldShowButton = window.scrollY > 400;

    backToTop.style.opacity = shouldShowButton ? '1' : '0';
    backToTop.style.pointerEvents = shouldShowButton ? 'auto' : 'none';
  });
})();

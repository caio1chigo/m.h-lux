(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  function updateThemeIcon() {
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  if (toggle) {
    updateThemeIcon();
    toggle.addEventListener('click', () => {
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

  let currentTab = 'roupas';

  function switchTab(tabName) {
    currentTab = tabName;

    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    pages.forEach(page => {
      page.classList.toggle('active', page.id === tabName);
    });

    applyFilters();
  }

  function applyFilters() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const categoryValue = categoryFilter.value;
    let visibleCount = 0;

    cards.forEach(card => {
      const cardPage = card.dataset.page;
      const cardCategory = card.dataset.category;
      const cardName = card.dataset.name.toLowerCase();

      const matchesTab = cardPage === currentTab;
      const matchesCategory = categoryValue === 'all' || cardCategory === categoryValue;
      const matchesSearch = cardName.includes(searchValue);

      const shouldShow = matchesTab && matchesCategory && matchesSearch;
      card.style.display = shouldShow ? '' : 'none';

      if (shouldShow) visibleCount++;
    });

    resultsCount.textContent = visibleCount === 1
      ? '1 produto encontrado.'
      : `${visibleCount} produtos encontrados.`;

    emptyState.hidden = visibleCount !== 0;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);

  applyFilters();

  const contactButton = document.getElementById('contactWhatsappButton');
  const inputNome = document.getElementById('nome');
  const inputWhats = document.getElementById('whats');
  const inputMsg = document.getElementById('msg');

  if (contactButton) {
    contactButton.addEventListener('click', () => {
      const nome = inputNome.value.trim();
      const whats = inputWhats.value.trim();
      const msg = inputMsg.value.trim();

      const text = `Olá! Meu nome é ${nome || 'Cliente'}.
WhatsApp: ${whats || 'não informado'}.
Mensagem: ${msg || 'Gostaria de mais informações sobre as peças.'}`;

      const url = `https://wa.me/5561986474665?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
  }
})();
(function () {
  "use strict";

  /* ============ CONFIGURAÇÃO ============ */
  const WHATSAPP = "5561986474665";
  const ASSET = "src/";

  /* >>> BEGIN CORE (lógica pura de dados e filtros, sem DOM) <<< */
  const CATEGORIES = { moletons: "Moletons", camisas: "Camisas", bermudas: "Bermudas", bones: "Bonés", oculos: "Óculos" };

  /* Para usar produtos reais do cliente, edite somente esta lista. */
  const PRODUCTS = [
    { id: "vans-off-wall", name: "Moletom Vans Off The Wall", category: "moletons", price: 289.90, desc: "Moletom clássico com modelagem confortável e acabamento premium.", images: ["moletom.jpg", "moletom-2.jpg", "moletom-3.jpg"], sizes: ["P", "M", "G", "GG"], colors: [{ name: "Off-white", hex: "#e4e0d8" }, { name: "Preto", hex: "#191919" }], featured: true, badge: "Novo" },
    { id: "jordan-air", name: "Moletom Jordan Air", category: "moletons", price: 289.90, desc: "Peça versátil para compor um visual urbano e confortável.", images: ["moletom-2.jpg", "moletom.jpg"], sizes: ["P", "M", "G", "GG"], colors: [{ name: "Areia", hex: "#bdb2a0" }, { name: "Preto", hex: "#171717" }], featured: true },
    { id: "nike-air-preto", name: "Moletom Nike Air Preto", category: "moletons", price: 289.90, desc: "Moletom preto de corte clássico para o dia a dia.", images: ["moletom-3.jpg", "moletom.jpg"], sizes: ["P", "M", "G", "GG"], colors: [{ name: "Preto", hex: "#151515" }], featured: true },
    { id: "camisa-yankees", name: "Camisa New York Yankees", category: "camisas", price: 189.90, desc: "Camiseta branca com visual esportivo e caimento confortável.", images: ["camisa-1.jpg"], sizes: ["P", "M", "G", "GG"], colors: [{ name: "Branco", hex: "#f0ede5" }], featured: true, badge: "Destaque" },
    { id: "camisa-yankees-off", name: "Camisa Yankees Off-White", category: "camisas", price: 189.90, desc: "Camiseta off-white para combinações versáteis.", images: ["camisa-2.jpg"], sizes: ["P", "M", "G", "GG"], colors: [{ name: "Off-white", hex: "#dfd8cb" }], featured: false },
    { id: "camisa-corinthians", name: "Camisa Corinthians", category: "camisas", price: 199.90, desc: "Camisa esportiva com modelagem leve e visual marcante.", images: ["camisa-3.jpg"], sizes: ["P", "M", "G", "GG"], colors: [{ name: "Branco", hex: "#f2f0e9" }], featured: true },
    { id: "camisa-palm", name: "Camisa Palm Angels", category: "camisas", price: 219.90, desc: "Peça oversized com presença para looks urbanos.", images: ["camisa-4.jpg"], sizes: ["P", "M", "G", "GG"], colors: [{ name: "Areia", hex: "#cbb6a4" }], featured: false },
    { id: "camisa-nike-verde", name: "Camisa Nike Verde", category: "camisas", price: 189.90, desc: "Camiseta verde com caimento casual e tecido leve.", images: ["camisa-5.jpg"], sizes: ["P", "M", "G", "GG"], colors: [{ name: "Verde", hex: "#536451" }], featured: false },
    { id: "camisa-selecao", name: "Camisa Seleção Brasileira", category: "camisas", price: 229.90, desc: "Camisa da seleção com acabamento esportivo.", images: ["camisa-6.webp"], sizes: ["P", "M", "G", "GG"], colors: [{ name: "Amarelo", hex: "#d6d137" }], featured: false, badge: "Últimas" },
    { id: "bermuda-north", name: "Bermuda North Face", category: "bermudas", price: 169.90, desc: "Bermuda de corte leve para conforto e mobilidade.", images: ["bermuda-2.jpg"], sizes: ["P", "M", "G", "GG"], colors: [{ name: "Preto", hex: "#202020" }], featured: false },
    { id: "bermuda-nike-verde", name: "Bermuda Nike Verde", category: "bermudas", price: 179.90, desc: "Bermuda verde com ajuste confortável para o cotidiano.", images: ["bermuda.jpg"], sizes: ["P", "M", "G", "GG"], colors: [{ name: "Verde", hex: "#4a5541" }], featured: true },
    { id: "bermuda-nike-age", name: "Bermuda Nike Age", category: "bermudas", price: 179.90, desc: "Bermuda preta com detalhe gráfico e presença urbana.", images: ["bermuda-3.jpg"], sizes: ["P", "M", "G", "GG"], colors: [{ name: "Preto", hex: "#191919" }], featured: false },
    { id: "bone-yankees", name: "Boné New York Yankees", category: "bones", price: 119.90, desc: "Boné com ajuste confortável e acabamento premium.", images: ["bone.jpg"], sizes: ["Único"], colors: [{ name: "Vermelho", hex: "#b4272f" }, { name: "Verde", hex: "#3d493a" }, { name: "Bege", hex: "#c6aa88" }], featured: true },
    { id: "oculos-urban", name: "Óculos Urban Gold", category: "oculos", price: 169.90, desc: "Óculos de lente espelhada e design marcante.", images: ["oculos.jpg"], sizes: ["Único"], colors: [{ name: "Gold", hex: "#be8b2b" }, { name: "Preto", hex: "#1a1a1a" }], featured: false }
  ];

  const norm = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  PRODUCTS.forEach((p) => {
    p._name = norm(p.name);
    p._search = norm([p.name, CATEGORIES[p.category], p.category, p.desc, p.colors.map((c) => c.name).join(" ")].join(" "));
  });

  const state = { query: "", category: "all", size: "all", sort: "featured", favorites: [] };

  function termsOf(q) { return norm(q).split(/\s+/).filter(Boolean); }
  function termHit(text, t) {
    if (text.includes(t)) return true;
    const stem = t.length > 3 ? t.replace(/(es|s)$/, "") : t;
    return stem !== t && text.includes(stem);
  }
  function matchesQuery(p, terms) { return terms.every((t) => termHit(p._search, t)); }
  function score(p, terms) { return terms.reduce((s, t) => s + (termHit(p._name, t) ? 3 : 0) + (termHit(p._search, t) ? 1 : 0), 0); }
  function baseMatch(p) {
    const terms = termsOf(state.query);
    if (terms.length && !matchesQuery(p, terms)) return false;
    if (state.size !== "all" && !p.sizes.includes(state.size)) return false;
    return true;
  }
  function getResults() {
    const terms = termsOf(state.query);
    const list = PRODUCTS.filter((p) => baseMatch(p) && (state.category === "all" || p.category === state.category));
    if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    else list.sort((a, b) => score(b, terms) - score(a, terms) || Number(b.featured) - Number(a.featured));
    return list;
  }
  function getSuggestions(q) {
    const terms = termsOf(q);
    if (!terms.length) return [];
    return PRODUCTS.filter((p) => matchesQuery(p, terms)).sort((a, b) => score(b, terms) - score(a, terms));
  }
  function categoryCounts() {
    const counts = { all: 0 };
    Object.keys(CATEGORIES).forEach((k) => (counts[k] = 0));
    PRODUCTS.forEach((p) => { if (baseMatch(p)) { counts.all += 1; counts[p.category] += 1; } });
    return counts;
  }
  /* >>> END CORE <<< */

  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const asset = (f) => ASSET + f;
  const wa = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  try { state.favorites = JSON.parse(localStorage.getItem("mh-lux-favorites") || "[]").filter((id) => byId(id)); } catch (e) { state.favorites = []; }

  /* ---------- Templates ---------- */
  const heartSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z"/></svg>';

  function variantsHtml(p) {
    return `<span class="variant-label">Tamanho</span><div class="sizes">${p.sizes.map((s, i) => `<button type="button" class="size-btn${i === 0 ? " selected" : ""}" data-value="${esc(s)}">${esc(s)}</button>`).join("")}</div>` +
      `<span class="variant-label">Cor</span><div class="colors">${p.colors.map((c, i) => `<button type="button" class="color-btn${i === 0 ? " selected" : ""}" data-value="${esc(c.name)}" style="background:${c.hex}" aria-label="Cor ${esc(c.name)}" title="${esc(c.name)}"></button>`).join("")}</div>`;
  }

  function cardHtml(p, withQuick) {
    const fav = state.favorites.includes(p.id);
    return `<article class="product-card" data-id="${p.id}"><div class="product-image" data-quick="${p.id}"><img src="${asset(p.images[0])}" alt="${esc(p.name)}" loading="lazy">${p.badge ? `<span class="product-badge">${esc(p.badge)}</span>` : ""}<button class="favorite-btn${fav ? " active" : ""}" type="button" data-favorite="${p.id}" aria-label="Favoritar ${esc(p.name)}" aria-pressed="${fav}">${heartSvg}</button></div><div class="product-info"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><strong class="product-price">${money(p.price)}</strong>${variantsHtml(p)}<div class="card-actions"><a class="product-whatsapp" href="#" data-order="${p.id}">Pedir no WhatsApp</a>${withQuick ? `<button class="quick-btn" type="button" data-quick="${p.id}" aria-label="Visualizar ${esc(p.name)}">+</button>` : ""}</div></div></article>`;
  }

  /* ---------- Renderizações ---------- */
  function renderCategoryCards() {
    $("#category-grid").innerHTML = Object.entries(CATEGORIES).map(([key, label]) => {
      const p = PRODUCTS.find((x) => x.category === key);
      return p ? `<button class="category-card" type="button" data-category-card="${key}"><img src="${asset(p.images[0])}" alt="Categoria ${label}" loading="lazy"><div><h3>${label}</h3><span>Ver peças →</span></div></button>` : "";
    }).join("");
  }

  function renderFeatured() {
    $("#featured-grid").innerHTML = PRODUCTS.filter((p) => p.featured).slice(0, 8).map((p) => cardHtml(p, false)).join("");
  }

  function renderCatalog() {
    const list = getResults();
    const counts = categoryCounts();
    const grid = $("#products-grid");

    grid.innerHTML = list.map((p) => cardHtml(p, true)).join("");
    grid.hidden = list.length === 0;
    $("#results-count").textContent = list.length === 1 ? "1 peça encontrada." : `${list.length} peças encontradas.`;

    $("#category-pills").innerHTML = [["all", "Tudo"], ...Object.entries(CATEGORIES)].map(([key, label]) =>
      `<button type="button" data-category-go="${key}" class="${state.category === key ? "active" : counts[key] === 0 ? "dim" : ""}">${label}<span class="n">${counts[key]}</span></button>`).join("");

    const chips = [];
    if (state.query.trim()) chips.push(`<button type="button" data-clear="query">Busca: “${esc(state.query.trim())}” ×</button>`);
    if (state.category !== "all") chips.push(`<button type="button" data-clear="category">${CATEGORIES[state.category]} ×</button>`);
    if (state.size !== "all") chips.push(`<button type="button" data-clear="size">Tamanho ${esc(state.size)} ×</button>`);
    $("#active-filters").innerHTML = chips.join("");

    const empty = $("#empty-state");
    empty.hidden = list.length !== 0;
    if (!list.length) {
      empty.innerHTML = `<h3>Nenhuma peça encontrada.</h3><p>${state.query.trim() ? `Não achamos resultados para “${esc(state.query.trim())}”.` : "Nenhuma peça combina com esses filtros."} Tente outro termo ou veja as categorias:</p><div class="chips">${Object.entries(CATEGORIES).map(([k, l]) => `<button class="chip" type="button" data-category-card="${k}">${l}</button>`).join("")}</div><button class="btn btn-dark" id="clear-filters" type="button">Limpar filtros</button>`;
    }

    const search = $("#catalog-search"); if (search.value !== state.query) search.value = state.query;
    $("#size-filter").value = state.size;
    $("#sort-filter").value = state.sort;
  }

  function renderSuggestions() {
    const box = $("#search-results");
    const q = $("#search-input").value;
    if (!q.trim()) {
      box.innerHTML = `<p class="search-label">Buscas populares</p><div class="chips">${["Moletom", "Camisa", "Bermuda", "Boné", "Óculos", "Preto", "Verde"].map((t) => `<button type="button" class="chip" data-term="${t}">${t}</button>`).join("")}</div>`;
      return;
    }
    const found = getSuggestions(q);
    if (!found.length) {
      box.innerHTML = `<p class="search-none">Nenhuma peça encontrada para “${esc(q.trim())}”.</p><p class="search-label">Tente buscar por</p><div class="chips">${Object.values(CATEGORIES).map((t) => `<button type="button" class="chip" data-term="${t}">${t}</button>`).join("")}</div>`;
      return;
    }
    box.innerHTML = `<p class="search-label">${found.length === 1 ? "1 resultado" : found.length + " resultados"}</p>` +
      found.slice(0, 5).map((p) => `<button type="button" class="suggestion" data-suggestion="${p.id}"><img src="${asset(p.images[0])}" alt=""><span><strong>${esc(p.name)}</strong><small>${CATEGORIES[p.category]}</small></span><b>${money(p.price)}</b></button>`).join("") +
      `<button type="button" class="see-all" id="see-all">Ver ${found.length === 1 ? "o resultado" : "todos os " + found.length + " resultados"} no catálogo →</button>`;
  }

  function renderFavorites() {
    const list = PRODUCTS.filter((p) => state.favorites.includes(p.id));
    $("#favorites-count").textContent = list.length;
    $("#favorites-list").innerHTML = list.length
      ? list.map((p) => `<div class="favorite-item"><img src="${asset(p.images[0])}" alt="${esc(p.name)}"><div><strong>${esc(p.name)}</strong><small>${money(p.price)}</small></div><button type="button" data-favorite="${p.id}" aria-label="Remover ${esc(p.name)}">×</button></div>`).join("")
      : '<p class="drawer-empty">Você ainda não favoritou nenhuma peça. Toque no coração de uma peça para salvar aqui.</p>';
    $("#send-favorites").disabled = !list.length;
  }

  function syncFavoriteButtons() {
    $$("[data-favorite]").forEach((b) => {
      if (!b.classList.contains("favorite-btn")) return;
      const on = state.favorites.includes(b.dataset.favorite);
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
  }

  /* ---------- Ações ---------- */
  function toggleFavorite(id) {
    state.favorites = state.favorites.includes(id) ? state.favorites.filter((x) => x !== id) : [...state.favorites, id];
    try { localStorage.setItem("mh-lux-favorites", JSON.stringify(state.favorites)); } catch (e) { /* ignore */ }
    syncFavoriteButtons();
    renderFavorites();
  }

  function pick(group, attr) { const el = $(attr, group); return el ? el.dataset.value : "Não informado"; }

  function orderLink(p, scope) {
    return wa(`Olá! Tenho interesse na peça:\n\n*${p.name}*\nPreço: ${money(p.price)}\nTamanho: ${pick(scope, ".size-btn.selected")}\nCor: ${pick(scope, ".color-btn.selected")}\n\nGostaria de saber a disponibilidade.`);
  }

  function openQuick(id) {
    const p = byId(id); if (!p) return;
    const thumbs = p.images.length > 1 ? `<div class="quick-thumbs">${p.images.map((im, i) => `<button type="button" data-thumb="${asset(im)}" class="${i ? "" : "active"}" aria-label="Foto ${i + 1}"><img src="${asset(im)}" alt=""></button>`).join("")}</div>` : "";
    $("#quick-view-content").innerHTML = `<div class="quick-content"><div class="quick-image"><img class="quick-main" src="${asset(p.images[0])}" alt="${esc(p.name)}">${thumbs}</div><div class="quick-info"><p class="overline">${CATEGORIES[p.category]}</p><h2>${esc(p.name)}</h2><p>${esc(p.desc)}</p><strong class="quick-price">${money(p.price)}</strong>${variantsHtml(p)}<a class="btn btn-gold btn-full" href="#" data-order="${p.id}">Pedir no WhatsApp</a></div></div>`;
    const modal = $("#quick-view");
    if (!modal.open) modal.showModal();
  }

  function setQuery(value, from) {
    state.query = value;
    if (from !== "panel") $("#search-input").value = value;
    if (from !== "catalog") $("#catalog-search").value = value;
    renderSuggestions();
    renderCatalog();
  }

  function scrollToCatalog() {
    const target = $("#catalogo");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openPanel() {
    const panel = $("#search-panel");
    panel.classList.add("open"); panel.setAttribute("aria-hidden", "false");
    $("#search-toggle").setAttribute("aria-expanded", "true");
    renderSuggestions();
    setTimeout(() => $("#search-input").focus(), 60);
  }
  function closePanel() {
    const panel = $("#search-panel");
    panel.classList.remove("open"); panel.setAttribute("aria-hidden", "true");
    $("#search-toggle").setAttribute("aria-expanded", "false");
  }
  function goToCatalog() { closePanel(); renderCatalog(); scrollToCatalog(); }

  function openDrawer() { $("#favorites-drawer").classList.add("open"); $("#drawer-overlay").classList.add("open"); $("#favorites-drawer").setAttribute("aria-hidden", "false"); }
  function closeDrawer() { $("#favorites-drawer").classList.remove("open"); $("#drawer-overlay").classList.remove("open"); $("#favorites-drawer").setAttribute("aria-hidden", "true"); }
  function closeMenu() { $("#header-nav").classList.remove("open"); $("#menu-toggle").classList.remove("active"); $("#menu-toggle").setAttribute("aria-expanded", "false"); }

  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  /* ---------- Eventos (delegação: nada se perde ao re-renderizar) ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target;

    const fav = t.closest("[data-favorite]");
    if (fav) { e.preventDefault(); e.stopPropagation(); toggleFavorite(fav.dataset.favorite); return; }

    const size = t.closest(".size-btn");
    if (size) { $$(".size-btn", size.parentElement).forEach((x) => x.classList.remove("selected")); size.classList.add("selected"); return; }

    const color = t.closest(".color-btn");
    if (color) { $$(".color-btn", color.parentElement).forEach((x) => x.classList.remove("selected")); color.classList.add("selected"); return; }

    const order = t.closest("[data-order]");
    if (order) { e.preventDefault(); const p = byId(order.dataset.order); const scope = order.closest(".product-card, .quick-info"); if (p && scope) window.open(orderLink(p, scope), "_blank", "noopener"); return; }

    const thumb = t.closest("[data-thumb]");
    if (thumb) { const main = $(".quick-main"); if (main) main.src = thumb.dataset.thumb; $$("[data-thumb]").forEach((x) => x.classList.toggle("active", x === thumb)); return; }

    const sug = t.closest("[data-suggestion]");
    if (sug) { closePanel(); openQuick(sug.dataset.suggestion); return; }

    const term = t.closest("[data-term]");
    if (term) { setQuery(term.dataset.term, "term"); $("#search-input").focus(); return; }

    if (t.closest("#see-all")) { goToCatalog(); return; }

    const pill = t.closest("[data-category-go]");
    if (pill) { state.category = pill.dataset.categoryGo; renderCatalog(); return; }

    const card = t.closest("[data-category-card]");
    if (card) { state.category = card.dataset.categoryCard; state.size = "all"; setQuery("", "card"); closePanel(); scrollToCatalog(); return; }

    const clear = t.closest("[data-clear]");
    if (clear) { const k = clear.dataset.clear; if (k === "query") setQuery("", "clear"); else { state[k] = "all"; renderCatalog(); } return; }

    if (t.closest("#clear-filters")) { state.category = "all"; state.size = "all"; state.sort = "featured"; setQuery("", "clear"); return; }

    const quick = t.closest("[data-quick]");
    if (quick) { openQuick(quick.dataset.quick); return; }

    if (t.closest("#search-toggle")) { $("#search-panel").classList.contains("open") ? closePanel() : openPanel(); return; }
    if (t.closest("#search-close")) { closePanel(); return; }
    if (t.closest(".favorites-trigger")) { openDrawer(); return; }
    if (t.closest("#favorites-close") || t.closest("#drawer-overlay")) { closeDrawer(); return; }
    if (t.closest("#modal-close")) { $("#quick-view").close(); return; }
    if (t === $("#quick-view")) { $("#quick-view").close(); return; }

    if (t.closest("#send-favorites")) {
      const list = PRODUCTS.filter((p) => state.favorites.includes(p.id));
      if (list.length) window.open(wa("Olá! Tenho interesse nestas peças:\n\n" + list.map((p) => `• ${p.name} — ${money(p.price)}`).join("\n")), "_blank", "noopener");
      return;
    }

    if (t.closest("#menu-toggle")) {
      const open = $("#header-nav").classList.toggle("open");
      $("#menu-toggle").classList.toggle("active", open);
      $("#menu-toggle").setAttribute("aria-expanded", String(open));
      return;
    }
    if (t.closest("#header-nav a")) closeMenu();
    if (t.closest("#back-to-top")) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }

    if ($("#search-panel").classList.contains("open") && !t.closest("#search-panel")) closePanel();
  });

  const liveSuggest = debounce((v) => setQuery(v, "panel"), 90);
  $("#search-input").addEventListener("input", (e) => liveSuggest(e.target.value));
  $("#search-form").addEventListener("submit", (e) => { e.preventDefault(); state.query = $("#search-input").value; $("#catalog-search").value = state.query; goToCatalog(); });
  $("#catalog-search").addEventListener("input", debounce((e) => setQuery(e.target.value, "catalog"), 90));
  $("#size-filter").addEventListener("change", (e) => { state.size = e.target.value; renderCatalog(); });
  $("#sort-filter").addEventListener("change", (e) => { state.sort = e.target.value; renderCatalog(); });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closePanel(); closeDrawer(); closeMenu();
  });

  document.addEventListener("error", (e) => { if (e.target && e.target.tagName === "IMG") e.target.classList.add("img-missing"); }, true);

  window.addEventListener("scroll", () => $("#back-to-top").classList.toggle("visible", window.scrollY > 500), { passive: true });

  /* ---------- Inicialização ---------- */
  function init() {
    $("#year").textContent = new Date().getFullYear();
    $("#whatsapp-float").href = wa("Olá! Vim pelo site e gostaria de mais informações sobre as peças.");
    $("#vip-whatsapp").href = wa("Olá! Quero receber as novidades e os próximos drops da M.H Lux.");
    $("#footer-whatsapp").href = wa("Olá! Vim pelo site da M.H Lux.");
    renderCategoryCards(); renderFeatured(); renderCatalog(); renderFavorites(); renderSuggestions();

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } }), { threshold: 0.12 });
      $$(".reveal").forEach((el) => io.observe(el));
    } else { $$(".reveal").forEach((el) => el.classList.add("visible")); }

    const hide = () => $("#page-loader").classList.add("hide");
    window.addEventListener("load", () => setTimeout(hide, 450));
    setTimeout(hide, 2200);
  }
  init();
})();

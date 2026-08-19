(function () {
  const data = window.TorogozStore.loadData();
  bindStaticData(data);
  initNavbar();
  initFooterYear();

  const categories = (data.categories || []).filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const allItems = (data.items || []).filter((i) => i.isAvailable).sort((a, b) => a.sortOrder - b.sortOrder);
  const events = (data.events || []).filter((e) => e.isActive);
  const menuEvents = events.filter((e) => e.showOnMenu);

  const state = {
    activeCat: null,
    search: "",
    filterTag: null,
    viewMode: "grid",
    selectedItem: null
  };

  renderEventsBanner();
  renderDietaryFilters();
  renderCategoryTabs();
  renderChefsPicks();
  renderItems();
  wireControls();

  function itemTags(item) {
    return item.dietaryTags || [];
  }

  function filteredItems() {
    let result = allItems;
    if (state.activeCat !== null) result = result.filter((i) => i.categoryId === state.activeCat);
    if (state.search.trim()) {
      const q = state.search.toLowerCase();
      result = result.filter(
        (i) => i.name.toLowerCase().includes(q) || (i.description && i.description.toLowerCase().includes(q))
      );
    }
    if (state.filterTag) {
      result = result.filter((i) => itemTags(i).includes(state.filterTag));
    }
    return result;
  }

  function allTags() {
    const set = new Set();
    allItems.forEach((i) => itemTags(i).forEach((t) => set.add(t)));
    return Array.from(set);
  }

  function renderEventsBanner() {
    if (menuEvents.length === 0) return;
    document.getElementById("menu-events-banner").style.display = "";
    document.getElementById("menu-events-list").innerHTML = menuEvents
      .map(
        (ev) => `
        <div class="flex-shrink-0 bg-white/80 border border-[#b5773a]/20 px-4 py-2 flex items-center gap-3">
          ${ev.eventDate ? `<span class="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-[#b5773a]">${escapeHtml(ev.eventDate)}</span>` : ""}
          <span class="text-[0.82rem] font-medium text-[#2b1d12]">${escapeHtml(ev.title)}</span>
        </div>`
      )
      .join("");
  }

  function renderDietaryFilters() {
    const el = document.getElementById("menu-dietary-filters");
    const tags = allTags();
    el.innerHTML = tags
      .map((t) => {
        const info = window.DIETARY_INFO[t];
        if (!info) return "";
        return `<button data-tag="${t}" class="dietary-tag cursor-pointer transition-all ${info.className}">${escapeHtml(info.full)}</button>`;
      })
      .join("");
    el.querySelectorAll("button[data-tag]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tag = btn.getAttribute("data-tag");
        state.filterTag = state.filterTag === tag ? null : tag;
        updateFilterButtons();
        renderChefsPicks();
        renderItems();
      });
    });
  }

  function updateFilterButtons() {
    document.querySelectorAll("#menu-dietary-filters button[data-tag]").forEach((btn) => {
      const tag = btn.getAttribute("data-tag");
      if (state.filterTag === tag) {
        btn.classList.add("!bg-[#2b1d12]", "!text-white", "!border-[#2b1d12]");
      } else {
        btn.classList.remove("!bg-[#2b1d12]", "!text-white", "!border-[#2b1d12]");
      }
    });
  }

  function renderCategoryTabs() {
    const el = document.getElementById("menu-cat-tabs");
    let html = `<button data-cat="all" class="slot-chip flex-shrink-0 ${state.activeCat === null ? "is-selected" : ""}">All</button>`;
    html += categories
      .map((cat) => `<button data-cat="${cat.id}" class="slot-chip flex-shrink-0 ${state.activeCat === cat.id ? "is-selected" : ""}">${escapeHtml(cat.name)}</button>`)
      .join("");
    el.innerHTML = html;
    el.querySelectorAll("button[data-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-cat");
        state.activeCat = v === "all" ? null : Number(v);
        renderCategoryTabs();
        renderChefsPicks();
        renderItems();
      });
    });
  }

  function itemCardGrid(item, opts) {
    opts = opts || {};
    const tags = itemTags(item);
    const pickBadge = opts.forceChefBadge || item.isChefsPick
      ? `<span class="dietary-tag tag-spicy !border-[#b5773a] !text-[#b5773a]">${opts.forceChefBadge ? "Chef&apos;s Pick" : "★ Chef&apos;s Pick"}</span>`
      : "";
    return `
      <button data-item-id="${item.id}" class="text-left menu-item-card bg-white border ${opts.highlight ? "border-[#b5773a]/20" : "border-[#795e3f]/10"} overflow-hidden group">
        ${item.imageUrl ? `<div class="aspect-[16/10] overflow-hidden"><img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>` : ""}
        <div class="p-5">
          <div class="flex items-start justify-between gap-2">
            <h3 class="${opts.highlight ? "font-[Playfair_Display] text-lg" : "font-medium text-[0.95rem]"} font-medium text-[#2b1d12]">${escapeHtml(item.name)}</h3>
            <span class="font-[Playfair_Display] text-lg ${opts.highlight ? "text-[#b5773a]" : "text-[#795e3f]"} flex-shrink-0">$${Number(item.price).toFixed(0)}</span>
          </div>
          ${item.description ? `<p class="mt-2 text-[0.82rem] text-[#795e3f]/70 leading-relaxed line-clamp-2">${escapeHtml(item.description)}</p>` : ""}
          <div class="mt-3 flex flex-wrap gap-1.5">
            ${pickBadge}
            ${renderDietaryTags(tags)}
          </div>
        </div>
      </button>`;
  }

  function itemRowList(item) {
    const tags = itemTags(item);
    return `
      <button data-item-id="${item.id}" class="text-left w-full flex items-start gap-4 p-4 bg-white border border-[#795e3f]/8 hover:shadow-md transition-shadow">
        ${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" class="w-20 h-20 object-cover flex-shrink-0" />` : ""}
        <div class="flex-1 min-w-0">
          <div class="flex items-baseline gap-2">
            <span class="font-medium text-[#2b1d12]">${escapeHtml(item.name)}</span>
            ${renderDietaryTags(tags)}
            ${item.isChefsPick ? `<span class="text-[0.55rem] uppercase tracking-[0.2em] text-[#b5773a] border border-[#b5773a]/50 px-1.5 py-0.5">Chef&apos;s Pick</span>` : ""}
            <span class="dish-leader"></span>
            <span class="font-[Playfair_Display] text-lg text-[#795e3f]">$${Number(item.price).toFixed(0)}</span>
          </div>
          ${item.description ? `<p class="mt-1 text-[0.82rem] text-[#795e3f]/70 leading-relaxed">${escapeHtml(item.description)}</p>` : ""}
        </div>
      </button>`;
  }

  function renderChefsPicks() {
    const el = document.getElementById("menu-chefs-picks");
    const show = !state.activeCat && !state.search && !state.filterTag;
    const picks = allItems.filter((i) => i.isChefsPick).slice(0, 3);
    if (!show || picks.length === 0) {
      el.innerHTML = "";
      return;
    }
    el.innerHTML = `
      <h2 class="font-[Playfair_Display] text-2xl text-[#2b1d12] font-medium mb-6 flex items-center gap-3">
        <span class="text-[#b5773a]">★</span> Chef&apos;s Picks
      </h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        ${picks.map((item) => itemCardGrid(item, { highlight: true })).join("")}
      </div>`;
    wireItemButtons(el);
  }

  function renderItems() {
    const container = document.getElementById("menu-items-container");
    const items = filteredItems();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="py-20 text-center">
          <p class="font-[Playfair_Display] text-2xl text-[#2b1d12] mb-2">No dishes found</p>
          <p class="text-[0.85rem] text-[#795e3f]/60">Try adjusting your search or filters.</p>
        </div>`;
      return;
    }

    const cats = state.activeCat !== null ? categories.filter((c) => c.id === state.activeCat) : categories;

    if (state.viewMode === "grid") {
      container.innerHTML = cats
        .map((cat) => {
          const catItems = items.filter((i) => i.categoryId === cat.id);
          if (catItems.length === 0) return "";
          return `
            <div class="mb-12">
              <div class="mb-6 pb-3 border-b border-[#795e3f]/15">
                <h2 class="font-[Playfair_Display] text-2xl md:text-3xl text-[#2b1d12] font-medium">${escapeHtml(cat.name)}</h2>
                ${cat.description ? `<p class="mt-1 text-[0.82rem] text-[#795e3f]/60">${escapeHtml(cat.description)}</p>` : ""}
              </div>
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                ${catItems.map((item) => itemCardGrid(item)).join("")}
              </div>
            </div>`;
        })
        .join("");
    } else {
      container.innerHTML = cats
        .map((cat) => {
          const catItems = items.filter((i) => i.categoryId === cat.id);
          if (catItems.length === 0) return "";
          return `
            <div class="mb-10">
              <h2 class="font-[Playfair_Display] text-2xl text-[#2b1d12] font-medium mb-5 pb-2 border-b border-[#795e3f]/20">${escapeHtml(cat.name)}</h2>
              <div class="space-y-4">${catItems.map((item) => itemRowList(item)).join("")}</div>
            </div>`;
        })
        .join("");
    }
    wireItemButtons(container);
  }

  function wireItemButtons(root) {
    root.querySelectorAll("button[data-item-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.getAttribute("data-item-id"));
        const item = allItems.find((i) => i.id === id);
        if (item) openModal(item);
      });
    });
  }

  function openModal(item) {
    const modal = document.getElementById("menu-item-modal");
    const content = document.getElementById("menu-item-modal-content");
    const tags = itemTags(item);
    content.innerHTML = `
      <button id="menu-modal-close" class="absolute top-4 right-4 text-[#795e3f] hover:text-[#2b1d12] text-2xl leading-none">×</button>
      ${item.imageUrl ? `<div class="aspect-[16/10] overflow-hidden -mx-8 -mt-8 mb-6"><img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" class="w-full h-full object-cover" /></div>` : ""}
      <div class="flex items-start justify-between gap-4 mb-4">
        <h2 class="font-[Playfair_Display] text-2xl font-medium text-[#2b1d12]">${escapeHtml(item.name)}</h2>
        <span class="font-[Playfair_Display] text-2xl text-[#b5773a]">$${Number(item.price).toFixed(2)}</span>
      </div>
      ${item.description ? `<p class="text-[0.92rem] text-[#795e3f]/85 leading-relaxed mb-4">${escapeHtml(item.description)}</p>` : ""}
      <div class="flex flex-wrap gap-2 mb-4">
        ${item.isChefsPick ? `<span class="dietary-tag tag-spicy !border-[#b5773a] !text-[#b5773a] !text-[0.7rem] !px-3 !py-1">★ Chef&apos;s Pick</span>` : ""}
        ${renderDietaryTags(tags, { large: true, fullLabel: true })}
      </div>
      <p class="text-[0.78rem] text-[#795e3f]/50 mt-4">Please inform your server of any allergies. Prices exclude tax and gratuity.</p>`;
    modal.style.display = "flex";
    document.getElementById("menu-modal-close").addEventListener("click", closeModal);
    modal.addEventListener("click", overlayClick);
  }

  function overlayClick(e) {
    if (e.target.id === "menu-item-modal") closeModal();
  }

  function closeModal() {
    document.getElementById("menu-item-modal").style.display = "none";
  }

  function wireControls() {
    document.getElementById("menu-search").addEventListener("input", (e) => {
      state.search = e.target.value;
      renderChefsPicks();
      renderItems();
    });

    const gridBtn = document.getElementById("menu-view-grid");
    const listBtn = document.getElementById("menu-view-list");
    gridBtn.addEventListener("click", () => setViewMode("grid"));
    listBtn.addEventListener("click", () => setViewMode("list"));

    function setViewMode(mode) {
      state.viewMode = mode;
      if (mode === "grid") {
        gridBtn.classList.add("bg-[#2b1d12]", "text-white");
        gridBtn.classList.remove("text-[#795e3f]");
        listBtn.classList.remove("bg-[#2b1d12]", "text-white");
        listBtn.classList.add("text-[#795e3f]");
      } else {
        listBtn.classList.add("bg-[#2b1d12]", "text-white");
        listBtn.classList.remove("text-[#795e3f]");
        gridBtn.classList.remove("bg-[#2b1d12]", "text-white");
        gridBtn.classList.add("text-[#795e3f]");
      }
      renderItems();
    }
  }
})();

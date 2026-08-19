(function () {
  const data = window.TorogozStore.loadData();

  bindStaticData(data);
  initNavbar();
  initFooterYear();

  renderMenuPreview(data);
  renderEvents(data);
  renderReviews(data);

  function renderMenuPreview(data) {
    const el = document.getElementById("menu-preview-content");
    const categories = (data.categories || [])
      .filter((c) => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(0, 3);
    const items = (data.items || []).filter((i) => i.isAvailable);

    if (categories.length === 0) {
      el.innerHTML = `
        <div class="text-center py-16 text-[#795e3f]/60">
          <p class="font-[Playfair_Display] text-2xl text-[#2b1d12] mb-3">Menu coming soon</p>
          <p class="text-[0.85rem]">Our chefs are crafting the perfect seasonal menu.</p>
        </div>`;
      return;
    }

    el.innerHTML = categories
      .map((cat) => {
        const catItems = items
          .filter((i) => i.categoryId === cat.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .slice(0, 4);
        if (catItems.length === 0) return "";
        return `
          <div>
            <h3 class="font-[Playfair_Display] text-2xl text-[#2b1d12] font-medium mb-5 pb-2 border-b border-[#795e3f]/20">${escapeHtml(cat.name)}</h3>
            <div class="space-y-4">
              ${catItems
                .map((item) => {
                  const tags = item.dietaryTags || [];
                  const tagBadges = tags
                    .map((t) => {
                      const info = window.DIETARY_INFO[t];
                      return info
                        ? `<span class="text-[0.55rem] uppercase tracking-[0.15em] text-[#b5773a] border border-[#b5773a]/40 px-1.5 py-0.5">${escapeHtml(info.label)}</span>`
                        : "";
                    })
                    .join("");
                  const pickBadge = item.isChefsPick
                    ? `<span class="text-[0.55rem] uppercase tracking-[0.2em] text-[#b5773a] border border-[#b5773a]/50 px-1.5 py-0.5">Chef&apos;s Pick</span>`
                    : "";
                  return `
                    <div class="flex items-baseline">
                      <div class="flex items-baseline gap-2 flex-shrink-0">
                        <span class="text-[0.95rem] font-medium text-[#2b1d12]">${escapeHtml(item.name)}</span>
                        ${tagBadges}
                        ${pickBadge}
                      </div>
                      <span class="dish-leader"></span>
                      <span class="font-[Playfair_Display] text-lg text-[#795e3f] flex-shrink-0">$${Number(item.price).toFixed(0)}</span>
                    </div>`;
                })
                .join("")}
            </div>
          </div>`;
      })
      .join("");
  }

  function renderEvents(data) {
    const section = document.getElementById("events-section");
    const el = document.getElementById("events-content");
    const events = (data.events || []).filter((e) => e.isActive).slice(0, 4);
    if (events.length === 0) {
      section.style.display = "none";
      return;
    }
    section.style.display = "";
    el.innerHTML = events
      .map(
        (event) => `
        <div class="event-card-glow bg-[#3d2a1a] border border-[#f7efe3]/10 overflow-hidden group">
          ${
            event.imageUrl
              ? `<div class="aspect-[16/9] overflow-hidden"><img src="${escapeHtml(event.imageUrl)}" alt="${escapeHtml(event.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>`
              : ""
          }
          <div class="p-6">
            ${event.eventDate ? `<p class="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#d9a05f] mb-2">${escapeHtml(event.eventDate)}</p>` : ""}
            <h3 class="font-[Playfair_Display] text-xl text-[#f7efe3] font-medium">${escapeHtml(event.title)}</h3>
            ${event.description ? `<p class="mt-2 text-[0.85rem] text-[#f7efe3]/70 leading-relaxed">${escapeHtml(event.description)}</p>` : ""}
          </div>
        </div>`
      )
      .join("");
  }

  function renderReviews(data) {
    const section = document.getElementById("reviews-section");
    const el = document.getElementById("reviews-content");
    const reviews = (data.reviews || []).filter((r) => r.isActive).slice(0, 6);
    if (reviews.length === 0) {
      section.style.display = "none";
      return;
    }
    section.style.display = "";
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    document.getElementById("reviews-avg").textContent = avg.toFixed(1);
    document.getElementById("reviews-avg-stars").innerHTML = renderStars(Math.round(avg));
    document.getElementById("reviews-count").textContent = reviews.length;

    el.innerHTML = reviews
      .map(
        (review) => `
        <div class="bg-white border border-[#795e3f]/10 p-6 hover:shadow-lg transition-shadow duration-300">
          ${renderStars(review.rating)}
          <p class="mt-4 text-[0.9rem] text-[#2b1d12]/85 leading-relaxed line-clamp-4">&ldquo;${escapeHtml(review.reviewText)}&rdquo;</p>
          <div class="mt-4 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#b5773a]/20 flex items-center justify-center text-[#b5773a] text-sm font-semibold">${escapeHtml(review.authorName.charAt(0).toUpperCase())}</div>
            <div>
              <p class="text-[0.82rem] font-medium text-[#2b1d12]">${escapeHtml(review.authorName)}</p>
              ${review.relativeTime ? `<p class="text-[0.7rem] text-[#795e3f]/50">${escapeHtml(review.relativeTime)}</p>` : ""}
            </div>
          </div>
        </div>`
      )
      .join("");
  }
})();

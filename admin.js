(function () {
  const DIETARY_OPTIONS = [
    { value: "vegan", label: "Vegan" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "gf", label: "Gluten Free" },
    { value: "df", label: "Dairy Free" },
    { value: "spicy", label: "Spicy" },
    { value: "nut-free", label: "Nut Free" }
  ];

  let data = window.TorogozStore.loadData();
  let tab = "menu";

  // ---------- Auth ----------
  const SESSION_KEY = "torogozAdminAuthed";

  function isAuthed() {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  }

  function login() {
    const input = document.getElementById("admin-password-input");
    const pw = input.value;
    const expected = (window.TorogozStore.loadData().site || {}).adminPassword || (window.TOROGOZ_DATA.site || {}).adminPassword;
    if (pw === expected) {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      showDashboard();
    } else {
      document.getElementById("admin-login-error").style.display = "block";
    }
  }

  function logout() {
    window.sessionStorage.removeItem(SESSION_KEY);
    document.getElementById("admin-dashboard").style.display = "none";
    document.getElementById("admin-login").style.display = "flex";
  }

  function showDashboard() {
    document.getElementById("admin-login").style.display = "none";
    document.getElementById("admin-dashboard").style.display = "block";
    data = window.TorogozStore.loadData();
    renderAll();
  }

  document.getElementById("admin-login-btn").addEventListener("click", login);
  document.getElementById("admin-password-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") login();
  });
  document.getElementById("admin-logout-btn").addEventListener("click", logout);

  if (isAuthed()) showDashboard();

  // ---------- Persistence helpers ----------
  function persist() {
    window.TorogozStore.saveData(data);
    updateLocalStatus();
  }

  function updateLocalStatus() {
    const el = document.getElementById("admin-local-status");
    if (window.TorogozStore.hasLocalEdits()) {
      el.textContent = "You have unpublished local edits saved in this browser. Download the data file to publish them.";
    } else {
      el.textContent = "Showing the currently published data (js/data.js).";
    }
  }

  function showMessage(msg) {
    const toast = document.getElementById("admin-toast");
    toast.textContent = msg;
    toast.style.display = "block";
    setTimeout(() => (toast.style.display = "none"), 3000);
  }

  // ---------- Export / Import / Reset ----------
  document.getElementById("admin-export-btn").addEventListener("click", () => {
    const src = window.TorogozStore.generateDataFileSource(data);
    const blob = new Blob([src], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.js";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showMessage("Downloaded data.js — upload it to your host's js/data.js to publish.");
  });

  document.getElementById("admin-import-input").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!confirm("Importing will replace all current data (menu, events, reviews) with the contents of this file. Continue?")) {
      e.target.value = "";
      return;
    }
    try {
      const text = await file.text();
      const fn = new Function(text + "\nreturn window.TOROGOZ_DATA;");
      const imported = fn();
      if (!imported || !imported.categories) throw new Error("File doesn't look like a Torogoz data file.");
      data = imported;
      persist();
      renderAll();
      showMessage("Data imported successfully.");
    } catch (err) {
      alert("Could not import that file: " + err.message);
    }
    e.target.value = "";
  });

  document.getElementById("admin-reset-btn").addEventListener("click", () => {
    if (!confirm("Discard all local edits and go back to the currently published data.js? This cannot be undone.")) return;
    window.TorogozStore.resetToPublished();
    data = window.TorogozStore.loadData();
    renderAll();
    showMessage("Local edits discarded.");
  });

  // ---------- Tabs ----------
  document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      tab = btn.getAttribute("data-tab");
      renderTabs();
    });
  });

  function renderTabs() {
    document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
      const active = btn.getAttribute("data-tab") === tab;
      btn.classList.toggle("bg-[#2b1d12]", active);
      btn.classList.toggle("text-white", active);
      btn.classList.toggle("shadow", active);
      btn.classList.toggle("text-gray-600", !active);
    });
    document.getElementById("tab-panel-menu").style.display = tab === "menu" ? "" : "none";
    document.getElementById("tab-panel-events").style.display = tab === "events" ? "" : "none";
    document.getElementById("tab-panel-reviews").style.display = tab === "reviews" ? "" : "none";
  }

  function renderAll() {
    updateLocalStatus();
    renderTabs();
    renderCategories();
    renderItems();
    renderEvents();
    renderReviews();
    document.getElementById("tab-count-menu").textContent = data.items.length;
    document.getElementById("tab-count-events").textContent = data.events.length;
    document.getElementById("tab-count-reviews").textContent = data.reviews.length;
  }

  // ---------- Modal helpers ----------
  function openModal(html) {
    document.getElementById("admin-modal-content").innerHTML = html;
    document.getElementById("admin-modal").style.display = "flex";
  }
  function closeModal() {
    document.getElementById("admin-modal").style.display = "none";
  }
  document.getElementById("admin-modal").addEventListener("click", (e) => {
    if (e.target.id === "admin-modal") closeModal();
  });

  // ================= CATEGORIES =================
  function renderCategories() {
    const el = document.getElementById("category-list");
    const cats = [...data.categories].sort((a, b) => a.sortOrder - b.sortOrder);
    el.innerHTML = cats
      .map(
        (cat) => `
        <div class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
          <div>
            <span class="font-medium">${escapeHtml(cat.name)}</span>
            <span class="text-xs text-gray-400 ml-2">/${escapeHtml(cat.slug)}</span>
            ${cat.description ? `<p class="text-sm text-gray-500">${escapeHtml(cat.description)}</p>` : ""}
          </div>
          <div class="flex gap-2">
            <button class="admin-btn admin-btn-outline text-xs" data-edit-cat="${cat.id}">Edit</button>
            <button class="admin-btn admin-btn-danger text-xs" data-del-cat="${cat.id}">Delete</button>
          </div>
        </div>`
      )
      .join("");
    el.querySelectorAll("[data-edit-cat]").forEach((btn) =>
      btn.addEventListener("click", () => openCategoryModal(data.categories.find((c) => c.id === Number(btn.dataset.editCat))))
    );
    el.querySelectorAll("[data-del-cat]").forEach((btn) =>
      btn.addEventListener("click", () => deleteCategory(Number(btn.dataset.delCat)))
    );
  }

  document.getElementById("add-category-btn").addEventListener("click", () => openCategoryModal(null));

  function openCategoryModal(cat) {
    const isEdit = !!cat;
    const c = cat || { name: "", slug: "", description: "", sortOrder: 0 };
    openModal(`
      <h3 class="text-lg font-semibold mb-4">${isEdit ? "Edit Category" : "New Category"}</h3>
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700">Name</label>
          <input id="f-cat-name" class="admin-input mt-1" value="${escapeHtml(c.name)}" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Slug</label>
          <input id="f-cat-slug" class="admin-input mt-1" value="${escapeHtml(c.slug)}" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Description</label>
          <input id="f-cat-desc" class="admin-input mt-1" value="${escapeHtml(c.description || "")}" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Sort Order</label>
          <input id="f-cat-sort" type="number" class="admin-input mt-1" value="${c.sortOrder || 0}" />
        </div>
        <div class="flex gap-3 justify-end pt-2">
          <button id="f-cat-cancel" class="admin-btn admin-btn-outline">Cancel</button>
          <button id="f-cat-save" class="admin-btn admin-btn-primary">Save</button>
        </div>
      </div>
    `);
    const nameInput = document.getElementById("f-cat-name");
    const slugInput = document.getElementById("f-cat-slug");
    nameInput.addEventListener("input", () => {
      if (!isEdit) slugInput.value = nameInput.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    });
    document.getElementById("f-cat-cancel").addEventListener("click", closeModal);
    document.getElementById("f-cat-save").addEventListener("click", () => {
      const name = nameInput.value.trim();
      const slug = slugInput.value.trim();
      if (!name || !slug) {
        alert("Name and slug are required.");
        return;
      }
      const payload = {
        name,
        slug,
        description: document.getElementById("f-cat-desc").value || null,
        sortOrder: parseInt(document.getElementById("f-cat-sort").value, 10) || 0,
        isActive: true
      };
      if (isEdit) {
        Object.assign(cat, payload);
      } else {
        payload.id = window.TorogozStore.nextId(data.categories);
        data.categories.push(payload);
      }
      persist();
      renderCategories();
      renderItems();
      closeModal();
      showMessage(isEdit ? "Category updated!" : "Category created!");
    });
  }

  function deleteCategory(id) {
    if (!confirm("Delete this category and all its items?")) return;
    data.categories = data.categories.filter((c) => c.id !== id);
    data.items = data.items.filter((i) => i.categoryId !== id);
    persist();
    renderCategories();
    renderItems();
    showMessage("Category deleted!");
  }

  // ================= MENU ITEMS =================
  function renderItems() {
    const el = document.getElementById("item-list");
    const items = [...data.items].sort((a, b) => a.sortOrder - b.sortOrder);
    el.innerHTML = items
      .map((item) => {
        const cat = data.categories.find((c) => c.id === item.categoryId);
        const tags = item.dietaryTags || [];
        return `
        <tr class="border-b hover:bg-gray-50">
          <td class="py-3 pr-4">
            <div class="flex items-center gap-3">
              ${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="" class="w-10 h-10 rounded object-cover" />` : ""}
              <div>
                <p class="font-medium">${escapeHtml(item.name)}</p>
                ${item.description ? `<p class="text-xs text-gray-400 truncate max-w-[200px]">${escapeHtml(item.description)}</p>` : ""}
              </div>
            </div>
          </td>
          <td class="py-3 pr-4 text-gray-600">${cat ? escapeHtml(cat.name) : "—"}</td>
          <td class="py-3 pr-4">$${Number(item.price).toFixed(0)}</td>
          <td class="py-3 pr-4"><div class="flex gap-1">${tags.map((t) => `<span class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">${escapeHtml(t)}</span>`).join("")}</div></td>
          <td class="py-3 pr-4">${item.isChefsPick ? "★" : "—"}</td>
          <td class="py-3">
            <div class="flex gap-2">
              <button class="admin-btn admin-btn-outline text-xs" data-edit-item="${item.id}">Edit</button>
              <button class="admin-btn admin-btn-danger text-xs" data-del-item="${item.id}">Delete</button>
            </div>
          </td>
        </tr>`;
      })
      .join("");
    el.querySelectorAll("[data-edit-item]").forEach((btn) =>
      btn.addEventListener("click", () => openItemModal(data.items.find((i) => i.id === Number(btn.dataset.editItem))))
    );
    el.querySelectorAll("[data-del-item]").forEach((btn) =>
      btn.addEventListener("click", () => deleteItem(Number(btn.dataset.delItem)))
    );
  }

  document.getElementById("add-item-btn").addEventListener("click", () => openItemModal(null));

  function openItemModal(item) {
    const isEdit = !!item;
    const it = item || {
      categoryId: data.categories[0] ? data.categories[0].id : 0,
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      dietaryTags: [],
      isChefsPick: false,
      isAvailable: true,
      sortOrder: 0
    };
    let selectedTags = [...(it.dietaryTags || [])];

    openModal(`
      <h3 class="text-lg font-semibold mb-4">${isEdit ? "Edit Menu Item" : "New Menu Item"}</h3>
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700">Category</label>
          <select id="f-item-cat" class="admin-input mt-1">
            ${data.categories.map((c) => `<option value="${c.id}" ${c.id === it.categoryId ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Name</label>
          <input id="f-item-name" class="admin-input mt-1" value="${escapeHtml(it.name)}" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Description</label>
          <textarea id="f-item-desc" class="admin-input mt-1" rows="3">${escapeHtml(it.description || "")}</textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Price</label>
            <input id="f-item-price" type="number" step="0.01" class="admin-input mt-1" value="${escapeHtml(it.price)}" />
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Sort Order</label>
            <input id="f-item-sort" type="number" class="admin-input mt-1" value="${it.sortOrder || 0}" />
          </div>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Image URL</label>
          <input id="f-item-image" class="admin-input mt-1" value="${escapeHtml(it.imageUrl || "")}" />
          <img id="f-item-image-preview" src="${escapeHtml(it.imageUrl || "")}" alt="" class="mt-2 h-20 object-cover rounded" style="${it.imageUrl ? "" : "display:none;"}" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-2">Dietary Tags</label>
          <div id="f-item-tags" class="flex flex-wrap gap-2">
            ${DIETARY_OPTIONS.map(
              (opt) =>
                `<button type="button" data-tag="${opt.value}" class="text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedTags.includes(opt.value) ? "bg-[#2b1d12] text-white border-[#2b1d12]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}">${opt.label}</button>`
            ).join("")}
          </div>
        </div>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm"><input id="f-item-pick" type="checkbox" class="rounded" ${it.isChefsPick ? "checked" : ""} /> Chef's Pick</label>
          <label class="flex items-center gap-2 text-sm"><input id="f-item-avail" type="checkbox" class="rounded" ${it.isAvailable !== false ? "checked" : ""} /> Available</label>
        </div>
        <div class="flex gap-3 justify-end pt-2">
          <button id="f-item-cancel" class="admin-btn admin-btn-outline">Cancel</button>
          <button id="f-item-save" class="admin-btn admin-btn-primary">Save</button>
        </div>
      </div>
    `);

    document.getElementById("f-item-image").addEventListener("input", (e) => {
      const preview = document.getElementById("f-item-image-preview");
      if (e.target.value) {
        preview.src = e.target.value;
        preview.style.display = "";
      } else {
        preview.style.display = "none";
      }
    });

    document.querySelectorAll("#f-item-tags [data-tag]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = btn.getAttribute("data-tag");
        if (selectedTags.includes(t)) {
          selectedTags = selectedTags.filter((x) => x !== t);
          btn.classList.remove("bg-[#2b1d12]", "text-white", "border-[#2b1d12]");
          btn.classList.add("bg-white", "text-gray-600", "border-gray-200");
        } else {
          selectedTags.push(t);
          btn.classList.add("bg-[#2b1d12]", "text-white", "border-[#2b1d12]");
          btn.classList.remove("bg-white", "text-gray-600", "border-gray-200");
        }
      });
    });

    document.getElementById("f-item-cancel").addEventListener("click", closeModal);
    document.getElementById("f-item-save").addEventListener("click", () => {
      const name = document.getElementById("f-item-name").value.trim();
      const price = document.getElementById("f-item-price").value;
      if (!name || !price) {
        alert("Name and price are required.");
        return;
      }
      const payload = {
        categoryId: parseInt(document.getElementById("f-item-cat").value, 10),
        name,
        description: document.getElementById("f-item-desc").value || null,
        price: String(price),
        imageUrl: document.getElementById("f-item-image").value || null,
        dietaryTags: selectedTags,
        isChefsPick: document.getElementById("f-item-pick").checked,
        isAvailable: document.getElementById("f-item-avail").checked,
        sortOrder: parseInt(document.getElementById("f-item-sort").value, 10) || 0
      };
      if (isEdit) {
        Object.assign(item, payload);
      } else {
        payload.id = window.TorogozStore.nextId(data.items);
        data.items.push(payload);
      }
      persist();
      renderItems();
      closeModal();
      showMessage(isEdit ? "Item updated!" : "Item created!");
    });
  }

  function deleteItem(id) {
    if (!confirm("Delete this menu item?")) return;
    data.items = data.items.filter((i) => i.id !== id);
    persist();
    renderItems();
    showMessage("Item deleted!");
  }

  // ================= EVENTS =================
  function renderEvents() {
    const el = document.getElementById("event-list");
    el.innerHTML = data.events
      .map(
        (event) => `
        <div class="border rounded-xl overflow-hidden">
          ${event.imageUrl ? `<img src="${escapeHtml(event.imageUrl)}" alt="" class="w-full h-40 object-cover" />` : ""}
          <div class="p-4">
            <div class="flex items-start justify-between gap-2">
              <div>
                ${event.eventDate ? `<p class="text-xs text-amber-600 font-semibold">${escapeHtml(event.eventDate)}</p>` : ""}
                <h3 class="font-semibold">${escapeHtml(event.title)}</h3>
              </div>
              <div class="flex flex-col gap-1 items-end">
                <span class="text-xs px-2 py-0.5 rounded-full ${event.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}">${event.isActive ? "Active" : "Inactive"}</span>
                ${event.showOnMenu ? `<span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">On Menu</span>` : ""}
              </div>
            </div>
            ${event.description ? `<p class="text-sm text-gray-500 mt-2 line-clamp-2">${escapeHtml(event.description)}</p>` : ""}
            <div class="flex gap-2 mt-3">
              <button class="admin-btn admin-btn-outline text-xs" data-edit-event="${event.id}">Edit</button>
              <button class="admin-btn admin-btn-danger text-xs" data-del-event="${event.id}">Delete</button>
            </div>
          </div>
        </div>`
      )
      .join("");
    el.querySelectorAll("[data-edit-event]").forEach((btn) =>
      btn.addEventListener("click", () => openEventModal(data.events.find((e) => e.id === Number(btn.dataset.editEvent))))
    );
    el.querySelectorAll("[data-del-event]").forEach((btn) =>
      btn.addEventListener("click", () => deleteEvent(Number(btn.dataset.delEvent)))
    );
  }

  document.getElementById("add-event-btn").addEventListener("click", () => openEventModal(null));

  function openEventModal(event) {
    const isEdit = !!event;
    const ev = event || { title: "", description: "", eventDate: "", imageUrl: "", isActive: true, showOnMenu: true };
    openModal(`
      <h3 class="text-lg font-semibold mb-4">${isEdit ? "Edit Event" : "New Event"}</h3>
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700">Title</label>
          <input id="f-ev-title" class="admin-input mt-1" value="${escapeHtml(ev.title)}" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Description</label>
          <textarea id="f-ev-desc" class="admin-input mt-1" rows="3">${escapeHtml(ev.description || "")}</textarea>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Event Date</label>
          <input id="f-ev-date" class="admin-input mt-1" placeholder="e.g., March 15, 2025 or Every Sunday" value="${escapeHtml(ev.eventDate || "")}" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Image URL</label>
          <input id="f-ev-image" class="admin-input mt-1" value="${escapeHtml(ev.imageUrl || "")}" />
        </div>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm"><input id="f-ev-active" type="checkbox" class="rounded" ${ev.isActive !== false ? "checked" : ""} /> Active</label>
          <label class="flex items-center gap-2 text-sm"><input id="f-ev-menu" type="checkbox" class="rounded" ${ev.showOnMenu !== false ? "checked" : ""} /> Show on Menu Page</label>
        </div>
        <div class="flex gap-3 justify-end pt-2">
          <button id="f-ev-cancel" class="admin-btn admin-btn-outline">Cancel</button>
          <button id="f-ev-save" class="admin-btn admin-btn-primary">Save</button>
        </div>
      </div>
    `);
    document.getElementById("f-ev-cancel").addEventListener("click", closeModal);
    document.getElementById("f-ev-save").addEventListener("click", () => {
      const title = document.getElementById("f-ev-title").value.trim();
      if (!title) {
        alert("Title is required.");
        return;
      }
      const payload = {
        title,
        description: document.getElementById("f-ev-desc").value || null,
        eventDate: document.getElementById("f-ev-date").value || null,
        imageUrl: document.getElementById("f-ev-image").value || null,
        isActive: document.getElementById("f-ev-active").checked,
        showOnMenu: document.getElementById("f-ev-menu").checked
      };
      if (isEdit) {
        Object.assign(event, payload);
      } else {
        payload.id = window.TorogozStore.nextId(data.events);
        data.events.push(payload);
      }
      persist();
      renderEvents();
      closeModal();
      showMessage(isEdit ? "Event updated!" : "Event created!");
    });
  }

  function deleteEvent(id) {
    if (!confirm("Delete this event?")) return;
    data.events = data.events.filter((e) => e.id !== id);
    persist();
    renderEvents();
    showMessage("Event deleted!");
  }

  // ================= REVIEWS =================
  function renderReviews() {
    const el = document.getElementById("review-list");
    el.innerHTML = data.reviews
      .map(
        (review) => `
        <div class="p-4 border rounded-lg hover:bg-gray-50 flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold flex-shrink-0">${escapeHtml(review.authorName.charAt(0))}</div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium">${escapeHtml(review.authorName)}</span>
              <span class="text-yellow-500">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
              ${review.relativeTime ? `<span class="text-xs text-gray-400">${escapeHtml(review.relativeTime)}</span>` : ""}
            </div>
            <p class="text-sm text-gray-600 mt-1">${escapeHtml(review.reviewText)}</p>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button class="admin-btn admin-btn-outline text-xs" data-edit-review="${review.id}">Edit</button>
            <button class="admin-btn admin-btn-danger text-xs" data-del-review="${review.id}">Delete</button>
          </div>
        </div>`
      )
      .join("");
    el.querySelectorAll("[data-edit-review]").forEach((btn) =>
      btn.addEventListener("click", () => openReviewModal(data.reviews.find((r) => r.id === Number(btn.dataset.editReview))))
    );
    el.querySelectorAll("[data-del-review]").forEach((btn) =>
      btn.addEventListener("click", () => deleteReview(Number(btn.dataset.delReview)))
    );
  }

  document.getElementById("add-review-btn").addEventListener("click", () => openReviewModal(null));

  function openReviewModal(review) {
    const isEdit = !!review;
    const rv = review || { authorName: "", rating: 5, reviewText: "", relativeTime: "", isActive: true };
    let rating = rv.rating || 5;

    openModal(`
      <h3 class="text-lg font-semibold mb-4">${isEdit ? "Edit Review" : "New Review"}</h3>
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700">Author Name</label>
          <input id="f-rv-author" class="admin-input mt-1" value="${escapeHtml(rv.authorName)}" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Rating</label>
          <div id="f-rv-stars" class="flex gap-2 mt-1"></div>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Review Text</label>
          <textarea id="f-rv-text" class="admin-input mt-1" rows="4">${escapeHtml(rv.reviewText)}</textarea>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Relative Time</label>
          <input id="f-rv-time" class="admin-input mt-1" placeholder="e.g., 2 weeks ago" value="${escapeHtml(rv.relativeTime || "")}" />
        </div>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm"><input id="f-rv-active" type="checkbox" class="rounded" ${rv.isActive !== false ? "checked" : ""} /> Active</label>
        </div>
        <div class="flex gap-3 justify-end pt-2">
          <button id="f-rv-cancel" class="admin-btn admin-btn-outline">Cancel</button>
          <button id="f-rv-save" class="admin-btn admin-btn-primary">Save</button>
        </div>
      </div>
    `);

    function renderStarsPicker() {
      const el = document.getElementById("f-rv-stars");
      el.innerHTML = [1, 2, 3, 4, 5]
        .map((r) => `<button type="button" data-r="${r}" class="text-2xl ${r <= rating ? "text-yellow-400" : "text-gray-300"}">★</button>`)
        .join("");
      el.querySelectorAll("[data-r]").forEach((btn) =>
        btn.addEventListener("click", () => {
          rating = Number(btn.dataset.r);
          renderStarsPicker();
        })
      );
    }
    renderStarsPicker();

    document.getElementById("f-rv-cancel").addEventListener("click", closeModal);
    document.getElementById("f-rv-save").addEventListener("click", () => {
      const authorName = document.getElementById("f-rv-author").value.trim();
      const reviewText = document.getElementById("f-rv-text").value.trim();
      if (!authorName || !reviewText) {
        alert("Author name and review text are required.");
        return;
      }
      const payload = {
        authorName,
        rating,
        reviewText,
        relativeTime: document.getElementById("f-rv-time").value || null,
        isActive: document.getElementById("f-rv-active").checked
      };
      if (isEdit) {
        Object.assign(review, payload);
      } else {
        payload.id = window.TorogozStore.nextId(data.reviews);
        data.reviews.push(payload);
      }
      persist();
      renderReviews();
      closeModal();
      showMessage(isEdit ? "Review updated!" : "Review created!");
    });
  }

  function deleteReview(id) {
    if (!confirm("Delete this review?")) return;
    data.reviews = data.reviews.filter((r) => r.id !== id);
    persist();
    renderReviews();
    showMessage("Review deleted!");
  }
})();

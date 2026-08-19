/* Generic data-binding helper: fills in [data-bind]/[data-bind-href]/
   [data-bind-src]/[data-bind-bg] elements from a dotted path into the
   site data object. Keeps HTML static/readable while still pulling
   contact info, hours, and links from one place (js/data.js). */
function getByPath(obj, path) {
  return path.split(".").reduce((o, k) => (o || {})[k], obj);
}

function bindStaticData(data) {
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const val = getByPath(data, el.getAttribute("data-bind"));
    if (val !== undefined && val !== null) el.textContent = val;
  });
  document.querySelectorAll("[data-bind-href]").forEach((el) => {
    const val = getByPath(data, el.getAttribute("data-bind-href"));
    if (val !== undefined && val !== null) el.setAttribute("href", val);
  });
  document.querySelectorAll("[data-bind-src]").forEach((el) => {
    const val = getByPath(data, el.getAttribute("data-bind-src"));
    if (val !== undefined && val !== null) el.setAttribute("src", val);
  });
  document.querySelectorAll("[data-bind-bg]").forEach((el) => {
    const val = getByPath(data, el.getAttribute("data-bind-bg"));
    if (val) el.style.backgroundImage = `url(${val})`;
  });
  document.querySelectorAll("[data-bind-tel]").forEach((el) => {
    const val = getByPath(data, el.getAttribute("data-bind-tel"));
    if (val) el.setAttribute("href", "tel:" + val);
  });
  document.querySelectorAll("[data-bind-sms]").forEach((el) => {
    const val = getByPath(data, el.getAttribute("data-bind-sms"));
    if (val) el.setAttribute("href", "sms:" + val);
  });
}

function initNavbar() {
  const nav = document.getElementById("site-navbar");
  const hamburger = document.getElementById("nav-hamburger");
  const mobileMenu = document.getElementById("nav-mobile-menu");
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        nav.classList.add("bg-[#fdf8ef]/95", "backdrop-blur-md", "shadow-[0_1px_0_rgba(121,94,63,0.15)]");
        nav.classList.remove("bg-transparent");
      } else {
        nav.classList.remove("bg-[#fdf8ef]/95", "backdrop-blur-md", "shadow-[0_1px_0_rgba(121,94,63,0.15)]");
        nav.classList.add("bg-transparent");
      }
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
  }
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      hamburger.classList.toggle("is-open");
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => mobileMenu.classList.add("hidden"))
    );
  }
}

function initFooterYear() {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
}

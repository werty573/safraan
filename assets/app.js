/* Shared shell: theme, nav, bag, quick view, toast, motion. */
document.documentElement.classList.add("js");
const WA = "18682591409";
const FREE_SHIP = 1000;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

/* theme */
const setTheme = (t) => {
  document.documentElement.setAttribute("data-theme", t);
  $$("[data-theme-toggle] i").forEach((i) => (i.className = t === "dark" ? "ph-light ph-sun" : "ph-light ph-moon"));
  store.set("safraan-theme", t);
};
setTheme(store.get("safraan-theme", "light"));
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-theme-toggle]")) setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

/* mobile menu */
document.addEventListener("click", (e) => {
  if (e.target.closest(".burger")) document.body.classList.toggle("menu-open");
  else if (e.target.closest(".mobile-menu a")) document.body.classList.remove("menu-open");
});

/* bag */
let bag = store.get("safraan-bag", []);
const lineKey = (l) => l.id + "|" + l.size;
const bagCount = () => bag.reduce((n, l) => n + l.qty, 0);
const linePrice = (l) => (l.id === "discovery" ? l.unit : priceFor(findProduct(l.id), l.size));
const subtotal = () => bag.reduce((n, l) => n + linePrice(l) * l.qty, 0);

function addToBag(item, opts = {}) {
  const existing = bag.find((l) => lineKey(l) === lineKey(item));
  if (existing) existing.qty += item.qty || 1;
  else bag.push({ qty: 1, ...item });
  store.set("safraan-bag", bag);
  renderBag();
  const p = findProduct(item.id);
  toast(`${p ? p.name : "Discovery set"} added to your bag`, p ? U(p.img, 120) : U("1784183972601-17a1b00ea05e", 120));
  if (opts.open) openDrawer();
}
function changeQty(key, d) {
  const l = bag.find((x) => lineKey(x) === key);
  if (!l) return;
  l.qty += d;
  if (l.qty <= 0) bag = bag.filter((x) => x !== l);
  store.set("safraan-bag", bag);
  renderBag();
}
function renderBag() {
  const n = bagCount();
  $$(".bag-count").forEach((el) => { el.textContent = n; el.classList.toggle("on", n > 0); });
  const body = $("#bag-body");
  if (!body) return;
  const sub = subtotal();
  const left = Math.max(0, FREE_SHIP - sub);
  $("#ship-msg").innerHTML = left > 0 ? `You are <b>${money(left)}</b> away from free islandwide delivery` : "Your order ships free, islandwide";
  $("#ship-fill").style.width = Math.min(100, (sub / FREE_SHIP) * 100) + "%";
  if (!bag.length) {
    body.innerHTML = `<div class="drawer-empty"><i class="ph-light ph-drop"></i><h4>Your bag is empty</h4><p>Start with a 10 ml decant. It is the easiest way to find your signature.</p><a class="btn btn-ink" href="index.html#shop" data-close>Browse the collection<span class="isle"><i class="ph-light ph-arrow-up-right"></i></span></a></div>`;
    $("#bag-foot").hidden = true;
    return;
  }
  $("#bag-foot").hidden = false;
  body.innerHTML = bag.map((l) => {
    const p = findProduct(l.id);
    const name = p ? p.name : "Discovery set";
    const img = p ? U(p.img, 200) : U("1784183972601-17a1b00ea05e", 200);
    const size = p ? SIZES.find((s) => s.key === l.size).label : l.note;
    return `<div class="line"><img src="${img}" alt="${name}"><div><h4>${name}</h4><small>${size}</small><div class="qty"><button aria-label="Decrease" data-q="${lineKey(l)}" data-d="-1"><i class="ph-light ph-minus"></i></button><span>${l.qty}</span><button aria-label="Increase" data-q="${lineKey(l)}" data-d="1"><i class="ph-light ph-plus"></i></button></div></div><div class="right"><span>${money(linePrice(l) * l.qty)}</span><button class="rm" data-q="${lineKey(l)}" data-d="-999">Remove</button></div></div>`;
  }).join("");
  const ship = left > 0 ? 45 : 0;
  $("#sum-sub").textContent = money(sub);
  $("#sum-ship").textContent = ship ? money(ship) : "Free";
  $("#sum-total").textContent = money(sub + ship);
}
document.addEventListener("click", (e) => {
  const q = e.target.closest("[data-q]");
  if (q) changeQty(q.dataset.q, +q.dataset.d);
  if (e.target.closest("[data-open-bag]")) { e.preventDefault(); openDrawer(); }
  if (e.target.closest("[data-close]") || e.target.closest(".scrim")) closeAll();
  if (e.target.closest("#checkout")) checkout();
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

function lockScroll(on) {
  document.documentElement.style.overflow = on ? "hidden" : "";
  if (window.lenis) on ? window.lenis.stop() : window.lenis.start();
}
function openDrawer() { closeAll(true); $("#drawer").classList.add("on"); $(".scrim").classList.add("on"); lockScroll(true); }
function openModal(id) { closeAll(true); $(id).classList.add("on"); $(".scrim").classList.add("on"); lockScroll(true); }
function closeAll(keepScrim) {
  $$(".drawer.on, .modal.on").forEach((el) => el.classList.remove("on"));
  if (!keepScrim) { $(".scrim")?.classList.remove("on"); lockScroll(false); }
}
function checkout() {
  if (!bag.length) return;
  const lines = bag.map((l) => {
    const p = findProduct(l.id);
    return `- ${l.qty} x ${p ? p.name + " (" + SIZES.find((s) => s.key === l.size).label + ")" : "Discovery set: " + l.note} = ${money(linePrice(l) * l.qty)}`;
  });
  const sub = subtotal();
  const msg = `Hello Safraan, I would like to order:\n${lines.join("\n")}\nSubtotal: ${money(sub)}\nDelivery: ${sub >= FREE_SHIP ? "Free" : money(45)}\n\nName:\nAddress:`;
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
}

/* toast */
let toastT;
function toast(text, img) {
  const t = $("#toast");
  if (!t) return;
  t.innerHTML = `${img ? `<img src="${img}" alt="">` : ""}<span>${text}</span><button data-open-bag>View bag</button>`;
  t.classList.add("on");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("on"), 3200);
}

/* quick view */
function stars(r) {
  const full = Math.round(r);
  return Array.from({ length: 5 }, (_, i) => `<i class="ph-${i < full ? "fill" : "light"} ph-star"></i>`).join("");
}
function sizeButtons(p, active) {
  return SIZES.map((s) => `<button class="size ${s.key === active ? "on" : ""}" data-size="${s.key}">${s.label}<small>${money(priceFor(p, s.key))}</small></button>`).join("");
}
function quickView(id) {
  const p = findProduct(id);
  if (!p) return;
  let size = "50", qty = 1;
  const m = $("#qv");
  const paint = () => {
    m.querySelector(".core").innerHTML = `<button class="icon-btn close-x" data-close aria-label="Close"><i class="ph-light ph-x"></i></button>
      <div class="qv"><div class="qv-media"><img src="${U(p.img, 1000)}" alt="${p.name} bottle"></div>
      <div class="qv-body"><div><span class="meta">${p.origin}, ${p.family}</span><h3>${p.name}</h3></div>
      <div class="rating">${stars(p.rating)} <span>${p.rating} from ${p.reviews} reviews</span></div>
      <p class="lede">${p.desc}</p>
      <dl class="pyr"><dt>Top</dt><dd>${p.top.join(", ")}</dd><dt>Heart</dt><dd>${p.heart.join(", ")}</dd><dt>Base</dt><dd>${p.base.join(", ")}</dd></dl>
      <div class="sizes">${sizeButtons(p, size)}</div>
      <div class="add-row"><div class="qty"><button aria-label="Decrease" data-qv="-1"><i class="ph-light ph-minus"></i></button><span>${qty}</span><button aria-label="Increase" data-qv="1"><i class="ph-light ph-plus"></i></button></div>
      <button class="btn btn-ink" id="qv-add">Add to bag, ${money(priceFor(p, size) * qty)}<span class="isle"><i class="ph-light ph-handbag"></i></span></button></div>
      <a href="product.html?id=${p.id}" class="meta" style="text-decoration:underline;text-underline-offset:3px">See full details</a></div></div>`;
  };
  paint();
  m.onclick = (e) => {
    const s = e.target.closest("[data-size]");
    if (s) { size = s.dataset.size; paint(); }
    const q = e.target.closest("[data-qv]");
    if (q) { qty = Math.max(1, qty + +q.dataset.qv); paint(); }
    if (e.target.closest("#qv-add")) { addToBag({ id: p.id, size, qty }); closeAll(); }
  };
  openModal("#qv");
}
document.addEventListener("click", (e) => {
  const q = e.target.closest("[data-quick]");
  if (q) { e.preventDefault(); quickView(q.dataset.quick); }
});

/* product card */
function cardHTML(p) {
  return `<article class="card" data-reveal>
    <div class="card-media bezel"><div class="core">
      ${p.tag ? `<span class="card-tag ${p.tag === "Bestseller" ? "hot" : ""}">${p.tag}</span>` : ""}
      <a href="product.html?id=${p.id}" class="card-link"><img loading="lazy" src="${U(p.img, 800)}" alt="${p.name}, ${p.conc.toLowerCase()}"></a>
      <div class="card-notes"><div><small>Notes</small><span>${[p.top[0], p.heart[0], p.base[0]].join(", ")}</span></div><button class="quick" data-quick="${p.id}">Quick add<i class="ph-light ph-plus"></i></button></div>
    </div></div>
    <div class="card-info"><div><h3><a href="product.html?id=${p.id}">${p.name}</a></h3><span class="meta">${p.origin}, ${p.conc}</span></div>
    <div class="price">${money(p.price)}<small>from ${money(priceFor(p, "10"))}</small></div></div>
  </article>`;
}

/* nav hide on scroll down (driven by ScrollTrigger, not a scroll listener) */
function initMotion() {
  renderBag();
  if (!window.gsap) { $$("[data-reveal]").forEach((el) => el.removeAttribute("data-reveal")); return; }
  gsap.registerPlugin(ScrollTrigger);
  if (!reduceMotion && window.Lenis) {
    const lenis = new Lenis({ lerp: 0.1 });
    window.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
      const t = $(a.getAttribute("href"));
      if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -20 }); }
    }));
  }
  const nav = $(".nav");
  ScrollTrigger.create({
    start: 200, end: "max",
    onUpdate: (self) => nav.classList.toggle("hide", self.isActive && self.direction === 1 && !document.body.classList.contains("menu-open")),
    onLeaveBack: () => nav.classList.remove("hide"),
  });
  revealAll();
}
function revealAll() {
  if (!window.gsap) return;
  if (reduceMotion) { gsap.set("[data-reveal]", { opacity: 1, y: 0, filter: "none" }); return; }
  ScrollTrigger.batch("[data-reveal]:not(.shown)", {
    start: "top 88%",
    onEnter: (els) => {
      els.forEach((el) => el.classList.add("shown"));
      gsap.to(els, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "expo.out", stagger: 0.08 });
    },
  });
}

/* Home page: shop grid, atlas, anatomy, discovery builder, reviews, scent finder. */

/* marquee */
const MARQ = [
  ["Kashmiri saffron", "1560076124-fe336393ef76"], ["Comoros ylang", "1586964272329-606304ad0436"],
  ["Omani frankincense", "1770217535698-dd125e5d36c5"], ["Bourbon vanilla", "1592788174877-3f99727fd23d"],
  ["Taif rose", "1531874824027-2a0d33bd6338"], ["Zanzibar clove", "1525289722380-f5bf1653d504"],
];
const marqHTML = MARQ.map(([t, id]) => `<span class="marquee-item"><img src="${U(id, 200)}" alt="">${t}<i class="ph-light ph-asterisk"></i></span>`).join("");
$("#marquee").innerHTML = marqHTML + marqHTML;

/* shop */
let fam = "All";
const filtersEl = $("#filters");
filtersEl.innerHTML = FAMILIES.map((f) => `<button class="chip ${f === fam ? "on" : ""}" role="tab" data-fam="${f}">${f}</button>`).join("");
function renderGrid() {
  const q = $("#q").value.trim().toLowerCase();
  const sort = $("#sort").value;
  let list = PRODUCTS.filter((p) => fam === "All" || p.family === fam);
  if (q) list = list.filter((p) => [p.name, p.origin, p.family, ...p.top, ...p.heart, ...p.base].join(" ").toLowerCase().includes(q));
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "rated") list = [...list].sort((a, b) => b.rating - a.rating);
  $("#grid").innerHTML = list.length
    ? list.map(cardHTML).join("")
    : `<div class="empty"><i class="ph-light ph-flask"></i><h3>Nothing matches "${q.replace(/[<>"]/g, "")}"</h3><p class="lede" style="margin:0 auto 24px">Try a note like vanilla, rose or oud, or let the scent finder pick for you.</p><button class="btn btn-ink" data-quiz>Find your scent<span class="isle"><i class="ph-light ph-sparkle"></i></span></button></div>`;
  if (window.ScrollTrigger) { revealAll(); ScrollTrigger.refresh(); }
}
function setFam(f) {
  fam = f;
  $$(".chip", filtersEl).forEach((c) => c.classList.toggle("on", c.dataset.fam === f));
  renderGrid();
}
filtersEl.addEventListener("click", (e) => { const c = e.target.closest("[data-fam]"); if (c) setFam(c.dataset.fam); });
$("#q").addEventListener("input", renderGrid);
$("#sort").addEventListener("change", renderGrid);
$$("[data-family]").forEach((t) => t.addEventListener("click", () => {
  setFam(t.dataset.family);
  window.lenis ? window.lenis.scrollTo("#shop", { offset: -20 }) : $("#shop").scrollIntoView({ behavior: "smooth" });
}));
renderGrid();

/* atlas */
const ATLAS = [
  { place: "Kashmir", coord: "34.08 N, 74.79 E", img: "1760982685713-09d7212b84d1", line: "Crocus fields that bloom for three weeks a year.", pid: "saffron-atlas" },
  { place: "Grande Comore", coord: "11.70 S, 43.25 E", img: "1586964272329-606304ad0436", line: "Ylang-ylang distilled within hours of picking.", pid: "ylang-comore" },
  { place: "Dhofar", coord: "17.02 N, 54.09 E", img: "1512917860049-18d416baa831", line: "Silver frankincense tapped from Boswellia trees.", pid: "dhofar-smoke" },
  { place: "Nosy Be", coord: "13.33 S, 48.26 E", img: "1682482198446-4cbf92f85a4b", line: "Vanilla pods cured in the sun for months.", pid: "nosy-be-vanilla" },
  { place: "Bali", coord: "8.34 S, 115.09 E", img: "1642070723756-6defe28609e8", line: "Temple frangipani that scents the whole island at dusk.", pid: "frangipani-lune" },
  { place: "Stone Town", coord: "6.16 S, 39.19 E", img: "1663325265966-0d17de3e85c5", line: "The clove markets that built the spice trade.", pid: "zanzibar-clove" },
];
$("#atlas-track").innerHTML = ATLAS.map((s) => `<article class="stop">
    <div class="bezel"><div class="core"><img loading="lazy" src="${U(s.img, 900)}" alt="${s.line}"></div></div>
    <div class="stop-cap"><h3>${s.place}</h3><span>${s.coord}</span></div>
    <div class="stop-cap" style="padding-top:2px;flex-direction:column;align-items:flex-start;gap:8px"><p style="padding:0">${s.line}</p><a href="product.html?id=${s.pid}">Wear it in ${findProduct(s.pid).name} <i class="ph-light ph-arrow-right"></i></a></div>
  </article>`).join("") + `<div class="atlas-end"><h3 class="display" style="font-size:clamp(2rem,3vw,2.8rem)">Smell all six for TT$260.</h3><a href="#discovery" class="btn btn-ink">Build a discovery set<span class="isle"><i class="ph-light ph-arrow-up-right"></i></span></a></div>`;

/* discovery builder */
let picks = [];
function renderDisc() {
  $("#vials").innerHTML = Array.from({ length: 5 }, (_, i) => {
    const p = picks[i] && findProduct(picks[i]);
    return `<div class="vial ${p ? "full" : ""}">${p ? `<img src="${U(p.img, 200)}" alt="${p.name}">` : `<i class="ph-light ph-plus"></i>`}</div>`;
  }).join("");
  $("#picks").innerHTML = PRODUCTS.map((p) => {
    const on = picks.includes(p.id);
    return `<button class="pick ${on ? "on" : ""}" data-pick="${p.id}" ${!on && picks.length >= 5 ? "disabled" : ""} aria-pressed="${on}"><img src="${U(p.img, 120)}" alt=""><span><b>${p.name}</b><small>${p.family}</small></span></button>`;
  }).join("");
  $("#disc-n").textContent = `${picks.length} of 5 chosen`;
  $("#disc-add").disabled = picks.length < 5;
}
$("#picks").addEventListener("click", (e) => {
  const b = e.target.closest("[data-pick]");
  if (!b) return;
  const id = b.dataset.pick;
  picks = picks.includes(id) ? picks.filter((x) => x !== id) : picks.length < 5 ? [...picks, id] : picks;
  renderDisc();
});
$("#disc-add").addEventListener("click", () => {
  const note = picks.map((id) => findProduct(id).name).join(", ");
  addToBag({ id: "discovery", size: picks.slice().sort().join("+"), unit: 260, note }, { open: true });
  picks = [];
  renderDisc();
});
renderDisc();

/* reviews */
const REVIEWS = [
  { q: "I wore Saffron Atlas to a wedding in Chaguanas and three aunties asked what it was. It lasted until the next morning.", n: "Anisa Mohammed", m: "Chaguanas, bought Saffron Atlas", img: "1716857591457-7d7fa45199c6" },
  { q: "The discovery set made it easy. I ordered on WhatsApp at lunch and it reached San Fernando in two days.", n: "Kerron Joseph", m: "San Fernando, bought the discovery set", img: "1784183972601-17a1b00ea05e" },
  { q: "Ylang Comore smells expensive without being loud. It survives the heat, which most florals do not.", n: "Renee Sealy", m: "Diego Martin, bought Ylang Comore", img: "1720423514789-15a33e59fc81" },
];
let ri = 0;
$("#rev-stack").innerHTML = REVIEWS.map((r, i) => `<div class="bezel" data-r="${i}"><div class="core"><img loading="lazy" src="${U(r.img, 900)}" alt=""></div></div>`).join("");
function paintRev(dir = 1) {
  const r = REVIEWS[ri];
  $$("#rev-stack .bezel").forEach((el) => {
    const k = (+el.dataset.r - ri + REVIEWS.length) % REVIEWS.length;
    el.style.zIndex = REVIEWS.length - k;
    el.style.transform = k === 0 ? "none" : `translate(${k * 22}px, ${-k * 18}px) rotate(${k * 3}deg) scale(${1 - k * 0.05})`;
    el.style.opacity = k === 0 ? 1 : 0.55 - k * 0.12;
  });
  const qEl = $("#rev-quote");
  if (window.gsap && !reduceMotion) gsap.fromTo([qEl, "#rev-name", "#rev-meta"], { opacity: 0, y: 14 * dir }, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.05 });
  qEl.textContent = "“" + r.q + "”";
  $("#rev-name").textContent = r.n;
  $("#rev-meta").textContent = r.m;
}
$("#rev-next").addEventListener("click", () => { ri = (ri + 1) % REVIEWS.length; paintRev(1); });
$("#rev-prev").addEventListener("click", () => { ri = (ri - 1 + REVIEWS.length) % REVIEWS.length; paintRev(-1); });
paintRev();

/* newsletter */
$("#news").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = $("#email").value.trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  $("#news-msg").textContent = ok ? "You are on the list. Watch your inbox for the next launch." : "Please enter a valid email address.";
  if (ok) $("#email").value = "";
});

/* scent finder */
const QUIZ = [
  { q: "When will you wear it most?", key: "time", a: [
    { v: "day", t: "Daytime", s: "Work, errands, brunch", img: "1765498069280-b863094c17bf" },
    { v: "evening", t: "After dark", s: "Dinners, fetes, dates", img: "1770217535698-dd125e5d36c5" } ] },
  { q: "Pick the texture you are drawn to.", key: "temp", a: [
    { v: "fresh", t: "Cool and clean", s: "Citrus, green, airy", img: "1586964272329-606304ad0436" },
    { v: "warm", t: "Warm and deep", s: "Spice, resin, vanilla", img: "1663325265966-0d17de3e85c5" } ] },
  { q: "How should people notice you?", key: "vol", a: [
    { v: "soft", t: "Up close", s: "A skin scent for those near you", img: "1572495754162-78a92305ea6a" },
    { v: "bold", t: "Across the room", s: "A trail people remember", img: "1754146282712-f238a371b970" } ] },
  { q: "Which of these feels like you?", key: "fam", a: [
    { v: "Spice", t: "A spice market", s: "Saffron, clove, pepper", img: "1525289722380-f5bf1653d504" },
    { v: "Florals", t: "A temple garden", s: "Ylang, frangipani", img: "1642070723756-6defe28609e8" },
    { v: "Woods & Resins", t: "A cedar forest", s: "Oud, frankincense, cedar", img: "1743309043742-9b4976a16478" },
    { v: "Ambers", t: "A vanilla farm", s: "Vanilla, tonka, rum", img: "1592788174877-3f99727fd23d" } ] },
];
let qi = 0, qa = {};
function matchScent() {
  const score = (p) => (p.mood.includes(qa.time) ? 2 : 0) + (p.mood.includes(qa.temp) ? 2 : 0) + (p.mood.includes(qa.vol) ? 1 : 0) + (p.family === qa.fam ? 3 : 0) + p.rating / 10;
  return [...PRODUCTS].sort((a, b) => score(b) - score(a));
}
function paintQuiz() {
  const core = $("#quiz .core");
  const prog = `<div class="quiz-progress">${QUIZ.map((_, i) => `<i class="${i <= qi ? "on" : ""}"></i>`).join("")}</div>`;
  const close = `<button class="icon-btn close-x" data-close aria-label="Close"><i class="ph-light ph-x"></i></button>`;
  if (qi < QUIZ.length) {
    const s = QUIZ[qi];
    core.innerHTML = close + prog + `<div class="quiz-step"><span class="meta" style="color:var(--mute);font-size:14px">Question ${qi + 1} of ${QUIZ.length}</span><h3 style="margin-top:8px">${s.q}</h3><div class="answers">${s.a.map((a) => `<button class="answer" data-ans="${a.v}"><img src="${U(a.img, 200)}" alt=""><span><b>${a.t}</b><small>${a.s}</small></span></button>`).join("")}</div>${qi ? `<button class="meta" data-back style="margin-top:28px;color:var(--mute);text-decoration:underline;text-underline-offset:3px">Back</button>` : ""}</div>`;
  } else {
    const [best, alt] = matchScent();
    core.innerHTML = close + prog + `<div class="quiz-step result"><div class="bezel"><div class="core"><img src="${U(best.img, 800)}" alt="${best.name}"></div></div>
      <div><span style="color:var(--accent);font-weight:500;font-size:14px">Your match</span><h3 style="margin-top:6px">${best.name}</h3><p>${best.desc} If you want a second option, try ${alt.name}.</p>
      <div class="acts"><button class="btn btn-ink" data-quiz-add="${best.id}">Add a 10 ml decant, ${money(priceFor(best, "10"))}<span class="isle"><i class="ph-light ph-handbag"></i></span></button><button class="btn btn-ghost plain" data-restart>Start again</button></div></div></div>`;
  }
}
$("#quiz").addEventListener("click", (e) => {
  const a = e.target.closest("[data-ans]");
  if (a) { qa[QUIZ[qi].key] = a.dataset.ans; qi++; paintQuiz(); }
  if (e.target.closest("[data-back]")) { qi--; paintQuiz(); }
  if (e.target.closest("[data-restart]")) { qi = 0; qa = {}; paintQuiz(); }
  const add = e.target.closest("[data-quiz-add]");
  if (add) { addToBag({ id: add.dataset.quizAdd, size: "10" }); closeAll(); }
});
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-quiz]")) { e.preventDefault(); document.body.classList.remove("menu-open"); qi = 0; qa = {}; paintQuiz(); openModal("#quiz"); }
});

/* motion */
initMotion();
if (window.gsap && !reduceMotion) {
  gsap.from(".hero-in", { y: 40, opacity: 0, filter: "blur(8px)", duration: 1.3, ease: "expo.out", stagger: 0.1, delay: 0.1 });
  gsap.from(".hero-frame", { clipPath: "inset(18% 12% 18% 12% round 28px)", duration: 1.6, ease: "expo.out" });
  gsap.from(".hero-float", { y: 60, opacity: 0, duration: 1.4, ease: "expo.out", delay: 0.5 });
  gsap.to("#hero-img", { scale: 1, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero-float", { yPercent: -40, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* manifesto scrub: split text nodes into words, keep image pills */
  const man = $("#manifesto");
  [...man.childNodes].forEach((n) => {
    if (n.nodeType !== 3) return;
    const frag = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach((w) => {
      if (!w.trim()) return frag.append(w);
      const s = document.createElement("span");
      s.className = "w"; s.textContent = w; frag.append(s);
    });
    n.replaceWith(frag);
  });
  gsap.to("#manifesto .w", { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: man, start: "top 78%", end: "bottom 42%", scrub: true } });
  gsap.from("#manifesto .pill-img", { scale: 0.4, opacity: 0, stagger: 0.2, ease: "expo.out", scrollTrigger: { trigger: man, start: "top 75%", end: "bottom 50%", scrub: true } });

  /* atlas horizontal pan on wide screens */
  gsap.matchMedia().add("(min-width: 861px)", () => {
      const track = $("#atlas-track");
      const dist = () => track.scrollWidth - window.innerWidth;
      const tw = gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: "#atlas", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } });
      gsap.utils.toArray(".stop img").forEach((img) => gsap.fromTo(img, { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img, containerAnimation: tw, start: "left right", end: "right left", scrub: true } }));
  });
} else {
  $$("#manifesto .w").forEach((w) => (w.style.opacity = 1));
}

/* anatomy: swap image per step (works with or without reduced motion) */
if (window.ScrollTrigger) {
  const imgs = $$("#anat-imgs img");
  const labels = ["Saffron Atlas, extrait de parfum", "Top: saffron and pink pepper", "Heart: Taif rose and suede", "Base: oud and ambergris"];
  $$(".anat-step").forEach((step) => ScrollTrigger.create({
    trigger: step, start: "top 55%", end: "bottom 55%",
    onToggle: (self) => {
      if (!self.isActive) return;
      const i = +step.dataset.step;
      imgs.forEach((im, k) => im.classList.toggle("on", k === i));
      $("#anat-label").textContent = labels[i];
    },
  }));
}
window.addEventListener("load", () => window.ScrollTrigger && ScrollTrigger.refresh());
if (location.hash === "#quiz") { paintQuiz(); openModal("#quiz"); }

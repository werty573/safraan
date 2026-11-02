/* Product detail page. */
const pid = new URLSearchParams(location.search).get("id");
const p = findProduct(pid) || PRODUCTS[0];
document.title = `${p.name} | Safraan`;
let size = "50", qty = 1;
const others = PRODUCTS.filter((x) => x.family === p.family && x.id !== p.id).concat(PRODUCTS.filter((x) => x.family !== p.family));
const MOOD_IMG = { Spice: "1560076124-fe336393ef76", "Woods & Resins": "1639390167093-9c62311fe84d", Florals: "1586964272329-606304ad0436", Ambers: "1592788174877-3f99727fd23d", Fresh: "1765498069280-b863094c17bf" };

function paintBuy() {
  $("#buy-box").innerHTML = `
    <div class="buy-price">${money(priceFor(p, size) * qty)}</div>
    <div class="sizes">${sizeButtons(p, size)}</div>
    <div class="add-row"><div class="qty"><button aria-label="Decrease" data-pq="-1"><i class="ph-light ph-minus"></i></button><span>${qty}</span><button aria-label="Increase" data-pq="1"><i class="ph-light ph-plus"></i></button></div>
    <button class="btn btn-ink" id="pdp-add">Add to bag<span class="isle"><i class="ph-light ph-handbag"></i></span></button></div>`;
}
$("#pdp").innerHTML = `
  <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><i class="ph-light ph-caret-right"></i><a href="index.html#shop">${p.family}</a><i class="ph-light ph-caret-right"></i><span>${p.name}</span></nav>
  <div class="pdp-grid">
    <div class="gallery">
      <div class="bezel"><div class="core"><img src="${U(p.img, 1400)}" alt="${p.name} bottle"></div></div>
      <div class="bezel" data-reveal><div class="core"><img loading="lazy" src="${U(MOOD_IMG[p.family], 900)}" alt="${p.family} raw material"></div></div>
      <div class="bezel" data-reveal><div class="core"><img loading="lazy" src="${U("1784183972601-17a1b00ea05e", 900)}" alt="Perfume being sprayed on a wrist"></div></div>
    </div>
    <div class="buy">
      <div><span class="eyebrow">${p.origin}, ${p.family}</span><h1 class="display" style="margin-top:18px">${p.name}</h1></div>
      <div class="rating">${stars(p.rating)}<span>${p.rating} from ${p.reviews} reviews</span></div>
      <p class="lede">${p.desc}</p>
      <div id="buy-box" style="display:flex;flex-direction:column;gap:18px"></div>
      <div class="trust"><span><i class="ph-light ph-seal-check"></i>Authentic, batch coded</span><span><i class="ph-light ph-truck"></i>Islandwide in 2 to 4 days</span><span><i class="ph-light ph-arrow-counter-clockwise"></i>14-day returns on sealed bottles</span></div>
      <div class="acc">
        <details open><summary>The notes<i class="ph-light ph-plus"></i></summary><div><dl class="pyr"><dt>Top</dt><dd>${p.top.join(", ")}</dd><dt>Heart</dt><dd>${p.heart.join(", ")}</dd><dt>Base</dt><dd>${p.base.join(", ")}</dd></dl></div></details>
        <details><summary>Wear and longevity<i class="ph-light ph-plus"></i></summary><div>${p.conc}. Expect 8 to 12 hours on skin and longer on fabric. Two sprays on the neck and one on the wrist is plenty in the heat.</div></details>
        <details><summary>Delivery and payment<i class="ph-light ph-plus"></i></summary><div>Orders placed before 2 p.m. leave our partner warehouse the same day. Pay by card link or cash on delivery. Free delivery over TT$1,000.</div></details>
        <details><summary>About decants<i class="ph-light ph-plus"></i></summary><div>Our 10 ml decants are filled from the same sealed bottles into glass atomisers. They travel well and last around 120 sprays.</div></details>
      </div>
    </div>
  </div>`;
paintBuy();
$("#pdp").addEventListener("click", (e) => {
  const s = e.target.closest("[data-size]");
  if (s) { size = s.dataset.size; paintBuy(); }
  const q = e.target.closest("[data-pq]");
  if (q) { qty = Math.max(1, qty + +q.dataset.pq); paintBuy(); }
  if (e.target.closest("#pdp-add")) addToBag({ id: p.id, size, qty }, { open: true });
});
const acts = [["Top", "The first 15 minutes", p.top], ["Heart", "Hours one to four", p.heart], ["Base", "Into the next day", p.base]];
$("#pyr").innerHTML = acts.map(([t, w, n]) => `<div class="bezel" data-reveal><div class="core"><span class="when">${w}</span><h4>${t}</h4><div class="note-list">${n.map((x) => `<span>${x}</span>`).join("")}</div></div></div>`).join("");
$("#related").innerHTML = others.slice(0, 3).map(cardHTML).join("");
initMotion();

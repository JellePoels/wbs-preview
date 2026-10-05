/*
 * De enige JavaScript op deze site. Bewuste uitzondering, zie CLAUDE.md.
 *
 * Waarom dit bestand bestaat:
 *   1. De Google Maps-embed laadt pas na een klik. Daarvoor plaatst Google
 *      geen cookies en ziet het je IP-adres niet. Dat scheelt een cookiebanner.
 *   2. Zolang de kaart niet geladen is, kun je er ongehinderd langs scrollen.
 *   3. Google zet in deze embed geen zoomknoppen op de kaart. Slepen en
 *      knijpen werkt wel, maar op een laptop scrollt de pagina mee zodra je
 *      boven de kaart scrollt. Daarom zetten we er zelf een plus en een min
 *      naast; die veranderen het zoomniveau in de kaart-URL.
 *
 * Zonder JavaScript blijft de knop een gewone link naar Google Maps, dus
 * niemand loopt vast.
 */
(function () {
  var houder = document.querySelector("[data-kaart]");
  if (!houder) return;

  var knop = houder.querySelector("[data-kaart-knop]");
  if (!knop) return;

  var MIN = 6, MAX = 20;
  var basis = houder.getAttribute("data-kaart");
  var zoom = Number((basis.match(/[?&]z=(\d+)/) || [])[1]) || 16;
  var frame;

  function url() {
    return basis.replace(/([?&]z=)\d+/, "$1" + zoom);
  }

  function zoomknop(teken, label, stap) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "kaart-zoom";
    b.textContent = teken;
    b.setAttribute("aria-label", label);
    b.addEventListener("click", function () {
      var nieuw = Math.min(MAX, Math.max(MIN, zoom + stap));
      if (nieuw === zoom) return;
      zoom = nieuw;
      frame.src = url();
      b.parentNode.querySelectorAll(".kaart-zoom").forEach(function (k) {
        k.disabled = false;
      });
      if (zoom === MAX || zoom === MIN) b.disabled = true;
    });
    return b;
  }

  knop.addEventListener("click", function (e) {
    e.preventDefault();

    frame = document.createElement("iframe");
    frame.src = url();
    frame.title = houder.getAttribute("data-kaart-titel") || "Kaart";
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.setAttribute("allow", "fullscreen");
    frame.style.cssText = "border:0;display:block;width:100%;height:500px";

    var bediening = document.createElement("div");
    bediening.className = "kaart-bediening";
    bediening.appendChild(zoomknop("−", "Uitzoomen", -1));
    bediening.appendChild(zoomknop("+", "Inzoomen", 1));

    var wikkel = document.createElement("div");
    wikkel.className = "kaart-wikkel";
    wikkel.appendChild(frame);
    wikkel.appendChild(bediening);

    houder.replaceChildren(wikkel);
    frame.focus();
  });
})();

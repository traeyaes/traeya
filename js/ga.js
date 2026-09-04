/* ---------- Google Analytics 4 (GA4) ----------
   Tracking ligero y anónimo para TRAEYA.
   - Instalación única de GA4 (sin duplicados).
   - ID de medición configurable en UN solo sitio (abajo).
   - Eventos semánticos para el embudo TraeYa.
   - NO se envían datos personales (nombre, teléfono, dirección, mensajes).

   Cómo cambiar el ID de GA4: edita GA_MEASUREMENT_ID con tu
   Measurement ID (formato G-XXXXXXXXXX).
*/
(function () {
  var GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

  /* Carga el Google tag (gtag.js) una sola vez y configura la propiedad.
     Se inyecta en el <head> para no bloquear el render, con async. */
  (function install() {
    if (window.ga && window.ga.loaded) return; /* ya instalado */
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, { send_page_view: true });
    window._traeya_gtag = true;
  })();

  var TYPES = {
    carniceria: "carniceria", bazar: "bazar", farmacia: "farmacia", mercado: "mercado",
    supermercado: "supermercado", restaurante: "restaurante", tienda24: "tienda24",
    "comida-casera": "comida_casera", bodega: "bodega", locutorio: "locutorio",
    panaderia: "panaderia", barberia: "barberia", tabacos: "tabacos", floristeria: "floristeria",
  };
  function shopParams(shop) {
    if (!shop) return {};
    return {
      business_name: shop.slug,
      business_type: TYPES[shop.type] || shop.type || "otro",
    };
  }
  function send(name, params) {
    try {
      if (window.gtag) gtag("event", name, params || {});
    } catch (e) { /* nunca romper la web por tracking */ }
  }

  /* Cliente ve/abre un comercio. */
  window.trackViewBusiness = function (shop) { send("view_business", shopParams(shop)); };

  /* Cliente pulsa un botón/enlace de WhatsApp. */
  window.trackWhatsApp = function (shop) { send("click_whatsapp", shopParams(shop)); };

  /* Cliente envía un pedido (flujo TraeYa). */
  window.trackSubmitOrder = function (shop) { send("submit_order", shopParams(shop)); };

  /* Cliente elige idioma (es / ar). */
  window.trackSelectLanguage = function (lang) { send("select_language", { language: lang === "ar" ? "ar" : "es" }); };

  /* Delegación global: detecta cualquier enlace de WhatsApp (wa.me) y lo
     registra como click_whatsapp. Cubre botones flotantes, pie, hero y
     enlaces generales sin duplicar los que ya pasan por openWA(). */
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href^='https://wa.me/'], a[href^='http://wa.me/']") : null;
    if (a) send("click_whatsapp", {});
  }, true);
})();

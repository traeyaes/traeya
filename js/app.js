/* ============================================================
   TRAEYA · El Raal, en tu móvil
   SPA: router, i18n (ES/AR RTL), render, carrito, WhatsApp
   ============================================================ */
"use strict";

/* global TRAEYA_DATA */
const D = window.TRAEYA_DATA;
const CFG = D.config;

/* ---------- Redes sociales (configuración central) ----------
   TODO: cuando tengas la URL real de Facebook, rellénala abajo.
   Instagram y TikTok están activos y abren sus perfiles directos.
   Facebook se muestra deshabilitado hasta que se proporcione su
   enlace real (no se inventa ninguna URL). */
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/traeya.es/",
  tiktok: "https://www.tiktok.com/@traeya.es1",
  facebook: "", // TODO: rellenar con la URL real de Facebook
};

/* ---------- Entrega (configuración central) ----------
   Precios de entrega definidos por el proyecto (data.js → config.delivery).
   El Raal 2 € · Mercado Domingo 5 € · Fuera de El Raal 3 € · Comida Casera GRATIS */
const DELIVERY = Object.assign(
  { el_raul: 2.0, mercado: 5.0, fuera_el_raul: 3.0, comida_casera: 0.0 },
  (CFG && CFG.delivery) || {}
);

function deliveryFor(shop) {
  if (!shop) return { amount: 0, free: true };
  if (shop.slug === "comida-casera") return { amount: DELIVERY.comida_casera, free: true };
  if (shop.slug === "mercado-domingo") return { amount: DELIVERY.mercado, free: false };
  if (shop.locality === "el-raul") return { amount: DELIVERY.el_raul, free: false };
  return { amount: DELIVERY.fuera_el_raul, free: false };
}

/* ---------- Estado de apertura (hora de Murcia / España) ----------
   Calculado según la zona horaria Europe/Madrid (DST incluido), nunca
   según el reloj del visitante. Normal/resto: 10-14 y 17-22 (pausa 14-17).
   Tabacos: 10-14 y 17-20. SPAR: cerrado todo el domingo. Venticuatro: 24h. */
function murciaNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Madrid" }));
}
function shopStatus(shop) {
  const d = murciaNow();
  const mins = d.getHours() * 60 + d.getMinutes();
  const day = d.getDay();
  const slug = shop.slug;
  const openL = "ABIERTO", pauseL = "EN PAUSA", closedL = "CERRADO";
  if (slug === "venticoitros-24") return { code: "open", label: openL };
  if (slug === "spar-express" && day === 0) return { code: "closed", label: closedL };
  if (shop.type === "tabacos") {
    if (mins >= 600 && mins < 840) return { code: "open", label: openL };
    if (mins >= 840 && mins < 1020) return { code: "pause", label: pauseL };
    if (mins >= 1020 && mins < 1200) return { code: "open", label: openL };
    return { code: "closed", label: closedL };
  }
  if (mins >= 600 && mins < 840) return { code: "open", label: openL };
  if (mins >= 840 && mins < 1020) return { code: "pause", label: pauseL };
  if (mins >= 1020 && mins < 1320) return { code: "open", label: openL };
  return { code: "closed", label: closedL };
}

const I18N = {
  es: {
    brandSub: "El Raal · Murcia",
    heroEyebrow: "TRAEYA · El Raal, Murcia",
    heroTitle: "Tu pueblo, en tu móvil.",
    heroSub: "Los comercios de El Raal, reales y cercanos. Mira, escribe y recoge. Todo por WhatsApp.",
    heroCta: "Entrar en El Raal",
    heroCtaWa: "Hablar por WhatsApp",
    navShops: "Comercios",
    navMarket: "Mercado",
    navComida: "LA COSINA DEL MIMA",
    navNeed: "¿Qué necesitas?",
    introKicker: "Bienvenido a El Raal",
    introLead: "El Raal está abierto. <em>TRAEYA</em> acerca sus comercios a tu móvil.",
    introSub: "Sin catálogos infinitos ni páginas genéricas. Los lugares reales de tu pueblo, cada uno con su historia.",
    feature1: ["Comercios reales", "Las fachadas y los productos que ves son los de El Raal."],
    feature2: ["Cercano", "Pide desde tu sofá y recoge en pocos minutos."],
    feature3: ["Por WhatsApp", "Un solo mensaje. Sin apps, sin cuentas, sin esperas."],
    discoverKicker: "Descubre El Raal",
    discoverTitle: "Un paseo por el pueblo",
    discoverSub: "Fachadas y rincones reales de El Raal, tal y como los encontrarás al llegar.",
    marketKicker: "Cada domingo",
    marketTitle: "El Mercado de <em>El Raal</em>",
    marketBody: "Cada domingo, El Raal cobra vida. Descubre los puestos, productos y sabores de nuestro mercado en un solo lugar.",
    marketCta: "Ver Mercado",
    comidaKicker: "Hecho en casa",
    comidaTitle: "La <em>Cosina</em> del Mima",
    comidaBody: "Cuscús, tajín, harira, msemen… los platos de siempre, preparados del día.",
    comidaCta: "Ver los platos",
    carnTitle: "Carnicerías",
    carnSub: "Carnes halal, ternera, pollo y alimentación de confianza.",
    catTitle: "Categorías",
    catSub: "Elige qué necesitas y te llevamos hasta el comercio de El Raal que lo tiene.",
    superTitle: "Supermercados",
    superSub: "Lo de cada día, cerca de casa.",
    restTitle: "Restaurantes",
    restSub: "Los restaurantes de El Raal y alrededores.",
    otherTitle: "Otros comercios",
    otherSub: "Farmacia, bazares y servicios del pueblo.",
    otherTitleLocs: "En otros pueblos",
    otherSubLocs: "TRAEYA va creciendo. Estos comercios también están en la red.",
    needKicker: "Message first",
    needTitle: "¿Qué necesitas?",
    needSub: "Escribe qué quieres y te lo dejamos listo. Te avisamos cuando puedas pasar a recoger.",
    needPlaceholder: "Ej.: 2 kg de tomates del Mercado",
    needBtn: "Pedir por WhatsApp",
    needChips: ["Mercado Domingo", "LA COSINA DEL MIMA", "Carnicería", "Restaurantes", "Farmacia"],
    footerCtaTitle: "Tu pueblo, <em>a un mensaje</em>.",
    footerCtaSub: "Escribe al WhatsApp de TRAEYA y lo resolvemos.",
    footerCtaBtn: "Escribir a TRAEYA",
    footerAbout: "TRAEYA es la red de los comercios de El Raal. Fotos y fachadas reales del pueblo.",
    footerColShops: "Comercios",
    footerColMore: "Más",
    footerMade: "Hecho para El Raal · Murcia",
    backHome: "Volver a El Raal",
    tagMarket: "Mercado",
    tagEverySunday: "Cada domingo",
    productsLabel: "Productos",
    priceAsk: "Precio a consultar",
    priceFrom: "Desde ",
    emptyTitle: "Este comercio está en El Raal",
    emptyBody: "Todavía no hemos publicado su lista. Escríbenos por WhatsApp y te ayudamos a pedir.",
    alsoHere: "También disponible aquí",
    alsoHereSub: "Fotografías reales de este comercio.",
    showMore: "Ver más",
    galleryLabel: "Galería",
    askFor: "Añadir al pedido",
    askShopTitle: "¿Qué estás buscando?",
    askShopSub: "Escríbenos lo que necesitas y te ayudamos.",
    askShopPlaceholder: "Ej.: medio kilo de carne picada, dos brochetas, 1 kg de cebollas…",
    askShopBtn: "Enviar por WhatsApp",
    productsCount: (n) => n + (n === 1 ? " producto" : " productos"),
    waGeneric: "Hola TRAEYA, necesito ",
    waShop: "Hola TRAEYA, quiero pedir en",
    gateTitle: "¿En qué idioma quieres continuar?",
    gateSub: "El Raal · Murcia",
    gateHint: "Puedes cambiarlo más tarde.",
    gateSave: "Guardar TRAEYA",
    gateSaveSub: "Guarda nuestro contacto en tu móvil y pide cuando quieras.",
    socialFollow: "Síguenos",
    socialSoon: "Próximamente",
    cartAdd: "Añadir",
    cartAdded: "✓ Añadido",
    cartEmpty: "Tu pedido está vacío",
    cartShop: "Tienda",
    cartItems: "artículos",
    cartUnit: "u.",
    cartTotal: "Total",
    cartNote: "Nota (opcional)",
    cartNotePh: "Ej.: a partir de las 19:00",
    cartSend: "Enviar por WhatsApp",
    cartKeep: "Seguir viendo",
    cartView: "Ver pedido",
    cartRemove: "Quitar",
    cartNoPrices: "Algunos precios se confirman en el comercio.",
    cartSubtotal: "Productos",
    cartDelivery: "Entrega",
    cartDeliveryFree: "GRATIS",
    deliveryKicker: "Entrega",
    deliveryTitle: "¿Cómo funciona la <em>entrega</em>?",
    deliverySub: "Pide por WhatsApp y recoge donde te venga mejor. El coste de la entrega es claro y sencillo.",
    deliveryFree: "GRATIS",
    deliveryElRaal: "En El Raal",
    deliveryElRaalSub: "Entrega a domicilio en El Raal",
    deliveryMercado: "Mercado Domingo",
    deliveryMercadoSub: "Tu pedido del mercado, en tu puerta",
    deliveryFuera: "Fuera de El Raal",
    deliveryFueraSub: "Santomera, Beniel y alrededores",
    deliveryComida: "LA COSINA DEL MIMA",
    deliveryComidaSub: "Entrega siempre gratis",
    deliveryNote: "Recogida en el comercio sin coste. La entrega se confirma por WhatsApp.",
    deliveryShop: "Entrega",
    deliveryShopFree: "Entrega gratis",
    menuKicker: "Menú",
    menuHint: "La carta real del restaurante.",
    marketKickerShop: "El Mercado Domingo",
    marketTitleShop: "Un paseo por el <em>souk</em>",
    marketBodyShop: "Cada domingo El Raal cobra vida. Así se vive el mercado, en su ambiente.",
    marketVid1: "El souk, en movimiento",
    marketVid2: "Entre puestos y productos",
    productsOf: "de",
    locality: { "el-raul": "El Raal", santomera: "Santomera", beniel: "Beniel" },
    type: {
      carniceria: "Carnicería", bazar: "Bazar", farmacia: "Farmacia", mercado: "Mercado",
      supermercado: "Supermercado", restaurante: "Restaurante", tienda24: "Tienda 24h",
      "comida-casera": "LA COSINA DEL MIMA",
      bodega: "Bodega", locutorio: "Locutorio", panaderia: "Panadería",
      barberia: "Barbería", tabacos: "Tabacos", floristeria: "Floristería",
    },
    shopNameAr: {
      "carniceria-el-pelin": "جزارة البيلين",
      "carniceria-boujaad": "جزارة ومونة بوجاد الحاج",
      "carniceria-halal-said": "جزارة ومونة حلال سعيد",
      "chino-1": "البازار الصيني 1",
      "chino-2": "البازار الصيني 2",
      "comida-casera": "LA COSINA DEL MIMA",
      "farmacia-haro": "صيدلية هارو",
      "mercado-domingo": "سوق الأحد",
      "mercadona-santomera": "ميركادونا سانتوميرا",
      "kebab-casa-mayor": "مطعم كباب كازا مايور",
      "kebab-khan-ali-beniel": "مطعم كباب خان علي بينيل",
      "restaurante-patricia": "مطعم باتريسيا",
      "the-hot-buffalo": "ذا هوت بافالو",
      "kebab-khan-ali-el-raal": "مطعم كباب خان علي الرال",
      "consum-el-raal": "سوبرماركت كونسوم الرال",
      "supermercado-plaza-de-juan": "سوبرماركت بلازا دي خوان",
      "spar-express": "سوبرماركت سبار إكسبريس",
      "venticoitros-24": "فينتيكويتروس 24",
      "bodega-asun": "بوديكة أسون",
      "locutorio-tienda-ayoub": "لوكوتيوريو تienda أيوب",
      "panaderia-la-boutique-del-pan": "مخبزة بوتيك ديال بان",
      "barberia-ayoub": "حلاقة أيوب",
      "tabacos-2-el-raal": "تبغى 2 الرال",
      "tabacos-el-raal": "تبغى الرال",
      "comercial-soto-y-maiquez": "سوتو وماكيز",
      "garden-center-el-parral": "حديقة البارال",
      "supermercado-navarro": "سوبرماركت نافارو",
      "boca-pizza": "بوكا بيتزا",
    },
    /* --- Descubre El Raal --- */
    descubreTitle: "Descubre <em>El Raal</em>",
    descubreSub: "Un paseo por el pueblo. Todos los comercios de El Raal, reales y cercanos.",
    /* --- TikTok LIVE --- */
    liveBadge: "EN DIRECTO",
    liveBadgeSub: "Cada domingo en TikTok",
    /* --- Comida Casera pre-order --- */
    comidaPreTitle: "Encarga con <em>antelación</em>",
    comidaPreSub: "Los platos que requieren preparación previa deben encargarse con al menos 3 horas de antelación.",
    comidaAdv: "Pedido con 3 horas de antelación",
    comidaAvail: "Disponible normalmente",
    comidaOrder: "Encargar",
    comidaWant: "Quiero pedir",
    comidaAskTitle: "¿Qué te apetece? 🍽️",
    comidaAskSub: "Dinos qué quieres y te lo preparamos.",
    comidaAskNote: "Los platos que requieren preparación previa deben encargarse con al menos 3 horas de antelación.",
    /* --- Farmacia receta --- */
    recetaTitle: "Envía tu receta",
    recetaSub: "Envíanos una foto de tu receta y te ayudamos a preparar tu pedido.",
    recetaPick: "Seleccionar imagen",
    recetaPreview: "Vista previa",
    recetaRemove: "Quitar",
    recetaSend: "Enviar por WhatsApp",
    recetaHint: "La imagen se enviará por WhatsApp. Adjúntala en el chat.",
    recetaMsg: "Hola TRAEYA, quiero enviar una receta médica para preparar mi pedido.",
    /* --- Horario --- */
    horarioTitle: "Horario",
    horarioClosed: "Cerrado",
    horarioDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    horarioDaysShort: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  },

  ar: {
    brandSub: "الرال · مرسية",
    heroEyebrow: "ترايا · الرال، مرسية",
    heroTitle: "مدينتك، في جوالك.",
    heroSub: "محلات الرال، حقيقية وقريبة. شاهد، اكتب، واستلم. كل شيء عبر واتساب.",
    heroCta: "ادخل إلى الرال",
    heroCtaWa: "تحدث معنا واتساب",
    navShops: "المحلات",
    navMarket: "السوق",
    navComida: "LA COSINA DEL MIMA",
    navNeed: "بماذا تحتاج؟",
    introKicker: "مرحباً بك في الرال",
    introLead: "الرال مفتوح. <em>ترايا</em> تقرّب محلاته إلى جوالك.",
    introSub: "بدون كتالوجات لا نهائية أو صفحات عامة. الأماكن الحقيقية لمدينتك، لكل واحد قصته.",
    feature1: ["محلات حقيقية", "الواجهات والمنتجات التي تراها هي محلات الرال نفسها."],
    feature2: ["قريب", "اطلب من مكانك واستلم خلال دقائق."],
    feature3: ["عبر واتساب", "رسالة واحدة فقط. بدون تطبيقات أو حسابات أو انتظار."],
    discoverKicker: "اكتشف الرال",
    discoverTitle: "جولة في المدينة",
    discoverSub: "واجهات وأماكن حقيقية من الرال، كما ستجدها عند وصولك.",
    marketKicker: "كل أحد",
    marketTitle: "سوق الأحد <em>بالرال</em>",
    marketBody: "كل أحد، الرال ينبض بالحياة. اكتشف البسطات والمنتجات والنكهات من سوقنا في مكان واحد.",
    marketCta: "عرض السوق",
    comidaKicker: "مصنوع في البيت",
    comidaTitle: "لا <em>كوسينا</em> ديل ميما",
    comidaBody: "كسكس، طاجين، حريرة، مسمن… أطباق الدار، محضرة كل يوم.",
    comidaCta: "عرض الأطباق",
    carnTitle: "الجزارات",
    carnSub: "لحوم حلال، لحم بقر، دجاج وأغذية موثوقة.",
    catTitle: "الفئات",
    catSub: "اختر ما تحتاجه وسنوصلك إلى محل الرال الذي يملكه.",
    superTitle: "السوبرماركت",
    superSub: "حاجياتك اليومية، قريبة من البيت.",
    restTitle: "المطاعم",
    restSub: "مطاعم الرال والمناطق المجاورة.",
    otherTitle: "محلات أخرى",
    otherSub: "صيدلية، بازارات وخدمات المدينة.",
    otherTitleLocs: "في مدن أخرى",
    otherSubLocs: "ترايا تكبر. هذه المحلات أيضاً ضمن الشبكة.",
    needKicker: "رسالة أولاً",
    needTitle: "بماذا تحتاج؟",
    needSub: "اكتب ما تريد وسنتركه جاهزاً لك. نرسل لك رسالة عندما يكون بإمكانك الاستلام.",
    needPlaceholder: "مثال: 2 كيلو طماطم من السوق",
    needBtn: "اطلب عبر واتساب",
    needChips: ["سوق الأحد", "الطعام المنزلي", "الجزارة", "المطاعم", "الصيدلية"],
    footerCtaTitle: "مدينتك، <em>برسالة واحدة</em>.",
    footerCtaSub: "اكتب إلى واتساب ترايا وسنحل الأمر.",
    footerCtaBtn: "اكتب إلى ترايا",
    footerAbout: "ترايا هي شبكة محلات الرال. صور وواجهات حقيقية من المدينة.",
    footerColShops: "المحلات",
    footerColMore: "المزيد",
    footerMade: "صنع لـ الرال · مرسية",
    backHome: "العودة إلى الرال",
    tagMarket: "سوق",
    tagEverySunday: "كل أحد",
    productsLabel: "المنتجات",
    priceAsk: "استشر السعر",
    priceFrom: "من ",
    emptyTitle: "هذا المحل موجود في الرال",
    emptyBody: "لم ننشر قائمته بعد. اكتب لنا عبر واتساب وسنساعدك في الطلب.",
    alsoHere: "متوفر أيضاً هنا",
    alsoHereSub: "صور حقيقية من هذا المحل.",
    showMore: "عرض المزيد",
    galleryLabel: "المعرض",
    askFor: "أضف إلى الطلب",
    askShopTitle: "عم تبحث؟",
    askShopSub: "اكتب ما تحتاجه وسنساعدك.",
    askShopPlaceholder: "مثال: نصف كيلو لحم مفروم، حبتا بروشيت، 1 كيلو بصل…",
    askShopBtn: "أرسل عبر واتساب",
    productsCount: (n) => n + (n === 1 ? " منتج" : " منتجات"),
    waGeneric: "مرحباً ترايا، أحتاج ",
    waShop: "مرحباً ترايا، أريد أن أطلب من",
    gateTitle: "بأي لغة تريد المتابعة؟",
    gateSub: "الرال · مرسية",
    gateHint: "يمكنك تغييرها لاحقاً.",
    gateSave: "احفظ TRAEYA",
    gateSaveSub: "احفظ رقمنا في هاتفك واطلب منا وقتما تحتاج.",
    socialFollow: "تابعنا",
    socialSoon: "قريباً",
    cartAdd: "أضف",
    cartAdded: "✓ أضيف",
    cartEmpty: "طلبك فارغ",
    cartShop: "المتجر",
    cartItems: "منتجات",
    cartUnit: "قطعة",
    cartTotal: "المجموع",
    cartNote: "ملاحظة (اختياري)",
    cartNotePh: "مثال: بعد الساعة 19:00",
    cartSend: "أرسل عبر واتساب",
    cartKeep: "متابعة التسوق",
    cartView: "عرض الطلب",
    cartRemove: "إزالة",
    cartNoPrices: "بعض الأسعار تُؤكد في المحل.",
    cartSubtotal: "المنتجات",
    cartDelivery: "التوصيل",
    cartDeliveryFree: "مجاناً",
    deliveryKicker: "التوصيل",
    deliveryTitle: "كيف يعمل <em>التوصيل</em>؟",
    deliverySub: "اطلب عبر واتساب واستلم من المكان الذي يناسبك. تكلفة التوصيل واضحة وبسيطة.",
    deliveryFree: "مجاناً",
    deliveryElRaal: "داخل الرال",
    deliveryElRaalSub: "التوصيل إلى المنزل داخل الرال",
    deliveryMercado: "سوق الأحد",
    deliveryMercadoSub: "طلبك من السوق حتى باب بيتك",
    deliveryFuera: "خارج الرال",
    deliveryFueraSub: "سانتوميرا، بينيل والمناطق المجاورة",
    deliveryComida: "LA COSINA DEL MIMA",
    deliveryComidaSub: "التوصيل دائماً مجاناً",
    deliveryNote: "الاستلام من المحل بدون تكلفة. التوصيل يُؤكد عبر واتساب.",
    deliveryShop: "التوصيل",
    deliveryShopFree: "توصيل مجاني",
    menuKicker: "المنيو",
    menuHint: "قائمة المطعم الحقيقية.",
    marketKickerShop: "سوق الأحد",
    marketTitleShop: "جولة في <em>السوق</em>",
    marketBodyShop: "كل أحد، الرال ينبض بالحياة. هكذا يُعاش السوق في أجوائه الحقيقية.",
    marketVid1: "السوق في حركة",
    marketVid2: "بين البسطات والمنتجات",
    productsOf: "من",
    locality: { "el-raul": "الرال", santomera: "سانتوميرا", beniel: "بينيل" },
    type: {
      carniceria: "جزارة", bazar: "بازار", farmacia: "صيدلية", mercado: "سوق",
      supermercado: "سوبرماركت", restaurante: "مطعم", tienda24: "متجر 24 ساعة",
      "comida-casera": "LA COSINA DEL MIMA",
      bodega: "بوديكة", locutorio: "لوكوتيوريو", panaderia: "مخبزة",
      barberia: "حلاقة", tabacos: "تبغى", floristeria: "محل ورود وزراعة",
    },
    shopNameAr: {
      "carniceria-el-pelin": "جزارة البيلين",
      "carniceria-boujaad": "جزارة ومونة بوجاد الحاج",
      "carniceria-halal-said": "جزارة ومونة حلال سعيد",
      "chino-1": "البازار الصيني 1",
      "chino-2": "البازار الصيني 2",
      "comida-casera": "LA COSINA DEL MIMA",
      "farmacia-haro": "صيدلية هارو",
      "mercado-domingo": "سوق الأحد",
      "mercadona-santomera": "ميركادونا سانتوميرا",
      "kebab-casa-mayor": "مطعم كباب كازا مايور",
      "kebab-khan-ali-beniel": "مطعم كباب خان علي بينيل",
      "restaurante-patricia": "مطعم باتريسيا",
      "the-hot-buffalo": "ذا هوت بافالو",
      "kebab-khan-ali-el-raal": "مطعم كباب خان علي الرال",
      "consum-el-raal": "سوبرماركت كونسوم الرال",
      "supermercado-plaza-de-juan": "سوبرماركت بلازا دي خوان",
      "spar-express": "سوبرماركت سبار إكسبريس",
      "venticoitros-24": "فينتيكويتروس 24",
      "bodega-asun": "بوديكة أسون",
      "locutorio-tienda-ayoub": "لوكوتيوريو تienda أيوب",
      "panaderia-la-boutique-del-pan": "مخبزة بوتيك ديال بان",
      "barberia-ayoub": "حلاقة أيوب",
      "tabacos-2-el-raal": "تبغى 2 الرال",
      "tabacos-el-raal": "تبغى الرال",
      "comercial-soto-y-maiquez": "سوتو وماكيز",
      "garden-center-el-parral": "حديقة البارال",
      "supermercado-navarro": "سوبرماركت نافارو",
      "boca-pizza": "بوكا بيتزا",
    },
    /* --- Descubre El Raal --- */
    descubreTitle: "اكتشف <em>الرال</em>",
    descubreSub: "جولة في المدينة. جميع محلات الرال، حقيقية وقريبة.",
    /* --- TikTok LIVE --- */
    liveBadge: "مباشر",
    liveBadgeSub: "كل أحد على تيك توك",
    /* --- Comida Casera pre-order --- */
    comidaPreTitle: "اطلب <em>مسبقاً</em>",
    comidaPreSub: "الأطباق التي تحتاج تحضيراً مسبقاً يجب طلبها قبل 3 ساعات على الأقل.",
    comidaAdv: "طلب مسبق — 3 ساعات",
    comidaAvail: "متوفر عادةً",
    comidaOrder: "اطلب مسبقاً",
    comidaWant: "أريد أن أطلب",
    comidaAskTitle: "شنو بغيتي؟ 🍽️",
    comidaAskSub: "قول لينا شنو بغيتي ونحضروه ليك.",
    comidaAskNote: "الأطباق التي تحتاج تحضيراً مسبقاً يجب طلبها قبل 3 ساعات على الأقل.",
    /* --- Farmacia receta --- */
    recetaTitle: "أرسل وصفتك",
    recetaSub: "أرسل لنا صورة وصفتك وسنساعدك في تحضير طلبك.",
    recetaPick: "اختر صورة",
    recetaPreview: "معاينة",
    recetaRemove: "إزالة",
    recetaSend: "أرسل عبر واتساب",
    recetaHint: "ستُرسل الصورة عبر واتساب. أرفقها في المحادثة.",
    recetaMsg: "مرحباً ترايا، أريد أن أرسل وصفة طبية لتحضير طلبي.",
    /* --- Horario --- */
    horarioTitle: "ساعات العمل",
    horarioClosed: "مغلق",
    horarioDays: ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
    horarioDaysShort: ["اثن", "ثلا", "أرب", "خمي", "جمع", "سبت", "أحد"],
  },
};

/* ---------- State ---------- */
const STATE = {
  lang: localStorage.getItem("traeya.lang") ||
    (navigator.language && navigator.language.toLowerCase().startsWith("ar") ? "ar" : "es"),
  shop: null,
  galleryCounts: {},
};

const t = (key, fnArgs) => {
  const v = I18N[STATE.lang][key];
  return typeof v === "function" ? v(fnArgs) : v;
};

const WA = (text) => "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(text.trim());

/* ---------- DOM helpers ---------- */
const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

function el(tag, attrs, ...contents) {
  const n = document.createElement(tag);
  if (attrs) {
    for (const k in attrs) {
      const v = attrs[k];
      if (v == null) continue;
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else if (k === "style") n.setAttribute("style", v);
      else n.setAttribute(k, v);
    }
  }
  const flat = contents.flat(Infinity).filter((c) => c != null);
  if (flat.length === 1 && typeof flat[0] === "string") {
    n.innerHTML = flat[0];
  } else {
    n.append(...flat);
  }
  return n;
}

const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const fmtPrice = (n) => new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + " €";
const displayName = (p) => STATE.lang === "ar" ? (p.name_ar || p.name_es || p.id) : (p.name_es || p.name_ar || p.id);

/* --- Rebranding / overrides por tienda ---
   Mantenemos los slugs y rutas internos (comida-casera) a la vez que mostramos
   el nombre comercial deseado en toda la interfaz. */
const SHOP_TITLE = { "comida-casera": "LA COSINA DEL MIMA" };
const SHOP_ASSET_OVERRIDE = {
  "comida-casera": {
    facade: "assets/img/facades/la-cosina-del-mima.webp",
    menu: "assets/img/menus/la-cosina-del-mima-menu.webp",
  },
};
const shopTitle = (s) => SHOP_TITLE[s.slug] || s.name;
const shopOverride = (s) => SHOP_ASSET_OVERRIDE[s.slug] || {};
const shopFacade = (s) => (shopOverride(s).facade) || s.facade || (D.galleries[s.slug] && D.galleries[s.slug][0]) || null;
const shopMenu = (s) => (shopOverride(s).menu) || s.menu || null;

const shopBg = (s) => shopFacade(s);

/* --- Marketing personalizado por tipo de comercio ---
   Cada tienda recibe un mensaje de bienvenida y un ejemplo propio en su
   buscador, en ES y AR. Se permite un override por slug (tiendas concretas). */
const MARKETING = {
  carniceria: {
    es: "🥩 Carne fresca y calidad para tu mesa.",
    ar: "🥩 لحم طازج بجودة عالية لمائدتك.",
    ph: "Ej: 1 kg de ternera, medio kilo de pollo o 4 hamburguesas",
    phAr: "مثال: 1 كلغ لحم بقري، نصف كلغ دجاج أو 4 برغر",
  },
  supermercado: {
    es: "🛒 Todo lo que necesitas para tu día a día, más cerca de ti.",
    ar: "🛒 كل ما تحتاجه ليومك، أقرب منك.",
    ph: "Ej: 1 litro de leche, pan, huevos y arroz",
    phAr: "مثال: 1 لتر حليب، خبز، بيض وأرز",
  },
  farmacia: {
    es: "💊 Tu farmacia de confianza. Cuéntanos qué necesitas y te ayudaremos.",
    ar: "💊 صيدليتك الموثوقة. قل لنا ما تحتاجه وسنساعدك.",
    ph: "Ej: Paracetamol, vitaminas o crema solar",
    phAr: "مثال: باراسيتامول، فيتامينات أو كريم شمسي",
  },
  restaurante: {
    es: "🍽️ Disfruta de buena comida y elige lo que más te apetece.",
    ar: "🍽️ استمتع بطعام جيد واختر ما يشهيك أكثر.",
    ph: "Ej: Un plato de pollo, una ensalada y una bebida",
    phAr: "مثال: طبق دجاج، سلطة ومشروب",
  },
  mercado: {
    es: "🥕 Lo mejor del Mercado del Domingo, directamente para ti.",
    ar: "🥕 أفضل ما في سوق الأحد، مباشرة إلى بابك.",
    ph: "Ej: 1 kg de tomates, patatas, naranjas y fresas",
    phAr: "مثال: 1 كلغ طماطم، بطاطس، برتقال وفراولة",
  },
  "comida-casera": {
    es: "❤️ Bienvenido a LA COSINA DEL MIMA. Comida casera hecha con cariño, como en casa. ¿Qué te apetece hoy? Cuéntanos qué quieres comer y te lo preparamos con cariño.",
    ar: "❤️ مرحباً بكم في لا كوسينا ديل ميمـا. طعام منزلي محضّر بحب، مثل البيت. شحال تحب تأكل اليوم؟ قل لنا شنو بغيتي ونحضروه لك بحب.",
    ph: "Ej: Un cuscús para 2 personas, tajín o harira",
    phAr: "مثال: كسكس لشخصين، طاجين أو حريرة",
  },
  bazar: {
    es: "🏪 Tu tienda de barrio. Todo lo que necesitas para el día a día, más cerca de ti.",
    ar: "🏪 متجر الحيّ. كل ما تحتاجه ليومك، أقرب منك.",
    ph: "Ej: una cerveza, una baguette, una botella de agua",
    phAr: "مثال: بيرة، باكيت، قنينة ماء",
  },
  tabacos: {
    es: "🚬 Tu estanco de confianza. Tabaco, cigarrillos, bebidas y snacks.",
    ar: "🚬 مخزنك الموثوق. تبغ، سجائر، مشروبات ومقبلات.",
    ph: "Ej: Marlboro, una cerveza, una bebida",
    phAr: "مثال: مارلبورو، بيرة، مشروب",
  },
  floristeria: {
    es: "💐 Flores, plantas y jardín para tu hogar.",
    ar: "💐 ورود ونباتات وحديقة لمنزلك.",
    ph: "Ej: un ramo de rosas, una planta, tierra para macetas",
    phAr: "مثال: باقة ورود، نبتة، تربة للأصص",
  },
};
const MARKETING_OVERRIDE = {
  "carniceria-boujaad": {
    es: "🥩 Bienvenido a Carnicería El Haj, tu carnicería de confianza en El Raal. Carne fresca y productos seleccionados para tu mesa.",
    ar: "🥩 مرحباً بكم في جزارة الحاج، جزارتكم الموثوقة بالرال. لحم طازج ومنتجات مختارة لمائدتكم.",
    ph: "Ej: 1 kg de ternera, medio kilo de pollo o 4 hamburguesas",
    phAr: "مثال: 1 كلغ لحم بقري، نصف كلغ دجاج أو 4 برغر",
  },
  "the-hot-buffalo": {
    es: "🔥 Sabor intenso para los que tienen hambre de verdad.",
    ar: "🔥 نكهة قوية لمن جاعوا بجد.",
    ph: "Ej: 6 alitas, una hamburguesa y patatas",
    phAr: "مثال: 6 أجنحة، برغر وبطاطس",
  },
  "mercadona-santomera": {
    es: "🛒 Todo lo que necesitas para tu compra diaria, fácil y cerca de ti.",
    ar: "🛒 كل ما تحتاجه لتسوقك اليومي، بسهولة وقريب منك.",
    ph: "Ej: 1 litro de leche, pan, huevos y arroz",
    phAr: "مثال: 1 لتر حليب، خبز، بيض وأرز",
  },
  "barberia-ayoub": {
    es: "💈 Bienvenido a la Barbería Ayoub. Pide tu servicio de barbería favorito y reserva tu hora.",
    ar: "💈 مرحباً بك في حلاقة أيوب. اطلب خدمة الحلاقة المفضلة لديك واحجز موعدك.",
    ph: "Buscar servicios o productos… Ej: Corte de pelo, Corte + barba, Fade / Degradado, Arreglo de barba…",
    phAr: "ابحث عن الخدمات أو المنتجات… مثال: قص شعر، قص + لحية، فايد / دغرع، ترتيب اللحية…",
  },
};
function marketingFor(shop) {
  const override = MARKETING_OVERRIDE[shop.slug] || MARKETING[shop.type];
  if (!override) return null;
  return STATE.lang === "ar"
    ? { title: override.ar, placeholder: override.phAr }
    : { title: override.es, placeholder: override.ph };
}

function openWA(text) { window.open(WA(text), "_blank", "noopener"); }

/* Sugerencias de búsqueda (chips) por comercio. Solo se muestran si existen. */
const SEARCH_SUGGESTIONS = {
  "barberia-ayoub": {
    es: ["Corte de pelo", "Corte + barba", "Fade / Degradado", "Arreglo de barba", "Perfilado de barba", "Lavado de pelo", "Peinado", "Champú", "Gel para el cabello", "Cera / Pomada", "Aceite para barba"],
    ar: ["قص شعر", "قص + لحية", "فايد / دغرعدو", "ترتيب اللحية", "تنعيم اللحية", "غسل الشعر", "تسريحة", "شامبو", "جل للشعر", "شمع / بوماد", "زيت للحية"],
  },
};
function searchSuggestionsFor(shop) {
  const all = SEARCH_SUGGESTIONS[shop.slug];
  return all ? (STATE.lang === "ar" ? all.ar : all.es) : null;
}

/* ---------- Redes sociales ---------- */
function socialIcon(name) {
  const svg = {
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>',
  };
  return svg[name] || "";
}

function socialList() {
  const list = el("div", { class: "social" });
  [
    { key: "instagram", label: "Instagram", href: SOCIAL_LINKS.instagram },
    { key: "tiktok", label: "TikTok", href: SOCIAL_LINKS.tiktok },
    { key: "facebook", label: "Facebook", href: SOCIAL_LINKS.facebook },
  ].forEach((s, i) => {
    const attrs = {
      class: "social__link" + (s.href ? "" : " is-off"),
      style: "--i:" + i,
      "aria-label": s.label,
      title: s.href ? s.label : s.label + " · " + t("socialSoon"),
      html: socialIcon(s.key)
    };
    if (s.href) { attrs.href = s.href; attrs.target = "_blank"; attrs.rel = "noopener"; }
    else attrs["aria-disabled"] = "true";
    list.append(el(s.href ? "a" : "span", attrs));
  });
  return list;
}

/* ---------- Cart ---------- */
const Cart = {
  items: new Map(),
  shop: null,
  _persist() {
    try { localStorage.setItem("traeya.cart", JSON.stringify([...this.items.entries()])); } catch (e) { /* noop */ }
    CartBar.render();
  },
  _load() {
    try {
      const raw = localStorage.getItem("traeya.cart");
      if (raw) this.items = new Map(JSON.parse(raw));
      if (this.items.size) {
        const first = [...this.items.values()][0];
        this.shop = D.shops.find((s) => s.slug === first.shop) || null;
      }
    } catch (e) { /* noop */ }
  },
  add(shop, product) {
    if (this.shop && this.shop.slug !== shop.slug) this.items.clear();
    this.shop = shop;
    const key = shop.slug + "::" + product.id;
    const cur = this.items.get(key);
    this.items.set(key, { shop: shop.slug, id: product.id, qty: (cur ? cur.qty : 0) + 1 });
    this._persist();
    return this.items.get(key).qty;
  },
  setQty(shopSlug, productId, qty) {
    const key = shopSlug + "::" + productId;
    if (qty <= 0) this.items.delete(key);
    else this.items.set(key, { shop: shopSlug, id: productId, qty });
    if (!this.items.size) this.shop = null;
    this._persist();
  },
  clear() {
    this.items.clear();
    this.shop = null;
    this._persist();
  },
  total() {
    let n = 0;
    this.items.forEach((it) => { n += it.qty; });
    return n;
  },
  entries() { return [...this.items.values()]; },
  productsFor(shop) {
    return this.entries()
      .filter((it) => it.shop === shop.slug)
      .map((it) => {
        const p = shop.products.find((x) => x.id === it.id) || { id: it.id };
        return { ...it, product: p };
      });
  },
};

/* ---------- Topbar / Footer / Float / Gate / Cart UI ---------- */
function renderTopbar() {
  const bar = $("#topbar");
  bar.hidden = false;
  bar.innerHTML = "";
  const social = el("div", { class: "topbar__social" },
    el("div", { class: "topbar__social-inner" },
      el("span", { class: "topbar__social-tag", html: t("socialFollow") }),
      socialList(),
      el("span", { class: "topbar__social-loc", html: esc(t("brandSub")) })
    )
  );
  const inner = el("div", { class: "topbar__inner" });
  inner.append(
    el("a", { class: "brand", href: "#/", onclick: () => route(),
      html: '<span class="brand__mark">TRAEYA<span>.</span></span><span class="brand__sub">' + esc(t("brandSub")) + "</span>" }),
    el("nav", { class: "topnav" }, [
      el("a", { class: "topnav__link", href: "#/", html: t("navShops"), onclick: (e) => { e.preventDefault(); location.hash = "#/"; setTimeout(() => goSection("comercios"), 60); } }),
      el("a", { class: "topnav__link", href: "#/", html: t("navMarket"), onclick: (e) => { e.preventDefault(); location.hash = "#/"; setTimeout(() => goSection("market"), 60); } }),
      el("a", { class: "topnav__link", href: "#/", html: t("navComida"), onclick: (e) => { e.preventDefault(); location.hash = "#/"; setTimeout(() => goSection("comida"), 60); } }),
    ]),
    el("button", { class: "btn btn--wa btn--small topnav__need", html: t("navNeed"), onclick: () => { location.hash = "#/"; setTimeout(() => goSection("need"), 60); } }),
    el("button", { class: "btn btn--ghost btn--small topnav__save", type: "button", onclick: saveContact, html: t("gateSave") })
  );
  const lang = el("div", { class: "lang" });
  lang.append(
    el("button", { class: "lang__btn" + (STATE.lang === "es" ? " on" : ""), "data-lang": "es", html: "ES" }),
    el("button", { class: "lang__btn" + (STATE.lang === "ar" ? " on" : ""), "data-lang": "ar", html: "عربي" })
  );
  $$(".lang__btn", lang).forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
  inner.append(lang);
  bar.append(social, inner);
  updateTopbar();
}

function updateTopbar() {
  $("#topbar").classList.toggle("topbar--solid", window.scrollY > 30);
}

function renderFloat() {
  const float = $("#wa-float");
  float.hidden = false;
  float.innerHTML = "";
  float.append(el("a", { class: "wa-float", href: WA(t("waGeneric") + CFG.brand), target: "_blank", rel: "noopener", "aria-label": "WhatsApp", html: "✆" }));
}

function renderFooter() {
  const foot = $("#footer");
  foot.hidden = false;
  foot.innerHTML = "";
  const raul = D.shops.filter((s) => s.locality === "el-raul");

  const ctaBtn = el("a", { class: "btn btn--wa", href: WA(t("waGeneric") + CFG.brand), target: "_blank", rel: "noopener", html: t("footerCtaBtn") });
  const saveBtn = el("button", { class: "btn btn--primary btn--small", type: "button", onclick: saveContact, html: t("gateSave") });
  const cta = el("section", { class: "footer__cta" },
    el("div", { class: "eyebrow eyebrow--sand", html: "TRAEYA" }),
    el("h2", { html: t("footerCtaTitle") }),
    el("p", { html: t("footerCtaSub") }),
    el("div", { class: "footer__cta-actions" }, [ctaBtn, saveBtn])
  );

  const ulShops = el("ul", null);
  raul.forEach((s) => {
    const li = el("li");
    li.append(el("a", { href: "#/tienda/" + s.slug, html: esc(shopTitle(s)) }));
    ulShops.append(li);
  });
  const colShops = el("div", { class: "footer__col" }, [el("h5", null, t("footerColShops")), ulShops]);

  const ulMore = el("ul", null);
  [["Mercado Domingo", "#/tienda/mercado-domingo"], [shopTitle({ slug: "comida-casera", name: "" }) || "LA COSINA DEL MIMA", "#/tienda/comida-casera"], [t("locality")["el-raul"], "#/"]]
    .forEach(([label, href]) => {
      const li = el("li");
      li.append(el("a", { href, html: label }));
      ulMore.append(li);
    });
  const colMore = el("div", { class: "footer__col" }, [el("h5", null, t("footerColMore")), ulMore]);

  const brandCol = el("div", { class: "footer__brand" },
    el("span", { class: "brand__mark", html: "TRAEYA<span>.</span>" }),
    el("p", { html: t("footerAbout") })
  );

  const langLink = el("a", { href: "#/", html: STATE.lang === "es" ? "العربية" : "Español" });
  langLink.addEventListener("click", (e) => { e.preventDefault(); setLang(STATE.lang === "es" ? "ar" : "es"); });
  const bottom = el("div", { class: "footer__bottom" },
    el("span", null, "© " + CFG.year + " TRAEYA · " + t("footerMade")),
    el("div", { class: "footer__social" }, socialList()),
    el("div", { class: "footer__lang" }, langLink)
  );

  foot.append(
    cta,
    el("div", { class: "footer__body" }, [brandCol, colShops, colMore]),
    bottom
  );
}

function setLang(lang) {
  if (lang === STATE.lang) return;
  STATE.lang = lang;
  localStorage.setItem("traeya.lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  renderTopbar();
  renderFooter();
  renderFloat();
  route();
  window.scrollTo({ top: 0, behavior: "auto" });
}

/* Genera y descarga una tarjeta de contacto .vcf (vCard) de TRAEYA.
   Sin servidor: se crea localmente con un Blob y se descarga. */
function saveContact() {
  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:TRAEYA El Raal",
    "TEL;TYPE=CELL,VOICE:+34743099830",
    "END:VCARD",
  ].join("\r\n");
  try {
    const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "TRAEYA El Raal.vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch (e) {
    /* Fallback: abrir como enlace data:. */
    const a = document.createElement("a");
    a.href = "data:text/vcard;charset=utf-8," + encodeURIComponent(vcf);
    a.download = "TRAEYA El Raal.vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

function renderLangGate() {
  if (localStorage.getItem("traeya.lang")) return;
  const overlay = el("div", { class: "lang-gate", "data-lang-gate": "" });
  const choose = (lang) => {
    localStorage.setItem("traeya.lang", lang);
    STATE.lang = lang;
    applyLangAttrs();
    overlay.classList.add("is-leaving");
    setTimeout(() => {
      overlay.remove();
      document.body.classList.remove("gate-pending");
      renderAll();
    }, 450);
  };
  overlay.append(
    el("div", { class: "lang-gate__card" },
      el("div", { class: "lang-gate__logo", html: 'TRAEYA<span>.</span>' }),
      el("div", { class: "eyebrow lang-gate__eyebrow", html: esc(t("gateSub")) }),
      el("div", { class: "lang-gate__title", html: t("gateTitle") }),
      el("div", { class: "lang-gate__options" },
        el("button", { class: "lang-gate__opt", onclick: () => choose("es") },
          el("span", { class: "lang-gate__flag", html: "🇪🇸" }),
          el("span", { class: "lang-gate__name", html: "Español" })
        ),
        el("button", { class: "lang-gate__opt", onclick: () => choose("ar") },
          el("span", { class: "lang-gate__flag", html: "🇲🇦" }),
          el("span", { class: "lang-gate__name", html: "العربية" })
        )
      ),
      el("div", { class: "lang-gate__save" },
        el("button", { class: "lang-gate__save-btn", type: "button", onclick: saveContact },
          el("span", { class: "lang-gate__save-icon", html: "📱" }),
          el("span", { class: "lang-gate__save-label", html: esc(t("gateSave")) })
        ),
        el("span", { class: "lang-gate__save-sub", html: esc(t("gateSaveSub")) })
      ),
      el("div", { class: "lang-gate__hint", html: t("gateHint") })
    )
  );
  document.body.append(overlay);
}

/* ---------- Reveal + motion ---------- */
let revealObs;
let revealTimer = null;
function observeReveals(root) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $$(".reveal", root).forEach((n) => n.classList.add("is-in"));
    return;
  }
  if (!revealObs) {
    revealObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); revealObs.unobserve(e.target); } });
    }, { threshold: 0.02, rootMargin: "0px 0px -6% 0px" });
  }
  $$(".reveal", root).forEach((n) => {
    const r = n.getBoundingClientRect();
    if (r.top < window.innerHeight) n.classList.add("is-in");
    else revealObs.observe(n);
  });
  clearTimeout(revealTimer);
  revealTimer = setTimeout(() => {
    $$(".reveal").forEach((n) => n.classList.add("is-in"));
  }, 1800);
}

function parallax() {
  const bg = $(".hero__bg");
  if (!bg) return;
  bg.style.transform = "scale(1.02) translateY(" + Math.min(window.scrollY, window.innerHeight) * 0.22 + "px)";
}

/* ---------- Shared blocks ---------- */
function cardFor(s, mediaClass) {
  const bg = shopBg(s);
  const arName = STATE.lang === "ar" ? (I18N[STATE.lang].shopNameAr[s.slug] || "") : "";
  const st = shopStatus(s);
  const statusBadge = el("span", { class: "status-badge status--" + st.code, html: st.label });
  const media = bg
    ? el("div", { class: "card__media " + (mediaClass || "") + " status-frame status--" + st.code }, el("img", { loading: "lazy", src: bg, alt: esc(shopTitle(s)) }), statusBadge)
    : el("div", { class: "card__media " + (mediaClass || "") + " status-frame status--" + st.code },
        el("div", { class: "product-card__fallback", html: esc((shopTitle(s) || "T").charAt(0)) }),
        statusBadge);
  return el("a", { class: "card", href: "#/tienda/" + s.slug, "data-shop": s.slug },
    media,
    el("div", { class: "card__body" },
      el("h3", { class: "card__title", html: esc(shopTitle(s)) }),
      arName ? el("span", { class: "card__ar ar", html: arName }) : null,
      el("div", { class: "card__meta" },
        el("span", { class: "card__type", html: t("type")[s.type] }),
        el("span", { class: "card__locality", html: "· " + t("locality")[s.locality] })
      ),
      el("span", { class: "card__go", html: "↗" })
    )
  );
}

function sectionHead(kicker, title, sub, opts) {
  const o = opts || {};
  const head = el("div", { class: "section-head reveal" });
  if (kicker) head.append(el("div", { class: "eyebrow" + (o.light ? " eyebrow--light" : ""), html: kicker }));
  head.append(el("h2", { class: "section-title", html: title }));
  if (sub) head.append(el("p", { class: "lede", html: sub }));
  return head;
}

function gridSection(id, cssClass, head, cards) {
  return el("section", { class: "section " + cssClass, id: id },
    el("div", { class: "container" },
      head,
      el("div", { class: "commerce-grid" }, cards)
    )
  );
}

function railSection(id, cssClass, head, cards) {
  return el("section", { class: "section " + cssClass, id: id },
    el("div", { class: "container" },
      head,
      el("div", { class: "rail__fade" }, el("div", { class: "rail" }, cards))
    )
  );
}

/* ---------- Home ---------- */
function renderHome() {
  const view = $("#view");
  view.innerHTML = "";
  document.title = "TRAEYA · El Raal · Comercios locales";

  const byType = (types, loc) => D.shops.filter((s) => types.includes(s.type) && (!loc || s.locality === loc));
  const market = D.shops.find((s) => s.slug === "mercado-domingo");
  const comida = D.shops.find((s) => s.slug === "comida-casera");
  const rests = byType(["restaurante"]);
  const others = byType(["farmacia", "bazar", "tienda24", "bodega", "locutorio", "panaderia", "barberia", "tabacos", "floristeria"]);

  /* 1. Hero */
  const hero = el("section", { class: "hero" },
    el("div", { class: "hero__bg", style: "background-image:url('assets/img/hero-el-raal.webp')" }),
    el("div", { class: "hero__content" },
      el("div", { class: "hero__brand", html: "TRAEYA<span>.</span>" }),
      el("div", { class: "hero__eyebrow", html: t("heroEyebrow") }),
      el("h1", { class: "hero__title", html: t("heroTitle").replace(/, ([^<]+)/, ", <em>$1</em>") }),
      el("p", { class: "hero__sub", html: t("heroSub") }),
      el("div", { class: "hero__actions" },
        el("a", { class: "btn btn--primary", href: "#need", onclick: (e) => { e.preventDefault(); goSection("need"); }, html: t("heroCta") }),
        el("a", { class: "btn btn--ghost", href: WA(t("waGeneric")), target: "_blank", rel: "noopener", html: t("heroCtaWa") })
      )
    ),
    el("div", { class: "hero__scroll", "aria-hidden": "true" })
  );

  /* 2. Message First — clean card */
  const needInput = el("input", { class: "need__input", type: "text", placeholder: t("needPlaceholder"), "aria-label": t("needTitle") });
  const needForm = el("form", { class: "need__form" }, [
    needInput,
    el("button", { class: "btn btn--wa", type: "submit", html: t("needBtn") })
  ]);
  needForm.addEventListener("submit", (e) => {
    e.preventDefault();
    openWA(t("waGeneric") + (needInput.value.trim() || t("needPlaceholder")));
  });

  const needChips = el("div", { class: "need__chips" });
  t("needChips").forEach((c) => needChips.append(el("button", { class: "chip", type: "button", html: c })));
  $$(".chip", needChips).forEach((ch) => ch.addEventListener("click", () => {
    const v = ch.textContent;
    if (v.indexOf("سوق") >= 0 || v === "Mercado Domingo") goSection("market");
    else if (v.indexOf("طعام") >= 0 || v === "LA COSINA DEL MIMA") goSection("comida");
    else if (v.indexOf("مطاعم") >= 0 || v === "Restaurantes") goSection("restaurantes");
    else goSection("comercios");
  }));

  const need = el("section", { class: "section need", id: "need" },
    el("div", { class: "need__card reveal" },
      el("div", { class: "eyebrow eyebrow--light", html: t("needKicker") }),
      el("h2", { class: "need__title", html: t("needTitle").replace(/(\?)$/, "<em>$1</em>") }),
      el("p", { class: "need__sub", html: t("needSub") }),
      needForm,
      needChips
    )
  );

  /* 3. Descubre El Raal — ALL shops with facades */
  const allElRaal = D.shops.filter((s) => s.locality === "el-raul" && s.facade);
  const descubre = el("section", { class: "section section--cream", id: "discover" },
    el("div", { class: "container" },
      sectionHead(null, t("descubreTitle"), t("descubreSub")),
      el("div", { class: "descubre-grid" }, allElRaal.map((s, i) => {
        const typeName = t("type")[s.type] || s.type;
        const st = shopStatus(s);
        return el("a", { class: "descubre-card reveal", "data-delay": String((i % 4) + 1), href: "#/tienda/" + s.slug },
          el("div", { class: "descubre-card__img status-frame status--" + st.code },
            el("img", { loading: "lazy", src: shopFacade(s), alt: esc(shopTitle(s)) }),
            el("span", { class: "status-badge status--" + st.code, html: st.label })
          ),
          el("div", { class: "descubre-card__body" },
            el("span", { class: "descubre-card__type", html: typeName }),
            el("h3", { class: "descubre-card__name", html: esc(shopTitle(s)) })
          )
        );
      }))
    )
  );

  /* 4. Mercado Domingo + TikTok LIVE badge */
  const marketReal = (D.galleries["mercado-domingo"] || []).filter((g) => g.indexOf("gemini-generated-image") === -1);
  const marketShots = marketReal.slice(0, 5);
  const tiktokLive = el("a", { class: "live-badge", href: CFG.social?.tiktok || "https://www.tiktok.com/@traeya.es1", target: "_blank", rel: "noopener" },
    el("span", { class: "live-badge__dot" }),
    el("span", { class: "live-badge__text", html: t("liveBadge") }),
    el("span", { class: "live-badge__sub", html: t("liveBadgeSub") })
  );
  const marketSec = el("section", { class: "section section--ink market-feature", id: "market" },
    el("div", { class: "container" },
      el("div", { class: "split" },
        el("div", { class: "split__body reveal" },
          el("div", { class: "eyebrow eyebrow--light", html: t("marketKicker") }),
          el("h3", { html: t("marketTitle") }),
          el("p", { class: "lede", html: t("marketBody") }),
          tiktokLive,
          el("a", { class: "btn btn--wa btn--lg", href: "#/tienda/mercado-domingo", html: t("marketCta") })
        ),
        el("a", { class: "split__media reveal", "data-delay": "1", href: "#/tienda/mercado-domingo" },
          el("img", { loading: "lazy", src: shopBg(market) || "", alt: esc(market.name) })
        )
      ),
      marketShots.length ? el("div", { class: "scene-strip reveal", "data-delay": "2" },
        marketShots.map((g) =>
          el("a", { class: "scene-strip__cell", href: "#/tienda/mercado-domingo" },
            el("img", { loading: "lazy", src: g, alt: esc(market.name) })
          )
        )
      ) : null
    )
  );

  /* 5. Comida Casera — with pre-order labels */
  const comidaProducts = comida && comida.products ? comida.products : [];
  const advanceNames = ["cuscús", "cuscus", "tajín", "tajin", "harira", "pescado", "fish", "hout", "pincho", "pinchos", "carne"];
  const comidaPreItems = comidaProducts.filter((p) => {
    const n = ((p.name_es || "") + " " + (p.name_ar || "")).toLowerCase();
    return advanceNames.some((kw) => n.indexOf(kw) >= 0);
  });
  const comidaAvailItems = comidaProducts.filter((p) => !comidaPreItems.includes(p));
  const comidaShots = comidaProducts.map((p) => p.img).filter(Boolean).slice(0, 4);
  const comidaSec = el("section", { class: "section section--cream", id: "comida" },
    el("div", { class: "container" },
      el("div", { class: "split split--rev" },
        el("div", { class: "split__body reveal" },
          el("div", { class: "eyebrow", html: t("comidaKicker") }),
          el("h3", { html: t("comidaTitle") }),
          el("p", { class: "lede", html: t("comidaBody") }),
          el("a", { class: "btn btn--dark", href: "#/tienda/comida-casera", html: t("comidaCta") })
        ),
        el("a", { class: "split__media reveal", "data-delay": "1", href: "#/tienda/comida-casera" },
          el("img", { loading: "lazy", src: shopBg(comida) || "", alt: esc(shopTitle(comida)) })
        )
      ),
      comidaShots.length ? el("div", { class: "scene-strip reveal", "data-delay": "2" },
        comidaShots.map((g) =>
          el("a", { class: "scene-strip__cell", href: "#/tienda/comida-casera" },
            el("img", { loading: "lazy", src: g, alt: esc(shopTitle(comida)) })
          )
        )
      ) : null,
      comidaPreItems.length ? el("div", { class: "comida-preorder reveal", "data-delay": "3" },
        el("div", { class: "comida-preorder__head" },
          el("h4", { html: t("comidaPreTitle") }),
          el("p", { html: t("comidaPreSub") })
        ),
        el("div", { class: "comida-preorder__list" },
          comidaPreItems.map((p) => {
            const price = p.price != null ? fmtPrice(p.price) : "";
            return el("div", { class: "comida-preorder__item" },
              el("div", { class: "comida-preorder__info" },
                el("span", { class: "comida-preorder__tag tag--advance", html: t("comidaAdv") }),
                el("span", { class: "comida-preorder__name", html: esc(displayName(p)) }),
                price ? el("span", { class: "comida-preorder__price", html: price }) : null
              ),
              el("a", { class: "btn btn--sm btn--wa", href: WA(t("comidaWant") + " " + displayName(p) + (price ? " — " + price : "")), target: "_blank", rel: "noopener", html: t("comidaOrder") })
            );
          })
        )
      ) : null
    )
  );

  /* 6. Delivery — cómo funciona */
  const deliveryCards = el("div", { class: "delivery-cards" }, [
    { k: "elraul", title: t("deliveryElRaal"), sub: t("deliveryElRaalSub"), amount: DELIVERY.el_raul, free: false },
    { k: "mercado", title: t("deliveryMercado"), sub: t("deliveryMercadoSub"), amount: DELIVERY.mercado, free: false },
    { k: "fuera", title: t("deliveryFuera"), sub: t("deliveryFueraSub"), amount: DELIVERY.fuera_el_raul, free: false },
    { k: "comida", title: t("deliveryComida"), sub: t("deliveryComidaSub"), amount: DELIVERY.comida_casera, free: true },
  ].map((c, i) =>
    el("div", { class: "delivery-card reveal", "data-delay": String((i % 2) + 1), "data-zone": c.k },
      el("div", { class: "delivery-card__top" },
        el("span", { class: "delivery-card__title", html: esc(c.title) }),
        el("strong", { class: "delivery-card__price" + (c.free ? " is-free" : ""), html: c.free ? t("deliveryFree") : fmtPrice(c.amount) })
      ),
      el("span", { class: "delivery-card__sub", html: esc(c.sub) })
    )
  ));
  const deliverySec = el("section", { class: "section section--cream", id: "entrega" },
    el("div", { class: "container" },
      sectionHead(t("deliveryKicker"), t("deliveryTitle"), t("deliverySub")),
      deliveryCards,
      el("p", { class: "delivery-note", html: esc(t("deliveryNote")) })
    )
  );

  /* 7. Restaurantes */
  const restSec = railSection("restaurantes", "section--sand", sectionHead(t("restTitle"), t("restTitle"), t("restSub")), rests.map((s) => cardFor(s)));

  /* 8. Otros */
  const otherSec = gridSection("otros", "section--cream", sectionHead(t("otherTitle"), t("otherTitle"), t("otherSub")), others.map((s) => cardFor(s)));

  /* 9. En otros pueblos — comercios de fuera de El Raal (ej. Mercadona Santomera) */
  const otrosPueblos = D.shops.filter((s) => s.locality !== "el-raul" && s.type !== "restaurante");
  const otrosSec = otrosPueblos.length
    ? gridSection("otros-pueblos", "section--sand", sectionHead(t("otherTitleLocs"), t("otherTitleLocs"), t("otherSubLocs")), otrosPueblos.map((s) => cardFor(s)))
    : null;

  view.append(hero, need, descubre, marketSec, comidaSec, deliverySec, restSec, otherSec, otrosSec);
  observeReveals(view);
  parallax();
}

function slugBySrc(src) {
  const m = src.match(/facades\/([^/]+)\.webp/);
  if (m) return m[1];
  const gm = src.match(/gallery\/([^/]+?)--/);
  if (gm) return gm[1];
  return "";
}

function goSection(id) {
  const n = document.getElementById(id);
  if (n) {
    n.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    if (location.hash !== "#/") location.hash = "#/";
    setTimeout(() => { const m = document.getElementById(id); if (m) m.scrollIntoView({ behavior: "smooth", block: "start" }); }, 120);
  }
}

/* ---------- Boca Pizza — carrusel 3D interactivo de menús ----------
   Ligero: CSS perspective + rotateY + translateZ. Front menu grande y
   nítido; los demás aparecen a los lados con profundidad. Arrastre/
   swipe, flechas y puntos. No usa librerías. */
function renderBocaMenu() {
  const N = 7;
  const srcs = [1, 2, 3, 4, 5, 6, 7].map((n) => "assets/img/menus/boca-pizza-menu-" + n + ".webp");

  const stage = el("div", { class: "bp3d__stage" });
  const faces = srcs.map((s, i) =>
    el("div", { class: "bp3d__face" },
      el("img", { src: s, alt: "Menú " + (i + 1) + " · Boca Pizza", draggable: "false" })
    )
  );
  faces.forEach((f) => stage.append(f));

  const prev = el("button", { class: "bp3d__arrow", type: "button", "aria-label": "Anterior", html: "‹" });
  const next = el("button", { class: "bp3d__arrow", type: "button", "aria-label": "Siguiente", html: "›" });
  const count = el("span", { class: "bp3d__count", html: "1 / " + N });
  const dots = el("div", { class: "bp3d__dots" });
  const dotArr = srcs.map(() => el("button", { class: "bp3d__dot", type: "button" }));
  dotArr.forEach((d) => dots.append(d));

  const viewport = el("div", { class: "bp3d__viewport" }, stage);
  const sec = el("section", { class: "bp3d reveal" },
    el("div", { class: "bp3d__head" },
      el("div", { class: "eyebrow", html: t("menuKicker") }),
      el("h3", { html: STATE.lang === "ar" ? "منيو بوكا بيتزا" : "Menú · Boca Pizza" })
    ),
    viewport,
    el("div", { class: "bp3d__bar" }, prev, count, next, dots)
  );

  let index = 0;
  function layout() {
    const w = stage.clientWidth || 340;
    const R = Math.round((w / 2) / Math.tan(Math.PI / N));
    faces.forEach((f, i) => { f.style.transform = "rotateY(" + (i * (360 / N)) + "deg) translateZ(" + R + "px)"; });
  }
  function apply() {
    stage.style.transform = "rotateY(" + (-index * (360 / N)) + "deg)";
    dotArr.forEach((d, i) => { if (i === index) d.classList.add("is-on"); else d.classList.remove("is-on"); });
    count.textContent = (index + 1) + " / " + N;
    faces.forEach((f, i) => {
      const a = ((i - index) % N + N) % N;
      const dist = Math.min(a, N - a);
      f.style.opacity = String((1 - dist / (N / 2)) * 0.28 + 0.72);
    });
  }
  const go = (i) => { index = ((i % N) + N) % N; apply(); };
  const step = (d) => go(index + d);

  layout(); apply();
  prev.addEventListener("click", () => step(-1));
  next.addEventListener("click", () => step(1));
  dotArr.forEach((d, i) => d.addEventListener("click", () => go(i)));

  let startX = null, startIdx = 0;
  function endDrag(e) {
    if (startX == null) return;
    const dx = e ? e.clientX - startX : 0;
    const th = Math.round(dx / 90);
    if (th !== 0) go(startIdx - th);
    else apply();
    startX = null;
  }
  stage.addEventListener("pointerdown", (e) => { startX = e.clientX; startIdx = index; if (stage.setPointerCapture) stage.setPointerCapture(e.pointerId); });
  stage.addEventListener("pointermove", (e) => {
    if (startX == null) return;
    const th = Math.round((e.clientX - startX) / 90);
    stage.style.transform = "rotateY(" + (-(startIdx + th) * (360 / N)) + "deg)";
  });
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  const onResize = () => { if (!document.body.contains(sec)) { window.removeEventListener("resize", onResize); return; } layout(); apply(); };
  window.addEventListener("resize", onResize);

  return sec;
}

/* ---------- Shop page ---------- */
function renderShop(shop) {
  const view = $("#view");
  view.innerHTML = "";
  document.title = shopTitle(shop) + " · TRAEYA · El Raal";
  STATE.shop = shop;
  const products = shop.products;
  const gallery = D.galleries[shop.slug] || [];
  const bg = shopFacade(shop);
  const arName = STATE.lang === "ar" ? (I18N[STATE.lang].shopNameAr[shop.slug] || "") : "";
  const isMarket = shop.type === "mercado";

  const dlv = deliveryFor(shop);
  const dlvTag = el("span", { class: "tag tag--delivery" + (dlv.free ? " is-free" : ""), html: dlv.free ? t("deliveryShopFree") : t("deliveryShop") + " · " + fmtPrice(dlv.amount) });
  const heroTags = el("div", { class: "shop-hero__tags" }, [
    el("span", { class: "tag", style: "background:rgba(253,252,248,.14);color:var(--cream)", html: isMarket ? t("tagEverySunday") : t("type")[shop.type] }),
    el("span", { class: "tag", style: "background:rgba(253,252,248,.14);color:var(--cream)", html: t("locality")[shop.locality] }),
    dlvTag
  ]);

  /* Caja "¿Qué estás buscando?" — bloque importante (mensaje + ejemplo por tienda) */
  const mk = marketingFor(shop) || { title: t("askShopSub"), placeholder: t("askShopPlaceholder") };
  const askText = el("textarea", { class: "ask-box__textarea", rows: 3, placeholder: mk.placeholder });
  const askBtn = el("button", { class: "btn btn--wa btn--lg", type: "button", html: t("askShopBtn") });
  const askBoxEls = [el("div", { class: "ask-box__icon", html: "✆" }), el("h3", { html: esc(shopTitle(shop)) }), el("p", { class: "ask-box__sub", html: esc(mk.title) }), askText];
  const suggest = searchSuggestionsFor(shop);
  if (suggest) {
    const chips = el("div", { class: "ask-box__chips" });
    suggest.forEach((c) => chips.append(el("button", { class: "chip", type: "button", html: esc(c) })));
    $$(".chip", chips).forEach((ch) => ch.addEventListener("click", () => { askText.value = ch.textContent; askText.focus(); }));
    askBoxEls.push(chips);
  }
  askBoxEls.push(askBtn);
  const askBox = el("div", { class: "ask-box" }, askBoxEls);
  const askGo = () => openWA(t("waShop") + " " + shopTitle(shop) + ": " + (askText.value.trim() || mk.placeholder));
  askBtn.addEventListener("click", askGo);
  askText.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) askGo(); });

  const st = shopStatus(shop);
  const hero = el("section", { class: "shop-hero status-frame status--" + st.code },
    bg ? el("img", { class: "shop-hero__image", src: bg, alt: esc(shopTitle(shop)) }) : null,
    bg ? el("div", { class: "shop-hero__overlay" }) : null,
    el("div", { class: "shop-hero__content" },
      el("a", { class: "shop-hero__back", href: "#/", html: "← " + t("backHome") }),
      el("div", { class: "shop-hero__row" },
        el("span", { class: "status-badge status-badge--hero status--" + st.code, html: st.label }),
        heroTags
      ),
      el("h1", { class: "shop-hero__name", html: esc(shopTitle(shop)) }),
      arName && shopTitle(shop) !== "LA COSINA DEL MIMA" ? el("div", { class: "shop-hero__name-ar ar", html: arName }) : null,
      products.length ? el("div", { class: "shop-hero__count", html: t("productsCount", products.length) }) : null
    )
  );

  const mnu = shopMenu(shop);
  const menuSec = mnu
    ? el("section", { class: "menu-section reveal" },
        el("div", { class: "menu-section__head" },
          el("div", { class: "eyebrow", html: t("menuKicker") }),
          el("h3", { html: esc(shopTitle(shop)) }),
          el("span", { class: "menu-section__hint", html: t("menuHint") })
        ),
        el("div", { class: "menu-section__frame" },
          el("img", { loading: "lazy", src: mnu, alt: "Menú · " + shopTitle(shop) })
        )
      )
    : null;

  /* Mercado Domingo — experiencia visual: vídeos souk reales + fotos reales */
  const marketVideos = (CFG.market && CFG.market.videos) || [];
  const marketReal = gallery.filter((g) => g.indexOf("gemini-generated-image") === -1);
  const marketExp =
    isMarket && marketVideos.length
      ? el("section", { class: "market-experience" },
          el("div", { class: "market-exp__head" },
            el("div", { class: "eyebrow eyebrow--light", html: t("marketKickerShop") }),
            el("h3", { html: t("marketTitleShop") }),
            el("p", { class: "market-exp__lede", html: t("marketBodyShop") })
          ),
          marketVideos.map((v, i) =>
            el("div", { class: "market-exp__video reveal", "data-delay": String(i + 1) },
              el("div", { class: "market-exp__frame" },
                el("video", { autoplay: "", muted: "", loop: "", playsinline: "", poster: marketReal[i] || "", preload: "metadata", tabindex: "0" },
                  el("source", { src: v, type: "video/mp4" })
                )
              ),
              el("span", { class: "market-exp__cap", html: i === 0 ? t("marketVid1") : t("marketVid2") })
            )
          )
        )
      : null;

  const isComida = shop.slug === "comida-casera";
  const comidaAskMsg = isComida ? el("div", { class: "comida-ask-msg reveal" },
    el("h3", { class: "comida-ask-msg__title", html: t("comidaAskTitle") }),
    el("p", { class: "comida-ask-msg__sub", html: t("comidaAskSub") }),
    el("p", { class: "comida-ask-msg__note", html: t("comidaAskNote") })
  ) : null;

  /* Horario */
  const horario = shop.horario;
  const horarioSec = horario ? (() => {
    const dayKeys = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    const days = t("horarioDays");
    const closedLabel = t("horarioClosed");
    const rows = dayKeys.map((k, i) => {
      const val = horario[k] || closedLabel;
      const isClosed = !horario[k] || val === "Cerrado" || val === "مغلق";
      return el("div", { class: "horario__row" + (isClosed ? " is-closed" : "") },
        el("span", { class: "horario__day", html: days[i] }),
        el("span", { class: "horario__hours", html: isClosed ? closedLabel : val })
      );
    });
    return el("div", { class: "horario reveal" },
      el("h3", { class: "horario__title", html: t("horarioTitle") }),
      el("div", { class: "horario__grid" }, rows)
    );
  })() : null;

  /* Barbería Ayoub — special features */
  const isBarberia = shop.slug === "barberia-ayoub";
  let barberReservar = null;
  let barberDomicilio = null;

  if (isBarberia) {
    const isAr = STATE.lang === "ar";

    /* Service options — bilingual */
    const svcEs = ["Corte de pelo", "Barba", "Corte + Barba", "Arreglo capilar completo", "Régulo de barba", "Servicio para eventos", "Otro"];
    const svcAr = ["قص الشعر", "اللحية", "قص الشعر + اللحية", "تصفيف شامل", "تسوية اللحية", "خدمة المناسبات", "أخرى"];
    const svcLabels = isAr ? svcAr : svcEs;
    const svcDefault = isAr ? "الخدمة المطلوبة" : "Servicio que desea";
    const mkSvcOpts = () => svcLabels.map((s, i) => el("option", { value: svcEs[i] }, s));

    /* Age options — bilingual */
    const ageEs = ["Menor de 18 años", "Mayor de 18 años", "Niño/a"];
    const ageAr = ["أقل من 18 سنة", "فوق 18 سنة", "طفل/طفلة"];
    const ageLabels = isAr ? ageAr : ageEs;
    const ageDefault = isAr ? "العمر" : "Edad";
    const mkAgeOpts = () => ageLabels.map((s, i) => el("option", { value: ageEs[i] }, s));

    /* Reservar cita */
    const rName = el("input", { class: "barber-form__input", type: "text", placeholder: isAr ? "الاسم" : "Nombre", required: true });
    const rPhone = el("input", { class: "barber-form__input", type: "tel", placeholder: isAr ? "الهاتف" : "Teléfono", required: true });
    const rSvc = el("select", { class: "barber-form__input" }, el("option", { value: "", disabled: true, selected: true }, svcDefault), ...mkSvcOpts());
    const rAge = el("select", { class: "barber-form__input" }, el("option", { value: "", disabled: true, selected: true }, ageDefault), ...mkAgeOpts());
    const rDay = el("input", { class: "barber-form__input", type: "date", required: true });
    const rComment = el("textarea", { class: "barber-form__input", rows: 2, placeholder: isAr ? "تعليق اختياري" : "Comentario opcional" });
    const rSubmit = el("button", { class: "btn btn--wa btn--lg", type: "button", html: isAr ? "حجز موعد" : "Reservar cita" });
    const rForm = el("div", { class: "barber-form" }, rName, rPhone, rSvc, rAge, rDay, rComment, rSubmit);
    const rResult = el("div", { class: "barber-form__result", style: "display:none" });

    rSubmit.addEventListener("click", () => {
      if (!rName.value.trim() || !rPhone.value.trim() || !rSvc.value || !rAge.value || !rDay.value) { rResult.style.display = "block"; rResult.textContent = isAr ? "يرجى ملء جميع الحقول المطلوبة." : "Por favor, rellena todos los campos obligatorios."; return; }
      const msg = (isAr ? "طلب موعد جديد - حلاقة عيوب\n\nالاسم: " : "Nueva solicitud de cita - Barbería Ayoub\n\nNombre: ") + rName.value.trim() + (isAr ? "\nالهاتف: " : "\nTeléfono: ") + rPhone.value.trim() + (isAr ? "\nالخدمة: " : "\nServicio: ") + rSvc.value + (isAr ? "\nالعمر: " : "\nEdad: ") + rAge.value + (isAr ? "\nاليوم المفضل: " : "\nDía preferido: ") + rDay.value + (rComment.value.trim() ? (isAr ? "\nتعليق: " : "\nComentario: ") + rComment.value.trim() : "");
      openWA(msg);
      rForm.style.display = "none";
      rResult.style.display = "block";
      rResult.innerHTML = isAr ? "<strong>تم إرسال الطلب.</strong> س تتواصل معك TRAEYA لتأكيد موعدك." : "<strong>Solicitud enviada.</strong> TRAEYA se pondrá en contacto contigo para confirmar tu cita.";
    });

    barberReservar = el("div", { class: "barber-section" },
      el("div", { class: "barber-promo" },
        el("h3", { html: isAr ? "هل سئمت الانتظار؟" : "¿Cansado de esperar tu turno?" }),
        el("p", { html: isAr ? "<strong>احجز موعدك</strong> واستمتع بقص شعرك بدون انتظار." : "<strong>Reserva tu cita</strong> y disfruta de tu corte sin esperas." })
      ),
      rForm,
      rResult
    );

    /* Barbería privada a domicilio */
    const dName = el("input", { class: "barber-form__input", type: "text", placeholder: isAr ? "الاسم" : "Nombre", required: true });
    const dPhone = el("input", { class: "barber-form__input", type: "tel", placeholder: isAr ? "الهاتف" : "Teléfono", required: true });
    const dAddress = el("input", { class: "barber-form__input", type: "text", placeholder: isAr ? "العنوان" : "Dirección", required: true });
    const dSvc = el("select", { class: "barber-form__input" }, el("option", { value: "", disabled: true, selected: true }, svcDefault), ...mkSvcOpts());
    const dAge = el("select", { class: "barber-form__input" }, el("option", { value: "", disabled: true, selected: true }, ageDefault), ...mkAgeOpts());
    const dDay = el("input", { class: "barber-form__input", type: "date", required: true });
    const dComment = el("textarea", { class: "barber-form__input", rows: 2, placeholder: isAr ? "تعليق اختياري" : "Comentario opcional" });
    const dSubmit = el("button", { class: "btn btn--wa btn--lg", type: "button", html: isAr ? "طلب خدمة منزلية" : "Solicitar servicio a domicilio" });
    const dForm = el("div", { class: "barber-form" }, dName, dPhone, dAddress, dSvc, dAge, dDay, dComment, dSubmit);
    const dResult = el("div", { class: "barber-form__result", style: "display:none" });

    dSubmit.addEventListener("click", () => {
      if (!dName.value.trim() || !dPhone.value.trim() || !dAddress.value.trim() || !dSvc.value || !dAge.value || !dDay.value) { dResult.style.display = "block"; dResult.textContent = isAr ? "يرجى ملء جميع الحقول المطلوبة." : "Por favor, rellena todos los campos obligatorios."; return; }
      const msg = (isAr ? "طلب خدمة منزلية - حلاقة عيوب\n\nالاسم: " : "Solicitud - Barbería privada a domicilio\n\nNombre: ") + dName.value.trim() + (isAr ? "\nالهاتف: " : "\nTeléfono: ") + dPhone.value.trim() + (isAr ? "\nالعنوان: " : "\nDirección: ") + dAddress.value.trim() + (isAr ? "\nالخدمة: " : "\nServicio: ") + dSvc.value + (isAr ? "\nالعمر: " : "\nEdad: ") + dAge.value + (isAr ? "\nاليوم المفضل: " : "\nDía preferido: ") + dDay.value + (dComment.value.trim() ? (isAr ? "\nتعليق: " : "\nComentario: ") + dComment.value.trim() : "");
      openWA(msg);
      dForm.style.display = "none";
      dResult.style.display = "block";
      dResult.innerHTML = isAr ? "<strong>تم إرسال الطلب.</strong> س تتواصل معك TRAEYA لتأكيد الخدمة." : "<strong>Solicitud enviada.</strong> TRAEYA se pondrá en contacto contigo para confirmar el servicio.";
    });

    barberDomicilio = el("div", { class: "barber-section" },
      el("div", { class: "barber-promo" },
        el("h3", { html: isAr ? "بغيتي تبقى فدارك؟" : "¿Prefieres quedarte en casa?" }),
        el("p", { html: isAr ? "<strong>عيوب كيجي عندك للدار.</strong> استمتع بخدمة الحلاقة بلا ما تتحرك وبلا ما تتسنى." : "<strong>Ayoub se desplaza hasta tu domicilio.</strong> Disfruta de tu servicio de barbería en casa, sin desplazarte y sin esperar tu turno en el local." })
      ),
      dForm,
      dResult
    );
  }

  const body = el("section", { class: "section section--cream" },
    el("div", { class: "container" },
      askBox,
      isBarberia ? el("div", { class: "barber-featured reveal" }, el("img", { src: "assets/img/gallery/barberia-ayoub/FIRST_ONE.webp", alt: esc(shop.name) })) : null,
      marketExp,
      shop.slug === "boca-pizza" ? renderBocaMenu() : null,
      menuSec,
      horarioSec,
      barberReservar,
      barberDomicilio,
      comidaAskMsg,
      products.length ? renderProducts(shop, isComida) : renderEmpty(shop),
      gallery.length ? renderGallery(shop, gallery) : null,
      shop.type === "farmacia" ? renderFarmaciaReceta() : null
    )
  );

  /* Descubre El Raal — other shops at the bottom */
  const otherShops = D.shops.filter((s) => s.slug !== shop.slug);
  const shuffled = otherShops.sort(() => Math.random() - 0.5).slice(0, 6);
  const discoverCards = shuffled.map((s) => {
    const bg = shopFacade(s);
    const st = shopStatus(s);
    const media = bg
      ? el("div", { class: "discover-card__media status-frame status--" + st.code },
          el("img", { class: "discover-card__img", loading: "lazy", src: bg, alt: esc(shopTitle(s)) }),
          el("span", { class: "status-badge status--" + st.code, html: st.label })
        )
      : el("div", { class: "discover-card__media status-frame status--" + st.code },
          el("div", { class: "discover-card__img discover-card__placeholder", html: esc((shopTitle(s) || "T").charAt(0)) }),
          el("span", { class: "status-badge status--" + st.code, html: st.label })
        );
    return el("a", { class: "discover-card", href: "#/tienda/" + s.slug },
      media,
      el("div", { class: "discover-card__info" },
        el("span", { class: "discover-card__name", html: esc(shopTitle(s)) }),
        el("span", { class: "discover-card__type", html: t("type")[s.type] || s.type })
      )
    );
  });
  const discoverSec = el("section", { class: "section section--discover" },
    el("div", { class: "container" },
      el("h3", { class: "discover__title", html: t("discoverTitle") || "Descubre El Raal" }),
      el("div", { class: "discover-grid" }, discoverCards)
    )
  );

  view.append(hero, body, discoverSec);
  observeReveals(view);
  window.scrollTo(0, 0);
}

function renderEmpty(shop) {
  return el("div", { class: "empty-state reveal" },
    el("div", { class: "big", html: "☗" }),
    el("h3", null, t("emptyTitle")),
    el("p", null, t("emptyBody")),
    el("div", { class: "empty-state__wa" },
      el("a", { class: "btn btn--wa", href: WA(t("waShop") + " " + shopTitle(shop)), target: "_blank", rel: "noopener", html: t("askShopBtn") })
    )
  );
}

function renderFarmaciaReceta() {
  let recetaImg = null;
  const recetaPreview = el("div", { class: "receta-preview" });
  const recetaFile = el("input", { class: "receta-file", type: "file", accept: "image/*", id: "receta-file" });
  const recetaLabel = el("label", { class: "btn btn--dark btn--sm receta-label", for: "receta-file", html: t("recetaPick") });
  const recetaRemoveBtn = el("button", { class: "btn btn--sm receta-remove", type: "button", html: t("recetaRemove"), style: "display:none" });
  const recetaSendBtn = el("button", { class: "btn btn--wa btn--lg", type: "button", html: t("recetaSend"), disabled: true });

  recetaFile.addEventListener("change", () => {
    const file = recetaFile.files && recetaFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      recetaImg = reader.result;
      recetaPreview.innerHTML = "";
      recetaPreview.append(el("img", { src: recetaImg, alt: t("recetaPreview") }));
      recetaPreview.style.display = "";
      recetaRemoveBtn.style.display = "";
      recetaSendBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  });
  recetaRemoveBtn.addEventListener("click", () => {
    recetaImg = null;
    recetaFile.value = "";
    recetaPreview.innerHTML = "";
    recetaPreview.style.display = "none";
    recetaRemoveBtn.style.display = "none";
    recetaSendBtn.disabled = true;
  });
  recetaSendBtn.addEventListener("click", () => {
    openWA(t("recetaMsg"));
  });

  return el("section", { class: "section section--sand", id: "farmacia-receta" },
    el("div", { class: "container" },
      sectionHead(null, t("recetaTitle"), t("recetaSub")),
      el("div", { class: "receta-box reveal" },
        el("div", { class: "receta-box__upload" },
          recetaLabel,
          recetaFile,
          recetaRemoveBtn
        ),
        recetaPreview,
        el("p", { class: "receta-hint", html: t("recetaHint") }),
        recetaSendBtn
      )
    )
  );
}

function renderProducts(shop, isComida) {
  const wrap = el("div", { class: "products" });
  const advanceNames = ["cuscús", "cuscus", "tajín", "tajin", "harira", "pescado", "fish", "hout", "pincho", "pinchos", "carne"];

  const withImageAndDesc = [];
  const withImageOnly = [];
  const withDescOnly = [];
  const withNeither = [];

  shop.products.forEach((p) => {
    const hasImg = !!(p.img && p.img.trim());
    const hasDesc = !!((p.desc_es && p.desc_es.trim()) || (p.desc_ar && p.desc_ar.trim()));
    if (hasImg && hasDesc) withImageAndDesc.push(p);
    else if (hasImg) withImageOnly.push(p);
    else if (hasDesc) withDescOnly.push(p);
    else withNeither.push(p);
  });

  const orderedProducts = [...withImageAndDesc, ...withImageOnly, ...withDescOnly, ...withNeither];

  console.log("========== PRODUCT GROUPING: " + shop.name + " ==========");
  console.log("Group 1 (image+description):", withImageAndDesc.length, withImageAndDesc.slice(0, 5).map(p => p.name_es || p.id).join(", "));
  console.log("Group 2 (image only):", withImageOnly.length, withImageOnly.slice(0, 5).map(p => p.name_es || p.id).join(", "));
  console.log("Group 3 (description only):", withDescOnly.length, withDescOnly.slice(0, 5).map(p => p.name_es || p.id).join(", "));
  console.log("Group 4 (neither):", withNeither.length, withNeither.slice(0, 5).map(p => p.name_es || p.id).join(", "));
  console.log("Total ordered:", orderedProducts.length);
  orderedProducts.forEach((p, i) => {
    const hasImg = !!(p.img && p.img.trim());
    const hasDesc = !!((p.desc_es && p.desc_es.trim()) || (p.desc_ar && p.desc_ar.trim()));
    const grp = (hasImg && hasDesc) ? "G1" : hasImg ? "G2" : hasDesc ? "G3" : "G4";
    console.log("  [" + (i + 1) + "] " + grp + " | " + (p.name_es || p.id));
  });

  const grid = el("div", { class: "product-grid" });
  orderedProducts.forEach((p) => {
    let badge = null;
    if (isComida) {
      const n = ((p.name_es || "") + " " + (p.name_ar || "")).toLowerCase();
      badge = advanceNames.some((kw) => n.indexOf(kw) >= 0) ? t("comidaAdv") : t("comidaAvail");
    }
    grid.append(productCard(shop, p, badge));
  });

  wrap.append(
    el("div", { class: "category-block" },
      el("div", { class: "category-head" },
        el("h4", { html: esc(t("productsLabel")) }),
        el("span", { class: "rule" }),
        el("span", { class: "count", html: String(shop.products.length) })
      ),
      grid
    )
  );

  return wrap;
}

function productCard(shop, p, badge) {
  const name = esc(displayName(p));
  const ar = (STATE.lang === "ar" && p.name_ar) ? el("span", { class: "product-card__name-ar", html: esc(p.name_ar) }) : null;
  const unit = p.unit && p.unit.toLowerCase() !== "uniti" ? el("span", { class: "product-card__unit", html: esc(p.unit) }) : null;
  const price =
    p.price != null
      ? el("span", { class: "product-card__price", html: fmtPrice(p.price) + (p.price2 != null && p.price2 !== p.price ? " <small>·</small> " + fmtPrice(p.price2) : "") })
      : el("span", { class: "product-card__ask", html: t("priceAsk") });

  const hasImg = !!p.img;
  const hasDesc = !!(p.desc_es || p.desc_ar);
  const compact = !hasImg && !hasDesc;

  const media = p.img
    ? el("div", { class: "product-card__media" }, el("img", { loading: "lazy", src: p.img, alt: name }))
    : null;

  const badgeEl = badge ? el("span", { class: "product-card__badge" + (badge === t("comidaAdv") ? " badge--advance" : " badge--avail"), html: badge }) : null;

  const addBtn = el("button", { class: "btn btn--add", type: "button", html: '<span class="btn__label">' + esc(t("cartAdd")) + '</span><span class="btn__qty"></span>' });
  const updateBtn = () => {
    const key = shop.slug + "::" + p.id;
    const it = Cart.items.get(key);
    const qty = it ? it.qty : 0;
    addBtn.classList.toggle("has-qty", qty > 0);
    addBtn.querySelector(".btn__label").textContent = qty ? esc(t("cartAdded")) : t("cartAdd");
    addBtn.querySelector(".btn__qty").textContent = qty ? "· " + qty : "";
  };
  addBtn.addEventListener("click", () => { Cart.add(shop, p); updateBtn(); });
  updateBtn();

  const infoChildren = [badgeEl, el("div", { class: "product-card__name", html: name }), ar, unit, price].filter(Boolean);

  const card = el("div", { class: "product-card" + (compact ? " product-card--compact" : "") }, [
    media,
    el("div", { class: "product-card__info" }, infoChildren),
    addBtn
  ].filter(Boolean));
  return card;
}

function renderGallery(shop, gallery) {
  const visible = STATE.galleryCounts[shop.slug] || 18;
  const grid = el("div", { class: "gallery-grid" });
  gallery.slice(0, visible).forEach((g) => grid.append(el("div", { class: "g-item" }, el("img", { loading: "lazy", src: g, alt: shop.name }))));

  const sec = el("section", { class: "gallery", style: "margin-top:56px" },
    el("div", { class: "category-head" },
      el("h4", null, t("alsoHere")),
      el("span", { class: "rule" }),
      el("span", { class: "count", html: String(gallery.length) })
    ),
    el("p", { class: "gallery__sub", html: t("alsoHereSub") }),
    grid
  );
  if (gallery.length > visible) {
    const btn = el("button", { class: "btn btn--dark btn--small gallery__more", type: "button", html: t("showMore") + " (" + (gallery.length - visible) + ")" });
    btn.addEventListener("click", () => {
      STATE.galleryCounts[shop.slug] = (STATE.galleryCounts[shop.slug] || 18) + 24;
      const ng = renderGallery(shop, gallery);
      sec.replaceWith(ng);
      observeReveals(ng);
      ng.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    sec.append(el("div", { class: "gallery__more-wrap" }, btn));
  }
  return sec;
}

/* ---------- Cart UI ---------- */
const CartBar = {
  render() {
    const bar = $("#cart-bar");
    if (!bar) return;
    const n = Cart.total();
    bar.hidden = n === 0;
    document.body.classList.toggle("has-cart", n > 0);
    if (n === 0) return;
    bar.innerHTML = "";
    const inner = el("div", { class: "cart-bar__inner" });
    inner.append(
      el("div", { class: "cart-bar__info" },
        el("strong", { html: t("cartView") }),
        el("span", { html: String(n) + " " + t("cartItems") })
      ),
      el("button", { class: "btn btn--wa", type: "button", html: t("cartView"), onclick: () => CartDrawer.open() })
    );
    bar.append(inner);
  }
};

const CartDrawer = {
  open() {
    const overlay = el("div", { class: "cart-drawer" }, el("div", { class: "cart-drawer__backdrop", onclick: () => overlay.remove() }));
    const panel = el("div", { class: "cart-drawer__panel" });
    const shop = Cart.shop && D.shops.find((s) => s.slug === Cart.shop.slug);
    const items = shop ? Cart.productsFor(shop) : [];
    const closeBtn = el("button", { class: "cart-drawer__close", html: "×", "aria-label": "Close" });
    closeBtn.addEventListener("click", () => overlay.remove());

    panel.append(
      el("div", { class: "cart-drawer__head" },
        el("div", { class: "eyebrow", html: "TRAEYA" }),
        el("h3", { html: t("cartView") })
      ),
      closeBtn
    );

    if (!shop || !items.length) {
      panel.append(
        el("div", { class: "cart-drawer__empty" },
          el("div", { class: "big", html: "🛒" }),
          el("p", null, t("cartEmpty"))
        )
      );
    } else {
      panel.append(el("div", { class: "cart-drawer__shop", html: "<span>" + esc(t("cartShop")) + "</span><strong>" + esc(shopTitle(shop)) + "</strong>" }));

      const list = el("div", { class: "cart-drawer__list" });
      items.forEach((it) => {
        const p = it.product;
        const price = p.price != null ? fmtPrice(p.price) + (p.price2 != null && p.price2 !== p.price ? " / " + fmtPrice(p.price2) : "") : t("priceAsk");
        const row = el("div", { class: "cart-row" },
          el("div", { class: "cart-row__name" },
            el("strong", null, esc(displayName(p))),
            el("span", null, price)
          ),
          el("div", { class: "cart-stepper" },
            el("button", { class: "cart-stepper__btn", type: "button", html: "−", onclick: () => { Cart.setQty(shop.slug, p.id, it.qty - 1); CartDrawer.refresh(overlay, panel); } }),
            el("span", { class: "cart-stepper__val", html: String(it.qty) }),
            el("button", { class: "cart-stepper__btn", type: "button", html: "+", onclick: () => { Cart.setQty(shop.slug, p.id, it.qty + 1); CartDrawer.refresh(overlay, panel); } })
          )
        );
        list.append(row);
      });
      panel.append(list);

      const note = el("textarea", { class: "cart-drawer__note", rows: 2, placeholder: t("cartNotePh") });
      panel.append(el("div", { class: "cart-drawer__note-wrap" },
        el("label", { html: t("cartNote") }),
        note
      ));

      const total = el("div", { class: "cart-drawer__total" });
      CartDrawer._totals(total, shop, items);
      const send = el("button", { class: "btn btn--wa btn--lg", type: "button", html: t("cartSend") });
      send.addEventListener("click", () => {
        const msg = buildOrderMessage(shop, items, note.value);
        openWA(msg);
      });
      panel.append(total, el("div", { class: "cart-drawer__foot" }, send));
    }

    overlay.append(panel);
    document.body.append(overlay);
  },
  refresh(overlay, panel) {
    const shop = Cart.shop && D.shops.find((s) => s.slug === Cart.shop.slug);
    const items = shop ? Cart.productsFor(shop) : [];
    if (!items.length) { overlay.remove(); return; }
    const list = panel.querySelector(".cart-drawer__list");
    const total = panel.querySelector(".cart-drawer__total");
    if (list) {
      list.innerHTML = "";
      items.forEach((it) => {
        const p = it.product;
        const price = p.price != null ? fmtPrice(p.price) + (p.price2 != null && p.price2 !== p.price ? " / " + fmtPrice(p.price2) : "") : t("priceAsk");
        list.append(
          el("div", { class: "cart-row" },
            el("div", { class: "cart-row__name" },
              el("strong", null, esc(displayName(p))),
              el("span", null, price)
            ),
            el("div", { class: "cart-stepper" },
              el("button", { class: "cart-stepper__btn", type: "button", html: "−", onclick: () => { Cart.setQty(shop.slug, p.id, it.qty - 1); CartDrawer.refresh(overlay, panel); } }),
              el("span", { class: "cart-stepper__val", html: String(it.qty) }),
              el("button", { class: "cart-stepper__btn", type: "button", html: "+", onclick: () => { Cart.setQty(shop.slug, p.id, it.qty + 1); CartDrawer.refresh(overlay, panel); } })
            )
          )
        );
      });
    }
    if (total) {
      CartDrawer._totals(total, shop, items);
    }
  },
  _totals(total, shop, items) {
    const priced = items.filter((it) => it.product.price != null);
    const dlv = deliveryFor(shop);
    const allPriced = priced.length === items.length && items.length > 0;
    const sum = allPriced ? priced.reduce((s, it) => s + it.product.price * it.qty, 0) : 0;
    const subtotalHtml = allPriced
      ? esc(fmtPrice(sum))
      : "<small>" + esc(t("cartNoPrices")) + "</small>";
    const deliveryHtml = dlv.free
      ? '<span class="cart-total__free">' + esc(t("cartDeliveryFree")) + "</span>"
      : esc(fmtPrice(dlv.amount));
    const totalHtml = allPriced
      ? "<strong>" + esc(fmtPrice(sum + dlv.amount)) + "</strong>"
      : "<small>" + esc(t("cartNoPrices")) + "</small>";
    total.innerHTML =
      '<div class="cart-total__row"><span>' + esc(t("cartSubtotal")) + '</span><span>' + subtotalHtml + "</span></div>" +
      '<div class="cart-total__row"><span>' + esc(t("cartDelivery")) + '</span><span>' + deliveryHtml + "</span></div>" +
      '<div class="cart-total__row cart-total__row--last"><span>' + esc(t("cartTotal")) + "</span><span>" + totalHtml + "</span></div>";
  }
};

function buildOrderMessage(shop, items, note) {
  const lines = [];
  lines.push("TRAEYA · EL RAAL");
  lines.push(t("cartShop") + ": " + shopTitle(shop));
  lines.push("");
  lines.push(t("cartView") + ":");
  items.forEach((it) => {
    const p = it.product;
    const price = p.price != null ? " — " + fmtPrice(p.price) : "";
    lines.push("• " + displayName(p) + (it.qty > 1 ? " × " + it.qty : "") + price);
  });
  const priced = items.filter((it) => it.product.price != null);
  const dlv = deliveryFor(shop);
  const allPriced = priced.length === items.length && priced.length > 0;
  if (allPriced) {
    const sum = priced.reduce((s, it) => s + it.product.price * it.qty, 0);
    lines.push("");
    lines.push(t("cartSubtotal") + ": " + fmtPrice(sum));
    lines.push(t("cartDelivery") + ": " + (dlv.free ? t("cartDeliveryFree") : fmtPrice(dlv.amount)));
    lines.push(t("cartTotal") + ": " + fmtPrice(sum + dlv.amount));
  } else {
    lines.push("");
    lines.push(t("cartNoPrices"));
  }
  if (note && note.trim()) {
    lines.push("");
    lines.push(t("cartNote") + ": " + note.trim());
  }
  return lines.join("\n");
}

/* ---------- Router ---------- */
function route() {
  const h = location.hash || "#/";
  if (h.startsWith("#/tienda/")) {
    const slug = decodeURIComponent(h.slice("#/tienda/".length));
    const shop = D.shops.find((s) => s.slug === slug);
    if (shop) return renderShop(shop);
  }
  renderHome();
}

/* ---------- Init ---------- */
function renderAll() {
  renderTopbar();
  renderFooter();
  renderFloat();
  CartBar.render();
  route();
}

function applyLangAttrs() {
  document.documentElement.lang = STATE.lang;
  document.documentElement.dir = STATE.lang === "ar" ? "rtl" : "ltr";
}

function init() {
  Cart._load();
  applyLangAttrs();
  if (localStorage.getItem("traeya.lang")) {
    renderAll();
  } else {
    /* Primera visita: SOLO el language gate, sin home detrás. */
    document.body.classList.add("gate-pending");
    renderLangGate();
  }
  window.addEventListener("hashchange", () => { route(); window.scrollTo(0, 0); });
  window.addEventListener("scroll", () => { updateTopbar(); requestAnimationFrame(parallax); }, { passive: true });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();

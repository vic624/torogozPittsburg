/**
 * TOROGOZ — SITE DATA
 * ---------------------------------------------------------------------
 * This file is the single source of truth for everything editable on
 * the site: the menu, special events, and Google reviews shown on the
 * home page.
 *
 * HOW THE ADMIN PAGE WORKS WITH THIS FILE
 * The admin page (admin.html) edits a COPY of this data that lives in
 * your browser's local storage, so you can preview changes instantly.
 * When you're happy with your changes, click "Download Updated Data
 * File" in the admin page — it produces a new version of this exact
 * file (js/data.js). Upload that file to your web host, replacing this
 * one, and the live site is updated. See README.md for details.
 *
 * You can also hand-edit this file directly (it's plain JavaScript) if
 * you're comfortable doing so — just keep the same structure.
 * ---------------------------------------------------------------------
 */

window.TOROGOZ_DATA = {
  site: {
    name: "Torogoz",
    fullName: "Torogoz Contemporary Latin Cookery",
    tagline: "Contemporary Latin Cookery",
    kicker: "Contemporary Latin Cookery · Sewickley, PA",
    metaDescription:
      "Contemporary Latin cuisine in the heart of Sewickley, PA. Lunch & dinner featuring bold flavors, handcrafted cocktails, and vibrant plates.",
    address: "525 Locust Place, Sewickley, PA 15143",
    phoneDisplay: "(412) 509-0314",
    phoneRaw: "+14125090314",
    toastReserveUrl:
      "https://toast.app/r/torogoz-contemporary-latin-cookery-519-locust-place?partySize=2&date=2026-08-19&time=now",
    facebookUrl:
      "https://www.facebook.com/people/Torogoz-Contemporary-Latin-Cookery/100082869933502/",
    instagramUrl: "https://www.instagram.com/torogozpgh/",
    googleBusinessUrl:
      "https://www.google.com/maps/place/Torogoz+Contemporary+Latin+Cookery",
    mapsDirectionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=525+Locust+Place,+Sewickley,+PA+15143",
    mapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.5!2d-80.1833!3d40.5386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDMyJzE5LjAiTiA4MMKwMTAnNTkuOSJX!5e0!3m2!1sen!2sus!4v1",
    hours: [
      { label: "Lunch", time: "11:00 AM – 1:45 PM" },
      { label: "Dinner", time: "5:00 PM – 9:30 PM" }
    ],
    heroImage:
      "https://static.wixstatic.com/media/db74f4_d97dec3cf1894165831953cbfaf0e2e6~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/db74f4_d97dec3cf1894165831953cbfaf0e2e6~mv2.jpg",
    reservationImage:
      "https://static.wixstatic.com/media/db74f4_6027436f3d9649d089b7b9b8a9c8db33~mv2.png/v1/fill/w_600,h_400,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/db74f4_6027436f3d9649d089b7b9b8a9c8db33~mv2.png",
    aboutImage1:
      "https://static.wixstatic.com/media/db74f4_173a67f702bb4ab38c4d87d9b941d25c~mv2.png/v1/fill/w_600,h_900,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Salmon1_edited.png",
    aboutImage2:
      "https://static.wixstatic.com/media/db74f4_c25e3513d4584fa7aa0204f2b964e234~mv2.png/v1/fill/w_600,h_812,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_5639_edited.png",
    // Client-side admin password. NOTE: because this is a static site with
    // no server, this is a soft deterrent (keeps casual visitors out of
    // /admin.html), not real security — anyone who reads the page source
    // can find it. See README.md for details and how to upgrade this.
    adminPassword: "ember2024"
  },

  about: {
    heading: "Raíces, sabor, & alma.",
    paragraphs: [
      "Owned and led by Chef Julio Peraza, Torogoz blends contemporary technique with rich Latin culinary traditions to create an unforgettable dining experience.",
      "Located in Sewickley, PA, we offer house-created cocktails, the best Latin wines, and a mix of modern and traditional Central and South American dishes reminiscent of the life and travels of our Chef and Owner."
    ],
    stats: [
      { value: "12+", label: "Latin Regions" },
      { value: "30+", label: "Local Partners" },
      { value: "100+", label: "Spirits & Wines" }
    ]
  },

  categories: [
    { id: 1, name: "Aperitivos", slug: "aperitivos", description: "Small plates & shared starters to begin the journey", sortOrder: 1, isActive: true },
    { id: 2, name: "Platos Fuertes", slug: "platos-fuertes", description: "Contemporary Latin entrées from land and sea", sortOrder: 2, isActive: true },
    { id: 3, name: "Postres", slug: "postres", description: "Sweet endings inspired by Latin tradition", sortOrder: 3, isActive: true },
    { id: 4, name: "Cócteles & Bebidas", slug: "cocteles", description: "Handcrafted cocktails, mezcal, pisco & artisan beverages", sortOrder: 4, isActive: true }
  ],

  items: [
    // Aperitivos
    { id: 1, categoryId: 1, name: "Ceviche Clásico", description: "Fresh catch, leche de tigre, red onion, sweet potato, choclo, crispy cancha", price: "18", imageUrl: "https://static.wixstatic.com/media/db74f4_c25e3513d4584fa7aa0204f2b964e234~mv2.png/v1/fill/w_600,h_400,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_5639_edited.png", dietaryTags: ["gf", "df"], isChefsPick: true, isAvailable: true, sortOrder: 1 },
    { id: 2, categoryId: 1, name: "Empanadas de Carne", description: "Hand-crimped pastry, spiced beef picadillo, chimichurri, pickled onion", price: "16", imageUrl: "https://static.wixstatic.com/media/db74f4_6027436f3d9649d089b7b9b8a9c8db33~mv2.png/v1/fill/w_600,h_400,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/db74f4_6027436f3d9649d089b7b9b8a9c8db33~mv2.png", dietaryTags: [], isChefsPick: false, isAvailable: true, sortOrder: 2 },
    { id: 3, categoryId: 1, name: "Elote Asado", description: "Charred street corn, cotija, chipotle mayo, lime, tajín", price: "12", imageUrl: null, dietaryTags: ["vegetarian", "gf"], isChefsPick: false, isAvailable: true, sortOrder: 3 },
    { id: 4, categoryId: 1, name: "Tostones con Guacamole", description: "Twice-fried green plantain, house guacamole, pico de gallo, crema", price: "14", imageUrl: null, dietaryTags: ["vegan", "gf"], isChefsPick: false, isAvailable: true, sortOrder: 4 },
    { id: 5, categoryId: 1, name: "Pupusas de Queso y Loroco", description: "Salvadoran masa cakes, quesillo & loroco flower, curtido, salsa roja", price: "15", imageUrl: "https://static.wixstatic.com/media/db74f4_d97dec3cf1894165831953cbfaf0e2e6~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/db74f4_d97dec3cf1894165831953cbfaf0e2e6~mv2.jpg", dietaryTags: ["vegetarian"], isChefsPick: true, isAvailable: true, sortOrder: 5 },
    { id: 6, categoryId: 1, name: "Pastelitos de Pollo", description: "Crispy chicken pastries, house salsa, pickled vegetables", price: "14", imageUrl: null, dietaryTags: [], isChefsPick: false, isAvailable: true, sortOrder: 6 },

    // Platos Fuertes
    { id: 7, categoryId: 2, name: "Churrasco a la Parrilla", description: "12oz grass-fed skirt steak, chimichurri, yuca frita, ensalada mixta", price: "38", imageUrl: "https://static.wixstatic.com/media/db74f4_d97dec3cf1894165831953cbfaf0e2e6~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/db74f4_d97dec3cf1894165831953cbfaf0e2e6~mv2.jpg", dietaryTags: [], isChefsPick: true, isAvailable: true, sortOrder: 1 },
    { id: 8, categoryId: 2, name: "Salmon Torogoz", description: "Pan-seared Atlantic salmon, Latin-inspired glaze, seasonal vegetables", price: "34", imageUrl: "https://static.wixstatic.com/media/db74f4_173a67f702bb4ab38c4d87d9b941d25c~mv2.png/v1/fill/w_600,h_400,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Salmon1_edited.png", dietaryTags: [], isChefsPick: true, isAvailable: true, sortOrder: 2 },
    { id: 9, categoryId: 2, name: "Mole Negro de Oaxaca", description: "Slow-braised chicken, 30-ingredient mole, sesame, arroz rojo, tortillas", price: "32", imageUrl: null, dietaryTags: ["gf"], isChefsPick: false, isAvailable: true, sortOrder: 3 },
    { id: 10, categoryId: 2, name: "Pescado del Día", description: "Market fresh fish, coconut-lime broth, plantain rice, pickled habanero", price: "34", imageUrl: null, dietaryTags: ["gf", "df"], isChefsPick: false, isAvailable: true, sortOrder: 4 },
    { id: 11, categoryId: 2, name: "Lomo Saltado", description: "Peruvian stir-fry, beef tenderloin, tomato, onion, ají amarillo, fries, rice", price: "36", imageUrl: "https://static.wixstatic.com/media/db74f4_6027436f3d9649d089b7b9b8a9c8db33~mv2.png/v1/fill/w_600,h_400,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/db74f4_6027436f3d9649d089b7b9b8a9c8db33~mv2.png", dietaryTags: ["gf"], isChefsPick: false, isAvailable: true, sortOrder: 5 },
    { id: 12, categoryId: 2, name: "Filet Mignon", description: "8oz center-cut filet, Latin spice rub, roasted root vegetables, red wine jus", price: "44", imageUrl: null, dietaryTags: [], isChefsPick: false, isAvailable: true, sortOrder: 6 },
    { id: 13, categoryId: 2, name: "Half Chicken", description: "Free-range herb-roasted half chicken, seasonal sides, chimichurri", price: "28", imageUrl: null, dietaryTags: ["gf", "df"], isChefsPick: false, isAvailable: true, sortOrder: 7 },
    { id: 14, categoryId: 2, name: "Calabaza & Quinoa Bowl", description: "Roasted squash, black quinoa, pepitas, avocado crema, salsa macha", price: "24", imageUrl: null, dietaryTags: ["vegan", "gf"], isChefsPick: false, isAvailable: true, sortOrder: 8 },

    // Postres
    { id: 15, categoryId: 3, name: "Tres Leches", description: "Three-milk sponge, dulce de leche, toasted meringue, seasonal berries", price: "14", imageUrl: "https://static.wixstatic.com/media/db74f4_c25e3513d4584fa7aa0204f2b964e234~mv2.png/v1/fill/w_600,h_400,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_5639_edited.png", dietaryTags: [], isChefsPick: true, isAvailable: true, sortOrder: 1 },
    { id: 16, categoryId: 3, name: "Churros con Chocolate", description: "Crispy cinnamon churros, Oaxacan chocolate dipping sauce, cajeta", price: "12", imageUrl: null, dietaryTags: ["vegetarian"], isChefsPick: false, isAvailable: true, sortOrder: 2 },
    { id: 17, categoryId: 3, name: "Flan de Coco", description: "Coconut custard, passion fruit coulis, toasted coconut flakes", price: "13", imageUrl: null, dietaryTags: ["gf", "vegetarian"], isChefsPick: false, isAvailable: true, sortOrder: 3 },

    // Cócteles & Bebidas
    { id: 18, categoryId: 4, name: "Mezcal Negroni", description: "Smoky mezcal, Campari, sweet vermouth, orange peel, sal de gusano rim", price: "17", imageUrl: null, dietaryTags: [], isChefsPick: true, isAvailable: true, sortOrder: 1 },
    { id: 19, categoryId: 4, name: "Pisco Sour", description: "Peruvian pisco, fresh lime, simple syrup, egg white, Angostura bitters", price: "16", imageUrl: null, dietaryTags: [], isChefsPick: false, isAvailable: true, sortOrder: 2 },
    { id: 20, categoryId: 4, name: "Maracuyá Margarita", description: "Blanco tequila, passion fruit, lime, agave, tajín rim", price: "15", imageUrl: null, dietaryTags: [], isChefsPick: false, isAvailable: true, sortOrder: 3 },
    { id: 21, categoryId: 4, name: "Latin Wines", description: "Rotating selection of the best wines from Argentina, Chile, and Spain", price: "14", imageUrl: null, dietaryTags: [], isChefsPick: false, isAvailable: true, sortOrder: 4 },
    { id: 22, categoryId: 4, name: "Agua Fresca del Día", description: "House-made seasonal fruit water — ask your server for today's flavor", price: "6", imageUrl: null, dietaryTags: ["vegan"], isChefsPick: false, isAvailable: true, sortOrder: 5 }
  ],

  events: [
    {
      id: 1,
      title: "Mezcal Tasting Night",
      description: "Guided flight of five artisanal mezcals paired with small bites. Limited to 30 guests.",
      eventDate: "First Friday of Each Month",
      imageUrl: "https://static.wixstatic.com/media/db74f4_6027436f3d9649d089b7b9b8a9c8db33~mv2.png/v1/fill/w_600,h_400,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/db74f4_6027436f3d9649d089b7b9b8a9c8db33~mv2.png",
      isActive: true,
      showOnMenu: true
    },
    {
      id: 2,
      title: "Chef's Table Experience",
      description: "Seven-course tasting menu at our chef's counter with Chef Julio Peraza. Wine & cocktail pairings available.",
      eventDate: "Thu–Sat Evenings",
      imageUrl: null,
      isActive: true,
      showOnMenu: true
    },
    {
      id: 3,
      title: "Latin Wine Dinner",
      description: "Five-course pairing featuring the finest wines from Argentina and Chile. Limited seating.",
      eventDate: "Last Saturday of the Month",
      imageUrl: "https://static.wixstatic.com/media/db74f4_d97dec3cf1894165831953cbfaf0e2e6~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/db74f4_d97dec3cf1894165831953cbfaf0e2e6~mv2.jpg",
      isActive: true,
      showOnMenu: true
    }
  ],

  reviews: [
    { id: 1, authorName: "John H.", rating: 5, reviewText: "Fantastic Latin cuisine with amazing cocktails. Ceviche is excellent and both the strip steak and fish of the day were great. Wonderful addition to the Sewickley food scene. Service was superb!", relativeTime: "2 weeks ago", isActive: true },
    { id: 2, authorName: "Alexia D.", rating: 5, reviewText: "Delicious flavors, great portions. Authentic and unique. Everything we tried at dinner tonight was great! The vibe and atmosphere are lovely! Amazing staff, friendly and attentive. Kudos to the Chef!", relativeTime: "1 month ago", isActive: true },
    { id: 3, authorName: "Robert Z.", rating: 5, reviewText: "Latin American food at its finest. Service was excellent and the restaurant has nice ambiance and delicious cocktails. The ceviche was perfect and I recommend the half chicken or filet mignon entrees.", relativeTime: "3 weeks ago", isActive: true },
    { id: 4, authorName: "Carla L.", rating: 5, reviewText: "How lovely! I decided to try Torogoz for a bite and glass of wine. The restaurant is cozy and has wonderful atmosphere. The food was fresh, flavorful, and beautifully presented. A real gem in Sewickley.", relativeTime: "1 month ago", isActive: true },
    { id: 5, authorName: "Tiffany Y.", rating: 5, reviewText: "A wonderful addition to the Sewickley food scene. Torogoz offers an exceptionally pleasant dining adventure. The menu is diverse and the food is outstanding. Chef Julio really knows his craft.", relativeTime: "2 months ago", isActive: true },
    { id: 6, authorName: "Michael W.", rating: 5, reviewText: "Wonderful staff, very friendly. We always choose to sit at the bar. Enjoy the rotating appetizers and the skirt steak. The house cocktails are creative and delicious. Will definitely be back!", relativeTime: "3 weeks ago", isActive: true }
  ]
};

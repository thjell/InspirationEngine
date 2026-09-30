const createProductImage = ({ label, primary, secondary, accent, tone }) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${primary}"/>
          <stop offset="100%" stop-color="${secondary}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="560" fill="url(#bg)"/>
      <circle cx="680" cy="120" r="120" fill="${accent}" opacity="0.18"/>
      <rect x="110" y="170" width="580" height="220" rx="30" fill="${tone}" opacity="0.9"/>
      <rect x="220" y="210" width="360" height="140" rx="18" fill="rgba(255,255,255,0.12)"/>
      <text x="400" y="320" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="40" font-weight="700" fill="#ffffff" letter-spacing="2">${label}</text>
      <text x="400" y="370" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="600" fill="rgba(255,255,255,0.82)" letter-spacing="6">DEMO</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const demoProducts = [
  {
    id: "gaming-001",
    name: "Lenovo Legion Pro 5",
    category: "Gaming",
    price: 13490,
    oldPrice: 17990,
    image: createProductImage({ label: "LEGION", primary: "#111827", secondary: "#ff7a00", accent: "#ffb703", tone: "#1f2937" }),
    description: "Kraftfull gamingmaskin med flytende oppdateringsfrekvens og premium kjøling.",
    productUrl: "https://www.power.no/produkter/lenovo-legion-pro-5",
    interests: ["Gaming"]
  },
  {
    id: "gaming-002",
    name: "ASUS ROG Strix G16",
    category: "Gaming",
    price: 16990,
    oldPrice: 21990,
    image: createProductImage({ label: "ROG", primary: "#0f172a", secondary: "#f97316", accent: "#facc15", tone: "#1e293b" }),
    description: "Teknisk høy ytelse og stor skjerm for både gaming og kreativt arbeid.",
    productUrl: "https://www.power.no/produkter/asus-rog-strix-g16",
    interests: ["Gaming"]
  },
  {
    id: "gaming-003",
    name: "MSI Katana 15",
    category: "Gaming",
    price: 10990,
    oldPrice: 14990,
    image: createProductImage({ label: "KATANA", primary: "#1f2937", secondary: "#ef4444", accent: "#fbbf24", tone: "#374151" }),
    description: "Solid gaminglaptop med god balanse mellom pris, effektivitet og ytelse.",
    productUrl: "https://www.power.no/produkter/msi-katana-15",
    interests: ["Gaming"]
  },
  {
    id: "gaming-004",
    name: "Logitech G Pro X",
    category: "Gaming",
    price: 1890,
    oldPrice: 2590,
    image: createProductImage({ label: "G PRO", primary: "#111827", secondary: "#f59e0b", accent: "#fcd34d", tone: "#1f2937" }),
    description: "Komfortabel gaming-headset med presist lyd og sterk mikrofon.",
    productUrl: "https://www.power.no/produkter/logitech-g-pro-x",
    interests: ["Gaming"]
  },
  {
    id: "tv-001",
    name: "Samsung QLED 65\"",
    category: "TV & lyd",
    price: 15490,
    oldPrice: 19990,
    image: createProductImage({ label: "QLED", primary: "#111827", secondary: "#0ea5e9", accent: "#e0f2fe", tone: "#1d4ed8" }),
    description: "Store bilder, sterke farger og smart opplevelse for hele hjemmet.",
    productUrl: "https://www.power.no/produkter/samsung-qled-65",
    interests: ["TV & lyd"]
  },
  {
    id: "tv-002",
    name: "Sony WH-1000XM5",
    category: "TV & lyd",
    price: 3490,
    oldPrice: 4290,
    image: createProductImage({ label: "SONY", primary: "#1f2937", secondary: "#3b82f6", accent: "#93c5fd", tone: "#0f172a" }),
    description: "Nøyaktig lyd og komfort for langvarig bruk hjemme eller på farten.",
    productUrl: "https://www.power.no/produkter/sony-wh-1000xm5",
    interests: ["TV & lyd"]
  },
  {
    id: "tv-003",
    name: "Bang & Olufsen Beoplay A9",
    category: "TV & lyd",
    price: 6790,
    oldPrice: 8990,
    image: createProductImage({ label: "A9", primary: "#111827", secondary: "#f97316", accent: "#fdba74", tone: "#374151" }),
    description: "Premium lyd for moderne hjem og elegant design som passer inn i alle rom.",
    productUrl: "https://www.power.no/produkter/beoplay-a9",
    interests: ["TV & lyd"]
  },
  {
    id: "data-001",
    name: "Dell XPS 13",
    category: "Data",
    price: 12990,
    oldPrice: 16990,
    image: createProductImage({ label: "XPS 13", primary: "#0f172a", secondary: "#3b82f6", accent: "#bfdbfe", tone: "#1d4ed8" }),
    description: "Lett og kraftig ultrabook for både arbeid og hverdag.",
    productUrl: "https://www.power.no/produkter/dell-xps-13",
    interests: ["Data"]
  },
  {
    id: "data-002",
    name: "Apple MacBook Air 13",
    category: "Data",
    price: 14990,
    oldPrice: 17990,
    image: createProductImage({ label: "AIR", primary: "#0f172a", secondary: "#a855f7", accent: "#e9d5ff", tone: "#312e81" }),
    description: "Perfekt til nettsteder, kreativt arbeid og en rask hverdag.",
    productUrl: "https://www.power.no/produkter/macbook-air-13",
    interests: ["Data"]
  },
  {
    id: "data-003",
    name: "Lenovo ThinkPad T14",
    category: "Data",
    price: 8990,
    oldPrice: 11990,
    image: createProductImage({ label: "THINKPAD", primary: "#111827", secondary: "#22c55e", accent: "#bbf7d0", tone: "#14532d" }),
    description: "Pålitelig arbeidsmaskin med god batterilevetid og stabil ytelse.",
    productUrl: "https://www.power.no/produkter/lenovo-thinkpad-t14",
    interests: ["Data"]
  },
  {
    id: "mobile-001",
    name: "iPhone 15 Pro",
    category: "Mobil",
    price: 12990,
    oldPrice: 14990,
    image: createProductImage({ label: "IPHONE", primary: "#111827", secondary: "#64748b", accent: "#e2e8f0", tone: "#334155" }),
    description: "Flaggskip-smartphone med kraftig kamera og elegant design.",
    productUrl: "https://www.power.no/produkter/iphone-15-pro",
    interests: ["Mobil"]
  },
  {
    id: "mobile-002",
    name: "Samsung Galaxy S24",
    category: "Mobil",
    price: 8990,
    oldPrice: 10990,
    image: createProductImage({ label: "GALAXY", primary: "#0f172a", secondary: "#8b5cf6", accent: "#ddd6fe", tone: "#3b0764" }),
    description: "Smidige funksjoner og pent bilde for hverdag og det digitale livet.",
    productUrl: "https://www.power.no/produkter/samsung-galaxy-s24",
    interests: ["Mobil"]
  },
  {
    id: "mobile-003",
    name: "Nothing Phone (2)",
    category: "Mobil",
    price: 5990,
    oldPrice: 7990,
    image: createProductImage({ label: "NOTHING", primary: "#111827", secondary: "#f59e0b", accent: "#fde68a", tone: "#78350f" }),
    description: "En moderne telefon med sterk profil og god allround-ytelse.",
    productUrl: "https://www.power.no/produkter/nothing-phone-2",
    interests: ["Mobil"]
  },
  {
    id: "home-001",
    name: "Philips Hue Starter Kit",
    category: "Hjem",
    price: 1799,
    oldPrice: 2499,
    image: createProductImage({ label: "HUE", primary: "#111827", secondary: "#f97316", accent: "#fdba74", tone: "#7c2d12" }),
    description: "Skap stemning hjemme med smart belysning og enkel innstilling.",
    productUrl: "https://www.power.no/produkter/philips-hue-starter-kit",
    interests: ["Hjem"]
  },
  {
    id: "home-002",
    name: "Dyson V12 Detect Slim",
    category: "Hjem",
    price: 5990,
    oldPrice: 7990,
    image: createProductImage({ label: "DYSON", primary: "#0f172a", secondary: "#14b8a6", accent: "#99f6e4", tone: "#134e4a" }),
    description: "Mye kraft i en compact støvsuger for ryddig og moderne hjem.",
    productUrl: "https://www.power.no/produkter/dyson-v12",
    interests: ["Hjem"]
  },
  {
    id: "home-003",
    name: "Sonos Era 100",
    category: "Hjem",
    price: 3990,
    oldPrice: 4890,
    image: createProductImage({ label: "SONOS", primary: "#0f172a", secondary: "#ec4899", accent: "#fbcfe8", tone: "#831843" }),
    description: "Fin, klar lyd med enkel integrasjon i hele hjemmet.",
    productUrl: "https://www.power.no/produkter/sonos-era-100",
    interests: ["Hjem"]
  }
];

const budgetFilters = {
  "under-1000": (product) => product.price < 1000,
  "1000-5000": (product) => product.price >= 1000 && product.price <= 5000,
  "5000-plus": (product) => product.price >= 5000,
  any: () => true
};

const matchesInterest = (product, interest) => {
  if (interest === "Overrask meg") {
    return true;
  }

  const normalizedInterest = interest.trim();
  return product.category === normalizedInterest || product.interests.includes(normalizedInterest);
};

export function findRecommendedProducts({ interest, budget }) {
  const matches = demoProducts.filter((product) => {
    if (!matchesInterest(product, interest)) {
      return false;
    }

    const budgetFilter = budgetFilters[budget] || budgetFilters.any;
    return budgetFilter(product);
  });

  return matches
    .slice()
    .sort((a, b) => (b.oldPrice - b.price) - (a.oldPrice - a.price));
}

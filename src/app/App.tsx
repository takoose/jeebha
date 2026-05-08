import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Paintbrush, 
  Wrench, 
  BrickWall, 
  HardHat,
  ChevronRight,
  ChevronLeft,
  Clock,
  Phone,
  MessageCircle,
  Star,
  Home,
  ClipboardList,
  User,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  CreditCard,
  Settings,
  Languages,
  LogOut,
  Map as MapIcon,
  Camera,
  Store,
  Plus,
  Minus,
  Smartphone,
  Banknote,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type View = 'home' | 'order' | 'shop' | 'checkout' | 'tracking' | 'history' | 'profile';
type Language = 'en' | 'fr' | 'ar';

const translations = {
  en: {
    search: "Search shops, tools, materials...",
    photoSearch: "Photo Match",
    categories: "Categories",
    painting: "Painting", power: "Tools", building: "Materials", safety: "Safety",
    needTruck: "Just need a truck?",
    fastDelivery: "Got your own items? Hire a driver.",
    findDriver: "Find a Driver",
    nearbyShops: "Nearby Partner Shops",
    recent: "Recent Orders",
    home: "Home", orders: "Orders", profile: "Profile",
    where: "Where to?",
    pickup: "Pickup (e.g. Shop)",
    dropoff: "Drop-off (Site/Home)",
    what: "What's being delivered?",
    placeholder: "e.g. 5 bags of cement, drill...",
    review: "Review Order",
    confirm: "Confirm Order",
    estTime: "Est. Time",
    distance: "Distance",
    total: "Total",
    guarantee: "Fixed Price Guarantee",
    guaranteeDesc: "The price you see is what you pay.",
    live: "Live Tracking",
    estArrival: "Estimated arrival",
    away: "away",
    share: "Share Status",
    pastOrders: "Past Orders",
    receipt: "Receipt", reorder: "Reorder",
    savedAddr: "Saved Addresses", payMethods: "Payment Methods",
    lang: "Language", settings: "Settings", logout: "Log out",
    loc: "Location",
    registerShop: "Are you a seller? Register your shop",
    products: "Products",
    addToCart: "Add",
    checkout: "Checkout",
    paymentMethod: "Payment Method",
    baridimob: "Baridimob (App)",
    edahabia: "Edahabia Card",
    cash: "Cash on Delivery",
    items: "Items",
    deliveryFee: "Delivery Fee",
    cantFind: "Can't find what you need?",
    describeNeeds: "Describe the materials you need and we will check availability.",
    requestPlaceholder: "e.g., 20m of 2.5mm electrical wire...",
    sendRequest: "Send Request",
    sending: "Sending...",
    requestSent: "Request sent! Waiting for shop response...",
    shopType1: "Hardware & Tools",
    shopType2: "General Materials",
    profileName: "Nassim Dev",
    city: "Bab Ezzouar, Algiers",
    savedCount: "2 saved",
    payMethodsDesc: "Baridimob, Edahabia",
    delivered: "Delivered",
    withDriver: "with",
    p1: "Bosch GSB 18V Drill",
    p2: "Set of Screwdrivers (12pcs)",
    p3: "Safety Helmet",
    p4: "Cement CPJ 45 (50kg)",
    p5: "White Paint 20L",
    p6: "Red Bricks (x100)",
    order1: "Power Drill, Extension Cords",
    today: "Today, 10:30 AM",
    min: "min",
    kmAway: "km away",
    driverName: "Karim B.",
    vehicle: "Renault Master • 01234 116 16"
  },
  fr: {
    search: "Rechercher boutiques, outils...",
    photoSearch: "Recherche photo",
    categories: "Catégories",
    painting: "Peinture", power: "Outillage", building: "Matériaux", safety: "Sécurité",
    needTruck: "Juste besoin d'un camion ?",
    fastDelivery: "Vous avez déjà vos articles ? Louez un chauffeur.",
    findDriver: "Trouver un chauffeur",
    nearbyShops: "Boutiques Partenaires",
    recent: "Commandes récentes",
    home: "Accueil", orders: "Commandes", profile: "Profil",
    where: "Où allons-nous ?",
    pickup: "Point de retrait",
    dropoff: "Livraison (Chantier/Maison)",
    what: "Que devons-nous livrer ?",
    placeholder: "ex: 5 sacs de ciment...",
    review: "Vérifier",
    confirm: "Confirmer",
    estTime: "Temps estimé",
    distance: "Distance",
    total: "Total",
    guarantee: "Prix fixe garanti",
    guaranteeDesc: "Le prix affiché est le prix payé.",
    live: "Suivi en direct",
    estArrival: "Arrivée estimée",
    away: "de distance",
    share: "Partager",
    pastOrders: "Commandes passées",
    receipt: "Reçu", reorder: "Recommander",
    savedAddr: "Adresses", payMethods: "Moyens de paiement",
    lang: "Langue", settings: "Paramètres", logout: "Déconnexion",
    loc: "Position",
    registerShop: "Vendeur ? Inscrivez votre boutique",
    products: "Produits",
    addToCart: "Ajouter",
    checkout: "Commander",
    paymentMethod: "Moyen de paiement",
    baridimob: "Baridimob (App)",
    edahabia: "Carte Edahabia",
    cash: "Paiement à la livraison",
    items: "Articles",
    deliveryFee: "Frais de livraison",
    cantFind: "Vous ne trouvez pas votre article ?",
    describeNeeds: "Décrivez ce dont vous avez besoin et nous vérifierons la disponibilité.",
    requestPlaceholder: "ex: 20m de fil électrique 2.5mm...",
    sendRequest: "Envoyer la demande",
    sending: "Envoi en cours...",
    requestSent: "Demande envoyée ! En attente de réponse...",
    shopType1: "Quincaillerie & Outils",
    shopType2: "Matériaux Généraux",
    profileName: "Nassim Dev",
    city: "Bab Ezzouar, Alger",
    savedCount: "2 enregistrées",
    payMethodsDesc: "Baridimob, Edahabia",
    delivered: "Livré",
    withDriver: "avec",
    p1: "Perceuse Bosch GSB 18V",
    p2: "Jeu de tournevis (12pcs)",
    p3: "Casque de sécurité",
    p4: "Ciment CPJ 45 (50kg)",
    p5: "Peinture Blanche 20L",
    p6: "Briques Rouges (x100)",
    order1: "Perceuse, Rallonges",
    today: "Aujourd'hui, 10h30",
    min: "min",
    kmAway: "km de distance",
    driverName: "Karim B.",
    vehicle: "Renault Master • 01234 116 16"
  },
  ar: {
    search: "ابحث عن متاجر، أدوات، مواد...",
    photoSearch: "بحث بالصورة",
    categories: "الفئات",
    painting: "صباغة", power: "أدوات", building: "مواد بناء", safety: "سلامة",
    needTruck: "تحتاج شاحنة فقط؟",
    fastDelivery: "لديك أغراضك؟ استأجر سائقاً.",
    findDriver: "ابحث عن سائق",
    nearbyShops: "المتاجر الشريكة القريبة",
    recent: "الطلبات الأخيرة",
    home: "الرئيسية", orders: "الطلبات", profile: "حسابي",
    where: "إلى أين؟",
    pickup: "مكان الاستلام",
    dropoff: "مكان التسليم (الورشة/المنزل)",
    what: "ما الذي سيتم توصيله؟",
    placeholder: "مثال: 5 أكياس أسمنت...",
    review: "مراجعة",
    confirm: "تأكيد الطلب",
    estTime: "الوقت المقدر",
    distance: "المسافة",
    total: "المجموع",
    guarantee: "ضمان السعر الثابت",
    guaranteeDesc: "السعر الذي تراه هو ما تدفعه.",
    live: "تتبع مباشر",
    estArrival: "الوصول المقدر",
    away: "بعيد",
    share: "مشاركة",
    pastOrders: "الطلبات السابقة",
    receipt: "إيصال", reorder: "إعادة الطلب",
    savedAddr: "العناوين المحفوظة", payMethods: "طرق الدفع",
    lang: "اللغة", settings: "الإعدادات", logout: "تسجيل الخروج",
    loc: "الموقع",
    registerShop: "هل أنت بائع؟ سجل متجرك",
    products: "المنتجات",
    addToCart: "إضافة",
    checkout: "إتمام الطلب",
    paymentMethod: "طريقة الدفع",
    baridimob: "تطبيق بريدي موب",
    edahabia: "البطاقة الذهبية",
    cash: "الدفع عند الاستلام",
    items: "العناصر",
    deliveryFee: "رسوم التوصيل",
    cantFind: "لم تجد ما تحتاجه؟",
    describeNeeds: "صف المواد التي تحتاجها وسنتحقق من توفرها.",
    requestPlaceholder: "مثال: 20 متر من سلك كهربائي 2.5 مم...",
    sendRequest: "إرسال الطلب",
    sending: "جاري الإرسال...",
    requestSent: "تم إرسال الطلب! في انتظار رد المتجر...",
    shopType1: "خردوات وأدوات",
    shopType2: "مواد عامة",
    profileName: "نسيم ديف",
    city: "باب الزوار، الجزائر",
    savedCount: "2 محفوظة",
    payMethodsDesc: "بريدي موب، الذهبية",
    delivered: "تم التوصيل",
    withDriver: "مع",
    p1: "مثقاب بوش GSB 18V",
    p2: "طقم مفكات (12 قطعة)",
    p3: "خوذة أمان",
    p4: "أسمنت CPJ 45 (50 كجم)",
    p5: "طلاء أبيض 20 لتر",
    p6: "طوب أحمر (x100)",
    order1: "مثقاب، أسلاك تمديد",
    today: "اليوم، 10:30 صباحاً",
    min: "دقيقة",
    kmAway: "كم بعيد",
    driverName: "كريم ب.",
    vehicle: "رينو ماستر • 01234 116 16"
  }
};

type LocaleProps = {
  t: typeof translations.en;
  lang: Language;
  setLang: (lang: Language) => void;
  isRtl: boolean;
};

// MOCK DATA
const SHOPS = [
  {
    id: 's1',
    name: 'Brico-Store Rouiba',
    rating: 4.8,
    distance: '2.5 km',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80',
    typeKey: 'shopType1'
  },
  {
    id: 's2',
    name: 'Quincaillerie El-Amine',
    rating: 4.6,
    distance: '3.1 km',
    image: 'https://images.unsplash.com/photo-1581011835706-95f70bbbebe8?w=500&q=80',
    typeKey: 'shopType2'
  }
];

const PRODUCTS = {
  's1': [
    { id: 'p1', price: 28500, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&q=80' },
    { id: 'p2', price: 3200, image: 'https://images.unsplash.com/photo-1540104539488-92a51bbc0410?w=300&q=80' },
    { id: 'p3', price: 1500, image: 'https://images.unsplash.com/photo-1550155562-b9e735e5d3a3?w=300&q=80' },
  ],
  's2': [
    { id: 'p4', price: 1100, image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80' },
    { id: 'p5', price: 6500, image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&q=80' },
    { id: 'p6', price: 4500, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&q=80' },
  ]
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState<View>('home');
  const [language, setLanguage] = useState<Language>('en');
  
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});

  const locale = {
    t: translations[language],
    lang: language,
    setLang: setLanguage,
    isRtl: language === 'ar'
  };

  const handleAddToCart = (productId: string, delta: number) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  const clearCart = () => setCart({});

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0A] flex items-center justify-center p-0 sm:p-4 font-sans selection:bg-accent selection:text-accent-foreground" dir={locale.isRtl ? 'rtl' : 'ltr'}>
      <div className="w-full sm:w-[400px] h-[100dvh] sm:h-[850px] bg-background sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col border-[8px] border-[#1a1a1a]">
        
        {/* Safe Area Top */}
        <div className="h-12 w-full flex justify-center pt-2 z-50 absolute top-0 pointer-events-none">
           <div className="w-1/3 h-6 bg-[#1a1a1a] rounded-b-3xl"></div>
        </div>

        <AnimatePresence>
          {showSplash && (
            <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
          )}
        </AnimatePresence>

        {!showSplash && (
          <>
            <div className="flex-1 overflow-y-auto relative z-10 no-scrollbar bg-background">
              <AnimatePresence mode="wait">
                {view === 'home' && (
                  <HomeView 
                    key="home" 
                    onNavigate={setView} 
                    onSelectShop={(id) => {
                      setSelectedShopId(id);
                      setView('shop');
                    }}
                    locale={locale}
                  />
                )}
                {view === 'shop' && selectedShopId && (
                  <ShopView 
                    key="shop" 
                    shopId={selectedShopId} 
                    cart={cart}
                    onUpdateCart={handleAddToCart}
                    onNavigate={setView}
                    locale={locale}
                  />
                )}
                {view === 'checkout' && selectedShopId && (
                  <CheckoutView 
                    key="checkout"
                    shopId={selectedShopId}
                    cart={cart}
                    onNavigate={setView}
                    onComplete={() => {
                      clearCart();
                      setView('tracking');
                    }}
                    locale={locale}
                  />
                )}
                {view === 'order' && (
                  <OrderFlow 
                    key="order" 
                    onNavigate={setView}
                    locale={locale}
                  />
                )}
                {view === 'tracking' && (
                  <TrackingView key="tracking" onNavigate={setView} locale={locale} />
                )}
                {view === 'history' && (
                  <HistoryView key="history" onNavigate={setView} locale={locale} />
                )}
                {view === 'profile' && (
                  <ProfileView key="profile" onNavigate={setView} locale={locale} />
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            {['home', 'history', 'profile'].includes(view) && (
              <BottomNav currentView={view} onNavigate={setView} locale={locale} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// --- SPLASH SCREEN ---
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute inset-0 bg-[#ffffff] z-50 flex items-center justify-center flex-col"
    >
      <motion.img 
         src="/src/imports/jeebha.png" 
         alt="Jeebha Logo"
         initial={{ scale: 0.5, opacity: 0, x: -50 }}
         animate={{ scale: 1, opacity: 1, x: 0 }}
         transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.2 }}
         className="w-64 h-auto object-contain"
      />
    </motion.div>
  );
}

// --- BOTTOM NAV ---
function BottomNav({ currentView, onNavigate, locale: { t } }: { currentView: View, onNavigate: (v: View) => void, locale: LocaleProps }) {
  const tabs = [
    { id: 'home', icon: Home, label: t.home },
    { id: 'history', icon: ClipboardList, label: t.orders },
    { id: 'profile', icon: User, label: t.profile }
  ];

  return (
    <div className="bg-card border-t border-border px-6 pb-8 pt-4 flex justify-between items-center z-20">
      {tabs.map((tab) => {
        const isActive = currentView === tab.id;
        const Icon = tab.icon;
        return (
          <button 
            key={tab.id}
            onClick={() => onNavigate(tab.id as View)}
            className={`flex flex-col items-center gap-1 transition-colors flex-1 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-primary/10' : ''}`}>
              <Icon size={24} className={isActive ? 'fill-primary/20' : ''} />
            </div>
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// --- HOME VIEW ---
function HomeView({ onNavigate, onSelectShop, locale: { t, isRtl } }: { onNavigate: (v: View) => void, onSelectShop: (id: string) => void, locale: LocaleProps }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="pb-24 pt-14"
    >
      <div className="px-6 flex justify-between items-center mb-6">
        <div>
          <h2 className="text-muted-foreground text-sm font-medium">{t.loc}</h2>
          <div className="flex items-center gap-1 cursor-pointer">
            <h1 className="text-xl font-bold text-primary">{t.city}</h1>
            <ChevronRight size={20} className={`text-primary mt-1 ${isRtl ? 'rotate-180' : ''}`} />
          </div>
        </div>
        <div className="w-12 h-12 bg-muted rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer" onClick={() => onNavigate('profile')}>
           <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&auto=format" alt="Profile" />
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-card shadow-sm border border-border/50 rounded-2xl flex items-center p-2 gap-2 cursor-text transition-all focus-within:border-accent">
          <div className="px-2">
            <Search className="text-muted-foreground" size={24} />
          </div>
          <input 
            type="text" 
            placeholder={t.search} 
            className="flex-1 bg-transparent outline-none text-base font-medium placeholder:text-muted-foreground/70"
            readOnly
          />
          <button className="p-3 bg-accent/10 rounded-xl text-accent-foreground hover:bg-accent/20 transition-colors flex items-center gap-2">
             <Camera size={20} />
          </button>
        </div>
      </div>

      <div className="px-6 mb-8">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-primary/10 transition-colors">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Store size={20} />
             </div>
             <span className="font-bold text-sm text-primary">{t.registerShop}</span>
          </div>
          <ChevronRight size={20} className={`text-primary ${isRtl ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <div className="mb-8">
        <div className="px-6 flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold">{t.nearbyShops}</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar snap-x">
          {SHOPS.map((shop) => (
            <button 
              key={shop.id}
              onClick={() => onSelectShop(shop.id)}
              className="snap-start min-w-[240px] bg-card rounded-2xl shadow-sm border border-border overflow-hidden text-left hover:border-accent transition-colors focus:outline-none"
            >
              <div className="h-32 w-full relative">
                <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                  <Star size={12} className="fill-accent text-accent" /> {shop.rating}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-base mb-1 truncate">{shop.name}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <span>{(t as any)[shop.typeKey]}</span>
                  <span>•</span>
                  <span>{shop.distance}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 mb-8">
        <div className="bg-primary text-primary-foreground rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className={`absolute -top-8 opacity-10 ${isRtl ? '-left-8' : '-right-8'}`}>
             <Truck size={120} className={isRtl ? 'scale-x-[-1]' : ''} />
          </div>
          <h3 className="text-xl font-bold mb-2 relative z-10">{t.needTruck}</h3>
          <p className="text-primary-foreground/80 text-sm mb-6 max-w-[200px] relative z-10">{t.fastDelivery}</p>
          
          <button 
            onClick={() => onNavigate('order')}
            className="w-full bg-accent text-accent-foreground py-3 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-[0.98] transition-all relative z-10"
          >
            {t.findDriver} <ArrowRight size={18} className={isRtl ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// --- SHOP VIEW ---
function ShopView({ shopId, cart, onUpdateCart, onNavigate, locale: { t, isRtl } }: { shopId: string, cart: Record<string, number>, onUpdateCart: (id: string, d: number) => void, onNavigate: (v: View) => void, locale: LocaleProps }) {
  const shop = SHOPS.find(s => s.id === shopId)!;
  const products = PRODUCTS[shopId as keyof typeof PRODUCTS] || [];
  
  const [requestText, setRequestText] = useState('');
  const [requestStatus, setRequestStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = products.reduce((sum, p) => sum + (p.price * (cart[p.id] || 0)), 0);

  const handleCustomRequest = () => {
    if (!requestText.trim()) return;
    setRequestStatus('sending');
    setTimeout(() => {
      setRequestStatus('sent');
      setRequestText('');
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: isRtl ? -50 : 50 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: isRtl ? 50 : -50 }}
      className="bg-background min-h-full flex flex-col relative pb-28"
    >
      <div className="relative h-56 w-full">
        <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
        <button onClick={() => onNavigate('home')} className={`absolute top-14 ${isRtl ? 'right-4' : 'left-4'} w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors z-20`}>
          <ChevronLeft size={24} className={isRtl ? 'rotate-180' : ''} />
        </button>
        <div className="absolute bottom-4 left-6 right-6 text-white">
           <h2 className="text-2xl font-black mb-1">{shop.name}</h2>
           <div className="flex items-center gap-4 text-sm font-medium opacity-90">
             <span className="flex items-center gap-1"><Star size={14} className="fill-accent text-accent" /> {shop.rating}</span>
             <span>•</span>
             <span>{(t as any)[shop.typeKey]}</span>
           </div>
        </div>
      </div>

      <div className="p-6">
         <h3 className="text-xl font-bold mb-4">{t.products}</h3>
         <div className="space-y-4">
           {products.map(product => {
             const qty = cart[product.id] || 0;
             const productName = (t as any)[product.id];
             return (
               <div key={product.id} className="flex gap-4 p-3 bg-card border border-border rounded-2xl shadow-sm">
                  <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden shrink-0">
                    <img src={product.image} alt={productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                     <div>
                       <h4 className="font-bold text-sm leading-tight line-clamp-2">{productName}</h4>
                       <span className="text-primary font-black text-sm mt-1 block">{product.price.toLocaleString()} DZD</span>
                     </div>
                     <div className={`flex items-center justify-end ${isRtl ? 'justify-start' : 'justify-end'}`}>
                        {qty > 0 ? (
                          <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                            <button onClick={() => onUpdateCart(product.id, -1)} className="w-7 h-7 flex items-center justify-center bg-card rounded-md shadow-sm"><Minus size={16} /></button>
                            <span className="font-bold text-sm w-4 text-center">{qty}</span>
                            <button onClick={() => onUpdateCart(product.id, 1)} className="w-7 h-7 flex items-center justify-center bg-primary text-primary-foreground rounded-md shadow-sm"><Plus size={16} /></button>
                          </div>
                        ) : (
                          <button onClick={() => onUpdateCart(product.id, 1)} className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-4 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1">
                            <Plus size={16} /> {t.addToCart}
                          </button>
                        )}
                     </div>
                  </div>
               </div>
             )
           })}
         </div>

         {/* Custom Request Box */}
         <div className="mt-8 p-5 bg-card border-2 border-dashed border-border rounded-2xl transition-colors hover:border-primary/50">
            <h3 className="font-bold text-lg mb-2 text-primary">{t.cantFind}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t.describeNeeds}</p>
            
            {requestStatus === 'idle' && (
              <div className="space-y-3">
                <textarea 
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder={t.requestPlaceholder}
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 min-h-[100px] outline-none focus:border-accent text-sm resize-none transition-colors"
                />
                <button 
                  onClick={handleCustomRequest}
                  disabled={!requestText.trim()}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-opacity"
                >
                  <Send size={16} className={isRtl ? 'scale-x-[-1]' : ''} /> {t.sendRequest}
                </button>
              </div>
            )}
            
            {requestStatus === 'sending' && (
              <div className="flex flex-col items-center justify-center py-6 gap-3">
                <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-bold text-muted-foreground">{t.sending}</span>
              </div>
            )}
            
            {requestStatus === 'sent' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-4 text-center gap-2">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 shadow-sm border border-green-200">
                  <CheckCircle2 size={24} />
                </div>
                <p className="font-bold text-green-700">{t.requestSent}</p>
                <button onClick={() => setRequestStatus('idle')} className="text-xs text-muted-foreground underline mt-2">Send another request</button>
              </motion.div>
            )}
         </div>

      </div>

      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 z-50 sm:w-[368px] sm:left-auto sm:right-auto"
          >
            <button 
              onClick={() => onNavigate('checkout')}
              className="w-full bg-accent text-accent-foreground py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-between shadow-xl hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="bg-black/10 w-8 h-8 rounded-full flex items-center justify-center text-sm">{totalItems}</div>
                <span>{t.checkout}</span>
              </div>
              <span>{totalPrice.toLocaleString()} DZD</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// --- CHECKOUT VIEW ---
function CheckoutView({ shopId, cart, onNavigate, onComplete, locale: { t, isRtl } }: { shopId: string, cart: Record<string, number>, onNavigate: (v: View) => void, onComplete: () => void, locale: LocaleProps }) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'baridimob' | 'edahabia' | 'cash'>('cash');
  
  const shop = SHOPS.find(s => s.id === shopId)!;
  const products = PRODUCTS[shopId as keyof typeof PRODUCTS] || [];
  
  const subtotal = products.reduce((sum, p) => sum + (p.price * (cart[p.id] || 0)), 0);
  const deliveryFee = 1200;
  const total = subtotal + deliveryFee;

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: isRtl ? -50 : 50 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: isRtl ? 50 : -50 }}
      className="bg-background min-h-full flex flex-col"
    >
      <div className="px-4 pt-14 pb-4 flex items-center gap-3 bg-card sticky top-0 z-20 border-b border-border shadow-sm">
        <button onClick={() => onNavigate('shop')} className="w-10 h-10 flex items-center justify-center bg-muted rounded-full hover:bg-muted/80">
          <ChevronLeft size={24} className={isRtl ? 'rotate-180' : ''} />
        </button>
        <h2 className="text-xl font-bold flex-1">{t.checkout}</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-28 px-6 pt-6">
        
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border relative mb-6">
           <div className={`absolute top-[2.25rem] bottom-[2.25rem] w-[2px] bg-muted-foreground/30 border-dashed ${isRtl ? 'right-6 border-r-2' : 'left-6 border-l-2'}`}></div>
           
           <div className="flex items-center gap-4 mb-4 relative p-2">
              <div className="w-4 h-4 rounded-full bg-foreground flex-shrink-0 z-10 shadow-sm border-2 border-card"></div>
              <div className="flex-1">
                <span className="text-xs text-muted-foreground block">{t.pickup}</span>
                <span className="font-bold text-sm">{shop.name}</span>
              </div>
           </div>
           
           <div className="flex items-center gap-4 relative bg-accent/10 p-3 rounded-xl border border-accent/20">
              <div className="w-4 h-4 rounded-sm bg-accent flex-shrink-0 z-10 shadow-sm border-2 border-card"></div>
              <input placeholder={t.dropoff} autoFocus className="flex-1 bg-transparent outline-none text-base font-semibold" />
           </div>
        </div>

        <h3 className="font-bold text-lg mb-3">{t.paymentMethod}</h3>
        <div className="space-y-3 mb-8">
           <PaymentOption 
             id="baridimob" 
             title={t.baridimob} 
             icon={Smartphone} 
             color="text-blue-600" 
             bg="bg-blue-50"
             selected={paymentMethod === 'baridimob'} 
             onClick={() => setPaymentMethod('baridimob')} 
           />
           <PaymentOption 
             id="edahabia" 
             title={t.edahabia} 
             icon={CreditCard} 
             color="text-yellow-600" 
             bg="bg-yellow-50"
             selected={paymentMethod === 'edahabia'} 
             onClick={() => setPaymentMethod('edahabia')} 
           />
           <PaymentOption 
             id="cash" 
             title={t.cash} 
             icon={Banknote} 
             color="text-green-600" 
             bg="bg-green-50"
             selected={paymentMethod === 'cash'} 
             onClick={() => setPaymentMethod('cash')} 
           />
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-6">
           <h3 className="font-bold text-base mb-4 border-b border-border pb-2">{t.items}</h3>
           <div className="space-y-2 mb-4">
             {products.filter(p => cart[p.id]).map(p => (
               <div key={p.id} className="flex justify-between text-sm">
                 <span className="text-muted-foreground">{cart[p.id]}x {(t as any)[p.id]}</span>
                 <span className="font-medium">{(p.price * cart[p.id]).toLocaleString()} DZD</span>
               </div>
             ))}
           </div>
           
           <div className="flex justify-between items-center py-3 border-t border-border text-sm">
             <span className="text-muted-foreground">{t.deliveryFee}</span>
             <span className="font-medium">{deliveryFee.toLocaleString()} DZD</span>
           </div>

           <div className="flex justify-between items-center pt-3 border-t border-border text-lg font-black text-primary">
             <span>{t.total}</span>
             <span>{total.toLocaleString()} DZD</span>
           </div>
        </div>

      </div>

      <div className="p-4 bg-background border-t border-border mt-auto sticky bottom-0 z-20">
        <button 
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-accent text-accent-foreground py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed hover:brightness-105 active:scale-[0.98] transition-all"
        >
          {loading ? (
             <div className="w-6 h-6 border-4 border-accent-foreground border-t-transparent rounded-full animate-spin"></div>
          ) : (
             <>{t.confirm} • {total.toLocaleString()} DZD</>
          )}
        </button>
      </div>
    </motion.div>
  )
}

function PaymentOption({ id, title, icon: Icon, color, bg, selected, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-2 transition-all ${selected ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
    >
       <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bg} ${color}`}>
         <Icon size={20} />
       </div>
       <span className="font-bold flex-1">{title}</span>
       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'border-primary' : 'border-muted-foreground'}`}>
         {selected && <div className="w-3 h-3 bg-primary rounded-full"></div>}
       </div>
    </div>
  )
}

// --- LEGACY ORDER FLOW ---
function OrderFlow({ onNavigate, locale: { t, isRtl } }: { onNavigate: (v: View) => void, locale: LocaleProps }) {
  const [loading, setLoading] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: isRtl ? -50 : 50 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: isRtl ? 50 : -50 }}
      className="bg-background min-h-full flex flex-col pb-20"
    >
      <div className="px-4 pt-14 pb-4 flex items-center gap-3 bg-card sticky top-0 z-20 border-b border-border shadow-sm">
        <button onClick={() => onNavigate('home')} className="w-10 h-10 flex items-center justify-center bg-muted rounded-full">
          <ChevronLeft size={24} className={isRtl ? 'rotate-180' : ''} />
        </button>
        <h2 className="text-xl font-bold flex-1">{t.where}</h2>
      </div>

      <div className="flex-1 p-6">
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border relative mb-8">
           <div className={`absolute top-[2.25rem] bottom-[2.25rem] w-[2px] bg-muted-foreground/30 border-dashed ${isRtl ? 'right-6 border-r-2' : 'left-6 border-l-2'}`}></div>
           
           <div className="flex items-center gap-4 mb-4 relative bg-muted/50 p-3 rounded-xl">
              <div className="w-4 h-4 rounded-full bg-foreground flex-shrink-0 z-10 shadow-sm border-2 border-card"></div>
              <input placeholder={t.pickup} className="flex-1 bg-transparent outline-none text-base font-semibold" />
           </div>
           
           <div className="flex items-center gap-4 relative bg-accent/10 p-3 rounded-xl border border-accent/20">
              <div className="w-4 h-4 rounded-sm bg-accent flex-shrink-0 z-10 shadow-sm border-2 border-card"></div>
              <input placeholder={t.dropoff} className="flex-1 bg-transparent outline-none text-base font-semibold" />
           </div>
        </div>

        <h3 className="font-bold text-lg mb-4">{t.what}</h3>
        <textarea 
          placeholder={t.placeholder} 
          className="w-full bg-card border border-border rounded-2xl p-4 min-h-[120px] outline-none font-medium resize-none shadow-sm focus:border-accent"
        />
      </div>

      <div className="p-4 bg-background border-t border-border mt-auto sticky bottom-0">
        <button 
          onClick={() => {
            setLoading(true);
            setTimeout(() => onNavigate('tracking'), 1500);
          }}
          disabled={loading}
          className="w-full bg-accent text-accent-foreground py-4 rounded-2xl font-bold text-lg flex items-center justify-center shadow-lg"
        >
          {loading ? <div className="w-6 h-6 border-4 border-accent-foreground border-t-transparent rounded-full animate-spin"></div> : t.confirm}
        </button>
      </div>
    </motion.div>
  )
}

// --- TRACKING VIEW ---
function TrackingView({ onNavigate, locale: { t, isRtl } }: { onNavigate: (v: View) => void, locale: LocaleProps }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="bg-background min-h-full flex flex-col relative"
    >
      <div className="absolute inset-0 bg-[#e5e3df] z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{
           backgroundImage: 'radial-gradient(#d5d3cf 2px, transparent 2px)',
           backgroundSize: '30px 30px'
        }}></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50 200 L 150 180 L 250 300 L 400 250" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
          <path d="M 50 400 L 200 350 L 300 500" fill="none" stroke="#ffffff" strokeWidth="16" strokeLinecap="round" />
          <path d="M 150 180 L 250 300" fill="none" stroke="var(--primary)" strokeWidth="6" />
        </svg>

        <div className="absolute top-[170px] left-[140px] w-6 h-6 bg-foreground rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10">
           <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
        
        <motion.div 
          className="absolute top-[290px] left-[240px] w-12 h-12 bg-white rounded-xl shadow-xl border border-border flex items-center justify-center z-20"
          animate={{ x: [-10, 0], y: [-15, 0] }}
          transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse', ease: 'easeInOut' }}
        >
           <Truck size={24} className={`text-accent ${isRtl ? 'scale-x-[-1]' : ''}`} />
        </motion.div>
      </div>

      <div className="absolute top-14 left-4 right-4 z-10 flex items-center justify-between">
        <button onClick={() => onNavigate('home')} className="w-12 h-12 flex items-center justify-center bg-card rounded-full shadow-lg hover:scale-105 transition-transform">
          <X size={24} />
        </button>
        <div className="bg-card px-4 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          {t.live}
        </div>
      </div>

      <div className="mt-auto bg-card rounded-t-[2.5rem] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-10 relative border-t border-border">
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6"></div>
        
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-4xl font-black mb-1 text-primary">12 {t.min}</h2>
            <p className="text-muted-foreground font-medium">{t.estArrival}</p>
          </div>
          <div className={`text-${isRtl ? 'left' : 'right'}`}>
            <p className="text-sm font-bold bg-muted px-3 py-1.5 rounded-lg inline-block">1.2 {t.kmAway}</p>
          </div>
        </div>

        <div className="bg-background rounded-2xl p-4 flex items-center gap-4 mb-6 border border-border shadow-sm">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&auto=format" alt="Driver" className="w-14 h-14 rounded-full object-cover border-2 border-card" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
              4.9 <Star size={10} className="fill-accent-foreground" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{t.driverName}</h3>
            <p className="text-xs text-muted-foreground">{t.vehicle}</p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <MessageCircle size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <Phone size={20} />
            </button>
          </div>
        </div>

        <button className="w-full bg-muted text-foreground py-4 rounded-xl font-bold hover:bg-muted/80">{t.share}</button>
      </div>
    </motion.div>
  )
}

function HistoryView({ onNavigate, locale: { t } }: { onNavigate: (v: View) => void, locale: LocaleProps }) {
  const orders = [
    { id: '1', date: t.today, items: t.order1, price: '800 DZD', status: t.delivered, driver: t.driverName },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24 pt-14 px-6">
      <h1 className="text-3xl font-bold mb-8">{t.pastOrders}</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-card border border-border p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                <span className="font-semibold text-sm">{order.status}</span>
              </div>
              <span className="text-sm font-bold text-muted-foreground">{order.price}</span>
            </div>
            <h3 className="font-bold text-lg mb-1">{order.items}</h3>
            <p className="text-sm text-muted-foreground mb-4">{order.date} • {t.withDriver} {order.driver}</p>
            <div className="flex gap-3 pt-4 border-t border-border/50">
              <button className="flex-1 py-2 bg-accent/20 text-primary font-bold rounded-xl text-sm">{t.receipt}</button>
              <button className="flex-1 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-sm">{t.reorder}</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function ProfileView({ onNavigate, locale: { t, lang, setLang, isRtl } }: { onNavigate: (v: View) => void, locale: LocaleProps }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24 pt-14 px-6 bg-background">
      <h1 className="text-3xl font-bold mb-8">{t.profile}</h1>
      
      <div className="flex items-center gap-4 mb-8 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&auto=format" alt="Profile" className="w-16 h-16 rounded-full object-cover" />
        <div>
          <h2 className="text-xl font-bold">{t.profileName}</h2>
          <p className="text-muted-foreground font-medium">+213 555 12 34 56</p>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        <div className="p-4 bg-card rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Languages size={20} className="text-foreground" />
            </div>
            <span className="font-bold text-base">{t.lang}</span>
          </div>
          <div className="flex bg-muted p-1.5 rounded-xl">
             <button onClick={() => setLang('en')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${lang === 'en' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>EN</button>
             <button onClick={() => setLang('fr')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${lang === 'fr' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>FR</button>
             <button onClick={() => setLang('ar')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${lang === 'ar' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>AR</button>
          </div>
        </div>

        <MenuItem icon={MapIcon} label={t.savedAddr} value={t.savedCount} isRtl={isRtl} />
        <MenuItem icon={CreditCard} label={t.payMethods} value={t.payMethodsDesc} isRtl={isRtl} />
        <MenuItem icon={Settings} label={t.settings} isRtl={isRtl} />
      </div>

      <button className="w-full flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-2xl font-bold border border-red-100">
        <div className="flex items-center gap-3">
          <LogOut size={24} className={isRtl ? 'rotate-180' : ''} />
          <span>{t.logout}</span>
        </div>
      </button>
    </motion.div>
  )
}

function MenuItem({ icon: Icon, label, value, isRtl }: { icon: any, label: string, value?: string, isRtl: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border cursor-pointer shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <Icon size={20} className="text-foreground" />
        </div>
        <span className="font-bold text-base">{label}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        {value && <span className="text-sm font-medium">{value}</span>}
        <ChevronRight size={20} className={isRtl ? 'rotate-180' : ''} />
      </div>
    </div>
  )
}

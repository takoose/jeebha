import { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Globe, 
  Smartphone, 
  HardHat, 
  Truck, 
  Handshake, 
  TrendingUp, 
  Clock, 
  MapPin,
  ShieldCheck, 
  ArrowRight,
  Plus,
  Play,
  User as UserIcon,
  Search,
  Map as MapIcon
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import APKDownloader, { triggerDownload } from '../components/APKDownloader';
import LanguagePicker from '../components/LanguagePicker';
import { useTranslation } from '../context/LanguageContext';

// Fix Leaflet icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const navigation = [
  { name: 'Services', items: ['Materials Marketplace', 'Hire Machinery', 'Site Logistics', 'Consultancy'], paths: ['/materials-marketplace', '/hire-machinery', '/site-logistics', '/consultancy'] },
  { name: 'Company', items: ['Our Story', 'Safety', 'Newsroom'], paths: ['/our-story', '/safety', '/newsroom'] },
  { name: 'Business', items: ['Register Shop', 'Work With Us'], paths: ['/shop-registration', '/work-with-us'] },
  { name: 'Careers', items: [], path: '/careers' },
  { name: 'Support', items: ['Help Center', 'Contact'], paths: ['/help-center', '/contact'] },
];

import debounce from 'lodash.debounce';

export default function Home() {
  const { t, language } = useTranslation();
  const getNavName = (name: string) => {
    switch(name) {
      case 'Services': return t('nav.services');
      case 'Materials Marketplace': return t('nav.materials');
      case 'Hire Machinery': return t('nav.machinery');
      case 'Site Logistics': return t('nav.logistics');
      case 'Consultancy': return t('nav.consultancy');
      case 'Company': return t('nav.company');
      case 'Our Story': return t('nav.story');
      case 'Safety': return t('nav.safety');
      case 'Newsroom': return t('nav.newsroom');
      case 'Business': return t('nav.business');
      case 'Register Shop': return t('nav.register_shop');
      case 'Work With Us': return t('nav.work_with_us');
      case 'Careers': return t('nav.careers');
      case 'Support': return t('nav.support');
      case 'Help Center': return t('nav.help_center');
      case 'Contact': return t('nav.contact');
      default: return name;
    }
  };
  const [activeTab, setActiveTab] = useState('order');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [bookingFormData, setBookingFormData] = useState({ departure: '', destination: '' });
  const [showLocationList, setShowLocationList] = useState<'departure' | 'destination' | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState<'departure' | 'destination' | null>(null);
  const [searching, setSearching] = useState(false);
  const [isAPKOpen, setIsAPKOpen] = useState(false);
  
  const placesLib = useMapsLibrary('places');
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);

  useEffect(() => {
    if (!placesLib) return;
    try {
      autocompleteService.current = new placesLib.AutocompleteService();
    } catch (e) {
      console.warn("Google Maps Autocomplete not initialized:", e);
    }
  }, [placesLib]);

  const fetchLocations = useRef(
    debounce(async (value: string) => {
      if (!value.trim()) {
        setPredictions([]);
        setSearching(false);
        return;
      }

      setSearching(true);
      
      // Try Google Maps first if available
      if (autocompleteService.current) {
        try {
          const response = await autocompleteService.current.getPlacePredictions({
            input: value,
          });
          
          if (response.predictions && response.predictions.length > 0) {
            const formatted = response.predictions.map(p => ({
              place_id: p.place_id,
              description: p.description,
              structured_formatting: {
                main_text: p.structured_formatting.main_text,
                secondary_text: p.structured_formatting.secondary_text
              }
            }));
            setPredictions(formatted);
            setSearching(false);
            return;
          }
        } catch (error) {
          console.warn('Google Autocomplete fail, falling back to Photon:', error);
        }
      }

      // Fallback to Photon (OpenStreetMap based search, very fast and CORS-friendly)
      try {
        const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(value)}&limit=5`);
        const data = await response.json();
        
        const photonPredictions = data.features.map((feature: any) => {
          const props = feature.properties;
          const name = props.name || props.street || props.city || 'Unknown Location';
          const secondary = [props.city, props.state, props.country].filter(Boolean).join(', ');
          
          return {
            place_id: feature.geometry.coordinates.join(','),
            description: `${name}${secondary ? ', ' + secondary : ''}`,
            structured_formatting: {
              main_text: name,
              secondary_text: secondary || 'World'
            },
            lat: feature.geometry.coordinates[1],
            lon: feature.geometry.coordinates[0]
          };
        });
        
        setPredictions(photonPredictions);
      } catch (error) {
        console.error('Photon search error:', error);
        setPredictions([]);
      } finally {
        setSearching(false);
      }
    }, 400)
  ).current;

  const handleLocationChange = (type: 'departure' | 'destination', value: string) => {
    setBookingFormData(prev => ({ ...prev, [type]: value }));
    setShowLocationList(type);
    fetchLocations(value);
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    setIsAPKOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans">
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-4 md:px-6 py-3 md:py-4",
        isScrolled 
          ? "bg-white shadow-lg text-[#0F172A]" 
          : "bg-navy/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none text-white font-medium"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2 md:gap-4 group">
              <img src="/img/jeebha.svg" alt="Jeebha" className="w-10 h-10 md:w-16 md:h-16 group-hover:scale-110 transition-transform" />
              <span className="text-2xl md:text-4xl font-black italic tracking-tighter group-hover:text-yellow transition-colors">
                Jeebha
              </span>
            </Link>
            
            {/* Desktop Nav Items */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <div 
                  key={item.name} 
                  onClick={() => item.path && (window.location.href = item.path)}
                  className="group relative flex items-center gap-1 cursor-pointer font-medium text-sm transition-colors hover:text-yellow"
                >
                  {getNavName(item.name)}
                  {(item.items?.length ?? 0) > 0 && <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform" />}
                  
                  {(item.items?.length ?? 0) > 0 && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white text-navy shadow-2xl rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all -translate-y-2 group-hover:translate-y-0">
                      {item.items?.map((subItem, idx) => (
                        <div 
                          key={subItem} 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.paths) window.location.href = item.paths[idx];
                          }}
                          className="py-2 px-3 hover:bg-slate-50 rounded-lg hover:text-yellow transition-colors cursor-pointer text-sm font-bold text-navy"
                        >
                          {getNavName(subItem)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <LanguagePicker dark={isScrolled} />
            
            {user ? (
               <Link to="/dashboard" className="flex items-center gap-2 bg-navy text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-xs md:text-sm hover:scale-105 transition-all shadow-lg">
                  <UserIcon size={14} className="text-yellow" />
                  <span className="hidden sm:inline">{t('nav.dashboard')}</span>
                  <span className="sm:hidden">App</span>
               </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login?flow=login" className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white/20 transition-all">
                  {t('nav.login')}
                </Link>
                <Link to="/login?flow=signup" className="bg-yellow text-navy px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-yellow/20">
                  {t('nav.signup')}
                </Link>
              </div>
            )}

            <button className="lg:hidden p-1" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="relative h-auto lg:h-[90vh] min-h-0 lg:min-h-[800px] py-16 lg:py-0 flex items-center justify-center pt-28 lg:pt-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/hero_image.png" 
            alt="Construction" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]"></div>
        </div>

        {/* Booking Card */}
        <div className="relative z-10 w-full max-w-xl px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden p-5 sm:p-8 md:p-10 border border-white/20"
          >
            {/* Tabs */}
            <div className="flex items-center justify-between mb-6 sm:mb-10 border-b border-slate-100 pb-px gap-1 sm:gap-2">
              <TabButton 
                active={activeTab === 'order'} 
                onClick={() => setActiveTab('order')} 
                icon={HardHat} 
                label={t('nav.materials')} 
              />
              <TabButton 
                active={activeTab === 'hire'} 
                onClick={() => setActiveTab('hire')} 
                icon={Truck} 
                label={t('nav.logistics')} 
              />
              <TabButton 
                active={activeTab === 'partner'} 
                onClick={() => setActiveTab('partner')} 
                icon={Handshake} 
                label={t('hero.become_partner')} 
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2 leading-none tracking-tight">{t('hero.book_load')}</h2>
                <p className="text-slate-500 font-medium text-sm">{t('booking.efficiency_desc')}</p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="space-y-1 relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4">{t('booking.departure')}</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-slate-300"></div>
                    <input 
                      type="text" 
                      placeholder={t('booking.departure_placeholder')} 
                      value={bookingFormData.departure}
                      onChange={(e) => handleLocationChange('departure', e.target.value)}
                      onFocus={() => setShowLocationList('departure')}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-12 font-medium focus:border-yellow focus:bg-white transition-all outline-none"
                    />
                    <button 
                      onClick={() => setIsMapPickerOpen('departure')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-yellow transition-colors"
                      title="Choose on map"
                    >
                      <MapIcon size={18} />
                    </button>
                    {showLocationList === 'departure' && (predictions.length > 0 || searching) && (
                      <div className="absolute top-full left-0 right-0 z-50 bg-white border border-slate-100 shadow-2xl rounded-2xl mt-2 p-2 max-h-60 overflow-y-auto">
                        {searching && (
                          <div className="p-4 text-center text-xs font-bold text-slate-400 animate-pulse uppercase tracking-widest">
                            {t('booking.searching_map')}
                          </div>
                        )}
                        {predictions.map(prediction => (
                          <div 
                            key={prediction.place_id} 
                            onClick={() => { 
                              setBookingFormData({...bookingFormData, departure: prediction.description}); 
                              setShowLocationList(null); 
                              setPredictions([]);
                            }}
                            className="p-4 hover:bg-slate-50 rounded-xl cursor-pointer text-sm font-bold text-navy transition-colors flex items-center gap-3"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                               <MapPin size={14} className="text-slate-400" />
                            </div>
                            <div className="flex flex-col">
                               <span className="leading-tight">{prediction.structured_formatting.main_text}</span>
                               <span className="text-[10px] text-slate-400 font-medium truncate max-w-[250px]">{prediction.structured_formatting.secondary_text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1 relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4">{t('booking.destination')}</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300">
                      <Truck size={16} />
                    </div>
                    <input 
                      type="text" 
                      placeholder={t('booking.destination_placeholder')} 
                      value={bookingFormData.destination}
                      onChange={(e) => handleLocationChange('destination', e.target.value)}
                      onFocus={() => setShowLocationList('destination')}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-12 font-medium focus:border-yellow focus:bg-white transition-all outline-none"
                    />
                    <button 
                      onClick={() => setIsMapPickerOpen('destination')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-yellow transition-colors"
                      title="Choose on map"
                    >
                      <MapIcon size={18} />
                    </button>
                    {showLocationList === 'destination' && (predictions.length > 0 || searching) && (
                      <div className="absolute top-full left-0 right-0 z-50 bg-white border border-slate-100 shadow-2xl rounded-2xl mt-2 p-2 max-h-60 overflow-y-auto">
                        {searching && (
                          <div className="p-4 text-center text-xs font-bold text-slate-400 animate-pulse uppercase tracking-widest">
                            {t('booking.searching_map')}
                          </div>
                        )}
                        {predictions.map(prediction => (
                          <div 
                            key={prediction.place_id} 
                            onClick={() => { 
                              setBookingFormData({...bookingFormData, destination: prediction.description}); 
                              setShowLocationList(null); 
                              setPredictions([]);
                            }}
                            className="p-4 hover:bg-slate-50 rounded-xl cursor-pointer text-sm font-bold text-navy transition-colors flex items-center gap-3"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                               <MapPin size={14} className="text-slate-400" />
                            </div>
                            <div className="flex flex-col">
                               <span className="leading-tight">{prediction.structured_formatting.main_text}</span>
                               <span className="text-[10px] text-slate-400 font-medium truncate max-w-[250px]">{prediction.structured_formatting.secondary_text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsAPKOpen(true)}
                  className="w-full bg-navy text-white font-bold py-5 rounded-2xl mt-6 shadow-xl shadow-navy/20 hover:bg-slate-800 transition-colors uppercase tracking-widest text-sm"
                >
                  {t('hero.book_load')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero Branding Section (The phone mockup + big text) */}
      <section className="py-32 px-6 bg-[#111827] text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            {/* Phone Mockup */}
            <div className="relative z-10 max-w-[340px] mx-auto lg:mx-0">
              <div className="bg-[#1F2937] rounded-[3.5rem] p-4 shadow-[0_0_100px_rgba(250,204,21,0.1)] border-8 border-[#374151] relative">
                <div className="bg-white rounded-[2.5rem] h-[650px] overflow-hidden relative text-navy">
                  <div className="p-8 pt-16">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-xl">👋</span>
                       <span className="font-bold">{t('hero.welcome_greet')}</span>
                    </div>
                    <h4 className="text-2xl font-black mb-10 leading-tight">{t('hero.welcome_title')}</h4>
                                      <div className="space-y-4">
                      <div 
                        onClick={() => setIsAPKOpen(true)}
                        className="flex items-center justify-between p-5 bg-[#F9FAFB] rounded-2xl border border-slate-100 group cursor-pointer hover:border-yellow transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <HardHat size={20} className="text-slate-400 group-hover:text-yellow transition-colors" />
                          <span className="font-bold">{t('nav.materials')}</span>
                        </div>
                        <ArrowRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-all" />
                      </div>
                      <div 
                        onClick={() => setIsAPKOpen(true)}
                        className="flex items-center justify-between p-5 bg-[#F9FAFB] rounded-2xl border border-slate-100 group cursor-pointer hover:border-yellow transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <Truck size={20} className="text-slate-400 group-hover:text-yellow transition-colors" />
                          <span className="font-bold">{t('nav.logistics')}</span>
                        </div>
                        <ArrowRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-all" />
                      </div>
                      <div 
                        onClick={() => setIsAPKOpen(true)}
                        className="flex items-center justify-between p-5 bg-[#F9FAFB] rounded-2xl border border-slate-100 group cursor-pointer hover:border-yellow transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <Plus size={20} className="text-slate-400 group-hover:text-yellow transition-colors" />
                          <span className="font-bold">{t('nav.register_shop')}</span>
                        </div>
                        <ArrowRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Geometric Decoration */}
              <div className="absolute -bottom-10 -right-20 hidden xl:block">
                 <div className="flex gap-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-12 h-24 bg-yellow skew-x-[-20deg] opacity-20" style={{ transform: `scaleY(${1 + i*0.2})` }}></div>
                    ))}
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="inline-block p-2 bg-white/5 rounded-full backdrop-blur-sm px-6 font-bold text-yellow border border-yellow/20">
               {t('hero.the_app')}
            </div>
            <h2 className="text-6xl md:text-7xl font-black leading-[0.85] tracking-tighter">
              {t('hero.title')}
            </h2>
            <p className="text-xl text-slate-400 font-medium max-w-md leading-relaxed border-l-4 border-yellow pl-8 py-2">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Service Detail (Ride/Materials Hailing) */}
      <section className="py-32 px-6" id="materials">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-1 bg-yellow rounded-full"></div>
                <span className="text-xs font-black uppercase tracking-widest text-[#0F172A]/40">{t('service.materials_delivery')}</span>
              </div>
              <h2 className="text-5xl font-black leading-tight mb-8 tracking-tight">
                {t('service.peace_of_mind')}
              </h2>
              
              <div className="space-y-10">
                <FeatureItem 
                  title={t('service.quick_easy_title')} 
                  desc={t('service.quick_easy_desc')}
                  icon={Clock}
                />
                <FeatureItem 
                  title={t('service.secure_title')} 
                  desc={t('service.secure_desc')}
                  icon={ShieldCheck}
                />
                <FeatureItem 
                  title={t('service.right_price_title')} 
                  desc={t('service.right_price_desc')}
                  icon={TrendingUp}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <StoreButton type="google" theme="dark" onClick={handleInstallClick} />
              <StoreButton type="apple" theme="dark" onClick={handleInstallClick} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 relative">
             <div className="absolute -inset-10 bg-slate-50 -z-10 rounded-full blur-3xl opacity-50"></div>
            <div className="space-y-6">
              <PhotoCard src="/img/materials_showcase.png" aspect="aspect-[3/4]" />
              <div className="bg-yellow rounded-[2.5rem] p-8 text-navy flex flex-col justify-between aspect-square">
                 <Plus size={40} className="opacity-40" />
                 <span className="text-5xl sm:text-7xl font-black leading-none tracking-tighter uppercase italic">{t('service.site_ready')}</span>
              </div>
            </div>
            <div className="pt-20 space-y-6">
              <PhotoCard src="/img/product_steel.png" aspect="aspect-[3/4]" />
              <PhotoCard src="/img/product_cement.png" aspect="aspect-square" />
            </div>
          </div>
        </div>
      </section>

      {/* Driver recruitment (Service Provider) */}
      <section className="py-24 px-6 bg-slate-50" id="logistics">
         <div className="max-w-7xl mx-auto rounded-[4rem] bg-white overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            <div className="lg:w-1/2 h-[500px] lg:h-auto border-r border-slate-50">
               <img src="/img/logistics_fleet.png" className="w-full h-full object-cover" alt="Join us" />
            </div>
            <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
               <div className="flex items-center gap-3 mb-6" id="about">
                 <div className="w-10 h-1 bg-yellow rounded-full"></div>
                 <span className="text-xs font-black uppercase tracking-widest text-[#0F172A]/40">{t('partner.become_partner_sub')}</span>
               </div>
               <h2 className="text-5xl font-black mb-8 leading-tight tracking-tight">{t('partner.earn_money')}</h2>
               <div className="space-y-8 mb-12">
                  <div>
                    <h4 className="font-bold mb-2">{t('partner.own_boss')}</h4>
                    <p className="text-slate-500">{t('partner.own_boss_desc')}</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">{t('partner.easy_use')}</h4>
                    <p className="text-slate-500">{t('partner.easy_use_desc')}</p>
                  </div>
               </div>
               <button 
                  id="consultancy"
                  onClick={() => window.location.href = '/shop-registration'}
                  className="bg-navy text-white px-10 py-5 rounded-2xl font-bold w-fit hover:bg-slate-800 transition-colors uppercase tracking-widest text-sm"
                >
                  {t('nav.signup')}
                </button>
            </div>
         </div>
      </section>

      {/* Growth Stats */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-black mb-24 text-center">
            {t('stats.title_part1')}<span className="text-yellow">{t('stats.title_part2')}</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard value="2M+" label={t('stats.tons')} />
            <StatCard value="50k+" label={t('stats.partners')} />
            <StatCard value="12k+" label={t('stats.employees')} />
            <StatCard value="15+" label={t('stats.cities')} />
          </div>
        </div>
      </section>

      {/* Bottom Grid recruitment Categories */}
      <section className="py-32 px-6 bg-[#111827] text-white" id="partner">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-12 order-2 lg:order-1">
              <PartnerSection 
                title={t('partner.talents')} 
                desc={t('partner.talents_desc')}
                btnText={t('partner.see_openings')}
                onClick={() => window.location.href = '/careers'}
              />
              <PartnerSection 
                title={t('partner.partners')} 
                desc={t('partner.partners_desc')}
                btnText={t('nav.work_with_us')}
                onClick={() => window.location.href = '/work-with-us'}
              />
              <PartnerSection 
                title={t('partner.businesses')} 
                desc={t('partner.businesses_desc')}
                btnText={t('partner.get_listed')}
                onClick={() => window.location.href = '/shop-registration'}
              />
           </div>
           
           <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="w-full max-w-[400px]">
                 <div className="bg-[#1F2937] rounded-[4rem] p-4 shadow-[0_0_100px_rgba(250,204,21,0.05)] border-8 border-slate-700 h-[750px] relative overflow-hidden">
                    <div className="bg-[#111827] rounded-[3rem] h-full flex flex-col items-center justify-center p-12 text-center">
                       <div className="w-20 h-20 bg-yellow rounded-3xl flex items-center justify-center mb-8 rotate-12">
                          <Smartphone size={40} className="text-navy" />
                       </div>
                       <h3 className="text-2xl font-black mb-4">{t('partner.future_building')}</h3>
                       <p className="text-slate-400 font-medium">{t('partner.future_desc')}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-yellow rounded-xl flex items-center justify-center">
                  <span className="text-navy font-black text-2xl italic">J</span>
                </div>
                <Link to="/" className="text-4xl font-black italic tracking-tighter">Jeebha</Link>
              </div>
              <p className="text-slate-400 font-medium max-w-sm mb-10 leading-relaxed">
                {t('footer.tagline')}
              </p>
              <div className="flex gap-4">
                <StoreButton type="google" onClick={handleInstallClick} />
                <StoreButton type="apple" onClick={handleInstallClick} />
              </div>
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-[0.2em] mb-8 text-yellow">{t('nav.services')}</h4>
              <ul className="space-y-5 text-slate-300 font-bold text-sm">
                <li onClick={() => window.location.href='/materials-marketplace'} className="hover:text-yellow transition-colors cursor-pointer flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-yellow"></div>
                   {t('nav.materials')}
                </li>
                <li onClick={() => window.location.href='/hire-machinery'} className="hover:text-yellow transition-colors cursor-pointer flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                   {t('nav.machinery')}
                </li>
                <li onClick={() => window.location.href='/site-logistics'} className="hover:text-yellow transition-colors cursor-pointer flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                   {t('nav.logistics')}
                </li>
                <li onClick={() => window.location.href='/consultancy'} className="hover:text-yellow transition-colors cursor-pointer flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                   {t('nav.consultancy')}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-[0.2em] mb-8 text-yellow">{t('nav.company')}</h4>
              <ul className="space-y-5 text-slate-300 font-bold text-sm">
                <li onClick={() => window.location.href='/our-story'} className="hover:text-yellow transition-colors cursor-pointer">{t('nav.story')}</li>
                <li onClick={() => window.location.href='/careers'} className="hover:text-yellow transition-colors cursor-pointer">{t('nav.careers')}</li>
                <li onClick={() => window.location.href='/newsroom'} className="hover:text-yellow transition-colors cursor-pointer">{t('nav.newsroom')}</li>
                <li onClick={() => window.location.href='/work-with-us'} className="hover:text-yellow transition-colors cursor-pointer">{t('nav.work_with_us')}</li>
                <li onClick={() => window.location.href='/shop-registration'} className="hover:text-yellow transition-colors cursor-pointer">{t('nav.register_shop')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-[0.2em] mb-8 text-yellow">{t('nav.support')}</h4>
              <ul className="space-y-5 text-slate-300 font-bold text-sm">
                <li onClick={() => window.location.href='/help-center'} className="hover:text-yellow transition-colors cursor-pointer">{t('nav.help_center')}</li>
                <li onClick={() => window.location.href='/safety'} className="hover:text-yellow transition-colors cursor-pointer">{t('nav.safety')}</li>
                <li onClick={() => window.location.href='/contact'} className="hover:text-yellow transition-colors cursor-pointer">{t('nav.contact')}</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-8">
               <span>&copy; 2024 Jeebha Tech.</span>
               <span className="hover:text-white transition-colors cursor-pointer">{t('footer.privacy')}</span>
               <span className="hover:text-white transition-colors cursor-pointer">{t('footer.terms')}</span>
            </div>
            <div className="flex gap-10">
               <span className="hover:text-white transition-colors cursor-pointer underline underline-offset-4 decoration-yellow">Linkedin</span>
               <span className="hover:text-white transition-colors cursor-pointer">Twitter</span>
               <span className="hover:text-white transition-colors cursor-pointer">Instagram</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-navy z-[200] p-8 text-white lg:hidden"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-3xl font-black italic">Jeebha</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 border border-white/20 rounded-full">
                <X size={28} />
              </button>
            </div>
            <div className="space-y-8">
              {navigation.map(item => (
                <div key={item.name} className="flex justify-between items-center py-2 border-b border-white/10 group">
                  <span className="text-4xl font-black group-hover:text-yellow transition-colors">{getNavName(item.name)}</span>
                  {item.items.length > 0 && <Plus size={28} className="text-yellow" />}
                </div>
              ))}
            </div>
            <div className="absolute bottom-8 left-8 right-8 space-y-6">
               <div className="flex justify-center bg-white/5 py-3 rounded-2xl border border-white/10">
                 <LanguagePicker dark={true} />
               </div>
               <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-yellow text-navy font-black py-6 rounded-3xl block text-center text-xl shadow-2xl shadow-yellow/30"
               >
                 {t('nav.login')}
               </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Picker Modal */}
      <AnimatePresence>
        {isMapPickerOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 pointer-events-none">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsMapPickerOpen(null)}
               className="absolute inset-0 bg-navy/60 backdrop-blur-md pointer-events-auto"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl h-full max-h-[800px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            >
              <div className="p-8 flex items-center justify-between border-b border-slate-100 shrink-0">
                <div>
                  <h3 className="text-2xl font-black text-navy uppercase tracking-tight">
                    {isMapPickerOpen === 'departure' ? t('booking.select_departure') : t('booking.select_destination')}
                  </h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{t('map.instructions')}</p>
                </div>
                <button 
                  onClick={() => setIsMapPickerOpen(null)}
                  className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 relative">
                <MapPicker 
                  onSelect={(loc) => {
                    setBookingFormData(prev => ({ ...prev, [isMapPickerOpen]: loc }));
                    setIsMapPickerOpen(null);
                  }}
                />
              </div>

              <div className="p-8 bg-slate-50/50 flex justify-end shrink-0">
                 <button 
                   onClick={() => setIsMapPickerOpen(null)}
                   className="bg-navy text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
                 >
                   {t('map.confirm')}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <APKDownloader isOpen={isAPKOpen} onClose={() => setIsAPKOpen(false)} />
    </div>
  );
}

function MapPicker({ onSelect }: { onSelect: (loc: string) => void }) {
  const { t } = useTranslation();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const MapEvents = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        setLoading(true);
        try {
          const res = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data.features && data.features.length > 0) {
            const props = data.features[0].properties;
            const name = props.name || props.street || props.city || 'Location';
            const secondary = [props.city, props.state, props.country].filter(Boolean).join(', ');
            setAddress(`${name}${secondary ? ', ' + secondary : ''}`);
          } else {
            setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } finally {
          setLoading(false);
        }
      },
    });
    return null;
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={[36.7538, 3.0588]} // Algiers default
        zoom={13} 
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapEvents />
        {position && <Marker position={position} />}
      </MapContainer>

      {address && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-8 left-8 right-8 z-[1000] bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white flex items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 min-w-0">
             <div className="w-12 h-12 bg-yellow rounded-2xl flex items-center justify-center shrink-0">
                <MapPin size={24} className="text-navy" />
             </div>
             <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t('map.selected_location')}</p>
                <p className="font-bold text-navy truncate leading-tight">{address}</p>
             </div>
          </div>
          <button 
            onClick={() => onSelect(address)}
            className="whitespace-nowrap bg-yellow text-navy px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-yellow/20 hover:scale-105 active:scale-95 transition-all"
          >
            {loading ? t('map.fetching') : t('map.use_location')}
          </button>
        </motion.div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 sm:gap-2 pb-3 sm:pb-6 border-b-4 sm:border-b-[6px] transition-all flex-1 text-center min-w-0 overflow-hidden",
        active ? "border-yellow text-navy font-black" : "border-transparent text-slate-300 font-bold hover:text-slate-500"
      )}
    >
      <div className={cn(
        "p-1.5 sm:p-2 rounded-xl transition-all",
        active && "bg-yellow/10"
      )}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.15em] truncate w-full px-1">{label}</span>
    </button>
  );
}

function FeatureItem({ title, desc, icon: Icon }: any) {
  return (
    <div className="group">
      <h4 className="text-lg font-black mb-2 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-yellow"></div>
        {title}
      </h4>
      <p className="text-slate-500 leading-relaxed max-w-sm pl-5">{desc}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: string, label: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const targetValue = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const steps = 60;
      const increment = targetValue / steps;
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayValue(targetValue);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(increment * currentStep));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, targetValue]);

  return (
    <div ref={ref} className="bg-slate-50 p-6 sm:p-10 lg:p-16 rounded-[2rem] sm:rounded-[3rem] text-center border border-slate-100/50 hover:bg-yellow hover:border-yellow transition-all duration-500 group cursor-default">
      <div className="text-4xl sm:text-5xl lg:text-7xl font-black mb-2 sm:mb-4 tracking-tighter group-hover:scale-110 transition-transform tabular-nums leading-none">
        {displayValue.toLocaleString()}{suffix}
      </div>
      <div className="font-bold text-slate-400 group-hover:text-navy uppercase text-[9px] sm:text-[10px] tracking-[0.2em]">
        {label}
      </div>
    </div>
  );
}

function PhotoCard({ src, aspect }: any) {
  return (
    <div className={cn("rounded-[3rem] overflow-hidden shadow-2xl relative group", aspect)}>
       <img src={src} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Construction" />
       <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
}

function PartnerSection({ title, desc, btnText, onClick }: any) {
  return (
    <div className="border-b border-white/10 pb-12 last:border-0 group">
       <h3 className="text-4xl font-black mb-6 group-hover:text-yellow transition-colors">{title}</h3>
       <p className="text-slate-400 font-medium mb-8 max-w-md leading-relaxed">{desc}</p>
       <button 
        onClick={onClick}
        className="bg-yellow text-navy px-8 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase hover:scale-105 transition-all shadow-xl shadow-yellow/10"
       >
          {btnText}
       </button>
    </div>
  );
}

function StoreButton({ type, theme = "light", onClick }: { type: 'google' | 'apple', theme?: 'light' | 'dark', onClick?: () => void }) {
  const { t } = useTranslation();
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-2.5 rounded-2xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95 border",
        theme === "light" 
          ? "bg-white text-navy border-slate-200 shadow-md" 
          : "bg-navy text-white border-white/10 shadow-2xl shadow-navy/40"
      )}
    >
      {type === 'google' ? <Smartphone size={20} /> : <Smartphone size={20} />}
      <div className="text-left">
        <div className="text-[9px] opacity-60 font-black uppercase tracking-[0.1em] leading-none">{t('store.download')}</div>
        <div className="text-sm font-black leading-none mt-1.5 tracking-tight">
          {type === 'google' ? t('store.android_apk') : t('store.ios_build')}
        </div>
      </div>
    </button>
  );
}

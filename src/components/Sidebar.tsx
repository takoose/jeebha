import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  Map as MapIcon, 
  MessageSquare, 
  Settings, 
  LogOut,
  Briefcase,
  Truck 
} from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { useTranslation } from '../context/LanguageContext';

export default function Sidebar() {
  const { t } = useTranslation();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    async function fetchRole() {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (err) {
          console.error("Sidebar Auth Error:", err);
        }
      }
    }
    fetchRole();
  }, []);

  const getNavItems = () => {
    const role = userData?.role;
    
    const allItems = [
      { id: 'dashboard', icon: role === 'driver' ? Truck : (role === 'customer' || role === 'builder' ? Store : LayoutDashboard), label: role === 'customer' || role === 'builder' ? t('nav.materials') : (role === 'driver' ? 'Load Board' : t('nav.dashboard')), path: '/dashboard' },
      { id: 'jobs', icon: Briefcase, label: t('nav.delivery_history'), path: '/jobs' },
      { id: 'orders', icon: ShoppingCart, label: t('nav.my_orders'), path: '/orders' },
      { id: 'shops', icon: Store, label: t('nav.shops'), path: '/shops' },
      { id: 'users', icon: Users, label: t('nav.users'), path: '/users' },
      { id: 'products', icon: Package, label: t('nav.products'), path: '/products' },
      { id: 'map', icon: MapIcon, label: t('nav.live_tracking'), path: '/map' },
      { id: 'messages', icon: MessageSquare, label: t('nav.messages'), path: '/messages' },
    ];

    if (role === 'admin') return allItems;
    
    if (role === 'customer' || role === 'builder') {
      return allItems.filter(item => ['dashboard', 'orders', 'messages', 'shops', 'products', 'map'].includes(item.id));
    }
    
    if (role === 'driver') {
      return allItems.filter(item => ['dashboard', 'messages', 'map'].includes(item.id));
    }

    return allItems.filter(item => ['dashboard', 'messages'].includes(item.id));
  };

  const navItems = getNavItems();

  const systemItems = [
    { icon: Settings, label: t('nav.settings'), path: '/settings' },
  ];

  return (
    <div className="w-64 bg-navy h-screen fixed left-0 top-0 text-white flex flex-col z-50">
      <div className="p-10 flex items-center gap-4">
        <img src="/img/jeebha.svg" alt="Jeebha" className="w-14 h-14 drop-shadow-2xl" />
        <h1 className="text-3xl font-black text-white tracking-tighter italic">
          JEEBHA 
        </h1>
      </div>

      <nav className="flex-1 px-4 mt-2 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                cn("sidebar-link", isActive && "sidebar-link-active")
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-8">
          <p className="px-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">{t('nav.system')}</p>
          <div className="space-y-1">
            {systemItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  cn("sidebar-link", isActive && "sidebar-link-active")
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
            <button 
              onClick={() => auth.signOut()}
              className="sidebar-link w-full text-left flex items-center gap-3"
            >
              <LogOut size={18} />
              <span>{t('nav.sign_out')}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="p-4 bg-navy-light/50 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-[10px] font-bold">
            {auth.currentUser?.displayName?.[0] || auth.currentUser?.email?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-bold text-white truncate">
              {auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0]}
            </p>
            <p className="text-[10px] text-slate-400 truncate uppercase font-black tracking-widest">
              {userData?.role?.replace('_', ' ') || 'User'} {t('nav.profile')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

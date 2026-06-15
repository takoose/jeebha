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

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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
      { id: 'dashboard', icon: role === 'driver' ? Truck : (role === 'customer' || role === 'builder' ? Store : LayoutDashboard), label: role === 'customer' || role === 'builder' ? t('nav.materials') : (role === 'driver' ? t('nav.load_board') : t('nav.dashboard')), path: '/dashboard' },
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
    <>
      {/* Mobile Sidebar Overlay Backdrop */}
      {isOpen && (
        <button 
          onClick={onClose}
          className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-45 lg:hidden w-full h-full cursor-default border-none text-left"
          aria-label="Close Sidebar"
        />
      )}

      <div className={cn(
        "w-64 bg-navy h-screen fixed left-0 top-0 text-white flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-10 flex items-center gap-4 relative">
          <img src="/img/jeebha.svg" alt="Jeebha" className="w-14 h-14 drop-shadow-2xl" />
          <h1 className="text-3xl font-black text-white tracking-tighter italic">
            JEEBHA 
          </h1>
          {/* Close button inside sidebar on mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden absolute right-4 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 mt-2 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
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
                  onClick={onClose}
                  className={({ isActive }) => 
                    cn("sidebar-link", isActive && "sidebar-link-active")
                  }
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <button 
                onClick={() => {
                  onClose?.();
                  auth.signOut();
                }}
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
                {t(`role.${userData?.role}`) || userData?.role?.replace('_', ' ') || t('role.user')} {t('nav.profile')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

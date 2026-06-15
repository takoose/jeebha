import { ReactNode, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Plus,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  Menu
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { subscribeToNotifications, Notification } from '../services/notificationService';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import LanguagePicker from '../components/LanguagePicker';
import { useTranslation } from '../context/LanguageContext';

interface LayoutProps {
  children: ReactNode;
  user: any;
}

export default function Layout({ children, user }: LayoutProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (auth.currentUser) {
      const unsub = subscribeToNotifications(auth.currentUser.uid, (notifs) => {
        setNotifications(notifs);
      });
      return unsub;
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    if (!auth.currentUser) return;
    const promises = notifications
      .filter(n => !n.read)
      .map(n => updateDoc(doc(db, 'notifications', n.id!), { read: true }));
    await Promise.all(promises);
  };

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 sticky top-0 z-40">
          <div className="flex items-center flex-1 max-w-full md:max-w-xl mr-4 gap-2">
            {/* Hamburger button on mobile */}
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-2 text-slate-500 hover:text-navy hover:bg-slate-50 rounded-xl border border-slate-100 bg-white shadow-sm shrink-0"
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-full md:w-96 border border-slate-200">
              <Search size={18} className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder={t('nav.search_placeholder')} 
                className="bg-transparent text-sm w-full outline-none text-slate-600 border-none focus:ring-0"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <LanguagePicker />
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications && unreadCount > 0) markAllAsRead();
                }}
                className="relative p-2 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <Bell size={20} className={cn("text-slate-400 group-hover:text-navy transition-colors", showNotifications && "text-navy")} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-50 overflow-hidden"
                  >
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <div>
                        <h3 className="text-sm font-black text-navy uppercase tracking-widest">{t('nav.notifications')}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{t('nav.live_updates')}</p>
                      </div>
                      <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
                        <X size={16} />
                      </button>
                    </div>

                    <div className="max-h-[350px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-12 text-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <Bell size={24} className="text-slate-300" />
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('nav.no_notifications')}</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-50">
                          {notifications.map((n) => (
                            <div 
                              key={n.id} 
                              className={cn(
                                "p-5 hover:bg-slate-50 transition-colors cursor-pointer group flex gap-4 text-left",
                                !n.read && "bg-blue-50/30"
                              )}
                              onClick={() => n.link && navigate(n.link)}
                            >
                              <div className={cn(
                                "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center",
                                n.type === 'success' ? "bg-green-100 text-green-600" :
                                n.type === 'warning' ? "bg-yellow/20 text-yellow" :
                                n.type === 'error' ? "bg-red-100 text-red-600" :
                                "bg-blue-100 text-blue-600"
                              )}>
                                {n.type === 'success' ? <CheckCircle2 size={18} /> :
                                 n.type === 'warning' ? <AlertCircle size={18} /> :
                                 n.type === 'error' ? <AlertCircle size={18} /> :
                                 <Info size={18} />}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-black text-navy uppercase tracking-tight mb-0.5">{n.title}</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{n.message}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Clock size={10} className="text-slate-300" />
                                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                                    {n.createdAt?.toDate?.() ? n.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t('template.just_now')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-slate-50/80 border-t border-slate-100 text-center">
                       <button className="text-[10px] font-black text-navy uppercase tracking-widest hover:text-yellow transition-colors">
                          {t('nav.view_all_activity')}
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button 
              onClick={() => navigate('/products')}
              className="bg-navy text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">{t('nav.new_order')}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

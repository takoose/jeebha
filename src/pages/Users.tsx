import { useState, useEffect } from 'react';
import { Search, UserPlus, Filter, MoreVertical, Loader2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

export default function Users() {
  const [activeTab, setActiveTab] = useState<'all' | 'customers' | 'drivers' | 'admins' | 'builders'>('all');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'users');
      setLoading(false);
    });
    return unsub;
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesTab = activeTab === 'all' 
      ? true 
      : activeTab === 'builders' ? (u.role === 'builder' || u.role === 'customer') : u.role === (activeTab || '').slice(0, -1) || u.role === activeTab;
    
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy tracking-tight">User Management</h1>
        <button className="btn-secondary flex items-center gap-2">
          <UserPlus size={20} />
          <span>Add New User</span>
        </button>
      </div>

      <div className="dashboard-card p-4">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto">
            {['all', 'builders', 'drivers', 'admins'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap",
                  activeTab === tab ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-navy"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent transition-all w-64"
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50">
              <Filter size={18} className="text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-card overflow-hidden">
        {loading ? (
           <div className="p-20 flex justify-center">
              <Loader2 className="animate-spin text-yellow" size={32} />
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Joined</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                           <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt={user.name} />
                        </div>
                        <div>
                          <p className="font-bold text-navy leading-none mb-1">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          "bg-green-500 animate-pulse"
                        )}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-500">
                        {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'New'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-navy">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-slate-300 font-bold uppercase tracking-widest text-[10px]">No real users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

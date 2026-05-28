import React, { useState, useEffect } from 'react';
import { Store, Plus, Star, MapPin, Loader2, X } from 'lucide-react';
import { collection, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

export default function Shops() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [showRegForm, setShowRegForm] = useState(false);
  const [newShop, setNewShop] = useState({ name: '', type: 'Heavy Materials', location: '' });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRole() {
      if (!auth.currentUser) return;
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) setRole(userDoc.data().role);
    }
    fetchRole();

    const unsub = onSnapshot(collection(db, 'shops'), (snap) => {
      setShops(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'shops');
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    if (role !== 'shop_manager' && role !== 'admin') {
      alert("Only shop managers can register new shops.");
      return;
    }
    
    try {
      await addDoc(collection(db, 'shops'), {
        ...newShop,
        ownerId: auth.currentUser.uid,
        owner: auth.currentUser.email?.split('@')[0],
        rating: 5.0,
        createdAt: serverTimestamp(),
        pos: { lat: 35.918 + (Math.random() - 0.5) * 0.01, lng: 5.295 + (Math.random() - 0.5) * 0.01 }
      });
      setShowRegForm(false);
      setNewShop({ name: '', type: 'Heavy Materials', location: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'shops');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy tracking-tight">Shops & Suppliers</h1>
        <button 
          onClick={() => setShowRegForm(true)}
          className="btn-secondary flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Register New Shop</span>
        </button>
      </div>

      {showRegForm && (
        <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 bg-navy text-white flex justify-between items-center">
              <h3 className="font-black uppercase tracking-widest text-sm">Register Shop</h3>
              <button onClick={() => setShowRegForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Shop Name</label>
                <input 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-navy"
                  value={newShop.name}
                  onChange={e => setNewShop({...newShop, name: e.target.value})}
                  placeholder="e.g. Master Builders"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Specialization</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-navy"
                  value={newShop.type}
                  onChange={e => setNewShop({...newShop, type: e.target.value})}
                >
                  <option>Heavy Materials</option>
                  <option>Finishing</option>
                  <option>Tools & Hardware</option>
                  <option>Plumbing</option>
                  <option>Electrical</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Location Address</label>
                <input 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-navy"
                  value={newShop.location}
                  onChange={e => setNewShop({...newShop, location: e.target.value})}
                  placeholder="e.g. 123 Construction Rd"
                />
              </div>
              <button type="submit" className="w-full bg-yellow text-navy font-black py-3 rounded-xl uppercase text-xs tracking-widest shadow-lg shadow-yellow/20">
                Create Shop
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-20 flex justify-center">
           <Loader2 className="animate-spin text-yellow" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div key={shop.id} className="dashboard-card group">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={shop.image || `https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80&seed=${shop.id}`} 
                  alt={shop.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold text-yellow-dark shadow-sm">
                  <Star size={14} fill="currentColor" />
                  {shop.rating || 'New'}
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-navy/80 backdrop-blur-sm text-yellow text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                    {shop.type || 'Supplier'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-navy mb-1">{shop.name}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mb-4">
                  <MapPin size={14} />
                  {shop.location || 'Location Pending'}
                </p>
                
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-navy">
                      {(shop.owner || shop.name || "??").toString().slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Contact</p>
                      <p className="text-xs font-bold text-navy truncate max-w-[100px]">{shop.owner || "Manager"}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/products?shopId=${shop.id}`)}
                    className="text-xs font-bold text-navy hover:underline"
                  >
                    View Inventory
                  </button>
                </div>
              </div>
            </div>
          ))}
          {shops.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-300 font-bold uppercase tracking-widest text-[10px]">
              No active shops yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}

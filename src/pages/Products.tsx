import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Loader2, Clock, X } from 'lucide-react';
import { collection, onSnapshot, addDoc, serverTimestamp, doc, getDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import { useSearchParams } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const shopIdFilter = searchParams.get('shopId');
  const urlSearchQuery = searchParams.get('search');

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery || '');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Materials', price: '', stock: '', shopId: '' });
  const [myShops, setMyShops] = useState<any[]>([]);

  useEffect(() => {
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [urlSearchQuery]);

  useEffect(() => {
    async function fetchUserRole() {
      if (!auth.currentUser) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const uRole = userDoc.data().role;
          setRole(uRole);
          
          if (uRole === 'shop_manager' || uRole === 'admin') {
            const shopsSnap = await onSnapshot(
              query(collection(db, 'shops'), where('ownerId', '==', auth.currentUser.uid)),
              (snap) => setMyShops(snap.docs.map(d => ({ id: d.id, ...d.data() })))
            );
            return shopsSnap;
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchUserRole();

    let q = query(collection(db, 'products'));
    if (shopIdFilter) {
      q = query(collection(db, 'products'), where('shopId', '==', shopIdFilter));
    }

    const unsub = onSnapshot(q, (snap) => {
      let data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'products');
      setLoading(false);
    });
    return unsub;
  }, [shopIdFilter]);

  const filteredProducts = products.filter(p => {
    const matchesCat = activeCategory === 'all' || p.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        createdAt: serverTimestamp()
      });
      setShowAddForm(false);
      setNewProduct({ name: '', category: 'Materials', price: '', stock: '', shopId: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'products');
    }
  };

  const placeOrder = async (product: any) => {
    if (!auth.currentUser) {
      alert("Please log in to place an order.");
      return;
    }

    if (role !== 'builder' && role !== 'customer') {
      alert('Only registered builders or customers can place orders.');
      return;
    }

    try {
      const coordinates = await new Promise<{lat: number, lng: number}>((resolve) => {
        const timeout = setTimeout(() => resolve({ lat: 35.92, lng: 5.30 }), 5000);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              clearTimeout(timeout);
              resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            () => {
              clearTimeout(timeout);
              resolve({ lat: 35.92, lng: 5.30 });
            }
          );
        } else {
          clearTimeout(timeout);
          resolve({ lat: 35.92, lng: 5.30 });
        }
      });

      await addDoc(collection(db, 'orders'), {
        customerId: auth.currentUser.uid,
        shopId: product.shopId || 'unknown',
        shopName: 'Marketplace Vendor', 
        shopLocation: { lat: 35.918, lng: 5.295 },
        status: 'pending',
        totalAmount: product.price || 0,
        deliveryAddress: 'Direct Product Order',
        deliveryLocation: coordinates,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      alert(`Order for ${product.name} placed successfully!`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'orders');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy tracking-tight">Product Catalog</h1>
        {(role === 'shop_manager' || role === 'admin') && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Add New Product</span>
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-navy">
            <div className="p-6 bg-navy text-white flex justify-between items-center">
              <h3 className="font-black uppercase tracking-widest text-sm">Add Product</h3>
              <button onClick={() => setShowAddForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Product Name</label>
                <input 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-navy"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Price (KWD)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-navy"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Initial Stock</label>
                  <input 
                    required
                    type="number"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-navy"
                    value={newProduct.stock}
                    onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Assign to Shop</label>
                <select 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-navy"
                  value={newProduct.shopId}
                  onChange={e => setNewProduct({...newProduct, shopId: e.target.value})}
                >
                  <option value="">Select Shop</option>
                  {myShops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-yellow text-navy font-black py-3 rounded-xl uppercase text-xs tracking-widest">
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="dashboard-card p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {['all', 'materials', 'tools', 'finishing'].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all",
                activeCategory === cat ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-navy"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none w-full md:w-64" 
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50"><Filter size={18} className="text-slate-500" /></button>
        </div>
      </div>

      {loading ? (
        <div className="p-20 flex justify-center">
           <Loader2 className="animate-spin text-yellow" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="dashboard-card group hover:border-yellow transition-all">
              <div className="h-40 bg-slate-100 relative overflow-hidden">
                <img 
                  src={product.image || (product.category?.toLowerCase() === 'cement' ? '/src/img/product_cement.jpg' : product.category?.toLowerCase() === 'steel' ? '/src/img/product_steel.jpg' : '/src/img/materials_showcase.jpg')} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                />
                <div className="absolute top-2 right-2">
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase",
                    (product.stock || 0) < 20 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  )}>
                    {(product.stock || 0) < 20 ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">{product.category || 'General'}</p>
                <h3 className="font-bold text-navy truncate mb-1">{product.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{product.shopId || 'Verified Supplier'}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <p className="text-lg font-bold text-navy">KWD {(product.price || 0).toLocaleString()}</p>
                  <button 
                    onClick={() => placeOrder(product)}
                    className="p-2 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors shadow-sm active:scale-90"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-300 font-bold uppercase tracking-widest text-[10px]">
              No products found matching filters
            </div>
          )}
        </div>
      )}
    </div>
  );
}

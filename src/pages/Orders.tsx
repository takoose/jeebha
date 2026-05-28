import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Download, Printer, Loader2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [statusFilter, setStatusFilter] = useState('All Status');

  useEffect(() => {
    if (!auth.currentUser) return;
    
    async function setupQuery() {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid));
      const role = userDoc.data()?.role;
      
      let q;
      
      if (role === 'admin' || role === 'shop_manager') {
        q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      } else if (role === 'customer' || role === 'builder') {
        q = query(collection(db, 'orders'), where('customerId', '==', auth.currentUser!.uid), orderBy('createdAt', 'desc'));
      } else if (role === 'driver') {
        q = query(collection(db, 'orders'), where('driverId', '==', auth.currentUser!.uid), orderBy('createdAt', 'desc'));
      } else {
        q = query(collection(db, 'orders'), where('customerId', '==', auth.currentUser!.uid), orderBy('createdAt', 'desc'));
      }
      
      const unsub = onSnapshot(q, (snap) => {
        setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'orders');
        setLoading(false);
      });
      
      return unsub;
    }
    
    let unsubPromise = setupQuery();
    return () => {
      unsubPromise.then(u => u?.());
    };
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = (o.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (o.customerId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (o.shopId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (o.shopName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || o.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Order ID,Customer ID,Shop,Status,Amount\n" + 
      filteredOrders.map(o => `${o.id},${o.customerId},${o.shopName || o.shopId},${o.status},${o.totalAmount}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "construction_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy tracking-tight">Orders & Invoices</h1>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="btn-primary flex items-center gap-2 bg-slate-200 text-navy hover:bg-slate-300"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={handlePrint}
            className="btn-secondary flex items-center gap-2"
          >
            <Printer size={18} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Volume</p>
          <h3 className="text-2xl font-black text-navy italic">KWD {filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Active Logistics</p>
          <h3 className="text-2xl font-black text-blue-500 italic">{filteredOrders.filter(o => ['assigned', 'picked_up'].includes(o.status)).length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Completed</p>
          <h3 className="text-2xl font-black text-green-500 italic">{filteredOrders.filter(o => o.status === 'delivered').length}</h3>
        </div>
      </div>

      <div className="dashboard-card p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search orders, customers, shops..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none w-full" 
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none text-navy font-bold"
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>Assigned</option>
          <option>Picked Up</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
        <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500">
          <Filter size={18} />
        </button>
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
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none text-center">Tracking</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Shop</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Driver</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none text-right">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-[10px] text-slate-400">#{(order.id || '').slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 text-center">
                      {['assigned', 'picked_up'].includes(order.status) ? (
                        <button 
                          onClick={() => navigate('/map')}
                          className="bg-yellow/10 text-yellow text-[8px] font-black uppercase px-2 py-1 rounded border border-yellow/20 hover:bg-yellow hover:text-navy transition-all"
                        >
                          Live
                        </button>
                      ) : (
                        <span className="text-[8px] font-black uppercase text-slate-300">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium truncate max-w-[150px]">{order.shopName || order.shopId}</td>
                    <td className="px-6 py-4 text-sm text-slate-400 text-[10px] uppercase font-bold">{order.driverId ? (order.driverId.slice(0, 8)) : "Unassigned"}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                        order.status === 'delivered' ? "bg-green-100 text-green-700" : 
                        order.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                        order.status === 'cancelled' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-navy italic">KWD {order.totalAmount}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          alert(`Order Detail Request\nID: ${order.id}\nStatus: ${order.status}\nCustomer: ${order.customerId}`);
                        }}
                        className="p-2 text-slate-400 hover:text-navy hover:bg-white rounded-lg transition-all shadow-sm"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-300 font-bold uppercase tracking-widest text-[10px]">No real orders found</td>
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

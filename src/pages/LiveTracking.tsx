import { useState, useEffect } from 'react';
import { Truck, Store, MapPin, Navigation, Info, Package, Radio, ChevronRight, Play, Square, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { cn } from '../lib/utils';
import Routing from '../components/Routing';

function MapRecenter({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
}

// Helper to fix Leaflet's default icon issue in production/bundlers
import 'leaflet/dist/leaflet.css';

// Custom icons using Lucide icons converted to strings
const createCustomIcon = (color: string, iconHtml: string, backgroundColor: string = color) => L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div style="background-color: ${backgroundColor}; color: ${backgroundColor === 'white' ? color : 'white'}; padding: 8px; border-radius: 12px; border: 3px solid white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center;">${iconHtml}</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const truckIcon = createCustomIcon('#0F172A', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FACC15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5h-7v6h2"/><path d="M13 9h4"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>');

const shopIcon = createCustomIcon('#0F172A', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 10V7"/></svg>', 'white');

const builderIcon = createCustomIcon('#EF4444', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>');

export default function LiveTracking() {
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [shops, setShops] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [eta, setEta] = useState<string>('--');

  // Fetch user role
  useEffect(() => {
    if (!auth.currentUser) return;
    const unsub = onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
      if (doc.exists()) setUserRole(doc.data().role);
    });
    return unsub;
  }, []);

  // Calculate ETA
  useEffect(() => {
    if (selectedOrder && selectedOrder.currentLocation) {
      const target = selectedOrder.status === 'assigned' 
        ? selectedOrder.shopLocation 
        : selectedOrder.deliveryLocation;
      
      if (target) {
        const dx = target.lat - selectedOrder.currentLocation.lat;
        const dy = target.lng - selectedOrder.currentLocation.lng;
        const dist = Math.sqrt(dx*dx + dy*dy);
        // Assuming constant speed for ETA simulation
        const minutes = Math.ceil(dist * 5000); 
        setEta(`${minutes} min`);
      }
    } else {
      setEta('--');
    }
  }, [selectedOrder]);

  // Fetch shops from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'shops'), (snap) => {
      setShops(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  // Fetch active orders from Firestore
  useEffect(() => {
    if (!userRole || !auth.currentUser) return;

    let q;
    if (userRole === 'builder' || userRole === 'customer') {
      q = query(
        collection(db, 'orders'), 
        where('status', 'in', ['assigned', 'picked_up']),
        where('customerId', '==', auth.currentUser.uid)
      );
    } else if (userRole === 'driver') {
      q = query(
        collection(db, 'orders'), 
        where('status', 'in', ['assigned', 'picked_up']),
        where('driverId', '==', auth.currentUser.uid)
      );
    } else if (userRole === 'shop_manager') {
      // For shop manager, we'd need their shopId. Assuming they have it in their profile.
      // But for now, let's keep it restricted or all if not specified.
      q = query(
        collection(db, 'orders'), 
        where('status', 'in', ['assigned', 'picked_up'])
      );
    } else {
      q = query(
        collection(db, 'orders'), 
        where('status', 'in', ['assigned', 'picked_up'])
      );
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setActiveOrders(orders);
      
      if (selectedOrder) {
        const updated = orders.find(o => o.id === selectedOrder.id);
        if (updated) setSelectedOrder(updated);
        else setSelectedOrder(null);
      }
    }, (error) => {
      console.error("Tracking Query Error:", error);
    });

    return () => unsubscribe();
  }, [selectedOrder?.id, userRole]);

  // Simulation logic: Move driver towards current goal
  useEffect(() => {
    let interval: any;
    if (isSimulating && selectedOrder && auth.currentUser?.uid === selectedOrder.driverId) {
      interval = setInterval(async () => {
        const target = selectedOrder.status === 'assigned' 
          ? selectedOrder.shopLocation 
          : selectedOrder.deliveryLocation;
        
        if (!target) return;

        const current = selectedOrder.currentLocation;
        const dx = target.lat - current.lat;
        const dy = target.lng - current.lng;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 0.001) {
          setIsSimulating(false);
          alert("Arrived at destination!");
          return;
        }

        const step = 0.001; // Movement speed
        const newLat = current.lat + (dx / dist) * step;
        const newLng = current.lng + (dy / dist) * step;

        try {
          await updateDoc(doc(db, 'orders', selectedOrder.id), {
            currentLocation: { lat: newLat, lng: newLng },
            updatedAt: serverTimestamp()
          });
        } catch (err) {
          console.error("Simulation Error:", err);
          setIsSimulating(false);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, selectedOrder?.id, selectedOrder?.status, selectedOrder?.currentLocation]);

  const updateOrderStatus = async (status: string) => {
    if (!selectedOrder) return;
    try {
      await updateDoc(doc(db, 'orders', selectedOrder.id), {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-navy tracking-tight uppercase italic mb-1">Live Logistics</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
             <Radio size={12} className={cn("text-yellow", isSimulating && "animate-pulse")} />
             {isSimulating ? "Transmitting GPS Signal..." : "FREE OpenStreetMap Routing Feed"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-14rem)] min-h-[600px] perspective-[1000px]">
        {/* Map Container - Leaflet */}
        <motion.div 
          initial={{ rotateX: 2, rotateY: -1 }}
          className="lg:col-span-3 rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3)] border-8 border-white relative bg-white z-0 transform hover:rotateX-0 transition-transform duration-1000"
        >
          <MapContainer 
            center={[35.9189, 5.2950]} 
            zoom={14} 
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%', filter: 'contrast(1.1) saturate(1.1)' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
            />
            
            {selectedOrder?.currentLocation && (
              <MapRecenter position={[selectedOrder.currentLocation.lat, selectedOrder.currentLocation.lng]} />
            )}
            {activeOrders.map(order => (order.currentLocation || order.shopLocation) && (
              <Marker 
                key={order.id} 
                position={[
                  order.currentLocation?.lat || order.shopLocation?.lat, 
                  order.currentLocation?.lng || order.shopLocation?.lng
                ]}
                icon={truckIcon}
                eventHandlers={{
                  click: () => setSelectedOrder(order),
                }}
              >
                <Popup className="custom-popup">
                   <div className="p-1">
                    <p className="font-black text-[10px] text-navy uppercase mb-1">Order #{(order.id || '').slice(0, 8)}</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{order.status}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {activeOrders.map(order => order.deliveryLocation && (
              <Marker 
                key={`dest-${order.id}`}
                position={[order.deliveryLocation.lat, order.deliveryLocation.lng]}
                icon={builderIcon}
                eventHandlers={{
                  click: () => setSelectedOrder(order),
                }}
              >
                <Popup>
                  <div className="p-1 text-center">
                     <p className="font-black text-xs text-navy uppercase mb-1">Builder / Site</p>
                     <p className="text-[10px] font-bold text-slate-500 mb-2">{order.deliveryAddress}</p>
                     <p className="text-[8px] font-black uppercase text-yellow">Target Destination</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Routing Logic: Driver -> Shop -> Builder */}
            {selectedOrder && selectedOrder.currentLocation && (
              <Routing 
                from={[selectedOrder.currentLocation.lat, selectedOrder.currentLocation.lng]}
                to={[selectedOrder.deliveryLocation?.lat, selectedOrder.deliveryLocation?.lng]}
                waypoints={
                  selectedOrder.status === 'assigned' 
                    ? [[selectedOrder.shopLocation?.lat || 35.918, selectedOrder.shopLocation?.lng || 5.295]]
                    : []
                }
                color={selectedOrder.status === 'picked_up' ? '#10B981' : '#FACC15'}
              />
            )}

            {shops.map(shop => shop.pos && (
              <Marker 
                key={shop.id} 
                position={[shop.pos.lat, shop.pos.lng]}
                icon={shopIcon}
              >
                <Popup>
                  <div className="p-1">
                    <p className="font-black text-[10px] text-navy uppercase">{shop.name}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>


          {/* Floating Indicators */}
          <div className="absolute top-6 left-6 z-[1000] flex flex-wrap gap-3">
            <div className="bg-navy/90 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 border border-white/20">
              <div className={cn("w-2 h-2 rounded-full", isSimulating ? "bg-yellow animate-pulse" : "bg-green-500")}></div>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">
                {isSimulating ? "Uplink Active" : "Live Satellite Feed"}
              </span>
            </div>
            
            {selectedOrder && (
              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl flex items-center gap-4 border border-slate-200">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-navy" />
                  <span className="text-[10px] font-black text-navy uppercase">ETA: {eta}</span>
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-navy uppercase">Total: KWD {(selectedOrder.totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>
            )}
            {selectedOrder && auth.currentUser?.uid === selectedOrder.driverId && (
              <button 
                onClick={() => setIsSimulating(!isSimulating)}
                className={cn(
                  "px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border text-[8px] font-black uppercase tracking-widest transition-all",
                  isSimulating 
                    ? "bg-red-500 text-white border-red-400" 
                    : "bg-yellow text-navy border-yellow-400"
                )}
              >
                {isSimulating ? <Square size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" />}
                {isSimulating ? "Stop Drive" : "Simulate Drive"}
              </button>
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl overflow-hidden flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-navy flex items-center gap-2 uppercase text-[10px] tracking-widest">
                <Navigation size={16} className="text-yellow" />
                Fleet Control
              </h3>
              <span className="px-2 py-1 bg-navy/5 text-navy text-[8px] font-black rounded-lg">
                {activeOrders.length} TRUCKS
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {activeOrders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 relative overflow-hidden group">
                  <img src="/img/tracking_illustration.jpg" className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-700" alt="Tracking" />
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Truck size={32} className="text-yellow" />
                    </div>
                    <p className="text-[10px] font-black text-navy uppercase tracking-[0.2em] mb-2">Fleet Radar Empty</p>
                    <p className="text-xs text-slate-400 font-medium max-w-[180px] mx-auto leading-relaxed">No active shipments in your area at the moment.</p>
                  </div>
                </div>
              ) : activeOrders.map(order => (
                <button 
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border-2 transition-all relative overflow-hidden",
                    selectedOrder?.id === order.id 
                      ? "bg-navy text-white border-navy shadow-xl scale-[1.02]" 
                      : "bg-white text-slate-600 border-slate-100 hover:border-yellow"
                  )}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-black text-xs tracking-tight">Order #{(order.id || '').slice(0, 8)}</p>
                    <span className={cn(
                      "text-[8px] font-black uppercase px-2 py-1 rounded-lg tracking-widest",
                      order.status === 'picked_up' ? "bg-green-500 text-white" : "bg-yellow text-navy"
                    )}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-60">
                     <p className="text-[8px] font-bold uppercase tracking-widest truncate">{order.shopName || 'Market'}</p>
                     <ChevronRight size={10} />
                     <p className="text-[8px] font-bold uppercase tracking-widest truncate">{order.deliveryAddress || 'Site'}</p>
                  </div>
                  {order.driverId === auth.currentUser?.uid && (
                    <div className="absolute bottom-0 right-0 p-1 opacity-20">
                      <Truck size={24} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {selectedOrder && (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedOrder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 pt-6 border-t border-slate-100"
                >
                   <div className="flex items-center gap-3 mb-6">
                     <div className="w-12 h-12 bg-navy rounded-2xl flex items-center justify-center text-yellow shadow-lg">
                        <Truck size={24} />
                     </div>
                     <div>
                        <h4 className="font-black uppercase tracking-widest text-[8px] opacity-60 text-slate-500">Live Mission</h4>
                        <p className="text-lg font-black tracking-tighter text-navy uppercase italic">#{(selectedOrder.id || '').slice(0, 10)}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                      <Clock size={16} className="text-yellow mb-1" />
                      <span className="text-[8px] font-black uppercase text-slate-400">ETA</span>
                      <p className="text-sm font-black text-navy">{eta}</p>
                    </div>
                    <div className="bg-navy p-4 rounded-2xl border border-navy shadow-lg flex flex-col items-center justify-center text-center">
                      <Package size={16} className="text-yellow mb-1" />
                      <span className="text-[8px] font-black uppercase text-white/60">Price</span>
                      <p className="text-sm font-black text-white">KWD {selectedOrder.totalAmount || 0}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6 border-l-2 border-slate-100 ml-2 pl-4">
                     <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full border-2 border-white bg-yellow shadow-sm"></div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">Pick-up From</span>
                        <div className="flex items-center gap-2">
                          <Store size={12} className="text-navy" />
                          <p className="text-[10px] font-bold text-navy uppercase tracking-tight">{selectedOrder.shopName || selectedOrder.shopId}</p>
                        </div>
                     </div>
                     <div className="relative pt-4">
                        <div className="absolute -left-[21px] top-5 w-2 h-2 rounded-full border-2 border-white bg-green-500 shadow-sm"></div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">Drop-off To</span>
                        <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-navy" />
                          <p className="text-[10px] font-bold text-navy uppercase tracking-tight truncate">{selectedOrder.deliveryAddress}</p>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {auth.currentUser?.uid === selectedOrder.driverId ? (
                      <>
                        {selectedOrder.status === 'assigned' ? (
                          <button 
                            onClick={() => updateOrderStatus('picked_up')}
                            className="col-span-2 bg-yellow text-navy py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            <Package size={14} />
                            Mark Picked Up
                          </button>
                        ) : (
                          <button 
                            onClick={() => updateOrderStatus('delivered')}
                            className="col-span-2 bg-green-500 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={14} />
                            Confirm delivery
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <button className="bg-navy text-white py-3 rounded-xl font-black uppercase tracking-widest text-[8px] shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                           <Info size={12} />
                           View Order
                        </button>
                        <button className="bg-slate-100 text-navy py-3 rounded-xl font-black uppercase tracking-widest text-[8px] border border-slate-200 hover:bg-white transition-all flex items-center justify-center gap-2">
                           <Info size={12} />
                           Contact
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


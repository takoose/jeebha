import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Truck, MapPin, Package, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function DriverJobBoard() {
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;

    // Available jobs (Pending)
    const qAvailable = query(
      collection(db, 'orders'),
      where('status', '==', 'pending')
    );

    // My jobs (Assigned or Picked Up)
    const qMy = query(
      collection(db, 'orders'),
      where('driverId', '==', auth.currentUser.uid)
    );

    const unsubAvailable = onSnapshot(qAvailable, (snapshot) => {
      setAvailableJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const unsubMy = onSnapshot(qMy, (snapshot) => {
      setMyJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubAvailable();
      unsubMy();
    };
  }, []);

  const acceptJob = async (jobId: string) => {
    if (!auth.currentUser) return;
    const orderRef = doc(db, 'orders', jobId);
    try {
      await updateDoc(orderRef, {
        driverId: auth.currentUser.uid,
        status: 'assigned',
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
      alert("Failed to accept job");
    }
  };

  const startPickup = async (jobId: string) => {
    const orderRef = doc(db, 'orders', jobId);
    try {
      await updateDoc(orderRef, {
        status: 'picked_up',
        updatedAt: serverTimestamp()
      });
      navigate('/map');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
           <h2 className="text-4xl font-black text-navy uppercase tracking-tight">Logistics Hub</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Available Shipments in your area</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-navy">Online</span>
           </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Available Jobs */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-navy flex items-center gap-3">
             <Package size={20} className="text-yellow" />
             Available Orders
          </h3>
          
          <div className="space-y-4">
            {availableJobs.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center text-slate-400">
                <Truck size={40} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold text-sm uppercase tracking-widest">No available loads right now</p>
              </div>
            ) : availableJobs.map(job => (
               <motion.div 
                layout
                key={job.id} 
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all"
               >
                 <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Order ID</span>
                      <span className="font-black text-navy">#{(job.id || '').slice(0, 8)}</span>
                    </div>
                    <div className="text-right font-black text-xl text-yellow">
                      KWD {job.totalAmount}
                    </div>
                 </div>

                 <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                       <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 mt-1">
                          <MapPin size={12} className="text-slate-400" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Destination</p>
                          <p className="font-bold text-sm text-navy">{job.deliveryAddress}</p>
                       </div>
                    </div>
                 </div>

                 <button 
                  onClick={() => acceptJob(job.id)}
                  className="w-full bg-navy text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-yellow hover:text-navy transition-all"
                 >
                   Accept Job
                 </button>
               </motion.div>
            ))}
          </div>
        </div>

        {/* My Active Jobs */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-navy flex items-center gap-3">
             <Truck size={20} className="text-yellow" />
             My Shipments
          </h3>
          
          <div className="space-y-4">
            {myJobs.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center text-slate-400">
                 <p className="font-bold text-sm uppercase tracking-widest">You have no active shipments</p>
              </div>
            ) : myJobs.map(job => (
              <motion.div 
                layout
                key={job.id} 
                className="bg-navy text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
               >
                 <div className="absolute top-0 right-0 p-8">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                      job.status === 'picked_up' ? "bg-green-500" : "bg-yellow text-navy"
                    )}>
                      {job.status}
                    </span>
                 </div>

                 <h4 className="text-2xl font-black mb-6">#{(job.id || '').slice(0, 12)}</h4>
                 
                 <div className="space-y-6 mb-10">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <MapPin size={18} className="text-yellow" />
                       </div>
                       <p className="font-bold text-sm text-slate-300">{job.deliveryAddress}</p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    {job.status === 'assigned' ? (
                       <button 
                         onClick={() => startPickup(job.id)}
                         className="flex-1 bg-yellow text-navy font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-all"
                       >
                         Start Pickup
                       </button>
                    ) : (
                       <button 
                         onClick={() => navigate('/map')}
                         className="flex-1 bg-white/10 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                       >
                         Open Tracking <ArrowRight size={16} />
                       </button>
                    )}
                 </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

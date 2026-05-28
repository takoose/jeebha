import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Phone, CheckCircle, Shield, ArrowRight, ChevronLeft } from 'lucide-react';

export default function BookingRequest() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const departure = searchParams.get('departure');
  const destination = searchParams.get('destination');
  
  const [phone, setPhone] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted || !phone) return;
    
    setLoading(true);
    // Simulate booking
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full space-y-6"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-black text-navy uppercase tracking-tight">Booking Received!</h2>
          <p className="text-slate-500 font-medium">
            Our logistics team will contact you at <span className="font-bold text-navy">{phone}</span> within 10 minutes to confirm your load from {departure} to {destination}.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-navy text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-8 hover:text-navy transition-colors"
        >
          <ChevronLeft size={16} />
          Modify Route
        </button>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-white"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black text-navy uppercase tracking-tight mb-2">Finalize Booking</h2>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              <span>{departure}</span>
              <ArrowRight size={10} />
              <span className="text-yellow">{destination}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="tel"
                  placeholder="+213 --- --- ---"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-3xl py-6 pl-16 pr-8 font-black text-navy focus:border-yellow transition-all outline-none text-xl"
                  required
                />
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center mt-2">We'll call you to confirm site access and cargo details</p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <input 
                    type="checkbox" 
                    id="policy"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="w-5 h-5 accent-yellow rounded-lg"
                  />
                </div>
                <label htmlFor="policy" className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                  I accept the <span className="text-navy underline">Jeebha Logistics Policy</span>, including site safety requirements and automated shipment tracking.
                </label>
              </div>
              <div className="flex items-center gap-3 text-slate-300 py-2 border-t border-slate-100">
                <Shield size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Secured by Jeebha Shield</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={!accepted || !phone || loading}
              className="w-full bg-navy text-white font-black py-6 rounded-3xl uppercase tracking-[0.2em] text-xs hover:bg-yellow hover:text-navy transition-all shadow-2xl shadow-navy/20 disabled:opacity-50 disabled:grayscale"
            >
              {loading ? 'Processing...' : 'Confirm Load Request'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

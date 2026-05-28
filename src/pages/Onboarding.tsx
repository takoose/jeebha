import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  Store, 
  Truck, 
  HardHat, 
  Camera, 
  Upload, 
  ArrowRight,
  ShieldAlert,
  MapPin,
  Phone,
  FileText,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Onboarding() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [files, setFiles] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUser(data);
          if (data.verified) {
            navigate('/dashboard');
          }
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  const handleFileUpload = async (field: string, file: File) => {
    if (!auth.currentUser) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `onboarding/${auth.currentUser.uid}/${field}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData((prev: any) => ({ ...prev, [field]: url }));
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        ...formData,
        onboardingComplete: true,
        verificationStatus: 'verified',
        verified: true,
        updatedAt: serverTimestamp()
      });
      setStep(3); // Success step
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const role = user?.role || 'customer';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-yellow rounded-2xl flex items-center justify-center text-navy shadow-lg">
                    {role === 'shop_manager' ? <Store size={24} /> : role === 'driver' ? <Truck size={24} /> : <HardHat size={24} />}
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-navy uppercase tracking-tight">Complete your profile</h2>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Step 1 of 2: Essential Details</p>
                 </div>
              </div>

              <div className="space-y-6">
                 {role === 'shop_manager' && (
                   <>
                     <Input label="Shop Name" placeholder="e.g. Algiers Hardware" value={formData.shopName} onChange={v => setFormData({...formData, shopName: v})} />
                     <Input label="Shop Address" placeholder="Street, City" value={formData.address} onChange={v => setFormData({...formData, address: v})} />
                     <Input label="Trade License Number" placeholder="RC-12345678" value={formData.licenseNumber} onChange={v => setFormData({...formData, licenseNumber: v})} />
                   </>
                 )}
                 {role === 'driver' && (
                   <>
                     <Input label="Full Name" placeholder="Your name" value={formData.fullName} onChange={v => setFormData({...formData, fullName: v})} />
                     <Input label="Truck Type" placeholder="e.g. 10 Ton Crane Truck" value={formData.truckType} onChange={v => setFormData({...formData, truckType: v})} />
                     <Input label="License Plate" placeholder="12345-120-16" value={formData.plate} onChange={v => setFormData({...formData, plate: v})} />
                   </>
                 )}
                 {role === 'customer' && (
                   <>
                     <Input label="Full Name" placeholder="Your name" value={formData.fullName} onChange={v => setFormData({...formData, fullName: v})} />
                     <Input label="Phone Number" placeholder="+213..." value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                   </>
                 )}

                 <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-navy text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-3 mt-8"
                 >
                   Next Step
                   <ArrowRight size={18} />
                 </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center gap-4 mb-8">
                 <button onClick={() => setStep(1)} className="text-slate-400 hover:text-navy transition-colors">
                    <ArrowRight className="rotate-180" size={24} />
                 </button>
                 <div>
                    <h2 className="text-3xl font-black text-navy uppercase tracking-tight">Verification Docs</h2>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Step 2 of 2: Safety First</p>
                 </div>
              </div>

              <div className="space-y-8">
                 {role === 'shop_manager' && (
                   <>
                     <UploadSection 
                       label="Shop Front Photo" 
                       desc="Clear photo of your shop signage"
                       url={formData.shopPhoto} 
                       onUpload={f => handleFileUpload('shopPhoto', f)} 
                       uploading={uploading}
                     />
                     <UploadSection 
                       label="Business License" 
                       desc="PDF or Image of your RC"
                       url={formData.licenseFile} 
                       onUpload={f => handleFileUpload('licenseFile', f)} 
                       uploading={uploading}
                     />
                   </>
                 )}
                 {role === 'driver' && (
                   <>
                     <UploadSection 
                       label="Driving License" 
                       desc="Front and back of your heavy vehicle license"
                       url={formData.driverLicense} 
                       onUpload={f => handleFileUpload('driverLicense', f)} 
                       uploading={uploading}
                     />
                     <UploadSection 
                       label="Truck Registration" 
                       desc="Photo of your carte grise"
                       url={formData.registration} 
                       onUpload={f => handleFileUpload('registration', f)} 
                       uploading={uploading}
                     />
                   </>
                 )}
                 {role === 'customer' && (
                   <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                      <ShieldAlert size={40} className="text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">Builders don't require document verification to start, but your phone number must be valid.</p>
                   </div>
                 )}

                 <button 
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="w-full bg-yellow text-navy py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all flex items-center justify-center gap-3 mt-8 shadow-xl shadow-yellow/20"
                 >
                   Submit for Verification
                   <CheckCircle size={18} />
                 </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-navy text-white rounded-[3rem] p-16 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-24 h-24 bg-yellow rounded-[2rem] flex items-center justify-center text-navy shadow-2xl shadow-yellow/30 mx-auto mb-10 rotate-12">
                   <CheckCircle size={48} />
                </div>
                <h2 className="text-5xl font-black mb-6 leading-none tracking-tighter uppercase italic">Welcome Aboard!</h2>
                <p className="text-xl text-slate-400 font-medium max-w-md mx-auto mb-12">
                  Your account has been verified successfully. You can now start using all the features of Jeebha.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4 text-left">
                     <div className="w-10 h-10 bg-yellow/20 rounded-xl flex items-center justify-center text-yellow">
                        <CheckCircle size={20} />
                     </div>
                     <div>
                        <p className="font-bold">Account Verified</p>
                        <p className="text-sm text-slate-500">Instant activation complete</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => {
                      // Small delay to ensure Firestore cache updates or App.tsx fetches new data
                      setTimeout(() => {
                        window.location.href = '/dashboard';
                      }, 500);
                    }}
                    className="w-full bg-yellow text-navy py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl shadow-yellow/20"
                  >
                    Start Working
                  </button>
                </div>
              </div>
              {/* Decor */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow/5 rounded-full blur-[100px]"></div>
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow/5 rounded-full blur-[120px]"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">{label}</label>
      <input 
        type="text" 
        placeholder={placeholder}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 font-bold text-navy focus:border-yellow transition-all outline-none"
      />
    </div>
  );
}

function UploadSection({ label, desc, url, onUpload, uploading }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">{label}</label>
      <div className="relative group">
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer z-10" 
          onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])}
          disabled={uploading}
        />
        <div className={cn(
          "w-full border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center transition-all",
          url ? "border-green-500 bg-green-50 text-green-600" : "border-slate-100 bg-slate-50 text-slate-400 group-hover:border-yellow group-hover:bg-white"
        )}>
          {uploading ? (
            <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
          ) : url ? (
            <div className="flex flex-col items-center">
               <img src={url} className="w-16 h-16 rounded-xl object-cover mb-4" alt="Uploaded" />
               <p className="text-xs font-black uppercase tracking-widest">Document Received</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Camera size={24} />
              </div>
              <p className="text-sm font-bold mb-1">Click or drag to upload</p>
              <p className="text-[10px] uppercase font-black tracking-widest opacity-50">{desc}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

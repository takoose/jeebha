import { Save, Bell, Shield, Globe, Terminal, Database, Brush } from 'lucide-react';

const SettingsSection = ({ icon: Icon, title, description, children }: any) => (
  <div className="dashboard-card p-8">
    <div className="flex gap-6 mb-8">
      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-navy shrink-0 border border-slate-100">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-navy tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

const SettingRow = ({ label, description, children }: any) => (
  <div className="flex flex-wrap gap-4 items-center justify-between border-b border-slate-50 pb-6 last:border-0 last:pb-0">
    <div className="max-w-md">
      <label className="font-bold text-navy text-sm block mb-1">{label}</label>
      <p className="text-xs text-slate-400 leading-relaxed italic font-serif">{description}</p>
    </div>
    <div className="w-full sm:w-auto">
      {children}
    </div>
  </div>
);

export default function Settings() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy tracking-tight">System Settings</h1>
        <button className="btn-secondary flex items-center gap-2">
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SettingsSection 
          icon={Brush} 
          title="Branding & UI" 
          description="Customize the look and feel of the Jeebha Admin panel"
        >
          <SettingRow label="Primary Color" description="The main color used for buttons, links, and branding elements. Currently Jeebha Navy.">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-navy"></div>
              <span className="font-mono text-xs">#002147</span>
            </div>
          </SettingRow>
          <SettingRow label="Accent Color" description="The accent color used for highlights and primary CTAs. Currently Jeebha Yellow.">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-yellow"></div>
              <span className="font-mono text-xs">#FDB813</span>
            </div>
          </SettingRow>
          <SettingRow label="Maintenance Mode" description="Prevent users from accessing the platform during updates.">
            <input type="checkbox" className="w-10 h-5 bg-slate-200 Appearance-none rounded-full cursor-pointer checked:bg-yellow shadow-inner transition-colors" />
          </SettingRow>
        </SettingsSection>

        <SettingsSection 
          icon={Bell} 
          title="Notifications" 
          description="Control how the system communicates with admins and users"
        >
          <SettingRow label="Order Alerts" description="Receive real-time desktop notifications for every new order placed.">
            <input type="checkbox" defaultChecked className="w-10 h-5 bg-slate-200 Appearance-none rounded-full cursor-pointer checked:bg-yellow shadow-inner transition-colors" />
          </SettingRow>
          <SettingRow label="Logistics Sync" description="Trigger SMS updates to customers when drivers are within 5km.">
            <input type="checkbox" defaultChecked className="w-10 h-5 bg-slate-200 Appearance-none rounded-full cursor-pointer checked:bg-yellow shadow-inner transition-colors" />
          </SettingRow>
          <SettingRow label="Email Reports" description="Send daily transaction and inventory summaries to stakeholders.">
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-navy focus:outline-none">
              <option>Daily at 8:00 AM</option>
              <option>Weekly on Mondays</option>
              <option>Monthly</option>
            </select>
          </SettingRow>
        </SettingsSection>

        <SettingsSection 
          icon={Shield} 
          title="Access Control" 
          description="Manage security, roles, and administrative permissions"
        >
          <SettingRow label="Multi-Factor Auth" description="Ensure all administrative accounts use 2FA for increased security.">
             <span className="text-[10px] font-bold uppercase tracking-widest text-green-500 bg-green-50 px-2 py-1 rounded">Enforced</span>
          </SettingRow>
          <SettingRow label="API Access" description="Allow external systems to connect via the secure Jeebha REST API.">
            <button className="text-xs font-bold text-navy border-b border-navy">Manage Tokens</button>
          </SettingRow>
        </SettingsSection>

        <SettingsSection 
          icon={Database} 
          title="Firebase Sync" 
          description="Database health and infrastructure synchronization status"
        >
          <SettingRow label="Firestore Status" description="Real-time document synchronization across all client instances.">
             <div className="flex items-center gap-2 text-green-500 font-bold text-xs uppercase tracking-widest">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               Connected
             </div>
          </SettingRow>
          <SettingRow label="Storage Usage" description="Capacity utilized by product images and user avatars.">
             <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
               <div className="bg-yellow h-full w-[45%]"></div>
             </div>
          </SettingRow>
        </SettingsSection>
      </div>
    </div>
  );
}

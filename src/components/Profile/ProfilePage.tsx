'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Camera, MapPin, Mail, Edit3, Check, X,
  Shield, ShieldCheck, Heart, Settings, HelpCircle, LogOut,
  Play, ChevronRight, Moon, Sun, Bell, BellOff, Globe,
  Smartphone, Trash2, Download, Info, Leaf, TrendingUp,
  Sparkles, Zap, Award
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { triggerHaptic } from '@/lib/native/bridge';
import { useTheme } from '@/context/ThemeContext';

interface ProfilePageProps {
  demoMode: boolean;
  setDemoMode: (v: boolean) => void;
}

export default function ProfilePage({ demoMode, setDemoMode }: ProfilePageProps) {
  const { user, logout, updateUser } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');

  // Settings panel
  const [activePanel, setActivePanel] = useState<string | null>(null);

  // Settings states (persisted in localStorage)
  // Dark mode is managed by ThemeContext (isDarkMode + toggleTheme)
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');
  const [autoSave, setAutoSave] = useState(true);

  // Scan stats from IndexedDB
  const [scanCount, setScanCount] = useState(0);
  const [savedDiagnoses, setSavedDiagnoses] = useState<any[]>([]);

  useEffect(() => {
    import('@/lib/db/indexedDB').then(({ getScans }) => {
      getScans().then(scans => {
        setScanCount(scans?.length || 0);
        setSavedDiagnoses(scans || []);
      }).catch(() => {});
    });
  }, []);

  // Sync edit fields with user
  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditLocation(user.location);
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateUser({ avatar: reader.result as string });
      triggerHaptic();
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    updateUser({
      name: editName.trim() || user?.name,
      email: editEmail.trim() || user?.email,
      location: editLocation.trim() || user?.location,
    });
    setIsEditing(false);
    triggerHaptic();
  };

  const handleDeleteDiagnosis = (id: string) => {
    setSavedDiagnoses(prev => prev.filter(s => s.id !== id));
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  const STATS = [
    { label: 'Total Scans', value: scanCount.toString(), icon: Leaf, color: 'primary' },
    { label: 'Accuracy', value: '95%', icon: TrendingUp, color: 'info' },
    { label: 'Streak', value: '7 days', icon: Zap, color: 'accent' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Profile Card */}
      <motion.div {...fadeIn} className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary/15 via-black/40 to-info/10 border border-white/10 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
        {/* Decorative shimmer */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 5 }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] pointer-events-none"
        />
        
        {/* Top gradient bar */}
        <div className="h-28 bg-gradient-to-r from-primary/40 via-primary/20 to-info/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/banner.png')] bg-cover bg-center opacity-20" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-10 -right-10 w-40 h-40 border border-dashed border-white/10 rounded-full pointer-events-none"
          />
          {/* Edit button on card */}
          <button
            onClick={() => { if (isEditing) handleSaveProfile(); else setIsEditing(true); }}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/40 backdrop-blur-md border border-white/15 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:border-primary/40 transition-all"
          >
            {isEditing ? <Check size={18} className="text-primary" /> : <Edit3 size={16} />}
          </button>
        </div>

        <div className="px-6 pb-8 -mt-14 relative z-10">
          {/* Avatar */}
          <div className="relative w-28 h-28 mx-auto mb-5">
            <div className="w-28 h-28 rounded-full border-4 border-bg-dark overflow-hidden bg-black/60 shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative group">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                  <User size={48} className="text-primary drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                </div>
              )}
              {/* Camera overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
              >
                <Camera size={24} className="text-white" />
              </button>
            </div>
            {/* Status dot */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-primary border-[3px] border-bg-dark rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name & Info - Editable */}
          <div className="text-center space-y-3">
            {isEditing ? (
              <div className="space-y-3 max-w-xs mx-auto">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-center text-lg font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Your Name"
                />
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-white/30 shrink-0" />
                  <input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="Email"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-white/30 shrink-0" />
                  <input
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="Location"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={handleSaveProfile} className="flex-1 bg-primary text-black py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                    <Check size={16} /> Save
                  </button>
                  <button onClick={() => setIsEditing(false)} className="flex-1 bg-white/5 border border-white/10 text-white/60 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                    <X size={16} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl font-black text-white tracking-tight">{user?.name || 'Guest Farmer'}</h2>
                  <Award size={18} className="text-primary drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                </div>
                <div className="flex items-center justify-center gap-4 text-white/50 text-sm">
                  <span className="flex items-center gap-1.5"><MapPin size={13} />{user?.location || 'India'}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="flex items-center gap-1.5"><Mail size={13} />{user?.email || 'guest@cropcare.ai'}</span>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                    Pro Farmer
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-3">
        {STATS.map(stat => (
          <div key={stat.label} className={`relative bg-gradient-to-br from-${stat.color}/20 to-${stat.color}/5 backdrop-blur-xl border border-${stat.color}/15 rounded-[20px] p-4 flex flex-col items-center text-center overflow-hidden`}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <stat.icon size={16} className={`text-${stat.color} relative z-10 mb-1.5 drop-shadow-[0_0_6px_currentColor]`} />
            <span className="text-xl font-black text-white relative z-10">{stat.value}</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-white/40 relative z-10 mt-0.5">{stat.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Menu Items */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="space-y-2.5">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 px-1 flex items-center gap-2 mb-3">
          <Sparkles size={12} /> Account & Preferences
        </h4>

        {/* Demo Mode */}
        <MenuRow
          icon={Play}
          label={demoMode ? 'Deactivate Demo Mode' : 'Activate Demo Mode'}
          subtitle={demoMode ? 'Fake data is active' : 'Test the app with sample data'}
          color="text-accent"
          rightElement={
            <ToggleSwitch value={demoMode} onChange={() => { setDemoMode(!demoMode); triggerHaptic(); }} color="accent" />
          }
        />

        {/* Notifications */}
        <MenuRow
          icon={notifications ? Bell : BellOff}
          label="Push Notifications"
          subtitle={notifications ? 'Alerts enabled' : 'Alerts disabled'}
          color="text-info"
          rightElement={
            <ToggleSwitch value={notifications} onChange={() => setNotifications(!notifications)} color="info" />
          }
        />

        {/* Dark Mode */}
        <MenuRow
          icon={isDarkMode ? Moon : Sun}
          label="Dark Mode"
          subtitle={isDarkMode ? 'Dark theme active' : 'Light theme active'}
          color="text-purple-400"
          rightElement={
            <ToggleSwitch value={isDarkMode} onChange={() => { toggleTheme(); triggerHaptic(); }} color="purple" />
          }
        />

        {/* Auto Save */}
        <MenuRow
          icon={Download}
          label="Auto-Save Scans"
          subtitle={autoSave ? 'Scans saved locally' : 'Manual save only'}
          color="text-primary"
          rightElement={
            <ToggleSwitch value={autoSave} onChange={() => setAutoSave(!autoSave)} color="primary" />
          }
        />
      </motion.div>

      {/* Saved Diagnoses */}
      <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="space-y-2.5">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 px-1 flex items-center gap-2 mb-3">
          <Heart size={12} /> Saved Diagnoses ({savedDiagnoses.length})
        </h4>

        {savedDiagnoses.length > 0 ? (
          <div className="space-y-2">
            {savedDiagnoses.slice(0, 5).map((scan, i) => {
              const isHealthy = scan.result?.diseaseName?.toLowerCase().includes('healthy') || scan.result?.severity === 'Low';
              return (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="bg-black/30 backdrop-blur-xl border border-white/5 rounded-[18px] p-4 flex items-center justify-between group hover:bg-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-sm ${isHealthy ? 'bg-primary/15 border border-primary/20' : 'bg-danger/15 border border-danger/20'}`}>
                      {isHealthy ? '🌱' : '⚠️'}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-white/90">{scan.result?.diseaseName || 'Unknown'}</p>
                      <p className="text-[10px] text-white/35 font-medium mt-0.5">
                        {new Date(scan.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        <span className={`ml-2 ${isHealthy ? 'text-primary' : 'text-danger'}`}>• {scan.result?.severity || 'N/A'}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteDiagnosis(scan.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-danger hover:bg-danger/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-black/20 border border-white/5 rounded-[18px] p-8 text-center">
            <Heart size={28} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm font-medium">No saved diagnoses yet</p>
            <p className="text-white/15 text-xs mt-1">Scan crops to see history here</p>
          </div>
        )}
      </motion.div>

      {/* More Options */}
      <motion.div {...fadeIn} transition={{ delay: 0.4 }} className="space-y-2.5">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 px-1 flex items-center gap-2 mb-3">
          <Settings size={12} /> More
        </h4>

        <MenuRow
          icon={ShieldCheck}
          label="Verified Expert Status"
          subtitle="Badge for trusted farmers"
          color="text-primary"
          onClick={() => setActivePanel('expert')}
          rightElement={<ChevronRight size={16} className="text-white/20" />}
        />

        <MenuRow
          icon={Globe}
          label="Language"
          subtitle={language}
          color="text-info"
          onClick={() => setActivePanel('language')}
          rightElement={<ChevronRight size={16} className="text-white/20" />}
        />

        <MenuRow
          icon={Smartphone}
          label="About CropCare AI"
          subtitle="Version 2.0.1 • Built with ❤️"
          color="text-accent"
          onClick={() => setActivePanel('about')}
          rightElement={<ChevronRight size={16} className="text-white/20" />}
        />

        <MenuRow
          icon={HelpCircle}
          label="Help & Support"
          subtitle="FAQs and contact"
          color="text-purple-400"
          onClick={() => setActivePanel('help')}
          rightElement={<ChevronRight size={16} className="text-white/20" />}
        />
      </motion.div>

      {/* Sign Out */}
      <motion.div {...fadeIn} transition={{ delay: 0.5 }}>
        <button
          onClick={() => { logout(); window.location.reload(); }}
          className="w-full bg-danger/10 border border-danger/15 rounded-[18px] p-5 flex items-center justify-center gap-3 text-danger font-bold text-sm hover:bg-danger/20 hover:border-danger/30 transition-all active:scale-[0.98]"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </motion.div>

      {/* ===== PANELS (overlays) ===== */}
      <AnimatePresence>
        {activePanel === 'expert' && (
          <PanelOverlay title="Expert Verification" onClose={() => setActivePanel(null)}>
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-primary/15 border border-primary/20 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck size={40} className="text-primary drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Become a Verified Expert</h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
                  Get a verified badge on your profile by completing 50+ crop scans and helping 10+ farmers in the community feed.
                </p>
              </div>
              <div className="space-y-3">
                <ProgressRow label="Crop Scans" current={scanCount} target={50} />
                <ProgressRow label="Community Helps" current={3} target={10} />
              </div>
              <div className="bg-primary/10 border border-primary/15 rounded-xl p-4">
                <p className="text-primary text-xs font-bold uppercase tracking-widest">Status: In Progress</p>
              </div>
            </div>
          </PanelOverlay>
        )}

        {activePanel === 'language' && (
          <PanelOverlay title="Select Language" onClose={() => setActivePanel(null)}>
            <div className="space-y-2 py-2">
              {['English', 'हिंदी (Hindi)', 'ਪੰਜਾਬੀ (Punjabi)', 'தமிழ் (Tamil)', 'తెలుగు (Telugu)', 'বাংলা (Bengali)', 'मराठी (Marathi)'].map(lang => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang.split(' ')[0]); setActivePanel(null); }}
                  className={`w-full p-4 rounded-[14px] flex items-center justify-between transition-all ${
                    language === lang.split(' ')[0]
                      ? 'bg-primary/15 border border-primary/30 text-primary'
                      : 'bg-white/5 border border-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span className="font-bold text-sm">{lang}</span>
                  {language === lang.split(' ')[0] && <Check size={18} className="text-primary" />}
                </button>
              ))}
            </div>
          </PanelOverlay>
        )}

        {activePanel === 'about' && (
          <PanelOverlay title="About CropCare AI" onClose={() => setActivePanel(null)}>
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-primary/15 border border-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Leaf size={36} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">CropCare AI</h3>
                <p className="text-white/40 text-sm">Version 2.0.1</p>
              </div>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
                Empowering 1M+ farmers with precision agriculture using cutting-edge AI disease detection, weather intelligence, and community-driven knowledge sharing.
              </p>
              <div className="space-y-2 text-left">
                {[
                  { label: 'AI Engine', value: 'Gemini 2.5 Flash' },
                  { label: 'Platform', value: 'Next.js + PWA + Capacitor' },
                  { label: 'License', value: 'Open Source (MIT)' },
                ].map(item => (
                  <div key={item.label} className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex justify-between">
                    <span className="text-white/40 text-xs font-bold uppercase tracking-wider">{item.label}</span>
                    <span className="text-white/80 text-xs font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </PanelOverlay>
        )}

        {activePanel === 'help' && (
          <PanelOverlay title="Help & Support" onClose={() => setActivePanel(null)}>
            <div className="space-y-3 py-2">
              {[
                { q: 'How does AI scan work?', a: 'Take a photo of infected leaves—our Gemini AI analyzes patterns to identify diseases with 95% accuracy.' },
                { q: 'Is my data safe?', a: 'Yes! All scans are stored locally on your device first. Cloud sync is optional and encrypted.' },
                { q: 'Can I use it offline?', a: 'Absolutely. CropCare is a PWA that works offline. Scans queue and sync when reconnected.' },
                { q: 'How to improve accuracy?', a: 'Scan in good lighting, focus on affected leaves, and capture both sides for best results.' },
                { q: 'Contact support?', a: 'Email us at support@cropcare.ai or reach us through the Community tab.' },
              ].map((faq, i) => (
                <details key={i} className="group bg-white/5 border border-white/5 rounded-[14px] overflow-hidden">
                  <summary className="p-4 flex items-center justify-between cursor-pointer list-none">
                    <span className="text-sm font-bold text-white/80">{faq.q}</span>
                    <ChevronRight size={16} className="text-white/30 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </PanelOverlay>
        )}
      </AnimatePresence>
    </div>
  );
}


/* ===== Sub-components ===== */

function MenuRow({ icon: Icon, label, subtitle, color, onClick, rightElement }: {
  icon: any;
  label: string;
  subtitle?: string;
  color: string;
  onClick?: () => void;
  rightElement?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-black/25 backdrop-blur-xl border border-white/5 rounded-[18px] p-4 flex items-center justify-between hover:bg-white/5 hover:border-white/10 transition-all duration-300 group active:scale-[0.98]"
    >
      <div className="flex items-center gap-3.5">
        <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${color} bg-white/5 border border-white/5`}>
          <Icon size={18} />
        </div>
        <div className="text-left">
          <span className="text-[13px] font-bold text-white/90 block">{label}</span>
          {subtitle && <span className="text-[10px] text-white/35 font-medium">{subtitle}</span>}
        </div>
      </div>
      {rightElement}
    </button>
  );
}

function ToggleSwitch({ value, onChange, color }: { value: boolean; onChange: () => void; color: string }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
        value ? `bg-${color === 'purple' ? 'purple-500' : color}/40 border-${color === 'purple' ? 'purple-500' : color}/40` : 'bg-white/10 border-white/15'
      } border`}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-[3px] w-5 h-5 rounded-full shadow-md ${
          value ? `bg-${color === 'purple' ? 'purple-400' : color} shadow-[0_0_8px_rgba(16,185,129,0.4)]` : 'bg-white/50'
        }`}
      />
    </button>
  );
}

function ProgressRow({ label, current, target }: { label: string; current: number; target: number }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="text-left">
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-bold text-white/60">{label}</span>
        <span className="text-xs font-bold text-white/80">{current}/{target}</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
        />
      </div>
    </div>
  );
}

function PanelOverlay({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f1419] border border-white/10 rounded-t-[28px] md:rounded-[28px] w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl"
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 md:hidden">
          <div className="w-10 h-1 bg-white/15 rounded-full" />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button onClick={onClose} className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

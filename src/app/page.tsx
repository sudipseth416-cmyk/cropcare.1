'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { WeatherSkeleton, PostSkeleton, Skeleton } from "@/components/UI/Skeletons";

// Dynamic imports with high-performance skeletons
const Scanner = dynamic(() => import("@/components/DiseaseDetection/Scanner"), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
  ssr: false
});

const WeatherDashboard = dynamic(() => import("@/components/Weather/WeatherDashboard"), {
  loading: () => <WeatherSkeleton />,
  ssr: false
});

const CommunityFeed = dynamic(() => import("@/components/Community/Feed"), {
  loading: () => <div className="space-y-4"><PostSkeleton /><PostSkeleton /></div>,
  ssr: false
});

const FertilizerCalculator = dynamic(() => import("@/components/Calculators/FertilizerCalculator"), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false
});

const CropSearch = dynamic(() => import("@/components/Crops/CropSearch"), {
  loading: () => <Skeleton className="h-20 w-full" />,
  ssr: false
});

import NotificationBell from "@/components/Notifications/NotificationBell";
import BottomNav from "@/components/Navigation/BottomNav";
import MobileContainer from "@/components/Layout/MobileContainer";
import MobileDashboard from "@/components/Dashboard/MobileDashboard";
import Onboarding from "@/components/Demo/Onboarding";
import SectionBackground from "@/components/Layout/SectionBackground";
import { triggerHaptic } from "@/lib/native/bridge";
import { User, Settings, ShieldCheck, LogOut, Heart, HelpCircle, Play } from 'lucide-react';

import { useUser } from "@/hooks/useUser";
import SignInModal from "@/components/Auth/SignInModal";
import Image from "next/image";

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [demoMode, setDemoMode] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { user, logout, loading: userLoading } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || userLoading) {
    return (
      <div 
        className="fixed inset-0 flex flex-col items-center justify-center z-[9999] bg-cover bg-center"
        style={{ backgroundImage: "url('/front.avif')" }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-0"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-3xl px-6">
          <h2 className="text-5xl md:text-7xl font-black font-heading text-white tracking-[0.2em] drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] animate-pulse mb-8 text-center">
            CROPCARE <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-600 drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]">AI</span>
          </h2>
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="h-px bg-gradient-to-r from-transparent to-primary flex-1 max-w-[80px]"></div>
            <p className="text-white text-sm md:text-lg font-medium tracking-[0.4em] uppercase shadow-black drop-shadow-md text-center">
              Initializing Intelligence
            </p>
            <div className="h-px bg-gradient-to-l from-transparent to-primary flex-1 max-w-[80px]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user?.isLoggedIn) {
    return <Onboarding onComplete={() => window.location.reload()} />;
  }

  return (
    <main className="min-h-screen bg-bg-dark selection:bg-primary/30 pb-32 md:pb-0 relative">
      {/* Dynamic Animated Background per Section */}
      <SectionBackground activeTab={activeTab} />
      
      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
      {/* Demo Mode Badge */}
      {demoMode && (
        <div className="bg-accent text-black text-[10px] font-bold uppercase tracking-widest py-1 px-4 text-center sticky top-0 z-[100] flex items-center justify-center gap-2">
          <Play size={10} fill="currentColor" /> Demo Mode Active • Fake Data Enabled
        </div>
      )}
      {/* Mobile Top Header */}
      <header className="px-6 py-4 flex justify-between items-center bg-bg-dark/60 backdrop-blur-2xl sticky top-0 z-[60] border-b border-white/10 md:hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative flex items-center justify-center">
            <Image src="/logo.png" alt="CropCare AI Logo" fill className="object-contain" priority />
          </div>
          <span className="text-xl font-bold font-heading bg-clip-text text-transparent bg-premium-gradient">CropCare</span>
        </div>
        <NotificationBell />
      </header>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex border-b border-white/10 py-6 sticky top-0 bg-bg-dark/60 backdrop-blur-2xl z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative flex items-center justify-center">
              <Image src="/logo.png" alt="CropCare AI Logo" fill className="object-contain" priority />
            </div>
            <span className="text-3xl font-bold font-heading tracking-tight text-white">CropCare <span className="bg-clip-text text-transparent bg-premium-gradient">AI</span></span>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-8 text-sm font-medium text-text-muted mr-8">
              <a href="#" onClick={() => setActiveTab('home')} className="hover:text-primary transition-colors">Dashboard</a>
              <a href="#" onClick={() => setActiveTab('scan')} className="hover:text-primary transition-colors">Scanner</a>
              <a href="#" onClick={() => setActiveTab('alerts')} className="hover:text-primary transition-colors">Weather</a>
              <a href="#" onClick={() => setActiveTab('community')} className="hover:text-primary transition-colors">Community</a>
            </div>
            {user?.isLoggedIn ? (
              <button onClick={() => setActiveTab('profile')} className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                   <User size={16} />
                </div>
                <span className="text-sm font-bold">{user.name}</span>
              </button>
            ) : (
              <button onClick={() => setIsSignInOpen(true)} className="btn btn-primary py-2 px-6">Sign In</button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 relative z-10">
        {/* Tab Content */}
        <div className="space-y-16">
          {/* Home Tab - Redesigned Dashboard */}
          {(activeTab === 'home') && (
            <MobileContainer 
              title={user?.isLoggedIn ? `Namaste, ${user.name.split(' ')[0]}` : "Farm Overview"} 
              description={user?.isLoggedIn ? `Personalized alerts for your farm in ${user.location}.` : "Welcome back to your digital farm assistant."}
            >
              <MobileDashboard onAction={setActiveTab} />
              <div className="mt-12 hidden md:block">
                <Scanner />
              </div>
            </MobileContainer>
          )}

          {/* Scan Tab */}
          {(activeTab === 'scan') && (
            <MobileContainer 
              title="Crop Scanner" 
              description="Capture infected leaves for instant AI diagnosis."
            >
              <Scanner />
            </MobileContainer>
          )}

          {/* Alerts Tab - Weather & Intelligence */}
          {(activeTab === 'alerts') && (
            <MobileContainer 
              title="Intelligence Hub" 
              description="Weather, pest alerts, and farming insights."
            >
              <WeatherDashboard />
              <div className="mt-8">
                <FertilizerCalculator />
              </div>
            </MobileContainer>
          )}

          {/* Community Tab */}
          {(activeTab === 'community') && (
            <MobileContainer 
              title="Farmer Network" 
              description="Connect with experts and fellow farmers."
            >
              <CommunityFeed />
            </MobileContainer>
          )}

          {/* Profile Tab placeholder */}
          {(activeTab === 'profile') && (
            <MobileContainer title="My Profile" description="Manage your farm and settings.">
              <div className="space-y-6">
                <div className="card p-8 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <User size={48} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">{user?.isLoggedIn ? user.name : "Guest Farmer"}</h3>
                  <p className="text-text-muted text-sm">{user?.isLoggedIn ? `${user.location} • ${user.email}` : "Punjab, India • Guest Access"}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { 
                      icon: Play, 
                      label: demoMode ? 'Deactivate Demo Mode' : 'Activate Demo Mode', 
                      color: 'text-accent',
                      onClick: () => { setDemoMode(!demoMode); triggerHaptic(); }
                    },
                    { icon: ShieldCheck, label: 'Verified Expert Status', color: 'text-primary' },
                    { icon: Heart, label: 'Saved Diagnoses', color: 'text-danger' },
                    { icon: Settings, label: 'App Settings', color: 'text-info' },
                    { icon: HelpCircle, label: 'Help & Support', color: 'text-accent' },
                    { 
                      icon: LogOut, 
                      label: 'Sign Out', 
                      color: 'text-text-dim',
                      onClick: () => { logout(); window.location.reload(); }
                    }
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={item.onClick}
                      className="card p-6 flex justify-between items-center hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <item.icon size={20} className={item.color} />
                        <span className="font-bold text-sm">{item.label}</span>
                      </div>
                      <div className="w-6 h-6 bg-white/5 rounded-lg" />
                    </button>
                  ))}
                </div>
              </div>
            </MobileContainer>
          )}
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Footer Placeholder */}
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-text-dim text-sm">
            © 2026 CropCare AI. Empowering 1M+ farmers with precision agriculture.
          </p>
        </div>
      </footer>
    </main>
  );
}

'use client';

import React, { useState } from 'react';
import PostCard from './PostCard';
import { Plus, Image as ImageIcon, Send, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '@/lib/native/bridge';
import { useCommunity } from '@/hooks/useCommunity';
import { useUser } from '@/hooks/useUser';

export default function CommunityFeed() {
  const { posts, addPost } = useCommunity();
  const { user } = useUser();
  const [showCreate, setShowCreate] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        triggerHaptic();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = () => {
    if (!postContent.trim() && !image) return;
    addPost(postContent, user, image || undefined);
    setShowCreate(false);
    setPostContent('');
    setImage(null);
    triggerHaptic();
  };

  return (
    <div className="max-w-xl mx-auto -mx-6 md:mx-auto">
      {/* Quick Post Trigger - Floating Glass Pill */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-4 z-[90] max-w-xl mx-auto md:mx-0 bg-black/40 backdrop-blur-xl p-3 rounded-full border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex items-center gap-4 mb-6"
      >
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black shadow-inner border border-primary/30">
          {user?.isLoggedIn ? user.name[0] : 'G'}
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="flex-1 text-left py-2 px-4 bg-white/5 hover:bg-white/10 transition-colors rounded-full text-white/50 text-sm font-medium tracking-wide"
        >
          Share something with fellow farmers...
        </button>
        <button 
          onClick={() => setShowCreate(true)} 
          className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary hover:bg-primary/30 hover:scale-105 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] mr-1"
        >
          <ImageIcon size={20} />
        </button>
      </motion.div>

      {/* Post Feed */}
      <div className="space-y-0 md:space-y-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setShowCreate(true)}
        className="fixed bottom-32 right-6 z-[100] w-14 h-14 bg-primary text-black rounded-full shadow-2xl flex items-center justify-center md:hidden"
      >
        <Plus size={28} />
      </button>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[500]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 z-[600] bg-bg-card rounded-t-[40px] p-8 border-t border-white/10 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto" />
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-heading">New Post</h3>
                <button onClick={() => setShowCreate(false)}><X size={24} /></button>
              </div>
              
              <textarea 
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share your farming experience..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 min-h-[120px] text-white focus:outline-none focus:border-primary/50 text-sm"
              />

              {image && (
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/40">
                  <img src={image} alt="Upload preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white backdrop-blur-md"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-4 text-text-dim">
                  <input 
                    type="file"
                    accept="image/*"
                    hidden
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-xs font-bold uppercase hover:text-primary transition-colors"
                  >
                    <ImageIcon size={18} /> {image ? 'Change Photo' : 'Add Photo'}
                  </button>
                </div>
                <button 
                  onClick={handleCreatePost}
                  disabled={!postContent.trim() && !image}
                  className="btn btn-primary px-8 py-3 flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  Post <Send size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

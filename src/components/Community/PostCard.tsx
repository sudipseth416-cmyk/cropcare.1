'use client';

import React, { useState, memo } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  BadgeCheck, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '@/lib/native/bridge';

import { useCommunity, Post } from '@/hooks/useCommunity';
import { useUser } from '@/hooks/useUser';
import { Send } from 'lucide-react';

interface PostProps {
  post: Post;
}

function PostCardComponent({ post }: PostProps) {
  const { toggleLike, addComment } = useCommunity();
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    if (!liked) {
      toggleLike(post.id);
      setLiked(true);
      triggerHaptic();
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText, user?.name || 'Guest Farmer');
    setCommentText('');
    triggerHaptic();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, scale: 1.01, rotateX: 2 }}
      className="bg-black/40 backdrop-blur-xl border border-white/10 md:rounded-3xl md:mb-8 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] hover:border-white/20 transition-all duration-500 transform-gpu"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
            {post.author[0]}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-sm">{post.author}</h4>
              {post.isExpert && <BadgeCheck size={14} className="text-info" />}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-text-dim uppercase tracking-widest font-bold">
              <span className="flex items-center gap-1"><MapPin size={10} /> {post.location}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock size={10} /> {post.time}</span>
            </div>
          </div>
        </div>
        <button className="text-text-dim"><MoreHorizontal size={20} /></button>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <p className="text-sm text-text-muted leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="aspect-square w-full bg-black/20 overflow-hidden">
          <img src={post.image} alt="Post" className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${liked ? 'text-danger' : 'text-text-dim'}`}
          >
            <motion.div animate={liked ? { scale: [1, 1.4, 1] } : {}}>
              <Heart size={24} fill={liked ? "currentColor" : "none"} />
            </motion.div>
            <span className="text-xs font-bold">{post.likes}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 transition-colors ${showComments ? 'text-primary' : 'text-text-dim'}`}
          >
            <MessageCircle size={24} />
            <span className="text-xs font-bold">{post.comments.length}</span>
          </button>
          
          <button className="text-text-dim">
            <Share2 size={22} />
          </button>
        </div>
      </div>

      {/* Comment Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black/10 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {post.comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                    {comment.author[0]}
                  </div>
                  <div className="bg-white/5 rounded-2xl p-3 flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[10px] font-bold text-primary">{comment.author}</p>
                      <span className="text-[9px] text-text-dim">{comment.time}</span>
                    </div>
                    <p className="text-xs text-text-muted">{comment.content}</p>
                  </div>
                </div>
              ))}

              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <input 
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary/50"
                />
                <button 
                  type="submit"
                  disabled={!commentText.trim()}
                  className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const PostCard = memo(PostCardComponent);
export default PostCard;

'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from './useUser';

export interface Comment {
  id: string;
  author: string;
  content: string;
  time: string;
}

export interface Post {
  id: string;
  author: string;
  location: string;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  time: string;
  isExpert?: boolean;
}

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    author: 'Rajesh Kumar',
    location: 'Punjab',
    content: 'Observing some yellowing on the edges of my wheat leaves. Is this early stage Rust or just nitrogen deficiency? Any experts here?',
    image: '/image2.jpg',
    likes: 24,
    comments: [
      { id: 'c1', author: 'Dr. Amit', content: 'Looks like early nitrogen deficiency. Try a soil test.', time: '1h ago' }
    ],
    time: '2h ago',
    isExpert: false
  }
];

export function useCommunity() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cropcare_posts');
      if (saved) {
        setPosts(JSON.parse(saved));
      } else {
        setPosts(INITIAL_POSTS);
      }
    } catch (e) {
      console.error("Failed to load community posts", e);
      setPosts(INITIAL_POSTS);
      localStorage.removeItem('cropcare_posts');
    }
  }, []);

  const savePosts = (newPosts: Post[]) => {
    try {
      setPosts(newPosts);
      localStorage.setItem('cropcare_posts', JSON.stringify(newPosts));
    } catch (e) {
      console.error("Storage full, unable to save post", e);
      // Fallback: Just update state but don't persist if storage is full
      setPosts(newPosts);
    }
  };

  const addPost = useCallback((content: string, user: UserProfile | null, image?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: user?.name || 'Guest Farmer',
      location: user?.location || 'India',
      content,
      image,
      likes: 0,
      comments: [],
      time: 'Just now',
      isExpert: false
    };
    savePosts([newPost, ...posts]);
  }, [posts]);

  const addComment = useCallback((postId: string, content: string, author: string) => {
    const newPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { id: Date.now().toString(), author, content, time: 'Just now' }]
        };
      }
      return post;
    });
    savePosts(newPosts);
  }, [posts]);

  const toggleLike = useCallback((postId: string) => {
    const newPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    savePosts(newPosts);
  }, [posts]);

  return { posts, addPost, addComment, toggleLike };
}

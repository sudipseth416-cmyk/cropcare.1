export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    location: string;
    isExpert?: boolean;
  };
  content: string;
  image?: string;
  likes: number;
  commentsCount: number;
  tags: string[];
  createdAt: string;
}

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: {
      name: 'Rajesh Kumar',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop',
      location: 'Punjab, India'
    },
    content: "My wheat crop is showing yellowing at the tips. Is this a nitrogen deficiency or something else? Any advice from experts would be appreciated.",
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2034&auto=format&fit=crop',
    likes: 24,
    commentsCount: 5,
    tags: ['Wheat', 'Help', 'Fertilizer'],
    createdAt: '2 hours ago'
  },
  {
    id: '2',
    author: {
      name: 'Dr. Anita Sharma',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
      location: 'IARI, New Delhi',
      isExpert: true
    },
    content: "We're seeing an increase in humidity across North India this week. Farmers are advised to spray fungicides on tomato crops to prevent Early Blight outbreaks.",
    likes: 156,
    commentsCount: 12,
    tags: ['Advisory', 'Weather', 'Tomato'],
    createdAt: '5 hours ago'
  }
];

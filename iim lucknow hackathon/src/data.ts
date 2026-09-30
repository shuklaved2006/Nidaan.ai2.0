/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, DropEvent, FeedPost, RewardItem } from './types';

export const ALL_PRODUCTS: Product[] = [
  // Vintage items
  {
    id: 'vin-1',
    name: 'Atelier 94 Heavy-Duty Parka',
    category: 'vintage',
    price: 245,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlw0haSp4aYG1gz89j2U6LOrI9xI77or_pKgFySnV_gPcg0KoNxNFuyX7QKKIu8ZlUezHILSpTdP6zmcMAMeeOo_Rlh_fOzD2U79X13PCnzW9jsRnZJUGmUTivXG09FTJ2_c4TOpqQyjmMxqa5DKSVQ_bKJitBwLjVKzixGnvccrg913-OiU9DJtqn4CrFVmJ9JbygVLgRrNltNtLWIVAUBk-K8ViYhT8qEcE9epoYy14aaA8zzgOO7IznbgceVXJFrE85NvGwn_g',
    badge: 'CURATED GEM',
    sizes: ['S', 'M', 'L'],
    description: 'Ultra-rare archival 90s oversized industrial jacket featuring tactical multi-pocket design, heavy cotton canvas structure, and custom metal closures.'
  },
  {
    id: 'vin-2',
    name: 'Archival 1996 Leather Flight Jacket',
    category: 'vintage',
    price: 310,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
    badge: '1 OF 1',
    sizes: ['M', 'L'],
    description: 'Perfect distressed flight bomber leather with customized vintage back graphic and double-layered warm lining.'
  },
  {
    id: 'vin-3',
    name: 'Retro Acid-Wash Overdyed Jeans',
    category: 'vintage',
    price: 135,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
    badge: '90S GRAIL',
    sizes: ['30', '32', '34'],
    description: 'High-waisted, loose vintage cargo jeans featuring custom distressed knee cuts and washed-out lilac indigo dye.'
  },

  // Streetwear Steals (Discounts)
  {
    id: 'steal-1',
    name: 'Hyperdrive Core Utility Vest',
    category: 'outerwear',
    price: 45,
    originalPrice: 112,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600&auto=format&fit=crop',
    badge: '60% OFF',
    sizes: ['M', 'L', 'XL'],
    description: 'Tactical chest rig/utility vest with quick-release buckles and waterproof nylon mesh paneling.'
  },
  {
    id: 'steal-2',
    name: 'Reflective Cybernetic Stripe Trackpants',
    category: 'denim',
    price: 29,
    originalPrice: 75,
    image: 'https://images.unsplash.com/photo-1517130038641-a774d04afb3c?q=80&w=600&auto=format&fit=crop',
    badge: '61% OFF',
    sizes: ['S', 'M', 'L'],
    description: 'High-visibility reflective techwear sweatpants featuring quick-dry mesh lining and toggle ankle cuffs.'
  },
  {
    id: 'steal-3',
    name: 'Dystopian Distressed Graphic Tee',
    category: 'tees',
    price: 18,
    originalPrice: 45,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop',
    badge: '60% OFF',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Super heavy 260GSM washed-out graphic tee with subtle distressing along the neck and hem lines.'
  },

  // New Drops (Sneakers & Outerwear)
  {
    id: 'drop-1',
    name: 'Apex Runner V2 "Solar Flare"',
    category: 'sneakers',
    price: 180,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    badge: 'COMING SOON',
    sizes: ['8', '9', '10', '11', '12'],
    description: 'State-of-the-art running silhouette combining electric yellow reactive knit mesh with dual-density foam midsoles.'
  },
  {
    id: 'drop-2',
    name: 'Retro Pastel High-Tops',
    category: 'sneakers',
    price: 160,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
    badge: 'LIMITED RELEASE',
    sizes: ['7', '8', '9', '10', '11'],
    description: 'Lollipop pastel panels wrapped around premium tumbled leather, complete with vintage off-white soles.'
  },

  // Eco Core
  {
    id: 'eco-1',
    name: 'Organic Recycled Cotton Hoodie',
    category: 'eco',
    price: 70,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
    badge: 'PLANET SAVER',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Woven entirely from 100% pre-consumer cotton scrap. Absolutely no fresh water or virgin materials consumed.',
    ecoMetrics: {
      waterSaved: 2700,
      carbonSaved: 4.8
    }
  },
  {
    id: 'eco-2',
    name: 'Terra Sole Bio-Degradable Trainers',
    category: 'eco',
    price: 110,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop',
    badge: 'RE-SOLED',
    sizes: ['8', '9', '10', '11'],
    description: 'Durable, weather-resistant trainers utilizing sugarcane-derived eco foam outsoles and certified vegan ocean mesh.',
    ecoMetrics: {
      waterSaved: 1950,
      carbonSaved: 7.2
    }
  },

  // Y2K Essentials
  {
    id: 'y2k-1',
    name: 'Cyber Liquid Chrome Jacket',
    category: 'y2k',
    price: 140,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFahe5P84JZp2sRbEx-rTA9Bln92JMV55taYnV7oiSWDh3X09Ch0qUYVxrMDWhA47Fm1SU4JS466V-6bvtM3pnCuX5Dc31SXTXFgMV-mWYwxFwH49lapqi3NdC3f0Wa664Msbed-q4-gpQ9P9ZkO63DbjM4ZrAMwHmuID2Sm3kX9Y89-wXUhP2hqLEpV0hIJrUPaZEYEKNLoCzhudiLXWmzu8s1k85e4bFhdyK_mmEASLlOB1z4P7kjp-aVhFk1PiiJ0UoKa9f_Kg',
    badge: 'Y2K GRAIL',
    sizes: ['M', 'L', 'XL'],
    description: 'High-shine liquid metal fabric with cybernetic zipper pulls, custom hood, and a cropped tactical length.'
  },
  {
    id: 'y2k-2',
    name: 'Translucent Cyber Shutter Glasses',
    category: 'y2k',
    price: 24,
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop',
    badge: 'HOT TECH',
    sizes: ['OS'],
    description: 'Iridescent framed futuristic sunshields providing UV400 coverage wrapped in translucent Y2K plastic styling.'
  },
  {
    id: 'y2k-3',
    name: 'Cyber Rave Giga-Platform Boots',
    category: 'y2k',
    price: 195,
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop',
    badge: 'Rhapsody',
    sizes: ['6', '7', '8', '9', '10'],
    description: 'Chunky 4-inch rubberized platform soles with glowing holographic accents and durable cordura upper wraps.'
  }
];

export const MOCK_DROPS: DropEvent[] = [
  {
    id: 'drop-event-1',
    product: ALL_PRODUCTS.find(p => p.id === 'drop-1')!,
    dropTime: 'Today at 6:00 PM',
    notifyTime: 4,
    notified: false
  },
  {
    id: 'drop-event-2',
    product: ALL_PRODUCTS.find(p => p.id === 'drop-2')!,
    dropTime: 'Tomorrow at 10:00 AM',
    notifyTime: 20,
    notified: false
  }
];

export const MOCK_REWARDS: RewardItem[] = [
  {
    id: 'rew-1',
    title: '$10 Store Credit',
    pointsCost: 500,
    discountCode: 'LIME10',
    description: 'Redeem $10 off any streetwear or sneaker drop. Multi-use coupon!',
    unlocked: false
  },
  {
    id: 'rew-2',
    title: '20% Off Your Next Cart',
    pointsCost: 1000,
    discountCode: 'POINTS20',
    description: 'Unlock a massive 20% flat discount on premium, vintage, or Y2K collections.',
    unlocked: false
  },
  {
    id: 'rew-3',
    title: 'Free Express Shipping',
    pointsCost: 350,
    discountCode: 'FREESHIP',
    description: 'Eliminate all shipping costs for a lightning-fast premium delivery.',
    unlocked: false
  },
  {
    id: 'rew-4',
    title: 'Golden Sneaker Priority Pass',
    pointsCost: 2000,
    discountCode: 'PRIORITY_ACCESS',
    description: 'Guarantees access to reserve highly exclusive hyped footwear releases instantly.',
    unlocked: false
  }
];

export const MOCK_FEED_POSTS: FeedPost[] = [
  {
    id: 'post-1',
    username: 'kicks_enthusiast',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    likes: 342,
    hasLiked: false,
    caption: 'Copped the Apex V2 early samples! Styling them with tactical cargos and distressed black tees. Rate this fit! 🔥👟 #apex #y2k #streetwear',
    taggedProducts: [ALL_PRODUCTS.find(p => p.id === 'drop-1')!, ALL_PRODUCTS.find(p => p.id === 'steal-3')!],
    tags: ['Sneakers', 'Tees']
  },
  {
    id: 'post-2',
    username: 'cyber_vibe_99',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
    likes: 512,
    hasLiked: true,
    caption: 'Full matrix energy on set today with the Liquid Chrome jacket. Chrome fabrics look unreal under neon industrial setups. ✨💫 #y2kessentials #cyberaesthetic',
    taggedProducts: [ALL_PRODUCTS.find(p => p.id === 'y2k-1')!, ALL_PRODUCTS.find(p => p.id === 'y2k-2')!],
    tags: ['Y2K', 'Outerwear']
  },
  {
    id: 'post-3',
    username: 'vintage_collector',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop',
    likes: 218,
    hasLiked: false,
    caption: 'Vintage hunting in Berlin got me this incredible archival heavy-duty fit. Sustainable and curated is the only way forward. 🌍💜 #vintagearchive #curatedgems #ecostreet',
    taggedProducts: [ALL_PRODUCTS.find(p => p.id === 'vin-1')!, ALL_PRODUCTS.find(p => p.id === 'eco-1')!],
    tags: ['Vintage', 'Eco']
  }
];

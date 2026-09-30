/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: 'sneakers' | 'denim' | 'tees' | 'outerwear' | 'y2k' | 'vintage' | 'eco';
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  sizes: string[];
  description: string;
  ecoMetrics?: {
    waterSaved: number; // in liters
    carbonSaved: number; // in kg CO2
  };
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface DropEvent {
  id: string;
  product: Product;
  dropTime: string; // ISO string or relative description
  notifyTime: number; // timestamp or remaining hours
  notified: boolean;
}

export interface FeedPost {
  id: string;
  username: string;
  avatar: string;
  image: string;
  likes: number;
  hasLiked: boolean;
  caption: string;
  taggedProducts: Product[];
  tags: string[];
}

export interface RewardItem {
  id: string;
  title: string;
  pointsCost: number;
  discountCode: string;
  description: string;
  unlocked: boolean;
}

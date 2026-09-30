/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Search, Compass, ShoppingCart, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'shop' | 'feed' | 'bag' | 'me';
  onTabChange: (tab: 'home' | 'shop' | 'feed' | 'bag' | 'me') => void;
  cartCount: number;
}

export default function BottomNav({ activeTab, onTabChange, cartCount }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 pb-safe bg-[#fcf9f8]/90 backdrop-blur-md border-t-2 border-[#1c1b1b] shadow-lg">
      <div className="flex justify-around items-center w-full px-2 py-3">
        {/* Home */}
        <button
          id="nav-home"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-150 rounded-xl cursor-pointer ${
            activeTab === 'home'
              ? 'bg-[#c1f100] text-[#1c1b1b] border-2 border-[#1c1b1b] shadow-[2px_2px_0px_#1c1b1b]'
              : 'text-[#434656] hover:text-[#0040e0] hover:scale-105'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'fill-current' : ''}`} />
          <span className="font-label text-[10px] sm:text-xs uppercase mt-0.5 tracking-tight">Home</span>
        </button>

        {/* Shop (Discover) */}
        <button
          id="nav-shop"
          onClick={() => onTabChange('shop')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-150 rounded-xl cursor-pointer ${
            activeTab === 'shop'
              ? 'bg-[#c1f100] text-[#1c1b1b] border-2 border-[#1c1b1b] shadow-[2px_2px_0px_#1c1b1b]'
              : 'text-[#434656] hover:text-[#0040e0] hover:scale-105'
          }`}
        >
          <Search className={`w-5 h-5 ${activeTab === 'shop' ? 'fill-current' : ''}`} />
          <span className="font-label text-[10px] sm:text-xs uppercase mt-0.5 tracking-tight">Shop</span>
        </button>

        {/* Feed */}
        <button
          id="nav-feed"
          onClick={() => onTabChange('feed')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-150 rounded-xl cursor-pointer ${
            activeTab === 'feed'
              ? 'bg-[#c1f100] text-[#1c1b1b] border-2 border-[#1c1b1b] shadow-[2px_2px_0px_#1c1b1b]'
              : 'text-[#434656] hover:text-[#0040e0] hover:scale-105'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'feed' ? 'fill-current' : ''}`} />
          <span className="font-label text-[10px] sm:text-xs uppercase mt-0.5 tracking-tight">Feed</span>
        </button>

        {/* Bag */}
        <button
          id="nav-bag"
          onClick={() => onTabChange('bag')}
          className={`relative flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-150 rounded-xl cursor-pointer ${
            activeTab === 'bag'
              ? 'bg-[#c1f100] text-[#1c1b1b] border-2 border-[#1c1b1b] shadow-[2px_2px_0px_#1c1b1b]'
              : 'text-[#434656] hover:text-[#0040e0] hover:scale-105'
          }`}
        >
          <ShoppingCart className={`w-5 h-5 ${activeTab === 'bag' ? 'fill-current' : ''}`} />
          <span className="font-label text-[10px] sm:text-xs uppercase mt-0.5 tracking-tight">Bag</span>
          {cartCount > 0 && activeTab !== 'bag' && (
            <span className="absolute -top-1 -right-1 bg-[#0040e0] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* Me */}
        <button
          id="nav-me"
          onClick={() => onTabChange('me')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-150 rounded-xl cursor-pointer ${
            activeTab === 'me'
              ? 'bg-[#c1f100] text-[#1c1b1b] border-2 border-[#1c1b1b] shadow-[2px_2px_0px_#1c1b1b]'
              : 'text-[#434656] hover:text-[#0040e0] hover:scale-105'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'me' ? 'fill-current' : ''}`} />
          <span className="font-label text-[10px] sm:text-xs uppercase mt-0.5 tracking-tight">Me</span>
        </button>
      </div>
    </nav>
  );
}

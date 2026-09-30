/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Sparkles,
  Award,
  BookOpen,
  Info
} from 'lucide-react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeTab from './components/HomeTab';
import ShopTab from './components/ShopTab';
import FeedTab from './components/FeedTab';
import BagTab from './components/BagTab';
import MeTab from './components/MeTab';

import { Product, CartItem, DropEvent, FeedPost, RewardItem } from './types';
import { ALL_PRODUCTS, MOCK_DROPS, MOCK_FEED_POSTS, MOCK_REWARDS } from './data';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'feed' | 'bag' | 'me'>('shop');

  // Shared Global States (Persisted in localStorage for hot-reloads)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const cached = localStorage.getItem('drops_cart');
    return cached ? JSON.parse(cached) : [];
  });

  const [userPoints, setUserPoints] = useState<number>(() => {
    const cached = localStorage.getItem('drops_points');
    return cached ? Number(cached) : 2450; // starts at 2,450 matching design mock exactly
  });

  const [dropEvents, setDropEvents] = useState<DropEvent[]>(() => {
    const cached = localStorage.getItem('drops_events');
    return cached ? JSON.parse(cached) : MOCK_DROPS;
  });

  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    const cached = localStorage.getItem('drops_rewards');
    return cached ? JSON.parse(cached) : MOCK_REWARDS;
  });

  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(() => {
    const cached = localStorage.getItem('drops_feed');
    return cached ? JSON.parse(cached) : MOCK_FEED_POSTS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('drops_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('drops_points', String(userPoints));
  }, [userPoints]);

  useEffect(() => {
    localStorage.setItem('drops_events', JSON.stringify(dropEvents));
  }, [dropEvents]);

  useEffect(() => {
    localStorage.setItem('drops_rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('drops_feed', JSON.stringify(feedPosts));
  }, [feedPosts]);

  // Modals & UI helpers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeProductSize, setActiveProductSize] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: string) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === size
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [...prev, { product, selectedSize: size, quantity: 1 }];
      }
    });
    triggerToast(`Flashed ${product.name} (Size ${size}) into Bag!`);
  };

  const handleUpdateCartQuantity = (productId: string, size: string, change: number) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        item => item.product.id === productId && item.selectedSize === size
      );

      if (existingIdx === -1) return prev;

      const updated = [...prev];
      const newQuantity = updated[existingIdx].quantity + change;

      if (newQuantity <= 0) {
        updated.splice(existingIdx, 1);
      } else {
        updated[existingIdx].quantity = newQuantity;
      }
      return updated;
    });
  };

  const handleRemoveFromCart = (productId: string, size: string) => {
    setCartItems(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedSize === size)
    ));
    triggerToast('Removed item from shopping bag.');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveProductSize(product.sizes[0] || '');
  };

  const handleAddProductFromModal = () => {
    if (!selectedProduct) return;
    if (!activeProductSize) {
      alert('Please select a size first!');
      return;
    }
    handleAddToCart(selectedProduct, activeProductSize);
    setSelectedProduct(null);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-sans overflow-x-hidden selection:bg-[#c1f100] pb-24">
      {/* GLOBAL TOAST BANNER */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1c1b1b] text-[#c1f100] font-label text-xs font-black px-6 py-3 border-2 border-[#c1f100] shadow-[4px_4px_0px_#1c1b1b] rounded-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 stroke-[3]" /> {toastMessage}
        </div>
      )}

      {/* HEADER SECTION */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setActiveTab('bag')}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* MAIN CONTAINER CONTENT */}
      <main className="max-w-md sm:max-w-2xl mx-auto py-2">
        {activeTab === 'home' && (
          <HomeTab
            allProducts={ALL_PRODUCTS}
            onSelectProduct={handleSelectProduct}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'shop' && (
          <ShopTab
            allProducts={ALL_PRODUCTS}
            dropEvents={dropEvents}
            rewards={rewards}
            userPoints={userPoints}
            onUpdatePoints={setUserPoints}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            onSetDropEvents={setDropEvents}
            onSetRewards={setRewards}
          />
        )}

        {activeTab === 'feed' && (
          <FeedTab
            feedPosts={feedPosts}
            allProducts={ALL_PRODUCTS}
            userPoints={userPoints}
            onUpdatePoints={setUserPoints}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            onSetFeedPosts={setFeedPosts}
          />
        )}

        {activeTab === 'bag' && (
          <BagTab
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'me' && (
          <MeTab
            userPoints={userPoints}
            allProducts={ALL_PRODUCTS}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </main>

      {/* BOTTOM NAV BAR */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartCount={totalCartCount}
      />

      {/* --- PRODUCT DETAIL MODAL DRAWER --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#fcf9f8] w-full max-w-md rounded-t-3xl border-2 border-[#1c1b1b] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b-2 border-[#1c1b1b] flex justify-between items-center bg-[#e1e1f5]">
              <span className="font-label text-xs uppercase font-extrabold text-[#0040e0]">
                VAULT SPECIFICATION
              </span>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-full border-2 border-[#1c1b1b] bg-white text-[#1c1b1b] hover:bg-[#c1f100] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar flex-1 pb-12">
              {/* Image Frame */}
              <div className="relative aspect-square rounded-xl border-2 border-[#1c1b1b] overflow-hidden bg-[#e5e2e1] shadow-[3px_3px_0px_#1c1b1b]">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                {selectedProduct.badge && (
                  <span className="absolute top-3 left-3 bg-[#1c1b1b] text-[#c1f100] text-[10px] font-bold font-label px-2.5 py-0.5 border border-[#c1f100] rounded">
                    {selectedProduct.badge}
                  </span>
                )}
              </div>

              {/* Title Pricing block */}
              <div className="space-y-1">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-display text-xl uppercase font-black text-[#1c1b1b] leading-tight">
                    {selectedProduct.name}
                  </h3>
                  <div className="text-right">
                    <span className="font-label text-lg font-black text-[#0040e0]">
                      ${selectedProduct.price}
                    </span>
                    {selectedProduct.originalPrice && (
                      <p className="font-label text-xs text-red-500 line-through">
                        ${selectedProduct.originalPrice}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-[10px] bg-[#e1e1f5] text-[#0040e0] font-label font-bold px-2 py-0.5 rounded border border-[#0040e0] uppercase inline-block">
                  {selectedProduct.category}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="font-label text-xs uppercase font-bold text-[#747688]">DESCRIPTIVE OVERVIEW:</h4>
                <p className="font-sans text-xs text-[#434656] leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Eco metrics extra badge */}
              {selectedProduct.ecoMetrics && (
                <div className="bg-[#0040e0] text-white p-3.5 rounded-xl border-2 border-[#1c1b1b] space-y-1 shadow-[2px_2px_0px_#1c1b1b]">
                  <h4 className="font-display text-xs font-black uppercase text-[#c1f100] tracking-tight">
                    ♻️ CONSCIOUS IMPACT SAVED DATA
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs font-label">
                    <div className="bg-white/10 p-1.5 rounded">
                      <strong>{selectedProduct.ecoMetrics.waterSaved} Liters</strong>
                      <span className="text-[9px] block text-[#e1e1f5]">Fresh H2O</span>
                    </div>
                    <div className="bg-white/10 p-1.5 rounded">
                      <strong>{selectedProduct.ecoMetrics.carbonSaved} kg</strong>
                      <span className="text-[9px] block text-[#e1e1f5]">CO2 Reduced</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Size Selector */}
              <div className="space-y-2">
                <h4 className="font-label text-xs uppercase font-bold text-[#747688]">
                  SELECT SIZE VAULT:
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedProduct.sizes.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setActiveProductSize(sz)}
                      className={`min-w-10 h-10 px-3 border-2 border-[#1c1b1b] rounded-lg font-label text-xs font-bold transition-all cursor-pointer ${
                        activeProductSize === sz
                          ? 'bg-[#c1f100] text-[#1c1b1b] shadow-[2px_2px_0px_#1c1b1b]'
                          : 'bg-white text-[#1c1b1b] hover:bg-[#e1e1f5]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buy CTA */}
              <button
                onClick={handleAddProductFromModal}
                className="w-full py-3 bg-[#1c1b1b] text-[#c1f100] border-2 border-[#1c1b1b] rounded-xl font-label font-black text-xs uppercase shadow-[4px_4px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-[#c1f100] hover:text-[#1c1b1b] transition-all cursor-pointer"
              >
                ADD TO SECURE BAG · ${selectedProduct.price}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- LEFT NAVIGATION DRAWER OVERLAY --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-start bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1c1b1b] text-white w-72 h-full border-r-2 border-[#1c1b1b] flex flex-col justify-between p-6 animate-slide-right">
            <div className="space-y-8">
              {/* Menu Header */}
              <div className="flex justify-between items-center">
                <h2 className="font-display text-xl uppercase italic font-black text-[#c1f100] tracking-tighter">
                  DROPS NAVIGATION
                </h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-full border border-white/20 text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav lists */}
              <ul className="space-y-4 font-display text-md uppercase font-black italic tracking-wide">
                <li
                  onClick={() => {
                    setActiveTab('home');
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-[#c1f100] cursor-pointer transition-colors flex items-center gap-2"
                >
                  ⚡ EDITORIAL HIGHLIGHTS
                </li>
                <li
                  onClick={() => {
                    setActiveTab('shop');
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-[#c1f100] cursor-pointer transition-colors flex items-center gap-2"
                >
                  📦 SHOP DISCOVER VAULT
                </li>
                <li
                  onClick={() => {
                    setActiveTab('feed');
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-[#c1f100] cursor-pointer transition-colors flex items-center gap-2"
                >
                  👥 COMMUNITY LOOK FEED
                </li>
                <li
                  onClick={() => {
                    setActiveTab('me');
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-[#c1f100] cursor-pointer transition-colors flex items-center gap-2"
                >
                  📟 AI STYLE GENERATOR
                </li>
              </ul>
            </div>

            {/* Menu Footer */}
            <div className="space-y-4 border-t border-white/10 pt-4 font-sans text-[10px] text-gray-400">
              <div className="space-y-1">
                <p className="font-bold text-gray-200">DROPS DISPATCH NETWORKS</p>
                <p>Verifying sustainable logistics through carbon recovery freight loops.</p>
              </div>
              <p>© 2026 DROPS EST. ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

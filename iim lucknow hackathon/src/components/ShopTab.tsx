/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ArrowRight,
  ArrowLeft,
  Bolt,
  Check,
  ChevronRight,
  Copy,
  Flame,
  Gift,
  Heart,
  Leaf,
  Sliders,
  Sparkles,
  TrendingUp,
  Clock,
  Volume2,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product, DropEvent, RewardItem } from '../types';

interface ShopTabProps {
  allProducts: Product[];
  dropEvents: DropEvent[];
  rewards: RewardItem[];
  userPoints: number;
  onUpdatePoints: (newPoints: number) => void;
  onAddToCart: (product: Product, size: string) => void;
  onSelectProduct: (product: Product) => void;
  onSetDropEvents: (events: DropEvent[]) => void;
  onSetRewards: (rewards: RewardItem[]) => void;
}

export default function ShopTab({
  allProducts,
  dropEvents,
  rewards,
  userPoints,
  onUpdatePoints,
  onAddToCart,
  onSelectProduct,
  onSetDropEvents,
  onSetRewards
}: ShopTabProps) {
  // Navigation & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL TRENDS');

  // Active Overlay drawers
  const [activeDrawer, setActiveDrawer] = useState<'vintage' | 'steals' | 'drops' | 'eco' | 'loyalty' | 'y2k' | null>(null);

  // Wheel mini-game state
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [wheelTicks, setWheelTicks] = useState(0);

  // Product detail view state (nested inside drawer)
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Flash Sale Timer simulation
  const [timerString, setTimerString] = useState('02:45:12');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = 23 - now.getHours();
      const minutes = 59 - now.getMinutes();
      const seconds = 59 - now.getSeconds();
      const format = (num: number) => String(num).padStart(2, '0');
      setTimerString(`${format(hours)}:${format(minutes)}:${format(seconds)}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter items matching filter chips
  const categoryFilters = ['ALL TRENDS', 'SNEAKERS', 'DENIM', 'GRAPHIC TEES', 'OUTERWEAR'];

  // Match chip categories with product database fields
  const getProductCategoryKey = (filter: string) => {
    switch (filter) {
      case 'SNEAKERS': return 'sneakers';
      case 'DENIM': return 'denim';
      case 'GRAPHIC TEES': return 'tees';
      case 'OUTERWEAR': return 'outerwear';
      default: return null;
    }
  };

  const getFilteredProducts = () => {
    const categoryKey = getProductCategoryKey(selectedFilter);
    let items = allProducts;
    if (categoryKey) {
      items = allProducts.filter(p => p.category === categoryKey);
    }
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
      );
    }
    return items;
  };

  const filteredItems = getFilteredProducts();

  // Loyalty coupon code copier helper
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Spinning the wheel logic
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    const outcomes = [
      { text: '+50 LOYALTY XP', points: 50 },
      { text: '+100 LOYALTY XP', points: 100 },
      { text: '+250 MEGA XP', points: 250 },
      { text: 'FREE SHIPPING CODE (FREESHIP)', points: 0, code: 'FREESHIP' },
      { text: '+20 XP MINOR BOOSTER', points: 20 },
      { text: 'JACKPOT: 500 XP!', points: 500 }
    ];

    let ticks = 0;
    const tickInterval = setInterval(() => {
      setWheelTicks(prev => (prev + 1) % outcomes.length);
      ticks++;
      if (ticks > 20) {
        clearInterval(tickInterval);
        const finalSelection = outcomes[Math.floor(Math.random() * outcomes.length)];
        setIsSpinning(false);
        setSpinResult(finalSelection.text);

        if (finalSelection.points > 0) {
          onUpdatePoints(userPoints + finalSelection.points);
        } else if (finalSelection.code) {
          // Unlock specified reward for free
          const updatedRewards = rewards.map(r => {
            if (r.discountCode === finalSelection.code) {
              return { ...r, unlocked: true };
            }
            return r;
          });
          onSetRewards(updatedRewards);
        }
      }
    }, 120);
  };

  // Redeem points code logic
  const handleRedeemReward = (reward: RewardItem) => {
    if (userPoints < reward.pointsCost) {
      alert('Insufficient points! Browse outfits or upvote in Feed to earn points.');
      return;
    }
    onUpdatePoints(userPoints - reward.pointsCost);
    const updated = rewards.map(r => (r.id === reward.id ? { ...r, unlocked: true } : r));
    onSetRewards(updated);
  };

  // Toggle release notify me status
  const handleToggleNotify = (id: string) => {
    const updated = dropEvents.map(e => (e.id === id ? { ...e, notified: !e.notified } : e));
    onSetDropEvents(updated);
    const event = updated.find(e => e.id === id);
    if (event?.notified) {
      alert(`🔔 Reminder active for ${event.product.name}! We will ping you instantly.`);
    }
  };

  // Add Item inside drawer
  const handleAddProductFromDrawer = (product: Product) => {
    if (!selectedSize) {
      alert('Please select a size first!');
      return;
    }
    onAddToCart(product, selectedSize);
    setSuccessMsg(`Added ${product.name} (Size ${selectedSize}) to Bag!`);
    setSelectedSize('');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Eco Planet Calculator state
  const [selectedEcoItems, setSelectedEcoItems] = useState<string[]>(['eco-1']);
  const toggleEcoCalcItem = (id: string) => {
    if (selectedEcoItems.includes(id)) {
      setSelectedEcoItems(selectedEcoItems.filter(i => i !== id));
    } else {
      setSelectedEcoItems([...selectedEcoItems, id]);
    }
  };

  const totalEcoWaterSaved = selectedEcoItems.reduce((acc, id) => {
    const item = allProducts.find(p => p.id === id);
    return acc + (item?.ecoMetrics?.waterSaved || 0);
  }, 0);

  const totalEcoCarbonSaved = selectedEcoItems.reduce((acc, id) => {
    const item = allProducts.find(p => p.id === id);
    return acc + (item?.ecoMetrics?.carbonSaved || 0);
  }, 0);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Search Input and Filter */}
      <section className="px-5 pt-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#0040e0] via-[#c1f100] to-[#e1e1f5] rounded-2xl blur opacity-25 group-hover:opacity-45 transition duration-500"></div>
          <div className="relative flex items-center bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-2xl px-4 py-3 shadow-[4px_4px_0px_#1c1b1b]">
            <span className="text-[#747688] mr-3">🔍</span>
            <input
              className="bg-transparent border-none focus:outline-none w-full font-label text-sm text-[#1c1b1b] placeholder:text-[#747688]/60"
              placeholder="Search archive, brands, styles..."
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Sliders className="w-5 h-5 text-[#0040e0]" />
          </div>
        </div>
      </section>

      {/* Horizontal Scrollable Filter Chips */}
      <section className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-none snap-x">
        {categoryFilters.map(filter => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`whitespace-nowrap px-6 py-2 rounded-full border-2 border-[#1c1b1b] font-label text-xs uppercase cursor-pointer transition-all duration-150 snap-start ${
              selectedFilter === filter
                ? 'bg-[#c1f100] text-[#1c1b1b] shadow-[3px_3px_0px_#1c1b1b]'
                : 'bg-[#fcf9f8] text-[#1c1b1b] hover:bg-[#e1e1f5]'
            }`}
          >
            {filter}
          </button>
        ))}
      </section>

      {/* Show matched items directly if filtered/searched or show bento boxes */}
      {selectedFilter !== 'ALL TRENDS' || searchQuery.trim() !== '' ? (
        <section className="px-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-lg uppercase tracking-tight italic font-black text-[#1c1b1b]">
              Results ({filteredItems.length})
            </h3>
            <button
              onClick={() => {
                setSelectedFilter('ALL TRENDS');
                setSearchQuery('');
              }}
              className="font-label text-xs font-bold text-[#0040e0] hover:underline uppercase"
            >
              Clear Filters
            </button>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-[#e1e1f5] border-2 border-[#1c1b1b] rounded-xl p-8 text-center space-y-2">
              <span className="text-3xl">🧩</span>
              <h4 className="font-display text-md font-bold uppercase text-[#1c1b1b]">No matches in vault</h4>
              <p className="font-sans text-xs text-[#434656]">
                Try searching other terms like "Apex", "Vintage", "Hoodie", "Jacket", or "Y2K".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredItems.map(product => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-[#fcf9f8] rounded-xl border-2 border-[#1c1b1b] shadow-[4px_4px_0px_#1c1b1b] overflow-hidden flex flex-col group cursor-pointer"
                >
                  <div className="relative aspect-square bg-[#e5e2e1] overflow-hidden border-b-2 border-[#1c1b1b]">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={product.image}
                      alt={product.name}
                    />
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-[#1c1b1b] text-[#c1f100] text-[9px] font-bold font-label px-2 py-0.5 border border-[#c1f100] rounded">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-label text-[10px] text-[#747688] uppercase">{product.category}</h4>
                      <h3 className="font-display text-xs font-bold text-[#1c1b1b] uppercase line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-label text-xs font-bold text-[#1c1b1b]">${product.price}</span>
                      <span className="text-[9px] bg-[#c1f100] text-[#1c1b1b] border border-[#1c1b1b] px-2 py-0.5 rounded font-label font-bold">
                        VIEW
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Bento Grid Body as shown in design template */
        <section className="px-5 grid grid-cols-4 gap-4">
          {/* Featured: The Vintage Archive */}
          <div
            onClick={() => setActiveDrawer('vintage')}
            className="col-span-4 md:col-span-2 aspect-[4/5] md:aspect-square relative overflow-hidden rounded-2xl border-2 border-[#1c1b1b] shadow-[4px_4px_0px_#1c1b1b] bg-[#e1e1f5] flex flex-col group cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150"
          >
            <div className="absolute inset-0 z-0">
              <img
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlw0haSp4aYG1gz89j2U6LOrI9xI77or_pKgFySnV_gPcg0KoNxNFuyX7QKKIu8ZlUezHILSpTdP6zmcMAMeeOo_Rlh_fOzD2U79X13PCnzW9jsRnZJUGmUTivXG09FTJ2_c4TOpqQyjmMxqa5DKSVQ_bKJitBwLjVKzixGnvccrg913-OiU9DJtqn4CrFVmJ9JbygVLgRrNltNtLWIVAUBk-K8ViYhT8qEcE9epoYy14aaA8zzgOO7IznbgceVXJFrE85NvGwn_g"
                alt="Vintage Archive"
              />
            </div>
            <div className="relative z-10 p-6 mt-auto bg-gradient-to-t from-[#1c1b1b]/95 via-[#1c1b1b]/35 to-transparent">
              <h2 className="font-display text-2xl text-[#fcf9f8] leading-none uppercase italic font-extrabold">
                THE VINTAGE<br />ARCHIVE
              </h2>
              <p className="font-label text-xs text-[#c1f100] mt-2 flex items-center gap-1 font-bold">
                SHOP CURATED GEMS <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </div>

          {/* Category: Streetwear Steals */}
          <div
            onClick={() => setActiveDrawer('steals')}
            className="col-span-4 md:col-span-2 aspect-[4/3] md:aspect-auto relative overflow-hidden rounded-2xl border-2 border-[#1c1b1b] shadow-[4px_4px_0px_#1c1b1b] bg-[#c1f100] flex flex-col group cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150"
          >
            <div className="p-6 h-full flex flex-col justify-between">
              <div>
                <span className="bg-[#1c1b1b] text-[#c1f100] font-label text-[10px] font-bold px-3 py-1 rounded border-2 border-[#1c1b1b] mb-4 inline-block">
                  HOT NOW
                </span>
                <h2 className="font-display text-2xl text-[#1c1b1b] leading-none uppercase font-extrabold">
                  STREETWEAR<br />STEALS
                </h2>
              </div>
              <div className="flex items-end justify-between">
                <p className="font-label text-xs text-[#1c1b1b] font-bold">UP TO 60% OFF</p>
                <div className="w-10 h-10 bg-[#1c1b1b] text-[#fcf9f8] flex items-center justify-center rounded-lg border-2 border-[#1c1b1b] shadow-[2px_2px_0px_#ffffff]">
                  <TrendingUp className="w-5 h-5 text-[#c1f100]" />
                </div>
              </div>
            </div>
          </div>

          {/* Category: New Drops (Small) */}
          <div
            onClick={() => setActiveDrawer('drops')}
            className="col-span-2 md:col-span-1 aspect-square relative overflow-hidden rounded-2xl border-2 border-[#1c1b1b] shadow-[4px_4px_0px_#1c1b1b] bg-[#fcf9f8] group cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150"
          >
            <div className="p-4 flex flex-col h-full justify-between">
              <Bolt className="w-10 h-10 text-[#0040e0] fill-current" />
              <div>
                <h3 className="font-display text-md text-[#1c1b1b] leading-tight uppercase font-extrabold">
                  NEW<br />DROPS
                </h3>
                <p className="font-label text-[10px] text-[#747688] mt-1 font-bold">WEEK 24 UPDATE</p>
              </div>
            </div>
          </div>

          {/* Category: Eco-Conscious (Small) */}
          <div
            onClick={() => setActiveDrawer('eco')}
            className="col-span-2 md:col-span-1 aspect-square relative overflow-hidden rounded-2xl border-2 border-[#1c1b1b] shadow-[4px_4px_0px_#1c1b1b] bg-[#0040e0] text-[#fcf9f8] group cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150"
          >
            <div className="p-4 flex flex-col h-full justify-between">
              <Leaf className="w-10 h-10 text-[#c1f100] fill-current" />
              <div>
                <h3 className="font-display text-md leading-tight uppercase font-extrabold text-[#fcf9f8]">
                  ECO<br />CORE
                </h3>
                <p className="font-label text-[10px] text-[#e1e1f5] mt-1 font-bold">PLANET FRIENDLY</p>
              </div>
            </div>
          </div>

          {/* Wide Banner: Loyalty Club */}
          <div
            onClick={() => setActiveDrawer('loyalty')}
            className="col-span-4 h-32 relative overflow-hidden rounded-2xl border-2 border-[#1c1b1b] shadow-[4px_4px_0px_#1c1b1b] bg-[#e5e2e1] group cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150"
          >
            <div className="absolute inset-0 flex items-center select-none overflow-hidden opacity-30">
              <div className="flex gap-8 items-center font-display text-sm text-[#747688]/40 uppercase tracking-widest font-black animate-marquee whitespace-nowrap">
                <span>DROPS LOYALTY CLUB ⭐ JOIN THE ELITE ⭐ EXCLUSIVE BONUSES ⭐</span>
                <span>DROPS LOYALTY CLUB ⭐ JOIN THE ELITE ⭐ EXCLUSIVE BONUSES ⭐</span>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-between px-6 z-10">
              <div className="flex flex-col">
                <h2 className="font-display text-xl text-[#1c1b1b] uppercase font-black tracking-tight">
                  LOYALTY CLUB
                </h2>
                <p className="font-label text-xs text-[#1c1b1b]/80 italic font-bold">
                  {userPoints.toLocaleString()} POINTS UNLOCKED
                </p>
              </div>
              <button className="bg-[#506600] text-white font-label font-bold text-xs px-5 py-2 border-2 border-[#1c1b1b] shadow-[3px_3px_0px_#1c1b1b] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all uppercase cursor-pointer">
                REDEEM
              </button>
            </div>
          </div>

          {/* Category: Y2K Essentials */}
          <div
            onClick={() => setActiveDrawer('y2k')}
            className="col-span-4 md:col-span-2 aspect-video md:aspect-[2/1] relative overflow-hidden rounded-2xl border-2 border-[#1c1b1b] shadow-[4px_4px_0px_#1c1b1b] bg-[#6b6c7d] text-[#fcf9f8] group cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150"
          >
            <div className="absolute inset-0 opacity-45 z-0">
              <img
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFahe5P84JZp2sRbEx-rTA9Bln92JMV55taYnV7oiSWDh3X09Ch0qUYVxrMDWhA47Fm1SU4JS466V-6bvtM3pnCuX5Dc31SXTXFgMV-mWYwxFwH49lapqi3NdC3f0Wa664Msbed-q4-gpQ9P9ZkO63DbjM4ZrAMwHmuID2Sm3kX9Y89-wXUhP2hqLEpV0hIJrUPaZEYEKNLoCzhudiLXWmzu8s1k85e4bFhdyK_mmEASLlOB1z4P7kjp-aVhFk1PiiJ0UoKa9f_Kg"
                alt="Y2K Collage"
              />
            </div>
            <div className="relative z-10 p-6 flex flex-col h-full justify-between items-start">
              <div></div>
              <div>
                <h2 className="font-display text-2xl uppercase italic font-black leading-none text-[#fcf9f8]">
                  Y2K<br />ESSENTIALS
                </h2>
                <span className="bg-[#c1f100] text-[#1c1b1b] font-label font-bold text-xs px-4 py-1.5 border-2 border-[#1c1b1b] inline-block mt-4 rounded-md">
                  EXPLORE ERA
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- DRAWERS / OVERLAYS INTERACTION --- */}
      {activeDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative bg-[#fcf9f8] w-full max-w-2xl rounded-t-3xl border-2 border-[#1c1b1b] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Drawer Header */}
            <div className="p-5 border-b-2 border-[#1c1b1b] flex justify-between items-center bg-[#e1e1f5]">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {activeDrawer === 'vintage' && '🏛️'}
                  {activeDrawer === 'steals' && '🔥'}
                  {activeDrawer === 'drops' && '⚡'}
                  {activeDrawer === 'eco' && '🌱'}
                  {activeDrawer === 'loyalty' && '💎'}
                  {activeDrawer === 'y2k' && '📟'}
                </span>
                <h2 className="font-display text-lg uppercase font-black italic tracking-tight text-[#1c1b1b]">
                  {activeDrawer === 'vintage' && 'Vintage Archival Collections'}
                  {activeDrawer === 'steals' && 'Streetwear Flash Deals'}
                  {activeDrawer === 'drops' && 'Hyped Calendar Releases'}
                  {activeDrawer === 'eco' && 'Eco Core Carbon Offsets'}
                  {activeDrawer === 'loyalty' && 'Loyalty Club Redeem Point'}
                  {activeDrawer === 'y2k' && 'Cyber Y2K Glitch Essentials'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setActiveDrawer(null);
                  setSelectedSize('');
                  setSuccessMsg(null);
                }}
                className="p-1 rounded-full border-2 border-[#1c1b1b] bg-white text-[#1c1b1b] hover:bg-[#c1f100] active:scale-90 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success notifications inside drawer */}
            {successMsg && (
              <div className="bg-[#c1f100] text-[#1c1b1b] p-3 text-center font-label text-xs font-bold border-b-2 border-[#1c1b1b] flex items-center justify-center gap-2 animate-bounce">
                <Check className="w-4 h-4 text-[#1c1b1b] stroke-[3]" /> {successMsg}
              </div>
            )}

            {/* Drawer Body (Scrollable) */}
            <div className="p-5 overflow-y-auto space-y-6 custom-scrollbar flex-1 pb-16">
              {/* VINTAGE DRAWER */}
              {activeDrawer === 'vintage' && (
                <div className="space-y-4">
                  <p className="font-sans text-xs text-[#434656] leading-relaxed">
                    Meticulously authenticated and fully restored vintage pieces. Own a slice of streetwear history. All items are in perfect grade-A condition.
                  </p>
                  <div className="space-y-4">
                    {allProducts
                      .filter(p => p.category === 'vintage')
                      .map(product => (
                        <div
                          key={product.id}
                          className="bg-white border-2 border-[#1c1b1b] rounded-xl p-3 flex gap-3 shadow-[2px_2px_0px_#1c1b1b]"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg border border-[#1c1b1b]"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold font-label bg-[#1c1b1b] text-[#c1f100] px-1.5 py-0.5 rounded">
                                  {product.badge}
                                </span>
                              </div>
                              <h4 className="font-display text-sm font-bold text-[#1c1b1b] uppercase mt-1">
                                {product.name}
                              </h4>
                              <p className="font-sans text-[10px] text-[#747688] line-clamp-1">
                                {product.description}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <span className="font-label text-sm font-bold">${product.price}</span>
                              <button
                                onClick={() => onSelectProduct(product)}
                                className="font-label text-xs font-bold text-[#0040e0] hover:underline flex items-center gap-0.5"
                              >
                                View Size & Buy <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* STEALS DRAWER */}
              {activeDrawer === 'steals' && (
                <div className="space-y-4">
                  <div className="bg-[#1c1b1b] text-white p-4 rounded-xl flex items-center justify-between border-2 border-[#1c1b1b] shadow-[3px_3px_0px_#c1f100]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#c1f100] animate-pulse" />
                      <div>
                        <h4 className="font-display text-xs uppercase text-[#747688]">FLASH SALE TIMER</h4>
                        <span className="font-label text-md font-extrabold tracking-widest text-[#c1f100]">
                          {timerString}
                        </span>
                      </div>
                    </div>
                    <span className="bg-[#c1f100] text-[#1c1b1b] font-label text-[10px] font-bold px-3 py-1 rounded">
                      60% OFF COGNITIVE BURST
                    </span>
                  </div>

                  <div className="space-y-4">
                    {allProducts
                      .filter(p => p.originalPrice !== undefined)
                      .map(product => (
                        <div
                          key={product.id}
                          className="bg-white border-2 border-[#1c1b1b] rounded-xl p-3 flex gap-3 shadow-[2px_2px_0px_#1c1b1b]"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg border border-[#1c1b1b]"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <span className="bg-[#1c1b1b] text-[#c1f100] text-[9px] font-bold font-label px-1.5 py-0.5 rounded uppercase">
                                {product.badge}
                              </span>
                              <h4 className="font-display text-sm font-bold text-[#1c1b1b] uppercase mt-1">
                                {product.name}
                              </h4>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-label text-sm font-bold text-[#1c1b1b]">${product.price}</span>
                                <span className="font-label text-xs text-red-500 line-through">
                                  ${product.originalPrice}
                                </span>
                              </div>
                              <button
                                onClick={() => onSelectProduct(product)}
                                className="font-label text-xs font-bold text-[#0040e0] hover:underline flex items-center gap-0.5"
                              >
                                Grab Deal <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* DROPS CALENDAR DRAWER */}
              {activeDrawer === 'drops' && (
                <div className="space-y-4">
                  <p className="font-sans text-xs text-[#434656] leading-relaxed">
                    Keep your tabs refreshed. These hyper-exclusive limited drops are releasing in highly restricted quantities. Activate notification tokens to receive direct alerts before checkout closes!
                  </p>

                  <div className="space-y-4">
                    {dropEvents.map(event => (
                      <div
                        key={event.id}
                        className="bg-white border-2 border-[#1c1b1b] rounded-xl p-4 space-y-3 shadow-[3px_3px_0px_#1c1b1b]"
                      >
                        <div className="flex gap-3">
                          <img
                            src={event.product.image}
                            alt={event.product.name}
                            className="w-16 h-16 object-cover rounded-lg border border-[#1c1b1b]"
                          />
                          <div className="flex-1">
                            <span className="bg-[#e1e1f5] text-[#0040e0] text-[9px] font-bold font-label px-1.5 py-0.5 rounded border border-[#0040e0] uppercase">
                              RELEASING SOON
                            </span>
                            <h4 className="font-display text-sm font-bold text-[#1c1b1b] uppercase mt-1">
                              {event.product.name}
                            </h4>
                            <p className="font-label text-xs text-[#506600] font-bold flex items-center gap-1 mt-0.5">
                              📅 {event.dropTime} (in {event.notifyTime} hours)
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#1c1b1b]/10">
                          <span className="font-label text-sm font-bold text-[#1c1b1b]">${event.product.price}</span>
                          <button
                            onClick={() => handleToggleNotify(event.id)}
                            className={`font-label text-xs font-bold px-4 py-1.5 border-2 border-[#1c1b1b] rounded-md transition-all cursor-pointer ${
                              event.notified
                                ? 'bg-[#c1f100] text-[#1c1b1b] shadow-none'
                                : 'bg-white text-[#1c1b1b] shadow-[2px_2px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5'
                            }`}
                          >
                            {event.notified ? '🔔 REMINDER ACTIVE' : '🔕 NOTIFY ME'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ECO CORE DRAWER */}
              {activeDrawer === 'eco' && (
                <div className="space-y-6">
                  <p className="font-sans text-xs text-[#434656] leading-relaxed">
                    Zero raw cotton extraction. High-grade garments styled directly from spinning room offcuts and biological fibers. Every single choice updates your conscious meter.
                  </p>

                  {/* Planet Savings Calculator Widget */}
                  <div className="bg-[#0040e0] text-[#fcf9f8] p-5 rounded-2xl border-2 border-[#1c1b1b] space-y-4 shadow-[4px_4px_0px_#1c1b1b]">
                    <div className="flex justify-between items-center">
                      <h4 className="font-display text-sm font-black uppercase tracking-tight text-[#c1f100]">
                        CONSCIOUS PLANET TRACKER
                      </h4>
                      <span className="bg-[#c1f100] text-[#1c1b1b] text-[9px] font-bold font-label px-2 py-0.5 rounded border border-[#1c1b1b]">
                        ACTIVE CALC
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                        <span className="text-xl">💧</span>
                        <div className="font-label text-lg font-black text-[#c1f100] mt-1">
                          {totalEcoWaterSaved.toLocaleString()} L
                        </div>
                        <p className="text-[10px] text-[#e1e1f5]">Fresh H2O Saved</p>
                      </div>

                      <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                        <span className="text-xl">🌿</span>
                        <div className="font-label text-lg font-black text-[#c1f100] mt-1">
                          {totalEcoCarbonSaved.toFixed(1)} kg
                        </div>
                        <p className="text-[10px] text-[#e1e1f5]">CO2 Avoided</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/15">
                      <p className="font-sans text-[10px] text-[#e1e1f5] italic text-center">
                        Toggle items below to estimate your cumulative resource salvage metrics:
                      </p>
                      <div className="flex gap-2 justify-center">
                        {allProducts
                          .filter(p => p.category === 'eco')
                          .map(p => (
                            <button
                              key={p.id}
                              onClick={() => toggleEcoCalcItem(p.id)}
                              className={`text-[9px] font-label font-bold px-3 py-1 rounded-full border border-white/20 transition-all ${
                                selectedEcoItems.includes(p.id)
                                  ? 'bg-[#c1f100] text-[#1c1b1b]'
                                  : 'bg-white/5 text-white hover:bg-white/10'
                              }`}
                            >
                              {p.name.split(' ')[0]} {selectedEcoItems.includes(p.id) ? '✓' : '+'}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {allProducts
                      .filter(p => p.category === 'eco')
                      .map(product => (
                        <div
                          key={product.id}
                          className="bg-white border-2 border-[#1c1b1b] rounded-xl p-3 flex gap-3 shadow-[2px_2px_0px_#1c1b1b]"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg border border-[#1c1b1b]"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <span className="bg-[#506600] text-[#c1f100] text-[8px] font-bold font-label px-1.5 py-0.5 rounded">
                                  {product.badge}
                                </span>
                                <span className="text-[10px] text-emerald-600 font-label font-bold">
                                  💧 -{product.ecoMetrics?.waterSaved} Liters
                                </span>
                              </div>
                              <h4 className="font-display text-sm font-bold text-[#1c1b1b] uppercase mt-1">
                                {product.name}
                              </h4>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-label text-sm font-bold">${product.price}</span>
                              <button
                                onClick={() => onSelectProduct(product)}
                                className="font-label text-xs font-bold text-[#0040e0] hover:underline flex items-center gap-0.5"
                              >
                                View Eco Details <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* LOYALTY CLUB DRAWER */}
              {activeDrawer === 'loyalty' && (
                <div className="space-y-6">
                  {/* points panel */}
                  <div className="bg-[#c1f100] border-2 border-[#1c1b1b] rounded-2xl p-5 shadow-[4px_4px_0px_#1c1b1b] flex justify-between items-center">
                    <div>
                      <h4 className="font-display text-xs text-[#506600] uppercase font-bold tracking-widest">
                        YOUR CURRENT REWARDS TIER
                      </h4>
                      <h3 className="font-display text-xl uppercase font-black text-[#1c1b1b] leading-tight">
                        ELITE CLUB TIER
                      </h3>
                      <p className="font-label text-xs text-[#1c1b1b] mt-1 font-bold">
                        Unlocks 1.5x Multipliers on all uploads!
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl">💎</span>
                      <div className="font-label text-lg font-black text-[#1c1b1b] mt-1">
                        {userPoints.toLocaleString()} XP
                      </div>
                    </div>
                  </div>

                  {/* Mini game spin the wheel */}
                  <div className="bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-2xl p-4 shadow-[4px_4px_0px_#1c1b1b] space-y-4 text-center">
                    <div className="flex justify-between items-center border-b border-[#1c1b1b]/10 pb-2">
                      <h4 className="font-display text-xs uppercase font-black tracking-tight text-[#1c1b1b] flex items-center gap-1">
                        <Gift className="w-4 h-4 text-[#0040e0]" /> WHEEL OF LUCKY TICKETS
                      </h4>
                      <span className="bg-[#e1e1f5] text-[#0040e0] text-[9px] font-bold font-label px-2 py-0.5 rounded border border-[#0040e0]">
                        DAILY FREE PLAY
                      </span>
                    </div>

                    <div className="relative max-w-[280px] mx-auto p-4 border border-[#1c1b1b]/5 rounded-xl bg-white flex flex-col items-center">
                      {/* Spinning text container */}
                      <div className="w-full h-12 flex items-center justify-center border-2 border-[#1c1b1b] rounded-lg bg-[#1c1b1b] text-white overflow-hidden shadow-inner font-label text-sm font-bold">
                        {isSpinning ? (
                          <div className="flex gap-2 items-center animate-pulse text-[#c1f100]">
                            <Volume2 className="w-4 h-4 animate-bounce" /> SPINNING SYSTEM...
                          </div>
                        ) : spinResult ? (
                          <span className="text-[#c1f100] animate-bounce">{spinResult}</span>
                        ) : (
                          <span className="text-gray-400">READY TO DROP...</span>
                        )}
                      </div>

                      {/* Mock Wheel segments */}
                      <div className="flex gap-1 justify-center mt-3 w-full">
                        {[0, 1, 2, 3, 4, 5].map(idx => (
                          <div
                            key={idx}
                            className={`w-8 h-8 rounded border border-[#1c1b1b] transition-all duration-100 flex items-center justify-center text-xs font-bold ${
                              isSpinning && wheelTicks === idx
                                ? 'bg-[#c1f100] scale-110 border-2'
                                : 'bg-gray-100'
                            }`}
                          >
                            {idx === 0 && '50'}
                            {idx === 1 && '100'}
                            {idx === 2 && '250'}
                            {idx === 3 && '🎟️'}
                            {idx === 4 && '20'}
                            {idx === 5 && '👑'}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleSpinWheel}
                        disabled={isSpinning}
                        className={`w-full mt-4 py-2 border-2 border-[#1c1b1b] rounded-xl font-label font-black text-sm uppercase transition-all duration-150 cursor-pointer ${
                          isSpinning
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none translate-y-0.5'
                            : 'bg-[#c1f100] text-[#1c1b1b] shadow-[3px_3px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                        }`}
                      >
                        {isSpinning ? 'STABILIZING VELOCITY...' : '⚡ SPIN FOR FREE REWARDS'}
                      </button>
                    </div>
                  </div>

                  {/* Rewards marketplace list */}
                  <div className="space-y-3">
                    <h4 className="font-display text-sm uppercase font-black text-[#1c1b1b] flex items-center gap-1.5">
                      🎟️ REDEEM EXCLUSIVE DISCOUNT CODES
                    </h4>
                    <div className="space-y-3">
                      {rewards.map(reward => (
                        <div
                          key={reward.id}
                          className="bg-white border-2 border-[#1c1b1b] rounded-xl p-3 flex justify-between items-center shadow-[2px_2px_0px_#1c1b1b]"
                        >
                          <div className="space-y-0.5 flex-1 pr-3">
                            <h5 className="font-display text-xs font-bold text-[#1c1b1b] uppercase">
                              {reward.title}
                            </h5>
                            <p className="font-sans text-[10px] text-[#747688] leading-tight">
                              {reward.description}
                            </p>
                          </div>

                          <div>
                            {reward.unlocked ? (
                              <button
                                onClick={() => copyToClipboard(reward.discountCode)}
                                className="bg-[#1c1b1b] text-[#c1f100] font-label text-[10px] font-bold px-3 py-1.5 rounded-lg border border-[#1c1b1b] flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                              >
                                {copiedCode === reward.discountCode ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-[#c1f100]" /> COPIED
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-[#c1f100]" /> {reward.discountCode}
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRedeemReward(reward)}
                                className={`font-label text-[10px] font-bold px-3 py-1.5 border-2 border-[#1c1b1b] rounded-lg transition-all cursor-pointer ${
                                  userPoints >= reward.pointsCost
                                    ? 'bg-[#c1f100] text-[#1c1b1b] shadow-[2px_2px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                                    : 'bg-gray-100 text-gray-400 border-gray-300 shadow-none cursor-not-allowed'
                                }`}
                              >
                                {reward.pointsCost} XP
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Y2K DRAWER */}
              {activeDrawer === 'y2k' && (
                <div className="space-y-4">
                  <p className="font-sans text-xs text-[#434656] leading-relaxed">
                    Futuristic translucent designs, metallic glitch graphics, and giant chunky footwear to complete your 2000s cyber look.
                  </p>
                  <div className="space-y-4">
                    {allProducts
                      .filter(p => p.category === 'y2k')
                      .map(product => (
                        <div
                          key={product.id}
                          className="bg-white border-2 border-[#1c1b1b] rounded-xl p-3 flex gap-3 shadow-[2px_2px_0px_#1c1b1b]"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg border border-[#1c1b1b]"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <span className="bg-[#e1e1f5] text-[#0040e0] text-[9px] font-bold font-label px-1.5 py-0.5 rounded border border-[#0040e0]">
                                {product.badge}
                              </span>
                              <h4 className="font-display text-sm font-bold text-[#1c1b1b] uppercase mt-1">
                                {product.name}
                              </h4>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-label text-sm font-bold">${product.price}</span>
                              <button
                                onClick={() => onSelectProduct(product)}
                                className="font-label text-xs font-bold text-[#0040e0] hover:underline flex items-center gap-0.5"
                              >
                                View Sizes <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, Flame, Heart, Sparkles, TrendingUp } from 'lucide-react';
import { useState, MouseEvent } from 'react';
import { Product } from '../types';

interface HomeTabProps {
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateToTab: (tab: 'home' | 'shop' | 'feed' | 'bag' | 'me') => void;
}

export default function HomeTab({ allProducts, onSelectProduct, onNavigateToTab }: HomeTabProps) {
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  // Get highly featured products
  const hotSneakers = allProducts.filter(p => p.category === 'sneakers').slice(0, 2);
  const curatedGems = allProducts.filter(p => p.category === 'vintage').slice(0, 2);

  const toggleLike = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Editorial Marquee */}
      <div className="bg-[#1c1b1b] text-[#c1f100] py-3.5 border-b-2 border-t-2 border-[#1c1b1b] overflow-hidden whitespace-nowrap select-none">
        <div className="flex gap-8 items-center animate-marquee font-display text-lg tracking-wider">
          <span>⚡ SUMMER DROP WEEK 24 IS LIVE</span>
          <Sparkles className="w-5 h-5 inline text-[#c1f100] fill-current" />
          <span>🔥 UNLOCK CURATED VINTAGE GRAILS</span>
          <Flame className="w-5 h-5 inline text-[#c1f100] fill-current" />
          <span>🌿 ECO CORE: 100% RECYCLED MATERIALS</span>
          <Sparkles className="w-5 h-5 inline text-[#c1f100] fill-current" />
          <span>📟 CYBERPUNK Y2K ESSENTIALS ARE MOVING FAST</span>
        </div>
      </div>

      {/* Hero Cover */}
      <div className="px-5">
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#1c1b1b] shadow-[6px_6px_0px_#1c1b1b] bg-[#e1e1f5] aspect-[16/9] sm:aspect-[21/9] flex items-center p-6 sm:p-10 group cursor-pointer" onClick={() => onNavigateToTab('shop')}>
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop"
              alt="Streetwear Lookbook"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1c1b1b]/80 via-[#1c1b1b]/30 to-transparent" />
          </div>

          <div className="relative z-10 max-w-md text-[#fcf9f8] space-y-3">
            <span className="bg-[#c1f100] text-[#1c1b1b] font-label text-xs px-3 py-1 rounded border-2 border-[#1c1b1b] inline-block font-bold">
              EDITORIAL VOL. 24
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase italic leading-none tracking-tight">
              NEON METROPOLIS<br />LOOKBOOK
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#e5e2e1] leading-relaxed">
              Synthesizing cyber-punk silhouettes with archival grunge styles. Shot on location under rain-soaked neon lights.
            </p>
            <button className="flex items-center gap-1.5 bg-[#c1f100] text-[#1c1b1b] font-label font-bold text-xs px-4 py-2 border-2 border-[#1c1b1b] rounded-full hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all">
              EXPLORE STYLES <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Quick Categories */}
      <div className="px-5">
        <h3 className="font-display text-xl uppercase tracking-tighter italic font-extrabold flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#0040e0]" /> SHOP BY VIBE
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => onNavigateToTab('shop')}
            className="group cursor-pointer relative overflow-hidden rounded-xl border-2 border-[#1c1b1b] shadow-[4px_4px_0px_#1c1b1b] bg-[#c1f100] p-5 h-28 flex flex-col justify-between active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <div className="font-display text-lg font-black uppercase italic text-[#1c1b1b] leading-tight">
              SNEAKER<br />HYPED
            </div>
            <span className="font-label text-xs text-[#506600] flex items-center gap-0.5 font-bold uppercase">
              VIEW RELEASES <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div
            onClick={() => onNavigateToTab('shop')}
            className="group cursor-pointer relative overflow-hidden rounded-xl border-2 border-[#1c1b1b] shadow-[4px_4px_0px_#1c1b1b] bg-[#e1e1f5] p-5 h-28 flex flex-col justify-between active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <div className="font-display text-lg font-black uppercase italic text-[#1c1b1b] leading-tight">
              ARCHIVAL<br />GRAILS
            </div>
            <span className="font-label text-xs text-[#0040e0] flex items-center gap-0.5 font-bold uppercase">
              EXPLORE GEMS <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>

      {/* HYPED DROPS (Horizontal Scroll) */}
      <div className="space-y-4">
        <div className="px-5 flex justify-between items-end">
          <h3 className="font-display text-xl uppercase tracking-tighter italic font-extrabold flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#0040e0]" /> TRENDING RIGHT NOW
          </h3>
          <button
            onClick={() => onNavigateToTab('shop')}
            className="font-label text-xs font-bold text-[#0040e0] hover:underline uppercase flex items-center gap-0.5"
          >
            See All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto px-5 pb-4 scrollbar-none snap-x">
          {hotSneakers.concat(curatedGems).map(product => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="snap-start min-w-[210px] w-[210px] sm:w-[240px] flex-shrink-0 cursor-pointer bg-[#fcf9f8] rounded-xl border-2 border-[#1c1b1b] shadow-[4px_4px_0px_#1c1b1b] hover:shadow-[2px_2px_0px_#1c1b1b] hover:translate-x-0.5 hover:translate-y-0.5 transition-all group overflow-hidden"
            >
              <div className="relative aspect-square bg-[#e5e2e1] overflow-hidden">
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
                <button
                  onClick={(e) => toggleLike(product.id, e)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-[#fcf9f8]/90 border border-[#1c1b1b] hover:bg-[#c1f100] text-[#1c1b1b] active:scale-95 transition-all shadow-[2px_2px_0px_#1c1b1b] hover:shadow-none"
                >
                  <Heart className={`w-3.5 h-3.5 ${likes[product.id] ? 'fill-red-500 text-red-500' : 'text-[#1c1b1b]'}`} />
                </button>
              </div>

              <div className="p-3 space-y-1.5">
                <h4 className="font-label text-xs text-[#747688] uppercase tracking-wider">{product.category}</h4>
                <h3 className="font-display text-sm font-bold text-[#1c1b1b] uppercase truncate leading-snug">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-label text-sm font-bold text-[#1c1b1b]">${product.price}</span>
                    {product.originalPrice && (
                      <span className="font-label text-xs text-red-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-[10px] bg-[#e1e1f5] text-[#0040e0] font-label font-bold px-1.5 py-0.5 rounded border border-[#0040e0]">
                    BUY
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Ethos Bento Highlights */}
      <div className="px-5 space-y-4">
        <h3 className="font-display text-xl uppercase tracking-tighter italic font-extrabold flex items-center gap-2">
          💡 DROPS PHILOSOPHY
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#fcf9f8] p-5 rounded-xl border-2 border-[#1c1b1b] shadow-[4px_4px_0px_#1c1b1b] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#c1f100] border-2 border-[#1c1b1b] flex items-center justify-center text-md font-bold">
              1
            </div>
            <h4 className="font-display text-sm font-black uppercase text-[#1c1b1b]">Archival Curation</h4>
            <p className="font-sans text-xs text-[#434656] leading-relaxed">
              Every garment on DROPS is verified by professional street stylists for material grade, authenticity, and design relevance.
            </p>
          </div>

          <div className="bg-[#fcf9f8] p-5 rounded-xl border-2 border-[#1c1b1b] shadow-[4px_4px_0px_#1c1b1b] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#e1e1f5] border-2 border-[#1c1b1b] flex items-center justify-center text-md font-bold">
              2
            </div>
            <h4 className="font-display text-sm font-black uppercase text-[#1c1b1b]">Eco Accountability</h4>
            <p className="font-sans text-xs text-[#434656] leading-relaxed">
              We track exactly how much H2O and CO2 is saved by recycling pre-consumer cotton scrap. Play your part in sustainable high fashion.
            </p>
          </div>

          <div className="bg-[#fcf9f8] p-5 rounded-xl border-2 border-[#1c1b1b] shadow-[4px_4px_0px_#1c1b1b] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#1c1b1b] text-[#c1f100] border-2 border-[#1c1b1b] flex items-center justify-center text-md font-bold">
              3
            </div>
            <h4 className="font-display text-sm font-black uppercase text-[#c1f100]">Loyalty Multiplier</h4>
            <p className="font-sans text-xs text-[#e5e2e1] bg-[#1c1b1b] p-2 rounded leading-relaxed border border-[#c1f100]/20">
              Win daily points, spin the wheel of coupons, and unlock store credit by rating outfits in the community Feed!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

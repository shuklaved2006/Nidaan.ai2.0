/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Award,
  BookOpen,
  Check,
  ChevronRight,
  Compass,
  Cpu,
  History,
  Info,
  MapPin,
  PenTool,
  Sparkles,
  TrendingUp,
  User,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { Product } from '../types';

interface MeTabProps {
  userPoints: number;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function MeTab({ userPoints, allProducts, onSelectProduct }: MeTabProps) {
  // Styling Mood selection for AI Advisor
  const [selectedMood, setSelectedMood] = useState('Cyberpunk Y2K');
  const [aiIsGenerating, setAiIsGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    outfitName: string;
    description: string;
    topItem: Product;
    bottomItem: Product;
    accessoryItem: Product;
    proStylingTip: string;
  } | null>(null);

  // Profile Edit fields
  const [email, setEmail] = useState('shuklaved2006@gmail.com');
  const [username, setUsername] = useState('ved_shukla');
  const [isEditing, setIsEditing] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  // Digital wardrobe initial state (mock products the user already "owns")
  const ownedItems = allProducts.filter(p => p.id === 'vin-1' || p.id === 'steal-1');

  // AI Generation Simulation with tailored rules
  const handleGenerateAiRecommendation = () => {
    setAiIsGenerating(true);
    setAiSuggestion(null);

    setTimeout(() => {
      let topItem: Product;
      let bottomItem: Product;
      let accessoryItem: Product;
      let outfitName = '';
      let description = '';
      let proStylingTip = '';

      if (selectedMood === 'Cyberpunk Y2K') {
        outfitName = 'VIRTUAL CHROMATIC PROTOCOL';
        description = 'A high-energy cybernetic outfit focused on metallic sheen and technical wraps. The chrome silhouette catches rain and reflects blue/lilac light waves perfectly.';
        topItem = allProducts.find(p => p.id === 'y2k-1')!;
        bottomItem = allProducts.find(p => p.id === 'vin-3')!;
        accessoryItem = allProducts.find(p => p.id === 'y2k-2')!;
        proStylingTip = 'Style the Chrome jacket open over a washed-out lavender cropped layer. Complete the look with the shutter glasses resting slightly low on your nose.';
      } else if (selectedMood === 'Sustainable Earth Core') {
        outfitName = 'BIOPHILIC CONSCIOUS OVERCAST';
        description = 'Grounding, breathable organic fabrics arranged in functional multi-layered utility levels. Emphasizes carbon accountability and resource recovery.';
        topItem = allProducts.find(p => p.id === 'eco-1')!;
        bottomItem = allProducts.find(p => p.id === 'vin-3')!;
        accessoryItem = allProducts.find(p => p.id === 'eco-2')!;
        proStylingTip = 'Tuck the heavyweight scrap hoodie slightly into your overdyed jeans to establish clean proportions, and let the recycled soles handle the grounding.';
      } else {
        // Archival Grunge
        outfitName = 'ATELIER DECONSTRUCTED UTILITY';
        description = 'An archival look contrasting historical oversized outerwear silhouettes with tactical modern accessories.';
        topItem = allProducts.find(p => p.id === 'vin-1')!;
        bottomItem = allProducts.find(p => p.id === 'steal-2')!;
        accessoryItem = allProducts.find(p => p.id === 'steal-1')!;
        proStylingTip = 'Overlay the heavy vintage canvas parka directly on top of the utility vest. Pull the ankle toggles of the trackpants tight to create a balloon taper silhouette.';
      }

      setAiIsGenerating(false);
      setAiSuggestion({
        outfitName,
        description,
        topItem,
        bottomItem,
        accessoryItem,
        proStylingTip
      });
    }, 1800);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in px-5 pt-4">
      {/* SECTION: USER PROFILE HEADER */}
      <div className="bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-2xl p-5 shadow-[4px_4px_0px_#1c1b1b] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#c1f100]/20 rounded-bl-full -mr-2 -mt-2"></div>

        <div className="flex gap-4 items-center">
          {/* Avatar frame */}
          <div className="w-16 h-16 rounded-full border-2 border-[#1c1b1b] bg-[#e1e1f5] flex items-center justify-center text-3xl font-bold text-[#0040e0] shrink-0 shadow-[2px_2px_0px_#1c1b1b]">
            {username.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              {isEditing ? (
                <input
                  type="text"
                  className="bg-white border border-[#1c1b1b] rounded px-2 py-0.5 text-xs font-bold text-[#1c1b1b] w-28"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              ) : (
                <h3 className="font-display text-sm font-black text-[#1c1b1b] truncate uppercase">
                  @{username}
                </h3>
              )}
              <span className="bg-[#1c1b1b] text-[#c1f100] text-[8px] font-bold font-label px-2 py-0.5 rounded border border-[#c1f100]/10">
                ELITE MEMBER
              </span>
            </div>

            {isEditing ? (
              <input
                type="email"
                className="bg-white border border-[#1c1b1b] rounded px-2 py-0.5 text-[10px] text-[#434656] w-44 font-sans block"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            ) : (
              <p className="font-sans text-[11px] text-[#434656] truncate">{email}</p>
            )}

            <p className="font-label text-[10px] text-[#747688] font-bold uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#0040e0]" /> LOCATION: EARTH DISPATCH
            </p>
          </div>
        </div>

        {/* Profile Stats row */}
        <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-[#1c1b1b]/10 mt-4 font-label text-xs">
          <div className="bg-[#f0eded] p-2 rounded-xl border border-[#1c1b1b]/10">
            <span className="text-[10px] text-[#747688] block">REWARDS XP</span>
            <strong className="text-md font-extrabold text-[#1c1b1b]">
              {userPoints.toLocaleString()}
            </strong>
          </div>

          <div className="bg-[#e1e1f5] p-2 rounded-xl border border-[#0040e0]/20">
            <span className="text-[10px] text-[#0040e0] block">SAVED CUTS</span>
            <strong className="text-md font-extrabold text-[#0040e0]">12</strong>
          </div>

          <div className="bg-[#c1f100]/20 p-2 rounded-xl border border-[#506600]/25">
            <span className="text-[10px] text-[#506600] block">MEMBERSHIP</span>
            <strong className="text-md font-extrabold text-[#1c1b1b]">TIER 1</strong>
          </div>
        </div>

        {/* Edit profile actions */}
        <div className="flex justify-end mt-3 gap-2">
          {savedMsg && (
            <span className="text-[10px] font-bold text-emerald-600 font-label uppercase flex items-center gap-1 animate-pulse">
              <Check className="w-3.5 h-3.5" /> PROFILE UPDATED ✓
            </span>
          )}

          {isEditing ? (
            <button
              onClick={handleSaveProfile}
              className="px-3 py-1 bg-[#c1f100] text-[#1c1b1b] border-2 border-[#1c1b1b] rounded-lg font-label font-bold text-[10px] uppercase shadow-[1px_1px_0px_#1c1b1b] cursor-pointer"
            >
              SAVE CHANGES
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 bg-white text-[#1c1b1b] border-2 border-[#1c1b1b] rounded-lg font-label font-bold text-[10px] uppercase shadow-[1.5px_1.5px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              EDIT PROFILE
            </button>
          )}
        </div>
      </div>

      {/* SECTION: AI STYLING GENERATOR WIDGET */}
      <div className="bg-[#1c1b1b] text-white p-5 rounded-2xl border-2 border-[#1c1b1b] shadow-[4px_4px_0px_#c1f100] space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#c1f100] animate-pulse" />
            <h3 className="font-display text-md uppercase font-black text-[#c1f100]">
              AI Style Assistant
            </h3>
          </div>
          <span className="bg-[#c1f100] text-[#1c1b1b] font-label text-[9px] font-bold px-2 py-0.5 rounded border border-[#1c1b1b]">
            GEMINI FLASH 2.4
          </span>
        </div>

        <p className="font-sans text-xs text-[#e5e2e1] leading-relaxed">
          Select your aesthetic direction. Our neural coordinator parses the physical parameters of the DROPS vault products to assemble a personalized 3-piece street layout.
        </p>

        {/* Mood selection row */}
        <div className="flex gap-2 font-label text-[10px] font-bold">
          {['Cyberpunk Y2K', 'Sustainable Earth Core', 'Archival Grunge'].map(mood => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`flex-1 py-1.5 rounded-lg border-2 border-[#1c1b1b] transition-all cursor-pointer ${
                selectedMood === mood
                  ? 'bg-[#c1f100] text-[#1c1b1b] border-[#c1f100]'
                  : 'bg-[#313030] text-gray-300 border-[#1c1b1b] hover:bg-[#434656]'
              }`}
            >
              {mood.split(' ')[0]}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerateAiRecommendation}
          disabled={aiIsGenerating}
          className={`w-full py-2.5 border-2 border-[#1c1b1b] rounded-xl font-label font-black text-sm uppercase transition-all duration-150 cursor-pointer ${
            aiIsGenerating
              ? 'bg-[#313030] text-gray-400 border-gray-600 cursor-not-allowed shadow-none translate-y-0.5'
              : 'bg-[#c1f100] text-[#1c1b1b] shadow-[3px_3px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
          }`}
        >
          {aiIsGenerating ? 'PARSING TEXTILE PARAMETERS...' : '⚡ GENERATE NEURAL STREETFIT LAYOUT'}
        </button>

        {/* Outcome result */}
        {aiSuggestion && (
          <div className="bg-[#fcf9f8] text-[#1c1b1b] border-2 border-[#1c1b1b] rounded-xl p-4 space-y-4 shadow-[4px_4px_0px_#c1f100] animate-fade-in">
            <div className="border-b border-[#1c1b1b]/10 pb-2">
              <span className="text-[9px] font-bold text-[#0040e0] font-label bg-[#e1e1f5] px-2 py-0.5 rounded">
                NEURAL PROTOCOL UNLOCKED
              </span>
              <h4 className="font-display text-sm font-black text-[#1c1b1b] mt-1">
                {aiSuggestion.outfitName}
              </h4>
              <p className="font-sans text-[10px] text-[#434656] mt-1 leading-relaxed">
                {aiSuggestion.description}
              </p>
            </div>

            {/* Generated Items list */}
            <div className="space-y-2">
              <h5 className="font-label text-[10px] uppercase font-bold text-[#0040e0]">Suggested 3-Piece Layout:</h5>

              {/* Top Item */}
              <div
                onClick={() => onSelectProduct(aiSuggestion.topItem)}
                className="flex gap-2 items-center p-2 rounded-lg bg-white border border-[#1c1b1b]/15 cursor-pointer hover:border-[#0040e0]"
              >
                <img
                  src={aiSuggestion.topItem.image}
                  alt={aiSuggestion.topItem.name}
                  className="w-10 h-10 object-cover rounded border border-[#1c1b1b]"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] font-label font-bold text-[#747688] uppercase">TOP PIECE</span>
                  <h6 className="font-display text-[10px] font-bold text-[#1c1b1b] truncate uppercase">
                    {aiSuggestion.topItem.name}
                  </h6>
                </div>
                <span className="font-label text-[10px] font-bold">${aiSuggestion.topItem.price}</span>
              </div>

              {/* Bottom Item */}
              <div
                onClick={() => onSelectProduct(aiSuggestion.bottomItem)}
                className="flex gap-2 items-center p-2 rounded-lg bg-white border border-[#1c1b1b]/15 cursor-pointer hover:border-[#0040e0]"
              >
                <img
                  src={aiSuggestion.bottomItem.image}
                  alt={aiSuggestion.bottomItem.name}
                  className="w-10 h-10 object-cover rounded border border-[#1c1b1b]"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] font-label font-bold text-[#747688] uppercase">BOTTOM PIECE</span>
                  <h6 className="font-display text-[10px] font-bold text-[#1c1b1b] truncate uppercase">
                    {aiSuggestion.bottomItem.name}
                  </h6>
                </div>
                <span className="font-label text-[10px] font-bold">${aiSuggestion.bottomItem.price}</span>
              </div>

              {/* Accessory */}
              <div
                onClick={() => onSelectProduct(aiSuggestion.accessoryItem)}
                className="flex gap-2 items-center p-2 rounded-lg bg-white border border-[#1c1b1b]/15 cursor-pointer hover:border-[#0040e0]"
              >
                <img
                  src={aiSuggestion.accessoryItem.image}
                  alt={aiSuggestion.accessoryItem.name}
                  className="w-10 h-10 object-cover rounded border border-[#1c1b1b]"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] font-label font-bold text-[#747688] uppercase">ACCESSORY/FOOTWEAR</span>
                  <h6 className="font-display text-[10px] font-bold text-[#1c1b1b] truncate uppercase">
                    {aiSuggestion.accessoryItem.name}
                  </h6>
                </div>
                <span className="font-label text-[10px] font-bold">${aiSuggestion.accessoryItem.price}</span>
              </div>
            </div>

            {/* Pro Styling Tip */}
            <div className="p-2.5 bg-[#e1e1f5] rounded-xl border border-[#0040e0]/20 text-[10px] font-sans text-[#1c1b1b] leading-relaxed">
              <strong className="font-label font-bold text-[#0040e0] block uppercase tracking-tight mb-0.5">
                PRO STYLING PARADIGM:
              </strong>
              {aiSuggestion.proStylingTip}
            </div>
          </div>
        )}
      </div>

      {/* SECTION: USER DIGITAL WARDROBE TWIN */}
      <div className="space-y-4">
        <h3 className="font-display text-xl uppercase tracking-tighter italic font-extrabold flex items-center gap-1.5">
          <BookOpen className="w-5 h-5 text-[#0040e0]" /> My Digital Wardrobe
        </h3>

        <p className="font-sans text-xs text-[#747688] leading-relaxed">
          The digital twins of your verified streetwear pickups. Use these to style and upload fits inside the Feed!
        </p>

        <div className="grid grid-cols-2 gap-4">
          {ownedItems.map(product => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-white rounded-xl border-2 border-[#1c1b1b] shadow-[3px_3px_0px_#1c1b1b] overflow-hidden group cursor-pointer"
            >
              <div className="aspect-square bg-[#e5e2e1] overflow-hidden relative border-b-2 border-[#1c1b1b]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-[#1c1b1b] text-[#c1f100] text-[8px] font-bold font-label px-2 py-0.5 rounded">
                  OWNED ✓
                </span>
              </div>
              <div className="p-3">
                <h4 className="font-label text-[9px] text-[#747688] uppercase">{product.category}</h4>
                <h3 className="font-display text-[11px] font-bold text-[#1c1b1b] uppercase truncate mt-0.5">
                  {product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Camera,
  Check,
  Heart,
  MessageCircle,
  Plus,
  Send,
  Share2,
  Sparkles,
  Tag,
  UploadCloud,
  X
} from 'lucide-react';
import { useState, ChangeEvent } from 'react';
import { FeedPost, Product } from '../types';

interface FeedTabProps {
  feedPosts: FeedPost[];
  allProducts: Product[];
  userPoints: number;
  onUpdatePoints: (newPoints: number) => void;
  onAddToCart: (product: Product, size: string) => void;
  onSelectProduct: (product: Product) => void;
  onSetFeedPosts: (posts: FeedPost[]) => void;
}

export default function FeedTab({
  feedPosts,
  allProducts,
  userPoints,
  onUpdatePoints,
  onAddToCart,
  onSelectProduct,
  onSetFeedPosts
}: FeedTabProps) {
  // Post styling interactions
  const [comments, setComments] = useState<Record<string, string[]>>({
    'post-1': ['Where did you get the cargos??', 'Apex Yellow looks mental!'],
    'post-2': ['Perfect cyber silhouette', 'That high-shine is fire'],
    'post-3': ['Sustainable curation wins!']
  });
  const [newCommentInput, setNewCommentInput] = useState<Record<string, string>>({});
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);

  // Fit Evaluator state
  const [fitDescription, setFitDescription] = useState('');
  const [fitImageFile, setFitImageFile] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    vibes: string;
    strengths: string[];
    recommendation: Product;
    xpEarned: number;
  } | null>(null);

  // Toggle upvoting posts
  const handleLikePost = (postId: string) => {
    const updated = feedPosts.map(post => {
      if (post.id === postId) {
        const hasLiked = !post.hasLiked;
        return {
          ...post,
          hasLiked,
          likes: hasLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    });
    onSetFeedPosts(updated);
  };

  // Add Comment logic
  const handleAddComment = (postId: string) => {
    const text = newCommentInput[postId]?.trim();
    if (!text) return;

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), text]
    }));
    setNewCommentInput(prev => ({ ...prev, [postId]: '' }));
  };

  // Upload custom look picture preview
  const handleMockImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFitImageFile(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Fit AI Evaluator Simulation
  const handleEvaluateFit = () => {
    if (!fitDescription.trim() && !fitImageFile) {
      alert('Please describe your streetwear fit or upload an image first!');
      return;
    }
    setIsEvaluating(true);
    setEvaluationResult(null);

    setTimeout(() => {
      // Pick a random product recommendation
      const randomRecommendation = allProducts[Math.floor(Math.random() * allProducts.length)];

      const scoreValue = Math.floor(82 + Math.random() * 16) / 10; // score between 8.2 and 9.7
      const vibesList = [
        '90s Archival Grunge Revival',
        'Futuristic Cyber-Y2K Tech Synergy',
        'Modern High-Contrast Minimalist Street',
        'Earth-Friendly Eco-Core Utility',
        'Skater-Ready Distressed Comfort'
      ];
      const strengthsList = [
        ['Perfect proportion contrast between the loose silhouette and fit-taper.', 'Heavyweight textiles convey luxury structure.', 'Color harmony matches the natural grounding theme.'],
        ['Outstanding high-shine metallic elements.', 'Cybernetic accessories frame the outfit nicely.', 'Chunky footwear balances the tactical cargo length.'],
        ['Excellent wash grading on distressed items.', 'Sneakers provide a dynamic pop of electric color.', 'Clean layering allows each fabric texture to breathe.']
      ];

      const chosenVibe = vibesList[Math.floor(Math.random() * vibesList.length)];
      const chosenStrengths = strengthsList[Math.floor(Math.random() * strengthsList.length)];

      setIsEvaluating(false);
      setEvaluationResult({
        score: scoreValue,
        vibes: chosenVibe,
        strengths: chosenStrengths,
        recommendation: randomRecommendation,
        xpEarned: 100
      });

      // Add points to user account
      onUpdatePoints(userPoints + 100);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* SECTION: AI FIT EVALUATOR BLOCK */}
      <section className="px-5">
        <div className="bg-[#1c1b1b] text-white p-5 rounded-2xl border-2 border-[#1c1b1b] shadow-[4px_4px_0px_#c1f100] space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="bg-[#c1f100] text-[#1c1b1b] font-label text-[10px] font-black px-2.5 py-0.5 rounded border border-[#1c1b1b] uppercase">
                STYLE ASSISTANT
              </span>
              <h3 className="font-display text-lg uppercase font-black text-[#c1f100] mt-1.5 leading-tight">
                Outfit Evaluator
              </h3>
            </div>
            <Sparkles className="w-6 h-6 text-[#c1f100] animate-pulse" />
          </div>

          <p className="font-sans text-xs text-[#e5e2e1] leading-relaxed">
            Upload your streetwear fit or describe your garments below. Our Style Assistant analyzes color, silhouette, and era to give you points and custom matching recommendations!
          </p>

          <div className="space-y-3">
            {/* Description Input */}
            <textarea
              className="w-full bg-[#313030] text-white border-2 border-[#1c1b1b] rounded-xl p-3 font-sans text-xs focus:outline-none focus:border-[#c1f100] placeholder:text-[#747688]"
              rows={3}
              placeholder="e.g., Baggy acid-wash lilac cargos, heavy-duty overdyed grey hoodie, silver chains, and retro high-top trainers."
              value={fitDescription}
              onChange={e => setFitDescription(e.target.value)}
            />

            {/* Drag & Drop File Input Mockup */}
            <div className="flex items-center gap-3">
              <label className="flex-1 border-2 border-dashed border-[#747688] hover:border-[#c1f100] rounded-xl p-3 bg-[#313030]/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMockImageUpload}
                  className="hidden"
                />
                {fitImageFile ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={fitImageFile}
                      alt="Look preview"
                      className="w-10 h-10 object-cover rounded border border-[#1c1b1b]"
                    />
                    <span className="text-[10px] text-[#c1f100] font-label uppercase font-bold">Image Loaded ✓</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[#747688]">
                    <UploadCloud className="w-5 h-5 text-gray-400" />
                    <span className="text-[10px] font-label uppercase font-bold text-gray-300">ADD FIT PIC</span>
                  </div>
                )}
              </label>

              {fitImageFile && (
                <button
                  onClick={() => setFitImageFile(null)}
                  className="p-2 border-2 border-[#1c1b1b] rounded-xl bg-[#ba1a1a] text-white active:scale-95 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Evaluate Trigger button */}
            <button
              onClick={handleEvaluateFit}
              disabled={isEvaluating}
              className={`w-full py-2.5 border-2 border-[#1c1b1b] rounded-xl font-label font-black text-sm uppercase transition-all duration-150 cursor-pointer ${
                isEvaluating
                  ? 'bg-[#313030] text-gray-400 border-gray-600 cursor-not-allowed shadow-none translate-y-0.5'
                  : 'bg-[#c1f100] text-[#1c1b1b] shadow-[3px_3px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
              }`}
            >
              {isEvaluating ? 'ANALYZING FABRIC BALANCE...' : '🔍 EVALUATE MY STREET VIBES (+100 XP)'}
            </button>
          </div>

          {/* Evaluation Outcome Panel */}
          {evaluationResult && (
            <div className="bg-white text-[#1c1b1b] border-2 border-[#1c1b1b] rounded-xl p-4 space-y-3 shadow-[4px_4px_0px_#c1f100] animate-fade-in">
              <div className="flex justify-between items-center border-b border-[#1c1b1b]/10 pb-2">
                <div>
                  <h4 className="font-display text-xs text-[#747688] uppercase">YOUR STREET STYLE RATING</h4>
                  <p className="font-display text-md font-black text-[#0040e0] leading-none mt-1 uppercase">
                    {evaluationResult.vibes}
                  </p>
                </div>
                <div className="bg-[#1c1b1b] text-[#c1f100] px-3 py-1.5 rounded-lg border border-[#1c1b1b] text-center">
                  <div className="text-lg font-black font-label leading-none">{evaluationResult.score}</div>
                  <span className="text-[7px] font-bold">/ 10</span>
                </div>
              </div>

              {/* Strengths list */}
              <div className="space-y-1.5">
                <h5 className="font-label text-xs uppercase text-[#1c1b1b] font-bold">Outfit Strengths:</h5>
                <ul className="space-y-1">
                  {evaluationResult.strengths.map((strength, i) => (
                    <li key={i} className="text-[10px] font-sans text-[#434656] flex items-start gap-1">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tagged Recommendation card */}
              <div className="p-2 border-2 border-[#1c1b1b] rounded-lg bg-[#e1e1f5] space-y-2">
                <h5 className="font-label text-[10px] uppercase font-bold text-[#0040e0] flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> STYLIST MISSING ITEM TO ELEVATE LOOK:
                </h5>
                <div className="flex gap-2 items-center">
                  <img
                    src={evaluationResult.recommendation.image}
                    alt="Recommendation look"
                    className="w-12 h-12 object-cover rounded border border-[#1c1b1b]"
                  />
                  <div className="flex-1">
                    <h6 className="font-display text-xs font-bold uppercase text-[#1c1b1b] line-clamp-1">
                      {evaluationResult.recommendation.name}
                    </h6>
                    <span className="font-label text-xs font-bold text-[#1c1b1b]">
                      ${evaluationResult.recommendation.price}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectProduct(evaluationResult.recommendation)}
                    className="bg-[#1c1b1b] text-white text-[9px] font-label font-bold px-3 py-1 border border-[#1c1b1b] rounded hover:bg-[#c1f100] hover:text-[#1c1b1b] active:scale-95 cursor-pointer"
                  >
                    ADD
                  </button>
                </div>
              </div>

              {/* Reward toast */}
              <div className="bg-[#c1f100] p-2 rounded-lg text-center font-label text-xs font-extrabold text-[#1c1b1b] uppercase flex items-center justify-center gap-1 border border-[#1c1b1b]">
                🎉 +{evaluationResult.xpEarned} XP LOYALTY POINTS CREDITED!
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION: COMMUNITY LOOK FEED */}
      <section className="space-y-4">
        <h3 className="font-display text-xl uppercase tracking-tighter italic font-extrabold px-5">
          👥 COMMUNITY OUTFIT INSPIRATION
        </h3>

        <div className="space-y-6">
          {feedPosts.map(post => (
            <div
              key={post.id}
              className="bg-[#fcf9f8] border-b-2 sm:border-2 border-[#1c1b1b] sm:rounded-2xl overflow-hidden shadow-[4px_4px_0px_#1c1b1b]"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between border-b border-[#1c1b1b]/10 bg-white">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.avatar}
                    alt={post.username}
                    className="w-8 h-8 rounded-full border-2 border-[#1c1b1b] object-cover"
                  />
                  <div>
                    <h4 className="font-label text-xs font-bold text-[#1c1b1b]">@{post.username}</h4>
                    <span className="text-[9px] text-[#747688] font-label font-bold uppercase">ELITE REVIEWER</span>
                  </div>
                </div>
                <span className="text-xs bg-[#c1f100] text-[#1c1b1b] font-label font-bold px-2.5 py-0.5 rounded border border-[#1c1b1b]">
                  OOTD
                </span>
              </div>

              {/* Post Picture with Tagged item overlay pills */}
              <div className="relative aspect-square bg-[#e5e2e1] overflow-hidden">
                <img src={post.image} alt={post.caption} className="w-full h-full object-cover" />

                {/* Hover tags trigger preview */}
                <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
                  {post.taggedProducts.map(tagged => (
                    <button
                      key={tagged.id}
                      onClick={() => onSelectProduct(tagged)}
                      className="bg-[#1c1b1b]/85 backdrop-blur-md text-[#c1f100] text-[9px] font-label font-bold px-3 py-1 border border-[#c1f100]/25 rounded-full flex items-center gap-1 hover:bg-[#c1f100] hover:text-[#1c1b1b] transition-all cursor-pointer shadow-md"
                    >
                      <Tag className="w-3 h-3" /> {tagged.name.split(' ')[0]} - ${tagged.price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions toolbar */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-1.5 text-[#1c1b1b] hover:text-red-500 transition-colors cursor-pointer group active:scale-90"
                    >
                      <Heart
                        className={`w-5 h-5 ${post.hasLiked ? 'fill-red-500 text-red-500 scale-110' : ''}`}
                      />
                      <span className="font-label text-xs font-bold">{post.likes}</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-[#1c1b1b] hover:text-[#0040e0] transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-label text-xs font-bold">{(comments[post.id] || []).length}</span>
                    </button>
                  </div>

                  <button className="text-[#1c1b1b] hover:text-[#0040e0] cursor-pointer">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Caption info */}
                <div className="space-y-1.5">
                  <p className="font-sans text-xs text-[#1c1b1b] leading-relaxed">
                    <span className="font-label text-xs font-bold mr-1.5">@{post.username}</span>
                    {post.caption}
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {post.tags.map(t => (
                      <span key={t} className="text-[9px] font-label font-bold text-[#0040e0] bg-[#e1e1f5] px-2 py-0.5 rounded uppercase">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Comments collapsible panel */}
                {activeCommentsPostId === post.id && (
                  <div className="border-t border-[#1c1b1b]/10 pt-3 space-y-3 bg-white p-3 rounded-lg border border-[#1c1b1b]/15">
                    <div className="space-y-2 max-h-28 overflow-y-auto custom-scrollbar">
                      {(comments[post.id] || []).map((cmt, idx) => (
                        <div key={idx} className="text-[11px] font-sans text-[#434656] flex items-start gap-1">
                          <span className="font-label font-bold text-[#1c1b1b] shrink-0">@member:</span>
                          <span>{cmt}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 bg-[#f0eded] border border-[#1c1b1b]/20 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#0040e0] font-sans"
                        placeholder="Join look discussion..."
                        value={newCommentInput[post.id] || ''}
                        onChange={e =>
                          setNewCommentInput(prev => ({
                            ...prev,
                            [post.id]: e.target.value
                          }))
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="p-1.5 bg-[#c1f100] text-[#1c1b1b] rounded-lg border border-[#1c1b1b] active:scale-95 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

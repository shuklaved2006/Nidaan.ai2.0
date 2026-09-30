/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X
} from 'lucide-react';
import { useState, FormEvent } from 'react';
import { CartItem, Product } from '../types';

interface BagTabProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, size: string, change: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearCart: () => void;
  onNavigateToTab: (tab: 'home' | 'shop' | 'feed' | 'bag' | 'me') => void;
}

export default function BagTab({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigateToTab
}: BagTabProps) {
  // Coupon input state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);
  const [couponFlatDiscount, setCouponFlatDiscount] = useState(0);
  const [freeShippingApplied, setFreeShippingApplied] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Checkout overlay state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cardNum: '',
    cardExp: '',
    cardCvv: ''
  });

  // Success Confirmation state
  const [orderReceipt, setOrderReceipt] = useState<{
    orderId: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    shippingAddress: string;
    customerName: string;
  } | null>(null);

  // Apply Coupon logic
  const handleApplyCoupon = () => {
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();

    if (code === 'POINTS20') {
      setAppliedCoupon('POINTS20');
      setCouponDiscountPercent(20);
      setCouponFlatDiscount(0);
      setFreeShippingApplied(false);
      setCouponInput('');
    } else if (code === 'LIME10') {
      setAppliedCoupon('LIME10');
      setCouponFlatDiscount(10);
      setCouponDiscountPercent(0);
      setFreeShippingApplied(false);
      setCouponInput('');
    } else if (code === 'FREESHIP') {
      setAppliedCoupon('FREESHIP');
      setFreeShippingApplied(true);
      setCouponFlatDiscount(0);
      setCouponDiscountPercent(0);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Double check code or redeem one from the Loyalty Club!');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountPercent(0);
    setCouponFlatDiscount(0);
    setFreeShippingApplied(false);
  };

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const percentageDiscount = (subtotal * couponDiscountPercent) / 100;
  const totalDiscount = percentageDiscount + couponFlatDiscount;
  const shippingFee = subtotal > 0 ? (freeShippingApplied ? 0 : 15) : 0;
  const finalTotal = Math.max(0, subtotal - totalDiscount + shippingFee);

  // Checkout trigger logic
  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim() || !formData.cardNum.trim()) {
      alert('Please fill out all billing and delivery information.');
      return;
    }

    // Generate simulated order confirmation receipt
    setOrderReceipt({
      orderId: 'DRP-' + Math.floor(100000 + Math.random() * 900000),
      items: [...cartItems],
      subtotal,
      discount: totalDiscount,
      shipping: shippingFee,
      total: finalTotal,
      shippingAddress: formData.address,
      customerName: formData.name
    });

    onClearCart();
    setIsCheckoutOpen(false);
    handleRemoveCoupon();
    setFormData({ name: '', address: '', cardNum: '', cardExp: '', cardCvv: '' });
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in px-5 pt-4">
      <h3 className="font-display text-xl uppercase tracking-tighter italic font-extrabold flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-[#0040e0]" /> Your Shopping Bag
      </h3>

      {orderReceipt ? (
        /* ORDER RECEIPT SUCCESS SCREEN */
        <div className="bg-white border-2 border-[#1c1b1b] rounded-2xl p-5 shadow-[6px_6px_0px_#c1f100] space-y-4 animate-fade-in">
          <div className="text-center space-y-2 border-b-2 border-dashed border-[#1c1b1b]/20 pb-4">
            <span className="text-4xl">👟📦</span>
            <h4 className="font-display text-lg font-black text-emerald-600 uppercase">
              ORDER RECEIVED!
            </h4>
            <p className="font-label text-xs font-bold text-[#1c1b1b]">
              ORDER ID: {orderReceipt.orderId}
            </p>
            <p className="font-sans text-[10px] text-[#747688]">
              Your drops have been reserved. Tracking dispatch routes inside drops network...
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-label text-xs uppercase font-bold text-[#1c1b1b]">Purchased Garments:</h5>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {orderReceipt.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-2 items-center bg-[#f0eded]/50 p-2 rounded-lg border border-[#1c1b1b]/10"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-10 h-10 object-cover rounded border border-[#1c1b1b]"
                  />
                  <div className="flex-1 min-w-0">
                    <h6 className="font-display text-[10px] font-bold text-[#1c1b1b] uppercase truncate">
                      {item.product.name}
                    </h6>
                    <span className="font-label text-[9px] text-[#747688]">
                      Size {item.selectedSize} · Qty {item.quantity}
                    </span>
                  </div>
                  <span className="font-label text-[10px] font-bold text-[#1c1b1b]">
                    ${item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Confirmation */}
          <div className="border-t border-[#1c1b1b]/10 pt-3 space-y-1.5 font-label text-xs">
            <div className="flex justify-between">
              <span className="text-[#747688]">Subtotal</span>
              <span className="font-bold text-[#1c1b1b]">${orderReceipt.subtotal}</span>
            </div>
            {orderReceipt.discount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Unlocked Discount</span>
                <span className="font-bold">-${orderReceipt.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#747688]">Drops Express Shipping</span>
              <span className="font-bold text-[#1c1b1b]">${orderReceipt.shipping}</span>
            </div>
            <div className="flex justify-between text-sm font-black border-t border-[#1c1b1b]/20 pt-1.5">
              <span>Grand Total</span>
              <span className="text-[#0040e0]">${orderReceipt.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping detail receipt info */}
          <div className="bg-[#e1e1f5]/70 p-3 rounded-xl border border-[#1c1b1b]/10 space-y-2 text-xs">
            <h5 className="font-label text-[10px] uppercase font-bold text-[#0040e0] flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#0040e0]" /> DELIVERY STATUS: DISPATCH PREPARATION
            </h5>
            <div className="font-sans text-[10px] text-[#434656] space-y-0.5">
              <p>
                <strong className="font-label uppercase">Deliver To:</strong> {orderReceipt.customerName}
              </p>
              <p>
                <strong className="font-label uppercase">Address:</strong> {orderReceipt.shippingAddress}
              </p>
              <p>
                <strong className="font-label uppercase">Carrier:</strong> Drops Logistic Freight (Tracking Active)
              </p>
            </div>
          </div>

          <button
            onClick={() => setOrderReceipt(null)}
            className="w-full py-2.5 bg-[#1c1b1b] text-[#c1f100] border-2 border-[#1c1b1b] rounded-xl font-label font-bold text-xs uppercase hover:bg-[#c1f100] hover:text-[#1c1b1b] active:scale-95 transition-all cursor-pointer"
          >
            CONTINUE SHOPPING DROPS
          </button>
        </div>
      ) : cartItems.length === 0 ? (
        /* EMPTY CART VIEW */
        <div className="bg-[#fcf9f8] border-2 border-[#1c1b1b] rounded-2xl p-10 text-center space-y-4 shadow-[4px_4px_0px_#1c1b1b]">
          <div className="w-16 h-16 rounded-full bg-[#e1e1f5] border-2 border-[#1c1b1b] flex items-center justify-center text-2xl mx-auto">
            🎒
          </div>
          <div className="space-y-1.5">
            <h4 className="font-display text-md font-bold uppercase text-[#1c1b1b]">
              Your Bag is Completely Empty
            </h4>
            <p className="font-sans text-xs text-[#747688] leading-relaxed max-w-xs mx-auto">
              Find fresh summer trends, sneaker releases, or eco-reclaimed items in the Shop. Add items to checkout!
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('shop')}
            className="px-6 py-2 bg-[#c1f100] text-[#1c1b1b] border-2 border-[#1c1b1b] rounded-full font-label font-black text-xs uppercase shadow-[3px_3px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            GO TO SHOP DISCOVER
          </button>
        </div>
      ) : (
        /* CART POPULATED STATE */
        <div className="space-y-6">
          {/* List of Cart items */}
          <div className="space-y-4">
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-[#1c1b1b] rounded-xl p-3 flex gap-3 shadow-[3px_3px_0px_#1c1b1b] relative group"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg border border-[#1c1b1b] shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display text-xs font-bold text-[#1c1b1b] uppercase truncate pr-6">
                      {item.product.name}
                    </h4>
                    <p className="font-label text-[10px] text-[#747688] mt-0.5 uppercase">
                      SIZE: <strong className="text-[#1c1b1b] font-bold">{item.selectedSize}</strong>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="font-label text-sm font-bold text-[#1c1b1b]">
                      ${item.product.price}
                    </span>

                    {/* Quantity Selector buttons */}
                    <div className="flex items-center border border-[#1c1b1b] rounded-lg overflow-hidden bg-[#fcf9f8]">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, -1)}
                        className="p-1 hover:bg-[#c1f100] active:scale-90 text-[#1c1b1b] shrink-0 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 font-label text-xs font-bold text-[#1c1b1b]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, 1)}
                        className="p-1 hover:bg-[#c1f100] active:scale-90 text-[#1c1b1b] shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                  className="absolute top-3 right-3 text-[#747688] hover:text-[#ba1a1a] p-1 rounded-md border border-transparent hover:border-[#ba1a1a] hover:bg-[#ffdad6]/20 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Promo Code Input Widget */}
          <div className="bg-[#f0eded] border-2 border-[#1c1b1b] rounded-2xl p-4 shadow-[3px_3px_0px_#1c1b1b] space-y-2">
            <h4 className="font-display text-xs uppercase font-black text-[#1c1b1b]">
              PROMO CODE REDEEMER
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-white border-2 border-[#1c1b1b] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#0040e0] font-label font-bold uppercase"
                placeholder="e.g. POINTS20"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value)}
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-[#1c1b1b] text-white hover:bg-[#c1f100] hover:text-[#1c1b1b] font-label font-bold text-xs px-4 py-2 border-2 border-[#1c1b1b] rounded-xl active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                APPLY
              </button>
            </div>

            {couponError && (
              <p className="font-sans text-[10px] text-[#ba1a1a] font-bold">{couponError}</p>
            )}

            {appliedCoupon && (
              <div className="bg-[#c1f100] border border-[#1c1b1b]/20 p-2 rounded-lg flex justify-between items-center text-xs font-label font-extrabold text-[#1c1b1b] uppercase">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 stroke-[3]" /> CODE: {appliedCoupon}{' '}
                  {couponDiscountPercent > 0 && `(${couponDiscountPercent}% OFF)`}
                  {couponFlatDiscount > 0 && `(-$${couponFlatDiscount})`}
                  {freeShippingApplied && `(FREE SHIPPING)`}
                </span>
                <button
                  onClick={handleRemoveCoupon}
                  className="p-1 hover:bg-black/10 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Detailed Pricing Summary */}
          <div className="bg-white border-2 border-[#1c1b1b] rounded-2xl p-4 shadow-[4px_4px_0px_#1c1b1b] space-y-2 font-label text-xs">
            <h4 className="font-display text-xs font-black uppercase tracking-tight text-[#1c1b1b] border-b border-[#1c1b1b]/10 pb-1.5">
              SUMMARY RECEIPT
            </h4>
            <div className="flex justify-between text-[#747688]">
              <span>Original Subtotal</span>
              <span className="font-bold text-[#1c1b1b]">${subtotal.toFixed(2)}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="flex justify-between text-red-500 font-bold">
                <span>Code discount</span>
                <span>-${totalDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#747688]">
              <span>Drops Express Carrier Fee</span>
              <span className="font-bold text-[#1c1b1b]">
                {freeShippingApplied ? 'FREE SHIPPING' : `$${shippingFee}`}
              </span>
            </div>

            <div className="flex justify-between text-sm font-black text-[#1c1b1b] pt-2 border-t border-[#1c1b1b]/15">
              <span>ESTIMATED TOTAL</span>
              <span className="text-md text-[#0040e0]">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Secure Checkout trigger */}
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full py-3 bg-[#0040e0] text-white border-2 border-[#1c1b1b] rounded-xl font-label font-black text-sm uppercase shadow-[4px_4px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-[#c1f100] hover:text-[#1c1b1b] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            PROCEED TO SECURE CHECKOUT <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* --- CHECKOUT INPUT SHEETS --- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <form
            onSubmit={handleCheckoutSubmit}
            className="relative bg-[#fcf9f8] w-full max-w-lg rounded-t-3xl border-2 border-[#1c1b1b] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up"
          >
            <div className="p-5 border-b-2 border-[#1c1b1b] flex justify-between items-center bg-[#e1e1f5]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#0040e0]" />
                <h2 className="font-display text-sm uppercase font-black text-[#1c1b1b] italic">
                  SECURE VERIFICATION CHECKOUT
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 rounded-full border-2 border-[#1c1b1b] bg-white text-[#1c1b1b] hover:bg-[#c1f100] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar pb-16 text-xs font-label">
              <div className="bg-[#c1f100] text-[#1c1b1b] p-3 rounded-lg border border-[#1c1b1b] flex items-center gap-2 mb-2 font-bold">
                <Check className="w-4 h-4 shrink-0 stroke-[3]" /> SECURE CONNECTION ESTABLISHED
              </div>

              {/* Customer Name */}
              <div className="space-y-1.5">
                <label className="uppercase text-[10px] font-bold text-[#1c1b1b]">Full Delivery Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white border-2 border-[#1c1b1b] rounded-xl p-2.5 focus:outline-none focus:border-[#0040e0] font-sans"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Delivery Address */}
              <div className="space-y-1.5">
                <label className="uppercase text-[10px] font-bold text-[#1c1b1b] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Shipping Address Location
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-white border-2 border-[#1c1b1b] rounded-xl p-2.5 focus:outline-none focus:border-[#0040e0] font-sans"
                  placeholder="e.g. 1600 Amphitheatre Pkwy, Mountain View, CA"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              {/* Credit Card detail */}
              <div className="space-y-1.5">
                <label className="uppercase text-[10px] font-bold text-[#1c1b1b]">Mock Credit Card Number</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  className="w-full bg-white border-2 border-[#1c1b1b] rounded-xl p-2.5 focus:outline-none focus:border-[#0040e0] font-mono tracking-widest text-sm"
                  placeholder="4000 1234 5678 9010"
                  value={formData.cardNum}
                  onChange={e => setFormData({ ...formData, cardNum: e.target.value })}
                />
              </div>

              {/* Exp and CVV row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="uppercase text-[10px] font-bold text-[#1c1b1b]">Expiry MM/YY</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    className="w-full bg-white border-2 border-[#1c1b1b] rounded-xl p-2.5 focus:outline-none focus:border-[#0040e0] font-mono text-center text-sm"
                    placeholder="12/28"
                    value={formData.cardExp}
                    onChange={e => setFormData({ ...formData, cardExp: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="uppercase text-[10px] font-bold text-[#1c1b1b]">CVV</label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    className="w-full bg-white border-2 border-[#1c1b1b] rounded-xl p-2.5 focus:outline-none focus:border-[#0040e0] font-mono text-center text-sm"
                    placeholder="***"
                    value={formData.cardCvv}
                    onChange={e => setFormData({ ...formData, cardCvv: e.target.value })}
                  />
                </div>
              </div>

              {/* Trigger Place Order */}
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#0040e0] text-white border-2 border-[#1c1b1b] rounded-xl font-label font-black text-sm uppercase shadow-[3px_3px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 hover:bg-[#c1f100] hover:text-[#1c1b1b] transition-all cursor-pointer"
              >
                PLACE ORDER VIA SECURE TUNNEL (${finalTotal.toFixed(2)})
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

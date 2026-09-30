/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingBag, Menu } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenMenu: () => void;
}

export default function Header({ cartCount, onOpenCart, onOpenMenu }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#fcf9f8]/85 backdrop-blur-md border-b-2 border-[#1c1b1b] flex justify-between items-center w-full px-5 h-16 transition-colors">
      <div className="flex items-center gap-2">
        <button
          id="btn-menu"
          onClick={onOpenMenu}
          className="hover:bg-[#c1f100]/50 transition-colors p-2 rounded-lg flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 duration-75 cursor-pointer border border-transparent hover:border-[#1c1b1b]"
        >
          <Menu className="w-6 h-6 text-[#0040e0]" />
        </button>
        <h1 className="font-display text-2xl uppercase tracking-tighter italic font-extrabold text-[#0040e0] select-none">
          DROPS
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          id="btn-bag-header"
          onClick={onOpenCart}
          className="relative hover:bg-[#c1f100]/50 transition-colors p-2 rounded-lg flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 duration-75 cursor-pointer border border-transparent hover:border-[#1c1b1b]"
        >
          <ShoppingBag className="w-6 h-6 text-[#0040e0]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#1c1b1b] text-[#c1f100] text-xs font-bold font-label rounded-full w-5 h-5 flex items-center justify-center border border-[#c1f100]">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

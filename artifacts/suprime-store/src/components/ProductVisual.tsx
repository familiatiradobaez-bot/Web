import React from 'react';
import { Product } from '../types';

export function ProductVisual({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div
      className={`product-visual relative flex h-full w-full items-center justify-center overflow-hidden ${large ? 'min-h-[390px] md:min-h-[520px]' : 'aspect-[4/4.4]'}`}
      style={{ background: product.tone }}
      aria-label={`Visual de ${product.name}`}
    >
      <div className="absolute inset-0 opacity-30 dot-grid" />
      <div className="absolute right-[-22%] top-[-20%] h-44 w-44 rounded-full border-[18px] border-[#f6f0e6]/50" />
      <div className="absolute bottom-[-25%] left-[-8%] h-48 w-48 rounded-full bg-[#f6f0e6]/30" />
      
      {product.visual === 'bag' && (
        <div className="relative mt-7 h-44 w-44 rounded-[28px] border-4 border-[#d96a53] bg-[#ee876a] shadow-[11px_13px_0_#d76a56]">
          <div className="absolute -top-14 left-10 h-20 w-20 rounded-t-full border-[9px] border-b-0 border-[#d76a53]" />
          <div className="absolute left-7 top-9 h-2 w-28 rounded-full bg-[#f7d4bd]/60" />
          <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-[#c95847]/40" />
        </div>
      )}
      {product.visual === 'shirt' && (
        <div className="relative h-56 w-52 text-[#165b52]">
          <div className="absolute left-9 top-9 h-40 w-36 rounded-b-[25px] rounded-t-[9px] bg-[#f3f0de] shadow-[10px_10px_0_#b8c9ad]" />
          <div className="absolute left-2 top-6 h-28 w-20 -rotate-[25deg] rounded-2xl bg-[#f3f0de]" />
          <div className="absolute right-1 top-6 h-28 w-20 rotate-[25deg] rounded-2xl bg-[#f3f0de]" />
          <div className="absolute left-[76px] top-9 h-12 w-16 rounded-b-[40px] bg-[#c2d4b9]" />
          <div className="absolute left-[75px] top-24 h-1 w-16 bg-[#d4e0cd]" />
        </div>
      )}
      {product.visual === 'vase' && (
        <div className="relative h-56 w-44">
          <div className="absolute left-[52px] top-5 h-20 w-10 rounded-t-[18px] bg-[#f3e9db]" />
          <div className="absolute bottom-2 left-[16px] h-40 w-36 rounded-[35%_35%_24%_24%] bg-[#ef785e] shadow-[10px_10px_0_#d6bfa5]" />
          <div className="absolute bottom-24 left-10 h-3 w-24 rounded-full bg-[#f6cf85]" />
          <div className="absolute bottom-12 left-10 h-3 w-20 rounded-full bg-[#f6cf85]" />
        </div>
      )}
      {product.visual === 'sneaker' && (
        <div className="relative h-40 w-64 rotate-[-9deg]">
          <div className="absolute bottom-6 left-5 h-20 w-44 rounded-[60px_25px_12px_26px] bg-[#d83f4a] shadow-[10px_10px_0_#b83243]" />
          <div className="absolute bottom-2 left-3 h-12 w-60 rounded-[50%_30%_20%_30%] bg-[#fff1df]" />
          <div className="absolute left-24 top-5 h-4 w-24 rotate-[33deg] rounded-full border-b-4 border-[#f2d9ce]" />
          <div className="absolute left-40 top-12 h-5 w-16 rotate-[40deg] border-b-4 border-[#f2d9ce]" />
        </div>
      )}
      {product.visual === 'serum' && (
        <div className="relative h-56 w-36">
          <div className="absolute left-[44px] top-1 h-12 w-12 rounded-t-md bg-[#e9e3d0]" />
          <div className="absolute bottom-4 left-2 h-44 w-32 rounded-[12px_12px_28px_28px] bg-[#f6ead3] shadow-[9px_10px_0_#a9ba78]" />
          <div className="absolute bottom-16 left-7 h-12 w-20 -rotate-90 rounded-lg bg-[#a9ba78]" />
          <div className="absolute bottom-[76px] left-[45px] text-[10px] font-bold uppercase tracking-[.18em] text-[#f6ead3] [writing-mode:vertical-rl]">brisa</div>
        </div>
      )}
      {product.visual === 'lamp' && (
        <div className="relative h-60 w-52">
          <div className="absolute bottom-5 left-[99px] h-28 w-2 bg-[#7e598e]" />
          <div className="absolute bottom-1 left-16 h-3 w-24 rounded-full bg-[#7e598e]" />
          <div className="absolute left-3 top-4 h-32 w-48 rounded-[50%_50%_42%_42%] bg-[#f4e8f4] shadow-[9px_10px_0_#bda2c7]" />
          <div className="absolute left-12 top-17 h-16 w-32 rounded-full bg-[#fff0b8]/70 blur-sm" />
        </div>
      )}
      {product.visual === 'cap' && (
        <div className="relative h-48 w-56">
          <div className="absolute left-10 top-7 h-32 w-40 rounded-[70%_70%_18%_18%] bg-[#1e4a49] shadow-[10px_10px_0_#173d3b]" />
          <div className="absolute bottom-7 left-2 h-12 w-48 -rotate-6 rounded-[80%_30%_30%_70%] bg-[#286b69]" />
          <div className="absolute left-24 top-20 h-12 w-16 rounded-full bg-[#e6ddd0]/20" />
        </div>
      )}
      {product.visual === 'shorts' && (
        <div className="relative h-52 w-48">
          <div className="absolute left-6 top-8 h-32 w-20 rounded-b-[35px] rounded-t-lg bg-[#29777b] shadow-[10px_10px_0_#1f6468]" />
          <div className="absolute right-6 top-8 h-32 w-20 rounded-b-[35px] rounded-t-lg bg-[#29777b] shadow-[10px_10px_0_#1f6468]" />
          <div className="absolute left-8 top-4 h-16 w-32 rounded-t-[24px] bg-[#2b8587]" />
          <div className="absolute left-16 top-20 h-2 w-16 rounded-full bg-[#a8d8d5]" />
        </div>
      )}
      
      <span className="absolute bottom-4 left-4 font-mono-brand text-[10px] uppercase tracking-[.2em] text-[#21352f]/60">
        {product.category} / 0{product.id}
      </span>
    </div>
  );
}

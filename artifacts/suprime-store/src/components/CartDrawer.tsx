import React from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { CartItem } from '../types';
import { ProductVisual } from './ProductVisual';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  onChangeQuantity: (id: number, amount: number) => void;
  onCheckout: () => void;
  moneyFormatter: (value: number) => string;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  cartCount,
  cartTotal,
  onChangeQuantity,
  onCheckout,
  moneyFormatter,
}: CartDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#174f49]/50 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col bg-[#f6f0e6] p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e7e1d5] pb-4">
          <h3 className="font-display text-[22px] text-[#174f49]">Tu bolsa ({cartCount})</h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-[#e7e1d5]">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          {cart.length === 0 ? (
            <p className="text-center text-[13px] text-[#596660] mt-10">Tu bolsa está vacía.</p>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 rounded-xl bg-[#ebe4d8] p-3 mb-3">
                <div className="h-16 w-16 overflow-hidden rounded-lg">
                  <ProductVisual product={item.product} />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h4 className="font-display text-[15px] text-[#174f49]">{item.product.name}</h4>
                    <span className="font-mono-brand text-[12px] text-[#596660]">
                      {moneyFormatter(item.product.price)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onChangeQuantity(item.product.id, -1)} 
                      className="rounded-full bg-[#f6f0e6] p-1 text-[#174f49]"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-mono-brand text-[12px]">{item.quantity}</span>
                    <button 
                      onClick={() => onChangeQuantity(item.product.id, 1)} 
                      className="rounded-full bg-[#f6f0e6] p-1 text-[#174f49]"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-[#e7e1d5] pt-4">
            <div className="mb-4 flex items-center justify-between font-mono-brand">
              <span className="text-[13px] text-[#596660]">Total</span>
              <span className="text-[18px] font-bold text-[#174f49]">{moneyFormatter(cartTotal)}</span>
            </div>
            <button 
              onClick={onCheckout} 
              className="w-full rounded-full bg-[#174f49] py-4 text-center text-[12px] font-bold uppercase tracking-widest text-[#fff4e7] transition-colors hover:bg-[#ec684f]"
            >
              Pagar con PayPal ({moneyFormatter(cartTotal)})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { X, Shield } from 'lucide-react';
import { Product, User } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  productsList: Product[];
  moneyFormatter: (value: number) => string;
}

export function AdminModal({
  isOpen,
  onClose,
  currentUser,
  productsList,
  moneyFormatter,
}: AdminModalProps) {
  if (!isOpen || currentUser?.role !== 'admin') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#174f49]/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[28px] bg-[#f6f0e6] p-6 shadow-2xl md:p-8">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-[#e7e1d5] p-2 text-[#174f49] hover:bg-[#ded6c7]">
          <X size={18} />
        </button>
        <div className="flex items-center gap-2 text-[#ec684f] font-bold text-[12px] uppercase tracking-wider">
          <Shield size={18} /> Panel de Administración
        </div>
        <h3 className="font-display text-[26px] text-[#174f49] mt-1">Gestión de Catálogo</h3>
        
        <div className="mt-6 border-t border-[#e7e1d5] pt-4">
          <h4 className="font-bold text-[14px] text-[#174f49] mb-3">Productos Activos ({productsList.length})</h4>
          <div className="space-y-2">
            {productsList.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-[#ebe4d8] p-3 rounded-xl text-[12px]">
                <div>
                  <span className="font-bold text-[#174f49]">{p.name}</span>
                  <span className="block text-[10px] text-[#596660]">{p.category} — {moneyFormatter(p.price)}</span>
                </div>
                <span className="bg-[#174f49] text-[#fff4e7] px-2 py-0.5 rounded-full text-[10px]">
                  Stock: {p.stock || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

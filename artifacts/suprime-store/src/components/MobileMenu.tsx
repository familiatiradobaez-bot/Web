import React from 'react';
import { X } from 'lucide-react';
import { Category } from '../types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: Category) => void;
}

export function MobileMenu({ isOpen, onClose, onSelectCategory }: MobileMenuProps) {
  if (!isOpen) return null;

  const categories: Category[] = ['Todo', 'Mujer', 'Hombre', 'Niños', 'Casa', 'Bienestar'];

  return (
    <div className="fixed inset-0 z-[60] flex min-h-[100dvh] flex-col bg-[#174f49] px-6 py-7 text-[#f6f0e6] md:hidden">
      <div className="flex items-center justify-between border-b border-[#286b69] pb-4">
        <a href="#inicio" onClick={onClose} className="font-display text-3xl tracking-[-.06em]">
          suprime<span className="text-[#ec684f]">.</span>
        </a>
        <button onClick={onClose} className="rounded-full p-2 hover:bg-[#1e4a49]">
          <X size={24} />
        </button>
      </div>
      <div className="mt-8 flex flex-col gap-6 font-display text-3xl">
        {categories.map((category) => (
          <button
            key={category}
            className="text-left transition-colors hover:text-[#ec684f]"
            onClick={() => {
              onSelectCategory(category);
              onClose();
              document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

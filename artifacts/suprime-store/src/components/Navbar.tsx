import React from 'react';
import { Menu, Search, Shield, ShoppingBag, UserRound, LogOut } from 'lucide-react';
import { Category, User } from '../types';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onSelectCategory: (category: Category) => void;
  search: string;
  onSearchChange: (value: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

export function Navbar({
  onOpenMobileMenu,
  onSelectCategory,
  search,
  onSearchChange,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin,
  onLogout,
  onOpenCart,
  cartCount,
}: NavbarProps) {
  const categories: Category[] = ['Mujer', 'Hombre', 'Niños', 'Casa', 'Bienestar'];

  return (
    <header className="nav-blur sticky top-0 z-40 border-b hairline">
      <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between gap-5 px-5 md:px-10">
        <button 
          className="icon-button rounded-full p-2 md:hidden" 
          onClick={onOpenMobileMenu} 
          aria-label="Abrir menú"
        >
          <Menu size={22} strokeWidth={1.7} />
        </button>

        <a href="#inicio" className="font-display text-[30px] font-semibold tracking-[-.07em] text-[#174f49]">
          suprime<span className="text-[#ec684f]">.</span>
        </a>

        <nav className="hidden items-center gap-7 text-[12px] font-bold uppercase tracking-[.12em] md:flex">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                onSelectCategory(category);
                document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative py-3 text-[#21352f] transition-colors hover:text-[#ec684f]"
            >
              {category}
              <span className="absolute bottom-1 left-0 h-[2px] w-0 bg-[#ec684f] transition-all group-hover:w-full" />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden items-center border-b border-[#b9b3a8] px-1 py-2 lg:flex">
            <Search size={16} strokeWidth={1.8} className="mr-2 text-[#174f49]" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar algo bueno..."
              className="w-36 bg-transparent text-[12px] outline-none placeholder:text-[#7f8179]"
            />
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2 bg-[#e7e1d5] px-3 py-1.5 rounded-full">
              {currentUser.role === 'admin' && (
                <button onClick={onOpenAdmin} title="Panel de Administración" className="p-1 text-[#ec684f]">
                  <Shield size={16} />
                </button>
              )}
              <button onClick={onOpenProfile} className="text-[11px] font-bold text-[#174f49] truncate max-w-[90px]">
                {currentUser.name || currentUser.email}
              </button>
              <button onClick={onLogout} title="Cerrar sesión" className="p-1 text-[#174f49] hover:text-[#ec684f]">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth} 
              className="icon-button relative rounded-full p-2" 
              aria-label="Cuenta"
            >
              <UserRound size={19} strokeWidth={1.7} />
            </button>
          )}

          <button
            className="icon-button relative rounded-full p-2"
            onClick={onOpenCart}
            aria-label={`Abrir bolsa, ${cartCount} artículos`}
          >
            <ShoppingBag size={20} strokeWidth={1.7} />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ec684f] px-1 text-[9px] font-bold text-[#fff4e7]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

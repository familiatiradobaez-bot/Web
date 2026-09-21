import React from 'react';
import { X, Shield } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRegisterMode: boolean;
  setIsRegisterMode: (mode: boolean) => void;
  authEmail: string;
  setAuthEmail: (email: string) => void;
  authPassword: string;
  setAuthPassword: (pass: string) => void;
  authName: string;
  setAuthName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  isRegisterMode,
  setIsRegisterMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authName,
  setAuthName,
  onSubmit,
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#174f49]/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-[28px] bg-[#f6f0e6] p-6 shadow-2xl md:p-8">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-[#e7e1d5] p-2 text-[#174f49] hover:bg-[#ded6c7]">
          <X size={18} />
        </button>
        <h3 className="font-display text-[26px] text-[#174f49]">{isRegisterMode ? 'Crear cuenta' : 'Iniciar sesión'}</h3>
        <p className="mt-1 text-[13px] text-[#596660]">
          {isRegisterMode ? 'Únete a Suprime para realizar tus compras' : 'Ingresa con tus credenciales'}
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          {isRegisterMode && (
            <input 
              type="text" 
              placeholder="Tu nombre completo" 
              value={authName} 
              onChange={(e) => setAuthName(e.target.value)} 
              required 
              className="rounded-full bg-[#ebe4d8] px-5 py-3 text-[13px] text-[#174f49] outline-none" 
            />
          )}
          <input 
            type="email" 
            placeholder="Tu correo electrónico" 
            value={authEmail} 
            onChange={(e) => setAuthEmail(e.target.value)} 
            required 
            className="rounded-full bg-[#ebe4d8] px-5 py-3 text-[13px] text-[#174f49] outline-none" 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={authPassword} 
            onChange={(e) => setAuthPassword(e.target.value)} 
            required 
            className="rounded-full bg-[#ebe4d8] px-5 py-3 text-[13px] text-[#174f49] outline-none" 
          />
          <button 
            type="submit" 
            className="mt-2 rounded-full bg-[#174f49] py-3.5 text-[12px] font-bold uppercase tracking-widest text-[#fff4e7] transition-colors hover:bg-[#ec684f]"
          >
            {isRegisterMode ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-[#e7e1d5] pt-4">
          <button onClick={() => setIsRegisterMode(!isRegisterMode)} className="text-[12px] font-bold text-[#ec684f] underline">
            {isRegisterMode ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate gratis'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

export function ProfileModal({ isOpen, onClose, currentUser, onLogout }: ProfileModalProps) {
  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#174f49]/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-[28px] bg-[#f6f0e6] p-6 shadow-2xl md:p-8">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-[#e7e1d5] p-2 text-[#174f49] hover:bg-[#ded6c7]">
          <X size={18} />
        </button>
        <h3 className="font-display text-[24px] text-[#174f49]">Mi Cuenta</h3>
        <div className="mt-4 space-y-3 text-[13px] text-[#21352f]">
          <div className="bg-[#ebe4d8] p-3 rounded-xl"><span className="text-[10px] uppercase font-bold text-[#7f8179] block">Nombre</span>{currentUser.name || 'Sin especificar'}</div>
          <div className="bg-[#ebe4d8] p-3 rounded-xl"><span className="text-[10px] uppercase font-bold text-[#7f8179] block">Correo</span>{currentUser.email}</div>
          <div className="bg-[#ebe4d8] p-3 rounded-xl"><span className="text-[10px] uppercase font-bold text-[#7f8179] block">Rol</span>{currentUser.role === 'admin' ? 'Administrador' : 'Cliente'}</div>
        </div>
        <div className="mt-6 flex gap-2">
          <button onClick={onLogout} className="w-full rounded-full bg-[#ec684f] py-3 text-[12px] font-bold uppercase tracking-wider text-white">Cerrar Sesión</button>
        </div>
      </div>
    </div>
  );
}

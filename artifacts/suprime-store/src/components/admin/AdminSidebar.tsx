import React, { useState } from 'react';

interface Props {
  activeTab: 'products' | 'create';
  setActiveTab: (tab: 'products' | 'create') => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante para abrir/cerrar el menú en móviles */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '15px',
          left: '15px',
          zIndex: 1000,
          background: '#174f49',
          color: '#fff',
          border: 'none',
          padding: '10px 14px',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}
      >
        {isOpen ? '✕ Cerrar Menú' : '☰ Menú Admin'}
      </button>

      {/* Sidebar lateral con comportamiento deslizante/desplegable */}
      <aside style={{
        width: '260px',
        background: '#174f49',
        color: '#fff',
        padding: '20px',
        boxSizing: 'border-box',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        transition: 'transform 0.3s ease',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        position: window.innerWidth < 768 ? 'fixed' : 'sticky',
        left: 0
      }}>
        <h2 style={{ fontSize: '1.2rem', marginTop: '40px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>
          Panel Admin
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={() => { setActiveTab('products'); setIsOpen(false); }}
            style={{ background: activeTab === 'products' ? 'rgba(255,255,255,0.15)' : 'transparent', color: '#fff', border: 'none', padding: '12px', textAlign: 'left', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            📦 Ver Productos
          </button>
          <button 
            onClick={() => { setActiveTab('create'); setIsOpen(false); }}
            style={{ background: activeTab === 'create' ? 'rgba(255,255,255,0.15)' : 'transparent', color: '#fff', border: 'none', padding: '12px', textAlign: 'left', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ➕ Nuevo Producto
          </button>
          <a 
            href="/"
            style={{ marginTop: '20px', color: '#f4e9d8', textDecoration: 'none', fontSize: '0.9rem', padding: '10px' }}
          >
            ← Volver a la Tienda
          </a>
        </nav>
      </aside>
    </>
  );
}

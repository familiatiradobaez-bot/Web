import React from 'react';

interface Props {
  activeTab: 'products' | 'create';
  setActiveTab: (tab: 'products' | 'create') => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: Props) {
  return (
    <aside style={{ width: '260px', background: '#174f49', color: '#fff', padding: '20px', boxSizing: 'border-box' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>
        Panel Admin
      </h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          onClick={() => setActiveTab('products')}
          style={{ background: activeTab === 'products' ? 'rgba(255,255,255,0.15)' : 'transparent', color: '#fff', border: 'none', padding: '12px', textAlign: 'left', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          📦 Ver Productos
        </button>
        <button 
          onClick={() => setActiveTab('create')}
          style={{ background: activeTab === 'create' ? 'rgba(255,255,255,0.15)' : 'transparent', color: '#fff', border: 'none', padding: '12px', textAlign: 'left', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ➕ Nuevo Producto
        </button>
      </nav>
    </aside>
  );
}

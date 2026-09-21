import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import ProductForm from '../components/admin/ProductForm';
import ProductListTable from '../components/admin/ProductListTable';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'products' | 'create'>('products');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', background: '#f8f9fa' }}>
      {/* Menú lateral o de navegación */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Contenido principal según la pestaña seleccionada */}
      <main style={{ flex: 1, padding: '40px', boxSizing: 'border-box' }}>
        {activeTab === 'products' && <ProductListTable />}
        {activeTab === 'create' && <ProductForm onProductCreated={() => setActiveTab('products')} />}
      </main>
    </div>
  );
}


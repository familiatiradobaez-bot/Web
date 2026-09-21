import React, { useEffect, useState } from 'react';

export default function ProductListTable() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Inventario de Productos</h2>
      {products.length === 0 ? (
        <p>No hay productos registrados todavía.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', color: '#555' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Nombre</th>
              <th style={{ padding: '10px' }}>Categoría</th>
              <th style={{ padding: '10px' }}>Precio</th>
              <th style={{ padding: '10px' }}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{p.id}</td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{p.name}</td>
                <td style={{ padding: '10px' }}>{p.category}</td>
                <td style={{ padding: '10px' }}>${p.price}</td>
                <td style={{ padding: '10px' }}>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

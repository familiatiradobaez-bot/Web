import React, { useState } from 'react';

export default function ProductForm({ onProductCreated }: { onProductCreated: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hogar',
    price: '',
    oldPrice: '',
    stock: '',
    tag: 'Nuevo',
    description: '',
    tone: '#f4e9d8',
    accent: '#174f49',
    visual: 'bag'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
          stock: formData.stock ? parseInt(formData.stock, 10) : 0
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('¡Producto creado con éxito!');
        setTimeout(() => {
          onProductCreated(); // Regresa a la lista de productos automáticamente
        }, 1000);
      } else {
        setMessage(`Error: ${data.error || 'No se pudo crear el producto'}`);
      }
    } catch (err: any) {
      setMessage(`Error de red: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '700px' }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Crear Nuevo Producto</h2>

      {message && (
        <div style={{ padding: '12px', marginBottom: '20px', background: message.includes('éxito') ? '#d4edda' : '#f8d7da', color: message.includes('éxito') ? '#155724' : '#721c24', borderRadius: '4px' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>Nombre del Producto:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>Categoría:</label>
          <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}>
            <option value="Hogar">Hogar</option>
            <option value="Papelería">Papelería</option>
            <option value="Cocina">Cocina</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>Precio:</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>Precio Anterior (Opcional):</label>
            <input type="number" step="0.01" name="oldPrice" value={formData.oldPrice} onChange={handleChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>Stock:</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>Etiqueta (Tag):</label>
            <input type="text" name="tag" value={formData.tag} onChange={handleChange} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>Descripción:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '12px 20px', background: '#174f49', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
          {loading ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </form>
    </div>
  );
}

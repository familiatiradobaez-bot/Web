import React, { useState, useEffect } from 'react';

export default function ProductForm({ onProductCreated }: { onProductCreated: () => void }) {
  const [categories, setCategories] = useState<{ [key: string]: string[] }>({
    'Hogar': ['Muebles', 'Lámparas', 'Decoración'],
    'Papelería': ['Cuadernos', 'Bolígrafos'],
  });

  const [selectedCategory, setSelectedCategory] = useState('Hogar');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Muebles');
  
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    stock: '',
    tag: 'Nuevo',
    description: '',
    image: '',
    tone: '#f4e9d8',
    accent: '#174f49',
    visual: 'bag'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Sincronizar categorías existentes desde la base de datos de productos
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const loadedCats: { [key: string]: string[] } = { ...categories };
          data.forEach((p: any) => {
            if (p.category) {
              // Si guardamos con formato "Principal / Subcategoría"
              const parts = p.category.split(' / ');
              const cat = parts[0];
              const sub = parts[1] || 'General';

              if (!loadedCats[cat]) loadedCats[cat] = [];
              if (!loadedCats[cat].includes(sub)) loadedCats[cat].push(sub);
            }
          });
          setCategories(loadedCats);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Crear Categoría Principal al instante
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const cat = newCategoryName.trim();
    if (!categories[cat]) {
      setCategories({ ...categories, [cat]: [] });
    }
    setSelectedCategory(cat);
    setSelectedSubcategory('');
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  // Crear Subcategoría al instante
  const handleAddSubcategory = () => {
    if (!newSubcategoryName.trim()) return;
    const sub = newSubcategoryName.trim();
    const currentSubs = categories[selectedCategory] || [];
    
    if (!currentSubs.includes(sub)) {
      setCategories({
        ...categories,
        [selectedCategory]: [...currentSubs, sub]
      });
    }
    setSelectedSubcategory(sub);
    setNewSubcategoryName('');
    setIsAddingSubcategory(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Combinar categoría y subcategoría para guardarla limpia en la BD (Ej: "Hogar / Muebles")
    const finalCategory = selectedSubcategory 
      ? `${selectedCategory} / ${selectedSubcategory}` 
      : selectedCategory;

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category: finalCategory,
          price: parseFloat(formData.price),
          oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
          stock: formData.stock ? parseInt(formData.stock, 10) : 0
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('¡Producto y sección guardados con éxito!');
        setTimeout(() => {
          onProductCreated();
        }, 1000);
      } else {
        setMessage(`Error: ${data.error || 'No se pudo guardar'}`);
      }
    } catch (err: any) {
      setMessage(`Error de red: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '700px' }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Crear Nuevo Producto y Secciones</h2>

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

        {/* CATEGORÍA PRINCIPAL */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>Categoría Principal (Ej: Casa):</label>
          {!isAddingCategory ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <select 
                value={selectedCategory} 
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory(categories[e.target.value]?.[0] || '');
                }} 
                style={{ flex: 1, padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                {Object.keys(categories).map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
              <button 
                type="button" 
                onClick={() => setIsAddingCategory(true)}
                style={{ padding: '10px 15px', background: '#e7e1d5', color: '#174f49', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                + Nueva Principal
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Nombre de la categoría principal" 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)}
                style={{ flex: 1, padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} 
              />
              <button type="button" onClick={handleAddCategory} style={{ padding: '10px 15px', background: '#174f49', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Aceptar</button>
              <button type="button" onClick={() => setIsAddingCategory(false)} style={{ padding: '10px 15px', background: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
            </div>
          )}
        </div>

        {/* SUBCATEGORÍA */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>Subsección / Subcategoría (Ej: Muebles, Lámparas):</label>
          {!isAddingSubcategory ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <select 
                value={selectedSubcategory} 
                onChange={(e) => setSelectedSubcategory(e.target.value)} 
                style={{ flex: 1, padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="">-- Sin subsección --</option>
                {(categories[selectedCategory] || []).map((sub, index) => (
                  <option key={index} value={sub}>{sub}</option>
                ))}
              </select>
              <button 
                type="button" 
                onClick={() => setIsAddingSubcategory(true)}
                style={{ padding: '10px 15px', background: '#e7e1d5', color: '#174f49', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                + Nueva Subsección
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Nombre de la subsección (ej. lámparas)" 
                value={newSubcategoryName} 
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                style={{ flex: 1, padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} 
              />
              <button type="button" onClick={handleAddSubcategory} style={{ padding: '10px 15px', background: '#174f49', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Aceptar</button>
              <button type="button" onClick={() => setIsAddingSubcategory(false)} style={{ padding: '10px 15px', background: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
            </div>
          )}
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
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>URL de la Imagen:</label>
          <input 
            type="url" 
            name="image" 
            placeholder="https://ejemplo.com/imagen.jpg" 
            value={formData.image} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>Descripción:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '12px 20px', background: '#174f49', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
          {loading ? 'Guardando...' : 'Guardar Producto y Sección'}
        </button>
      </form>
    </div>
  );
}

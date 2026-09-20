import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, useLocation } from 'wouter';
import { 
  ShoppingBag, User, LogOut, ShieldCheck, X, Plus, Minus, Trash2, 
  Settings, Save, CheckCircle, Package, TrendingUp, Users, ArrowRight, Menu, 
  Edit3, Image, Tag, Scale, Ruler, Layers, Eye
} from 'lucide-react';

/* ==========================================================================
   1. TIPOS DE DATOS & ESTRUCTURA DE PRODUCTO EXTENDIDA
   ========================================================================== */
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  stock: number;
  image: string;
  description: string;
  sizes?: string[];     // Ej: ['S', 'M', 'L', 'XL']
  dimensions?: string; // Ej: '30x20x10 cm'
  weight?: string;     // Ej: '0.5 kg'
  tag?: string;        // Ej: 'Nuevo', 'Oferta'
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  role?: 'admin' | 'user';
}

const queryClient = new QueryClient();

// Componente fallback visual para productos sin imagen
const ProductVisual = ({ category }: { category: string }) => (
  <div className="w-full h-full bg-stone-100 flex flex-col items-center justify-center p-6 text-stone-400">
    <Package className="w-10 h-10 stroke-1 mb-1" />
    <span className="text-[10px] uppercase tracking-wider font-mono">{category}</span>
  </div>
);

export default function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  );
}

function MainApp() {
  const [, setLocation] = useLocation();

  /* ==========================================================================
     2. ESTADOS GLOBALES DE LA APLICACIÓN
     ========================================================================== */
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'metrics' | 'products' | 'orders'>('products');

  // Estado del usuario activo
  const [user, setUser] = useState<UserProfile | null>({
    name: "José Tirado",
    email: "jose@ejemplo.com",
    phone: "+1 809 555 0199",
    address: "Calle Principal #12",
    city: "Puerto Plata",
    role: "admin"
  });

  const [editProfileData, setEditProfileData] = useState<UserProfile>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    role: user?.role || 'user'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  /* ==========================================================================
     3. PERSISTENCIA DE CARRITO (LOCALSTORAGE)
     ========================================================================== */
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('suprime_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('suprime_cart', JSON.stringify(cart));
  }, [cart]);

  /* ==========================================================================
     4. LISTA DE PRODUCTOS & ESTADO DEL FORMULARIO DE ADMIN
     ========================================================================== */
  const [productsList, setProductsList] = useState<Product[]>([
    {
      id: 1,
      name: "Bolso de Cuero Minimalista",
      category: "Accesorios",
      price: 185.00,
      oldPrice: 210.00,
      stock: 12,
      image: "",
      description: "Cuero genuino confeccionado a mano con acabados de alta calidad.",
      sizes: ["Única"],
      dimensions: "25x18x8 cm",
      weight: "0.45 kg",
      tag: "Favorito"
    },
    {
      id: 2,
      name: "Camisa de Lino Blanco",
      category: "Ropa",
      price: 95.00,
      stock: 25,
      image: "",
      description: "Lino 100% orgánico transpirable ideal para clima cálido.",
      sizes: ["S", "M", "L", "XL"],
      dimensions: "N/A",
      weight: "0.20 kg",
      tag: "Nuevo"
    }
  ]);

  // Formulario temporal para Crear / Editar Producto
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: 'Accesorios',
    price: 0,
    oldPrice: 0,
    stock: 1,
    image: '',
    description: '',
    sizes: [],
    dimensions: '',
    weight: '',
    tag: ''
  });

  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  /* ==========================================================================
     5. FUNCIONES DE GESTIÓN DEL CARRITO
     ========================================================================== */
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  /* ==========================================================================
     6. FUNCIONES DEL PANEL ADMIN (CREAR, EDITAR, BORRAR PRODUCTOS)
     ========================================================================== */
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (editingProductId) {
      // Actualizar producto existente
      setProductsList(prev => prev.map(p => p.id === editingProductId ? { ...p, ...productForm } as Product : p));
      setEditingProductId(null);
    } else {
      // Crear nuevo producto
      const newProd: Product = {
        id: Date.now(),
        name: productForm.name || 'Nuevo Artículo',
        category: productForm.category || 'General',
        price: Number(productForm.price) || 0,
        oldPrice: Number(productForm.oldPrice) || 0,
        stock: Number(productForm.stock) || 0,
        image: productForm.image || '',
        description: productForm.description || '',
        sizes: productForm.sizes || [],
        dimensions: productForm.dimensions || '',
        weight: productForm.weight || '',
        tag: productForm.tag || ''
      };
      setProductsList(prev => [newProd, ...prev]);
    }

    // Resetear formulario
    setProductForm({ name: '', category: 'Accesorios', price: 0, oldPrice: 0, stock: 1, image: '', description: '', sizes: [], dimensions: '', weight: '', tag: '' });
  };

  const handleEditClick = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm(p);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm('¿Seguro que deseas eliminar este artículo del catálogo?')) {
      setProductsList(prev => prev.filter(p => p.id !== id));
    }
  };
      return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans antialiased">
      {/* HEADER / NAVEGACIÓN */}
      <nav className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-stone-600 hover:text-black">
              <Menu className="w-6 h-6" />
            </button>
            <a href="/" className="text-2xl font-serif tracking-widest font-bold uppercase">SUPRIME</a>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-stone-600 font-medium">
            <a href="#" className="hover:text-black transition">Catálogo</a>
            <a href="#" className="hover:text-black transition">Colección</a>
            <a href="#" className="hover:text-black transition">Nosotros</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-stone-200/50 transition text-sm font-medium">
                  <User className="w-4 h-4 text-stone-700" />
                  <span className="hidden sm:inline">{user.name}</span>
                </button>

                {/* BOTÓN EXCLUSIVO DE ADMIN */}
                {user.role === 'admin' && (
                  <button onClick={() => setIsAdminOpen(true)} className="p-2 rounded-full text-amber-700 hover:bg-amber-100/50 transition" title="Panel Admin">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                  </button>
                )}

                <button onClick={() => setUser(null)} className="p-2 text-stone-400 hover:text-stone-700 transition" title="Cerrar Sesión">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="text-sm font-medium uppercase tracking-wider hover:underline">Ingresar</button>
            )}

            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-stone-800 hover:scale-105 transition">
              <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* CATÁLOGO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-serif text-3xl mb-8 text-stone-900">Catálogo Activo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productsList.map(product => (
            <div key={product.id} className="group bg-white rounded-lg border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="aspect-square bg-stone-100 relative overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <ProductVisual category={product.category} />
                )}
                {product.tag && (
                  <span className="absolute top-3 left-3 bg-stone-900 text-white text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded">
                    {product.tag}
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold">{product.category}</span>
                  <h3 className="font-serif text-lg font-medium text-stone-900 mt-1">{product.name}</h3>
                  <p className="text-xs text-stone-500 mt-2 line-clamp-2">{product.description}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-900">${product.price.toFixed(2)}</span>
                    {product.oldPrice ? <span className="text-xs text-stone-400 line-through ml-2">${product.oldPrice.toFixed(2)}</span> : null}
                  </div>
                  <button onClick={() => addToCart(product)} className="px-4 py-2 bg-stone-900 text-white text-xs font-medium uppercase tracking-wider rounded hover:bg-black transition">
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ==========================================================================
         7. PANEL DE ADMINISTRACIÓN OCULTO (SOLO ROL ADMIN)
         ========================================================================== */}
      {isAdminOpen && user?.role === 'admin' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col">
            
            {/* Header Admin */}
            <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h2 className="font-serif font-medium text-lg tracking-wide">Terminal de Administración</h2>
              </div>
              <button onClick={() => setIsAdminOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pestañas Admin */}
            <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 gap-6 text-xs uppercase font-semibold tracking-wider text-stone-600">
              <button onClick={() => setAdminTab('products')} className={`pb-3 ${adminTab === 'products' ? 'border-b-2 border-black text-black' : 'hover:text-black'}`}>Gestión de Artículos</button>
              <button onClick={() => setAdminTab('metrics')} className={`pb-3 ${adminTab === 'metrics' ? 'border-b-2 border-black text-black' : 'hover:text-black'}`}>Métricas & Ventas</button>
            </div>

            {/* Cuerpo Admin (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              {adminTab === 'products' && (
                <>
                  {/* FORMULARIO CREAR / EDITAR */}
                  <form onSubmit={handleSaveProduct} className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                      <Edit3 className="w-4 h-4" /> {editingProductId ? 'Editar Artículo' : 'Nuevo Artículo de Inventario'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">Nombre del Producto</label>
                        <input type="text" value={productForm.name || ''} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full px-3 py-2 border rounded text-xs" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">Categoría</label>
                        <select value={productForm.category || 'Accesorios'} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="w-full px-3 py-2 border rounded text-xs">
                          <option>Accesorios</option><option>Ropa</option><option>Hogar</option><option>Calzado</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">Precio (RD$/USD)</label>
                        <input type="number" step="0.01" value={productForm.price || 0} onChange={e => setProductForm({ ...productForm, price: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded text-xs" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">Precio Anterior</label>
                        <input type="number" step="0.01" value={productForm.oldPrice || 0} onChange={e => setProductForm({ ...productForm, oldPrice: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded text-xs" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">Stock Disponible</label>
                        <input type="number" value={productForm.stock || 0} onChange={e => setProductForm({ ...productForm, stock: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded text-xs" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">Etiqueta (Tag)</label>
                        <input type="text" placeholder="Ej: Oferta" value={productForm.tag || ''} onChange={e => setProductForm({ ...productForm, tag: e.target.value })} className="w-full px-3 py-2 border rounded text-xs" />
                      </div>
                    </div>

                    {/* Especificaciones Técnicas (Tallas, Medidas, Peso) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-stone-200 pt-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1 flex items-center gap-1"><Ruler className="w-3 h-3" /> Medidas</label>
                        <input type="text" placeholder="Ej: 30x20x10 cm" value={productForm.dimensions || ''} onChange={e => setProductForm({ ...productForm, dimensions: e.target.value })} className="w-full px-3 py-2 border rounded text-xs" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1 flex items-center gap-1"><Scale className="w-3 h-3" /> Peso</label>
                        <input type="text" placeholder="Ej: 0.5 kg" value={productForm.weight || ''} onChange={e => setProductForm({ ...productForm, weight: e.target.value })} className="w-full px-3 py-2 border rounded text-xs" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1 flex items-center gap-1"><Image className="w-3 h-3" /> URL Imagen</label>
                        <input type="text" placeholder="https://..." value={productForm.image || ''} onChange={e => setProductForm({ ...productForm, image: e.target.value })} className="w-full px-3 py-2 border rounded text-xs" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">Descripción</label>
                      <textarea rows={2} value={productForm.description || ''} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full px-3 py-2 border rounded text-xs resize-none" />
                    </div>

                    <div className="flex justify-end gap-2">
                      {editingProductId && (
                        <button type="button" onClick={() => { setEditingProductId(null); setProductForm({}); }} className="px-4 py-2 border rounded text-xs">Cancelar</button>
                      )}
                      <button type="submit" className="px-5 py-2 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-black transition">
                        {editingProductId ? 'Guardar Cambios' : 'Agregar Al Catálogo'}
                      </button>
                    </div>
                  </form>

                  {/* LISTA DE ARTÍCULOS EXISTENTES */}
                  <div className="border border-stone-200 rounded-lg overflow-hidden text-xs">
                    <div className="grid grid-cols-5 bg-stone-100 p-3 font-semibold text-stone-600">
                      <span>Artículo</span><span>Categoría</span><span>Precio</span><span>Stock</span><span className="text-right">Acciones</span>
                    </div>
                    {productsList.map(p => (
                      <div key={p.id} className="grid grid-cols-5 p-3 border-b border-stone-100 items-center">
                        <span className="font-medium text-stone-900">{p.name}</span>
                        <span className="text-stone-500">{p.category}</span>
                        <span className="font-semibold">${p.price.toFixed(2)}</span>
                        <span>{p.stock} ud.</span>
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEditClick(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteClick(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {adminTab === 'metrics' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-stone-50 rounded-lg border"><span className="text-xs text-stone-500 uppercase">Ventas</span><p className="text-2xl font-bold mt-1">$2,450.00</p></div>
                  <div className="p-4 bg-stone-50 rounded-lg border"><span className="text-xs text-stone-500 uppercase">Pedidos</span><p className="text-2xl font-bold mt-1">18</p></div>
                  <div className="p-4 bg-stone-50 rounded-lg border"><span className="text-xs text-stone-500 uppercase">Clientes</span><p className="text-2xl font-bold mt-1">12</p></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
              {/* MODAL DE PERFIL DE USUARIO */}
      {isProfileOpen && user && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-stone-200">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-stone-700" />
                <h2 className="font-serif font-medium text-lg text-stone-900">Mi Cuenta</h2>
              </div>
              <button onClick={() => setIsProfileOpen(false)} className="text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setUser(editProfileData); setSavedSuccess(true); setTimeout(() => setSavedSuccess(false), 2000); }} className="p-6 space-y-4">
              {savedSuccess && <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded">Cambios guardados.</div>}
              <div><label className="block text-xs uppercase text-stone-600 mb-1">Nombre</label><input type="text" value={editProfileData.name} onChange={e => setEditProfileData({ ...editProfileData, name: e.target.value })} className="w-full px-3 py-2 border rounded text-xs" required /></div>
              <div><label className="block text-xs uppercase text-stone-600 mb-1">Correo</label><input type="email" value={editProfileData.email} disabled className="w-full px-3 py-2 border bg-stone-100 text-xs text-stone-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs uppercase text-stone-600 mb-1">Teléfono</label><input type="text" value={editProfileData.phone || ''} onChange={e => setEditProfileData({ ...editProfileData, phone: e.target.value })} className="w-full px-3 py-2 border rounded text-xs" /></div>
                <div><label className="block text-xs uppercase text-stone-600 mb-1">Ciudad</label><input type="text" value={editProfileData.city || ''} onChange={e => setEditProfileData({ ...editProfileData, city: e.target.value })} className="w-full px-3 py-2 border rounded text-xs" /></div>
              </div>
              <div><label className="block text-xs uppercase text-stone-600 mb-1">Dirección</label><textarea rows={2} value={editProfileData.address || ''} onChange={e => setEditProfileData({ ...editProfileData, address: e.target.value })} className="w-full px-3 py-2 border rounded text-xs resize-none" /></div>

              <div className="pt-4 flex justify-between items-center border-t">
                {user.role === 'admin' ? (
                  <button type="button" onClick={() => { setIsProfileOpen(false); setIsAdminOpen(true); }} className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Ir a Panel Admin
                  </button>
                ) : <span />}
                <button type="submit" className="px-5 py-2 bg-stone-900 text-white text-xs uppercase font-semibold rounded">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER DEL CARRITO DE COMPRAS */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2"><ShoppingBag className="w-5 h-5" /><h2 className="font-serif font-medium text-lg">Tu Bolsa ({cart.length})</h2></div>
                <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
              </div>

              <div className="divide-y divide-stone-100 max-h-[60vh] overflow-y-auto my-4">
                {cart.length === 0 ? (
                  <p className="text-center py-12 text-stone-400 text-sm">Tu bolsa está vacía.</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                      <div><h4 className="font-medium text-sm text-stone-900">{item.name}</h4><p className="text-xs text-stone-500 mt-1">${item.price.toFixed(2)} c/u</p></div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1"><Minus className="w-3 h-3" /></button>
                          <span className="px-2 text-xs font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1"><Plus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between mb-4"><span className="text-sm font-medium uppercase text-stone-600">Total</span><span className="text-lg font-bold">${cartTotal.toFixed(2)}</span></div>
                <button onClick={() => window.location.href = '/api/checkout'} className="w-full py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest rounded hover:bg-black transition flex items-center justify-center gap-2">
                  Proceder al Pago <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

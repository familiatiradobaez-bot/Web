import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Heart, Plus, Sparkles } from 'lucide-react';
import { Category, Product, CartItem, User } from '../types';
import { ProductVisual } from '../components/ProductVisual';
import { Navbar } from '../components/Navbar';
import { MobileMenu } from '../components/MobileMenu';
import { CartDrawer } from '../components/CartDrawer';
import { AuthModal, ProfileModal } from '../components/AuthModals';
import { AdminModal } from '../components/AdminModal';

const categoriesData: { label: Category; count: string }[] = [
  { label: 'Todo', count: '24' },
  { label: 'Mujer', count: '08' },
  { label: 'Hombre', count: '06' },
  { label: 'Niños', count: '04' },
  { label: 'Casa', count: '03' },
  { label: 'Bienestar', count: '03' },
];

const money = (value: number) =>
  new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 }).format(value).replace('DOP', 'RD$');

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todo');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('suprime_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('suprime_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  // ESTADO DINÁMICO DE PRODUCTOS DESDE D1
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    document.title = 'Suprime — cosas buenas para todos los días';
    
    // Cargar productos desde la API conectada a D1
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProductsList(data);
        }
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error('Error al cargar productos:', err);
        setLoadingProducts(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('suprime_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return productsList.filter((product) => {
      const inCategory = selectedCategory === 'Todo' || product.category === selectedCategory;
      const matchesSearch = !term || `${product.name} ${product.category}`.toLowerCase().includes(term);
      return inCategory && matchesSearch;
    });
  }, [search, selectedCategory, productsList]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const showToast = (message: string) => setToast(message);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) return current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...current, { product, quantity }];
    });
    showToast(`${product.name} está en tu bolsa`);
  };

  const changeQuantity = (id: number, amount: number) => {
    setCart((current) => current.map((item) => item.product.id === id ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item).filter((item) => item.quantity > 0));
  };

  const toggleFavorite = (id: number) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    showToast(favorites.includes(id) ? 'Quitado de tus favoritos' : 'Guardado en tus favoritos');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegisterMode 
      ? { email: authEmail, password: authPassword, name: authName } 
      : { email: authEmail, password: authPassword };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Error al procesar la solicitud');
        return;
      }

      if (isRegisterMode) {
        showToast('¡Cuenta creada! Inicia sesión para continuar');
        setIsRegisterMode(false);
      } else {
        setCurrentUser(data.user);
        localStorage.setItem('suprime_user', JSON.stringify(data.user));
        showToast(`¡Hola de nuevo, ${data.user.name || data.user.email}!`);
        setAuthModalOpen(false);
      }
    } catch (err) {
      alert('Error de conexión con el servidor');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('suprime_user');
    setProfileModalOpen(false);
    setAdminModalOpen(false);
    showToast('Sesión cerrada');
  };

  const handleCheckoutClick = async () => {
    if (!currentUser) {
      setCartOpen(false);
      setAuthModalOpen(true);
      showToast('Por favor, inicia sesión para realizar tu compra');
      return;
    }

    try {
      showToast('Iniciando pago con PayPal...');
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal }),
      });
      const data = await res.json();
      const approveUrl = data.links?.find((l: any) => l.rel === 'approve')?.href;
      if (approveUrl) {
        window.location.href = approveUrl;
      } else {
        alert('Error al generar la orden de PayPal.');
      }
    } catch (err) {
      alert('Error de conexión con el servidor de cobros.');
    }
  };

  return (
    <div className="store-shell min-h-[100dvh]">
      <div className="announcement flex h-9 items-center justify-center overflow-hidden text-[10px] font-bold uppercase tracking-[.17em]">
        <div className="marquee-track flex min-w-max gap-12">
          <span>Envío gratis desde RD$3,500</span><span>·</span><span>Compra local, vive bonito</span><span>·</span><span>Envíos a todo el país</span><span>·</span>
          <span>Envío gratis desde RD$3,500</span><span>·</span><span>Compra local, vive bonito</span><span>·</span><span>Envíos a todo el país</span>
        </div>
      </div>

      <Navbar
        onOpenMobileMenu={() => setMobileMenu(true)}
        onSelectCategory={setSelectedCategory}
        search={search}
        onSearchChange={setSearch}
        currentUser={currentUser}
        onOpenAuth={() => { setAuthEmail(''); setAuthPassword(''); setAuthModalOpen(true); }}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onLogout={logout}
        onOpenCart={() => setCartOpen(true)}
        cartCount={cartCount}
      />

      <MobileMenu
        isOpen={mobileMenu}
        onClose={() => setMobileMenu(false)}
        onSelectCategory={setSelectedCategory}
      />

      <main id="inicio">
        <section className="mx-auto grid max-w-[1440px] gap-8 px-5 pb-14 pt-7 md:grid-cols-[1.02fr_.98fr] md:px-10 md:pb-24 md:pt-12">
          <div className="flex flex-col justify-center">
            <div className="fade-up mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#ec684f]"><Sparkles size={14} /> Productos seleccionados para tu día a día</div>
            <h1 className="fade-up fade-up-delay-1 max-w-[650px] font-display text-[clamp(3.6rem,8.2vw,8.4rem)] leading-[.85] tracking-[-.075em] text-[#174f49]">Cosas<br /><span className="ml-[.35em] text-[#ec684f]">buenas</span><br />para todos.</h1>
            <p className="fade-up fade-up-delay-2 mt-8 max-w-[430px] text-[15px] leading-7 text-[#596660]">Una selección de hallazgos útiles, bonitos y con personalidad. Sin ruido. Solo lo que sí quieres tener cerca.</p>
            <div className="fade-up fade-up-delay-3 mt-9 flex flex-wrap items-center gap-4">
              <button onClick={() => { setSelectedCategory('Todo'); document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' }); }} className="group flex items-center gap-4 rounded-full bg-[#ec684f] px-6 py-3.5 text-[12px] font-bold uppercase tracking-[.12em] text-[#fff4e7] transition-transform hover:-translate-y-1">Explorar novedades <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button>
            </div>
          </div>
          <div className="hero-grid relative min-h-[470px] overflow-hidden rounded-[28px] bg-[#d8e5dc] md:min-h-[630px]">
            <div className="absolute left-5 top-5 z-10 rounded-full bg-[#f6f0e6] px-4 py-2 font-mono-brand text-[10px] uppercase tracking-[.14em] text-[#174f49]">Selección del mes</div>
            <div className="absolute left-[12%] top-[14%] h-[65%] w-[64%] rotate-[-7deg] rounded-[45%] bg-[#ec684f] opacity-90" />
            <div className="absolute bottom-[-6%] right-[-7%] h-[60%] w-[63%] rounded-t-[55%] bg-[#f5d787]" />
            <div className="float-soft absolute bottom-[11%] left-[18%] z-10 h-[54%] w-[46%] rounded-[48%_48%_12%_12%] bg-[#f4e9d8] shadow-[14px_18px_0_#b9cdbb]">
              <div className="absolute left-1/2 top-[-17%] h-[33%] w-[49%] -translate-x-1/2 rounded-full bg-[#f4e9d8] shadow-[inset_-6px_-7px_0_#dfd1be]" />
            </div>
            <div className="absolute right-[9%] top-[18%] rotate-[12deg] text-right font-display text-[42px] leading-[.85] tracking-[-.08em] text-[#174f49]">made<br />to stay.</div>
          </div>
        </section>

        <section id="productos" className="mx-auto max-w-[1440px] px-5 py-12 md:px-10">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono-brand text-[11px] uppercase tracking-[.18em] text-[#ec684f]">Catálogo activo</p>
              <h2 className="font-display text-[40px] tracking-[-.06em] text-[#174f49]">Explora la colección.</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {categoriesData.map((cat) => (
                <button key={cat.label} onClick={() => setSelectedCategory(cat.label)} className={`rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[.1em] transition-colors ${selectedCategory === cat.label ? 'bg-[#174f49] text-[#fff4e7]' : 'bg-[#e7e1d5] text-[#21352f] hover:bg-[#ded6c7]'}`}>
                  {cat.label} <span className="ml-1 opacity-60">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {loadingProducts ? (
            <div className="py-20 text-center font-mono-brand text-[13px] text-[#596660]">Cargando catálogo desde la base de datos...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center font-mono-brand text-[13px] text-[#596660]">No hay productos disponibles en esta categoría.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-[20px] bg-[#ebe4d8] p-4 transition-all duration-300 hover:shadow-lg">
                  <div className="relative overflow-hidden rounded-[14px]">
                    {product.tag && <span className="absolute left-3 top-3 z-10 rounded-full bg-[#174f49] px-3 py-1 font-mono-brand text-[9px] uppercase tracking-[.15em] text-[#fff4e7]">{product.tag}</span>}
                    <button onClick={() => toggleFavorite(product.id)} className="absolute right-3 top-3 z-10 rounded-full bg-[#f6f0e6]/80 p-2 text-[#174f49] backdrop-blur-sm transition-colors hover:bg-[#f6f0e6]">
                      <Heart size={16} className={favorites.includes(product.id) ? 'fill-[#ec684f] text-[#ec684f]' : ''} />
                    </button>
                    <ProductVisual product={product} />
                  </div>
                  <div className="mt-4 flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-display text-[18px] tracking-tight text-[#174f49]">{product.name}</h3>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#596660]">{product.description}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between pt-2">
                      <span className="font-mono-brand text-[15px] font-bold text-[#174f49]">{money(product.price)}</span>
                      <button onClick={() => addToCart(product)} className="rounded-full bg-[#174f49] p-2.5 text-[#fff4e7] transition-colors hover:bg-[#ec684f]"><Plus size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onChangeQuantity={changeQuantity}
        onCheckout={handleCheckoutClick}
        moneyFormatter={money}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        isRegisterMode={isRegisterMode}
        setIsRegisterMode={setIsRegisterMode}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authName={authName}
        setAuthName={setAuthName}
        onSubmit={handleAuthSubmit}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentUser={currentUser}
        onLogout={logout}
      />

      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        currentUser={currentUser}
        productsList={productsList}
        moneyFormatter={money}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-full bg-[#174f49] px-5 py-3 font-mono-brand text-[12px] text-[#fff4e7] shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

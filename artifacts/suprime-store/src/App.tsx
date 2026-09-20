import { useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Heart,
  Instagram,
  Menu,
  Minus,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  UserRound,
  X,
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';

type Category = 'Todo' | 'Mujer' | 'Hombre' | 'Niños' | 'Casa' | 'Bienestar';
type Product = {
  id: number;
  name: string;
  category: Exclude<Category, 'Todo'>;
  price: number;
  oldPrice?: number;
  tag?: string;
  tone: string;
  accent: string;
  visual: 'bag' | 'shirt' | 'vase' | 'sneaker' | 'serum' | 'lamp' | 'cap' | 'shorts';
  description: string;
};
type CartItem = { product: Product; quantity: number };

const queryClient = new QueryClient();

const products: Product[] = [
  { id: 1, name: 'Bolso Sol de Domingo', category: 'Mujer', price: 1890, oldPrice: 2290, tag: 'Favorito', tone: '#efcbb6', accent: '#ec684f', visual: 'bag', description: 'Textura tejida, interior amplio y el tipo de forma que mejora cualquier look.' },
  { id: 2, name: 'Camisa Lino Sal Marina', category: 'Hombre', price: 2350, tag: 'Nuevo', tone: '#dbe4d3', accent: '#165b52', visual: 'shirt', description: 'Lino suave y fresco para días largos, desde el malecón hasta la mesa.' },
  { id: 3, name: 'Jarrón Arcoíris Bajo', category: 'Casa', price: 1290, tone: '#e9d7bd', accent: '#ee6c52', visual: 'vase', description: 'Una silueta escultórica en cerámica que trae alegría sin pedir permiso.' },
  { id: 4, name: 'Runner Rayo Coral', category: 'Mujer', price: 3190, oldPrice: 3890, tag: 'Últimas tallas', tone: '#f3c8ca', accent: '#d83f4a', visual: 'sneaker', description: 'Ligereza, color y amortiguación para moverte por tu ciudad.' },
  { id: 5, name: 'Sérum Brisa de Guayaba', category: 'Bienestar', price: 980, tag: 'Esencial', tone: '#d7e3ca', accent: '#9aab51', visual: 'serum', description: 'Una dosis ligera de hidratación para que tu piel se sienta de vacaciones.' },
  { id: 6, name: 'Lámpara Nube de Tarde', category: 'Casa', price: 2850, tone: '#e5d9ed', accent: '#7e598e', visual: 'lamp', description: 'Luz cálida y forma suave para bajar el ritmo al final del día.' },
  { id: 7, name: 'Gorra Club Caribe', category: 'Hombre', price: 790, tag: 'Nuevo', tone: '#e2ddd0', accent: '#1e4a49', visual: 'cap', description: 'Algodón lavado, visera curva y actitud de fin de semana.' },
  { id: 8, name: 'Short Mini Marea', category: 'Niños', price: 890, tone: '#c7e1e2', accent: '#236a6d', visual: 'shorts', description: 'Cómodo, resistente y listo para todas las aventuras pequeñas.' },
];

const categories: { label: Category; count: string }[] = [
  { label: 'Todo', count: '24' },
  { label: 'Mujer', count: '08' },
  { label: 'Hombre', count: '06' },
  { label: 'Niños', count: '04' },
  { label: 'Casa', count: '03' },
  { label: 'Bienestar', count: '03' },
];

const money = (value: number) =>
  new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 }).format(value).replace('DOP', 'RD$');

function ProductVisual({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div
      className={`product-visual relative flex h-full w-full items-center justify-center overflow-hidden ${large ? 'min-h-[390px] md:min-h-[520px]' : 'aspect-[4/4.4]'}`}
      style={{ background: product.tone }}
      aria-label={`Visual de ${product.name}`}
    >
      <div className="absolute inset-0 opacity-30 dot-grid" />
      <div className="absolute right-[-22%] top-[-20%] h-44 w-44 rounded-full border-[18px] border-[#f6f0e6]/50" />
      <div className="absolute bottom-[-25%] left-[-8%] h-48 w-48 rounded-full bg-[#f6f0e6]/30" />
      {product.visual === 'bag' && (
        <div className="relative mt-7 h-44 w-44 rounded-[28px] border-4 border-[#d96a53] bg-[#ee876a] shadow-[11px_13px_0_#d76a56]">
          <div className="absolute -top-14 left-10 h-20 w-20 rounded-t-full border-[9px] border-b-0 border-[#d76a53]" />
          <div className="absolute left-7 top-9 h-2 w-28 rounded-full bg-[#f7d4bd]/60" />
          <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-[#c95847]/40" />
        </div>
      )}
      {product.visual === 'shirt' && (
        <div className="relative h-56 w-52 text-[#165b52]">
          <div className="absolute left-9 top-9 h-40 w-36 rounded-b-[25px] rounded-t-[9px] bg-[#f3f0de] shadow-[10px_10px_0_#b8c9ad]" />
          <div className="absolute left-2 top-6 h-28 w-20 -rotate-[25deg] rounded-2xl bg-[#f3f0de]" />
          <div className="absolute right-1 top-6 h-28 w-20 rotate-[25deg] rounded-2xl bg-[#f3f0de]" />
          <div className="absolute left-[76px] top-9 h-12 w-16 rounded-b-[40px] bg-[#c2d4b9]" />
          <div className="absolute left-[75px] top-24 h-1 w-16 bg-[#d4e0cd]" />
        </div>
      )}
      {product.visual === 'vase' && (
        <div className="relative h-56 w-44">
          <div className="absolute left-[52px] top-5 h-20 w-10 rounded-t-[18px] bg-[#f3e9db]" />
          <div className="absolute bottom-2 left-[16px] h-40 w-36 rounded-[35%_35%_24%_24%] bg-[#ef785e] shadow-[10px_10px_0_#d6bfa5]" />
          <div className="absolute bottom-24 left-10 h-3 w-24 rounded-full bg-[#f6cf85]" />
          <div className="absolute bottom-12 left-10 h-3 w-20 rounded-full bg-[#f6cf85]" />
        </div>
      )}
      {product.visual === 'sneaker' && (
        <div className="relative h-40 w-64 rotate-[-9deg]">
          <div className="absolute bottom-6 left-5 h-20 w-44 rounded-[60px_25px_12px_26px] bg-[#d83f4a] shadow-[10px_10px_0_#b83243]" />
          <div className="absolute bottom-2 left-3 h-12 w-60 rounded-[50%_30%_20%_30%] bg-[#fff1df]" />
          <div className="absolute left-24 top-5 h-4 w-24 rotate-[33deg] rounded-full border-b-4 border-[#f2d9ce]" />
          <div className="absolute left-40 top-12 h-5 w-16 rotate-[40deg] border-b-4 border-[#f2d9ce]" />
        </div>
      )}
      {product.visual === 'serum' && (
        <div className="relative h-56 w-36">
          <div className="absolute left-[44px] top-1 h-12 w-12 rounded-t-md bg-[#e9e3d0]" />
          <div className="absolute bottom-4 left-2 h-44 w-32 rounded-[12px_12px_28px_28px] bg-[#f6ead3] shadow-[9px_10px_0_#a9ba78]" />
          <div className="absolute bottom-16 left-7 h-12 w-20 -rotate-90 rounded-lg bg-[#a9ba78]" />
          <div className="absolute bottom-[76px] left-[45px] text-[10px] font-bold uppercase tracking-[.18em] text-[#f6ead3] [writing-mode:vertical-rl]">brisa</div>
        </div>
      )}
      {product.visual === 'lamp' && (
        <div className="relative h-60 w-52">
          <div className="absolute bottom-5 left-[99px] h-28 w-2 bg-[#7e598e]" />
          <div className="absolute bottom-1 left-16 h-3 w-24 rounded-full bg-[#7e598e]" />
          <div className="absolute left-3 top-4 h-32 w-48 rounded-[50%_50%_42%_42%] bg-[#f4e8f4] shadow-[9px_10px_0_#bda2c7]" />
          <div className="absolute left-12 top-17 h-16 w-32 rounded-full bg-[#fff0b8]/70 blur-sm" />
        </div>
      )}
      {product.visual === 'cap' && (
        <div className="relative h-48 w-56">
          <div className="absolute left-10 top-7 h-32 w-40 rounded-[70%_70%_18%_18%] bg-[#1e4a49] shadow-[10px_10px_0_#173d3b]" />
          <div className="absolute bottom-7 left-2 h-12 w-48 -rotate-6 rounded-[80%_30%_30%_70%] bg-[#286b69]" />
          <div className="absolute left-24 top-20 h-12 w-16 rounded-full bg-[#e6ddd0]/20" />
        </div>
      )}
      {product.visual === 'shorts' && (
        <div className="relative h-52 w-48">
          <div className="absolute left-6 top-8 h-32 w-20 rounded-b-[35px] rounded-t-lg bg-[#29777b] shadow-[10px_10px_0_#1f6468]" />
          <div className="absolute right-6 top-8 h-32 w-20 rounded-b-[35px] rounded-t-lg bg-[#29777b] shadow-[10px_10px_0_#1f6468]" />
          <div className="absolute left-8 top-4 h-16 w-32 rounded-t-[24px] bg-[#2b8587]" />
          <div className="absolute left-16 top-20 h-2 w-16 rounded-full bg-[#a8d8d5]" />
        </div>
      )}
      <span className="absolute bottom-4 left-4 font-mono-brand text-[10px] uppercase tracking-[.2em] text-[#21352f]/60">{product.category} / 0{product.id}</span>
    </div>
  );
}

function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todo');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [newsletter, setNewsletter] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  useEffect(() => {
    document.title = 'Suprime — cosas buenas para todos los días';
    const description = 'Descubre piezas útiles, bonitas y con personalidad para tu día a día. Envíos a todo República Dominicana.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'Suprime — cosas buenas para todos los días');
    document.head.appendChild(ogTitle);
    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.setAttribute('content', description);
    document.head.appendChild(ogDescription);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!mobileMenu) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenu]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const inCategory = selectedCategory === 'Todo' || product.category === selectedCategory;
      const matchesSearch = !term || `${product.name} ${product.category}`.toLowerCase().includes(term);
      return inCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const showToast = (message: string) => setToast(message);
  const addToCart = (product: Product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) return current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...current, { product, quantity }];
    });
    setCartOpen(true);
    showToast(`${product.name} está en tu bolsa`);
  };
  const changeQuantity = (id: number, amount: number) => {
    setCart((current) => current.map((item) => item.product.id === id ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item).filter((item) => item.quantity > 0));
  };
  const toggleFavorite = (id: number) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    showToast(favorites.includes(id) ? 'Quitado de tus favoritos' : 'Guardado en tus favoritos');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletter.trim()) {
      setNewsletterSent(true);
      setNewsletter('');
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

      <header className="nav-blur sticky top-0 z-40 border-b hairline">
        <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between gap-5 px-5 md:px-10">
          <button className="icon-button rounded-full p-2 md:hidden" onClick={() => setMobileMenu(true)} aria-label="Abrir menú" data-testid="button-open-menu"><Menu size={22} strokeWidth={1.7} /></button>
          <a href="#inicio" className="font-display text-[30px] font-semibold tracking-[-.07em] text-[#174f49]" data-testid="link-home">suprime<span className="text-[#ec684f]">.</span></a>
          <nav className="hidden items-center gap-7 text-[12px] font-bold uppercase tracking-[.12em] md:flex" aria-label="Navegación principal">
            {(['Mujer', 'Hombre', 'Niños', 'Casa', 'Bienestar'] as Category[]).map((category) => (
              <button key={category} onClick={() => { setSelectedCategory(category); document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' }); }} className="group relative py-3 text-[#21352f] transition-colors hover:text-[#ec684f]" data-testid={`button-nav-${category.toLowerCase()}`}>
                {category}<span className="absolute bottom-1 left-0 h-[2px] w-0 bg-[#ec684f] transition-all group-hover:w-full" />
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <div className="hidden items-center border-b border-[#b9b3a8] px-1 py-2 lg:flex">
              <Search size={16} strokeWidth={1.8} className="mr-2 text-[#174f49]" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar algo bueno..." className="w-36 bg-transparent text-[12px] outline-none placeholder:text-[#7f8179]" aria-label="Buscar productos" data-testid="input-search-desktop" />
            </div>
            <button className="icon-button relative rounded-full p-2" aria-label="Cuenta" data-testid="button-account"><UserRound size={19} strokeWidth={1.7} /></button>
            <button className="icon-button relative rounded-full p-2" onClick={() => setCartOpen(true)} aria-label={`Abrir bolsa, ${cartCount} artículos`} data-testid="button-open-cart"><ShoppingBag size={20} strokeWidth={1.7} />{cartCount > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ec684f] px-1 text-[9px] font-bold text-[#fff4e7]" data-testid="text-cart-count">{cartCount}</span>}</button>
          </div>
        </div>
      </header>
      {mobileMenu && (
        <div className="fixed inset-0 z-[60] flex min-h-[100dvh] flex-col overflow-y-auto bg-[#174f49] px-6 py-7 text-[#f6f0e6] md:hidden">
          <div className="flex items-center justify-between">
            <a
              href="#inicio"
              onClick={() => setMobileMenu(false)}
              className="font-display text-3xl tracking-[-.06em]"
            >
              suprime<span className="text-[#ec684f]">.</span>
            </a>
            <button
              onClick={() => setMobileMenu(false)}
              className="rounded-full p-2"
              aria-label="Cerrar menú"
              data-testid="button-close-menu"
            >
              <X />
            </button>
          </div>
          <div className="mt-20 flex flex-col gap-6 font-display text-5xl">
            {(['Mujer', 'Hombre', 'Niños', 'Casa', 'Bienestar'] as Category[]).map(
              (category) => (
                <button
                  className="text-left"
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setMobileMenu(false);
                    document
                      .getElementById('productos')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {category}
                </button>
              ),
            )}
          </div>
          <p className="mt-auto pt-12 font-mono-brand text-xs uppercase tracking-widest text-[#bfd2bb]">
            Santo Domingo · República Dominicana
          </p>
        </div>
      )}

      <main id="inicio">
        <section className="mx-auto grid max-w-[1440px] gap-8 px-5 pb-14 pt-7 md:grid-cols-[1.02fr_.98fr] md:px-10 md:pb-24 md:pt-12">
          <div className="flex flex-col justify-center">
            <div className="fade-up mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#ec684f]"><Sparkles size={14} /> Productos seleccionados para tu día a día</div>
            <h1 className="fade-up fade-up-delay-1 max-w-[650px] font-display text-[clamp(3.6rem,8.2vw,8.4rem)] leading-[.85] tracking-[-.075em] text-[#174f49]">Cosas<br /><span className="ml-[.35em] text-[#ec684f]">buenas</span><br />para todos.</h1>
            <p className="fade-up fade-up-delay-2 mt-8 max-w-[430px] text-[15px] leading-7 text-[#596660]">Una selección de hallazgos útiles, bonitos y con personalidad. Sin ruido. Solo lo que sí quieres tener cerca.</p>
            <div className="fade-up fade-up-delay-3 mt-9 flex flex-wrap items-center gap-4">
              <button onClick={() => { setSelectedCategory('Todo'); document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' }); }} className="group flex items-center gap-4 rounded-full bg-[#ec684f] px-6 py-3.5 text-[12px] font-bold uppercase tracking-[.12em] text-[#fff4e7] transition-transform hover:-translate-y-1" data-testid="button-explore-all">Explorar novedades <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button>
              <span className="font-mono-brand text-[10px] uppercase tracking-[.15em] text-[#758078]">Edición 03 / 2024</span>
            </div>
          </div>
          <div className="hero-grid relative min-h-[470px] overflow-hidden rounded-[28px] bg-[#d8e5dc] md:min-h-[630px]">
            <div className="absolute left-5 top-5 z-10 rounded-full bg-[#f6f0e6] px-4 py-2 font-mono-brand text-[10px] uppercase tracking-[.14em] text-[#174f49]">Selección del mes</div>
            <div className="absolute left-[12%] top-[14%] h-[65%] w-[64%] rotate-[-7deg] rounded-[45%] bg-[#ec684f] opacity-90" />
            <div className="absolute bottom-[-6%] right-[-7%] h-[60%] w-[63%] rounded-t-[55%] bg-[#f5d787]" />
            <div className="float-soft absolute bottom-[11%] left-[18%] z-10 h-[54%] w-[46%] rounded-[48%_48%_12%_12%] bg-[#f4e9d8] shadow-[14px_18px_0_#b9cdbb]">
              <div className="absolute left-1/2 top-[-17%] h-[33%] w-[49%] -translate-x-1/2 rounded-full bg-[#f4e9d8] shadow-[inset_-6px_-7px_0_#dfd1be]" />
              <div className="absolute left-[31%] top-[35%] h-2 w-[37%] rounded-full bg-[#d6c3ae]" />
              <div className="absolute left-[31%] top-[44%] h-2 w-[28%] rounded-full bg-[#e2d1bd]" />
            </div>
            <div className="absolute right-[9%] top-[18%] rotate-[12deg] text-right font-display text-[42px] leading-[.85] tracking-[-.08em] text-[#174f49]">made<br />to stay.</div>
            <span className="absolute bottom-5 left-5 font-mono-brand text-[10px] uppercase tracking-[.14em] text-[#174f49]">Suprime Curated Studio</span>
          </div>
        </section>

        <section id="productos" className="mx-auto max-w-[1440px] px-5 py-12 md:px-10">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono-brand text-[11px] uppercase tracking-[.18em] text-[#ec684f]">Catálogo activo</p>
              <h2 className="font-display text-[40px] tracking-[-.06em] text-[#174f49]">Explora la colección.</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[.1em] transition-colors ${
                    selectedCategory === cat.label
                      ? 'bg-[#174f49] text-[#fff4e7]'
                      : 'bg-[#e7e1d5] text-[#21352f] hover:bg-[#ded6c7]'
                  }`}
                >
                  {cat.label} <span className="ml-1 opacity-60">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-[20px] bg-[#ebe4d8] p-4 transition-all duration-300 hover:shadow-lg">
                <div className="relative overflow-hidden rounded-[14px]">
                  {product.tag && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-[#174f49] px-3 py-1 font-mono-brand text-[9px] uppercase tracking-[.15em] text-[#fff4e7]">
                      {product.tag}
                    </span>
                  )}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute right-3 top-3 z-10 rounded-full bg-[#f6f0e6]/80 p-2 text-[#174f49] backdrop-blur-sm transition-colors hover:bg-[#f6f0e6]"
                    aria-label="Guardar en favoritos"
                  >
                    <Heart size={16} className={favorites.includes(product.id) ? 'fill-[#ec684f] text-[#ec684f]' : ''} />
                  </button>
                  <ProductVisual product={product} />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[#174f49]/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                      onClick={() => setQuickView(product)}
                      className="rounded-full bg-[#f6f0e6] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#174f49] shadow-md transition-transform hover:scale-105"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-display text-[18px] tracking-tight text-[#174f49]">{product.name}</h3>
                    <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#596660]">{product.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono-brand text-[15px] font-bold text-[#174f49]">{money(product.price)}</span>
                      {product.oldPrice && (
                        <span className="font-mono-brand text-[12px] text-[#8c948f] line-through">{money(product.oldPrice)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="rounded-full bg-[#174f49] p-2.5 text-[#fff4e7] transition-colors hover:bg-[#ec684f]"
                      aria-label="Añadir a la bolsa"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="bg-[#174f49] py-20 text-[#f6f0e6]">
          <div className="mx-auto max-w-[1440px] px-5 md:px-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="font-mono-brand text-[11px] uppercase tracking-[.2em] text-[#ec684f]">Boletín Suprime</span>
                <h2 className="mt-2 font-display text-[42px] leading-tight tracking-[-.05em]">Cosas buenas directo en tu correo.</h2>
                <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-[#bfd2bb]">
                  Suscríbete para recibir lanzamientos exclusivos, descuentos especiales y curadurías semanales de objetos bonitos.
                </p>
              </div>
              <div>
                {newsletterSent ? (
                  <div className="flex items-center gap-3 rounded-2xl bg-[#236a6d] p-6 text-[#fff4e7]">
                    <Check className="text-[#ec684f]" />
                    <p className="font-mono-brand text-[13px]">¡Gracias por suscribirte! Te hemos enviado un correo de bienvenida.</p>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="email"
                      value={newsletter}
                      onChange={(e) => setNewsletter(e.target.value)}
                      placeholder="Tu correo electrónico..."
                      required
                      className="flex-1 rounded-full bg-[#236a6d] px-6 py-4 text-[14px] text-[#fff4e7] outline-none placeholder:text-[#bfd2bb]"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-[#ec684f] px-8 py-4 text-[12px] font-bold uppercase tracking-widest text-[#fff4e7] transition-colors hover:bg-[#d9573f]"
                    >
                      Unirme
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t hairline bg-[#ebd2be]/30 py-12 text-[#21352f]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-6 px-5 text-center md:flex-row md:px-10 md:text-left">
          <div>
            <a href="#inicio" className="font-display text-2xl tracking-[-.06em] text-[#174f49]">suprime<span className="text-[#ec684f]">.</span></a>
            <p className="mt-1 font-mono-brand text-[11px] text-[#596660]">Cosas buenas para todos los días.</p>
          </div>
          <p className="font-mono-brand text-[11px] text-[#596660]">
            © {new Date().getFullYear()} Suprime Studio. República Dominicana. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {quickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#174f49]/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-[#f6f0e6] p-6 shadow-2xl md:p-8">
            <button
              onClick={() => setQuickView(null)}
              className="absolute right-4 top-4 rounded-full bg-[#e7e1d5] p-2 text-[#174f49] hover:bg-[#ded6c7]"
            >
              <X size={20} />
            </button>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="overflow-hidden rounded-[18px]">
                <ProductVisual product={quickView} large />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <span className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-[#ec684f]">{quickView.category}</span>
                  <h3 className="mt-1 font-display text-[28px] text-[#174f49]">{quickView.name}</h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-[#596660]">{quickView.description}</p>
                  <div className="mt-6 flex items-baseline gap-3">
                    <span className="font-mono-brand text-[22px] font-bold text-[#174f49]">{money(quickView.price)}</span>
                    {quickView.oldPrice && (
                      <span className="font-mono-brand text-[14px] text-[#8c948f] line-through">{money(quickView.oldPrice)}</span>
                    )}
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => {
                      addToCart(quickView);
                      setQuickView(null);
                    }}
                    className="flex-1 rounded-full bg-[#ec684f] py-3.5 text-center text-[12px] font-bold uppercase tracking-wider text-[#fff4e7] transition-colors hover:bg-[#d9573f]"
                  >
                    Añadir a la bolsa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#174f49]/50 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col bg-[#f6f0e6] p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e7e1d5] pb-4">
              <h3 className="font-display text-[22px] text-[#174f49]">Tu bolsa ({cartCount})</h3>
              <button onClick={() => setCartOpen(false)} className="rounded-full p-2 hover:bg-[#e7e1d5]">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag size={48} className="text-[#b9b3a8]" />
                  <p className="mt-4 font-mono-brand text-[13px] text-[#596660]">Tu bolsa está vacía</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4 rounded-xl bg-[#ebe4d8] p-3">
                      <div className="h-16 w-16 overflow-hidden rounded-lg">
                        <ProductVisual product={item.product} />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="font-display text-[15px] text-[#174f49]">{item.product.name}</h4>
                          <span className="font-mono-brand text-[12px] text-[#596660]">{money(item.product.price)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => changeQuantity(item.product.id, -1)} className="rounded-full bg-[#f6f0e6] p-1 text-[#174f49]">
                            <Minus size={12} />
                          </button>
                          <span className="font-mono-brand text-[12px]">{item.quantity}</span>
                          <button onClick={() => changeQuantity(item.product.id, 1)} className="rounded-full bg-[#f6f0e6] p-1 text-[#174f49]">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-[#e7e1d5] pt-4">
                <div className="mb-4 flex items-center justify-between font-mono-brand">
                  <span className="text-[13px] text-[#596660]">Total</span>
                  <span className="text-[18px] font-bold text-[#174f49]">{money(cartTotal)}</span>
                </div>
                <button 
                  onClick={async () => {
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
        alert('Error al generar la orden de PayPal. Revisa que PAYPAL_CLIENT_ID y PAYPAL_SECRET estén bien en Cloudflare.');
        console.error(data);
      }
    } catch (err) {
      alert('Error de conexión con el servidor de cobros.');
      console.error(err);
    }
  }}
  className="w-full rounded-full bg-[#174f49] py-4 text-center text-[12px] font-bold uppercase tracking-widest text-[#fff4e7] transition-colors hover:bg-[#ec684f]"
>
  Pagar con PayPal ({money(cartTotal)})
</button>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-full bg-[#174f49] px-5 py-3 font-mono-brand text-[12px] text-[#fff4e7] shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <WouterRouter>
            <Switch>
              <Route path="/" component={Home} />
              <Route component={NotFound} />
            </Switch>
          </WouterRouter>
        </ErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

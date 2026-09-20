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
          <div className="absolute left-[44px] top-1 h-12 w-48px rounded-t-md bg-[#e9e3d0] w-12" />
          <div className="absolute bottom-4 left-2 h-44 w-32 rounded-[12px_12px_28px_28px] bg-[#f6ead3] shadow-[9px_10px_0_#a9ba78]" />
          <div className="absolute bottom-16 left-7 h-12 w-22 -rotate-90 rounded-lg bg-[#a9ba78] w-20" />
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
          <div className="absolute left-6 top-8 h-32 w-72px rounded-b-[35px] rounded-t-lg bg-[#29777b] shadow-[10px_10px_0_#1f6468] w-20" />
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
            <span className="absolute bottom-5 left-5 font-mono-brand text-[10px] uppercase tracking-[.18em] text-[#174f49]/60">Suprime / Santo Domingo</span>
            <button className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#174f49] text-[#f6f0e6] transition-transform hover:rotate-45" onClick={() => setQuickView(products[2])} aria-label="Ver selección del mes" data-testid="button-hero-quick-view"><ArrowUpRight size={19} /></button>
          </div>
        </section>

        <section className="border-y hairline bg-[#174f49] text-[#f6f0e6]">
          <div className="mx-auto flex max-w-[1440px] items-center gap-7 overflow-x-auto px-5 py-5 md:justify-between md:px-10">
            <span className="shrink-0 font-display text-2xl italic text-[#f5d787]">¿Qué se te antoja?</span>
            {categories.slice(1).map((category) => <button key={category.label} onClick={() => { setSelectedCategory(category.label); document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' }); }} className="group flex shrink-0 items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-[#d4e2d6] transition-colors hover:text-[#f5d787]" data-testid={`button-category-${category.label.toLowerCase()}`}><span className="h-1.5 w-1.5 rounded-full bg-[#ec684f] transition-transform group-hover:scale-150" />{category.label}<sup className="font-mono-brand text-[9px] text-[#91b4a3]">{category.count}</sup></button>)}
          </div>
        </section>

        <section id="productos" className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
          <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="mb-3 font-mono-brand text-[10px] uppercase tracking-[.2em] text-[#ec684f]">01 / Hallazgos recientes</p><h2 className="font-display text-5xl tracking-[-.06em] text-[#174f49] md:text-6xl">Recién llegados<span className="text-[#ec684f]">.</span></h2></div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border-b border-[#b9b3a8] pb-2 lg:hidden"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar" className="w-28 bg-transparent text-sm outline-none" aria-label="Buscar productos" data-testid="input-search-mobile" /></div>
              <button className="flex items-center gap-2 rounded-full border hairline px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.12em] text-[#596660]" onClick={() => showToast('Estamos ordenando lo mejor para ti')} data-testid="button-sort"><span>Ordenar</span><ChevronDown size={14} /></button>
            </div>
          </div>
          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {categories.map((category) => <button key={category.label} onClick={() => setSelectedCategory(category.label)} className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[.12em] transition-all ${selectedCategory === category.label ? 'border-[#174f49] bg-[#174f49] text-[#f6f0e6]' : 'hairline text-[#718078] hover:border-[#174f49] hover:text-[#174f49]'}`} data-testid={`button-filter-${category.label.toLowerCase()}`}>{category.label} <span className="ml-1 font-mono-brand text-[9px] opacity-60">{category.count}</span></button>)}
          </div>
          {filteredProducts.length ? <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
            {filteredProducts.map((product, index) => <article key={product.id} className={`product-card group relative ${index === 0 ? 'fade-up' : ''}`} data-testid={`card-product-${product.id}`}>
              <div className="relative overflow-hidden rounded-[15px]">
                <ProductVisual product={product} />
                {product.tag && <span className="absolute left-3 top-3 rounded-full bg-[#f6f0e6] px-2.5 py-1 font-mono-brand text-[9px] uppercase tracking-[.1em] text-[#174f49]">{product.tag}</span>}
                <button onClick={() => toggleFavorite(product.id)} aria-label={favorites.includes(product.id) ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`} className={`icon-button absolute right-3 top-3 rounded-full p-2 ${favorites.includes(product.id) ? 'bg-[#ec684f] text-[#fff4e7]' : 'bg-[#f6f0e6] text-[#174f49]'}`} data-testid={`button-favorite-${product.id}`}><Heart size={15} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} /></button>
                <button onClick={() => setQuickView(product)} className="absolute bottom-3 left-3 right-3 flex translate-y-2 items-center justify-between rounded-full bg-[#174f49] px-4 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#f6f0e6] opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100" data-testid={`button-quick-view-${product.id}`}>Vista rápida <ArrowUpRight size={15} /></button>
              </div>
              <div className="flex items-start justify-between gap-2 pt-4"><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[.1em] text-[#8b928a]">{product.category}</p><h3 className="max-w-[170px] text-[13px] font-bold leading-5 text-[#174f49]">{product.name}</h3></div><div className="text-right"><p className="font-mono-brand text-[12px] font-medium text-[#174f49]">{money(product.price)}</p>{product.oldPrice && <p className="mt-1 font-mono-brand text-[10px] text-[#9b9c91] line-through">{money(product.oldPrice)}</p>}</div></div>
            </article>)}
          </div> : <div className="rounded-2xl border border-dashed border-[#b9b3a8] px-6 py-20 text-center"><p className="font-display text-3xl text-[#174f49]">No encontramos eso<span className="text-[#ec684f]">.</span></p><p className="mt-3 text-sm text-[#758078]">Prueba otra palabra o mira todos nuestros hallazgos.</p><button onClick={() => { setSearch(''); setSelectedCategory('Todo'); }} className="mt-6 rounded-full bg-[#174f49] px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-[#f6f0e6]" data-testid="button-clear-filters">Ver todo</button></div>}
        </section>

        <section className="mx-5 overflow-hidden rounded-[26px] bg-[#f3c8ca] md:mx-10">
          <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-6 py-12 md:grid-cols-[1fr_.8fr] md:px-16 md:py-16">
            <div><p className="mb-3 font-mono-brand text-[10px] uppercase tracking-[.2em] text-[#b43d48]">02 / La casa también se viste</p><h2 className="max-w-[600px] font-display text-5xl leading-[.94] tracking-[-.065em] text-[#174f49] md:text-7xl">Pequeños cambios,<br /><i className="text-[#ec684f]">gran mood.</i></h2><p className="mt-6 max-w-[390px] text-sm leading-6 text-[#5b6057]">Objetos que hacen que tu casa se sienta más tuya. Piezas para usar, mirar y volver a querer.</p><button onClick={() => { setSelectedCategory('Casa'); document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' }); }} className="group mt-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.15em] text-[#174f49]" data-testid="button-shop-home">Ver selección casa <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button></div>
            <div className="relative mx-auto h-64 w-full max-w-[430px] md:h-80"><div className="absolute left-[18%] top-[8%] h-[78%] w-[50%] rotate-6 rounded-[48%_48%_20%_20%] bg-[#f5d787] shadow-[12px_14px_0_#e98f8a]" /><div className="absolute right-[3%] top-[15%] h-[67%] w-[43%] -rotate-12 rounded-[45%_45%_17%_17%] bg-[#d7e3ca] shadow-[12px_14px_0_#b1c7a8]" /><div className="absolute bottom-0 left-[28%] h-3 w-[55%] rounded-full bg-[#174f49]/20" /></div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 md:grid-cols-[.8fr_1.2fr] md:px-10 md:py-28">
          <div><p className="mb-3 font-mono-brand text-[10px] uppercase tracking-[.2em] text-[#ec684f]">03 / Promesa Suprime</p><h2 className="max-w-[440px] font-display text-5xl leading-[.95] tracking-[-.06em] text-[#174f49] md:text-6xl">Elegimos con<br /><span className="text-[#ec684f]">buen ojo.</span></h2><p className="mt-7 max-w-[370px] text-sm leading-7 text-[#66716b]">No tienes que perderte entre mil opciones. Visitamos, probamos y dejamos aquí solo las cosas que nos gustaría encontrar.</p></div>
          <div className="grid gap-0 divide-y hairline border-y">
            {[{ icon: Check, title: 'Útil de verdad', body: 'Diseño que se usa, no que ocupa espacio.' }, { icon: Truck, title: 'Llega a tu puerta', body: 'Envíos a todo el país desde Santo Domingo.' }, { icon: RotateCcw, title: 'Compra sin drama', body: 'Si no era para ti, lo resolvemos fácil.' }].map(({ icon: Icon, title, body }, index) => <div key={title} className="flex items-center gap-5 py-6"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dce9dd] text-[#174f49]"><Icon size={19} strokeWidth={1.7} /></span><div className="flex-1"><h3 className="font-display text-2xl text-[#174f49]">{title}</h3><p className="mt-1 text-sm text-[#77817b]">{body}</p></div><span className="font-mono-brand text-[10px] text-[#a1a79e]">0{index + 1}</span></div>)}
          </div>
        </section>
      </main>

      <footer className="bg-[#174f49] px-5 pb-8 pt-14 text-[#f6f0e6] md:px-10 md:pt-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 md:grid-cols-[1.3fr_.7fr_.7fr_1fr]">
            <div><a href="#inicio" className="font-display text-5xl tracking-[-.08em]" data-testid="link-footer-home">suprime<span className="text-[#ec684f]">.</span></a><p className="mt-5 max-w-[270px] text-sm leading-6 text-[#bdd0c3]">Para los días normales, los planes improvisados y todo lo que pasa entre medio.</p></div>
            <div><p className="mb-5 font-mono-brand text-[10px] uppercase tracking-[.18em] text-[#f5d787]">Explora</p><div className="flex flex-col gap-3 text-sm text-[#d5e2d7]">{['Mujer', 'Hombre', 'Casa', 'Bienestar'].map((label) => <button className="text-left transition-colors hover:text-[#f5d787]" key={label} onClick={() => { setSelectedCategory(label as Category); document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' }); }}>{label}</button>)}</div></div>
            <div><p className="mb-5 font-mono-brand text-[10px] uppercase tracking-[.18em] text-[#f5d787]">Síguenos</p><a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[#d5e2d7] hover:text-[#f5d787]" data-testid="link-instagram"><Instagram size={17} /> @suprime.do</a><p className="mt-3 text-sm text-[#bdd0c3]">Santo Domingo,<br />República Dominicana</p></div>
            <div><p className="mb-5 font-mono-brand text-[10px] uppercase tracking-[.18em] text-[#f5d787]">Una buena idea</p>{newsletterSent ? <div className="flex items-center gap-2 rounded-xl border border-[#8daf99] px-4 py-4 text-sm text-[#d5e2d7]"><Check size={17} /> Ya estás en la lista.</div> : <form onSubmit={(event) => { event.preventDefault(); if (newsletter.includes('@')) { setNewsletterSent(true); showToast('Bienvenido a la lista Suprime'); } }} className="flex border-b border-[#759b89] pb-2"><input type="email" required value={newsletter} onChange={(event) => setNewsletter(event.target.value)} placeholder="Tu email, sin spam" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8daf99]" aria-label="Email para newsletter" data-testid="input-newsletter" /><button type="submit" aria-label="Suscribirme" className="text-[#f5d787]" data-testid="button-newsletter"><ArrowRight size={19} /></button></form>}<p className="mt-3 text-[10px] leading-4 text-[#8daf99]">Novedades, hallazgos y algún descuento. Una vez por semana.</p></div>
          </div>
          <div className="mt-16 flex flex-col justify-between gap-3 border-t border-[#3e7368] pt-6 font-mono-brand text-[9px] uppercase tracking-[.12em] text-[#8daf99] md:flex-row"><span>© 2024 Suprime Store</span><span>Hecho para vivir bonito</span><span>RD$ · Español</span></div>
        </div>
      </footer>

      {quickView && <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#174f49]/45 p-0 backdrop-blur-sm md:items-center md:p-6" onClick={() => setQuickView(null)}><div className="modal-enter relative grid max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-[25px] bg-[#f6f0e6] md:grid-cols-2 md:rounded-[25px]" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Detalle de ${quickView.name}`}><button onClick={() => setQuickView(null)} className="icon-button absolute right-4 top-4 z-10 rounded-full bg-[#f6f0e6] p-2 text-[#174f49]" aria-label="Cerrar vista rápida" data-testid="button-close-quick-view"><X size={18} /></button><ProductVisual product={quickView} large /><div className="flex flex-col p-7 md:p-10"><p className="font-mono-brand text-[10px] uppercase tracking-[.18em] text-[#ec684f]">{quickView.category} / selección suprime</p><h2 className="mt-4 font-display text-4xl leading-none tracking-[-.06em] text-[#174f49]">{quickView.name}</h2><p className="mt-5 text-sm leading-6 text-[#68736b]">{quickView.description}</p><div className="mt-7 flex items-baseline gap-3"><span className="font-mono-brand text-xl text-[#174f49]">{money(quickView.price)}</span>{quickView.oldPrice && <span className="font-mono-brand text-xs text-[#9b9c91] line-through">{money(quickView.oldPrice)}</span>}</div><div className="mt-auto pt-9"><button onClick={() => { addToCart(quickView); setQuickView(null); }} className="flex w-full items-center justify-center gap-3 rounded-full bg-[#ec684f] py-4 text-[11px] font-bold uppercase tracking-[.15em] text-[#fff4e7] transition-transform hover:-translate-y-1" data-testid={`button-add-quick-${quickView.id}`}>Agregar a la bolsa <ShoppingBag size={16} /></button><button onClick={() => toggleFavorite(quickView.id)} className="mt-3 flex w-full items-center justify-center gap-2 py-3 text-[11px] font-bold uppercase tracking-[.14em] text-[#174f49]" data-testid={`button-save-quick-${quickView.id}`}><Heart size={15} fill={favorites.includes(quickView.id) ? 'currentColor' : 'none'} /> {favorites.includes(quickView.id) ? 'Guardado' : 'Guardar para después'}</button></div></div></div></div>}

      {cartOpen && <div className="fixed inset-0 z-50 bg-[#174f49]/35 backdrop-blur-sm" onClick={() => setCartOpen(false)}><aside className="drawer-enter absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#f6f0e6] shadow-2xl" onClick={(event) => event.stopPropagation()} aria-label="Tu bolsa" data-testid="drawer-cart"><div className="flex items-center justify-between border-b hairline px-6 py-5"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.17em] text-[#ec684f]">Tu selección</p><h2 className="font-display text-3xl tracking-[-.06em] text-[#174f49]">La bolsa<span className="text-[#ec684f]">.</span></h2></div><button onClick={() => setCartOpen(false)} className="icon-button rounded-full p-2" aria-label="Cerrar bolsa" data-testid="button-close-cart"><X /></button></div>{cart.length ? <><div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">{cart.map(({ product, quantity }) => <div key={product.id} className="flex gap-4" data-testid={`cart-item-${product.id}`}><div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl"><ProductVisual product={product} /></div><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><h3 className="text-[13px] font-bold leading-5 text-[#174f49]">{product.name}</h3><button onClick={() => changeQuantity(product.id, -quantity)} className="text-[#98a098] hover:text-[#ec684f]" aria-label={`Quitar ${product.name}`} data-testid={`button-remove-cart-${product.id}`}><X size={15} /></button></div><p className="mt-1 font-mono-brand text-xs text-[#174f49]">{money(product.price)}</p><div className="mt-3 flex w-fit items-center gap-3 rounded-full border hairline px-2 py-1"><button onClick={() => changeQuantity(product.id, -1)} aria-label="Reducir cantidad" data-testid={`button-decrease-${product.id}`}><Minus size={13} /></button><span className="min-w-4 text-center font-mono-brand text-xs">{quantity}</span><button onClick={() => changeQuantity(product.id, 1)} aria-label="Aumentar cantidad" data-testid={`button-increase-${product.id}`}><Plus size={13} /></button></div></div></div>)}</div><div className="border-t hairline px-6 py-6"><div className="mb-4 flex justify-between text-sm"><span className="text-[#758078]">Subtotal</span><span className="font-mono-brand text-[#174f49]">{money(cartTotal)}</span></div><p className="mb-5 text-[10px] leading-4 text-[#758078]">Envío calculado al finalizar. Gratis en compras de RD$3,500 o más.</p><button onClick={() => showToast('Checkout listo para conectar')} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ec684f] py-4 text-[11px] font-bold uppercase tracking-[.15em] text-[#fff4e7] transition-transform hover:-translate-y-1" data-testid="button-checkout">Ir al checkout <ArrowRight size={16} /></button></div></> : <div className="flex flex-1 flex-col items-center justify-center px-10 text-center"><div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#dce9dd] text-[#174f49]"><ShoppingBag size={28} strokeWidth={1.3} /></div><h3 className="font-display text-3xl tracking-[-.05em] text-[#174f49]">Tu bolsa está esperando<span className="text-[#ec684f]">.</span></h3><p className="mt-3 text-sm leading-6 text-[#758078]">Agrega algo que te haga sonreír. Prometemos que cabe.</p><button onClick={() => setCartOpen(false)} className="mt-7 rounded-full bg-[#174f49] px-6 py-3 text-[11px] font-bold uppercase tracking-[.13em] text-[#f6f0e6]" data-testid="button-continue-shopping">Seguir explorando</button></div>}</aside></div>}
      {toast && <div className="toast-enter fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#174f49] px-5 py-3 text-[11px] font-bold tracking-wide text-[#f6f0e6] shadow-xl" role="status" data-testid="status-toast"><Check size={15} className="text-[#f5d787]" />{toast}</div>}
    </div>
  );
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
import React from 'react';
import { Home, ShoppingBag, Layers, ShieldAlert, User } from 'lucide-react';

interface UserData {
  username: string;
  email: string;
  role: string; // Ej: 'cliente', 'admin', 'moderador'
}

interface SidebarProps {
  currentUser: UserData | null;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Sidebar({ currentUser, currentPath, onNavigate }: SidebarProps) {
  // Verificamos si el usuario tiene un rango superior al de un cliente normal
  const hasElevatedRole = currentUser && currentUser.role !== 'cliente';

  const mainNavItems = [
    { label: 'Inicio', path: '/', icon: Home },
    { label: 'Productos', path: '/products', icon: ShoppingBag },
    { label: 'Departamentos', path: '/departments', icon: Layers },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-screen sticky top-0">
      {/* Sección Superior: Logotipo y Navegación Principal */}
      <div>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-indigo-600 tracking-wide">SUPRIME</h1>
        </div>

        <nav className="p-4 space-y-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Menú Principal
          </div>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sección Inferior: Panel de Administración (Abajo del todo) y Perfil del Usuario */}
      <div className="p-4 border-t border-gray-100 space-y-4">
        {/* El panel de administración se sitúa al fondo de la lista y solo se muestra para rangos elevados */}
        {hasElevatedRole && (
          <div>
            <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider px-3 mb-2">
              Zona de Control
            </div>
            <button
              onClick={() => onNavigate('/admin')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentPath === '/admin'
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-amber-600 hover:bg-amber-50 hover:text-amber-800'
              }`}
            >
              <ShieldAlert size={18} />
              Panel de Administración
            </button>
          </div>
        )}

        {/* Información del Usuario (El rol se oculta por completo si es cliente normal) */}
        {currentUser ? (
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser.username}</p>
              
              {/* Si es rol elevado se muestra su rango, de lo contrario solo muestra el correo sin evidenciar etiquetas de rol */}
              {hasElevatedRole ? (
                <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full uppercase">
                  {currentUser.role}
                </span>
              ) : (
                <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('/login')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition cursor-pointer"
          >
            <User size={16} />
            Iniciar Sesión
          </button>
        )}
      </div>
    </aside>
  );
}




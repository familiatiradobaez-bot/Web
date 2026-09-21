import React, { useEffect, useState } from 'react';
import { Users, Shield, UserPlus, AlertCircle } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para el formulario de creación manual de un nuevo usuario
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('cliente');
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (response.ok && data.success) {
        setUsers(data.users);
      } else {
        setError(data.error || 'Error al cargar los usuarios');
      }
    } catch (err: any) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          email: newEmail,
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccessMessage('¡Usuario creado exitosamente!');
        setNewUsername('');
        setNewEmail('');
        setNewPassword('');
        setNewRole('cliente');
        fetchUsers(); // Recargamos la lista
      } else {
        setError(data.error || 'No se pudo crear el usuario');
      }
    } catch (err: any) {
      setError('Error al registrar el usuario');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="text-amber-600" /> Panel de Administración
          </h1>
          <p className="text-sm text-gray-500">Gestión de usuarios, roles y accesos de la tienda.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de Creación Manual de Usuarios */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <UserPlus size={18} className="text-indigo-600" /> Crear Usuario Manual
          </h2>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nombre de usuario</label>
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="usuario123"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="correo@domain.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Rol del sistema</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="cliente">Cliente</option>
                <option value="moderador">Moderador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm transition cursor-pointer disabled:opacity-50"
            >
              {creating ? 'Guardando...' : 'Registrar Usuario'}
            </button>
          </form>
        </div>

        {/* Lista de Usuarios Registrados */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Users size={18} className="text-indigo-600" /> Usuarios del Sistema
          </h2>

          {loading ? (
            <p className="text-sm text-gray-500 py-4 text-center">Cargando usuarios...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No hay usuarios registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className="p-3 font-medium">Usuario</th>
                    <th className="p-3 font-medium">Correo</th>
                    <th className="p-3 font-medium">Rol</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition">
                      <td className="p-3 font-medium text-gray-900">{u.username}</td>
                      <td className="p-3 text-gray-500">{u.email}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase ${
                            u.role === 'admin'
                              ? 'bg-amber-100 text-amber-800'
                              : u.role === 'moderador'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {u.role || 'cliente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



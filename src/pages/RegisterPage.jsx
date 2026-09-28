import { useState } from "react";
import { register } from "../services/authService";
import { toast } from "react-hot-toast";

const RegisterPage = ({ onBack }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    const clearData = {
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password: password,
    };

    try {
      await register(clearData);

      toast.success(
        "¡Usuario creado correctamente! Ahora puedes iniciar sesión.",
      );
      onBack(); // Regresa al Login automáticamente
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Ocurrió un error al registrar el usuario";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white">
            💬
          </div>

          <h1 className="text-2xl font-bold text-gray-800">Crear cuenta</h1>
          <p className="mt-1 text-sm text-gray-400">
            Regístrate para empezar a chatear
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nombre de usuario
            </label>
            <input
              type="text"
              placeholder="tu_usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="......."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus-ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full text-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Volver al login
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

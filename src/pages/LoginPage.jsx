import { useState } from "react";
import { login } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const LoginPage = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useAuth();

  const handleLogin = async () => {
    const response = await login({
      email,
      password,
    });

    setUser(response);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Logo / título */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-sm">
            💬
          </div>

          <h1 className="text-2xl font-bold text-gray-800">ChatApp</h1>

          <p className="mt-1 text-sm text-gray-400">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Formulario */}
        <div className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleLogin();
                }
              }}
            />
          </div>

          {/* Botón */}
          <button
            onClick={handleLogin}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Iniciar sesión
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            ¿No tienes cuenta?
          </p>

          <button onClick={onRegister} className="mt-2 w-full text-blue-600">
            Registrase
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

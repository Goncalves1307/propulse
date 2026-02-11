import React, { useState } from "react";
import { Calendar, Mail, Lock, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'; // <-- NOVO: Importar Toasts

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- NOVO: Estado para mostrar password
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await Api({
        method: "post",
        url: "/auth/login",
        data: { email, password },
      });

      const token = res?.data?.token;
      if (!token) {
        toast.error("Resposta inválida do servidor. Tenta novamente.");
        return;
      }

      localStorage.setItem("token", token);
      
      // NOVO: Mensagem de sucesso antes de navegar
      toast.success("Bem-vindo de volta!"); 
      navigate("/dashboard");
    } catch (err) {
      const status = err?.response?.status;
      const apiMsg = err?.response?.data?.message;

      // NOVO: Usar o Toast em vez de uma caixa de erro estática
      if (status === 401 || status === 400) {
        toast.error(apiMsg || "Email ou palavra-passe incorretos.");
      } else {
        toast.error(apiMsg || "Não foi possível iniciar sessão. Tenta novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <a
            href="/"
            className="inline-flex items-center text-white hover:text-white/80 mb-6 transition-all duration-300 hover:translate-x-[-4px]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à página inicial
          </a>
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <Calendar className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Bem-vindo de volta
          </h2>
          <p className="mt-2 text-white/90 text-lg">
            Por favor, inicia sessão na tua conta
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl py-8 px-4 sm:px-10 shadow-2xl rounded-2xl border border-white/20 transform hover:scale-[1.02] transition-transform duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Endereço de email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent sm:text-sm transition-all duration-300 hover:border-emerald-300 bg-white"
                  placeholder="teu@email.com"
                />
              </div>
            </div>

            {/* Campo Palavra-passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Palavra-passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} // <-- NOVO: Alterna tipo
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 pr-10 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent sm:text-sm transition-all duration-300 hover:border-emerald-300 bg-white"
                  placeholder="••••••••"
                />
                
                {/* NOVO: Botão Mostrar/Esconder Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-500 focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                  Recuperar palavra-passe
                </a>
              </div>
            </div>

            {/* Botão de Login com Spinner */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform hover:scale-[1.02] transition-all duration-300 ${
                  loading ? "opacity-70 cursor-wait" : ""
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    A iniciar sessão...
                  </>
                ) : (
                  "Iniciar sessão"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              Ainda não tens conta?{" "}
              <a
                href="/register"
                className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                Regista-te aqui
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
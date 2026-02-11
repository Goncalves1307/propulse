import React, { useState } from "react";
import {
  Calendar,
  Building2,
  Mail,
  Lock,
  Phone,
  MapPin,
  ArrowLeft,
  User,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import Api from "../../api/axios";
import { useNavigate } from "react-router-dom"; // <-- Adicionado para navegação suave
import toast from 'react-hot-toast'; // <-- Adicionado para notificações

function RegisterUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar password principal
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar password de confirmação

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("As palavras-passe não coincidem!");
      setLoading(false);
      return;
    }

    try {
      const response = await Api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      // Guardar token
      localStorage.setItem("token", response.data.token);

      toast.success("Conta criada com sucesso! Bem-vindo.");
      
      // Navegação suave para o dashboard
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Ocorreu um erro durante o registo. Tenta novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
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
              <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Cria a tua conta
          </h2>
          <p className="mt-2 text-white/90 text-base md:text-lg">
            Começa a tua jornada hoje com a Propulse!
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl py-8 px-4 sm:px-10 shadow-2xl rounded-2xl border border-white/20 transform hover:scale-[1.01] transition-transform duration-300">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-300 bg-white"
                  placeholder="João Silva"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Endereço de Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-300 bg-white"
                  placeholder="joao@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Número de Telemóvel
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-300 bg-white"
                  placeholder="+351 912 345 678"
                />
              </div>
            </div>

            {/* Password Principal */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Palavra-passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-300 bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirmar Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar Palavra-passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 pr-10 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-300 bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 text-white" />
                    A criar conta...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Criar conta
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              Já tens conta?{" "}
              <a
                href="/login"
                className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors duration-300"
              >
                Iniciar sessão
              </a>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-3 md:gap-4 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20 transform hover:-translate-y-1 transition-transform">
            <div className="text-xl md:text-2xl font-bold text-white mb-1 drop-shadow-md">100%</div>
            <div className="text-[10px] md:text-xs text-white/90 font-medium uppercase tracking-wider">Gratuito</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20 transform hover:-translate-y-1 transition-transform">
            <div className="text-xl md:text-2xl font-bold text-white mb-1 drop-shadow-md">2 min</div>
            <div className="text-[10px] md:text-xs text-white/90 font-medium uppercase tracking-wider">Setup</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20 transform hover:-translate-y-1 transition-transform">
            <div className="text-xl md:text-2xl font-bold text-white mb-1 drop-shadow-md">24/7</div>
            <div className="text-[10px] md:text-xs text-white/90 font-medium uppercase tracking-wider">Suporte</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
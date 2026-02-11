import React, { useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  Star,
  ChevronRight,
  BarChart,
  Sparkles,
  Zap,
  Menu,
  X,
  FileText,
  Brain,
  Send
} from "lucide-react";

export default function LandingPage() {
  // Estado para controlar o menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Propulse Logo" 
                className="h-10 w-10 md:h-12 md:w-12 transition-transform duration-300 group-hover:scale-110 object-contain" 
              />
              <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Propulse
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium">
              Como Funciona
            </a>
            <a href="#features" className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium">
              Funcionalidades
            </a>
            <a href="/login" className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium">
              Login
            </a>
            <a
              href="/register"
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              Criar Conta
              <Sparkles className="h-4 w-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-emerald-600 focus:outline-none p-2"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
            <a href="#como-funciona" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium p-2 hover:bg-emerald-50 rounded-lg">Como Funciona</a>
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium p-2 hover:bg-emerald-50 rounded-lg">Funcionalidades</a>
            <a href="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium p-2 hover:bg-emerald-50 rounded-lg">Login</a>
            <a href="/register" onClick={() => setIsMenuOpen(false)} className="flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold mt-2">
              Criar Conta <Sparkles className="h-4 w-4" />
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Zap className="h-4 w-4 text-amber-500" />
                Novidade: IA Integrada
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Cria orçamentos em{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  segundos
                </span>
                , não em horas
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Gera e envia orçamentos profissionais sem esforço.
                Deixa a Inteligência Artificial tratar da escrita enquanto tu fechas mais negócios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="/register"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold text-lg"
                >
                  Começar Grátis
                  <ChevronRight className="h-5 w-5" />
                </a>
              </div>
              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-6 sm:gap-12 pt-8 border-t border-gray-200/60">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">10x</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Mais Rápido</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">100%</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Profissional</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">24/7</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Disponível</p>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative mt-10 lg:mt-0 px-4 sm:px-0">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              <img
                src="/budget.jpg"
                alt="Dashboard Propulse"
                className="rounded-3xl shadow-2xl w-full h-[300px] sm:h-[500px] lg:h-[600px] object-cover relative z-10 transform lg:hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -left-2 sm:-left-6 bg-white p-4 sm:p-6 rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-4 z-20 border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-2 sm:p-3 rounded-xl">
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm sm:text-lg">
                    Aprovado por Profissionais
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm">de Norte a Sul</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex justify-center mt-12 pb-16">
          <a
            href="#como-funciona"
            className="animate-bounce flex flex-col items-center text-sm text-gray-500 hover:text-emerald-600 transition-colors duration-300"
          >
            <span className="mb-2 font-medium">Descobre Mais</span>
            <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center hover:border-emerald-500 transition-colors duration-300">
              <div className="w-1.5 h-3 bg-emerald-500 rounded-full mt-2 animate-pulse"></div>
            </div>
          </a>
        </div>
      </div>

      {/* --- NOVA SECÇÃO: COMO FUNCIONA --- */}
      <div id="como-funciona" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como funciona o <span className="text-emerald-600">Propulse</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Três passos simples para fechar negócios mais depressa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Linha conectora (visível apenas em Desktop) */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-emerald-100 via-teal-200 to-emerald-100 z-0 w-2/3 mx-auto"></div>

            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border-4 border-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-xl group-hover:border-emerald-200 transition-colors duration-300">
                <FileText className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. Insere os Dados</h3>
              <p className="text-gray-600">Adiciona o teu cliente e os itens/serviços com os respetivos preços.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border-4 border-teal-50 rounded-full flex items-center justify-center mb-6 shadow-xl group-hover:border-teal-200 transition-colors duration-300">
                <Brain className="h-10 w-10 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">2. A IA Faz a Magia</h3>
              <p className="text-gray-600">Com um clique, a nossa IA escreve um resumo profissional e persuasivo.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border-4 border-cyan-50 rounded-full flex items-center justify-center mb-6 shadow-xl group-hover:border-cyan-200 transition-colors duration-300">
                <Send className="h-10 w-10 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3. Pronto a Enviar</h3>
              <p className="text-gray-600">Guarda em PDF ou partilha diretamente com o cliente para aprovação.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              Funcionalidades Poderosas
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo o que precisas num{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                único lugar
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              A forma mais simples de gerir orçamentos e clientes com tecnologia de ponta.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 w-14 h-14 flex items-center justify-center rounded-xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Múltiplas Empresas
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Cria e organiza várias empresas num só espaço — cada empresa com clientes, orçamentos e definições independentes.
              </p>
            </div>
            <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 w-14 h-14 flex items-center justify-center rounded-xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BriefcaseBusiness className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Textos por IA
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Elimina o bloqueio de escritor: a IA escreve apresentações profissionais personalizadas para cada orçamento.
              </p>
            </div>
            <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 w-14 h-14 flex items-center justify-center rounded-xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Dashboard Analítico
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Controla o estado de todos os orçamentos (Rascunho, Enviado, Aceite) num relance para não perderes nenhuma oportunidade.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Pronto para poupar tempo?
              </h2>
              <p className="text-emerald-50 text-lg md:text-xl max-w-xl">
                Cria a tua conta gratuita e começa a gerar orçamentos incríveis hoje mesmo.
              </p>
            </div>
            <a
              href="/register"
              className="bg-white text-emerald-600 px-8 py-4 md:px-10 md:py-5 rounded-xl transition-all duration-300 text-lg font-bold shadow-2xl hover:shadow-emerald-900/20 transform hover:-translate-y-1 whitespace-nowrap"
            >
              Começar Agora
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.png" alt="Propulse" className="h-8 w-8 grayscale brightness-200" />
                <span className="text-2xl font-bold text-white">Propulse</span>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                A solução inteligente para criação e gestão de orçamentos com tecnologia de IA.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Produto</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#como-funciona" className="hover:text-emerald-400 transition-colors">Como Funciona</a></li>
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Funcionalidades</a></li>
                <li><a href="/login" className="hover:text-emerald-400 transition-colors">Entrar</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Termos de Serviço</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Ajuda</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Suporte</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Propulse. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
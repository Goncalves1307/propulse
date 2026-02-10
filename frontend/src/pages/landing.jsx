import React from "react";
import {
  BriefcaseBusiness,
  Building2,
  Clock,
  Star,
  ChevronRight,
  Calendar,
  Shield,
  Users,
  BarChart,
  Sparkles,
  Zap,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Propulse Logo" 
                className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Propulse
            </span>
          </a>
          <div className="flex items-center gap-8">
            <a 
              href="#features" 
              className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium"
            >
              Funcionalidades
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium"
            >
              Contacto
            </a>
            <a 
              href="/login" 
              className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium"
            >
              Login
            </a>
            <a
              href="/register"
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              Criar Conta
              <Sparkles className="h-4 w-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Zap className="h-4 w-4" />
                Novidade: IA Integrada
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Cria orçamentos em{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  segundos
                </span>
                , não em horas
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Gera e envia orçamentos profissionais sem esforço.
                Deixa a IA tratar do texto enquanto tu tratas do cliente.
              </p>
              <div className="flex gap-4">
                <a
                  href="/register"
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold text-lg"
                >
                  Começar Grátis
                  <ChevronRight className="h-5 w-5" />
                </a>
              </div>
              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-3xl font-bold text-gray-900">10x</p>
                  <p className="text-sm text-gray-600">Mais Rápido</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">100%</p>
                  <p className="text-sm text-gray-600">Profissional</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">24/7</p>
                  <p className="text-sm text-gray-600">Disponível</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              <img
                src="/budget.jpg"
                alt="Dashboard"
                className="rounded-3xl shadow-2xl w-full h-[600px] object-cover relative z-10 transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 z-20 border border-gray-100 hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-3 rounded-xl">
                  <Star className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">
                    Confiado por Profissionais
                  </p>
                  <p className="text-gray-500">de Norte a Sul</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12 pb-16">
          <a
            href="#features"
            className="animate-bounce flex flex-col items-center text-sm text-gray-500 hover:text-emerald-600 transition-colors duration-300"
          >
            <span className="mb-2 font-medium">Descobre Mais</span>
            <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center hover:border-emerald-500 transition-colors duration-300">
              <div className="w-1.5 h-3 bg-emerald-500 rounded-full mt-2 animate-pulse"></div>
            </div>
          </a>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              Funcionalidades Poderosas
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo o que precisas num{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                único lugar
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A forma mais simples de gerir orçamentos e clientes com tecnologia de ponta.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-emerald-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 w-14 h-14 flex items-center justify-center rounded-xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Gestão de Empresas Simplificada
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Cria e organiza várias empresas num só espaço — cada empresa com clientes, orçamentos e definições independentes para um controlo total.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-emerald-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 w-14 h-14 flex items-center justify-center rounded-xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BriefcaseBusiness className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Orçamentos Gerados por IA
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Elimina tarefas manuais: a IA escreve textos profissionais e personalizados prontos a enviar em segundos.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-emerald-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 w-14 h-14 flex items-center justify-center rounded-xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Validação Online Instantânea
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Permite que os teus clientes aprovem orçamentos através de uma página dedicada — mais rápido e sem emails desnecessários.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Pronto para poupar tempo?
              </h2>
              <p className="text-white/90 text-xl">
                Cria a tua conta gratuita e começa a gerar orçamentos profissionais hoje mesmo.
              </p>
            </div>
            <a
              href="/register"
              className="bg-white hover:bg-gray-50 text-emerald-600 px-10 py-5 rounded-xl transition-all duration-300 text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 whitespace-nowrap"
            >
              Começar Grátis
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-2 rounded-lg">
                  <BriefcaseBusiness className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Propulse</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                A solução definitiva para criação e gestão de orçamentos profissionais com tecnologia de IA.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Produto</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="hover:text-emerald-400 transition-colors duration-300">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors duration-300">
                    Segurança
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Empresa</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors duration-300">
                    Sobre Nós
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Ajuda</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors duration-300">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors duration-300">
                    Contactos
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Propulse. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
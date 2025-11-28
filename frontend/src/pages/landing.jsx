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
 } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-1">
            <img src="/logo.png" alt="Propulse Logo" className="h-12 w-12 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Propulse</span>
          </a>    
          <div className="flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Funcionalidades
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Contacto
            </a>
            <a href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </a>
            <a
              href="/register"
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Criar Conta
            </a>
            </div>
        </div>
      </nav>
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-13 ">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 ">
                  Cria Orçamentos em Segundos, Não em Horas
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Gera e envia orçamentos profissionais sem esforço.
                Deixa a IA tratar do texto enquanto tu tratas do cliente.
              </p>
              <div className="flex gap-4">
                <a
                  href="/register"
                  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Começar Grátis
                  <ChevronRight className="h-5 w-5" />
                </a>
                </div>
            </div>
            <div className="relative">
              <img
                src="/budget.jpg"
                alt="Dashboard"
                className="rounded-2xl shadow-2xl w-[450px] h-[650px] object-cover justify-self-end "
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg flex items-center gap-3 ml-30">
                <div className="bg-primary-100 p-2 rounded-full">
                  <Star className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Confiado por Profissionais
                  </p>
                  <p className="text-sm text-gray-500">de Norte a Sul</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-16">
          <a
            href="#features"
            className="animate-bounce flex flex-col items-center text-sm text-gray-500 dark:text-gray-400"
          >
            <span className="mb-2">Scroll Down</span>
            <div className="w-5 h-10 rounded-full border-2 border-gray-300 dark:border-gray-700 flex justify-center">
              <div className="w-1 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 animate-pulse-slow"></div>
            </div>
          </a>
        </div>
      </div>

            {/* Features */}
      <div id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Funcionalidades
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A forma mais simples de gerir orçamentos e clientes num único lugar.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-emerald-600 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gestão de Empresas Simplificada
              </h3>
              <p className="text-gray-600">
                Cria e organiza várias empresas num só espaço — cada empresa com clientes, orçamentos e definições independentes para um controlo total.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-emerald-600 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <BriefcaseBusiness className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Orçamentos Gerados por IA, em Segundos
              </h3>
              <p className="text-gray-600">
                Elimina tarefas manuais: a IA escreve textos profissionais e personalizados prontos a enviar em segundos.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-emerald-600 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <BarChart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Validação de Orçamentos Online
              </h3>
              <p className="text-gray-600">
                Permite que os teus clientes aprovem orçamentos através de uma página dedicada — mais rápido e sem trocas de emails desnecessárias.
              </p>
            </div>
          </div>
        </div>
      </div>
            {/* CTA */}
      <div className="bg-emerald-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-4">
                Pronto para poupar tempo?
              </h2>
              <p className="text-white text-lg">
                Cria a tua conta gratuita e começa a gerar orçamentos profissionais hoje mesmo.
              </p>
            </div>
            <a
              href="/register"
              className="bg-gray-100 hover:bg-gray-200 text-emerald-600 px-8 py-4 rounded-lg transition-colors text-lg font-semibold"
            >
              Começar Grátis
            </a>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BriefcaseBusiness className="h-6 w-6 text-emerald-600" />
                <span className="text-xl font-bold text-white">Propulse</span>
              </div>
              <p className="text-gray-400">
                A solução definitiva para criação e gestão de orçamentos profissionais.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Produto</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Funcionalidades
                  </a>
                </li>
                <li>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Segurança
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sobre Nós
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Ajuda</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
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
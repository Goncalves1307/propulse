import React from "react";
 import {
//   Scissors,
   Calendar,
//   Clock,
//   Star,
//   ChevronRight,
//   Users,
//   Shield,
//   BarChart,
 } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img src="/logo.png" alt="Propulse Logo" className="h-9 w-9 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Propulse</span>
          </div>    
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
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Criar Conta
            </a>
            </div>
        </div>
      </nav>
    </div>
    );
    }
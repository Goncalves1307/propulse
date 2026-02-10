// src/pages/dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- Adicionado para navegação suave
import { Plus } from "lucide-react";
import {
  Menu,
  X,
  LayoutDashboard,
  NotebookText,
  UserRound,
  Settings,
  Building2,
  Sparkles,
  ChevronDown
} from "lucide-react";
import API from "../../api/axios";
import DashboardComponent from "../../components/dashboardComponent";
import Companies from "../../components/Company/companiesComponent";
import Quotes from "../../components/Quotes/quoteController";
import Clients from "../../components/Client/clientComponent";
import CompanyMembers from "../../components/Company/companyMembers";
import Setting from "../../components/settings";

function Dashboard() {
  const navigate = useNavigate(); // <-- Inicializado
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [companies, setCompanies] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const token = localStorage.getItem("token");

  const fetchCompanies = async () => {
    try {
      const response = await API.get("/company/");
      setCompanies(response.data.items || []);
    } catch (err) {
      console.error("Failed to load companies:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const navigationItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "companies", name: "Companies", icon: Building2 },
    { id: "quotes", name: "Quotes", icon: NotebookText },
    { id: "clients", name: "Clients", icon: UserRound },
    { id: "members", name: "Members", icon: UserRound },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // <-- Melhoria de performance (Navegação sem reload)
  };

  const fetchUserData = async () => {
    if (!token) {
      setLoadingUser(false);
      setUserError("No token found. Please log in again.");
      return;
    }
    try {
      const response = await API.get("/auth/me", { // ...
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout(); 
      } else {
        setUserError("Failed to load user data.");
      }
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  // Escolhe a empresa ativa: ou a selecionada, ou a primeira da lista
  const currentCompany = selectedCompany || companies[0] || null;

  // Handlers para Quick Actions do dashboard
  const handleGoToQuotes = () => {
    if (!currentCompany) return;
    setSelectedCompany(currentCompany);
    setActiveSection("quotes");
  };

  const handleGoToClients = () => {
    if (!currentCompany) return;
    setSelectedCompany(currentCompany);
    setActiveSection("clients");
  };

  const handleGoToReports = () => {
    setActiveSection("dashboard");
  };

  const handleCreateQuoteFromClient = (client) => {
    if (!currentCompany) return;
    setSelectedCompany(currentCompany);
    setSelectedClient(client);
    setActiveSection("quotes");
  };

  // --- MELHORIA: ECRÃ DE LOADING ELEGANTE ---
if (!loadingUser && companies.length === 0 && activeSection !== "companies" && activeSection !== "settings") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Building2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Bem-vindo ao Propulse!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Parece que ainda não tem nenhum Workspace. Para começar a gerir orçamentos e clientes, crie a sua primeira empresa.
          </p>
          <button
            onClick={() => setActiveSection("companies")}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            Criar a Minha Empresa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-emerald-50">
      {/* Botão mobile */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed top-5 right-5 p-3 rounded-xl bg-white text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300 z-50 border border-gray-100"
      >
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-all duration-300 ease-out z-40 border-r border-gray-100
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-500 to-teal-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <img src="/logo.png" alt="Propulse Logo" className="h-10 w-10 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white tracking-tight">
                  Propulse
                </span>
                <span className="text-xs text-emerald-100 font-medium">
                  Budget Generator
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMenuOpen(false); // Fecha o menu no mobile após clique
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 group relative overflow-hidden
                    ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200 scale-[1.02]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600 hover:scale-[1.01]"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                  <item.icon
                    className={`h-5 w-5 relative z-10 ${
                      isActive ? "" : "group-hover:scale-110 transition-transform duration-200"
                    }`}
                  />
                  <span className="relative z-10">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-emerald-50">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate font-medium">
                  {user?.email || "Loading..."}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Logout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-400 text-center font-medium">
              &copy; 2026 Propulse.
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 lg:px-8 py-4 gap-4">
            {/* Title Section */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-200">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {navigationItems.find((item) => item.id === activeSection)?.name || "Dashboard"}
                </h1>
                <p className="text-xs lg:text-sm text-gray-500 font-medium">
                  Gerencie os seus orçamentos de forma inteligente
                </p>
              </div>
            </div>

            {/* --- MELHORIA: SELETOR GLOBAL DE EMPRESAS --- */}
            {companies.length > 0 && (
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Building2 className="h-4 w-4 text-emerald-600" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Workspace Atual</span>
                  <div className="relative">
                    <select
                      value={currentCompany?.id || ""}
                      onChange={(e) => {
                        const comp = companies.find((c) => c.id === e.target.value);
                        setSelectedCompany(comp);
                        setSelectedClient(null); // Reseta o cliente para evitar bugs entre empresas
                      }}
                      className="appearance-none bg-transparent pr-6 text-sm font-bold text-gray-800 outline-none cursor-pointer hover:text-emerald-600 transition-colors"
                    >
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="h-3 w-3 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeSection === "dashboard" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DashboardComponent
                  selectedCompany={currentCompany}
                  onCreateQuote={handleGoToQuotes}
                  onAddClient={handleGoToClients}
                  onViewReports={handleGoToReports}
                />
              </div>
            )}

            {activeSection === "quotes" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Quotes
                  userId={user?.id}
                  selectedCompany={currentCompany}
                  selectedClient={selectedClient}
                  onClearCompany={() => setSelectedCompany(null)}
                />
              </div>
            )}

            {activeSection === "companies" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Companies
                  userId={user?.id}
                  onSelectCompany={(company) => {
                    setSelectedCompany(company);
                    setActiveSection("clients");
                  }}
                />
              </div>
            )}

            {activeSection === "clients" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Clients
                  userId={user?.id}
                  selectedCompany={currentCompany}
                  onCreateQuote={handleCreateQuoteFromClient}
                />
              </div>
            )}

            {activeSection === "members" && currentCompany && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CompanyMembers companyId={currentCompany.id} />
              </div>
            )}

            {activeSection === "settings" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Setting userId={user?.id} /> 
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Overlay Mobile */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
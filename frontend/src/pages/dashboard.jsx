// src/pages/dashboard.jsx
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  NotebookText,
  UserRound,
  Settings,
  Building2,
  Sparkles
} from "lucide-react";
import API from "../../api/axios";
import DashboardComponent from "../../components/dashboardComponent";
import Companies from "../../components/Company/companiesComponent";
import Quotes from "../../components/Quotes/quoteController";
import Clients from "../../components/Client/clientComponent";
import CompanyMembers from "../../components/Company/companyMembers";
import Setting from "../../components/settings";

function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [companies, setCompanies] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
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
    window.location.href = "/login";
  }
  const fetchUserData = async () => {
    if (!token) {
      setLoadingUser(false);
      setUserError("No token found. Please log in again.");
      return;
    }

    try {
      const response = await API.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      setUserError(null);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserError("Failed to load user data.");
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  // escolhe a empresa ativa: ou a selecionada, ou a primeira da lista
  const currentCompany = selectedCompany || companies[0] || null;

  // handlers para Quick Actions do dashboard
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-emerald-50">
      {/* botão mobile */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed top-5 right-5 p-3 rounded-xl bg-white text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300 z-50 border border-gray-100"
      >
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* sidebar */}
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
                <img src="/logo.png" alt="Propulse Logo" className="h-10 w-10" />
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
                  onClick={() => setActiveSection(item.id)}
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

          <div className="p-4 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-emerald-50">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "Loading..."}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
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
          </div>
          <div className="p-4 text-xs text-gray-400 text-center">
            &copy; 2025 Propulse. All rights reserved.
          </div>
        </div>
      </div>

      {/* main */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-between px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  AI Budget Generator
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  {navigationItems.find((item) => item.id === activeSection)?.name || "Dashboard"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {activeSection === "dashboard" && (
              <div className="animate-fadeIn">
                <DashboardComponent
                  selectedCompany={currentCompany}
                  onCreateQuote={handleGoToQuotes}
                  onAddClient={handleGoToClients}
                  onViewReports={handleGoToReports}
                />
              </div>
            )}

            {activeSection === "quotes" && (
              <div className="animate-fadeIn">
                <Quotes
                  userId={user?.id}
                  selectedCompany={currentCompany}
                  onClearCompany={() => setSelectedCompany(null)}
                />
              </div>
            )}

            {activeSection === "companies" && (
              <div className="animate-fadeIn">
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
              <div className="animate-fadeIn">
                <Clients userId={user?.id} selectedCompany={currentCompany} />
              </div>
            )}

            {activeSection === "members" && currentCompany && (
              <div className="animate-fadeIn">
                <CompanyMembers companyId={currentCompany.id} />
              </div>
            )}

            {activeSection === "settings" && (<div className="animate-fadeIn">
                <Setting userId={user?.id} /> 
              </div>)
            }
          </div>
        </main>
      </div>

      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
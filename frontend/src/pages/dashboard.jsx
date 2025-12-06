import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  NotebookText,
  UserRound,
  Settings,
  CircleUserRound,
  Building2
} from "lucide-react";
import API from "../../api/axios";
import DashboardComponent from "../../components/dashboardComponent";
import Companies from "../../components/Company/companiesComponent";
import Quotes from "../../components/Quotes/quoteController";
import Clients from "../../components/Client/clientComponent";
import CompanyMembers from "../../components/Company/companyMembers";


function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const token = localStorage.getItem("token");

  const navigationItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "companies", name: "Companies", icon: Building2 },
    { id: "quotes", name: "Quotes", icon: NotebookText },
    { id: "clients", name: "Clients", icon: UserRound },
    { id: "members", name: "Members", icon: UserRound },
    { id: "settings", name: "Settings", icon: Settings },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 right-0 p-4 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-40
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-2 border-b border-gray-200 hover:opacity-80 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <img src="/logo.png" alt="Propulse Logo" className="h-12 w-12" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Propulse
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full flex items-center gap-4 px-4 py-4 rounded-lg text-lg font-medium transition-all duration-150
                  ${
                    activeSection === item.id
                      ? "bg-emerald-50 text-emerald-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-5">
            <h1 className="text-xl font-thin text-gray-800 flex items-center gap-2">
              AI Budget Generator
            </h1>

            <div className="flex items-center gap-4">
              {loadingUser && (
                <span className="text-sm text-gray-500">Loading user...</span>
              )}

              {!loadingUser && user && (
                <span className="text-lg text-gray-700 flex items-center gap-2">
                  {user.name}
                  <CircleUserRound className="h-10 w-10 text-black" />
                </span>
              )}

              {!loadingUser && !user && userError && (
                <span className="text-sm text-red-500">{userError}</span>
              )}
            </div>
          </div>
        </header>

        {/* Content sections based on activeSection */}
        <main className="p-6">
          {activeSection === "dashboard" && <DashboardComponent user={user} />}

          {activeSection === "quotes" && (
            <Quotes
              userId={user?.id}
              selectedCompany={selectedCompany}
              onClearCompany={() => setSelectedCompany(null)}
            />
          )}

          {activeSection === "companies" && (
            <Companies
              userId={user?.id}
              onSelectCompany={(company) => {
                setSelectedCompany(company);
                setActiveSection("clients");
              }}
            />
          )}

          {activeSection === "clients" && (
            <Clients
              userId={user?.id}
              selectedCompany={selectedCompany}
            />
          )}

          {activeSection === "members" && selectedCompany && (
            <CompanyMembers companyId={selectedCompany.id} />
            )}
          {activeSection === "settings" && <div>Settings content.</div>}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
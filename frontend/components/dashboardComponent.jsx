// src/components/dashboardComponent.jsx
import { TrendingUp, ArrowUpRight } from "lucide-react";
import API from "../api/axios";
import { CalendarCheck, Scissors, Users, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";

function DashboardComponent({ selectedCompany, onCreateQuote, onAddClient, onViewReports }) {
  const [quotes, setQuotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const token = localStorage.getItem("token");
  const companyId = selectedCompany?.id || null;

  const fetchClients = async () => {
    if (!companyId) return;
    try {
      const response = await API.get(`/client/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClients(response.data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchQuotes = async () => {
    if (!companyId) return;
    try {
      const response = await API.get(`/client/${companyId}/quotes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuotes(response.data.quotes || []);

      console.log(quotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    }
  };

  const stats = [
    {
      title: "Total Quotes",
      value: quotes.length,
      icon: CalendarCheck,
      gradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500",
      shadowColor: "shadow-blue-500/20",
    },
    {
      title: "Total Clients",
      value: clients.length,
      icon: Users,
      gradient: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-500",
      shadowColor: "shadow-emerald-500/20",
    },
    {
      title: "Pending Quotes",
      value: quotes.filter((q) => q.status === "PENDING" || q.status === "DRAFT").length,
      icon: Scissors,
      gradient: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-500",
      shadowColor: "shadow-amber-500/20",
    },
    {
      title: "Accepted Quotes",
      value: quotes.filter((q) => q.status === "ACCEPTED").length,
      icon: CreditCard,
      gradient: "from-rose-500 to-pink-500",
      iconBg: "bg-rose-500",
      shadowColor: "shadow-rose-500/20",
    },
  ];

  useEffect(() => {
    if (companyId) {
      fetchQuotes();
      fetchClients();
    } else {
      setQuotes([]);
      setClients([]);
    }
  }, [companyId]);

  return (
    <main className="p-6">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Welcome back! Here's your business overview for{" "}
              <span className="font-bold">{selectedCompany?.name || "your company"}</span>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 ${stat.iconBg} rounded-xl ${stat.shadowColor} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs font-semibold">Live</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
            </div>
          ))}
        </div>

        {/* Recent + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {quotes.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <CalendarCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No recent activity</p>
                </div>
              ) : (
                quotes.slice(0, 5).map((quote) => (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Quote #{quote.quoteNumber || quote.id}
                        </p>
                        <p className="text-xs text-gray-500">{quote.status}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-2">Quick Actions</h2>
            <p className="text-blue-100 mb-6 text-sm">Manage your business efficiently</p>
            <div className="space-y-3">
              <button
                onClick={onCreateQuote}
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 flex items-center justify-between group"
              >
                <span className="font-medium">Create New Quote</span>
                <ArrowUpRight className="h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button
                onClick={onAddClient}
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 flex items-center justify-between group"
              >
                <span className="font-medium">Add New Client</span>
                <ArrowUpRight className="h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button
                onClick={onViewReports}
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 flex items-center justify-between group"
              >
                <span className="font-medium">View Reports</span>
                <ArrowUpRight className="h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardComponent;
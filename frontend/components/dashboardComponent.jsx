import { TrendingUp } from "lucide-react";
import API from "../api/axios";
import { CalendarCheck, Scissors, Users, CreditCard } from "lucide-react";
import { useState } from "react";

function DashboardComponent({activeSection}) {
 const stats = [
    {
      title: "Total Quotes",
      // value: quotes.length,
      icon: CalendarCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Clients",
      // value: clients.length,
      icon: Scissors,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending Quotes",
      // value: quotes.length,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Accepted Quotes",
      // value: quotes.length,
      icon: CreditCard,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];
  const fetchQuotes = async () =>{
    try {
        const response = await API.get("/client/:companyId/quotes", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
        });
        setQuotes(response.data);   
    } catch (error) {
        console.error("Error fetching quotes:", error);
    }
  }
    const [quotes, setQuotes] = useState([]);
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const token = localStorage.getItem("token");
    return (
                <main className="p-6">
          {activeSection === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
    );
}

export default DashboardComponent;
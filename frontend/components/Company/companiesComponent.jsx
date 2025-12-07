import { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Edit, Users, Calendar } from 'lucide-react';
import API from '../../api/axios';
import CompanyForm from './CompanyForm';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default function Companies({ userId, onSelectCompany }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientCounts, setClientCounts] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await API.get('/company/');
      const items = response.data.items || [];
      setCompanies(items);
      setError(null);
      await fetchClientCounts(items);
    } catch (err) {
      setError(err.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientCounts = async (companyList) => {
    try {
      const entries = await Promise.all(
        (companyList || []).map(async (company) => {
          try {
            const res = await API.get(`/client/${company.id}`);
            const clientsData = res.data || [];
            return [company.id, clientsData.length];
          } catch (err) {
            console.error(`Failed to load clients for company ${company.id}:`, err);
            return [company.id, 0];
          }
        })
      );
      setClientCounts(Object.fromEntries(entries));
    } catch (err) {
      console.error('Failed to load client counts:', err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this company?')) return;

    try {
      await API.delete(`/company/${id}`);
      setCompanies(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleEdit = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await API.get(`/company/${id}`);
      setEditingCompany(res.data);
      setShowForm(true);
    } catch (err) {
      alert('Failed to load company data');
    }
  };

  const handleSuccess = () => {
    setEditingCompany(null);
    setShowForm(false);
    fetchCompanies();
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  if (showForm) {
    return (
      <CompanyForm
        userId={userId}
        company={editingCompany}
        onSuccess={handleSuccess}
        onCancel={() => {
          setEditingCompany(null);
          setShowForm(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Companies</h2>
          <p className="text-gray-600">Manage your company profiles and clients</p>
        </div>
        <button
          onClick={() => {
            setEditingCompany(null);
            setShowForm(true);
          }}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Company
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : companies.length === 0 ? (
        /* Empty State */
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <Building2 className="h-16 w-16 text-gray-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No companies yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Get started by creating your first company profile to organize your clients and projects
          </p>
          <button
            onClick={() => {
              setEditingCompany(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
          >
            <Plus className="h-5 w-5" />
            Create Your First Company
          </button>
        </div>
      ) : (
        /* Companies Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map(company => (
            <div
              key={company.id}
              onClick={() => onSelectCompany?.(company)}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                {/* Header with icon and actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{clientCounts[company.id] ?? 0} clients</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleEdit(company.id, e)}
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      title="Edit company"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={(e) => handleDelete(company.id, e)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete company"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Created {new Date(company.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                  </div>

                  {onSelectCompany && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCompany(company);
                      }}
                      className="w-full py-2 text-sm font-medium text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 rounded-lg border border-emerald-200 hover:border-transparent transition-all duration-300"
                    >
                      View Clients →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Edit } from 'lucide-react';
import API from '../../api/axios';
import CompanyForm from './CompanyForm';

export default function Companies({ userId, onSelectCompany }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await API.get('/company/');
      setCompanies(response.data.items || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;

    try {
      await API.delete(`/company/${id}`);
      setCompanies(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await API.get(`/company/${id}`);
      setEditingCompany(res.data);
      setShowForm(true);
      console.log(res.data);
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
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Companies</h1>
        <button
          onClick={() => {
            setEditingCompany(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg"
        >
          <Plus className="h-5 w-5" />
          Add Company
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center">Loading...</div>
      ) : companies.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <Building2 className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies yet</h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first company profile
          </p>
          <button
            onClick={() => {
              setEditingCompany(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
          >
            <Plus className="h-5 w-5" />
            Create Company
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map(company => (
            <div
              key={company.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <Building2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {company.name}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(company.id)}
                    className="p-2 text-gray-400 hover:text-emerald-600 transition"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(company.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Created {new Date(company.createdAt).toLocaleDateString()}
                </p>

                {onSelectCompany && (
                  <button
                    onClick={() => onSelectCompany(company)}
                    className="mt-3 text-sm text-emerald-600 hover:underline"
                  >
                    View Clients
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
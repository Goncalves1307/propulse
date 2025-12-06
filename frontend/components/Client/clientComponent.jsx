import { useState, useEffect } from 'react';
import { UserRound, Plus, Trash2, Edit, Mail, Phone, Building2, CopyMinusIcon } from 'lucide-react';
import API from '../.././api/axios';
import ClientForm from './ClientForm';

export default function Clients({ userId, selectedCompany }) {
  const [clients, setClients] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  const fetchCompanies = async () => {
    try {
      const response = await API.get('/company/');
      setCompanies(response.data.items || []);
    } catch (err) {
      console.error('Failed to load companies:', err);
    }
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/client/${selectedCompany?.id}`);
      const clientsData = response.data || [];
      setClients(clientsData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      await API.delete(`/clients/${id}`);
      setClients(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete client');
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await API.get(`/clients/${id}`);
      setEditingClient(res.data);
      setShowForm(true);
    } catch (err) {
      alert('Failed to load client data');
    }
  };

  const handleSuccess = () => {
    setEditingClient(null);
    setShowForm(false);
    fetchClients();
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'No Company';
  };

  useEffect(() => {
    fetchCompanies();
    fetchClients();
  }, []);

  if (showForm) {
    return (
      <ClientForm
        userId={userId}
        client={editingClient}
        companies={companies}
        onSuccess={handleSuccess}
        onCancel={() => {
          setEditingClient(null);
          setShowForm(false);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Clients</h1>
        <button
          onClick={() => {
            setEditingClient(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          <Plus className="h-5 w-5" />
          Add Client
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center">Loading...</div>
      ) : clients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <UserRound className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No clients yet
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first client
          </p>
          <button
            onClick={() => {
              setEditingClient(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
          >
            <Plus className="h-5 w-5" />
            Create Client
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => (
            <div
              key={client.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <UserRound className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {client.name}
                    </h3>
                    {client.companyId && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Building2 className="h-3 w-3" />
                        {getCompanyName(client.companyId)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(client.id)}
                    className="p-2 text-gray-400 hover:text-emerald-600 transition"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(client.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {client.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a
                      href={`mailto:${client.email}`}
                      className="hover:text-emerald-600 transition"
                    >
                      {client.email}
                    </a>
                  </div>
                )}

                {client.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${client.phone}`}
                      className="hover:text-emerald-600 transition"
                    >
                      {client.phone}
                    </a>
                  </div>
                )}

                {client.address && (
                  <div className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">
                    <p className="line-clamp-2">{client.address}</p>
                  </div>
                )}
              </div>

              {client.notes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {client.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

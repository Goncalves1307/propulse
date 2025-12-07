import { useState, useEffect } from 'react';
import { UserRound, Plus, Trash2, Edit, Mail, Phone, Building2, MapPin, FileText, Calendar } from 'lucide-react';
import API from '../../api/axios';
import ClientForm from './ClientForm';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name) {
  const colors = [
    'bg-gradient-to-br from-emerald-400 to-teal-500',
    'bg-gradient-to-br from-blue-400 to-indigo-500',
    'bg-gradient-to-br from-purple-400 to-pink-500',
    'bg-gradient-to-br from-orange-400 to-red-500',
    'bg-gradient-to-br from-yellow-400 to-orange-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

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

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      await API.delete(`/clients/${id}`);
      setClients(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete client');
    }
  };

  const handleEdit = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await API.get(`/client/${selectedCompany?.id}/client/${id}`);
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Clients</h1>
          <p className="text-gray-600">Manage your client relationships</p>
        </div>
        <button
          onClick={() => {
            setEditingClient(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <Plus className="h-5 w-5" />
          Add Client
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : clients.length === 0 ? (
        /* Empty State */
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <UserRound className="h-16 w-16 text-gray-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No clients yet
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Get started by creating your first client to manage relationships and generate quotes
          </p>
          <button
            onClick={() => {
              setEditingClient(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
          >
            <Plus className="h-5 w-5" />
            Create Your First Client
          </button>
        </div>
      ) : (
        /* Clients Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => (
            <div
              key={client.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                {/* Header with avatar and actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Avatar with initials */}
                    <div className={`w-12 h-12 rounded-full ${getAvatarColor(client.name)} flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      {getInitials(client.name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {client.name}
                      </h3>
                      {client.legalName && client.legalName !== client.name && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {client.legalName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleEdit(client.id, e)}
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      title="Edit client"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(client.id, e)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete client"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Company Badge */}
                {client.companyId && (
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                      <Building2 className="h-3.5 w-3.5" />
                      {getCompanyName(client.companyId)}
                    </span>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  {client.email && (
                    <a
                      href={`mailto:${client.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors group/link"
                    >
                      <div className="p-1.5 bg-gray-100 rounded group-hover/link:bg-emerald-50 transition-colors">
                        <Mail className="h-3.5 w-3.5" />
                      </div>
                      <span className="truncate">{client.email}</span>
                    </a>
                  )}

                  {client.phone && (
                    <a
                      href={`tel:${client.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors group/link"
                    >
                      <div className="p-1.5 bg-gray-100 rounded group-hover/link:bg-emerald-50 transition-colors">
                        <Phone className="h-3.5 w-3.5" />
                      </div>
                      <span>{client.phone}</span>
                    </a>
                  )}

                  {(client.city || client.country) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="p-1.5 bg-gray-100 rounded">
                        <MapPin className="h-3.5 w-3.5" />
                      </div>
                      <span>
                        {[client.city, client.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Address (full) */}
                {client.address && !client.city && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2 text-xs text-gray-600">
                      <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{client.address}</span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {client.notes && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-2">
                      <FileText className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {client.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer - Creation Date */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {client.createdAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Added {new Date(client.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
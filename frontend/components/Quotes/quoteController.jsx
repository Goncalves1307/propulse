import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Edit, X, Building2 } from 'lucide-react';
import API from '../.././api/axios';
import QuoteForm from './QuoteForm';

export default function Quotes({ userId, selectedCompany, onClearCompany }) {
  const [quotes, setQuotes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [editingQuote, setEditingQuote] = useState(null);

  const companyId = selectedCompany?.id || null;

  const fetchCompanies = async () => {
    try {
      const response = await API.get('/company/');
      setCompanies(response.data.items || []);
    } catch (err) {
      console.error('Failed to load companies:', err);
    }
  };

  const fetchQuotes = async () => {
    if (!companyId) {
      // No company selected → clear quotes and stop
      setQuotes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await API.get(`/client/${companyId}/quotes`);
      const quotesData = response.data.items || [];
      setQuotes(quotesData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!companyId) return;
    if (!confirm('Are you sure?')) return;

    try {
      await API.delete(`/client/${companyId}/${id}`);
      setQuotes(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleEdit = async (id) => {
    if (!companyId) return;

    try {
      const res = await API.get(`/client/${companyId}/${id}`);
      setEditingQuote(res.data);
      setShowForm(true);
    } catch (err) {
      alert('Failed to load quote data');
    }
  };

  const handleSuccess = () => {
    setEditingQuote(null);
    setShowForm(false);
    fetchQuotes();
  };

  const getCompanyName = (cId) => {
    const company = companies.find(c => c.id === cId);
    return company ? company.name : 'Unknown Company';
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  if (!companyId && !showForm) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Select a company to view quotes
          </h3>
          <p className="text-gray-600">
            Go to the Companies tab and choose a company to start creating or viewing quotes.
          </p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <QuoteForm
        userId={userId}
        quote={editingQuote}
        companies={companies}
        defaultCompany={selectedCompany}
        onSuccess={handleSuccess}
        onCancel={() => {
          setEditingQuote(null);
          setShowForm(false);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Quotes</h1>
          {selectedCompany && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-600">Filtered by:</span>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
                <Building2 className="h-4 w-4" />
                {selectedCompany.name}
                <button
                  onClick={onClearCompany}
                  className="ml-1 hover:text-emerald-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            setEditingQuote(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          <Plus className="h-5 w-5" />
          Add Quote
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center">Loading...</div>
      ) : quotes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {selectedCompany ? `No quotes for ${selectedCompany.name}` : 'No quotes yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {selectedCompany
              ? 'Create your first quote for this company'
              : 'Get started by creating your first quote'}
          </p>
          <button
            onClick={() => {
              setEditingQuote(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
          >
            <Plus className="h-5 w-5" />
            Create Quote
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map(quote => (
            <div
              key={quote.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {quote.quoteNumber}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Building2 className="h-3 w-3" />
                      {getCompanyName(quote.companyId)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(quote.id)}
                    className="p-2 text-gray-400 hover:text-emerald-600 transition"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(quote.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {quote.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {quote.description}
                </p>
              )}

              {quote.items && quote.items.length > 0 && (
                <div className="mb-4 space-y-2">
                  <div className="text-xs text-gray-500 font-semibold">Items:</div>
                  {quote.items.map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-600">
                      {item.description} - {item.quantity}x ${parseFloat(item.unitPrice).toFixed(2)}
                    </div>
                  ))}
                </div>
              )}

              {(quote.discountAmount || quote.taxAmount) && (
                <div className="mb-4 space-y-1 text-sm">
                  {quote.discountAmount > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Discount:</span>
                      <span>-${parseFloat(quote.discountAmount).toFixed(2)}</span>
                    </div>
                  )}
                  {quote.taxAmount > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Tax:</span>
                      <span>+${parseFloat(quote.taxAmount).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mb-4">
                <p className="text-2xl font-bold text-emerald-600">
                  {quote.currency} ${(quote.items?.reduce((sum, item) => {
                    const itemTotal = (parseFloat(item.unitPrice) || 0) * (parseFloat(item.quantity) || 0);
                    return sum + itemTotal;
                  }, 0) - (parseFloat(quote.discountAmount) || 0) + (parseFloat(quote.taxAmount) || 0)).toFixed(2)}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>
                  {quote.issueDate && `Issued ${new Date(quote.issueDate).toLocaleDateString()}`}
                </span>
                <span className="font-medium text-gray-700">{quote.currency}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
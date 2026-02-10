import { useState, useEffect } from 'react';
import { 
  FileText, Plus, Trash2, Edit, X, Building2, Calendar, 
  Package, TrendingUp, Filter, Brain, Loader2
} from 'lucide-react';
import API from '../../api/axios';
import QuoteForm from './QuoteForm';


function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-8 w-32 bg-gray-200 rounded mt-4"></div>
      </div>
    </div>
  );
}

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: '📝' },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700', icon: '📤' },
  accepted: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700', icon: '✓' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: '✗' },
  expired: { label: 'Expired', color: 'bg-orange-100 text-orange-700', icon: '⏰' },
};

export default function Quotes({ userId, selectedCompany, onClearCompany, selectedClient }) {
  const [quotes, setQuotes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [editingQuote, setEditingQuote] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Estado de loading apenas para a IA
  const [aiLoading, setAiLoading] = useState(null);

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
      setQuotes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await API.get(`/client/${companyId}/quotes`);
      const data = response.data || {};
      const quotesArray = Array.isArray(data.quotes) ? data.quotes : [];
      setQuotes(quotesArray);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!companyId) return;
    if (!confirm('Are you sure you want to delete this quote?')) return;

    try {
      await API.delete(`/client/${companyId}/quote/${id}`);
      setQuotes(prev => prev.filter(q => q.id !== id && q._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const calculateTotal = (quote) => {
    const itemsTotal = quote.items?.reduce((sum, item) => {
      return sum + (parseFloat(item.unitPrice) || 0) * (parseFloat(item.quantity) || 0);
    }, 0) || 0;
    
    const discount = parseFloat(quote.discountAmount) || 0;
    const tax = parseFloat(quote.taxAmount) || 0;
    
    return itemsTotal - discount + tax;
  };

  // Função atualizada para gerar e mostrar o resumo diretamente no ecrã
  const handleGenerateAISummary = async (quote, e) => {
    e.stopPropagation();
    
    const quoteId = quote.id || quote._id;
    const clientId = quote.clientId || quote.client_id || quote.client?.id || selectedClient?.id || selectedClient?._id; 
    
    setAiLoading(quoteId);

    try {
      if (!clientId) {
        throw new Error("Client ID is missing. The quote object doesn't have a valid client reference.");
      }

      const quoteContext = {
        quoteNumber: quote.quoteNumber,
        total: calculateTotal(quote),
        currency: quote.currency,
        items: (quote.items || []).map(i => `${i.quantity}x ${i.description}`),
        clientName: selectedCompany?.name || "Client"
      };

      const payload = {
        type: "summary", 
        context: JSON.stringify(quoteContext),
        prompt: `Create a professional summary for Quote #${quote.quoteNumber}.`
      };

      const response = await API.post(`/company/${companyId}/client/${clientId}/quote/${quoteId}/generate`, payload);
      
      // Assume-se que o teu backend já guarda isto na base de dados quando a rota /generate é chamada.
      const text = response.data.text || response.data.generatedText || response.data.result || response.data.summary;
      
      // Atualiza o estado da lista de quotes instantaneamente para mostrar o texto gerado
      setQuotes(prevQuotes => 
        prevQuotes.map(q => 
          (q.id === quoteId || q._id === quoteId) ? { ...q, generatedText: text } : q
        )
      );

    } catch (err) {
      console.error("AI Error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to generate summary.";
      alert(msg);
    } finally {
      setAiLoading(null);
    }
  };

  const handleEdit = async (id, e) => {
    e.stopPropagation();

    if (!companyId) {
      alert("Company ID is missing");
      return;
    }
    
    if (!id) {
      alert("Quote ID is undefined");
      return;
    }

    try {
      const res = await API.get(`/client/${companyId}/quote/${id}`);
      const q = res.data.quote || res.data; 
      
      if (!q) {
        throw new Error("Quote object is empty");
      }

      setEditingQuote(q);
      setShowForm(true);
    } catch (err) {
      console.error("Erro ao carregar quote:", err);
      const serverMessage = err.response?.data?.message || err.message;
      alert(`Failed to load quote data: ${serverMessage}`);
    }
  };

  const handleSuccess = () => {
    setEditingQuote(null);
    setShowForm(false);
    fetchQuotes();
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [companyId]);

  const filteredQuotes = statusFilter === 'all' 
    ? quotes 
    : quotes.filter(q => q.status?.toLowerCase() === statusFilter);

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || 'draft';
    const config = statusConfig[statusLower] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  if (!companyId && !showForm) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <FileText className="h-16 w-16 text-gray-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Select a company to view quotes
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
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
        selectedClient={selectedClient}
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Quotes</h1>
          {selectedCompany && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-600">Filtered by:</span>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                <Building2 className="h-4 w-4" />
                {selectedCompany.name}
                <button
                  onClick={onClearCompany}
                  className="ml-1 hover:text-emerald-900 transition"
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
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <Plus className="h-5 w-5" />
          Add Quote
        </button>
      </div>

      {/* Status Filters */}
      {quotes.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({quotes.length})
          </button>
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = quotes.filter(q => q.status?.toLowerCase() === key).length;
            if (count === 0) return null;
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  statusFilter === key
                    ? config.color.replace('100', '500').replace('700', 'white')
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {config.icon} {config.label} ({count})
              </button>
            );
          })}
        </div>
      )}

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
      ) : filteredQuotes.length === 0 ? (
        /* Empty State */
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <FileText className="h-16 w-16 text-gray-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {statusFilter !== 'all' 
              ? `No ${statusConfig[statusFilter]?.label} quotes`
              : selectedCompany 
                ? `No quotes for ${selectedCompany.name}`
                : 'No quotes yet'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {statusFilter !== 'all'
              ? 'Try selecting a different status filter'
              : selectedCompany
                ? 'Create your first quote for this company'
                : 'Get started by creating your first quote'}
          </p>
          {statusFilter === 'all' && (
            <button
              onClick={() => {
                setEditingQuote(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
            >
              <Plus className="h-5 w-5" />
              Create Your First Quote
            </button>
          )}
        </div>
      ) : (
        /* Quotes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuotes.map(quote => (
            <div
              key={quote.id || quote._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden flex flex-col"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              <div className="relative flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {quote.quoteNumber}
                      </h3>
                      <div className="mt-1">
                        {getStatusBadge(quote.status)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleGenerateAISummary(quote, e)}
                      disabled={aiLoading === (quote.id || quote._id)}
                      className={`p-2 rounded-lg transition-all relative group
                        ${aiLoading === (quote.id || quote._id)
                          ? 'bg-purple-100 text-purple-600 cursor-wait'
                          : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                        }`}
                      title={quote.generatedText ? "Regenerate AI Summary" : "Generate AI Summary"}
                    >
                      {aiLoading === (quote.id || quote._id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Brain className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleEdit(quote.id || quote._id, e)}
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      title="Edit quote"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(quote.id || quote._id, e)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete quote"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {quote.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {quote.description}
                  </p>
                )}

                {/* Items Summary */}
                {quote.items && quote.items.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
                      <Package className="h-3.5 w-3.5" />
                      Items ({quote.items.length})
                    </div>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {quote.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-xs text-gray-600 flex justify-between">
                          <span className="truncate">{item.description}</span>
                          <span className="font-medium ml-2 flex-shrink-0">
                            {item.quantity}x ${parseFloat(item.unitPrice).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      {quote.items.length > 2 && (
                        <div className="text-xs text-gray-400 italic">
                          +{quote.items.length - 2} more items
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* --- AQUI ENTRA O TEXTO GERADO PELA IA --- */}
                {quote.generatedText && (
                  <div className="mb-4 p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100 shadow-sm relative overflow-hidden group/ai">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Brain className="h-12 w-12 text-violet-600" />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-violet-700 mb-2 relative z-10">
                      <Brain className="h-3.5 w-3.5" />
                      AI Summary
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed relative z-10 line-clamp-4 group-hover/ai:line-clamp-none transition-all duration-300">
                      {quote.generatedText}
                    </p>
                  </div>
                )}

                {/* Spacer to push footer to bottom if card stretches */}
                <div className="flex-1"></div>

                {/* Financial Summary */}
                <div className="space-y-2 mb-4 mt-auto pt-4">
                  {(quote.discountAmount > 0 || quote.taxAmount > 0) && (
                    <div className="space-y-1 text-xs">
                      {quote.discountAmount > 0 && (
                        <div className="flex justify-between text-gray-500">
                          <span>Discount:</span>
                          <span className="text-red-600">-${parseFloat(quote.discountAmount).toFixed(2)}</span>
                        </div>
                      )}
                      {quote.taxAmount > 0 && (
                        <div className="flex justify-between text-gray-500">
                          <span>Tax:</span>
                          <span>+${parseFloat(quote.taxAmount).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Total */}
                  <div className="flex items-baseline justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">Total:</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-emerald-600">
                        ${calculateTotal(quote).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">{quote.currency}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {quote.issueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(quote.issueDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                    )}
                    {quote.validUntil && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>Valid until {new Date(quote.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
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
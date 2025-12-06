import { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import API from '../.././api/axios';

export default function QuoteForm({ userId, quote, companies, defaultCompany, onSuccess, onCancel}) {
  const [formData, setFormData] = useState({
  quoteNumber: quote?.quoteNumber || '',
  currency: quote?.currency || 'USD',
  companyId: quote?.companyId || defaultCompany?.id || '',
  clientId: quote?.clientId || '',             // <- novo
  description: quote?.description || '',
  items: quote?.items || [{ description: '', quantity: 1, unitPrice: 0 }],
  discountAmount: quote?.discountAmount || 0,
  taxAmount: quote?.taxAmount || 0,
  issueDate: quote?.issueDate || new Date().toISOString().split('T')[0],
});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        quoteNumber: formData.quoteNumber,
        currency: formData.currency,
        companyId: formData.companyId,
        clientId: formData.clientId,
        description: formData.description,
        items: formData.items.filter(item => item.description),
        discountAmount: parseFloat(formData.discountAmount) || 0,
        taxAmount: parseFloat(formData.taxAmount) || 0,
        issueDate: formData.issueDate,
      };

      if (quote?.id) {
        await API.put(`/quote/${quote.id}`, payload);
      } else {
        await API.post(`${defaultCompany.id}/quote/`, { ...payload, userId });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save quote');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.unitPrice) || 0) * (parseFloat(item.quantity) || 0);
    }, 0);
    const discount = parseFloat(formData.discountAmount) || 0;
    const tax = parseFloat(formData.taxAmount) || 0;
    return subtotal - discount + tax;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Quotes
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold mb-6">
          {quote ? 'Edit Quote' : 'Create Quote'}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote Number *
              </label>
              <input
                type="text"
                name="quoteNumber"
                value={formData.quoteNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="QT-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date *
              </label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <select
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select a company</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency *
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter quote description"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Items *
              </label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3 border border-gray-200 rounded-lg p-4">
              {formData.items.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No items added yet</p>
              ) : (
                formData.items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-end pb-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <label className="text-xs text-gray-600 block mb-1">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        required
                        placeholder="Item description"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="w-20">
                      <label className="text-xs text-gray-600 block mb-1">Qty</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        min="1"
                        step="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="w-24">
                      <label className="text-xs text-gray-600 block mb-1">Unit Price</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="w-24">
                      <label className="text-xs text-gray-600 block mb-1">Total</label>
                      <div className="px-3 py-2 bg-gray-50 rounded text-sm font-medium">
                        ${((parseFloat(item.unitPrice) || 0) * (parseFloat(item.quantity) || 0)).toFixed(2)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-gray-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="text-sm text-gray-600">
              Subtotal: <span className="font-medium text-gray-900">${formData.items.reduce((sum, item) => sum + ((parseFloat(item.unitPrice) || 0) * (parseFloat(item.quantity) || 0)), 0).toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Discount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    name="discountAmount"
                    value={formData.discountAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Tax</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    name="taxAmount"
                    value={formData.taxAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              Total: ${calculateTotal().toFixed(2)}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || formData.items.length === 0}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Saving...' : quote ? 'Update Quote' : 'Create Quote'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

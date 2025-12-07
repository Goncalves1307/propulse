import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, FileText, Building2, User, Calendar, DollarSign, Package, Tag, Save, X } from 'lucide-react';
import API from '../../api/axios';

function getInitialFormData(quoteProp, defaultCompany) {
  const q = quoteProp?.quote ?? quoteProp;

  return {
    quoteNumber: q?.quoteNumber || '',
    currency: q?.currency || 'USD',
    companyId: q?.companyId || defaultCompany?.id || '',
    clientId: q?.clientId || '',
    status: q?.status || 'Draft',
    description: q?.description || '',
    items: q?.items && q.items.length > 0
      ? q.items
      : [{ description: '', quantity: 1, unitPrice: 0 }],
    discountAmount: q?.discountAmount ?? 0,
    taxAmount: q?.taxAmount ?? 0,
    issueDate: q?.issueDate || new Date().toISOString().split('T')[0],
  };
}

const statusConfig = {
  Draft: { color: 'bg-gray-100 text-gray-700 border-gray-300', icon: '📝' },
  Sent: { color: 'bg-blue-100 text-blue-700 border-blue-300', icon: '📤' },
  Accepted: { color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: '✓' },
  Declined: { color: 'bg-red-100 text-red-700 border-red-300', icon: '✗' },
};

export default function QuoteForm({ userId, quote, companies, defaultCompany, onSuccess, onCancel }) {
  const [formData, setFormData] = useState(() => getInitialFormData(quote, defaultCompany));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);

  const fetchClients = async (companyId) => {
    if (!companyId) {
      setClients([]);
      return;
    }

    try {
      const response = await API.get(`/client/${companyId}`);
      setClients(response.data || []);
    } catch (err) {
      console.error('Failed to load clients:', err);
      setClients([]);
    }
  };

  useEffect(() => {
    setFormData(getInitialFormData(quote, defaultCompany));
  }, [quote, defaultCompany]);

  useEffect(() => {
    if (formData.companyId) {
      fetchClients(formData.companyId);
    } else {
      setClients([]);
    }
  }, [formData.companyId]);

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
        status: formData.status || 'Draft',
        description: formData.description,
        items: formData.items.filter(item => item.description),
        discountAmount: parseFloat(formData.discountAmount) || 0,
        taxAmount: parseFloat(formData.taxAmount) || 0,
        issueDate: formData.issueDate,
      };

      if (quote?.id) {
        await API.put(`/client/${defaultCompany.id}/${quote.id}`, payload);
      } else {
        await API.post(`/client/${defaultCompany.id}/${formData.clientId}/quote`, { ...payload, userId });
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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
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

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.unitPrice) || 0) * (parseFloat(item.quantity) || 0);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = parseFloat(formData.discountAmount) || 0;
    const tax = parseFloat(formData.taxAmount) || 0;
    return subtotal - discount + tax;
  };

  const SelectField = ({ icon: Icon, label, name, value, onChange, options, required = false, placeholder }) => (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const InputField = ({ icon: Icon, label, name, type = 'text', value, onChange, required = false, placeholder }) => (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Back to Quotes</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {quote ? 'Edit Quote' : 'Create New Quote'}
                </h2>
                <p className="text-emerald-50 text-sm mt-1">
                  {quote ? 'Update quote information and items' : 'Fill in the details to generate a new quote'}
                </p>
              </div>
            </div>
            <button 
              onClick={onCancel} 
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="h-1 w-1 bg-emerald-500 rounded-full"></div>
                Quote Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField
                  icon={FileText}
                  label="Quote Number"
                  name="quoteNumber"
                  value={formData.quoteNumber}
                  onChange={handleChange}
                  required
                  placeholder="QT-001"
                />
                <InputField
                  icon={Calendar}
                  label="Issue Date"
                  name="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={handleChange}
                  required
                />
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                      <Tag className="h-5 w-5" />
                    </div>
                    <select
                      name="status"
                      value={formData.status || 'Draft'}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none appearance-none font-medium ${statusConfig[formData.status]?.color || statusConfig.Draft.color}`}
                    >
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.icon} {key}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Company & Client */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="h-1 w-1 bg-emerald-500 rounded-full"></div>
                Company & Client
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectField
                  icon={Building2}
                  label="Company"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  required
                  placeholder="Select a company"
                  options={companies.map(c => ({ value: c.id, label: c.name }))}
                />
                <SelectField
                  icon={User}
                  label="Client"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  required
                  placeholder="Select a client"
                  options={clients.map(c => ({ value: c.id, label: c.name }))}
                />
                <SelectField
                  icon={DollarSign}
                  label="Currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  options={[
                    { value: 'USD', label: 'USD - US Dollar' },
                    { value: 'EUR', label: 'EUR - Euro' },
                    { value: 'GBP', label: 'GBP - British Pound' },
                    { value: 'CAD', label: 'CAD - Canadian Dollar' },
                    { value: 'AUD', label: 'AUD - Australian Dollar' },
                  ]}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Enter a brief description of this quote..."
              />
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="h-1 w-1 bg-emerald-500 rounded-full"></div>
                  Line Items
                  <span className="text-sm font-normal text-gray-500">({formData.items.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              </div>

              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                {formData.items.length === 0 ? (
                  <div className="p-12 text-center bg-gray-50">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-white rounded-xl shadow-sm">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">No items added yet</p>
                    <button
                      type="button"
                      onClick={addItem}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                      <Plus className="h-5 w-5" />
                      Add Your First Item
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">Qty</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Unit Price</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Total</th>
                          <th className="px-4 py-3 w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {formData.items.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                required
                                placeholder="Item description..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                min="1"
                                step="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                                <input
                                  type="number"
                                  value={item.unitPrice}
                                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                  min="0"
                                  step="0.01"
                                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-right font-semibold text-gray-900">
                                ${((parseFloat(item.unitPrice) || 0) * (parseFloat(item.quantity) || 0)).toFixed(2)}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Financial Summary
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">${calculateSubtotal().toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Discount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        name="discountAmount"
                        value={formData.discountAmount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Tax</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        name="taxAmount"
                        value={formData.taxAmount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t-2 border-gray-300 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-3xl font-bold text-emerald-600">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t-2 border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={loading || formData.items.length === 0 || !formData.clientId}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {quote ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    {quote ? 'Update Quote' : 'Create Quote'}
                  </>
                )}
              </button>

              <button
                onClick={onCancel}
                disabled={loading}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
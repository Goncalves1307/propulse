import { useState } from 'react';
import { ArrowLeft, User, Building2, Mail, Phone, MapPin, Globe, FileText, Hash, Save, X, Briefcase } from 'lucide-react';
import API from '../../api/axios';

const InputField = ({ icon: Icon, label, name, type = 'text', value, onChange, required = false, placeholder, colSpan = 1 }) => (
  <div className={`group ${colSpan === 2 ? 'md:col-span-2' : ''}`}>
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

const TextAreaField = ({ icon: Icon, label, name, value, onChange, placeholder, rows = 4 }) => (
  <div className="group">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
      />
    </div>
  </div>
);

const SelectField = ({ icon: Icon, label, name, value, onChange, options, placeholder, required = false }) => (
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
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default function ClientForm({ userId, client, companies, onSuccess, onCancel , selectedCompany }) {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    legalName: client?.legalName || '',
    email: client?.email || '',
    phone: client?.phone || '',
    companyId: client?.companyId || selectedCompany?.id || '',
    address: client?.address || '',
    city: client?.city || '',
    state: client?.state || '',
    zipCode: client?.zipCode || '',
    country: client?.country || '',
    taxId: client?.taxId || '',
    notes: client?.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const prettifyField = (field) => {
  return field
    .replace(/_/g, " ")         // troca underscores por espaços
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitaliza cada palavra
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.companyId) {
      setError("Please select a company before saving the client.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        userId,
      };

      if (client?.id) {
        await API.put(`/client/${formData.companyId}/client/${client.id}`, payload);
        console.log('Update client:', payload);
      } else {
        await API.post(`/client/${formData.companyId}/create`, payload);
        console.log('Create client:', payload);
      }
      onSuccess();
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      let message = 'Failed to save client. Please try again.';

      if (status === 422 && data?.fields && typeof data.fields === 'object') {
        const lines = Object.entries(data.fields).map(([field, msgs]) => {
          const text = Array.isArray(msgs) ? msgs.join(', ') : String(msgs);
          return `${prettifyField(field)}: ${text}`;
        });
        message = lines.join('\n');
      }else if (data?.message) {
        message = data.message;
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
      console.error('Error saving client:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Back to Clients</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <User className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {client ? 'Edit Client' : 'Create New Client'}
                </h2>
                <p className="text-emerald-50 text-sm mt-1">
                  {client ? 'Update client information' : 'Add a new client to your portfolio'}
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
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  icon={User}
                  label="Client Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
                <InputField
                  icon={Briefcase}
                  label="Legal Name"
                  name="legalName"
                  value={formData.legalName}
                  onChange={handleChange}
                  placeholder="Johnathan Doe LLC"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="h-1 w-1 bg-emerald-500 rounded-full"></div>
                Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  icon={Mail}
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
                <InputField
                  icon={Phone}
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
                <div className="md:col-span-2">
                  <SelectField
                    icon={Building2}
                    label="Associated Company"
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    options={companies}
                    placeholder="Select a company"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="h-1 w-1 bg-emerald-500 rounded-full"></div>
                Address
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <InputField
                  icon={MapPin}
                  label="Street Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  colSpan={2}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField
                    icon={MapPin}
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                  />
                  <InputField
                    icon={MapPin}
                    label="State / Province"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="NY"
                  />
                  <InputField
                    icon={MapPin}
                    label="Zip / Postal Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="10001"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    icon={Globe}
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="United States"
                  />
                  <InputField
                    icon={Hash}
                    label="Tax ID / VAT Number"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    placeholder="123456789"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="h-1 w-1 bg-emerald-500 rounded-full"></div>
                Additional Information
              </h3>
              <TextAreaField
                icon={FileText}
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes about this client..."
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t-2 border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.name || !formData.email}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {client ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    {client ? 'Update Client' : 'Create Client'}
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
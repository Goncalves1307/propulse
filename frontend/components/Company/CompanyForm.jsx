import { useState, useEffect } from 'react';
import { Building2, Save, X, MapPin, Mail, Phone, Globe, Hash } from 'lucide-react';
import API from '../../api/axios';

const InputField = ({ icon: Icon, label, name, type = 'text', required = false, placeholder, value, onChange }) => (
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
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
      />
    </div>
  </div>
);

export default function CompanyForm({ userId, company, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    tax_id: '',
  });

  const prettifyField = (field) => {
  return field
    .replace(/_/g, " ")         // troca underscores por espaços
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitaliza cada palavra
};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        address: company.address || '',
        city: company.city || '',
        postal_code: company.postalCode || '',
        country: company.country || '',
        phone: company.phone || '',
        email: company.email || '',
        website: company.website || '',
        tax_id: company.taxId || '',
      });
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setError('Company name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postal_code,
        country: formData.country,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        taxId: formData.tax_id,
      };


      if (company) {
        await API.put(`/company/${company.id}`, payload);
        console.log('Update:', payload);
      } else {
        await API.post('/company/create', payload);
        console.log('Create:', payload);
      }

      setSuccess(true);
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      let message = 'Failed to save company';

      if (status === 422 && data?.fields && typeof data.fields === 'object') {
        const lines = Object.entries(data.fields).map(([field, msgs]) => {
          const text = Array.isArray(msgs) ? msgs.join(', ') : String(msgs);
          return `${prettifyField(field)}: ${text}`;
        });

        message = lines.join('\n');
      } else if (data?.message) {
        message = data.message;
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
      console.error('Error saving company:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {company ? 'Edit Company' : 'Create New Company'}
                </h2>
                <p className="text-emerald-50 text-sm mt-1">
                  {company ? 'Update your company information' : 'Add a new company to your portfolio'}
                </p>
              </div>
            </div>
            {onCancel && (
              <button 
                onClick={onCancel} 
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-sm text-red-700 font-medium whitespace-pre-line">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg">
              <p className="text-sm text-emerald-700 font-medium">✓ Company saved successfully!</p>
            </div>
          )}

          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="h-1 w-1 bg-emerald-500 rounded-full"></div>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <InputField
                  icon={Building2}
                  label="Company Name"
                  name="name"
                  required
                  placeholder="e.g., Acme Corporation"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="h-1 w-1 bg-emerald-500 rounded-full"></div>
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <InputField
                    icon={MapPin}
                    label="Street Address"
                    name="address"
                    placeholder="123 Business Street"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <InputField
                  icon={MapPin}
                  label="City"
                  name="city"
                  placeholder="San Francisco"
                  value={formData.city}
                  onChange={handleChange}
                />
                <InputField
                  icon={MapPin}
                  label="Postal Code"
                  name="postal_code"
                  placeholder="94102"
                  value={formData.postal_code}
                  onChange={handleChange}
                />
                <div className="md:col-span-2">
                  <InputField
                    icon={Globe}
                    label="Country"
                    name="country"
                    placeholder="United States"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
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
                  icon={Phone}
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <InputField
                  icon={Mail}
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <InputField
                  icon={Globe}
                  label="Website"
                  name="website"
                  type="url"
                  placeholder="https://www.company.com"
                  value={formData.website}
                  onChange={handleChange}
                />
                <InputField
                  icon={Hash}
                  label="Tax ID / VAT Number"
                  name="tax_id"
                  placeholder="123-45-6789"
                  value={formData.tax_id}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.name}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {company ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    {company ? 'Update Company' : 'Create Company'}
                  </>
                )}
              </button>

              {onCancel && (
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  
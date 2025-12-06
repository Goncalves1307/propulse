import { useState, useEffect } from 'react';
import { Building2, Save, X } from 'lucide-react';
import API from '../.././api/axios';

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      } else {
        await API.post('/company/create', payload);
      }

      setSuccess(true);
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to save company';
      setError(message);
      console.error('Error saving company:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Building2 className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {company ? 'Edit Company' : 'Create New Company'}
            </h2>
          </div>
          {onCancel && (
            <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 transition">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-emerald-600">Company saved successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {["address","city","postal_code","country","phone","email","website","tax_id"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.replace("_", " ").toUpperCase()}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.name}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg disabled:bg-gray-300"
            >
              <Save className="h-5 w-5" />
              {loading ? (company ? 'Updating...' : 'Creating...') : (company ? 'Update Company' : 'Create Company')}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { User, Mail, Phone, Lock, Bell, Globe, Save, Camera, Building2, Shield, CreditCard } from 'lucide-react';

export default function Setting({ userId }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corporation',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    emailQuotes: true,
    emailInvoices: true,
    emailPayments: true,
    pushNotifications: false,
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'America/New_York',
    currency: 'USD',
    theme: 'light',
  });

  const handleSave = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Settings updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  const InputField = ({ icon: Icon, label, name, type = 'text', value, onChange, placeholder }) => (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
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
          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
        />
      </div>
    </div>
  );

  const ToggleSwitch = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-emerald-600' : 'bg-gray-200'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-xl">
          <p className="text-sm text-emerald-700 font-medium">✓ {success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {activeTab === 'profile' && (
              <div>
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  <p className="text-emerald-50 text-sm mt-1">Update your personal information</p>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-100 hover:bg-gray-50 transition-colors">
                        <Camera className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Profile Photo</h3>
                      <p className="text-sm text-gray-600 mt-1">JPG, PNG or GIF. Max size 2MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField icon={User} label="Full Name" name="name" value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} placeholder="John Doe" />
                    <InputField icon={Mail} label="Email" name="email" type="email" value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} placeholder="john@example.com" />
                    <InputField icon={Phone} label="Phone" name="phone" type="tel" value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} placeholder="+1 (555) 123-4567" />
                    <InputField icon={Building2} label="Company" name="company" value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })} placeholder="Acme Corp" />
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <button onClick={handleSave} disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 transition-all">
                      {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="h-5 w-5" />}
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white">Security Settings</h2>
                  <p className="text-purple-50 text-sm mt-1">Manage your password and security</p>
                </div>
                <div className="p-8 space-y-6">
                  <InputField icon={Lock} label="Current Password" name="currentPassword" type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Enter current password" />
                  <InputField icon={Lock} label="New Password" name="newPassword" type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Enter new password" />
                  <InputField icon={Lock} label="Confirm Password" name="confirmPassword" type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password" />

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-900 font-medium">Password requirements:</p>
                    <ul className="text-xs text-blue-700 mt-2 space-y-1 ml-4">
                      <li>• At least 8 characters</li>
                      <li>• One uppercase letter</li>
                      <li>• One number</li>
                    </ul>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <button onClick={handleSave} disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                      {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="h-5 w-5" />}
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white">Notifications</h2>
                  <p className="text-blue-50 text-sm mt-1">Choose what you receive</p>
                </div>
                <div className="p-8 space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <ToggleSwitch label="New Quotes" description="Notifications for new quotes"
                      checked={notifications.emailQuotes}
                      onChange={(val) => setNotifications({ ...notifications, emailQuotes: val })} />
                    <ToggleSwitch label="New Invoices" description="Notifications for invoices"
                      checked={notifications.emailInvoices}
                      onChange={(val) => setNotifications({ ...notifications, emailInvoices: val })} />
                    <ToggleSwitch label="Payments" description="Payment status updates"
                      checked={notifications.emailPayments}
                      onChange={(val) => setNotifications({ ...notifications, emailPayments: val })} />
                    <ToggleSwitch label="Push Notifications" description="Mobile notifications"
                      checked={notifications.pushNotifications}
                      onChange={(val) => setNotifications({ ...notifications, pushNotifications: val })} />
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <button onClick={handleSave} disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                      {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="h-5 w-5" />}
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div>
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white">Preferences</h2>
                  <p className="text-orange-50 text-sm mt-1">Customize your experience</p>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select value={preferences.language} onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="pt">Português</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select value={preferences.currency} onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <button onClick={handleSave} disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                      {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="h-5 w-5" />}
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
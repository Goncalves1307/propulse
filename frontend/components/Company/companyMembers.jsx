import { useEffect, useState } from "react";
import { Users, Mail, Shield, UserPlus, Trash2, Crown, User } from "lucide-react";
import API from "../../api/axios";

const roles = [
  { value: "USER", label: "User", icon: User, color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "ADMIN", label: "Admin", icon: Crown, color: "bg-purple-100 text-purple-700 border-purple-200" },
];

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(email) {
  const colors = [
    'bg-gradient-to-br from-emerald-400 to-teal-500',
    'bg-gradient-to-br from-blue-400 to-indigo-500',
    'bg-gradient-to-br from-purple-400 to-pink-500',
    'bg-gradient-to-br from-orange-400 to-red-500',
    'bg-gradient-to-br from-yellow-400 to-orange-500',
  ];
  const index = (email?.charCodeAt(0) || 0) % colors.length;
  return colors[index];
}

function SkeletonMember() {
  return (
    <div className="flex items-center justify-between p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-3 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
    </div>
  );
}

export default function CompanyMembers({ companyId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("USER");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);

  const fetchMembers = async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      const res = await API.get(`/company/${companyId}/members`);
      setMembers(res.data.items || []);
      setError(null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load members"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [companyId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formEmail) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await API.post(`/company/${companyId}/members`, {
        email: formEmail,
        role: formRole,
      });

      setFormEmail("");
      setFormRole("USER");
      setSuccess("Member added successfully");
      fetchMembers();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to add member"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (userId) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      await API.delete(`/company/${companyId}/members/${userId}`);
      setMembers(prev => prev.filter(m => m.userId !== userId));
      setSuccess("Member removed successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to remove member"
      );
    }
  };

  const getRoleConfig = (role) => {
    return roles.find(r => r.value === role) || roles[0];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Team Members</h1>
        <p className="text-gray-600">Manage who has access to this company</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-xl">
          <p className="text-sm text-emerald-700 font-medium">✓ {success}</p>
        </div>
      )}

      {/* Add Member Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">Add Collaborator</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Email Input */}
            <div className="flex-1 group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={formEmail}
                  onChange={(e) => {
                    setFormEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
                />
              </div>
            </div>

            {/* Role Select */}
            <div className="w-full md:w-48 group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                  <Shield className="h-5 w-5" />
                </div>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                onClick={handleAdd}
                disabled={saving || !formEmail}
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Add Member
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                {!loading && (
                  <p className="text-sm text-gray-600">{members.length} {members.length === 1 ? 'member' : 'members'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              <SkeletonMember />
              <SkeletonMember />
              <SkeletonMember />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No members yet
              </h3>
              <p className="text-gray-600">
                Add your first team member using the form above
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => {
                const roleConfig = getRoleConfig(member.role);
                const RoleIcon = roleConfig.icon;
                
                return (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-full ${getAvatarColor(member.email)} flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        {getInitials(member.name)}
                      </div>

                      {/* Member Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {member.email}
                        </p>
                        {member.phone && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {member.phone}
                          </p>
                        )}
                      </div>

                      {/* Role Badge */}
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${roleConfig.color}`}>
                        <RoleIcon className="h-3.5 w-3.5" />
                        {roleConfig.label}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(member.userId)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Role Permissions
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• <strong>Admin:</strong> Full access to manage company, members, and all data</li>
              <li>• <strong>User:</strong> Can view and manage clients, quotes, and invoices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
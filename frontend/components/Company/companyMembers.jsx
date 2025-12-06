import { useEffect, useState } from "react";
import API from "../../api/axios";

const roles = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
];

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add Collaborator</h2>

        {error && (
          <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded border border-emerald-200 bg-emerald-50 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3">
          <input
            type="email"
            placeholder="user@example.com"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <select
            value={formRole}
            onChange={(e) => setFormRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add"}
          </button>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Collaborators</h2>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : members.length === 0 ? (
          <p className="text-sm text-gray-500">No collaborators yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {members.map((m) => (
              <li key={m.userId} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.email}</p>
                  {m.phone && (
                    <p className="text-xs text-gray-400 mt-0.5">{m.phone}</p>
                  )}
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {m.role}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
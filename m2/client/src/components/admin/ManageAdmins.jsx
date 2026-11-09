import { useEffect, useState } from "react";
import {
  getAdmins,
  createAdmin,
  updateAdminPermissions,
  deleteAdmin,
} from "../../services/adminService";

const availablePermissions = [
  { value: "owner.view", label: "View Owner Requests" },
  { value: "owner.approve", label: "Approve Owners" },
  { value: "owner.reject", label: "Reject Owners" },
];

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [permissionsMap, setPermissionsMap] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  // Fetch admins
  async function fetchAdmins() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdmins();

      setAdmins(data);

      const initialPermissions = {};

      data.forEach((admin) => {
        initialPermissions[admin._id] = admin.permissions || [];
      });

      setPermissionsMap(initialPermissions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Form input change
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // Create Admin
  async function handleCreateAdmin(e) {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      await createAdmin(formData);

      setMessage("Admin created successfully!");

      setFormData({
        username: "",
        email: "",
        phone: "",
        password: "",
      });
      setIsFormOpen(false);
      await fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  }

  // Permission checkbox change
  function handlePermissionChange(adminId, permission) {
    setPermissionsMap((prev) => {
      const currentPermissions = prev[adminId] || [];

      const updatedPermissions = currentPermissions.includes(permission)
        ? currentPermissions.filter((item) => item !== permission)
        : [...currentPermissions, permission];

      return {
        ...prev,
        [adminId]: updatedPermissions,
      };
    });
  }

  // Save Permissions
  async function handleSavePermissions(adminId) {
    try {
      setError("");
      setMessage("");

      await updateAdminPermissions(adminId, permissionsMap[adminId] || []);

      setMessage("Permissions updated successfully!");

      await fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete Admin
  async function handleDeleteAdmin(adminId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this admin?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteAdmin(adminId);

      setMessage("Admin deleted successfully!");

      await fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="p-6 md:p-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Manage Admins</h2>
          <p className="mt-2 text-gray-500">
            Create admins and manage their permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          {isFormOpen ? "− Close Form" : "+ Create New Admin"}
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-5 rounded-lg bg-green-100 p-4 text-green-700">
          {message}
        </div>
      )}

      {/* Create Admin Form */}
      {isFormOpen && (
        <section className="mb-10 rounded-xl bg-white p-6 shadow">
          <h3 className="mb-5 text-xl font-semibold text-gray-800">
            Create New Admin
          </h3>

          <form
            onSubmit={handleCreateAdmin}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-orange-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-orange-500"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-orange-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-orange-500"
            />

            <button
              type="submit"
              className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 md:col-span-3"
            >
              Create Admin
            </button>
          </form>
        </section>
      )}
      {/* Admin List */}
      <section>
        <h3 className="mb-5 text-xl font-semibold text-gray-800">
          Existing Admins
        </h3>

        {loading ? (
          <p className="text-gray-500">Loading admins...</p>
        ) : admins.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-gray-500 shadow">
            No admins found.
          </div>
        ) : (
          <div className="space-y-6">
            {admins.map((admin) => (
              <div
                key={admin._id}
                className="rounded-xl bg-white p-6 shadow"
              >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">
                      {admin.username}
                    </h4>

                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteAdmin(admin._id)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                  >
                    Delete Admin
                  </button>
                </div>

                <div className="mb-5">
                  <h5 className="mb-3 font-semibold text-gray-700">
                    Permissions
                  </h5>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {availablePermissions.map((permission) => (
                      <label
                        key={permission.value}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border p-3"
                      >
                        <input
                          type="checkbox"
                          checked={(permissionsMap[admin._id] || []).includes(
                            permission.value,
                          )}
                          onChange={() =>
                            handlePermissionChange(admin._id, permission.value)
                          }
                          className="h-4 w-4 accent-orange-500"
                        />

                        <span className="text-sm text-gray-700">
                          {permission.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSavePermissions(admin._id)}
                  className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Save Permissions
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

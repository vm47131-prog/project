import { useEffect, useState } from "react";
import {
  getPendingOwners,
  approveOwner,
  rejectOwner,
} from "../../services/adminService";

export default function OwnerRequests() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [rejectingOwnerId, setRejectingOwnerId] = useState(null);
  const [reason, setReason] = useState("");

  // Fetch pending owners
  async function fetchOwners() {
    try {
      setLoading(true);
      setError("");

      const pendingOwners = await getPendingOwners();
      setOwners(pendingOwners);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOwners();
  }, []);

  // Approve owner
  async function handleApprove(ownerId) {
    try {
      setError("");
      setMessage("");

      const data = await approveOwner(ownerId);

      setMessage(data.message);
      setOwners((prevOwners) =>
        prevOwners.filter((owner) => owner._id !== ownerId),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  // Reject owner
  async function handleReject(ownerId) {
    if (!reason.trim()) {
      setError("Please enter a rejection reason.");
      return;
    }

    try {
      setError("");
      setMessage("");

      const data = await rejectOwner(ownerId, reason);

      setMessage(data.message);

      setOwners((prevOwners) =>
        prevOwners.filter((owner) => owner._id !== ownerId),
      );

      setRejectingOwnerId(null);
      setReason("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-10">
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Owner Requests
          </h1>

          <p className="mt-2 text-gray-500">
            Review and manage restaurant owner applications.
          </p>
        </div>

        <button
          onClick={fetchOwners}
          className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
        >
          Refresh
        </button>
      </div>

      {/* Success Message */}
      {message && (
        <div className="mb-5 rounded-lg bg-green-100 p-4 text-green-700">
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-10 text-center text-gray-500">
          Loading owner requests...
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && owners.length === 0 && (
        <div className="rounded-xl bg-white p-10 text-center shadow">
          <h2 className="text-xl font-semibold text-gray-700">
            No Pending Owner Requests
          </h2>

          <p className="mt-2 text-gray-500">
            All restaurant owner applications have been reviewed.
          </p>
        </div>
      )}

      {/* Owner Cards */}
      {!loading && owners.length > 0 && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {owners.map((owner) => (
            <div
              key={owner._id}
              className="rounded-xl bg-white p-5 shadow transition hover:shadow-md"
            >
              {/* Owner Information */}
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                  {owner.username}
                </h2>

                <p className="mt-2 break-all text-gray-600">{owner.email}</p>

                <p className="mt-1 text-gray-600">{owner.phone}</p>

                <span className="mt-3 inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                  {owner.ownerStatus}
                </span>
              </div>

              {/* Action Buttons */}
              {rejectingOwnerId !== owner._id ? (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleApprove(owner._id)}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => {
                      setRejectingOwnerId(owner._id);
                      setReason("");
                      setError("");
                    }}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-orange-500"
                  />

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleReject(owner._id)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Confirm Reject
                    </button>

                    <button
                      onClick={() => {
                        setRejectingOwnerId(null);
                        setReason("");
                        setError("");
                      }}
                      className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AllPoliciesModal({ onClose }) {
  const [policies, setPolicies] = useState([]);
  const [editingPolicyId, setEditingPolicyId] = useState(null);
  const [editedPolicies, setEditedPolicies] = useState({});

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get('http://localhost:4000/admin/policies/all');
        setPolicies(response.data);
        // Prepare editedPolicies state
        const initialEditState = response.data.reduce((acc, policy) => ({
          ...acc,
          [policy.policyId]: { ...policy }
        }), {});
        setEditedPolicies(initialEditState);
      } catch (error) {
        console.error('Failed to fetch policies:', error);
      }
    };
    fetchPolicies();
  }, []);

  const handleEditChange = (policyId, field, value) => {
    setEditedPolicies(prev => ({
      ...prev,
      [policyId]: {
        ...prev[policyId],
        [field]: value
      }
    }));
  };

  const handleUpdate = async (policyId) => {
    if (editingPolicyId === policyId) {
      // Submit updated policy
      try {
        await axios.patch(`http://localhost:4000/admin/policies/${policyId}`, editedPolicies[policyId]);
        setPolicies(prev => prev.map(policy => policy.policyId === policyId ? editedPolicies[policyId] : policy));
        setEditingPolicyId(null); // Exit editing mode
      } catch (error) {
        console.error('Failed to update policy:', error);
      }
    } else {
      // Enter editing mode
      setEditingPolicyId(policyId);
    }
  };

  const handleDelete = async (policyId) => {
    try {
      await axios.delete(`http://localhost:4000/admin/policies/${policyId}`);
      setPolicies(prev => prev.filter(policy => policy.policyId !== policyId));
    } catch (error) {
      console.error('Failed to delete policy:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
        <h2 className="text-xl font-semibold text-center mb-4">All Policies</h2>
        {policies.length > 0 ? (
          <div className="space-y-4">
            {policies.map((policy) => (
              <div key={policy.policyId} className="p-3 shadow rounded bg-white flex justify-between items-center">
                <div>
                  {editingPolicyId === policy.policyId ? (
                    <>
                      {/* Editable Provider Field */}
                      <div className="mb-2">
                        <label className="block font-medium text-gray-700">Provider:</label>
                        <input
                          type="text"
                          value={editedPolicies[policy.policyId].provider}
                          onChange={(e) => handleEditChange(policy.policyId, 'provider', e.target.value)}
                          className="border-2 border-gray-300 rounded p-1 w-full"
                        />
                      </div>

                      {/* Editable Coverage Amount Field */}
                      <div className="mb-2">
                        <label className="block font-medium text-gray-700">Coverage Amount:</label>
                        <input
                          type="number"
                          value={editedPolicies[policy.policyId].coverageAmt}
                          onChange={(e) => handleEditChange(policy.policyId, 'coverageAmt', e.target.value)}
                          className="border-2 border-gray-300 rounded p-1 w-full"
                        />
                      </div>

                      {/* Editable Premium Field */}
                      <div className="mb-2">
                        <label className="block font-medium text-gray-700">Premium:</label>
                        <input
                          type="number"
                          value={editedPolicies[policy.policyId].premium}
                          onChange={(e) => handleEditChange(policy.policyId, 'premium', e.target.value)}
                          className="border-2 border-gray-300 rounded p-1 w-full"
                        />
                      </div>

                      {/* Editable Tenure Field */}
                      <div className="mb-2">
                        <label className="block font-medium text-gray-700">Tenure:</label>
                        <input
                          type="number"
                          value={editedPolicies[policy.policyId].tenure}
                          onChange={(e) => handleEditChange(policy.policyId, 'tenure', e.target.value)}
                          className="border-2 border-gray-300 rounded p-1 w-full"
                        />
                      </div>
                      {/* Repeat for other fields, making sure to include appropriate className for styling */}
                    </>
                  ) : (
                    <>
                      <div>Policy ID: {policy.policyId}</div>
                      <div>Provider: {policy.provider}</div>
                      <div>Coverage Amount: {policy.coverageAmt}</div>
                      <div>Premium: {policy.premium}</div>
                      <div>Tenure: {policy.tenure}</div>
                    </>
                  )}
                </div>
                <div className="flex">
                  <button onClick={() => handleUpdate(policy.policyId)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l mr-2">
                    {editingPolicyId === policy.policyId ? 'Submit' : 'Update'}
                  </button>
                  <button onClick={() => handleDelete(policy.policyId)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-r">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No policies to display.</p>
        )}
        <div className="flex justify-center mt-4">
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllPoliciesModal;
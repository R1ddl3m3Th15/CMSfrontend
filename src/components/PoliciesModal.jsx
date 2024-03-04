import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PoliciesModal({ onClose, userId }) {
  const [policies, setPolicies] = useState([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [submitResponse, setSubmitResponse] = useState('');

  useEffect(() => {
    axios.get('https://bffcms.onrender.com/user/policies/all')
      .then(response => {
        setPolicies(response.data); // Adjust if your data structure is different
      })
      .catch(error => {
        console.error('Error fetching policies:', error);
      });
  }, []);

  const handlePolicySelect = (policyId) => {
    // If the same policy is clicked again, deselect it, otherwise select the new one
    setSelectedPolicyId(selectedPolicyId === policyId ? null : policyId);
    setSubmitResponse(''); // Clear previous submit response
  };

  const handleSubmit = () => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    // Only proceed if a policy has been selected
    if (!selectedPolicyId) return;

    const postData = {
      policyId: selectedPolicyId,
      userId, // This should be the ID of the currently logged-in user
    };

    axios.post('https://bffcms.onrender.com/user/policies/select', postData)
      .then(response => {
        setSubmitResponse(response.data.message); // Assuming the response contains a message
      })
      .catch(error => {
        setSubmitResponse('Failed to select policy: ' + (error.response?.data.message || error.message));
      });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Policies</h3>
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Select
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Coverage Amount
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Premium
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tenure (Years)
                  </th>
                </tr>
              </thead>
              <tbody>
  {policies.map(policy => (
    <tr key={policy.policyId} className={`cursor-pointer ${selectedPolicyId === policy.policyId ? 'bg-green-200' : 'hover:bg-green-100'}`}>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <input
          type="checkbox"
          checked={selectedPolicyId === policy.policyId}
          onChange={() => handlePolicySelect(policy.policyId)}
          className="form-checkbox h-4 w-4 text-green-600"
        />
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {policy.provider}
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {policy.category}
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {policy.coverageAmt.toLocaleString()}
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {policy.premium.toLocaleString()}
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {policy.tenure}
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
          {submitResponse && <div className="text-center text-green-600">{submitResponse}</div>}
          <div className="mt-4">
            <button
              onClick={handleSubmit} // Call the handleSubmit function when the button is clicked
              disabled={!selectedPolicyId}
              className={`px-4 py-2 text-white text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${selectedPolicyId ? 'bg-green-600 hover:bg-green-700' : 'bg-green-300'}`}
            >
              Submit
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 ml-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PoliciesModal;